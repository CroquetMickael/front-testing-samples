import {
  Button,
  Message,
  SelectInput,
  Table,
  TBody,
  Td,
  TextInput,
  Th,
  THead,
  Title,
  Tr,
  Tag,
} from "@axa-fr/canopee-react/distributeur";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useInsurance } from "../data/InsuranceStore";
import { AppLink } from "../layout/AppLink";
import {
  CLAIM_STATUSES,
  CLAIM_TYPES,
  CONTRACT_STATUSES,
  CONTRACT_TYPES,
  FORMULAS,
  formatCurrency,
  formatDate,
  toOptions,
} from "../data/referentials";

export type FlashState = { flash?: string };

export const ContractsPage = () => {
  const { contracts, claims } = useInsurance();
  const navigate = useNavigate();
  const location = useLocation();
  const [flash, setFlash] = useState((location.state as FlashState | null)?.flash);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const filteredContracts = useMemo(
    () =>
      contracts.filter(
        (c) =>
          (!type || c.type === type) &&
          `${c.id} ${c.holder}`.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [contracts, search, type],
  );

  return (
    <>
      <Title contentRight={<Button onClick={() => navigate("/souscription")}>Nouvelle souscription</Button>}>
        Contrats
      </Title>

      {flash && (
        <Message variant="success" title="Opération réussie" onClose={() => setFlash(undefined)}>
          {flash}
        </Message>
      )}

      <section aria-label="Filtres" className="app-filters">
        <TextInput
          label="Rechercher"
          placeholder="N° de contrat ou nom de l'assuré"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          labelPosition="top"
          classNameContainerLabel="col-12"
          classNameContainerInput="col-12"
        />
        <SelectInput
          label="Type de contrat"
          placeholder="Tous"
          options={toOptions(CONTRACT_TYPES)}
          value={type}
          onChange={(e) => setType(e.target.value)}
          labelPosition="top"
          classNameContainerLabel="col-12"
          classNameContainerInput="col-12"
        />
      </section>

      <Table aria-label="Liste des contrats">
        <THead>
          <Tr>
            <Th>N° contrat</Th>
            <Th>Assuré</Th>
            <Th>Type</Th>
            <Th>Formule</Th>
            <Th>Date d'effet</Th>
            <Th>Prime mensuelle</Th>
            <Th>Statut</Th>
          </Tr>
        </THead>
        <TBody>
          {filteredContracts.length === 0 ? (
            <Tr>
              <Td colSpan={7}>Aucun contrat ne correspond à votre recherche.</Td>
            </Tr>
          ) : (
            filteredContracts.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <AppLink to={`/contrats/${c.id}`}>{c.id}</AppLink>
                </Td>
                <Td>{c.holder}</Td>
                <Td>{CONTRACT_TYPES[c.type]}</Td>
                <Td>{FORMULAS[c.formula].label}</Td>
                <Td>{formatDate(c.startDate)}</Td>
                <Td>{formatCurrency(c.monthlyPremium)}</Td>
                <Td>
                  <Tag variant={CONTRACT_STATUSES[c.status].variant}>{CONTRACT_STATUSES[c.status].label}</Tag>
                </Td>
              </Tr>
            ))
          )}
        </TBody>
      </Table>

      <Title
        heading="h3"
        contentRight={
          <Button variant="secondary" onClick={() => navigate("/sinistres/declaration")}>
            Déclarer un sinistre
          </Button>
        }
      >
        Sinistres
      </Title>
      <Table aria-label="Liste des sinistres">
        <THead>
          <Tr>
            <Th>N° sinistre</Th>
            <Th>Contrat</Th>
            <Th>Nature</Th>
            <Th>Survenu le</Th>
            <Th>Montant estimé</Th>
            <Th>Statut</Th>
          </Tr>
        </THead>
        <TBody>
          {claims.map((s) => (
            <Tr key={s.id}>
              <Td>
                <AppLink to={`/sinistres/${s.id}`}>{s.id}</AppLink>
              </Td>
              <Td>
                <AppLink to={`/contrats/${s.contractId}`}>{s.contractId}</AppLink>
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
    </>
  );
};
