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
        1: 'Votre cœur',
        2: 'Son cœur',
        3: 'Relation actuelle',
        4: 'Obstacles à surmonter',
        5: 'Désirs secrets',
        6: 'Résultat probable',
        7: 'Conseil final'
      },
      'en': {
        1: 'Your heart',
        2: 'Their heart',
        3: 'Current relationship',
        4: 'Obstacles to overcome',
        5: 'Secret desires',
        6: 'Probable outcome',
        7: 'Final advice'
      },
      'es': {
        1: 'Tu corazón',
        2: 'Su corazón',
        3: 'Relación actual',
        4: 'Obstáculos a superar',
        5: 'Deseos secretos',
        6: 'Resultado probable',
        7: 'Consejo final'
      },
      'de': {
        1: 'Dein Herz',
        2: 'Sein/Ihr Herz',
        3: 'Aktuelle Beziehung',
        4: 'Zu überwindende Hindernisse',
        5: 'Geheime Wünsche',
        6: 'Wahrscheinliches Ergebnis',
        7: 'Abschließender Rat'
      },
      'it': {
        1: 'Il tuo cuore',
        2: 'Il suo cuore',
        3: 'Relazione attuale',
        4: 'Ostacoli da superare',
        5: 'Desideri segreti',
        6: 'Risultato probabile',
        7: 'Consiglio finale'
      },
      'zh': {
        1: '你的心',
        2: '他/她的心',
        3: '当前关系',
        4: '需要克服的障碍',
        5: '秘密欲望',
        6: '可能的结果',
        7: '最终建议'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        1: 'Révèle vos vrais sentiments, intentions et émotions concernant cette relation ou personne. Montre votre attitude émotionnelle, vos espoirs et vos craintes cachées, ainsi que vos motivations profondes.',
        2: 'Représente les sentiments, intentions et émotions véritables de l\'autre personne. Offre un aperçu de son état d\'esprit actuel, de ce qu\'elle ressent réellement et de ses attentes dans la relation.',
        3: 'Dépeint l\'état actuel de la relation, sa nature fondamentale et la dynamique entre les deux personnes. Montre l\'énergie dominante qui définit votre connexion en ce moment.',
        4: 'Identifie les défis, tensions ou difficultés qui créent des problèmes dans la relation. Ces obstacles peuvent être externes (circonstances, autres personnes) ou internes (peurs, blessures passées).',
        5: 'Dévoile les désirs cachés, les fantasmes ou les espoirs inavoués concernant cette relation. Peut révéler ce que vous désirez vraiment mais n\'osez peut-être pas exprimer ouvertement.',
        6: 'Indique comment la relation va évoluer dans un avenir proche si la trajectoire actuelle est maintenue. Montre le résultat probable basé sur les énergies actuelles et les choix déjà faits.',
        7: 'Offre une guidance spécifique sur la meilleure façon d\'aborder cette relation pour obtenir le résultat le plus harmonieux. Suggère des actions ou des changements d\'attitude qui favoriseront l\'amour et la compréhension.'
      },
      'en': {
        1: 'Reveals your true feelings, intentions, and emotions regarding this relationship or person. Shows your emotional attitude, hidden hopes and fears, and deeper motivations.',
        2: 'Represents the other person\'s true feelings, intentions, and emotions. Provides insight into their current state of mind, what they truly feel, and their expectations in the relationship.',
        3: 'Depicts the current state of the relationship, its fundamental nature, and the dynamics between the two people. Shows the dominant energy defining your connection right now.',
        4: 'Identifies the challenges, tensions, or difficulties creating problems in the relationship. These obstacles may be external (circumstances, other people) or internal (fears, past wounds).',
        5: 'Unveils hidden desires, fantasies, or unspoken hopes regarding this relationship. May reveal what you truly desire but perhaps dare not express openly.',
        6: 'Indicates how the relationship will evolve in the near future if the current trajectory is maintained. Shows the likely outcome based on current energies and choices already made.',
        7: 'Offers specific guidance on the best way to approach this relationship for the most harmonious outcome. Suggests actions or attitude changes that will foster love and understanding.'
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
}

export default LoveSpread; 