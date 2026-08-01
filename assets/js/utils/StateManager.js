/**
 * Gestionnaire d'état centralisé pour l'application JodoTarot
 * Permet de gérer et de synchroniser l'état global de l'application
 */
import { DEBUG_LEVEL } from '../config.js';

// Clés d'état volatiles: jamais persistées dans le localStorage
const TEMPORARY_KEYS = ['isLoading', 'error'];

/**
 * Journalise uniquement lorsque le mode debug détaillé est actif
 * @param {string} message - Message à journaliser
 * @param {any} [data] - Données additionnelles
 */
function debugLog(message, data) {
  if (DEBUG_LEVEL < 2) return;
  if (data !== undefined) {
    console.log(message, data);
  } else {
    console.log(message);
  }
}

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
        enum: ['set01', 'set02', 'set03', 'set04'],
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
            
            if (!card.id) {
              return false;
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
        type: 'string',
        nullable: true,
        description: 'Interprétation générée par l\'IA (texte brut, jamais du HTML)',
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
      }
    };

    // État par défaut initialisé mais sera remplacé par l'état restauré si disponible
    this.state = this.getDefaultState();
    
    // Écouteurs pour les changements d'état
    this.listeners = [];
    
    // Version actuelle du schema d'état (pour migrations)
    this.STATE_VERSION = '1.0.0';

    // Indique si l'état provient du localStorage (choix explicites de
    // l'utilisateur) plutôt que des valeurs par défaut
    this.hasRestoredState = false;
    
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
        // En cas d'échec, this.state conserve les valeurs par défaut du constructeur
        this.restoreState();

        // Émettre un événement indiquant que l'état est prêt
        document.dispatchEvent(new CustomEvent('stateManager:ready', {
          detail: { state: this.getState() }
        }));

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
    if (value === null || value === undefined) {
      return config.nullable
        ? { isValid: true, value: null }
        : { isValid: false, error: `${key} ne peut pas être null` };
    }

    // Vérifier le type
    if (config.type === 'array') {
      // Traitement spécial pour les tableaux car typeof [] est 'object'
      if (!Array.isArray(value)) {
        return { isValid: false, error: `Type invalide pour ${key}, array attendu` };
      }
    } else if (typeof value !== config.type) {
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
        debugLog('🔄 Changements d\'état', changedValues);

        this.notifyListeners(changedValues);
        this.emitChangeEvents(changedValues);
        this.persistState();
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
   * Émet des événements personnalisés pour chaque valeur modifiée
   * @param {Object} changedValues - Objet contenant les valeurs qui ont changé
   */
  emitChangeEvents(changedValues) {
    for (const [key, value] of Object.entries(changedValues)) {
      // Émettre l'événement spécifique à la clé (ex: `language:changed`)
      document.dispatchEvent(new CustomEvent(`${key}:changed`, {
        detail: { [key]: value, state: this.state }
      }));
    }

    // Émettre un événement global pour tout changement d'état
    document.dispatchEvent(new CustomEvent('state:changed', {
      detail: { changes: changedValues, state: this.state }
    }));
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
      TEMPORARY_KEYS.forEach(key => delete stateToPersist[key]);

      // Convertir les types spéciaux pour la sérialisation
      const serializedState = {
        version: this.STATE_VERSION,
        timestamp: Date.now(),
        data: this.serializeState(stateToPersist)
      };

      const stateString = JSON.stringify(serializedState);

      // Sauvegarde dans localStorage
      localStorage.setItem('jodotarot_state', stateString);

      debugLog('🔐 État sauvegardé dans localStorage', stateToPersist);

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
        debugLog('🔍 Aucun état sauvegardé trouvé dans localStorage');
        return false;
      }

      try {
        const parsed = JSON.parse(savedState);
        if (!parsed || !parsed.data) {
          console.warn('⚠️ Format d\'état invalide dans localStorage');
          return false;
        }

        const version = parsed.version || '0.0.0';

        // Vérifier la version pour les migrations
        const data = version !== this.STATE_VERSION
          ? this.migrateState(version, parsed.data)
          : parsed.data;

        this.applyRestoredState(data);
        this.hasRestoredState = true;
        debugLog('📊 État restauré', this.state);

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

      // Créer un nouvel état qui combine les valeurs par défaut avec les valeurs restaurées
      const newState = this.getDefaultState();

      // Appliquer l'état désérialisé, en ignorant les clés obsolètes ou invalides
      for (const [key, value] of Object.entries(deserialized)) {
        if (!this.schema[key]) continue; // Clé issue d'une ancienne version du schéma

        const validation = this.validateValue(key, value);
        if (validation.isValid) {
          newState[key] = validation.value;
        } else {
          console.warn(`⚠️ Valeur invalide pour ${key}, utilisation de la valeur par défaut`);
        }
      }

      // Remplacer complètement l'état actuel par le nouvel état
      this.state = newState;
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
      if (value === undefined) continue; // Ignorer les valeurs undefined

      serialized[key] = Array.isArray(value)
        ? { __type: 'Array', value }
        : value;
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
      deserialized[key] = (value && typeof value === 'object' && value.__type === 'Array')
        ? value.value
        : value;
    }

    return deserialized;
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
