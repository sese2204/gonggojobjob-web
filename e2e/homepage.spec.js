import { test, expect } from '@playwright/test';

test.describe('Homepage loads correctly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to hydrate — the nav logo text is a reliable signal
    await expect(page.getByRole('button', { name: /공고줍줍/ })).toBeVisible({ timeout: 15000 });
  });

  test('page title and favicon are set', async ({ page }) => {
    await expect(page).toHaveTitle(/공고줍줍/);
    // Favicon link tag is present (count >= 1)
    const faviconCount = await page.locator('link[rel*="icon"]').count();
    expect(faviconCount).toBeGreaterThanOrEqual(1);
  });

  test('nav has logo image and brand text', async ({ page }) => {
    const navBtn = page.getByRole('button', { name: /공고줍줍/ });
    await expect(navBtn).toBeVisible();
    const logoImg = navBtn.locator('img[alt="공고줍줍"]');
    await expect(logoImg).toBeVisible();
    await expect(navBtn).toContainText('공고줍줍');
  });

  test('main headline is visible', async ({ page }) => {
    await expect(page.getByText('제가 취준하려고 만든 AI 공고 검색기')).toBeVisible();
  });

  test('Google OAuth login button is present', async ({ page }) => {
    // The nav shows "새 공고 알림받기" (login) button for non-logged-in users
    const loginBtn = page.getByRole('button', { name: /새 공고 알림받기/ });
    await expect(loginBtn).toBeVisible();
  });

  test('footer shows job stats with Database and Briefcase icons', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Stats text is present
    await expect(footer.getByText(/현재 채용 중인 공고/)).toBeVisible();
    await expect(footer.getByText(/오늘 봇이 새로 주워온 공고/)).toBeVisible();

    // SVG icons from lucide-react render as <svg> elements inside footer (Database + Briefcase + others)
    const svgCount = await footer.locator('svg').count();
    expect(svgCount).toBeGreaterThanOrEqual(2);
  });

  test('footer stats values load (not stuck on ellipsis)', async ({ page }) => {
    // Stats are fetched from the API; allow up to 10s for them to resolve
    const totalStat = page.locator('footer').getByText(/현재 채용 중인 공고/).locator('..').locator('strong');
    await expect(totalStat).not.toHaveText('...', { timeout: 10000 });
    await expect(totalStat).toHaveText(/\d/, { timeout: 10000 });
  });

  test('privacy policy link is present in footer', async ({ page }) => {
    const privacyLink = page.locator('footer').getByRole('link', { name: '개인정보처리방침' });
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  test('terms of service link is present in footer', async ({ page }) => {
    const termsLink = page.locator('footer').getByRole('link', { name: '이용약관' });
    await expect(termsLink).toBeVisible();
    await expect(termsLink).toHaveAttribute('href', '/terms');
  });
});
