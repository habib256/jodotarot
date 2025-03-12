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

### Nommage des Variables

```css
:root {
  /* Couleurs */
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --color-text: #2c3e50;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Typographie */
  --font-family-base: 'Arial', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
  
  /* Breakpoints */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  
  /* Animations */
  --animation-duration: 0.3s;
  --animation-timing: ease-in-out;
}
```

## Media Queries

### Points de Rupture

```css
/* Mobile First */
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 992px) { /* Large devices */ }
@media (min-width: 1200px) { /* Extra large devices */ }
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
styles/
├── base/
│   ├── _reset.css
│   ├── _typography.css
│   └── _variables.css
├── components/
│   ├── _buttons.css
│   ├── _cards.css
│   └── _spreads.css
├── layouts/
│   ├── _grid.css
│   └── _containers.css
├── themes/
│   ├── _light.css
│   └── _dark.css
└── main.css
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

## Exemple Complet

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
  
  /* Thème */
  background: var(--theme-bg);
  color: var(--theme-text);
  
  /* Animation */
  transition: transform var(--animation-duration) var(--animation-timing);
}

/* Éléments */
.card__image {
  width: 100%;
  height: auto;
  border-radius: calc(var(--card-radius) - 2px);
}

.card__title {
  margin-top: var(--spacing-sm);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
}

/* Modificateurs */
.card--selected {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* États */
.card.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Media Queries */
@media (min-width: var(--breakpoint-md)) {
  .card {
    flex-direction: row;
  }
  
  .card__image {
    width: 30%;
  }
}
``` 