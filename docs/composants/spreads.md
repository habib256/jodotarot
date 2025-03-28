# Système de Tirages

## Vue d'ensemble

Le système de tirages est construit sur une architecture orientée objet avec une classe de base `BaseSpread` et des classes spécifiques pour chaque type de tirage. Cette architecture permet une réutilisation maximale du code tout en maintenant la flexibilité nécessaire pour les spécificités de chaque tirage.

## Structure des Classes

### BaseSpread
La classe de base qui définit l'interface commune et les fonctionnalités partagées pour tous les tirages.

#### Propriétés principales
- `key` : Identifiant unique du type de tirage
- `container` : Conteneur DOM pour le tirage
- `language` : Code de langue (fr, en, etc.)
- `cards` : Tableau des cartes tirées
- `name` : Noms localisés du tirage
- `description` : Descriptions localisées du tirage
- `cardPositions` : Définition des positions des cartes
- `positionMeanings` : Significations localisées des positions
- `positionDescriptions` : Descriptions détaillées localisées des positions

#### Méthodes principales
- `getName()` : Retourne le nom localisé du tirage
- `getDescription()` : Retourne la description localisée du tirage
- `getCardCount()` : Retourne le nombre de cartes nécessaires
- `getPositionMeaning()` : Retourne la signification localisée d'une position
- `getPositionDescription()` : Retourne la description détaillée d'une position
- `getPositionClassName()` : Génère les classes CSS pour une position
- `initializeCardPositions()` : Initialise les positions des cartes dans l'interface
- `render()` : Rend le tirage dans le conteneur
- `generateReadingDescription()` : Génère une description formatée du tirage
- `addVisualElements()` : Ajoute des éléments visuels spécifiques au tirage

### Tirages Spécifiques

#### CelticCrossSpread
- 10 cartes disposées en croix celtique traditionnelle
- Éléments visuels : lignes de la croix
- Positions spécifiques avec significations particulières

#### CrossSpread
- 5 cartes disposées en croix simple
- Structure centrée avec positions cardinales
- Pas d'éléments visuels supplémentaires

#### HorseshoeSpread
- 7 cartes disposées en fer à cheval
- Élément visuel : forme du fer à cheval
- Progression temporelle de gauche à droite

#### LoveSpread
- 7 cartes disposées en forme de cœur
- Focus sur les aspects relationnels
- Pas d'éléments visuels supplémentaires

## Système de Positionnement

### Structure des Positions
Chaque position est définie par un objet avec les propriétés suivantes :
```javascript
{
  name: 'nom_semantique',      // Nom descriptif de la position
  cssName: 'nom_css',          // Nom utilisé pour les classes CSS
  position: 1,                 // Numéro de position (1-indexé)
  rotation: 90                 // Rotation optionnelle en degrés
}
```

### Système de Classes CSS
Les positions utilisent un système de classes CSS standardisé :
- `card-position` : Classe de base
- `card-{index}` : Classe pour l'index de la carte
- `{nom_semantique}` : Classe basée sur le nom sémantique
- `position-{numero}` : Classe pour le numéro de position
- `card-position-{numero}` : Classe alternative pour le numéro de position

## Support Multilingue

Le système supporte nativement 6 langues :
- Français (fr)
- Anglais (en)
- Espagnol (es)
- Allemand (de)
- Italien (it)
- Chinois (zh)

Chaque élément (noms, descriptions, significations) est disponible dans toutes les langues supportées.

## Bonnes Pratiques

1. **Définition des Positions**
   - Toujours inclure un nom sémantique et un nom CSS
   - Utiliser des numéros de position séquentiels
   - Documenter les rotations si nécessaires

2. **Descriptions**
   - Fournir des descriptions détaillées pour chaque position
   - Maintenir la cohérence des descriptions entre les langues
   - Inclure des informations contextuelles pertinentes

3. **Éléments Visuels**
   - Limiter les éléments visuels aux éléments essentiels
   - Utiliser des classes CSS standardisées
   - Assurer la compatibilité mobile

4. **Localisation**
   - Maintenir toutes les chaînes de caractères dans les objets de traduction
   - Fournir des traductions pour toutes les langues supportées
   - Utiliser des clés de traduction cohérentes

## Exemple d'Utilisation

```javascript
// Création d'un tirage
const spread = createSpread('celtic', containerElement, 'fr');

// Tirage des cartes
const cards = spread.draw(deck);

// Rendu du tirage
spread.render();

// Génération de la description
const description = spread.generateReadingDescription(true);
``` 