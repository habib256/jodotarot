/**
 * Implémentation du tirage en croix
 * Un tirage en 5 cartes disposées en forme de croix
 */
import BaseSpread from './BaseSpread.js';

class CrossSpread extends BaseSpread {
  /**
   * @param {HTMLElement} container - Conteneur DOM pour le tirage
   * @param {string} language - Code de langue (fr, en, etc.)
   */
  constructor(container, language = 'fr') {
    super('cross', container, language);
    
    // Noms localisés
    this.name = {
      'fr': 'Croix',
      'en': 'Cross',
      'es': 'Cruz',
      'de': 'Kreuz',
      'it': 'Croce',
      'zh': '十字'
    };
    
    // Descriptions localisées
    this.description = {
      'fr': 'Un tirage en croix à 5 cartes pour une vision complète de la situation, du problème, de l\'influence du passé, de l\'avenir et du résultat.',
      'en': 'A 5-card cross spread for a complete view of the situation, the problem, past influence, future, and outcome.',
      'es': 'Una tirada en cruz de 5 cartas para una visión completa de la situación, el problema, la influencia del pasado, el futuro y el resultado.',
      'de': 'Eine 5-Karten-Kreuzlegung für einen vollständigen Überblick über die Situation, das Problem, den Einfluss der Vergangenheit, die Zukunft und das Ergebnis.',
      'it': 'Uno schema a croce di 5 carte per una visione completa della situazione, del problema, dell\'influenza del passato, del futuro e del risultato.',
      'zh': '五张牌十字形牌阵，全面了解情况、问题、过去的影响、未来和结果。'
    };
    
    // Définition des positions des cartes (noms sémantiques + numéros)
    this.cardPositions = [
      { name: 'center', cssName: 'center', position: 1 },  // Centre - Situation actuelle
      { name: 'top', cssName: 'top', position: 2 },        // Haut - Ce qui influence
      { name: 'left', cssName: 'left', position: 3 },      // Gauche - Passé
      { name: 'right', cssName: 'right', position: 4 },    // Droite - Futur
      { name: 'bottom', cssName: 'bottom', position: 5 }   // Bas - Résultat
    ];
    
    // Significations des positions
    this.positionMeanings = {
      'fr': {
        1: 'Situation actuelle',
        2: 'Ce qui influence',
        3: 'Passé',
        4: 'Futur',
        5: 'Résultat'
      },
      'en': {
        1: 'Current situation',
        2: 'What influences',
        3: 'Past',
        4: 'Future',
        5: 'Outcome'
      },
      'es': {
        1: 'Situación actual',
        2: 'Lo que influye',
        3: 'Pasado',
        4: 'Futuro',
        5: 'Resultado'
      },
      'de': {
        1: 'Aktuelle Situation',
        2: 'Was beeinflusst',
        3: 'Vergangenheit',
        4: 'Zukunft',
        5: 'Ergebnis'
      },
      'it': {
        1: 'Situazione attuale',
        2: 'Ciò che influenza',
        3: 'Passato',
        4: 'Futuro',
        5: 'Risultato'
      },
      'zh': {
        1: '当前情况',
        2: '影响因素',
        3: '过去',
        4: '未来',
        5: '结果'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        1: 'Représente l\'essence même de la situation ou du problème actuel. C\'est le cœur du tirage, ce qui préoccupe le consultant en ce moment précis.',
        2: 'Montre les forces, les énergies ou les personnes qui influencent directement la situation. Ces influences peuvent être conscientes ou inconscientes, positives ou négatives.',
        3: 'Révèle les événements ou les influences du passé qui ont conduit à la situation actuelle. Indique les causes ou les racines du problème ou de la question.',
        4: 'Indique comment la situation va évoluer dans un avenir proche si la trajectoire actuelle est maintenue. Montre les tendances émergentes et les développements probables.',
        5: 'Représente le résultat final ou la résolution du problème. C\'est la synthèse de toutes les énergies du tirage et la conclusion vers laquelle tout converge.'
      },
      'en': {
        1: 'Represents the very essence of the current situation or problem. It is the heart of the reading, what concerns the consultant at this precise moment.',
        2: 'Shows the forces, energies, or people who directly influence the situation. These influences can be conscious or unconscious, positive or negative.',
        3: 'Reveals past events or influences that led to the current situation. Indicates the causes or roots of the problem or question.',
        4: 'Indicates how the situation will evolve in the near future if the current trajectory is maintained. Shows emerging trends and likely developments.',
        5: 'Represents the final outcome or resolution of the problem. It is the synthesis of all the energies of the reading and the conclusion towards which everything converges.'
      }
    };
  }
  
  /**
   * Ajoute des éléments visuels spécifiques au tirage en croix
   */
  addVisualElements() {
    // Le tirage en croix n'a pas besoin d'éléments visuels supplémentaires
    // Mais on pourrait ajouter des lignes entre les cartes par exemple
  }
}

export default CrossSpread; 