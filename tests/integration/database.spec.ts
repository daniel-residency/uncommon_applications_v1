import { test, expect } from "@playwright/test";

/**
 * Integration tests against real Supabase.
 * These require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 * Skip if not configured.
 */
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const skip = !SUPABASE_URL || !SUPABASE_KEY;

async function supabaseRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.method === "POST" ? "return=representation" : "return=minimal",
      ...options.headers,
    },
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

test.describe("Database integration", () => {
  test.skip(skip, "Supabase credentials not configured");

  let testAppId: string;
  const testEmail = `test-${Date.now()}@integration.test`;

  test("can create an application", async () => {
    const [app] = await supabaseRequest("applications", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        answers: {},
        status: "in_progress",
      }),
    });
    expect(app.id).toBeTruthy();
    expect(app.email).toBe(testEmail);
    expect(app.status).toBe("in_progress");
    testAppId = app.id;
  });

  test("can read an application", async () => {
    const data = await supabaseRequest(`applications?id=eq.${testAppId}&select=*`);
    expect(data).toHaveLength(1);
    expect(data[0].email).toBe(testEmail);
  });

  test("can update application answers", async () => {
    await supabaseRequest(`applications?id=eq.${testAppId}`, {
      method: "PATCH",
      body: JSON.stringify({
        answers: { citizenship: "United States", pitch: "Test" },
      }),
    });

    const data = await supabaseRequest(`applications?id=eq.${testAppId}&select=answers`);
    expect(data[0].answers.citizenship).toBe("United States");
  });

  test("can freeze an application", async () => {
    await supabaseRequest(`applications?id=eq.${testAppId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "frozen",
        frozen_at: new Date().toISOString(),
      }),
    });

    const data = await supabaseRequest(`applications?id=eq.${testAppId}&select=status`);
    expect(data[0].status).toBe("frozen");
  });

  test("can write match results", async () => {
    const homes = await supabaseRequest("homes?active=eq.true&select=id&limit=3");
    const homeIds = homes.map((h: { id: string }) => h.id);

    await supabaseRequest(`applications?id=eq.${testAppId}`, {
      method: "PATCH",
      body: JSON.stringify({ matched_home_ids: homeIds }),
    });

    const data = await supabaseRequest(`applications?id=eq.${testAppId}&select=matched_home_ids`);
    expect(data[0].matched_home_ids).toHaveLength(3);
  });

  test("can submit an application", async () => {
    await supabaseRequest(`applications?id=eq.${testAppId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      }),
    });

    const data = await supabaseRequest(`applications?id=eq.${testAppId}&select=status,submitted_at`);
    expect(data[0].status).toBe("submitted");
    expect(data[0].submitted_at).toBeTruthy();
  });

  test("homes list returns active homes", async () => {
    const homes = await supabaseRequest("homes?active=eq.true&select=*&order=display_order");
    expect(homes.length).toBeGreaterThanOrEqual(10);
    expect(homes[0].name).toBeTruthy();
    expect(homes[0].matching_prompt).toBeTruthy();
  });

  test("cleanup: delete test application", async () => {
    await supabaseRequest(`applications?id=eq.${testAppId}`, {
      method: "DELETE",
    });
  });
});
