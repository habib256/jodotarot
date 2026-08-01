/**
 * Service pour charger et gérer les différents jeux de cartes
 */
import Deck from '../models/cards/Deck.js';
import { cardSetConfigs, generateCards } from '../models/cards/index.js';

class DeckService {
  constructor() {
    this.decks = {}; // Cache des jeux chargés
    this.currentDeckId = null;
  }
  
  /**
   * Vérifie si un jeu de cartes est déjà chargé
   * @param {string} deckId - Identifiant du jeu
   * @returns {boolean} True si le jeu est chargé
   */
  isDeckLoaded(deckId) {
    return !!this.decks[deckId];
  }
  
  /**
   * Charge un jeu de cartes spécifique
   * @param {string} deckId - Identifiant du jeu à charger
   * @returns {Promise<Deck>} Le jeu de cartes chargé
   */
  async loadDeck(deckId) {
    // Vider le cache si on change de jeu
    if (this.currentDeckId && this.currentDeckId !== deckId) {
      console.log(`🗑️ Vidage du cache du jeu ${this.currentDeckId}`);
      delete this.decks[this.currentDeckId];
    }

    const deckInfo = cardSetConfigs[deckId];
    if (!deckInfo) {
      console.error(`❌ Jeu ${deckId} non trouvé dans les jeux disponibles`);
      throw new Error(`Jeu ${deckId} non trouvé`);
    }

    try {
      // Charger les cartes majeures
      const majorCards = this.fetchMajorCards(deckId);

      // Créer le jeu
      const deck = new Deck(deckId, majorCards);
      this.decks[deckId] = deck;
      this.currentDeckId = deckId;

      console.log(`✅ Jeu ${deckId} chargé avec succès`);
      return deck;
    } catch (error) {
      console.error(`❌ Erreur lors du chargement du jeu ${deckId}:`, error);
      throw new Error(`Échec du chargement du jeu ${deckId}: ${error.message}`);
    }
  }
  
  /**
   * Récupère les cartes majeures pour un jeu donné
   * @param {string} deckId - L'identifiant du jeu
   * @returns {TarotCard[]} Les cartes majeures
   */
  fetchMajorCards(deckId) {
    return generateCards(deckId);
  }
  
  /**
   * Obtient le jeu de cartes actuellement sélectionné
   * @return {Deck|null} Le jeu de cartes actuel ou null si aucun n'est chargé
   */
  getCurrentDeck() {
    if (!this.currentDeckId) {
      return null;
    }
    return this.decks[this.currentDeckId];
  }
  
}

export default DeckService;
