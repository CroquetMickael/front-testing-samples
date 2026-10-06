import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: fileURLToPath(new URL("../..", import.meta.url)),
  plugins: [react()],
  // Pre-bundle deps up front: a mid-run re-optimisation would load React twice ("null reading useState").
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-dev-runtime",
      "react-router",
      "react-hook-form",
      "@axa-fr/canopee-react/distributeur",
      "vitest-browser-react",
      "vitest-browser-react/pure",
      "@amiceli/vitest-cucumber/browser",
    ],
  },
  test: {
    name: "vitest-cucumber-browser",
    // Folder names matter: the browser `loadFeature` mis-resolves paths containing /src/ or /tests/.
    include: ["testing-sample/vitest-cucumber-browser/specs/**/*.spec.{ts,tsx}"],
    setupFiles: ["testing-sample/vitest-cucumber-browser/setup.ts"],
    globalSetup: ["testing-sample/microcks/global-setup.ts"],
    passWithNoTests: true,
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
