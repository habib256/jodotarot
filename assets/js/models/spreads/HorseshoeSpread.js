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
        1: 'Passé lointain',
        2: 'Passé récent',
        3: 'Présent',
        4: 'Futur proche',
        5: 'Futur lointain / Résultat',
        6: 'Influences extérieures',
        7: 'Conseil'
      },
      'en': {
        1: 'Distant past',
        2: 'Recent past',
        3: 'Present',
        4: 'Near future',
        5: 'Distant future / Outcome',
        6: 'External influences',
        7: 'Advice'
      },
      'es': {
        1: 'Pasado distante',
        2: 'Pasado reciente',
        3: 'Presente',
        4: 'Futuro cercano',
        5: 'Futuro distante / Resultado',
        6: 'Influencias externas',
        7: 'Consejo'
      },
      'de': {
        1: 'Ferne Vergangenheit',
        2: 'Jüngste Vergangenheit',
        3: 'Gegenwart',
        4: 'Nahe Zukunft',
        5: 'Ferne Zukunft / Ergebnis',
        6: 'Externe Einflüsse',
        7: 'Ratschlag'
      },
      'it': {
        1: 'Passato lontano',
        2: 'Passato recente',
        3: 'Presente',
        4: 'Futuro vicino',
        5: 'Futuro lontano / Risultato',
        6: 'Influenze esterne',
        7: 'Consiglio'
      },
      'zh': {
        1: '远古过去',
        2: '近期过去',
        3: '现在',
        4: '不久的将来',
        5: '遥远的未来/结果',
        6: '外部影响',
        7: '建议'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        1: 'Révèle les fondations de la situation, les événements ou influences qui se sont produits il y a longtemps mais qui continuent à façonner les circonstances actuelles. Montre les origines profondes.',
        2: 'Représente les événements récents qui ont directement conduit à la situation présente. Ce sont les causes immédiates ou les déclencheurs de la problématique actuelle.',
        3: 'Montre l\'état actuel de la situation, l\'énergie dominante du moment et les défis immédiats auxquels le consultant est confronté. C\'est le point central du tirage.',
        4: 'Indique les développements qui vont se manifester dans un avenir proche, typiquement dans les semaines à venir. Montre les tendances émergentes et la direction immédiate.',
        5: 'Représente le résultat à long terme ou la destination finale vers laquelle la situation évolue. Révèle comment les choses vont se résoudre si la trajectoire actuelle est maintenue.',
        6: 'Met en lumière les personnes, circonstances ou forces extérieures qui affectent la situation mais sur lesquelles le consultant n\'a que peu ou pas de contrôle direct.',
        7: 'Offre une guidance spirituelle ou pratique sur la meilleure façon d\'aborder la situation. Suggère des actions ou des attitudes spécifiques qui aideront à atteindre un résultat favorable.'
      },
      'en': {
        1: 'Reveals the foundations of the situation, events or influences that occurred long ago but continue to shape current circumstances. Shows the deep origins.',
        2: 'Represents recent events that have directly led to the present situation. These are the immediate causes or triggers of the current issue.',
        3: 'Shows the current state of the situation, the dominant energy of the moment, and the immediate challenges facing the consultant. This is the central point of the reading.',
        4: 'Indicates developments that will manifest in the near future, typically in the coming weeks. Shows emerging trends and immediate direction.',
        5: 'Represents the long-term outcome or final destination toward which the situation is evolving. Reveals how things will resolve if the current trajectory is maintained.',
        6: 'Highlights people, circumstances, or external forces that affect the situation but over which the consultant has little or no direct control.',
        7: 'Offers spiritual or practical guidance on the best way to approach the situation. Suggests specific actions or attitudes that will help achieve a favorable outcome.'
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