/**
 * Service pour charger et gérer les différents jeux de cartes
 */
import Deck from '../models/cards/Deck.js';
import { TarotCard, ARCANE_TYPES, MINOR_SUITS, MINOR_RANKS } from '../models/cards/index.js';

class DeckService {
  constructor() {
    this.decks = {}; // Cache des jeux chargés
    this.currentDeckId = null;
    
    // Définition des jeux disponibles
    this.availableDecks = {
      'set01': {
        id: 'set01',
        name: 'Tarot Marseille',
        path: 'assets/images/cards/marseille',
        majorCount: 22,
        minorCount: 56,
        supportsMinor: false // Ce jeu ne supporte que les arcanes majeurs
      },
      'set02': {
        id: 'set02',
        name: 'Tarot Thiago Lehmann',
        path: 'assets/images/cards/lehmann',
        majorCount: 22,
        minorCount: 56,
        supportsMinor: false
      },
      'set03': {
        id: 'set03',
        name: 'Tarot Renaissance',
        path: 'assets/images/cards/renaissance',
        majorCount: 22,
        minorCount: 0,
        supportsMinor: false // Uniquement arcanes majeurs
      }
    };
  }
  
  /**
   * Vérifie si un jeu de cartes est déjà chargé
   * @param {string} deckId - Identifiant du jeu
   * @returns {boolean} True si le jeu est chargé
   */
  isDeckLoaded(deckId) {
    return !!this.decks[deckId];
  }
  
  /**
   * Obtient la liste des jeux disponibles
   * @returns {Array} Liste des jeux disponibles
   */
  getAvailableDecks() {
    return Object.values(this.availableDecks);
  }
  
  /**
   * Charge un jeu de cartes spécifique
   * @param {string} deckId - Identifiant du jeu à charger
   * @returns {Promise<Deck>} Le jeu de cartes chargé
   */
  async loadDeck(deckId) {
    if (this.isDeckLoaded(deckId)) {
      return this.decks[deckId];
    }

    const deckInfo = this.availableDecks[deckId];
    if (!deckInfo) {
      throw new Error(`Jeu de cartes non trouvé: ${deckId}`);
    }

    // Charger les cartes majeures
    const majorCards = await this.fetchMajorCards(deckId);
    
    // Charger les cartes mineures si supportées
    let minorCards = [];
    if (deckInfo.supportsMinor) {
      minorCards = await this.fetchMinorCards(deckId);
    }

    // Créer le jeu complet
    const deck = new Deck(deckId, [...majorCards, ...minorCards]);
    this.decks[deckId] = deck;
    this.currentDeckId = deckId;

    return deck;
  }
  
  /**
   * Charge les arcanes majeurs d'un jeu
   * @param {string} deckId - Identifiant du jeu
   * @returns {Promise<Array>} Liste des cartes majeures
   */
  async fetchMajorCards(deckId) {
    const deckInfo = this.availableDecks[deckId];
    const cards = [];

    // Charger les 22 arcanes majeurs (sans le dos de carte)
    for (let i = 0; i < 22; i++) {
      const cardNumber = i.toString().padStart(2, '0');
      const name = this.getMajorCardName(i);
      const fileName = TarotCard.generateFileName(ARCANE_TYPES.MAJOR, null, cardNumber, name);
      const imagePath = `${deckInfo.path}/${fileName}.${deckId === 'set02' ? 'jpg' : 'png'}`;
      
      const card = new TarotCard(
        `M${cardNumber}`,
        name,
        imagePath,
        ARCANE_TYPES.MAJOR,
        null,
        i
      );
      
      // S'assurer que la carte a tous les attributs nécessaires
      card.orientation = 'upright';
      card.imageUrl = imagePath;
      card.position = 'upright';
      
      cards.push(card);
    }

    // Créer le dos de carte séparément (sera utilisé plus tard pour la sélection)
    const backCard = new TarotCard(
      'M22',
      'Dos de carte',
      `${deckInfo.path}/Dos de carte.${deckId === 'set02' ? 'jpg' : 'png'}`,
      ARCANE_TYPES.MAJOR,
      null,
      22
    );
    
    backCard.orientation = 'upright';
    backCard.imageUrl = backCard.image;
    backCard.position = 'upright';
    backCard.isBackCard = true; // Marquer explicitement que c'est le dos de carte
    
    // Ne pas ajouter le dos de carte au tableau des cartes de tirage
    // Il sera géré séparément pour la future fonctionnalité de sélection

    return cards;
  }
  
  /**
   * Charge les arcanes mineurs d'un jeu
   * @param {string} deckId - Identifiant du jeu
   * @returns {Promise<Array>} Liste des cartes mineures
   */
  async fetchMinorCards(deckId) {
    const deckInfo = this.availableDecks[deckId];
    const cards = [];

    // Charger les 56 arcanes mineurs
    for (const suit of Object.values(MINOR_SUITS)) {
      for (const rank of Object.values(MINOR_RANKS)) {
        const fileName = TarotCard.generateFileName(ARCANE_TYPES.MINOR, suit, rank);
        const imagePath = `${deckInfo.path}/minor/${fileName}.${deckId === 'set02' ? 'jpg' : 'png'}`;
        
        cards.push(new TarotCard(
          TarotCard.generateId(ARCANE_TYPES.MINOR, suit, rank),
          `${rank} of ${suit}`,
          imagePath,
          ARCANE_TYPES.MINOR,
          suit,
          rank
        ));
      }
    }

    return cards;
  }
  
  /**
   * Obtient le nom d'un arcane majeur par son numéro
   * @param {number} number - Numéro de l'arcane
   * @returns {string} Nom de l'arcane
   */
  getMajorCardName(number) {
    const names = {
      0: 'Le fou',
      1: 'Bateleur',
      2: 'Papesse',
      3: 'Imperatrice',
      4: 'Empereur',
      5: 'Pape',
      6: 'Les amoureux',
      7: 'Chariot',
      8: 'Justice',
      9: 'Ermite',
      10: 'La roue',
      11: 'Force',
      12: 'Le pendu',
      13: 'La mort',
      14: 'Temperance',
      15: 'Diable',
      16: 'La Tour',
      17: 'Etoile',
      18: 'La lune',
      19: 'Le soleil',
      20: 'Le jugement',
      21: 'Le monde'
    };
    return names[number] || `Arcane ${number}`;
  }
  
  /**
   * Obtient la liste des jeux disponibles
   * @return {Array} Liste des jeux disponibles
   */
  getAvailableDecks() {
    return Object.values(this.availableDecks);
  }
  
  /**
   * Obtient le jeu de cartes actuellement sélectionné
   * @return {Deck|null} Le jeu de cartes actuel ou null si aucun n'est chargé
   */
  getCurrentDeck() {
    if (!this.currentDeckId) {
      return null;
    }
    return this.decks[this.currentDeckId];
  }
  
  /**
   * Obtient la signification d'un arcane majeur à l'endroit
   * @param {number} cardNumber - Numéro de la carte
   * @return {string} La signification
   */
  getMajorUprightMeaning(cardNumber) {
    const meanings = {
      0: "Liberté, spiritualité, potentiel inexploité",
      1: "Habileté, dextérité, action, créativité",
      2: "Intuition, sagesse intérieure, connaissance secrète",
      3: "Abondance, féminité, créativité, nature",
      4: "Autorité, structure, contrôle, leadership",
      5: "Spiritualité, croyance, tradition, conformité",
      6: "Amour, choix, attraction, équilibre",
      7: "Détermination, contrôle, succès, action",
      8: "Équité, vérité, loi, équilibre",
      9: "Introspection, recherche, solitude, guidance",
      10: "Chance, karma, destin, tournants de vie",
      11: "Courage, persuasion, influence, énergie",
      12: "Sacrifice, perspective, suspension, lâcher-prise",
      13: "Transformation, transition, changement, libération",
      14: "Modération, équilibre, patience, harmonie",
      15: "Ombres, matérialisme, attachements, illusions",
      16: "Bouleversement soudain, chaos, révélation, éveil",
      17: "Espoir, inspiration, renouveau, spiritualité",
      18: "Illusion, peurs, anxiété, confusion",
      19: "Succès, joie, vitalité, confiance",
      20: "Éveil, rénovation, jugement, absolution",
      21: "Accomplissement, intégration, voyage, complétude"
    };
    
    return meanings[cardNumber] || "Signification inconnue";
  }
  
  /**
   * Obtient la signification d'un arcane majeur renversé
   * @param {number} cardNumber - Numéro de la carte
   * @return {string} La signification
   */
  getMajorReversedMeaning(cardNumber) {
    const meanings = {
      0: "Errance, imprudence, risques insensés",
      1: "Manque de confiance, talents inexploités, tromperie",
      2: "Secrets cachés, savoir caché, besoin d'écouter son intuition",
      3: "Dépendance, blocage créatif, problèmes domestiques",
      4: "Domination, rigidité, inflexibilité, contrôle excessif",
      5: "Rébellion, subversion, nouvelles méthodes, non-conventionalité",
      6: "Déséquilibre, discorde, disharmonie, mauvais choix",
      7: "Manque de direction, agression, échec, défaite",
      8: "Injustice, malhonnêteté, manque d'objectivité",
      9: "Isolement, repli sur soi, paranoïa, solitude excessive",
      10: "Revers de fortune, bouleversements, résistance au changement",
      11: "Doute de soi, faiblesse, manque de détermination",
      12: "Résistance, stagnation, indécision, retard",
      13: "Résistance au changement, stagnation, inévitabilité",
      14: "Déséquilibre, excès, auto-restriction, désalignement",
      15: "Libération, indépendance, affronter ses peurs",
      16: "Éviter le désastre, retarder l'inévitable, résistance au changement",
      17: "Désespoir, pessimisme, manque de foi, découragement",
      18: "Confusion, peur, malentendus, méconnaissance",
      19: "Blocage, dépression, malentendus, égocentrisme",
      20: "Doute de soi, auto-critique, peur du changement",
      21: "Incomplet, stagnation, manque d'accomplissement, voyage déséquilibré"
    };
    
    return meanings[cardNumber] || "Signification inconnue";
  }
  
  /**
   * Obtient la signification d'un arcane mineur à l'endroit
   * @param {string} suit - Couleur de la carte
   * @param {number} number - Numéro de la carte
   * @return {string} La signification
   */
  getMinorUprightMeaning(suit, number) {
    // Significations simplifiées pour l'exemple
    const baseMeanings = {
      cups: {
        1: "Créativité, intuition, développement émotionnel",
        2: "Union, attraction, rapport, considération",
        3: "Célébration, amitié, collaboration, communauté",
        4: "Méditation, contemplation, apathie, réévaluation",
        5: "Regret, déception, désenchantement, chagrin",
        6: "Souvenirs, nostalgie, bonheur, bienveillance",
        7: "Fantasmer, illusion, enchantement, espoirs",
        8: "Désertion, retrait, fuite, fatalité",
        9: "Contentement, satisfaction physique, bien-être",
        10: "Bonheur harmonieux, alignement, accomplissement",
        11: "Créativité en effervescence, intelligence, intuition",
        12: "Engagement, intensité, ténacité",
        13: "Compassion, calme, amour",
        14: "Stabilité émotionnelle, contrôle, compassion"
      },
      pentacles: {
        1: "Opportunité, prospérité, nouveaux revenus",
        2: "Équilibre, adaptation, ajustement, équilibre travail-vie",
        3: "Travail d'équipe, collaboration, accomplissement",
        4: "Sécurité, stabilité, conservation, avidité",
        5: "Difficultés, adversité, pauvreté, perte, isolement",
        6: "Générosité, charité, donner, prospérité",
        7: "Récompense, persévérance, persistance, entretien",
        8: "Diligence, savoir-faire, apprentissage, compétences",
        9: "Luxe, indépendance, autosuffisance, abondance",
        10: "Richesse, prospérité, sécurité, héritage",
        11: "Opportunité, potentiel, nouvelles compétences",
        12: "Fiabilité, efficacité, productivité",
        13: "Abondance, partage, hospitalité, ravissement",
        14: "Richesse, sécurité, business, leadership"
      },
      swords: {
        1: "Clarté, force mentale, vérité, triomphe",
        2: "Décision, indécision, stalemate, choix",
        3: "Chagrin, récupération, expression, lâcher-prise",
        4: "Contemplation, récupération, passivité, repos",
        5: "Conflit, désaccord, compétition, défaite",
        6: "Transition, laisser aller, partir, voyage",
        7: "Tricherie, tactiques, stratégie, prudence",
        8: "Restriction, limitation, emprisonnement, isolement",
        9: "Anxiété, peur, inquiétude, confusion",
        10: "Défaite, douleur, trahison, crise",
        11: "Intelligence, esprit, communication, désillusion",
        12: "Action, impulsivité, défensivité",
        13: "Clarté, intelligence, grâce, connaissance",
        14: "Clarté, autorité, pouvoir, vérité"
      },
      wands: {
        1: "Inspiration, création, pouvoir, potentiel",
        2: "Planification, organisation, progression, décision",
        3: "Prévoyance, entreprise, exploration, anticipation",
        4: "Célébration, harmonie, communauté, achèvement",
        5: "Conflit, discorde, compétition, tension",
        6: "Victoire, succès, progrès, ascension",
        7: "Défense, persévérance, maintien, courage",
        8: "Action, mouvement, progrès, rapidité",
        9: "Résilience, courage, persévérance, test",
        10: "Oppression, restriction, lourdeur, épuisement",
        11: "Créativité, confiance, avantage, spéculation",
        12: "Passion, révélation, aventure",
        13: "Clarté, vitalité, motivation, inspiration",
        14: "Vision, leadership, honneur, notoriété"
      }
    };
    
    return baseMeanings[suit]?.[number] || "Signification inconnue";
  }
  
  /**
   * Obtient la signification d'un arcane mineur renversé
   * @param {string} suit - Couleur de la carte
   * @param {number} number - Numéro de la carte
   * @return {string} La signification
   */
  getMinorReversedMeaning(suit, number) {
    // Significations simplifiées pour l'exemple
    const baseMeanings = {
      cups: {
        1: "Blocage émotionnel, créativité bloquée, intuition faible",
        2: "Disharmonie, déséquilibre, alignement perdu",
        3: "Surindulgence, dispersement, excès, déception",
        4: "Ennui, stagnation, insatisfaction, apathie",
        5: "Acceptation, pardon, avancer, apprendre",
        6: "S'accrocher au passé, avancer, amélioration, perfectionnisme",
        7: "Clarté, direction, changement d'attention",
        8: "Stagnation, acceptation, progression",
        9: "Satisfaction matérielle, luxe, recherche du bonheur",
        10: "Discorde, disharmonie, perturbation, conflit",
        11: "Créativité bloquée, sensibilité, insécurité",
        12: "Indécision, apathie, dépression",
        13: "Martyre, intransigeance, négativité",
        14: "Contrôle, émotionnalité, blocage, manipulation"
      },
      pentacles: {
        1: "Opportunité perdue, récompense retardée, manque de planification",
        2: "Déséquilibre, encombrement, perte de priorisation",
        3: "Manque de collaboration, désorganisation, mésentente",
        4: "Avidité, stagnation, blocage, passivité",
        5: "Récupération, croissance, changement de situation",
        6: "Égoïsme, autodestruction, charité mal orientée",
        7: "Procastination, manque de récompense, impatience",
        8: "Manque d'intérêt, inexpérience, oisiveté",
        9: "Retard financier, imperfection, indépendance",
        10: "Perte financière, problèmes familiaux, désorganisation",
        11: "Opportunités manquées, immaturité, indiscipline",
        12: "Paresse, inutilité, improductivité",
        13: "Stérilité, insécurité, codépendance",
        14: "Corruption, sécurité excessive, contrôle excessif"
      },
      swords: {
        1: "Pensée confuse, perte de force, chaos, destruction",
        2: "Indécision, confusion, information, pression",
        3: "Récupération, pardon, avancer",
        4: "Redémarrage, activité, vigilance, changement",
        5: "Réconciliation, médiation, détente",
        6: "Retards, résistance, persistance",
        7: "Prudence, conscience, préparation",
        8: "Libération, nouvelle perspective, changement",
        9: "Doute, peur, anxiété, liberté",
        10: "Récupération, rétablissement, renaissance",
        11: "Cruauté, abus, manipulation, vengeance",
        12: "Manque de direction, inconstance, confusion",
        13: "Manipulation, intelligence mal dirigée, dureté",
        14: "Tyrannie, manipulation, mauvaise communication"
      },
      wands: {
        1: "Manque d'énergie, manque d'inspiration, distraction",
        2: "Indécision, manque de planification, distraction",
        3: "Délais, frustration, obstacles, stagnation",
        4: "Insécurité, crise de croissance, manque d'harmonie",
        5: "Résolution, paix, fin du conflit, acceptation",
        6: "Retard, échec, mauvais alignement",
        7: "Cession, peur, capitulation, intimidation",
        8: "Distractions, dispersion, manque de cohérence",
        9: "Faiblesse, retards, lâcheté, récupération",
        10: "Libération, rester fort, persévérance",
        11: "Procrastination, manque de confiance, hésitation",
        12: "Impulsivité, témérité, irrationalité",
        13: "Rigidité, échec créatif, cruauté",
        14: "Impulsivité, intolérance, domination"
      }
    };
    
    return baseMeanings[suit]?.[number] || "Signification inconnue";
  }
}

export default DeckService; 