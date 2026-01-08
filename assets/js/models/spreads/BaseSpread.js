/**
 * Classe de base pour tous les types de tirages
 * Définit l'interface commune et les fonctionnalités partagées
 */
import ReadingDescriptionGenerator from './ReadingDescriptionGenerator.js';

class BaseSpread {
  /**
   * @param {string} key - Identifiant unique du type de tirage
   * @param {HTMLElement} container - Conteneur DOM pour le tirage
   * @param {string} language - Code de langue (fr, en, etc.)
   */
  constructor(key, container, language = 'fr') {
    this.key = key;
    this.container = container;
    this.language = language;
    this.cards = [];
    
    // Ces propriétés seront surchargées par les classes enfants
    this.name = {};
    this.description = {};
    this.cardPositions = [];
    this.positionMeanings = {};
  }
  
  /**
   * Retourne le nom localisé du tirage
   * @return {string} Nom du tirage
   */
  getName() {
    return this.name[this.language] || this.name['fr'] || this.key;
  }
  
  /**
   * Retourne la description localisée du tirage
   * @return {string} Description du tirage
   */
  getDescription() {
    return this.description[this.language] || this.description['fr'] || '';
  }
  
  /**
   * Retourne le nombre de cartes nécessaires pour ce tirage
   * @return {number} Nombre de cartes
   */
  getCardCount() {
    return this.cardPositions.length;
  }
  
  /**
   * Retourne la signification localisée d'une position
   * @param {number} positionIndex - Indice de la position (0-indexé)
   * @return {string} Signification de la position
   */
  getPositionMeaning(positionIndex) {
    const positions = this.positionMeanings[this.language] || this.positionMeanings['fr'] || {};
    return positions[positionIndex + 1] || `Position ${positionIndex + 1}`;
  }
  
  /**
   * Retourne la classe CSS à utiliser pour une position de carte
   * Peut être surchargée par les classes enfants pour des comportements spécifiques
   * @param {number} positionIndex - Indice de la position
   * @return {string} Nom de classe CSS
   */
  getPositionClassName(positionIndex) {
    return `card-position card-${positionIndex + 1}`;
  }
  
  /**
   * Configure le style d'une position de carte
   * @param {HTMLElement} positionElement - L'élément de position
   * @param {Object} position - Les données de position
   * @private
   */
  _configurePositionStyle(positionElement, position) {
    positionElement.style.position = 'absolute';
    
    if (position.position) {
      positionElement.style.left = `var(--${this.key}-position-${position.position}-x)`;
      positionElement.style.top = `var(--${this.key}-position-${position.position}-y)`;
      
      const rotationVar = `--${this.key}-position-${position.position}-rotation`;
      const rotationValue = getComputedStyle(document.documentElement).getPropertyValue(rotationVar);
      
      positionElement.style.transform = rotationValue?.trim() 
        ? `translate(-50%, -50%) rotate(${rotationValue})`
        : `translate(-50%, -50%) rotate(${position.rotation || 0}deg)`;
    } else {
      const cssPositionName = position.cssName || position.name;
      if (cssPositionName) {
        positionElement.style.left = `var(--${this.key}-${cssPositionName}-x)`;
        positionElement.style.top = `var(--${this.key}-${cssPositionName}-y)`;
        
        const rotationVar = `--${this.key}-${cssPositionName}-rotation`;
        const rotationValue = getComputedStyle(document.documentElement).getPropertyValue(rotationVar);
        
        positionElement.style.transform = rotationValue?.trim() 
          ? `translate(-50%, -50%) rotate(${rotationValue})`
          : `translate(-50%, -50%) rotate(${position.rotation || 0}deg)`;
      }
    }
    
    positionElement.style.transformOrigin = 'center center';
  }
  
  /**
   * Crée un élément de carte
   * @param {Object} card - Les données de la carte
   * @param {number} index - L'index de la position
   * @returns {HTMLElement} L'élément de carte créé
   * @private
   */
  _createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.orientation}`;
    cardElement.setAttribute('data-card-id', card.id);
    cardElement.setAttribute('data-card-name', card.name);
    cardElement.setAttribute('data-position', index);
    
    // Image de la carte
    const cardImage = document.createElement('img');
    cardImage.src = card.imageUrl;
    cardImage.alt = card.name;
    
    cardElement.appendChild(cardImage);
    return cardElement;
  }

  /**
   * Crée un élément de position
   * @param {Object} position - Les données de position
   * @param {number} index - L'index de la position
   * @returns {HTMLElement} L'élément de position créé
   * @private
   */
  _createPositionElement(position, index) {
    const positionElement = document.createElement('div');
    
    // Appliquer les classes de position appropriées
    positionElement.className = `${this.getPositionClassName(index)} empty`;
    
    // Ajouter des attributs de données pour la gestion des événements
    positionElement.setAttribute('data-position', index);
    positionElement.setAttribute('data-position-name', this.getPositionMeaning(index));
    
    // Ajouter une description détaillée si disponible
    const positionDescription = this.getPositionDescription(index);
    if (positionDescription) {
      positionElement.setAttribute('data-position-meaning', positionDescription);
    }
    
    // Ajouter des attributs pour la description de la carte
    positionElement.setAttribute('data-card-name', '');
    positionElement.setAttribute('data-card-description', '');
    
    // Configurer le style de la position
    this._configurePositionStyle(positionElement, position);
    
    return positionElement;
  }

  /**
   * Met à jour les attributs de description d'une position
   * @param {HTMLElement} positionElement - L'élément de position
   * @param {Object} card - La carte à cette position
   * @param {number} index - L'index de la position
   * @private
   */
  _updatePositionDescription(positionElement, card, index) {
    if (!positionElement || !card) return;
    
    // Mettre à jour le nom de la carte
    positionElement.setAttribute('data-card-name', card.name);
    
    // Mettre à jour la description détaillée
    positionElement.setAttribute('data-card-description', this.getPositionDescription(index, card));
  }

  /**
   * Initialise les positions des cartes dans l'interface
   * Utilise les variables CSS pour le positionnement
   */
  initializeCardPositions() {
    // Vérifier si le conteneur existe
    if (!this.container) {
      console.error('Conteneur non défini pour le tirage');
      return;
    }
    
    // Vider le conteneur
    this.container.innerHTML = '';
    
    // Créer les emplacements pour les cartes
    this.cardPositions.forEach((position, index) => {
      this.container.appendChild(this._createPositionElement(position, index));
    });
    
    // Ajouter des éléments visuels supplémentaires spécifiques à chaque tirage
    this.addVisualElements();
  }
  
  /**
   * Méthode à surcharger par les classes enfants pour ajouter des éléments visuels
   * (formes décoratives, lignes de connexion, etc.)
   */
  addVisualElements() {
    // À implémenter par les classes enfants
  }
  
  /**
   * Effectue un tirage avec le jeu de cartes spécifié
   * @param {Deck} deck - Jeu de cartes à utiliser
   * @return {Array} Cartes tirées
   */
  draw(deck) {
    if (!deck) {
      throw new Error('Aucun jeu de cartes fourni pour le tirage');
    }
    
    console.log(`Début du tirage avec le jeu "${deck.deckId}" - ${this.getCardCount()} cartes nécessaires`);
    console.log(`Nombre de cartes disponibles: ${deck.getRemainingCount()}`);
    
    // Réinitialiser les cartes
    this.cards = [];
    
    // Mélanger le jeu
    deck.shuffle();
    console.log(`Jeu mélangé - ${deck.getRemainingCount()} cartes disponibles`);
    
    // Tirer le nombre de cartes nécessaires avec orientation aléatoire
    for (let i = 0; i < this.getCardCount(); i++) {
      console.log(`Tirage de la carte ${i+1}/${this.getCardCount()}`);
      const card = deck.drawCard(true); // true pour activer l'orientation aléatoire
      if (!card) {
        console.error(`Tirage échoué: carte nulle à l'indice ${i}`);
        throw new Error(`Tirage échoué: carte nulle à l'indice ${i}`);
      }
      this.cards.push(card);
    }
    
    console.log(`Tirage terminé avec succès: ${this.cards.length} cartes tirées`);
    return this.cards;
  }
  
  /**
   * Réinitialise l'affichage du tirage
   */
  reset() {
    // Initialiser les positions des cartes
    this.initializeCardPositions();
    this.cards = [];
  }
  
  /**
   * Trouve l'élément DOM correspondant à une position de carte
   * @param {number} positionIndex - Indice de la position
   * @return {HTMLElement|null} Élément DOM de la position ou null
   */
  getPositionElement(positionIndex) {
    return this.container.querySelector(`:scope > [data-position="${positionIndex}"]`);
  }
  
  /**
   * Rend le tirage dans le conteneur
   */
  render() {
    if (!this.container) {
      throw new Error('Aucun conteneur fourni pour le rendu du tirage');
    }
    
    // Vérifier si les positions des cartes existent déjà
    const positionsExist = this.cardPositions.some((_, index) => {
      return !!this.getPositionElement(index);
    });
    
    // S'il n'y a pas de positions, les initialiser
    if (!positionsExist) {
      this.initializeCardPositions();
    }
    
    // Si aucune carte n'a été tirée, s'arrêter ici
    if (!this.cards || this.cards.length === 0) {
      return;
    }
    
    // Marquer toutes les positions comme vides au début
    this.cardPositions.forEach((_, index) => {
      const posElement = this.getPositionElement(index);
      if (posElement) {
        posElement.classList.add('empty');
      }
    });
    
    // Placer chaque carte dans sa position
    this.cards.forEach((card, index) => {
      if (!card) {
        console.warn(`Carte nulle à l'indice ${index}, saut du rendu`);
        return;
      }
      if (index >= this.cardPositions.length) {
        return; // Ignorer les cartes supplémentaires
      }
      
      // Trouver l'élément de position
      const positionElement = this.getPositionElement(index);
      
      if (!positionElement) {
        return;
      }
      
      // Vider la position
      positionElement.innerHTML = '';
      
      // Supprimer la classe 'empty' puisque la position va contenir une carte
      positionElement.classList.remove('empty');
      
      // Créer et ajouter l'élément de carte
      const cardElement = this._createCardElement(card, index);
      positionElement.appendChild(cardElement);
      
      // Mettre à jour les descriptions
      this._updatePositionDescription(positionElement, card, index);
    });
  }
  
  /**
   * Méthode à surcharger par les classes enfants pour fournir une description détaillée des positions
   * @param {number} positionIndex - Indice de la position
   * @param {Object} card - La carte à cette position
   * @return {string|null} Description détaillée ou null
   */
  getPositionDescription(positionIndex, card = null) {
    // Si on a des descriptions de positions définies, les utiliser
    if (this.positionDescriptions && this.positionDescriptions[this.language]) {
      const descriptions = this.positionDescriptions[this.language];
      const description = descriptions[positionIndex + 1];
      if (description) {
        return description;
      }
    }
    
    // Sinon, retourner une description basique si une carte est fournie
    if (!card) return '';
    
    // Description de base de la carte
    let description = '';
    
    // Ajouter la suite si disponible
    if (card.suit) {
      description += `Suite: ${card.suit}`;
    }
    
    return description;
  }
  
  /**
   * Génère une description du tirage pour l'interprétation
   * @param {boolean} includeDetailedDescriptions - Inclure les descriptions détaillées des positions
   * @return {string} Description formatée du tirage
   */
  generateReadingDescription(includeDetailedDescriptions = true) {
    console.log('BaseSpread.generateReadingDescription appelé');
    console.log('Cartes disponibles:', this.cards);
    console.log('Langue:', this.language);
    
    if (!this.cards || this.cards.length === 0) {
      console.warn('Aucune carte disponible pour la description');
      return '';
    }
    
    const generator = new ReadingDescriptionGenerator(this, this.language);
    const description = generator.generateReadingDescription(includeDetailedDescriptions);
    
    console.log('Description générée:', description);
    return description;
  }
}

export default BaseSpread; 