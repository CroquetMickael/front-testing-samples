import type { FieldPath } from "react-hook-form";
import type { ContractType, Formula } from "../../data/types";

export type SubscriptionFormValues = {
  civility: "M" | "Mme" | "";
  lastName: string;
  firstName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  contractType: ContractType | "";
  startDate: string;
  formula: Formula | "";
  options: string[];
  acceptTerms: boolean;
};

export const DEFAULT_VALUES: SubscriptionFormValues = {
  civility: "",
  lastName: "",
  firstName: "",
  birthDate: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  contractType: "",
  startDate: "",
  formula: "",
  options: [],
  acceptTerms: false,
};

export type StepDefinition = {
  id: string;
  title: string;
  fields: FieldPath<SubscriptionFormValues>[];
};

export const STEPS: StepDefinition[] = [
  {
    id: "assure",
    title: "Assuré",
    fields: ["civility", "lastName", "firstName", "birthDate", "email", "phone"],
  },
  { id: "adresse", title: "Adresse", fields: ["address", "postalCode", "city"] },
  { id: "contrat", title: "Contrat", fields: ["contractType", "startDate", "formula", "options"] },
  { id: "recapitulatif", title: "Récapitulatif", fields: ["acceptTerms"] },
];
