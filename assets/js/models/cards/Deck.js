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
    this.cards = [...this.originalCards];
    this.drawnCards = [];
  }
  
  /**
   * Mélange les cartes du jeu
   * @param {boolean} includeReversed - Si true, certaines cartes seront retournées aléatoirement
   */
  shuffle(includeReversed = true) {
    // Algorithme de Fisher-Yates pour mélanger
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    
    // Déterminer aléatoirement l'orientation des cartes
    if (includeReversed) {
      this.cards = this.cards.map(card => {
        const cardCopy = { ...card };
        // 50% de chance d'être à l'endroit ou renversée
        cardCopy.orientation = Math.random() < 0.5 ? 'upright' : 'reversed';
        return cardCopy;
      });
    } else {
      // Toutes les cartes à l'endroit
      this.cards = this.cards.map(card => {
        const cardCopy = { ...card };
        cardCopy.orientation = 'upright';
        return cardCopy;
      });
    }
  }
  
  /**
   * Tire une carte du jeu
   * @return {Object|null} La carte tirée ou null si le jeu est vide
   */
  drawCard() {
    if (this.cards.length === 0) {
      console.warn(`Impossible de tirer une carte: jeu ${this.deckId} vide!`);
      return null;
    }
    
    const card = this.cards.pop();
    if (!card) {
      console.error(`Erreur: carte nulle extraite du jeu ${this.deckId}!`);
      return null;
    }
    
    console.log(`Carte tirée: ${card.name} (${card.imageUrl})`);
    this.drawnCards.push(card);
    return card;
  }
  
  /**
   * Tire un nombre spécifique de cartes
   * @param {number} count - Nombre de cartes à tirer
   * @return {Array} Les cartes tirées
   */
  drawCards(count) {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      const card = this.drawCard();
      if (card) {
        drawn.push(card);
      } else {
        break; // Plus de cartes disponibles
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
}

export default Deck; 