/**
 * Classe représentant un jeu de cartes de tarot
 * Gère le mélange et le tirage des cartes
 */
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
  
}

export default Deck;
