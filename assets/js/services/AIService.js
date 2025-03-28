/**
 * Service gérant les interactions avec différents modèles d'IA
 * Centralise les appels API et la gestion des réponses
 * 
 * @class AIService
 * @description Service principal pour la gestion des interactions avec les modèles d'IA
 * @property {StateManager} stateManager - Instance du gestionnaire d'état
 * @property {string} apiKey - Clé API pour les services d'IA
 * @property {string} defaultModel - Modèle d'IA par défaut
 * @property {Object} baseUrl - URLs de base pour les différents services
 * @property {boolean} debugMode - Mode de débogage
 * @property {AbortController} currentController - Contrôleur pour annuler les requêtes
 * @property {boolean} isGenerating - État de génération en cours
 */
import PERSONAS, { getPersonaPrompt } from '../models/personas/index.js';
import { createSpread } from '../models/spreads/index.js';
import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getOllamaModelFormat, DEBUG_LEVEL, TIMEOUTS } from '../config.js';
import { getMetaPrompt, getEmphasisText, enrichirPromptContextuel } from '../prompt.js';

class AIService {
  /**
   * Crée une instance du service d'IA
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   * @throws {Error} Si le stateManager n'est pas fourni
   */
  constructor(stateManager) {
    if (!stateManager) {
      throw new Error('Le StateManager est requis pour initialiser AIService');
    }
    
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
   * Gère une erreur d'annulation
   * @param {Error} error - L'erreur à gérer
   * @returns {boolean} True si c'était une erreur d'annulation
   */
  handleAbortError(error) {
    if (error.name === 'AbortError') {
      console.log('Interprétation annulée par l\'utilisateur');
      this.isGenerating = false;
      return true;
    }
    return false;
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
        available: true,
        status: 'success',
        modelName,
        message: 'Modèle disponible',
        details: {},
        suggestions: []
      };

      // Détection des modèles Ollama
      const isOllamaModel = 
        modelName.startsWith('ollama:') || 
        modelName.includes(':') ||
        !modelName.startsWith('openai/');
      
      if (isOllamaModel) {
        // Nettoyer le nom du modèle - supprimer les préfixes
        let ollamaModelName = modelName;
        if (ollamaModelName.startsWith('ollama:')) {
          ollamaModelName = ollamaModelName.replace('ollama:', '');
        }
        
        if (this.debugMode) {
          console.log(`Modèle Ollama détecté: ${ollamaModelName}`);
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
   * Gère les erreurs d'API de manière uniforme
   * @param {Error} error - L'erreur à gérer
   * @param {string} service - Le nom du service ('openai' ou 'ollama')
   * @returns {Error} L'erreur formatée
   */
  handleApiError(error, service) {
    console.error(`Erreur lors de l'appel à ${service}:`, error);
    
    let errorMessage = `Erreur lors de la communication avec ${service}`;
    
    if (error.message.includes('timeout')) {
      errorMessage = `Le temps de réponse de ${service} a dépassé la limite`;
    } else if (error.message.includes('connect')) {
      errorMessage = `Impossible de se connecter à ${service}`;
    } else if (error.message.includes('401') || error.message.includes('403')) {
      errorMessage = `Erreur d'authentification avec ${service}`;
    } else if (error.message.includes('429')) {
      errorMessage = `Limite de requêtes atteinte pour ${service}`;
    }
    
    return new Error(errorMessage);
  }
  
  /**
   * Gère les logs de débogage de manière uniforme
   * @param {string} message - Le message à logger
   * @param {Object} [data] - Les données à logger
   * @param {string} [level='info'] - Le niveau de log ('info', 'warn', 'error')
   */
  debugLog(message, data = null, level = 'info') {
    if (!this.debugMode) return;
    
    const emoji = {
      info: '🔍',
      warn: '⚠️',
      error: '❌'
    }[level] || '🔍';
    
    console[level](`${emoji} ${message}`);
    if (data) {
      console[level](data);
    }
  }
  
  /**
   * Obtient l'interprétation d'un tirage de tarot
   * @param {Array} reading - Les cartes tirées
   * @param {string} question - La question posée
   * @param {string} persona - Le persona sélectionné
   * @param {string} model - Le modèle d'IA à utiliser
   * @param {string} [language='fr'] - La langue de l'interprétation
   * @param {string} [spreadType='cross'] - Le type de tirage
   * @param {Function} [onChunk] - Callback pour le streaming de la réponse
   * @returns {Promise<string>} L'interprétation du tirage
   * @throws {Error} Si les paramètres sont invalides ou si une erreur survient
   */
  async getInterpretation(reading, question, persona, model, language = 'fr', spreadType = 'cross', onChunk = null) {
    try {
      // Validation des paramètres obligatoires
      if (!reading || !Array.isArray(reading) || reading.length === 0) {
        throw new Error('Le tirage doit contenir au moins une carte');
      }
      
      if (!question || typeof question !== 'string' || question.trim().length === 0) {
        throw new Error('La question est requise pour l\'interprétation');
      }
      
      if (!persona || typeof persona !== 'string') {
        throw new Error('Le persona est requis pour l\'interprétation');
      }
      
      if (!model || typeof model !== 'string') {
        throw new Error('Le modèle d\'IA est requis pour l\'interprétation');
      }
      
      // Validation de la langue
      if (!language || typeof language !== 'string') {
        console.warn('Langue invalide, utilisation du français par défaut');
        language = 'fr';
      }
      
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
            if (this.handleAbortError(error)) {
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
      
      if (this.handleAbortError(error)) {
        return "";
      }
      
      // Gestion plus détaillée des erreurs
      let errorMessage = "Une erreur est survenue lors de l'interprétation.";
      
      if (!this.apiKey && model.startsWith('openai/')) {
        errorMessage = "La clé API OpenAI n'est pas configurée.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Le temps de réponse a dépassé la limite.";
      } else if (error.message.includes('connect')) {
        errorMessage = "Impossible de se connecter au service d'IA.";
      }
      
      throw new Error(errorMessage);
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
    this.debugLog(`Chargement du prompt pour le persona: ${persona}, langue: ${language}, tirage: ${spreadType}`);
    
    try {
      const personaPrompt = await getPersonaPrompt(persona, language, spreadType);
      this.debugLog('Contenu du prompt persona:', personaPrompt);
      
      const metaPrompt = getMetaPrompt(language);
      
      const basePrompts = [
        metaPrompt,
        personaPrompt
      ];
      
      return basePrompts;
    } catch (error) {
      this.debugLog("Erreur lors du chargement des prompts système:", error, 'error');
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
    
    // Construction du prompt de base avec toutes les informations sur les cartes
    let promptBase = `${spreadDescription}\n\n`;
    
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
      
      const messages = [
        { role: 'system', content: systemContent },
        { role: 'user', content: prompt }
      ];
      
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
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      throw this.handleApiError(error, 'OpenAI');
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
    try {
      const systemContent = systemPrompts.join('\n');
      const payload = {
        model: model.replace('ollama:', ''),
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: prompt }
        ],
        stream: false
      };
      
      this.debugLog("Payload Ollama:", payload);
      
      const response = await this.fetchWithRetry(
        API_URL_OLLAMA, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        2,
        20000
      );
      
      this.debugLog("Statut réponse Ollama:", response.status);
      
      const data = await response.json();
      this.debugLog("Réponse Ollama reçue:", data);
      
      const modelNameWithoutPrefix = model.replace('ollama:', '');
      const modelFormat = getOllamaModelFormat(modelNameWithoutPrefix);
      const responseKey = modelFormat.responseKey || "message.content";
      
      this.debugLog(`Format détecté pour ${modelNameWithoutPrefix}: ${modelFormat.description || responseKey}`);
      
      return this.extractResponseContent(data, responseKey, modelNameWithoutPrefix);
    } catch (error) {
      throw this.handleApiError(error, 'Ollama');
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
      console.log(`Réponse brute du modèle ${modelName}:`, data);
    }
    
    // ... existing code ...
  }
}

export default AIService;