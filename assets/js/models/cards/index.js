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
    this.image = image;
    this.arcana = arcana;
    this.suit = suit;
    this.rank = rank;
    this.orientation = 'upright'; // Orientation par défaut
    this.imageUrl = this.encodeImageUrl(image);
  }

  // Encode l'URL de l'image pour gérer les espaces et caractères spéciaux
  encodeImageUrl(url) {
    // Sépare le chemin de base du nom de fichier
    const lastSlashIndex = url.lastIndexOf('/');
    const basePath = url.substring(0, lastSlashIndex + 1);
    const fileName = url.substring(lastSlashIndex + 1);
    
    // Encode uniquement le nom du fichier
    return basePath + encodeURIComponent(fileName);
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
 * Informations sur les cartes du jeu Marseille
 */
export const marseilleCards = [
  new TarotCard('M00', 'fool', 'assets/images/cards/marseille/00_Le_fou.png'),
  new TarotCard('M01', 'magician', 'assets/images/cards/marseille/01_Bateleur.png'),
  new TarotCard('M02', 'high_priestess', 'assets/images/cards/marseille/02_Papesse.png'),
  new TarotCard('M03', 'empress', 'assets/images/cards/marseille/03_Imperatrice.png'),
  new TarotCard('M04', 'emperor', 'assets/images/cards/marseille/04_Empereur.png'),
  new TarotCard('M05', 'hierophant', 'assets/images/cards/marseille/05_Pape.png'),
  new TarotCard('M06', 'lovers', 'assets/images/cards/marseille/06_Les_amoureux.png'),
  new TarotCard('M07', 'chariot', 'assets/images/cards/marseille/07_Chariot.png'),
  new TarotCard('M08', 'justice', 'assets/images/cards/marseille/08_Justice.png'),
  new TarotCard('M09', 'hermit', 'assets/images/cards/marseille/09_Ermite.png'),
  new TarotCard('M10', 'wheel_of_fortune', 'assets/images/cards/marseille/10_La_roue.png'),
  new TarotCard('M11', 'strength', 'assets/images/cards/marseille/11_Force.png'),
  new TarotCard('M12', 'hanged_man', 'assets/images/cards/marseille/12_Le_pendu.png'),
  new TarotCard('M13', 'death', 'assets/images/cards/marseille/13_La_mort.png'),
  new TarotCard('M14', 'temperance', 'assets/images/cards/marseille/14_Temperance.png'),
  new TarotCard('M15', 'devil', 'assets/images/cards/marseille/15_Diable.png'),
  new TarotCard('M16', 'tower', 'assets/images/cards/marseille/16_La_Tour.png'),
  new TarotCard('M17', 'star', 'assets/images/cards/marseille/17_Etoile.png'),
  new TarotCard('M18', 'moon', 'assets/images/cards/marseille/18_La_lune.png'),
  new TarotCard('M19', 'sun', 'assets/images/cards/marseille/19_Le_soleil.png'),
  new TarotCard('M20', 'judgement', 'assets/images/cards/marseille/20_Le_jugement.png'),
  new TarotCard('M21', 'world', 'assets/images/cards/marseille/21_Le_monde.png'),
  new TarotCard('M22', 'back', 'assets/images/cards/marseille/22_Dos_de_carte.png')
];

/**
 * Informations sur les cartes du jeu Thiago Lehmann
 */
export const lehmannCards = [
  new TarotCard('M00', 'Le Fou', 'assets/images/cards/lehmann/00_Le_fou.jpg'),
  new TarotCard('M01', 'Le Bateleur', 'assets/images/cards/lehmann/01_Bateleur.jpg'),
  new TarotCard('M02', 'La Papesse', 'assets/images/cards/lehmann/02_Papesse.jpg'),
  new TarotCard('M03', 'L\'Impératrice', 'assets/images/cards/lehmann/03_Imperatrice.jpg'),
  new TarotCard('M04', 'L\'Empereur', 'assets/images/cards/lehmann/04_Empereur.jpg'),
  new TarotCard('M05', 'Le Pape', 'assets/images/cards/lehmann/05_Pape.jpg'),
  new TarotCard('M06', 'Les Amoureux', 'assets/images/cards/lehmann/06_Les_amoureux.jpg'),
  new TarotCard('M07', 'Le Chariot', 'assets/images/cards/lehmann/07_Chariot.jpg'),
  new TarotCard('M08', 'La Justice', 'assets/images/cards/lehmann/08_Justice.jpg'),
  new TarotCard('M09', 'L\'Ermite', 'assets/images/cards/lehmann/09_Ermite.jpg'),
  new TarotCard('M10', 'La Roue de Fortune', 'assets/images/cards/lehmann/10_La_roue.jpg'),
  new TarotCard('M11', 'La Force', 'assets/images/cards/lehmann/11_Force.jpg'),
  new TarotCard('M12', 'Le Pendu', 'assets/images/cards/lehmann/12_Le_pendu.jpg'),
  new TarotCard('M13', 'La Mort', 'assets/images/cards/lehmann/13_La_mort.jpg'),
  new TarotCard('M14', 'La Tempérance', 'assets/images/cards/lehmann/14_Temperance.jpg'),
  new TarotCard('M15', 'Le Diable', 'assets/images/cards/lehmann/15_Diable.jpg'),
  new TarotCard('M16', 'La Tour', 'assets/images/cards/lehmann/16_La_Tour.jpg'),
  new TarotCard('M17', 'L\'Étoile', 'assets/images/cards/lehmann/17_Etoile.jpg'),
  new TarotCard('M18', 'La Lune', 'assets/images/cards/lehmann/18_La_lune.jpg'),
  new TarotCard('M19', 'Le Soleil', 'assets/images/cards/lehmann/19_Le_soleil.jpg'),
  new TarotCard('M20', 'Le Jugement', 'assets/images/cards/lehmann/20_Le_jugement.jpg'),
  new TarotCard('M21', 'Le Monde', 'assets/images/cards/lehmann/21_Le_monde.jpg'),
  new TarotCard('M22', 'Dos de carte', 'assets/images/cards/lehmann/22_Dos_de_carte.jpg')
];

/**
 * Informations sur les cartes du jeu Renaissance
 */
export const renaissanceCards = [
  new TarotCard('M00', 'Le Fou', 'assets/images/cards/renaissance/00_Le_fou.png'),
  new TarotCard('M01', 'Le Bateleur', 'assets/images/cards/renaissance/01_Bateleur.png'),
  new TarotCard('M02', 'La Papesse', 'assets/images/cards/renaissance/02_Papesse.png'),
  new TarotCard('M03', 'L\'Impératrice', 'assets/images/cards/renaissance/03_Imperatrice.png'),
  new TarotCard('M04', 'L\'Empereur', 'assets/images/cards/renaissance/04_Empereur.png'),
  new TarotCard('M05', 'Le Pape', 'assets/images/cards/renaissance/05_Pape.png'),
  new TarotCard('M06', 'Les Amoureux', 'assets/images/cards/renaissance/06_Les_amoureux.png'),
  new TarotCard('M07', 'Le Chariot', 'assets/images/cards/renaissance/07_Chariot.png'),
  new TarotCard('M08', 'La Justice', 'assets/images/cards/renaissance/08_Justice.png'),
  new TarotCard('M09', 'L\'Ermite', 'assets/images/cards/renaissance/09_Ermite.png'),
  new TarotCard('M10', 'La Roue de Fortune', 'assets/images/cards/renaissance/10_La_roue.png'),
  new TarotCard('M11', 'La Force', 'assets/images/cards/renaissance/11_Force.png'),
  new TarotCard('M12', 'Le Pendu', 'assets/images/cards/renaissance/12_Le_pendu.png'),
  new TarotCard('M13', 'La Mort', 'assets/images/cards/renaissance/13_La_mort.png'),
  new TarotCard('M14', 'La Tempérance', 'assets/images/cards/renaissance/14_Temperance.png'),
  new TarotCard('M15', 'Le Diable', 'assets/images/cards/renaissance/15_Diable.png'),
  new TarotCard('M16', 'La Tour', 'assets/images/cards/renaissance/16_La_Tour.png'),
  new TarotCard('M17', 'L\'Étoile', 'assets/images/cards/renaissance/17_Etoile.png'),
  new TarotCard('M18', 'La Lune', 'assets/images/cards/renaissance/18_La_lune.png'),
  new TarotCard('M19', 'Le Soleil', 'assets/images/cards/renaissance/19_Le_soleil.png'),
  new TarotCard('M20', 'Le Jugement', 'assets/images/cards/renaissance/20_Le_jugement.png'),
  new TarotCard('M21', 'Le Monde', 'assets/images/cards/renaissance/21_Le_monde.png'),
  new TarotCard('M22', 'Dos de carte', 'assets/images/cards/renaissance/22_Dos_de_carte.png')
];

/**
 * Informations sur les cartes du jeu Rick&Morty
 */
export const rickAndMortyCards = [
  new TarotCard('M00', 'Le Fou', 'assets/images/cards/rick&morty/00_Le_fou.png'),
  new TarotCard('M01', 'Le Bateleur', 'assets/images/cards/rick&morty/01_Bateleur.png'),
  new TarotCard('M02', 'La Papesse', 'assets/images/cards/rick&morty/02_Papesse.png'),
  new TarotCard('M03', 'L\'Impératrice', 'assets/images/cards/rick&morty/03_Imperatrice.png'),
  new TarotCard('M04', 'L\'Empereur', 'assets/images/cards/rick&morty/04_Empereur.png'),
  new TarotCard('M05', 'Le Pape', 'assets/images/cards/rick&morty/05_Pape.png'),
  new TarotCard('M06', 'Les Amoureux', 'assets/images/cards/rick&morty/06_Les_amoureux.png'),
  new TarotCard('M07', 'Le Chariot', 'assets/images/cards/rick&morty/07_Chariot.png'),
  new TarotCard('M08', 'La Justice', 'assets/images/cards/rick&morty/08_Justice.png'),
  new TarotCard('M09', 'L\'Ermite', 'assets/images/cards/rick&morty/09_Ermite.png'),
  new TarotCard('M10', 'La Roue de Fortune', 'assets/images/cards/rick&morty/10_La_roue.png'),
  new TarotCard('M11', 'La Force', 'assets/images/cards/rick&morty/11_Force.png'),
  new TarotCard('M12', 'Le Pendu', 'assets/images/cards/rick&morty/12_Le_pendu.png'),
  new TarotCard('M13', 'La Mort', 'assets/images/cards/rick&morty/13_La_mort.png'),
  new TarotCard('M14', 'La Tempérance', 'assets/images/cards/rick&morty/14_Temperance.png'),
  new TarotCard('M15', 'Le Diable', 'assets/images/cards/rick&morty/15_Diable.png'),
  new TarotCard('M16', 'La Tour', 'assets/images/cards/rick&morty/16_La_Tour.png')
];

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
    backCardIndex: null // Pas encore de dos de carte
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