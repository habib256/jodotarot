/**
 * Contrôleur principal de l'application JodoTarot
 * Responsable de la coordination des composants et de la gestion de l'état global
 */
import { getTranslation } from '../translations/index.js';

class AppController {
  /**
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   * @param {ConfigController} configController - Instance du contrôleur de configuration
   * @param {ReadingController} readingController - Instance du contrôleur de lecture
   * @param {UIService} uiService - Service UI pour l'affichage des messages
   */
  constructor(stateManager, configController, readingController, uiService) {
    this.stateManager = stateManager;
    this.configController = configController;
    this.readingController = readingController;
    this.uiService = uiService;

    // Restaurer la question saisie précédemment
    const questionInput = document.getElementById('question');
    if (questionInput) {
      questionInput.value = this.stateManager.getState().question;
    }

    // Appliquer les traductions et le titre correspondant à l'état restauré
    this.configController.updateUILanguage(this.stateManager.getState().language);
    this.updateDocumentTitle();

    // Écouter les changements d'état pour mettre à jour l'UI
    this.stateManager.subscribe(this.handleStateChange.bind(this));
  }

  /**
   * Restaure le tirage sauvegardé.
   * À appeler une fois le jeu de cartes chargé, sinon les images des cartes
   * ne peuvent pas être résolues.
   */
  restoreSavedReading() {
    const state = this.stateManager.getState();

    if (state.cards?.length > 0) {
      this.readingController.restoreReading(state.cards, state.interpretation);
    }
  }

  /**
   * Gère les changements d'état et met à jour l'interface utilisateur
   * @param {Object} state - Le nouvel état de l'application
   * @param {Object} changes - Les clés effectivement modifiées
   */
  handleStateChange(state, changes = {}) {
    if ('spreadType' in changes || 'language' in changes) {
      this.updateDocumentTitle();
    }

    // N'afficher une erreur qu'au moment où elle apparaît, et non à chaque
    // changement d'état tant qu'elle reste présente dans l'état.
    if (changes.error) {
      this.uiService?.showError(changes.error);
    }
  }

  /**
   * Met à jour le titre du document en fonction du type de tirage et de la langue
   */
  updateDocumentTitle() {
    const { spreadType, language } = this.stateManager.getState();
    document.title = `JodoTarot - ${getTranslation(`spreadTypes.${spreadType}`, language)}`;
  }
}

export default AppController;
