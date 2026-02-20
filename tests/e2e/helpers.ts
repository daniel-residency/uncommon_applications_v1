import { Page } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

/** Generate a unique email for test isolation */
export function uniqueEmail() {
  return `e2e+${Date.now()}+${Math.random().toString(36).slice(2, 7)}@test.residency.app`;
}

/** Create an application via the API */
export async function createApp(email: string) {
  const res = await fetch(`${BASE}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

/** Update an application via the API */
export async function updateApp(id: string, updates: Record<string, unknown>) {
  const res = await fetch(`${BASE}/api/applications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  return res.json();
}

/** Fetch all active homes from the API */
export async function getHomes() {
  const res = await fetch(`${BASE}/api/homes`);
  return res.json();
}

/** Trigger AI matching for a frozen application */
export async function triggerMatch(applicationId: string) {
  const res = await fetch(`${BASE}/api/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId }),
  });
  return res.json();
}

/** Complete set of answers that satisfies all required fields */
export const FULL_ANSWERS: Record<string, string> = {
  citizenship: "United States",
  locations: "San Francisco, CA|New York, NY",
  accomplishments: "Built a distributed systems startup that scaled to 10k users. Published research on graph algorithms.",
  pitch: "AI-powered code review for teams",
  details: "We use static analysis combined with LLMs to find bugs before they ship. Currently in beta with 50 teams.",
  project_link: "https://example.com/demo",
  demo_video: "https://example.com/demo",
  why_this: "I spent 5 years as a senior engineer watching teams ship bugs that automated tooling could catch.",
  how_know_needed: "50 beta teams, 3 paying customers, and a waitlist of 200. Engineers tell us they catch 2-3 bugs per PR.",
  how_far: "Working beta product with 50 active teams. Core analysis engine is solid, UX needs polish.",
  duration: "Full-time for 8 months. Part-time research for a year before that.",
  has_users: "yes",
  user_count: "about 50 teams",
  has_revenue: "yes",
  revenue_amount: "roughly $5k MRR",
  competitors: "Snyk and CodeClimate do static analysis. GitHub Copilot does AI code suggestions. Nobody combines both.",
  unique_insight: "Static analysis rules are too rigid, pure LLMs hallucinate. The sweet spot is LLMs guided by AST constraints.",
  what_need: "A community of technical founders to pressure-test our go-to-market strategy and early enterprise sales approach.",
  how_helps: "Access to founders who've done enterprise sales, plus a focused environment to ship our v2 in 12 weeks.",
  looking_cofounder: "no",
  has_investment: "yes",
  focus_area: "building",
  accelerators: "Y Combinator W24 batch",
  had_roommates: "yes",
  applied_before: "no",
  what_convinced: "A friend who was in the last cohort said it changed how they think about building. That was enough.",
  how_heard: "word_of_mouth",
};

/** Navigate to /apply, enter email, wait for form to load */
export async function enterEmail(page: Page, email: string) {
  await page.goto("/apply", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[type="email"]', { timeout: 30000 });
  await page.fill('input[type="email"]', email);
  await page.click('button[type="submit"]');
  // Wait for form to become interactive (email field goes away)
  await page.waitForFunction(
    () => !document.querySelector('input[type="email"]'),
    { timeout: 30000 }
  );
  await page.waitForTimeout(500);
}

/** Create an app with all answers filled via API, ready for freeze */
export async function createFilledApp(email: string) {
  const app = await createApp(email);
  await updateApp(app.id, { answers: FULL_ANSWERS });
  return app;
}

/** Create a frozen app with matched homes via API (no Claude call) */
export async function createMatchedApp(email: string) {
  const app = await createFilledApp(email);
  await updateApp(app.id, { status: "frozen", frozen_at: new Date().toISOString() });
  const homes = await getHomes();
  const homeIds = homes.slice(0, 3).map((h: { id: string }) => h.id);
  await updateApp(app.id, { matched_home_ids: homeIds });
  return { app, homeIds };
}

/** Set localStorage application_id and navigate to a page */
export async function setupWithAppId(page: Page, appId: string, path: string) {
  await page.goto("/apply", { waitUntil: "domcontentloaded" });
  await page.evaluate((id) => localStorage.setItem("application_id", id), appId);
  await page.goto(path, { waitUntil: "domcontentloaded" });
}
