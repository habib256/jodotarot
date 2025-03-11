/**
 * Gestionnaire d'état centralisé pour l'application JodoTarot
 * Permet de gérer et de synchroniser l'état global de l'application
 */
class StateManager {
  constructor() {
    // Schéma de validation pour l'état
    this.schema = {
      language: {
        type: 'string',
        enum: ['fr', 'en', 'es', 'de', 'it', 'zh'],
        default: 'fr'
      },
      persona: {
        type: 'string',
        enum: [
          'tarologue', 'oracle', 'voyante', 'pretre', 'rabbin', 'imam',
          'dalailama', 'sorciere', 'alchimiste', 'mage', 'francmacon',
          'freud', 'jung', 'lacan', 'dolto', 'socrate', 'salomon',
          'montaigne', 'quichotte', 'demon', 'noegoman'
        ],
        default: 'tarologue'
      },
      cardSet: {
        type: 'string',
        enum: ['set01', 'set02'],
        default: 'set01'
      },
      deckId: {
        type: 'string',
        enum: ['set01', 'set02'],
        default: 'set01'
      },
      spreadType: {
        type: 'string',
        enum: ['cross', 'horseshoe', 'love', 'celticCross'],
        default: 'cross'
      },
      iaModel: {
        type: 'string',
        description: 'Modèle d\'IA à utiliser (format: "openai/MODEL_NAME" ou "ollama:MODEL_NAME")',
        validate: (value) => {
          if (!value) return false;
          const normalizedValue = value.trim();
          
          // Vérification simple de format
          if (!normalizedValue.startsWith('openai/') && !normalizedValue.startsWith('ollama:')) {
            console.warn(`Format de modèle invalide: ${normalizedValue}`);
            return false;
          }
          
          return true;
        },
        default: function() {
          // Vérifier si des modèles Ollama sont disponibles dans le localStorage
          try {
            const cacheKey = 'ollama_models_cache';
            const cachedData = localStorage.getItem(cacheKey);
            
            if (cachedData) {
              const cache = JSON.parse(cachedData);
              if (cache.models && Array.isArray(cache.models) && cache.models.length > 0) {
                // Utiliser le premier modèle Ollama disponible
                return `ollama:${cache.models[0].name}`;
              }
            }
          } catch (e) {
            console.warn("Erreur lors de la lecture de la cache Ollama:", e);
          }
          
          // Fallback sur OpenAI si aucun modèle Ollama n'est disponible
          return 'openai/gpt-3.5-turbo';
        }
      },
      cards: {
        type: 'array',
        validate: (value) => {
          // Vérification détaillée avec rapports d'erreurs
          console.log('🔍 Validation de cards:', value);
          
          // 1. Vérifier si c'est un tableau
          if (!Array.isArray(value)) {
            console.error('❌ Cards n\'est pas un tableau:', value);
            console.error('❌ Type de cards:', typeof value);
            console.error('❌ Chaîne stringifiée:', JSON.stringify(value));
            return false;
          }
          
          console.log('✅ Cards est bien un tableau de longueur', value.length);
          
          // 2. Vérifier chaque carte
          let allValid = true;
          value.forEach((card, index) => {
            console.log(`🔍 Vérification de la carte ${index}:`, card);
            
            if (!card || typeof card !== 'object') {
              console.error(`❌ Carte ${index} n'est pas un objet:`, card);
              allValid = false;
              return;
            }
            
            // Vérifier les propriétés requises
            if (card.id === undefined) {
              console.error(`❌ Carte ${index} n'a pas d'id:`, card);
              allValid = false;
            }
            
            if (typeof card.name !== 'string') {
              console.error(`❌ Carte ${index} n'a pas de nom valide:`, card.name);
              allValid = false;
            }
            
            if (typeof card.imageUrl !== 'string') {
              console.error(`❌ Carte ${index} n'a pas d'imageUrl valide:`, card.imageUrl);
              allValid = false;
            }
          });
          
          // 3. Retourner le résultat (toujours vrai pour éviter le blocage complet)
          if (!allValid) {
            console.warn('⚠️ Des problèmes ont été détectés avec les cartes, mais nous continuons');
          }
          
          return true; // Toujours retourner true pour éviter les blocages
        },
        default: []
      },
      question: {
        type: 'string',
        maxLength: 1000,
        default: ''
      },
      interpretation: {
        type: 'object',
        nullable: true,
        default: null
      },
      isLoading: {
        type: 'boolean',
        default: false
      },
      error: {
        type: 'string',
        nullable: true,
        default: null
      },
      isCardEnlarged: {
        type: 'boolean',
        default: false
      },
      enlargedCardId: {
        type: 'number',
        nullable: true,
        default: null
      },
      availableModels: {
        type: 'set',
        description: 'Ensemble des modèles Ollama disponibles (pour information uniquement, pas utilisé pour la validation)',
        default: () => new Set()
      },
      currentSpreadType: {
        type: 'string',
        enum: ['cross', 'horseshoe', 'love', 'celticCross'],
        default: 'cross'
      },
      currentCardsDrawn: {
        type: 'string',
        default: '[]'
      }
    };

    // État par défaut
    this.state = this.getDefaultState();
    
    // Liste des écouteurs
    this.listeners = new Set();
    
    // Version de l'état pour la migration
    this.STATE_VERSION = '1.0.0';
    
    // Restaurer l'état depuis le localStorage au démarrage
    this.restoreState();
  }

  /**
   * Obtient l'état par défaut basé sur le schéma
   * @returns {Object} État par défaut
   */
  getDefaultState() {
    const defaultState = {};
    for (const [key, config] of Object.entries(this.schema)) {
      defaultState[key] = typeof config.default === 'function' 
        ? config.default()
        : config.default;
    }
    return defaultState;
  }

  /**
   * Valide une valeur selon les règles du schéma
   * @param {string} key - Clé de la propriété
   * @param {any} value - Valeur à valider
   * @returns {Object} Résultat de la validation
   */
  validateValue(key, value) {
    const config = this.schema[key];
    if (!config) {
      return { isValid: false, error: `Propriété inconnue: ${key}` };
    }

    // Vérifier si la valeur peut être null
    if (value === null && config.nullable) {
      return { isValid: true, value: null };
    }

    // Vérifier le type
    if (config.type === 'set') {
      if (!(value instanceof Set)) {
        try {
          value = new Set(Array.isArray(value) ? value : []);
        } catch {
          return { isValid: false, error: `Type invalide pour ${key}, Set attendu` };
        }
      }
    } else if (config.type === 'array') {
      // Traitement spécial pour les tableaux car typeof [] est 'object'
      if (!Array.isArray(value)) {
        console.error(`Validation de type échouée pour ${key}: attendu array, reçu`, value);
        return { isValid: false, error: `Type invalide pour ${key}, array attendu` };
      }
    } else if (typeof value !== config.type && value !== null) {
      return { isValid: false, error: `Type invalide pour ${key}, ${config.type} attendu` };
    }

    // Vérifier les énumérations
    if (config.enum && !config.enum.includes(value)) {
      return { 
        isValid: false, 
        error: `Valeur invalide pour ${key}, doit être une des suivantes: ${config.enum.join(', ')}` 
      };
    }

    // Vérifier la longueur maximale pour les chaînes
    if (config.type === 'string' && config.maxLength && value.length > config.maxLength) {
      return { 
        isValid: false, 
        error: `${key} dépasse la longueur maximale de ${config.maxLength} caractères` 
      };
    }

    // Validation personnalisée
    if (config.validate && !config.validate(value)) {
      return { isValid: false, error: `Validation échouée pour ${key}` };
    }

    return { isValid: true, value };
  }

  /**
   * Met à jour l'état et notifie tous les écouteurs
   * @param {Object} updates - Objet contenant les mises à jour d'état
   */
  setState(updates) {
    try {
      const validatedUpdates = {};
      const errors = [];

      // Ajouter un log pour déboguer
      console.log('🔄 StateManager.setState appelé avec:', JSON.stringify(updates));
      
      // Synchroniser cardSet et deckId si l'un des deux change
      if (updates.cardSet && updates.cardSet !== this.state.cardSet) {
        updates.deckId = updates.cardSet;
        console.log(`🔄 Synchronisation automatique: deckId <- cardSet (${updates.cardSet})`);
      } else if (updates.deckId && updates.deckId !== this.state.deckId) {
        updates.cardSet = updates.deckId;
        console.log(`🔄 Synchronisation automatique: cardSet <- deckId (${updates.deckId})`);
      }
      
      // Valider chaque mise à jour
      for (const [key, value] of Object.entries(updates)) {
        console.log(`📋 Validation de ${key}:`, value);
        if (key === 'cards') {
          console.log(`🃏 Type de cards:`, typeof value);
          console.log(`🃏 Est un tableau?`, Array.isArray(value));
          console.log(`🃏 Contenu de cards:`, JSON.stringify(value));
        }
        
        const validation = this.validateValue(key, value);
        if (validation.isValid) {
          validatedUpdates[key] = validation.value;
          console.log(`✅ Validation réussie pour ${key}`);
        } else {
          errors.push(validation.error);
          console.error(`❌ Validation échouée pour ${key}:`, validation.error);
        }
      }

      // S'il y a des erreurs, les regrouper et les lancer
      if (errors.length > 0) {
        console.error('❌ Erreurs de validation détectées:', errors);
        throw new Error(`Erreurs de validation:\n${errors.join('\n')}`);
      }

      // Créer un objet avec les changements
      const changedValues = {};
      for (const [key, value] of Object.entries(validatedUpdates)) {
        if (!this.isEqual(this.state[key], value)) {
          changedValues[key] = value;
        }
      }

      // Mettre à jour l'état
      this.state = {
        ...this.state,
        ...validatedUpdates
      };

      // Notifier les écouteurs et émettre les événements
      if (Object.keys(changedValues).length > 0) {
        this.notifyListeners(changedValues);
        this.emitChangeEvents(changedValues);
        this.persistState();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état:', error);
      this.state.error = error.message;
      throw error;
    }
  }

  /**
   * Compare deux valeurs de manière profonde
   * @param {any} a - Première valeur
   * @param {any} b - Deuxième valeur
   * @returns {boolean} True si les valeurs sont égales
   */
  isEqual(a, b) {
    if (a instanceof Set && b instanceof Set) {
      return a.size === b.size && [...a].every(value => b.has(value));
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((value, index) => this.isEqual(value, b[index]));
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      return Object.keys(a).length === Object.keys(b).length &&
        Object.keys(a).every(key => this.isEqual(a[key], b[key]));
    }
    return a === b;
  }

  /**
   * Valide et nettoie un modèle IA
   * @param {string} model - Le modèle à valider
   * @return {string|null} - Le modèle validé ou null si invalide
   */
  validateIAModel(model) {
    if (!model) return null;
    
    // Normaliser le format du modèle
    let normalizedModel = model.trim();
    
    // Vérification basique du format
    if (!normalizedModel.startsWith('openai/') && !normalizedModel.startsWith('ollama:')) {
      console.warn(`Format de modèle invalide: ${normalizedModel} - doit commencer par 'openai/' ou 'ollama:'`);
      return null;
    }
    
    // Validation spécifique aux modèles OpenAI
    if (normalizedModel.startsWith('openai/')) {
      // Liste des modèles OpenAI valides (à mettre à jour selon les besoins)
      const validOpenAIModels = [
        'openai/gpt-3.5-turbo',
        'openai/gpt-4',
        'openai/gpt-4o',
        'openai/gpt-4o-mini'
      ];
      
      // Vérifier si le modèle est dans la liste des modèles valides
      // Ce n'est pas une vérification stricte - permet d'ajouter des modèles dynamiquement
      if (!validOpenAIModels.includes(normalizedModel)) {
        console.warn(`Modèle OpenAI non standard: ${normalizedModel}`);
      }
    }
    
    // Pour les modèles Ollama, nous ne validons pas strictement ici
    // car ils sont détectés dynamiquement et peuvent changer
    // selon l'installation de l'utilisateur
    
    return normalizedModel;
  }
  
  /**
   * Émet des événements personnalisés pour chaque valeur modifiée
   * @param {Object} changedValues - Objet contenant les valeurs qui ont changé
   */
  emitChangeEvents(changedValues) {
    for (const [key, value] of Object.entries(changedValues)) {
      const eventName = `${key}:changed`;
      
      // Log spécifique pour le changement de modèle IA
      if (key === 'iaModel') {
        console.log(`StateManager: Émission de l'événement iaModel:changed avec la valeur ${value}`);
      }
      
      // Émettre l'événement spécifique
      document.dispatchEvent(new CustomEvent(eventName, {
        detail: { [key]: value, state: this.state }
      }));
      
      // Pour iaModel, émettre un événement supplémentaire pour garantir la synchronisation UI
      if (key === 'iaModel') {
        document.dispatchEvent(new CustomEvent('iaModelUI:update', {
          detail: { model: value, state: this.state }
        }));
      }
    }
    
    // Émettre un événement global pour tout changement d'état
    if (Object.keys(changedValues).length > 0) {
      document.dispatchEvent(new CustomEvent('state:changed', {
        detail: { changes: changedValues, state: this.state }
      }));
    }
  }
  
  /**
   * Récupère l'état actuel (copie pour éviter la mutation directe)
   * @return {Object} Une copie de l'état actuel
   */
  getState() {
    return {...this.state};
  }
  
  /**
   * Abonne un écouteur aux changements d'état
   * @param {Function} listener - Fonction à appeler lors des changements d'état
   * @return {Function} Fonction de désabonnement
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  
  /**
   * Notifie tous les écouteurs des changements d'état
   * @param {Object} changes - Les changements effectués
   */
  notifyListeners(changes = {}) {
    this.listeners.forEach(listener => listener(this.state, changes));
  }

  /**
   * Persiste l'état actuel dans le localStorage
   */
  persistState() {
    try {
      // Ne pas persister les états temporaires
      const stateToPersist = {...this.state};
      const temporaryKeys = ['isLoading', 'error', 'isCardEnlarged', 'enlargedCardId'];
      temporaryKeys.forEach(key => delete stateToPersist[key]);
      
      // Convertir les types spéciaux pour la sérialisation
      const serializedState = {
        version: this.STATE_VERSION,
        timestamp: Date.now(),
        data: this.serializeState(stateToPersist)
      };
      
      // Vérifier la taille avant la sauvegarde
      const stateString = JSON.stringify(serializedState);
      const stateSize = new Blob([stateString]).size;
      
      // Limite de taille (5MB pour localStorage)
      const SIZE_LIMIT = 5 * 1024 * 1024;
      if (stateSize > SIZE_LIMIT) {
        throw new Error(`L'état est trop volumineux pour être sauvegardé (${Math.round(stateSize / 1024)}KB > ${Math.round(SIZE_LIMIT / 1024)}KB)`);
      }
      
      localStorage.setItem('jodotarot_state', stateString);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état:', error);
      // Émettre un événement d'erreur
      document.dispatchEvent(new CustomEvent('stateManager:error', {
        detail: { error: error.message }
      }));
    }
  }

  /**
   * Restaure l'état depuis le localStorage
   */
  restoreState() {
    try {
      const savedState = localStorage.getItem('jodotarot_state');
      if (!savedState) return;
      
      const { version, data } = JSON.parse(savedState);
      
      // Vérifier la version et migrer si nécessaire
      const migratedData = this.migrateState(version, data);
      
      // Désérialiser l'état
      const restoredState = this.deserializeState(migratedData);
      
      // Fusionner l'état restauré avec l'état par défaut pour s'assurer que toutes les propriétés requises sont présentes
      const defaultState = this.getDefaultState();
      const mergedState = { ...defaultState, ...restoredState };

      // Valider l'état fusionné
      const validationErrors = this.validateState(mergedState);
      if (validationErrors.length > 0) {
        throw new Error(`État invalide:\n${validationErrors.join('\n')}`);
      }

      // Utiliser setState pour appliquer l'état fusionné
      this.setState(mergedState);
    } catch (error) {
      console.error('Erreur lors de la restauration de l\'état:', error);
      // Réinitialiser à l'état par défaut
      this.state = this.getDefaultState();
    }
  }

  /**
   * Sérialise l'état pour le stockage
   * @param {Object} state - État à sérialiser
   * @returns {Object} État sérialisé
   */
  serializeState(state) {
    const serialized = {};
    
    for (const [key, value] of Object.entries(state)) {
      if (value instanceof Set) {
        serialized[key] = {
          __type: 'Set',
          value: Array.from(value)
        };
      } else if (Array.isArray(value)) {
        serialized[key] = {
          __type: 'Array',
          value: value
        };
      } else if (value instanceof Date) {
        serialized[key] = {
          __type: 'Date',
          value: value.toISOString()
        };
      } else if (value === undefined) {
        // Ignorer les valeurs undefined
        continue;
      } else {
        serialized[key] = value;
      }
    }
    
    return serialized;
  }

  /**
   * Désérialise l'état stocké
   * @param {Object} serialized - État sérialisé
   * @returns {Object} État désérialisé
   */
  deserializeState(serialized) {
    const deserialized = {};
    
    for (const [key, value] of Object.entries(serialized)) {
      if (value && typeof value === 'object' && '__type' in value) {
        switch (value.__type) {
          case 'Set':
            deserialized[key] = new Set(value.value);
            break;
          case 'Array':
            deserialized[key] = value.value;
            break;
          case 'Date':
            deserialized[key] = new Date(value.value);
            break;
          default:
            deserialized[key] = value;
        }
      } else {
        deserialized[key] = value;
      }
    }
    
    return deserialized;
  }

  /**
   * Valide l'état complet
   * @param {Object} state - État à valider
   * @returns {string[]} Tableau des erreurs de validation
   */
  validateState(state) {
    const errors = [];
    
    // Vérifier les propriétés requises
    for (const [key, config] of Object.entries(this.schema)) {
      if (!(key in state) && !config.nullable) {
        errors.push(`Propriété manquante: ${key}`);
        continue;
      }
      
      const validation = this.validateValue(key, state[key]);
      if (!validation.isValid) {
        errors.push(validation.error);
      }
    }
    
    // Vérifier les propriétés non définies dans le schéma
    for (const key of Object.keys(state)) {
      if (!this.schema[key]) {
        errors.push(`Propriété inconnue: ${key}`);
      }
    }
    
    return errors;
  }

  /**
   * Migre l'état vers la version actuelle si nécessaire
   * @param {string} version - Version de l'état sauvegardé
   * @param {Object} data - Données de l'état
   * @returns {Object} État migré
   */
  migrateState(version, data) {
    if (version === this.STATE_VERSION) {
      return data;
    }
    
    // Exemple de migration de version
    switch (version) {
      case '0.9.0':
        // Migration de 0.9.0 vers 1.0.0
        data = this.migrate_0_9_0_to_1_0_0(data);
        break;
      default:
        console.warn(`Version inconnue ${version}, utilisation des données telles quelles`);
    }
    
    return data;
  }

  /**
   * Exemple de fonction de migration
   * @param {Object} oldData - Anciennes données
   * @returns {Object} Nouvelles données
   */
  migrate_0_9_0_to_1_0_0(oldData) {
    // Exemple de migration : renommer une propriété
    const newData = {...oldData};
    if ('oldProperty' in newData) {
      newData.newProperty = newData.oldProperty;
      delete newData.oldProperty;
    }
    return newData;
  }
}

export default StateManager; 