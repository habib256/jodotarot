# Conventions de Nommage CSS

## Méthodologie BEM

JodoTarot utilise la méthodologie BEM (Block Element Modifier) pour structurer son CSS.

### Structure

```css
.block {}                     /* Block : composant autonome */
.block__element {}           /* Element : partie d'un block */
.block--modifier {}          /* Modifier : variante d'un block */
.block__element--modifier {} /* Modifier sur un élément */
```

### Exemples

```css
/* Carte de tarot */
.card {}                    /* Block de base */
.card__image {}            /* Image de la carte */
.card__title {}            /* Titre de la carte */
.card--reversed {}         /* Modificateur : carte inversée */
.card--selected {}         /* Modificateur : carte sélectionnée */
.card__image--loading {}   /* Image en cours de chargement */

/* Tirage */
.spread {}                 /* Block de tirage */
.spread__position {}       /* Position dans le tirage */
.spread__card {}          /* Carte dans le tirage */
.spread--cross {}         /* Type de tirage en croix */
.spread__position--active {} /* Position active */
```

## Espaces de Noms

### Préfixes Fonctionnels

```css
/* Layout */
.l-container {}
.l-grid {}
.l-flex {}

/* Composants */
.c-button {}
.c-card {}
.c-spread {}

/* Utilitaires */
.u-hidden {}
.u-visible {}
.u-center {}

/* États */
.is-active {}
.is-disabled {}
.is-loading {}

/* JavaScript hooks */
.js-trigger {}
.js-target {}
.js-animate {}
```

## Variables CSS

### Nommage des Variables Générales

```css
:root {
  /* Couleurs */
  --color-primary: #6b5b95;
  --color-secondary: #b5a9d4;
  --color-text: #333;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Typographie */
  --font-family-base: 'Segoe UI', sans-serif;
  --font-size-base: 0.875rem;
  --line-height-base: 1.3;
  
  /* Breakpoints */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  
  /* Animations */
  --animation-duration: 0.3s;
  --animation-timing: ease-in-out;
}
```

### Variables Spécifiques au Tarot

Les variables spécifiques au domaine du tarot suivent une structure hiérarchique à plusieurs niveaux:

```css
/* Structure des variables de tirage */
--[spread-type]-[property]-[subproperty]

/* Structure des variables de position */
--[spread-type]-position-[number]-[x|y|rotation]

/* Structure des variables de carte */
--[spread-type]-card-[property]
```

#### Exemples de Variables de Tirage

```css
/* Variables de base pour le tirage en croix */
--cross-card-base-width: 95px;       /* Largeur de base des cartes */
--cross-card-ratio: 1.7;             /* Ratio hauteur/largeur */
--cross-card-scale-factor: 1;        /* Facteur d'échelle */

/* Variables de position pour le tirage en croix */
--cross-position-1-x: 50%;           /* Position horizontale (centre) */
--cross-position-1-y: 50%;           /* Position verticale (centre) */
--cross-position-2-rotation: 90deg;  /* Rotation (si applicable) */

/* Variables de dimensions calculées */
--cross-card-width: calc(var(--cross-card-base-width) * var(--cross-card-scale-factor));
--cross-card-height: calc(var(--cross-card-width) * var(--cross-card-ratio));
```

#### Préfixes Spécifiques

Les préfixes suivants sont utilisés pour les différents types de tirages:

```css
--cross-      /* Tirage en croix */
--horseshoe-  /* Tirage en fer à cheval */
--love-       /* Tirage de l'amour */
--celtic-     /* Croix celtique */
```

## Media Queries

### Points de Rupture Standard

```css
/* Mobile First */
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 992px) { /* Large devices */ }
@media (min-width: 1200px) { /* Extra large devices */ }
@media (min-width: 1400px) { /* Extra extra large devices */ }
```

### Media Queries Spécifiques

```css
/* Orientation */
@media (orientation: landscape) {
  /* Styles spécifiques à l'orientation paysage */
}

/* Hauteur d'écran */
@media (min-height: 1000px) {
  /* Styles pour les écrans très hauts */
}
```

## Animations

### Nommage des Keyframes

```css
/* Préfixe 'anim-' pour les animations */
@keyframes anim-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes anim-slide-up {
  from { transform: translateY(20px); }
  to { transform: translateY(0); }
}

/* Utilisation */
.card {
  animation: anim-fade-in 0.3s ease-in-out;
}
```

## Thèmes

### Variables de Thème

```css
/* Thème clair (défaut) */
:root {
  --theme-bg: #ffffff;
  --theme-text: #000000;
  --theme-primary: #3498db;
}

/* Thème sombre */
[data-theme="dark"] {
  --theme-bg: #2c3e50;
  --theme-text: #ffffff;
  --theme-primary: #3498db;
}
```

## États Interactifs

### Conventions de Nommage

```css
/* États de base */
.button { }
.button:hover { }
.button:focus { }
.button:active { }

/* États avec classes */
.button.is-active { }
.button.is-disabled { }
.button.is-loading { }
```

## Organisation des Fichiers

```
css/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css       /* Variables globales et spécifiques */
├── components/
│   ├── buttons.css
│   ├── cards.css           /* Styles des cartes */
│   └── spreads.css         /* Styles des tirages */
├── layouts/
│   ├── grid.css
│   └── containers.css
├── utils/
│   ├── animations.css
│   └── helpers.css
└── main.css                /* Point d'entrée, importe tous les fichiers */
```

## Conventions pour les Sélecteurs de Position

Les positions de carte utilisent deux systèmes parallèles de sélecteurs:

```css
/* Sélecteurs numériques (système principal) */
.card-1 { }
.card-2 { }
.card-3 { }

/* Sélecteurs sémantiques (système secondaire, pour compatibilité) */
.card-present { }
.card-past { }
.card-future { }

/* Combinaison avec le type de tirage */
.card-1.celtic-cross { }
.card-2.love-spread { }
```

## Bonnes Pratiques

1. **Spécificité**
   - Éviter les sélecteurs trop spécifiques
   - Limiter l'imbrication à 2-3 niveaux
   - Utiliser les classes plutôt que les IDs

2. **Réutilisabilité**
   - Créer des composants modulaires
   - Utiliser des utilitaires
   - Éviter les styles en ligne

3. **Maintenabilité**
   - Commenter les sections complexes
   - Grouper les propriétés logiquement
   - Suivre un ordre cohérent

4. **Performance**
   - Minimiser les sélecteurs
   - Éviter les duplications
   - Optimiser les animations

5. **Variables**
   - Définir les variables au niveau approprié de spécificité
   - Utiliser des commentaires explicatifs pour les variables complexes
   - Préférer les valeurs en pourcentage pour les positions (meilleure responsivité)

## Exemple Complet de Composant Carte

```css
/* Composant Card */
.card {
  /* Variables locales */
  --card-padding: var(--spacing-md);
  --card-radius: 8px;
  
  /* Layout */
  display: flex;
  flex-direction: column;
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  position: absolute;
  transform: translate(-50%, -50%);
  
  /* Thème */
  background: var(--color-card-background);
  
  /* Animation */
  transition: transform var(--transition-base);
}

/* Éléments */
.card__image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Modificateurs de position */
.card-1 {
  left: var(--cross-position-1-x);
  top: var(--cross-position-1-y);
}

.card-2.celtic-cross {
  left: var(--celtic-position-2-x);
  top: var(--celtic-position-2-y);
  transform: translate(-50%, -50%) rotate(var(--celtic-position-2-rotation));
}

/* États */
.card.is-flipped {
  transform: translate(-50%, -50%) rotateY(180deg);
}

/* Media Queries */
@media (min-width: var(--breakpoint-md)) {
  .card {
    width: var(--card-width);
    height: var(--card-height);
  }
}
``` 