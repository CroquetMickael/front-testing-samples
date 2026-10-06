import { test as base, createBdd } from "playwright-bdd";

// Add custom fixtures here (page objects, test data…) with `base.extend<{ ... }>({ ... })`.
export const test = base;

// Step definitions: `import { Given, When, Then } from "./fixtures";`
export const { Given, When, Then } = createBdd(test);
