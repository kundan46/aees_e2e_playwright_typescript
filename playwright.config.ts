import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retry logic implemented
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']], // HTML Report generation
  expect: {
    timeout: 10000,
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
  use: {
    headless: true,
    launchOptions: { args: ['--start-minimized'] },
    baseURL: 'https://testautomationpractice.blogspot.com',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
