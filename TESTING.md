# Tests manuels frontend-KamEtude

Ce document sert de guide de verification manuelle pour le frontend UI-only. Il couvre les routes declarees dans `src/App.tsx`, les donnees mockees et les roles du stub d'authentification.

## Etat du perimetre

- Le frontend ne depend d'aucun backend pour afficher les pages.
- Les donnees viennent des stubs `src/hooks/useUiData.ts` et `src/hooks/stubs/useUiData.stub.ts`.
- Les roles viennent du stub `src/contexts/AuthContext.tsx`.
- Les actions reseau futures sont marquees par `TODO(backend)` dans le code.
- Le paiement Campay, Google OAuth, les uploads et les abonnements temps reel sont des simulations UI.

## Demarrage rapide

1. Installer les dependances si ce n'est pas deja fait :

```bash
npm install
```

2. Lancer le serveur de developpement :

```bash
npm run dev
```

L'URL locale par defaut de Vite est :

```text
http://localhost:5173
```

3. Ouvrir automatiquement les pages principales dans le navigateur :

```bash
npm run test:pages
```

Le script `scripts/test-pages.mjs` verifie si le serveur repond sur `http://localhost:5173`. S'il ne repond pas, il lance `npm run dev`, attend que Vite soit pret, puis ouvre un onglet par route avec un delai court entre chaque ouverture. Avant chaque ouverture, il affiche le nom de la page et le role requis. Si le script a lance le serveur lui-meme, appuyer sur `Ctrl+C` pour l'arreter.

Toutes les donnees metier sont mockees via `src/hooks/useUiData.ts` et `src/hooks/stubs/`. Rien n'est persistant cote backend, et aucun backend reel n'est necessaire pour tester l'affichage. Les mutations affichent des toasts ou des logs, puis restent des points d'extension pour Spring Boot.

## Validation technique rapide

Avant une passe de recette, lancer :

```bash
npm run build
npm run test
```

Verification anti-regression Supabase/Lovable :

```bash
rg -n "supabase|@supabase|lovable.dev" src
```

La commande ne doit retourner aucun import ni usage backend dans `src/`.

## Simuler une connexion (Auth stub)

Le stub d'authentification est dans `src/contexts/AuthContext.tsx`.

- L'etat courant est stocke dans le state React de `AuthProvider`.
- Une copie est conservee dans `localStorage` avec la cle `kametud_stub_auth`, afin de rester connecte apres un refresh.
- Le formulaire `/connexion` accepte n'importe quel email et mot de passe en mode stub.
- Le login par telephone accepte aussi le flux OTP cote UI : l'envoi et la verification sont des fonctions stub.
- `logout()` efface le state local et la cle `localStorage`.

Pour choisir le role a tester, modifier la constante en haut de `src/contexts/AuthContext.tsx` :

```ts
export const MOCK_USER_ROLE: UserRole = 'client';
```

Valeurs possibles :

- `client`
- `student`
- `moderator`
- `admin`

Apres modification :

1. Relancer le dev server si necessaire.
2. Se deconnecter si une session existe deja, ou supprimer la cle `kametud_stub_auth` dans le navigateur.
3. Revenir sur `/connexion` et se connecter avec n'importe quel email/mot de passe.

Ce mecanisme est temporaire et sert uniquement aux tests UI. Il devra disparaitre ou etre remplace quand l'authentification Spring Boot fournira les vrais roles.

## Tableau recapitulatif des pages

| Route | Fichier source | Role requis | But de la page |
|---|---|---|---|
| `/` | `src/pages/Index.tsx` | Public | Accueil avec hero, categories, explication, confiance et CTA. |
| `/services` | `src/pages/Services.tsx` | Public | Explorer les gigs mockes, filtrer, passer en vue carte et lancer une commande. |
| `/comment-ca-marche` | `src/pages/HowItWorks.tsx` | Public | Expliquer le parcours, la securite, l'escrow et les etapes. |
| `/connexion` | `src/pages/auth/Login.tsx` | Public | Tester les formulaires de connexion email et telephone. |
| `/inscription` | `src/pages/auth/Register.tsx` | Public | Choisir un type de compte client ou etudiant. |
| `/inscription/etudiant` | `src/pages/auth/RegisterStudent.tsx` | Public | Tester l'inscription etudiant avec etapes, documents et verification mockee. |
| `/inscription/client` | `src/pages/auth/RegisterClient.tsx` | Public | Tester l'inscription client avec ville et acceptation CGU. |
| `/profil/:id` | `src/pages/StudentProfile.tsx` | Public, proprietaire avec `student` | Voir le profil etudiant mock, CV, services, avis, competences et revenus proprietaire. |
| `/mes-missions` | `src/pages/MyMissions.tsx` | `student` | Suivre les missions etudiant, chat, livrables et litiges. |
| `/mes-gigs` | `src/pages/MyGigs.tsx` | `student` | Gerer les gigs de l'etudiant : publier, activer, supprimer. |
| `/mes-gigs/creer` | `src/pages/CreateGig.tsx` | `student` | Creer un gig avec tiers, categories, ville et publication. |
| `/mes-propositions` | `src/pages/MyProposals.tsx` | `student` | Voir les propositions envoyees aux demandes clients. |
| `/commander/:gigId` | `src/pages/OrderPage.tsx` | `client` | Commander un gig mock avec tier, description et paiement stub. |
| `/mes-commandes` | `src/pages/MyOrders.tsx` | `client` | Voir commandes client, paiement stub, chat, validation, avis et litiges. |
| `/demandes` | `src/pages/Requests.tsx` | Public, actions client | Voir les demandes ouvertes et publier une demande en role client. |
| `/demandes/:id` | `src/pages/RequestDetail.tsx` | `client` ou `student` | Voir une demande, proposer comme etudiant ou accepter/annuler comme client. |
| `/mes-demandes` | `src/pages/MyRequests.tsx` | `client` | Voir les demandes publiees par le client connecte. |
| `/moderateur` | `src/pages/ModeratorDashboard.tsx` | `moderator` | Arbitrer les litiges et consulter les onglets ouverts/resolus. |
| `/admin` | `src/pages/AdminDashboard.tsx` | `admin` | Consulter dashboard admin, utilisateurs, verifications, commandes, categories, rapports. |
| `/confidentialite` | `src/pages/Privacy.tsx` | Public | Lire la politique de confidentialite. |
| `/cgu` | `src/pages/Terms.tsx` | Public | Lire les conditions generales. |
| `*` | `src/pages/NotFound.tsx` | Public | Afficher la page 404 pour une route inconnue. |

## Checklist detaillee par page

### Accueil - `/`

- [ ] La page se charge sans erreur console.
- [ ] La navbar affiche les liens publics, le bouton langue, le theme et les actions auth.
- [ ] Le hero affiche la video `kam-etud-hero.mp4` avec fallback image `hero-bg.jpg`.
- [ ] Les boutons principaux menent vers `/services` et `/inscription`.
- [ ] Les sections categories, fonctionnement, confiance et CTA s'affichent dans l'ordre.
- [ ] Les animations Framer Motion ne provoquent pas de decalage visuel.
- [ ] Le responsive fonctionne sur largeur mobile.

### Services - `/services`

- [ ] La liste des gigs mockes s'affiche avec titre, etudiant, prix, badge et rating.
- [ ] La recherche textuelle filtre les cartes sans erreur.
- [ ] Les filtres ville, note, categorie et distance sont visibles.
- [ ] Le bouton de geolocalisation gere refus ou acceptation navigateur sans casser l'affichage.
- [ ] Le switch liste/carte fonctionne, et la carte Leaflet s'affiche en mode carte.
- [ ] Cliquer une carte service ouvre `/commander/stub-gig-1`.
- [ ] Le bouton reset remet les filtres a zero.
- [ ] Le responsive garde les cartes lisibles.

### Comment ca marche - `/comment-ca-marche`

- [ ] La page se charge sans erreur console.
- [ ] Les sections explicatives issues de `HowItWorksSection`, `TrustSection` et `CTASection` s'affichent.
- [ ] Les icones securite, paiement et revisions sont visibles.
- [ ] Les appels a l'action restent cliquables.
- [ ] Les textes FR/EN changent avec le toggle langue.
- [ ] Le responsive ne superpose pas les blocs.

### Connexion - `/connexion`

- [ ] La page se charge sans erreur console.
- [ ] Les onglets email et telephone sont visibles.
- [ ] Avec n'importe quel email/mot de passe, le stub connecte l'utilisateur.
- [ ] Le role obtenu correspond a `MOCK_USER_ROLE` dans `AuthContext.tsx`.
- [ ] Le flux telephone affiche l'envoi OTP puis accepte une verification UI.
- [ ] Le bouton Google OAuth affiche un toast/warning sans action reelle.
- [ ] Les liens vers inscription sont visibles.

### Inscription - `/inscription`

- [ ] Les cartes client et etudiant s'affichent clairement.
- [ ] Les cartes menent vers `/inscription/client` et `/inscription/etudiant`.
- [ ] Le bouton Google OAuth stub est visible.
- [ ] Les animations d'entree ne cachent aucun contenu.
- [ ] La page reste propre en mobile.

### Inscription etudiant - `/inscription/etudiant`

- [ ] Le formulaire multi-etapes avance seulement quand les champs requis sont remplis.
- [ ] Les champs nom, email, telephone, mot de passe et confirmation sont presents.
- [ ] Les champs universite, filiere, niveau, bio et competences sont visibles.
- [ ] Les badges de competences peuvent etre selectionnes.
- [ ] Les inputs documents CNI, selfie et carte etudiante acceptent un fichier cote UI.
- [ ] Soumettre appelle `register`, `uploadFile` et `useCreateVerification` en stub sans erreur.
- [ ] Le bouton Google OAuth stub ne casse pas le formulaire.
- [ ] Tester avec `MOCK_USER_ROLE = 'student'` si l'on veut rester ensuite en parcours etudiant.

### Inscription client - `/inscription/client`

- [ ] Les champs identite, email, telephone, mot de passe, ville et acceptation CGU sont presents.
- [ ] La liste des villes vient du stub `useCities`.
- [ ] Le bouton creer est desactive tant que les conditions ne sont pas acceptees.
- [ ] Soumettre cree une session locale stub.
- [ ] Le bouton Google OAuth stub affiche son message temporaire.
- [ ] Tester avec `MOCK_USER_ROLE = 'client'`.

### Profil etudiant - `/profil/:id`

Exemple utile : `/profil/stub-student-1`.

- [ ] Le profil mock affiche nom, avatar/fallback, universite, ville, rating et badge.
- [ ] Les onglets services, avis et competences sont visibles.
- [ ] Les cartes de services du profil menent vers la commande.
- [ ] Le bouton CV genere un PDF sans backend.
- [ ] Les avis vides ou mockes n'affichent pas d'erreur.
- [ ] Avec un utilisateur proprietaire et `MOCK_USER_ROLE = 'student'`, l'onglet revenus apparait.
- [ ] Les actions avatar et numero de retrait restent des stubs sans erreur JS.

### Mes missions - `/mes-missions`

Utiliser `MOCK_USER_ROLE = 'student'`.

- [ ] La page ne redirige pas une fois connecte en role etudiant.
- [ ] Les onglets missions actives/passees s'affichent.
- [ ] L'etat vide est comprehensible si le stub retourne zero mission.
- [ ] Les boutons accepter/refuser/livrer sont visibles quand une mission mock sera ajoutee.
- [ ] Le chat ouvre une modale et l'envoi de message appelle le stub.
- [ ] L'upload de livrable utilise `uploadFile` stub sans backend.
- [ ] Le responsive conserve les cartes lisibles.

### Mes gigs - `/mes-gigs`

Utiliser `MOCK_USER_ROLE = 'student'`.

- [ ] Les gigs mockes de l'etudiant s'affichent.
- [ ] Les boutons publier/depublier, activer/desactiver et supprimer sont visibles.
- [ ] Les actions declenchent des mutations stub sans erreur.
- [ ] Le bouton creer mene vers `/mes-gigs/creer`.
- [ ] Les badges publie/brouillon et actif/inactif restent lisibles.
- [ ] Le responsive fonctionne sur mobile.

### Creer un gig - `/mes-gigs/creer`

Utiliser `MOCK_USER_ROLE = 'student'`.

- [ ] Les champs titre, description, categorie et ville sont presents.
- [ ] Les categories et villes viennent des hooks stubs.
- [ ] Les trois tiers basique, standard et premium sont editables.
- [ ] Ajouter/supprimer des features ne casse pas le layout.
- [ ] Le toggle publier maintenant respecte l'etat `verified` du user stub.
- [ ] Soumettre appelle `useCreateGig` et affiche un toast, puis navigue vers `/mes-gigs`.

### Mes propositions - `/mes-propositions`

Utiliser `MOCK_USER_ROLE = 'student'`.

- [ ] La liste de propositions mockes s'affiche si un utilisateur est connecte.
- [ ] Les badges de statut sont visibles.
- [ ] Les montants, delais et date de creation sont formates.
- [ ] Les liens vers les demandes fonctionnent.
- [ ] L'etat vide reste propre si les mocks sont retires.

### Commander - `/commander/:gigId`

Exemple utile : `/commander/stub-gig-1`. Utiliser `MOCK_USER_ROLE = 'client'`.

- [ ] La page affiche le gig mock et ses trois tiers.
- [ ] Changer de tier met a jour le recapitulatif.
- [ ] La description et le telephone sont obligatoires.
- [ ] La validation du numero camerounais affiche une erreur si le format est invalide.
- [ ] Le choix MTN/Orange Money est visible.
- [ ] Cliquer payer cree une commande stub et affiche un toast paiement temporaire.
- [ ] Aucun appel backend reel n'est attendu.

### Mes commandes - `/mes-commandes`

Utiliser `MOCK_USER_ROLE = 'client'`.

- [ ] La page affiche les onglets commandes actives/passees.
- [ ] L'etat vide contient un lien vers `/services`.
- [ ] Les actions paiement, chat, litige, validation et avis restent disponibles quand des commandes mock seront ajoutees.
- [ ] Les modales chat/litige/avis s'ouvrent sans erreur.
- [ ] Le paiement et le payout affichent des toasts de stub.
- [ ] Le responsive garde les cartes utilisables.

### Demandes - `/demandes`

- [ ] Les demandes ouvertes mockees s'affichent.
- [ ] Les cartes montrent budget, ville, categorie, client et deadline.
- [ ] En role `client`, le bouton nouvelle demande est visible.
- [ ] La modale nouvelle demande contient titre, description, categorie, ville, budget et date limite.
- [ ] Soumettre une demande appelle `useCreateGigRequest` stub et ferme la modale.
- [ ] En role `student`, la page sert surtout a consulter les demandes et aller au detail.

### Detail demande - `/demandes/:id`

Exemple utile : `/demandes/stub-request-1`.

- [ ] Le detail de la demande mock s'affiche.
- [ ] Les propositions liees s'affichent avec prix, delai, message et statut.
- [ ] Avec `MOCK_USER_ROLE = 'student'`, le formulaire de proposition apparait si l'etudiant est verifie.
- [ ] Soumettre une proposition appelle `useCreateProposal` stub.
- [ ] Avec `MOCK_USER_ROLE = 'client'` et proprietaire mock, le bouton annuler/acceptation est visible selon les donnees.
- [ ] Les actions acceptation et annulation restent des stubs sans erreur.

### Mes demandes - `/mes-demandes`

Utiliser `MOCK_USER_ROLE = 'client'`.

- [ ] Les demandes du client connecte s'affichent.
- [ ] Chaque carte montre titre, budget, ville, statut et date.
- [ ] Le bouton publier une demande renvoie vers `/demandes`.
- [ ] Les liens de detail renvoient vers `/demandes/stub-request-1`.
- [ ] L'etat vide reste lisible.

### Moderateur - `/moderateur`

Utiliser `MOCK_USER_ROLE = 'moderator'`.

- [ ] La page ne redirige pas une fois connecte en role moderateur.
- [ ] La sidebar moderateur s'affiche.
- [ ] Les onglets litiges ouverts/resolus sont presents.
- [ ] L'etat vide des litiges est propre avec les stubs actuels.
- [ ] Quand un litige mock sera ajoute, la modale arbitrage permettra note, remboursement, validation livrable et signalement.
- [ ] Les mutations d'arbitrage restent des stubs sans erreur.

### Admin - `/admin`

Utiliser `MOCK_USER_ROLE = 'admin'`.

- [ ] La page ne redirige pas une fois connecte en role admin.
- [ ] La sidebar admin affiche dashboard, utilisateurs, verifications, commandes, moderation, categories et rapports.
- [ ] Le dashboard affiche les cartes de statistiques calculees depuis les mocks.
- [ ] L'onglet utilisateurs affiche le tableau, la recherche et les actions ban/activer.
- [ ] L'onglet verifications affiche l'etat vide ou les cartes KYC mockees.
- [ ] L'onglet commandes affiche le tableau et le bouton auto-valider.
- [ ] L'onglet categories permet creer, activer/desactiver et supprimer via stubs.
- [ ] Les exports Excel/PDF se declenchent sans backend.

### Confidentialite - `/confidentialite`

- [ ] Le texte legal s'affiche dans le layout standard.
- [ ] Le contenu change correctement avec la langue si disponible.
- [ ] La navbar et le footer restent visibles.
- [ ] Le responsive conserve une largeur de lecture confortable.

### CGU - `/cgu`

- [ ] Les conditions generales s'affichent.
- [ ] Les sections sont lisibles et correctement espacees.
- [ ] La langue FR/EN fonctionne si le contenu traduit est present.
- [ ] Le responsive ne coupe pas les paragraphes.

### Page 404 - `*`

Exemple utile : `/route-inexistante-test`.

- [ ] La page 404 s'affiche pour une route inconnue.
- [ ] Le message d'erreur est lisible.
- [ ] Le lien de retour vers l'accueil fonctionne.
- [ ] Aucune erreur console n'apparait.

## Problemes connus / limitations actuelles

- Le bouton Google OAuth est un stub : il affiche un toast/warning et n'ouvre aucun vrai flux OAuth2.
- Les notifications sont locales et ne sont pas temps reel.
- Les hooks dans `src/hooks/stubs/` renvoient des donnees mockees ou des listes vides selon les pages.
- Les mutations create/update/delete ne persistent pas les donnees apres refresh.
- Le paiement Campay et les payouts sont representes par des toasts de stub.
- Les uploads avatar, documents KYC et livrables utilisent des URLs locales temporaires ou des no-op.
- Les pages admin/moderateur dependent du role local `MOCK_USER_ROLE`; il faut se reconnecter apres avoir change la constante.
- Le script `npm run test:pages` ouvre les routes avec des IDs mockes connus (`stub-gig-1`, `stub-request-1`, `stub-student-1`) et ne remplace pas une vraie validation fonctionnelle.
