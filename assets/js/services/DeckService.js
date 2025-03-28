/**
 * Service pour charger et gérer les différents jeux de cartes
 */
import Deck from '../models/cards/Deck.js';
import { TarotCard, ARCANE_TYPES, MINOR_SUITS, MINOR_RANKS } from '../models/cards/index.js';
import { getTranslation } from '../translations/index.js';

class DeckService {
  constructor() {
    this.decks = {}; // Cache des jeux chargés
    this.currentDeckId = null;
    
    // Définition des jeux disponibles
    this.availableDecks = {
      'set01': {
        id: 'set01',
        name: 'Marseille',
        path: 'assets/images/cards/marseille',
        majorCount: 22,
        minorCount: 56,
        supportsMinor: false
      },
      'set02': {
        id: 'set02',
        name: 'Lehmann',
        path: 'assets/images/cards/lehmann',
        majorCount: 22,
        minorCount: 56,
        supportsMinor: false
      },
      'set03': {
        id: 'set03',
        name: 'Renaissance',
        path: 'assets/images/cards/renaissance',
        majorCount: 22,
        minorCount: 0,
        supportsMinor: false
      },
      'set04': {
        id: 'set04',
        name: 'Rick & Morty',
        path: 'assets/images/cards/rick&morty',
        majorCount: 16,
        minorCount: 0,
        supportsMinor: false
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
    console.log(`🔄 Début du chargement du jeu ${deckId}`);
    
    if (this.isDeckLoaded(deckId)) {
      return this.decks[deckId];
    }

    const deckInfo = this.availableDecks[deckId];
    if (!deckInfo) {
      console.error(`❌ Jeu ${deckId} non trouvé dans les jeux disponibles`);
      throw new Error(`Jeu ${deckId} non trouvé`);
    }

    console.log(`📊 Informations sur le jeu ${deckId}:`, deckInfo);

    try {
      // Charger les cartes majeures
      const majorCards = await this.fetchMajorCards(deckId);
      console.log(`🎴 Cartes majeures chargées pour ${deckId}:`, majorCards);
      
      // Créer le jeu
      const deck = new Deck(deckId, majorCards);
      this.decks[deckId] = deck;
      this.currentDeckId = deckId;

      // Vérifier que toutes les images sont accessibles
      console.log(`🔍 Vérification des images pour le jeu ${deckId}...`);
      for (const card of majorCards) {
        try {
          console.log(`🖼️ Tentative de chargement de l'image: ${card.image}`);
          const response = await fetch(card.image);
          if (!response.ok) {
            throw new Error(`Image non trouvée: ${card.image}`);
          }
          console.log(`✅ Image chargée avec succès: ${card.image}`);
        } catch (error) {
          console.error(`❌ Erreur lors du chargement de l'image ${card.image}:`, error);
          throw new Error(`Impossible de charger l'image de la carte ${card.name}`);
        }
      }

      console.log(`✅ Jeu ${deckId} chargé avec succès`);
      return deck;
    } catch (error) {
      console.error(`❌ Erreur lors du chargement du jeu ${deckId}:`, error);
      throw new Error(`Échec du chargement du jeu ${deckId}: ${error.message}`);
    }
  }
  
  /**
   * Récupère les cartes majeures pour un jeu donné
   * @param {string} deckId - L'identifiant du jeu
   * @returns {Promise<TarotCard[]>} Les cartes majeures
   */
  async fetchMajorCards(deckId) {
    const game = this.availableDecks[deckId];
    if (!game) {
      throw new Error(`Jeu non trouvé: ${deckId}`);
    }

    const cards = [];
    for (let i = 0; i < game.majorCount; i++) {
      const fileName = this.generateFileName(deckId, i);
      const imagePath = `${game.path}/${fileName}`;
      const card = new TarotCard(
        `M${String(i).padStart(2, '0')}`,
        this.getMajorCardName(i, deckId),
        imagePath
      );
      cards.push(card);
    }

    // Ajouter le dos de carte
    const backFileName = this.generateFileName(deckId, game.majorCount);
    const backImagePath = `${game.path}/${backFileName}`;
    const backCard = new TarotCard(
      `M${String(game.majorCount).padStart(2, '0')}`,
      'back',
      backImagePath
    );
    cards.push(backCard);

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
   * @param {string} deckId - Identifiant du jeu
   * @returns {string} Nom de l'arcane
   */
  getMajorCardName(number, deckId) {
    const deckInfo = this.availableDecks[deckId];
    if (!deckInfo) {
      throw new Error(`Jeu non trouvé: ${deckId}`);
    }

    // Mapping des noms de fichiers pour chaque jeu
    const cardNames = {
      'set01': { // Marseille
        0: 'Le_fou',
        1: 'Bateleur',
        2: 'Papesse',
        3: 'Imperatrice',
        4: 'Empereur',
        5: 'Pape',
        6: 'Les_amoureux',
        7: 'Chariot',
        8: 'Justice',
        9: 'Ermite',
        10: 'La_roue',
        11: 'Force',
        12: 'Le_pendu',
        13: 'La_mort',
        14: 'Temperance',
        15: 'Diable',
        16: 'La_Tour',
        17: 'Etoile',
        18: 'La_lune',
        19: 'Le_soleil',
        20: 'Le_jugement',
        21: 'Le_monde',
        22: 'Dos_de_carte'
      },
      'set02': { // Lehmann
        0: 'Le_fou',
        1: 'Bateleur',
        2: 'Papesse',
        3: 'Imperatrice',
        4: 'Empereur',
        5: 'Pape',
        6: 'Les_amoureux',
        7: 'Chariot',
        8: 'Justice',
        9: 'Ermite',
        10: 'La_roue',
        11: 'Force',
        12: 'Le_pendu',
        13: 'La_mort',
        14: 'Temperance',
        15: 'Diable',
        16: 'La_Tour',
        17: 'Etoile',
        18: 'La_lune',
        19: 'Le_soleil',
        20: 'Le_jugement',
        21: 'Le_monde',
        22: 'Dos_de_carte'
      },
      'set03': { // Renaissance
        0: 'Le_fou',
        1: 'Bateleur',
        2: 'Papesse',
        3: 'Imperatrice',
        4: 'Empereur',
        5: 'Pape',
        6: 'Les_amoureux',
        7: 'Chariot',
        8: 'Justice',
        9: 'Ermite',
        10: 'La_roue',
        11: 'Force',
        12: 'Le_pendu',
        13: 'La_mort',
        14: 'Temperance',
        15: 'Diable',
        16: 'La_Tour',
        17: 'Etoile',
        18: 'La_lune',
        19: 'Le_soleil',
        20: 'Le_jugement',
        21: 'Le_monde',
        22: 'Dos_de_carte'
      },
      'set04': { // Rick & Morty
        0: 'Le_fou',
        1: 'Bateleur',
        2: 'Papesse',
        3: 'Imperatrice',
        4: 'Empereur',
        5: 'Pape',
        6: 'Les_amoureux',
        7: 'Chariot',
        8: 'Justice',
        9: 'Ermite',
        10: 'La_roue',
        11: 'Force',
        12: 'Le_pendu',
        13: 'La_mort',
        14: 'Temperance',
        15: 'Diable',
        16: 'La_Tour'
      }
    };

    return cardNames[deckId]?.[number] || `arcane_${number}`;
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

  /**
   * Génère le nom de fichier pour une carte
   * @param {string} deckId - Identifiant du jeu
   * @param {number} index - Index de la carte
   * @returns {string} Nom du fichier
   */
  generateFileName(deckId, index) {
    const deckInfo = this.availableDecks[deckId];
    if (!deckInfo) {
      throw new Error(`Jeu non trouvé: ${deckId}`);
    }

    const extension = deckId === 'set02' ? 'jpg' : 'png';
    const paddedIndex = String(index).padStart(2, '0');
    const fileName = `${paddedIndex}_${this.getMajorCardName(index, deckId)}.${extension}`;
    
    console.log(`📄 Nom de fichier généré pour ${deckId}: ${fileName}`);
    return fileName;
  }
}

export default DeckService; 