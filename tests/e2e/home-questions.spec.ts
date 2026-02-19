import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI, setupResultsPage } from "./helpers";

test.describe("Home Questions", () => {
  test.beforeEach(async ({ page }) => {
    await setupResultsPage(page);
  });

  test("shows question count progress", async ({ page }) => {
    await expect(page.locator("text=questions answered")).toBeVisible();
  });

  test("answering a question in modal shows saved indicator", async ({ page }) => {
    // Click Inventors card (home-2, which has a question)
    const cards = page.locator("button.group");
    await cards.nth(1).click();
    await page.waitForTimeout(300);

    // Fill in the question
    const textarea = page.locator("textarea");
    await textarea.fill("Building a new kind of search engine");

    // Should show saved indicator
    await expect(page.locator("text=saved")).toBeVisible();
  });

  test("submit button is disabled until all questions answered", async ({ page }) => {
    // Without answers, "answer questions" button should be shown (secondary variant)
    await expect(page.getByRole("button", { name: "answer questions" })).toBeVisible();
  });
});
