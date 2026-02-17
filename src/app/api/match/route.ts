import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAnthropicClient } from "@/lib/anthropic";
import { Home, Application, MatchResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  const body = await request.json();
  const { applicationId } = body;

  if (!applicationId) {
    return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
  }

  // Get application
  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const app = application as Application;

  if (app.status !== "frozen") {
    return NextResponse.json({ error: "Application must be frozen first" }, { status: 400 });
  }

  // Already matched
  if (app.matched_home_ids?.length) {
    return NextResponse.json({ matched_home_ids: app.matched_home_ids });
  }

  // Get all active homes
  const { data: homes, error: homesError } = await supabase
    .from("homes")
    .select("*")
    .eq("active", true)
    .order("display_order");

  if (homesError || !homes?.length) {
    return NextResponse.json({ error: "No homes available" }, { status: 500 });
  }

  const homesList = homes as Home[];

  // Build prompt for Claude
  const answersText = Object.entries(app.answers)
    .filter(([key]) => !key.startsWith("home_"))
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const homesPrompt = homesList
    .map(
      (h) =>
        `Home ID: ${h.id}\nHome Name: ${h.name}\nLocation: ${h.location}\nMatching Criteria: ${h.matching_prompt}`
    )
    .join("\n\n---\n\n");

  const systemPrompt = `You are an AI matching system for a residency program. You will be given an applicant's answers and descriptions of available homes. Your job is to rank the top 3 homes that would be the best fit for this applicant.

Consider the applicant's project, background, interests, work style, and goals. Match them with homes whose culture, focus, and community would help them thrive.

Return ONLY a valid JSON array of exactly 3 objects with "homeId" (the UUID) and "rank" (1=best, 2=second, 3=third). No other text.

Example response:
[{"homeId":"uuid-1","rank":1},{"homeId":"uuid-2","rank":2},{"homeId":"uuid-3","rank":3}]`;

  const userPrompt = `## Applicant Answers:
${answersText}

## Available Homes:
${homesPrompt}

Return the top 3 best matching homes as a JSON array.`;

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 256,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response
    const rankings: MatchResult[] = JSON.parse(responseText.trim());

    if (!Array.isArray(rankings) || rankings.length < 3) {
      throw new Error("Invalid ranking response");
    }

    // Sort by rank and get top 3 home IDs
    const sortedIds = rankings
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3)
      .map((r) => r.homeId);

    // Validate IDs exist
    const validIds = sortedIds.filter((id) =>
      homesList.some((h) => h.id === id)
    );

    if (validIds.length < 3) {
      // Fallback: pick first 3 homes
      const fallbackIds = homesList.slice(0, 3).map((h) => h.id);
      validIds.push(...fallbackIds.filter((id) => !validIds.includes(id)));
    }

    const top3 = validIds.slice(0, 3);

    // Update application
    await supabase
      .from("applications")
      .update({ matched_home_ids: top3 })
      .eq("id", applicationId);

    return NextResponse.json({ matched_home_ids: top3 });
  } catch (err) {
    console.error("AI matching error:", err);

    // Fallback: random 3 homes
    const shuffled = [...homesList].sort(() => Math.random() - 0.5);
    const fallback = shuffled.slice(0, 3).map((h) => h.id);

    await supabase
      .from("applications")
      .update({ matched_home_ids: fallback })
      .eq("id", applicationId);

    return NextResponse.json({ matched_home_ids: fallback });
  }
}
