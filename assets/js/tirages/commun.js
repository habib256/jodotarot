/**
 * Module contenant les fonctions communes pour tous les types de tirages
 */

import { getTranslation } from '../translations.js';

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
  if (!question || !question.trim()) {
    return promptTirage;
  }
  
  // Obtenir la traduction de l'introduction à la question
  const questionIntro = getTranslation('interpretation.userQuestion', lang);
  
  // Texte d'emphase selon la langue
  const emphaseTextes = {
    fr: `IMPORTANT: Ta réponse doit être DIRECTEMENT et SPÉCIFIQUEMENT liée à cette question.
Concentre-toi sur ce que la question demande précisément et adapte ton interprétation 
en fonction des éléments mentionnés dans la question. Ne donne pas une réponse générique.
Chaque aspect de ton interprétation doit répondre à un aspect de cette question.`,
    
    en: `IMPORTANT: Your answer must be DIRECTLY and SPECIFICALLY related to this question.
Focus on what the question precisely asks and adapt your interpretation
based on the elements mentioned in the question. Do not give a generic answer.
Each aspect of your interpretation must address an aspect of this question.`,
    
    es: `IMPORTANTE: Tu respuesta debe estar DIRECTA y ESPECÍFICAMENTE relacionada con esta pregunta.
Concéntrate en lo que la pregunta pide con precisión y adapta tu interpretación
según los elementos mencionados en la pregunta. No des una respuesta genérica.
Cada aspecto de tu interpretación debe responder a un aspecto de esta pregunta.`,
    
    de: `WICHTIG: Deine Antwort muss DIREKT und SPEZIFISCH mit dieser Frage zusammenhängen.
Konzentriere dich darauf, was die Frage genau fragt, und passe deine Interpretation
an die in der Frage genannten Elemente an. Gib keine allgemeine Antwort.
Jeder Aspekt deiner Interpretation muss auf einen Aspekt dieser Frage eingehen.`,
    
    it: `IMPORTANTE: La tua risposta deve essere DIRETTAMENTE e SPECIFICAMENTE legata a questa domanda.
Concentrati su ciò che la domanda chiede precisamente e adatta la tua interpretazione
in base agli elementi menzionati nella domanda. Non dare una risposta generica.
Ogni aspetto della tua interpretazione deve rispondere a un aspetto di questa domanda.`
  };
  
  // Sélectionner le texte d'emphase dans la langue appropriée
  const emphaseTexte = emphaseTextes[lang] || emphaseTextes.fr;
  
  // Former le bloc d'emphase avec les délimiteurs et la question
  const questionBlock = `====================
${questionIntro}:
"${question.trim()}"
====================`;
  
  // Vérifier si le prompt contient déjà ce bloc ou une partie significative
  if (promptTirage.includes(questionBlock) || 
      promptTirage.includes(`"${question.trim()}"`) && 
      promptTirage.includes("====================") && 
      promptTirage.includes(emphaseTexte.substring(0, 50))) {
    return promptTirage;
  }
  
  // Former le texte complet
  const enrichissement = `

${questionBlock}

${emphaseTexte}

${promptTirage}`;
  
  return enrichissement;
}

// Exporter les fonctions communes
export {
  formatIntroduction,
  formatConclusion,
  formatCarte,
  enrichirContexteTirage
}; 