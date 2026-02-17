import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI, mockMatchAPI } from "./helpers";

test.describe("Matching Flow", () => {
  test("shows freeze warning before matching", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Set up app and navigate to last section
    await page.goto("/");
    await page.fill('input[type="email"]', "test@example.com");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/apply/**");

    // Navigate to last section
    for (let i = 0; i < 8; i++) {
      await page.click("text=Continue");
      await page.waitForTimeout(200);
    }

    // See the freeze warning text
    await expect(
      page.locator("text=your application answers will be locked")
    ).toBeVisible();
  });

  test("clicking See your matches shows confirmation dialog", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await mockMatchAPI(page);

    await page.goto("/");
    await page.fill('input[type="email"]', "test@example.com");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/apply/**");

    for (let i = 0; i < 8; i++) {
      await page.click("text=Continue");
      await page.waitForTimeout(200);
    }

    await page.click("button >> text=See your matches");

    await expect(
      page.locator("text=Are you sure? Your answers will be locked.")
    ).toBeVisible();
  });

  test("shows processing animation", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await mockMatchAPI(page);

    // Navigate to a page first so we can access localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("application_id", "test-app-id");
    });

    await page.goto("/matching");

    // Should see processing steps
    await expect(page.locator("text=Reading your responses")).toBeVisible();
  });

  test("shows 3 results after matching", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Navigate to a page first so we can access localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results");

    // Wait for envelopes to load
    await page.waitForTimeout(1500);

    // Should see 3 home names
    await expect(page.locator("text=Homebrew")).toBeVisible();
    await expect(page.locator("text=The Inventors Residency")).toBeVisible();
    await expect(page.locator("text=Arcadia")).toBeVisible();
  });
});
