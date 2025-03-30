# Documentation des Positions de Cartes dans les Tirages de Tarot

## Aperçu du Système

Dans notre application de tarot, nous avons mis en place un système standardisé pour identifier les positions des cartes dans différents types de tirages. Ce système utilise deux méthodes parallèles :

1. **Identification numérique** : Utilise des numéros séquentiels (1, 2, 3...) pour identifier chaque position de manière cohérente.
2. **Identification sémantique** : Conserve des noms descriptifs indiquant la signification de chaque position pour une meilleure lisibilité.

Cette double approche offre à la fois une standardisation technique et une lisibilité sémantique.

## Structure Technique

Chaque position de carte est définie par plusieurs propriétés :
- **Numéro de position** : L'identifiant numérique de la position (ex: 1, 2, 3...)
- **Nom sémantique** : Le nom descriptif de la position (ex: "present", "past", "future")
- **Coordonnées** : Les variables CSS définissant la position (en pourcentages)
- **Rotation** : L'angle de rotation de la carte (en degrés)

Dans les fichiers JavaScript, les positions sont définies par la propriété `cardPositions`, tandis que dans les fichiers CSS, elles sont stylisées à l'aide de variables CSS.

## Tirages Disponibles

### 1. Tirage en Croix (Cross Spread)

Un tirage de 5 cartes disposées en forme de croix.

| Position | Nom sémantique | Signification | Coordonnées |
|----------|----------------|---------------|-------------|
| 1 | center | Situation actuelle | 50%, 50% |
| 2 | top | Influence supérieure | 50%, 18% |
| 3 | left | Passé | 25%, 50% |
| 4 | right | Futur | 75%, 50% |
| 5 | bottom | Résultat | 50%, 82% |

### 2. Tirage en Fer à Cheval (Horseshoe Spread)

Un tirage de 7 cartes disposées en forme de fer à cheval.

| Position | Nom sémantique | Signification | Coordonnées |
|----------|----------------|---------------|-------------|
| 1 | past | Passé lointain | 30%, 15% |
| 2 | recent | Passé récent | 50%, 80% |
| 3 | present | Présent | 20%, 42% |
| 4 | future | Futur proche | 25%, 70% |
| 5 | outcome | Résultat probable | 70%, 15% |
| 6 | influences | Influences externes | 75%, 70% |
| 7 | advice | Conseils | 80%, 42% |

### 3. Tirage de l'Amour (Love Spread)

Un tirage de 7 cartes disposées en forme de cœur.

| Position | Nom sémantique | Signification | Coordonnées |
|----------|----------------|---------------|-------------|
| 1 | you | Votre position dans la relation | 50%, 50% |
| 2 | partner | La position de votre partenaire | 50%, 20% |
| 3 | relationship | Dynamique relationnelle | 25%, 35% |
| 4 | foundation | Obstacles à surmonter | 75%, 35% |
| 5 | past | Vos désirs secrets | 25%, 65% |
| 6 | present | Situation présente | 50%, 80% |
| 7 | future | Conseils pour l'avenir | 75%, 65% |

### 4. Croix Celtique (Celtic Cross Spread)

Un tirage traditionnel de 10 cartes offrant une vision détaillée.

| Position | Nom sémantique | Signification | Coordonnées | Rotation |
|----------|----------------|---------------|-------------|----------|
| 1 | present | Situation actuelle | 39%, 37% | 0° |
| 2 | challenge | Obstacle ou défi immédiat | 38%, 46% | 90° |
| 3 | crown | Objectif ou idéal | 39%, 63% | 0° |
| 4 | foundation | Base de la situation | 16%, 37% | 0° |
| 5 | past | Passé récent | 40%, 13% | 0° |
| 6 | future | Futur proche | 61%, 37% | 0° |
| 7 | self | Votre attitude | 84%, 86% | 0° |
| 8 | environment | Influences extérieures | 84%, 62% | 0° |
| 9 | hopes | Espérances ou craintes | 84%, 37% | 0° |
| 10 | outcome | Résultat final | 84%, 13% | 0° |

## Implémentation CSS

Les positions des cartes sont définies dans `variables.css` en utilisant des variables CSS avec des coordonnées en pourcentage. Chaque tirage a son propre ensemble de variables :

```css
/* Position 1: Centrale - Situation actuelle */
--cross-position-1-x: 50%;
--cross-position-1-y: 50%;

/* Position 2: Haute - Ce qui influence */
--cross-position-2-x: 50%;
--cross-position-2-y: 18%;

/* Exemple avec rotation */
--celtic-position-2-x: 38%;
--celtic-position-2-y: 46%;
--celtic-position-2-rotation: 90deg;
```

## Utilisation dans le Code

### JavaScript

Dans la classe `BaseSpread` et ses dérivées :

```javascript
// Définition des positions dans le constructeur
this.cardPositions = [
  { name: 'present', position: 1 },
  { name: 'challenge', position: 2, rotation: 90 },
  // ... autres positions
];

// Méthode pour obtenir la classe CSS d'une position
getPositionClassName(positionIndex) {
  return `card-position card-${positionIndex + 1}`;
}
```

### CSS

Les cartes sont positionnées à l'aide de sélecteurs basés sur leur position numérique :

```css
/* Exemple pour le tirage en croix */
.card-1 {
  transform: translate(var(--cross-position-1-x), var(--cross-position-1-y)) translate(-50%, -50%);
}

.card-2 {
  transform: translate(var(--cross-position-2-x), var(--cross-position-2-y)) translate(-50%, -50%);
}

/* Exemple avec rotation */
.card-2.celtic-cross {
  transform: translate(var(--celtic-position-2-x), var(--celtic-position-2-y)) 
             translate(-50%, -50%) 
             rotate(var(--celtic-position-2-rotation));
}
```

## Éditeur de Positions

Pour faciliter la définition des positions de cartes, nous disposons d'un outil visuel appelé **Éditeur de Positions** (`spread-editor.html`). Cet outil permet de :

1. Positionner visuellement les cartes par glisser-déposer
2. Définir l'angle de rotation pour chaque carte
3. Ajuster les dimensions spécifiques à chaque tirage
4. Générer automatiquement les variables CSS correspondantes

Pour plus d'informations sur l'utilisation de cet éditeur, consultez la [documentation de l'éditeur de positions](../tools/spread-editor.md).

## Bonnes Pratiques

1. **Utiliser les identifiants numériques** : Privilégier l'usage des positions numériques (1, 2, 3...) pour une standardisation du code.
2. **Conserver les noms sémantiques** : Maintenir les noms descriptifs dans la documentation et les commentaires pour la compréhension.
3. **Définir via l'éditeur** : Utiliser l'éditeur de positions pour définir visuellement les positions plutôt que de modifier manuellement les variables CSS.
4. **Valeurs en pourcentage** : Toujours utiliser des pourcentages pour les coordonnées afin d'assurer la fluidité responsive.
5. **Documentation des rotations** : Documenter explicitement les cartes nécessitant une rotation spécifique. 