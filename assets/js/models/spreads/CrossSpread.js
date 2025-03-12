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
        0: 'Situation actuelle',
        1: 'Ce qui influence',
        2: 'Passé',
        3: 'Futur',
        4: 'Résultat'
      },
      'en': {
        0: 'Current situation',
        1: 'What influences',
        2: 'Past',
        3: 'Future',
        4: 'Outcome'
      },
      'es': {
        0: 'Situación actual',
        1: 'Lo que influye',
        2: 'Pasado',
        3: 'Futuro',
        4: 'Resultado'
      },
      'de': {
        0: 'Aktuelle Situation',
        1: 'Was beeinflusst',
        2: 'Vergangenheit',
        3: 'Zukunft',
        4: 'Ergebnis'
      },
      'it': {
        0: 'Situazione attuale',
        1: 'Ciò che influenza',
        2: 'Passato',
        3: 'Futuro',
        4: 'Risultato'
      },
      'zh': {
        0: '当前情况',
        1: '影响因素',
        2: '过去',
        3: '未来',
        4: '结果'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        0: 'Représente l\'essence même de la situation ou du problème actuel. C\'est le cœur du tirage, ce qui préoccupe le consultant en ce moment précis.',
        1: 'Montre les forces, les énergies ou les personnes qui influencent directement la situation. Ces influences peuvent être conscientes ou inconscientes, positives ou négatives.',
        2: 'Révèle les événements ou les influences du passé qui ont conduit à la situation actuelle. Indique les causes ou les racines du problème ou de la question.',
        3: 'Indique comment la situation va évoluer dans un avenir proche si la trajectoire actuelle est maintenue. Montre les tendances émergentes et les développements probables.',
        4: 'Représente le résultat final ou la résolution du problème. C\'est la synthèse de toutes les énergies du tirage et la conclusion vers laquelle tout converge.'
      },
      'en': {
        0: 'Represents the very essence of the current situation or problem. It is the heart of the reading, what concerns the consultant at this precise moment.',
        1: 'Shows the forces, energies, or people who directly influence the situation. These influences can be conscious or unconscious, positive or negative.',
        2: 'Reveals past events or influences that led to the current situation. Indicates the causes or roots of the problem or question.',
        3: 'Indicates how the situation will evolve in the near future if the current trajectory is maintained. Shows emerging trends and likely developments.',
        4: 'Represents the final outcome or resolution of the problem. It is the synthesis of all the energies of the reading and the conclusion towards which everything converges.'
      }
    };
  }
  
  /**
   * Surcharge la méthode pour utiliser les noms spécifiques (center, top, etc.)
   * et également les numéros de position pour une standardisation
   * @param {number} positionIndex - Indice de la position
   * @param {Object} positionData - Données de la position
   * @return {string} Nom de classe CSS
   */
  getPositionClassName(positionIndex, positionData) {
    // Assurer que la classe card-position est toujours incluse, puis ajouter le nom spécifique comme classe additionnelle
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
   * Ajoute des éléments visuels spécifiques au tirage en croix
   * Peut être utilisé pour ajouter des lignes de connexion ou d'autres décorations
   */
  addVisualElements() {
    // Le tirage en croix n'a pas besoin d'éléments visuels supplémentaires
    // Mais on pourrait ajouter des lignes entre les cartes par exemple
  }
}

export default CrossSpread; 