/**
 * Contrôleur responsable des tirages de cartes
 * Gère la logique d'affichage et de manipulation des tirages
 */
import StateManager from '../utils/StateManager.js';
import DeckService from '../services/DeckService.js';
import AIService from '../services/AIService.js';
import { createSpread } from '../main.js';

class ReadingController {
  /**
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   * @param {DeckService} deckService - Service de gestion des jeux de cartes
   * @param {AIService} aiService - Service pour les interprétations par IA
   */
  constructor(stateManager, deckService, aiService) {
    this.stateManager = stateManager;
    this.deckService = deckService;
    this.aiService = aiService;
    
    // État local du contrôleur
    this.currentReading = [];
    this.currentQuestion = "";
    this.currentSpread = null;
    
    // Éléments DOM
    this.elements = {
      spreadPanels: {
        cross: document.getElementById('spread'),
        horseshoe: document.getElementById('horseshoe-spread'),
        love: document.getElementById('love-spread'),
        celticCross: document.getElementById('celtic-cross-spread')
      },
      spreadZone: document.querySelector('.spread-panel'),
      interpretationPanel: document.querySelector('.interpretation-panel'),
      responseContent: document.querySelector('.response-content'),
      loadingAnimations: document.getElementById('loading-animations'),
      tirerButton: document.getElementById('tirer'),
      questionInput: document.getElementById('question')
    };
    
    // Initialisation des écouteurs d'événements
    this.initEventListeners();
    
    // Initialiser les positions de cartes pour tous les tirages au démarrage
    this.initializeAllSpreads();
    this.initializeDeck();
    this.initScrollHandlers();
    
    // Charger le type de tirage par défaut
    this.showSpread(this.stateManager.getState().spreadType || 'cross');
  }
  
  /**
   * Initialise les écouteurs d'événements
   */
  initEventListeners() {
    // Bouton de tirage
    this.elements.tirerButton.addEventListener('click', this.performReading.bind(this));
    
    // Écouter les changements de jeu de cartes
    document.addEventListener('deckId:changed', async (event) => {
      console.log(`🎴 Changement de jeu détecté: ${event.detail.deckId}`);
      try {
        // Charger le nouveau jeu
        await this.changeDeck(event.detail.deckId);
        console.log(`✅ Nouveau jeu chargé: ${event.detail.deckId}`);
      } catch (error) {
        console.error(`❌ Erreur lors du chargement du jeu ${event.detail.deckId}:`, error);
      }
    });
    
    // Changement de type de tirage
    document.getElementById('spread-type').addEventListener('change', (event) => {
      const spreadType = event.target.value;
      this.stateManager.setState({ spreadType });
      this.updateSpreadDisplay(spreadType);
    });
  }
  
  /**
   * Initialise tous les types de tirages avec leurs positions de cartes
   */
  initializeAllSpreads() {
    // Récupérer la langue actuelle
    const state = this.stateManager.getState();
    const language = state.language || 'fr';
    
    // Initialiser le tirage en croix
    this.crossSpread = createSpread('cross', this.elements.spreadPanels.cross, language);
    this.crossSpread.initializeCardPositions();
    
    // Initialiser le tirage en fer à cheval
    this.horseshoeSpread = createSpread('horseshoe', this.elements.spreadPanels.horseshoe, language);
    this.horseshoeSpread.initializeCardPositions();
    
    // Initialiser le tirage de l'amour
    this.loveSpread = createSpread('love', this.elements.spreadPanels.love, language);
    this.loveSpread.initializeCardPositions();
    
    // Initialiser le tirage en croix celtique
    this.celticCrossSpread = createSpread('celticCross', this.elements.spreadPanels.celticCross, language);
    this.celticCrossSpread.initializeCardPositions();
    
    // Afficher le tirage initial (par défaut en croix)
    this.updateSpreadDisplay(state.spreadType || 'cross');
  }
  
  /**
   * S'assure qu'un jeu de cartes est chargé
   */
  async initializeDeck() {
    try {
      // Vérifier si un jeu est déjà chargé
      let deck = this.deckService.getCurrentDeck();
      if (!deck) {
        console.log("🃏 Aucun jeu chargé au démarrage, chargement du jeu par défaut (set01)...");
        try {
          // Tenter de charger le jeu par défaut
          deck = await this.deckService.loadDeck('set01');
          console.log("✅ Jeu de cartes 'set01' chargé avec succès");
          console.log(`📊 ${deck.getAllCards().length} cartes chargées au total`);
          
          // Mettre à jour l'état
          this.stateManager.setState({ deckId: 'set01' });
        } catch (error) {
          console.error("❌ Erreur lors du chargement du jeu par défaut:", error);
          // Afficher l'erreur dans l'interface
          if (this.elements.interpretationsDiv) {
            this.elements.interpretationsDiv.innerHTML = `
              <div class="error-message">
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger le jeu de cartes. Veuillez rafraîchir la page et réessayer.</p>
                <p>Détails: ${error.message}</p>
              </div>
            `;
          }
        }
      } else {
        console.log(`✅ Jeu de cartes '${deck.deckId}' déjà chargé (${deck.getAllCards().length} cartes)`);
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation du jeu:", error);
    }
  }
  
  /**
   * Met à jour l'affichage pour montrer le type de tirage spécifié
   * @param {string} spreadType - Type de tirage à afficher (cross, horseshoe, love, celticCross)
   */
  showSpread(spreadType) {
    // Masquer tous les conteneurs
    this.elements.spreadPanels.cross.style.display = 'none';
    this.elements.spreadPanels.horseshoe.style.display = 'none';
    this.elements.spreadPanels.love.style.display = 'none';
    this.elements.spreadPanels.celticCross.style.display = 'none';
    
    // Afficher le conteneur approprié
    switch (spreadType) {
      case 'horseshoe':
        this.elements.spreadPanels.horseshoe.style.display = 'flex';
        break;
      case 'love':
        this.elements.spreadPanels.love.style.display = 'flex';
        break;
      case 'celticCross':
        this.elements.spreadPanels.celticCross.style.display = 'flex';
        break;
      case 'cross':
      default:
        this.elements.spreadPanels.cross.style.display = 'flex';
        break;
    }
  }
  
  /**
   * Met à jour l'affichage en fonction du type de tirage sélectionné
   * @param {string} spreadType - Type de tirage
   */
  updateSpreadDisplay(spreadType) {
    // Afficher le tirage approprié
    this.showSpread(spreadType);
    
    // Mettre à jour le tirage courant
    switch (spreadType) {
      case 'horseshoe':
        this.currentSpread = this.horseshoeSpread;
        break;
      case 'love':
        this.currentSpread = this.loveSpread;
        break;
      case 'celticCross':
        this.currentSpread = this.celticCrossSpread;
        break;
      case 'cross':
      default:
        this.currentSpread = this.crossSpread;
        break;
    }
  }
  
  /**
   * Sérialise une carte pour le stockage dans l'état
   * @param {Card} card - Carte à sérialiser
   * @returns {Object} Carte sérialisée
   */
  serializeCard(card) {
    console.log('Sérialisation de la carte:', card);
    
    if (!card || typeof card !== 'object') {
      console.error('Erreur: tentative de sérialiser une carte invalide:', card);
      return null;
    }
    
    // Utiliser directement la propriété number qui est toujours présente et déjà un nombre
    const cardId = card.number;
    
    const serialized = {
      id: cardId,
      name: String(card.name || ''),
      imageUrl: String(card.imageUrl || ''),
      position: card.orientation || card.position || 'upright'
    };
    
    console.log('Carte sérialisée:', serialized);
    return serialized;
  }
  
  /**
   * Effectue un tirage de cartes
   */
  async performReading() {
    try {
      const state = this.stateManager.getState();
      let deck = this.deckService.getCurrentDeck();
      
      // Récupérer et valider la question
      const question = this.elements.questionInput.value.trim();
      if (!question) {
        throw new Error('Veuillez entrer une question avant de tirer les cartes');
      }
      
      // Mémoriser la question
      this.currentQuestion = question;
      
      // Si aucun jeu n'est chargé, charger le jeu par défaut (set01)
      if (!deck) {
        console.log("Aucun jeu chargé, chargement du jeu par défaut (set01)...");
        try {
          deck = await this.deckService.loadDeck('set01');
        } catch (loadError) {
          console.error("Erreur lors du chargement du jeu par défaut:", loadError);
          throw new Error('Impossible de charger le jeu de cartes. Veuillez rafraîchir la page et réessayer.');
        }
      }
      
      // Vérifier à nouveau que le deck est bien chargé
      if (!deck) {
        throw new Error('Échec du chargement du jeu de cartes');
      }
      
      // Vérifier que le deck contient suffisamment de cartes
      const requiredCards = this.currentSpread.getCardCount();
      const availableCards = deck.getRemainingCount();
      
      console.log(`Tirage nécessitant ${requiredCards} cartes, ${availableCards} disponibles dans le jeu`);
      
      if (availableCards < requiredCards) {
        console.log("Pas assez de cartes, réinitialisation du jeu...");
        deck.reset();
        
        // Vérifier à nouveau après réinitialisation
        if (deck.getRemainingCount() < requiredCards) {
          throw new Error(`Ce tirage nécessite ${requiredCards} cartes, mais le jeu n'en contient que ${deck.getAllCards().length}`);
        }
      }
      
      // Effectuer le tirage
      const drawnCards = this.currentSpread.draw(deck);
      this.currentReading = drawnCards;
      
      // Vérifier que toutes les cartes ont été tirées correctement
      if (!Array.isArray(drawnCards) || drawnCards.length < requiredCards) {
        throw new Error(`Échec du tirage: ${drawnCards ? drawnCards.length : 0} cartes tirées sur ${requiredCards} requises`);
      }
      
      // Sérialiser les cartes avant de les stocker dans l'état
      const serializedCards = Array.isArray(drawnCards) ? drawnCards.map(card => this.serializeCard(card)) : [];
      
      if (!Array.isArray(serializedCards) || serializedCards.length === 0) {
        throw new Error('Erreur lors de la sérialisation des cartes');
      }
      
      // Filtrer les cartes null qui auraient pu être introduites pendant la sérialisation
      const filteredCards = serializedCards.filter(card => card !== null);
      
      console.log('Cartes avant mise à jour de l\'état:', filteredCards);
      console.log('Est un tableau?', Array.isArray(filteredCards));
      
      // Mettre à jour l'état avec les cartes tirées
      this.stateManager.setState({
        cards: filteredCards,
        question: question,
        isLoading: true
      });
      
      // Afficher le tirage
      this.currentSpread.render();
      
      // Obtenir l'interprétation
      await this.getInterpretation(
        drawnCards,
        question,
        state.persona,
        state.iaModel,
        state.language,
        state.spreadType
      );
    } catch (error) {
      console.error("Erreur lors du tirage:", error);
      
      // Mettre à jour l'état avec l'erreur
      // Attention: garder les propriétés qui ont un default défini
      this.stateManager.setState({
        isLoading: false
      });
      
      // Nous gérons l'affichage de l'erreur directement sans passer par l'état
      // Afficher l'erreur à l'utilisateur
      this.elements.responseContent.innerHTML = `<p class="error">${error.message}</p>`;
    }
  }
  
  /**
   * Réinitialise les affichages
   */
  resetDisplays() {
    // Réinitialiser le contenu des interprétations
    if (this.elements.responseContent) {
      this.elements.responseContent.innerHTML = '';
    }

    this.stateManager.setState({ lastInterpretation: null });
  }
  
  /**
   * Obtient l'interprétation des cartes tirées
   */
  async getInterpretation(reading, question, persona, model, language = 'fr', spreadType = 'cross') {
    try {
      // Préparer le prompt avec le spread, cartes, question, etc.
      const spread = this.currentSpread;
      const prompt = await this.aiService.buildPrompt(
        reading, 
        question, 
        language, 
        spreadType
      );
      
      // Stocker l'interprétation actuelle pour la restauration éventuelle
      this.stateManager.setState({
        currentSpreadType: spreadType,
        currentCardsDrawn: JSON.stringify(reading)
      });
      
      // Variables pour l'effet de machine à écrire
      this.fullText = '';
      
      // Obtenir une interprétation avec streaming et effet de machine à écrire
      const handleChunk = (chunk) => {
        // Ajouter le nouveau chunk au texte complet
        this.fullText += chunk;
        
        // Si une animation de frappe est déjà en cours, l'arrêter
        if (this.typewriterTimeout) {
          clearTimeout(this.typewriterTimeout);
        }
        
        // Commencer/reprendre l'effet de machine à écrire
        this.startTypewriterEffect();
      };
      
      // Préparer l'affichage des animations de chargement
      this.elements.responseContent.innerHTML = `
        <div class="loading-message">
          <p>Génération de l'interprétation en cours...</p>
          <div class="loading-spinner"></div>
        </div>
      `;
      
      // Utiliser une div au lieu d'un paragraphe pour permettre le HTML
      this.elements.responseContent.innerHTML = '<div class="typewriter-text"></div>';
      
      // Appeler le service IA pour obtenir l'interprétation
      await this.aiService.getInterpretation(
        reading,
        question,
        persona,
        model,
        language,
        spreadType,
        handleChunk
      );
      
      // Indiquer par une classe que l'interprétation est terminée
      const typewriterElement = this.elements.responseContent.querySelector('.typewriter-text');
      if (typewriterElement) {
        typewriterElement.classList.add('generation-complete');
      }
    } catch (error) {
      console.error("Erreur lors de l'obtention de l'interprétation:", error);
      this.elements.responseContent.innerHTML = `<p class="error">Erreur lors de l'interprétation: ${error.message}</p>`;
    }
  }
  
  /**
   * Démarre l'effet de machine à écrire pour le texte d'interprétation
   */
  startTypewriterEffect() {
    // Sélectionner l'élément où le texte sera affiché
    const typewriterElement = this.elements.responseContent.querySelector('.typewriter-text');
    if (!typewriterElement) return;
    
    // Paramètres de l'effet
    const baseTypingSpeed = 5; // Vitesse de base en millisecondes
    const charsPerTypingCycle = 3; // Nombre de caractères à ajouter à chaque cycle
    const currentTextLength = typewriterElement.innerHTML.length;
    const targetTextLength = this.fullText.length;
    
    // Calcul dynamique de la vitesse et du nombre de caractères par cycle
    const textLengthDifference = targetTextLength - currentTextLength;
    const adjustedCharsPerCycle = textLengthDifference > 200 
      ? Math.min(10, Math.floor(textLengthDifference / 50)) // Plus de caractères pour de grands textes
      : charsPerTypingCycle;
    
    // Fonction pour ajouter plusieurs caractères à la fois
    const typeNextChars = (currentIndex) => {
      if (currentIndex < targetTextLength) {
        // Calculer l'index de fin pour ce cycle
        const nextIndex = Math.min(currentIndex + adjustedCharsPerCycle, targetTextLength);
        
        // Mettre à jour le texte affiché en permettant le HTML
        typewriterElement.innerHTML = this.fullText.substring(0, nextIndex);
        
        // Continuer avec les caractères suivants
        this.typewriterTimeout = setTimeout(() => {
          typeNextChars(nextIndex);
        }, baseTypingSpeed);
      } else {
        // Animation terminée, effacer la référence du timeout
        this.typewriterTimeout = null;
        
        // S'assurer que le défilement fonctionne correctement après la génération
        this.elements.responseContent.style.overflow = "auto";
        this.elements.responseContent.style.pointerEvents = "auto";
        
        // Appliquer un style spécifique pour indiquer que la génération est terminée
        typewriterElement.classList.add("generation-complete");
        
        // Initialiser les gestionnaires de défilement
        this.initScrollHandlers();
      }
    };
    
    // Commencer ou reprendre la frappe à partir du dernier caractère affiché
    typeNextChars(currentTextLength);
  }
  
  /**
   * Change le jeu de cartes utilisé pour les tirages
   * @param {string} deckId - Identifiant du nouveau jeu
   */
  async changeDeck(deckId) {
    try {
      console.log(`🔄 Chargement du jeu ${deckId}...`);
      
      // Réinitialiser l'état actuel
      this.currentReading = [];
      
      // Charger le nouveau jeu
      const newDeck = await this.deckService.loadDeck(deckId);
      if (!newDeck) {
        throw new Error(`Échec du chargement du jeu ${deckId}`);
      }
      
      console.log(`✅ Jeu ${deckId} chargé avec succès - ${newDeck.getAllCards().length} cartes disponibles`);
      
      // Réinitialiser l'affichage
      this.showSpread(this.stateManager.getState().spreadType || 'cross');
      
      // Si un tirage a déjà été effectué, effectuer un nouveau tirage
      const previousCardDrawn = this.stateManager.getState().currentCardsDrawn;
      if (previousCardDrawn && previousCardDrawn !== '[]') {
        console.log('🎴 Des cartes ont été tirées précédemment, mise à jour de l\'affichage...');
        this.updateCardDisplay();
      }
      
      return newDeck;
    } catch (error) {
      console.error(`❌ Erreur lors du changement de jeu ${deckId}:`, error);
      this.stateManager.setState({
        error: `Erreur lors du chargement du jeu ${deckId}: ${error.message}`
      });
      throw error;
    }
  }
  
  /**
   * Met à jour l'affichage des cartes avec le jeu actuel
   */
  updateCardDisplay() {
    // Obtenir le jeu de cartes actuel et l'état global
    const currentDeck = this.deckService.getCurrentDeck();
    const state = this.stateManager.getState();
    
    // Si nous n'avons pas de jeu actuel, abandonner
    if (!currentDeck) {
      console.error("❌ Impossible de mettre à jour l'affichage : aucun jeu de cartes actif");
      return;
    }
    
    console.log(`🔄 Mise à jour de l'affichage avec le jeu ${currentDeck.deckId}`);
    
    // Si nous avons des cartes tirées, les mettre à jour
    if (this.currentReading.length > 0) {
      // Pour chaque carte dans la lecture actuelle, mettre à jour son URL d'image
      // en fonction du jeu de cartes actuel
      this.currentReading = this.currentReading.map(card => {
        // Trouver la carte correspondante dans le jeu actuel
        const freshCard = currentDeck.getCardById(card.id);
        if (freshCard) {
          // Créer une copie de la carte avec l'URL d'image mise à jour
          return {
            ...card,
            imageUrl: freshCard.imageUrl,
            backImageUrl: freshCard.backImageUrl
          };
        }
        return card;
      });
    }
    
    // Mettre à jour l'état avec les cartes actuelles
    this.stateManager.setState({
      cards: this.currentReading
    });
    
    // Récupérer le type de tirage actuel
    const spreadType = state.spreadType || 'cross';
    
    // Afficher le tirage approprié
    this.showSpread(spreadType);
    
    // Obtenir le conteneur approprié
    let spreadContainer;
    switch (spreadType) {
      case 'horseshoe':
        spreadContainer = this.elements.spreadPanels.horseshoe;
        break;
      case 'love':
        spreadContainer = this.elements.spreadPanels.love;
        break;
      case 'celticCross':
        spreadContainer = this.elements.spreadPanels.celticCross;
        break;
      case 'cross':
      default:
        spreadContainer = this.elements.spreadPanels.cross;
        break;
    }
    
    // Créer et rendre le tirage
    const spread = createSpread(spreadType, spreadContainer, state.language);
    spread.cards = this.currentReading;
    spread.render();
  }

  /**
   * Restaure un tirage précédent
   * @param {Array} cards - Les cartes du tirage à restaurer
   * @param {Object} interpretation - L'interprétation du tirage
   */
  async restoreReading(cards, interpretation) {
    try {
      // Mettre à jour l'état local
      this.currentReading = cards;
      
      // Mettre à jour l'affichage des cartes
      this.updateCardDisplay();
      
      // Restaurer l'interprétation si elle existe
      if (interpretation) {
        // Mettre à jour l'affichage de l'interprétation
        if (this.elements.promptContent) {
          this.elements.promptContent.innerHTML = interpretation.prompt || '';
        }
        if (this.elements.responseContent) {
          this.elements.responseContent.innerHTML = interpretation.response || '';
        }
        
        // Afficher la section d'interprétation
        if (this.elements.interpretationPanel) {
          this.elements.interpretationPanel.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('Erreur lors de la restauration du tirage:', error);
      this.stateManager.setState({
        error: 'Erreur lors de la restauration du tirage précédent.'
      });
    }
  }

  /**
   * Initialise les gestionnaires d'événements pour le défilement
   */
  initScrollHandlers() {
    this.elements.responseContent.setAttribute('tabindex', '0');
    
    // Permettre le focus au clic
    this.elements.responseContent.addEventListener('click', () => {
      this.elements.responseContent.focus();
    });
  }
}

export default ReadingController; 