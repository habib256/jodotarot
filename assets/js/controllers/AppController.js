/**
 * Contrôleur principal de l'application JodoTarot
 * Responsable de la coordination des composants et de la gestion de l'état global
 */
import StateManager from '../utils/StateManager.js';
import ReadingController from './ReadingController.js';
import ConfigController from './ConfigController.js';

class AppController {
  /**
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   * @param {ConfigController} configController - Instance du contrôleur de configuration
   * @param {ReadingController} readingController - Instance du contrôleur de lecture
   */
  constructor(stateManager, configController, readingController) {
    this.stateManager = stateManager;
    this.configController = configController;
    this.readingController = readingController;
    
    // Écouter les changements d'état pour mettre à jour l'UI
    this.stateManager.subscribe(this.handleStateChange.bind(this));
    
    // Synchroniser l'UI avec l'état restauré
    this.syncUIWithState();
  }
  
  /**
   * Synchronise l'interface utilisateur avec l'état restauré
   */
  syncUIWithState() {
    const state = this.stateManager.getState();
    
    // Mettre à jour les sélecteurs
    const elements = {
      languageSelect: document.getElementById('language'),
      personaSelect: document.getElementById('persona'),
      cardSetSelect: document.getElementById('card-set'),
      spreadTypeSelect: document.getElementById('spread-type'),
      iaModelSelect: document.getElementById('ia-model'),
      questionInput: document.getElementById('question')
    };
    
    // Synchroniser les sélecteurs avec l'état
    if (elements.languageSelect) elements.languageSelect.value = state.language;
    if (elements.personaSelect) elements.personaSelect.value = state.persona;
    if (elements.cardSetSelect) elements.cardSetSelect.value = state.cardSet;
    if (elements.spreadTypeSelect) elements.spreadTypeSelect.value = state.spreadType;
    if (elements.iaModelSelect) elements.iaModelSelect.value = state.iaModel;
    if (elements.questionInput) elements.questionInput.value = state.question;
    
    // Si un tirage existe, le restaurer
    if (state.cards && state.cards.length > 0 && this.readingController) {
      this.readingController.restoreReading(state.cards, state.interpretation);
    }
  }
  
  /**
   * Gère les changements d'état et met à jour l'interface utilisateur
   * @param {Object} state - Le nouvel état de l'application
   */
  handleStateChange(state) {
    // Mettre à jour le titre du document en fonction du type de tirage
    let title = 'JodoTarot';
    
    switch (state.spreadType) {
      case 'cross':
        title += ' - Tirage en Croix';
        break;
      case 'horseshoe':
        title += ' - Tirage en Fer à Cheval';
        break;
      case 'love':
        title += ' - Tarot de l\'Amour';
        break;
      case 'celticCross':
        title += ' - Croix Celtique';
        break;
    }
    
    document.title = title;
    
    // Mettre à jour la visibilité des messages d'erreur
    if (state.error) {
      this.showError(state.error);
    }
    
    // Afficher/masquer le spinner de chargement
    this.updateLoadingState(state.isLoading);
  }
  
  /**
   * Met à jour l'état de chargement dans l'interface
   * @param {boolean} isLoading - Si l'application est en cours de chargement
   */
  updateLoadingState(isLoading) {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }
  
  /**
   * Affiche un message d'erreur
   * @param {string} message - Message d'erreur à afficher
   */
  showError(message) {
    if (this.uiService) {
      this.uiService.showError(message);
    } else {
      console.error(message);
      alert(message);
    }
  }
}

export default AppController; 