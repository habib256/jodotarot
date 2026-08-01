/**
 * Point d'entrée principal de l'application JodoTarot
 * Initialise et coordonne tous les composants
 */
import StateManager from './utils/StateManager.js';
import AppController from './controllers/AppController.js';
import ReadingController from './controllers/ReadingController.js';
import ConfigController from './controllers/ConfigController.js';
import AIService from './services/AIService.js';
import DeckService from './services/DeckService.js';
import UIService from './services/UIService.js';
import CardEnlarger from './utils/CardEnlarger.js';
import { getTranslation } from './translations/index.js';

// Instances des services et contrôleurs
let stateManager;
let aiService;
let deckService;
let uiService;
let appController;
let readingController;
let configController;
let cardEnlarger;

// Fonction d'initialisation principale
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initialisation de JodoTarot...');

  try {
    // Créer et initialiser le gestionnaire d'état en premier
    stateManager = new StateManager();

    // Initialiser le StateManager de manière asynchrone
    // et attendre que l'état soit complètement chargé
    await stateManager.initialize();

    // Créer les services après l'initialisation de l'état
    aiService = new AIService(stateManager);
    deckService = new DeckService();
    uiService = new UIService();

    // Initialiser le gestionnaire d'agrandissement des cartes
    cardEnlarger = new CardEnlarger(stateManager);

    // Créer et initialiser les contrôleurs
    configController = new ConfigController(stateManager, aiService, uiService);
    readingController = new ReadingController(stateManager, deckService, aiService);
    appController = new AppController(stateManager, configController, readingController, uiService);

    // Charger les ressources initiales
    await loadInitialResources();

    // Configurer les écouteurs d'événements
    setupEventListeners();

    // Restaurer le tirage sauvegardé une fois le jeu de cartes disponible
    await appController.restoreSavedReading();

    console.log('JodoTarot initialisé avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de JodoTarot:', error);
    showErrorMessage('Une erreur est survenue lors de l\'initialisation de l\'application');
  }
});

/**
 * Charge les ressources initiales
 */
async function loadInitialResources() {
  try {
    // Charger le jeu de cartes sélectionné dans l'état
    const selectedCardSet = stateManager.getState().cardSet;
    try {
      // Vérifier si le jeu est déjà chargé pour éviter les doublons
      if (!deckService.isDeckLoaded(selectedCardSet)) {
        await deckService.loadDeck(selectedCardSet);
      }
    } catch (deckError) {
      console.error("❌ Erreur lors du chargement du jeu de cartes:", deckError);
      throw deckError;
    }

    // Mettre à jour le titre de l'application
    configController.updateAppTitle();

    // Charger les modèles d'IA disponibles (fallback géré par ConfigController)
    await configController.loadOllamaModels();

    return true;
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error);
    showErrorMessage(`Erreur d'initialisation: ${error.message}`);
    throw error;
  }
}

/**
 * Configure les écouteurs d'événements globaux
 */
function setupEventListeners() {
  // Écouteur pour les erreurs globales
  window.addEventListener('error', (event) => {
    console.error('Erreur globale:', event.error || event.message);
    // event.error est null pour les erreurs cross-origin: se rabattre sur event.message
    const details = event.error?.message || event.message;
    if (details) {
      showErrorMessage(`Une erreur s'est produite: ${details}`);
    }
  });

  // Écouteur pour les rejets de promesses non gérés
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesse rejetée non gérée:', event.reason);
    const details = event.reason?.message || event.reason;
    if (details) {
      showErrorMessage(`Erreur asynchrone: ${details}`);
    }
  });

  // Ajouter l'écouteur pour le bouton de copie
  const copyButton = document.getElementById('copy-button');
  if (copyButton) {
    copyButton.addEventListener('click', handleCopyButtonClick);
  } else {
    console.error('Bouton de copie non trouvé dans le DOM');
  }
}

/**
 * Gère le clic sur le bouton de copie
 * Copie le contenu de l'interprétation (ou du prompt) dans le presse-papier
 */
async function handleCopyButtonClick() {
  const copyButton = document.getElementById('copy-button');
  const responseContent = document.querySelector('.response-content');
  const label = copyButton?.querySelector('span:last-of-type');

  if (!responseContent || !label) return;

  const language = stateManager.getState().language;

  try {
    const textToCopy = responseContent.textContent;

    // Copier dans le presse-papier (avec fallback pour file://)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    // Afficher un retour visuel de succès
    copyButton.classList.add('success');
    label.textContent = getTranslation('header.copyButtonCopied', language);
  } catch (error) {
    console.error('Erreur lors de la copie :', error);
    label.textContent = getTranslation('header.copyButtonError', language);
  } finally {
    // Revenir à l'état normal après un délai
    clearTimeout(handleCopyButtonClick.resetTimeout);
    handleCopyButtonClick.resetTimeout = setTimeout(() => {
      copyButton.classList.remove('success');
      label.textContent = getTranslation('header.copyButton', stateManager.getState().language);
    }, 2000);
  }
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Message d'erreur à afficher
 */
function showErrorMessage(message) {
  if (uiService) {
    uiService.showError(message);
  } else {
    console.error(message);
  }
}
