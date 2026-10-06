import { startMicrocks } from "./microcks.ts";

// Shared `globalSetup` of every sample (Vitest and Playwright): the returned function is the global teardown.
export default function setup() {
  return startMicrocks();
}
