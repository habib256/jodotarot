/**
 * Contrôleur responsable des tirages de cartes
 * Gère la logique d'affichage et de manipulation des tirages
 */
import StateManager from '../utils/StateManager.js';
import DeckService from '../services/DeckService.js';
import AIService from '../services/AIService.js';
import { createSpread } from '../models/spreads/index.js';
import { getTranslation } from '../translations/index.js';

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
    // Événements de clic sur les boutons
    this.elements.tirerButton.addEventListener('click', () => this.performReading());
    
    // Écouteur pour stopper la génération en cours
    const generationIndicator = document.getElementById('generation-indicator');
    if (generationIndicator) {
      generationIndicator.addEventListener('click', () => {
        // Annuler la génération en cours
        if (this.aiService && this.aiService.cancelCurrentInterpretation()) {
          console.log('Génération annulée par l\'utilisateur');
          
          // Masquer l'indicateur de génération
          generationIndicator.style.display = 'none';
          
          // Rétablir l'état du bouton
          const currentLanguage = this.stateManager.getState().language || 'fr';
          this.elements.tirerButton.disabled = false;
          this.elements.tirerButton.textContent = getTranslation('header.drawButton', currentLanguage);
          this.elements.tirerButton.classList.remove('disabled');
        }
      });
    }
    
    // Écouter les changements de jeu
    document.addEventListener('deckId:changed', async (event) => {
      console.log(`🎴 Changement de jeu détecté: ${event.detail.deckId}`);
      
      try {
        // Mise à jour pour utiliser cardSet au lieu de deckId
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
    
    // Écouter les changements de langue pour mettre à jour les positions des cartes et le texte du bouton d'arrêt de génération
    document.addEventListener('language:changed', (event) => {
      console.log(`🔤 Changement de langue détecté: ${event.detail.language}`);
      // Réinitialiser tous les tirages avec la nouvelle langue
      this.initializeAllSpreads();
      
      // Mettre à jour le texte du bouton d'arrêt de génération
      const stopGenerationText = document.getElementById('stop-generation-text');
      if (stopGenerationText) {
        stopGenerationText.textContent = getTranslation('header.stopGeneration', event.detail.language);
      }
    });
    
    // Autres écouteurs d'événements existants
    this.elements.questionInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.performReading();
      }
    });
  }
  
  /**
   * Initialise tous les types de tirages avec leurs positions de cartes
   */
  initializeAllSpreads() {
    // Récupérer la langue actuelle
    const state = this.stateManager.getState();
    const language = state.language || 'fr';
    
    // Sauvegarder les cartes actuellement affichées si elles existent
    const currentSpreadType = state.spreadType || 'cross';
    let currentCards = [];
    
    // Sauvegarder les cartes du spread actuel si elles existent
    if (this.currentSpread && this.currentSpread.cards && this.currentSpread.cards.length > 0) {
      currentCards = [...this.currentSpread.cards];
    } else if (this.currentReading && this.currentReading.length > 0) {
      currentCards = [...this.currentReading];
    }
    
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
    
    // Restaurer les cartes si nécessaire
    if (currentCards.length > 0) {
      // Mettre à jour le spread actuel
      this.updateSpreadDisplay(currentSpreadType);
      
      // Restaurer les cartes dans le spread actuel
      this.currentSpread.cards = currentCards;
      this.currentReading = currentCards;
      
      // Rendre les cartes restaurées
      this.currentSpread.render();
    } else {
      // Afficher le tirage initial (par défaut en croix)
      this.updateSpreadDisplay(currentSpreadType);
    }
  }
  
  /**
   * S'assure qu'un jeu de cartes est chargé
   */
  async initializeDeck() {
    try {
      // Vérifier si un jeu est déjà chargé
      let deck = this.deckService.getCurrentDeck();
      const state = this.stateManager.getState();
      const currentCardSet = state.cardSet;

      if (!deck) {
        console.log(`🃏 Aucun jeu chargé au démarrage, chargement du jeu ${currentCardSet || 'set01'}...`);
        try {
          // Charger le jeu actuel ou le jeu par défaut
          deck = await this.deckService.loadDeck(currentCardSet || 'set01');
          console.log(`✅ Jeu de cartes '${currentCardSet || 'set01'}' chargé avec succès`);
          console.log(`📊 ${deck.getAllCards().length} cartes chargées au total`);
        } catch (error) {
          console.error(`❌ Erreur lors du chargement du jeu ${currentCardSet || 'set01'}:`, error);
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
    
    // Gérer les différents types d'IDs de cartes
    let cardId = card.id;
    if (!cardId) {
      if (card.type === 'minor') {
        // Pour les cartes mineures, utiliser le format MSUIT_RANK
        cardId = `M${card.suit}_${card.rank}`;
      } else if (card.rank !== undefined) {
        // Pour les cartes majeures, utiliser le format MXX
        cardId = `M${card.rank.toString().padStart(2, '0')}`;
      } else {
        console.warn('⚠️ Impossible de générer un ID valide pour la carte:', card);
        return null;
      }
    }
    
    const serializedCard = {
      id: cardId,
      name: card.translationKey || card.name,
      imageUrl: card.imageUrl || card.image,
      position: card.orientation || 'upright',
      type: card.type || 'major',
      suit: card.suit,
      rank: card.rank
    };
    
    console.log('Carte sérialisée:', serializedCard);
    return serializedCard;
  }
  
  /**
   * Effectue un tirage de cartes
   */
  async performReading() {
    try {
      const state = this.stateManager.getState();
      const currentLanguage = state.language || 'fr';
      
      // Désactiver le bouton et changer son texte avec le texte traduit
      this.elements.tirerButton.disabled = true;
      this.elements.tirerButton.textContent = getTranslation('header.drawButtonGenerating', currentLanguage);
      this.elements.tirerButton.classList.add('disabled');
      
      // Ne plus afficher le message de statut du modèle actif
      // Le statut est maintenant géré différemment
      
      // S'assurer que l'indicateur de génération est masqué au début du tirage
      const generationIndicator = document.getElementById('generation-indicator');
      if (generationIndicator) {
        generationIndicator.style.display = 'none';
      }
      
      let deck = this.deckService.getCurrentDeck();
      
      // Récupérer et valider la question
      const question = this.elements.questionInput.value.trim();
      if (!question) {
        // Rétablir l'état du bouton
        this.elements.tirerButton.disabled = false;
        this.elements.tirerButton.textContent = getTranslation('header.drawButton', currentLanguage);
        this.elements.tirerButton.classList.remove('disabled');
        
        // Afficher un indicateur visuel sur le champ de question
        this.elements.questionInput.classList.add('error-input');
        this.elements.questionInput.focus();
        
        // Ajouter une animation de secousse au champ
        this.elements.questionInput.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(0)' }
        ], {
          duration: 500,
          iterations: 1
        });
        
        // Ajouter un placeholder temporaire qui indique l'erreur
        const originalPlaceholder = this.elements.questionInput.placeholder;
        this.elements.questionInput.placeholder = getTranslation('interpretation.error.noQuestion', currentLanguage);
        
        // Restaurer le placeholder après 3 secondes
        setTimeout(() => {
          this.elements.questionInput.classList.remove('error-input');
          this.elements.questionInput.placeholder = originalPlaceholder;
        }, 3000);
        
        // Toujours lancer l'erreur mais sans bloquer l'interface
        console.error(getTranslation('interpretation.error.noQuestion', currentLanguage));
        return; // Sortir sans lancer d'exception pour éviter le crash
      }
      
      // Mémoriser la question
      this.currentQuestion = question;
      
      // Si aucun jeu n'est chargé, charger le jeu par défaut (set01)
      if (!deck) {
        const currentCardSet = state.cardSet;
        console.log(`Aucun jeu chargé, chargement du jeu ${currentCardSet || 'set01'}...`);
        try {
          deck = await this.deckService.loadDeck(currentCardSet || 'set01');
        } catch (loadError) {
          console.error(`Erreur lors du chargement du jeu ${currentCardSet || 'set01'}:`, loadError);
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
      
      // Réactiver le bouton et restaurer son texte original avec le texte traduit
      this.elements.tirerButton.disabled = false;
      this.elements.tirerButton.textContent = getTranslation('header.drawButton', currentLanguage);
      this.elements.tirerButton.classList.remove('disabled');
      
    } catch (error) {
      console.error("Erreur lors du tirage:", error);
      
      // Mettre à jour l'état avec l'erreur
      this.stateManager.setState({
        isLoading: false
      });
      
      const state = this.stateManager.getState();
      const currentLanguage = state.language || 'fr';
      
      // Réactiver le bouton et restaurer son texte en cas d'erreur
      this.elements.tirerButton.disabled = false;
      this.elements.tirerButton.textContent = getTranslation('header.drawButton', currentLanguage);
      this.elements.tirerButton.classList.remove('disabled');
      
      // Masquer le message de statut en cas d'erreur
      const statusMessage = document.getElementById('status-message');
      if (statusMessage) {
        statusMessage.style.display = 'none';
      }
      
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
      this.currentCharIndex = 0;
      this.isTyping = false;
      
      // Vérifier si un modèle IA est disponible
      if (!model || model === 'none') {
        // Afficher le prompt en texte brut (échappé) dans un conteneur simple
        const escaped = prompt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        this.elements.responseContent.textContent = escaped;
        this.initScrollHandlers();
        return prompt;
      }
      
      // Afficher l'indicateur de génération en cours
      const generationIndicator = document.getElementById('generation-indicator');
      const modelNameSpan = generationIndicator.querySelector('.model-name');
      if (generationIndicator && modelNameSpan) {
        // Extraire et afficher le nom du modèle
        const modelDisplayName = model.replace('ollama:', '').replace('openai/', '');
        modelNameSpan.textContent = modelDisplayName;
        
        // Mettre à jour le texte du bouton d'arrêt avec la traduction
        const stopGenerationText = generationIndicator.querySelector('#stop-generation-text');
        if (stopGenerationText) {
          stopGenerationText.textContent = getTranslation('header.stopGeneration', language);
        }
        
        generationIndicator.style.display = 'block';
      }
      
      // Préparer l'affichage des animations de chargement
      this.elements.responseContent.innerHTML = `
        <div class="loading-message">
          <p>Génération de l'interprétation en cours...</p>
          <div class="loading-spinner"></div>
        </div>
      `;
      
      // Variable pour suivre si nous avons reçu le premier chunk
      let firstChunkReceived = false;
      
      // Obtenir une interprétation avec streaming et effet de machine à écrire
      const handleChunk = (chunk) => {
        // Supprimer les timestamps qui pourraient apparaître à la fin (comme "2025-03-11T17:58:05.280771997Z")
        const cleanedChunk = chunk.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/g, '');
        
        // Si c'est le premier chunk, remplacer le message de chargement par la div de machine à écrire
        if (!firstChunkReceived) {
          this.elements.responseContent.innerHTML = '<div class="typewriter-text"></div>';
          firstChunkReceived = true;
        }
        
        // Ajouter le nouveau chunk au texte complet
        this.fullText += cleanedChunk;
        
        // Si une animation de frappe est déjà en cours, l'arrêter
        if (this.typewriterTimeout) {
          clearTimeout(this.typewriterTimeout);
        }
        
        // Commencer/reprendre l'effet de machine à écrire
        this.startTypewriterEffect();
      };
      
      // Appeler le service IA pour obtenir l'interprétation
      const response = await this.aiService.getInterpretation(
        reading,
        question,
        persona,
        model,
        language,
        spreadType,
        handleChunk
      );
      
      // Si aucun chunk n'a été reçu (par exemple, si le streaming n'est pas supporté),
      // nous devons mettre à jour l'affichage manuellement
      if (!firstChunkReceived) {
        this.elements.responseContent.innerHTML = '<div class="typewriter-text"></div>';
        // Interprétation (réponse modèle) est en HTML; si le modèle est prompt, getInterpretation renvoie du texte
        this.fullText = response;
      }
      
      // Extraire le nom du modèle sans préfixe
      const modelName = model.replace('ollama:', '').replace('openai/', '');
      
      // Ajouter le nom du modèle à la fin du texte avec le formatage HTML approprié et aligné à droite
      this.fullText += `\n\n<div style="text-align: right;"><em>Généré par: ${modelName}</em></div>`;
      this.startTypewriterEffect();
      
      // Indiquer par une classe que l'interprétation est terminée
      const typewriterElement = this.elements.responseContent.querySelector('.typewriter-text');
      if (typewriterElement) {
        typewriterElement.classList.add('generation-complete');
      }
      
      // Masquer l'indicateur de génération une fois terminé
      if (generationIndicator) {
        generationIndicator.style.display = 'none';
      }
      
      return response;
    } catch (error) {
      console.error("Erreur lors de l'interprétation:", error);
      
      // Masquer l'indicateur de génération en cas d'erreur
      const generationIndicator = document.getElementById('generation-indicator');
      if (generationIndicator) {
        generationIndicator.style.display = 'none';
      }
      
      // Afficher un message d'erreur approprié à l'utilisateur
      if (error.message && error.message.includes('aborted')) {
        // Si l'erreur est due à une annulation, afficher un message spécifique
        this.elements.responseContent.innerHTML = `
          <div class="error-message">
            <p>${getTranslation('interpretation.error.generationStopped', language)}</p>
          </div>
        `;
      } else {
        // Sinon, afficher le message d'erreur général
        this.elements.responseContent.innerHTML = `
          <div class="error-message">
            <p>${getTranslation('interpretation.error.interpretationError', language)}: ${error.message}</p>
          </div>
        `;
      }
      
      throw error;
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
   * Change le jeu de cartes actuel
   * @param {string} deckId - Identifiant du nouveau jeu
   */
  async changeDeck(deckId) {
    try {
      console.log(`🔄 Chargement du jeu ${deckId}...`);
      
      // Vérifier que le jeu existe
      if (!deckId) throw new Error('Identifiant de jeu non spécifié');
      
      // Sauvegarder l'état actuel
      const currentState = this.stateManager.getState();
      const currentSpreadType = currentState.spreadType || 'cross';
      const currentCards = this.currentReading || [];
      
      // Mettre à jour l'interface pour indiquer le chargement
      if (this.elements.loadingAnimations) {
        this.elements.loadingAnimations.style.display = 'block';
      }
      
      // Charger le nouveau jeu
      const newDeck = await this.deckService.loadDeck(deckId);
      if (!newDeck) {
        throw new Error(`Échec du chargement du jeu ${deckId}`);
      }
      
      console.log(`✅ Jeu ${deckId} chargé avec succès - ${newDeck.getAllCards().length} cartes disponibles`);
      
      // Mettre à jour l'état
      this.stateManager.setState({ 
        cardSet: deckId,
        error: null // Réinitialiser les erreurs précédentes
      });
      
      // Réinitialiser le tirage actuel
      this.currentReading = [];
      
      // Mettre à jour l'affichage
      this.updateCardDisplay();
      
      // Restaurer le type de tirage et réinitialiser le currentSpread
      this.showSpread(currentSpreadType);
      this.updateSpreadDisplay(currentSpreadType);
      
      // Cacher l'animation de chargement
      if (this.elements.loadingAnimations) {
        this.elements.loadingAnimations.style.display = 'none';
      }
      
      return newDeck;
    } catch (error) {
      console.error(`❌ Erreur lors du chargement du jeu ${deckId}:`, error);
      this.stateManager.setState({ error: error.message });
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
    if (this.currentReading && this.currentReading.length > 0) {
      // Filtrer et mettre à jour les cartes
      this.currentReading = this.currentReading.filter(card => {
        // Pour les cartes majeures, chercher par ID simple
        if (card.type === 'major' || !card.type) {
          const freshCard = currentDeck.getCardById(card.id);
          if (freshCard) {
            // Mettre à jour l'URL de l'image
            card.imageUrl = freshCard.imageUrl;
            card.backImageUrl = freshCard.backImageUrl;
            return true;
          }
        }
        // Pour les cartes mineures, vérifier si le jeu supporte les cartes mineures
        else if (card.type === 'minor') {
          const deckInfo = this.deckService.availableDecks[currentDeck.deckId];
          if (deckInfo && deckInfo.supportsMinor) {
            const freshCard = currentDeck.getCardById(card.id);
            if (freshCard) {
              card.imageUrl = freshCard.imageUrl;
              card.backImageUrl = freshCard.backImageUrl;
              return true;
            }
          }
        }
        return false;
      });
      
      // Si toutes les cartes ont été filtrées, réinitialiser le tirage
      if (this.currentReading.length === 0) {
        console.log("⚠️ Aucune carte valide trouvée dans le nouveau jeu, réinitialisation du tirage");
        this.currentReading = [];
        this.stateManager.setState({ cards: [] });
      }
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

  /**
   * Affiche un message temporaire
   * @param {string} message - Le message à afficher
   * @param {string} type - Le type de message (success, warning, error, info)
   * @param {number} duration - La durée d'affichage en millisecondes
   */
  showTemporaryMessage(message, type = 'info', duration = 3000) {
    // Créer ou récupérer l'élément de message
    let messageElement = document.getElementById('status-message');
    
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.id = 'status-message';
      
      // Placer le message sous le bouton "Tirer les cartes" dans le controls-container
      const controlsContainer = document.querySelector('.controls-container');
      if (controlsContainer) {
        controlsContainer.appendChild(messageElement);
      } else {
        // Fallback: ajouter au corps du document
        document.body.appendChild(messageElement);
      }
    }
    
    // Définir le contenu et le style
    messageElement.textContent = message;
    messageElement.className = `${type}-message status-indicator`;
    messageElement.style.display = 'block';
    
    // Masquer le message après la durée spécifiée
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, duration);
  }
}

export default ReadingController; 