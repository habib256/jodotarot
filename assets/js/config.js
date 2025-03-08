/**
 * Fichier de configuration générale pour l'application Jodotarot
 */

// Configuration pour l'API OpenAI
const API_KEY = "YOUR API KEY";
const API_URL_OPENAI = "https://api.openai.com/v1/chat/completions";

// Configuration pour l'API Ollama (local)
const API_URL_OLLAMA = "http://localhost:11434/api/chat";
const API_URL_OLLAMA_TAGS = "http://localhost:11434/api/tags";

// Configuration des modèles Ollama
const OLLAMA_MODEL_FORMATS = {
  // Format de réponse pour chaque famille de modèle
  "llama": {
    responseKey: "response"
  },
  "mistral": {
    responseKey: "message.content"
  },
  "phi": {
    responseKey: "response"
  },
  "gemma": {
    responseKey: "response"
  },
  // Format par défaut si aucun match n'est trouvé
  "default": {
    responseKey: "response"
  }
};

/**
 * Fonction pour obtenir le format de réponse approprié pour un modèle Ollama
 * @param {string} modelName - Nom du modèle (ex: "llama3.1:latest")
 * @returns {Object} - Configuration du format de réponse
 */
function getOllamaModelFormat(modelName) {
  if (!modelName) return OLLAMA_MODEL_FORMATS.default;
  
  // Vérifier quelle famille de modèle correspond
  const lowerModelName = modelName.toLowerCase();
  
  for (const [family, config] of Object.entries(OLLAMA_MODEL_FORMATS)) {
    if (lowerModelName.includes(family)) {
      console.log(`🔍 DEBUG - Format détecté pour ${modelName}: ${family}`);
      return config;
    }
  }
  
  // Si aucun match, retourner le format par défaut
  console.log(`🔍 DEBUG - Aucun format spécifique trouvé pour ${modelName}, utilisation du format par défaut`);
  return OLLAMA_MODEL_FORMATS.default;
}

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
9) In italiano`
};

/**
 * Fonction pour obtenir le META_PROMPT adapté à la langue sélectionnée
 * @param {string} langue - Code de la langue (fr, en, es, de, it)
 * @returns {string} - Le META_PROMPT dans la langue appropriée
 */
function getMetaPrompt(langue = 'fr') {
  // Récupérer le prompt de base dans la langue demandée ou en français par défaut
  const promptLangageSpecifique = META_PROMPT_BASE[langue] || META_PROMPT_BASE.fr;
  
  // On peut ajouter des adaptations supplémentaires ici si nécessaire
  return promptLangageSpecifique;
}

export {
  API_KEY,
  API_URL_OPENAI,
  API_URL_OLLAMA,
  API_URL_OLLAMA_TAGS,
  getMetaPrompt,
  getOllamaModelFormat
}; 