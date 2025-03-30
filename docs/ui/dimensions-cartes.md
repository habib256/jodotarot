# Dimensions Spécifiques des Cartes par Type de Tirage

## Vue d'Ensemble

JodoTarot utilise un système permettant de définir des dimensions de cartes spécifiques à chaque type de tirage. Cette approche offre une flexibilité visuelle optimale, permettant d'adapter la taille et les proportions des cartes en fonction du nombre de cartes et de la disposition de chaque tirage.

## Motivation

Différents types de tirages nécessitent différentes tailles de cartes pour une expérience utilisateur optimale :

- Les tirages avec beaucoup de cartes (comme la Croix Celtique) bénéficient de cartes plus petites
- Les tirages plus simples (comme la Croix) peuvent utiliser des cartes plus grandes
- Certains arrangements visuels nécessitent des proportions de cartes différentes
- La densité visuelle varie selon le type de tirage

## Structure des Variables CSS

Pour chaque type de tirage, nous définissons trois variables fondamentales :

```css
/* Exemple pour le tirage en croix */
--cross-card-base-width: 95px;       /* Largeur de base */
--cross-card-ratio: 1.7;             /* Ratio hauteur/largeur */
--cross-card-scale-factor: 1;        /* Facteur d'échelle */

/* Variables calculées automatiquement */
--cross-card-width: calc(var(--cross-card-base-width) * var(--cross-card-scale-factor));
--cross-card-height: calc(var(--cross-card-width) * var(--cross-card-ratio));
```

### Variables Par Type de Tirage

Chaque type de tirage possède son ensemble de variables dimensionnelles, tout en conservant la même structure de nommage :

#### Tirage en Croix (5 cartes)
```css
--cross-card-base-width: 95px;
--cross-card-ratio: 1.7;
--cross-card-scale-factor: 1;
```

#### Tirage en Fer à Cheval (7 cartes)
```css
--horseshoe-card-base-width: 95px;
--horseshoe-card-ratio: 1.7;
--horseshoe-card-scale-factor: 1;
```

#### Tirage de l'Amour (7 cartes)
```css
--love-card-base-width: 95px;
--love-card-ratio: 1.7;
--love-card-scale-factor: 1;
```

#### Croix Celtique (10 cartes)
```css
--celtic-card-base-width: 75px;      /* Taille réduite par défaut */
--celtic-card-ratio: 1.7;
--celtic-card-scale-factor: 1;
```

## Valeurs par Défaut

Par défaut, les variables globales sont définies comme suit :

```css
--card-base-width: 95px;          /* Taille de base standard */
--card-ratio: 1.7;                /* Ratio hauteur/largeur standard */
--card-scale-factor: 1;           /* Facteur d'échelle standard */
```

Les tirages héritent généralement de ces valeurs, sauf pour la Croix Celtique qui utilise une largeur de base plus petite (75px) pour accommoder ses 10 cartes.

Ces valeurs sont également adaptées automatiquement selon la taille de l'écran via des media queries.

## Media Queries et Adaptation Responsive

Les dimensions des cartes s'adaptent automatiquement aux différentes tailles d'écran grâce aux media queries :

```css
@media (min-width: 576px) {
  :root {
    --card-base-width: 80px;
    --card-scale-large: 3.5;
  }
}

@media (min-width: 768px) {
  :root {
    --card-base-width: 90px;
    --card-scale-large: 4;
  }
}

@media (min-width: 992px) {
  :root {
    --card-base-width: 100px;
    --card-scale-large: 4.5;
  }
}

@media (min-width: 1200px) {
  :root {
    --card-base-width: 110px;
    --card-scale-large: 5;
  }
}

@media (min-width: 1400px) {
  :root {
    --card-base-width: 120px;
    --card-scale-large: 5.5;
  }
}

/* Adaptation à l'orientation */
@media (orientation: landscape) {
  :root {
    --card-scale-large: calc(var(--card-scale-large) * 0.8);
  }
}

/* Adaptation aux écrans très hauts */
@media (min-height: 1000px) {
  :root {
    --card-scale-factor: 1.2;
  }
}
```

## Modification des Dimensions

Pour modifier les dimensions des cartes d'un tirage spécifique, deux approches sont disponibles :

### 1. Utiliser l'Éditeur de Positions

L'éditeur de positions (`spread-editor.html`) offre une interface visuelle pour ajuster les dimensions :

- Sélectionnez le type de tirage dans le menu déroulant
- Utilisez les curseurs pour ajuster :
  - Largeur de base (de 60px à 150px)
  - Ratio hauteur/largeur (de 1.4 à 2.0)
  - Facteur d'échelle (de 0.8 à 1.5)
- Copiez le CSS généré avec le bouton "Copier CSS"
- Collez ce code dans `assets/css/base/variables.css`

### 2. Modifier Directement les Variables CSS

Vous pouvez aussi modifier manuellement les variables dans `assets/css/base/variables.css` :

```css
/* Exemple : Personnaliser le tirage de l'amour */
--love-card-base-width: 100px;
--love-card-ratio: 1.8;
--love-card-scale-factor: 1.1;
```

## Compatibilité et Utilisation

Les variables spécifiques sont utilisées dans les modules CSS correspondants, tout en conservant la compatibilité avec le code existant :

```css
/* Exemple pour le tirage en croix */
.cross-spread .card-position {
  width: var(--cross-card-width);
  height: var(--cross-card-height);
}

/* Exemple pour le tirage en fer à cheval */
.horseshoe-spread .card-position {
  width: var(--horseshoe-card-width);
  height: var(--horseshoe-card-height);
}
```

## Conseils d'Optimisation

Pour obtenir les meilleurs résultats visuels selon le type de tirage :

- **Croix Celtique (10 cartes)** : Utilisez des cartes plus petites (75-85px) avec un facteur d'échelle réduit (0.8-0.9)
- **Tirage en Croix (5 cartes)** : Utilisez la taille standard (95-100px) avec un facteur d'échelle normal (1.0)
- **Tirages verticaux** : Augmentez le ratio hauteur/largeur (1.8-2.0)
- **Tirages denses** : Réduisez le facteur d'échelle (0.8-0.9) pour éviter les chevauchements excessifs

## Exemple pour un Nouveau Tirage

Si vous souhaitez créer un nouveau type de tirage avec des dimensions personnalisées :

1. Définissez les variables dans `variables.css` :
```css
--nouveau-tirage-card-base-width: 90px;
--nouveau-tirage-card-ratio: 1.65;
--nouveau-tirage-card-scale-factor: 0.95;
```

2. Définissez les variables calculées :
```css
--nouveau-tirage-card-width: calc(var(--nouveau-tirage-card-base-width) * var(--nouveau-tirage-card-scale-factor));
--nouveau-tirage-card-height: calc(var(--nouveau-tirage-card-width) * var(--nouveau-tirage-card-ratio));
```

3. Utilisez ces variables dans votre module CSS :
```css
.nouveau-tirage .card-position {
  width: var(--nouveau-tirage-card-width);
  height: var(--nouveau-tirage-card-height);
}
```

## Relation avec les Positions des Cartes

Les dimensions des cartes sont complémentaires aux positions des cartes (voir [documentation des positions](../standards/card-positions.md)). Pour une expérience utilisateur optimale, ces deux aspects doivent être configurés harmonieusement.

L'éditeur de positions permet de configurer les deux aspects simultanément (voir [documentation de l'éditeur](../tools/spread-editor.md)). 