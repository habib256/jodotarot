/**
 * Contrôleur principal de l'application JodoTarot
 * Responsable de l'initialisation et de la coordination des composants
 */
import StateManager from '../utils/StateManager.js';
import ReadingController from './ReadingController.js';
import ConfigController from './ConfigController.js';
import AIService from '../services/AIService.js';
import DeckService from '../services/DeckService.js';
import UIService from '../services/UIService.js';

class AppController {
  /**
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   */
  constructor(stateManager) {
    this.stateManager = stateManager;
    
    // Services
    this.aiService = null;
    this.deckService = null;
    this.uiService = null;
    
    // Contrôleurs
    this.readingController = null;
    this.configController = null;
    
    // Écouter les changements d'état pour mettre à jour l'UI
    this.stateManager.subscribe(this.handleStateChange.bind(this));
    
    // Synchroniser l'UI avec l'état restauré
    this.syncUIWithState();
  }
  
  /**
   * Initialise l'application avec tous ses services et contrôleurs
   */
  async initialize() {
    try {
      // Initialiser les services
      this.initializeServices();
      
      // Initialiser les contrôleurs
      this.initializeControllers();
      
      // Charger les ressources initiales
      await this.loadInitialResources();
      
      // Configurer les écouteurs d'événements
      this.setupEventListeners();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'application:', error);
      this.showError('Une erreur est survenue lors de l\'initialisation de l\'application.');
      return false;
    }
  }
  
  /**
   * Initialise les services de l'application
   */
  initializeServices() {
    this.aiService = new AIService();
    this.deckService = new DeckService();
    this.uiService = new UIService();
  }
  
  /**
   * Initialise les contrôleurs de l'application
   */
  initializeControllers() {
    this.readingController = new ReadingController(
      this.stateManager,
      this.deckService,
      this.aiService
    );
    
    this.configController = new ConfigController(
      this.stateManager,
      this.aiService
    );
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
   * Charge les ressources initiales nécessaires
   */
  async loadInitialResources() {
    try {
      // Charger le jeu de cartes par défaut si aucun n'est défini dans l'état
      const state = this.stateManager.getState();
      const deckToLoad = state.cardSet || 'set01';
      
      const deckLoaded = await this.deckService.loadDeck(deckToLoad);
      if (!deckLoaded) {
        throw new Error('Impossible de charger le jeu de cartes.');
      }
      
      // Synchroniser l'UI avec l'état actuel
      this.syncUIWithState();
      
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement des ressources:', error);
      throw error;
    }
  }
  
  /**
   * Configure les écouteurs d'événements globaux
   */
  setupEventListeners() {
    // Écouteur pour le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      // Recalculer les positions des cartes si nécessaire
      this.readingController.updateCardDisplay();
    });
    
    // Écouteur pour les événements personnalisés
    document.addEventListener('error', (event) => {
      if (event.detail && event.detail.message) {
        this.showError(event.detail.message);
      }
    });
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