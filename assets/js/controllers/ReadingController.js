/**
 * Contrôleur responsable des tirages de cartes
 * Gère la logique d'affichage et de manipulation des tirages
 */
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
      tirerButton: document.getElementById('tirer'),
      questionInput: document.getElementById('question')
    };
    
    // Initialisation des écouteurs d'événements
    this.initEventListeners();
    
    // Initialiser les positions de cartes pour tous les tirages au démarrage.
    // Le chargement du jeu de cartes est orchestré par main.js.
    this.initializeAllSpreads();
    this.initScrollHandlers();
  }
  
  /**
   * Initialise les écouteurs d'événements
   */
  initEventListeners() {
    // Lancer un tirage
    this.elements.tirerButton?.addEventListener('click', () => this.performReading());

    this.elements.questionInput?.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.performReading();
      }
    });

    // Écouteur pour stopper la génération en cours
    const generationIndicator = document.getElementById('generation-indicator');
    generationIndicator?.addEventListener('click', () => {
      if (this.aiService.cancelCurrentInterpretation()) {
        generationIndicator.style.display = 'none';
        this.resetDrawButton();
      }
    });

    // Changement de jeu de cartes
    document.addEventListener('cardSet:changed', async (event) => {
      try {
        await this.changeDeck(event.detail.cardSet);
      } catch (error) {
        console.error(`❌ Erreur lors du chargement du jeu ${event.detail.cardSet}:`, error);
      }
    });

    // Changement de type de tirage: le tirage précédent n'a plus de sens dans
    // une disposition qui n'a ni le même nombre ni les mêmes positions.
    document.addEventListener('spreadType:changed', (event) => {
      this.clearReading();
      this.updateSpreadDisplay(event.detail.spreadType);
      this.currentSpread.reset();
    });

    // Changement de langue: réinitialiser les tirages pour traduire les positions
    document.addEventListener('language:changed', () => {
      this.initializeAllSpreads();
    });
  }

  /**
   * Efface le tirage courant, en mémoire comme dans l'état persisté
   */
  clearReading() {
    this.currentReading = [];
    if (this.currentSpread) {
      this.currentSpread.cards = [];
    }
    this.stateManager.setState({ cards: [], interpretation: null });
  }

  /**
   * Rétablit le bouton de tirage dans son état actif
   */
  resetDrawButton() {
    if (!this.elements.tirerButton) return;

    const language = this.stateManager.getState().language;
    this.elements.tirerButton.disabled = false;
    this.elements.tirerButton.textContent = getTranslation('header.drawButton', language);
    this.elements.tirerButton.classList.remove('disabled');
  }
  
  /**
   * (Ré)initialise les positions de cartes de tous les types de tirages
   * et réaffiche le tirage courant
   */
  initializeAllSpreads() {
    const { language, spreadType } = this.stateManager.getState();

    // Conserver les cartes actuellement affichées
    const currentCards = this.currentSpread?.cards?.length
      ? [...this.currentSpread.cards]
      : [...this.currentReading];

    // Recréer chaque tirage avec la langue courante
    this.spreads = {};
    for (const [key, container] of Object.entries(this.elements.spreadPanels)) {
      this.spreads[key] = createSpread(key, container, language);
      this.spreads[key].initializeCardPositions();
    }

    this.updateSpreadDisplay(spreadType);

    // Restaurer les cartes dans le tirage courant
    if (currentCards.length > 0) {
      this.currentSpread.cards = currentCards;
      this.currentReading = currentCards;
      this.currentSpread.render();
    }
  }

  /**
   * Affiche le conteneur correspondant au type de tirage et masque les autres
   * @param {string} spreadType - Type de tirage à afficher
   */
  showSpread(spreadType) {
    for (const [key, panel] of Object.entries(this.elements.spreadPanels)) {
      if (panel) {
        panel.style.display = key === spreadType ? 'flex' : 'none';
      }
    }
  }

  /**
   * Met à jour l'affichage en fonction du type de tirage sélectionné
   * @param {string} spreadType - Type de tirage
   */
  updateSpreadDisplay(spreadType) {
    const type = this.spreads?.[spreadType] ? spreadType : 'cross';

    this.showSpread(type);
    this.currentSpread = this.spreads[type];
  }

  /**
   * Sérialise une carte pour le stockage dans l'état
   * @param {Card} card - Carte à sérialiser
   * @returns {Object} Carte sérialisée
   */
  serializeCard(card) {
    if (!card?.id) {
      console.warn('⚠️ Carte sans identifiant, exclue du tirage sauvegardé:', card);
      return null;
    }

    return {
      id: card.id,
      name: card.translationKey || card.name,
      imageUrl: card.imageUrl || card.image,
      position: card.orientation || 'upright'
    };
  }
  
  /**
   * Effectue un tirage de cartes
   */
  async performReading() {
    // Protection contre les double-clics / appels concurrents
    if (this.isPerformingReading) return;

    const state = this.stateManager.getState();
    const language = state.language;

    // Récupérer et valider la question avant toute autre action
    const question = this.elements.questionInput.value.trim();
    if (!question) {
      this.signalMissingQuestion(language);
      return;
    }

    this.isPerformingReading = true;

    try {
      // Désactiver le bouton et changer son texte avec le texte traduit
      this.elements.tirerButton.disabled = true;
      this.elements.tirerButton.textContent = getTranslation('header.drawButtonGenerating', language);
      this.elements.tirerButton.classList.add('disabled');

      // S'assurer que l'indicateur de génération est masqué au début du tirage
      const generationIndicator = document.getElementById('generation-indicator');
      if (generationIndicator) {
        generationIndicator.style.display = 'none';
      }

      // Mémoriser la question
      this.currentQuestion = question;

      // Si aucun jeu n'est chargé, charger celui de l'état
      let deck = this.deckService.getCurrentDeck();
      if (!deck) {
        try {
          deck = await this.deckService.loadDeck(state.cardSet);
        } catch (loadError) {
          console.error(`Erreur lors du chargement du jeu ${state.cardSet}:`, loadError);
          throw new Error('Impossible de charger le jeu de cartes. Veuillez rafraîchir la page et réessayer.');
        }
      }

      // Vérifier que le deck contient suffisamment de cartes
      const requiredCards = this.currentSpread.getCardCount();

      if (deck.getRemainingCount() < requiredCards) {
        deck.reset();

        // Vérifier à nouveau après réinitialisation
        if (deck.getRemainingCount() < requiredCards) {
          throw new Error(`Ce tirage nécessite ${requiredCards} cartes, mais le jeu n'en contient que ${deck.getAllCards().length}`);
        }
      }

      // Effectuer le tirage
      const drawnCards = this.currentSpread.draw(deck);
      this.currentReading = drawnCards;

      // Sérialiser les cartes avant de les stocker dans l'état
      const serializedCards = drawnCards
        .map(card => this.serializeCard(card))
        .filter(card => card !== null);

      if (serializedCards.length === 0) {
        throw new Error('Erreur lors de la sérialisation des cartes');
      }

      // Mettre à jour l'état avec les cartes tirées
      this.stateManager.setState({
        cards: serializedCards,
        question,
        interpretation: null,
        isLoading: true
      });

      // Afficher le tirage
      this.currentSpread.render();

      // Obtenir l'interprétation
      const interpretation = await this.getInterpretation(
        drawnCards,
        question,
        state.persona,
        state.iaModel,
        language,
        state.spreadType
      );

      // Conserver l'interprétation pour la restaurer au prochain chargement
      this.stateManager.setState({
        interpretation: interpretation || null,
        isLoading: false
      });

    } catch (error) {
      console.error("Erreur lors du tirage:", error);

      this.stateManager.setState({ isLoading: false });

      // Afficher l'erreur à l'utilisateur
      this.showResponseError(error.message);
    } finally {
      // Toujours réactiver le bouton et réinitialiser le garde-fou
      this.resetDrawButton();
      this.isPerformingReading = false;
    }
  }

  /**
   * Signale visuellement qu'une question est requise avant de tirer les cartes
   * @param {string} language - Code de langue courant
   */
  signalMissingQuestion(language) {
    const input = this.elements.questionInput;

    input.classList.add('error-input');
    input.focus();

    // Animation de secousse du champ
    input.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 500, iterations: 1 });

    // Placeholder temporaire indiquant l'erreur
    const originalPlaceholder = input.placeholder;
    input.placeholder = getTranslation('interpretation.error.noQuestion', language);

    clearTimeout(this.missingQuestionTimeout);
    this.missingQuestionTimeout = setTimeout(() => {
      input.classList.remove('error-input');
      input.placeholder = originalPlaceholder;
    }, 3000);
  }

  /**
   * Affiche un message d'erreur dans la zone d'interprétation
   * @param {string} message - Message à afficher
   */
  showResponseError(message) {
    if (!this.elements.responseContent) return;

    const errorElement = document.createElement('p');
    errorElement.className = 'error';
    errorElement.textContent = message;

    this.elements.responseContent.replaceChildren(errorElement);
  }

  /**
   * Obtient l'interprétation des cartes tirées
   * @param {Array} reading - Cartes tirées
   * @param {string} question - Question posée
   * @param {string} persona - Persona sélectionné
   * @param {string} model - Modèle d'IA sélectionné
   * @param {string} language - Code de langue
   * @param {string} spreadType - Type de tirage
   * @return {Promise<string>} Le texte de l'interprétation
   */
  async getInterpretation(reading, question, persona, model, language = 'fr', spreadType = 'cross') {
    const generationIndicator = document.getElementById('generation-indicator');

    try {
      // Réinitialiser l'état de l'effet de machine à écrire
      this.stopTypewriterEffect();
      this.fullText = '';

      // Afficher l'indicateur de génération en cours
      if (generationIndicator) {
        const modelNameSpan = generationIndicator.querySelector('.model-name');
        if (modelNameSpan) {
          modelNameSpan.textContent = this.getModelDisplayName(model);
        }

        const stopGenerationText = generationIndicator.querySelector('#stop-generation-text');
        if (stopGenerationText) {
          stopGenerationText.textContent = getTranslation('header.stopGeneration', language);
        }

        generationIndicator.style.display = 'block';
      }

      // Afficher le message de chargement
      this.showLoadingMessage(language);

      // Variables pour suivre l'état du flux. La réflexion des modèles à
      // raisonnement précède la réponse et n'est affichée que pendant la
      // génération: elle ne fait pas partie de l'interprétation.
      let firstChunkReceived = false;
      let thinkingElement = null;

      const handleChunk = (chunk, isThinking = false) => {
        // Supprimer les timestamps parfois renvoyés en fin de flux
        const cleanedChunk = chunk.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/g, '');

        if (isThinking) {
          // Au premier chunk de réflexion, remplacer le message de chargement
          if (!thinkingElement) {
            thinkingElement = this.prepareThinkingContainer(language);
          }

          if (thinkingElement) {
            thinkingElement.textContent += cleanedChunk;
            thinkingElement.scrollTop = thinkingElement.scrollHeight;
          }
          return;
        }

        // Au premier chunk de réponse, remplacer le message de chargement (ou la
        // zone de réflexion) par la zone de texte
        if (!firstChunkReceived) {
          this.prepareTypewriterContainer();
          thinkingElement = null;
          firstChunkReceived = true;
        }

        this.fullText += cleanedChunk;
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

      // Si aucun chunk n'a été reçu (streaming non supporté), afficher la réponse complète
      if (!firstChunkReceived) {
        this.prepareTypewriterContainer();
        this.fullText = response;
        this.startTypewriterEffect();
      }

      // Masquer l'indicateur de génération une fois terminé
      if (generationIndicator) {
        generationIndicator.style.display = 'none';
      }

      return this.fullText;
    } catch (error) {
      this.stopTypewriterEffect();

      if (generationIndicator) {
        generationIndicator.style.display = 'none';
      }

      // La langue a pu changer pendant la génération (c'est même une des
      // façons de l'annuler): utiliser celle affichée actuellement.
      const currentLanguage = this.stateManager.getState().language;

      // Annulation volontaire: conserver le texte déjà reçu et l'indiquer,
      // sans la traiter comme un échec du tirage.
      if (error.name === 'AbortError') {
        this.showGenerationStoppedNotice(currentLanguage);
        return this.fullText;
      }

      console.error("Erreur lors de l'interprétation:", error);

      this.showResponseError(
        `${getTranslation('interpretation.error.interpretationError', currentLanguage)}: ${error.message}`
      );

      throw error;
    }
  }

  /**
   * Signale que la génération a été interrompue, en conservant le texte déjà
   * affiché. Le message n'est pas ajouté à `fullText`: il ne doit pas être
   * persisté comme faisant partie de l'interprétation.
   * @param {string} language - Code de langue
   */
  showGenerationStoppedNotice(language) {
    if (!this.elements.responseContent) return;

    // S'assurer que le texte partiel déjà reçu est intégralement affiché
    const typewriterElement = this.elements.responseContent.querySelector('.typewriter-text');
    if (typewriterElement) {
      typewriterElement.textContent = this.fullText;
      this.typedLength = this.fullText.length;
    }

    const notice = document.createElement('p');
    notice.className = 'generation-stopped-notice';
    notice.textContent = getTranslation('interpretation.error.generationStopped', language);

    if (typewriterElement) {
      this.elements.responseContent.appendChild(notice);
    } else {
      this.elements.responseContent.replaceChildren(notice);
    }
  }

  /**
   * Retourne le nom du modèle sans son préfixe de fournisseur
   * @param {string} model - Identifiant du modèle (ex: `ollama:llama3`)
   * @return {string} Nom lisible du modèle
   */
  getModelDisplayName(model) {
    return model.replace(/^(ollama:|openai\/)/, '');
  }

  /**
   * Affiche le message de chargement dans la zone d'interprétation
   * @param {string} language - Code de langue
   */
  showLoadingMessage(language) {
    if (!this.elements.responseContent) return;

    const container = document.createElement('div');
    container.className = 'loading-message';

    const text = document.createElement('p');
    text.textContent = getTranslation('interpretation.loading', language);

    container.appendChild(text);
    this.elements.responseContent.replaceChildren(container);
  }

  /**
   * Prépare le conteneur affichant la réflexion des modèles à raisonnement.
   * Le texte est inséré via textContent, comme celui de l'interprétation.
   * @param {string} language - Code de langue
   * @return {HTMLElement|null} L'élément recevant le texte de réflexion
   */
  prepareThinkingContainer(language) {
    if (!this.elements.responseContent) return null;

    const section = document.createElement('div');
    section.className = 'thinking-section';

    const header = document.createElement('div');
    header.className = 'thinking-header';
    header.textContent = getTranslation('interpretation.thinking', language);

    const content = document.createElement('div');
    content.className = 'thinking-content';

    section.append(header, content);
    this.elements.responseContent.replaceChildren(section);

    return content;
  }

  /**
   * Fait disparaître la zone de réflexion en fondu, puis la retire du DOM.
   * @param {HTMLElement} section - La section de réflexion à retirer
   */
  dismissThinkingSection(section) {
    // Doit correspondre à la durée de transition de `.thinking-section`
    const FADE_OUT_MS = 600;

    section.classList.add('fade-out');

    clearTimeout(this.thinkingFadeTimeout);
    this.thinkingFadeTimeout = setTimeout(() => {
      this.thinkingFadeTimeout = null;
      section.remove();
    }, FADE_OUT_MS);
  }

  /**
   * Prépare le conteneur qui reçoit le texte de l'interprétation
   * @return {HTMLElement|null} L'élément de texte créé
   */
  prepareTypewriterContainer() {
    if (!this.elements.responseContent) return null;

    const typewriterElement = document.createElement('div');
    typewriterElement.className = 'typewriter-text';

    // Une zone de réflexion en cours disparaît en fondu plutôt que d'être
    // retirée brutalement à l'arrivée du premier mot de la réponse.
    const thinkingSection = this.elements.responseContent.querySelector('.thinking-section');
    if (thinkingSection) {
      this.elements.responseContent.replaceChildren(thinkingSection, typewriterElement);
      this.dismissThinkingSection(thinkingSection);
    } else {
      this.elements.responseContent.replaceChildren(typewriterElement);
    }

    this.typedLength = 0;
    return typewriterElement;
  }

  /**
   * Affiche progressivement `this.fullText` dans la zone d'interprétation.
   * Le texte est inséré via textContent: aucune interprétation HTML n'a lieu,
   * ce qui écarte tout risque d'injection depuis la réponse du modèle.
   */
  startTypewriterEffect() {
    const typewriterElement = this.elements.responseContent?.querySelector('.typewriter-text');
    if (!typewriterElement) return;

    // Une animation est déjà en cours: elle prendra en compte le texte ajouté
    if (this.typewriterTimeout) return;

    const TYPING_INTERVAL_MS = 5;
    const MIN_CHARS_PER_CYCLE = 3;

    const typeNextChars = () => {
      this.typewriterTimeout = null;

      const remaining = this.fullText.length - this.typedLength;
      if (remaining <= 0) {
        // Animation terminée
        typewriterElement.classList.add('generation-complete');
        this.initScrollHandlers();
        return;
      }

      // Accélérer la frappe lorsque beaucoup de texte est en attente
      const charsPerCycle = remaining > 200
        ? Math.min(10, Math.floor(remaining / 50))
        : MIN_CHARS_PER_CYCLE;

      this.typedLength = Math.min(this.typedLength + charsPerCycle, this.fullText.length);
      typewriterElement.textContent = this.fullText.slice(0, this.typedLength);

      this.typewriterTimeout = setTimeout(typeNextChars, TYPING_INTERVAL_MS);
    };

    typeNextChars();
  }

  /**
   * Interrompt l'effet de machine à écrire en cours
   */
  stopTypewriterEffect() {
    clearTimeout(this.typewriterTimeout);
    this.typewriterTimeout = null;
    clearTimeout(this.thinkingFadeTimeout);
    this.thinkingFadeTimeout = null;
    this.typedLength = 0;
  }

  /**
   * Change le jeu de cartes actuel
   * @param {string} deckId - Identifiant du nouveau jeu
   */
  async changeDeck(deckId) {
    try {
      if (!deckId) throw new Error('Identifiant de jeu non spécifié');

      // Charger le nouveau jeu
      const newDeck = await this.deckService.loadDeck(deckId);

      // Réinitialiser le tirage: les cartes du jeu précédent ne sont plus valides
      this.clearReading();
      this.stateManager.setState({ error: null });

      // Réafficher le tirage courant, désormais vide
      this.currentSpread?.reset();

      return newDeck;
    } catch (error) {
      console.error(`❌ Erreur lors du chargement du jeu ${deckId}:`, error);
      this.stateManager.setState({ error: error.message });
      throw error;
    }
  }

  /**
   * Restaure un tirage sauvegardé (cartes + interprétation)
   * @param {Array} cards - Les cartes du tirage à restaurer
   * @param {string|null} interpretation - Le texte de l'interprétation
   */
  restoreReading(cards, interpretation) {
    try {
      if (!Array.isArray(cards) || cards.length === 0) return;

      // Rafraîchir les URLs d'image à partir du jeu actuellement chargé:
      // le jeu de cartes a pu changer depuis la sauvegarde.
      const deck = this.deckService.getCurrentDeck();
      if (!deck) {
        console.warn('⚠️ Aucun jeu chargé, restauration du tirage annulée');
        return;
      }

      // Repartir des cartes du jeu (et non des données brutes persistées) afin
      // de disposer des noms traduits et des images du jeu actuel.
      const restoredCards = cards
        .map(card => {
          const freshCard = deck.getCardById(card.id);
          if (!freshCard) return null;

          const restored = freshCard.clone();
          restored.orientation = card.position || 'upright';
          return restored;
        })
        .filter(card => card !== null);

      if (restoredCards.length === 0) {
        this.stateManager.setState({ cards: [] });
        return;
      }

      // Afficher les cartes restaurées dans le tirage courant
      this.currentReading = restoredCards;
      this.currentSpread.cards = restoredCards;
      this.currentSpread.render();

      // Restaurer l'interprétation en texte brut
      if (interpretation) {
        this.prepareTypewriterContainer();
        this.fullText = interpretation;
        this.typedLength = interpretation.length;
        this.elements.responseContent.querySelector('.typewriter-text').textContent = interpretation;
        this.initScrollHandlers();
      }
    } catch (error) {
      console.error('Erreur lors de la restauration du tirage:', error);
    }
  }

  /**
   * Initialise les gestionnaires d'événements pour le défilement
   */
  initScrollHandlers() {
    if (this.scrollHandlersInitialized) return;
    if (!this.elements.responseContent) return;
    this.scrollHandlersInitialized = true;

    this.elements.responseContent.setAttribute('tabindex', '0');

    // Permettre le focus au clic
    this.elements.responseContent.addEventListener('click', () => {
      this.elements.responseContent.focus();
    });
  }

}

export default ReadingController;
