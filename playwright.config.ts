import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!(process && process.env && process.env.CI),
  /* Retry on CI only */
  retries: (process && process.env && process.env.CI) ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: (process && process.env && process.env.CI) ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://facelink-poc.cultive8.lk',

    /* Collect trace when retrying a failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Headless mode or visual */
    headless: true,

    /* Capture screenshot when failure occurs */
    screenshot: 'only-on-failure',

    /* Default viewport size */
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
