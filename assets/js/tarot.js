/**
 * Module de gestion des cartes de tarot et des tirages
 */

// Tableau des cartes du tarot avec les chemins vers les images
const cardsData = {
  set01: [
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
  ],
  set02: [
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
  ]
};

/**
 * Fonction pour mélanger un tableau
 * @param {Array} array - Tableau à mélanger
 * @returns {Array} - Tableau mélangé
 */
function shuffle(array) {
  const newArray = [...array]; // Copie pour ne pas modifier l'original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Fonction pour générer le HTML d'une carte
 * @param {Object} card - Objet carte avec name et image
 * @returns {string} - HTML de la carte
 */
function renderCard(card) {
  return `<img src="${card.image}" alt="${card.name}" class="card" onclick="toggleEnlarge(this)">`;
}

/**
 * Fonction pour tirer aléatoirement 5 cartes d'un jeu
 * @param {string} deckName - Nom du jeu de cartes (set01 ou set02)
 * @returns {Array} - Tableau des 5 cartes tirées
 */
function drawCards(deckName = 'set01') {
  // Vérifier si le jeu existe
  if (!cardsData[deckName]) {
    console.error(`Le jeu de cartes ${deckName} n'existe pas`);
    return [];
  }
  
  // Mélanger les cartes (exclure la dernière qui est le dos de carte)
  const jeuMelange = shuffle(cardsData[deckName].slice(0, -1));
  
  // Sélectionner les 5 premières cartes pour le tirage
  return jeuMelange.slice(0, 5);
}

/**
 * Fonction pour générer un prompt de tirage détaillé basé sur les cartes
 * @param {Array} tirage - Tableau des cartes tirées
 * @returns {string} - Prompt détaillé pour l'IA
 */
function genererPromptTirage(tirage) {
  if (!tirage || tirage.length === 0) {
    return "";
  }
  
  const positions = [
    "en haut (influences positives/spirituelles)", 
    "à gauche (passé/origines de la situation)", 
    "au centre (situation actuelle/enjeu principal)", 
    "à droite (futur/évolution probable)",
    "en bas (influences négatives/défis à surmonter)"
  ];
  
  let tiragePrompt = "\nVoici le tirage en croix à interpréter:\n";
  
  tirage.forEach((carte, index) => {
    if (index < positions.length) {
      tiragePrompt += `- La carte "${carte.name}" est positionnée ${positions[index]}`;
      
      // Ajouter des instructions spécifiques pour chaque position
      if (index === 0) {
        tiragePrompt += `. Analyse les forces spirituelles ou mentales qui soutiennent la personne.\n`;
      } else if (index === 1) {
        tiragePrompt += `. Explore comment les événements passés ont contribué à la situation actuelle.\n`;
      } else if (index === 2) {
        tiragePrompt += `. Décris précisément la situation actuelle et les enjeux centraux.\n`;
      } else if (index === 3) {
        tiragePrompt += `. Projette l'évolution probable si la personne suit le chemin actuel.\n`;
      } else if (index === 4) {
        tiragePrompt += `. Identifie les obstacles à surmonter et propose des moyens de les gérer.\n`;
      }
    }
  });
  
  tiragePrompt += "\nPrends en compte l'interaction entre les cartes et leur position relative dans ton interprétation globale.";
  
  return tiragePrompt;
}

// Exporter les fonctions et données
export {
  cardsData,
  shuffle,
  renderCard,
  drawCards,
  genererPromptTirage
}; 