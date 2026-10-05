import { createBrowserRouter, RouterProvider } from "react-router";
import { InsuranceProvider } from "./data/InsuranceStore";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

export const App = () => (
  <InsuranceProvider>
    <RouterProvider router={router} />
  </InsuranceProvider>
);
