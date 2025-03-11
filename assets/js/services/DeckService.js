/**
 * Service pour charger et gérer les différents jeux de cartes
 */
import Deck from '../models/cards/Deck.js';

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
        minorCount: 56
      },
      'set02': {
        id: 'set02',
        name: 'Tarot Thiago Lehmann',
        path: 'assets/images/cards/lehmann',
        majorCount: 22,
        minorCount: 56
      }
    };
  }
  
  /**
   * Vérifie si un jeu spécifique est déjà chargé
   * @param {string} deckId - Identifiant du jeu à vérifier
   * @return {boolean} true si le jeu est chargé, false sinon
   */
  isDeckLoaded(deckId) {
    return !!this.decks[deckId];
  }
  
  /**
   * Obtient la liste des jeux disponibles
   * @return {Array} Liste des jeux disponibles
   */
  getAvailableDecks() {
    return Object.values(this.availableDecks);
  }
  
  /**
   * Charge un jeu de cartes spécifique
   * @param {string} deckId - Identifiant du jeu à charger
   * @return {Promise<Deck>} Le jeu de cartes chargé
   */
  async loadDeck(deckId) {
    // Vérifier si le jeu est déjà chargé
    if (this.decks[deckId]) {
      this.currentDeckId = deckId;
      return this.decks[deckId];
    }
    
    // Vérifier si le jeu est disponible
    const deckInfo = this.availableDecks[deckId];
    if (!deckInfo) {
      throw new Error(`Jeu de cartes non disponible: ${deckId}`);
    }
    
    try {
      // Charger les données des cartes
      const cards = await this.fetchDeckData(deckInfo);
      
      // Créer et mettre en cache le jeu
      const deck = new Deck(deckId, cards);
      this.decks[deckId] = deck;
      this.currentDeckId = deckId;
      
      return deck;
    } catch (error) {
      console.error(`Erreur lors du chargement du jeu ${deckId}:`, error);
      throw error;
    }
  }
  
  /**
   * Récupère les données d'un jeu de cartes
   * @param {Object} deckInfo - Informations sur le jeu à charger
   * @return {Promise<Array>} Les cartes du jeu
   */
  async fetchDeckData(deckInfo) {
    console.log(`📥 Chargement du jeu de cartes: ${deckInfo.id}`);
    
    const { id, path, majorCount, minorCount } = deckInfo;
    
    // Créer les arcanes majeurs
    const majorArcana = Array.from({ length: majorCount }, (_, i) => {
      const cardNumber = i;
      let cardName;
      
      // Nommer les arcanes majeurs
      switch (cardNumber) {
        case 0: cardName = "Le Mat"; break;
        case 1: cardName = "Le Bateleur"; break;
        case 2: cardName = "La Papesse"; break;
        case 3: cardName = "L'Impératrice"; break;
        case 4: cardName = "L'Empereur"; break;
        case 5: cardName = "Le Pape"; break;
        case 6: cardName = "L'Amoureux"; break;
        case 7: cardName = "Le Chariot"; break;
        case 8: cardName = "La Justice"; break;
        case 9: cardName = "L'Ermite"; break;
        case 10: cardName = "La Roue de Fortune"; break;
        case 11: cardName = "La Force"; break;
        case 12: cardName = "Le Pendu"; break;
        case 13: cardName = "La Mort"; break;
        case 14: cardName = "Tempérance"; break;
        case 15: cardName = "Le Diable"; break;
        case 16: cardName = "La Maison Dieu"; break;
        case 17: cardName = "L'Étoile"; break;
        case 18: cardName = "La Lune"; break;
        case 19: cardName = "Le Soleil"; break;
        case 20: cardName = "Le Jugement"; break;
        case 21: cardName = "Le Monde"; break;
        default: cardName = `Arcane Majeur ${cardNumber}`;
      }
      
      // Pour le nom de fichier, utiliser le format existant
      const paddedNumber = cardNumber.toString().padStart(2, '0');
      
      // Construction du nom de fichier selon le format correct pour chaque jeu
      let fileName;
      if (id === 'set01') {
        // Jeu Marseille - Noms corrigés selon les fichiers réels
        const fileNameMap = {
          "00": "00 Le fou.png",
          "01": "01 Bateleur.png",
          "02": "02 Papesse.png",
          "03": "03 Imperatrice.png",
          "04": "04 Empereur.png",
          "05": "05 Pape.png",
          "06": "06 Les amoureux.png",
          "07": "07 Chariot.png",
          "08": "08 Justice.png",
          "09": "09 Ermite.png",
          "10": "10 La roue.png",
          "11": "11 Force.png",
          "12": "12 Le pendu.png",
          "13": "13 La mort.png",
          "14": "14 Temperance.png",
          "15": "15 Diable.png",
          "16": "16 La Tour.png",
          "17": "17 Etoile.png",
          "18": "18 La lune.png",
          "19": "19 Le soleil.png",
          "20": "20 Le jugement.png",
          "21": "21 Le monde.png"
        };
        fileName = fileNameMap[paddedNumber] || `${paddedNumber}.png`;
      } else {
        // Jeu Lehmann
        const fileNameMap = {
          "00": "00 Le fou.jpg",
          "01": "01 Bateleur.jpg",
          "02": "02 Papesse.jpg",
          "03": "03 Imperatrice.jpg",
          "04": "04 Empereur.jpg",
          "05": "05 Pape.jpg",
          "06": "06 Les amoureux.jpg",
          "07": "07 Chariot.jpg",
          "08": "08 Justice.jpg",
          "09": "09 Ermite.jpg",
          "10": "10 La roue.jpg",
          "11": "11 Force.jpg",
          "12": "12 Le pendu.jpg",
          "13": "13 La mort.jpg",
          "14": "14 Temperance.jpg",
          "15": "15 Diable.jpg",
          "16": "16 La Tour.jpg",
          "17": "17 Etoile.jpg",
          "18": "18 La lune.jpg",
          "19": "19 Le soleil.jpg",
          "20": "20 Le jugement.jpg",
          "21": "21 Le monde.jpg"
        };
        fileName = fileNameMap[paddedNumber] || `${paddedNumber}.jpg`;
      }
      
      // Chemin complet de l'image
      const imageUrl = `${path}/${fileName}`;
      
      return {
        id: `major_${cardNumber}`,
        number: cardNumber,
        name: cardName,
        arcana: 'major',
        type: 'major',
        imageUrl: imageUrl,
        backImageUrl: id === 'set01' ? `${path}/22 Dos de carte.png` : `${path}/22 Dos de carte.jpg`,
        orientation: 'upright', // Orientation par défaut
        meanings: {
          upright: this.getMajorUprightMeaning(cardNumber),
          reversed: this.getMajorReversedMeaning(cardNumber)
        }
      };
    });
    
    console.log(`✅ ${majorArcana.length} arcanes majeurs chargés pour le jeu ${id}`);
    
    // Pour l'instant, ne pas charger les arcanes mineurs
    return majorArcana;
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