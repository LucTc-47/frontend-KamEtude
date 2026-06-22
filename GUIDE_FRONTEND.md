# Guide frontend Kam'Etud

Ce guide decrit l'etat actuel du frontend `frontend-KamEtude` et la maniere de le faire evoluer sans reintroduire de logique backend directement dans les composants.

## Positionnement actuel

Le projet est un frontend UI-only :

- React 18, TypeScript et Vite.
- Tailwind CSS et shadcn/ui pour l'interface.
- React Router pour les pages.
- TanStack Query utilise par les hooks stubs afin de conserver une interface proche d'une future couche API.
- Donnees mockees et mutations no-op centralisees dans `src/hooks/stubs/useUiData.stub.ts`.
- Auth locale simulee dans `src/contexts/AuthContext.tsx`.
- Aucun client Supabase actif dans `src/`.

Le but n'est pas de connecter directement les pages a Spring Boot maintenant. Le but est de garder une UI testable, stable et facile a reconnecter plus tard.

## Installation et lancement

```bash
npm install
npm run dev
```

Sur Windows si PowerShell bloque les scripts npm :

```bash
npm.cmd install
npm.cmd run dev
```

Build :

```bash
npm run build
```

Tests unitaires :

```bash
npm run test
```

Tests manuels assistes :

```bash
npm run test:pages
```

## Scripts npm

| Script | Usage |
|---|---|
| `npm run dev` | Lance Vite en local. |
| `npm run build` | Compile le build production. |
| `npm run build:dev` | Compile en mode development. |
| `npm run preview` | Sert le dossier `dist/`. |
| `npm run lint` | Lance ESLint. |
| `npm run test` | Lance Vitest une fois. |
| `npm run test:watch` | Lance Vitest en watch. |
| `npm run test:pages` | Ouvre les routes principales pour test manuel. |

## Architecture

```text
src/
  App.tsx
  main.tsx
  components/
    auth/
    home/
    layout/
    services/
    ui/
  contexts/
    AuthContext.tsx
    LanguageContext.tsx
    NotificationContext.tsx
    ThemeContext.tsx
  hooks/
    useUiData.ts
    stubs/useUiData.stub.ts
  pages/
    auth/
    AdminDashboard.tsx
    ModeratorDashboard.tsx
    ...
  types/
    index.ts
  lib/
    utils.ts
```

### Regle importante

Les composants et pages ne doivent pas importer un client backend directement. Ils doivent consommer des hooks ou des callbacks.

Actuellement :

```ts
import { useGigs } from "@/hooks/useUiData";
```

Plus tard, `useUiData.ts` pourra re-exporter une implementation Spring Boot au lieu des stubs, sans reecrire toutes les pages.

## Routing

Les routes sont declarees dans `src/App.tsx`.

| Route | Page | Role de test principal |
|---|---|---|
| `/` | `Index` | public |
| `/services` | `Services` | public |
| `/comment-ca-marche` | `HowItWorks` | public |
| `/connexion` | `Login` | public |
| `/inscription` | `Register` | public |
| `/inscription/etudiant` | `RegisterStudent` | public |
| `/inscription/client` | `RegisterClient` | public |
| `/profil/:id` | `StudentProfile` | public/student |
| `/commander/:gigId` | `OrderPage` | client |
| `/mes-commandes` | `MyOrders` | client |
| `/mes-missions` | `MyMissions` | student |
| `/mes-gigs` | `MyGigs` | student |
| `/mes-gigs/creer` | `CreateGig` | student |
| `/demandes` | `Requests` | public/client |
| `/demandes/:id` | `RequestDetail` | client/student |
| `/mes-demandes` | `MyRequests` | client |
| `/mes-propositions` | `MyProposals` | student |
| `/admin` | `AdminDashboard` | admin |
| `/moderateur` | `ModeratorDashboard` | moderator |
| `/confidentialite` | `Privacy` | public |
| `/cgu` | `Terms` | public |
| `*` | `NotFound` | public |

## Auth stub

`AuthContext.tsx` expose :

- `user`
- `session`
- `login`
- `loginWithPhone`
- `sendPhoneOtp`
- `register`
- `logout`
- `isAuthenticated`
- `loading`

Le role de test est controle par :

```ts
export const MOCK_USER_ROLE: UserRole = 'client';
```

Quand ce role change, supprimer la session locale ou se deconnecter avant de se reconnecter.

La cle `localStorage` utilisee est :

```text
kametud_stub_auth
```

## Couche data UI

Point d'entree :

```text
src/hooks/useUiData.ts
```

Implementation actuelle :

```text
src/hooks/stubs/useUiData.stub.ts
```

Les stubs couvrent notamment :

- profils et authentification de test ;
- gigs, categories et villes ;
- commandes client et missions etudiant ;
- chat et abonnements temps reel no-op ;
- demandes clients et propositions ;
- litiges moderation ;
- KYC/verifications ;
- administration profils, villes, categories, commandes et rapports ;
- uploads locaux temporaires ;
- paiements/payouts representes par des toasts ou warnings.

Chaque point de reconnexion est marque par `TODO(backend)`.

## Ajouter une page

1. Creer le fichier dans `src/pages/`.
2. Ajouter la route dans `src/App.tsx`.
3. Ajouter les liens de navigation si necessaire dans `src/components/layout/Navbar.tsx`.
4. Consommer les donnees via un hook existant ou creer un nouveau hook dans la couche `useUiData`.
5. Ajouter un cas dans `TESTING.md`.
6. Verifier avec `npm run build`.

## Ajouter une interaction data

Ne pas appeler `fetch`, Axios, Supabase ou un SDK directement depuis la page.

Approche recommandee :

1. Definir ou reutiliser un type dans `src/types/index.ts`.
2. Ajouter un hook dans `src/hooks/stubs/useUiData.stub.ts`.
3. Ajouter un commentaire `TODO(backend)` avec l'operation metier attendue.
4. Exporter le hook via `src/hooks/useUiData.ts` si necessaire.
5. Consommer le hook depuis la page.

Exemple :

```ts
// TODO(backend): reconnecter la creation de demande client via Spring Boot (POST /requests).
export function useCreateGigRequest() {
  return useStubMutation(/* ... */);
}
```

## Reconnexion Spring Boot

Ordre conseille :

1. Auth : login, register, logout, refresh/session, roles.
2. Profils : utilisateur courant, profils publics, KYC.
3. Catalogue : gigs, categories, villes, recherche.
4. Demandes et propositions.
5. Commandes, paiement Campay, escrow et payouts.
6. Chat et notifications temps reel via SSE ou WebSocket.
7. Admin/moderation.

L'objectif est de remplacer l'implementation des hooks, pas les composants.

## Paiement Campay

Le frontend ne doit pas stocker de secret Campay et ne doit pas appeler Campay directement.

Flux cible :

- Frontend -> Spring Boot : initier paiement.
- Spring Boot -> Campay : appel securise.
- Campay -> Spring Boot : webhook.
- Spring Boot -> Frontend : statut commande/paiement via API ou temps reel.

Les anciens exemples Supabase/Campay ont ete sortis du frontend. Toute reference Campay operationnelle doit vivre cote backend ou dans un dossier de reference hors repo frontend.

## Verification avant livraison

```bash
npm run build
npm run test
rg -n "supabase|@supabase|lovable.dev" src
```

Le dernier grep ne doit retourner aucun import ni appel backend Supabase dans `src/`.

## Depannage

- Session de test incoherente : supprimer `kametud_stub_auth` dans `localStorage`.
- Role incorrect : modifier `MOCK_USER_ROLE`, puis se reconnecter.
- Page vide en mode data : verifier le hook stub correspondant dans `src/hooks/stubs/useUiData.stub.ts`.
- Build avec avertissement chunk > 500 kB : non bloquant, a traiter plus tard par code splitting.
- Build avec Browserslist ancien : lancer `npx update-browserslist-db@latest` si une mise a jour navigateur est souhaitee.
