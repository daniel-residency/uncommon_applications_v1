import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI, setupResultsPage } from "./helpers";

test.describe("Letter Modal", () => {
  test.beforeEach(async ({ page }) => {
    await setupResultsPage(page);
  });

  test("clicking card opens letter modal", async ({ page }) => {
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    // Modal should be visible with letter content
    await expect(
      page.locator("text=I liked what I saw in your application")
    ).toBeVisible();
  });

  test("modal shows personalized name", async ({ page }) => {
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    // {{name}} should be replaced (with "there" as fallback)
    await expect(page.locator("text=Hi there,")).toBeVisible();
  });

  test("modal can be closed with Escape", async ({ page }) => {
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    await expect(
      page.locator("text=I liked what I saw")
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(
      page.locator("text=I liked what I saw")
    ).not.toBeVisible();
  });

  test("modal is scrollable", async ({ page }) => {
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    const modal = page.locator('[class*="overflow-y-auto"]').first();
    await expect(modal).toBeVisible();
  });

  test("home with question shows question in modal", async ({ page }) => {
    // Click Inventors (home-2, has question)
    const cards = page.locator("button.group");
    await cards.nth(1).click();
    await page.waitForTimeout(300);

    await expect(
      page.locator("text=a question for you")
    ).toBeVisible();
    await expect(
      page.locator("text=keeps you up at night")
    ).toBeVisible();
  });

  test("home without question shows 'no additional questions'", async ({ page }) => {
    // Click Homebrew (home-1, no question)
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    await expect(
      page.locator("text=no additional questions from this home")
    ).toBeVisible();
  });

  test("home with video shows video player", async ({ page }) => {
    // Click Inventors (home-2, has video_url)
    const cards = page.locator("button.group");
    await cards.nth(1).click();
    await page.waitForTimeout(300);

    const video = page.locator("video");
    await expect(video).toBeVisible();
  });

  test("home without video hides video area", async ({ page }) => {
    // Click Homebrew (home-1, no video_url)
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    // Should NOT have a video element
    await expect(page.locator("video")).not.toBeVisible();
  });
});
