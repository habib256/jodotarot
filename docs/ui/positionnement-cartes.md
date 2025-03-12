# Système de Positionnement des Cartes

## Vue d'Ensemble

Le positionnement des cartes de tarot dans JodoTarot est défini à travers une architecture en deux couches :

1. **Définition Logique** (JavaScript) - Structure et relations
2. **Définition Visuelle** (CSS) - Positionnement exact et styles

Cette séparation permet une grande flexibilité, une maintenance simplifiée et une meilleure adaptabilité responsive.

## Architecture du Système

### 1. Définition Logique (JavaScript)

Les classes dans `assets/js/models/spreads/` définissent :
- Le nombre de cartes pour chaque tirage
- Les noms des positions (ex: 'center', 'top', 'left', etc.)
- Les significations de chaque position dans différentes langues
- Les classes CSS à utiliser pour chaque carte
- L'identifiant numérique standardisé pour chaque position

**Exemple pour le tirage en Croix :**
```javascript
// CrossSpread.js
this.cardPositions = [
  { name: 'center', cssName: 'center', position: 1 },  // Centre - Situation actuelle
  { name: 'top', cssName: 'top', position: 2 },        // Haut - Ce qui influence
  { name: 'right', cssName: 'right', position: 3 },    // Droite - Futur
  { name: 'bottom', cssName: 'bottom', position: 4 },  // Bas - Fondation
  { name: 'left', cssName: 'left', position: 5 }       // Gauche - Passé
];
```

### 2. Définition Visuelle (CSS)

Le positionnement exact est défini dans deux endroits :

#### a. Variables CSS (`assets/css/base/variables.css`)

Ce fichier centralise toutes les coordonnées sous forme de variables CSS, selon la convention standardisée :

```css
/* Tirage en croix */
--cross-position-1-x: 50%;  /* center */
--cross-position-1-y: 50%;
--cross-position-2-x: 50%;  /* top */
--cross-position-2-y: 20%;
--cross-position-3-x: 90%;  /* right */
--cross-position-3-y: 50%;
--cross-position-4-x: 50%;  /* bottom */
--cross-position-4-y: 80%;
--cross-position-5-x: 10%;  /* left */
--cross-position-5-y: 50%;

/* Positions en fer à cheval */
--horseshoe-position-1-x: 10%;  /* past */
--horseshoe-position-1-y: 70%;
--horseshoe-position-2-x: 25%;  /* recent */
--horseshoe-position-2-y: 60%;
/* etc. */
```

#### b. Modules CSS spécifiques aux tirages (`assets/css/modules/`)

Chaque type de tirage a son propre fichier CSS qui utilise les variables :
- `cross-spread.css` (131 lignes) - Pour le tirage en Croix
- `horseshoe-spread.css` (110 lignes) - Pour le tirage en Fer à Cheval
- `love-spread.css` (113 lignes) - Pour le tirage de l'Amour  
- `celtic-cross-spread.css` (162 lignes) - Pour la Croix Celtique

**Exemple pour le tirage en Croix :**
```css
.card-center, .card-1 {
  left: var(--cross-position-1-x);
  top: var(--cross-position-1-y);
  transform: translate(-50%, -50%);
  z-index: 3;
}

.card-top, .card-2 {
  left: var(--cross-position-2-x);
  top: var(--cross-position-2-y);
  transform: translate(-50%, -50%);
  z-index: 2;
}
/* etc. */
```

## Système de Double Identification

Pour assurer à la fois une lisibilité optimale et une standardisation technique, chaque position de carte peut être identifiée de deux manières :

1. **Identification Sémantique** : Utilise le nom descriptif de la position (ex: `.card-present`, `.card-past`)
2. **Identification Numérique** : Utilise un numéro séquentiel (ex: `.card-1`, `.card-2`)

Ces deux systèmes fonctionnent en parallèle et sont équivalents dans le code CSS.

## Flux de Création d'un Tirage

1. **Définition Logique** dans la classe JavaScript correspondante (ex: `CelticCrossSpread.js`)
   - Définition du nombre de cartes
   - Attribution des noms sémantiques et identifiants numériques
   - Association des significations

2. **Initialisation des Positions** dans `BaseSpread.js`
   - Création des éléments DOM
   - Application des classes CSS
   - Référencement aux variables CSS

3. **Application des Styles** via les fichiers CSS correspondants
   - Utilisation des variables CSS pour les positions
   - Définition des z-index, rotations, et autres propriétés visuelles

## Adaptation Responsive

Le système utilise des pourcentages pour les positions, ce qui permet une adaptation naturelle aux différentes tailles d'écran. De plus, les variables CSS peuvent être redéfinies dans les media queries :

```css
/* Tablettes */
@media (max-width: 768px) {
  :root {
    --cross-position-1-x: 50%;
    --cross-position-1-y: 45%;
    /* ... ajustements pour tablettes ... */
  }
}

/* Mobiles */
@media (max-width: 480px) {
  :root {
    --cross-position-1-x: 50%;
    --cross-position-1-y: 40%;
    /* ... ajustements pour mobiles ... */
  }
}
```

## Avantages du Système

1. **Séparation des Responsabilités**
   - JavaScript : Logique et structure des tirages
   - CSS : Positionnement et style visuel

2. **Maintenance Simplifiée**
   - Un seul endroit pour modifier les positions (variables.css)
   - Pas de duplication des coordonnées

3. **Flexibilité Accrue**
   - Support facile des media queries
   - Adaptation dynamique aux différentes tailles d'écran
   - Possibilité d'animations CSS complexes

4. **Meilleure Performance**
   - Utilisation du moteur de rendu CSS natif
   - Moins de calculs JavaScript

5. **Extensibilité**
   - Ajout facile de nouveaux types de tirages
   - Personnalisation simple des positions par thème

## Standardisation et Documentation

Ce système fait l'objet d'une standardisation détaillée dans plusieurs documents :

- [Positions de Cartes](../standards/card-positions.md) - Référence des positions dans chaque tirage
- [Conventions de Nommage CSS](../standards/css-naming-conventions.md) - Standards pour les variables CSS
- [Standardisation des Positions](../standards/tarot-position-standardization.md) - Projet d'harmonisation

## Outil d'Édition Visuelle

L'outil [Éditeur de Positions](../tools/spread-editor.md) permet de définir visuellement les positions des cartes et de générer automatiquement les variables CSS correspondantes, facilitant ainsi la maintenance et l'évolution du système. 