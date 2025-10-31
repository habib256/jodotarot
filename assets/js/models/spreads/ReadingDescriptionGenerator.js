/**
 * Classe utilitaire pour générer les descriptions de tirage
 */
import { getCardMeaning } from '../cards/CardMeanings.js';

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
    const symbol = card.orientation === 'upright' ? '↑' : '↓';
    
    // Obtenir le nom traduit de la carte
    const cardName = card.getTranslatedName ? card.getTranslatedName(this.language) : card.translationKey;
    
    // Format compact : une seule ligne par carte
    let description = `${index+1}. ${positionName} : ${cardName} (${symbol})`;
    
    // Ajouter la signification courte de la carte si disponible
    const cardMeaning = getCardMeaning(card.translationKey, card.orientation, this.language);
    if (cardMeaning) {
      description += ` - ${cardMeaning}`;
    }
    
    // Ajouter les descriptions détaillées uniquement si demandé
    if (includeDetailedDescriptions) {
      const positionDescription = this.spread.getPositionDescription(index, card);
      if (positionDescription) {
        description += `\n   ${positionDescription}`;
      }
    }
    
    return description + '\n';
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
    
    // Traduire "Spread" et "cards" selon la langue
    const spreadLabels = {
      'fr': { spread: 'Tirage', cards: 'cartes' },
      'en': { spread: 'Spread', cards: 'cards' },
      'es': { spread: 'Tirada', cards: 'cartas' },
      'de': { spread: 'Legung', cards: 'Karten' },
      'it': { spread: 'Lettura', cards: 'carte' },
      'zh': { spread: '', cards: '张牌' }
    };
    
    const labels = spreadLabels[this.language] || spreadLabels['en'];
    
    let description = labels.spread 
      ? `${labels.spread} ${spreadName} (${this.spread.cards.length} ${labels.cards}):\n\n`
      : `${spreadName} (${this.spread.cards.length}${labels.cards}):\n\n`;
    
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