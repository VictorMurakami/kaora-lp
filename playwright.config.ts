import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
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
