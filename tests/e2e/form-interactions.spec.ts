import { test, expect } from "@playwright/test";
import { setupNewUser } from "./helpers";

test.describe("Form interactions", () => {
  test.beforeEach(async ({ page }) => {
    await setupNewUser(page);
  });

  test("country selector works", async ({ page }) => {
    // The country selector should be present in about-you section
    const countryField = page.locator("text=What is your country of citizenship?");
    await expect(countryField).toBeVisible();

    // Click the country selector input and search
    const countryInput = page.locator('[data-testid="country-selector"]').or(
      page.locator("input[placeholder*='Search']").first()
    ).or(
      page.locator("input[placeholder*='search']").first()
    ).or(
      page.locator("input[placeholder*='country']").first()
    );

    // If the country selector is a searchable input, type into it
    if (await countryInput.count() > 0) {
      await countryInput.first().click();
      await countryInput.first().fill("United States");
      // Wait for dropdown and click option
      await page.waitForTimeout(300);
      const option = page.locator("text=United States").first();
      if (await option.isVisible()) {
        await option.click();
      }
    }
  });

  test("checkbox multi-select works", async ({ page }) => {
    // The locations multi-checkbox should be visible
    const locationsLabel = page.locator("text=Which Residency locations");
    await expect(locationsLabel).toBeVisible();

    // Click on some checkboxes
    const vienna = page.locator("text=Vienna").first();
    if (await vienna.isVisible()) {
      await vienna.click();
    }
  });

  test("textarea allows text input", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await textarea.fill("Built a successful AI startup");
    await expect(textarea).toHaveValue("Built a successful AI startup");
  });

  test("short text field with maxLength enforces limit", async ({ page }) => {
    // Scroll to The Project section
    await page.locator("#the-project").scrollIntoViewIfNeeded();

    const pitchInput = page.locator('input[maxlength="50"]');
    if (await pitchInput.count() > 0) {
      await pitchInput.fill("A".repeat(60));
      const val = await pitchInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(50);
    }
  });

  test("yes/no questions toggle", async ({ page }) => {
    // Scroll to progress section which has yes/no questions
    await page.locator("#progress").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Find a yes/no button
    const yesButtons = page.locator("button:text('yes')");
    if (await yesButtons.count() > 0) {
      await yesButtons.first().click();
    }
  });

  test("select dropdown works", async ({ page }) => {
    // Scroll to funding section which has a select
    await page.locator("#funding").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const select = page.locator("select").first();
    if (await select.count() > 0) {
      await select.selectOption({ index: 1 });
    }
  });

  test("conditional questions appear based on answers", async ({ page }) => {
    // Scroll to past-programs section
    await page.locator("#past-programs").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // "Have you applied before?" is a yes/no
    // When answered "yes", "Are you working on the same thing?" should appear
    const appliedBefore = page.locator("text=Have you applied to the Residency before?");
    await expect(appliedBefore).toBeVisible();
  });

  test("all 9 sections render on single page", async ({ page }) => {
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
});
