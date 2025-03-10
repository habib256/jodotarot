/**
 * Gestionnaire d'état centralisé pour l'application JodoTarot
 * Permet de gérer et de synchroniser l'état global de l'application
 */
class StateManager {
  constructor() {
    // État par défaut
    this.state = {
      // Configuration de l'application
      language: 'fr',
      persona: 'tarologue',
      cardSet: 'set01',
      spreadType: 'cross',
      iaModel: 'openai/gpt-3.5-turbo',
      
      // État du tirage
      cards: [],
      question: '',
      interpretation: null,
      
      // États UI
      isLoading: false,
      error: null,
      isCardEnlarged: false,
      enlargedCardId: null
    };
    
    // Valeurs par défaut pour chaque clé d'état
    this.defaults = {
      language: 'fr',
      persona: 'tarologue',
      cardSet: 'set01',
      spreadType: 'cross',
      iaModel: 'openai/gpt-3.5-turbo'
    };
    
    this.listeners = [];
    
    // Restaurer l'état depuis le localStorage au démarrage
    this.restoreState();
  }
  
  /**
   * Met à jour l'état et notifie tous les écouteurs
   * @param {Object} updates - Objet contenant les mises à jour d'état
   */
  setState(updates) {
    // Valider les mises à jour avant de les appliquer
    const validatedUpdates = this.validateUpdates(updates);
    
    // Créer un objet contenant uniquement les valeurs qui ont changé
    const changedValues = {};
    
    // Identifier les valeurs qui ont changé
    for (const [key, value] of Object.entries(validatedUpdates)) {
      if (this.state[key] !== value) {
        changedValues[key] = value;
      }
    }
    
    // Mettre à jour l'état avec les valeurs validées
    this.state = {...this.state, ...validatedUpdates};
    
    // Notifier les écouteurs
    this.notifyListeners();
    
    // Émettre des événements personnalisés pour chaque valeur modifiée
    this.emitChangeEvents(changedValues);
    
    // Sauvegarder l'état
    this.persistState();
  }
  
  /**
   * Valide les mises à jour avant de les appliquer à l'état
   * @param {Object} updates - Les mises à jour à valider
   * @return {Object} - Les mises à jour validées
   */
  validateUpdates(updates) {
    const validatedUpdates = {...updates};
    
    // Vérifier si des valeurs sont invalides et les remplacer par les valeurs par défaut
    for (const [key, value] of Object.entries(validatedUpdates)) {
      // Si la valeur est undefined, null, ou une chaîne vide, utiliser la valeur par défaut
      if (value === undefined || value === null || value === '') {
        console.warn(`Valeur invalide pour ${key}, utilisation de la valeur par défaut`);
        validatedUpdates[key] = this.defaults[key];
      }
    }
    
    return validatedUpdates;
  }
  
  /**
   * Émet des événements personnalisés pour chaque valeur modifiée
   * @param {Object} changedValues - Objet contenant les valeurs qui ont changé
   */
  emitChangeEvents(changedValues) {
    for (const [key, value] of Object.entries(changedValues)) {
      const eventName = `${key}:changed`;
      document.dispatchEvent(new CustomEvent(eventName, {
        detail: { [key]: value, state: this.state }
      }));
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
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Notifie tous les écouteurs des changements d'état
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Persiste l'état actuel dans le localStorage
   */
  persistState() {
    try {
      // Ne pas persister les états temporaires
      const stateToPersist = {...this.state};
      delete stateToPersist.isLoading;
      delete stateToPersist.error;
      delete stateToPersist.isCardEnlarged;
      delete stateToPersist.enlargedCardId;
      
      localStorage.setItem('jodotarot_state', JSON.stringify(stateToPersist));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état:', error);
    }
  }

  /**
   * Restaure l'état depuis le localStorage
   */
  restoreState() {
    try {
      const savedState = localStorage.getItem('jodotarot_state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Utiliser setState pour bénéficier de la validation
        this.setState(parsedState);
        
        // Événement émis maintenant depuis setState via emitChangeEvents
      }
    } catch (error) {
      console.error('Erreur lors de la restauration de l\'état:', error);
    }
  }
}

export default StateManager; 