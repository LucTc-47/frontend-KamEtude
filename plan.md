# Plan d'avancement Kam'Etud frontend

Ce fichier resume l'etat courant du frontend et les prochaines etapes. Il remplace l'ancien plan centre sur la creation initiale de pages : la majorite des routes UI existent deja.

## Objectif actuel

Maintenir `frontend-KamEtude` comme frontend React UI-only, sans Supabase, pret a etre reconnecte a un backend Spring Boot.

## Etat realise

- UI la plus recente migree depuis `project-compass`.
- Routes principales declarees dans `src/App.tsx`.
- Pages publiques, client, etudiant, admin et moderateur presentes.
- Dossier racine `supabase/` supprime du frontend.
- Dossiers `src/integrations/supabase/` et `src/integrations/lovable/` supprimes.
- Dependances `@supabase/supabase-js` et `@lovable.dev/cloud-auth-js` retirees.
- Couche data remplacee par `src/hooks/useUiData.ts` et `src/hooks/stubs/useUiData.stub.ts`.
- Auth locale stub dans `src/contexts/AuthContext.tsx`.
- Role de test centralise via `MOCK_USER_ROLE`.
- Google OAuth conserve en composant UI stub.
- Assets visuels presents : `public/kam-etud-hero.mp4`, `src/assets/hero-bg.jpg`.
- Tests manuels documentes dans `TESTING.md`.
- Script `npm run test:pages` ajoute.

## Routes couvertes

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
- `*`

## Priorite 1 : Contrats Spring Boot

Definir les contrats API avant de remplacer les stubs :

- Auth : login, register, logout, refresh/session, roles.
- Profils : profil courant, profils publics, profils admin.
- Gigs : liste, detail, creation, publication, activation, suppression.
- Categories et villes.
- Demandes clients et propositions etudiantes.
- Commandes : creation, statuts, livrables, revisions, validation.
- Paiement Campay : initiation, statut, webhook, payout.
- Chat : messages par commande.
- Notifications.
- KYC/verifications.
- Litiges et moderation.
- Rapports admin.

## Priorite 2 : Client API frontend

Creer une couche API dediee, sans appels directs depuis les pages :

```text
src/lib/api/
  client.ts
  auth.ts
  gigs.ts
  orders.ts
  requests.ts
  admin.ts
```

Les hooks de `src/hooks/useUiData.ts` pourront ensuite utiliser cette couche API.

## Priorite 3 : Remplacement progressif des stubs

Ordre conseille :

1. `AuthContext.tsx` : remplacer la session locale par JWT/session Spring Boot.
2. Profils et role utilisateur courant.
3. Catalogue services : gigs, categories, villes.
4. Demandes/propositions.
5. Commandes et missions.
6. Paiement Campay et payouts.
7. Chat et notifications temps reel.
8. Admin et moderation.

Pendant cette phase, garder les signatures des hooks aussi stables que possible pour eviter de reecrire les pages.

## Priorite 4 : Qualite et tests

- Completer les tests unitaires Vitest autour des hooks et composants critiques.
- Ajouter des tests de rendu pour les pages protegees par role.
- Ajouter plus tard des tests E2E Playwright pour les parcours :
  - inscription client ;
  - inscription etudiant ;
  - creation de gig ;
  - commande client ;
  - demande client et proposition etudiante ;
  - moderation de litige ;
  - dashboard admin.
- Continuer a maintenir `TESTING.md` a chaque nouvelle route.

## Points d'attention

- Ne pas reintroduire `supabase`, `@supabase` ou `lovable.dev` dans `src/`.
- Ne pas stocker de secret Campay dans le frontend.
- Ne pas appeler Campay directement depuis le navigateur.
- Ne pas importer une couche API directement dans les composants si un hook peut encapsuler l'usage.
- Verifier le role de test apres chaque changement de `MOCK_USER_ROLE`.

## Commandes de verification

```bash
npm run build
npm run test
npm run test:pages
rg -n "supabase|@supabase|lovable.dev" src
```

Le build peut afficher des avertissements de taille de chunk ou Browserslist ancien. Ces avertissements sont connus et ne bloquent pas l'etat UI-only actuel.
