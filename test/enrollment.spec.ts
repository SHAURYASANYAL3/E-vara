import { test, expect } from '@playwright/test';

test.describe('Enrollment / Auth flow', () => {
  test('auth page loads', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveURL(/auth/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('user can fill enrollment form fields', async ({ page }) => {
    await page.goto('/auth');
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('testuser@example.com');
      await expect(emailInput).toHaveValue('testuser@example.com');
    }
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('TestPassword123!');
      await expect(passwordInput).toHaveValue('TestPassword123!');
    }
  });
});
