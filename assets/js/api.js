/**
 * Module de gestion des appels API aux modèles d'IA
 */

import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getOllamaModelFormat, DEBUG_LEVEL, SETTINGS } from './config.js';
import { getMetaPrompt, enrichirPromptContextuel } from './prompt.js';
import PERSONAS, { getPersonaPrompt } from './models/personas/index.js';
import { TRANSLATIONS, getTranslation } from './translations/index.js';

// Système simple de cache pour les réponses
const responseCache = new Map();

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
  try {
    console.log(`🔍 DEBUG - Requête API avec modèle: ${modele}`);
    
    // Préparer les éléments UI
    const interpretationsInfo = document.getElementById('interpretations-info');
    const interpretationsPrompt = document.getElementById('interpretations-prompt');
    const interpretationsResponse = document.getElementById('interpretations-response');
    const promptContent = document.querySelector('#interpretations-prompt .prompt-content');
    const responseContent = document.querySelector('#interpretations-response .response-content');
    const loadingAnimations = document.getElementById('loading-animations');
    
    // Si on utilise Ollama, vérifier d'abord la connexion
    const isOllama = modele.startsWith('ollama/');
    const ollamaModelName = isOllama ? modele.replace('ollama/', '') : '';
    
    if (isOllama) {
      // Afficher la promotion Ollama
      const ollamaPromo = document.getElementById('ollama-promo');
      if (ollamaPromo) {
        ollamaPromo.innerText = getTranslation('ollama.promo', langue) || "Powered by Ollama - A local AI model running on your computer";
      }
      
      try {
        const connectivityTest = await testOllamaConnectivity(ollamaModelName);
        
        if (DEBUG_LEVEL > 0) {
          console.log("⚙️ Test Ollama connectivité:", connectivityTest);
        }
        
        if (connectivityTest.status === 'testing') {
          const testingText = getTranslation('ollama.testing', langue) || `Vérification de la connexion à Ollama...`;
          
          // Mise à jour pour respecter la nouvelle structure HTML
          const infoContent = interpretationsInfo.querySelector('.information-zone__content');
          if (infoContent) {
            infoContent.innerHTML = `<p>${testingText}</p>`;
          } else {
            interpretationsInfo.innerHTML = `
              <div class="information-zone__header">
                <h3 class="information-zone__title">${getTranslation('information.title', langue, 'Information')}</h3>
              </div>
              <div class="information-zone__content">
                <p>${testingText}</p>
              </div>
            `;
          }
          
          interpretationsPrompt.style.display = 'none';
          interpretationsResponse.style.display = 'none';
          return testingText;
        } else if (connectivityTest.status === 'error') {
          const errorMessage = `${getTranslation('interpretation.connectionError', langue) || 'Erreur de connexion à Ollama:'} ${connectivityTest.message}`;
          
          // Mise à jour pour respecter la nouvelle structure HTML
          const infoContent = interpretationsInfo.querySelector('.information-zone__content');
          if (infoContent) {
            infoContent.innerHTML = `<p class="error">${errorMessage}</p>`;
          } else {
            interpretationsInfo.innerHTML = `
              <div class="information-zone__header">
                <h3 class="information-zone__title">${getTranslation('information.title', langue, 'Information')}</h3>
              </div>
              <div class="information-zone__content">
                <p class="error">${errorMessage}</p>
              </div>
            `;
          }
          
          interpretationsPrompt.style.display = 'none';
          interpretationsResponse.style.display = 'none';
          throw new Error(`Erreur Ollama: ${connectivityTest.message}`);
        }
      } catch (err) {
        console.error("❌ Erreur lors du test de connectivité Ollama:", err);
        throw err;
      }
    }
    
    // Construction des messages à envoyer à l'API
    const messages = [];
    
    // Ajouter les system prompts (instructions pour l'IA)
    systemPrompts.forEach(prompt => {
      messages.push({
        role: "system",
        content: prompt
      });
    });
    
    // Ajouter le message de l'utilisateur
    messages.push({
      role: "user",
      content: message
    });
    
    // Construire l'URL en fonction du type de modèle (Ollama ou OpenAI)
    const API_URL = isOllama ? API_URL_OLLAMA : API_URL_OPENAI;
    
    // Construire les données de la requête
    const requestData = {
      model: isOllama ? ollamaModelName : modele.replace('openai/', ''),
      messages: messages,
      ...(isOllama ? 
        { stream: SETTINGS.ENABLE_STREAMING } : 
        { 
          max_tokens: parseInt(SETTINGS.MAX_TOKENS || 1000),
          temperature: parseFloat(SETTINGS.TEMPERATURE || 0.7),
          stream: SETTINGS.ENABLE_STREAMING
        }
      )
    };
    
    // Logs de débogage pour diagnostiquer les problèmes
    if (DEBUG_LEVEL > 0) {
      logPrompt(persona, message, systemPrompts);
    }
    
    // Format adapté selon que c'est Ollama ou OpenAI
    if (!isOllama) {
      requestData.stream = SETTINGS.ENABLE_STREAMING;
    }
    
    console.log("🔍 DEBUG - Données de la requête:", {
      model: modele,
      messagesCount: messages.length,
      stream: SETTINGS.ENABLE_STREAMING,
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
    interpretationsInfo.innerHTML = '';
    interpretationsInfo.appendChild(progressContainer);
    
    const partialResponse = document.createElement('div');
    partialResponse.className = 'partial-response';
    responseContent.appendChild(partialResponse);
    
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
            const modelFormat = getOllamaModelFormat(ollamaModelName);
            
            for (const line of lines) {
              if (!line.trim()) continue;
              
              try {
                const parsedChunk = JSON.parse(line);
                
                // Afficher le premier chunk complet pour le débogage des formats
                if (!detectedFormat && DEBUG_LEVEL > 0) {
                  console.log("🔍 DEBUG - Premier chunk Ollama pour analyse:", parsedChunk);
                }
                
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
                  
                  if (DEBUG_LEVEL > 0) console.log(`🔍 DEBUG - Format détecté pour ${ollamaModelName}: ${detectedFormat}`);
                }
                
                // Extraction du texte selon le format détecté (approche améliorée)
                let responseText = '';
                
                // Vérifier d'abord explicitement le format pour llama3.1
                if (ollamaModelName.includes('llama3.1')) {
                  // Pour llama3.1, essayer spécifiquement ces chemins
                  if (parsedChunk.message?.content !== undefined) {
                    responseText = parsedChunk.message.content;
                  } else if (parsedChunk.content !== undefined) {
                    responseText = parsedChunk.content;
                  } else if (parsedChunk.response !== undefined) {
                    responseText = parsedChunk.response;
                  }
                  
                  if (DEBUG_LEVEL > 1 && responseText) {
                    console.log(`🔍 DEBUG - Texte extrait pour llama3.1:`, responseText.substring(0, 20) + "...");
                  }
                } else {
                  // Pour les autres modèles, suivre la logique normale
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
                  responseContent.innerHTML = formatStreamingResponse(fullResponse);
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
                  responseContent.innerHTML = formatStreamingResponse(fullResponse);
                }
              } catch (e) {
                console.error("Erreur lors du parsing du chunk OpenAI:", e);
              }
            }
          }
        }
        
        // À la fin du traitement du stream, juste avant de retourner la réponse
        if (fullResponse.trim() === '') {
          console.error("🔍 DEBUG - Réponse vide après traitement complet.");
          throw new Error("Réponse vide reçue du modèle");
        }
        
        // Vérifier que la réponse n'est pas trop courte ou incomplète
        if (fullResponse.length < 20) {
          console.warn("🔍 DEBUG - Réponse très courte:", fullResponse);
          // Ne pas lever d'erreur mais enregistrer l'avertissement
        }
        
        // Ajouter un marqueur pour indiquer que le streaming s'est terminé correctement
        fullResponse += "\n\n<!-- streaming-completed -->";
        
        // Mettre en cache la réponse
        responseCache.set(JSON.stringify({
          persona,
          message,
          tirage: tirage.map(card => card.id),
          spreadType,
          langue
        }), fullResponse);
        
        // Retourner la réponse complète
        return fullResponse;
      } finally {
        clearInterval(timeoutInterval);
      }
    } catch (fetchError) {
      console.error("🔍 DEBUG - Erreur critique fetch:", fetchError);
      responseContent.innerHTML = `<p class="error">${getTranslation('interpretation.apiError', langue) || 'Erreur API:'} ${fetchError.message}</p>`;
      throw fetchError;
    }
  } catch (error) {
    console.error("🔍 DEBUG - Erreur globale:", error);
    responseContent.innerHTML = `<p class="error">${getTranslation('interpretation.error', langue) || 'Erreur:'} ${error.message}</p>`;
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

// Remplacer par un service ou une fonction locale si nécessaire
/**
 * Fonction temporaire pour remplacer le genererPromptTirage de l'ancien tarot.js
 * @param {Array} tirage - Le tirage de cartes
 * @param {string} question - La question posée
 * @param {string} spreadType - Le type de tirage
 * @param {string} langue - La langue utilisée
 * @returns {string} - Le prompt formaté pour l'IA
 */
function genererPromptTirage(tirage, question, spreadType, langue) {
  // Utiliser les traductions et le format approprié
  // Fonction simplifiée pour maintenir la compatibilité
  return `Tirage ${spreadType} pour la question: "${question}"`;
}