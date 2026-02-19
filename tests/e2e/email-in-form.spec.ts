import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Email as first form field", () => {
  test.beforeEach(async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
  });

  test("new user sees email input at top of /apply", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    // Email input visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    // Form sections visible but disabled
    await expect(page.locator("section#about-you")).toBeVisible();
    const wrapper = page.locator(".opacity-50");
    await expect(wrapper).toBeVisible();
  });

  test("new user can enter email and form becomes interactive", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "newuser@example.com");
    await page.click('button[type="submit"]');

    // Email section should disappear, form becomes interactive
    await page.waitForFunction(() => !document.querySelector('input[type="email"]'), { timeout: 15000 });
    // Sections should no longer be disabled
    await expect(page.locator(".opacity-50")).not.toBeVisible();
    // "next" button should appear at bottom (scroll to it)
    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await expect(nextBtn).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "not-an-email");
    await page.evaluate(() => {
      document.querySelector("form")?.setAttribute("novalidate", "");
    });
    await page.click('button[type="submit"]');

    await expect(page.locator("text=please enter a valid email")).toBeVisible();
  });

  test("returning user with in_progress app gets answers pre-filled", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    // Wait for form to load with pre-filled data
    await page.waitForFunction(() => !document.querySelector('input[type="email"]'), { timeout: 15000 });

    // Accomplishments textarea should be pre-filled
    const accomplishments = page.locator("textarea").first();
    await expect(accomplishments).toHaveValue("Built a startup");
  });

  test("frozen user redirects to results", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "frozen@example.com");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/results", { timeout: 15000 });
  });

  test("submitted user redirects to submit page", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "submitted@example.com");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/submit", { timeout: 15000 });
  });

  test("user with existing application_id skips email", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "test-app-id");
    });
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("section#about-you", { timeout: 15000 });

    // Email input should NOT be visible
    await expect(page.locator('input[type="email"]')).not.toBeVisible();
    // Form should be interactive
    await expect(page.locator(".opacity-50")).not.toBeVisible();
  });

  test("/ redirects to /apply for new users", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/apply", { timeout: 15000 });
  });
});
