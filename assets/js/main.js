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

// Import dynamique des personas au lieu d'imports individuels
import { getAllPersonas } from './models/personas/index.js';

// Import des tirages
import CrossSpread from './models/spreads/CrossSpread.js';
import HorseshoeSpread from './models/spreads/HorseshoeSpread.js';
import LoveSpread from './models/spreads/LoveSpread.js';
import CelticCrossSpread from './models/spreads/CelticCrossSpread.js';

// Instances des services et contrôleurs
let stateManager;
let aiService;
let deckService;
let uiService;
let appController;
let readingController;
let configController;

// Initialisation des registres
window.registries = {
  personas: {},
  spreads: {}
};

// Fonction d'enregistrement des personas
function registerPersona(key, PersonaClass) {
  window.registries.personas[key] = PersonaClass;
}

// Fonction d'enregistrement des tirages
function registerSpread(key, SpreadClass) {
  window.registries.spreads[key] = SpreadClass;
}

// Fonction d'initialisation principale
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initialisation de JodoTarot...');
  
  try {
    // Enregistrer les tirages
    registerSpread('cross', CrossSpread);
    registerSpread('horseshoe', HorseshoeSpread);
    registerSpread('love', LoveSpread);
    registerSpread('celticCross', CelticCrossSpread);
    
    // Enregistrer tous les personas automatiquement
    const allPersonas = await getAllPersonas();
    for (const [key, PersonaClass] of Object.entries(allPersonas)) {
      registerPersona(key, PersonaClass);
    }
    
    // Créer et initialiser le gestionnaire d'état en premier
    stateManager = new StateManager();
    console.log('🔄 Initialisation du gestionnaire d\'état...');
    
    // Initialiser le StateManager de manière asynchrone
    // et attendre que l'état soit complètement chargé
    await stateManager.initialize();
    console.log('✅ État chargé avec succès');
    
    // Définir le jeu de cartes par défaut si non défini
    // Utilisez cardSet au lieu de deckId pour être cohérent avec le schéma d'état mis à jour
    stateManager.setState({ cardSet: 'set01' });
    
    // Créer les services après l'initialisation de l'état
    aiService = new AIService(stateManager);
    deckService = new DeckService(stateManager);
    uiService = new UIService();
    
    // Créer et initialiser les contrôleurs
    configController = new ConfigController(stateManager, aiService, uiService);
    readingController = new ReadingController(stateManager, deckService, aiService);
    appController = new AppController(stateManager, configController, readingController);
    
    // Charger les ressources initiales
    await loadInitialResources();
    
    // Configurer les écouteurs d'événements
    setupEventListeners();
    
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
    // Définir la langue française par défaut
    stateManager.setState({ language: 'fr' });
    
    // Forcer la sélection du tirage en croix au démarrage
    document.getElementById('spread-type').value = 'cross';
    stateManager.setState({ spreadType: 'cross' });
    
    // Charger le jeu de cartes par défaut (set01)
    try {
      // Vérifier si le jeu est déjà chargé pour éviter les doublons
      if (!deckService.isDeckLoaded('set01')) {
        await deckService.loadDeck('set01');
        console.log("✅ Jeu de cartes par défaut (set01) chargé avec succès");
      }
      stateManager.setState({ cardSet: 'set01' });
    } catch (deckError) {
      console.error("❌ Erreur lors du chargement du jeu de cartes par défaut:", deckError);
      showErrorMessage('Erreur lors du chargement du jeu de cartes');
    }
    
    // Mettre à jour le titre de l'application
    configController.updateAppTitle();
    
    // Charger les modèles d'IA disponibles
    const ollamaModelsLoaded = await configController.loadOllamaModels();
    
    // Si aucun modèle Ollama n'est disponible, vérifier OpenAI
    if (!ollamaModelsLoaded) {
      console.log("⚠️ Aucun modèle Ollama disponible, vérification des options alternatives");
      
      // Vérifier si OpenAI est configuré
      if (configController.aiService.apiKey && 
          configController.aiService.apiKey !== "YOUR API KEY") {
        console.log("➡️ Utilisation d'OpenAI comme modèle par défaut");
        document.getElementById('ia-model').value = 'openai/gpt-3.5-turbo';
      } else {
        // Ni Ollama ni OpenAI ne sont disponibles, utiliser le mode Prompt
        console.log("➡️ Ni Ollama ni OpenAI ne sont disponibles, utilisation du mode Prompt");
        configController.selectPromptMode();
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error);
    throw error;
  }
}

/**
 * Configure les écouteurs d'événements globaux
 */
function setupEventListeners() {
  // Écouteur pour les erreurs globales
  window.addEventListener('error', (event) => {
    console.error('Erreur globale:', event.error);
    showErrorMessage(`Une erreur s'est produite: ${event.error.message}`);
  });
  
  // Écouteur pour les rejets de promesses non gérés
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesse rejetée non gérée:', event.reason);
    showErrorMessage(`Erreur asynchrone: ${event.reason}`);
  });
  
  // Ajouter l'écouteur pour le bouton de copie
  const copyButton = document.getElementById('copy-button');
  if (copyButton) {
    console.log('Initialisation du bouton de copie');
    copyButton.addEventListener('click', handleCopyButtonClick);
  } else {
    console.error('Bouton de copie non trouvé dans le DOM');
  }
}

/**
 * Gère le clic sur le bouton de copie
 * Copie le contenu de l'interprétation ou du prompt dans le presse-papier
 */
async function handleCopyButtonClick() {
  const copyButton = document.getElementById('copy-button');
  const responseContent = document.querySelector('.response-content');
  
  if (!responseContent) return;
  
  try {
    // Récupérer le texte à copier
    let textToCopy = '';
    
    // Si nous sommes en mode prompt (sans IA), copier le prompt
    const currentModel = stateManager.getState().iaModel;
    if (currentModel === 'prompt') {
      // Si le prompt est affiché, le copier
      textToCopy = responseContent.textContent;
    } else {
      // Sinon, copier l'interprétation
      textToCopy = responseContent.textContent;
    }
    
    // Copier dans le presse-papier
    await navigator.clipboard.writeText(textToCopy);
    
    // Afficher un retour visuel de succès
    const originalText = copyButton.querySelector('span').textContent;
    copyButton.classList.add('success');
    copyButton.querySelector('span').textContent = 'Copié !';
    
    // Revenir à l'état normal après un délai
    setTimeout(() => {
      copyButton.classList.remove('success');
      copyButton.querySelector('span').textContent = originalText;
    }, 2000);
    
  } catch (error) {
    console.error('Erreur lors de la copie :', error);
    // Afficher un message d'erreur en cas d'échec
    copyButton.querySelector('span').textContent = 'Erreur !';
    setTimeout(() => {
      copyButton.querySelector('span').textContent = 'Copier';
    }, 2000);
  }
}

/**
 * Crée une instance de tirage
 * @param {string} key - Identifiant du type de tirage
 * @param {HTMLElement} container - Conteneur DOM
 * @param {string} language - Code de langue
 * @return {BaseSpread} Instance de la disposition
 */
export function createSpread(key, container, language = 'fr') {
  // Vérifier si le type de tirage est valide
  if (!window.registries.spreads || !window.registries.spreads[key]) {
    console.error(`Type de tirage non trouvé: ${key}`);
    // Utiliser un type de tirage par défaut (croix)
    key = 'cross';
    // Si même le type par défaut n'existe pas, lancer une erreur
    if (!window.registries.spreads[key]) {
      throw new Error(`Aucun type de tirage disponible`);
    }
  }
  
  try {
    const SpreadClass = window.registries.spreads[key];
    return new SpreadClass(container, language);
  } catch (error) {
    console.error(`Erreur lors de la création du tirage ${key}:`, error);
    throw new Error(`Impossible de créer le tirage: ${error.message}`);
  }
}

/**
 * Crée une instance de persona
 * @param {string} key - Clé du persona
 * @param {string} language - Code de langue
 * @return {BasePersona} Instance du persona
 */
export function createPersona(key, language = 'fr') {
  // Vérifier si le persona est valide
  if (!window.registries.personas || !window.registries.personas[key]) {
    console.error(`Persona non trouvé: ${key}`);
    // Utiliser un persona par défaut (tarologue)
    key = 'tarologue';
    // Si même le persona par défaut n'existe pas, lancer une erreur
    if (!window.registries.personas[key]) {
      throw new Error(`Aucun persona disponible`);
    }
  }
  
  try {
    const PersonaClass = window.registries.personas[key];
    return new PersonaClass(language);
  } catch (error) {
    console.error(`Erreur lors de la création du persona ${key}:`, error);
    throw new Error(`Impossible de créer le persona: ${error.message}`);
  }
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Message d'erreur à afficher
 */
function showErrorMessage(message) {
  uiService?.showError(message) || console.error(message);
} 