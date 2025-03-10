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
      imageUrl: `assets/images/tarot/set01/${fileName}`,
      backImageUrl: `assets/images/tarot/set01/22 Dos de carte.png`,
      keywords: []
    };
  }),
  
  'set02': Array(23).fill().map((_, i) => {
    // Pour le second jeu (Rider-Waite)
    const cardId = i.toString().padStart(2, '0');
    
    // Noms des arcanes majeurs
    const majorArcanaNames = {
      "00": "The Fool",
      "01": "The Magician",
      "02": "The High Priestess",
      "03": "The Empress",
      "04": "The Emperor",
      "05": "The Hierophant",
      "06": "The Lovers",
      "07": "The Chariot",
      "08": "Strength",
      "09": "The Hermit",
      "10": "Wheel of Fortune",
      "11": "Justice",
      "12": "The Hanged Man",
      "13": "Death",
      "14": "Temperance",
      "15": "The Devil",
      "16": "The Tower",
      "17": "The Star",
      "18": "The Moon",
      "19": "The Sun",
      "20": "Judgement",
      "21": "The World",
      "22": "Card Back"
    };
    
    return {
      id: i,
      name: majorArcanaNames[cardId],
      imageUrl: `assets/images/tarot/set02/${cardId}.jpg`,
      backImageUrl: `assets/images/tarot/set02/22.jpg`,
      keywords: []
    };
  })
};

/**
 * Fonction pour rechercher et charger les modèles Ollama locaux disponibles
 */
async function chargerModelesOllama() {
  try {
    // Tester la connexion à Ollama
    const connectivityResult = await testOllamaConnectivity();
    
    if (connectivityResult.success) {
      // Si la connexion est établie, récupérer la liste des modèles disponibles
      const modeles = await obtenirModelesOllama();
      
      // Récupérer la liste déroulante des modèles
      const selectModele = document.getElementById('ia-model');
      
      // Sauvegarder le modèle actuellement sélectionné
      const modelActuel = selectModele.value;
      
      // Vider la liste
      while (selectModele.options.length > 0) {
        selectModele.remove(0);
      }
      
      // Ajouter l'option par défaut d'OpenAI
      const optionGPT = document.createElement('option');
      optionGPT.value = 'gpt-4o';
      optionGPT.textContent = 'GPT-4o (OpenAI)';
      selectModele.appendChild(optionGPT);
      
      // Ajouter l'option 3.5 d'OpenAI
      const optionGPT35 = document.createElement('option');
      optionGPT35.value = 'gpt-3.5-turbo';
      optionGPT35.textContent = 'GPT-3.5 (OpenAI)';
      selectModele.appendChild(optionGPT35);
      
      // Ajouter l'option Claude
      const optionClaude = document.createElement('option');
      optionClaude.value = 'claude-3-opus-20240229';
      optionClaude.textContent = 'Claude-3 Opus (Anthropic)';
      selectModele.appendChild(optionClaude);
      
      // Ajouter les modèles Ollama disponibles
      modeles.forEach(modele => {
        const option = document.createElement('option');
        option.value = `ollama:${modele.name}`;
        option.textContent = `${modele.name} (Ollama - Local)`;
        selectModele.appendChild(option);
      });
      
      // Restaurer le modèle précédemment sélectionné, si disponible
      if (Array.from(selectModele.options).some(option => option.value === modelActuel)) {
        selectModele.value = modelActuel;
      }
      
      // Afficher le badge de connexion Ollama
      document.getElementById('ollama-status').className = 'status connected';
      document.getElementById('ollama-status-text').textContent = 'Ollama connecté';
    } else {
      // En cas d'échec de connexion
      document.getElementById('ollama-status').className = 'status disconnected';
      document.getElementById('ollama-status-text').textContent = 'Ollama non connecté';
    }
  } catch (error) {
    console.error("Erreur lors du chargement des modèles Ollama:", error);
    document.getElementById('ollama-status').className = 'status error';
    document.getElementById('ollama-status-text').textContent = 'Erreur Ollama';
  }
}

// Exporter les fonctions et données nécessaires
export { 
  cardsData, 
  chargerModelesOllama, 
  updatePersonaLogo, 
  getPersonaLabel 
}; 