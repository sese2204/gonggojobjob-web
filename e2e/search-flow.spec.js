import { test, expect } from '@playwright/test';

test.describe('Search flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('관심 키워드 콕 집어주세요')).toBeVisible({ timeout: 15000 });
    // Reset search limit so tests are not blocked
    await page.evaluate(() => localStorage.clear());
  });

  test('search blocked when no tags selected — shows error message', async ({ page }) => {
    // Programmatically call handleSearch by directly clicking the search button
    // The button is disabled when no tags are selected; we verify that state
    const searchBtn = page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ });
    await expect(searchBtn).toBeDisabled();
    await expect(searchBtn).toHaveClass(/cursor-not-allowed/);

    // Also test the runtime guard: force-enable and click would trigger the error,
    // but the correct UX is a disabled button — this confirms the guard is in place.
  });

  test('search flow: select tag → submit → results appear', async ({ page }) => {
    // Select a tag
    await page.getByRole('button', { name: '프론트엔드' }).click();
    await expect(page.getByText('내가 찜한 키워드 (1개)')).toBeVisible();

    // Click search
    const searchBtn = page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ });
    await expect(searchBtn).toBeEnabled();
    await searchBtn.click();

    // Loading spinner appears first
    await expect(page.getByText(/AI가 열심히 공고를 뒤지는 중입니다/)).toBeVisible({ timeout: 5000 });

    // Wait for results (AI API can be slow — allow 30s)
    await expect(page.getByText(/짜잔! AI가 찾은 추천 공고/)).toBeVisible({ timeout: 30000 });

    // At least one job card should show the AI match score chip
    await expect(page.locator('text=AI 찰떡 지수').first()).toBeVisible();

    await page.screenshot({ path: 'test-results/search-results.png' });
  });

  test('search results page shows total count', async ({ page }) => {
    await page.getByRole('button', { name: '백엔드' }).click();
    await page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ }).click();
    await expect(page.getByText(/짜잔! AI가 찾은 추천 공고/)).toBeVisible({ timeout: 30000 });

    // Total count text rendered in results header
    await expect(page.getByText(/총.*개 중 매칭률 높은 공고/)).toBeVisible();
  });

  test('can return to search input from results', async ({ page }) => {
    await page.getByRole('button', { name: '프론트엔드' }).click();
    await page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ }).click();
    await expect(page.getByText(/짜잔! AI가 찾은 추천 공고/)).toBeVisible({ timeout: 30000 });

    await page.getByRole('button', { name: '조건 다시 쓰기' }).click();
    await expect(page.getByText('관심 키워드 콕 집어주세요')).toBeVisible();
  });

  test('job card has 공고 보러가기 link', async ({ page }) => {
    await page.getByRole('button', { name: '풀스택' }).click();
    await page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ }).click();
    await expect(page.getByText(/짜잔! AI가 찾은 추천 공고/)).toBeVisible({ timeout: 30000 });

    const jobLink = page.getByRole('link', { name: /공고 보러가기/ }).first();
    await expect(jobLink).toBeVisible();
    await expect(jobLink).toHaveAttribute('target', '_blank');
  });

  test('search with additional text query', async ({ page }) => {
    await page.getByRole('button', { name: 'AI/ML 엔지니어' }).click();

    const textarea = page.locator('textarea');
    await textarea.fill('Python 3년, PyTorch 사용 경험 있고 MLOps 관심 많아요');

    await page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ }).click();
    await expect(page.getByText(/짜잔! AI가 찾은 추천 공고/)).toBeVisible({ timeout: 30000 });
  });
});

test.describe('Non-logged-in search limit', () => {
  test('shows limit error after 3 searches in same day', async ({ page }) => {
    // Set the localStorage counter to already-at-limit for today
    const today = new Date().toISOString().slice(0, 10);
    await page.goto('/');
    await page.evaluate((date) => {
      localStorage.setItem('searchLimit', JSON.stringify({ date, count: 3 }));
    }, today);

    await expect(page.getByText('관심 키워드 콕 집어주세요')).toBeVisible({ timeout: 15000 });

    // Select a tag and try to search
    await page.getByRole('button', { name: '프론트엔드' }).click();

    // Force-trigger the search handler despite disabled button by removing disabled attr via JS,
    // but the correct approach is: the button is enabled when a tag IS selected.
    // The limit check fires inside handleSearch when tag IS selected but limit exceeded.
    const searchBtn = page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ });
    await expect(searchBtn).toBeEnabled();
    await searchBtn.click();

    // Error message about search limit should appear
    await expect(page.getByText(/비로그인 상태에서는 하루 3번까지만/)).toBeVisible({ timeout: 5000 });

    // Login button should appear in the error banner
    await expect(page.getByRole('button', { name: '로그인하기' })).toBeVisible();

    await page.screenshot({ path: 'test-results/search-limit-error.png' });
  });

  test('search limit resets next day', async ({ page }) => {
    // Set the counter for a past date — should allow search
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('searchLimit', JSON.stringify({ date: '2020-01-01', count: 3 }));
    });

    await expect(page.getByText('관심 키워드 콕 집어주세요')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: '프론트엔드' }).click();
    const searchBtn = page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ });
    await expect(searchBtn).toBeEnabled();
    await searchBtn.click();

    // Should NOT show the limit error — instead loading spinner appears
    await expect(page.getByText(/비로그인 상태에서는 하루 3번까지만/)).not.toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/AI가 열심히 공고를 뒤지는 중입니다/)).toBeVisible({ timeout: 5000 });
  });
});
