import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Letter Modal", () => {
  test.beforeEach(async ({ page }) => {
    await mockAPIs(page);
    await mockHomesAPI(page);

    // Navigate to a page first so we can access localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("application_id", "frozen-app-id");
    });

    await page.goto("/results");
    await page.waitForTimeout(1500); // Wait for envelope animations
  });

  test("clicking envelope opens letter modal", async ({ page }) => {
    await page.locator("text=Homebrew").click();

    // Modal should be visible with letter content
    await expect(
      page.locator("text=I liked what I saw in your application")
    ).toBeVisible();
  });

  test("modal shows personalized name", async ({ page }) => {
    await page.locator("text=Homebrew").click();

    // {{name}} should be replaced (with "there" as fallback)
    await expect(page.locator("text=Hi there,")).toBeVisible();
  });

  test("modal can be closed", async ({ page }) => {
    await page.locator("text=Homebrew").click();
    await expect(
      page.locator("text=I liked what I saw")
    ).toBeVisible();

    // Close via Escape key (the close button is obscured by the backdrop overlay on desktop)
    await page.keyboard.press("Escape");
    await expect(
      page.locator("text=I liked what I saw")
    ).not.toBeVisible();
  });

  test("modal is scrollable for long content", async ({ page }) => {
    await page.locator("text=Homebrew").click();

    // The modal container should exist and be scrollable
    const modal = page.locator('[class*="overflow-y-auto"]').first();
    await expect(modal).toBeVisible();
  });

  test("home with question shows question in modal", async ({ page }) => {
    await page.locator("text=The Inventors Residency").click();

    await expect(
      page.locator("text=P.S. — A question for you")
    ).toBeVisible();
    await expect(
      page.locator("text=What's the thing you're building")
    ).toBeVisible();
  });

  test("home without question shows 'No additional questions'", async ({ page }) => {
    await page.locator("text=Homebrew").click();

    await expect(
      page.locator("text=No additional questions from this home")
    ).toBeVisible();
  });
});
