/**
 * Service pour charger et gérer les différents jeux de cartes
 */
import Deck from '../models/cards/Deck.js';
import { TarotCard, ARCANE_TYPES, MINOR_SUITS, MINOR_RANKS, cardSetConfigs } from '../models/cards/index.js';
import { getTranslation } from '../translations/index.js';

class DeckService {
  constructor() {
    this.decks = {}; // Cache des jeux chargés
    this.currentDeckId = null;
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
    return Object.values(cardSetConfigs);
  }
  
  /**
   * Charge un jeu de cartes spécifique
   * @param {string} deckId - Identifiant du jeu à charger
   * @returns {Promise<Deck>} Le jeu de cartes chargé
   */
  async loadDeck(deckId) {
    console.log(`🔄 Début du chargement du jeu ${deckId}`);
    
    // Vider le cache si on change de jeu
    if (this.currentDeckId && this.currentDeckId !== deckId) {
      console.log(`🗑️ Vidage du cache du jeu ${this.currentDeckId}`);
      delete this.decks[this.currentDeckId];
    }

    const deckInfo = cardSetConfigs[deckId];
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
    const config = cardSetConfigs[deckId];
    if (!config) {
      throw new Error(`Jeu non trouvé: ${deckId}`);
    }

    const cards = [];
    for (let i = 0; i <= config.majorCount; i++) {
      const cardName = config.cardNames[i];
      const fileName = `${String(i).padStart(2, '0')}_${cardName}.${config.extension}`;
      const imagePath = `${config.path}/${fileName}`;
      
      cards.push(new TarotCard(
        `M${String(i).padStart(2, '0')}`,
        cardName,
        imagePath
      ));
    }

    return cards;
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
      20: "Éveil, rénovation, jugement, absolution",
      21: "Incomplet, stagnation, manque d'accomplissement, voyage déséquilibré"
    };
    
    return meanings[cardNumber] || "Signification inconnue";
  }
}

export default DeckService; 