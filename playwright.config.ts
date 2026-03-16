import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
