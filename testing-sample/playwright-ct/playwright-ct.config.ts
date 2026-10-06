import { defineConfig, devices } from "@playwright/experimental-ct-react";

export default defineConfig({
  testDir: "./tests",
  snapshotDir: "./__snapshots__",
  outputDir: "./test-results",
  globalSetup: "../microcks/global-setup.ts",
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { outputFolder: "./playwright-report", open: "never" }]],
  use: {
    trace: "on-first-retry",
    ctPort: 3100,
    ctTemplateDir: "./playwright",
    ctCacheDir: "./playwright/.cache",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
