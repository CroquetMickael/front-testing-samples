import { Message, Title } from "@axa-fr/canopee-react/distributeur";
import { AppLink } from "../layout/AppLink";

export const NotFoundPage = () => (
  <>
    <Title>Page introuvable</Title>
    <Message variant="warning" title="Erreur 404">
      La page demandée n'existe pas. <AppLink to="/contrats">Retour à la liste des contrats</AppLink>
    </Message>
  </>
);
