import { TextInput } from "@axa-fr/canopee-react/distributeur";
import { useFormContext } from "react-hook-form";
import { fieldError, POSTAL_CODE_PATTERN } from "../../forms/fieldError";
import type { SubscriptionFormValues } from "./types";

export const AddressStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SubscriptionFormValues>();

  return (
    <fieldset className="app-fieldset">
      <legend>Adresse de l'assuré</legend>
      <TextInput
        label="Adresse"
        required
        autoComplete="street-address"
        {...register("address", { required: "Veuillez saisir l'adresse." })}
        {...fieldError(errors.address)}
      />
      <TextInput
        label="Code postal"
        required
        inputMode="numeric"
        maxLength={5}
        autoComplete="postal-code"
        {...register("postalCode", {
          required: "Veuillez saisir le code postal.",
          pattern: { value: POSTAL_CODE_PATTERN, message: "Le code postal doit contenir 5 chiffres." },
        })}
        {...fieldError(errors.postalCode)}
      />
      <TextInput
        label="Ville"
        required
        autoComplete="address-level2"
        {...register("city", { required: "Veuillez saisir la ville." })}
        {...fieldError(errors.city)}
      />
    </fieldset>
  );
};
