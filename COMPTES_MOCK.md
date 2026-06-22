# Comptes mock et donnees de demo

Ce fichier documente les comptes de test et les donnees mockees disponibles dans le frontend UI-only.

## Comptes de connexion

La connexion email/mot de passe passe par le stub `src/contexts/AuthContext.tsx`.

| Role | Email | Mot de passe | Page utile |
|---|---|---|---|
| Admin | `admin@kametud.local` | `demo1234` | `/admin` |
| Moderateur | `moderateur@kametud.local` | `demo1234` | `/moderateur` |
| Client | `marie.fotso@kametud.local` | `demo1234` | `/mes-commandes`, `/mes-demandes` |
| Etudiant | `aline.nkem@kametud.local` | `demo1234` | `/mes-missions`, `/mes-gigs`, `/mes-propositions` |

Si une session existe deja dans le navigateur, il faut se deconnecter avant de tester un autre compte. La session est stockee dans `localStorage` avec la cle `kametud_stub_auth`.

## Connexion telephone

Le flux telephone reste un stub. Pour les comptes ci-dessus, les numeros de test sont :

| Role | Telephone | OTP |
|---|---|---|
| Admin | `690000001` | `123456` |
| Moderateur | `690000002` | `123456` |
| Client | `690000003` | `123456` |
| Etudiant | `690000004` | `123456` |

## Fallback de developpement

Les emails inconnus continuent de creer un utilisateur mock avec le role defini par `MOCK_USER_ROLE` dans `src/contexts/AuthContext.tsx`. Ce fallback sert seulement aux tests rapides et devra etre remplace par l'authentification Spring Boot.

## Donnees mock ajoutees

Les donnees metier sont centralisees dans `src/hooks/stubs/useUiData.stub.ts`.

- Profils : plusieurs clients et etudiants, dont un utilisateur banni pour tester l'admin.
- Services : services academiques, numeriques, aide a domicile, bricolage et evenementiel.
- Demandes : demandes ouvertes et assignees pour tester `/demandes`, `/demandes/:id` et `/mes-demandes`.
- Propositions : statuts `pending`, `accepted` et `rejected` pour `/mes-propositions`.
- Commandes : statuts `pending`, `in_progress`, `delivered`, `completed`, `disputed` et `cancelled`.
- Chat : messages texte et systeme par commande.
- Avis : avis visibles sur les profils etudiants.
- Litiges : litiges ouverts, en revue et resolus pour l'espace moderateur.
- Verifications KYC : demandes en attente, approuvees et rejetees pour l'espace admin.
- Signalements : contenus signales pour l'onglet moderation admin.
- Revenus : valeurs de demonstration pour l'onglet revenu du profil etudiant proprietaire.

## Notifications

`src/contexts/NotificationContext.tsx` initialise maintenant quelques notifications mockees quand un utilisateur se connecte pour la premiere fois. Si l'utilisateur les supprime, le choix est conserve dans `localStorage`.

## Verification rapide

Commandes utiles apres modification :

```bash
npm.cmd exec tsc -- --noEmit
npm.cmd run build
npm.cmd run test
```
