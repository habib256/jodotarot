/**
 * Point d'entrée pour tous les modules de tirage
 * Facilite l'importation des différents modules de tirage
 */

import * as Croix from './croix.js';
import * as FerACheval from './feracheval.js';
import * as Amour from './amour.js';

// Objet mappage des types de tirage vers leurs modules
const TIRAGES = {
  'cross': Croix,
  'horseshoe': FerACheval,
  'love': Amour
};

/**
 * Fonction générique pour générer un prompt d'interprétation en fonction du type de tirage
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} question - Question posée par l'utilisateur
 * @param {string} typeTirage - Type de tirage (cross, horseshoe)
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Prompt formaté pour l'IA
 */
function genererPromptTirage(cartes, question, typeTirage = 'cross', lang = 'fr') {
  // Vérifier si le type de tirage est supporté
  if (!TIRAGES[typeTirage]) {
    console.error(`Type de tirage non supporté: ${typeTirage}`);
    return "";
  }
  
  // Appeler la fonction du module correspondant
  return TIRAGES[typeTirage].genererPrompt(cartes, question, lang);
}

/**
 * Récupère le nombre de cartes requis pour un type de tirage
 * @param {string} typeTirage - Type de tirage (cross, horseshoe)
 * @returns {number} - Nombre de cartes requis
 */
function getNombreCartes(typeTirage = 'cross') {
  if (!TIRAGES[typeTirage]) {
    console.error(`Type de tirage non supporté: ${typeTirage}`);
    return 0;
  }
  
  return TIRAGES[typeTirage].NB_CARTES;
}

/**
 * Récupère les positions pour un type de tirage
 * @param {string} typeTirage - Type de tirage (cross, horseshoe)
 * @returns {Array} - Tableau des positions
 */
function getPositions(typeTirage = 'cross') {
  if (!TIRAGES[typeTirage]) {
    console.error(`Type de tirage non supporté: ${typeTirage}`);
    return [];
  }
  
  return TIRAGES[typeTirage].POSITIONS;
}

/**
 * Interprète les positions spécifiques à un type de tirage
 * @param {Array} cartes - Tableau des cartes tirées
 * @param {string} typeTirage - Type de tirage (cross, horseshoe)
 * @param {string} lang - Langue pour les traductions
 * @returns {Object} - Objet contenant les interprétations des positions
 */
function interpreterPositions(cartes, typeTirage = 'cross', lang = 'fr') {
  if (!TIRAGES[typeTirage]) {
    console.error(`Type de tirage non supporté: ${typeTirage}`);
    return {};
  }
  
  return TIRAGES[typeTirage].interpreterPositions(cartes, lang);
}

// Exporter les fonctions et modules
export {
  TIRAGES,
  genererPromptTirage,
  getNombreCartes,
  getPositions,
  interpreterPositions,
  Croix,
  FerACheval,
  Amour
}; 