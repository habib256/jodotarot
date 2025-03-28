/**
 * Classe utilitaire pour générer les descriptions de tirage
 */
class ReadingDescriptionGenerator {
  /**
   * @param {BaseSpread} spread - Instance du tirage
   * @param {string} language - Code de langue
   */
  constructor(spread, language = 'fr') {
    this.spread = spread;
    this.language = language;
  }

  /**
   * Génère la description d'une carte individuelle
   * @param {Object} card - La carte à décrire
   * @param {number} index - L'index de la carte
   * @param {boolean} includeDetailedDescriptions - Inclure les descriptions détaillées
   * @returns {string} Description formatée de la carte
   */
  generateCardDescription(card, index, includeDetailedDescriptions = true) {
    if (!card?.translationKey) return '';
    
    const positionName = this.spread.getPositionMeaning(index);
    const orientation = card.orientation === 'upright' ? 
      (this.language === 'fr' ? 'à l\'endroit' : 'upright') : 
      (this.language === 'fr' ? 'renversée' : 'reversed');
    
    let description = `${index+1}. ${positionName}: ${card.translationKey} (${orientation})`;
    
    if (card.arcana) {
      const arcanaText = this.language === 'fr' 
        ? (card.arcana === 'major' ? 'Arcane majeur' : 'Arcane mineur') 
        : (card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana');
      description += ` - ${arcanaText}`;
    }
    
    if (card.suit) {
      description += ` - ${card.suit}`;
    }
    
    if (includeDetailedDescriptions) {
      const positionDescription = this.spread.getPositionDescription(index, card);
      if (positionDescription) {
        description += `\n   ${positionDescription}`;
      }
    }
    
    return description + '\n\n';
  }

  /**
   * Génère une description complète du tirage
   * @param {boolean} includeDetailedDescriptions - Inclure les descriptions détaillées des positions
   * @return {string} Description formatée du tirage
   */
  generateReadingDescription(includeDetailedDescriptions = true) {
    if (!this.spread.cards?.length) return '';
    
    const spreadName = this.spread.getName();
    const spreadDesc = this.spread.getDescription();
    
    let description = this.language === 'fr' 
      ? `Tirage ${spreadName} (${this.spread.cards.length} cartes):\n\n`
      : `${spreadName} Spread (${this.spread.cards.length} cards):\n\n`;
    
    if (spreadDesc) {
      description += `${spreadDesc}\n\n`;
    }
    
    this.spread.cards.forEach((card, index) => {
      if (card?.translationKey) {
        description += this.generateCardDescription(card, index, includeDetailedDescriptions);
      }
    });
    
    return description;
  }
}

export default ReadingDescriptionGenerator; 