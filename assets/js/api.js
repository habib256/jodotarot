/**
 * Module de gestion des appels API aux modèles d'IA
 */

import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getMetaPrompt, getOllamaModelFormat } from './config.js';
import { genererPromptTirage } from './tarot.js';
import PERSONAS, { getPersonaPrompt } from './personas/index.js';
import { getTranslation } from './translations.js';

// Configuration du niveau de déboggage
// 0 = Erreurs seulement, 1 = Infos importantes, 2 = Détails, 3 = Verbeux
const DEBUG_LEVEL = 1; 

// Système simple de cache pour les réponses
const responseCache = new Map();

// Créer un fichier de configuration centrale
const SETTINGS = {
  DEFAULT_PERSONA: "tarologue",
  DEFAULT_LANGUAGE: "fr",
  MAX_TOKENS: 500,
  // etc.
};

/**
 * Fonction pour enrichir le prompt système avec le contexte spécifique à la question
 * @param {string} question - La question posée par l'utilisateur
 * @param {string} systemPrompt - Le prompt système de base
 * @param {string} langue - La langue à utiliser (fr par défaut)
 * @returns {string} - Le prompt système enrichi avec la question
 */
function enrichirPromptContextuel(question, systemPrompt, langue = 'fr') {
  // Ajouter la question de l'utilisateur au prompt système
  if (question && question.trim()) {
    // Obtenir la traduction de l'introduction à la question
    const questionIntro = getTranslation('interpretation.userQuestion', langue);
    
    // Textes d'emphase traduits pour chaque langue
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
    const emphaseTexte = emphaseTextes[langue] || emphaseTextes.fr;
    
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
  
  return systemPrompt;
}

/**
 * Fonction pour obtenir une réponse de l'API OpenAI avec GPT-4o
 * @param {string} message - La question posée par l'utilisateur
 * @param {Array} systemPrompts - Tableau de prompts système additionnels
 * @param {string} modele - Modèle d'IA à utiliser
 * @param {string} persona - Persona sélectionné pour l'interprétation
 * @param {Array} tirage - Tableau des cartes tirées
 * @param {string} langue - Langue sélectionnée (fr, en, es, de, it)
 * @param {string} spreadType - Type de tirage (cross ou horseshoe)
 * @returns {Promise<string>} - Réponse de l'API
 */
async function obtenirReponseGPT4O(message, systemPrompts = [], modele = 'openai/gpt-3.5-turbo', persona = 'tarologue', tirage = [], langue = 'fr', spreadType = 'cross') {
  // Vérifier quel type d'API nous utilisons (OpenAI ou Ollama)
  const isOllama = !modele.startsWith('openai/');
  
  console.log("🔍 DEBUG - Démarrage appel API:", { 
    modele, 
    isOllama, 
    persona,
    nombreCartes: tirage.length,
    langue,
    spreadType
  });
  
  // Récupérer l'élément pour afficher les erreurs et l'interprétation
  const interpretationsDiv = document.getElementById('interpretations');
  
  try {
    // Préparer les données pour l'API
    const modelName = isOllama ? modele.split('/')[1] : modele.split('/')[1];
    const API_URL = isOllama ? API_URL_OLLAMA : API_URL_OPENAI;
    
    console.log("🔍 DEBUG - Configuration API:", { 
      modelName, 
      API_URL,
      headers: isOllama ? "Standard" : "Avec API_KEY" 
    });
    
    // Tester la connectivité d'Ollama si applicable
    if (isOllama) {
      interpretationsDiv.innerHTML = `<p class="loading">${getTranslation('interpretation.testingConnection', langue) || 'Test de connexion à Ollama...'}</p>`;
      const connectivityTest = await testOllamaConnectivity(modelName);
      
      if (!connectivityTest.success) {
        console.error("🔍 DEBUG - Échec du test de connectivité Ollama:", connectivityTest.message);
        interpretationsDiv.innerHTML = `<p class="error">${getTranslation('interpretation.connectionError', langue) || 'Erreur de connexion à Ollama:'} ${connectivityTest.message}</p>`;
        return `Erreur de connexion: ${connectivityTest.message}`;
      }
    }
    
    // Obtenir le prompt spécifique au persona
    const personaPrompt = getPersonaPrompt(persona, langue);
    
    // Obtenir le prompt spécifique au tirage des cartes
    const tiragePrompt = tirage.length > 0 ? genererPromptTirage(tirage, message, spreadType, langue) : "";
    
    // Fusionner les prompts système avec ceux du persona et du tirage
    const mergedSystemPrompt = 
      `${getMetaPrompt(langue)}\n\n${personaPrompt}\n\n${tiragePrompt}`;
    
    // Ajouter l'emphase sur la question au début du système prompt
    const finalSystemPrompt = enrichirPromptContextuel(message, mergedSystemPrompt, langue);
    
    console.log("🔍 DEBUG - Prompts préparés:", { 
      personaPromptLength: personaPrompt.length,
      tiragePromptLength: tiragePrompt.length,
      finalSystemPromptLength: finalSystemPrompt.length
    });
    
    // Pour le débogage
    logPrompt(persona, message, finalSystemPrompt);
    
    // Créer les messages pour l'API
    const messages = [
      {
        role: "system",
        content: finalSystemPrompt
      },
      {
        role: "user",
        content: message
      }
    ];
    
    // Ajouter les messages système supplémentaires s'il y en a
    if (systemPrompts && systemPrompts.length > 0) {
      for (const sysPrompt of systemPrompts) {
        messages.push({
          role: "system",
          content: sysPrompt
        });
      }
    }
    
    // Construire la clé de cache
    const cacheKey = JSON.stringify({
      persona,
      message,
      tirage: tirage.map(card => card.id),
      spreadType,
      langue
    });
    
    // Vérifier si nous avons déjà cette réponse en cache
    if (responseCache.has(cacheKey)) {
      console.log("🔍 DEBUG - Réponse trouvée dans le cache");
      return responseCache.get(cacheKey);
    }
    
    // Préparer les données de la requête pour OpenAI ou Ollama
    const requestData = isOllama ? {
      model: modelName,
      messages: messages,
      stream: true
    } : {
      model: modelName,
      messages: messages,
      max_tokens: SETTINGS.MAX_TOKENS,
      stream: true
    };
    
    console.log("🔍 DEBUG - Données de la requête:", {
      model: modelName,
      messagesCount: messages.length,
      stream: true,
      max_tokens: isOllama ? "Non spécifié" : SETTINGS.MAX_TOKENS
    });
    
    // En-têtes de la requête (API key pour OpenAI uniquement)
    const headers = {
      'Content-Type': 'application/json',
      ...(isOllama ? {} : {'Authorization': `Bearer ${API_KEY}`})
    };
    
    console.log("🔍 DEBUG - Envoi de la requête API à:", API_URL);
    
    // Faire la requête à l'API avec streaming
    const progressContainer = document.createElement('div');
    progressContainer.className = 'ollama-progress';
    progressContainer.innerHTML = `
      <p>${getTranslation('interpretation.streamingResponse', langue)}</p>
      <div class="progress-container">
        <div class="progress-bar"></div>
      </div>
    `;
    interpretationsDiv.innerHTML = '';
    interpretationsDiv.appendChild(progressContainer);
    
    const partialResponse = document.createElement('div');
    partialResponse.className = 'partial-response';
    interpretationsDiv.appendChild(partialResponse);
    
    try {
      console.log("🔍 DEBUG - Début fetch API");
      
      // Fonction pour créer un timeout pour le fetch
      const fetchWithTimeout = async (url, options, timeoutMs = 30000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            throw new Error(`La requête a expiré après ${timeoutMs / 1000} secondes`);
          }
          throw error;
        }
      };
      
      const response = await fetchWithTimeout(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      }, 60000); // 60 secondes de timeout
      
      console.log("🔍 DEBUG - Réponse fetch reçue:", { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText
      });
      
      // Vérifier si la réponse est OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔍 DEBUG - Erreur API - Réponse texte:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.error("🔍 DEBUG - Erreur API - Détails:", errorData);
          throw new Error(`Erreur API: ${errorData.error?.message || response.statusText}`);
        } catch (parseError) {
          throw new Error(`Erreur API (${response.status}): ${response.statusText} - ${errorText.substring(0, 100)}...`);
        }
      }
      
      // Traiter le stream de la réponse
      console.log("🔍 DEBUG - Début traitement du stream");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      // Timeout pour chaque chunk de réponse
      let chunkPromise;
      let lastChunkTime = Date.now();
      const chunkTimeout = 30000; // 30 secondes entre chaque chunk
      
      const checkTimeout = () => {
        const now = Date.now();
        if (now - lastChunkTime > chunkTimeout) {
          throw new Error(`Délai d'attente dépassé: aucune donnée reçue depuis ${chunkTimeout / 1000} secondes`);
        }
      };
      
      const timeoutInterval = setInterval(checkTimeout, 5000);
      
      try {
        // Utiliser un tableau pour stocker les morceaux de réponse (optimisation)
        const responseChunks = [];
        let detectedFormat = null;
        
        while (true) {
          // Logging simplifié
          if (DEBUG_LEVEL > 1) console.log("🔍 DEBUG - Attente de chunk de données");
          
          // Check for timeout while waiting for chunks
          chunkPromise = reader.read();
          const { done, value } = await chunkPromise;
          
          lastChunkTime = Date.now(); // Reset timeout counter
          
          if (done) {
            if (DEBUG_LEVEL > 0) console.log("🔍 DEBUG - Stream terminé");
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          if (DEBUG_LEVEL > 1) console.log("🔍 DEBUG - Chunk reçu:", chunk.substring(0, 80) + (chunk.length > 80 ? "..." : ""));
          
          // Traiter le chunk en fonction du type d'API
          if (isOllama) {
            // Format Ollama: objets JSON séparés par des sauts de ligne
            const lines = chunk.split('\n');
            if (DEBUG_LEVEL > 1) console.log("🔍 DEBUG - Traitement chunk Ollama:", { nombreLignes: lines.length });
            
            // Obtenir le format de réponse pour ce modèle (utilisé comme référence initiale)
            const modelFormat = getOllamaModelFormat(modelName);
            
            for (const line of lines) {
              if (!line.trim()) continue;
              
              try {
                const parsedChunk = JSON.parse(line);
                
                // Détection intelligente du format (si pas encore détecté)
                if (!detectedFormat) {
                  if (parsedChunk.message?.content !== undefined) {
                    detectedFormat = 'message.content';
                  } else if (parsedChunk.response !== undefined) {
                    detectedFormat = 'response';
                  } else if (modelFormat && modelFormat.responseKey) {
                    detectedFormat = modelFormat.responseKey;
                  } else {
                    detectedFormat = 'unknown';
                  }
                  
                  if (DEBUG_LEVEL > 0) console.log(`🔍 DEBUG - Format détecté pour ${modelName}: ${detectedFormat}`);
                }
                
                // Extraction du texte selon le format détecté (approche simplifiée)
                let responseText;
                if (detectedFormat === 'message.content' && parsedChunk.message?.content !== undefined) {
                  responseText = parsedChunk.message.content;
                } else if (detectedFormat === 'response' && parsedChunk.response !== undefined) {
                  responseText = parsedChunk.response;
                } else {
                  // Fallback aux autres méthodes si le format détecté n'est pas disponible
                  responseText = getValueByPath(parsedChunk, detectedFormat) || 
                                 parsedChunk.response || 
                                 parsedChunk.message?.content || 
                                 '';
                }
                
                // Logging minimal des informations importantes
                if (DEBUG_LEVEL > 1) {
                  console.log("🔍 DEBUG - Ligne Ollama:", { 
                    format: detectedFormat,
                    textFound: responseText !== undefined && responseText !== '',
                    snippet: responseText ? (responseText.substring(0, 20) + "...") : null,
                    done: parsedChunk.done
                  });
                }
                
                // Si on a trouvé du texte de réponse, l'ajouter à la réponse
                if (responseText) {
                  responseChunks.push(responseText);
                  // Mise à jour de l'affichage avec la réponse cumulative
                  fullResponse = responseChunks.join('');
                  partialResponse.innerHTML = formatStreamingResponse(fullResponse);
                }
                
                if (parsedChunk.done) {
                  if (DEBUG_LEVEL > 0) console.log("🔍 DEBUG - Ollama a signalé la fin (done=true)");
                }
              } catch (e) {
                console.error("🔍 DEBUG - Erreur parsing chunk Ollama:", { 
                  error: e.message,
                  snippet: line.substring(0, 50) + (line.length > 50 ? "..." : "") 
                });
              }
            }
          } else {
            // Format OpenAI: "data: {JSON}" séparés par des sauts de ligne
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (!line.trim() || !line.startsWith('data: ')) continue;
              
              const jsonStr = line.replace(/^data: /, '');
              if (jsonStr === '[DONE]') continue;
              
              try {
                const parsedChunk = JSON.parse(jsonStr);
                const content = parsedChunk.choices[0]?.delta?.content || '';
                if (content) {
                  fullResponse += content;
                  partialResponse.innerHTML = formatStreamingResponse(fullResponse);
                }
              } catch (e) {
                console.error("Erreur lors du parsing du chunk OpenAI:", e);
              }
            }
          }
        }
        
        // Mettre en cache la réponse
        responseCache.set(cacheKey, fullResponse);
        
        // Retourner la réponse complète
        return fullResponse;
      } finally {
        clearInterval(timeoutInterval);
      }
    } catch (fetchError) {
      console.error("🔍 DEBUG - Erreur critique fetch:", fetchError);
      interpretationsDiv.innerHTML = `<p class="error">${getTranslation('interpretation.apiError', langue) || 'Erreur API:'} ${fetchError.message}</p>`;
      throw fetchError;
    }
  } catch (error) {
    console.error("🔍 DEBUG - Erreur globale:", error);
    interpretationsDiv.innerHTML = `<p class="error">${getTranslation('interpretation.error', langue) || 'Erreur:'} ${error.message}</p>`;
    throw error;
  }
}

/**
 * Fonction pour récupérer les modèles disponibles sur Ollama
 * @returns {Promise<Array>} - Liste des modèles disponibles
 */
async function obtenirModelesOllama() {
  try {
    // Vérifier d'abord si Ollama est accessible
    const ollamaConnected = await verifierConnexionOllama();
    
    if (!ollamaConnected) {
      console.warn("Ollama n'est pas accessible");
      return [];
    }
    
    // Récupérer la liste des modèles
    const response = await fetch(API_URL_OLLAMA_TAGS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des modèles: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Retourner la liste des modèles
    return data.models || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des modèles Ollama:", error);
    return [];
  }
}

/**
 * Fonction pour vérifier si Ollama est accessible
 * @returns {Promise<boolean>} - true si Ollama est accessible, false sinon
 */
async function verifierConnexionOllama() {
  try {
    const response = await fetch(API_URL_OLLAMA_TAGS, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(2000) // Timeout après 2 secondes
    });
    
    return response.ok;
  } catch (error) {
    console.warn("Ollama n'est pas accessible:", error);
    return false;
  }
}

/**
 * Fonction pour tester la connectivité avec Ollama
 * @param {string} modelName - Nom du modèle à tester
 * @returns {Promise<Object>} - Résultat du test avec statut et message
 */
async function testOllamaConnectivity(modelName) {
  console.log("🔍 DEBUG - Test de connectivité Ollama pour le modèle:", modelName);
  
  try {
    // 1. Test simple de ping sur le serveur Ollama
    console.log("🔍 DEBUG - Test ping serveur Ollama");
    const pingResponse = await fetch(`${API_URL_OLLAMA.replace('/api/chat', '')}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!pingResponse.ok) {
      console.error("🔍 DEBUG - Serveur Ollama inaccessible:", pingResponse.status, pingResponse.statusText);
      return { 
        success: false, 
        message: `Serveur Ollama inaccessible (${pingResponse.status}): ${pingResponse.statusText}` 
      };
    }
    
    // 2. Vérifier si le modèle est disponible
    console.log("🔍 DEBUG - Vérification disponibilité du modèle:", modelName);
    const modelsData = await pingResponse.json();
    
    if (!modelsData.models) {
      console.error("🔍 DEBUG - Format de réponse Ollama inattendu:", modelsData);
      return { 
        success: false, 
        message: "Format de réponse Ollama inattendu" 
      };
    }
    
    const modelExists = modelsData.models.some(m => m.name === modelName);
    if (!modelExists) {
      console.error("🔍 DEBUG - Modèle non trouvé:", modelName);
      return { 
        success: false, 
        message: `Le modèle ${modelName} n'est pas disponible sur ce serveur Ollama` 
      };
    }
    
    // 3. Test rapide du modèle
    console.log("🔍 DEBUG - Test rapide du modèle:", modelName);
    const testResponse = await fetch(API_URL_OLLAMA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: "Réponds simplement par 'OK' pour tester la connectivité." }],
        stream: false
      })
    });
    
    if (!testResponse.ok) {
      console.error("🔍 DEBUG - Test du modèle échoué:", testResponse.status, testResponse.statusText);
      return { 
        success: false, 
        message: `Test du modèle échoué (${testResponse.status}): ${testResponse.statusText}` 
      };
    }
    
    console.log("🔍 DEBUG - Connectivité Ollama OK pour:", modelName);
    return { success: true, message: "Connectivité Ollama OK" };
    
  } catch (error) {
    console.error("🔍 DEBUG - Erreur lors du test de connectivité Ollama:", error);
    return { 
      success: false, 
      message: `Erreur de connectivité: ${error.message}` 
    };
  }
}

// Améliorer les logs
function logPrompt(persona, question, systemPrompt) {
  console.group("Génération de réponse");
  console.log("Persona:", persona);
  console.log("Question:", question);
  console.log("Prompt système:", systemPrompt);
  console.groupEnd();
}

/**
 * Formate le texte de réponse pour l'affichage en HTML
 * @param {string} text - Texte à formater
 * @returns {string} - HTML formaté
 */
function formatStreamingResponse(text) {
  if (!text || typeof text !== 'string') {
    console.error("Erreur: Texte invalide pour formatage", text);
    return '<p>En attente de réponse...</p>';
  }
  
  // Réduire les logs de débogage
  if (DEBUG_LEVEL > 2) console.log("🔍 DEBUG - formatStreamingResponse:", text.substring(0, 30) + "...");
  
  // Cache statique pour optimiser les appels répétés
  if (!formatStreamingResponse.containsHtmlCache) {
    formatStreamingResponse.containsHtmlCache = new Map();
  }
  
  // Vérifier si on a déjà analysé ce texte (optimisation)
  const cacheKey = text.substring(0, 100); // Utiliser début du texte comme clé
  
  let containsHtml;
  if (formatStreamingResponse.containsHtmlCache.has(cacheKey)) {
    containsHtml = formatStreamingResponse.containsHtmlCache.get(cacheKey);
  } else {
    // Vérifie si le texte contient déjà des balises HTML
    containsHtml = /<\/?[a-z][\s\S]*>/i.test(text);
    formatStreamingResponse.containsHtmlCache.set(cacheKey, containsHtml);
  }
  
  if (containsHtml) {
    // Si le texte contient déjà du HTML, vérifier seulement qu'il est enveloppé dans un conteneur
    return text.trim().startsWith('<') ? text : `<div>${text}</div>`;
  } else {
    // Pour le texte brut, diviser en paragraphes et formater
    return text.split('\n').map(paragraph => 
      paragraph.trim() ? `<p>${paragraph}</p>` : ''
    ).join('');
  }
}

/**
 * Extrait une valeur depuis un objet en utilisant une notation par points
 * @param {Object} obj - L'objet source
 * @param {string} path - Chemin de la propriété (ex: "message.content")
 * @returns {*} - La valeur ou undefined si non trouvée
 */
function getValueByPath(obj, path) {
  if (!obj || !path) return undefined;
  
  const parts = path.split('.');
  let value = obj;
  
  for (const part of parts) {
    if (value === undefined || value === null) return undefined;
    value = value[part];
  }
  
  return value;
}

// Exporter les fonctions
export {
  obtenirReponseGPT4O,
  obtenirModelesOllama,
  verifierConnexionOllama,
  enrichirPromptContextuel,
  logPrompt,
  testOllamaConnectivity
};