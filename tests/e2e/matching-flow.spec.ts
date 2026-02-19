import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI, mockMatchAPI, setupNewUser } from "./helpers";

test.describe("Matching Flow", () => {
  test("shows freeze warning when clicking next", async ({ page }) => {
    await setupNewUser(page);

    // Click "next" at the bottom of the form
    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // See the freeze warning with updated copy
    await expect(page.locator("text=ready to see your matches?")).toBeVisible();
    await expect(page.locator("text=your application answers will be locked")).toBeVisible();
  });

  test("clicking 'see my matches' navigates to matching page", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await mockMatchAPI(page);

    await setupNewUser(page);

    // Click next to show freeze warning
    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // Click see my matches
    await page.getByRole("button", { name: "see my matches" }).click();

    await page.waitForURL("**/matching", { timeout: 5000 });
  });

  test("shows processing animation on matching page", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await mockMatchAPI(page);

    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "test-app-id");
    });

    await page.goto("/matching", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('text=Reading your responses', { timeout: 30000 });

    // Should see processing steps
    await expect(page.locator("text=Reading your responses")).toBeVisible();
  });

  test("shows 3 results after matching", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 30000 });

    // Should see 3 home cards
    const cards = page.locator("button.group");
    await expect(cards).toHaveCount(3);
  });
});
