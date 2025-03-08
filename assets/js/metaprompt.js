/**
 * Fichier contenant tous les prompts système utilisés par l'application JodoTarot
 */

import { getTranslation } from './translations.js';

// Meta prompt de base pour formater les réponses
const META_PROMPT_BASE = {
  fr: `Format obligatoire (400-450 mots):
1) Réponse concise et complète en un message
2) Utilise des émojis pertinents pour illustrer les concepts de tarot
3) Formatage HTML uniquement: <h2>/<h3> titres, <em>/<strong> importance, <blockquote> citations, <ul>/<li> listes
4) Intègre l'aspect psychologique et symbolique des cartes
5) Fais des connexions entre les cartes qui se complètent ou s'opposent
6) Évite le jargon trop ésotérique pour rester accessible
7) Termine par un conseil pratique et une suggestion d'action
8) Pas de Markdown ni de titres en texte brut. Pas de titres dans ce type de formatage : ** **
9) En français`,

  en: `Required format (400-450 words):
1) Concise and complete response in one message
2) Use relevant tarot-themed emojis to illustrate concepts
3) HTML formatting only: <h2>/<h3> headings, <em>/<strong> importance, <blockquote> quotes, <ul>/<li> lists
4) Incorporate psychological and symbolic aspects of the cards
5) Make connections between cards that complement or oppose each other
6) Avoid overly esoteric jargon to remain accessible
7) End with practical advice and a suggested action
8) No Markdown or plain text headings. No titles in this formatting style: ** **
9) In English`,

  es: `Formato requerido (400-450 palabras):
1) Respuesta concisa y completa en un mensaje
2) Utiliza emojis relacionados con el tarot para ilustrar conceptos
3) Solo formato HTML: <h2>/<h3> títulos, <em>/<strong> importancia, <blockquote> citas, <ul>/<li> listas
4) Incorpora aspectos psicológicos y simbólicos de las cartas
5) Establece conexiones entre cartas complementarias u opuestas
6) Evita jerga excesivamente esotérica para mantener la accesibilidad
7) Finaliza con un consejo práctico y una sugerencia de acción
8) Sin Markdown ni títulos en texto plano. No utilices títulos en este formato: ** **
9) En español`,

  de: `Erforderliches Format (400-450 Wörter):
1) Präzise und vollständige Antwort in einer Nachricht
2) Verwende relevante Tarot-Emojis, um Konzepte zu illustrieren
3) Nur HTML-Formatierung: <h2>/<h3> Überschriften, <em>/<strong> Wichtigkeit, <blockquote> Zitate, <ul>/<li> Listen
4) Integriere psychologische und symbolische Aspekte der Karten
5) Stelle Verbindungen zwischen sich ergänzenden oder gegensätzlichen Karten her
6) Vermeide zu esoterischen Fachjargon, um verständlich zu bleiben
7) Schließe mit praktischem Rat und einem Handlungsvorschlag ab
8) Kein Markdown oder Überschriften im Klartext. Keine Überschriften in diesem Formatierungsstil: ** **
9) Auf Deutsch`,

  it: `Formato richiesto (400-450 parole):
1) Risposta concisa e completa in un messaggio
2) Utilizza emoji a tema tarocchi per illustrare i concetti
3) Solo formattazione HTML: <h2>/<h3> titoli, <em>/<strong> importanza, <blockquote> citazioni, <ul>/<li> elenchi
4) Incorpora aspetti psicologici e simbolici delle carte
5) Crea connessioni tra carte che si completano o si oppongono
6) Evita un gergo eccessivamente esoterico per rimanere accessibile
7) Concludi con un consiglio pratico e un suggerimento d'azione
8) Niente Markdown o titoli in testo normale. Nessun titolo in questo stile di formattazione: ** **
9) In italiano`,

  zh: `必需格式（400-450字）：
1) 在一条消息中提供简洁完整的回答
2) 使用相关的塔罗主题表情符号来说明概念
3) 仅使用HTML格式：<h2>/<h3>标题，<em>/<strong>强调，<blockquote>引用，<ul>/<li>列表
4) 融入牌的心理和象征方面
5) 建立互补或对立的牌之间的联系
6) 避免过于深奥的术语，保持易懂
7) 以实用建议和行动建议结束
8) 不使用Markdown或纯文本标题。不要使用这种格式的标题：** **
9) 使用中文`
};

// Textes d'emphase pour chaque langue
const EMPHASIS_TEXTS = {
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
Ogni aspetto della tua interpretazione deve rispondere a un aspetto di questa domanda.`,
  
  zh: `重要提示：您的回答必须与这个问题直接且具体相关。
请专注于问题所精确询问的内容，并根据问题中提到的元素调整您的解读。
请勿提供泛泛而论的回答。
您解读的每个方面都应该回应问题的某个方面。`
};

/**
 * Fonction pour obtenir le META_PROMPT adapté à la langue sélectionnée
 * @param {string} langue - Code de la langue (fr, en, es, de, it, zh)
 * @returns {string} - Le META_PROMPT dans la langue appropriée
 */
function getMetaPrompt(langue = 'fr') {
  // Récupérer le prompt de base dans la langue demandée ou en français par défaut
  const promptLangageSpecifique = META_PROMPT_BASE[langue] || META_PROMPT_BASE.fr;
  
  // On peut ajouter des adaptations supplémentaires ici si nécessaire
  return promptLangageSpecifique;
}

/**
 * Fonction pour obtenir le texte d'emphase dans la langue appropriée
 * @param {string} langue - Code de la langue (fr, en, es, de, it, zh)
 * @returns {string} - Le texte d'emphase dans la langue appropriée
 */
function getEmphasisText(langue = 'fr') {
  return EMPHASIS_TEXTS[langue] || EMPHASIS_TEXTS.fr;
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
  const questionBlock = `====================
${questionIntro}:
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
  META_PROMPT_BASE,
  EMPHASIS_TEXTS,
  getMetaPrompt,
  getEmphasisText,
  enrichirPromptContextuel
}; 