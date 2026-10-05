// Browser entry point of vitest-cucumber: features are fetched from the Vite server instead of read from disk.
import { setVitestCucumberConfiguration } from "@amiceli/vitest-cucumber/browser";

// Gherkin keywords in French (Fonctionnalité, Scénario, Étant donné que, Quand, Alors…).
setVitestCucumberConfiguration({ language: "fr", predefinedSteps: [], mappedExamples: {} });

// `vitest-browser-react` is deliberately NOT imported here: its main entry cleans up before every test,
// and vitest-cucumber runs every step as its own test. Import from "vitest-browser-react/pure" in specs
// and clean up per scenario: `AfterEachScenario(() => cleanup())`.
