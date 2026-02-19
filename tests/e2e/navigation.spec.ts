import { test, expect } from "@playwright/test";
import { setupNewUser } from "./helpers";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewUser(page);
  });

  test("sidebar shows all section links", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    const sectionTitles = [
      "about you",
      "the project",
      "why this idea",
      "progress",
      "competition",
      "the residency",
      "funding",
      "past programs",
      "how you found us",
    ];

    for (const title of sectionTitles) {
      await expect(nav.locator(`text=${title}`)).toBeVisible();
    }
  });

  test("sidebar click scrolls to section", async ({ page }) => {
    // Click on "funding" in the sidebar
    await page.locator("nav").getByText("funding").click();
    await page.waitForTimeout(500);

    // The funding section should be near the top of the viewport
    const section = page.locator("section#funding");
    await expect(section).toBeInViewport();
  });

  test("scroll highlights active section in sidebar", async ({ page }) => {
    // Scroll to the-project section
    await page.locator("section#the-project").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // The sidebar link for "the project" should be bold/active
    const link = page.locator("nav button:has-text('the project')");
    await expect(link).toHaveClass(/font-bold/);
  });

  test("hash navigation scrolls to section on load", async ({ page }) => {
    // Navigate with hash
    await page.goto("/apply#funding", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem("application_id", "test-app-id");
    });
    await page.goto("/apply#funding", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('section#about-you', { timeout: 30000 });
    await page.waitForTimeout(500);

    // Funding section should be in view
    const section = page.locator("section#funding");
    await expect(section).toBeInViewport();
  });

  test("logo is displayed in sidebar", async ({ page }) => {
    const logo = page.locator('nav img[alt="the residency"]');
    await expect(logo).toBeVisible();
    const src = await logo.getAttribute("src");
    expect(src).toBe("/logo.png");
  });

  test("save status shows in sidebar", async ({ page }) => {
    // Type something to trigger a save
    const textarea = page.locator("textarea").first();
    await textarea.fill("Test answer");

    // Save status should show "saving..." or "saved" in the sidebar nav
    const statusDiv = page.locator("nav").locator("text=/saving|saved/");
    await expect(statusDiv).toBeVisible({ timeout: 10000 });
  });
});
