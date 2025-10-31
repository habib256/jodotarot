# Agrandissement des cartes

## Vue d'ensemble

Le système d'agrandissement des cartes permet aux utilisateurs de cliquer sur n'importe quelle carte affichée dans un tirage pour la voir en grand format avec une animation fluide depuis sa position d'origine.

## Fonctionnalités

### 1. Agrandissement au clic
- **Action** : Cliquez sur n'importe quelle carte dans le tirage
- **Résultat** : La carte s'agrandit progressivement depuis sa position d'origine vers le centre de l'écran
- **Animation** : Transition fluide en 0.4 secondes avec courbe d'accélération personnalisée

### 2. Gestion des orientations

#### Cartes renversées
- Les cartes peuvent apparaître renversées lors d'un tirage (probabilité 50/50)
- L'image de la carte renversée est pivotée à 180 degrés
- L'indication "(Renversée)" s'affiche en jaune dans les informations de la carte agrandie
- La classe CSS `.reversed` est automatiquement appliquée

#### Cartes tournées
- Les cartes peuvent être positionnées avec différents angles de rotation dans certains tirages
- Le système calcule automatiquement l'angle de rotation d'origine
- La carte agrandie s'affiche toujours à l'endroit (rotation 0°) pour une meilleure lisibilité
- Les dimensions sont ajustées pour garantir que toute la carte reste visible

### 3. Informations affichées

Lors de l'agrandissement, les informations suivantes sont affichées en surimpression :
- **Nom de la carte** : Titre principal avec indication de renversement le cas échéant
- **Position** : Signification de la position dans le tirage (ex: "Situation actuelle")
- **Description** : Explication détaillée de la signification de cette position

### 4. Fermeture

Plusieurs méthodes pour fermer la carte agrandie :
- Cliquer sur l'overlay sombre (zone autour de la carte)
- Appuyer sur la touche **Échap** (Escape)
- Un message "✕ Cliquez pour fermer" s'affiche en haut à droite

### 5. Animation de retour

Lorsque vous fermez la carte :
- Elle revient à sa position d'origine avec une animation
- Rotation et dimensions originales sont restaurées
- Transition fluide en 0.3 secondes

## Aspects techniques

### Architecture

**Fichiers principaux** :
- `/assets/js/utils/CardEnlarger.js` : Classe gérant toute la logique d'agrandissement
- `/assets/css/components/card-enlarger.css` : Styles pour l'affichage agrandi
- `/assets/js/main.js` : Initialisation du module

### Calculs de dimension

Le système utilise un algorithme intelligent pour :
1. Détecter l'angle de rotation de la carte d'origine
2. Calculer les vraies dimensions (tenant compte de la rotation)
3. Maximiser la taille tout en gardant la carte entièrement visible
4. Respecter les limites suivantes :
   - Largeur maximale : 70% du viewport ou 500px
   - Hauteur maximale : 80% du viewport
   - Marges de sécurité pour tous les écrans

### Gestion du renversement

Les cartes sont tirées avec orientation aléatoire :
```javascript
// Dans BaseSpread.js
const card = deck.drawCard(true); // true active l'orientation aléatoire
```

Le CSS gère l'affichage :
```css
.card.reversed img {
  transform: rotate(180deg);
}
```

### Responsive Design

#### Desktop (> 768px)
- Taille maximale : 500px de largeur
- Message "Cliquez pour fermer" complet

#### Tablette (≤ 768px)
- Message "Cliquez pour fermer" plus petit
- Padding des informations réduit

#### Mobile (≤ 480px)
- Message réduit à "✕" uniquement dans un cercle
- Optimisation des tailles de police
- Adaptation automatique aux petits écrans

### Blocage du défilement

Quand une carte est agrandie :
- La classe `card-enlarged-active` est ajoutée au body
- Le défilement de la page est désactivé
- Évite les interactions accidentelles avec la page

## Utilisation

### Pour l'utilisateur
1. Effectuez un tirage de cartes
2. Cliquez sur n'importe quelle carte pour la voir en grand
3. Consultez les informations détaillées
4. Fermez avec Échap ou en cliquant en dehors

### Pour le développeur

**Initialisation automatique** :
```javascript
// Dans main.js
import CardEnlarger from './utils/CardEnlarger.js';
cardEnlarger = new CardEnlarger();
```

**Aucune configuration supplémentaire requise** - Le système détecte automatiquement tous les clics sur les éléments avec la classe `.card`.

## Accessibilité

- Support du clavier (touche Échap)
- Contrastes élevés pour les textes en surimpression
- Ombres portées pour améliorer la lisibilité
- Animations fluides mais désactivables si nécessaire
- Messages clairs et visuels pour fermer

## Performance

- Utilisation de `requestAnimationFrame` pour des animations fluides à 60 FPS
- Clonage léger des éléments DOM
- Cleanup automatique après fermeture
- Pas de fuite mémoire (suppression complète des éléments)
- Z-index appropriés pour éviter les conflits

## Améliorations futures possibles

- [ ] Support du swipe pour fermer sur mobile
- [ ] Zoom progressif avec la molette de la souris
- [ ] Navigation entre cartes avec les flèches du clavier
- [ ] Mode galerie pour voir toutes les cartes
- [ ] Sauvegarde des cartes favorites

