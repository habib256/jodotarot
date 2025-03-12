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
    super('celticCross', container, language);
    
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
      { name: 'present', cssName: 'present' },           // Situation actuelle
      { name: 'challenge', cssName: 'challenge' }, // Défi/Obstacle (croisé sur la 1ère)
      { name: 'foundation', cssName: 'foundation' },        // Base/Fondation
      { name: 'past', cssName: 'past' },             // Passé récent
      { name: 'crown', cssName: 'crown' },            // Couronne/Résultat potentiel
      { name: 'future', cssName: 'future' },           // Futur immédiat
      { name: 'self', cssName: 'self' },             // Vous-même
      { name: 'environment', cssName: 'environment' },       // Environnement/Influences extérieures
      { name: 'hopes', cssName: 'hopes' },            // Espoirs/Craintes
      { name: 'outcome', cssName: 'outcome' }           // Résultat final
    ];
    
    // Significations des positions
    this.positionMeanings = {
      'fr': {
        0: 'Situation actuelle',
        1: 'Défi/Obstacle',
        2: 'Base/Fondation',
        3: 'Passé récent',
        4: 'Couronne/Objectif',
        5: 'Futur immédiat',
        6: 'Vous-même',
        7: 'Environnement/Influences',
        8: 'Espoirs/Craintes',
        9: 'Résultat final'
      },
      'en': {
        0: 'Current situation',
        1: 'Challenge/Obstacle',
        2: 'Base/Foundation',
        3: 'Recent past',
        4: 'Crown/Potential outcome',
        5: 'Immediate future',
        6: 'Yourself',
        7: 'Environment/External influences',
        8: 'Hopes/Fears',
        9: 'Final outcome'
      },
      'es': {
        0: 'Situación actual',
        1: 'Desafío/Obstáculo',
        2: 'Base/Fundación',
        3: 'Pasado reciente',
        4: 'Corona/Resultado potencial',
        5: 'Futuro inmediato',
        6: 'Tú mismo',
        7: 'Entorno/Influencias externas',
        8: 'Esperanzas/Temores',
        9: 'Resultado final'
      },
      'de': {
        0: 'Aktuelle Situation',
        1: 'Herausforderung/Hindernis',
        2: 'Basis/Grundlage',
        3: 'Jüngste Vergangenheit',
        4: 'Krone/Potentielles Ergebnis',
        5: 'Unmittelbare Zukunft',
        6: 'Sie selbst',
        7: 'Umgebung/Externe Einflüsse',
        8: 'Hoffnungen/Ängste',
        9: 'Endgültiges Ergebnis'
      },
      'it': {
        0: 'Situazione attuale',
        1: 'Sfida/Ostacolo',
        2: 'Base/Fondamento',
        3: 'Passato recente',
        4: 'Corona/Risultato potenziale',
        5: 'Futuro immediato',
        6: 'Te stesso',
        7: 'Ambiente/Influenze esterne',
        8: 'Speranze/Paure',
        9: 'Risultato finale'
      },
      'zh': {
        0: '当前情况',
        1: '挑战/障碍',
        2: '基础',
        3: '近期过去',
        4: '顶部/潜在结果',
        5: '即将到来的未来',
        6: '你自己',
        7: '环境/外部影响',
        8: '希望/恐惧',
        9: '最终结果'
      }
    };
    
    // Descriptions détaillées des positions avec significations étendues
    this.positionDescriptions = {
      'fr': {
        0: 'Représente la situation actuelle du consultant et les énergies qui entourent la question posée. C\'est le point central du tirage, l\'essence même de la problématique.',
        1: 'Croise la première carte et révèle les obstacles, défis ou forces opposées qui influencent directement la situation. Elle peut aussi montrer des ressources insoupçonnées.',
        2: 'Montre les fondations de la situation, les causes profondes ou les influences subconscientes. Elle révèle ce qui a établi les bases du problème ou de la question.',
        3: 'Indique les événements récents ou les influences qui viennent de passer mais dont l\'effet se fait encore sentir. Elle montre ce qui s\'éloigne.',
        4: 'Suggère les objectifs, espoirs ou résultats potentiels. Représente ce qui pourrait se manifester si la trajectoire actuelle est maintenue - les meilleures possibilités.',
        5: 'Révèle ce qui vient dans un futur proche - les influences, personnes ou événements qui se profilent à l\'horizon et qui vont bientôt entrer en jeu.',
        6: 'Reflète l\'attitude du consultant, son état d\'esprit, ses émotions ou son approche consciente face à la situation. Comment la personne se perçoit ou se comporte.',
        7: 'Montre l\'environnement immédiat, les influences extérieures, l\'opinion des autres ou les facteurs externes qui affectent la situation et sur lesquels le consultant a peu de contrôle.',
        8: 'Dévoile les espoirs secrets et les craintes inconscientes du consultant concernant la situation. Ce qui est profondément désiré ou redouté mais peut-être non exprimé.',
        9: 'Indique le résultat probable si la trajectoire actuelle est maintenue et les leçons à intégrer. La synthèse de toutes les énergies du tirage et leur aboutissement.'
      },
      'en': {
        0: 'Represents the consultant\'s current situation and the energies surrounding the question asked. It is the central point of the reading, the very essence of the issue.',
        1: 'Crosses the first card and reveals obstacles, challenges or opposing forces that directly influence the situation. It can also show unsuspected resources.',
        2: 'Shows the foundations of the situation, the deep causes or subconscious influences. It reveals what has established the basis of the problem or question.',
        3: 'Indicates recent events or influences that have just passed but whose effect is still being felt. It shows what is moving away.',
        4: 'Suggests goals, hopes or potential outcomes. Represents what could manifest if the current trajectory is maintained - the best possibilities.',
        5: 'Reveals what comes in the near future - influences, people or events that are on the horizon and will soon come into play.',
        6: 'Reflects the consultant\'s attitude, state of mind, emotions or conscious approach to the situation. How the person perceives themselves or behaves.',
        7: 'Shows the immediate environment, external influences, the opinion of others or external factors that affect the situation and over which the consultant has little control.',
        8: 'Unveils the consultant\'s secret hopes and unconscious fears regarding the situation. What is deeply desired or dreaded but perhaps unexpressed.',
        9: 'Indicates the likely outcome if the current trajectory is maintained and the lessons to be integrated. The synthesis of all the energies of the draw and their outcome.'
      }
    };
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
  
  /**
   * Génère une description du tirage en croix celtique pour l'interprétation
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
      description += `Tirage en Croix Celtique (${this.cards.length} cartes):\n\n`;
    } else {
      description += `Celtic Cross Spread (${this.cards.length} cards):\n\n`;
    }
    
    // Description générale du tirage
    if (this.language === 'fr') {
      description += `Ce tirage traditionnel de la Croix Celtique est l'un des plus complets et révélateurs du tarot. Sa structure en 10 positions offre une vision détaillée de la situation, des influences passées et futures, ainsi que du résultat potentiel.\n\n`;
    } else {
      description += `This traditional Celtic Cross spread is one of the most comprehensive and revealing in tarot. Its 10-position structure offers a detailed view of the situation, past and future influences, as well as the potential outcome.\n\n`;
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
      
      // Ajouter la description détaillée de la position si demandée
      if (includeDetailedDescriptions) {
        const positionDescription = this.getPositionDescription(i);
        if (positionDescription) {
          description += `   ${positionDescription}\n`;
        }
      }
      
      description += '\n';
    }
    
    return description;
  }
  
  /**
   * Surcharge pour utiliser les noms CSS corrects
   */
  initializeCardPositions() {
    if (!this.container) {
      console.error('Aucun conteneur fourni pour initialiser les positions des cartes');
      return;
    }
    
    this.container.innerHTML = '';
    
    this.cardPositions.forEach((position, index) => {
      const positionElement = document.createElement('div');
      positionElement.className = this.getPositionClassName(index, position) + ' empty';
      positionElement.setAttribute('data-position', index);
      positionElement.setAttribute('data-position-name', this.getPositionMeaning(index));
      
      const positionDescription = this.getPositionDescription(index);
      if (positionDescription) {
        positionElement.setAttribute('data-position-meaning', positionDescription);
      }
      
      positionElement.style.position = 'absolute';
      
      // Utiliser le nom CSS correct pour les variables de position
      if (position.cssName) {
        positionElement.style.left = `var(--${this.key}-${position.cssName}-x)`;
        positionElement.style.top = `var(--${this.key}-${position.cssName}-y)`;
      }
      
      // Appliquer la rotation si spécifiée
      if (position.rotation) {
        positionElement.style.transform = `translate(-50%, -50%) rotate(${position.rotation}deg)`;
      } else {
        positionElement.style.transform = 'translate(-50%, -50%)';
      }
      
      this.container.appendChild(positionElement);
    });
    
    this.addVisualElements();
  }
}

export default CelticCrossSpread; 