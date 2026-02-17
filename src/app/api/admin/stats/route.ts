import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_token")?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const [total, inProgress, frozen, submitted] = await Promise.all([
    supabase.from("applications").select("id", { count: "exact", head: true }),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "frozen"),
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "submitted"),
  ]);

  return NextResponse.json({
    total: total.count || 0,
    inProgress: inProgress.count || 0,
    frozen: frozen.count || 0,
    submitted: submitted.count || 0,
  });
}
