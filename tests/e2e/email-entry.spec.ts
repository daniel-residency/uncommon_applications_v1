import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Email Entry", () => {
  test("new user can enter email and start application", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await page.goto("/");

    // Page loads with email input
    await expect(page.locator("h1")).toContainText("The Residency");
    await expect(page.locator('input[type="email"]')).toBeVisible();

    // Enter email and submit
    await page.fill('input[type="email"]', "newuser@example.com");
    await page.click('button[type="submit"]');

    // Should navigate to first section
    await page.waitForURL("**/apply/about-you");
    expect(page.url()).toContain("/apply/about-you");
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/");

    await page.fill('input[type="email"]', "not-an-email");

    // Disable browser native validation so the JS validation runs
    await page.evaluate(() => {
      document.querySelector("form")?.setAttribute("novalidate", "");
    });

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Please enter a valid email")).toBeVisible();
  });

  test("returning user with in-progress app goes to correct section", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);
    await page.goto("/");

    await page.fill('input[type="email"]', "returning@example.com");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/apply/the-project");
    expect(page.url()).toContain("/apply/the-project");
  });

  test("submitted user redirects to submit page", async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Pre-set the application ID for the submit page check
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("application_id", "submitted-app-id");
    });

    await page.fill('input[type="email"]', "submitted@example.com");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/submit");
  });
});
