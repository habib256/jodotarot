/**
 * Définitions des cartes de tarot
 * Centralise toutes les informations sur les cartes
 */

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
  constructor(id, name, image, arcana = ARCANE_TYPES.MAJOR, suit = null, rank = null) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.arcana = arcana;
    this.suit = suit;
    this.rank = rank;
    this.orientation = 'upright'; // Orientation par défaut
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
      return this.name;
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
      this.name,
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
  new TarotCard('M00', 'Le fou', 'assets/images/set01/00 Le fou.png'),
  new TarotCard('M01', 'Bateleur', 'assets/images/set01/01 Bateleur.png'),
  new TarotCard('M02', 'Papesse', 'assets/images/set01/02 Papesse.png'),
  new TarotCard('M03', 'Imperatrice', 'assets/images/set01/03 Imperatrice.png'),
  new TarotCard('M04', 'Empereur', 'assets/images/set01/04 Empereur.png'),
  new TarotCard('M05', 'Pape', 'assets/images/set01/05 Pape.png'),
  new TarotCard('M06', 'Les amoureux', 'assets/images/set01/06 Les amoureux.png'),
  new TarotCard('M07', 'Chariot', 'assets/images/set01/07 Chariot.png'),
  new TarotCard('M08', 'Justice', 'assets/images/set01/08 Justice.png'),
  new TarotCard('M09', 'Ermite', 'assets/images/set01/09 Ermite.png'),
  new TarotCard('M10', 'La roue', 'assets/images/set01/10 La roue.png'),
  new TarotCard('M11', 'Force', 'assets/images/set01/11 Force.png'),
  new TarotCard('M12', 'Le pendu', 'assets/images/set01/12 Le pendu.png'),
  new TarotCard('M13', 'La mort', 'assets/images/set01/13 La mort.png'),
  new TarotCard('M14', 'Temperance', 'assets/images/set01/14 Temperance.png'),
  new TarotCard('M15', 'Diable', 'assets/images/set01/15 Diable.png'),
  new TarotCard('M16', 'La Tour', 'assets/images/set01/16 La Tour.png'),
  new TarotCard('M17', 'Etoile', 'assets/images/set01/17 Etoile.png'),
  new TarotCard('M18', 'La lune', 'assets/images/set01/18 La lune.png'),
  new TarotCard('M19', 'Le soleil', 'assets/images/set01/19 Le soleil.png'),
  new TarotCard('M20', 'Le jugement', 'assets/images/set01/20 Le jugement.png'),
  new TarotCard('M21', 'Le monde', 'assets/images/set01/21 Le monde.png'),
  new TarotCard('M22', 'Dos de carte', 'assets/images/set01/22 Dos de carte.png')
];

/**
 * Informations sur les cartes du jeu Thiago Lehmann
 */
export const lehmannCards = [
  new TarotCard('M00', 'Le fou', 'assets/images/set02/00 Le fou.jpg'),
  new TarotCard('M01', 'Bateleur', 'assets/images/set02/01 Bateleur.jpg'),
  new TarotCard('M02', 'Papesse', 'assets/images/set02/02 Papesse.jpg'),
  new TarotCard('M03', 'Imperatrice', 'assets/images/set02/03 Imperatrice.jpg'),
  new TarotCard('M04', 'Empereur', 'assets/images/set02/04 Empereur.jpg'),
  new TarotCard('M05', 'Pape', 'assets/images/set02/05 Pape.jpg'),
  new TarotCard('M06', 'Les amoureux', 'assets/images/set02/06 Les amoureux.jpg'),
  new TarotCard('M07', 'Chariot', 'assets/images/set02/07 Chariot.jpg'),
  new TarotCard('M08', 'Justice', 'assets/images/set02/08 Justice.jpg'),
  new TarotCard('M09', 'Ermite', 'assets/images/set02/09 Ermite.jpg'),
  new TarotCard('M10', 'La roue', 'assets/images/set02/10 La roue.jpg'),
  new TarotCard('M11', 'Force', 'assets/images/set02/11 Force.jpg'),
  new TarotCard('M12', 'Le pendu', 'assets/images/set02/12 Le pendu.jpg'),
  new TarotCard('M13', 'La mort', 'assets/images/set02/13 La mort.jpg'),
  new TarotCard('M14', 'Temperance', 'assets/images/set02/14 Temperance.jpg'),
  new TarotCard('M15', 'Diable', 'assets/images/set02/15 Diable.jpg'),
  new TarotCard('M16', 'La Tour', 'assets/images/set02/16 La Tour.jpg'),
  new TarotCard('M17', 'Etoile', 'assets/images/set02/17 Etoile.jpg'),
  new TarotCard('M18', 'La lune', 'assets/images/set02/18 La lune.jpg'),
  new TarotCard('M19', 'Le soleil', 'assets/images/set02/19 Le soleil.jpg'),
  new TarotCard('M20', 'Le jugement', 'assets/images/set02/20 Le jugement.jpg'),
  new TarotCard('M21', 'Le monde', 'assets/images/set02/21 Le monde.jpg'),
  new TarotCard('M22', 'Dos de carte', 'assets/images/set02/22 Dos de carte.png')
];

/**
 * Informations sur les cartes du jeu Renaissance
 */
export const renaissanceCards = [
  new TarotCard('M00', 'Le fou', 'assets/images/cards/renaissance/Le fou.png'),
  new TarotCard('M01', 'Bateleur', 'assets/images/cards/renaissance/Bateleur.png'),
  new TarotCard('M02', 'Papesse', 'assets/images/cards/renaissance/Papesse.png'),
  new TarotCard('M03', 'Imperatrice', 'assets/images/cards/renaissance/Imperatrice.png'),
  new TarotCard('M04', 'Empereur', 'assets/images/cards/renaissance/Empereur.png'),
  new TarotCard('M05', 'Pape', 'assets/images/cards/renaissance/Pape.png'),
  new TarotCard('M06', 'Les amoureux', 'assets/images/cards/renaissance/Les amoureux.png'),
  new TarotCard('M07', 'Chariot', 'assets/images/cards/renaissance/Chariot.png'),
  new TarotCard('M08', 'Justice', 'assets/images/cards/renaissance/Justice.png'),
  new TarotCard('M09', 'Ermite', 'assets/images/cards/renaissance/Ermite.png'),
  new TarotCard('M10', 'La roue', 'assets/images/cards/renaissance/La roue.png'),
  new TarotCard('M11', 'Force', 'assets/images/cards/renaissance/Force.png'),
  new TarotCard('M12', 'Le pendu', 'assets/images/cards/renaissance/Le pendu.png'),
  new TarotCard('M13', 'La mort', 'assets/images/cards/renaissance/La mort.png'),
  new TarotCard('M14', 'Temperance', 'assets/images/cards/renaissance/Temperance.png'),
  new TarotCard('M15', 'Diable', 'assets/images/cards/renaissance/Diable.png'),
  new TarotCard('M16', 'La Tour', 'assets/images/cards/renaissance/La Tour.png'),
  new TarotCard('M17', 'Etoile', 'assets/images/cards/renaissance/Etoile.png'),
  new TarotCard('M18', 'La lune', 'assets/images/cards/renaissance/La lune.png'),
  new TarotCard('M19', 'Le soleil', 'assets/images/cards/renaissance/Le soleil.png'),
  new TarotCard('M20', 'Le jugement', 'assets/images/cards/renaissance/Le jugement.png'),
  new TarotCard('M21', 'Le monde', 'assets/images/cards/renaissance/Le monde.png'),
  new TarotCard('M22', 'Dos de carte', 'assets/images/cards/renaissance/Dos de carte.png')
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
    backCardIndex: 22 // Indice de la carte de dos dans le tableau
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