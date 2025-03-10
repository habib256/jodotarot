/**
 * Point d'entrée central pour le système de traductions
 * Ce fichier importe toutes les traductions des différentes langues
 * et exporte les fonctions nécessaires pour y accéder
 */

import fr from './fr.js';
import en from './en.js';
import es from './es.js';
import de from './de.js';
import it from './it.js';
import zh from './zh.js';

// Regroupement de toutes les traductions
export const TRANSLATIONS = {
  fr,
  en,
  es,
  de,
  it,
  zh
};

/**
 * Obtient une traduction dans la langue spécifiée
 * @param {string} key - Clé de traduction au format "section.sousCle"
 * @param {string} lang - Code de la langue (fr, en, es, de, it, zh)
 * @param {Object} params - Paramètres de remplacement (optionnel)
 * @returns {string} - Le texte traduit
 */
export function getTranslation(key, lang = 'fr', params = {}) {
  // Si la langue n'est pas supportée, utiliser le français par défaut
  if (!TRANSLATIONS[lang]) {
    lang = 'fr';
  }
  
  // Diviser la clé en sections (ex: "header.language" -> ["header", "language"])
  const keys = key.split('.');
  
  // Naviguer dans l'objet de traductions pour trouver la valeur
  let translation = TRANSLATIONS[lang];
  for (const k of keys) {
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      // Si la traduction n'existe pas dans la langue courante, essayer le français
      const frenchTranslation = getFrenchTranslation(key);
      return frenchTranslation !== undefined ? frenchTranslation : key;
    }
  }
  
  // Remplacer les paramètres {param} par leurs valeurs
  if (params && typeof translation === 'string') {
    return translation.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? params[paramName] : match;
    });
  }
  
  return translation;
}

/**
 * Fonction auxiliaire pour obtenir une traduction en français
 * @param {string} key - La clé de traduction
 * @returns {string|undefined} - La traduction ou undefined si non trouvée
 */
function getFrenchTranslation(key) {
  const keys = key.split('.');
  let translation = TRANSLATIONS['fr'];
  
  for (const k of keys) {
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      return undefined;
    }
  }
  
  return translation;
} 