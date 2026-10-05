import {
  ArticleRestitution,
  HeaderRestitution,
  Message,
  Restitution,
  SectionRestitution,
  SectionRestitutionColumn,
  SectionRestitutionRow,
  Tag,
  Title,
} from "@axa-fr/canopee-react/distributeur";
import { useParams } from "react-router";
import { useInsurance } from "../data/InsuranceStore";
import {
  CLAIM_STATUSES,
  CLAIM_TYPES,
  CONTRACT_TYPES,
  formatCurrency,
  formatDate,
} from "../data/referentials";
import { AppLink } from "../layout/AppLink";

export const ClaimDetailPage = () => {
  const { claimId } = useParams();
  const { claims, contracts } = useInsurance();
  const claim = claims.find((s) => s.id === claimId);

  if (!claim) {
    return (
      <>
        <Title>Sinistre introuvable</Title>
        <Message variant="error" title="Sinistre introuvable">
          Aucun sinistre ne correspond au numéro « {claimId} ».{" "}
          <AppLink to="/contrats">Retour à la liste</AppLink>
        </Message>
      </>
    );
  }

  const status = CLAIM_STATUSES[claim.status];
  const contract = contracts.find((c) => c.id === claim.contractId);

  return (
    <>
      <Title>Sinistre {claim.id}</Title>
      <AppLink to="/contrats">← Retour à la liste</AppLink>

      <ArticleRestitution aria-label={`Détail du sinistre ${claim.id}`}>
        <HeaderRestitution
          title={CLAIM_TYPES[claim.type]}
          subtitle={`Déclaré le ${formatDate(claim.createdAt)}`}
          rightTitle={<Tag variant={status.variant}>{status.label}</Tag>}
        />
        <SectionRestitution>
          <SectionRestitutionRow title="Circonstances">
            <SectionRestitutionColumn>
              <Restitution label="Nature">{CLAIM_TYPES[claim.type]}</Restitution>
              <Restitution label="Date de survenance">{formatDate(claim.occurredAt)}</Restitution>
              <Restitution label="Lieu">{claim.location}</Restitution>
            </SectionRestitutionColumn>
            <SectionRestitutionColumn>
              <Restitution label="Montant estimé">{formatCurrency(claim.estimatedAmount)}</Restitution>
              <Restitution label="Tiers impliqué">
                {claim.thirdPartyInvolved ? `Oui — ${claim.thirdPartyName ?? "non renseigné"}` : "Non"}
              </Restitution>
            </SectionRestitutionColumn>
          </SectionRestitutionRow>
          <SectionRestitutionRow title="Description">
            <p className="col-12 app-claim-description">{claim.description}</p>
          </SectionRestitutionRow>
          <SectionRestitutionRow title="Contrat concerné">
            <SectionRestitutionColumn>
              <Restitution label="N° contrat">
                <AppLink to={`/contrats/${claim.contractId}`}>{claim.contractId}</AppLink>
              </Restitution>
              {contract && <Restitution label="Assuré">{contract.holder}</Restitution>}
            </SectionRestitutionColumn>
            <SectionRestitutionColumn>
              {contract && <Restitution label="Type">{CONTRACT_TYPES[contract.type]}</Restitution>}
            </SectionRestitutionColumn>
          </SectionRestitutionRow>
        </SectionRestitution>
      </ArticleRestitution>
    </>
  );
};
