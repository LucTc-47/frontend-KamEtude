# Setup frontend-KamEtude

Ce document explique comment installer et lancer le frontend Kam'Etud sur une machine vierge.

Les informations ci-dessous sont basees sur l'etat reel du repo : `package.json`, `package-lock.json`, les lockfiles presents et les references d'environnement detectees dans `src/`.

## Prerequis systeme

### Node.js

Le fichier `package.json` ne contient pas de champ `engines`.

Le lockfile npm actuel a ete verifie dans cet environnement avec :

- Node.js `v24.15.0`
- npm `11.12.1`

Le projet utilise Vite 5 et React 18. En pratique, utiliser Node.js 18 ou plus recent. Pour reproduire au plus proche l'environnement actuel, utiliser Node.js 24 avec npm 11.

### Gestionnaire de paquets

Lockfiles detectes dans le repo :

- `package-lock.json`
- `bun.lock`
- `bun.lockb`

Il n'y a pas de `yarn.lock` ni de `pnpm-lock.yaml`.

Le chemin d'installation recommande est npm, car `package-lock.json` est present et les scripts du projet ont ete verifies avec npm.

## Installation

### Cloner le repo

```bash
git clone https://github.com/LucTc-47/frontend-KamEtude.git
cd frontend-KamEtude
```

### Installer les dependances

Installation standard :

```bash
npm install
```

Installation reproductible a partir du lockfile npm :

```bash
npm ci
```

Sur Windows/PowerShell, si `npm` est bloque par la politique d'execution, utiliser :

```bash
npm.cmd install
```

### Variables d'environnement

Aucun fichier `.env.example` n'est present dans le repo.

Aucune variable `import.meta.env.*` ou `process.env.*` n'est referencee dans `src/`. Le frontend ne demande donc pas de fichier `.env` pour fonctionner dans son etat UI-only actuel.

Variables optionnelles hors `src/`, uniquement pour le script `npm run test:pages` :

- `KAMETUD_TEST_BASE_URL` : URL du serveur a tester. Valeur par defaut : `http://localhost:5173`.
- `KAMETUD_TEST_OPEN_DELAY_MS` : delai entre l'ouverture de deux pages. Valeur par defaut : `1500`.

Exemple :

```bash
KAMETUD_TEST_BASE_URL=http://localhost:5173 npm run test:pages
```

Sur PowerShell :

```powershell
$env:KAMETUD_TEST_BASE_URL = "http://localhost:5173"
npm.cmd run test:pages
```

## Dependances principales du projet

### Framework/build

- `react` : `^18.3.1`
- `react-dom` : `^18.3.1`
- `vite` : `^5.4.19`
- `typescript` : `^5.8.3`
- `@vitejs/plugin-react-swc` : `^3.11.0`

### UI/styling

- `@radix-ui/react-accordion` : `^1.2.11`
- `@radix-ui/react-alert-dialog` : `^1.1.14`
- `@radix-ui/react-aspect-ratio` : `^1.1.7`
- `@radix-ui/react-avatar` : `^1.1.10`
- `@radix-ui/react-checkbox` : `^1.3.2`
- `@radix-ui/react-collapsible` : `^1.1.11`
- `@radix-ui/react-context-menu` : `^2.2.15`
- `@radix-ui/react-dialog` : `^1.1.14`
- `@radix-ui/react-dropdown-menu` : `^2.1.15`
- `@radix-ui/react-hover-card` : `^1.1.14`
- `@radix-ui/react-label` : `^2.1.7`
- `@radix-ui/react-menubar` : `^1.1.15`
- `@radix-ui/react-navigation-menu` : `^1.2.13`
- `@radix-ui/react-popover` : `^1.1.14`
- `@radix-ui/react-progress` : `^1.1.7`
- `@radix-ui/react-radio-group` : `^1.3.7`
- `@radix-ui/react-scroll-area` : `^1.2.9`
- `@radix-ui/react-select` : `^2.2.5`
- `@radix-ui/react-separator` : `^1.1.7`
- `@radix-ui/react-slider` : `^1.3.5`
- `@radix-ui/react-slot` : `^1.2.3`
- `@radix-ui/react-switch` : `^1.2.5`
- `@radix-ui/react-tabs` : `^1.1.12`
- `@radix-ui/react-toast` : `^1.2.14`
- `@radix-ui/react-toggle` : `^1.1.9`
- `@radix-ui/react-toggle-group` : `^1.1.10`
- `@radix-ui/react-tooltip` : `^1.2.7`
- `@tailwindcss/typography` : `^0.5.16`
- `autoprefixer` : `^10.4.21`
- `class-variance-authority` : `^0.7.1`
- `clsx` : `^2.1.1`
- `cmdk` : `^1.1.1`
- `embla-carousel-react` : `^8.6.0`
- `framer-motion` : `^11.0.0`
- `input-otp` : `^1.4.2`
- `lucide-react` : `^0.462.0`
- `next-themes` : `^0.3.0`
- `postcss` : `^8.5.6`
- `react-day-picker` : `^8.10.1`
- `react-resizable-panels` : `^2.1.9`
- `sonner` : `^1.7.4`
- `tailwind-merge` : `^2.6.0`
- `tailwindcss` : `^3.4.17`
- `tailwindcss-animate` : `^1.0.7`
- `vaul` : `^0.9.9`

### Routing/state

- `react-router-dom` : `^6.30.1`
- `@tanstack/react-query` : `^5.83.0`

### Formulaires/validation

- `react-hook-form` : `^7.61.1`
- `@hookform/resolvers` : `^3.10.0`
- `zod` : `^3.25.76`

### Cartes et visualisation

- `leaflet` : `^1.9.4`
- `react-leaflet` : `^4.2.1`
- `@types/leaflet` : `^1.9.21`
- `recharts` : `^2.15.4`

### Exports et documents

- `jspdf` : `^4.2.1`
- `jspdf-autotable` : `^5.0.7`
- `xlsx` : `^0.18.5`

### Autres utilitaires

- `date-fns` : `^3.6.0`

### Tests/outillage

- `@eslint/js` : `^9.32.0`
- `@playwright/test` : `^1.57.0`
- `@testing-library/jest-dom` : `^6.6.0`
- `@testing-library/react` : `^16.0.0`
- `@types/node` : `^22.16.5`
- `@types/react` : `^18.3.23`
- `@types/react-dom` : `^18.3.7`
- `eslint` : `^9.32.0`
- `eslint-plugin-react-hooks` : `^5.2.0`
- `eslint-plugin-react-refresh` : `^0.4.20`
- `globals` : `^15.15.0`
- `jsdom` : `^20.0.3`
- `lovable-tagger` : `^1.1.13`
- `typescript-eslint` : `^8.38.0`
- `vitest` : `^3.2.4`

## Scripts disponibles

- `npm run dev` : lance le serveur de developpement Vite.
- `npm run build` : compile le build de production.
- `npm run build:dev` : compile le build en mode development.
- `npm run lint` : lance ESLint sur le projet.
- `npm run preview` : sert localement le build `dist/`.
- `npm run test` : lance les tests Vitest une fois.
- `npm run test:watch` : lance Vitest en mode watch.
- `npm run test:pages` : lance ou reutilise le serveur local, puis ouvre les routes principales dans le navigateur.

Sur Windows/PowerShell, les memes scripts peuvent etre lances avec `npm.cmd`, par exemple :

```bash
npm.cmd run build
```

## Lancer le projet

1. Installer les dependances :

```bash
npm install
```

2. Demarrer Vite :

```bash
npm run dev
```

3. Ouvrir :

```text
http://localhost:5173
```

4. Verifier le build :

```bash
npm run build
```

5. Lancer les tests unitaires :

```bash
npm run test
```

6. Ouvrir les pages principales pour test manuel :

```bash
npm run test:pages
```

Pour la procedure complete de recette manuelle page par page, voir `TESTING.md`.
