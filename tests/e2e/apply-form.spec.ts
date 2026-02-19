import { test, expect } from "@playwright/test";
import { uniqueEmail, enterEmail } from "./helpers";

test.describe("Apply form", () => {
  test("new user sees email input, enters it, form loads", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    // Form sections should be dimmed/disabled before email
    const formArea = page.locator("div.opacity-50.pointer-events-none").first();
    await expect(formArea).toBeVisible();

    // Enter email
    const email = uniqueEmail();
    await page.fill('input[type="email"]', email);
    await page.click('button[type="submit"]');

    // Email field disappears, form becomes interactive
    await expect(page.locator('input[type="email"]')).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator("section#about-you")).toBeVisible();

    // Welcome message shows email
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  test("invalid email shows error", async ({ page }) => {
    await page.goto("/apply", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });

    // Use "bad@bad" — passes browser type=email validation but fails our regex (no dot in domain)
    await page.fill('input[type="email"]', "bad@bad");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=please enter a valid email address")).toBeVisible();
  });

  test("all 9 sections render on single page", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const sections = [
      "about-you", "the-project", "why-this-idea", "progress",
      "competition", "the-residency", "funding", "past-programs", "how-found-us",
    ];

    for (const id of sections) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
  });

  test("checkbox locations are selectable and deselectable", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    // Find the locations checkbox group
    const sfButton = page.locator('button:has-text("San Francisco, CA")');
    await sfButton.scrollIntoViewIfNeeded();
    await sfButton.click();

    // Should be selected (dark background)
    await expect(sfButton).toHaveClass(/bg-ink/);

    // Click again to deselect
    await sfButton.click();
    await expect(sfButton).not.toHaveClass(/bg-ink/);

    // Select multiple
    await sfButton.click();
    const nyButton = page.locator('button:has-text("New York, NY")');
    await nyButton.click();

    await expect(sfButton).toHaveClass(/bg-ink/);
    await expect(nyButton).toHaveClass(/bg-ink/);
  });

  test("textarea accepts input", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const textarea = page.locator("textarea").first();
    await textarea.scrollIntoViewIfNeeded();
    await textarea.fill("This is a test answer for the accomplishments field.");
    await expect(textarea).toHaveValue("This is a test answer for the accomplishments field.");
  });

  test("short text field enforces maxLength", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    // Pitch field is 50 char max
    const pitchSection = page.locator("section#the-project");
    await pitchSection.scrollIntoViewIfNeeded();
    const pitchInput = pitchSection.locator("input").first();
    await pitchInput.fill("A".repeat(60));

    const value = await pitchInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(50);
  });

  test("yes/no buttons toggle", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const progressSection = page.locator("section#progress");
    await progressSection.scrollIntoViewIfNeeded();

    // "Are people using your project?" yes/no
    const yesBtn = progressSection.locator("button:has-text('yes')").first();
    await yesBtn.click();
    await expect(yesBtn).toHaveClass(/bg-ink/);

    const noBtn = progressSection.locator("button:has-text('no')").first();
    await noBtn.click();
    await expect(noBtn).toHaveClass(/bg-ink/);
    await expect(yesBtn).not.toHaveClass(/bg-ink/);
  });

  test("select dropdown works", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const fundingSection = page.locator("section#funding");
    await fundingSection.scrollIntoViewIfNeeded();

    const select = fundingSection.locator("select");
    await select.selectOption("building");
    await expect(select).toHaveValue("building");
  });

  test("country selector works", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    // Country selector is a custom dropdown, not a native select
    const aboutYou = page.locator("section#about-you");

    // Find the country trigger button (first button inside the country selector div)
    const countryDiv = aboutYou.locator("div:has(> label:has-text('country of citizenship'))");
    const countryBtn = countryDiv.locator("button").first();
    await countryBtn.click();

    // Search and select
    const searchInput = countryDiv.locator('input[placeholder="search countries..."]');
    await searchInput.fill("United States");
    await countryDiv.locator("button:has-text('United States')").first().click();

    // Button text should update to selected country
    await expect(countryBtn).toHaveText("United States");
  });

  test("conditional questions appear based on answers", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const pastPrograms = page.locator("section#past-programs");
    await pastPrograms.scrollIntoViewIfNeeded();

    // "same_thing" should not be visible yet
    await expect(page.locator("text=Are you working on the same thing")).not.toBeVisible();

    // The yes/no component renders: <div><label>...</label><div class="flex gap-2"><button>yes</button><button>no</button></div></div>
    // Find the container that has "applied before" label, then get the yes button within it
    const appliedContainer = pastPrograms.locator("div:has(> label:has-text('Have you applied to the Residency before'))");
    await appliedContainer.scrollIntoViewIfNeeded();
    await appliedContainer.locator("button:has-text('yes')").click();

    // Now "same_thing" should appear
    await expect(page.locator("text=Are you working on the same thing")).toBeVisible({ timeout: 5000 });
  });
});
