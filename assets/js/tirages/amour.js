/**
 * Module de gestion du tirage "Tarot de l'amour"
 */

import { formatIntroduction, formatConclusion, formatCarte, enrichirContexteTirage } from './commun.js';

// Constantes
const TYPE_TIRAGE = 'love';
const NB_CARTES = 7;
const POSITIONS = ['center', 'bottomLeft', 'bottomRight', 'top', 'left', 'right', 'bottom'];

/**
 * Génère un prompt d'interprétation pour un tirage "Tarot de l'amour"
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} question - Question posée par l'utilisateur
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Prompt formaté pour l'IA
 */
function genererPrompt(cartes, question, lang = 'fr') {
  if (!cartes || cartes.length < NB_CARTES) {
    console.error("Le tirage du Tarot de l'amour nécessite 7 cartes");
    return "";
  }
  
  // Commencer par l'introduction
  let promptTirage = formatIntroduction(TYPE_TIRAGE, lang);
  
  // Ajouter chaque carte avec sa position et son interprétation
  cartes.forEach((carte, index) => {
    if (index < POSITIONS.length) {
      promptTirage += formatCarte(carte, POSITIONS[index], lang);
    }
  });
  
  // Ajouter la conclusion
  promptTirage += formatConclusion(lang);
  
  // Enrichir avec la question
  return enrichirContexteTirage(question, promptTirage, lang);
}

/**
 * Interprète la signification spécifique du tirage "Tarot de l'amour"
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} lang - Langue pour les traductions
 * @returns {Object} - Objet contenant les significations spécifiques de chaque position
 */
function interpreterPositions(cartes, lang = 'fr') {
  if (!cartes || cartes.length < NB_CARTES) {
    return {};
  }
  
  return {
    desirs: {
      position: 'center',
      carte: cartes[0],
      description: "Représente vos désirs"
    },
    sentiments: {
      position: 'bottomLeft',
      carte: cartes[1],
      description: "Représente vos sentiments"
    },
    avenirProche: {
      position: 'bottomRight',
      carte: cartes[2],
      description: "Représente votre avenir proche"
    },
    perception: {
      position: 'top',
      carte: cartes[3],
      description: "Représente votre perception de la situation"
    },
    pour: {
      position: 'left',
      carte: cartes[4],
      description: "Représente le \"pour\" dans la réalisation de vos désirs"
    },
    amoureux: {
      position: 'right',
      carte: cartes[5],
      description: "Décrit votre amoureux actuel ou à venir"
    },
    actions: {
      position: 'bottom',
      carte: cartes[6],
      description: "Représente les actions que vous allez ou devriez poser dans votre vie sentimentale"
    }
  };
}

// Exporter les fonctions
export {
  TYPE_TIRAGE,
  NB_CARTES,
  POSITIONS,
  genererPrompt,
  interpreterPositions
}; 