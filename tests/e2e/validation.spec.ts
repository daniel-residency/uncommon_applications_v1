import { test, expect } from "@playwright/test";
import { uniqueEmail, enterEmail, createFilledApp, setupWithAppId } from "./helpers";

test.describe("Validation", () => {
  test("next button shows error when required fields are empty", async ({ page }) => {
    const email = uniqueEmail();
    await enterEmail(page, email);

    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // Should see validation error, not the freeze warning
    await expect(page.locator("text=please answer all required questions")).toBeVisible();
    await expect(page.locator("text=ready to see your matches?")).not.toBeVisible();
  });

  test("next button shows freeze warning when all fields filled", async ({ page }) => {
    const email = uniqueEmail();
    const app = await createFilledApp(email);

    await setupWithAppId(page, app.id, "/apply");

    // Wait for answers to actually load from server (not just the section to render)
    // The first textarea (accomplishments) should have a non-empty value
    const firstTextarea = page.locator("textarea").first();
    await expect(firstTextarea).not.toHaveValue("", { timeout: 15000 });

    const nextBtn = page.locator("main").getByRole("button", { name: "next" });
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    await expect(page.locator("text=ready to see your matches?")).toBeVisible({ timeout: 10000 });
  });
});
