# 🎴 Types de Tirages et Positionnement des Cartes

## 🌟 Vue d'ensemble

JodoTarot propose quatre types de tirages différents, chacun avec son propre positionnement et sa signification particulière. Le système de positionnement utilise des variables CSS standardisées et une approche uniforme pour tous les types de tirages.

## 📍 Types de Tirages

### ✝️ Tirage en Croix (5 cartes)

```
       2
    3  1  4
       5
```

1. **Centrale (Position 1)**: Situation actuelle
2. **Haute (Position 2)**: Ce qui influence
3. **Gauche (Position 3)**: Passé
4. **Droite (Position 4)**: Futur
5. **Basse (Position 5)**: Résultat

### 🔄 Tirage en Fer à Cheval (7 cartes)

```
1     5
  3     7
2  4  6
```

1. **Passé lointain (Position 1)**: Les origines de la situation
2. **Passé récent (Position 2)**: Événements récents influençant la situation
3. **Présent (Position 3)**: La situation actuelle
4. **Futur proche (Position 4)**: Ce qui arrive bientôt
5. **Résultat probable (Position 5)**: Aboutissement si la trajectoire reste inchangée
6. **Influences externes (Position 6)**: Facteurs extérieurs affectant la situation
7. **Conseil (Position 7)**: Guidance pour améliorer le résultat

### 💝 Tirage de l'Amour (7 cartes)

```
  2
1   3 4
  6 5 7
```

1. **Vous (Position 1)**: Votre position dans la relation
2. **Partenaire (Position 2)**: La position de votre partenaire
3. **Dynamique relationnelle (Position 3)**: Comment vous interagissez
4. **Obstacles (Position 4)**: Ce qui doit être surmonté
5. **Désirs secrets (Position 5)**: Ce que vous désirez vraiment
6. **Situation présente (Position 6)**: État actuel de la relation
7. **Conseils (Position 7)**: Direction à prendre

### ☘️ Croix Celtique (10 cartes)

```
     5
  4  1  6
     2
3       7
     8
  9    10
```

1. **Présent (Position 1)**: Situation actuelle
2. **Défi (Position 2)**: Obstacle ou défi immédiat (souvent placé en croix)
3. **Couronne (Position 3)**: Objectif ou idéal
4. **Fondation (Position 4)**: Base de la situation
5. **Passé (Position 5)**: Influences passées
6. **Futur (Position 6)**: Ce qui est à venir
7. **Soi (Position 7)**: Votre attitude/position
8. **Environnement (Position 8)**: Influences extérieures
9. **Espoirs (Position 9)**: Espérances ou craintes
10. **Résultat (Position 10)**: Résultat final

## 🎯 Conseils d'Utilisation

### Choix du Tirage
- **Croix** : Questions générales et rapides (5 cartes)
- **Fer à Cheval** : Évolution d'une situation dans le temps (7 cartes)
- **Amour** : Questions relationnelles et dynamiques interpersonnelles (7 cartes)
- **Croix Celtique** : Analyse approfondie et détaillée (10 cartes)

### Interprétation
- Considérez la position spécifique de chaque carte
- Observez les relations entre les cartes adjacentes
- Tenez compte de l'orientation (à l'endroit ou renversée)
- Intégrez le contexte de la question posée

## 🔄 Aspects Techniques

### Système de Positionnement

JodoTarot utilise un système de positionnement standardisé basé sur des variables CSS et des identifiants numériques :

1. Chaque position est identifiée par un numéro (1, 2, 3...)
2. Les positions utilisent des pourcentages pour une adaptation responsive
3. Les variables CSS suivent une convention de nommage uniforme

### Structure de Base

#### Définition des Positions dans le Code

Dans le code JavaScript (classes de tirages), les positions sont définies comme suit :

```javascript
// Exemple de définition dans BaseSpread.js
this.cardPositions = [
  { name: 'present', position: 1 },
  { name: 'challenge', position: 2, rotation: 90 },
  // Autres positions...
];
```

#### Variables CSS de Positionnement

Les positions sont déterminées par des variables CSS suivant une convention de nommage standardisée :

```css
/* Format standard pour les positions */
--cross-position-1-x: 50%;           /* Position horizontale */
--cross-position-1-y: 50%;           /* Position verticale */
--cross-position-2-rotation: 90deg;   /* Rotation (si nécessaire) */
```

Chaque type de tirage utilise son propre préfixe :
- `--cross-` pour le Tirage en Croix
- `--horseshoe-` pour le Fer à Cheval
- `--love-` pour le Tirage de l'Amour
- `--celtic-` pour la Croix Celtique

### Classes CSS et Rendu

Le système utilise principalement deux types de classes :

```css
/* Classes de position */
.card-position {
  /* Styles de base pour toutes les positions */
  position: absolute;
  transform: translate(-50%, -50%);
}

.card-1, .card-2, .card-3 {
  /* Positions spécifiques basées sur les numéros */
}
```

#### Exemple de Rendu HTML

```html
<!-- Exemple pour une position dans le tirage en croix -->
<div class="card-position card-1" data-position="0" data-position-name="Situation actuelle">
  <div class="card upright">
    <!-- Contenu de la carte -->
  </div>
</div>
```

## 🔧 Éditeur de Positions

JodoTarot inclut un éditeur visuel (`spread-editor.html`) permettant de configurer les positions des cartes de manière intuitive.

### Fonctionnalités de l'Éditeur

- **Glisser-déposer** des cartes pour définir leurs positions
- **Contrôle de rotation** avec un curseur (0° à 360°)
- **Prévisualisation instantanée** des changements
- **Génération automatique** des variables CSS
- **Personnalisation des dimensions** spécifiques à chaque tirage

### Utilisation de l'Éditeur

1. Ouvrir `spread-editor.html` dans un navigateur
2. Sélectionner le type de tirage à modifier
3. Déplacer les cartes pour définir leurs positions
4. Ajuster la rotation des cartes si nécessaire
5. Ajuster les dimensions si besoin
6. Copier le CSS généré avec le bouton "Copier CSS"
7. Coller le code dans `assets/css/base/variables.css`

### Format des Variables Générées

```css
/* Variables générées par l'éditeur */

/* Dimensions des cartes pour le tirage Tirage en Croix */
--cross-card-base-width: 95px;
--cross-card-ratio: 1.7;
--cross-card-scale-factor: 1;

/* Variables modifiées pour le tirage Tirage en Croix */
--cross-position-1-x: 50%;
--cross-position-1-y: 50%;
--cross-position-2-x: 50%;
--cross-position-2-y: 20%;
--cross-position-3-x: 25%;
--cross-position-3-y: 50%;
```

Pour plus de détails sur l'éditeur, consultez la [documentation de l'éditeur de positions](../tools/spread-editor.md).

## 📏 Relation avec les Dimensions des Cartes

Le positionnement des cartes est étroitement lié à leurs dimensions. Chaque type de tirage possède ses propres dimensions optimisées :

```css
/* Dimensions spécifiques par tirage */
--cross-card-base-width: 95px;       /* Tirage en Croix */
--horseshoe-card-base-width: 95px;   /* Fer à Cheval */
--love-card-base-width: 95px;        /* Tirage de l'Amour */
--celtic-card-base-width: 75px;      /* Croix Celtique - plus petit */
```

Pour plus d'informations sur les dimensions, consultez la [documentation des dimensions des cartes](dimensions-cartes.md).

## ✅ Bonnes Pratiques

### Positionnement Optimal

1. **Aération visuelle**
   - Laisser suffisamment d'espace entre les cartes
   - Éviter les chevauchements excessifs (sauf si intentionnel)
   - Adapter la taille des cartes au nombre de positions

2. **Responsive Design**
   - Utiliser des pourcentages pour toutes les positions
   - Éviter les valeurs extrêmes (< 10% ou > 90%)
   - Tester sur différentes tailles d'écran

3. **Rotation des Cartes**
   - Limiter la rotation aux cas nécessaires (ex: carte "défi" dans la Croix Celtique)
   - Utiliser des angles standards (0°, 90°, 180°, 270°) pour une meilleure lisibilité
   - S'assurer que la rotation n'affecte pas négativement la lisibilité

### Implémentation

1. **Variables standardisées**
   - Toujours utiliser le format `--${spreadType}-position-${number}-x/y/rotation`
   - Ne définir que les variables qui diffèrent des valeurs par défaut
   - Documenter les changements significatifs

2. **Performance**
   - Utiliser `transform` pour les animations et le positionnement
   - Privilégier les propriétés qui ne déclenchent pas de reflow
   - Limiter le nombre de media queries et de conditions

## 🔗 Voir Aussi

- [Dimensions spécifiques des cartes](dimensions-cartes.md)
- [Documentation de l'éditeur de positions](../tools/spread-editor.md)
- [Standards pour les positions de cartes](../standards/card-positions.md) 