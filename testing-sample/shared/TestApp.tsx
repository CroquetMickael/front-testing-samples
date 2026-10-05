import { useState, type ReactNode } from "react";
import { createMemoryRouter, MemoryRouter, Route, RouterProvider, Routes } from "react-router";
import { InsuranceProvider } from "../../src/data/InsuranceStore";
import { routes } from "../../src/routes";

type TestAppProps = {
  /** URL at which the app starts, e.g. "/souscription". */
  initialPath?: string;
};

/** Whole app (layout + every route) on an in-memory router, with a fresh store. */
export const TestApp = ({ initialPath = "/" }: TestAppProps) => {
  const [router] = useState(() => createMemoryRouter(routes, { initialEntries: [initialPath] }));
  return (
    <InsuranceProvider>
      <RouterProvider router={router} />
    </InsuranceProvider>
  );
};

type TestProvidersProps = {
  children: ReactNode;
  /** URL at which the component starts. */
  initialPath?: string;
  /** Route pattern used to resolve params, e.g. "/contrats/:contractId". */
  routePath?: string;
};

/** Renders a single page/component with the providers it needs (router + store). */
export const TestProviders = ({ children, initialPath = "/", routePath = "*" }: TestProvidersProps) => (
  <InsuranceProvider>
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={routePath} element={children} />
      </Routes>
    </MemoryRouter>
  </InsuranceProvider>
);
