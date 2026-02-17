import { test, expect } from "@playwright/test";
import { setupNewUser, mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Application Form", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewUser(page);
  });

  test("displays About You section with all question types", async ({ page }) => {
    await expect(page.locator("h2")).toContainText("About You");

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

  test("can navigate between sections", async ({ page }) => {
    // Click Continue to go to next section
    await page.click("text=Continue");
    await page.waitForURL("**/apply/the-project");
    await expect(page.locator("h2")).toContainText("The Project");

    // Click Back to return
    await page.click("text=Back");
    await page.waitForURL("**/apply/about-you");
    await expect(page.locator("h2")).toContainText("About You");
  });

  test("navigates through all 9 sections", async ({ page }) => {
    const sections = [
      "About You",
      "The Project",
      "Why This Idea",
      "Progress",
      "Competition & Business Model",
      "The Residency",
      "Funding",
      "Past Programs",
      "How You Found Us",
    ];

    for (let i = 0; i < sections.length; i++) {
      await expect(page.locator("h2")).toContainText(sections[i]);
      if (i < sections.length - 1) {
        await page.click("text=Continue");
        await page.waitForTimeout(300);
      }
    }
  });

  test("last section shows 'See your matches' button", async ({ page }) => {
    // Navigate to last section
    for (let i = 0; i < 8; i++) {
      await page.click("text=Continue");
      await page.waitForTimeout(200);
    }

    await expect(page.locator("h2")).toContainText("How You Found Us");
    await expect(page.locator("button >> text=See your matches")).toBeVisible();
  });

  test("shows progress bar with correct count", async ({ page }) => {
    await expect(page.locator("text=1 of 9")).toBeVisible();

    await page.click("text=Continue");
    await page.waitForTimeout(200);
    await expect(page.locator("text=2 of 9")).toBeVisible();
  });

  test("50-character pitch field enforces maxLength", async ({ page }) => {
    await page.click("text=Continue"); // Go to The Project
    await page.waitForURL("**/apply/the-project");

    const pitchInput = page.locator('input[maxlength="50"]');
    await pitchInput.fill("A".repeat(60));

    // Should only have 50 chars
    const val = await pitchInput.inputValue();
    expect(val.length).toBeLessThanOrEqual(50);
  });
});
