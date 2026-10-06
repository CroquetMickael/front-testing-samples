# testing-sample

Six setups de test prêts à l'emploi qui ciblent l'app de `src/`. Aucun test n'est écrit : chaque dossier contient la configuration, le setup et des dossiers vides à remplir.

| Dossier                    | Outil                                             | Environnement            | Script npm                          |
| -------------------------- | ------------------------------------------------- | ------------------------ | ----------------------------------- |
| `vitest-browser/`          | Vitest Browser Mode + `vitest-browser-react`      | Chromium (Playwright)    | `npm run test:vitest-browser`       |
| `playwright-ct/`           | Playwright Component Testing (`experimental-ct-react`) | Chromium            | `npm run test:playwright-ct`        |
| `vitest-cucumber/`         | `@amiceli/vitest-cucumber` + Testing Library      | jsdom                    | `npm run test:vitest-cucumber`      |
| `vitest-cucumber-browser/` | `@amiceli/vitest-cucumber/browser` + `vitest-browser-react` | Chromium (Playwright) | `npm run test:vitest-cucumber-browser` |
| `playwright-e2e/`          | Playwright E2E (`@playwright/test`) sur l'app réelle | Chromium + serveur Vite | `npm run test:playwright-e2e`       |
| `playwright-bdd/`          | Playwright E2E en Gherkin via [`playwright-bdd`](https://vitalets.github.io/playwright-bdd/) | Chromium + serveur Vite | `npm run test:playwright-bdd`       |

`npm run test:all` lance les six en mode `run`. Les scripts Vitest sont en mode watch par défaut (`-- --run` pour un seul passage).

Prérequis (une fois) : `npx playwright install chromium`, et **Docker** lancé (Microcks, voir plus bas).

## Monter l'app dans un test — `shared/TestApp.tsx`

Commun aux quatre setups de composants (pas utilisé en E2E, qui pilote la vraie app) :

- `<TestApp initialPath="/souscription" />` : l'app complète (layout + toutes les routes) sur un routeur en mémoire, avec un store neuf à chaque montage.
- `<TestProviders initialPath="/contrats/CTR-0001" routePath="/contrats/:contractId">…</TestProviders>` : une page ou un composant seul, avec le routeur et le store.

Les routes de l'app sont exportées par `src/routes.tsx`.

## Microcks — `microcks/`

Les six setups démarrent un [Microcks](https://microcks.io/) **vide** (aucun mock importé) via leur `globalSetup` commun, `microcks/global-setup.ts`, et l'arrêtent à la fin du run.

- Conteneur `microcks/microcks-uber:1.14.0` lancé par [Testcontainers](https://github.com/microcks/microcks-testcontainers-node) sur un **port fixe**, `8585` : l'URL est connue d'avance, y compris dans le navigateur et dans l'app servie par Vite.
- `microcks/endpoints.ts` (importable partout, Node comme navigateur) : `MICROCKS_URL` et `microcksRestUrl(service, version)` pour l'URL d'un mock REST (`/rest/{titre OpenAPI}/{version}`).
- Instance déjà lancée sur 8585 (ex. `npm run microcks`) : réutilisée, pas de nouveau conteneur. `npm run microcks` garde un Microcks ouvert (UI sur http://localhost:8585, Ctrl+C pour l'arrêter) : pratique pour importer des API à la main et pour enchaîner les runs sans attendre le démarrage (~10 s).
- `MICROCKS=off npm run test:…` : ne démarre pas Microcks (pas besoin de Docker).
- Les mocks (OpenAPI, Postman…) ne sont pas importés automatiquement : depuis l'UI, ou dans un test avec l'API REST de Microcks (`POST ${MICROCKS_URL}/api/artifact/upload`).
- Un seul Microcks à la fois sur 8585 : lancer les runners les uns après les autres (comme `test:all`) ou partager un `npm run microcks`.

## Où mettre les fichiers / conventions

### vitest-browser
- Tests : `tests/**/*.test.tsx`
- `render` vient de `vitest-browser-react` (nettoyage automatique avant chaque test) ; assertions avec `expect.element(...)`.

### playwright-ct
- Tests : `tests/**/*.spec.tsx`, `test`/`expect` importés depuis `@playwright/experimental-ct-react`.
- `mount(<TestApp initialPath="/contrats" />)` pour l'app complète.
- Pour un composant seul, utiliser le `hooksConfig` défini dans `playwright/index.tsx` :
  `mount<HooksConfig>(<ClaimDetailPage />, { hooksConfig: { withProviders: true, initialPath: "/sinistres/SIN-0001", routePath: "/sinistres/:claimId" } })`.
- Rapports et artefacts dans `playwright-report/` et `test-results/` (ignorés par git).

### playwright-e2e
- Tests : `tests/**/*.spec.ts`, `test`/`expect` importés depuis `@playwright/test`.
- Playwright démarre lui-même l'app (`npm run dev` sur le port 5173) via `webServer`, puis navigue avec des URL relatives : `page.goto("/souscription")`.
- En local, un `npm run dev` déjà lancé sur 5173 est réutilisé (`reuseExistingServer`) ; en CI, un serveur neuf est toujours démarré.
- Les données de l'app sont en mémoire : chaque test (nouvel onglet) repart du jeu de données initial.
- `locale` `fr-FR` et fuseau `Europe/Paris` sont fixés, pour que dates et montants s'affichent comme dans l'app.
- Rapports et artefacts dans `playwright-report/` et `test-results/` (ignorés par git).

### playwright-bdd
- Features : `features/**/*.feature`, en **français** (`language: "fr"` dans `defineBddConfig` : `Fonctionnalité`, `Scénario`, `Étant donné que`, `Quand`, `Alors`).
- Steps : `steps/**/*.ts`, avec `Given` / `When` / `Then` importés depuis `steps/fixtures.ts` (et non depuis `playwright-bdd`) :
  ```ts
  import { expect } from "@playwright/test";
  import { Given, Then } from "./fixtures";

  Given("je suis sur la page {string}", async ({ page }, path: string) => {
    await page.goto(path);
  });
  ```
- Les fixtures Playwright (`page`, `request`…) sont reçues en premier argument de chaque step ; ajouter ses propres fixtures (page objects, données) avec `base.extend(...)` dans `steps/fixtures.ts`.
- `bddgen` génère les specs Playwright dans `.features-gen/` (ignoré par git) avant `playwright test` : le script npm enchaîne les deux. Une step manquante fait échouer `bddgen` avec le snippet à copier.
- Même config que `playwright-e2e` pour le reste : `webServer` sur le port 5173, `baseURL`, `locale` `fr-FR`, fuseau `Europe/Paris`, données repartant de zéro à chaque scénario.
- Rapports et artefacts dans `playwright-report/` et `test-results/` (ignorés par git).

### vitest-cucumber (jsdom)
- Features : `features/*.feature`, en **français** (langue `fr` configurée dans `setup.ts` : `Fonctionnalité`, `Scénario`, `Étant donné que`, `Quand`, `Alors`).
- Specs : `specs/**/*.spec.tsx`.
- **Chemin du `.feature`** : relatif à la racine du repo, ex. `loadFeature("testing-sample/vitest-cucumber/features/souscription.feature")`. La lib ne résout un chemin relatif par rapport au spec que sous la forme `./fichier.feature` (même dossier).

### vitest-cucumber-browser
- Importer depuis `@amiceli/vitest-cucumber/browser` (lit le `.feature` via le serveur Vite et non via `fs`).
- **Chemin du `.feature`** : absolu depuis la racine du repo, avec un `/` au début, ex. `loadFeature("/testing-sample/vitest-cucumber-browser/features/souscription.feature")`. La résolution relative de la lib casse dès que le chemin contient `/src/` ou `/tests/` (d'où les dossiers `specs/`).
- `render` / `cleanup` viennent de `vitest-browser-react/pure`.

### Point commun aux deux variantes Cucumber : nettoyer par scénario
vitest-cucumber exécute **chaque étape comme un test Vitest distinct**. Un nettoyage « après chaque test » démonterait l'UI entre `Étant donné` et `Alors`. Les setups n'en déclarent donc pas ; on nettoie dans la feature :

```tsx
describeFeature(feature, ({ Scenario, AfterEachScenario }) => {
  AfterEachScenario(() => cleanup());
  // ...
});
```

## Choix de config à connaître
- Les configs Vitest fixent `root` à la racine du repo, d'où des chemins `include` / `setupFiles` préfixés par `testing-sample/...`.
- Les configs Vitest Browser listent les dépendances dans `optimizeDeps.include` : sans ça, Vite ré-optimise au milieu du run et charge React deux fois (`Cannot read properties of null (reading 'useState')`).
- `playwright`, `@playwright/test` et `@playwright/experimental-ct-react` (utilisés aussi par `playwright-bdd`) sont figés sur la même version (1.62.1) pour partager un seul binaire Chromium avec Vitest.
- Le `globalSetup` Microcks est déclaré dans chaque config (`testing-sample/microcks/global-setup.ts` côté Vitest, relatif à la racine ; `../microcks/global-setup.ts` côté Playwright, relatif à la config).
- `testing-sample/tsconfig.json` est référencé par le `tsconfig.json` racine : `npm run build` vérifie aussi les types des tests.
