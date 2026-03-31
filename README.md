# WeFund FrontEnd

WeFund est une plateforme de financement participatif (crowdfunding).
Cette plateforme permet :
● à des porteurs de projet de proposer des campagnes de financement
● à des contributeurs de soutenir financièrement ces projets
● à la plateforme d’assurer la confiance, la transparence et la gestion des paiements

## Lien vers les maquettes qui nous ont servi pour l'enchainement des écrans et la répartition du développement 

https://www.figma.com/design/ax5rRoWy1V8Aed2Zg4DZgf/maquettes-Wefund?node-id=0-1&p=f

## Prérequis

- [Node.js](https://nodejs.org/) (v24)
- npm

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
