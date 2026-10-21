import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e', testIgnore: process.env.CMS_QA === 'true' ? [] : ['**/admin.spec.ts'], fullyParallel: false, workers: 2, timeout: 60000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000', browserName:'chromium', launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox'] }, trace:'retain-on-failure' },
})
