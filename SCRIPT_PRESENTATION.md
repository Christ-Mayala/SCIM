# Script de Presentation - SCIM
## Soutenance Immobilier de Prestige | ~20 minutes

---

## PLAN GLOBAL

| Section | Duree | Cumul |
|---------|-------|-------|
| 1. Introduction et Accroche | 1 min 30 | 1:30 |
| 2. Problematique et Contexte | 2 min | 3:30 |
| 3. Presentation de SCIM | 2 min | 5:30 |
| 4. Architecture Technique | 3 min | 8:30 |
| 5. Fonctionnalites Client | 3 min | 11:30 |
| 6. Fonctionnalites Admin | 2 min 30 | 14:00 |
| 7. Defis Techniques et Solutions | 2 min 30 | 16:30 |
| 8. Deploiement et Mise en Production | 1 min | 17:30 |
| 9. Conclusion et Perspectives | 1 min 30 | 19:00 |
| 10. Questions du Jury | 5 min+ | 24:00+ |

---

## SECTION 1 - Introduction et Accroche
**Duree : 1 min 30**

Ce que tu dis :

> Bonjour, merci de votre presence. Aujourd'hui, je vais vous presenter **SCIM**, une application web immobilier de prestige que j'ai developpee integralement, de la conception a la mise en production.

*(Pause 2 secondes)*

> Pour vous donner une idee concrete, imaginez un site comme Barnes ou Knight Frank - cette elegance, cette simplicite - mais adapte au marche congolais. C'est exactement ce que SCIM propose.

> Je vais d'abord vous expliquer le contexte et la problematique, puis vous montrer l'application en detail, et enfin aborder les choix techniques que j'ai faits.

**Conseil** : Lance le frontend en arriere-plan pendant que tu parles pour que l'ecran affiche la page d'accueil.

---

## SECTION 2 - Problematique et Contexte
**Duree : 2 min**

Ce que tu dis :

> Le marche immobilier congolais, et plus particulierement celui de Brazzaville, est un marche en pleine croissance. Cependant, il souffre de plusieurs problemes majeurs :

> **Premierement** : l'absence de plateformes numeriques professionnelles. Les annonces sont souvent publiees sur des groupes Facebook ou via le bouche-a-oreille. Il n'existe rien de standardise, de fiable.

> **Deuxiemement** : le manque de securisation des transactions. Sans systeme de verification, les risques de fraudes sont eleves.

> **Troisiemement** : la gestion manuelle. Les proprietaires gerent leurs biens via des appels telefoniques et des messages WhatsApp, ce qui est chronophage et peu professionnel.

*(Montre la page d'accueil de SCIM)*

> SCIM repond a ces trois problemes en proposant une plateforme centralisee, securisee et elegante, specialement concue pour le marche congolais.

---

## SECTION 3 - Presentation de SCIM
**Duree : 2 min**

Ce que tu dis :

> SCIM est une plateforme immobiliere de prestige qui permet :

> Aux **clients** de rechercher, reserver et visiter des biens immobiliers de qualite.

> Aux **proprietaires** de publier leurs annonces avec des photos, des descriptions detaillees et des tarifs.

> Aux **administrateurs** de gerer l'ensemble de la plateforme avec un tableau de bord complet et des analytics.

*(Navigue vers les differentes sections pendant que tu parles)*

> L'application est accessible sur **tous les appareils** - mobile, tablette, desktop - grace a un design responsive mobile-first.

> Le design s'inspire des grands noms du luxe immobilier mondial : **Barnes**, **Knight Frank**, **Safti**. Vous remarquerez la palette de couleurs sombres avec des touches dorees, les animations subtiles et la typographie premium.

**Conseil** : Montre rapidement les differentes pages en naviguant (Accueil, Proprietes, Detail d'un bien).

---

## SECTION 4 - Architecture Technique
**Duree : 3 min**

Ce que tu dis :

> Passons a la partie technique. SCIM est construite avec une architecture moderne en **3 couches**.

> **Le frontend** est developpe avec **React 19** et **Vite**, qui offre un chargement ultra-rapide. Le styling est assure par **Tailwind CSS v4** avec un theme personnalise. J'ai utilise **React Router v7** pour la navigation et **Framer Motion** pour les animations.

> **Le backend** est une API RESTful developpee avec **Node.js** et **Express**, deployee sur **Render**. La base de donnees est **MongoDB**.

> **L'authentification** utilise un systeme hybride securise : un Access Token stocke dans le localStorage, et un Refresh Token stocke dans un cookie httpOnly. Quand le token expire, un intercepteur Axios detecte automatiquement le 401 et renouvelle le token sans que l'utilisateur ne perde sa session.

*(Montre l'arborescence du projet)*

> Voici la structure du projet :

```
src/
├── components/     → Composants reutilisables (UI, layout, properties, auth)
├── contexts/       → Gestion d'etat globale (Auth, Property, Message, Settings)
├── core/           → Routing et layouts proteges
├── features/       → Pages admin et client
├── hooks/          → Hooks personnalises
├── lib/            → API, utilitaires
├── pages/          → Pages publiques
└── utils/          → Donnees SEO, helpers
```

> J'ai organise le code en **features** pour une separation claire entre l'espace client et l'espace administrateur.

---

## SECTION 5 - Fonctionnalites Client
**Duree : 3 min**

Ce que tu dis :

> Voici les fonctionnalites principales cote client.

*(Montre chaque ecran en naviguant)*

> **Inscription et connexion** : L'utilisateur peut creer un compte avec email/mot de passe, ou se connecter via social login. La session est persistee automatiquement.

> **Recherche avancee** : Les utilisateurs peuvent filtrer les biens par categorie - appartements, maisons, terrains, commerciaux - par type de transaction - vente ou location - par ville, prix, surface, nombre de chambres et salles de bain. La recherche est synchronisee avec l'URL, ce qui permet de partager un lien de recherche.

> **Detail d'un bien** : Chaque bien dispose d'une page detaillee avec galerie de photos, description, caracteristiques, carte de localisation et notation par les utilisateurs.

> **Reservation de visite** : L'utilisateur peut reserver une visite en choisissant une date, en indiquant son numero de telephone avec option WhatsApp. Le proprietaire recoit la demande et peut la confirmer ou l'annuler.

> **Messagerie** : Un systeme de messagerie integre permet aux utilisateurs d'echanger avec les proprietaires et avec l'agence SCIM.

> **Favoris et notations** : Les utilisateurs peuvent ajouter des biens en favoris et les noter, ce qui enrichit les classements.

---

## SECTION 6 - Fonctionnalites Admin
**Duree : 2 min 30**

Ce que tu dis :

> L'espace administrateur est accessible via /admin et dispose d'un layout dedie avec une sidebar.

*(Montre le dashboard admin)*

> **Le tableau de bord** affiche en temps reel : le nombre d'annonces actives, les reservations en cours, le nombre d'utilisateurs et les messages non lus. Un graphique Recharts montre l'activite des 6 derniers mois.

> **Gestion des proprietes** : L'admin peut visualiser, modifier, suspendre ou supprimer les annonces.

> **Gestion des utilisateurs** : Liste des membres avec recherche, modification de roles, suppression et restauration.

> **Gestion des reservations** : Suivi de toutes les demandes de visite avec possibilite de confirmation ou d'annulation.

> **Soumissions** : Les proprietaires externes peuvent soumettre leurs biens pour publication. L'admin les valide ou les rejette avec un commentaire.

> **Analytics** : Des rapports detailles sur les proprietes, les utilisateurs et les revenus, exportables en PDF.

> **Parametres** : Configuration globale de la plateforme.

---

## SECTION 7 - Defis Techniques et Solutions
**Duree : 2 min 30**

Ce que tu dis :

> Le developpement de SCIM m'a confronte a plusieurs defis techniques interessants.

> **Defi 1 : Le refresh token automatique.** Quand l'Access Token expire pendant une requete, l'intercepteur Axios doit : capturer la requete echouee, envoyer un refresh, mettre a jour le token, et rejouer la requete - le tout en gerant les requetes concurrentes qui arrivent pendant le refresh. J'ai resolu cela avec un mecanisme de file d'attente.

> **Defi 2 : La synchronisation cache-serveur.** Au demarrage de l'application, je lis le user depuis le localStorage pour afficher l'interface immediatement, puis je recupere le profil fraichement depuis le serveur pour s'assurer que les donnees sont a jour. Si le serveur retourne une erreur d'auth, je purge la session.

> **Defi 3 : Le routing multi-roles.** J'ai mis en place des layouts proteges (AuthenticatedLayout pour les utilisateurs connectes, AdminLayout pour les admins) avec redirection automatique si le role ne correspond pas.

> **Defi 4 : L'upload d'images.** Les proprietes peuvent avoir plusieurs photos. J'ai utilise FormData pour l'upload, avec gestion automatique du header Content-Type pour eviter les erreurs CORS.

> **Defi 5 : Le SEO.** Chaque page a des meta tags dynamiques via react-helmet-async et des structured data JSON-LD pour le referenceur Google.

---

## SECTION 8 - Deploiement et Mise en Production
**Duree : 1 min**

Ce que tu dis :

> L'application est deja deployee et accessible en production.

> **Frontend** : deploye sur **Vercel** avec deploiement automatique sur push. Le build Vite genere un bundle optimise dans dist.

> **Backend** : deploye sur **Render** avec une base de donnees MongoDB Atlas.

> **CI/CD** : Les deploiements sont automatiques. Chaque push sur main declenche un build et un deploiement.

> **Configuration** : Les variables d'environnement sont gerees separement - jamais de secrets en dur dans le code.

---

## SECTION 9 - Conclusion et Perspectives
**Duree : 1 min 30**

Ce que tu dis :

> En resume, SCIM est une application complete qui demontre :

> - Une **maitrise du developpement frontend moderne** : React, Tailwind CSS, architecture component-based
> - Une **comprehension des enjeux de securite** : authentification JWT, refresh tokens, routes protegees
> - Une **capacite a concevoir une UX premium** : design responsive, animations, SEO
> - Une **gestion complete du cycle de vie** : de la conception au deploiement en production

> **Perspectives d'amelioration** : si j'avais plus de temps, j'ajouterais :
> - Un **chat en temps reel** via WebSocket pour remplacer la messagerie actuelle
> - Des **notifications push** pour informer les utilisateurs en temps reel
> - Une **geolocalisation** des biens avec integration Google Maps
> - Un **systeme de paiement** integre pour les reservations
> - Un **dashboard analytics** plus avance avec prediction de tendances

> Merci de votre attention. Je suis pret a repondre a vos questions.

---

## RECAPITULATIF DES TIMINGS

```
00:00 -> 01:30  Introduction et Accroche
01:30 -> 03:30  Problematique et Contexte
03:30 -> 05:30  Presentation de SCIM
05:30 -> 08:30  Architecture Technique
08:30 -> 11:30  Fonctionnalites Client
11:30 -> 14:00  Fonctionnalites Admin
14:00 -> 16:30  Defis Techniques
16:30 -> 17:30  Deploiement
17:30 -> 19:00  Conclusion et Perspectives
19:00 -> 24:00+ Questions du Jury
```

---

## CONSEILS DE PRESENTATION

1. **Ne lis pas le script** - recapitule les grandes lignes et improvise les transitions
2. **Montre l'app en live** - c'est plus impressionnant que des slides
3. **Sois pret a zoomer dans le code** - le jury peut demander a voir un fichier precis
4. **Gere le temps** - si tu t'attardes sur une section, raccourcis les suivantes
5. **Termine a l'heure** - les jures apprecient la ponctualite
6. **Parle calmement** - respire entre chaque section
7. **Souris** - ca detend tout le monde

---

## QUESTIONS FREQUENTES DU JURY ET REPONSES

### Pourquoi React et pas Vue/Angular/Next.js ?
> React m'a permis d'avoir une liberte totale sur l'architecture. J'ai choisi Vite plutot que Next.js car je n'avais pas besoin de SSR - le SEO est gere cote client via react-helmet-async, et le deploiement sur Vercel est plus simple avec un SPA.

### Comment tu geres la securite ?
> Le Access Token est court-lived et stocke en memoire. Le Refresh Token est dans un cookie httpOnly, impossible a lire depuis JavaScript. L'intercepteur Axios gere automatiquement le renouvellement. Les routes admin sont protegees par un layout qui verifie le role de l'utilisateur.

### Pourquoi Tailwind et pas CSS modules/SASS ?
> Tailwind m'a permis de developper beaucoup plus vite avec un design system coherent. Les classes utility-first sont ideales pour un design responsive complexe comme celui de SCIM. Avec le theme personnalise, j'ai pu creer une palette doree premium en quelques lignes.

### Comment tu tests ton application ?
> J'ai configure Jest avec Testing Library. Les thresholds de couverture sont a 70% sur les branches, fonctions, lignes et instructions. Je dispose de tests unitaires pour les composants critiques.

### Qu'est-ce que tu ferais differemment ?
> J'investirais plus de temps dans les tests d'integration E2E avec Cypress ou Playwright. Et j'ajouterais un vrai systeme de notifications temps reel avec WebSocket.
