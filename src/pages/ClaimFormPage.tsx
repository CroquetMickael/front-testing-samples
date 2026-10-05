import {
  Button,
  CheckboxInput,
  DateInput,
  MandatoryMention,
  Message,
  RadioInput,
  SelectInput,
  TextareaInput,
  TextInput,
  Title,
} from "@axa-fr/canopee-react/distributeur";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { useInsurance } from "../data/InsuranceStore";
import { CLAIM_TYPES, CONTRACT_TYPES, toOptions } from "../data/referentials";
import type { ClaimType } from "../data/types";
import { fieldError, isPastDate, todayIso } from "../forms/fieldError";
import type { FlashState } from "./ContractsPage";

type ClaimFormValues = {
  contractId: string;
  type: ClaimType | "";
  occurredAt: string;
  location: string;
  description: string;
  estimatedAmount: string;
  thirdPartyInvolved: "oui" | "non" | "";
  thirdPartyName: string;
  certify: boolean;
};

const DEFAULT_VALUES: ClaimFormValues = {
  contractId: "",
  type: "",
  occurredAt: "",
  location: "",
  description: "",
  estimatedAmount: "",
  thirdPartyInvolved: "",
  thirdPartyName: "",
  certify: false,
};

const YES_NO = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
];

export const ClaimFormPage = () => {
  const { contracts, addClaim } = useInsurance();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount, isValid },
  } = useForm<ClaimFormValues>({
    defaultValues: { ...DEFAULT_VALUES, contractId: searchParams.get("contrat") ?? "" },
    mode: "onTouched",
  });

  const thirdPartyInvolved = useWatch({ control, name: "thirdPartyInvolved" });
  const activeContracts = contracts.filter((c) => c.status === "actif");

  const onSubmit = async (values: ClaimFormValues) => {
    // Simulates a network call so that loading states can be tested.
    await new Promise((resolve) => setTimeout(resolve, 500));
    const claim = addClaim({
      contractId: values.contractId,
      type: values.type as ClaimType,
      occurredAt: values.occurredAt,
      location: values.location,
      description: values.description,
      estimatedAmount: Number(values.estimatedAmount),
      thirdPartyInvolved: values.thirdPartyInvolved === "oui",
      thirdPartyName: values.thirdPartyName || undefined,
    });
    navigate("/contrats", {
      state: { flash: `Le sinistre ${claim.id} a bien été déclaré.` } satisfies FlashState,
    });
  };

  return (
    <>
      <Title>Déclarer un sinistre</Title>
      <MandatoryMention variant="one" />

      {submitCount > 0 && !isValid && (
        <Message variant="error" title="Le formulaire contient des erreurs">
          Veuillez corriger les champs signalés avant de valider la déclaration.
        </Message>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Déclaration de sinistre">
        <fieldset className="app-fieldset">
          <legend>Contrat concerné</legend>
          <SelectInput
            label="Contrat"
            required
            placeholder="- Sélectionner un contrat -"
            options={activeContracts.map((c) => ({
              value: c.id,
              label: `${c.id} — ${c.holder} (${CONTRACT_TYPES[c.type]})`,
            }))}
            {...register("contractId", { required: "Veuillez sélectionner un contrat." })}
            {...fieldError(errors.contractId)}
          />
        </fieldset>

        <fieldset className="app-fieldset">
          <legend>Circonstances</legend>
          <Controller
            control={control}
            name="type"
            rules={{ required: "Veuillez indiquer la nature du sinistre." }}
            render={({ field, fieldState }) => (
              <RadioInput
                label="Nature du sinistre"
                required
                roleContainer="radiogroup"
                options={toOptions(CLAIM_TYPES)}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                {...fieldError(fieldState.error)}
              />
            )}
          />
          <DateInput
            label="Date de survenance"
            required
            max={todayIso()}
            {...register("occurredAt", {
              required: "Veuillez indiquer la date du sinistre.",
              validate: (v) => isPastDate(v) || "La date ne peut pas être dans le futur.",
            })}
            {...fieldError(errors.occurredAt)}
          />
          <TextInput
            label="Lieu"
            required
            placeholder="Ville ou adresse"
            {...register("location", { required: "Veuillez indiquer le lieu du sinistre." })}
            {...fieldError(errors.location)}
          />
          <TextareaInput
            label="Description"
            required
            rows={5}
            helpMessage="20 caractères minimum"
            {...register("description", {
              required: "Veuillez décrire le sinistre.",
              minLength: { value: 20, message: "La description doit contenir au moins 20 caractères." },
              maxLength: { value: 1000, message: "La description ne doit pas dépasser 1000 caractères." },
            })}
            {...fieldError(errors.description)}
          />
          <TextInput
            label="Montant estimé (€)"
            type="number"
            inputMode="decimal"
            min={0}
            {...register("estimatedAmount", {
              required: "Veuillez estimer le montant des dommages.",
              validate: (v) => Number(v) > 0 || "Le montant doit être supérieur à 0.",
            })}
            required
            {...fieldError(errors.estimatedAmount)}
          />
        </fieldset>

        <fieldset className="app-fieldset">
          <legend>Tiers</legend>
          <Controller
            control={control}
            name="thirdPartyInvolved"
            rules={{ required: "Veuillez préciser si un tiers est impliqué." }}
            render={({ field, fieldState }) => (
              <RadioInput
                label="Un tiers est-il impliqué ?"
                required
                mode="inline"
                roleContainer="radiogroup"
                options={YES_NO}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                {...fieldError(fieldState.error)}
              />
            )}
          />
          {thirdPartyInvolved === "oui" && (
            <TextInput
              label="Nom du tiers"
              required
              {...register("thirdPartyName", {
                required: "Veuillez indiquer le nom du tiers.",
                shouldUnregister: true,
              })}
              {...fieldError(errors.thirdPartyName)}
            />
          )}
        </fieldset>

        <Controller
          control={control}
          name="certify"
          rules={{ validate: (v) => v || "Vous devez certifier l'exactitude des informations." }}
          render={({ field, fieldState }) => (
            <CheckboxInput
              label="Attestation"
              required
              roleContainer="group"
              name={field.name}
              options={[{ value: "certify", label: "Je certifie l'exactitude des informations déclarées" }]}
              values={field.value ? ["certify"] : []}
              onChange={({ values }) => field.onChange(values.includes("certify"))}
              {...fieldError(fieldState.error)}
            />
          )}
        />

        <div className="app-actions">
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Réinitialiser
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours…" : "Déclarer le sinistre"}
          </Button>
        </div>
      </form>
    </>
  );
};
