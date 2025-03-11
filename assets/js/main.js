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
  console.log("Initialisation de JodoTarot...");
  
  try {
    // Créer et initialiser les services
    stateManager = new StateManager();
    aiService = new AIService(stateManager);
    deckService = new DeckService(stateManager);
    uiService = new UIService();
    
    // Créer et initialiser les contrôleurs
    configController = new ConfigController(stateManager, aiService);
    readingController = new ReadingController(stateManager, deckService, aiService);
    appController = new AppController(stateManager, configController, readingController);
    
    // Charger les ressources nécessaires
    await loadInitialResources();
    
    // Configurer les écouteurs d'événements globaux
    setupEventListeners();
    
    // Améliorer le défilement
    enhanceScrolling();
    
    console.log("JodoTarot initialisé avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de JodoTarot:", error);
    showErrorMessage("Erreur lors de l'initialisation de l'application");
  }
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
}

/**
 * Améliore le défilement dans l'application, en particulier pour la zone d'interprétation
 */
function enhanceScrolling() {
  // Obtenir les références aux éléments concernés
  const interpretationPanel = document.querySelector('.interpretation-panel');
  const interpretationsResponse = document.getElementById('interpretations-response');
  
  if (!interpretationsResponse) return;
  
  // S'assurer que la zone d'interprétation peut recevoir le focus
  interpretationsResponse.setAttribute('tabindex', '0');
  
  // Empêcher la propagation des événements de défilement
  interpretationsResponse.addEventListener('wheel', (event) => {
    // Vérifier si l'élément de réponse est visible
    if (interpretationsResponse.style.display === 'none') return;
    
    // Obtenir la hauteur totale et visible
    const scrollHeight = interpretationsResponse.scrollHeight;
    const clientHeight = interpretationsResponse.clientHeight;
    
    // Si le contenu est plus grand que la zone visible, gérer le défilement
    if (scrollHeight > clientHeight) {
      // Calculer la direction et la quantité de défilement
      const delta = event.deltaY;
      const scrollTop = interpretationsResponse.scrollTop;
      
      // Vérifier si on est au début ou à la fin du contenu
      if ((delta > 0 && scrollTop + clientHeight < scrollHeight) || 
          (delta < 0 && scrollTop > 0)) {
        // Empêcher le défilement de la page et appliquer à notre élément
        event.preventDefault();
        interpretationsResponse.scrollTop += delta;
      }
    }
  }, { passive: false });
  
  // Ajouter des styles pour indiquer que l'élément est défilable
  const style = document.createElement('style');
  style.textContent = `
    #interpretations-response {
      scrollbar-width: thin;
      scrollbar-color: rgba(107, 91, 149, 0.5) transparent;
      transition: box-shadow 0.2s ease;
    }
    #interpretations-response:hover {
      box-shadow: 0 0 8px rgba(107, 91, 149, 0.3);
    }
    .response-content {
      padding-right: 16px; /* Espace pour la scrollbar */
    }
  `;
  document.head.appendChild(style);
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