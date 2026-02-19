import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI, mockMatchAPI } from "./helpers";

test.describe("Full application flow", () => {
  test("happy path: email → form → freeze → matching → results → answer → submit", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await mockMatchAPI(page);

    // 1. Go to /apply, enter email
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.fill('input[type="email"]', "test@example.com");
    await page.click('button[type="submit"]');

    // Wait for form to become interactive
    await expect(page.locator('input[type="email"]')).not.toBeVisible({ timeout: 5000 });

    // 2. Form is visible with all sections
    await expect(page.locator("section#about-you")).toBeVisible();

    // 3. Click "next" to trigger freeze warning
    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // 4. Freeze warning appears with updated copy
    await expect(page.locator("text=ready to see your matches?")).toBeVisible();

    // 5. Mock the PATCH to set frozen status, then click "see my matches"
    await page.getByRole("button", { name: "see my matches" }).click();

    // 6. Should navigate to matching page
    await page.waitForURL("**/matching", { timeout: 5000 });

    // Matching page shows steps
    await expect(page.locator("text=Reading your responses")).toBeVisible({ timeout: 30000 });
  });

  test("results page: individual card → letter modal flow", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Set up as frozen user with matches
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 30000 });

    // 3 cards visible
    const cards = page.locator("button.group");
    await expect(cards).toHaveCount(3);

    // Click a card to open letter modal
    await cards.nth(1).click();
    await page.waitForTimeout(300);

    // Modal should be open with home description
    await expect(page.locator("text=Your application stood out")).toBeVisible();

    // Close modal
    await page.keyboard.press("Escape");
  });

  test("results page: answer questions flow", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 30000 });

    // Click "answer questions" button
    const answerBtn = page.getByRole("button", { name: "answer questions" });
    await answerBtn.scrollIntoViewIfNeeded();
    await expect(answerBtn).toBeVisible();
    await answerBtn.click();

    // Modal should open with questions
    await expect(page.locator("text=keeps you up at night")).toBeVisible({ timeout: 5000 });

    // Fill in answers
    const textareas = page.locator("textarea");
    const count = await textareas.count();
    for (let i = 0; i < count; i++) {
      await textareas.nth(i).fill(`Answer ${i + 1}`);
    }

    // Close modal
    await page.keyboard.press("Escape");
  });
});
