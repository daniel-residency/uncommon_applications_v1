import { test, expect } from "@playwright/test";
import { uniqueEmail, createFilledApp, setupWithAppId } from "./helpers";

test.describe("Full application flow", () => {
  test("happy path: filled form → freeze → match → results", async ({ page }) => {
    test.setTimeout(180000); // 3 minutes — matching calls Claude

    const email = uniqueEmail();
    const app = await createFilledApp(email);

    // Load the filled app via localStorage
    await setupWithAppId(page, app.id, "/apply");
    await page.waitForSelector("section#about-you", { timeout: 15000 });

    // Answers should be loaded — verify a field is filled
    const textarea = page.locator("textarea").first();
    await expect(textarea).not.toHaveValue("");

    // Click next
    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // Freeze warning should show (all fields are filled)
    await expect(page.locator("text=ready to see your matches?")).toBeVisible({ timeout: 5000 });

    // Click "see my matches"
    await page.getByRole("button", { name: "see my matches" }).click();

    // Should navigate to matching page
    await page.waitForURL("**/matching", { timeout: 15000 });

    // Should see processing steps
    await expect(page.locator("text=Reading your responses")).toBeVisible({ timeout: 30000 });

    // Wait for matching to complete and redirect to results
    await page.waitForURL("**/results", { timeout: 120000 });

    // Should see matched home cards
    await page.waitForSelector("h1", { timeout: 15000 });
    const cards = page.locator("button.group");
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    expect(cardCount).toBeLessThanOrEqual(3);
  });
});
