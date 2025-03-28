/**
 * Classe représentant un jeu de cartes de tarot
 * Gère le mélange et le tirage des cartes
 */
import { ARCANE_TYPES } from './index.js';

class Deck {
  /**
   * @param {string} deckId - Identifiant du jeu de cartes
   * @param {Array} cards - Liste des cartes du jeu
   */
  constructor(deckId, cards = []) {
    this.deckId = deckId;
    this.originalCards = [...cards]; // Sauvegarde des cartes originales
    this.cards = [...cards]; // Copie des cartes pour manipulation
    this.drawnCards = []; // Cartes déjà tirées
  }
  
  /**
   * Charge les cartes pour ce jeu
   * @param {Array} cards - Liste des cartes à charger
   */
  loadCards(cards) {
    this.originalCards = [...cards];
    this.reset();
  }
  
  /**
   * Réinitialise le jeu en remettant toutes les cartes non tirées
   */
  reset() {
    // Réinitialiser les cartes tirées
    this.drawnCards = [];
    
    // Réinitialiser le jeu avec toutes les cartes sauf le dos
    this.cards = this.originalCards.filter(card => !card.isBack());
    
    // Mélanger le jeu
    this.shuffle();
  }
  
  /**
   * Mélange les cartes du jeu
   */
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  
  /**
   * Tire une carte du jeu
   * @param {boolean} [randomOrientation=false] - Si true, la carte peut être renversée
   * @returns {Object|null} La carte tirée ou null si le jeu est vide
   */
  drawCard(randomOrientation = false) {
    if (this.cards.length === 0) {
      return null;
    }
    
    // Trouver la prochaine carte qui n'est pas le dos
    let cardIndex = this.cards.findIndex(card => !card.isBack());
    if (cardIndex === -1) {
      return null; // Aucune carte disponible sauf le dos
    }
    
    // Retirer la carte du jeu
    const card = this.cards.splice(cardIndex, 1)[0];
    this.drawnCards.push(card);
    
    // Ajouter l'orientation si demandée
    if (randomOrientation) {
      card.orientation = Math.random() < 0.5 ? 'upright' : 'reversed';
    }
    
    return card;
  }
  
  /**
   * Tire plusieurs cartes du jeu
   * @param {number} count - Nombre de cartes à tirer
   * @param {boolean} [randomOrientation=false] - Si true, les cartes peuvent être renversées
   * @returns {Array} Les cartes tirées
   */
  drawCards(count, randomOrientation = false) {
    const drawn = [];
    for (let i = 0; i < count && this.cards.length > 0; i++) {
      const card = this.drawCard(randomOrientation);
      if (card) {
        drawn.push(card);
      }
    }
    return drawn;
  }
  
  /**
   * Retourne le nombre de cartes restantes dans le jeu
   * @return {number} Nombre de cartes restantes
   */
  getRemainingCount() {
    return this.cards.length;
  }
  
  /**
   * Retourne toutes les cartes du jeu (tirées et non tirées)
   * @return {Array} Toutes les cartes
   */
  getAllCards() {
    return [...this.originalCards];
  }
  
  /**
   * Retourne les cartes déjà tirées
   * @return {Array} Cartes tirées
   */
  getDrawnCards() {
    return [...this.drawnCards];
  }
  
  /**
   * Recherche une carte par son id
   * @param {string|number} cardId - ID de la carte à rechercher
   * @return {Object|null} La carte trouvée ou null
   */
  findCardById(cardId) {
    return this.originalCards.find(card => card.id === cardId) || null;
  }
  
  /**
   * Alias de findCardById
   * @param {string|number} cardId - ID de la carte à rechercher
   * @return {Object|null} La carte trouvée ou null
   */
  getCardById(cardId) {
    return this.findCardById(cardId);
  }
  
  /**
   * Recherche une carte par son nom
   * @param {string} cardName - Nom de la carte à rechercher
   * @return {Object|null} La carte trouvée ou null
   */
  findCardByName(cardName) {
    return this.originalCards.find(card => 
      card.name.toLowerCase() === cardName.toLowerCase()
    ) || null;
  }
  
  /**
   * Obtient le nombre total de cartes dans le jeu
   * @returns {number} Nombre total de cartes
   */
  getTotalCount() {
    return this.originalCards.length;
  }
  
  /**
   * Filtre les cartes par type d'arcane
   * @param {string} arcanaType - Type d'arcane (major ou minor)
   * @returns {Array} Cartes filtrées
   */
  filterByArcana(arcanaType) {
    return this.cards.filter(card => card.arcana === arcanaType);
  }
  
  /**
   * Obtient les cartes majeures
   * @returns {Array} Cartes majeures
   */
  getMajorCards() {
    return this.filterByArcana(ARCANE_TYPES.MAJOR);
  }
  
  /**
   * Obtient les cartes mineures
   * @returns {Array} Cartes mineures
   */
  getMinorCards() {
    return this.filterByArcana(ARCANE_TYPES.MINOR);
  }
  
  /**
   * Vérifie si le jeu contient des arcanes mineurs
   * @returns {boolean} True si le jeu contient des arcanes mineurs
   */
  hasMinorArcana() {
    return this.getMinorCards().length > 0;
  }
}

export default Deck; 