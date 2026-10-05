import { Button, CheckboxInput } from "@axa-fr/canopee-react/distributeur";
import { Controller, useFormContext } from "react-hook-form";
import {
  computePremium,
  CONTRACT_TYPES,
  formatCurrency,
  formatDate,
  FORMULAS,
  OPTIONS,
} from "../../data/referentials";
import { fieldError } from "../../forms/fieldError";
import type { SubscriptionFormValues } from "./types";

type Props = { onEdit: (stepIndex: number) => void };

export const SummaryStep = ({ onEdit }: Props) => {
  const { control, getValues } = useFormContext<SubscriptionFormValues>();
  const v = getValues();
  const premium = v.formula ? computePremium(v.formula, v.options) : 0;

  const sections = [
    {
      title: "Assuré",
      step: 0,
      rows: [
        ["Civilité", v.civility === "M" ? "Monsieur" : "Madame"],
        ["Nom", v.lastName],
        ["Prénom", v.firstName],
        ["Date de naissance", v.birthDate && formatDate(v.birthDate)],
        ["E-mail", v.email],
        ["Téléphone", v.phone || "—"],
      ],
    },
    {
      title: "Adresse",
      step: 1,
      rows: [
        ["Adresse", v.address],
        ["Code postal", v.postalCode],
        ["Ville", v.city],
      ],
    },
    {
      title: "Contrat",
      step: 2,
      rows: [
        ["Type", v.contractType && CONTRACT_TYPES[v.contractType]],
        ["Date d'effet", v.startDate && formatDate(v.startDate)],
        ["Formule", v.formula && FORMULAS[v.formula].label],
        ["Options", v.options.map((o) => OPTIONS[o].label).join(", ") || "Aucune"],
        ["Prime mensuelle", formatCurrency(premium)],
      ],
    },
  ];

  return (
    <>
      {sections.map((section) => (
        <section key={section.title} className="app-summary" aria-labelledby={`summary-${section.step}`}>
          <header className="app-summary__header">
            <h3 id={`summary-${section.step}`}>{section.title}</h3>
            <Button type="button" variant="ghost" small onClick={() => onEdit(section.step)}>
              Modifier
            </Button>
          </header>
          <dl>
            {section.rows.map(([label, value]) => (
              <div key={label} className="app-summary__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <Controller
        control={control}
        name="acceptTerms"
        rules={{ validate: (val) => val || "Vous devez accepter les conditions générales." }}
        render={({ field, fieldState }) => (
          <CheckboxInput
            label="Conditions générales"
            required
            roleContainer="group"
            name={field.name}
            options={[{ value: "accept", label: "J'accepte les conditions générales de vente" }]}
            values={field.value ? ["accept"] : []}
            onChange={({ values }) => field.onChange(values.includes("accept"))}
            {...fieldError(fieldState.error)}
          />
        )}
      />
    </>
  );
};
