# frontend-KamEtude

Frontend React/TypeScript de Kam'Etud, aligne sur l'UI la plus recente de `project-compass`, mais nettoye de toute logique backend Supabase.

L'application est actuellement un frontend UI-only : pages, composants, routing, styles, donnees mockees, hooks stubs et etat local. Elle est prete a etre reconnectee plus tard a un backend Spring Boot et aux flux Campay.

## Etat actuel

- UI React avec Vite, TypeScript, Tailwind CSS et shadcn/ui.
- Routing gere par `react-router-dom` dans `src/App.tsx`.
- Donnees metier servies par des hooks stubs dans `src/hooks/stubs/useUiData.stub.ts`.
- Point d'entree data unique : `src/hooks/useUiData.ts`.
- Authentification simulee dans `src/contexts/AuthContext.tsx`.
- Role de test configurable via `MOCK_USER_ROLE`.
- Aucun client Supabase, aucune migration SQL, aucun dossier `src/integrations/supabase`.
- Bouton Google OAuth conserve en UI, mais sans appel OAuth reel.
- Tests manuels documentes dans `TESTING.md`.

## Prerequis

- Node.js 18 ou plus recent.
- npm.
- Git.
- Un navigateur moderne.

## Installation

```bash
npm install
```

Sur Windows/PowerShell, si `npm` est bloque par la politique d'execution, utiliser :

```bash
npm.cmd install
```

## Lancement local

```bash
npm run dev
```

URL Vite par defaut :

```text
http://localhost:5173
```

## Scripts disponibles

```bash
npm run dev          # Serveur Vite
npm run build        # Build production
npm run build:dev    # Build mode development
npm run preview      # Preview du build
npm run lint         # ESLint
npm run test         # Vitest en mode run
npm run test:watch   # Vitest en mode watch
npm run test:pages   # Ouvre les routes principales pour test manuel
```

Le script `npm run test:pages` utilise `scripts/test-pages.mjs`. Il demarre le serveur Vite si necessaire, puis ouvre les pages principales dans le navigateur avec des IDs mockes.

## Structure utile

```text
src/
  App.tsx                     # Routes principales
  components/                 # Composants UI, layout, home, auth
  contexts/                   # Auth, langue, theme, notifications
  hooks/
    useUiData.ts              # Re-export public des hooks data UI
    stubs/useUiData.stub.ts   # Donnees mockees et TODO backend
  pages/                      # Pages routees
  types/                      # Types TypeScript UI/metier
  lib/                        # Utilitaires
public/
  kam-etud-hero.mp4           # Video hero
scripts/
  test-pages.mjs              # Lanceur de pages pour tests manuels
```

## Authentification stub

Le fichier `src/contexts/AuthContext.tsx` garde un etat local et persiste une session mockee dans `localStorage` sous la cle `kametud_stub_auth`.

Pour tester les pages par role, modifier :

```ts
export const MOCK_USER_ROLE = 'client';
```

Roles supportes :

- `client`
- `student`
- `moderator`
- `admin`

Apres changement de role, se deconnecter ou supprimer la cle `kametud_stub_auth`, puis se reconnecter via `/connexion`.

## Pages principales

Les routes declarees sont :

- `/`
- `/services`
- `/comment-ca-marche`
- `/connexion`
- `/inscription`
- `/inscription/etudiant`
- `/inscription/client`
- `/profil/:id`
- `/commander/:gigId`
- `/mes-commandes`
- `/mes-missions`
- `/mes-gigs`
- `/mes-gigs/creer`
- `/demandes`
- `/demandes/:id`
- `/mes-demandes`
- `/mes-propositions`
- `/admin`
- `/moderateur`
- `/confidentialite`
- `/cgu`
- `*` pour la page 404

Voir `TESTING.md` pour le detail de verification page par page.

## Donnees mockees et reconnexion backend

Toutes les operations data passent par `src/hooks/useUiData.ts`, qui re-exporte actuellement les stubs de `src/hooks/stubs/useUiData.stub.ts`.

Chaque hook stub contient un commentaire `TODO(backend)` indiquant le futur endpoint ou le flux metier Spring Boot a reconnecter : gigs, commandes, demandes, propositions, KYC, chat, litiges, categories, villes, fichiers, paiements et payouts.

Pour reconnecter le backend, remplacer progressivement l'implementation des hooks sans changer les composants consommateurs.

## Verification rapide

```bash
npm run build
npm run test
npm run test:pages
```

Le build peut afficher des avertissements Vite/Browserslist ou de taille de chunk. Ces avertissements ne bloquent pas l'execution, mais le code splitting devra etre traite plus tard si le bundle continue de grossir.

## Documentation

- `GUIDE_FRONTEND.md` : guide technique pour modifier et etendre le frontend.
- `TESTING.md` : guide de test manuel complet.
- `plan.md` : etat d'avancement et prochaines etapes de reconnexion backend.
