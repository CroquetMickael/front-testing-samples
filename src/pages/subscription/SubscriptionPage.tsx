import { Button, MandatoryMention, Step, Steps, Title } from "@axa-fr/canopee-react/distributeur";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useInsurance } from "../../data/InsuranceStore";
import { computePremium } from "../../data/referentials";
import type { Civility, ContractType, Formula } from "../../data/types";
import type { FlashState } from "../ContractsPage";
import { AddressStep } from "./AddressStep";
import { ContractStep } from "./ContractStep";
import { InsuredStep } from "./InsuredStep";
import { SummaryStep } from "./SummaryStep";
import { DEFAULT_VALUES, STEPS, type SubscriptionFormValues } from "./types";

export const SubscriptionPage = () => {
  const { addContract } = useInsurance();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm<SubscriptionFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });
  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const isLastStep = currentStep === STEPS.length - 1;

  const goToStep = (index: number) => {
    setCurrentStep(index);
    window.scrollTo({ top: 0 });
  };

  const next = async () => {
    const valid = await trigger(STEPS[currentStep].fields, { shouldFocus: true });
    if (valid) goToStep(currentStep + 1);
  };

  const onSubmit = async (values: SubscriptionFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const formula = values.formula as Formula;
    const contract = addContract({
      civility: values.civility as Civility,
      holder: `${values.firstName} ${values.lastName}`,
      birthDate: values.birthDate,
      email: values.email,
      phone: values.phone || undefined,
      address: values.address,
      postalCode: values.postalCode,
      city: values.city,
      type: values.contractType as ContractType,
      formula,
      options: values.options,
      startDate: values.startDate,
      monthlyPremium: computePremium(formula, values.options),
    });
    navigate("/contrats", {
      state: { flash: `Le contrat ${contract.id} a bien été créé.` } satisfies FlashState,
    });
  };

  return (
    <>
      <Title>Nouvelle souscription</Title>

      <Steps>
        {STEPS.map((step, index) => (
          <Step
            key={step.id}
            id={`step-${step.id}`}
            number={String(index + 1)}
            title={step.title}
            mode={index < currentStep ? "link" : index === currentStep ? "active" : "disabled"}
            href={`#${step.id}`}
            onClick={() => goToStep(index)}
          />
        ))}
      </Steps>

      <MandatoryMention variant="one" />

      <FormProvider {...methods}>
        <form
          noValidate
          aria-label={`Souscription — étape ${currentStep + 1} sur ${STEPS.length} : ${STEPS[currentStep].title}`}
          onSubmit={isLastStep ? handleSubmit(onSubmit) : (e) => (e.preventDefault(), next())}
        >
          <h2 className="app-step-title">
            Étape {currentStep + 1} / {STEPS.length} — {STEPS[currentStep].title}
          </h2>

          {currentStep === 0 && <InsuredStep />}
          {currentStep === 1 && <AddressStep />}
          {currentStep === 2 && <ContractStep />}
          {currentStep === 3 && <SummaryStep onEdit={goToStep} />}

          <div className="app-actions">
            {currentStep > 0 ? (
              <Button type="button" variant="secondary" onClick={() => goToStep(currentStep - 1)}>
                Précédent
              </Button>
            ) : (
              <Button type="button" variant="secondary" onClick={() => navigate("/contrats")}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isLastStep ? (isSubmitting ? "Envoi en cours…" : "Valider la souscription") : "Suivant"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
