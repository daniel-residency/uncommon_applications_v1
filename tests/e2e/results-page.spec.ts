import { test, expect } from "@playwright/test";
import { mockAPIs, mockHomesAPI, setupResultsPage, MOCK_HOMES } from "./helpers";

test.describe("Results page", () => {
  test.beforeEach(async ({ page }) => {
    await setupResultsPage(page);
  });

  test("displays matched home cards", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("your matches");
    // 3 cards
    const cards = page.locator("button.group");
    await expect(cards).toHaveCount(3);
  });

  test("card click opens letter modal", async ({ page }) => {
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    // Modal visible with home content
    await expect(page.locator("text=close")).toBeVisible();
  });

  test("letter modal shows video for homes with video_url", async ({ page }) => {
    // Home-2 (Inventors) has video_url in mock
    const cards = page.locator("button.group");
    await cards.nth(1).click();
    await page.waitForTimeout(300);

    // Should have a video element
    const video = page.locator("video");
    await expect(video).toBeVisible();
    const src = await video.getAttribute("src");
    expect(src).toContain("/videos/inventors.mp4");
  });

  test("letter modal hides video area for homes without video", async ({ page }) => {
    // Home-1 (Homebrew) has no video_url
    const cards = page.locator("button.group");
    await cards.first().click();
    await page.waitForTimeout(300);

    // Should NOT have a video element
    await expect(page.locator("video")).not.toBeVisible();
  });

  test("question answering in letter modal", async ({ page }) => {
    // Home-2 (Inventors) has a question
    const cards = page.locator("button.group");
    await cards.nth(1).click();
    await page.waitForTimeout(300);

    // Should see the question
    await expect(page.locator("text=keeps you up at night")).toBeVisible();

    // Type an answer
    const textarea = page.locator("textarea");
    await textarea.fill("Building the future of AI");

    // "saved" indicator should appear
    await expect(page.locator("text=saved")).toBeVisible();
  });

  test("answer questions button opens all-questions modal", async ({ page }) => {
    // Single "answer questions" button opens the modal
    const answerBtn = page.getByRole("button", { name: "answer questions" });
    await answerBtn.scrollIntoViewIfNeeded();
    await expect(answerBtn).toBeVisible();
    await answerBtn.click();

    // Wait for modal content — check for question text which only appears inside the modal
    await expect(page.locator("text=keeps you up at night")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=explore here")).toBeVisible();

    // Should have 2 textareas (one per home with question)
    const textareas = page.locator("textarea");
    await expect(textareas).toHaveCount(2);
  });

  test("submit button changes to 'submit your application' when all answered", async ({ page }) => {
    // Click "answer questions" to open modal
    const answerBtn = page.getByRole("button", { name: "answer questions" });
    await answerBtn.scrollIntoViewIfNeeded();
    await answerBtn.click();

    // Wait for modal to open
    await expect(page.locator("text=the inventors residency")).toBeVisible({ timeout: 5000 });

    const textareas = page.locator("textarea");
    const count = await textareas.count();
    for (let i = 0; i < count; i++) {
      await textareas.nth(i).fill(`Answer ${i + 1}`);
    }

    // Close modal with Escape and wait for it to disappear
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Now submit button should say "submit your application"
    await expect(page.getByRole("button", { name: "submit your application" })).toBeVisible({ timeout: 5000 });
  });

  test("shows question count progress", async ({ page }) => {
    // Should show "0/2 questions answered" or similar
    await expect(page.locator("text=questions answered")).toBeVisible();
  });
});
