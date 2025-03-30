# 🎴 Système de Cartes

## Vue d'Ensemble

Le système de cartes de JodoTarot est conçu pour gérer les différents jeux de tarot disponibles dans l'application. Il est composé de plusieurs classes et services qui travaillent ensemble pour assurer une gestion cohérente des cartes.

## Architecture

### Classes Principales

#### TarotCard
- Représente une carte individuelle de tarot
- Propriétés principales : id, translationKey, image, arcana, orientation
- Méthodes utilitaires : isBack(), isMajor(), isMinor(), getFullName(), clone()
- Gère le formatage et l'encodage des URLs d'images
- Les identifiants suivent le format `MXX` pour les arcanes majeurs (ex: M00 pour Le Fou)

```javascript
// Exemple de la classe TarotCard
export class TarotCard {
  constructor(id, translationKey, image, arcana = ARCANE_TYPES.MAJOR, suit = null, rank = null) {
    this.id = id;
    this.translationKey = translationKey;
    this.image = image;
    this.arcana = arcana;
    this.suit = suit;
    this.rank = rank;
    this.orientation = 'upright'; // Orientation par défaut
    this.imageUrl = this.encodeImageUrl(image);
  }
  
  // Vérifie si c'est le dos de carte
  isBack() {
    return this.id === 'M22';
  }
}
```

#### Deck
- Représente un jeu de cartes complet
- Gère le mélange et le tirage des cartes
- Maintient l'état des cartes tirées et disponibles
- Exclut automatiquement le dos de carte des tirages (M22)
- Fournit des méthodes pour filtrer les cartes par type d'arcane

```javascript
// Exemple de la classe Deck
class Deck {
  constructor(deckId, cards = []) {
    this.deckId = deckId;
    this.originalCards = [...cards]; // Sauvegarde des cartes originales
    this.cards = [...cards]; // Copie des cartes pour manipulation
    this.drawnCards = []; // Cartes déjà tirées
  }
  
  // Tire une carte du jeu
  drawCard(randomOrientation = false) {
    if (this.cards.length === 0) {
      return null;
    }
    
    // Trouver la prochaine carte qui n'est pas le dos
    let cardIndex = this.cards.findIndex(card => !card.isBack());
    if (cardIndex === -1) {
      return null; // Aucune carte disponible sauf le dos
    }
    
    // Retirer la carte du jeu
    const card = this.cards.splice(cardIndex, 1)[0];
    this.drawnCards.push(card);
    
    // Ajouter l'orientation si demandée
    if (randomOrientation) {
      card.orientation = Math.random() < 0.5 ? 'upright' : 'reversed';
    }
    
    return card;
  }
}
```

#### DeckService
- Service central pour la gestion des jeux de cartes
- Charge les jeux de cartes depuis les fichiers d'images
- Met en cache les jeux chargés pour éviter de recharger inutilement
- Fournit les significations des cartes (à l'endroit et renversées)
- Vérifie l'accessibilité des images lors du chargement

```javascript
// Exemple du service DeckService
class DeckService {
  constructor() {
    this.decks = {}; // Cache des jeux chargés
    this.currentDeckId = null;
  }
  
  // Charge un jeu de cartes
  async loadDeck(deckId) {
    const deckInfo = cardSetConfigs[deckId];
    if (!deckInfo) {
      throw new Error(`Jeu ${deckId} non trouvé`);
    }

    // Charger les cartes majeures
    const majorCards = await this.fetchMajorCards(deckId);
    
    // Créer le jeu
    const deck = new Deck(deckId, majorCards);
    this.decks[deckId] = deck;
    this.currentDeckId = deckId;
    
    return deck;
  }
}
```

## Gestion des Jeux

### Jeux Disponibles
Les jeux sont définis dans `cardSetConfigs` avec les propriétés suivantes :
- `id` : Identifiant unique du jeu
- `name` : Nom du jeu
- `path` : Chemin vers les images
- `extension` : Extension des fichiers image
- `majorCount` : Nombre d'arcanes majeurs
- `minorCount` : Nombre d'arcanes mineurs
- `supportsMinor` : Si le jeu supporte les arcanes mineurs
- `cardNames` : Noms des fichiers image pour chaque carte

```javascript
// Exemple de configuration d'un jeu
export const cardSetConfigs = {
  set01: {
    id: 'set01',
    name: 'Tarot Marseille',
    path: 'assets/images/cards/marseille',
    extension: 'png',
    majorCount: 22,
    minorCount: 0,
    supportsMinor: false,
    cardNames: {
      0: 'Le_fou',
      1: 'Bateleur',
      // etc.
    }
  },
  // Autres jeux...
};
```

Les jeux actuellement implémentés sont :
- Tarot Marseille (set01)
- Tarot Thiago Lehmann (set02)
- Tarot Renaissance (set03)
- Tarot Rick & Morty (set04)

## Système de Tirage

### Processus de Tirage
1. Le jeu est chargé via `DeckService.loadDeck(deckId)`
2. Le jeu est mélangé automatiquement via `Deck.shuffle()`
3. Les cartes sont tirées via `Deck.drawCards(count, randomOrientation)`
4. Le dos de carte (M22) est automatiquement exclu des tirages
5. Chaque carte peut être tirée à l'endroit ou renversée si `randomOrientation` est activé

### Gestion du Dos de Carte
- Le dos de carte a l'ID spécial 'M22'
- Il est identifié par la méthode `isBack()` dans TarotCard
- Il n'apparaît pas dans les tirages (filtré dans `drawCard()`)
- Il est utilisé uniquement pour l'affichage visuel du dos des cartes

## Validation des Cartes

### Structure des Cartes
```javascript
{
  id: 'MXX',             // Format M00-M21 pour les arcanes majeurs
  translationKey: string, // Clé pour la traduction
  image: string,         // Chemin de l'image
  imageUrl: string,      // URL encodée de l'image
  arcana: string,        // Type d'arcane (major/minor)
  suit: string,          // Suite pour les arcanes mineurs (null pour majeurs)
  rank: string,          // Rang (null pour arcanes majeurs)
  orientation: string    // 'upright' ou 'reversed'
}
```

### Constantes et Types
```javascript
// Types d'arcanes
export const ARCANE_TYPES = {
  MAJOR: 'major',
  MINOR: 'minor'
};

// Suites pour les arcanes mineurs
export const MINOR_SUITS = {
  WANDS: 'wands',
  CUPS: 'cups',
  SWORDS: 'swords',
  PENTACLES: 'pentacles'
};
```

## Bonnes Pratiques

### Manipulation des Cartes
1. Toujours utiliser `DeckService` pour charger les jeux de cartes
2. Utiliser les méthodes de `Deck` pour tirer et manipuler les cartes
3. Ne pas modifier directement les propriétés des cartes, utiliser les méthodes fournies
4. Vérifier l'état des cartes via `isBack()`, `isMajor()` et `isMinor()`

### Chargement des Jeux
1. Vérifier si un jeu est déjà chargé avec `isDeckLoaded(deckId)` avant de le charger
2. Attendre que le chargement asynchrone soit terminé avec `await loadDeck(deckId)`
3. Gérer les erreurs de chargement d'images qui peuvent survenir

## Limitations Actuelles

### Arcanes Mineurs
- Actuellement non supportés dans l'implémentation
- La structure est en place via `MINOR_SUITS` et `MINOR_RANKS`
- La configuration est prête avec `minorCount` et `supportsMinor`

### Significations des Cartes
- Actuellement codées en dur dans `DeckService` via `getMajorUprightMeaning` et `getMajorReversedMeaning`
- Pourraient être externalisées dans des fichiers de traduction à l'avenir

## Évolution Future

### Fonctionnalités Planifiées
1. Support complet des arcanes mineurs
2. Système de sélection de cartes
3. Externalisation des significations des cartes dans le système de traduction
4. Support des images en mode sombre/clair

### Améliorations Techniques
1. Optimisation du chargement des images
2. Système de cache plus avancé
3. Préchargement des images pour une meilleure expérience utilisateur
4. Support complet du mode hors ligne 