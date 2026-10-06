import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import { fileURLToPath } from "node:url";

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

// Generates Playwright specs from the .feature files (run by `bddgen` before `playwright test`).
const testDir = defineBddConfig({
  features: "./features/**/*.feature",
  steps: "./steps/**/*.ts",
  outputDir: "./.features-gen",
  language: "fr",
});

export default defineConfig({
  testDir,
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { outputFolder: "./playwright-report", open: "never" }]],
  use: {
    baseURL: BASE_URL,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Starts the real app (Vite dev server); reuses an already running `npm run dev` locally.
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    cwd: fileURLToPath(new URL("../..", import.meta.url)),
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
