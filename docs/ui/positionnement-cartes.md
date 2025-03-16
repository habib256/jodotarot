# 🎴 Types de Tirages et Positionnement des Cartes

## 🌟 Vue d'ensemble

JodoTarot propose quatre types de tirages différents, chacun avec son propre positionnement et sa signification particulière.

## 📍 Types de Tirages

### ✝️ Tirage en Croix (5 cartes)

```
       1
    4  2  5
       3
```

1. **Influences positives** : Forces et opportunités
2. **Passé** : Événements et influences passés
3. **Situation actuelle** : État présent
4. **Futur** : Tendances et possibilités
5. **Influences négatives** : Obstacles et défis

### 🔄 Tirage en Fer à Cheval (7 cartes)

```
1  2  3
   4
5  6  7
```

1. **Situation actuelle**
2. **Obstacles immédiats**
3. **Influences inconscientes**
4. **Conseils à suivre**
5. **Influences extérieures**
6. **Espoirs et craintes**
7. **Résultat final**

### 💝 Tirage de l'Amour (7 cartes)

```
   1  2
3  4  5
   6  7
```

1. **Vous** : Votre énergie
2. **Partenaire** : Son énergie
3. **Relation** : Ce qui vous lie
4. **Obstacles** : Défis à surmonter
5. **Désirs** : Attentes et souhaits
6. **Situation actuelle**
7. **Conseil** : Direction future

### ☘️ Croix Celtique (10 cartes)

```
     4
     1
  5  2  6
     3
  7  8  9
    10
```

1. **Situation actuelle**
2. **Obstacle/Défi**
3. **Base/Fondation**
4. **Passé**
5. **Couronne/Objectif**
6. **Futur**
7. **Vous-même**
8. **Environnement**
9. **Espoirs/Craintes**
10. **Résultat final**

## 🎯 Conseils d'Utilisation

### Choix du Tirage
- **Croix** : Questions générales et rapides
- **Fer à Cheval** : Évolution d'une situation
- **Amour** : Questions relationnelles
- **Croix Celtique** : Analyse approfondie

### Interprétation
- Considérez la position de chaque carte
- Observez les relations entre les cartes
- Tenez compte de l'orientation
- Intégrez le contexte de la question

## 🔄 Aspects Techniques

### Animation et Affichage
- Transition fluide pour chaque carte
- Zoom possible sur les cartes
- Affichage adaptatif (responsive)
- Support tactile pour mobile

### Personnalisation
- Choix du jeu de cartes
- Options d'affichage
- Paramètres d'animation
- Mode d'interprétation

## Vue d'Ensemble

Le système de positionnement des cartes dans JodoTarot utilise une approche hybride combinant :
1. Un système numérique standardisé (nouveau standard)
2. Un système sémantique (pour rétrocompatibilité)

## Structure de Base

### Définition des Positions

Chaque position de carte est définie avec les propriétés suivantes :

```javascript
{
  name: 'present',           // Nom sémantique
  cssName: 'present',        // Nom pour les variables CSS (legacy)
  position: 1,              // Numéro de position (nouveau standard)
  rotation: 0               // Rotation en degrés (optionnel)
}
```

### Variables CSS

Les positions sont définies via des variables CSS suivant deux formats :

```css
/* Format numérique (nouveau standard) */
--${spreadType}-position-${number}-x: 40%;
--${spreadType}-position-${number}-y: 40%;
--${spreadType}-position-${number}-rotation: 0deg;

/* Format sémantique (legacy) */
--${spreadType}-${name}-x: 40%;
--${spreadType}-${name}-y: 40%;
--${spreadType}-${name}-rotation: 0deg;
```

## Implémentation

### Classes CSS

Les positions utilisent plusieurs classes pour assurer la compatibilité :

```css
.card-position {
  /* Styles de base pour toutes les positions */
  position: absolute;
  transition: all 0.3s ease;
}

/* Classes de position */
.card-${index + 1}              /* Position numérique de base */
.position-${position}           /* Nouveau standard numérique */
.card-position-${position}      /* Alternative numérique */
.${name}                        /* Nom sémantique */
```

### Positionnement dans le DOM

```javascript
// Exemple de création d'une position
const positionElement = document.createElement('div');
positionElement.className = this.getPositionClassName(index, position) + ' empty';
positionElement.setAttribute('data-position', index);
positionElement.setAttribute('data-position-name', this.getPositionMeaning(index));
positionElement.setAttribute('data-position-meaning', positionDescription);
```

## Éditeur de Positions

L'application inclut un éditeur visuel (`tools/spread-editor.html`) permettant de :
- Définir visuellement les positions des cartes
- Générer les variables CSS correspondantes
- Tester les positions en temps réel
- Sauvegarder les configurations

### Utilisation de l'Éditeur

1. Ouvrir `tools/spread-editor.html`
2. Sélectionner le type de tirage à éditer
3. Déplacer les cartes à la position souhaitée
4. Ajuster les rotations si nécessaire
5. Générer et copier le CSS résultant

### Format de Sortie

```css
/* Variables générées par l'éditeur */
:root {
  /* Croix Celtique */
  --celtic-position-1-x: 40%;
  --celtic-position-1-y: 40%;
  --celtic-position-2-x: 40%;
  --celtic-position-2-y: 40%;
  --celtic-position-2-rotation: 90deg;
  /* ... */
  
  /* Fer à Cheval */
  --horseshoe-position-1-x: 20%;
  --horseshoe-position-1-y: 50%;
  /* ... */
  
  /* Tirage Amour */
  --love-position-1-x: 30%;
  --love-position-1-y: 40%;
  /* ... */
}
```

## Bonnes Pratiques

1. **Nommage**
   - Utiliser le nouveau système numérique pour les nouvelles implémentations
   - Maintenir la compatibilité avec les noms sémantiques
   - Documenter les significations des positions

2. **Positionnement**
   - Centrer les cartes avec `transform: translate(-50%, -50%)`
   - Utiliser des pourcentages pour les positions
   - Appliquer les rotations après le centrage

3. **Accessibilité**
   - Fournir des attributs `data-position-name` et `data-position-meaning`
   - Maintenir un ordre logique dans le DOM
   - Assurer une navigation clavier cohérente

4. **Performance**
   - Utiliser `transform` pour les animations
   - Regrouper les changements de style
   - Éviter les calculs de position inutiles 

## Voir Aussi

- [Guide d'intégration de nouveaux types de tirages](../composants/integrer-nouveau-tirage.md)
- [Dimensions spécifiques des cartes par type de tirage](dimensions-cartes.md) 