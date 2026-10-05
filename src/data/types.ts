export type ContractType = "auto" | "habitation" | "sante" | "prevoyance";
export type ContractStatus = "actif" | "en_attente" | "resilie";
export type Formula = "essentielle" | "confort" | "premium";

export type Civility = "M" | "Mme";

export type Contract = {
  id: string;
  civility: Civility;
  holder: string;
  birthDate: string;
  email: string;
  phone?: string;
  address: string;
  postalCode: string;
  city: string;
  type: ContractType;
  formula: Formula;
  options: string[];
  startDate: string;
  monthlyPremium: number;
  status: ContractStatus;
};

export type ClaimType = "accident" | "vol" | "degat_des_eaux" | "incendie" | "bris_de_glace" | "autre";
export type ClaimStatus = "ouvert" | "en_cours" | "clos";

export type Claim = {
  id: string;
  contractId: string;
  type: ClaimType;
  occurredAt: string;
  location: string;
  description: string;
  estimatedAmount: number;
  thirdPartyInvolved: boolean;
  thirdPartyName?: string;
  status: ClaimStatus;
  createdAt: string;
};
