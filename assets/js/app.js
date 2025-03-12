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
 * Données des cartes de tarot pour les différents jeux
 * Structure persistée pour compatibilité avec code existant
 */
const cardsData = {
  'set01': Array(23).fill().map((_, i) => {
    // Noms de fichiers pour le set01 (Tarot de Marseille)
    let fileName;
    if (i === 22) {
      fileName = "22 Dos de carte.png"; // Dos de carte
    } else {
      // Utiliser le format de nom existant (ex: "00 Le fou.png")
      const paddedNum = i.toString().padStart(2, '0');
      
      // Correspondance des noms de fichiers
      const fileNames = {
        "00": "00 Le fou.png",
        "01": "01 Bateleur.png",
        "02": "02 Papesse.png",
        "03": "03 Imperatrice.png",
        "04": "04 Empereur.png",
        "05": "05 Pape.png",
        "06": "06 Les amoureux.png",
        "07": "07 Chariot.png",
        "08": "08 Justice.png",
        "09": "09 Hermite.png",
        "10": "10 Roue fortune.png",
        "11": "11 Force.png",
        "12": "12 Pendu.png",
        "13": "13 Sans nom.png",
        "14": "14 Temperance.png",
        "15": "15 Diable.png",
        "16": "16 Maison dieu.png",
        "17": "17 Etoile.png",
        "18": "18 Lune.png",
        "19": "19 Soleil.png",
        "20": "20 Jugement.png",
        "21": "21 Monde.png"
      };
      
      fileName = fileNames[paddedNum];
    }
    
    // Création de l'objet carte
    return {
      id: i,
      name: fileName.substring(3).split('.')[0],
      imageUrl: `assets/images/cards/marseille/${fileName}`,
      backImageUrl: `assets/images/cards/marseille/22 Dos de carte.png`,
      keywords: []
    };
  }),
  
  'set02': Array(23).fill().map((_, i) => {
    // Pour le second jeu (Tarot Thiago Lehmann)
    const cardId = i.toString().padStart(2, '0');
    
    // Noms des arcanes majeurs en français (comme dans les fichiers)
    const majorArcanaNames = {
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
    };
    
    return {
      id: i,
      name: majorArcanaNames[cardId],
      imageUrl: `assets/images/cards/lehmann/${cardId} ${majorArcanaNames[cardId]}.jpg`,
      backImageUrl: `assets/images/cards/lehmann/22 Dos de carte.png`,
      keywords: []
    };
  })
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