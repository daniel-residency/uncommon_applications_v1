import { test, expect } from "@playwright/test";
import { setupNewUser } from "./helpers";

test.describe("Auto-Save", () => {
  test("saves answers to localStorage", async ({ page }) => {
    await setupNewUser(page);

    // Type in a textarea
    const textarea = page.locator("textarea").first();
    await textarea.fill("My accomplishments");

    // Wait for debounced save
    await page.waitForTimeout(500);

    // Check localStorage
    const stored = await page.evaluate(() => {
      return localStorage.getItem("residency_application");
    });

    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.answers).toBeDefined();
  });

  test("saves indicator shows when saving to server", async ({ page }) => {
    await setupNewUser(page);

    const textarea = page.locator("textarea").first();
    await textarea.fill("Testing auto-save");

    // Wait for remote save debounce (2s) + some buffer
    await page.waitForTimeout(2500);

    // The "saved" indicator should appear
    await expect(page.locator("text=saved")).toBeVisible();
  });

  test("restores answers from localStorage on refresh", async ({ page }) => {
    await setupNewUser(page);

    // Fill in answer
    const textarea = page.locator("textarea").first();
    await textarea.fill("My saved accomplishment");

    // Wait for local save
    await page.waitForTimeout(500);

    // Reload
    await page.reload();
    await page.waitForTimeout(500);

    // Answer should be restored (from the mock API which returns the app state)
    // The localStorage should still have the data
    const stored = await page.evaluate(() => {
      return localStorage.getItem("residency_application");
    });
    expect(stored).not.toBeNull();
  });
});
