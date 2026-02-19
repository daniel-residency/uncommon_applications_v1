import { Page } from "@playwright/test";

/**
 * Mock the API routes for testing. Intercepts fetch calls to Supabase-backed APIs.
 */
export async function mockAPIs(page: Page) {
  // Mock application creation / lookup
  await page.route((url) => url.pathname === "/api/applications", async (route) => {
    const method = route.request().method();

    if (method === "POST") {
      const body = JSON.parse(route.request().postData() || "{}");
      const email = body.email || "test@example.com";

      // Check for special returning user emails
      if (email === "frozen@example.com") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "frozen-app-id",
            email,
            answers: { citizenship: "United States", pitch: "Test pitch" },
            status: "frozen",
            current_section: null,
            matched_home_ids: ["home-1", "home-2", "home-3"],
            frozen_at: new Date().toISOString(),
            submitted_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      }

      if (email === "submitted@example.com") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "submitted-app-id",
            email,
            answers: {},
            status: "submitted",
            current_section: null,
            matched_home_ids: ["home-1", "home-2", "home-3"],
            frozen_at: new Date().toISOString(),
            submitted_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      }

      if (email === "returning@example.com") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "returning-app-id",
            email,
            answers: {
              citizenship: "United States",
              locations: "New York, NY,Berkeley, CA",
              accomplishments: "Built a startup",
            },
            status: "in_progress",
            current_section: "the-project",
            matched_home_ids: null,
            frozen_at: null,
            submitted_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      }

      // New user
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: "test-app-id",
          email,
          answers: {},
          status: "in_progress",
          current_section: null,
          matched_home_ids: null,
          frozen_at: null,
          submitted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
    }

    if (method === "GET") {
      const url = new URL(route.request().url());
      const id = url.searchParams.get("id");

      // Handle different app IDs
      if (id === "frozen-app-id") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id,
            email: "frozen@example.com",
            answers: { citizenship: "United States" },
            status: "frozen",
            current_section: null,
            matched_home_ids: ["home-1", "home-2", "home-3"],
            frozen_at: new Date().toISOString(),
            submitted_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      }

      if (id === "submitted-app-id") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id,
            email: "submitted@example.com",
            answers: {},
            status: "submitted",
            current_section: null,
            matched_home_ids: ["home-1", "home-2", "home-3"],
            frozen_at: new Date().toISOString(),
            submitted_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      }

      if (id === "returning-app-id") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id,
            email: "returning@example.com",
            answers: {
              citizenship: "United States",
              locations: "New York, NY,Berkeley, CA",
              accomplishments: "Built a startup",
            },
            status: "in_progress",
            current_section: "the-project",
            matched_home_ids: null,
            frozen_at: null,
            submitted_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
      }

      // Default: in-progress app
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: id || "test-app-id",
          email: "test@example.com",
          answers: {},
          status: "in_progress",
          current_section: "about-you",
          matched_home_ids: null,
          frozen_at: null,
          submitted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
    }

    if (method === "PATCH") {
      const body = JSON.parse(route.request().postData() || "{}");
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...body,
          id: body.id || "test-app-id",
          email: "test@example.com",
          updated_at: new Date().toISOString(),
        }),
      });
    }

    return route.continue();
  });
}

export const MOCK_HOMES = [
  {
    id: "home-1",
    name: "Homebrew",
    slug: "homebrew",
    color: "#6B4C8C",
    logo_url: null,
    location: "New York, NY",
    description_template:
      "Hi {{name}},\n\nI liked what I saw in your application. I'm a home in New York for people who can't stop learning.",
    matching_prompt: "You are Homebrew...",
    question: null,
    video_url: null,
    active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "home-2",
    name: "The Inventors Residency",
    slug: "inventors",
    color: "#2D5A4A",
    logo_url: null,
    location: "San Francisco, CA",
    description_template:
      "Hi {{name}},\n\nYour application stood out to me. I'm a 12-week residency in the Mission.",
    matching_prompt: "You are The Inventors Residency...",
    question: "What's the thing you're building that keeps you up at night?",
    video_url: "/videos/inventors.mp4",
    active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "home-3",
    name: "Arcadia",
    slug: "arcadia",
    color: "#C17F3C",
    logo_url: null,
    location: "Berkeley, CA",
    description_template:
      "Hi {{name}},\n\nI think you'd do well here. I'm the biggest home in the network.",
    matching_prompt: "You are Arcadia...",
    question: "What's an idea you'd want to explore here?",
    video_url: null,
    active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function mockHomesAPI(page: Page) {
  await page.route("**/api/homes*", async (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_HOMES),
    });
  });
}

export async function mockMatchAPI(page: Page) {
  await page.route("**/api/match", async (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        matched_home_ids: ["home-1", "home-2", "home-3"],
      }),
    });
  });
}

export async function mockAdminAPI(page: Page) {
  await page.route("**/api/admin", async (route) => {
    const method = route.request().method();

    if (method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ authenticated: true }),
      });
    }

    if (method === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.route("**/api/admin/stats", async (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        total: 42,
        inProgress: 20,
        frozen: 12,
        submitted: 10,
      }),
    });
  });

  await page.route("**/api/admin/applications", async (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "test-app-id",
          email: "test@example.com",
          answers: { citizenship: "United States", pitch: "AI startup" },
          status: "submitted",
          current_section: null,
          matched_home_ids: ["home-1", "home-2", "home-3"],
          frozen_at: new Date().toISOString(),
          submitted_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "test-app-id-2",
          email: "user2@example.com",
          answers: { citizenship: "Canada" },
          status: "in_progress",
          current_section: "about-you",
          matched_home_ids: null,
          frozen_at: null,
          submitted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]),
    });
  });
}

/**
 * Setup a new user: navigate to /apply, fill email inline, wait for form to become interactive.
 */
export async function setupNewUser(page: Page) {
  await mockAPIs(page);
  await mockHomesAPI(page);
  await page.goto("/apply", { waitUntil: "domcontentloaded" });
  // Wait for the email input to appear (dev server may be compiling)
  await page.waitForSelector('input[type="email"]', { timeout: 30000 });
  await page.fill('input[type="email"]', "test@example.com");
  await page.click('button[type="submit"]');
  // Wait for form to become interactive (email section disappears)
  await page.waitForFunction(() => !document.querySelector('input[type="email"]'), { timeout: 15000 });
  await page.waitForTimeout(300);
}

/**
 * Setup a results page with mocked matched homes and application data.
 */
export async function setupResultsPage(page: Page) {
  await mockAPIs(page);
  await mockHomesAPI(page);
  // Must navigate first before accessing localStorage
  await page.goto("/apply", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem("application_id", "frozen-app-id");
  });
  await page.goto("/results", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1", { timeout: 15000 });
}
