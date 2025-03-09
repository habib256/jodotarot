/**
 * Fichier de configuration générale pour l'application Jodotarot
 */

import { getMetaPrompt } from './metaprompt.js';

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
  "llama3.1": {
    responseKey: "message.content"
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

export {
  API_KEY,
  API_URL_OPENAI,
  API_URL_OLLAMA,
  API_URL_OLLAMA_TAGS,
  getMetaPrompt,
  getOllamaModelFormat
}; 