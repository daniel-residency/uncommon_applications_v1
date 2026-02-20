import { test, expect } from "@playwright/test";
import { uniqueEmail, createFilledApp, setupWithAppId } from "./helpers";

test.describe("Full application flow", () => {
  test("happy path: filled form → freeze → match → results", async ({ page }) => {
    test.setTimeout(180000); // 3 minutes — matching calls Claude

    const email = uniqueEmail();
    const app = await createFilledApp(email);

    // Load the filled app via localStorage
    await setupWithAppId(page, app.id, "/apply");

    // Wait for answers to load from server (welcome message appears after load completes)
    await expect(page.locator("text=picked up where you left off")).toBeVisible({ timeout: 30000 });

    // Answers should be loaded — verify a field is filled
    const textarea = page.locator("textarea").first();
    await expect(textarea).not.toHaveValue("", { timeout: 15000 });

    // Click next
    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // Freeze warning should show (all fields are filled)
    await expect(page.locator("text=are you ready to move to the next section of the application?")).toBeVisible({ timeout: 5000 });

    // Click "yes, match me"
    await page.getByRole("button", { name: "yes, match me" }).click();

    // Should navigate to matching page
    await page.waitForURL("**/matching", { timeout: 15000 });

    // Should see processing steps (lowercase in new design)
    await expect(page.locator("text=reading your responses")).toBeVisible({ timeout: 30000 });

    // Wait for matching to complete and redirect to results
    await page.waitForURL("**/results", { timeout: 120000 });

    // Should see matched home columns
    await page.waitForSelector("h1", { timeout: 15000 });
    const columns = page.locator("[data-testid^='column-']");
    const columnCount = await columns.count();
    expect(columnCount).toBeGreaterThanOrEqual(1);
    expect(columnCount).toBeLessThanOrEqual(3);
  });
});
