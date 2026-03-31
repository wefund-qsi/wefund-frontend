# WeFund FrontEnd

WeFund est une plateforme de financement participatif (crowdfunding).
Cette plateforme permet :
- à des porteurs de projet de proposer des campagnes de financement
- à des contributeurs de soutenir financièrement ces projets
- à la plateforme d'assurer la confiance, la transparence et la gestion des paiements

## Fonctionnalités

### Authentification
- **Inscription** : création d'un compte utilisateur (prénom, nom, identifiant, mot de passe)
- **Connexion** : authentification par identifiant et mot de passe avec génération d'un token JWT
- **Rôles** : deux rôles disponibles — `USER` (utilisateur standard) et `ADMINISTRATEUR`
- **Routes protégées** : certaines pages ne sont accessibles qu'aux utilisateurs connectés

### Gestion des projets
- **Créer un projet** : un utilisateur connecté peut créer un projet avec un titre, une description et une photo
- **Modifier un projet** : le porteur du projet peut en modifier les informations
- **Supprimer un projet** : le porteur du projet peut le supprimer
- **Consulter les projets** : tous les visiteurs peuvent parcourir la liste des projets et consulter les détails d'un projet
- **Mes projets** : un utilisateur connecté peut consulter la liste de ses propres projets

### Gestion des campagnes de financement
- **Créer une campagne** : un porteur de projet peut lancer une campagne de financement liée à un projet, en définissant un objectif financier et une date de fin
- **Modifier une campagne** : le porteur peut modifier les informations de sa campagne
- **Supprimer une campagne** : le porteur peut supprimer sa campagne
- **Consulter les campagnes** : tous les visiteurs peuvent parcourir les campagnes et en voir les détails (montant collecté, progression, statut)
- **Cycle de vie d'une campagne** : une campagne passe par différents statuts — `BROUILLON`, `EN_ATTENTE`, `ACTIVE`, `REUSSIE`, `ECHOUEE`, `REFUSEE`
- **Actualités de campagne** : chaque campagne peut publier des actualités à destination des contributeurs

### Contributions
- **Contribuer à une campagne** : un utilisateur peut financer une campagne active en précisant un montant
- **Remboursement** : une contribution peut être remboursée
- **Mes contributions** : un utilisateur connecté peut consulter l'historique de ses contributions

### Administration
- **Panel d'administration** : un administrateur peut visualiser et gérer l'ensemble des campagnes de la plateforme

### Autres
- **Internationalisation** : l'application est disponible en français et en anglais (i18next)
- **Page d'accueil** : présentation des campagnes actives et des projets mis en avant
- **Page À propos** : informations sur la plateforme WeFund
- **Mentions légales** : page dédiée aux mentions légales
- **Page 404** : gestion des routes inexistantes

## Stack technique

- **Framework** : [React](https://react.dev/) 19 avec [TypeScript](https://www.typescriptlang.org/)
- **Bundler** : [Vite](https://vite.dev/)
- **UI** : [Material UI (MUI)](https://mui.com/) 7
- **Routing** : [React Router](https://reactrouter.com/) 7
- **Formulaires** : [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (validation)
- **Internationalisation** : [i18next](https://www.i18next.com/) / [react-i18next](https://react.i18next.com/)
- **Tests** : [Vitest](https://vitest.dev/) (unitaires, intégration, e2e)
- **Architecture** : Architecture hexagonale (ports & adapters) avec séparation domaine / infrastructure / UI

## Installation

```bash
npm install
```

## Commandes disponibles

### Lancer le serveur de développement

```bash
npm run dev
```

### Build de production

```bash
npm run build
```

### Prévisualiser le build de production

```bash
npm run preview
```

### Lancer les tests

```bash
npm run test
```

### Lancer les tests d'intégration

```bash
npm run test:int
```
### Lancer les tests e2e

```bash
npm run test:e2e
```

### Lancer les tests en mode watch

```bash
npm run test:watch
```

### Linter (vérification du code)

```bash
npm run lint
```

## Docker

### Prérequis

- [Docker](https://www.docker.com/)

### Build de l'image

```bash
docker build -t wefund-frontend .
```

### Lancer le conteneur

```bash
docker run -p 80:80 wefund-frontend
```

L'application est ensuite accessible sur [http://localhost](http://localhost).
