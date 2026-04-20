
## Plan d'implémentation — Kam'Etud (frontend avec données simulées)

### Phase 1 : Modèles de données & État global
- Créer `src/types/index.ts` avec tous les types (User, Gig, Order, Review, Dispute, etc.)
- Créer `src/contexts/AuthContext.tsx` pour gérer l'authentification simulée (localStorage)
- Créer `src/data/mockData.ts` avec des données réalistes

### Phase 2 : Flux Client
1. **Recherche avancée** — Filtres par catégorie, ville, note sur `/services`
2. **Profil étudiant public** — Portfolio, gigs avec 3 paliers (basique/standard/premium)
3. **Commande** — Page `/commander/:gigId` : description mission, budget, paiement Mobile Money simulé (escrow)
4. **Suivi de mission** — Page `/mes-commandes` : statut, chat intégré, soumission livrable
5. **Validation & Révisions** — Accepter livrable ou demander révision (max 2)
6. **Notation** — Système 1-5 étoiles après mission

### Phase 3 : Flux Étudiant
1. **Inscription 3 étapes** (déjà fait) + upload CNI/carte étudiante
2. **Création de gigs** — Page `/mes-gigs/creer` : titre, 3 paliers prix, délai
3. **Portfolio** — Section travaux, photos, liens projets
4. **Localisation GPS & disponibilités**
5. **Gestion des demandes** — Accepter/refuser missions
6. **Soumission livrable** — Upload fichiers
7. **CV PDF** — Génération avec missions et notes

### Phase 4 : Flux Admin
1. **Dashboard enrichi** — Stats détaillées (utilisateurs actifs, missions, revenus)
2. **Vérification identité** — Validation CNI + carte, attribution badge
3. **Suspension/Bannissement** de comptes
4. **Modération gigs & avis** signalés
5. **Remboursements manuels**
6. **Export rapports** (Excel/PDF)
7. **Gestion catégories & villes**

### Phase 5 : Flux Modérateur
1. **Page `/moderateur`** — Liste des missions contestées
2. **Vue litige** — Versions client + étudiant, chat, livrables
3. **Arbitrage** — Valider livrable OU ordonner remboursement
4. **Déblocage/remboursement forcé**
5. **Signalement à l'admin**

### Routes à créer
- `/commander/:gigId` — Passer commande
- `/mes-commandes` — Suivi client
- `/mes-missions` — Suivi étudiant
- `/mes-gigs` — Gestion gigs étudiant
- `/mes-gigs/creer` — Créer un gig
- `/moderateur` — Dashboard modérateur
- `/admin/categories` — Gestion catégories
- `/admin/rapports` — Export rapports
