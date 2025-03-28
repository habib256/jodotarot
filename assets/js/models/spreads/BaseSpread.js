/**
 * Classe de base pour tous les types de tirages
 * Définit l'interface commune et les fonctionnalités partagées
 */
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
   * @param {Object} positionData - Données de la position
   * @return {string} Nom de classe CSS
   */
  getPositionClassName(positionIndex, positionData) {
    return `card-position card-${positionIndex + 1}`;
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
      const positionElement = document.createElement('div');
      
      // Appliquer les classes de position appropriées
      positionElement.className = `card-position ${this.getPositionClassName(index, position)} empty`;
      
      // Ajouter des attributs de données pour la gestion des événements
      positionElement.setAttribute('data-position', index);
      positionElement.setAttribute('data-position-name', this.getPositionMeaning(index));
      
      // Ajouter une description détaillée si disponible
      const positionDescription = this.getPositionDescription(index);
      if (positionDescription) {
        positionElement.setAttribute('data-position-meaning', positionDescription);
      }
      
      // Style de base
      positionElement.style.position = 'absolute';
      
      // Définir la position en utilisant les variables CSS
      // Utiliser le système de positionnement numérique en priorité (position-1, position-2, etc.)
      if (position.position) {
        positionElement.style.left = `var(--${this.key}-position-${position.position}-x)`;
        positionElement.style.top = `var(--${this.key}-position-${position.position}-y)`;
        
        // Vérifier s'il existe une variable de rotation
        const rotationVar = `--${this.key}-position-${position.position}-rotation`;
        const rotationValue = getComputedStyle(document.documentElement).getPropertyValue(rotationVar);
        
        if (rotationValue && rotationValue.trim() !== '') {
          positionElement.style.transform = `translate(-50%, -50%) rotate(${rotationValue})`;
          positionElement.style.transformOrigin = 'center center'; // Assure que la rotation se fait autour du centre
        } else if (position.rotation) {
          positionElement.style.transform = `translate(-50%, -50%) rotate(${position.rotation}deg)`;
          positionElement.style.transformOrigin = 'center center'; // Assure que la rotation se fait autour du centre
        } else {
          positionElement.style.transform = 'translate(-50%, -50%)';
        }
      } 
      else {
        // Ancien système - nom sémantique
        const cssPositionName = position.cssName || position.name;
        if (cssPositionName) {
          positionElement.style.left = `var(--${this.key}-${cssPositionName}-x)`;
          positionElement.style.top = `var(--${this.key}-${cssPositionName}-y)`;
          
          // Vérifier s'il existe une variable de rotation pour cette position
          const rotationVar = `--${this.key}-${cssPositionName}-rotation`;
          const rotationValue = getComputedStyle(document.documentElement).getPropertyValue(rotationVar);
          
          if (rotationValue && rotationValue.trim() !== '') {
            positionElement.style.transform = `translate(-50%, -50%) rotate(${rotationValue})`;
            positionElement.style.transformOrigin = 'center center'; // Assure que la rotation se fait autour du centre
          } else if (position.rotation) {
            positionElement.style.transform = `translate(-50%, -50%) rotate(${position.rotation}deg)`;
            positionElement.style.transformOrigin = 'center center'; // Assure que la rotation se fait autour du centre
          } else {
            positionElement.style.transform = 'translate(-50%, -50%)';
          }
        }
      }
      
      // Ajouter au DOM
      this.container.appendChild(positionElement);
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
    
    // Tirer le nombre de cartes nécessaires
    for (let i = 0; i < this.getCardCount(); i++) {
      console.log(`Tirage de la carte ${i+1}/${this.getCardCount()}`);
      const card = deck.drawCard();
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
    const positionsExist = this.cardPositions.some((position, index) => {
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
      
      // Créer l'élément de carte
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
      positionElement.appendChild(cardElement);
    });
  }
  
  /**
   * Méthode à surcharger par les classes enfants pour fournir une description détaillée des positions
   * @param {number} positionIndex - Indice de la position
   * @return {string|null} Description détaillée ou null
   */
  getPositionDescription(positionIndex) {
    // Désactivation complète des descriptions détaillées
    return '';
  }
  
  /**
   * Génère une description du tirage pour l'interprétation
   * @param {boolean} includeDetailedDescriptions - Inclure les descriptions détaillées des positions
   * @return {string} Description formatée du tirage
   */
  generateReadingDescription(includeDetailedDescriptions = true) {
    if (!this.cards || this.cards.length === 0) {
      return '';
    }
    
    let description = '';
    
    // En-tête du tirage
    if (this.language === 'fr') {
      description += `Tirage ${this.getName()} (${this.cards.length} cartes):\n\n`;
    } else {
      description += `${this.getName()} Spread (${this.cards.length} cards):\n\n`;
    }
    
    // Description générale du tirage
    const spreadDesc = this.getDescription();
    if (spreadDesc) {
      description += `${spreadDesc}\n\n`;
    }
    
    // Description des cartes et de leurs positions
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      const positionName = this.getPositionMeaning(i);
      const orientation = card.orientation === 'upright' ? 
        (this.language === 'fr' ? 'à l\'endroit' : 'upright') : 
        (this.language === 'fr' ? 'renversée' : 'reversed');
      
      // Information principale de la carte
      description += `${i+1}. ${positionName}: ${card.name} (${orientation})`;
      
      // Ajouter des informations sur l'arcane si disponibles
      if (card.arcana) {
        const arcanaText = this.language === 'fr' 
          ? (card.arcana === 'major' ? 'Arcane majeur' : 'Arcane mineur') 
          : (card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana');
        description += ` - ${arcanaText}`;
      }
      
      // Ajouter des informations sur la suite si disponibles
      if (card.suit) {
        description += ` - ${card.suit}`;
      }
      
      description += '\n';
      
      // Ajouter une description de la position
      const positionDescription = this.getPositionDescription(i);
      if (includeDetailedDescriptions && positionDescription) {
        description += `   ${positionDescription}\n`;
      }
      
      description += '\n';
    }
    
    return description;
  }
}

export default BaseSpread; 