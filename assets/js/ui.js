/**
 * Module de gestion de l'interface utilisateur
 */

import { cardsData, renderCard } from './tarot.js';

/**
 * Initialise l'affichage du tirage en croix avec des dos de cartes
 */
function initSpread() {
  const jeuSelectionne = document.getElementById('card-set').value;
  const backHTML = `<img src="${cardsData[jeuSelectionne][22].image}" alt="Dos de carte" class="card">`;
  const cells = document.querySelectorAll('.top, .left, .center, .right, .bottom');
  cells.forEach(cell => cell.innerHTML = backHTML);
}

/**
 * Affiche le tirage actuel dans la croix
 * @param {Array} tirage - Tableau des cartes à afficher
 */
function afficherTirage(tirage) {
  if (tirage.length !== 5) return;
  
  const positions = document.querySelectorAll('.top, .left, .center, .right, .bottom');
  positions.forEach((position, index) => {
    position.innerHTML = renderCard(tirage[index]);
  });
}

/**
 * Met à jour l'affichage des cartes lorsque le jeu est changé
 * @param {Array} tirageActuel - Le tirage actuel à mettre à jour
 * @param {string} jeuSelectionne - Le nouveau jeu sélectionné
 * @returns {Array} - Le tirage mis à jour avec les nouvelles images
 */
function mettreAJourAffichageCartes(tirageActuel, jeuSelectionne) {
  // Si un tirage est en cours, on met à jour les images avec le nouveau jeu
  if (tirageActuel.length === 5) {
    // Récupérer les cartes correspondantes dans le nouveau jeu
    const nouvelleCartes = tirageActuel.map(carte => {
      const id = carte.id;
      return cardsData[jeuSelectionne].find(c => c.id === id);
    });
    
    // Afficher le tirage avec les nouvelles images
    afficherTirage(nouvelleCartes);
    
    // Retourner le tirage actualisé
    return nouvelleCartes;
  } else {
    // Sinon, on initialise juste l'affichage avec le dos des cartes
    initSpread();
    return [];
  }
}

/**
 * Met à jour l'image du logo en fonction du persona sélectionné
 * @param {string} persona - Le persona sélectionné
 */
function updatePersonaLogo(persona) {
  const logoImg = document.getElementById('persona-logo');
  // Gestion du cas spécial pour le Mage Élémentaliste
  const imageName = persona === "mage" ? "elementaliste" : persona;
  logoImg.src = `assets/images/personas/${imageName}.png`;
  logoImg.alt = `${getPersonaLabel(persona)}`;
}

/**
 * Obtient le libellé d'un persona à partir de sa valeur
 * @param {string} personaValue - La valeur du persona
 * @returns {string} - Le libellé du persona
 */
function getPersonaLabel(personaValue) {
  const personaSelect = document.getElementById('persona');
  for (let i = 0; i < personaSelect.options.length; i++) {
    if (personaSelect.options[i].value === personaValue) {
      return personaSelect.options[i].text;
    }
  }
  return "Tarologue";
}

/**
 * Fonction pour agrandir/réduire une carte
 * Cette fonction est attachée aux cartes via leur attribut onclick
 * @param {HTMLElement} img - L'élément image à agrandir/réduire
 */
function toggleEnlarge(img) {
  if (img.classList.contains('enlarged')) {
    // Si la carte est déjà agrandie, la réduire
    img.classList.remove('enlarged');
    img.style.left = '';
  } else {
    // Agrandir la carte et l'aligner précisément avec le panneau gauche
    img.classList.add('enlarged');
    
    // Obtenir la position et les dimensions du panneau gauche (qui est maintenant le right-panel)
    const leftPanel = document.querySelector('.right-panel');
    const leftPanelRect = leftPanel.getBoundingClientRect();
    
    // Positionner la carte agrandie exactement au-dessus du panneau gauche
    img.style.left = leftPanelRect.left + 'px';
  }
}

// Exporter les fonctions
export {
  initSpread,
  afficherTirage,
  mettreAJourAffichageCartes,
  updatePersonaLogo,
  getPersonaLabel,
  toggleEnlarge
}; 