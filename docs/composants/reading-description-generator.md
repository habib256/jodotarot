# Générateur de Descriptions de Tirages

## Vue d'ensemble

Le `ReadingDescriptionGenerator` est un composant utilitaire pour générer des descriptions structurées de tirages de tarot. Il crée des représentations textuelles complètes des tirages, incluant les détails de chaque carte et leur position.

## Implémentation

La classe `ReadingDescriptionGenerator` est définie dans `assets/js/models/spreads/ReadingDescriptionGenerator.js` et possède deux méthodes principales :
- `generateCardDescription()` : Génère la description d'une carte individuelle
- `generateReadingDescription()` : Génère la description complète d'un tirage

## Fonctionnalités

### Génération de Descriptions de Cartes

Le générateur crée des descriptions individuelles pour chaque carte d'un tirage, incluant :
- Le numéro de position et la signification de la position
- Le nom de la carte (via sa clé de traduction)
- L'orientation (à l'endroit/renversée)
- Le type d'arcane (majeur/mineur) si disponible
- La suite (pour les arcanes mineurs) si disponible
- La description détaillée de la position (optionnelle)

### Format des Descriptions

Les descriptions sont générées dans un format structuré, correspondant exactement à l'implémentation dans le code :

```
N. PositionName: CardName (orientation) - ArcanaType - Suite
   PositionDescription (si includeDetailedDescriptions est true)
```

### Support Multilingue

Le générateur prend en charge au moins le français et l'anglais, avec des traductions pour :
- L'orientation des cartes ("à l'endroit"/"renversée" ou "upright"/"reversed")
- Le type d'arcane ("Arcane majeur"/"Arcane mineur" ou "Major Arcana"/"Minor Arcana")
- Le format du titre ("Tirage" ou "Spread")

## Utilisation

```javascript
const generator = new ReadingDescriptionGenerator(spread, language);
const description = generator.generateReadingDescription(includeDetailedDescriptions);
```

### Paramètres
- `spread` : Instance du tirage contenant les cartes et méthodes d'accès aux positions
- `language` : Code de langue (par défaut 'fr')
- `includeDetailedDescriptions` : Booléen pour inclure ou non les descriptions détaillées (par défaut true)

## Méthodes principales

### constructor(spread, language = 'fr')
Initialise le générateur avec un tirage et une langue.

### generateCardDescription(card, index, includeDetailedDescriptions = true)
Génère la description d'une carte individuelle.
- Vérifie d'abord si la carte a une clé de traduction
- Obtient le nom de la position et l'orientation de la carte
- Ajoute le type d'arcane et la suite si disponibles
- Ajoute la description détaillée de la position si demandée

### generateReadingDescription(includeDetailedDescriptions = true)
Génère une description complète du tirage.
- Vérifie d'abord si le tirage contient des cartes
- Ajoute le titre avec le nom du tirage et le nombre de cartes
- Ajoute la description du tirage si disponible
- Génère la description pour chaque carte du tirage

## Exemple de Sortie

```
Tirage Croix Celtique (6 cartes):

Description du tirage si disponible

1. Situation actuelle: L'Empereur (à l'endroit) - Arcane majeur
   Description détaillée de la position si includeDetailedDescriptions=true

2. Obstacle immédiat: Le Soleil (renversée) - Arcane majeur
   Description détaillée de la position si includeDetailedDescriptions=true

3. Fondement: As de Coupes (à l'endroit) - Arcane mineur - Coupes
   Description détaillée de la position si includeDetailedDescriptions=true
```

## Intégration

Le générateur est conçu pour fonctionner avec l'interface `BaseSpread`, qui doit fournir les méthodes suivantes :
- `getName()` : Retourne le nom du tirage
- `getDescription()` : Retourne la description du tirage
- `getPositionMeaning(index)` : Retourne la signification d'une position
- `getPositionDescription(index, card)` : Retourne la description détaillée d'une position pour une carte spécifique

## Bonnes Pratiques

1. **Cohérence** : Maintenir un format cohérent pour toutes les descriptions
2. **Clarté** : Éviter les informations redondantes
3. **Localisation** : Supporter toutes les langues configurées
4. **Extensibilité** : Permettre l'ajout de nouveaux formats de description

## Exemple de Sortie

```
Tirage : Croix Celtique

1. Le Bateau (à l'endroit) - Arcane majeur
Position : Situation actuelle

2. Le Soleil (à l'envers) - Arcane majeur
Position : Obstacle immédiat

3. As de Coupes (à l'endroit) - Arcane mineur
Suite : Coupes
Position : Fondement
``` 