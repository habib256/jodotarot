/**
 * Module de gestion du tirage en fer à cheval
 */

import { formatIntroduction, formatConclusion, formatCarte, enrichirContexteTirage } from './commun.js';

// Constantes
const TYPE_TIRAGE = 'horseshoe';
const NB_CARTES = 7;
const POSITIONS = ['horseshoe1', 'horseshoe2', 'horseshoe3', 'horseshoe4', 'horseshoe5', 'horseshoe6', 'horseshoe7'];

/**
 * Génère un prompt d'interprétation pour un tirage en fer à cheval
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} question - Question posée par l'utilisateur
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Prompt formaté pour l'IA
 */
function genererPrompt(cartes, question, lang = 'fr') {
  if (!cartes || cartes.length < NB_CARTES) {
    console.error("Le tirage en fer à cheval nécessite 7 cartes");
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
 * Interprète la signification spécifique du tirage en fer à cheval
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} lang - Langue pour les traductions
 * @returns {Object} - Objet contenant les significations spécifiques de chaque position
 */
function interpreterPositions(cartes, lang = 'fr') {
  if (!cartes || cartes.length < NB_CARTES) {
    return {};
  }
  
  return {
    passé: {
      position: 'horseshoe1',
      carte: cartes[0],
      description: "Représente le passé lointain ou les influences passées"
    },
    passéRécent: {
      position: 'horseshoe2',
      carte: cartes[1],
      description: "Représente le passé récent ou les événements qui viennent de se produire"
    },
    présent: {
      position: 'horseshoe3',
      carte: cartes[2],
      description: "Représente la situation actuelle ou l'état présent"
    },
    futurImmédiat: {
      position: 'horseshoe4',
      carte: cartes[3],
      description: "Représente le futur immédiat ou ce qui va se passer bientôt"
    },
    futurLointain: {
      position: 'horseshoe5',
      carte: cartes[4],
      description: "Représente le futur à plus long terme"
    },
    facteurs: {
      position: 'horseshoe6',
      carte: cartes[5],
      description: "Représente les facteurs extérieurs qui influencent la situation"
    },
    résultat: {
      position: 'horseshoe7',
      carte: cartes[6],
      description: "Représente le résultat final ou la conclusion de la situation"
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