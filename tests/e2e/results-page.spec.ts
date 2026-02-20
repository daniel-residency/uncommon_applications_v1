import { test, expect } from "@playwright/test";
import { uniqueEmail, createMatchedApp, setupWithAppId, getHomes } from "./helpers";

test.describe("Results page", () => {
  let appId: string;
  let homeIds: string[];
  let homes: { id: string; slug: string; name: string; video_url: string | null; question: string | null }[];

  test.beforeAll(async () => {
    const email = uniqueEmail();
    const allHomes = await getHomes();

    // Pick 3 homes strategically: at least one with video and one with a question
    const withVideo = allHomes.find((h: { video_url: string | null }) => h.video_url);
    const withQuestion = allHomes.find((h: { question: string | null; id: string }) => h.question && h.id !== withVideo?.id);
    const other = allHomes.find((h: { id: string }) => h.id !== withVideo?.id && h.id !== withQuestion?.id);

    homeIds = [withVideo, withQuestion, other].filter(Boolean).map((h: { id: string }) => h.id).slice(0, 3);
    homes = allHomes.filter((h: { id: string }) => homeIds.includes(h.id));

    // Create app with these specific homes
    const { createApp, updateApp, FULL_ANSWERS } = await import("./helpers");
    const app = await createApp(email);
    await updateApp(app.id, { answers: FULL_ANSWERS });
    await updateApp(app.id, { status: "frozen", frozen_at: new Date().toISOString() });
    await updateApp(app.id, { matched_home_ids: homeIds });
    appId = app.id;
  });

  test("displays matched home columns", async ({ page }) => {
    await setupWithAppId(page, appId, "/results");
    await page.waitForSelector("h1", { timeout: 15000 });

    const columns = page.locator("[data-testid^='column-']");
    await expect(columns).toHaveCount(3);
  });

  test("clicking column opens golden letter with letter content", async ({ page }) => {
    await setupWithAppId(page, appId, "/results");
    await page.waitForSelector("h1", { timeout: 15000 });

    const columns = page.locator("[data-testid^='column-']");
    await columns.first().click();
    await page.waitForTimeout(500);

    // Golden letter should be open — look for the personalized greeting
    await expect(page.getByText("hi there,")).toBeVisible();
  });

  test("golden letter closes with Escape", async ({ page }) => {
    await setupWithAppId(page, appId, "/results");
    await page.waitForSelector("h1", { timeout: 15000 });

    const columns = page.locator("[data-testid^='column-']");
    await columns.first().click();
    await page.waitForTimeout(500);
    await expect(page.getByText("hi there,")).toBeVisible();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await expect(page.getByText("hi there,")).not.toBeVisible();
  });

  test("home with video shows 'listen to our community architect' button", async ({ page }) => {
    const homeWithVideo = homes.find((h) => h.video_url);
    if (!homeWithVideo) {
      test.skip();
      return;
    }

    await setupWithAppId(page, appId, "/results");
    await page.waitForSelector("h1", { timeout: 15000 });

    const column = page.locator(`[data-testid='column-${homeWithVideo.slug}']`);
    await column.click();
    await page.waitForTimeout(500);

    // Should see the video button
    await expect(page.getByText("listen to our community architect")).toBeVisible();

    // Click it to open video modal
    await page.getByText("listen to our community architect").click();
    await page.waitForTimeout(300);
    await expect(page.locator("video")).toBeVisible();
  });

  test("home without video hides video button", async ({ page }) => {
    const homeWithoutVideo = homes.find((h) => !h.video_url);
    if (!homeWithoutVideo) {
      test.skip();
      return;
    }

    await setupWithAppId(page, appId, "/results");
    await page.waitForSelector("h1", { timeout: 15000 });

    const column = page.locator(`[data-testid='column-${homeWithoutVideo.slug}']`);
    await column.click();
    await page.waitForTimeout(500);

    await expect(page.getByText("listen to our community architect")).not.toBeVisible();
  });

  test("answer questions button opens questions card", async ({ page }) => {
    // This button only shows if at least one matched home has a question
    const hasQuestions = homes.some((h) => h.question);
    if (!hasQuestions) {
      test.skip();
      return;
    }

    await setupWithAppId(page, appId, "/results");
    await page.waitForSelector("h1", { timeout: 15000 });

    const answerBtn = page.getByRole("button", { name: "answer questions" });
    await answerBtn.scrollIntoViewIfNeeded();
    await answerBtn.click();

    await expect(page.locator("textarea").first()).toBeVisible({ timeout: 5000 });
  });
});
