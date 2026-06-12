import { test, expect } from '@playwright/test';

test.describe('Dashboard viewing', () => {
  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('body')).toBeVisible();
  });

  test('dashboard contains main content area', async ({ page }) => {
    await page.goto('/dashboard');
    const main = page.locator('main, [role="main"], #root');
    await expect(main.first()).toBeVisible();
  });
});
