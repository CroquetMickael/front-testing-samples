import { CheckboxInput, DateInput, RadioInput, SelectInput } from "@axa-fr/canopee-react/distributeur";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  computePremium,
  CONTRACT_TYPES,
  formatCurrency,
  FORMULAS,
  OPTIONS,
  toOptions,
} from "../../data/referentials";
import { fieldError, todayIso } from "../../forms/fieldError";
import type { SubscriptionFormValues } from "./types";

const FORMULA_OPTIONS = Object.entries(FORMULAS).map(([value, f]) => ({
  value,
  label: `${f.label} — ${f.description} (à partir de ${formatCurrency(f.basePremium)}/mois)`,
}));

const OPTION_OPTIONS = Object.entries(OPTIONS).map(([value, o]) => ({
  value,
  label: `${o.label} (+${formatCurrency(o.price)}/mois)`,
}));

export const ContractStep = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SubscriptionFormValues>();
  const [formula, options] = useWatch({ control, name: ["formula", "options"] });

  return (
    <fieldset className="app-fieldset">
      <legend>Contrat et garanties</legend>
      <SelectInput
        label="Type de contrat"
        required
        placeholder="- Sélectionner -"
        options={toOptions(CONTRACT_TYPES)}
        {...register("contractType", { required: "Veuillez sélectionner un type de contrat." })}
        {...fieldError(errors.contractType)}
      />
      <DateInput
        label="Date d'effet"
        required
        min={todayIso()}
        {...register("startDate", {
          required: "Veuillez saisir la date d'effet.",
          validate: (v) => v >= todayIso() || "La date d'effet ne peut pas être dans le passé.",
        })}
        {...fieldError(errors.startDate)}
      />
      <Controller
        control={control}
        name="formula"
        rules={{ required: "Veuillez choisir une formule." }}
        render={({ field, fieldState }) => (
          <RadioInput
            label="Formule"
            required
            roleContainer="radiogroup"
            options={FORMULA_OPTIONS}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            {...fieldError(fieldState.error)}
          />
        )}
      />
      <Controller
        control={control}
        name="options"
        rules={{
          validate: (v) =>
            !(formula === "essentielle" && v.length > 2) ||
            "La formule Essentielle est limitée à 2 options.",
        }}
        render={({ field, fieldState }) => (
          <CheckboxInput
            label="Options"
            roleContainer="group"
            name={field.name}
            options={OPTION_OPTIONS}
            values={field.value}
            onChange={({ values }) => field.onChange(values)}
            {...fieldError(fieldState.error)}
          />
        )}
      />
      {formula && (
        <p className="app-premium" data-testid="premium-estimate">
          Prime mensuelle estimée : <strong>{formatCurrency(computePremium(formula, options))}</strong>
        </p>
      )}
    </fieldset>
  );
};
