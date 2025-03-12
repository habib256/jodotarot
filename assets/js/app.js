/**
 * Point d'entrée principal de l'application Jodotarot
 */

// Import des services d'API nécessaires
import { obtenirReponseGPT4O, obtenirModelesOllama, testOllamaConnectivity } from './api.js';

// Import des fonctions UI encore utilisées
import { 
  updatePersonaLogo, 
  getPersonaLabel,
  updateUILanguage,
  updateAppTitle
} from './ui.js';

// Import des fonctions de traduction
import { TRANSLATIONS, getTranslation } from './translations/index.js';

/**
 * Génère les données des cartes pour un jeu spécifique
 * @param {string} setId - Identifiant du jeu ('set01' ou 'set02')
 * @returns {Array} - Tableau d'objets contenant les données des cartes
 */
function generateCardSet(setId) {
  // Définir les configurations spécifiques à chaque jeu
  const setConfigs = {
    'set01': {
      // Tarot de Marseille
      directory: 'marseille',
      extension: 'png',
      names: {
        "00": "Le fou",
        "01": "Bateleur",
        "02": "Papesse",
        "03": "Imperatrice",
        "04": "Empereur",
        "05": "Pape",
        "06": "Les amoureux",
        "07": "Chariot",
        "08": "Justice",
        "09": "Hermite",
        "10": "Roue fortune",
        "11": "Force",
        "12": "Pendu",
        "13": "Sans nom",
        "14": "Temperance",
        "15": "Diable",
        "16": "Maison dieu",
        "17": "Etoile",
        "18": "Lune",
        "19": "Soleil",
        "20": "Jugement",
        "21": "Monde",
        "22": "Dos de carte"
      }
    },
    'set02': {
      // Tarot Thiago Lehmann
      directory: 'lehmann',
      extension: 'jpg',
      names: {
        "00": "Le fou",
        "01": "Bateleur",
        "02": "Papesse",
        "03": "Imperatrice",
        "04": "Empereur",
        "05": "Pape",
        "06": "Les amoureux",
        "07": "Chariot",
        "08": "Justice",
        "09": "Ermite",
        "10": "La roue",
        "11": "Force",
        "12": "Le pendu",
        "13": "La mort",
        "14": "Temperance",
        "15": "Diable",
        "16": "La Tour",
        "17": "Etoile",
        "18": "La lune",
        "19": "Le soleil",
        "20": "Le jugement",
        "21": "Le monde",
        "22": "Dos de carte"
      }
    }
  };
  
  // Obtenir la configuration pour le jeu demandé
  const config = setConfigs[setId];
  if (!config) {
    throw new Error(`Jeu de cartes inconnu: ${setId}`);
  }
  
  // Générer le tableau de cartes
  return Array(23).fill().map((_, i) => {
    const cardId = i.toString().padStart(2, '0');
    const name = config.names[cardId];
    
    return {
      id: i,
      name: name,
      imageUrl: `assets/images/cards/${config.directory}/${cardId} ${name}.${config.extension}`,
      backImageUrl: `assets/images/cards/${config.directory}/22 Dos de carte.${config.extension}`,
      keywords: []
    };
  });
}

/**
 * Données des cartes de tarot pour les différents jeux
 */
const cardsData = {
  'set01': generateCardSet('set01'),
  'set02': generateCardSet('set02')
};

/**
 * Fonction pour rechercher et charger les modèles Ollama locaux disponibles
 * @deprecated Utiliser plutôt ConfigController.loadOllamaModels()
 */
async function chargerModelesOllama() {
  console.warn("Cette fonction est dépréciée. Utiliser ConfigController.loadOllamaModels() à la place.");
  
  // Importer le ConfigController si besoin
  try {
    const ConfigController = await import('./controllers/ConfigController.js');
    const configController = new ConfigController();
    return await configController.loadOllamaModels();
  } catch (error) {
    console.error("Erreur lors du chargement des modèles Ollama:", error);
    return false;
  }
}

// Exporter les fonctions et données nécessaires
export { 
  cardsData, 
  chargerModelesOllama, 
  updatePersonaLogo, 
  getPersonaLabel 
}; 