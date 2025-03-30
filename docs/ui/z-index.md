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

Ces variables standardisées sont utilisées dans l'ensemble de l'application pour maintenir une hiérarchie cohérente des éléments visuels.

## Cas Particuliers

### Superposition des Cartes dans les Tirages

Dans certains tirages comme la Croix Celtique, des cartes doivent apparaître au-dessus d'autres :

```css
/* La carte en position 2 (challenge) doit apparaître au-dessus de la carte en position 1 */
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

Cette gestion des superpositions est particulièrement importante pour la Croix Celtique où la carte "défi" (position 2) croise la carte "présent" (position 1) et doit donc être affichée au-dessus.

### Comportement au Survol (Hover)

Lors du survol d'une carte, celle-ci doit passer au-dessus des autres pour améliorer la lisibilité :

```css
.celtic-cross-spread .card-position:hover {
  z-index: 10; /* Valeur plus élevée pour passer au-dessus des autres cartes */
  filter: brightness(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%) scale(1.02);
}

/* Pour la carte avec rotation */
.celtic-cross-spread .card-2:hover {
  z-index: 10;
  filter: brightness(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%) rotate(var(--celtic-position-2-rotation)) scale(1.02);
  transform-origin: center center;
}
```

### Cartes Agrandies (Vue Détaillée)

Lorsqu'une carte est agrandie pour afficher les détails, elle utilise la variable z-index la plus élevée :

```css
.card.enlarged {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--card-width-large);
  height: var(--card-height-large);
  z-index: var(--z-index-modal); /* Utilisation de la variable pour les éléments modaux */
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7); /* Crée un overlay sombre */
}

/* Conteneur pour les cartes agrandies */
#enlarge-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
  background-color: rgba(0, 0, 0, 0.7);
}
```

## Organisation Hiérarchique

Les éléments sont organisés selon la hiérarchie suivante (de l'arrière vers l'avant) :

1. **Arrière-plans et éléments décoratifs** (`z-index: var(--z-index-below)` = -1)
   - Éléments visuels comme les lignes de la croix celtique
   - Arrière-plan de la table de jeu

2. **Cartes standard** (`z-index: var(--z-index-base)` = 1)
   - Positions de base des cartes

3. **Cartes spéciales** (`z-index: 5`)
   - Cartes qui doivent apparaître au-dessus d'autres (ex: position 2 de la croix celtique)

4. **Cartes survolées** (`z-index: 10`)
   - Cartes avec l'état :hover

5. **Éléments d'interface** (`z-index: 20-50`)
   - Boutons et contrôles
   - Menus déroulants

6. **Éléments modaux** (`z-index: var(--z-index-modal)` = 100)
   - Cartes agrandies
   - Fenêtres de dialogue
   - Écrans de chargement

7. **Notifications** (`z-index: var(--z-index-toast)` = 1000)
   - Messages toast
   - Alertes système

## Implémentation Technique

### Dans les Fichiers CSS

Les spécifications de z-index sont réparties dans plusieurs fichiers :

1. **variables.css** - Définition des variables globales de z-index
   ```css
   --z-index-below: -1;
   --z-index-base: 1;
   --z-index-above: 10;
   --z-index-modal: 100;
   --z-index-toast: 1000;
   ```

2. **[tiragetype]-spread.css** - Règles spécifiques à chaque type de tirage
   ```css
   /* Dans celtic-cross-spread.css */
   .celtic-cross-spread .card-2 {
     z-index: 5;
   }
   ```

3. **cards.css** - Comportement général des cartes
   ```css
   .card {
     z-index: var(--z-index-base);
   }
   
   .card.enlarged {
     z-index: var(--z-index-modal);
   }
   ```

4. **loading.css** et **modal.css** - Éléments d'interface superposés
   ```css
   .loading-overlay {
     z-index: var(--z-index-modal);
   }
   
   .modal-container {
     z-index: var(--z-index-modal);
   }
   ```

### Gestion JavaScript

Le z-index est rarement manipulé directement en JavaScript dans JodoTarot, car la plupart des comportements sont gérés par CSS. Cependant, dans certains cas particuliers, des valeurs de z-index sont définies dynamiquement :

```javascript
// Dans UIService.js - Pour les conteneurs de cartes agrandies
container.style.zIndex = '10000';

// Dans ConfigController.js - Pour les dialogues de configuration
dialog.style.zIndex = '1000';
overlay.style.zIndex = '999';
```

## Dépannage

Si des problèmes d'ordre d'affichage surviennent :

1. **Problème** : Une carte ne s'affiche pas au-dessus d'une autre
   **Solution** : Vérifier dans le fichier CSS du tirage concerné que la valeur de z-index est correctement définie (généralement 5 pour les cartes spéciales)

2. **Problème** : Les éléments d'interface sont masqués par d'autres éléments
   **Solution** : S'assurer que les éléments d'interface utilisent `var(--z-index-above)` ou une valeur plus élevée

3. **Problème** : L'overlay modal ne couvre pas tout l'écran
   **Solution** : Vérifier que l'élément utilise `var(--z-index-modal)` et possède les propriétés `position: fixed; top: 0; left: 0; right: 0; bottom: 0;`

4. **Problème** : Les effets de survol ne fonctionnent pas correctement
   **Solution** : Vérifier que la règle CSS `:hover` inclut la propriété `z-index: 10;` et que la transition inclut `z-index`

## Bonnes Pratiques

1. **Utiliser systématiquement les variables CSS** pour les valeurs de z-index standard
   ```css
   z-index: var(--z-index-above);  /* ✓ Bonne pratique */
   z-index: 10;                   /* ✗ À éviter, sauf pour des valeurs intermédiaires spécifiques */
   ```

2. **Réserver les plages de valeurs**
   - -1 : Éléments d'arrière-plan
   - 1-4 : Éléments standard
   - 5-9 : Superpositions spécifiques (comme la carte "défi")
   - 10-99 : Effets interactifs (hover, focus)
   - 100-999 : Modaux et dialogues
   - 1000+ : Notifications et alertes système

3. **Éviter les valeurs extrêmement élevées** sauf pour des cas très spécifiques
   ```css
   z-index: 9999;  /* ✗ À éviter - Pourrait causer des conflits */
   ```

4. **Documenter les cas spéciaux** dans les commentaires du code

## Voir Aussi

- [Positionnement des cartes](positionnement-cartes.md)
- [Rotation des cartes](rotation-cartes.md)
- [Conventions de nommage CSS](../standards/css-naming-conventions.md) 