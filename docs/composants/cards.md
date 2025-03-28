# 🎴 Système de Cartes

## Vue d'Ensemble

Le système de cartes de JodoTarot est conçu pour gérer les différents jeux de tarot disponibles dans l'application. Il est composé de plusieurs classes et services qui travaillent ensemble pour assurer une gestion cohérente des cartes.

## Architecture

### Classes Principales

#### TarotCard
- Représente une carte individuelle
- Gère les propriétés de base : id, nom, image, type d'arcane
- Supporte les orientations (upright/reversed)
- Gère les identifiants uniques au format `MXX` pour les arcanes majeurs

#### Deck
- Gère un jeu de cartes complet
- Responsable du mélange et du tirage des cartes
- Maintient l'état des cartes tirées et disponibles
- Exclut automatiquement le dos de carte des tirages

#### DeckService
- Service central pour la gestion des jeux de cartes
- Charge et met en cache les différents jeux
- Gère les configurations spécifiques à chaque jeu
- Fournit les significations des cartes

## Gestion des Jeux

### Jeux Disponibles
- Tarot Marseille (set01)
- Tarot Thiago Lehmann (set02)
- Tarot Renaissance (set03)

### Configuration des Jeux
```javascript
{
  id: 'set01',
  name: 'Tarot Marseille',
  path: 'assets/images/cards/marseille',
  majorCount: 22,
  minorCount: 0,
  supportsMinor: false
}
```

## Système de Tirage

### Processus de Tirage
1. Le jeu est chargé et mélangé
2. Les cartes sont tirées une par une
3. Le dos de carte est automatiquement exclu des tirages
4. Chaque carte peut être tirée à l'endroit ou renversée

### Gestion du Dos de Carte
- Le dos de carte (ID: M22) est géré séparément
- Il n'apparaît pas dans les tirages
- Il sera utilisé pour la future fonctionnalité de sélection de cartes
- Il est stocké avec un flag `isBackCard: true`

## Validation des Cartes

### Format des Cartes
```javascript
{
  id: 'MXX',        // Format M00-M21 pour les arcanes majeurs
  name: string,     // Nom de la carte
  imageUrl: string, // URL de l'image
  position: string, // 'upright' ou 'reversed'
  arcana: string,   // Type d'arcane (major/minor)
  rank: number,     // Rang de la carte (0-21)
  isBackCard: boolean // Flag pour le dos de carte
}
```

### Règles de Validation
- ID doit suivre le format `MXX`
- Nom et URL d'image sont requis
- Position doit être 'upright' ou 'reversed'
- Le dos de carte doit avoir `isBackCard: true`

## Bonnes Pratiques

### Manipulation des Cartes
1. Toujours utiliser les méthodes du Deck pour tirer des cartes
2. Ne pas modifier directement les propriétés des cartes
3. Utiliser les méthodes de validation avant de sauvegarder

### Gestion des États
1. Toujours passer par le StateManager pour les mises à jour
2. Valider les cartes avant de les stocker dans l'état
3. Maintenir la cohérence entre le Deck et l'état

## Limitations Actuelles

### Arcanes Mineurs
- Actuellement non supportés dans les tirages
- Configuration préparée pour future implémentation
- Structure de données en place pour support futur

### Dos de Carte
- Exclu des tirages
- Réservé pour la future fonctionnalité de sélection
- Géré séparément dans le système

## Évolution Future

### Fonctionnalités Planifiées
1. Support des arcanes mineurs
2. Système de sélection de cartes
3. Sauvegarde des tirages
4. Mode sombre
5. Analyse d'images par IA

### Améliorations Techniques
1. Optimisation des performances
2. Meilleure gestion de la mémoire
3. Support du mode hors ligne
4. Système de cache amélioré 