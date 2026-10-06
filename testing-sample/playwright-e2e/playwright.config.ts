import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  globalSetup: "../microcks/global-setup.ts",
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
