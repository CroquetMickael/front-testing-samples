import { Link } from "@axa-fr/canopee-react/distributeur";
import type { ReactNode } from "react";
import { Link as RouterLink, type To } from "react-router";

type Props = { to: To; children: ReactNode; "aria-label"?: string };

/** AXA-styled link that navigates client-side through React Router. */
export const AppLink = ({ to, children, ...otherProps }: Props) => (
  <Link
    render={({ className }) => (
      <RouterLink className={className} to={to} {...otherProps}>
        {children}
      </RouterLink>
    )}
  />
);
