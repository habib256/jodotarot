# 🔮 Documentation Technique de JodoTarot

## À Propos de JodoTarot

JodoTarot est une application web modulaire pour les tirages de tarot, construite en JavaScript ES6. Elle permet de réaliser des tirages de tarot interprétés par une intelligence artificielle avec différents personas et styles d'interprétation.

## 📚 Documentation

### Architecture
- [Vue d'ensemble](architecture/vue-ensemble.md) - Architecture globale et principes
- [Structure des fichiers](architecture/structure-fichiers.md) - Organisation du code source
- [Flux de données](architecture/flux-donnees.md) - Circulation des informations
- [Interactions](architecture/interactions-composants.md) - Communication entre composants
- [Sécurité](architecture/securite.md) - Aspects de sécurité

### Composants Principaux
- [État](composants/state-manager.md) - Gestion de l'état global
- [Cartes](composants/cards.md) - Système de gestion des cartes
- [Tirages](composants/spreads.md) - Types de tirages et positions
- [IA](composants/integration-ia.md) - Intégration IA (OpenAI/Ollama)
- [Personas](composants/personas.md) - Styles d'interprétation
- [Prompts](composants/construction-prompts.md) - Construction des prompts
- [Traduction](composants/traduction.md) - Support multilingue
- [Descriptions](composants/reading-description-generator.md) - Génération des descriptions
- [Interactions](composants/interactions-utilisateur.md) - Gestion des interactions

### Interface Utilisateur
- [Positionnement](ui/positionnement-cartes.md) - Système de positionnement
- [Dimensions](ui/dimensions-cartes.md) - Gestion des dimensions
- [Rotation](ui/rotation-cartes.md) - Transformations des cartes
- [Agrandissement](ui/agrandissement-cartes.md) - Agrandissement interactif des cartes
- [Z-index](ui/z-index.md) - Gestion des superpositions
- [Architecture CSS](standards/css-naming-conventions.md#organisation-des-fichiers) - Organisation modulaire des styles

### Standards
- [Bonnes pratiques](standards/bonnes-pratiques.md) - Standards de développement
- [Positions](standards/card-positions.md) - Référence des positions
- [CSS](standards/css-naming-conventions.md) - Conventions CSS
- [Internationalisation](standards/internationalisation.md) - Standards i18n

### Outils
- [Éditeur de positions](tools/spread-editor.md) - Configuration des tirages

## 🔄 État du Projet

### Fonctionnalités
- Interface utilisateur complète
- 4 types de tirages (Croix Celtique, Croix, Fer à Cheval, Amour)
- Agrandissement interactif des cartes au clic
- Cartes avec orientation aléatoire (renversées)
- Intégration IA (OpenAI/Ollama)
- Support multilingue (6 langues)
- Multiples personas d'interprétation
- Système de cartes avec validation
- Gestion optimisée des performances

### En Développement
- Support des arcanes mineurs
- Sauvegarde des tirages
- Mode sombre
- Analyse d'images par IA
- Optimisations mobiles
- Sélection de cartes

## 🛠️ Contribuer

Pour contribuer, consultez :
1. [Architecture](architecture/vue-ensemble.md)
2. [Flux de données](architecture/flux-donnees.md)
3. [État](composants/state-manager.md)
4. [Cartes](composants/cards.md)
5. [Conventions](standards/bonnes-pratiques.md)

## 🔗 Ressources
- [README](../README.md)
- [Documentation complète](README.md)
- [Dépannage](troubleshooting.md) 