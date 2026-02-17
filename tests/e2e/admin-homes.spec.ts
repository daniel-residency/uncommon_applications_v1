import { test, expect } from "@playwright/test";
import { mockAdminAPI, mockHomesAPI } from "./helpers";

test.describe("Admin Homes", () => {
  test.beforeEach(async ({ page }) => {
    await mockAdminAPI(page);
    await mockHomesAPI(page);
  });

  test("admin can view homes list", async ({ page }) => {
    await page.goto("/admin/homes");

    await expect(page.locator("h1 >> text=Homes")).toBeVisible();
    await expect(page.locator("text=Homebrew")).toBeVisible();
    await expect(page.locator("text=The Inventors Residency")).toBeVisible();
    await expect(page.locator("text=Arcadia")).toBeVisible();
  });

  test("admin can click Edit on a home", async ({ page }) => {
    await page.goto("/admin/homes");

    await page.locator("text=Edit").first().click();

    // Edit form should appear with Save/Cancel buttons
    await expect(page.locator("button >> text=Save")).toBeVisible();
    await expect(page.locator("button >> text=Cancel")).toBeVisible();
  });

  test("admin can cancel editing", async ({ page }) => {
    await page.goto("/admin/homes");

    await page.locator("text=Edit").first().click();
    await expect(page.locator("button >> text=Save")).toBeVisible();

    await page.locator("button >> text=Cancel").click();
    await expect(page.locator("button >> text=Save")).not.toBeVisible();
  });

  test("admin can toggle home active status", async ({ page }) => {
    let patchBody: Record<string, unknown> | null = null;

    await page.route("**/api/homes", async (route) => {
      if (route.request().method() === "PATCH") {
        patchBody = JSON.parse(route.request().postData() || "{}");
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ...patchBody }),
        });
      }
      return route.fallback();
    });

    await page.goto("/admin/homes");

    // Click the Active button to toggle
    await page.locator("text=Active").first().click();

    // Verify PATCH was called
    expect(patchBody).not.toBeNull();
    expect(patchBody!.active).toBe(false);
  });
});
