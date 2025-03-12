# Positionnement des Cartes

## Vue d'Ensemble

Le système de positionnement des cartes dans JodoTarot utilise une approche hybride combinant :
1. Un système numérique standardisé (nouveau standard)
2. Un système sémantique (pour rétrocompatibilité)

## Structure de Base

### Définition des Positions

Chaque position de carte est définie avec les propriétés suivantes :

```javascript
{
  name: 'present',           // Nom sémantique
  cssName: 'present',        // Nom pour les variables CSS (legacy)
  position: 1,              // Numéro de position (nouveau standard)
  rotation: 0               // Rotation en degrés (optionnel)
}
```

### Variables CSS

Les positions sont définies via des variables CSS suivant deux formats :

```css
/* Format numérique (nouveau standard) */
--${spreadType}-position-${number}-x: 40%;
--${spreadType}-position-${number}-y: 40%;
--${spreadType}-position-${number}-rotation: 0deg;

/* Format sémantique (legacy) */
--${spreadType}-${name}-x: 40%;
--${spreadType}-${name}-y: 40%;
--${spreadType}-${name}-rotation: 0deg;
```

## Implémentation

### Classes CSS

Les positions utilisent plusieurs classes pour assurer la compatibilité :

```css
.card-position {
  /* Styles de base pour toutes les positions */
  position: absolute;
  transition: all 0.3s ease;
}

/* Classes de position */
.card-${index + 1}              /* Position numérique de base */
.position-${position}           /* Nouveau standard numérique */
.card-position-${position}      /* Alternative numérique */
.${name}                        /* Nom sémantique */
```

### Positionnement dans le DOM

```javascript
// Exemple de création d'une position
const positionElement = document.createElement('div');
positionElement.className = this.getPositionClassName(index, position) + ' empty';
positionElement.setAttribute('data-position', index);
positionElement.setAttribute('data-position-name', this.getPositionMeaning(index));
positionElement.setAttribute('data-position-meaning', positionDescription);
```

## Types de Tirages

### Croix Celtique

```javascript
this.cardPositions = [
  { name: 'present', cssName: 'present', position: 1 },           // Situation actuelle
  { name: 'challenge', cssName: 'challenge', rotation: 90, position: 2 }, // Défi/Obstacle
  { name: 'foundation', cssName: 'foundation', position: 3 },     // Base/Fondation
  { name: 'past', cssName: 'past', position: 4 },                // Passé récent
  { name: 'crown', cssName: 'crown', position: 5 },              // Couronne/Résultat
  { name: 'future', cssName: 'future', position: 6 },            // Futur immédiat
  { name: 'self', cssName: 'self', position: 7 },                // Vous-même
  { name: 'environment', cssName: 'environment', position: 8 },   // Environnement
  { name: 'hopes', cssName: 'hopes', position: 9 },              // Espoirs/Craintes
  { name: 'outcome', cssName: 'outcome', position: 10 }          // Résultat final
];
```

### Tirage en Fer à Cheval

```javascript
this.cardPositions = [
  { name: 'past', cssName: 'past', position: 1 },        // Passé lointain
  { name: 'recent', cssName: 'recent', position: 2 },    // Passé récent
  { name: 'present', cssName: 'present', position: 3 },  // Présent
  { name: 'future', cssName: 'future', position: 4 },    // Futur proche
  { name: 'outcome', cssName: 'outcome', position: 5 },  // Futur lointain
  { name: 'advice', cssName: 'advice', position: 6 },    // Conseil
  { name: 'summary', cssName: 'summary', position: 7 }   // Synthèse
];
```

### Tirage Amour

```javascript
this.cardPositions = [
  { name: 'self', cssName: 'you', position: 1 },           // Soi / Votre cœur
  { name: 'partner', cssName: 'partner', position: 2 },    // Partenaire / Son cœur
  { name: 'relationship', cssName: 'relationship', position: 3 }, // Relation actuelle
  { name: 'obstacles', cssName: 'foundation', position: 4 },  // Obstacles à surmonter
  { name: 'desires', cssName: 'past', position: 5 },       // Désirs secrets
  { name: 'outcome', cssName: 'present', position: 6 },    // Résultat probable
  { name: 'advice', cssName: 'future', position: 7 }       // Conseil final
];
```

## Éditeur de Positions

L'application inclut un éditeur visuel (`tools/spread-editor.html`) permettant de :
- Définir visuellement les positions des cartes
- Générer les variables CSS correspondantes
- Tester les positions en temps réel
- Sauvegarder les configurations

### Utilisation de l'Éditeur

1. Ouvrir `tools/spread-editor.html`
2. Sélectionner le type de tirage à éditer
3. Déplacer les cartes à la position souhaitée
4. Ajuster les rotations si nécessaire
5. Générer et copier le CSS résultant

### Format de Sortie

```css
/* Variables générées par l'éditeur */
:root {
  /* Croix Celtique */
  --celtic-position-1-x: 40%;
  --celtic-position-1-y: 40%;
  --celtic-position-2-x: 40%;
  --celtic-position-2-y: 40%;
  --celtic-position-2-rotation: 90deg;
  /* ... */
  
  /* Fer à Cheval */
  --horseshoe-position-1-x: 20%;
  --horseshoe-position-1-y: 50%;
  /* ... */
  
  /* Tirage Amour */
  --love-position-1-x: 30%;
  --love-position-1-y: 40%;
  /* ... */
}
```

## Bonnes Pratiques

1. **Nommage**
   - Utiliser le nouveau système numérique pour les nouvelles implémentations
   - Maintenir la compatibilité avec les noms sémantiques
   - Documenter les significations des positions

2. **Positionnement**
   - Centrer les cartes avec `transform: translate(-50%, -50%)`
   - Utiliser des pourcentages pour les positions
   - Appliquer les rotations après le centrage

3. **Accessibilité**
   - Fournir des attributs `data-position-name` et `data-position-meaning`
   - Maintenir un ordre logique dans le DOM
   - Assurer une navigation clavier cohérente

4. **Performance**
   - Utiliser `transform` pour les animations
   - Regrouper les changements de style
   - Éviter les calculs de position inutiles 