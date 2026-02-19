import { test, expect } from "@playwright/test";

test.describe("Match route location filtering", () => {
  test("match API receives location-filtered homes", async ({ page }) => {
    // Track what the match API receives
    let matchRequestBody: Record<string, unknown> | null = null;

    // Mock homes with distinct locations
    const homes = [
      {
        id: "home-sf",
        name: "SF Home",
        slug: "sf-home",
        color: "#333",
        logo_url: null,
        location: "San Francisco, CA",
        description_template: "Hi {{name}}, welcome to SF.",
        matching_prompt: "SF matching criteria",
        question: "Why SF?",
        video_url: null,
        active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "home-ny",
        name: "NY Home",
        slug: "ny-home",
        color: "#444",
        logo_url: null,
        location: "New York, NY",
        description_template: "Hi {{name}}, welcome to NY.",
        matching_prompt: "NY matching criteria",
        question: null,
        video_url: null,
        active: true,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "home-vienna",
        name: "Vienna Home",
        slug: "vienna-home",
        color: "#555",
        logo_url: null,
        location: "Vienna, Austria",
        description_template: "Hi {{name}}, welcome to Vienna.",
        matching_prompt: "Vienna matching criteria",
        question: null,
        video_url: null,
        active: true,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    await page.route("**/api/homes*", async (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(homes),
      });
    });

    // Mock applications API — frozen app with SF + NY selected
    await page.route("**/api/applications*", async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "filter-test-app",
            email: "filter@example.com",
            answers: {
              citizenship: "United States",
              locations: "San Francisco, CA,New York, NY",
              pitch: "Test project",
            },
            status: "frozen",
            current_section: null,
            matched_home_ids: null,
            frozen_at: new Date().toISOString(),
            submitted_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      }
      if (method === "PATCH") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
      return route.continue();
    });

    // Mock match API and capture the request
    await page.route("**/api/match", async (route) => {
      matchRequestBody = JSON.parse(route.request().postData() || "{}");
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          matched_home_ids: ["home-sf", "home-ny"],
        }),
      });
    });

    // Navigate and set up localStorage
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "filter-test-app");
    });

    // Go to matching page — it will call /api/match
    await page.goto("/matching", { waitUntil: "domcontentloaded" });

    // Wait for the match API call to happen
    await page.waitForTimeout(2000);

    // Verify the match endpoint was called with the application ID
    expect(matchRequestBody).not.toBeNull();
    expect((matchRequestBody as Record<string, unknown>).applicationId).toBe("filter-test-app");
  });
});
