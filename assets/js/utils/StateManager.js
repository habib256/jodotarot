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
        enum: ['set01', 'set02', 'set03'],
        default: 'set01',
        description: 'Identifiant du jeu de cartes (anciennement séparé en cardSet et deckId)'
      },
      spreadType: {
        type: 'string',
        enum: ['cross', 'horseshoe', 'love', 'celticCross'],
        default: 'cross'
      },
      iaModel: {
        type: 'string',
        description: 'Modèle d\'IA à utiliser',
        validate: (value) => {
          if (!value) return false;
          const normalizedValue = value.trim().toLowerCase();
          
          // Le mode "prompt" est toujours valide
          if (normalizedValue === 'prompt') {
            return true;
          }
          
          // Validation des modèles OpenAI
          if (normalizedValue.startsWith('openai/')) {
            const modelName = normalizedValue.split('/')[1];
            const validOpenAIModels = [
              'gpt-3.5-turbo',
              'gpt-4',
              'gpt-4o',
              'gpt-4o-mini'
            ];
            if (!validOpenAIModels.includes(modelName)) {
              console.warn(`Modèle OpenAI non reconnu: ${modelName}`);
              return false;
            }
            return true;
          }
          
          // Validation des modèles Ollama
          if (normalizedValue.startsWith('ollama:')) {
            const modelName = normalizedValue.split(':')[1];
            if (!modelName || modelName.length < 2) {
              console.warn(`Nom de modèle Ollama invalide: ${modelName}`);
              return false;
            }
            return true;
          }
          
          console.warn(`Format de modèle invalide: ${normalizedValue}`);
          return false;
        },
        default: 'prompt' // Changement du défaut pour plus de sécurité
      },
      cards: {
        type: 'array',
        validate: (value) => {
          if (!Array.isArray(value)) return false;
          
          for (const card of value) {
            if (!card || typeof card !== 'object') return false;
            
            // Si la carte n'a pas d'ID, essayer de le générer à partir du nom
            if (!card.id) {
              const cardNumber = this.getCardNumberFromName(card.name);
              if (cardNumber !== null) {
                card.id = `M${cardNumber.toString().padStart(2, '0')}`;
              } else {
                return false;
              }
            }
            
            if (!card.name || typeof card.name !== 'string') return false;
            if (!card.imageUrl || typeof card.imageUrl !== 'string') return false;
            if (!card.position || !['upright', 'reversed'].includes(card.position)) {
              card.position = 'upright';
            }
          }
          
          return true;
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
      modelStatus: {
        type: 'object',
        description: 'État actuel du modèle d\'IA',
        default: {
          isLoading: false,
          isConnected: false,
          error: null,
          lastCheck: null
        }
      },
      availableModels: {
        type: 'object',
        description: 'Liste des modèles disponibles par type',
        default: {
          ollama: [],
          openai: [
            'gpt-3.5-turbo',
            'gpt-4',
            'gpt-4o',
            'gpt-4o-mini'
          ]
        }
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

    // État par défaut initialisé mais sera remplacé par l'état restauré si disponible
    this.state = this.getDefaultState();
    
    // Écouteurs pour les changements d'état
    this.listeners = [];
    
    // Version actuelle du schema d'état (pour migrations)
    this.STATE_VERSION = '1.0.0';
    
    // Ne pas initialiser immédiatement l'état ici, car cela sera fait dans initialize()
    // qui restaurera d'abord l'état depuis localStorage si disponible
  }

  /**
   * Initialise le gestionnaire d'état en restaurant les données et en émettant un événement de prêt
   * @returns {Promise} Une promesse résolue quand l'état est prêt
   */
  async initialize() {
    return new Promise((resolve) => {
      try {
        // Restaurer l'état depuis localStorage
        const restored = this.restoreState();
        
        // Si la restauration a échoué, s'assurer que les valeurs par défaut sont appliquées
        if (!restored) {
          console.log('🔄 Utilisation des valeurs par défaut pour l\'état');
          // Pas besoin de réinitialiser this.state car il est déjà initialisé dans le constructeur
        }
        
        // Émettre un événement indiquant que l'état est prêt
        document.dispatchEvent(new CustomEvent('stateManager:ready', {
          detail: { state: this.getState() }
        }));
        
        console.log('✅ StateManager initialisé avec succès');
        resolve(this.getState());
      } catch (error) {
        console.error('❌ Erreur d\'initialisation du StateManager:', error);
        // Résoudre quand même pour ne pas bloquer l'application
        resolve(this.getState());
      }
    });
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
      const importantKeys = ['language', 'persona', 'cardSet', 'spreadType', 'iaModel'];
      const importantUpdates = Object.keys(updates).filter(key => importantKeys.includes(key));

      // Tracer les mises à jour importantes
      if (importantUpdates.length > 0) {
        console.log('🔄 Mise à jour de clés importantes:', importantUpdates.map(key => `${key}: ${updates[key]}`));
      }
      
      // Valider chaque mise à jour
      for (const [key, value] of Object.entries(updates)) {
        const validation = this.validateValue(key, value);
        if (validation.isValid) {
          validatedUpdates[key] = validation.value;
        } else {
          errors.push(validation.error);
          console.error(`❌ Validation échouée pour ${key}:`, validation.error);
        }
      }

      // S'il y a des erreurs, les regrouper et les lancer
      if (errors.length > 0) {
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
        // Tracer les changements effectifs
        const importantChanges = Object.keys(changedValues).filter(key => importantKeys.includes(key));
        if (importantChanges.length > 0) {
          console.log('✅ Changements effectifs de clés importantes:', importantChanges.map(key => `${key}: ${changedValues[key]}`));
        }
        
        this.notifyListeners(changedValues);
        this.emitChangeEvents(changedValues);
        this.persistState();
      } else {
        console.log('ℹ️ Aucun changement effectif détecté, état non modifié');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'état:', error);
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
    if (!model) return 'prompt'; // Fallback vers le mode prompt
    
    // Normaliser le format du modèle
    let normalizedModel = model.trim().toLowerCase();
    
    // Validation via le schéma
    const validation = this.validateValue('iaModel', normalizedModel);
    if (!validation.isValid) {
      console.warn(`Modèle invalide (${model}), passage en mode prompt`);
      return 'prompt';
    }
    
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
    if (typeof listener !== 'function') {
      console.error('❌ L\'écouteur doit être une fonction');
      return () => {}; // Retourner une fonction vide en cas d'erreur
    }
    
    // Ajouter l'écouteur au tableau
    this.listeners.push(listener);
    
    // Retourner une fonction de désabonnement
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Notifie tous les écouteurs d'un changement d'état
   * @param {Object} changes - Les changements apportés à l'état
   */
  notifyListeners(changes = {}) {
    // Parcourir le tableau des écouteurs au lieu du Set
    this.listeners.forEach(listener => {
      try {
        listener(this.state, changes);
      } catch (error) {
        console.error('❌ Erreur dans un écouteur d\'état:', error);
      }
    });
  }

  /**
   * Persiste l'état actuel dans le localStorage
   * @returns {boolean} Indique si la sauvegarde a réussi
   */
  persistState() {
    try {
      // Ne pas persister les états temporaires
      const stateToPersist = {...this.state};
      const temporaryKeys = ['isLoading', 'error', 'isCardEnlarged', 'enlargedCardId'];
      temporaryKeys.forEach(key => delete stateToPersist[key]);
      
      // Vérifier explicitement que les clés importantes sont présentes
      const importantKeys = ['language', 'persona', 'cardSet', 'spreadType', 'iaModel'];
      const keysPresent = importantKeys.filter(key => key in stateToPersist);
      const keysMissing = importantKeys.filter(key => !(key in stateToPersist));
      
      console.log('🔐 Persistance de l\'état dans localStorage:');
      
      if (keysPresent.length > 0) {
        const presentValues = keysPresent.map(key => `${key}: ${stateToPersist[key]}`);
        console.log('✅ Clés importantes sauvegardées:', presentValues.join(', '));
      }
      
      if (keysMissing.length > 0) {
        console.warn('⚠️ Clés importantes manquantes:', keysMissing.join(', '));
        // Ne pas interrompre la sauvegarde pour des clés manquantes
      }
      
      // Vérifier que l'état n'est pas vide
      if (Object.keys(stateToPersist).length === 0) {
        console.warn('⚠️ Tentative de sauvegarde d\'un état vide');
        return false;
      }
      
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
      
      // Sauvegarde dans localStorage
      localStorage.setItem('jodotarot_state', stateString);
      
      // Vérification que les données ont bien été sauvegardées
      const savedState = localStorage.getItem('jodotarot_state');
      if (!savedState) {
        console.error('❌ Erreur: État non trouvé dans localStorage après sauvegarde');
        return false;
      }
      
      console.log('✅ État sauvegardé dans localStorage avec succès');
      
      // Vérifier la taille sauvegardée
      const savedSize = new Blob([savedState]).size;
      console.log(`📊 Taille de l'état sauvegardé: ${Math.round(savedSize / 1024)}KB`);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de l\'état:', error);
      // Émettre un événement d'erreur
      document.dispatchEvent(new CustomEvent('stateManager:error', {
        detail: { error: error.message }
      }));
      return false;
    }
  }

  /**
   * Restaure l'état depuis le localStorage
   * @return {boolean} Indique si la restauration a réussi
   */
  restoreState() {
    try {
      const savedState = localStorage.getItem('jodotarot_state');
      if (!savedState) {
        console.log('🔍 Aucun état sauvegardé trouvé dans localStorage');
        return false;
      }
      
      console.log('🔄 Restauration de l\'état depuis localStorage...');
      
      try {
        const parsed = JSON.parse(savedState);
        if (!parsed || !parsed.data) {
          console.warn('⚠️ Format d\'état invalide dans localStorage:', savedState);
          return false;
        }
        
        const version = parsed.version || '0.0.0';
        
        // Vérifier la version pour les migrations
        if (version !== this.STATE_VERSION) {
          console.log(`⚠️ Migration d'état nécessaire: ${version} -> ${this.STATE_VERSION}`);
          const migratedData = this.migrateState(version, parsed.data);
          this.applyRestoredState(migratedData);
          
          // Log des données après migration pour débogage
          console.log('📊 État après migration:', this.state);
        } else {
          console.log('✅ Version de l\'état compatible, restauration directe');
          this.applyRestoredState(parsed.data);
          
          // Log des données restaurées pour débogage
          console.log('📊 État restauré:', this.state);
        }
        
        return true;
      } catch (parseError) {
        console.error('❌ Erreur lors du parsing de l\'état sauvegardé:', parseError);
        // Supprimer l'état corrompu du localStorage
        localStorage.removeItem('jodotarot_state');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la restauration de l\'état:', error);
      // En cas d'erreur, continuer avec l'état par défaut
      return false;
    }
  }
  
  /**
   * Applique l'état restauré avec traçage des clés importantes
   * @param {Object} data - Données d'état à appliquer
   */
  applyRestoredState(data) {
    if (!data) {
      console.warn('⚠️ Données d\'état invalides, utilisation des valeurs par défaut');
      return;
    }
    
    try {
      // Désérialiser l'état
      const deserialized = this.deserializeState(data);
      
      // Vérifier les clés importantes
      const importantKeys = ['language', 'persona', 'cardSet', 'spreadType', 'iaModel'];
      const restoredKeys = importantKeys.filter(key => key in deserialized);
      const missingKeys = importantKeys.filter(key => !(key in deserialized));
      
      console.log('🔄 Restauration des clés importantes:');
      
      if (restoredKeys.length > 0) {
        const restoredValues = restoredKeys.map(key => `${key}: ${deserialized[key]}`);
        console.log('✅ Clés restaurées:', restoredValues.join(', '));
      } else {
        console.warn('⚠️ Aucune clé importante trouvée dans les données restaurées');
      }
      
      if (missingKeys.length > 0) {
        console.warn('⚠️ Clés importantes non restaurées (valeurs par défaut):', missingKeys.join(', '));
      }
      
      // Créer un nouvel état qui combine les valeurs par défaut avec les valeurs restaurées
      const newState = this.getDefaultState();
      let appliedCount = 0;
      
      // Appliquer l'état désérialisé
      for (const [key, value] of Object.entries(deserialized)) {
        // Valider chaque valeur avant de l'appliquer
        const validation = this.validateValue(key, value);
        if (validation.isValid) {
          newState[key] = validation.value;
          appliedCount++;
        } else {
          console.warn(`⚠️ Valeur invalide pour ${key}, utilisation de la valeur par défaut`);
        }
      }
      
      // Remplacer complètement l'état actuel par le nouvel état
      this.state = newState;
      
      console.log(`✅ État restauré avec succès: ${appliedCount} valeurs appliquées`);
      
      // Forcer la persistance pour s'assurer que l'état est correctement sauvegardé
      setTimeout(() => this.persistState(), 100);
    } catch (error) {
      console.error('❌ Erreur lors de l\'application de l\'état restauré:', error);
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

  validateCards(cards) {
    console.log('🔍 Validation de cards:', cards);
    
    if (!Array.isArray(cards)) {
      console.error('❌ Cards n\'est pas un tableau:', cards);
      return false;
    }
    
    console.log('✅ Cards est bien un tableau de longueur', cards.length);
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      console.log(`🔍 Vérification de la carte ${i}:`, card);
      
      if (!card || typeof card !== 'object') {
        console.error(`❌ Carte ${i} n'est pas un objet valide:`, card);
        return false;
      }
      
      if (!card.id || !card.id.match(/^M\d{2}$/)) {
        console.error(`❌ Carte ${i} n'a pas d'id valide:`, card);
        return false;
      }
      
      if (!card.name || typeof card.name !== 'string') {
        console.error(`❌ Carte ${i} n'a pas de nom valide:`, card);
        return false;
      }
      
      if (!card.imageUrl || typeof card.imageUrl !== 'string') {
        console.error(`❌ Carte ${i} n'a pas d'URL d'image valide:`, card);
        return false;
      }
      
      if (!card.position || !['upright', 'reversed'].includes(card.position)) {
        console.error(`❌ Carte ${i} n'a pas de position valide:`, card);
        return false;
      }
    }
    
    return true;
  }

  validateCardsArray(value) {
    if (!Array.isArray(value)) return false;
    
    for (const card of value) {
      if (!card || typeof card !== 'object') return false;
      
      // Si la carte n'a pas d'ID, essayer de le générer à partir du nom
      if (!card.id) {
        const cardNumber = this.getCardNumberFromName(card.name);
        if (cardNumber !== null) {
          card.id = `M${cardNumber.toString().padStart(2, '0')}`;
        } else {
          return false;
        }
      }
      
      if (!card.name || typeof card.name !== 'string') return false;
      if (!card.imageUrl || typeof card.imageUrl !== 'string') return false;
      if (!card.position || !['upright', 'reversed'].includes(card.position)) {
        card.position = 'upright';
      }
    }
    
    return true;
  }

  /**
   * Obtient le numéro d'une carte à partir de son nom
   * @param {string} name - Nom de la carte
   * @returns {number|null} Numéro de la carte ou null si non trouvé
   */
  getCardNumberFromName(name) {
    const cardNumbers = {
      'Le fou': 0,
      'Bateleur': 1,
      'Papesse': 2,
      'Imperatrice': 3,
      'Empereur': 4,
      'Pape': 5,
      'Les amoureux': 6,
      'Chariot': 7,
      'Justice': 8,
      'Ermite': 9,
      'La roue': 10,
      'Force': 11,
      'Le pendu': 12,
      'La mort': 13,
      'Temperance': 14,
      'Diable': 15,
      'La Tour': 16,
      'Etoile': 17,
      'La lune': 18,
      'Le soleil': 19,
      'Le jugement': 20,
      'Le monde': 21,
      'Dos de carte': 22
    };
    
    return cardNumbers[name] !== undefined ? cardNumbers[name] : null;
  }
}

export default StateManager; 