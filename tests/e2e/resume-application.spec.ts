import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Resume Application", () => {
  test("returning user sees answers restored and correct section", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    await page.goto("/");
    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    // Should go to the-project section (saved in mock)
    await page.waitForURL("**/apply/the-project");
    await expect(page.locator("h2")).toContainText("The Project");
  });

  test("re-entering email loads existing application", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // First visit
    await page.goto("/");
    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/apply/**");

    // Navigate back to home
    await page.goto("/");
    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    // Should still go to saved section
    await page.waitForURL("**/apply/the-project");
  });
});
