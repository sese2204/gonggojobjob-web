import { test, expect } from '@playwright/test';

test.describe('Legal pages', () => {
  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/privacy');
    // Match the h1 heading specifically to avoid strict mode violation
    await expect(page.getByRole('heading', { name: '개인정보처리방침', exact: true })).toBeVisible({ timeout: 15000 });
  });

  test('terms of service page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByText(/이용약관/)).toBeVisible({ timeout: 15000 });
  });

  test('clicking privacy policy link from footer navigates correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /공고줍줍/ })).toBeVisible({ timeout: 15000 });

    await page.locator('footer').getByRole('link', { name: '개인정보처리방침' }).click();
    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.getByRole('heading', { name: '개인정보처리방침', exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('clicking terms link from footer navigates correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /공고줍줍/ })).toBeVisible({ timeout: 15000 });

    await page.locator('footer').getByRole('link', { name: '이용약관' }).click();
    await expect(page).toHaveURL(/\/terms/);
    await expect(page.getByText(/이용약관/)).toBeVisible({ timeout: 10000 });
  });
});
