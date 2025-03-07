/**
 * Fichier de configuration générale pour l'application Jodotarot
 */

// Configuration pour l'API OpenAI
const API_KEY = "YOUR API KEY";
const API_URL_OPENAI = "https://api.openai.com/v1/chat/completions";

// Configuration pour l'API Ollama (local)
const API_URL_OLLAMA = "http://localhost:11434/api/chat";
const API_URL_OLLAMA_TAGS = "http://localhost:11434/api/tags";

// Meta prompt de base pour formater les réponses
const META_PROMPT_BASE = {
  fr: `Ta réponse doit respecter ces critères STRICTS:
1) Être concise et compacte (400-450 mots)
2) Former une interprétation complète en un seul message
3) Utiliser des émoticônes adaptées à ton personnage
4) Utiliser UNIQUEMENT des balises HTML pour le formatage:
   - <h2> pour les titres principaux (sections, thématiques)
   - <h3> pour les sous-sections
   - <em> pour les concepts importants
   - <strong> pour les conseils clés ou points importants
   - <blockquote> pour les citations ou références
   - <ul>/<li> pour les listes
   - <span> avec styles CSS pour les mises en forme spéciales
5) JAMAIS utiliser de symboles Markdown (# ou ##) ou laisser des titres en texte brut comme "Introduction:" ou "ANALYSE:"
6) TOUJOURS utiliser la langue française pour ta réponse complète`,

  en: `Your response MUST follow these STRICT criteria:
1) Be concise and compact (400-450 words)
2) Form a complete interpretation in a single message
3) Use emojis that match your character
4) Use ONLY HTML tags for formatting:
   - <h2> for main titles (sections, themes)
   - <h3> for subsections
   - <em> for important concepts
   - <strong> for key advice or important points
   - <blockquote> for quotes or references
   - <ul>/<li> for lists
   - <span> with CSS styles for special formatting
5) NEVER use Markdown symbols (# or ##) or leave titles in plain text like "Introduction:" or "ANALYSIS:"
6) ALWAYS use the English language for your complete response`,

  es: `Tu respuesta DEBE seguir estos criterios ESTRICTOS:
1) Ser concisa y compacta (400-450 palabras)
2) Formar una interpretación completa en un solo mensaje
3) Usar emojis que coincidan con tu personaje
4) Usar SOLO etiquetas HTML para el formato:
   - <h2> para títulos principales (secciones, temas)
   - <h3> para subsecciones
   - <em> para conceptos importantes
   - <strong> para consejos clave o puntos importantes
   - <blockquote> para citas o referencias
   - <ul>/<li> para listas
   - <span> con estilos CSS para formato especial
5) NUNCA uses símbolos de Markdown (# o ##) o dejes títulos en texto plano como "Introducción:" o "ANÁLISIS:"
6) SIEMPRE utiliza el idioma español para tu respuesta completa`,

  de: `Deine Antwort MUSS diese STRENGEN Kriterien erfüllen:
1) Sei präzise und kompakt (400-450 Wörter)
2) Bilde eine vollständige Interpretation in einer einzigen Nachricht
3) Verwende Emojis, die zu deinem Charakter passen
4) Verwende NUR HTML-Tags zur Formatierung:
   - <h2> für Haupttitel (Abschnitte, Themen)
   - <h3> für Unterabschnitte
   - <em> für wichtige Konzepte
   - <strong> für wichtige Ratschläge oder wichtige Punkte
   - <blockquote> für Zitate oder Referenzen
   - <ul>/<li> für Listen
   - <span> mit CSS-Stilen für spezielle Formatierungen
5) Verwende NIEMALS Markdown-Symbole (# oder ##) oder belasse Titel in Klartext wie "Einleitung:" oder "ANALYSE:"
6) Verwende IMMER die deutsche Sprache für deine vollständige Antwort`,

  it: `La tua risposta DEVE seguire questi criteri RIGOROSI:
1) Essere concisa e compatta (400-450 parole)
2) Formare un'interpretazione completa in un unico messaggio
3) Utilizzare emoji che corrispondano al tuo personaggio
4) Utilizzare SOLO tag HTML per la formattazione:
   - <h2> per i titoli principali (sezioni, temi)
   - <h3> per le sottosezioni
   - <em> per concetti importanti
   - <strong> per consigli chiave o punti importanti
   - <blockquote> per citazioni o riferimenti
   - <ul>/<li> per gli elenchi
   - <span> con stili CSS per formattazioni speciali
5) NON utilizzare MAI simboli Markdown (# o ##) o lasciare titoli in testo semplice come "Introduzione:" o "ANALISI:"
6) Utilizza SEMPRE la lingua italiana per la tua risposta completa`
};

/**
 * Fonction pour obtenir le META_PROMPT adapté à la langue sélectionnée
 * @param {string} langue - Code de la langue (fr, en, es, de, it)
 * @returns {string} - Le META_PROMPT dans la langue appropriée
 */
function getMetaPrompt(langue = 'fr') {
  // Récupérer le prompt de base dans la langue demandée ou en français par défaut
  return META_PROMPT_BASE[langue] || META_PROMPT_BASE.fr;
}

export {
  API_KEY,
  API_URL_OPENAI,
  API_URL_OLLAMA,
  API_URL_OLLAMA_TAGS,
  getMetaPrompt
}; 