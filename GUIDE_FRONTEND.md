# Guide du Frontend - Project Compass

## Introduction

Ce projet est un frontend React/TypeScript utilisant Vite, Shadcn/UI, et Tailwind CSS. Il est actuellement connecté à Supabase pour la gestion des données, mais sera migré vers un backend Spring Boot avec microservices. Ce guide explique comment vérifier, modifier et étendre le frontend en local.

## Prérequis

- **Node.js** (version 18+ recommandée)
- **npm** ou **yarn**
- **Git** pour cloner le repo
- Un éditeur comme VS Code
- (Optionnel) Un compte Supabase pour les tests actuels

## Installation et Lancement en Local

1. **Cloner le repo** :
   ```
   git clone <url-du-repo>
   cd project-compass
   ```

2. **Installer les dépendances** :
   ```
   npm install
   ```

3. **Configurer l'environnement** :
   - Copiez `.env.example` vers `.env` (si disponible) et remplissez les variables (ex. : clés Supabase).
   - Pour les tests locaux, vous pouvez utiliser des valeurs fictives ou configurer Supabase.

4. **Lancer le serveur de développement** :
   ```
   npm run dev
   ```
   - L'app sera accessible sur `http://localhost:5173`/ ce que npm run dev va vous fournir.
   - Utilisez `npm run build` pour un build de production, puis `npm run preview` pour le tester.

5. **Vérifier le build** :
   ```
   npm run build
   ```
   - Corrigez les erreurs TypeScript/ESLint si elles apparaissent.

## Vérification du Frontend en Local

### 1. **Vue d'ensemble : Lancer l'app et naviguer**
   - Démarrez avec `npm run dev`.
   - Ouvrez `http://localhost:5173`ou(ce que npm run dev va vous fournir) dans un navigateur.
   - Testez la navigation : Cliquez sur les liens du menu (accueil, services, etc.).
   - Vérifiez la responsivité : Redimensionnez la fenêtre ou utilisez les DevTools pour simuler mobile.

### 2. **Vérifier chaque page**
   - **Pages publiques** (sans connexion) :
     - `/` (Accueil) : Vérifiez le hero, sections, et appels à l'action.
     - `/services` : Liste des services, cartes, et interactions.
     - `/comment-ca-marche` : Contenu explicatif, étapes.
     - `/connexion` et `/inscription` : Formulaires, validation.
     - `/inscription/etudiant` et `/inscription/client` : Champs spécifiques.
     - URLs invalides : Doit afficher la page 404.

   - **Pages privées** (nécessitent connexion) :
     - Connectez-vous via `/connexion` (utilisez un compte test ou créez-en un).
     - `/profil/:id` : Profil utilisateur, données dynamiques.
     - `/commander/:gigId` : Formulaire de commande, intégration Supabase.
     - `/mes-commandes`, `/mes-missions`, `/mes-gigs` : Listes et gestion.
     - `/mes-gigs/creer` : Formulaire de création.
     - `/admin` et `/moderateur` : Dashboards (droits requis).

   - **Pour chaque page** :
     - Vérifiez le chargement : Pas d'erreurs console (F12 > Console).
     - Interactions : Clics, formulaires, soumissions.
     - Données : Vérifiez que les données Supabase se chargent (ou simulez si migré).
     - Accessibilité : Navigation clavier, contrastes.

### 3. **Vérifier les composants et fonctionnalités**
   - **UI Components** (`src/components/ui/`) : Testez les boutons, modales, formulaires (ex. : `Button`, `Dialog`).
   - **Layouts** (`src/components/layout/`) : Navbar, Footer – vérifiez la cohérence.
   - **Pages spécifiques** (`src/pages/`) : Intégrez avec les routes dans `App.tsx`.
   - **Hooks et Contextes** (`src/hooks/`, `src/contexts/`) : Auth, Theme, Language – testez les changements d'état.
   - **Intégrations** : Supabase (`src/integrations/supabase/`) – vérifiez les requêtes API.
   - **Thèmes et Langues** : Basculez via les contextes.

### 4. **Tests automatisés**
   - **Unitaires** : `npm run test` (Vitest) – Vérifiez les composants isolés.
   - **E2E** : `npx playwright test` (après `npm run dev` en parallèle) – Simulez un utilisateur.
   - Ajoutez des tests pour les nouvelles fonctionnalités.

## Modifier et Ajouter au Frontend

### Structure du Projet
- `src/` : Code source.
  - `components/` : Composants réutilisables (UI, layouts, spécifiques).
  - `pages/` : Pages React (une par route).
  - `contexts/` : Gestion d'état global (Auth, Theme, etc.).
  - `hooks/` : Hooks personnalisés (ex. : `useSupabaseData`).
  - `integrations/` : Connexions externes (Supabase).
  - `lib/` : Utilitaires (styles, helpers).
  - `types/` : Définitions TypeScript.
- `public/` : Assets statiques.
- Configs : `vite.config.ts`, `tailwind.config.ts`, etc.

### Bonnes Pratiques pour les Modifications
1. **Utilisez TypeScript** : Tout code doit être typé pour éviter les erreurs.
2. **Composants Shadcn/UI** : Pour l'UI, utilisez les composants existants ou ajoutez-en via `npx shadcn@latest add <component>`.
3. **Styles** : Tailwind CSS pour les classes. Utilisez `class-variance-authority` pour les variantes.
4. **État** : Préférez React Query pour les données API, Context pour l'état global.
5. **Linting** : `npm run lint` avant commit.
6. **Commits** : Utilisez des messages descriptifs et testez avant push.

### Ajouter une Nouvelle Page/Fonctionnalité
1. **Créer la page** : Ajoutez un fichier dans `src/pages/` (ex. : `NewPage.tsx`).
2. **Ajouter la route** : Dans `App.tsx`, importez et ajoutez `<Route path="/nouvelle-page" element={<NewPage />} />`.
3. **Composants** : Créez des composants dans `src/components/` si réutilisables.
4. **Données** : Utilisez des hooks pour Supabase (actuellement) ou préparez pour Spring Boot.
5. **Tests** : Ajoutez des tests unitaires et E2E.
6. **Migration Backend** : Pour Spring Boot, remplacez les appels Supabase par des appels API REST (ex. : `fetch('/api/...')`). Préparez des interfaces pour les microservices.

### Migration vers Spring Boot
- Actuellement : Données via Supabase (client dans `src/integrations/supabase/`).
- Futur : Remplacez par des appels vers votre backend Spring Boot (ex. : endpoints REST pour auth, gigs, etc.).
- Étapes :
  1. Définissez les APIs dans Spring Boot.
  2. Mettez à jour les hooks (ex. : `useSupabaseData.ts` vers `useApiData.ts`).
  3. Testez les intégrations avec des mocks ou un serveur local Spring Boot.
  4. Mettez à jour `.env` pour les URLs du backend.

## Dépannage
- **Erreurs build** : `npm run lint` et corrigez TypeScript.
- **Problèmes Supabase** : Vérifiez `.env` et les clés API.
- **Tests échouent** : Lancez `npm run dev` en parallèle pour E2E.
- **Questions** : Consultez la doc React/Vite ou demandez dans les issues du repo.

Ce guide évoluera avec la migration backend. Bonne contribution !