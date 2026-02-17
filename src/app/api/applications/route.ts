import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { emailSchema } from "@/lib/schemas";

// GET: Lookup by id or email
export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  if (id) {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }

  if (email) {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Missing id or email" }, { status: 400 });
}

// POST: Create new application
export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  const body = await request.json();

  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Check if exists
  const { data: existing } = await supabase
    .from("applications")
    .select("*")
    .eq("email", parsed.data.email)
    .single();

  if (existing) {
    return NextResponse.json(existing);
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({ email: parsed.data.email, answers: {}, status: "in_progress" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH: Update application
export async function PATCH(request: NextRequest) {
  const supabase = createAdminClient();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Check current status
  const { data: current } = await supabase
    .from("applications")
    .select("status")
    .eq("id", id)
    .single();

  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Allow home answers even when frozen, but not regular answers
  if (current.status === "frozen" && updates.answers) {
    // Only allow keys starting with "home_"
    const { data: existing } = await supabase
      .from("applications")
      .select("answers")
      .eq("id", id)
      .single();

    if (existing) {
      const existingAnswers = existing.answers as Record<string, string>;
      const newAnswers = updates.answers as Record<string, string>;

      // Merge: keep existing non-home answers, allow updates to home_ keys
      const merged: Record<string, string> = { ...existingAnswers };
      for (const [key, value] of Object.entries(newAnswers)) {
        if (key.startsWith("home_")) {
          merged[key] = value;
        }
      }
      updates.answers = merged;
    }
  } else if (current.status === "submitted") {
    return NextResponse.json({ error: "Application already submitted" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
