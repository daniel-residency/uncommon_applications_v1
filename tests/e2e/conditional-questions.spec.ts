import { test, expect } from "@playwright/test";
import { setupNewUser } from "./helpers";

test.describe("Conditional Questions", () => {
  test("Past Programs shows conditional questions based on applied_before", async ({ page }) => {
    await setupNewUser(page);

    // Navigate to Past Programs section (section 8)
    for (let i = 0; i < 7; i++) {
      await page.click("text=Continue");
      await page.waitForTimeout(200);
    }

    await expect(page.locator("h2")).toContainText("Past Programs");

    // "Are you working on the same thing?" should NOT be visible initially
    await expect(page.locator("text=Are you working on the same thing?")).not.toBeVisible();

    // Click "Yes" on "Have you applied to the Residency before?"
    const appliedBeforeSection = page.locator("text=Have you applied to the Residency before?").locator("..");
    await appliedBeforeSection.locator("button >> text=Yes").click();

    // Now "Are you working on the same thing?" should appear
    await expect(page.locator("text=Are you working on the same thing?")).toBeVisible();
  });

  test("shows 'What changed' when same_thing is yes", async ({ page }) => {
    await setupNewUser(page);

    // Navigate to Past Programs
    for (let i = 0; i < 7; i++) {
      await page.click("text=Continue");
      await page.waitForTimeout(200);
    }

    // Click Yes on applied_before
    const appliedSection = page.locator("text=Have you applied to the Residency before?").locator("..");
    await appliedSection.locator("button >> text=Yes").click();
    await page.waitForTimeout(100);

    // Click Yes on same_thing
    const sameSection = page.locator("text=Are you working on the same thing?").locator("..");
    await sameSection.locator("button >> text=Yes").click();

    // "What changed since last time?" should appear
    await expect(page.locator("text=What changed since last time?")).toBeVisible();
  });

  test("shows 'Why did you pivot' when same_thing is no", async ({ page }) => {
    await setupNewUser(page);

    // Navigate to Past Programs
    for (let i = 0; i < 7; i++) {
      await page.click("text=Continue");
      await page.waitForTimeout(200);
    }

    // Click Yes on applied_before
    const appliedSection = page.locator("text=Have you applied to the Residency before?").locator("..");
    await appliedSection.locator("button >> text=Yes").click();
    await page.waitForTimeout(100);

    // Click No on same_thing
    const sameSection = page.locator("text=Are you working on the same thing?").locator("..");
    await sameSection.locator("button >> text=No").click();

    // "Why did you pivot" should appear
    await expect(page.locator("text=Why did you pivot")).toBeVisible();
  });
});
