import {
  ArticleRestitution,
  Button,
  HeaderRestitution,
  Message,
  Restitution,
  RestitutionList,
  SectionRestitution,
  SectionRestitutionColumn,
  SectionRestitutionRow,
  Table,
  Tag,
  TBody,
  Td,
  Th,
  THead,
  Title,
  Tr,
} from "@axa-fr/canopee-react/distributeur";
import { useNavigate, useParams } from "react-router";
import { useInsurance } from "../data/InsuranceStore";
import {
  CLAIM_STATUSES,
  CLAIM_TYPES,
  CONTRACT_STATUSES,
  CONTRACT_TYPES,
  formatCurrency,
  formatDate,
  FORMULAS,
  OPTIONS,
} from "../data/referentials";
import { AppLink } from "../layout/AppLink";

export const ContractDetailPage = () => {
  const { contractId } = useParams();
  const { contracts, claims } = useInsurance();
  const navigate = useNavigate();
  const contract = contracts.find((c) => c.id === contractId);

  if (!contract) {
    return (
      <>
        <Title>Contrat introuvable</Title>
        <Message variant="error" title="Contrat introuvable">
          Aucun contrat ne correspond au numéro « {contractId} ».{" "}
          <AppLink to="/contrats">Retour à la liste des contrats</AppLink>
        </Message>
      </>
    );
  }

  const status = CONTRACT_STATUSES[contract.status];
  const relatedClaims = claims.filter((s) => s.contractId === contract.id);

  return (
    <>
      <Title
        contentRight={
          contract.status === "actif" && (
            <Button onClick={() => navigate(`/sinistres/declaration?contrat=${contract.id}`)}>
              Déclarer un sinistre
            </Button>
          )
        }
      >
        Contrat {contract.id}
      </Title>
      <AppLink to="/contrats">← Retour à la liste</AppLink>

      <ArticleRestitution aria-label={`Détail du contrat ${contract.id}`}>
        <HeaderRestitution
          title={`${CONTRACT_TYPES[contract.type]} — Formule ${FORMULAS[contract.formula].label}`}
          subtitle={contract.holder}
          rightTitle={<Tag variant={status.variant}>{status.label}</Tag>}
        />
        <SectionRestitution>
          <SectionRestitutionRow title="Assuré">
            <SectionRestitutionColumn>
              <Restitution label="Civilité">{contract.civility === "M" ? "Monsieur" : "Madame"}</Restitution>
              <Restitution label="Nom complet">{contract.holder}</Restitution>
              <Restitution label="Date de naissance">{formatDate(contract.birthDate)}</Restitution>
            </SectionRestitutionColumn>
            <SectionRestitutionColumn>
              <Restitution label="E-mail">{contract.email}</Restitution>
              <Restitution label="Téléphone">{contract.phone}</Restitution>
              <Restitution label="Adresse">
                {contract.address}, {contract.postalCode} {contract.city}
              </Restitution>
            </SectionRestitutionColumn>
          </SectionRestitutionRow>
          <SectionRestitutionRow title="Contrat">
            <SectionRestitutionColumn>
              <Restitution label="Type">{CONTRACT_TYPES[contract.type]}</Restitution>
              <Restitution label="Formule">{FORMULAS[contract.formula].label}</Restitution>
              <Restitution label="Date d'effet">{formatDate(contract.startDate)}</Restitution>
            </SectionRestitutionColumn>
            <SectionRestitutionColumn>
              <Restitution label="Prime mensuelle">{formatCurrency(contract.monthlyPremium)}</Restitution>
              <Restitution label="Options">
                {contract.options.length > 0 ? (
                  <RestitutionList values={contract.options.map((o) => OPTIONS[o].label)} />
                ) : (
                  "Aucune"
                )}
              </Restitution>
            </SectionRestitutionColumn>
          </SectionRestitutionRow>
        </SectionRestitution>
      </ArticleRestitution>

      <Title heading="h3">Sinistres liés</Title>
      {relatedClaims.length === 0 ? (
        <p>Aucun sinistre déclaré sur ce contrat.</p>
      ) : (
        <Table aria-label="Sinistres liés au contrat">
          <THead>
            <Tr>
              <Th>N° sinistre</Th>
              <Th>Nature</Th>
              <Th>Survenu le</Th>
              <Th>Montant estimé</Th>
              <Th>Statut</Th>
            </Tr>
          </THead>
          <TBody>
            {relatedClaims.map((s) => (
              <Tr key={s.id}>
                <Td>
                  <AppLink to={`/sinistres/${s.id}`}>{s.id}</AppLink>
                </Td>
                <Td>{CLAIM_TYPES[s.type]}</Td>
                <Td>{formatDate(s.occurredAt)}</Td>
                <Td>{formatCurrency(s.estimatedAmount)}</Td>
                <Td>
                  <Tag variant={CLAIM_STATUSES[s.status].variant}>{CLAIM_STATUSES[s.status].label}</Tag>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
};
