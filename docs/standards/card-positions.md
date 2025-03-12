# Documentation des Positions de Cartes dans les Tirages de Tarot

## Aperçu du Système

Dans notre application de tarot, nous avons mis en place un système standardisé pour identifier les positions des cartes dans différents types de tirages. Ce système utilise deux méthodes parallèles :

1. **Identification sémantique** : Utilise des noms descriptifs indiquant la signification de chaque position (ex: "present", "past", "future").
2. **Identification numérique** : Utilise des numéros séquentiels (1, 2, 3...) pour identifier chaque position.

Cette double approche offre à la fois une lisibilité sémantique et une standardisation technique.

## Structure Technique

Chaque position de carte est définie avec trois propriétés principales :
- `name` : Le nom sémantique de la position (ex: "present")
- `cssName` : Le nom utilisé dans les classes CSS (généralement identique à `name`)
- `position` : L'identifiant numérique de la position (ex: 1, 2, 3...)

Dans les fichiers JavaScript, les positions sont définies dans un tableau `cardPositions`, tandis que dans les fichiers CSS, elles sont stylisées à l'aide de variables et de sélecteurs correspondants.

## Tirages Disponibles

### 1. Tirage en Croix (Cross Spread)

Un tirage de 5 cartes disposées en forme de croix.

| Position (numérique) | Nom (sémantique) | Signification |
|----------------------|------------------|---------------|
| 1 | center | La situation centrale |
| 2 | top | L'influence supérieure |
| 3 | right | Ce qui arrive |
| 4 | bottom | La fondation |
| 5 | left | Ce qui s'en va |

### 2. Tirage en Fer à Cheval (Horseshoe Spread)

Un tirage de 7 cartes disposées en forme de fer à cheval.

| Position (numérique) | Nom (sémantique) | Signification |
|----------------------|------------------|---------------|
| 1 | past | Le passé lointain |
| 2 | recent | Le passé récent |
| 3 | present | Le présent |
| 4 | future | Le futur proche |
| 5 | outcome | Le résultat probable |
| 6 | influences | Les influences externes |
| 7 | advice | Les conseils |

### 3. Tirage de l'Amour (Love Spread)

Un tirage de 7 cartes disposées en forme de cœur.

| Position (numérique) | Nom (sémantique) | Signification |
|----------------------|------------------|---------------|
| 1 | you | Votre position dans la relation |
| 2 | partner | La position de votre partenaire |
| 3 | relationship | La dynamique actuelle de la relation |
| 4 | foundation | La base de la relation |
| 5 | past | L'histoire passée |
| 6 | present | La situation présente |
| 7 | future | L'évolution future |

### 4. Croix Celtique (Celtic Cross Spread)

Un tirage traditionnel de 10 cartes offrant une vision détaillée.

| Position (numérique) | Nom (sémantique) | Signification |
|----------------------|------------------|---------------|
| 1 | present | Situation actuelle/Problème central |
| 2 | challenge | Obstacle ou défi immédiat |
| 3 | past | Passé récent/Ce qui s'en va |
| 4 | future | Futur proche/Ce qui vient |
| 5 | conscious | Influence consciente/Objectifs |
| 6 | unconscious | Influence inconsciente/Émotions cachées |
| 7 | self | Votre attitude/Comment vous êtes perçu |
| 8 | external | Influences extérieures/Environnement |
| 9 | hopes | Espérances ou craintes |
| 10 | outcome | Résultat final |

## Implémentation CSS

Chaque tirage utilise des variables CSS pour définir les positions des cartes. Les sélecteurs suivent deux patterns :

1. **Sélecteurs sémantiques** : `.card-name` (ex: `.card-present`, `.card-past`)
2. **Sélecteurs numériques** : `.card-n` (ex: `.card-1`, `.card-2`) 

Exemple de variables CSS pour le tirage en croix :

```css
:root {
  /* Position pour le tirage en croix */
  --cross-position-1-x: 0;     /* center */
  --cross-position-1-y: 0;
  
  --cross-position-2-x: 0;     /* top */
  --cross-position-2-y: -120px;
  
  --cross-position-3-x: 120px; /* right */
  --cross-position-3-y: 0;
  
  --cross-position-4-x: 0;     /* bottom */
  --cross-position-4-y: 120px;
  
  --cross-position-5-x: -120px; /* left */
  --cross-position-5-y: 0;
}
```

## Utilisation dans le Code

### JavaScript

Dans les classes de tirage :
```javascript
// Exemple de définition des positions dans CelticCrossSpread.js
this.cardPositions = [
  { name: 'present', cssName: 'present', position: 1 },
  { name: 'challenge', cssName: 'challenge', rotation: 90, position: 2 },
  // ... autres positions
];

// Méthode pour obtenir la classe CSS d'une position
getPositionClassName(position) {
  // Retourne à la fois la classe sémantique et numérique
  return `card-${position.cssName} card-${position.position}`;
}
```

### CSS

Dans les fichiers CSS des tirages :
```css
/* Exemple pour le tirage en fer à cheval */
.card-past, .card-1 {
  transform: translate(var(--horseshoe-position-1-x), var(--horseshoe-position-1-y));
}

.card-recent, .card-2 {
  transform: translate(var(--horseshoe-position-2-x), var(--horseshoe-position-2-y));
}
/* ... autres positions */
```

## Bonnes Pratiques

1. **Maintenir la cohérence** : Toujours utiliser à la fois les identifiants sémantiques et numériques.
2. **Documentation** : Commenter clairement la correspondance entre numéros et noms sémantiques.
3. **Ordre séquentiel** : Maintenir un ordre numérique logique (1, 2, 3...) qui suit le flux naturel du tirage.
4. **Rétrocompatibilité** : Conserver les classes sémantiques pour assurer la compatibilité avec le code existant. 