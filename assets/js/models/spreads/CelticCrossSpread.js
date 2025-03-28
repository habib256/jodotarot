/**
 * Implémentation du tirage en croix celtique
 * Un tirage en 10 cartes dans une disposition traditionnelle
 */
import BaseSpread from './BaseSpread.js';

class CelticCrossSpread extends BaseSpread {
  /**
   * @param {HTMLElement} container - Conteneur DOM pour le tirage
   * @param {string} language - Code de langue (fr, en, etc.)
   */
  constructor(container, language = 'fr') {
    super('celtic', container, language);
    
    // Noms localisés
    this.name = {
      'fr': 'Croix Celtique',
      'en': 'Celtic Cross',
      'es': 'Cruz Celta',
      'de': 'Keltisches Kreuz',
      'it': 'Croce Celtica',
      'zh': '凯尔特十字'
    };
    
    // Descriptions localisées
    this.description = {
      'fr': 'Le tirage traditionnel de la Croix Celtique à 10 cartes, offrant une lecture complète avec des informations sur la situation, les obstacles, les influences passées et futures.',
      'en': 'The traditional 10-card Celtic Cross spread, offering a comprehensive reading with information on the situation, obstacles, past and future influences.',
      'es': 'La tirada tradicional de la Cruz Celta de 10 cartas, que ofrece una lectura completa con información sobre la situación, los obstáculos, las influencias pasadas y futuras.',
      'de': 'Die traditionelle 10-Karten-Legung des Keltischen Kreuzes, die eine umfassende Deutung mit Informationen über die Situation, Hindernisse, vergangene und zukünftige Einflüsse bietet.',
      'it': 'Lo schema tradizionale della Croce Celtica a 10 carte, che offre una lettura completa con informazioni sulla situazione, gli ostacoli, le influenze passate e future.',
      'zh': '传统的10张牌凯尔特十字牌阵，提供全面解读，包括情况、障碍、过去和未来的影响等信息。'
    };
    
    // Définition des positions des cartes (noms uniquement)
    this.cardPositions = [
      { name: 'present', cssName: 'present', position: 1 },           // Situation actuelle
      { name: 'challenge', cssName: 'challenge', rotation: 90, position: 2 }, // Défi/Obstacle (croisé sur la 1ère)
      { name: 'foundation', cssName: 'foundation', position: 3 },        // Base/Fondation
      { name: 'past', cssName: 'past', position: 4 },             // Passé récent
      { name: 'crown', cssName: 'crown', position: 5 },            // Couronne/Résultat potentiel
      { name: 'future', cssName: 'future', position: 6 },           // Futur immédiat
      { name: 'self', cssName: 'self', position: 7 },             // Vous-même
      { name: 'environment', cssName: 'environment', position: 8 },       // Environnement/Influences extérieures
      { name: 'hopes', cssName: 'hopes', position: 9 },            // Espoirs/Craintes
      { name: 'outcome', cssName: 'outcome', position: 10 }           // Résultat final
    ];
    
    // Significations des positions
    this.positionMeanings = {
      'fr': {
        1: 'Situation actuelle',
        2: 'Défi/Obstacle',
        3: 'Base/Fondation',
        4: 'Passé récent',
        5: 'Couronne/Objectif',
        6: 'Futur immédiat',
        7: 'Vous-même',
        8: 'Environnement/Influences',
        9: 'Espoirs/Craintes',
        10: 'Résultat final'
      },
      'en': {
        1: 'Current situation',
        2: 'Challenge/Obstacle',
        3: 'Base/Foundation',
        4: 'Recent past',
        5: 'Crown/Potential outcome',
        6: 'Immediate future',
        7: 'Yourself',
        8: 'Environment/External influences',
        9: 'Hopes/Fears',
        10: 'Final outcome'
      },
      'es': {
        1: 'Situación actual',
        2: 'Desafío/Obstáculo',
        3: 'Base/Fundación',
        4: 'Pasado reciente',
        5: 'Corona/Resultado potencial',
        6: 'Futuro inmediato',
        7: 'Tú mismo',
        8: 'Entorno/Influencias externas',
        9: 'Esperanzas/Temores',
        10: 'Resultado final'
      },
      'de': {
        1: 'Aktuelle Situation',
        2: 'Herausforderung/Hindernis',
        3: 'Basis/Grundlage',
        4: 'Jüngste Vergangenheit',
        5: 'Krone/Potentielles Ergebnis',
        6: 'Unmittelbare Zukunft',
        7: 'Sie selbst',
        8: 'Umgebung/Externe Einflüsse',
        9: 'Hoffnungen/Ängste',
        10: 'Endgültiges Ergebnis'
      },
      'it': {
        1: 'Situazione attuale',
        2: 'Sfida/Ostacolo',
        3: 'Base/Fondamento',
        4: 'Passato recente',
        5: 'Corona/Risultato potenziale',
        6: 'Futuro immediato',
        7: 'Te stesso',
        8: 'Ambiente/Influenze esterne',
        9: 'Speranze/Paure',
        10: 'Risultato finale'
      },
      'zh': {
        1: '当前情况',
        2: '挑战/障碍',
        3: '基础',
        4: '近期过去',
        5: '顶部/潜在结果',
        6: '即将到来的未来',
        7: '你自己',
        8: '环境/外部影响',
        9: '希望/恐惧',
        10: '最终结果'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        1: 'Représente la situation actuelle du consultant et les énergies qui entourent la question posée. C\'est le point central du tirage, l\'essence même de la problématique.',
        2: 'Croise la première carte et révèle les obstacles, défis ou forces opposées qui influencent directement la situation. Elle peut aussi montrer des ressources insoupçonnées.',
        3: 'Montre les fondations de la situation, les causes profondes ou les influences subconscientes. Elle révèle ce qui a établi les bases du problème ou de la question.',
        4: 'Indique les événements récents ou les influences qui viennent de passer mais dont l\'effet se fait encore sentir. Elle montre ce qui s\'éloigne.',
        5: 'Suggère les objectifs, espoirs ou résultats potentiels. Représente ce qui pourrait se manifester si la trajectoire actuelle est maintenue - les meilleures possibilités.',
        6: 'Révèle ce qui vient dans un futur proche - les influences, personnes ou événements qui se profilent à l\'horizon et qui vont bientôt entrer en jeu.',
        7: 'Reflète l\'attitude du consultant, son état d\'esprit, ses émotions ou son approche consciente face à la situation. Comment la personne se perçoit ou se comporte.',
        8: 'Montre l\'environnement immédiat, les influences extérieures, l\'opinion des autres ou les facteurs externes qui affectent la situation et sur lesquels le consultant a peu de contrôle.',
        9: 'Dévoile les espoirs secrets et les craintes inconscientes du consultant concernant la situation. Ce qui est profondément désiré ou redouté mais peut-être non exprimé.',
        10: 'Indique le résultat probable si la trajectoire actuelle est maintenue et les leçons à intégrer. La synthèse de toutes les énergies du tirage et leur aboutissement.'
      },
      'en': {
        1: 'Represents the consultant\'s current situation and the energies surrounding the question asked. It is the central point of the reading, the very essence of the issue.',
        2: 'Crosses the first card and reveals obstacles, challenges or opposing forces that directly influence the situation. It can also show unsuspected resources.',
        3: 'Shows the foundations of the situation, the deep causes or subconscious influences. It reveals what has established the basis of the problem or question.',
        4: 'Indicates recent events or influences that have just passed but whose effect is still being felt. It shows what is moving away.',
        5: 'Suggests goals, hopes or potential outcomes. Represents what could manifest if the current trajectory is maintained - the best possibilities.',
        6: 'Reveals what comes in the near future - influences, people or events that are on the horizon and will soon come into play.',
        7: 'Reflects the consultant\'s attitude, state of mind, emotions or conscious approach to the situation. How the person perceives themselves or behaves.',
        8: 'Shows the immediate environment, external influences, the opinion of others or external factors that affect the situation and over which the consultant has little control.',
        9: 'Unveils the consultant\'s secret hopes and unconscious fears regarding the situation. What is deeply desired or dreaded but perhaps unexpressed.',
        10: 'Indicates the likely outcome if the current trajectory is maintained and the lessons to be integrated. The synthesis of all the energies of the draw and their outcome.'
      }
    };
  }
  
  /**
   * Ajoute des éléments visuels spécifiques à la croix celtique
   */
  addVisualElements() {
    // Créer et ajouter les lignes de la croix
    const crossLines = document.createElement('div');
    crossLines.className = 'celtic-cross-lines';
    
    // Ligne verticale de la croix
    const verticalLine = document.createElement('div');
    verticalLine.className = 'cross-vertical';
    crossLines.appendChild(verticalLine);
    
    // Ligne horizontale de la croix
    const horizontalLine = document.createElement('div');
    horizontalLine.className = 'cross-horizontal';
    crossLines.appendChild(horizontalLine);
    
    this.container.appendChild(crossLines);
  }
}

export default CelticCrossSpread; 