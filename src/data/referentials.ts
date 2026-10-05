import type { TagVariants } from "@axa-fr/canopee-react/distributeur";
import type { ClaimStatus, ClaimType, ContractStatus, ContractType, Formula } from "./types";

export const CONTRACT_TYPES: Record<ContractType, string> = {
  auto: "Automobile",
  habitation: "Habitation",
  sante: "Santé",
  prevoyance: "Prévoyance",
};

export const CONTRACT_STATUSES: Record<ContractStatus, { label: string; variant: TagVariants }> = {
  actif: { label: "Actif", variant: "success" },
  en_attente: { label: "En attente", variant: "warning" },
  resilie: { label: "Résilié", variant: "gray" },
};

export const FORMULAS: Record<Formula, { label: string; description: string; basePremium: number }> = {
  essentielle: { label: "Essentielle", description: "Les garanties indispensables", basePremium: 25 },
  confort: { label: "Confort", description: "Un équilibre garanties / prix", basePremium: 45 },
  premium: { label: "Premium", description: "La couverture la plus complète", basePremium: 70 },
};

export const OPTIONS: Record<string, { label: string; price: number }> = {
  assistance: { label: "Assistance 0 km", price: 5 },
  protection_juridique: { label: "Protection juridique", price: 4 },
  bris_de_glace: { label: "Bris de glace", price: 3 },
  vehicule_remplacement: { label: "Véhicule de remplacement", price: 6 },
};

export const CLAIM_TYPES: Record<ClaimType, string> = {
  accident: "Accident",
  vol: "Vol",
  degat_des_eaux: "Dégât des eaux",
  incendie: "Incendie",
  bris_de_glace: "Bris de glace",
  autre: "Autre",
};

export const CLAIM_STATUSES: Record<ClaimStatus, { label: string; variant: TagVariants }> = {
  ouvert: { label: "Ouvert", variant: "information" },
  en_cours: { label: "En cours", variant: "warning" },
  clos: { label: "Clos", variant: "gray" },
};

export const toOptions = (record: Record<string, string | { label: string }>) =>
  Object.entries(record).map(([value, v]) => ({
    value,
    label: typeof v === "string" ? v : v.label,
  }));

export const computePremium = (formula: Formula, options: string[]) =>
  FORMULAS[formula].basePremium + options.reduce((sum, o) => sum + (OPTIONS[o]?.price ?? 0), 0);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");
