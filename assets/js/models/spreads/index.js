/**
 * Exporte tous les types de tirages disponibles dans l'application
 */

import CrossSpread from './CrossSpread.js';
import HorseshoeSpread from './HorseshoeSpread.js';
import LoveSpread from './LoveSpread.js';
import CelticCrossSpread from './CelticCrossSpread.js';

// Objet contenant tous les types de tirages indexés par leur clé
const SPREADS = {
  cross: CrossSpread,
  horseshoe: HorseshoeSpread,
  love: LoveSpread,
  celtic: CelticCrossSpread
};

/**
 * Crée une instance d'un type de tirage spécifique
 * @param {string} spreadType - Clé du type de tirage
 * @param {HTMLElement} container - Conteneur DOM pour le tirage (optionnel)
 * @param {string} langue - Code de langue (fr, en, etc.)
 * @returns {Object} - Instance du tirage
 */
function createSpread(spreadType, container = null, langue = 'fr') {
  // Vérifier si le type de tirage existe
  if (!SPREADS[spreadType]) {
    console.error(`Type de tirage non trouvé: ${spreadType}`);
    spreadType = 'cross'; // Utiliser le tirage en croix par défaut
  }
  
  // Créer une instance du type de tirage avec la langue spécifiée
  return new SPREADS[spreadType](container, langue);
}

/**
 * Obtient une description détaillée du type de tirage (sans cartes)
 * @param {string} spreadType - Clé du type de tirage
 * @param {string} langue - Code de langue (fr, en, etc.)
 * @returns {string} - Description du type de tirage
 */
function getSpreadDescription(spreadType, langue = 'fr') {
  // Créer une instance temporaire pour accéder aux descriptions
  const spread = createSpread(spreadType, null, langue);
  return spread.getDescription();
}

// Exporter les types de tirages et les fonctions utilitaires
export default SPREADS;
export { createSpread, getSpreadDescription }; 