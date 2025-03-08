/**
 * Module de gestion du tirage en croix
 */

import { formatIntroduction, formatConclusion, formatCarte, enrichirContexteTirage } from './commun.js';

// Constantes
const TYPE_TIRAGE = 'cross';
const NB_CARTES = 5;
const POSITIONS = ['top', 'left', 'center', 'right', 'bottom'];

/**
 * Génère un prompt d'interprétation pour un tirage en croix
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} question - Question posée par l'utilisateur
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Prompt formaté pour l'IA
 */
function genererPrompt(cartes, question, lang = 'fr') {
  if (!cartes || cartes.length < NB_CARTES) {
    console.error("Le tirage en croix nécessite 5 cartes");
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
 * Interprète la signification spécifique du tirage en croix
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} lang - Langue pour les traductions
 * @returns {Object} - Objet contenant les significations spécifiques de chaque position
 */
function interpreterPositions(cartes, lang = 'fr') {
  if (!cartes || cartes.length < NB_CARTES) {
    return {};
  }
  
  return {
    situation: {
      position: 'center',
      carte: cartes[2],
      description: "Représente la situation actuelle ou le problème central"
    },
    influence: {
      position: 'top',
      carte: cartes[0],
      description: "Représente les influences qui affectent la situation"
    },
    passé: {
      position: 'left',
      carte: cartes[1],
      description: "Représente le passé ou les événements récents qui ont conduit à la situation actuelle"
    },
    futur: {
      position: 'right',
      carte: cartes[3],
      description: "Représente le futur ou la direction vers laquelle la situation évolue"
    },
    resultat: {
      position: 'bottom',
      carte: cartes[4],
      description: "Représente le résultat potentiel ou le conseil final"
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