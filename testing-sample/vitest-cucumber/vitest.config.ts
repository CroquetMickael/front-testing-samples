import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: fileURLToPath(new URL("../..", import.meta.url)),
  plugins: [react()],
  test: {
    name: "vitest-cucumber",
    environment: "jsdom",
    include: ["testing-sample/vitest-cucumber/specs/**/*.spec.{ts,tsx}"],
    setupFiles: ["testing-sample/vitest-cucumber/setup.ts"],
    passWithNoTests: true,
    // AXA components import their own CSS; jsdom does not need it.
    css: false,
  },
});
