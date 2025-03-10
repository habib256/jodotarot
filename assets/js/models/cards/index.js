/**
 * Définitions des cartes de tarot
 * Centralise toutes les informations sur les cartes
 */

/**
 * Informations sur les cartes du jeu Marseille
 */
export const marseilleCards = [
  { id: "00", name: "Le fou", image: "assets/images/set01/00 Le fou.png" },
  { id: "01", name: "Bateleur", image: "assets/images/set01/01 Bateleur.png" },
  { id: "02", name: "Papesse", image: "assets/images/set01/02 Papesse.png" },
  { id: "03", name: "Imperatrice", image: "assets/images/set01/03 Imperatrice.png" },
  { id: "04", name: "Empereur", image: "assets/images/set01/04 Empereur.png" },
  { id: "05", name: "Pape", image: "assets/images/set01/05 Pape.png" },
  { id: "06", name: "Les amoureux", image: "assets/images/set01/06 Les amoureux.png" },
  { id: "07", name: "Chariot", image: "assets/images/set01/07 Chariot.png" },
  { id: "08", name: "Justice", image: "assets/images/set01/08 Justice.png" },
  { id: "09", name: "Ermite", image: "assets/images/set01/09 Ermite.png" },
  { id: "10", name: "La roue", image: "assets/images/set01/10 La roue.png" },
  { id: "11", name: "Force", image: "assets/images/set01/11 Force.png" },
  { id: "12", name: "Le pendu", image: "assets/images/set01/12 Le pendu.png" },
  { id: "13", name: "La mort", image: "assets/images/set01/13 La mort.png" },
  { id: "14", name: "Temperance", image: "assets/images/set01/14 Temperance.png" },
  { id: "15", name: "Diable", image: "assets/images/set01/15 Diable.png" },
  { id: "16", name: "La Tour", image: "assets/images/set01/16 La Tour.png" },
  { id: "17", name: "Etoile", image: "assets/images/set01/17 Etoile.png" },
  { id: "18", name: "La lune", image: "assets/images/set01/18 La lune.png" },
  { id: "19", name: "Le soleil", image: "assets/images/set01/19 Le soleil.png" },
  { id: "20", name: "Le jugement", image: "assets/images/set01/20 Le jugement.png" },
  { id: "21", name: "Le monde", image: "assets/images/set01/21 Le monde.png" },
  { id: "22", name: "Dos de carte", image: "assets/images/set01/22 Dos de carte.png" }
];

/**
 * Informations sur les cartes du jeu Thiago Lehmann
 */
export const lehmannCards = [
  { id: "00", name: "Le fou", image: "assets/images/set02/00 Le fou.jpg" },
  { id: "01", name: "Bateleur", image: "assets/images/set02/01 Bateleur.jpg" },
  { id: "02", name: "Papesse", image: "assets/images/set02/02 Papesse.jpg" },
  { id: "03", name: "Imperatrice", image: "assets/images/set02/03 Imperatrice.jpg" },
  { id: "04", name: "Empereur", image: "assets/images/set02/04 Empereur.jpg" },
  { id: "05", name: "Pape", image: "assets/images/set02/05 Pape.jpg" },
  { id: "06", name: "Les amoureux", image: "assets/images/set02/06 Les amoureux.jpg" },
  { id: "07", name: "Chariot", image: "assets/images/set02/07 Chariot.jpg" },
  { id: "08", name: "Justice", image: "assets/images/set02/08 Justice.jpg" },
  { id: "09", name: "Ermite", image: "assets/images/set02/09 Ermite.jpg" },
  { id: "10", name: "La roue", image: "assets/images/set02/10 La roue.jpg" },
  { id: "11", name: "Force", image: "assets/images/set02/11 Force.jpg" },
  { id: "12", name: "Le pendu", image: "assets/images/set02/12 Le pendu.jpg" },
  { id: "13", name: "La mort", image: "assets/images/set02/13 La mort.jpg" },
  { id: "14", name: "Temperance", image: "assets/images/set02/14 Temperance.jpg" },
  { id: "15", name: "Diable", image: "assets/images/set02/15 Diable.jpg" },
  { id: "16", name: "La Tour", image: "assets/images/set02/16 La Tour.jpg" },
  { id: "17", name: "Etoile", image: "assets/images/set02/17 Etoile.jpg" },
  { id: "18", name: "La lune", image: "assets/images/set02/18 La lune.jpg" },
  { id: "19", name: "Le soleil", image: "assets/images/set02/19 Le soleil.jpg" },
  { id: "20", name: "Le jugement", image: "assets/images/set02/20 Le jugement.jpg" },
  { id: "21", name: "Le monde", image: "assets/images/set02/21 Le monde.jpg" },
  { id: "22", name: "Dos de carte", image: "assets/images/set02/22 Dos de carte.png" }
];

/**
 * Significations des arcanes majeurs à l'endroit
 */
export const majorUprightMeanings = {
  "00": "Liberté, spiritualité, potentiel inexploité",
  "01": "Habileté, dextérité, action, créativité",
  "02": "Intuition, sagesse intérieure, connaissance secrète",
  "03": "Abondance, féminité, créativité, nature",
  "04": "Autorité, structure, contrôle, leadership",
  "05": "Spiritualité, croyance, tradition, conformité",
  "06": "Amour, choix, attraction, équilibre",
  "07": "Détermination, contrôle, succès, action",
  "08": "Équité, vérité, loi, équilibre",
  "09": "Introspection, recherche, solitude, guidance",
  "10": "Chance, karma, destin, tournants de vie",
  "11": "Courage, persuasion, influence, énergie",
  "12": "Sacrifice, perspective, suspension, lâcher-prise",
  "13": "Transformation, transition, changement, libération",
  "14": "Modération, équilibre, patience, harmonie",
  "15": "Ombres, matérialisme, attachements, illusions",
  "16": "Bouleversement soudain, chaos, révélation, éveil",
  "17": "Espoir, inspiration, renouveau, spiritualité",
  "18": "Illusion, peurs, anxiété, confusion",
  "19": "Succès, joie, vitalité, confiance",
  "20": "Éveil, rénovation, jugement, absolution",
  "21": "Accomplissement, intégration, voyage, complétude"
};

/**
 * Significations des arcanes majeurs renversés
 */
export const majorReversedMeanings = {
  "00": "Errance, imprudence, risques insensés",
  "01": "Manque de confiance, talents inexploités, tromperie",
  "02": "Secrets cachés, savoir caché, besoin d'écouter son intuition",
  "03": "Dépendance, blocage créatif, problèmes domestiques",
  "04": "Domination, rigidité, inflexibilité, contrôle excessif",
  "05": "Rébellion, subversion, nouvelles méthodes, non-conventionalité",
  "06": "Déséquilibre, discorde, disharmonie, mauvais choix",
  "07": "Manque de direction, agression, échec, défaite",
  "08": "Injustice, malhonnêteté, manque d'objectivité",
  "09": "Isolement, repli sur soi, paranoïa, solitude excessive",
  "10": "Revers de fortune, bouleversements, résistance au changement",
  "11": "Doute de soi, faiblesse, manque de détermination",
  "12": "Résistance, stagnation, indécision, retard",
  "13": "Résistance au changement, stagnation, inévitabilité",
  "14": "Déséquilibre, excès, auto-restriction, désalignement",
  "15": "Libération, indépendance, affronter ses peurs",
  "16": "Éviter le désastre, retarder l'inévitable, résistance au changement",
  "17": "Désespoir, pessimisme, manque de foi, découragement",
  "18": "Confusion, peur, malentendus, méconnaissance",
  "19": "Blocage, dépression, malentendus, égocentrisme",
  "20": "Doute de soi, auto-critique, peur du changement",
  "21": "Incomplet, stagnation, manque d'accomplissement, voyage déséquilibré"
};

/**
 * Définition complète des jeux de cartes disponibles
 */
export const cardSets = {
  set01: {
    id: 'set01',
    name: 'Tarot Marseille',
    cards: marseilleCards,
    backCardIndex: 22 // Indice de la carte de dos dans le tableau
  },
  set02: {
    id: 'set02',
    name: 'Tarot Thiago Lehmann',
    cards: lehmannCards,
    backCardIndex: 22
  }
};

/**
 * Obtient une carte par son ID dans un jeu spécifié
 * @param {string} setId - Identifiant du jeu de cartes
 * @param {string} cardId - Identifiant de la carte
 * @return {Object|null} La carte trouvée ou null
 */
export function getCardById(setId, cardId) {
  if (!cardSets[setId]) return null;
  
  return cardSets[setId].cards.find(card => card.id === cardId) || null;
}

/**
 * Obtient la signification d'une carte majeure selon son orientation
 * @param {string} cardId - Identifiant de la carte
 * @param {string} orientation - Orientation de la carte (upright ou reversed)
 * @return {string} La signification de la carte
 */
export function getMajorCardMeaning(cardId, orientation = 'upright') {
  if (orientation === 'upright') {
    return majorUprightMeanings[cardId] || "Signification inconnue";
  } else {
    return majorReversedMeanings[cardId] || "Signification inconnue";
  }
}

/**
 * Obtient l'image de dos pour un jeu de cartes
 * @param {string} setId - Identifiant du jeu de cartes
 * @return {string} URL de l'image de dos
 */
export function getBackCardImage(setId) {
  if (!cardSets[setId]) return "";
  
  const backCardIndex = cardSets[setId].backCardIndex;
  return cardSets[setId].cards[backCardIndex].image;
} 