/**
 * Définitions des cartes de tarot
 * Centralise toutes les informations sur les cartes
 */

import { getTranslation } from '../../translations/index.js';

// Constantes pour les types d'arcanes
export const ARCANE_TYPES = {
  MAJOR: 'major',
  MINOR: 'minor'
};

// Constantes pour les suites des arcanes mineurs
export const MINOR_SUITS = {
  WANDS: 'wands',
  CUPS: 'cups',
  SWORDS: 'swords',
  PENTACLES: 'pentacles'
};

/**
 * Clés de traduction des arcanes majeurs, indexées par leur numéro (0 à 21).
 * Les noms de fichiers (`La_lune`, ...) servent d'identifiants d'image et de
 * clés de signification, alors que l'affichage passe par ces clés traduites.
 */
export const MAJOR_ARCANA_TRANSLATION_KEYS = [
  'fool', 'magician', 'high_priestess', 'empress', 'emperor', 'hierophant',
  'lovers', 'chariot', 'justice', 'hermit', 'wheel_of_fortune', 'strength',
  'hanged_man', 'death', 'temperance', 'devil', 'tower', 'star',
  'moon', 'sun', 'judgement', 'world'
];

// Constantes pour les rangs des arcanes mineurs
export const MINOR_RANKS = {
  ACE: 'ace',
  TWO: 'two',
  THREE: 'three',
  FOUR: 'four',
  FIVE: 'five',
  SIX: 'six',
  SEVEN: 'seven',
  EIGHT: 'eight',
  NINE: 'nine',
  TEN: 'ten',
  PAGE: 'page',
  KNIGHT: 'knight',
  QUEEN: 'queen',
  KING: 'king'
};

/**
 * Classe pour représenter une carte de tarot
 */
export class TarotCard {
  constructor(id, translationKey, image, arcana = ARCANE_TYPES.MAJOR, suit = null, rank = null) {
    this.id = id;
    this.translationKey = translationKey;
    this.name = translationKey; // Alias pour faciliter l'accès au nom de la carte
    this.image = image;
    this.arcana = arcana;
    this.suit = suit;
    this.rank = rank;
    this.orientation = 'upright'; // Orientation par défaut
    this.imageUrl = this.encodeImageUrl(image);
  }

  // Encode l'URL de l'image pour gérer les espaces et caractères spéciaux
  encodeImageUrl(url) {
    if (!url || typeof url !== 'string') return url;
    // Encoder chaque segment du chemin (gère aussi les dossiers comme "rick&morty")
    return url
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
  }

  // Obtient le nom traduit de la carte dans la langue spécifiée
  getTranslatedName(language = 'fr') {
    if (this.arcana !== ARCANE_TYPES.MAJOR) {
      return `${this.rank} of ${this.suit}`;
    }

    // L'identifiant est de la forme M00..M21: en déduire la clé de traduction
    const key = MAJOR_ARCANA_TRANSLATION_KEYS[Number(this.id.slice(1))];
    return key ? getTranslation(`cards.major_arcana.${key}`, language) : this.translationKey;
  }

  // Vérifie si c'est une carte majeure
  isMajor() {
    return this.arcana === ARCANE_TYPES.MAJOR;
  }

  // Vérifie si c'est une carte mineure
  isMinor() {
    return this.arcana === ARCANE_TYPES.MINOR;
  }

  // Vérifie si c'est le dos de carte
  isBack() {
    return this.id === 'M22';
  }

  // Clone la carte
  clone() {
    const clonedCard = new TarotCard(
      this.id,
      this.translationKey,
      this.image,
      this.arcana,
      this.suit,
      this.rank
    );
    
    // Copier les attributs supplémentaires
    clonedCard.orientation = this.orientation;
    clonedCard.imageUrl = this.imageUrl || this.image;
    
    return clonedCard;
  }
}

/**
 * Configuration unifiée des jeux de cartes
 */
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
      2: 'Papesse',
      3: 'Imperatrice',
      4: 'Empereur',
      5: 'Pape',
      6: 'Les_amoureux',
      7: 'Chariot',
      8: 'Justice',
      9: 'Ermite',
      10: 'La_roue',
      11: 'Force',
      12: 'Le_pendu',
      13: 'La_mort',
      14: 'Temperance',
      15: 'Diable',
      16: 'La_Tour',
      17: 'Etoile',
      18: 'La_lune',
      19: 'Le_soleil',
      20: 'Le_jugement',
      21: 'Le_monde',
      22: 'Dos_de_carte'
    }
  },
  set02: {
    id: 'set02',
    name: 'Tarot Thiago Lehmann',
    path: 'assets/images/cards/lehmann',
    extension: 'jpg',
    majorCount: 22,
    minorCount: 0,
    supportsMinor: false,
    cardNames: {
      0: 'Le_fou',
      1: 'Bateleur',
      2: 'Papesse',
      3: 'Imperatrice',
      4: 'Empereur',
      5: 'Pape',
      6: 'Les_amoureux',
      7: 'Chariot',
      8: 'Justice',
      9: 'Ermite',
      10: 'La_roue',
      11: 'Force',
      12: 'Le_pendu',
      13: 'La_mort',
      14: 'Temperance',
      15: 'Diable',
      16: 'La_Tour',
      17: 'Etoile',
      18: 'La_lune',
      19: 'Le_soleil',
      20: 'Le_jugement',
      21: 'Le_monde',
      22: 'Dos_de_carte'
    }
  },
  set03: {
    id: 'set03',
    name: 'Tarot Renaissance',
    path: 'assets/images/cards/renaissance',
    extension: 'png',
    majorCount: 22,
    minorCount: 0,
    supportsMinor: false,
    cardNames: {
      0: 'Le_fou',
      1: 'Bateleur',
      2: 'Papesse',
      3: 'Imperatrice',
      4: 'Empereur',
      5: 'Pape',
      6: 'Les_amoureux',
      7: 'Chariot',
      8: 'Justice',
      9: 'Ermite',
      10: 'La_roue',
      11: 'Force',
      12: 'Le_pendu',
      13: 'La_mort',
      14: 'Temperance',
      15: 'Diable',
      16: 'La_Tour',
      17: 'Etoile',
      18: 'La_lune',
      19: 'Le_soleil',
      20: 'Le_jugement',
      21: 'Le_monde',
      22: 'Dos_de_carte'
    }
  },
  set04: {
    id: 'set04',
    name: 'Tarot Rick & Morty',
    path: 'assets/images/cards/rick&morty',
    extension: 'png',
    majorCount: 22,
    minorCount: 0,
    supportsMinor: false,
    cardNames: {
      0: 'Le_fou',
      1: 'Bateleur',
      2: 'Papesse',
      3: 'Imperatrice',
      4: 'Empereur',
      5: 'Pape',
      6: 'Les_amoureux',
      7: 'Chariot',
      8: 'Justice',
      9: 'Ermite',
      10: 'La_roue',
      11: 'Force',
      12: 'Le_pendu',
      13: 'La_mort',
      14: 'Temperance',
      15: 'Diable',
      16: 'La_Tour',
      17: 'Etoile',
      18: 'La_lune',
      19: 'Le_soleil',
      20: 'Le_jugement',
      21: 'Le_monde',
      22: 'Dos_de_carte'
    }
  }
};

/**
 * Génère les cartes majeures d'un jeu de cartes
 * @param {string} setId - Identifiant du jeu
 * @returns {TarotCard[]} Liste des cartes majeures
 */
export function generateCards(setId) {
  const config = cardSetConfigs[setId];
  if (!config) {
    throw new Error(`Jeu non trouvé: ${setId}`);
  }

  const cards = [];
  for (let i = 0; i < config.majorCount; i++) {
    const cardName = config.cardNames[i];
    const fileName = `${String(i).padStart(2, '0')}_${cardName}.${config.extension}`;

    cards.push(new TarotCard(
      `M${String(i).padStart(2, '0')}`,
      cardName,
      `${config.path}/${fileName}`
    ));
  }

  return cards;
}
