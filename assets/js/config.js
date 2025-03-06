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
1) Être concise (entre 400 et 450 mots)
2) Former une interprétation complète en un seul message
3) Utiliser des émoticônes appropriées à ton personnage pour enrichir visuellement le texte
4) UTILISER EXCLUSIVEMENT des balises HTML pour tout formatage
5) IMPORTANT: TOUS les titres et sous-titres doivent OBLIGATOIREMENT être formatés avec des balises HTML (<h1>, <h2>, <h3>) et JAMAIS avec des symboles Markdown (# ou ##) ou laissés en texte brut
7) Exemples de formatage correct: <h2>Introduction</h2>, <h3>La carte du Bateleur</h3>, <em>concept important</em>`;

export {
  API_KEY,
  API_URL_OPENAI,
  API_URL_OLLAMA,
  API_URL_OLLAMA_TAGS,
  META_PROMPT
}; 