/**
 * Service gérant les interactions avec différents modèles d'IA
 * Centralise les appels API et la gestion des réponses
 * 
 * IMPORTANT: Toutes les configurations doivent être importées depuis /assets/js/config.js
 * Ne pas redéfinir de constantes de configuration ici - importer uniquement depuis config.js
 */
import PERSONAS, { getPersonaPrompt } from '../models/personas/index.js';
import { createSpread } from '../models/spreads/index.js';
import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getOllamaModelFormat, DEBUG_LEVEL, TIMEOUTS } from '../config.js';
import { getMetaPrompt, getEmphasisText, enrichirPromptContextuel } from '../prompt.js';
import { testOllamaConnectivity } from '../api.js';

class AIService {
  /**
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   */
  constructor(stateManager) {
    this.stateManager = stateManager;
    
    // D'abord, essayer de charger la clé API depuis le localStorage
    const savedApiKey = this.loadApiKey();
    
    // Si pas de clé sauvegardée, utiliser celle du fichier de configuration
    this.apiKey = savedApiKey || (API_KEY !== "YOUR API KEY" ? API_KEY : null);
    
    this.defaultModel = 'openai/gpt-3.5-turbo';
    this.baseUrl = {
      ollama: API_URL_OLLAMA.replace('/api/chat', ''),
      openai: API_URL_OPENAI.replace('/chat/completions', '')
    };
    
    // Activation du mode de débogage selon le niveau défini dans la configuration
    this.debugMode = typeof DEBUG_LEVEL !== 'undefined' && DEBUG_LEVEL > 1;
    
    // AbortController pour pouvoir annuler les requêtes en cours
    this.currentController = null;
    
    // Flag indiquant si une génération est en cours
    this.isGenerating = false;
  }
  
  /**
   * Annule l'interprétation en cours si elle existe
   * @returns {boolean} Indique si une interprétation a été annulée
   */
  cancelCurrentInterpretation() {
    if (this.currentController && this.isGenerating) {
      console.log('Annulation de l\'interprétation en cours...');
      
      // Créer une erreur d'annulation
      const abortError = new Error('Generation aborted by user');
      abortError.name = 'AbortError';
      
      // Annuler la requête en cours
      this.currentController.abort();
      this.currentController = null;
      this.isGenerating = false;
      
      return true;
    }
    return false;
  }
  
  /**
   * Récupère la liste des modèles Ollama disponibles
   * @returns {Promise<Array>} Liste des modèles disponibles
   */
  async getOllamaModels() {
    try {
      console.log('Tentative de récupération des modèles Ollama...');
      const response = await fetch(API_URL_OLLAMA_TAGS);
      
      if (!response.ok) {
        console.error(`Erreur HTTP lors de la récupération des modèles Ollama: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      if (!data.models || !Array.isArray(data.models)) {
        console.error('Format de réponse Ollama invalide:', data);
        return [];
      }
      
      // Filtrer les modèles pour ne garder que ceux qui sont complets
      const validModels = data.models.filter(model => {
        // Exclure les modèles partiels ou en cours de téléchargement
        return !model.name.includes('partial') && !model.name.includes('downloading');
      });
      
      console.log('Modèles Ollama récupérés:', validModels);
      return validModels;
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles Ollama:', error);
      return [];
    }
  }
  
  /**
   * Teste la disponibilité d'un modèle spécifique
   * @param {string} modelName - Nom du modèle à tester
   * @return {Promise<Object>} Résultat du test avec statut, disponibilité et détails
   */
  async testModelAvailability(modelName) {
    try {
      // Le mode "prompt" est un cas spécial qui :
      // 1. Est toujours disponible car il n'utilise aucun modèle d'IA
      // 2. Sert de fallback sécurisé quand aucun modèle n'est disponible
      // 3. Permet de voir le prompt qui serait envoyé à l'IA sans faire d'appel
      // 4. Utile pour le débogage et la personnalisation des prompts
      if (modelName === 'prompt') {
        return {
          available: true,
          status: 'success',
          modelName: 'prompt',
          message: 'Mode Prompt toujours disponible',
          details: { mode: 'prompt' },
          suggestions: []
        };
      }

      const result = {
        available: false,
        status: 'pending',
        modelName,
        message: '',
        details: {},
        suggestions: []
      };

      // Augmenter les timeouts pour donner plus de temps au chargement des modèles
      // Utiliser des timeouts plus longs, surtout pour les grands modèles
      const timeout = modelName.includes('llama3.1') ? 
        TIMEOUTS.OLLAMA_MODEL_LOAD * 2 : // Doubler le timeout pour les grands modèles
        TIMEOUTS.OLLAMA_CONNECT * 1.5;   // Augmenter de 50% pour les autres modèles
      
      console.log(`Teste du modèle ${modelName} avec un timeout de ${timeout}ms`);

      // Détection améliorée des modèles Ollama
      // Gestion des modèles Ollama avec différents formats
      const isOllamaModel = 
        modelName.startsWith('ollama:') || 
        modelName.includes(':') ||
        !modelName.startsWith('openai/');
      
      if (isOllamaModel) {
        // Nettoyer le nom du modèle - supprimer les préfixes et éventuellement isoler le nom de base
        let ollamaModelName = modelName;
        
        // Supprimer le préfixe ollama: s'il existe
        if (ollamaModelName.startsWith('ollama:')) {
          ollamaModelName = ollamaModelName.replace('ollama:', '');
        }
        
        console.log(`Test de connectivité pour le modèle Ollama: ${ollamaModelName}`);
        
        try {
          // Utiliser Promise.race pour ajouter un timeout
          const availabilityPromise = testOllamaConnectivity(ollamaModelName);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Timeout lors du test de connectivité après ${timeout}ms`)), timeout)
          );
          
          const availability = await Promise.race([availabilityPromise, timeoutPromise]);
          
          result.available = availability.success;
          result.status = availability.success ? 'success' : 'error';
          result.message = availability.message;
          result.details = availability.details || {};
          
          // Ajouter plus d'informations de diagnostic
          if (this.debugMode) {
            console.log(`Résultat du test pour ${ollamaModelName}:`, availability);
          }
          
          // Suggérer des alternatives en cas d'échec
          if (!availability.success) {
            result.suggestions.push('Vérifier que le serveur Ollama est bien démarré');
            result.suggestions.push('Vérifier que le modèle est correctement installé dans Ollama');
            result.suggestions.push('Vérifier la mémoire système disponible');
            
            // Message spécifique selon le type d'erreur
            if (availability.message && availability.message.includes('not found')) {
              result.suggestions.unshift(`Modèle "${ollamaModelName}" non trouvé. Installez-le avec "ollama pull ${ollamaModelName}"`);
            }
            else if (availability.message && availability.message.includes('timeout')) {
              result.suggestions.unshift('Le modèle prend trop de temps à charger, essayez un modèle plus petit');
            }
            else if (availability.message && availability.message.includes('connect')) {
              result.suggestions.unshift('Impossible de se connecter au serveur Ollama. Vérifiez qu\'il est bien démarré');
            }
          }
        } catch (error) {
          console.error('Erreur lors du test de connectivité pour', modelName, ':', error);
          result.status = 'error';
          result.message = error.message;
          result.suggestions.push('Réessayer dans quelques instants');
          result.suggestions.push('Vérifier la mémoire système disponible');
          
          // Ajouter plus d'informations pour le débogage
          if (this.debugMode) {
            console.log(`Détails d'erreur pour ${ollamaModelName}:`, error);
            result.details.error = error.toString();
            result.details.stack = error.stack;
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors du test de disponibilité du modèle:', error);
      return {
        available: false,
        status: 'error',
        modelName,
        message: error.message,
        details: {},
        suggestions: ['Réessayer plus tard']
      };
    }
  }
  
  /**
   * Définit la clé API OpenAI et la sauvegarde dans le localStorage
   * @param {string} apiKey - La clé API OpenAI
   */
  setApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      console.error('La clé API doit être une chaîne de caractères valide');
      return;
    }
    
    try {
      // Enregistrer la clé en mémoire
      this.apiKey = apiKey;
      
      // Sauvegarder dans le localStorage pour la persistance entre les sessions
      if (window.localStorage) {
        // Masquer légèrement la clé avant le stockage (n'est pas un cryptage sécurisé)
        const encodedKey = btoa(apiKey);
        localStorage.setItem('jodotarot_api_key', encodedKey);
        console.log('Clé API OpenAI sauvegardée dans le localStorage');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la clé API:', error);
    }
  }
  
  /**
   * Charge la clé API depuis le localStorage
   * @returns {string|null} La clé API ou null si non trouvée
   */
  loadApiKey() {
    try {
      if (window.localStorage) {
        const encodedKey = localStorage.getItem('jodotarot_api_key');
        if (encodedKey) {
          // Décoder la clé
          const apiKey = atob(encodedKey);
          this.apiKey = apiKey;
          console.log('Clé API OpenAI chargée depuis le localStorage');
          return apiKey;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la clé API:', error);
    }
    
    return null;
  }
  
  /**
   * Obtient l'interprétation d'un tirage de tarot
   * @param {Array} reading - Les cartes tirées
   * @param {string} question - La question posée
   * @param {string} persona - Le persona sélectionné
   * @param {string} model - Le modèle d'IA à utiliser
   * @param {string} language - La langue (par défaut: 'fr')
   * @param {string} spreadType - Le type de tirage
   * @param {Function} onChunk - Callback pour le streaming (optionnel)
   * @return {Promise<string>} L'interprétation du tirage
   */
  async getInterpretation(reading, question, persona, model, language = 'fr', spreadType = 'cross', onChunk = null) {
    try {
      // Annuler toute interprétation en cours
      this.cancelCurrentInterpretation();
      
      // Créer un nouvel AbortController
      this.currentController = new AbortController();
      this.isGenerating = true;
      
      // Vérifier les paramètres essentiels
      if (!reading || !reading.length || !question.trim()) {
        throw new Error('Les cartes et la question sont requises pour l\'interprétation');
      }
      
      const systemPrompts = await this.buildSystemPrompts(persona, language, spreadType);
      const prompt = this.buildPrompt(reading, question, language, spreadType);
      
      // Mode spécial "prompt" (Sans IA)
      // Ce mode est une fonctionnalité de sécurité et de débogage qui :
      // 1. Est toujours disponible même sans connexion à un service d'IA
      // 2. Affiche les prompts système et utilisateur qui seraient envoyés à l'IA
      // 3. Permet de vérifier et ajuster les prompts sans faire d'appels API
      // 4. Sert de solution de repli si aucun modèle d'IA n'est disponible
      // 5. Aide à la compréhension du système de prompts pour les développeurs
      if (model === 'prompt') {
        console.log('📝 Mode Prompt activé : affichage du prompt sans appel à l\'IA');
        
        // Concaténer simplement les prompts système et utilisateur
        const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
        
        // Affichage minimal sans formatage particulier
        const response = `<div class="prompt-display">${fullPrompt}</div>`;
        
        this.isGenerating = false;
        return response;
      }
      
      // Continuer avec le reste de la logique pour les autres modèles...
      
      // Afficher uniquement le prompt final
      if (this.debugMode) {
        // Construire le prompt complet comme il sera envoyé à l'IA
        const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
        
        console.log('📨 PROMPT FINAL ENVOYÉ À L\'IA:');
        console.log(fullPrompt);
        
        // Afficher des informations supplémentaires sur le persona si possible
        if (PERSONAS[persona]) {
          const personaInstance = new PERSONAS[persona](language);
          console.log(`🧙‍♂️ Persona: ${personaInstance.getName()}`);
          console.log(`📝 Description: ${personaInstance.getDescription()}`);
          console.log(`🔮 Spécialisations: ${personaInstance.getSpecializations().join(', ')}`);
        }
      }
      
      // Obtenir la réponse selon le type de modèle (OpenAI ou Ollama)
      let response;
      
      if (model.startsWith('openai/')) {
        response = await this.getOpenAIResponse(prompt, systemPrompts, model.replace('openai/', ''));
      } else {
        // Si un callback de streaming est fourni, utiliser le streaming pour Ollama
        if (onChunk && typeof onChunk === 'function') {
          try {
            response = await this.getOllamaStreamingResponse(prompt, systemPrompts, model, onChunk, this.currentController.signal);
          } catch (error) {
            // Si l'erreur est due à une annulation, ne pas rejeter mais retourner
            if (error.name === 'AbortError') {
              console.log('Interprétation annulée par l\'utilisateur');
              this.isGenerating = false;
              return "";
            }
            throw error;
          }
        } else {
          response = await this.getOllamaResponse(prompt, systemPrompts, model);
        }
      }
      
      // Marquer la génération comme terminée
      this.isGenerating = false;
      return response;
    } catch (error) {
      this.isGenerating = false;
      console.error("Erreur lors de l'obtention de l'interprétation:", error);
      throw error;
    }
  }
  
  /**
   * Construit les prompts système pour le modèle d'IA
   * @param {string} persona - Persona choisi
   * @param {string} language - Langue
   * @param {string} spreadType - Type de tirage
   * @return {Promise<Array>} Liste des prompts système
   */
  async buildSystemPrompts(persona, language, spreadType) {
    console.log(`🔍 Chargement du prompt pour le persona: ${persona}, langue: ${language}, tirage: ${spreadType}`);
    
    try {
      // Récupérer le prompt spécifique au persona via getPersonaPrompt
      // (maintenant enrichi avec les spécialisations grâce à notre amélioration de BasePersona)
      const personaPrompt = await getPersonaPrompt(persona, language, spreadType);
      
      console.log('📋 Contenu du prompt persona:', personaPrompt);
      
      // Récupérer le métaprompt adapté à la langue
      const metaPrompt = getMetaPrompt(language);
      
      // Prompts de base - le prompt du persona et le métaprompt
      const basePrompts = [
        // Le métaprompt pour définir les règles générales
        metaPrompt,
        // Le prompt principal du persona, déjà enrichi
        personaPrompt
      ];
      
      return basePrompts;
    } catch (error) {
      console.error("Erreur lors du chargement des prompts système:", error);
      // Retourner au moins le métaprompt en cas d'erreur
      return [getMetaPrompt(language)];
    }
  }
  
  /**
   * Construit le prompt principal pour l'interprétation
   * @param {Array} reading - Tableau des cartes tirées
   * @param {string} question - Question posée
   * @param {string} language - Code de langue 
   * @param {string} spreadType - Type de tirage
   * @return {string} Prompt formaté
   */
  buildPrompt(reading, question, language, spreadType = 'cross') {
    // S'assurer que reading est un tableau
    if (!Array.isArray(reading)) {
      console.error('Le paramètre reading doit être un tableau de cartes');
      return `Question: ${question}\n\nErreur: Format de tirage invalide`;
    }
    
    // Créer une instance temporaire du tirage pour générer une description riche
    const spreadInstance = createSpread(spreadType, null, language);
    
    // Copier les cartes dans l'instance de tirage
    spreadInstance.cards = [...reading];
    
    // Générer une description détaillée du tirage avec les cartes
    const spreadDescription = spreadInstance.generateReadingDescription(true);
    
    // Construction du prompt de base
    let promptBase = `${spreadDescription}`;
    
    // Enrichir le prompt avec la question et le texte d'emphase
    return enrichirPromptContextuel(question, promptBase, language);
  }
  
  /**
   * Obtient une réponse d'OpenAI
   * @param {string} prompt - Le prompt principal
   * @param {Array} systemPrompts - Les prompts système
   * @param {string} model - Le modèle OpenAI à utiliser
   * @return {Promise<string>} La réponse générée
   */
  async getOpenAIResponse(prompt, systemPrompts, model) {
    if (!this.apiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }
    
    try {
      const systemContent = systemPrompts.join('\n');
      
      // Format des messages pour OpenAI
      const messages = [
        { role: 'system', content: systemContent },
        { role: 'user', content: prompt }
      ];
      
      // Supprimer les logs détaillés
      
      const response = await fetch(API_URL_OPENAI, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API OpenAI: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Supprimer les logs détaillés
      
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Erreur lors de l\'appel à OpenAI:', error);
      throw error;
    }
  }
  
  /**
   * Utilitaire pour les requêtes fetch avec timeout et réessai
   * @param {string} url - URL de la requête
   * @param {Object} options - Options de fetch
   * @param {number} maxRetries - Nombre maximum de tentatives
   * @param {number} timeoutMs - Délai d'expiration en millisecondes
   * @return {Promise<Response>} - Promesse de réponse
   */
  async fetchWithRetry(url, options, maxRetries = TIMEOUTS.MAX_RETRIES, timeoutMs = TIMEOUTS.OLLAMA_CONNECT) {
    let retries = 0;
    let lastError = null;
    
    while (retries <= maxRetries) {
      try {
        // Créer un contrôleur d'abandon pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        // Ajouter le signal au options
        const optionsWithSignal = {
          ...options,
          signal: controller.signal
        };
        
        try {
          // Tenter la requête
          const response = await fetch(url, optionsWithSignal);
          clearTimeout(timeoutId);
          
          // Si la réponse est OK, la retourner
          if (response.ok) {
            return response;
          }
          
          // Sinon, lire le texte d'erreur et le lancer
          const errorText = await response.text();
          throw new Error(`Erreur API (${response.status}): ${errorText.slice(0, 100)}`);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (error) {
        lastError = error;
        retries++;
        
        const isTimeout = error.name === 'AbortError';
        const retriesLeft = maxRetries - retries + 1;
        
        if (retriesLeft > 0) {
          // Délai exponentiel avec un peu d'aléatoire pour éviter les collisions
          const delay = Math.pow(2, retries) * 1000 + Math.random() * 500;
          console.warn(`Tentative ${retries}/${maxRetries} échouée${isTimeout ? ' (timeout)' : ''}: ${error.message}. Nouvelle tentative dans ${delay/1000} secondes...`);
          
          // Attendre avant de réessayer
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error(`Toutes les tentatives ont échoué (${retries}/${maxRetries}):`, error);
          throw error;
        }
      }
    }
    
    // Ce code ne devrait jamais être atteint, mais par précaution
    throw lastError || new Error("Erreur inconnue pendant les tentatives de connexion");
  }
  
  /**
   * Obtient une réponse d'Ollama
   * @param {string} prompt - Le prompt principal
   * @param {Array} systemPrompts - Les prompts système
   * @param {string} model - Le modèle Ollama à utiliser
   * @return {Promise<string>} La réponse générée
   */
  async getOllamaResponse(prompt, systemPrompts, model) {
    // Construction du payload pour l'API chat
    const systemContent = systemPrompts.join('\n');
    const payload = {
      model: model.replace('ollama:', ''), // Supprimer le préfixe "ollama:" si présent
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: prompt }
      ],
      stream: false
    };
    
    console.log("🔍 DEBUG getOllamaResponse - Payload:", JSON.stringify(payload, null, 2));
    
    try {
      // Obtenir le format de réponse pour ce modèle
      const modelNameWithoutPrefix = model.replace('ollama:', '');
      const modelFormat = getOllamaModelFormat(modelNameWithoutPrefix);
      const responseKey = modelFormat.responseKey || "message.content";
      
      if (this.debugMode) {
        console.log(`🔍 DEBUG getOllamaResponse - Format détecté pour ${modelNameWithoutPrefix}: ${modelFormat.description || responseKey}`);
      }
      
      // Utiliser fetchWithRetry pour une meilleure résilience
      const response = await this.fetchWithRetry(
        API_URL_OLLAMA, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        2,  // maxRetries
        20000 // timeoutMs: 20 secondes
      );
      
      console.log("🔍 DEBUG getOllamaResponse - Statut réponse:", response.status);
      
      // Traiter la réponse
      const data = await response.json();
      if (this.debugMode) {
        console.log("🔍 DEBUG getOllamaResponse - Réponse reçue:", data);
      }
      
      // Utiliser la méthode centralisée pour extraire le contenu
      const responseContent = this.extractResponseContent(data, responseKey, modelNameWithoutPrefix);
      
      return responseContent;
    } catch (error) {
      console.error('Erreur lors de l\'appel à Ollama après plusieurs tentatives:', error);
      throw error;
    }
  }
  
  /**
   * Obtient une réponse en streaming d'Ollama
   * @param {string} prompt - Le prompt utilisateur
   * @param {Array} systemPrompts - Les prompts système
   * @param {string} modelName - Nom du modèle Ollama
   * @param {Function} onChunk - Callback pour chaque morceau de réponse
   * @param {AbortSignal} signal - Signal pour annuler la requête
   * @return {Promise<string>} La réponse complète
   */
  async getOllamaStreamingResponse(prompt, systemPrompts, modelName, onChunk, signal) {
    // Nettoyer le nom du modèle (enlever le préfixe ollama: si présent)
    const cleanModelName = modelName.replace('ollama:', '');
    
    // Construire le prompt complet en combinant les prompts système et le prompt utilisateur
    const fullPrompt = [
      ...systemPrompts,
      prompt
    ].join('\n\n');
    
    // Corps de la requête pour Ollama
    const body = {
      model: cleanModelName,
      prompt: fullPrompt,
      stream: true,
      options: {
        temperature: 0.7,
        num_predict: 1000
      }
    };
    
    try {
      if (this.debugMode) {
        console.log(`🔄 Envoi de la requête en streaming à Ollama (${cleanModelName})`);
        console.log('Prompt complet:', fullPrompt);
        console.log('Corps de la requête:', body);
      }
      
      // Vérifier que le callback est bien une fonction
      if (typeof onChunk !== 'function') {
        throw new Error("Le callback onChunk doit être une fonction");
      }
      
      // Options de la requête
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        signal // Utiliser le signal d'annulation
      };
      
      // Effectuer la requête
      const response = await fetch(API_URL_OLLAMA, options);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erreur Ollama [${response.status}]: ${errorData}`);
      }
      
      // Initialiser le lecteur de flux
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeResponse = '';
      
      // Lire le flux de réponse
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convertir les données binaires en texte
        const chunk = decoder.decode(value, { stream: true });
        
        // Traiter les lignes JSON individuelles
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            // Analyser chaque ligne comme un objet JSON
            const data = JSON.parse(line);
            
            // Extraire le contenu de la réponse
            if (data.response) {
              completeResponse += data.response;
              onChunk(data.response);
            }
          } catch (error) {
            console.error("Erreur lors de l'analyse du chunk JSON:", error);
            // Ne pas interrompre le traitement en cas d'erreur sur un chunk
          }
        }
      }
      
      return completeResponse;
    } catch (error) {
      // Propager l'erreur d'annulation
      if (error.name === 'AbortError') {
        throw error;
      }
      
      console.error("Erreur lors de l'obtention de la réponse streaming Ollama:", error);
      throw new Error(`Erreur lors de la communication avec Ollama: ${error.message}`);
    }
  }
  
  /**
   * Extrait le contenu de la réponse selon le format du modèle
   * @param {Object} data - Données de réponse JSON
   * @param {string} responseKey - Chemin d'accès à la réponse (ex: "message.content")
   * @param {string} modelName - Nom du modèle pour le débogage
   * @return {string} - Le contenu extrait ou chaîne vide si non trouvé
   */
  extractResponseContent(data, responseKey, modelName = "inconnu") {
    if (!data) return "";
    
    // Mode debug pour diagnostiquer les réponses
    if (this.debugMode) {
      console.log(`🔍 DEBUG extractResponseContent - Structure de données pour ${modelName}:`, data);
    }
    
    // 1. Essayer d'extraire selon le chemin défini dans le format du modèle
    try {
      const parts = responseKey.split('.');
      let content = data;
      
      for (const part of parts) {
        if (!content || typeof content !== 'object') {
          if (this.debugMode) {
            console.warn(`⚠️ Chemin ${responseKey} interrompu à "${part}" pour le modèle ${modelName}`);
          }
          break;
        }
        content = content[part];
      }
      
      if (content && typeof content === 'string') {
        if (this.debugMode) {
          console.log(`✅ Contenu extrait avec chemin "${responseKey}" pour le modèle ${modelName}`);
        }
        return content;
      }
    } catch (e) {
      console.warn(`Erreur lors de l'extraction via ${responseKey}:`, e.message);
    }
    
    // 2. Tentatives de récupération par ordre de priorité
    // Format message.content (API chat standard)
    if (data.message && data.message.content) {
      if (this.debugMode) {
        console.log(`ℹ️ Contenu extrait depuis message.content pour ${modelName}`);
      }
      return data.message.content;
    }
    
    // Format response (certains modèles Ollama)
    if (data.response) {
      if (this.debugMode) {
        console.log(`ℹ️ Contenu extrait depuis response pour ${modelName}`);
      }
      return data.response;
    }
    
    // Format content (certains modèles Ollama expérimentaux)
    if (data.content) {
      if (this.debugMode) {
        console.log(`ℹ️ Contenu extrait depuis content pour ${modelName}`);
      }
      return data.content;
    }
    
    // Format spécifique llama3.1
    if (modelName.includes('llama3.1') && data.choices && data.choices.length > 0) {
      const choice = data.choices[0];
      
      if (choice.message && choice.message.content) {
        if (this.debugMode) {
          console.log(`ℹ️ Contenu extrait depuis choices[0].message.content pour ${modelName}`);
        }
        return choice.message.content;
      }
      
      if (choice.content) {
        if (this.debugMode) {
          console.log(`ℹ️ Contenu extrait depuis choices[0].content pour ${modelName}`);
        }
        return choice.content;
      }
      
      if (choice.text) {
        if (this.debugMode) {
          console.log(`ℹ️ Contenu extrait depuis choices[0].text pour ${modelName}`);
        }
        return choice.text;
      }
    }
    
    // 3. Tentative désespérée: chercher un champ qui pourrait contenir du texte
    const excludedKeys = ['model', 'id', 'object', 'created', 'usage', 'system_fingerprint'];
    
    for (const key of Object.keys(data)) {
      // Ignorer les champs de métadonnées qui ne devraient pas contenir le contenu principal
      if (excludedKeys.includes(key)) continue;
      
      const value = data[key];
      if (typeof value === 'string' && value.length > 10) {
        if (this.debugMode) {
          console.warn(`⚠️ Fallback: contenu extrait depuis champ "${key}" pour ${modelName}`);
        }
        return value;
      }
      
      // Vérifier également les objets imbriqués de premier niveau
      if (value && typeof value === 'object') {
        for (const subKey of Object.keys(value)) {
          const subValue = value[subKey];
          if (typeof subValue === 'string' && subValue.length > 10) {
            if (this.debugMode) {
              console.warn(`⚠️ Fallback: contenu extrait depuis champ "${key}.${subKey}" pour ${modelName}`);
            }
            return subValue;
          }
        }
      }
    }
    
    // 4. Échec total: retourner une chaîne vide ou un message d'erreur
    console.error(`❌ Impossible d'extraire le contenu pour le modèle ${modelName}. Format de réponse inconnu:`, data);
    return "";
  }
  
  /**
   * Teste la connectivité avec Ollama
   * @returns {Promise<Object>} Résultat du test avec des informations détaillées
   */
  async testOllamaConnectivity() {
    // Le mode "prompt" est une option spéciale qui :
    // 1. Ne nécessite aucune connectivité réseau
    // 2. Est toujours considéré comme disponible
    // 3. Permet de continuer à utiliser l'application sans IA
    // 4. Sert de solution de secours en cas de problème de connexion
    if (this.stateManager?.getState()?.iaModel === 'prompt') {
      return {
        status: 'success',
        success: true,
        message: 'Mode Prompt toujours disponible',
        details: { mode: 'prompt' },
        suggestions: []
      };
    }

    try {
      // Utiliser la fonction améliorée de l'API
      const result = await testOllamaConnectivity();
      return result;
    } catch (error) {
      console.error("Erreur lors du test de connectivité Ollama:", error);
      return {
        status: 'error',
        success: false,
        message: `Erreur lors du test de connectivité: ${error.message}`,
        details: error,
        suggestions: ['warnings.unexpectedError', 'warnings.tryAgain']
      };
    }
  }

  /**
   * Méthode utilitaire centralisée pour la gestion des erreurs
   * @param {Error} error - L'erreur attrapée
   * @param {string} context - Contexte dans lequel l'erreur s'est produite
   * @param {boolean} rethrow - Si true, l'erreur sera relancée après traitement
   * @returns {Object|null} - Un objet d'erreur formaté ou null
   */
  handleServiceError(error, context, rethrow = false) {
    // Standardiser le format de l'erreur
    const errorInfo = {
      message: error.message || 'Erreur inconnue',
      context: context,
      timestamp: new Date().toISOString(),
      type: error.name || 'Error',
      stack: this.debugMode ? error.stack : null
    };
    
    // Log de l'erreur avec contexte
    console.error(`AIService - Erreur dans ${context}:`, errorInfo);
    
    // Mettre à jour l'état
    this.isGenerating = false;
    
    // Relancer l'erreur si demandé
    if (rethrow) {
      throw error;
    }
    
    return errorInfo;
  }

  /**
   * Traiter les erreurs spécifiques à l'API OpenAI
   * @param {Error} error - L'erreur d'origine
   * @param {string} context - Contexte dans lequel l'erreur s'est produite
   * @returns {string} - Message d'erreur utilisateur
   */
  handleOpenAIError(error, context) {
    let userMessage = "Une erreur est survenue lors de la communication avec OpenAI.";
    
    // Vérifier si c'est une erreur de clé API ou d'authentification
    if (error.message && (
        error.message.includes('API key') ||
        error.message.includes('authentication') ||
        error.message.includes('401')
    )) {
      userMessage = "Erreur d'authentification OpenAI. Vérifiez votre clé API.";
      
      // Réinitialiser la clé API dans le localStorage
      localStorage.removeItem('openai_api_key');
    }
    
    this.handleServiceError(error, context);
    return userMessage;
  }

  /**
   * Traiter les erreurs spécifiques à Ollama
   * @param {Error} error - L'erreur d'origine
   * @param {string} context - Contexte dans lequel l'erreur s'est produite
   * @returns {string} - Message d'erreur utilisateur
   */
  handleOllamaError(error, context) {
    let userMessage = "Une erreur est survenue lors de la communication avec Ollama.";
    
    // Vérifier si c'est une erreur de connexion
    if (error.message && (
        error.message.includes('network') ||
        error.message.includes('fetch') ||
        error.message.includes('connect')
    )) {
      userMessage = "Impossible de se connecter à Ollama. Vérifiez que le service est bien lancé.";
    }
    
    this.handleServiceError(error, context);
    return userMessage;
  }
}

export default AIService; 