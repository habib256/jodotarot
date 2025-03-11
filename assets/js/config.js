/**
 * Fichier de configuration générale pour l'application Jodotarot
 * Ce fichier centralise tous les paramètres utilisés par l'application pour faciliter la maintenance
 * et éviter les duplications de code et les incohérences de configuration.
 */

// Configuration de debug
const DEBUG_LEVEL = 1; // 0: aucun, 1: basique, 2: détaillé, 3: verbeux

// Paramètres utilisateur configurables
const SETTINGS = {
  // Paramètres d'API
  API_KEY: "YOUR API KEY", // Clé API pour OpenAI (laisser vide pour utiliser Ollama)
  ENABLE_STREAMING: true,  // Activer la réception des réponses en temps réel
  MAX_TOKENS: 1000,        // Nombre maximum de tokens pour la réponse
  TEMPERATURE: 0.7,        // Température (créativité) de la génération
  
  // URLs des services
  OLLAMA_URL: "http://localhost:11434",  // URL du serveur Ollama local
  OPENAI_URL: "https://api.openai.com/v1", // URL de l'API OpenAI
  
  // Paramètres par défaut
  DEFAULT_PERSONA: "tarologue",  // Persona par défaut
  DEFAULT_LANGUAGE: "fr",        // Langue par défaut
  DEFAULT_DECK: "set01",         // Jeu de cartes par défaut
  DEFAULT_SPREAD: "cross",       // Type de tirage par défaut
  DEFAULT_MODEL: "ollama:latest", // Modèle d'IA par défaut (utilise le dernier modèle disponible)
  
  // Paramètres d'interface
  HIDE_PROMPT: false,      // Masquer le prompt envoyé à l'IA
  AUTO_SCROLL: true,       // Défilement automatique des interprétations
  DARK_MODE: false,        // Mode sombre
};

// Configuration pour l'API OpenAI
const API_KEY = SETTINGS.API_KEY;
const API_URL_OPENAI = `${SETTINGS.OPENAI_URL}/chat/completions`;

// Configuration pour l'API Ollama (local)
const API_URL_OLLAMA = `${SETTINGS.OLLAMA_URL}/api/chat`;
const API_URL_OLLAMA_TAGS = `${SETTINGS.OLLAMA_URL}/api/tags`;

// Configuration des modèles Ollama
const OLLAMA_MODEL_FORMATS = {
  // Format de réponse pour chaque famille de modèle
  // Chaque entrée contient:
  // - pattern: expression régulière pour identifier le modèle
  // - responseKey: chemin vers la réponse dans l'objet JSON
  // - description: description du format pour le débogage
  "llama3.1": {
    pattern: /\bllama3\.1\b/i,
    responseKey: "choices.0.message.content",
    description: "Llama 3.1 (retourne choices[0].message.content)"
  },
  "llama3": {
    pattern: /\bllama3\b(?!\.1)/i, // llama3 mais pas llama3.1
    responseKey: "message.content",
    description: "Llama 3 (retourne message.content)"
  },
  "llama2": {
    pattern: /\bllama2\b/i,
    responseKey: "response",
    description: "Llama 2 (retourne response)"
  },
  "llama": {
    pattern: /\bllama\b(?!2|3)/i, // llama mais pas llama2 ou llama3
    responseKey: "response",
    description: "Llama original (retourne response)"
  },
  "mistral": {
    pattern: /\bmistral\b/i,
    responseKey: "message.content",
    description: "Mistral (retourne message.content)"
  },
  "mixtral": {
    pattern: /\bmixtral\b/i,
    responseKey: "message.content",
    description: "Mixtral (retourne message.content)"
  },
  "phi": {
    pattern: /\bphi\b/i,
    responseKey: "response",
    description: "Phi (retourne response)"
  },
  "gemma": {
    pattern: /\bgemma\b/i,
    responseKey: "response",
    description: "Gemma (retourne response)"
  },
  // Format par défaut si aucun match n'est trouvé
  "default": {
    pattern: null,
    responseKey: "response",
    description: "Format par défaut (retourne response)"
  }
};

/**
 * Fonction pour obtenir le format de réponse approprié pour un modèle Ollama
 * @param {string} modelName - Nom du modèle (ex: "llama3.1:latest")
 * @returns {Object} - Configuration du format de réponse
 */
function getOllamaModelFormat(modelName) {
  if (!modelName) return OLLAMA_MODEL_FORMATS.default;
  
  // Normaliser le nom du modèle
  const normalizedModelName = modelName.toLowerCase().trim();
  
  // Vérifier chaque format dans l'ordre de priorité
  for (const [family, config] of Object.entries(OLLAMA_MODEL_FORMATS)) {
    // Ignorer le format par défaut lors de la recherche
    if (family === 'default') continue;
    
    // Vérifier si le pattern correspond
    if (config.pattern && config.pattern.test(normalizedModelName)) {
      if (DEBUG_LEVEL > 0) {
        console.log(`🔍 DEBUG - Modèle "${modelName}" identifié comme "${family}" (${config.description})`);
      }
      return config;
    }
  }
  
  // Si aucun match, retourner le format par défaut
  if (DEBUG_LEVEL > 0) {
    console.log(`🔍 DEBUG - Aucun format spécifique trouvé pour "${modelName}", utilisation du format par défaut`);
  }
  return OLLAMA_MODEL_FORMATS.default;
}

// Exposer SETTINGS globalement pour faciliter l'accès depuis la console de débogage
if (typeof window !== 'undefined') {
  window.JODOTAROT_SETTINGS = SETTINGS;
}

export {
  API_KEY,
  API_URL_OPENAI,
  API_URL_OLLAMA,
  API_URL_OLLAMA_TAGS,
  DEBUG_LEVEL,
  SETTINGS,
  getOllamaModelFormat
}; 