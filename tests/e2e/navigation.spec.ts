import { test, expect } from "@playwright/test";
import { uniqueEmail, enterEmail } from "./helpers";

test.describe("Navigation", () => {
  test("sidebar shows all section links", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const nav = page.locator("nav");
    const sectionTitles = [
      "about you", "your work", "why this idea", "progress",
      "competition", "the residency", "funding", "past programs", "how you found us",
    ];

    for (const title of sectionTitles) {
      await expect(nav.locator(`text=${title}`)).toBeVisible();
    }
  });

  test("sidebar click scrolls to section", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    await page.locator("nav").getByText("funding").click();
    await page.waitForTimeout(500);

    const section = page.locator("section#funding");
    await expect(section).toBeInViewport();
  });

  test("scroll highlights active section in sidebar", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    await page.locator("section#your-work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const link = page.locator("nav button:has-text('your work')");
    await expect(link).toHaveClass(/font-bold/);
  });

  test("logo is displayed in sidebar", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const logo = page.locator('nav img[alt="the residency"]');
    await expect(logo).toBeVisible();
    const src = await logo.getAttribute("src");
    expect(src).toBe("/logo.svg");
  });

  test("save status shows in sidebar after typing", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const textarea = page.locator("textarea").first();
    await textarea.fill("Testing auto-save");

    // Wait for save indicator
    const statusDiv = page.locator("nav").locator("text=/saving|saved/");
    await expect(statusDiv).toBeVisible({ timeout: 15000 });
  });
});
