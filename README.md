# front-testing-samples

Application React « gestion assurance » servant de support à des samples de tests front.

## Stack

- React 19 + TypeScript + Vite
- Design system AXA : [`@axa-fr/canopee-react`](https://github.com/AxaFrance/design-system) (thème `distributeur`, ex-« Slash ») + `@axa-fr/canopee-css`
- React Router (mode data, `createBrowserRouter`)
- React Hook Form (validation par règles natives RHF, sans librairie de schéma)

## Démarrer

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run lint
```

## Tests

Le dossier [`testing-sample/`](testing-sample/README.md) contient six setups prêts à remplir (Vitest Browser, Playwright Component, Vitest Cucumber, Vitest Cucumber + Browser Mode, Playwright E2E, Playwright BDD).

## Pages

| Route                   | Page                     | Intérêt pour les tests                                                                 |
| ----------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| `/contrats`             | Liste contrats/sinistres | Tableaux, filtres (texte + select), message flash après création                       |
| `/contrats/:contractId` | Détail contrat           | Restitution AXA (assuré, garanties, options), sinistres liés, bouton « Déclarer un sinistre » qui pré-sélectionne le contrat, état « introuvable » |
| `/sinistres/:claimId`   | Détail sinistre          | Restitution AXA (circonstances, tiers, description), lien vers le contrat, état « introuvable » |
| `/sinistres/declaration`| Formulaire **classique** | Select, radios, date (pas dans le futur), textarea (min 20), nombre, champ conditionnel, pré-sélection via `?contrat=CTR-xxxx`, case à cocher obligatoire, état de soumission |
| `/souscription`         | Formulaire **à étapes**  | 4 étapes (Assuré, Adresse, Contrat, Récapitulatif), validation par étape (`trigger`), retour arrière via le stepper ou « Modifier », prime calculée en direct |
| `*`                     | 404                      |                                                                                        |

Les données sont en mémoire (`src/data/InsuranceStore.tsx`) : elles sont réinitialisées au rechargement.
Les soumissions simulent un appel réseau de 500 ms.

## Structure

```
src/
  data/           store en mémoire, types, référentiels (libellés, calcul de prime)
  forms/          helpers de formulaire (mapping erreur RHF -> props AXA, regex)
  layout/         en-tête, navigation, footer AXA
  pages/
    ContractsPage.tsx
    ClaimFormPage.tsx          formulaire classique
    subscription/              formulaire à étapes (une étape = un composant, FormProvider partagé)
```

## Notes d'intégration AXA

- Les champs texte/select/date utilisent `register()` directement (les composants AXA font `forwardRef`).
- `RadioInput` et `CheckboxInput` sont contrôlés (prop `value`/`values`) : ils passent par `<Controller>`.
- `NumberInput` ne transmet pas la ref : on utilise `TextInput type="number"` à la place.
- Les formulaires sont en `noValidate` pour laisser RHF gérer la validation (les inputs AXA posent l'attribut `required`).
- `@axa-fr/design-system-slash-react` v4 n'est qu'un ré-export de `@axa-fr/canopee-react/distributeur` et son point d'entrée publié est cassé : on dépend directement de `canopee-react`.
