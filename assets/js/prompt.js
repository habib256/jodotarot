/**
 * Fichier contenant les fonctions pour gérer les prompts système utilisés par l'application JodoTarot
 * Refactorisé pour utiliser le système de traductions
 */

import { getTranslation } from './translations/index.js';

/**
 * Fonction pour obtenir le META_PROMPT adapté à la langue sélectionnée
 * @param {string} langue - Code de la langue (fr, en, es, de, it, zh)
 * @returns {string} - Le META_PROMPT dans la langue appropriée
 */
function getMetaPrompt(langue = 'fr') {
  // Récupérer le prompt de base depuis le système de traductions
  return getTranslation('metaprompt.base', langue);
}

/**
 * Fonction pour obtenir le texte d'emphase dans la langue appropriée
 * @param {string} langue - Code de la langue (fr, en, es, de, it, zh)
 * @returns {string} - Le texte d'emphase dans la langue appropriée
 */
function getEmphasisText(langue = 'fr') {
  return getTranslation('metaprompt.emphasis', langue);
}

/**
 * Fonction pour enrichir le prompt système avec le contexte spécifique à la question
 * @param {string} question - La question posée par l'utilisateur
 * @param {string} systemPrompt - Le prompt système de base
 * @param {string} langue - La langue à utiliser (fr par défaut)
 * @returns {string} - Le prompt système enrichi avec la question
 */
function enrichirPromptContextuel(question, systemPrompt, langue = 'fr') {
  // Ajouter la question de l'utilisateur au prompt système
  if (!question || !question.trim()) {
    return systemPrompt;
  }
  
  // Obtenir la traduction de l'introduction à la question
  const questionIntro = getTranslation('interpretation.userQuestion', langue);
  
  // Sélectionner le texte d'emphase dans la langue appropriée
  const emphaseTexte = getEmphasisText(langue);
  
  // Former le bloc d'emphase avec les délimiteurs et la question
  // Vérifier si questionIntro se termine déjà par ":" ou "："
  const needsColon = !questionIntro.endsWith(':') && !questionIntro.endsWith('：');
  const questionBlock = `====================
${questionIntro}${needsColon ? ':' : ''}
"${question.trim()}"
====================`;
  
  // Vérifier si le prompt contient déjà ce bloc ou une partie significative
  if (systemPrompt.includes(questionBlock) || 
      (systemPrompt.includes(`"${question.trim()}"`) && 
       systemPrompt.includes("====================") && 
       systemPrompt.includes(emphaseTexte.substring(0, 50)))) {
    return systemPrompt;
  }
  
  return `
${questionBlock}

${emphaseTexte}

${systemPrompt}`;
}

export {
  getMetaPrompt,
  getEmphasisText,
  enrichirPromptContextuel
}; 