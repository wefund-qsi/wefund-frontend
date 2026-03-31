# WeFund FrontEnd

WeFund est une **plateforme de financement participatif (crowdfunding)** moderne et transparente, construite avec React et TypeScript.

### Objectifs de la plateforme

- **Pour les porteurs de projet** : Proposer des campagnes de financement pour leurs initiatives
- **Pour les contributeurs** : Soutenir financièrement les projets qui les inspirent
- **Pour la plateforme** : Assurer la confiance, la transparence et la gestion sécurisée des paiements

### Ressources de conception

Les maquettes Figma suivantes ont guidé la conception et la répartition du développement :

[Accéder aux maquettes WeFund](https://www.figma.com/design/ax5rRoWy1V8Aed2Zg4DZgf/maquettes-Wefund?node-id=0-1&p=f)

## Prérequis

Avant de démarrer, assurez-vous d'avoir les outils suivants installés :

- [Node.js](https://nodejs.org/) (v24 ou supérieure)
- npm (inclus avec Node.js)

## Installation

Pour installer les dépendances du projet :

```bash
npm install
```

Cela téléchargera et installera tous les packages nécessaires définis dans `package.json`.

## Commandes disponibles

### Lancer le serveur de développement

Lance le serveur de développement local avec hot-reload activé. Idéal pour le développement actif :

```bash
npm run dev
```

### Build de production

Compile l'application pour la production en optimisant les performances et en minimisant les fichiers :

```bash
npm run build
```

### Prévisualiser le build de production

Affiche un aperçu local du build de production avant le déploiement :

```bash
npm run preview
```

### Lancer les tests

Exécute l'ensemble des tests unitaires du projet :

```bash
npm run test
```

### Lancer les tests d'intégration

Exécute les tests d'intégration qui vérifient l'interaction entre plusieurs composants et modules :

```bash
npm run test:int
```

### Lancer les tests e2e

Exécute les tests end-to-end qui simulent des scénarios utilisateur complets :

```bash
npm run test:e2e
```

### Lancer les tests en mode watch

Lance les tests en mode surveillance pour une exécution automatique lors de chaque modification de fichier :

```bash
npm run test:watch
```

### Linter (vérification du code)

Analyse le code pour détecter les erreurs de style et les violations des standards de codage :

```bash
npm run lint
```

## Docker

### Prérequis

- [Docker](https://www.docker.com/) (doit être installé sur votre machine)

### Build de l'image

Crée une image Docker de l'application WeFund Frontend :

```bash
docker build -t wefund-frontend .
```

### Lancer le conteneur

Démarre un conteneur basé sur l'image Docker :

```bash
docker run -p 80:80 wefund-frontend
```

L'application sera ensuite accessible sur [http://localhost](http://localhost).
