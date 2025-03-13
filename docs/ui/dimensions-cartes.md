# Dimensions Spécifiques des Cartes par Type de Tirage

## Vue d'Ensemble

JodoTarot utilise maintenant un système permettant de définir des dimensions de cartes spécifiques à chaque type de tirage. Cette amélioration offre une plus grande flexibilité visuelle, permettant d'adapter la taille et les proportions des cartes en fonction du nombre de cartes et de la disposition de chaque tirage.

## Motivation

Différents types de tirages nécessitent différentes tailles de cartes pour une expérience utilisateur optimale :

- Les tirages avec beaucoup de cartes (comme la Croix Celtique) peuvent bénéficier de cartes plus petites
- Les tirages plus simples (comme la Croix) peuvent utiliser des cartes plus grandes
- Certains arrangements visuels peuvent nécessiter des proportions de cartes différentes

## Structure des Variables CSS

Pour chaque type de tirage, nous définissons désormais trois variables essentielles :

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

Chaque type de tirage possède son propre ensemble de variables :

#### Tirage en Croix
```css
--cross-card-base-width
--cross-card-ratio
--cross-card-scale-factor
--cross-card-width
--cross-card-height
```

#### Tirage en Fer à Cheval
```css
--horseshoe-card-base-width
--horseshoe-card-ratio
--horseshoe-card-scale-factor
--horseshoe-card-width
--horseshoe-card-height
```

#### Tirage de l'Amour
```css
--love-card-base-width
--love-card-ratio
--love-card-scale-factor
--love-card-width
--love-card-height
```

#### Tirage de la Croix Celtique
```css
--celtic-card-base-width
--celtic-card-ratio
--celtic-card-scale-factor
--celtic-card-width
--celtic-card-height
```

## Valeurs par Défaut

Par défaut, tous les tirages héritent des valeurs globales :

```css
--card-base-width: 95px;          /* Taille de base pour mobile */
--card-ratio: 1.7;                /* Ratio hauteur/largeur constant */
--card-scale-factor: 1;           /* Facteur d'échelle de base */
```

La Croix Celtique est une exception, avec un facteur d'échelle réduit par défaut pour accommoder le plus grand nombre de cartes :

```css
--celtic-card-scale-factor: var(--card-scale-factor) * 0.85;
```

## Modification des Dimensions

Pour modifier les dimensions des cartes d'un tirage spécifique, deux approches sont possibles :

### 1. Utiliser l'Éditeur de Positions

L'éditeur de positions des cartes (`spread-editor.html`) permet de modifier visuellement les dimensions des cartes et génère le CSS correspondant.

### 2. Modifier Directement les Variables CSS

Vous pouvez également modifier directement les variables dans le fichier `assets/css/base/variables.css` :

```css
/* Exemple : Rendre les cartes du tirage de l'amour plus grandes */
--love-card-base-width: 110px;
--love-card-ratio: 1.8;
--love-card-scale-factor: 1.1;
```

## Compatibilité

Pour assurer la compatibilité avec le code existant, les variables globales (`--card-width`, `--card-height`, etc.) sont toujours maintenues. Cependant, chaque module de tirage utilise maintenant les variables spécifiques :

```css
/* Dans cross-spread.css */
.card-position {
  width: var(--cross-card-width);
  height: var(--cross-card-height);
}

/* Dans horseshoe-spread.css */
.card-position {
  width: var(--horseshoe-card-width);
  height: var(--horseshoe-card-height);
}
```

## Exemple d'Utilisation

Si vous souhaitez créer un nouveau type de tirage avec des dimensions personnalisées, suivez ce modèle :

1. Définissez les variables de dimensions dans `variables.css` :
```css
--nouveau-tirage-card-base-width: 90px;
--nouveau-tirage-card-ratio: 1.65;
--nouveau-tirage-card-scale-factor: 0.95;
--nouveau-tirage-card-width: calc(var(--nouveau-tirage-card-base-width) * var(--nouveau-tirage-card-scale-factor));
--nouveau-tirage-card-height: calc(var(--nouveau-tirage-card-width) * var(--nouveau-tirage-card-ratio));
```

2. Utilisez ces variables dans le CSS du module :
```css
.nouveau-tirage .card-position {
  width: var(--nouveau-tirage-card-width);
  height: var(--nouveau-tirage-card-height);
}
```

## Architecture Technique

Le système s'appuie sur trois composants clés :

1. **Variables CSS Spécifiques** définies dans `variables.css`
2. **Modules CSS** adaptés pour utiliser ces variables spécifiques
3. **Éditeur de Positions** modifié pour gérer les dimensions par type de tirage

## Considérations Responsives

Les dimensions spécifiques respectent toujours les media queries définies dans `variables.css`. La taille des cartes s'adapte donc automatiquement aux différentes tailles d'écran. 