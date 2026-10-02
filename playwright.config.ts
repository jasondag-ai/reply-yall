import { defineConfig, devices } from '@playwright/test'

// Runs against the built site (npm run build first), or a live URL:
//   BASE_URL=https://jasondag-ai.github.io/reply-yall/ npx playwright test
const liveUrl = process.env.BASE_URL
const localUrl = 'http://localhost:4173/reply-yall/'
const iPhone = { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }

export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: liveUrl ?? localUrl },
  webServer: liveUrl
    ? undefined
    : {
        command: 'npx vite preview --port 4173 --strictPort',
        url: localUrl,
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    { name: 'iphone-webkit', use: iPhone },
    { name: 'iphone-chromium', use: { ...iPhone, defaultBrowserType: 'chromium' } },
  ],
})
