import { test, expect } from "@playwright/test";
import { mockAdminAPI, mockAPIs, mockHomesAPI } from "./helpers";

test.describe("Admin Applications", () => {
  test.beforeEach(async ({ page }) => {
    await mockAdminAPI(page);
    await mockAPIs(page);
    await mockHomesAPI(page);
  });

  test("admin can view applications list", async ({ page }) => {
    await page.goto("/admin/applications");

    await expect(page.locator("h1 >> text=Applications")).toBeVisible();
    await expect(page.locator("text=test@example.com")).toBeVisible();
    await expect(page.locator("text=user2@example.com")).toBeVisible();
  });

  test("admin can search applications by email", async ({ page }) => {
    await page.goto("/admin/applications");

    await page.fill('input[placeholder="Search by email..."]', "test@");
    await expect(page.locator("text=test@example.com")).toBeVisible();
    await expect(page.locator("text=user2@example.com")).not.toBeVisible();
  });

  test("admin can filter by status", async ({ page }) => {
    await page.goto("/admin/applications");

    await page.selectOption("select", "submitted");
    await expect(page.locator("text=test@example.com")).toBeVisible();
    await expect(page.locator("text=user2@example.com")).not.toBeVisible();
  });

  test("admin can view application detail", async ({ page }) => {
    await page.goto("/admin/applications");

    await page.locator("text=View").first().click();
    await page.waitForURL("**/admin/applications/**");

    await expect(page.locator("text=test@example.com")).toBeVisible();
  });

  test("unauthenticated user sees login form", async ({ page }) => {
    // Override admin check to return unauthorized
    await page.route("**/api/admin", async (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ authenticated: false }),
        });
      }
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
      return route.fallback();
    });

    await page.goto("/admin");
    await expect(page.locator("text=Admin Login")).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
