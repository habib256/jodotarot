# Rotation des Cartes dans JodoTarot

## Vue d'Ensemble

Le système de rotation des cartes dans JodoTarot permet d'afficher les cartes avec différentes orientations en fonction du tirage. Cette fonctionnalité est particulièrement importante pour les tirages comme la Croix Celtique, où certaines cartes doivent apparaître perpendiculairement aux autres, ainsi que pour gérer les cartes inversées dans les interprétations.

## Principes de Base

### 1. Gestion CSS des Rotations

Les rotations sont définies à deux niveaux :

1. **Variables CSS globales** : Définies dans `assets/css/base/variables.css`
2. **Règles CSS spécifiques** : Appliquées dans `assets/css/modules/[tiragetype]-spread.css`

Exemple de variable de rotation :
```css
--celtic-position-2-rotation: 90deg;
```

### 2. Point de Pivot (Transform Origin)

Pour que les rotations s'effectuent correctement autour du centre de la carte et non d'un coin :

```css
transform-origin: center center;
```

Cette propriété est cruciale pour permettre une rotation fidèle à l'esthétique traditionnelle des tirages.

## Implémentation Technique

### Structure HTML

Chaque position de carte est représentée par un élément div avec des attributs spécifiques :

```html
<div class="card-position position-2 challenge" 
     data-position="1" 
     data-position-name="Défi/Obstacle"
     style="transform: translate(-50%, -50%) rotate(90deg); transform-origin: center center;">
  <!-- Carte placée ici -->
</div>
```

### Application des Rotations

#### 1. Via CSS

```css
.celtic-cross-spread .card-position-2 {
  left: var(--celtic-position-2-x);
  top: var(--celtic-position-2-y);
  transform: translate(-50%, -50%) rotate(var(--celtic-position-2-rotation));
  transform-origin: center center;
  z-index: 5; /* Assure que la carte pivotée apparaît au-dessus des autres */
}
```

#### 2. Via JavaScript (dynamique)

```javascript
// Dans CelticCrossSpread.js ou BaseSpread.js
if (position.position === 2) {
  const rotationVar = `--${this.key}-position-${position.position}-rotation`;
  const rotationValue = getComputedStyle(document.documentElement).getPropertyValue(rotationVar);
  
  if (rotationValue && rotationValue.trim() !== '') {
    positionElement.style.transform = `translate(-50%, -50%) rotate(${rotationValue})`;
    positionElement.style.transformOrigin = 'center center';
  } else if (position.rotation) {
    positionElement.style.transform = `translate(-50%, -50%) rotate(${position.rotation}deg)`;
    positionElement.style.transformOrigin = 'center center';
  }
}
```

### Z-index pour les Cartes Pivotées

Pour s'assurer que les cartes en rotation apparaissent correctement par-dessus d'autres cartes (comme dans la croix celtique), nous utilisons des valeurs de z-index plus élevées :

```css
/* Dans le CSS */
.celtic-cross-spread .card-position-2 {
  z-index: 5;
}

/* Dans JavaScript */
if (position.position === 2 || position.cssName === 'challenge') {
  positionElement.style.zIndex = '5';
}
```

## Gestion des Comportements sur Survol (Hover)

Une attention particulière est requise pour maintenir la rotation lors des effets de survol :

```css
.celtic-cross-spread .card-position-2:hover {
  z-index: 10;
  filter: brightness(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%) rotate(var(--celtic-position-2-rotation)) scale(1.02);
  transform-origin: center center;
}
```

## Rotation des Cartes Inversées

Indépendamment de la rotation positionnelle, JodoTarot gère également les cartes inversées (renversées) pour l'interprétation :

```css
.card.reversed img {
  transform: rotate(180deg);
}
```

Cette rotation s'applique uniquement à l'image à l'intérieur de la carte, sans affecter la position de la carte elle-même.

## Cas Spéciaux

### Croix Celtique

Dans le tirage de la Croix Celtique, la carte en position 2 (le défi/obstacle) est traditionnellement placée perpendiculairement à la carte en position 1, formant une croix. Cette configuration est gérée via :

1. Définition de la rotation dans les variables CSS :
   ```css
   --celtic-position-2-rotation: 90deg;
   ```

2. Attribution d'un z-index plus élevé pour que cette carte apparaisse au-dessus de la carte en position 1 :
   ```css
   z-index: 5;
   ```

3. Configuration explicite du point de pivot au centre :
   ```css
   transform-origin: center center;
   ```

## Bonnes Pratiques

1. **Toujours définir transform-origin** pour les éléments avec rotation
2. **Utiliser translate(-50%, -50%) avant rotate()** pour centrer correctement les cartes
3. **Gérer les z-index** pour assurer le bon ordre d'empilement
4. **Maintenir la cohérence** entre la rotation CSS et JavaScript
5. **Tester sur différents navigateurs** car le rendu des transformations peut varier

## Dépannage

Si les rotations ne s'affichent pas correctement :

1. Vérifier que `transform-origin: center center` est bien défini
2. S'assurer que l'ordre des transformations est correct : `translate(-50%, -50%) rotate(...)`
3. Confirmer que les variables CSS sont correctement définies dans `variables.css`
4. Inspecter le z-index qui peut causer des problèmes de visibilité

## Voir Aussi

- [Positionnement des cartes](positionnement-cartes.md)
- [Dimensions des cartes](dimensions-cartes.md)
- [Standards de positionnement](../standards/tarot-position-standardization.md) 