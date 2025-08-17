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
- `positionDescriptions` : Descriptions détaillées localisées des positions (optionnel)

#### Méthodes principales
- `getName()` : Retourne le nom localisé du tirage
- `getDescription()` : Retourne la description localisée du tirage
- `getCardCount()` : Retourne le nombre de cartes nécessaires
- `getPositionMeaning(positionIndex)` : Retourne la signification localisée d'une position
- `getPositionDescription(positionIndex, card)` : Retourne la description détaillée d'une position
- `getPositionClassName(positionIndex)` : Génère les classes CSS pour une position
- `getPositionElement(positionIndex)` : Trouve l'élément DOM correspondant à une position
- `initializeCardPositions()` : Initialise les positions des cartes dans l'interface
- `draw(deck)` : Effectue un tirage avec le jeu de cartes spécifié
- `reset()` : Réinitialise l'affichage du tirage
- `render()` : Rend le tirage dans le conteneur
- `generateReadingDescription(includeDetailedDescriptions)` : Génère une description formatée du tirage
- `addVisualElements()` : Ajoute des éléments visuels spécifiques au tirage (à implémenter par les classes enfants)

#### Méthodes privées
- `_configurePositionStyle(positionElement, position)` : Configure le style d'une position de carte
- `_createCardElement(card, index)` : Crée un élément de carte
- `_createPositionElement(position, index)` : Crée un élément de position
- `_updatePositionDescription(positionElement, card, index)` : Met à jour la description d'une position

### Types de Tirages Disponibles

Le système comprend actuellement 4 types de tirages, accessibles via la fonction `createSpread()` :

```javascript
// Objet contenant tous les types de tirages indexés par leur clé
const SPREADS = {
  cross: CrossSpread,
  horseshoe: HorseshoeSpread,
  love: LoveSpread,
  celticCross: CelticCrossSpread
};
```

#### CrossSpread
- **Clé** : `cross`
- **Cartes** : 5 cartes disposées en croix simple
- **Positions** : centre, haut, gauche, droite, bas
- **Structure** : Centrée avec positions cardinales
- **Description** : Un tirage en croix à 5 cartes pour une vision complète de la situation, du problème, de l'influence du passé, de l'avenir et du résultat.

#### HorseshoeSpread
- **Clé** : `horseshoe`
- **Cartes** : 7 cartes disposées en fer à cheval
- **Positions** : passé lointain, passé récent, présent, futur proche, futur lointain/résultat, influences extérieures, conseil
- **Élément visuel** : Forme de fer à cheval
- **Description** : Un tirage en fer à cheval à 7 cartes, idéal pour explorer le passé, le présent et le futur d'une situation, avec des éléments sur les influences et les obstacles.

#### LoveSpread
- **Clé** : `love`
- **Cartes** : 7 cartes disposées selon les positions spécifiques
- **Positions** : votre cœur, son cœur, relation actuelle, obstacles à surmonter, désirs secrets, résultat probable, conseil final
- **Focus** : Aspects relationnels et émotionnels
- **Description** : Un tirage spécial pour l'amour et les relations avec 7 cartes, explorant les sentiments, les désirs et les obstacles.

#### CelticCrossSpread
- **Clé** : `celticCross`
- **Cartes** : 10 cartes disposées en croix celtique traditionnelle
- **Positions** : situation actuelle, défi/obstacle, base/fondation, passé récent, couronne/objectif, futur immédiat, vous-même, environnement/influences, espoirs/craintes, résultat final
- **Éléments visuels** : Lignes de la croix
- **Description** : Le tirage traditionnel de la Croix Celtique à 10 cartes, offrant une lecture complète avec des informations sur la situation, les obstacles, les influences passées et futures.

## Système de Positionnement

### Structure des Positions
Chaque position est définie par un objet avec les propriétés suivantes :
```javascript
{
  name: 'present',       // Nom sémantique de la position
  cssName: 'present',    // Nom utilisé pour les classes CSS
  position: 1,           // Numéro de position (1-indexé)
  rotation: 0            // Rotation optionnelle en degrés
}
```

### Positionnement via CSS
Les positions utilisent des variables CSS pour le positionnement précis :
```javascript
// Configuration du style de position
positionElement.style.left = `var(--${this.key}-position-${position.position}-x)`;
positionElement.style.top = `var(--${this.key}-position-${position.position}-y)`;
```

Ou alternativement avec le nom CSS :
```javascript
const cssPositionName = position.cssName || position.name;
positionElement.style.left = `var(--${this.key}-${cssPositionName}-x)`;
positionElement.style.top = `var(--${this.key}-${cssPositionName}-y)`;
```

### Rotation des Cartes
La rotation est appliquée via des variables CSS ou des valeurs explicites :
```javascript
const rotationVar = `--${this.key}-position-${position.position}-rotation`;
const rotationValue = getComputedStyle(document.documentElement).getPropertyValue(rotationVar);

positionElement.style.transform = rotationValue?.trim() 
  ? `translate(-50%, -50%) rotate(${rotationValue})`
  : `translate(-50%, -50%) rotate(${position.rotation || 0}deg)`;
```

## Support Multilingue

Le système supporte nativement 6 langues pour les noms, descriptions et significations des positions :
- Français (fr)
- Anglais (en)
- Espagnol (es)
- Allemand (de)
- Italien (it)
- Chinois (zh)

Exemple de structure multilingue pour un tirage :
```javascript
// Noms localisés du tirage
this.name = {
  'fr': 'Croix',
  'en': 'Cross',
  'es': 'Cruz',
  'de': 'Kreuz',
  'it': 'Croce',
  'zh': '十字'
};

// Significations des positions localisées
this.positionMeanings = {
  'fr': {
    1: 'Situation actuelle',
    2: 'Ce qui influence',
    // ...
  },
  'en': {
    1: 'Current situation',
    2: 'What influences',
    // ...
  },
  // Autres langues...
};
```

## Génération de descriptions

Le système utilise la classe `ReadingDescriptionGenerator` pour créer des descriptions textuelles structurées des tirages :

```javascript
generateReadingDescription(includeDetailedDescriptions = true) {
  const generator = new ReadingDescriptionGenerator(this, this.language);
  return generator.generateReadingDescription(includeDetailedDescriptions);
}
```

## Exemple d'Utilisation

```javascript
// Création d'un tirage
const spread = createSpread('celticCross', containerElement, 'fr');

// Initialisation du tirage (positions vides)
spread.initializeCardPositions();

// Tirage des cartes
const cards = spread.draw(deck);

// Rendu du tirage
spread.render();

// Génération de la description
const description = spread.generateReadingDescription(true);
```

## Création d'un nouveau type de tirage

Pour créer un nouveau type de tirage, suivez ces étapes :

1. Créez une classe héritant de `BaseSpread`
2. Définissez les noms et descriptions localisés
3. Configurez les positions des cartes avec `cardPositions`
4. Définissez les significations des positions avec `positionMeanings`
5. Implémentez `addVisualElements()` si nécessaire
6. Ajoutez le tirage à l'objet `SPREADS` dans `index.js`

```javascript
class MyCustomSpread extends BaseSpread {
  constructor(container, language = 'fr') {
    super('custom', container, language);
    
    // Définir les propriétés spécifiques...
    this.name = { 'fr': 'Mon Tirage', 'en': 'My Spread' };
    this.description = { 'fr': 'Description...', 'en': 'Description...' };
    this.cardPositions = [ /* positions */ ];
    this.positionMeanings = { /* significations */ };
  }
  
  // Surcharger des méthodes si nécessaire...
  addVisualElements() {
    // Ajouter des éléments visuels spécifiques
  }
}
```

## Bonnes Pratiques

1. **Définition des Positions**
   - Utilisez des noms sémantiques cohérents
   - Fournissez toujours un nom CSS (ou utilisez le même que le nom sémantique)
   - Utilisez des numéros de position séquentiels
   - Documentez les rotations nécessaires

2. **Descriptions de Positions**
   - Fournissez des descriptions détaillées pour chaque position
   - Maintenez la cohérence des descriptions entre les langues
   - Utilisez `getPositionDescription()` pour générer des descriptions basées sur la carte

3. **Éléments Visuels**
   - Implémentez `addVisualElements()` pour les éléments visuels spécifiques au tirage
   - Utilisez des classes CSS standardisées
   - Assurez la compatibilité avec les écrans de différentes tailles

4. **Variables CSS**
   - Suivez le format de nommage `--${key}-position-${number}-x/y/rotation`
   - Ou `--${key}-${cssName}-x/y/rotation` pour les positions spéciales 