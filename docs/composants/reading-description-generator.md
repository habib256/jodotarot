# Générateur de Descriptions de Tirages

## Vue d'ensemble

Le `ReadingDescriptionGenerator` est un composant dédié à la génération des descriptions de tirages de tarot. Il est responsable de la création de descriptions claires et structurées des tirages, en évitant les redondances et en assurant une cohérence dans le format.

## Fonctionnalités

### Génération de Descriptions de Cartes

Le générateur crée des descriptions individuelles pour chaque carte d'un tirage, incluant :
- Le nom de la carte
- L'orientation (à l'endroit/à l'envers)
- Le type d'arcane (majeur/mineur)
- La suite (pour les arcanes mineurs)
- La signification de la position dans le tirage

### Format des Descriptions

Les descriptions sont générées dans un format cohérent :
```
[Nom de la carte] (orientation) - [Type d'arcane]
[Suite] (si applicable)
```

### Gestion des Redondances

Le générateur évite les répétitions d'informations en :
- Ne répétant pas la position de la carte si elle est déjà mentionnée
- Organisant les informations de manière logique et concise
- Supprimant les informations redondantes entre la description principale et les détails

## Utilisation

```javascript
const generator = new ReadingDescriptionGenerator(spread, language);
const description = generator.generateReadingDescription(includeDetailedDescriptions);
```

### Paramètres
- `spread` : Instance du tirage (BaseSpread ou classe dérivée)
- `language` : Code de langue pour la localisation
- `includeDetailedDescriptions` : Booléen indiquant si les descriptions détaillées doivent être incluses

## Intégration

Le générateur est intégré dans le système de tirages via la classe `BaseSpread`, qui l'utilise pour générer les descriptions des tirages. Il peut être étendu pour supporter des formats de description personnalisés ou des langues supplémentaires.

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