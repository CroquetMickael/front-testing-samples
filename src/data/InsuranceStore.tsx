import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Claim, Contract } from "./types";

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "CTR-0001",
    civility: "Mme",
    holder: "Marie Dupont",
    birthDate: "1985-02-14",
    email: "marie.dupont@example.com",
    phone: "06 12 34 56 78",
    address: "8 avenue Foch",
    postalCode: "69006",
    city: "Lyon",
    type: "auto",
    formula: "confort",
    options: ["assistance"],
    startDate: "2024-03-01",
    monthlyPremium: 50,
    status: "actif",
  },
  {
    id: "CTR-0002",
    civility: "M",
    holder: "Jean Martin",
    birthDate: "1972-11-03",
    email: "jean.martin@example.com",
    address: "21 rue Nationale",
    postalCode: "59000",
    city: "Lille",
    type: "habitation",
    formula: "premium",
    options: ["protection_juridique"],
    startDate: "2023-09-15",
    monthlyPremium: 74,
    status: "actif",
  },
  {
    id: "CTR-0003",
    civility: "Mme",
    holder: "Sophie Bernard",
    birthDate: "1996-07-22",
    email: "sophie.bernard@example.com",
    phone: "07 98 76 54 32",
    address: "3 place du Capitole",
    postalCode: "31000",
    city: "Toulouse",
    type: "sante",
    formula: "essentielle",
    options: [],
    startDate: "2025-01-10",
    monthlyPremium: 25,
    status: "en_attente",
  },
  {
    id: "CTR-0004",
    civility: "M",
    holder: "Luc Petit",
    birthDate: "1960-05-30",
    email: "luc.petit@example.com",
    address: "45 cours Mirabeau",
    postalCode: "13100",
    city: "Aix-en-Provence",
    type: "prevoyance",
    formula: "confort",
    options: [],
    startDate: "2021-06-01",
    monthlyPremium: 45,
    status: "resilie",
  },
];

const INITIAL_CLAIMS: Claim[] = [
  {
    id: "SIN-0001",
    contractId: "CTR-0001",
    type: "bris_de_glace",
    occurredAt: "2026-08-12",
    location: "Paris",
    description: "Pare-brise fissuré suite à une projection de gravillon.",
    estimatedAmount: 450,
    thirdPartyInvolved: false,
    status: "en_cours",
    createdAt: "2026-08-13",
  },
];

type InsuranceStore = {
  contracts: Contract[];
  claims: Claim[];
  addContract: (contract: Omit<Contract, "id" | "status">) => Contract;
  addClaim: (claim: Omit<Claim, "id" | "status" | "createdAt">) => Claim;
};

const InsuranceContext = createContext<InsuranceStore | null>(null);

const nextId = (prefix: string, count: number) => `${prefix}-${String(count + 1).padStart(4, "0")}`;

export const InsuranceProvider = ({ children }: { children: ReactNode }) => {
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [claims, setClaims] = useState(INITIAL_CLAIMS);

  const addContract = useCallback<InsuranceStore["addContract"]>(
    (data) => {
      const contract: Contract = { ...data, id: nextId("CTR", contracts.length), status: "en_attente" };
      setContracts((prev) => [...prev, contract]);
      return contract;
    },
    [contracts.length],
  );

  const addClaim = useCallback<InsuranceStore["addClaim"]>(
    (data) => {
      const claim: Claim = {
        ...data,
        id: nextId("SIN", claims.length),
        status: "ouvert",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setClaims((prev) => [...prev, claim]);
      return claim;
    },
    [claims.length],
  );

  const value = useMemo(
    () => ({ contracts, claims, addContract, addClaim }),
    [contracts, claims, addContract, addClaim],
  );

  return <InsuranceContext.Provider value={value}>{children}</InsuranceContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInsurance = () => {
  const ctx = useContext(InsuranceContext);
  if (!ctx) throw new Error("useInsurance must be used within InsuranceProvider");
  return ctx;
};
