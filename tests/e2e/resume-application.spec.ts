import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Resume Application", () => {
  test("returning user sees answers pre-filled", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    // Wait for form to load with pre-filled data
    await expect(page.locator('input[type="email"]')).not.toBeVisible({ timeout: 5000 });

    // Accomplishments textarea should be pre-filled
    const textarea = page.locator("textarea").first();
    await expect(textarea).toHaveValue("Built a startup");
  });

  test("re-entering email loads existing application", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // First visit
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    // Wait for form to be interactive
    await expect(page.locator('input[type="email"]')).not.toBeVisible({ timeout: 5000 });

    // Clear localStorage and go back to apply
    await page.evaluate(() => localStorage.removeItem("application_id"));
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    // Re-enter email
    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    // Should still load with pre-filled data
    await expect(page.locator('input[type="email"]')).not.toBeVisible({ timeout: 5000 });
    const textarea = page.locator("textarea").first();
    await expect(textarea).toHaveValue("Built a startup");
  });
});
