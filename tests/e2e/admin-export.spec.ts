import { test, expect } from "@playwright/test";
import { mockAdminAPI } from "./helpers";

test.describe("Admin Export", () => {
  test.beforeEach(async ({ page }) => {
    await mockAdminAPI(page);
  });

  test("export page shows download button", async ({ page }) => {
    await page.goto("/admin/export");

    await expect(page.locator("h1 >> text=Export Applications")).toBeVisible();
    await expect(page.locator("button >> text=Download CSV")).toBeVisible();
  });

  test("export page has status filter", async ({ page }) => {
    await page.goto("/admin/export");

    const select = page.locator("select");
    await expect(select).toBeVisible();

    // Should have options
    const options = select.locator("option");
    expect(await options.count()).toBeGreaterThan(1);
  });

  test("clicking Download CSV triggers download", async ({ page }) => {
    await page.goto("/admin/export");

    // Listen for download
    const downloadPromise = page.waitForEvent("download", { timeout: 5000 });

    await page.locator("button >> text=Download CSV").click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("applications_");
    expect(download.suggestedFilename()).toContain(".csv");
  });
});
