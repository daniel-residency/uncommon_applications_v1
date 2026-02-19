import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Email Entry", () => {
  test("new user can enter email on /apply and form becomes interactive", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    // Page loads with email input
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Enter email and submit
    await page.fill('input[type="email"]', "newuser@example.com");
    await page.click('button[type="submit"]');

    // Email field should disappear, form should be interactive
    await expect(page.locator('input[type="email"]')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator("section#about-you")).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "not-an-email");

    // Disable browser native validation so the JS validation runs
    await page.evaluate(() => {
      document.querySelector("form")?.setAttribute("novalidate", "");
    });

    await page.click('button[type="submit"]');

    await expect(page.locator("text=please enter a valid email")).toBeVisible();
  });

  test("returning user with in-progress app gets pre-filled answers", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    // Wait for form to load
    await expect(page.locator('input[type="email"]')).not.toBeVisible({ timeout: 5000 });

    // Accomplishments should be pre-filled
    const accomplishments = page.locator("textarea").first();
    await expect(accomplishments).toHaveValue("Built a startup");
  });

  test("submitted user redirects to submit page", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    await page.fill('input[type="email"]', "submitted@example.com");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/submit");
  });
});
