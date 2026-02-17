import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Frozen State", () => {
  test("frozen user entering email goes to results", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/");
    await page.fill('input[type="email"]', "frozen@example.com");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/results");
    expect(page.url()).toContain("/results");
  });

  test("frozen user cannot navigate to edit pages", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Navigate to a page first so we can access localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    // Try to go to an edit page
    await page.goto("/apply/about-you");

    // Should be redirected away
    await page.waitForTimeout(1500);
    expect(page.url()).not.toContain("/apply/");
  });

  test("frozen user sees their matched homes on results page", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Navigate to a page first so we can access localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results");
    await page.waitForTimeout(1500);

    await expect(page.locator("text=We think these homes could be a great fit")).toBeVisible();
    await expect(page.locator("text=Homebrew")).toBeVisible();
  });
});
