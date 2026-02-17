import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Home Questions", () => {
  test.beforeEach(async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Navigate to a page first so we can access localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results");
    await page.waitForTimeout(1500);
  });

  test("shows question count tracker", async ({ page }) => {
    await expect(page.locator("text=0 of 2 home questions answered")).toBeVisible();
  });

  test("answering a question shows saved indicator", async ({ page }) => {
    // Open Inventors modal
    await page.locator("text=The Inventors Residency").click();

    // Fill in the question
    const textarea = page.locator('textarea[placeholder="Your answer..."]');
    await textarea.fill("Building a new kind of search engine");

    // Should show Saved indicator
    await expect(page.locator("text=Saved")).toBeVisible();
  });

  test("question indicators update on envelopes", async ({ page }) => {
    // Initially, question indicators should show "?"
    const questionBadges = page.locator("text=?");
    expect(await questionBadges.count()).toBeGreaterThan(0);
  });

  test("submit button is disabled until all questions answered", async ({ page }) => {
    const submitBtn = page.locator("button >> text=Submit application");
    await expect(submitBtn).toBeDisabled();
  });
});
