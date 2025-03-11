/**
 * Service gérant les interactions avec différents modèles d'IA
 * Centralise les appels API et la gestion des réponses
 */
import PERSONAS, { getPersonaPrompt } from '../models/personas/index.js';
import { createSpread } from '../models/spreads/index.js';
import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getOllamaModelFormat, DEBUG_LEVEL } from '../config.js';
import { getMetaPrompt, getEmphasisText, enrichirPromptContextuel } from '../prompt.js';
import { testOllamaConnectivity } from '../api.js';

class AIService {
  constructor() {
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
    
    // Cache pour les résultats d'interprétation
    this.interpreterCache = {};
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
      console.log(`Test de disponibilité du modèle: ${modelName}`);
      
      // Résultat par défaut
      const result = {
        available: false,
        status: 'error',
        modelName,
        message: '',
        details: {},
        suggestions: []
      };
      
      // Vérifier le format du modèle
      if (!modelName) {
        result.message = 'Aucun modèle spécifié';
        return result;
      }
      
      // Définir un timeout pour le test de connectivité
      // Timeout plus long pour les modèles plus complexes comme llama3.1
      const timeout = modelName.includes('llama3.1') ? 20000 : 10000; // 20 secondes pour llama3.1, 10 secondes pour les autres
      
      // Gestion des modèles Ollama (y compris avec format llama3.1:latest)
      if (modelName.startsWith('ollama:') || modelName.includes(':')) {
        const ollamaModelName = modelName.startsWith('ollama:') 
          ? modelName.replace('ollama:', '') 
          : modelName; // Pour gérer les cas comme llama3.1:latest directement
        
        try {
          // Utiliser Promise.race pour ajouter un timeout
          const availabilityPromise = testOllamaConnectivity(ollamaModelName);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout lors du test de connectivité')), timeout)
          );
          
          const availability = await Promise.race([availabilityPromise, timeoutPromise]);
          
          result.available = availability.success;
          result.status = availability.success ? 'success' : 'error';
          result.message = availability.message;
          result.details = availability.details || {};
          
          // Suggérer des alternatives en cas d'échec
          if (!availability.success) {
            result.suggestions.push('Vérifier que le serveur Ollama est bien démarré');
            result.suggestions.push('Vérifier que le modèle est correctement installé dans Ollama');
          }
        } catch (error) {
          console.warn(`Erreur lors du test de connectivité pour ${modelName}:`, error);
          result.message = `Erreur lors du test du modèle: ${error.message}`;
          result.suggestions.push('Vérifier que le serveur Ollama est bien démarré');
          
          // Si c'est un timeout, ajouter des suggestions spécifiques
          if (error.message.includes('Timeout')) {
            result.message = `Le serveur Ollama ne répond pas dans le délai imparti (${timeout/1000}s)`;
            result.suggestions.push('Vérifier la charge du serveur Ollama');
            result.suggestions.push('Augmenter le timeout dans les paramètres');
          }
        }
        
        // Retourner explicitement le résultat pour les modèles Ollama
        return result;
      } else if (modelName.startsWith('openai/')) {
        // Test de connectivité pour OpenAI
        const modelId = modelName.replace('openai/', '');
        result.details.type = 'openai';
        result.details.modelId = modelId;
        
        if (!this.apiKey) {
          result.message = 'Clé API OpenAI manquante';
          result.suggestions.push('Configurer une clé API');
          return result;
        }
        
        try {
          const response = await this.fetchWithRetry(
            `${this.baseUrl.openai}/models`, 
            {
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
              }
            },
            1,  // maxRetries
            5000 // timeoutMs: 5 secondes
          );
          
          if (!response.ok) {
            result.message = `Erreur OpenAI: ${response.status} ${response.statusText}`;
            result.details.statusCode = response.status;
            
            // Suggestions spécifiques selon le code d'erreur
            if (response.status === 401) {
              result.suggestions.push('Vérifier la validité de la clé API');
            } else if (response.status === 429) {
              result.suggestions.push('Limite de requêtes atteinte, réessayer plus tard');
            } else {
              result.suggestions.push('Vérifier la connexion au service OpenAI');
            }
            
            return result;
          }
          
          // API accessible, vérifier si le modèle spécifique est disponible
          const data = await response.json();
          const availableModels = data.data || [];
          const modelExists = availableModels.some(m => m.id === modelId);
          
          if (modelExists) {
            result.available = true;
            result.status = 'success';
            result.message = `Modèle ${modelId} disponible`;
          } else {
            result.message = `Modèle ${modelId} non trouvé dans la liste des modèles disponibles`;
            result.suggestions.push('Vérifier le nom du modèle spécifié');
            result.suggestions.push('Utiliser un modèle standard comme gpt-3.5-turbo');
          }
          
          return result;
        } catch (error) {
          result.message = `Erreur de connexion à OpenAI: ${error.message}`;
          result.suggestions.push('Vérifier la connexion internet');
          result.suggestions.push('Vérifier la disponibilité des serveurs OpenAI');
          return result;
        }
        
      } else {
        // Type de modèle non reconnu
        result.message = `Type de modèle non reconnu: ${modelName}`;
        result.details.invalidPrefix = true;
        result.suggestions.push('Utiliser un préfixe valide: openai/ ou ollama:');
        return result;
      }
    } catch (error) {
      console.error(`Erreur lors du test de disponibilité pour ${modelName}:`, error);
      return {
        available: false,
        status: 'error',
        modelName,
        message: `Erreur inattendue: ${error.message}`,
        details: { unexpectedError: true },
        suggestions: ['Vérifier les logs pour plus de détails']
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
    // Vérifier les paramètres essentiels
    if (!reading || !reading.length || !question.trim()) {
      throw new Error('Les cartes et la question sont requises pour l\'interprétation');
    }
    
    const systemPrompts = this.buildSystemPrompts(persona, language, spreadType);
    const prompt = this.buildPrompt(reading, question, language, spreadType);
    
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
    
    // Si un callback de streaming est fourni, utiliser le mode streaming
    if (onChunk && typeof onChunk === 'function') {
      if (model.startsWith('openai/')) {
        // OpenAI ne supporte pas facilement le streaming dans cette implémentation
        return this.getOpenAIResponse(prompt, systemPrompts, model.replace('openai/', ''));
      } else {
        return this.getOllamaStreamingResponse(prompt, systemPrompts, model, onChunk);
      }
    } else {
      // Mode standard sans streaming
      if (model.startsWith('openai/')) {
        return this.getOpenAIResponse(prompt, systemPrompts, model.replace('openai/', ''));
      } else {
        return this.getOllamaResponse(prompt, systemPrompts, model);
      }
    }
  }
  
  /**
   * Construit les prompts système pour l'IA
   * @param {string} persona - Persona choisi
   * @param {string} language - Langue
   * @param {string} spreadType - Type de tirage
   * @return {Array} Liste des prompts système
   */
  buildSystemPrompts(persona, language, spreadType) {
    // Récupérer le prompt spécifique au persona via getPersonaPrompt
    // (maintenant enrichi avec les spécialisations grâce à notre amélioration de BasePersona)
    const personaPrompt = getPersonaPrompt(persona, language, spreadType);
    
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
  async fetchWithRetry(url, options, maxRetries = 2, timeoutMs = 15000) {
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
   * @param {string} prompt - Le prompt principal
   * @param {Array} systemPrompts - Les prompts système
   * @param {string} model - Le modèle Ollama à utiliser
   * @param {Function} onChunk - Callback appelé pour chaque fragment de réponse
   * @return {Promise<string>} La réponse complète
   */
  async getOllamaStreamingResponse(prompt, systemPrompts, model, onChunk) {
    // Construction du payload pour l'API chat
    const systemContent = systemPrompts.join('\n');
    const payload = {
      model: model.replace('ollama:', ''), // Supprimer le préfixe "ollama:" si présent
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: prompt }
      ],
      stream: true
    };
    
    console.log("🔍 DEBUG getOllamaStreamingResponse - Payload:", JSON.stringify(payload, null, 2));
    
    try {
      // Obtenir le format de réponse pour ce modèle
      const modelNameWithoutPrefix = model.replace('ollama:', '');
      const modelFormat = getOllamaModelFormat(modelNameWithoutPrefix);
      const responseKey = modelFormat.responseKey || "message.content";
      
      if (this.debugMode) {
        console.log(`🔍 DEBUG getOllamaStreamingResponse - Format détecté pour ${modelNameWithoutPrefix}: ${modelFormat.description || responseKey}`);
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
        20000  // timeoutMs: 20 secondes
      );
      
      console.log("🔍 DEBUG getOllamaStreamingResponse - Statut réponse:", response.status);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            // Utiliser la méthode centralisée pour extraire le contenu
            const responseContent = this.extractResponseContent(data, responseKey, modelNameWithoutPrefix);
            
            if (responseContent) {
              onChunk(responseContent);
              fullResponse += responseContent;
            }
          } catch (e) {
            console.warn('Erreur de parsing JSON:', e);
          }
        }
      }
      
      return fullResponse;
    } catch (error) {
      console.error('Erreur lors du streaming Ollama après plusieurs tentatives:', error);
      throw error;
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
}

export default AIService; 