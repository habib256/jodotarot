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
import { getPersonaPrompt } from '../models/personas/index.js';
import { createSpread } from '../models/spreads/index.js';
import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getOllamaModelFormat, DEBUG_LEVEL, TIMEOUTS } from '../config.js';
import { getMetaPrompt, enrichirPromptContextuel } from '../prompt.js';

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
      ollama: API_URL_OLLAMA.replace('/api/generate', ''),
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

      // Annuler la requête en cours
      this.currentController.abort();
      this.currentController = null;
      this.isGenerating = false;
      
      return true;
    }
    return false;
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

      // Cas OpenAI: vérifier la présence de la clé et la connectivité minimale
      if (modelName && modelName.startsWith('openai/')) {
        if (!this.apiKey) {
          return {
            available: false,
            status: 'error',
            modelName,
            message: 'Clé API OpenAI manquante',
            details: {},
            suggestions: ['Ajouter une clé via le dialogue de configuration']
          };
        }
        const ping = await this.testOpenAIConnectivity();
        return {
          available: !!ping.available,
          status: ping.status,
          modelName,
          message: ping.message,
          details: ping,
          suggestions: ping.available ? [] : ['Vérifier la clé API', 'Réessayer plus tard']
        };
      }

      // Cas Ollama: la liste des modèles provient déjà du serveur Ollama,
      // un modèle proposé dans le sélecteur est donc considéré disponible.
      return {
        available: true,
        status: 'success',
        modelName,
        message: 'Modèle disponible',
        details: {},
        suggestions: []
      };
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
      const encodedKey = localStorage.getItem('jodotarot_api_key');
      if (encodedKey) {
        return atob(encodedKey);
      }
    } catch (error) {
      console.warn('Clé API illisible, suppression de l\'entrée corrompue:', error.message);
      try {
        localStorage.removeItem('jodotarot_api_key');
      } catch {
        // localStorage indisponible: rien de plus à faire
      }
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
    const details = error?.message || '';

    if (details.includes('timeout')) {
      errorMessage = `Le temps de réponse de ${service} a dépassé la limite`;
    } else if (details.includes('connect')) {
      errorMessage = `Impossible de se connecter à ${service}`;
    } else if (details.includes('401') || details.includes('403')) {
      errorMessage = `Erreur d'authentification avec ${service}`;
    } else if (details.includes('429')) {
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
      
      // Une seule instance de tirage sert au nom localisé et à la description
      const spread = createSpread(spreadType, null, language);
      spread.cards = [...reading];

      const systemPrompts = await this.buildSystemPrompts(persona, language, spread.getName());
      const prompt = this.buildPrompt(spread, question, language);
      
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
        
        // Retourner du texte brut (aucun HTML) pour un affichage en texte uniquement
        this.isGenerating = false;
        return fullPrompt;
      }
      
      // Continuer avec le reste de la logique pour les autres modèles...
      
      // Afficher uniquement le prompt final
      if (this.debugMode) {
        // Construire le prompt complet comme il sera envoyé à l'IA
        const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
        
        console.log('📨 PROMPT FINAL ENVOYÉ À L\'IA:');
        console.log(fullPrompt);
        
        // Journaliser le persona sélectionné (sans instanciation dynamique)
        console.log(`🧙‍♂️ Persona sélectionné: ${persona}`);
      }
      
      // Obtenir la réponse selon le type de modèle (OpenAI ou Ollama)
      let response;
      
      const signal = this.currentController.signal;

      if (model.startsWith('openai/')) {
        response = await this.getOpenAIResponse(prompt, systemPrompts, model.replace('openai/', ''), signal);
      } else if (typeof onChunk === 'function') {
        // Streaming Ollama pour un affichage progressif
        response = await this.getOllamaStreamingResponse(prompt, systemPrompts, model, onChunk, signal);
      } else {
        response = await this.getOllamaResponse(prompt, systemPrompts, model, signal);
      }
      
      // Marquer la génération comme terminée
      this.isGenerating = false;
      return response;
    } catch (error) {
      this.isGenerating = false;

      // Annulation demandée par l'utilisateur: ce n'est pas une erreur,
      // l'appelant conserve le texte déjà reçu et le signale à sa façon.
      if (error.name === 'AbortError') {
        console.log('Interprétation annulée par l\'utilisateur');
        throw error;
      }

      console.error("Erreur lors de l'obtention de l'interprétation:", error);

      // Gestion plus détaillée des erreurs
      let errorMessage = "Une erreur est survenue lors de l'interprétation.";
      const details = error?.message || '';

      if (!this.apiKey && model.startsWith('openai/')) {
        errorMessage = "La clé API OpenAI n'est pas configurée.";
      } else if (details.includes('timeout')) {
        errorMessage = "Le temps de réponse a dépassé la limite.";
      } else if (details.includes('connect')) {
        errorMessage = "Impossible de se connecter au service d'IA.";
      }

      throw new Error(errorMessage);
    }
  }
  
  /**
   * Construit les prompts système pour le modèle d'IA
   * @param {string} persona - Persona choisi
   * @param {string} language - Langue
   * @param {string} spreadName - Nom localisé du tirage
   * @return {Promise<Array>} Liste des prompts système
   */
  async buildSystemPrompts(persona, language, spreadName) {
    this.debugLog(`Chargement du prompt pour le persona: ${persona}, langue: ${language}, tirage: ${spreadName}`);

    try {
      const personaPrompt = await getPersonaPrompt(persona, language, spreadName);
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
   * @param {BaseSpread} spread - Instance de tirage contenant les cartes tirées
   * @param {string} question - Question posée
   * @param {string} language - Code de langue
   * @return {string} Prompt formaté
   */
  buildPrompt(spread, question, language) {
    // Description du tirage sans les descriptions détaillées, pour limiter la longueur
    const spreadDescription = spread.generateReadingDescription(false);

    // Enrichir le prompt avec la question et le texte d'emphase
    return enrichirPromptContextuel(question, `${spreadDescription}\n\n`, language);
  }
  
  /**
   * Obtient une réponse d'OpenAI
   * @param {string} prompt - Le prompt principal
   * @param {Array} systemPrompts - Les prompts système
   * @param {string} model - Le modèle OpenAI à utiliser
   * @param {AbortSignal} [signal] - Signal permettant d'annuler la requête
   * @return {Promise<string>} La réponse générée
   */
  async getOpenAIResponse(prompt, systemPrompts, model, signal) {
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
        }),
        signal
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API OpenAI: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw this.handleApiError(error, 'OpenAI');
    }
  }
  
  /**
   * Utilitaire pour les requêtes fetch avec timeout et réessai.
   * Une annulation demandée par l'utilisateur (via `signal`) interrompt
   * immédiatement les tentatives, contrairement à une erreur réseau.
   * @param {string} url - URL de la requête
   * @param {Object} options - Options de fetch
   * @param {AbortSignal} [userSignal] - Signal d'annulation utilisateur
   * @param {number} [maxRetries] - Nombre maximum de tentatives supplémentaires
   * @param {number} [timeoutMs] - Délai d'expiration par tentative
   * @return {Promise<Response>} - Promesse de réponse
   */
  async fetchWithRetry(url, options, userSignal = null, maxRetries = TIMEOUTS.MAX_RETRIES, timeoutMs = TIMEOUTS.OLLAMA_RESPONSE) {
    // Erreur d'annulation à propager sans nouvelle tentative
    const userAbortError = () => {
      const error = new Error('Generation aborted by user');
      error.name = 'AbortError';
      return error;
    };

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      // L'utilisateur a pu annuler pendant le délai d'attente précédent
      if (userSignal?.aborted) {
        throw userAbortError();
      }

      // Contrôleur combinant le timeout et l'annulation utilisateur
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const abortFromUser = () => controller.abort();
      userSignal?.addEventListener('abort', abortFromUser);

      try {
        const response = await fetch(url, { ...options, signal: controller.signal });

        if (response.ok) {
          return response;
        }

        const errorText = await response.text();
        throw new Error(`Erreur API (${response.status}): ${errorText.slice(0, 100)}`);
      } catch (error) {
        // Annulation explicite de l'utilisateur: ne pas réessayer
        if (userSignal?.aborted) {
          throw userAbortError();
        }

        if (attempt === maxRetries) {
          console.error(`Toutes les tentatives ont échoué (${attempt + 1}/${maxRetries + 1}):`, error);
          throw error;
        }

        // Délai exponentiel avec un peu d'aléatoire pour éviter les collisions
        const delay = Math.pow(2, attempt + 1) * 1000 + Math.random() * 500;
        const isTimeout = error.name === 'AbortError';
        console.warn(`Tentative ${attempt + 1}/${maxRetries + 1} échouée${isTimeout ? ' (timeout)' : ''}: ${error.message}. Nouvelle tentative dans ${(delay / 1000).toFixed(1)}s...`);

        clearTimeout(timeoutId);
        userSignal?.removeEventListener('abort', abortFromUser);
        await new Promise(resolve => setTimeout(resolve, delay));
      } finally {
        clearTimeout(timeoutId);
        userSignal?.removeEventListener('abort', abortFromUser);
      }
    }
  }

  /**
   * Obtient une réponse d'Ollama
   * @param {string} prompt - Le prompt principal
   * @param {Array} systemPrompts - Les prompts système
   * @param {string} model - Le modèle Ollama à utiliser
   * @param {AbortSignal} [signal] - Signal permettant d'annuler la requête
   * @return {Promise<string>} La réponse générée
   */
  async getOllamaResponse(prompt, systemPrompts, model, signal) {
    try {
      // Construire un prompt complet compatible avec /api/generate
      const fullPrompt = [
        ...systemPrompts,
        prompt
      ].join('\n\n');
      
      const payload = {
        model: model.replace('ollama:', ''),
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1000
        }
      };
      
      this.debugLog("Payload Ollama:", payload);
      
      const response = await this.fetchWithRetry(
        API_URL_OLLAMA, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        },
        signal,
        2
      );
      
      this.debugLog("Statut réponse Ollama:", response.status);
      
      const data = await response.json();
      this.debugLog("Réponse Ollama reçue:", data);
      
      const modelNameWithoutPrefix = model.replace('ollama:', '');
      const modelFormat = getOllamaModelFormat(modelNameWithoutPrefix);
      const responseKey = modelFormat.responseKey || "response";
      
      this.debugLog(`Format détecté pour ${modelNameWithoutPrefix}: ${modelFormat.description || responseKey}`);
      
      return this.extractResponseContent(data, responseKey, modelNameWithoutPrefix);
    } catch (error) {
      if (error.name === 'AbortError') throw error;
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
    
    // Parcourir le chemin de clé (ex: "choices.0.message.content")
    try {
      const segments = String(responseKey).split('.');
      let cursor = data;
      for (const seg of segments) {
        if (cursor == null) break;
        if (/^\d+$/.test(seg)) {
          const idx = Number(seg);
          cursor = Array.isArray(cursor) ? cursor[idx] : undefined;
        } else {
          cursor = cursor[seg];
        }
      }
      if (typeof cursor === 'string') {
        return cursor;
      }
      // Fallbacks connus
      if (typeof data.response === 'string') return data.response;
      if (data.message && typeof data.message.content === 'string') return data.message.content;
      if (Array.isArray(data.choices) && data.choices[0]?.message?.content) return data.choices[0].message.content;
    } catch (e) {
      console.warn('Impossible d\'extraire le contenu de la réponse:', e);
    }
    
    return "";
  }

  /**
   * Teste la connectivité avec OpenAI
   * @returns {Promise<{status: string, available: boolean, message: string}>}
   */
  async testOpenAIConnectivity() {
    try {
      const state = this.stateManager.getState?.() || {};
      let model = state.iaModel && state.iaModel.startsWith('openai/')
        ? state.iaModel.replace('openai/', '')
        : 'gpt-3.5-turbo';
      
      if (!this.apiKey) {
        return {
          status: 'error',
          available: false,
          message: "Clé API OpenAI manquante"
        };
      }
      
      const response = await fetch(API_URL_OPENAI, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'ping' },
            { role: 'user', content: 'ping' }
          ],
          temperature: 0
        })
      });
      
      if (!response.ok) {
        return {
          status: 'error',
          available: false,
          message: `Erreur OpenAI: ${response.status}`
        };
      }
      
      return {
        status: 'success',
        available: true,
        message: 'Connexion OpenAI valide'
      };
    } catch (error) {
      return {
        status: 'error',
        available: false,
        message: error.message || 'Erreur de connexion OpenAI'
      };
    }
  }
}

export default AIService;