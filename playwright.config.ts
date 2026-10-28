import { defineConfig } from '@playwright/test';

export default defineConfig({
 testDir: './tests/browser',
 fullyParallel: true,
 reporter: 'list',
 timeout: 20_000,
 use: {
  baseURL: 'http://127.0.0.1:4173',
  browserName: 'chromium',
  headless: true,
 },
 webServer: {
  command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
  url: 'http://127.0.0.1:4173/tests/fixtures/visual-editor.html',
  reuseExistingServer: !process.env.CI,
  timeout: 30_000,
 },
});
