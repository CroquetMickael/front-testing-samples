import { Navigate, type RouteObject } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { ClaimDetailPage } from "./pages/ClaimDetailPage";
import { ClaimFormPage } from "./pages/ClaimFormPage";
import { ContractDetailPage } from "./pages/ContractDetailPage";
import { ContractsPage } from "./pages/ContractsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SubscriptionPage } from "./pages/subscription/SubscriptionPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/contrats" replace /> },
      { path: "contrats", element: <ContractsPage /> },
      { path: "contrats/:contractId", element: <ContractDetailPage /> },
      { path: "souscription", element: <SubscriptionPage /> },
      { path: "sinistres/declaration", element: <ClaimFormPage /> },
      { path: "sinistres/:claimId", element: <ClaimDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
