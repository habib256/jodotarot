/**
 * Module contenant les fonctions communes pour tous les types de tirages
 */

import { getTranslation } from '../translations.js';
import { EMPHASIS_TEXTS, getEmphasisText, enrichirPromptContextuel } from '../metaprompt.js';

/**
 * Fonction pour formater la section d'introduction d'un tirage
 * @param {string} spreadType - Type de tirage (cross, horseshoe, etc.)
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Introduction formatée
 */
function formatIntroduction(spreadType, lang = 'fr') {
  return "\n" + getTranslation(`tarotReading.intro.${spreadType}`, lang) + "\n";
}

/**
 * Fonction pour formater la conclusion d'un tirage
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Conclusion formatée
 */
function formatConclusion(lang = 'fr') {
  return "\n" + getTranslation('tarotReading.conclusion', lang);
}

/**
 * Fonction pour formater une carte dans un prompt de tirage
 * @param {Object} carte - Objet carte avec name et image
 * @param {string} positionKey - Clé de la position pour les traductions
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Description formatée de la carte
 */
function formatCarte(carte, positionKey, lang = 'fr') {
  const position = getTranslation(`tarotReading.positions.${positionKey}`, lang);
  const instruction = getTranslation(`tarotReading.instructions.${positionKey}`, lang);
  
  return `- "${carte.name}" : ${position}. ${instruction}\n`;
}

/**
 * Fonction pour enrichir le contexte d'un tirage avec la question
 * @param {string} question - Question posée par l'utilisateur
 * @param {string} promptTirage - Prompt du tirage
 * @param {string} lang - Langue pour les traductions
 * @returns {string} - Prompt enrichi avec la question
 */
function enrichirContexteTirage(question, promptTirage, lang = 'fr') {
  // Utiliser la fonction mutualisée depuis metaprompt.js
  return enrichirPromptContextuel(question, promptTirage, lang);
}

// Exporter les fonctions communes
export {
  formatIntroduction,
  formatConclusion,
  formatCarte,
  enrichirContexteTirage
}; 