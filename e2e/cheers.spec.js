import { test, expect } from '@playwright/test';

test.describe('응원 한마디 (Cheers) section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /공고줍줍/ })).toBeVisible({ timeout: 15000 });
  });

  test('cheers section heading is visible', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /취준생 응원 한마디/ });
    await expect(heading).toBeVisible();
  });

  test('cheers section subtitle is visible', async ({ page }) => {
    await expect(
      page.getByText('힘든 취준 길, 서로 응원 한마디 남겨요')
    ).toBeVisible();
  });

  test('cheers form has nickname and content inputs', async ({ page }) => {
    const nicknameInput = page.getByPlaceholder('닉네임 (선택)');
    const contentInput = page.getByPlaceholder('따뜻한 응원 한마디를 남겨주세요...');
    await expect(nicknameInput).toBeVisible();
    await expect(contentInput).toBeVisible();
  });

  test('응원하기 submit button is present and initially disabled (no content)', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: '응원하기' });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeDisabled();
  });

  test('응원하기 button enables when content is typed', async ({ page }) => {
    const contentInput = page.getByPlaceholder('따뜻한 응원 한마디를 남겨주세요...');
    await contentInput.fill('다들 화이팅!');
    const submitBtn = page.getByRole('button', { name: '응원하기' });
    await expect(submitBtn).toBeEnabled();
  });

  test('character count indicator shows length', async ({ page }) => {
    const contentInput = page.getByPlaceholder('따뜻한 응원 한마디를 남겨주세요...');
    await contentInput.fill('취뽀 화이팅');
    await expect(page.getByText(/\/500/)).toBeVisible();
  });

  test('existing cheers cards are displayed or empty state shown', async ({ page }) => {
    // Wait briefly for the cheers API response
    await page.waitForTimeout(2000);

    const cheerCards = page.locator('.grid.grid-cols-1 > div');
    const emptyMsg = page.getByText(/아직 응원글이 없어요/);

    const cardCount = await cheerCards.count();
    const emptyVisible = await emptyMsg.isVisible();

    // Either there are existing cheers or the empty state is shown
    expect(cardCount > 0 || emptyVisible).toBe(true);
  });

});
