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
      interpretationsInfo: document.getElementById('interpretations-info'),
      interpretationsPrompt: document.getElementById('interpretations-prompt'),
      promptContent: document.querySelector('#interpretations-prompt .prompt-content'),
      interpretationsResponse: document.getElementById('interpretations-response'),
      responseContent: document.querySelector('#interpretations-response .response-content'),
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
      if (!drawnCards || drawnCards.length < requiredCards) {
        throw new Error(`Échec du tirage: ${drawnCards ? drawnCards.length : 0} cartes tirées sur ${requiredCards} requises`);
      }
      
      // Mettre à jour l'état avec les cartes tirées
      this.stateManager.setState({
        cards: drawnCards,
        question: question,
        isLoading: true,
        error: null
      });
      
      // Afficher le tirage
      this.currentSpread.render();
      
      // Obtenir l'interprétation
      await this.getInterpretation(
        drawnCards,
        question,
        state.spreadType,
        state.language,
        state.persona,
        state.iaModel
      );
    } catch (error) {
      console.error("Erreur lors du tirage:", error);
      this.stateManager.setState({
        error: error.message,
        isLoading: false
      });
      
      // Afficher l'erreur à l'utilisateur
      this.elements.interpretationsDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
  }
  
  /**
   * Réinitialise les affichages
   */
  resetDisplays() {
    // Réinitialiser le premier cadre (infos)
    if (this.elements.interpretationsInfo) {
      this.elements.interpretationsInfo.innerHTML = '<p id="default-interpretation">Les interprétations s\'afficheront après le tirage.</p>';
    }
    
    // Masquer les autres cadres
    if (this.elements.interpretationsPrompt) {
      this.elements.interpretationsPrompt.style.display = 'none';
      this.elements.promptContent.innerHTML = '';
    }
    
    if (this.elements.interpretationsResponse) {
      this.elements.interpretationsResponse.style.display = 'none';
      this.elements.responseContent.innerHTML = '';
    }
    
    // Réinitialiser les conteneurs de tirages
    if (this.currentSpread) {
      this.currentSpread.reset();
    }
  }
  
  /**
   * Obtient une interprétation pour le tirage actuel
   * @param {Array} reading - Cartes tirées
   * @param {string} question - Question posée
   * @param {string} spreadType - Type de tirage
   * @param {string} language - Langue de l'interprétation
   * @param {string} persona - Persona pour l'interprétation
   * @param {string} model - Modèle d'IA à utiliser
   */
  async getInterpretation(reading, question, spreadType, language, persona, model) {
    try {
      // Préparer le prompt pour l'IA basé sur le tirage
      const prompt = this.currentSpread.generateReadingDescription();
      
      // Formater le prompt pour une meilleure lisibilité
      const formattedPrompt = this.formatPromptForDisplay(prompt, question);
      
      // Mettre à jour le titre du bloc de prompt - sans bouton d'agrandissement
      const promptHeader = this.elements.interpretationsPrompt.querySelector('h3');
      if (promptHeader) {
        promptHeader.textContent = 'Prompt';
      }
      
      // Afficher le prompt formaté dans le deuxième cadre
      this.elements.promptContent.innerHTML = formattedPrompt;
      this.elements.interpretationsPrompt.style.display = 'block';
      
      // Vérifier si le contenu du prompt déborde et nécessite un défilement
      setTimeout(() => this.checkPromptOverflow(), 100);
      
      // Variables pour l'effet de machine à écrire
      this.fullText = '';
      
      // S'assurer que la zone de réponse est visible
      this.elements.interpretationsResponse.style.display = 'block';
      
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
      
      // Afficher le conteneur d'interprétation
      // Préparer l'affichage des animations de chargement dans le premier cadre
      this.elements.interpretationsInfo.innerHTML = `
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
      
      // Masquer le message de chargement une fois l'interprétation terminée
      this.elements.interpretationsInfo.innerHTML = `
        <p class="success-message">Interprétation générée avec succès</p>
      `;
    } catch (error) {
      console.error("Erreur lors de l'obtention de l'interprétation:", error);
      this.elements.interpretationsInfo.innerHTML = `<p class="error">Erreur lors de l'interprétation: ${error.message}</p>`;
      this.elements.interpretationsPrompt.style.display = 'none';
      this.elements.interpretationsResponse.style.display = 'none';
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
        this.elements.interpretationsResponse.style.overflow = "auto";
        this.elements.interpretationsResponse.style.pointerEvents = "auto";
        
        // Appliquer un style spécifique pour indiquer que la génération est terminée
        typewriterElement.classList.add("generation-complete");
        
        // Ajouter des styles pour indiquer que le contenu est défilable
        const style = document.createElement('style');
        style.textContent = `
          .generation-complete {
            overflow-y: auto !important;
            pointer-events: auto !important;
          }
        `;
        document.head.appendChild(style);
      }
    };
    
    // Commencer ou reprendre la frappe à partir du dernier caractère affiché
    typeNextChars(currentTextLength);
  }
  
  /**
   * Vérifie si le contenu du prompt déborde et nécessite un défilement
   * Ajoute ou supprime la classe 'has-overflow' en conséquence
   */
  checkPromptOverflow() {
    const promptBlock = this.elements.interpretationsPrompt;
    const promptContent = this.elements.promptContent;
    
    if (!promptBlock || !promptContent) return;
    
    // Si le contenu est plus grand que le conteneur, il y a débordement
    const hasOverflow = promptContent.scrollHeight > promptBlock.clientHeight;
    
    // Ajouter ou supprimer la classe based sur le statut de débordement
    if (hasOverflow) {
      promptBlock.classList.add('has-overflow');
    } else {
      promptBlock.classList.remove('has-overflow');
    }
  }
  
  /**
   * Formate le prompt pour l'affichage HTML
   * @param {string} prompt - Le prompt brut généré
   * @param {string} question - La question posée
   * @return {string} Le prompt formaté en HTML
   */
  formatPromptForDisplay(prompt, question) {
    // Échapper les caractères HTML spéciaux
    const escapeHTML = (text) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
    // Formater la question
    const formattedQuestion = `<div class="prompt-question"><strong>Question :</strong> ${escapeHTML(question)}</div>`;
    
    // Séparer les sections du prompt
    const sections = escapeHTML(prompt).split('\n\n');
    
    // Construire le HTML formaté
    let formattedHTML = formattedQuestion + '<div class="prompt-sections">';
    
    sections.forEach(section => {
      if (section.trim()) {
        // Mettre en évidence les titres des sections
        if (section.includes(':')) {
          const [title, content] = section.split(':', 2);
          formattedHTML += `<div class="prompt-section"><span class="prompt-section-title">${title}:</span>${content}</div>`;
        } else {
          formattedHTML += `<div class="prompt-section">${section}</div>`;
        }
      }
    });
    
    formattedHTML += '</div>';
    return formattedHTML;
  }
  
  /**
   * Change le jeu de cartes utilisé
   * @param {string} deckId - Identifiant du jeu de cartes
   */
  async changeDeck(deckId) {
    try {
      // Charger le nouveau jeu
      await this.deckService.loadDeck(deckId);
      
      // Si un tirage a déjà été effectué, mettre à jour les cartes
      if (this.currentReading.length > 0) {
        this.updateCardDisplay();
      }
    } catch (error) {
      console.error("Erreur lors du changement de jeu:", error);
      this.stateManager.setState({
        error: error.message
      });
    }
  }
  
  /**
   * Met à jour l'affichage des cartes avec le jeu actuel
   */
  updateCardDisplay() {
    // Mettre à jour l'état avec les cartes actuelles
    this.stateManager.setState({
      cards: this.currentReading
    });
    
    // Récupérer le type de tirage actuel
    const state = this.stateManager.getState();
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
        if (this.elements.interpretationsInfo) {
          this.elements.interpretationsInfo.style.display = 'block';
        }
        if (this.elements.interpretationsPrompt) {
          this.elements.interpretationsPrompt.style.display = 'block';
        }
        if (this.elements.interpretationsResponse) {
          this.elements.interpretationsResponse.style.display = 'block';
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
   * Initialise les gestionnaires d'événements de défilement pour la zone d'interprétation
   */
  initScrollHandlers() {
    // Ajouter tabindex pour que l'élément puisse recevoir le focus
    this.elements.interpretationsResponse.setAttribute('tabindex', '0');
    
    // Ajouter un gestionnaire pour l'événement de la molette
    this.elements.interpretationsResponse.addEventListener('wheel', (event) => {
      // Empêcher le comportement de défilement par défaut
      event.preventDefault();
      
      // Calculer la quantité de défilement
      const delta = event.deltaY || event.detail || event.wheelDelta;
      
      // Appliquer le défilement à l'élément
      this.elements.interpretationsResponse.scrollTop += delta > 0 ? 60 : -60;
    });
    
    // S'assurer que l'élément peut recevoir le focus lorsqu'on clique dessus
    this.elements.interpretationsResponse.addEventListener('click', () => {
      this.elements.interpretationsResponse.focus();
    });
    
    // Ajouter un style pour montrer le focus
    const style = document.createElement('style');
    style.textContent = `
      #interpretations-response:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(107, 91, 149, 0.5);
      }
    `;
    document.head.appendChild(style);
  }
}

export default ReadingController; 