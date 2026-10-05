import {
  Footer,
  Header,
  MainContainer,
  Name,
  NavBar,
  NavBarItem,
  User,
} from "@axa-fr/canopee-react/distributeur";
import logo from "@axa-fr/canopee-css/logo-axa.svg";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

const NAV_ITEMS = [
  { to: "/contrats", label: "Contrats" },
  { to: "/souscription", label: "Nouvelle souscription" },
  { to: "/sinistres/declaration", label: "Déclarer un sinistre" },
];

export const AppLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => pathname.startsWith(item.to)),
  );

  return (
    <>
      <Header>
        <Name
          title="Gestion Assurance"
          subtitle="Espace conseiller"
          img={logo}
          alt="AXA"
          onClick={() => navigate("/")}
        />
        <User name="Camille Conseil" profile="Conseiller" />
      </Header>
      <NavBar
        key={pathname}
        positionInit={activeIndex}
        isVisible={isMenuVisible}
        onClick={() => setIsMenuVisible(false)}
      >
        {NAV_ITEMS.map((item) => (
          <NavBarItem
            key={item.to}
            actionElt={
              <Link className="af-nav__link" to={item.to}>
                {item.label}
              </Link>
            }
          />
        ))}
      </NavBar>
      <MainContainer className="af-container af-main-container app-main">
        <Outlet />
      </MainContainer>
      <Footer version="sample" />
    </>
  );
};
