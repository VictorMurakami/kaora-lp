import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Shared runners render WebGL in software and run slower than a laptop, so
  // CI gets longer assertion waits and retries; retried passes show as flaky.
  retries: process.env.CI ? 2 : 0,
  expect: { timeout: process.env.CI ? 15_000 : 5_000 },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  // Without locale routes the first visit follows Accept-Language; pin it to
  // the source language so tests read the pt-BR copy unless they choose otherwise.
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry', locale: 'pt-BR' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
