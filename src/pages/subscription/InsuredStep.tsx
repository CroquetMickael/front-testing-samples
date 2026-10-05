import { DateInput, RadioInput, TextInput } from "@axa-fr/canopee-react/distributeur";
import { Controller, useFormContext } from "react-hook-form";
import { EMAIL_PATTERN, fieldError, PHONE_PATTERN } from "../../forms/fieldError";
import type { SubscriptionFormValues } from "./types";

const CIVILITIES = [
  { value: "Mme", label: "Madame" },
  { value: "M", label: "Monsieur" },
];

const isAdult = (value: string) => {
  const birth = new Date(value);
  const limit = new Date();
  limit.setFullYear(limit.getFullYear() - 18);
  return birth <= limit;
};

export const InsuredStep = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SubscriptionFormValues>();

  return (
    <fieldset className="app-fieldset">
      <legend>Informations sur l'assuré</legend>
      <Controller
        control={control}
        name="civility"
        rules={{ required: "Veuillez sélectionner une civilité." }}
        render={({ field, fieldState }) => (
          <RadioInput
            label="Civilité"
            required
            mode="inline"
            roleContainer="radiogroup"
            options={CIVILITIES}
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            {...fieldError(fieldState.error)}
          />
        )}
      />
      <TextInput
        label="Nom"
        required
        autoComplete="family-name"
        {...register("lastName", {
          required: "Veuillez saisir le nom.",
          minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères." },
        })}
        {...fieldError(errors.lastName)}
      />
      <TextInput
        label="Prénom"
        required
        autoComplete="given-name"
        {...register("firstName", { required: "Veuillez saisir le prénom." })}
        {...fieldError(errors.firstName)}
      />
      <DateInput
        label="Date de naissance"
        required
        {...register("birthDate", {
          required: "Veuillez saisir la date de naissance.",
          validate: (v) => isAdult(v) || "L'assuré doit être majeur.",
        })}
        {...fieldError(errors.birthDate)}
      />
      <TextInput
        label="E-mail"
        type="email"
        required
        autoComplete="email"
        {...register("email", {
          required: "Veuillez saisir l'adresse e-mail.",
          pattern: { value: EMAIL_PATTERN, message: "L'adresse e-mail n'est pas valide." },
        })}
        {...fieldError(errors.email)}
      />
      <TextInput
        label="Téléphone"
        type="tel"
        autoComplete="tel"
        helpMessage="Format : 06 12 34 56 78"
        {...register("phone", {
          pattern: { value: PHONE_PATTERN, message: "Le numéro de téléphone n'est pas valide." },
        })}
        {...fieldError(errors.phone)}
      />
    </fieldset>
  );
};
