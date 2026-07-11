# Analyse de cohérence — Mémoire SCIM vs implémentation réelle

Comparaison entre `Memoire_SCIM_revise.docx` et le code réel (frontend `D:\Alvine\SCIM`, backend `D:\Alvine\dryApi\dryApp\SCIM`).

## ✅ Points cohérents (vérifiés dans le code)

- **Stack MERN** : React + Vite, Node/Express, MongoDB/Mongoose — confirmé.
- **Architecture 3-tiers** — confirmée.
- **Sécurité (Tableau 9)** : JWT + refresh token en cookie httpOnly, RBAC, Helmet/CORS/rate-limiting — tout existe (`dry/middlewares/protection/*`).
- **Cloudinary** et **Socket.io** — bien intégrés (`dry/services/cloudinary`, `dry/bootstrap/socket.js`).
- **Référence RSV/RES-XXXX**, entités `users/properties/reservations/favoris` — confirmées.
- **Structure modulaire backend** (modèle/contrôleur/route par feature, Tableau 6) — correspond exactement à `dryApp/SCIM/features/*`.
- **Structure frontend** (components/pages/contexts/hooks/utils) et **intercepteurs Axios** — confirmés (`src/lib/api.js`).
- Suite de tests d'intégration backend par module (`tests/SCIM/admin.test.js`, `reservation.test.js`, etc.) — plus solide que ce que le mémoire laisse entendre.

## ⚠️ Point de cohérence majeur

## ℹ️ Fonctionnalités réelles plus riches que décrites

- **Messagerie interne complète** (`message.send/inbox/getWith/markRead/deleteThread`, pages `MessagesPage`/`AdminMessagesPage`) — réduite dans le mémoire à un simple "secours WhatsApp" (Tableau 10/14).
- **Connexion Google (OAuth)** — présente côté frontend (`LoginPage`, `AuthCallbackPage`), absente de la section sécurité du mémoire, signalée comme désactivée côté doc backend.
- **Tableau de bord admin** avec analytics (revenus/utilisateurs/biens) plus étoffé que la description sommaire du mémoire.

## ❌ Affirmations du mémoire non retrouvées dans le code

### 1. Vérification de disponibilité anti-double-réservation
> Mémoire (Règle de gestion #1 + Discussion §4, Partie 3 Ch.2) : *"Un bien ne peut être réservé que s'il est disponible"* / *"le mécanisme de vérification de disponibilité... a permis, lors des tests, d'empêcher systématiquement les doubles réservations."*

Code (`dryApp/SCIM/features/reservation/controller/reservation.create.controller.js`) : aucune requête ne vérifie l'existence d'une réservation active sur le même bien avant d'en créer une nouvelle. Rien n'empêche deux clients de réserver le même bien.

### 2. Statut de réservation "terminée"
> Mémoire (§Organisation du backend, Tableau 15) : cycle *"en attente → confirmée → annulée ou terminée"*.

Code (`reservation.schema.js` ligne 3) : `STATUS_ENUM = ['en_attente', 'confirmee', 'annulee']` — 3 statuts seulement, pas de "terminée".

### 3. dateDébut / dateFin de la réservation
> Mémoire (Tableau 4, attributs classe Réservation) : `dateDébut, dateFin`.

Code : un seul champ `date` (rendez-vous de visite ponctuel), pas de période.

### 4. Calcul du montant à la création
> Mémoire (§Organisation du backend) : *"création (vérification de la disponibilité, calcul du montant, statut initial)"*.

Code : aucun champ montant/prix dans `reservation.schema.js`, aucune logique de calcul dans `reservation.create.controller.js`.    
