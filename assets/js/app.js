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
      optionGPT.value = 'openai:gpt-4o';
      optionGPT.textContent = 'GPT-4o (OpenAI)';
      selectModele.appendChild(optionGPT);
      
      // Ajouter l'option 3.5 d'OpenAI
      const optionGPT35 = document.createElement('option');
      optionGPT35.value = 'openai:gpt-3.5-turbo';
      optionGPT35.textContent = 'GPT-3.5 (OpenAI)';
      selectModele.appendChild(optionGPT35);
      
      // Ajouter l'option Claude
      const optionClaude = document.createElement('option');
      optionClaude.value = 'anthropic:claude-3-opus-20240229';
      optionClaude.textContent = 'Claude-3 Opus (Anthropic)';
      selectModele.appendChild(optionClaude);
      
      // Ajouter les modèles Ollama disponibles
      if (modeles && modeles.length > 0) {
        // Trier les modèles par ordre alphabétique
        modeles.sort((a, b) => a.name.localeCompare(b.name));
        
        modeles.forEach(modele => {
          const option = document.createElement('option');
          option.value = `ollama:${modele.name}`;
          option.textContent = `${modele.name} (Ollama - Local)`;
          selectModele.appendChild(option);
        });
        
        console.log(`Modèles Ollama chargés: ${modeles.length} modèles trouvés.`);
      } else {
        console.warn('Aucun modèle Ollama disponible.');
      }
      
      // Restaurer le modèle précédemment sélectionné, si disponible
      if (Array.from(selectModele.options).some(option => option.value === modelActuel)) {
        selectModele.value = modelActuel;
      }
      
      // Afficher un message de statut positif
      const statusElement = document.getElementById('status-message');
      if (statusElement) {
        statusElement.textContent = "Ollama connecté avec succès.";
        statusElement.style.display = 'block';
        statusElement.className = 'success-message';
        
        // Masquer le message après 3 secondes
        setTimeout(() => {
          statusElement.style.display = 'none';
        }, 3000);
      }
    } else {
      // En cas d'échec de connexion
      console.warn('Connexion à Ollama échouée:', connectivityResult.message);
      
      // Afficher un message d'erreur
      const statusElement = document.getElementById('status-message');
      if (statusElement) {
        statusElement.textContent = connectivityResult.message || "Impossible de se connecter au serveur Ollama.";
        statusElement.style.display = 'block';
        statusElement.className = 'error-message';
        
        // Ajouter des suggestions si disponibles
        if (connectivityResult.suggestions && connectivityResult.suggestions.length > 0) {
          const suggestionsText = connectivityResult.suggestions
            .map(s => s.startsWith('warnings.') ? getTranslation(s, document.documentElement.lang) : s)
            .join(' | ');
          
          statusElement.textContent += ` Suggestions: ${suggestionsText}`;
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement des modèles Ollama:", error);
    
    // Afficher un message d'erreur
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
      statusElement.textContent = `Erreur: ${error.message}`;
      statusElement.style.display = 'block';
      statusElement.className = 'error-message';
    }
  }
}

// Exporter les fonctions et données nécessaires
export { 
  cardsData, 
  chargerModelesOllama, 
  updatePersonaLogo, 
  getPersonaLabel 
}; 