# Gestion des Z-index et Ordre d'Affichage

## Vue d'Ensemble

La gestion de l'ordre d'affichage des éléments est cruciale dans JodoTarot, particulièrement pour les tirages où certaines cartes se chevauchent. Cette documentation explique comment les z-index sont utilisés pour contrôler la superposition des éléments visuels.

## Principes de Base

JodoTarot utilise un système cohérent de z-index défini comme variables CSS dans `assets/css/base/variables.css` :

```css
/* Z-index */
--z-index-below: -1;     /* Éléments sous le flux normal */
--z-index-base: 1;       /* Niveau de base */
--z-index-above: 10;     /* Au-dessus du flux normal */
--z-index-modal: 100;    /* Fenêtres modales */
--z-index-toast: 1000;   /* Notifications */
```

## Cas Particuliers

### Superposition des Cartes dans les Tirages

Dans certains tirages comme la Croix Celtique, des cartes doivent apparaître au-dessus d'autres :

```css
/* La carte en position 2 (challenge) doit apparaître au-dessus de la carte en position 1 */
.celtic-cross-spread .card-position-2 {
  z-index: 5; /* Valeur supérieure à la valeur par défaut */
}
```

Cette spécification est également appliquée via JavaScript :

```javascript
// Dans CelticCrossSpread.js
if (position.position === 2 || position.cssName === 'challenge') {
  positionElement.style.zIndex = '5';
}
```

### Comportement au Survol (Hover)

Lors du survol d'une carte, celle-ci doit passer au-dessus des autres pour améliorer la lisibilité :

```css
.card-position:hover {
  z-index: 10; /* Valeur plus élevée pour passer au-dessus des autres cartes */
}
```

### Cartes Agrandies (Vue Détaillée)

Lorsqu'une carte est agrandie pour afficher les détails :

```css
.card.enlarged {
  z-index: var(--z-index-modal); /* Utilisation de la variable pour les éléments modaux */
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7); /* Crée un overlay sombre */
}
```

## Organisation Hiérarchique

Les éléments sont organisés selon la hiérarchie suivante (de l'arrière vers l'avant) :

1. **Arrière-plans et éléments décoratifs** (z-index: -1)
   - Éléments visuels de la croix celtique
   - Arrière-plan de la table de jeu

2. **Cartes standard** (z-index: 1-4)
   - Positions de base des cartes

3. **Cartes spéciales** (z-index: 5)
   - Cartes qui doivent apparaître au-dessus d'autres (ex: position 2 de la croix celtique)

4. **Cartes survolées** (z-index: 10)
   - Cartes avec l'état :hover

5. **Éléments d'interface** (z-index: 20-50)
   - Boutons et contrôles
   - Menus déroulants

6. **Éléments modaux** (z-index: 100)
   - Cartes agrandies
   - Fenêtres de dialogue

7. **Notifications** (z-index: 1000)
   - Messages toast
   - Alertes système

## Implémentation Technique

### Dans les Fichiers CSS

Les spécifications de z-index sont réparties dans plusieurs fichiers :

1. **variables.css** - Définition des constantes globales
2. **[tiragetype]-spread.css** - Règles spécifiques à chaque type de tirage
3. **cards.css** - Comportement général des cartes
4. **modal.css** - Fenêtres modales et overlays

### Gestion Programmatique

Le z-index peut également être géré dynamiquement via JavaScript :

```javascript
// Exemple d'application dynamique de z-index
positionElement.style.zIndex = getComputedStyle(document.documentElement)
  .getPropertyValue('--z-index-above');
  
// Ou directement avec une valeur numérique
positionElement.style.zIndex = '5';
```

## Dépannage

Si des problèmes d'ordre d'affichage surviennent :

1. **Problème** : Une carte ne s'affiche pas au-dessus d'une autre
   **Solution** : Vérifier le z-index de la carte et s'assurer qu'il est supérieur aux éléments environnants

2. **Problème** : Les éléments d'interface sont masqués par d'autres éléments
   **Solution** : Augmenter le z-index des éléments d'interface ou vérifier la structure du DOM

3. **Problème** : L'overlay modal ne couvre pas tout l'écran
   **Solution** : Vérifier que le z-index de l'overlay est suffisamment élevé et qu'il a bien une position fixe

## Bonnes Pratiques

1. **Toujours utiliser les variables CSS** pour les valeurs de z-index standard
2. **Éviter les valeurs arbitrairement élevées** (ex: 9999) sauf pour des cas très spécifiques
3. **Maintenir une documentation des plages de z-index** utilisées dans l'application
4. **Tester les interactions complexes** entre éléments qui se chevauchent

## Voir Aussi

- [Positionnement des cartes](positionnement-cartes.md)
- [Rotation des cartes](rotation-cartes.md)
- [Conventions de nommage CSS](../standards/css-naming-conventions.md) 