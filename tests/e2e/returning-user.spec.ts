import { test, expect } from "@playwright/test";
import { uniqueEmail, enterEmail, createFilledApp, createMatchedApp, updateApp, getHomes } from "./helpers";

test.describe("Returning user", () => {
  test("re-entering email loads previous answers", async ({ page }) => {
    const email = uniqueEmail();
    await createFilledApp(email);

    // Visit /apply and enter the same email
    await enterEmail(page, email);

    // Answers should be pre-filled — check the first textarea (accomplishments)
    const accomplishments = page.locator("textarea").first();
    await expect(accomplishments).not.toHaveValue("");

    // Welcome message shows email
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  test("user with application_id in localStorage skips email", async ({ page }) => {
    const email = uniqueEmail();
    const app = await createFilledApp(email);

    // Set localStorage and go to /apply
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.evaluate((id) => localStorage.setItem("application_id", id), app.id);
    await page.reload({ waitUntil: "domcontentloaded" });

    // Should NOT see email input
    await page.waitForSelector("section#about-you", { timeout: 15000 });
    await expect(page.locator('input[type="email"]')).not.toBeVisible();

    // Should see welcome message with email
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  test("frozen user entering email redirects to results", async ({ page }) => {
    const email = uniqueEmail();
    const { app } = await createMatchedApp(email);

    // Enter the email on /apply
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.fill('input[type="email"]', email);
    await page.click('button[type="submit"]');

    // Should redirect to results
    await page.waitForURL("**/results", { timeout: 15000 });
  });
});
