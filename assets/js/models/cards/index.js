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

  // Générateur d'ID unique pour les cartes
  static generateId(arcana, suit, rank) {
    if (arcana === ARCANE_TYPES.MAJOR) {
      return `M${rank.padStart(2, '0')}`; // M00 pour Le Fou, M21 pour Le Monde
    } else {
      return `${suit[0].toUpperCase()}${rank[0].toUpperCase()}`; // WK pour Roi de Bâtons
    }
  }

  // Générateur de nom de fichier standardisé
  static generateFileName(arcana, suit, rank, name) {
    if (arcana === ARCANE_TYPES.MAJOR) {
      return `${rank.padStart(2, '0')} ${name}`;
    } else {
      return `${rank} of ${suit}`;
    }
  }

  // Obtient le nom complet de la carte
  getFullName() {
    if (this.arcana === ARCANE_TYPES.MAJOR) {
      return getTranslation(`cards.major_arcana.${this.translationKey}`);
    } else {
      return `${this.rank} of ${this.suit}`;
    }
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
 * Génère les cartes pour un jeu spécifique
 * @param {string} setId - Identifiant du jeu
 * @returns {Array} Liste des cartes
 */
function generateCards(setId) {
  const config = cardSetConfigs[setId];
  if (!config) {
    throw new Error(`Jeu non trouvé: ${setId}`);
  }

  const cards = [];
  for (let i = 0; i <= config.majorCount; i++) {
    const cardName = config.cardNames[i];
    const fileName = `${String(i).padStart(2, '0')}_${cardName}.${config.extension}`;
    const imagePath = `${config.path}/${fileName}`;
    
    cards.push(new TarotCard(
      `M${String(i).padStart(2, '0')}`,
      cardName,
      imagePath
    ));
  }

  return cards;
}

/**
 * Informations sur les cartes du jeu Marseille
 */
export const marseilleCards = generateCards('set01');

/**
 * Informations sur les cartes du jeu Thiago Lehmann
 */
export const lehmannCards = generateCards('set02');

/**
 * Informations sur les cartes du jeu Renaissance
 */
export const renaissanceCards = generateCards('set03');

/**
 * Informations sur les cartes du jeu Rick&Morty
 */
export const rickAndMortyCards = generateCards('set04');

/**
 * Significations des arcanes majeurs à l'endroit
 */
export const majorUprightMeanings = {
  "00": "Liberté, spiritualité, potentiel inexploité",
  "01": "Habileté, dextérité, action, créativité",
  "02": "Intuition, sagesse intérieure, connaissance secrète",
  "03": "Abondance, féminité, créativité, nature",
  "04": "Autorité, structure, contrôle, leadership",
  "05": "Spiritualité, croyance, tradition, conformité",
  "06": "Amour, choix, attraction, équilibre",
  "07": "Détermination, contrôle, succès, action",
  "08": "Équité, vérité, loi, équilibre",
  "09": "Introspection, recherche, solitude, guidance",
  "10": "Chance, karma, destin, tournants de vie",
  "11": "Courage, persuasion, influence, énergie",
  "12": "Sacrifice, perspective, suspension, lâcher-prise",
  "13": "Transformation, transition, changement, libération",
  "14": "Modération, équilibre, patience, harmonie",
  "15": "Ombres, matérialisme, attachements, illusions",
  "16": "Bouleversement soudain, chaos, révélation, éveil",
  "17": "Espoir, inspiration, renouveau, spiritualité",
  "18": "Illusion, peurs, anxiété, confusion",
  "19": "Succès, joie, vitalité, confiance",
  "20": "Éveil, rénovation, jugement, absolution",
  "21": "Accomplissement, intégration, voyage, complétude"
};

/**
 * Significations des arcanes majeurs renversés
 */
export const majorReversedMeanings = {
  "00": "Errance, imprudence, risques insensés",
  "01": "Manque de confiance, talents inexploités, tromperie",
  "02": "Secrets cachés, savoir caché, besoin d'écouter son intuition",
  "03": "Dépendance, blocage créatif, problèmes domestiques",
  "04": "Domination, rigidité, inflexibilité, contrôle excessif",
  "05": "Rébellion, subversion, nouvelles méthodes, non-conventionalité",
  "06": "Déséquilibre, discorde, disharmonie, mauvais choix",
  "07": "Manque de direction, agression, échec, défaite",
  "08": "Injustice, malhonnêteté, manque d'objectivité",
  "09": "Isolement, repli sur soi, paranoïa, solitude excessive",
  "10": "Revers de fortune, bouleversements, résistance au changement",
  "11": "Doute de soi, faiblesse, manque de détermination",
  "12": "Résistance, stagnation, indécision, retard",
  "13": "Résistance au changement, stagnation, inévitabilité",
  "14": "Déséquilibre, excès, auto-restriction, désalignement",
  "15": "Libération, indépendance, affronter ses peurs",
  "16": "Éviter le désastre, retarder l'inévitable, résistance au changement",
  "17": "Désespoir, pessimisme, manque de foi, découragement",
  "18": "Confusion, peur, malentendus, méconnaissance",
  "19": "Blocage, dépression, malentendus, égocentrisme",
  "20": "Doute de soi, auto-critique, peur du changement",
  "21": "Incomplet, stagnation, manque d'accomplissement, voyage déséquilibré"
};

/**
 * Définition complète des jeux de cartes disponibles
 */
export const cardSets = {
  set01: {
    id: 'set01',
    name: 'Tarot Marseille',
    cards: marseilleCards,
    backCardIndex: 22
  },
  set02: {
    id: 'set02',
    name: 'Tarot Thiago Lehmann',
    cards: lehmannCards,
    backCardIndex: 22
  },
  set03: {
    id: 'set03',
    name: 'Tarot Renaissance',
    cards: renaissanceCards,
    backCardIndex: 22
  },
  set04: {
    id: 'set04',
    name: 'Tarot Rick & Morty',
    cards: rickAndMortyCards,
    backCardIndex: 22
  }
};

/**
 * Obtient une carte par son ID dans un jeu spécifié
 * @param {string} setId - Identifiant du jeu de cartes
 * @param {string} cardId - Identifiant de la carte
 * @return {Object|null} La carte trouvée ou null
 */
export function getCardById(setId, cardId) {
  if (!cardSets[setId]) return null;
  
  return cardSets[setId].cards.find(card => card.id === cardId) || null;
}

/**
 * Obtient la signification d'une carte majeure selon son orientation
 * @param {string} cardId - Identifiant de la carte
 * @param {string} orientation - Orientation de la carte (upright ou reversed)
 * @return {string} La signification de la carte
 */
export function getMajorCardMeaning(cardId, orientation = 'upright') {
  if (orientation === 'upright') {
    return majorUprightMeanings[cardId] || "Signification inconnue";
  } else {
    return majorReversedMeanings[cardId] || "Signification inconnue";
  }
}

/**
 * Obtient l'image de dos pour un jeu de cartes
 * @param {string} setId - Identifiant du jeu de cartes
 * @return {string} URL de l'image de dos
 */
export function getBackCardImage(setId) {
  if (!cardSets[setId]) return "";
  
  const backCardIndex = cardSets[setId].backCardIndex;
  return cardSets[setId].cards[backCardIndex].image;
} 