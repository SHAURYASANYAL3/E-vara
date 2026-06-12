import { test, expect } from '@playwright/test';

test.describe('Trust Center actions', () => {
  test('trust center page loads', async ({ page }) => {
    await page.goto('/trust-center');
    await expect(page.locator('body')).toBeVisible();
  });

  test('trust center displays headings and buttons', async ({ page }) => {
    await page.goto('/trust-center');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const buttons = page.locator('button');
    expect(await buttons.count()).toBeGreaterThan(0);
  });
});
