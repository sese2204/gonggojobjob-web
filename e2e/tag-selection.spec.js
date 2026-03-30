import { test, expect } from '@playwright/test';

const CATEGORIES = [
  '💻 개발',
  '🎨 기획/디자인',
  '📈 마케팅/비즈니스',
  '💼 경영/사무/인사',
  '🤝 영업/고객상담',
  '📝 미디어/콘텐츠',
];

const DEV_TAGS = ['프론트엔드', '백엔드', '풀스택', 'AI/ML 엔지니어'];

test.describe('Tag selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('관심 키워드 콕 집어주세요')).toBeVisible({ timeout: 15000 });
    // Clear any persisted search limit that could interfere
    await page.evaluate(() => localStorage.clear());
  });

  test('all 6 category tabs are rendered', async ({ page }) => {
    for (const cat of CATEGORIES) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('default active category is 💻 개발', async ({ page }) => {
    const devBtn = page.getByRole('button', { name: '💻 개발' });
    await expect(devBtn).toHaveClass(/bg-blue-50/);
  });

  test('switching category changes visible tags', async ({ page }) => {
    // Switch to 기획/디자인
    await page.getByRole('button', { name: '🎨 기획/디자인' }).click();

    // Tags from design category should appear
    await expect(page.getByRole('button', { name: 'UX/UI 디자이너' })).toBeVisible();
    await expect(page.getByRole('button', { name: '서비스 기획자' })).toBeVisible();

    // Dev-specific tag should not be visible
    await expect(page.getByRole('button', { name: '프론트엔드' })).not.toBeVisible();
  });

  test('selecting a tag highlights it and adds to selected list', async ({ page }) => {
    const frontendBtn = page.getByRole('button', { name: '프론트엔드' });
    await frontendBtn.click();

    // Tag button turns blue
    await expect(frontendBtn).toHaveClass(/bg-blue-600/);

    // Selected tags chip area appears
    await expect(page.getByText('내가 찜한 키워드')).toBeVisible();
    await expect(page.locator('.bg-blue-50\\/50').getByText('프론트엔드')).toBeVisible();
  });

  test('selecting multiple tags across categories', async ({ page }) => {
    // Select 프론트엔드 from 개발
    await page.getByRole('button', { name: '프론트엔드' }).click();

    // Switch to 기획/디자인 and select a tag there
    await page.getByRole('button', { name: '🎨 기획/디자인' }).click();
    await page.getByRole('button', { name: 'UX/UI 디자이너' }).click();

    // Both should appear in the selected chips
    const chipsArea = page.locator('.bg-blue-50\\/50');
    await expect(chipsArea.getByText('프론트엔드')).toBeVisible();
    await expect(chipsArea.getByText('UX/UI 디자이너')).toBeVisible();
    await expect(page.getByText('내가 찜한 키워드 (2개)')).toBeVisible();
  });

  test('deselecting a tag removes it from the selected list', async ({ page }) => {
    // Select then deselect
    const frontendBtn = page.getByRole('button', { name: '프론트엔드' });
    await frontendBtn.click();
    await expect(page.getByText('내가 찜한 키워드 (1개)')).toBeVisible();

    await frontendBtn.click();

    await expect(page.getByText('내가 찜한 키워드')).not.toBeVisible();
  });

  test('removing tag via X button in chip works', async ({ page }) => {
    await page.getByRole('button', { name: '프론트엔드' }).click();
    await expect(page.getByText('내가 찜한 키워드 (1개)')).toBeVisible();

    // Click the X button inside the chip
    const chip = page.locator('.bg-blue-50\\/50 span').filter({ hasText: '프론트엔드' });
    await chip.locator('button').click();

    await expect(page.getByText('내가 찜한 키워드')).not.toBeVisible();
  });

  test('search button is disabled when no tags selected', async ({ page }) => {
    const searchBtn = page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ });
    await expect(searchBtn).toBeDisabled();
  });

  test('search button becomes enabled after selecting a tag', async ({ page }) => {
    await page.getByRole('button', { name: '프론트엔드' }).click();
    const searchBtn = page.getByRole('button', { name: /내 조건에 맞는 공고 찾아보기/ });
    await expect(searchBtn).toBeEnabled();
  });

  test('textarea placeholder changes per active category', async ({ page }) => {
    const textarea = page.locator('textarea');
    const devPlaceholder = await textarea.getAttribute('placeholder');
    expect(devPlaceholder).toContain('Spring Boot');

    await page.getByRole('button', { name: '🎨 기획/디자인' }).click();
    const designPlaceholder = await textarea.getAttribute('placeholder');
    expect(designPlaceholder).toContain('Figma');
  });
});
