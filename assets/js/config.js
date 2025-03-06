/**
 * Fichier de configuration générale pour l'application Jodotarot
 */

// Configuration pour l'API OpenAI
const API_KEY = "your API KEY";
const API_URL_OPENAI = "https://api.openai.com/v1/chat/completions";

// Configuration pour l'API Ollama (local)
const API_URL_OLLAMA = "http://localhost:11434/api/chat";
const API_URL_OLLAMA_TAGS = "http://localhost:11434/api/tags";

// Meta prompt pour formater les réponses
const META_PROMPT = `Ta réponse doit respecter ces critères STRICTS:
1) Être concise (400-450 mots)
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
5) JAMAIS utiliser de symboles Markdown (# ou ##) ou laisser des titres en texte brut comme "Introduction:" ou "ANALYSE:"`;

export {
  API_KEY,
  API_URL_OPENAI,
  API_URL_OLLAMA,
  API_URL_OLLAMA_TAGS,
  META_PROMPT
}; 