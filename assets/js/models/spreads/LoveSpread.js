/**
 * Implémentation du tirage de l'amour
 * Un tirage en 7 cartes disposées en cœur
 */
import BaseSpread from './BaseSpread.js';

class LoveSpread extends BaseSpread {
  /**
   * @param {HTMLElement} container - Conteneur DOM pour le tirage
   * @param {string} language - Code de langue (fr, en, etc.)
   */
  constructor(container, language = 'fr') {
    super('love', container, language);
    
    // Noms localisés
    this.name = {
      'fr': 'Tarot de l\'Amour',
      'en': 'Love Tarot',
      'es': 'Tarot del Amor',
      'de': 'Liebestarot',
      'it': 'Tarocchi dell\'Amore',
      'zh': '爱情塔罗'
    };
    
    // Descriptions localisées
    this.description = {
      'fr': 'Un tirage spécial pour l\'amour et les relations avec 7 cartes disposées en forme de cœur, explorant les sentiments, les désirs et les obstacles.',
      'en': 'A special love and relationship spread with 7 cards arranged in a heart shape, exploring feelings, desires, and obstacles.',
      'es': 'Una tirada especial para el amor y las relaciones con 7 cartas dispuestas en forma de corazón, explorando sentimientos, deseos y obstáculos.',
      'de': 'Eine spezielle Legung für Liebe und Beziehungen mit 7 Karten in Herzform, die Gefühle, Wünsche und Hindernisse erforscht.',
      'it': 'Uno schema speciale per l\'amore e le relazioni con 7 carte disposte a forma di cuore, esplorando sentimenti, desideri e ostacoli.',
      'zh': '一种特殊的爱情和关系牌阵，7张牌呈心形排列，探索感情、欲望和障碍。'
    };
    
    // Définition des positions des cartes (noms uniquement)
    this.cardPositions = [
      { name: 'self', cssName: 'you', position: 1 },         // Soi / Votre cœur
      { name: 'partner', cssName: 'partner', position: 2 },      // Partenaire / Son cœur
      { name: 'relationship', cssName: 'relationship', position: 3 }, // Relation actuelle
      { name: 'obstacles', cssName: 'foundation', position: 4 },    // Obstacles à surmonter
      { name: 'desires', cssName: 'past', position: 5 },      // Désirs secrets
      { name: 'outcome', cssName: 'present', position: 6 },      // Résultat probable
      { name: 'advice', cssName: 'future', position: 7 }        // Conseil final
    ];
    
    // Significations des positions
    this.positionMeanings = {
      'fr': {
        0: 'Votre cœur',
        1: 'Son cœur',
        2: 'Relation actuelle',
        3: 'Obstacles à surmonter',
        4: 'Désirs secrets',
        5: 'Résultat probable',
        6: 'Conseil final'
      },
      'en': {
        0: 'Your heart',
        1: 'Their heart',
        2: 'Current relationship',
        3: 'Obstacles to overcome',
        4: 'Secret desires',
        5: 'Probable outcome',
        6: 'Final advice'
      },
      'es': {
        0: 'Tu corazón',
        1: 'Su corazón',
        2: 'Relación actual',
        3: 'Obstáculos a superar',
        4: 'Deseos secretos',
        5: 'Resultado probable',
        6: 'Consejo final'
      },
      'de': {
        0: 'Dein Herz',
        1: 'Sein/Ihr Herz',
        2: 'Aktuelle Beziehung',
        3: 'Zu überwindende Hindernisse',
        4: 'Geheime Wünsche',
        5: 'Wahrscheinliches Ergebnis',
        6: 'Abschließender Rat'
      },
      'it': {
        0: 'Il tuo cuore',
        1: 'Il suo cuore',
        2: 'Relazione attuale',
        3: 'Ostacoli da superare',
        4: 'Desideri segreti',
        5: 'Risultato probabile',
        6: 'Consiglio finale'
      },
      'zh': {
        0: '你的心',
        1: '他/她的心',
        2: '当前关系',
        3: '需要克服的障碍',
        4: '秘密欲望',
        5: '可能的结果',
        6: '最终建议'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        0: 'Révèle vos vrais sentiments, intentions et émotions concernant cette relation ou personne. Montre votre attitude émotionnelle, vos espoirs et vos craintes cachées, ainsi que vos motivations profondes.',
        1: 'Représente les sentiments, intentions et émotions véritables de l\'autre personne. Offre un aperçu de son état d\'esprit actuel, de ce qu\'elle ressent réellement et de ses attentes dans la relation.',
        2: 'Dépeint l\'état actuel de la relation, sa nature fondamentale et la dynamique entre les deux personnes. Montre l\'énergie dominante qui définit votre connexion en ce moment.',
        3: 'Identifie les défis, tensions ou difficultés qui créent des problèmes dans la relation. Ces obstacles peuvent être externes (circonstances, autres personnes) ou internes (peurs, blessures passées).',
        4: 'Dévoile les désirs cachés, les fantasmes ou les espoirs inavoués concernant cette relation. Peut révéler ce que vous désirez vraiment mais n\'osez peut-être pas exprimer ouvertement.',
        5: 'Indique comment la relation va évoluer dans un avenir proche si la trajectoire actuelle est maintenue. Montre le résultat probable basé sur les énergies actuelles et les choix déjà faits.',
        6: 'Offre une guidance spécifique sur la meilleure façon d\'aborder cette relation pour obtenir le résultat le plus harmonieux. Suggère des actions ou des changements d\'attitude qui favoriseront l\'amour et la compréhension.'
      },
      'en': {
        0: 'Reveals your true feelings, intentions, and emotions regarding this relationship or person. Shows your emotional attitude, hidden hopes and fears, and deeper motivations.',
        1: 'Represents the other person\'s true feelings, intentions, and emotions. Provides insight into their current state of mind, what they truly feel, and their expectations in the relationship.',
        2: 'Depicts the current state of the relationship, its fundamental nature, and the dynamics between the two people. Shows the dominant energy defining your connection right now.',
        3: 'Identifies the challenges, tensions, or difficulties creating problems in the relationship. These obstacles may be external (circumstances, other people) or internal (fears, past wounds).',
        4: 'Unveils hidden desires, fantasies, or unspoken hopes regarding this relationship. May reveal what you truly desire but perhaps dare not express openly.',
        5: 'Indicates how the relationship will evolve in the near future if the current trajectory is maintained. Shows the likely outcome based on current energies and choices already made.',
        6: 'Offers specific guidance on the best way to approach this relationship for the most harmonious outcome. Suggests actions or attitude changes that will foster love and understanding.'
      }
    };
  }
  
  /**
   * Ajoute l'élément visuel du cœur
   */
  addVisualElements() {
    // Le cercle a été supprimé selon la demande du client
    // Pas d'éléments visuels supplémentaires nécessaires
  }
  
  /**
   * Génère une description du tirage de l'amour pour l'interprétation
   * @return {string} Description formatée du tirage
   */
  generateReadingDescription() {
    if (!this.cards || this.cards.length === 0) {
      return '';
    }
    
    let description = `Tirage de l'Amour :\n\n`;
    
    this.cards.forEach((card, index) => {
      const position = this.getPositionMeaning(index);
      const orientation = card.orientation === 'upright' ? 
        (this.language === 'fr' ? 'à l\'endroit' : 'upright') : 
        (this.language === 'fr' ? 'renversée' : 'reversed');
        
      description += `${position}: ${card.name} (${orientation})\n`;
    });
    
    return description;
  }
  
  /**
   * Retourne la description détaillée d'une position
   * @param {number} positionIndex - Indice de la position (0-indexé)
   * @return {string} Description détaillée de la position
   */
  getPositionDescription(positionIndex) {
    // Retourne une chaîne vide pour désactiver l'affichage des descriptions
    return '';
  }

  /**
   * Surcharge la méthode pour utiliser les noms CSS corrects
   * et également les numéros de position pour une standardisation
   * @param {number} positionIndex - Indice de la position
   * @param {Object} positionData - Données de la position
   * @return {string} Nom de classe CSS
   */
  getPositionClassName(positionIndex, positionData) {
    const baseClass = super.getPositionClassName(positionIndex, positionData);
    let additionalClasses = '';
    
    // Ajouter classe basée sur le nom sémantique (pour compatibilité)
    if (positionData.name) {
      additionalClasses += ` ${positionData.name}`;
    }
    
    // Ajouter classe basée sur le numéro de position (nouveau standard)
    if (positionData.position) {
      additionalClasses += ` position-${positionData.position} card-position-${positionData.position}`;
    }
    
    return `${baseClass}${additionalClasses}`;
  }
}

export default LoveSpread; 