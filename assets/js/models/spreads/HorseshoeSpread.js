/**
 * Implémentation du tirage en fer à cheval
 * Un tirage en 7 cartes disposées en forme de fer à cheval
 */
import BaseSpread from './BaseSpread.js';

class HorseshoeSpread extends BaseSpread {
  /**
   * @param {HTMLElement} container - Conteneur DOM pour le tirage
   * @param {string} language - Code de langue (fr, en, etc.)
   */
  constructor(container, language = 'fr') {
    super('horseshoe', container, language);
    
    // Noms localisés
    this.name = {
      'fr': 'Fer à Cheval',
      'en': 'Horseshoe',
      'es': 'Herradura',
      'de': 'Hufeisen',
      'it': 'Ferro di Cavallo',
      'zh': '马蹄形'
    };
    
    // Descriptions localisées
    this.description = {
      'fr': 'Un tirage en fer à cheval à 7 cartes, idéal pour explorer le passé, le présent et le futur d\'une situation, avec des éléments sur les influences et les obstacles.',
      'en': 'A 7-card horseshoe spread, ideal for exploring the past, present, and future of a situation, with elements on influences and obstacles.',
      'es': 'Una tirada en herradura de 7 cartas, ideal para explorar el pasado, presente y futuro de una situación, con elementos sobre influencias y obstáculos.',
      'de': 'Eine 7-Karten-Hufeisen-Legung, ideal um Vergangenheit, Gegenwart und Zukunft einer Situation zu erforschen, mit Elementen zu Einflüssen und Hindernissen.',
      'it': 'Uno schema a ferro di cavallo di 7 carte, ideale per esplorare il passato, il presente e il futuro di una situazione, con elementi su influenze e ostacoli.',
      'zh': '七张牌的马蹄形牌阵，非常适合探索一种情况的过去、现在和未来，包含有关影响和障碍的元素。'
    };
    
    // Définition des positions des cartes (noms uniquement)
    this.cardPositions = [
      { name: 'past', cssName: 'past', position: 1 },      // Passé
      { name: 'recent', cssName: 'recent', position: 2 },    // Passé récent
      { name: 'present', cssName: 'present', position: 3 },   // Présent
      { name: 'future', cssName: 'future', position: 4 },    // Futur proche
      { name: 'outcome', cssName: 'outcome', position: 5 },   // Résultat
      { name: 'influences', cssName: 'influences', position: 6 },// Influences
      { name: 'advice', cssName: 'advice', position: 7 }     // Conseil
    ];
    
    // Significations des positions
    this.positionMeanings = {
      'fr': {
        0: 'Passé lointain',
        1: 'Passé récent',
        2: 'Présent',
        3: 'Futur proche',
        4: 'Futur lointain / Résultat',
        5: 'Influences extérieures',
        6: 'Conseil'
      },
      'en': {
        0: 'Distant past',
        1: 'Recent past',
        2: 'Present',
        3: 'Near future',
        4: 'Distant future / Outcome',
        5: 'External influences',
        6: 'Advice'
      },
      'es': {
        0: 'Pasado distante',
        1: 'Pasado reciente',
        2: 'Presente',
        3: 'Futuro cercano',
        4: 'Futuro distante / Resultado',
        5: 'Influencias externas',
        6: 'Consejo'
      },
      'de': {
        0: 'Ferne Vergangenheit',
        1: 'Jüngste Vergangenheit',
        2: 'Gegenwart',
        3: 'Nahe Zukunft',
        4: 'Ferne Zukunft / Ergebnis',
        5: 'Externe Einflüsse',
        6: 'Ratschlag'
      },
      'it': {
        0: 'Passato lontano',
        1: 'Passato recente',
        2: 'Presente',
        3: 'Futuro vicino',
        4: 'Futuro lontano / Risultato',
        5: 'Influenze esterne',
        6: 'Consiglio'
      },
      'zh': {
        0: '远古过去',
        1: '近期过去',
        2: '现在',
        3: '不久的将来',
        4: '遥远的未来/结果',
        5: '外部影响',
        6: '建议'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        0: 'Révèle les fondations de la situation, les événements ou influences qui se sont produits il y a longtemps mais qui continuent à façonner les circonstances actuelles. Montre les origines profondes.',
        1: 'Représente les événements récents qui ont directement conduit à la situation présente. Ce sont les causes immédiates ou les déclencheurs de la problématique actuelle.',
        2: 'Montre l\'état actuel de la situation, l\'énergie dominante du moment et les défis immédiats auxquels le consultant est confronté. C\'est le point central du tirage.',
        3: 'Indique les développements qui vont se manifester dans un avenir proche, typiquement dans les semaines à venir. Montre les tendances émergentes et la direction immédiate.',
        4: 'Représente le résultat à long terme ou la destination finale vers laquelle la situation évolue. Révèle comment les choses vont se résoudre si la trajectoire actuelle est maintenue.',
        5: 'Met en lumière les personnes, circonstances ou forces extérieures qui affectent la situation mais sur lesquelles le consultant n\'a que peu ou pas de contrôle direct.',
        6: 'Offre une guidance spirituelle ou pratique sur la meilleure façon d\'aborder la situation. Suggère des actions ou des attitudes spécifiques qui aideront à atteindre un résultat favorable.'
      },
      'en': {
        0: 'Reveals the foundations of the situation, events or influences that occurred long ago but continue to shape current circumstances. Shows the deep origins.',
        1: 'Represents recent events that have directly led to the present situation. These are the immediate causes or triggers of the current issue.',
        2: 'Shows the current state of the situation, the dominant energy of the moment, and the immediate challenges facing the consultant. This is the central point of the reading.',
        3: 'Indicates developments that will manifest in the near future, typically in the coming weeks. Shows emerging trends and immediate direction.',
        4: 'Represents the long-term outcome or final destination toward which the situation is evolving. Reveals how things will resolve if the current trajectory is maintained.',
        5: 'Highlights people, circumstances, or external forces that affect the situation but over which the consultant has little or no direct control.',
        6: 'Offers spiritual or practical guidance on the best way to approach the situation. Suggests specific actions or attitudes that will help achieve a favorable outcome.'
      }
    };
  }
  
  /**
   * Ajoute l'élément visuel du fer à cheval
   */
  addVisualElements() {
    // Ajouter l'élément visuel du fer à cheval
    const horseshoeShape = document.createElement('div');
    horseshoeShape.className = 'horseshoe-shape';
    this.container.appendChild(horseshoeShape);
  }
}

export default HorseshoeSpread; 