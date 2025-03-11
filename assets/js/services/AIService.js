/**
 * Service gérant les interactions avec différents modèles d'IA
 * Centralise les appels API et la gestion des réponses
 */
import PERSONAS, { getPersonaPrompt } from '../models/personas/index.js';
import { createSpread } from '../models/spreads/index.js';
import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getOllamaModelFormat } from '../config.js';
import { getMetaPrompt, getEmphasisText, enrichirPromptContextuel } from '../prompt.js';

class AIService {
  constructor() {
    this.apiKey = API_KEY !== "YOUR API KEY" ? API_KEY : null;
    this.defaultModel = 'openai/gpt-3.5-turbo';
    this.baseUrl = {
      ollama: API_URL_OLLAMA.replace('/api/chat', ''),
      openai: API_URL_OPENAI.replace('/v1/chat/completions', '/v1')
    };
    this.debugMode = true; // Activer le mode debug pour afficher les prompts
  }
  
  /**
   * Récupère la liste des modèles Ollama disponibles
   * @return {Promise<Array>} Liste des modèles disponibles
   */
  async getOllamaModels() {
    try {
      const response = await fetch(API_URL_OLLAMA_TAGS);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles Ollama:', error);
      return [];
    }
  }
  
  /**
   * Trouve un modèle Llama3 parmi les modèles Ollama disponibles
   * @param {Array} models - Liste des modèles disponibles
   * @return {Object|null} Le modèle Llama3 trouvé ou null
   */
  findLlama3Model(models) {
    if (!models || !Array.isArray(models) || models.length === 0) {
      return null;
    }
    
    // Patterns pour identifier un modèle Llama3
    const llama3Patterns = [
      /llama3/i,
      /llama-3/i,
      /llama_3/i
    ];
    
    // Chercher d'abord un modèle qui contient explicitement "llama3"
    for (const pattern of llama3Patterns) {
      const foundModel = models.find(model => pattern.test(model.name));
      if (foundModel) {
        console.log(`Modèle Llama3 trouvé: ${foundModel.name}`);
        return foundModel;
      }
    }
    
    // Si aucun modèle Llama3 n'est trouvé, retourner null
    console.log('Aucun modèle Llama3 trouvé parmi les modèles Ollama disponibles');
    return null;
  }
  
  /**
   * Teste la connectivité avec un modèle spécifique
   * @param {string} modelName - Nom du modèle à tester
   * @return {Promise<boolean>} Disponibilité du modèle
   */
  async testConnectivity(modelName) {
    try {
      if (modelName.startsWith('openai/')) {
        // Test de connectivité pour OpenAI
        if (!this.apiKey) {
          return false;
        }
        
        const response = await fetch(`${this.baseUrl.openai}/models`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        return response.ok;
      } else {
        // Test de connectivité pour Ollama
        const response = await fetch(API_URL_OLLAMA_TAGS);
        if (!response.ok) {
          return false;
        }
        
        // Vérifier si le modèle est disponible
        const data = await response.json();
        return data.models?.some(model => model.name === modelName) || false;
      }
    } catch (error) {
      console.error(`Erreur lors du test de connectivité pour ${modelName}:`, error);
      return false;
    }
  }
  
  /**
   * Configure la clé API pour OpenAI
   * @param {string} apiKey - Clé API OpenAI
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
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
   * @param {Array} reading - Les cartes tirées
   * @param {string} question - La question posée
   * @param {string} language - La langue
   * @param {string} spreadType - Le type de tirage (cross, horseshoe, love, celticCross)
   * @return {string} Le prompt formaté
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
   * Obtient une réponse d'Ollama
   * @param {string} prompt - Le prompt principal
   * @param {Array} systemPrompts - Les prompts système
   * @param {string} model - Le modèle Ollama à utiliser
   * @return {Promise<string>} La réponse générée
   */
  async getOllamaResponse(prompt, systemPrompts, model) {
    try {
      const systemContent = systemPrompts.join('\n');
      
      // Journalisation de débogage pour l'URL et le modèle
      const generateUrl = API_URL_OLLAMA.replace('/api/chat', '/api/generate');
      console.log("🔍 DEBUG getOllamaResponse - URL Ollama:", generateUrl);
      console.log("🔍 DEBUG getOllamaResponse - Modèle utilisé:", model);
      
      // Construction d'un prompt combiné pour /api/generate
      const combinedPrompt = `${systemContent}\n\n${prompt}`;
      
      // Construction du payload pour l'API generate
      const payload = {
        model: model.replace('ollama/', ''), // Supprimer le préfixe "ollama/" si présent
        prompt: combinedPrompt,
        stream: false
      };
      
      console.log("🔍 DEBUG getOllamaResponse - Payload:", JSON.stringify(payload, null, 2));
      
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log("🔍 DEBUG getOllamaResponse - Statut réponse:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔍 DEBUG getOllamaResponse - Erreur détaillée:", errorText);
        throw new Error(`Erreur API Ollama: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log("🔍 DEBUG getOllamaResponse - Réponse reçue:", data);
      
      // La réponse de /api/generate est dans data.response et non data.message.content
      return data.response || '';
    } catch (error) {
      console.error('Erreur lors de l\'appel à Ollama:', error);
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
    try {
      const systemContent = systemPrompts.join('\n');
      
      // Journalisation de débogage pour l'URL et le modèle
      const generateUrl = API_URL_OLLAMA.replace('/api/chat', '/api/generate');
      console.log("🔍 DEBUG getOllamaStreamingResponse - URL Ollama:", generateUrl);
      console.log("🔍 DEBUG getOllamaStreamingResponse - Modèle utilisé:", model);
      
      // Construction d'un prompt combiné pour /api/generate
      const combinedPrompt = `${systemContent}\n\n${prompt}`;
      
      // Construction du payload pour l'API generate
      const payload = {
        model: model.replace('ollama/', ''), // Supprimer le préfixe "ollama/" si présent
        prompt: combinedPrompt,
        stream: true
      };
      
      console.log("🔍 DEBUG getOllamaStreamingResponse - Payload:", JSON.stringify(payload, null, 2));
      
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log("🔍 DEBUG getOllamaStreamingResponse - Statut réponse:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔍 DEBUG getOllamaStreamingResponse - Erreur détaillée:", errorText);
        throw new Error(`Erreur API Ollama: ${response.status}`);
      }
      
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
            
            // Pour l'API generate, la réponse est dans data.response
            let responseContent = data.response || '';
            
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
      console.error('Erreur lors du streaming Ollama:', error);
      throw error;
    }
  }
}

export default AIService; 