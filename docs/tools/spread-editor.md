# Éditeur de Positions des Cartes

## Aperçu

L'éditeur de positions (`spread-editor.html`) est un outil visuel permettant de définir les positions et les dimensions des cartes pour chaque type de tirage. Il génère les variables CSS nécessaires qui peuvent ensuite être copiées dans le fichier `variables.css`.

## Fonctionnalités

L'éditeur permet de :

1. **Définir les positions** des cartes (X, Y) pour chaque type de tirage
2. **Ajuster la rotation** des cartes
3. **Personnaliser les dimensions** spécifiques à chaque type de tirage :
   - Largeur de base (en pixels)
   - Ratio hauteur/largeur
   - Facteur d'échelle

## Utilisation

### Positionnement des Cartes

1. Sélectionnez un type de tirage dans le menu déroulant
2. Faites glisser les cartes pour les positionner
3. Utilisez le curseur de rotation pour ajuster l'angle si nécessaire
4. Le CSS généré s'affiche dans la zone de code à droite
5. Cliquez sur "Copier CSS" pour copier le code

### Dimensions des Cartes

La section "Dimensions des Cartes" permet de personnaliser trois paramètres :

- **Largeur de base (px)** : Taille de base des cartes en pixels
- **Ratio hauteur/largeur** : Proportion entre hauteur et largeur (ex: 1.7 = carte 70% plus haute que large)
- **Facteur d'échelle** : Multiplicateur appliqué à la largeur de base

Les changements sont appliqués en temps réel et affectent uniquement le type de tirage sélectionné.

## Variables CSS Générées

L'éditeur génère deux types de variables :

1. **Variables de position** au format standardisé :
```css
--cross-position-1-x: 50%;
--cross-position-1-y: 50%;
--cross-position-1-rotation: 0deg; /* si différent de 0 */
```

2. **Variables de dimensions** spécifiques au tirage :
```css
--cross-card-base-width: 95px;
--cross-card-ratio: 1.7;
--cross-card-scale-factor: 1;
```

## Exemple d'Utilisation

### Création d'un Tirage Personnalisé

1. Sélectionnez un tirage similaire à votre conception
2. Ajustez les dimensions des cartes selon vos besoins
3. Positionnez les cartes dans la disposition souhaitée
4. Copiez le CSS généré
5. Collez-le dans `variables.css`

### Optimisation pour Différents Tirages

- Utilisez des cartes plus petites pour les tirages comportant de nombreuses cartes (comme la Croix Celtique)
- Augmentez le ratio pour des cartes plus élancées dans les tirages verticaux
- Diminuez le facteur d'échelle pour les tirages denses

## Notes Techniques

- L'éditeur applique les modifications en temps réel via l'API CSS
- Les valeurs sont automatiquement arrondies (pourcentages sans décimales)
- Seules les valeurs modifiées sont incluses dans le CSS généré
- Les variables globales sont incluses pour la compatibilité avec l'ancien code 