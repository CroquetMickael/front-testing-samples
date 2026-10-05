import "@testing-library/jest-dom/vitest";
import { setVitestCucumberConfiguration } from "@amiceli/vitest-cucumber";

// Gherkin keywords in French (Fonctionnalité, Scénario, Étant donné que, Quand, Alors…).
setVitestCucumberConfiguration({ language: "fr", predefinedSteps: [], mappedExamples: {} });

// No global `afterEach(cleanup)` here: vitest-cucumber runs every step as its own Vitest test,
// so a per-test cleanup would unmount the UI between "Étant donné" and "Alors".
// Clean up per scenario instead, inside describeFeature: `AfterEachScenario(() => cleanup())`.
