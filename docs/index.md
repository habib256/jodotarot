# 🔮 Documentation Technique de JodoTarot

## À Propos de JodoTarot

JodoTarot est une application web modulaire pour les tirages de tarot, construite en JavaScript ES6. Elle permet de réaliser des tirages de tarot interprétés par une intelligence artificielle avec différents personas et styles d'interprétation.

## 📚 Table des Matières

### 1. Architecture Générale
- [Vue d'ensemble](architecture/vue-ensemble.md) - Architecture globale et principes de conception
- [Structure des fichiers](architecture/structure-fichiers.md) - Organisation du code source
- [Flux de données](architecture/flux-donnees.md) - Circulation des informations dans l'application
- [Interactions entre composants](architecture/interactions-composants.md) - Comment les différentes parties communiquent

### 2. Composants Principaux
- [Intégration IA](composants/integration-ia.md) - Communication avec les API OpenAI et Ollama
- [Système de Personas](composants/personas.md) - Personnalités et styles d'interprétation
- [Construction des Prompts](composants/construction-prompts.md) - Méthode détaillée de création des prompts
- [Gestionnaire d'état](composants/state-manager.md) - Gestion de l'état global de l'application
- [Système de traduction](composants/traduction.md) - Support multilingue
- [Système de cartes](composants/cards.md) - Gestion des jeux de cartes et des tirages

### 3. Interface Utilisateur
- [Positionnement des cartes](ui/positionnement-cartes.md) - Système de positionnement des cartes dans les tirages
- [Dimensions des cartes](ui/dimensions-cartes.md) - Système de dimensions spécifiques par type de tirage
- [Rotation des cartes](ui/rotation-cartes.md) - Gestion des rotations et transformations des cartes
- [Gestion des z-index](ui/z-index.md) - Ordre d'affichage et superposition des éléments

### 4. Outils et Conventions
- [Éditeur de positions](tools/spread-editor.md) - Documentation de l'outil d'édition des positions de cartes
- [Conventions de nommage CSS](standards/css-naming-conventions.md) - Standards pour les noms CSS des positions de cartes
- [Positions de cartes](standards/card-positions.md) - Référence des positions dans chaque type de tirage
- [Standardisation des positions](standards/tarot-position-standardization.md) - Projet de standardisation des positions
- [Bonnes pratiques](standards/bonnes-pratiques.md) - Recommandations pour le développement

## 🔄 État du Projet

### Fonctionnalités Implémentées
- Interface utilisateur complète
- Système de tirage (4 types de tirages)
  - Croix Celtique (10 cartes)
  - Croix Simple (5 cartes)
  - Fer à Cheval (7 cartes)
  - Tarot de l'Amour (7 cartes)
- Intégration IA (OpenAI et Ollama)
- Support multilingue (6 langues)
- 21 personas différents
- Gestion optimisée du défilement
- Affichage HTML dans l'interprétation
- Système de cartes robuste avec validation
- Système de descriptions détaillées des positions
- Gestion des éléments visuels spécifiques par tirage

### En Développement
- Support des arcanes mineurs
- Sauvegarde des tirages
- Mode sombre
- Analyse d'images par IA
- Amélioration des performances mobiles
- Système de sélection de cartes

## 🛠️ Contribuer
Pour contribuer au projet, veuillez consulter les guides techniques et respecter les conventions de code documentées dans cette section.

## 📖 Guides de Référence

Pour une meilleure compréhension de la documentation :

1. Commencez par la [Vue d'ensemble de l'architecture](architecture/vue-ensemble.md)
2. Explorez le [Flux de données](architecture/flux-donnees.md) pour comprendre comment circulent les informations
3. Familiarisez-vous avec le [Gestionnaire d'état](composants/state-manager.md) qui est au cœur du système
4. Consultez le [Système de cartes](composants/cards.md) pour comprendre la gestion des jeux et des tirages
5. Consultez les [Bonnes pratiques](standards/bonnes-pratiques.md) avant de contribuer au code

## 🔗 Ressources Complémentaires

- [README du projet](../README.md) - Instructions générales et présentation
- [Documentation sur l'éditeur de positions](tools/spread-editor.md) - Outil pour créer et modifier les tirages

## 📂 Organisation de la Documentation

La documentation est organisée en sections thématiques pour faciliter la navigation :

```
docs/
├── architecture/     # Structure et principes généraux
├── composants/       # Documentation des composants techniques
├── standards/        # Conventions et bonnes pratiques
├── tools/            # Documentation des outils de développement
└── ui/               # Interface utilisateur et composants visuels
```

Pour plus d'informations sur la structure de la documentation, consultez le [README de la documentation](README.md). 