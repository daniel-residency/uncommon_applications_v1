import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Frozen State", () => {
  test("frozen user entering email on /apply goes to results", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.fill('input[type="email"]', "frozen@example.com");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/results");
    expect(page.url()).toContain("/results");
  });

  test("frozen user with application_id in localStorage goes to results from /", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    // Navigate to / which checks status and redirects
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/results", { timeout: 5000 });
  });

  test("frozen user sees their matched homes on results page", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 30000 });

    await expect(page.locator("text=your matches")).toBeVisible();
  });
});
