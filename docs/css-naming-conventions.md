# Conventions de Nommage CSS pour les Tirages de Tarot

## Introduction

Ce document détaille les conventions de nommage CSS adoptées pour les positions des cartes dans les différents tirages de tarot de notre application. Ces conventions visent à standardiser l'approche tout en conservant la lisibilité et la rétrocompatibilité.

## Principes de Base

### Double Système de Nommage

Nous utilisons deux systèmes de nommage parallèles pour les sélecteurs CSS :

1. **Sélecteurs sémantiques** : Basés sur la signification de la position (ex: `.card-present`, `.card-past`)
2. **Sélecteurs numériques** : Basés sur un identifiant numérique (ex: `.card-1`, `.card-2`)

Cette double approche permet à la fois une compréhension intuitive du code et une standardisation technique.

### Variables CSS

Les coordonnées de positionnement sont définies via des variables CSS avec la convention suivante :

```css
--[tirage]-position-[numéro]-[propriété]
```

Où :
- `[tirage]` = nom du tirage (cross, horseshoe, love, celtic)
- `[numéro]` = identifiant numérique de la position (1, 2, 3...)
- `[propriété]` = propriété concernée (x, y, rotation, etc.)

Exemples :
```css
--cross-position-1-x
--horseshoe-position-3-rotation
--love-position-2-y
```

## Variables par Type de Tirage

### Tirage en Croix (Cross Spread)

```css
/* Variables de position X */
--cross-position-1-x  /* Position centre X */
--cross-position-2-x  /* Position haut X */
--cross-position-3-x  /* Position droite X */
--cross-position-4-x  /* Position bas X */
--cross-position-5-x  /* Position gauche X */

/* Variables de position Y */
--cross-position-1-y  /* Position centre Y */
--cross-position-2-y  /* Position haut Y */
--cross-position-3-y  /* Position droite Y */
--cross-position-4-y  /* Position bas Y */
--cross-position-5-y  /* Position gauche Y */
```

### Tirage en Fer à Cheval (Horseshoe Spread)

```css
/* Variables de position X */
--horseshoe-position-1-x  /* Position passé X */
--horseshoe-position-2-x  /* Position récent X */
--horseshoe-position-3-x  /* Position présent X */
--horseshoe-position-4-x  /* Position futur X */
--horseshoe-position-5-x  /* Position résultat X */
--horseshoe-position-6-x  /* Position influences X */
--horseshoe-position-7-x  /* Position conseil X */

/* Variables de position Y */
--horseshoe-position-1-y  /* Position passé Y */
--horseshoe-position-2-y  /* Position récent Y */
--horseshoe-position-3-y  /* Position présent Y */
--horseshoe-position-4-y  /* Position futur Y */
--horseshoe-position-5-y  /* Position résultat Y */
--horseshoe-position-6-y  /* Position influences Y */
--horseshoe-position-7-y  /* Position conseil Y */
```

### Tirage de l'Amour (Love Spread)

```css
/* Variables de position X */
--love-position-1-x  /* Position vous X */
--love-position-2-x  /* Position partenaire X */
--love-position-3-x  /* Position relation X */
--love-position-4-x  /* Position fondation X */
--love-position-5-x  /* Position passé X */
--love-position-6-x  /* Position présent X */
--love-position-7-x  /* Position futur X */

/* Variables de position Y */
--love-position-1-y  /* Position vous Y */
--love-position-2-y  /* Position partenaire Y */
--love-position-3-y  /* Position relation Y */
--love-position-4-y  /* Position fondation Y */
--love-position-5-y  /* Position passé Y */
--love-position-6-y  /* Position présent Y */
--love-position-7-y  /* Position futur Y */
```

### Croix Celtique (Celtic Cross Spread)

```css
/* Variables de position X */
--celtic-position-1-x  /* Position situation actuelle X */
--celtic-position-2-x  /* Position défi X */
--celtic-position-3-x  /* Position passé X */
--celtic-position-4-x  /* Position futur X */
--celtic-position-5-x  /* Position conscient X */
--celtic-position-6-x  /* Position inconscient X */
--celtic-position-7-x  /* Position vous-même X */
--celtic-position-8-x  /* Position externe X */
--celtic-position-9-x  /* Position espoirs X */
--celtic-position-10-x /* Position résultat X */

/* Variables de position Y */
--celtic-position-1-y  /* Position situation actuelle Y */
--celtic-position-2-y  /* Position défi Y */
--celtic-position-3-y  /* Position passé Y */
--celtic-position-4-y  /* Position futur Y */
--celtic-position-5-y  /* Position conscient Y */
--celtic-position-6-y  /* Position inconscient Y */
--celtic-position-7-y  /* Position vous-même Y */
--celtic-position-8-y  /* Position externe Y */
--celtic-position-9-y  /* Position espoirs Y */
--celtic-position-10-y /* Position résultat Y */

/* Variables de rotation (spécifiques à certaines positions) */
--celtic-position-2-rotation  /* Rotation pour la carte "défi" */
```

## Utilisation des Sélecteurs

### Sélecteurs Sémantiques et Numériques

Chaque position de carte est accessible via deux sélecteurs équivalents :

```css
.card-present, .card-1 {
  /* Styles pour la première position */
}

.card-challenge, .card-2 {
  /* Styles pour la deuxième position */
}
```

### Exemples d'Utilisation

Pour le tirage en croix :
```css
.card-center, .card-1 {
  transform: translate(var(--cross-position-1-x), var(--cross-position-1-y));
}

.card-top, .card-2 {
  transform: translate(var(--cross-position-2-x), var(--cross-position-2-y));
}
```

Pour le tirage Croix Celtique avec rotation :
```css
.card-challenge, .card-2 {
  transform: translate(var(--celtic-position-2-x), var(--celtic-position-2-y)) 
             rotate(var(--celtic-position-2-rotation, 90deg));
}
```

## Adaptation Responsive

Les variables peuvent être redéfinies dans les media queries pour adapter le positionnement aux différentes tailles d'écran :

```css
/* Valeurs par défaut */
:root {
  --cross-position-1-x: 0;
  --cross-position-1-y: 0;
  /* ... autres variables ... */
}

/* Tablettes */
@media (max-width: 768px) {
  :root {
    --cross-position-1-x: 0;
    --cross-position-1-y: 0;
    /* ... ajustements pour tablettes ... */
  }
}

/* Mobiles */
@media (max-width: 480px) {
  :root {
    --cross-position-1-x: 0;
    --cross-position-1-y: 0;
    /* ... ajustements pour mobiles ... */
  }
}
```

## Bonnes Pratiques

1. **Commentaires** : Toujours indiquer la correspondance sémantique en commentaire des variables numériques.
2. **Ordre** : Organiser les variables dans un ordre logique et constant.
3. **Valeurs par défaut** : Fournir des valeurs par défaut pour les propriétés optionnelles.
4. **Documentation** : Maintenir ce document à jour lors de l'ajout de nouveaux tirages ou modifications.
5. **Rétrocompatibilité** : Toujours conserver les deux systèmes de sélecteurs (sémantique et numérique).

## Migration et Évolution

La transition vers ce système standardisé a été effectuée en préservant la compatibilité avec le code existant. Les anciens sélecteurs sémantiques continueront de fonctionner, tandis que les nouveaux sélecteurs numériques offrent une alternative plus cohérente et systématique.

Pour chaque nouveau tirage, appliquer rigoureusement ces conventions afin de maintenir la cohérence de l'ensemble du système. 