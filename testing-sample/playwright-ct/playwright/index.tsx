import { beforeMount } from "@playwright/experimental-ct-react/hooks";
import { TestProviders } from "../../shared/TestApp";

export type HooksConfig = {
  /** Wraps the mounted component with router + store. Not needed when mounting <TestApp />. */
  withProviders?: boolean;
  initialPath?: string;
  routePath?: string;
};

beforeMount<HooksConfig>(async ({ App, hooksConfig }) => {
  if (!hooksConfig?.withProviders) return <App />;
  return (
    <TestProviders initialPath={hooksConfig.initialPath} routePath={hooksConfig.routePath}>
      <App />
    </TestProviders>
  );
});
