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

// Import des personas
import TarologuePersona from './models/personas/TarologuePersona.js';
import OraclePersona from './models/personas/OraclePersona.js';
import JungPersona from './models/personas/JungPersona.js';
import VoyantePersona from './models/personas/VoyantePersona.js';
import FreudPersona from './models/personas/FreudPersona.js';
import PretrePersona from './models/personas/PretrePersona.js';
import SorcierePersona from './models/personas/SorcierePersona.js';
import SocratePersona from './models/personas/SocratePersona.js';
import DemonPersona from './models/personas/DemonPersona.js';
import RabbinPersona from './models/personas/RabbinPersona.js';
import AlchimistePersona from './models/personas/AlchimistePersona.js';
import LacanPersona from './models/personas/LacanPersona.js';
import NoEgoPersona from './models/personas/NoEgoPersona.js';
import DalailamaPersona from './models/personas/DalailamaPersona.js';
import MagePersona from './models/personas/MagePersona.js';
import DoltoPersona from './models/personas/DoltoPersona.js';
import MontaignePersona from './models/personas/MontaignePersona.js';
import ImamPersona from './models/personas/ImamPersona.js';
import FrancmaconPersona from './models/personas/FrancmaconPersona.js';
import SalomonPersona from './models/personas/SalomonPersona.js';
import QuichottePersona from './models/personas/QuichottePersona.js';

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
    
    // Initialiser les services et contrôleurs
    await initializeApp();
    
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
 * Initialise les services et contrôleurs
 */
async function initializeApp() {
  // Créer les instances des services
  stateManager = new StateManager();
  aiService = new AIService();
  deckService = new DeckService();
  uiService = new UIService();
  
  // Créer les instances des contrôleurs
  appController = new AppController(stateManager);
  readingController = new ReadingController(stateManager, deckService, aiService);
  configController = new ConfigController(stateManager, aiService);
  
  // Enregistrer les personas
  registerPersona('tarologue', TarologuePersona);
  registerPersona('oracle', OraclePersona);
  registerPersona('jung', JungPersona);
  registerPersona('voyante', VoyantePersona);
  registerPersona('freud', FreudPersona);
  registerPersona('pretre', PretrePersona);
  registerPersona('rabbin', RabbinPersona);
  registerPersona('imam', ImamPersona);
  registerPersona('dalailama', DalailamaPersona);
  registerPersona('sorciere', SorcierePersona);
  registerPersona('alchimiste', AlchimistePersona);
  registerPersona('mage', MagePersona);
  registerPersona('francmacon', FrancmaconPersona);
  registerPersona('socrate', SocratePersona);
  registerPersona('montaigne', MontaignePersona);
  registerPersona('salomon', SalomonPersona);
  registerPersona('quichotte', QuichottePersona);
  registerPersona('lacan', LacanPersona);
  registerPersona('dolto', DoltoPersona);
  registerPersona('demon', DemonPersona);
  registerPersona('noegoman', NoEgoPersona);
}

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
      await deckService.loadDeck('set01');
      console.log("✅ Jeu de cartes par défaut (set01) chargé avec succès");
      stateManager.setState({ deckId: 'set01' });
    } catch (deckError) {
      console.error("❌ Erreur lors du chargement du jeu de cartes par défaut:", deckError);
      showErrorMessage('Erreur lors du chargement du jeu de cartes');
    }
    
    // Mettre à jour le titre de l'application
    configController.updateAppTitle();
    
    // Initialiser le logo avec le persona par défaut
    configController.updatePersonaLogo('tarologue');
    
    // Charger les modèles d'IA disponibles
    const ollamaModelsLoaded = await configController.loadOllamaModels();
    
    // Si aucun modèle Ollama n'est disponible, utiliser OpenAI par défaut
    if (!ollamaModelsLoaded) {
      document.getElementById('ia-model').value = 'openai/gpt-3.5-turbo';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error);
    throw error;
  }
}

/**
 * Configure les écouteurs d'événements entre contrôleurs
 */
function setupEventListeners() {
  // Écouter le changement de persona pour réinitialiser l'affichage
  document.addEventListener('persona:changed', () => {
    readingController.resetDisplays();
  });
  
  // Écouter le changement de jeu de cartes
  document.addEventListener('cardSet:changed', (event) => {
    readingController.changeDeck(event.detail.cardSet);
  });
  
  // Écouter le changement de type de tirage
  document.addEventListener('spreadType:changed', (event) => {
    const { spreadType } = event.detail;
    readingController.resetDisplays();
    console.log(`Type de tirage changé pour: ${spreadType}`);
  });
}

/**
 * Crée une instance de tirage
 * @param {string} key - Identifiant du type de tirage
 * @param {HTMLElement} container - Conteneur DOM
 * @param {string} language - Code de langue
 * @return {BaseSpread} Instance de la disposition
 */
export function createSpread(key, container, language = 'fr') {
  const SpreadClass = window.registries.spreads[key];
  if (!SpreadClass) {
    throw new Error(`Disposition non trouvée: ${key}`);
  }
  return new SpreadClass(container, language);
}

/**
 * Crée une instance de persona
 * @param {string} key - Clé du persona
 * @param {string} language - Code de langue
 * @return {BasePersona} Instance du persona
 */
export function createPersona(key, language = 'fr') {
  const PersonaClass = window.registries.personas[key];
  if (!PersonaClass) {
    throw new Error(`Persona non trouvé: ${key}`);
  }
  return new PersonaClass(language);
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Message d'erreur à afficher
 */
function showErrorMessage(message) {
  uiService?.showError(message) || console.error(message);
} 