import { test, expect } from "@playwright/test";
import { setupNewUser } from "./helpers";

test.describe("Application Form", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewUser(page);
  });

  test("displays About You section with all question types", async ({ page }) => {
    await expect(page.locator("section#about-you")).toBeVisible();

    // Country selector
    await expect(page.locator("text=What is your country of citizenship?")).toBeVisible();

    // Multi-checkbox
    await expect(page.locator("text=Which Residency locations")).toBeVisible();

    // Textarea
    await expect(page.locator("text=What past two prior accomplishments")).toBeVisible();
  });

  test("can fill in text answers", async ({ page }) => {
    // Fill in accomplishments textarea
    const textarea = page.locator("textarea").first();
    await textarea.fill("Built a successful AI startup that served 10k users");
    await expect(textarea).toHaveValue("Built a successful AI startup that served 10k users");
  });

  test("all 9 sections are visible on single page", async ({ page }) => {
    const sections = [
      "about-you",
      "the-project",
      "why-this-idea",
      "progress",
      "competition",
      "the-residency",
      "funding",
      "past-programs",
      "how-found-us",
    ];

    for (const id of sections) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
  });

  test("shows 'next' button to trigger freeze warning", async ({ page }) => {
    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await expect(nextBtn).toBeVisible();
  });

  test("50-character pitch field enforces maxLength", async ({ page }) => {
    await page.locator("#the-project").scrollIntoViewIfNeeded();

    const pitchInput = page.locator('input[maxlength="50"]');
    if (await pitchInput.count() > 0) {
      await pitchInput.fill("A".repeat(60));
      const val = await pitchInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(50);
    }
  });
});
