# Éditeur de Positions des Cartes

## Aperçu

L'éditeur de positions (`spread-editor.html` à la racine du projet) est un outil visuel permettant de définir les positions et les dimensions des cartes pour chaque type de tirage. Il génère les variables CSS nécessaires qui peuvent ensuite être copiées dans le fichier `variables.css`.

## Rôle dans l'Architecture

L'éditeur de tirages est un outil de développement spécialisé crucial pour maintenir la cohérence visuelle entre les différents types de tirages. Il représente une solution élégante pour gérer les dispositions complexes de cartes tout en maintenant une approche basée sur CSS natif, sans dépendre de bibliothèques externes.

**Principes architecturaux**:
1. Utilise les variables CSS de `variables.css` comme source unique de vérité
2. Ne redéfinit jamais les variables déjà présentes dans `variables.css`
3. Génère des variables CSS à copier dans `variables.css`
4. Adapte ses dimensions automatiquement selon les media queries

**Fonctionnalités principales**:
- **Interface glisser-déposer**: Positionnement précis des cartes par manipulation directe
- **Contrôle de rotation**: Ajustement de l'angle de chaque carte avec un curseur
- **Prévisualisation instantanée**: Aperçu en temps réel des modifications
- **Génération automatique de CSS**: Production de code prêt à l'emploi
- **Contrôle des dimensions**: Ajustement spécifique des dimensions pour chaque type de tirage
- **Adaptation responsive**: Affichage adaptatif sur différentes tailles d'écran

L'éditeur utilise le même système de variables CSS que l'application principale, ce qui garantit une cohérence parfaite entre l'édition et l'affichage final. Pour chaque type de tirage (Croix, Fer à Cheval, Amour, Croix Celtique), il génère:

1. Les variables de position avec syntaxe standardisée (`--[spread-type]-position-[number]-x`, `--[spread-type]-position-[number]-y`)
2. Les variables de rotation (`--[spread-type]-position-[number]-rotation`) si différentes de 0
3. Les variables de dimensions spécifiques au tirage (`--[spread-type]-card-base-width`, etc.)

**Flux de travail typique**:
1. Ouvrir `spread-editor.html` dans le navigateur
2. Sélectionner le type de tirage à modifier dans le menu déroulant
3. Déplacer les cartes pour définir leur position exacte
4. Ajuster la rotation avec le curseur pour les cartes qui nécessitent un angle
5. Personnaliser les dimensions des cartes si nécessaire
6. Copier le CSS généré avec le bouton "Copier CSS"
7. Coller le code dans le fichier `assets/css/base/variables.css`

## Types de Tirages Disponibles

L'éditeur prend en charge quatre types de tirages:

1. **Tirage en Croix** (cross): 5 cartes disposées en forme de croix
2. **Fer à Cheval** (horseshoe): 7 cartes disposées en forme de fer à cheval
3. **Tarot de l'Amour** (love): 7 cartes disposées pour représenter une relation
4. **Croix Celtique** (celtic): 10 cartes dans la disposition traditionnelle de la croix celtique

Chaque tirage possède ses propres positions prédéfinies qui peuvent être modifiées via l'interface.

## Fonctionnalités Détaillées

### 1. Positionnement des Cartes

- Glisser-déposer intuitif des cartes dans l'espace de travail
- Affichage des numéros de position et des descriptions pour chaque carte
- Coordonnées exprimées en pourcentages pour une meilleure adaptation responsive
- Mise à jour instantanée de la position pendant le déplacement

### 2. Contrôle de Rotation

- Curseur permettant d'ajuster la rotation de 0° à 360° par incréments de 5°
- Application immédiate de la rotation à la carte sélectionnée
- Génération de variable de rotation uniquement si différente de 0°

### 3. Personnalisation des Dimensions

- Contrôle précis de trois paramètres clés:
  - **Largeur de base (px)**: De 60px à 150px
  - **Ratio hauteur/largeur**: De 1.4 à 2.0
  - **Facteur d'échelle**: De 0.8 à 1.5
- Application en temps réel des changements de dimensions
- Dimensions spécifiques à chaque type de tirage

### 4. Génération de CSS

- Affichage en temps réel des variables CSS modifiées
- Génération optimisée incluant uniquement les valeurs qui ont changé
- Formatage propre avec commentaires par section

## Utilisation

### Positionnement des Cartes

1. Sélectionnez un type de tirage dans le menu déroulant
2. Cliquez sur une carte et faites-la glisser vers la position souhaitée
3. La carte sélectionnée sera mise en évidence
4. Les variables CSS correspondantes seront automatiquement mises à jour

### Rotation des Cartes

1. Sélectionnez une carte en cliquant dessus
2. Utilisez le curseur de rotation pour ajuster l'angle
3. La rotation est appliquée instantanément et le CSS est mis à jour

### Dimensions des Cartes

La section "Dimensions des Cartes" permet de personnaliser trois paramètres :

- **Largeur de base (px)**: Définit la taille de base des cartes en pixels
- **Ratio hauteur/largeur**: Détermine la proportion entre hauteur et largeur
- **Facteur d'échelle**: Multiplicateur global appliqué à la largeur de base

Les changements sont appliqués en temps réel et affectent uniquement le type de tirage actuellement sélectionné.

### Réinitialisation et Copie

- **Réinitialiser**: Restaure les positions et dimensions originales depuis `variables.css`
- **Copier CSS**: Copie les variables CSS modifiées dans le presse-papier

## Variables CSS Générées

L'éditeur génère deux types de variables :

1. **Variables de dimension** spécifiques au tirage (toujours incluses) :
```css
/* Dimensions des cartes pour le tirage Tirage en Croix */
--cross-card-base-width: 95px;
--cross-card-ratio: 1.7;
--cross-card-scale-factor: 1;
```

2. **Variables de position** (uniquement celles qui ont été modifiées) :
```css
/* Variables modifiées pour le tirage Tirage en Croix */
--cross-position-1-x: 50%;
--cross-position-1-y: 50%;
--cross-position-2-rotation: 90deg;
```

## Conseils d'Utilisation

### Optimisation des Tirages

- Pour la **Croix Celtique** (10 cartes): Utilisez des cartes plus petites (75-85px) avec un facteur d'échelle réduit (0.8-0.9)
- Pour le **Tirage en Croix** (5 cartes): Utilisez la taille standard (95-100px) avec un facteur d'échelle normal (1.0)
- Pour les tirages avec cartes verticales: Augmentez le ratio hauteur/largeur (1.8-2.0)

### Bonnes Pratiques

- Placez les cartes en évitant les chevauchements excessifs
- Utilisez des positions en pourcentages entiers pour plus de lisibilité
- Maintenez une cohérence visuelle entre les différents types de tirages
- Testez vos modifications dans l'application principale avant de les finaliser

## Notes Techniques

- L'éditeur applique les modifications en temps réel via l'API CSS
- Les valeurs de position sont automatiquement arrondies aux pourcentages entiers
- Seules les valeurs modifiées par rapport aux valeurs initiales sont incluses dans le CSS généré
- L'éditeur est conçu pour être responsive et s'adapter à différentes tailles d'écran
- Les coordonnées sont exprimées en pourcentages relatifs à la taille du conteneur 