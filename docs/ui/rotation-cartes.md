# Rotation des Cartes dans JodoTarot

## Vue d'Ensemble

Le système de rotation des cartes dans JodoTarot permet d'afficher les cartes avec différentes orientations en fonction du tirage. Cette fonctionnalité est essentielle pour deux cas principaux :
1. Les rotations positionnelles (comme dans la Croix Celtique où la carte "défi" est placée perpendiculairement)
2. Les cartes inversées/renversées pour l'interprétation

## Principes de Base

### 1. Gestion CSS des Rotations

Les rotations sont définies à deux niveaux :

1. **Variables CSS globales** : Définies dans `assets/css/base/variables.css`
2. **Règles CSS spécifiques** : Appliquées dans `assets/css/modules/[tiragetype]-spread.css`

Exemple de variable de rotation dans `variables.css` :
```css
--celtic-position-2-rotation: 90deg;
```

### 2. Point de Pivot (Transform Origin)

Pour que les rotations s'effectuent correctement autour du centre de la carte et non d'un coin :

```css
transform-origin: center center;
```

Cette propriété est systématiquement appliquée à toutes les cartes avec rotation pour garantir une esthétique cohérente.

## Implémentation Technique

### Structure HTML Générée

Chaque position de carte est représentée par un élément div généré avec des attributs spécifiques :

```html
<div class="card-position card-2" 
     data-position="1" 
     data-position-name="Défi/Obstacle"
     style="position: absolute; 
            left: var(--celtic-position-2-x); 
            top: var(--celtic-position-2-y); 
            transform: translate(-50%, -50%) rotate(90deg); 
            transform-origin: center center;">
  <div class="card upright">
    <img src="path/to/image.jpg" alt="Nom de la carte">
  </div>
</div>
```

### Application des Rotations

#### 1. Via CSS (pour les effets de survol et états spéciaux)

```css
.celtic-cross-spread .card-2,
.celtic-cross-spread .challenge,
.celtic-cross-spread .position-2,
.celtic-cross-spread .card-position-2 {
  left: var(--celtic-position-2-x);
  top: var(--celtic-position-2-y);
  transform: translate(-50%, -50%) rotate(var(--celtic-position-2-rotation));
  transform-origin: center center;
  z-index: 5; /* S'assure que cette carte apparaît au-dessus des autres */
}
```

#### 2. Via JavaScript (dans BaseSpread.js)

La rotation est appliquée dynamiquement dans la méthode `_configurePositionStyle` de la classe `BaseSpread` :

```javascript
_configurePositionStyle(positionElement, position) {
  positionElement.style.position = 'absolute';
  
  if (position.position) {
    positionElement.style.left = `var(--${this.key}-position-${position.position}-x)`;
    positionElement.style.top = `var(--${this.key}-position-${position.position}-y)`;
    
    // Obtenir la rotation depuis la variable CSS
    const rotationVar = `--${this.key}-position-${position.position}-rotation`;
    const rotationValue = getComputedStyle(document.documentElement).getPropertyValue(rotationVar);
    
    // Appliquer la rotation (depuis CSS ou fallback vers la propriété rotation de l'objet)
    positionElement.style.transform = rotationValue?.trim() 
      ? `translate(-50%, -50%) rotate(${rotationValue})`
      : `translate(-50%, -50%) rotate(${position.rotation || 0}deg)`;
  } else {
    // Code pour la compatibilité avec l'ancien système de nommage
    // ...
  }
  
  // Toujours définir le point de pivot au centre
  positionElement.style.transformOrigin = 'center center';
}
```

Cette implémentation permet une grande flexibilité :
- Priorité donnée aux variables CSS pour un contrôle via l'éditeur de positions
- Fallback sur les valeurs définies dans le code JavaScript
- Valeur par défaut à 0 degré

### Définition des Rotations

Les rotations peuvent être définies de deux façons complémentaires :

1. **Dans les variables CSS** (méthode préférée) :
   ```css
   --celtic-position-2-rotation: 90deg;
   ```

2. **Dans la définition des positions** (fallback) :
   ```javascript
   // Dans CelticCrossSpread.js
   this.cardPositions = [
     { name: 'present', position: 1 },
     { name: 'challenge', position: 2, rotation: 90 }, // Rotation spécifiée ici
     // Autres positions...
   ];
   ```

### Z-index pour les Cartes Pivotées

Pour garantir l'affichage correct des cartes pivotées qui peuvent chevaucher d'autres cartes :

```css
.celtic-cross-spread .card-2 {
  z-index: 5; /* Valeur plus élevée que les cartes standard */
}

.celtic-cross-spread .card-position:hover {
  z-index: 10; /* Encore plus élevé au survol */
}
```

## Gestion des Comportements sur Survol (Hover)

Les effets de survol préservent la rotation tout en ajoutant des effets visuels :

```css
.celtic-cross-spread .card-2:hover {
  z-index: 10;
  filter: brightness(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%) rotate(var(--celtic-position-2-rotation)) scale(1.02);
  transform-origin: center center;
}
```

## Rotation des Cartes Inversées

JodoTarot distingue clairement deux types de rotation :

1. **Rotation positionnelle** : Liée à la position dans le tirage (ex: carte croisée)
2. **Rotation d'interprétation** : Indique si une carte est à l'endroit ou renversée

Pour les cartes inversées, la rotation s'applique uniquement à l'image à l'intérieur :

```css
.card.reversed img {
  transform: rotate(180deg);
}
```

Cette séparation permet d'avoir une carte en position croisée (rotation de la position) qui peut également être inversée (rotation de l'image).

## Éditeur de Positions

L'éditeur de positions (`spread-editor.html`) permet de configurer visuellement les rotations :

1. Sélectionner le type de tirage à modifier
2. Sélectionner une carte
3. Utiliser le curseur de rotation pour ajuster l'angle
4. Le CSS généré inclura les variables de rotation

## Cas Spéciaux

### Croix Celtique

Dans le tirage de la Croix Celtique, la carte en position 2 (le défi/obstacle) est traditionnellement placée perpendiculairement à la carte en position 1, formant une croix. Cette configuration est définie dans :

1. **variables.css** :
   ```css
   --celtic-position-2-rotation: 90deg;
   ```

2. **CelticCrossSpread.js** :
   ```javascript
   { name: 'challenge', position: 2, rotation: 90 }
   ```

Cette redondance assure que la rotation est maintenue même si les variables CSS ne sont pas chargées correctement.

## Bonnes Pratiques

1. **Toujours utiliser transform-origin: center center** pour les rotations
2. **Appliquer translate(-50%, -50%) avant rotate()** dans la chaîne de transformation
3. **Définir les z-index appropriés** pour éviter les problèmes de superposition
4. **Privilégier les variables CSS** pour définir les rotations
5. **Prévoir un fallback dans le code JavaScript** pour la robustesse
6. **Séparer les rotations positionnelles des rotations d'interprétation**

## Dépannage

Si les rotations ne s'affichent pas correctement :

1. Vérifier les définitions des variables dans `assets/css/base/variables.css`
2. S'assurer que `transform-origin: center center` est appliqué
3. Vérifier que l'ordre des transformations est correct : `translate(-50%, -50%) rotate(...)`
4. Confirmer que les z-index sont correctement définis
5. Tester sur différents navigateurs, car le rendu des transformations peut varier

## Voir Aussi

- [Positionnement des cartes](positionnement-cartes.md)
- [Dimensions des cartes](dimensions-cartes.md)
- [Documentation de l'éditeur de positions](../tools/spread-editor.md) 