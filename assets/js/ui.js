/**
 * Module de gestion de l'interface utilisateur
 */

import { cardsData, renderCard } from './tarot.js';
import { TRANSLATIONS, getTranslation } from './translations.js';

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
 * Affiche le tirage en fer à cheval
 * @param {Array} tirage - Tableau des cartes à afficher
 */
function afficherTirageHorseshoe(tirage) {
  if (tirage.length !== 7) return;
  
  const positions = document.querySelectorAll('.horseshoe-spread .card-position');
  positions.forEach((position, index) => {
    // Ajouter simplement un attribut data-position pour référence
    position.setAttribute('data-position', index + 1);
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
 * Met à jour les libellés des options des personas selon la langue sélectionnée
 * @param {string} langue - Le code de langue (fr, en, es, de, it)
 */
function updatePersonaOptions(langue) {
  const personaSelect = document.getElementById('persona');
  
  // Parcourir toutes les options du select persona
  for (let i = 0; i < personaSelect.options.length; i++) {
    const option = personaSelect.options[i];
    const personaValue = option.value;
    
    // Ne mettre à jour que les options qui ont une valeur (pas les optgroup)
    if (personaValue && TRANSLATIONS[langue]?.personas?.[personaValue]) {
      // Conserver l'emoji au début du texte s'il existe
      const emojiMatch = option.text.match(/^([\p{Emoji}\s]+)/u);
      const emoji = emojiMatch ? emojiMatch[1] : '';
      
      // Mettre à jour le texte avec l'emoji et la traduction
      option.text = emoji + TRANSLATIONS[langue].personas[personaValue];
    }
  }
}

/**
 * Met à jour les libellés des options des types de tirage selon la langue sélectionnée
 * @param {string} langue - Le code de langue (fr, en, es, de, it)
 */
function updateSpreadTypeOptions(langue) {
  const spreadTypeSelect = document.getElementById('spread-type');
  
  // Parcourir toutes les options du select spread-type
  for (let i = 0; i < spreadTypeSelect.options.length; i++) {
    const option = spreadTypeSelect.options[i];
    const spreadTypeValue = option.value;
    
    // Ne mettre à jour que les options qui ont une valeur
    if (spreadTypeValue && TRANSLATIONS[langue]?.spreadTypes?.[spreadTypeValue]) {
      option.text = TRANSLATIONS[langue].spreadTypes[spreadTypeValue];
    }
  }
}

/**
 * Met à jour l'interface utilisateur avec les traductions dans la langue spécifiée
 * @param {string} langue - Le code de langue (fr, en, es, de, it)
 */
function updateUILanguage(langue) {
  // Mettre à jour l'attribut lang de la balise HTML
  document.documentElement.lang = langue;
  
  // Mettre à jour le titre avec le type de tirage
  updateAppTitle();
  
  // Mettre à jour les labels dans l'en-tête
  document.querySelector('.select-group:nth-child(1) .select-label').textContent = getTranslation('header.language', langue);
  document.querySelector('.select-group:nth-child(2) .select-label').textContent = getTranslation('header.persona', langue);
  document.querySelector('.select-group:nth-child(3) .select-label').textContent = getTranslation('header.cardSet', langue);
  document.querySelector('.select-group:nth-child(4) .select-label').textContent = getTranslation('header.spreadType', langue);
  document.querySelector('.select-group:nth-child(5) .select-label').textContent = getTranslation('header.iaModel', langue);
  
  // Mettre à jour le label et le placeholder de la question
  document.querySelector('.input-group label').textContent = getTranslation('header.question', langue);
  document.getElementById('question').placeholder = getTranslation('header.questionPlaceholder', langue);
  
  // Mettre à jour le bouton de tirage
  document.getElementById('tirer').textContent = getTranslation('header.drawButton', langue);
  
  // Mettre à jour les messages d'interprétation par défaut
  const interpretationsDiv = document.getElementById('interpretations');
  const defaultInterpretation = document.getElementById('default-interpretation');
  const ollamaPromo = document.getElementById('ollama-promo');
  
  // Mettre à jour le texte d'interprétation par défaut
  if (defaultInterpretation) {
    defaultInterpretation.textContent = getTranslation('interpretation.default', langue);
  }
  
  // Mettre à jour le texte promotionnel d'Ollama
  if (ollamaPromo) {
    ollamaPromo.innerHTML = getTranslation('interpretation.ollamaPromo', langue);
  }
  
  // Mettre à jour les groupes d'options
  updateOptGroupsLabels(langue);
  
  // Mettre à jour les noms des personas et types de tirage
  updatePersonaOptions(langue);
  updateSpreadTypeOptions(langue);
}

/**
 * Met à jour les labels des groupes d'options dans les menus déroulants
 * @param {string} langue - Le code de langue (fr, en, es, de, it)
 */
function updateOptGroupsLabels(langue) {
  // Mettre à jour les optgroups du menu persona
  const personaSelect = document.getElementById('persona');
  for (let i = 0; i < personaSelect.children.length; i++) {
    const child = personaSelect.children[i];
    if (child.tagName === 'OPTGROUP') {
      // Déterminer la clé de traduction en fonction du label actuel
      let key = '';
      switch (child.label) {
        case 'Arts Divinatoires':
        case 'Divination Arts':
        case 'Artes Adivinatorias':
        case 'Wahrsagekünste':
        case 'Arti Divinatorie':
          key = 'optgroups.divinationArts'; break;
        case 'Traditions Spirituelles':
        case 'Spiritual Traditions':
        case 'Tradiciones Espirituales':
        case 'Spirituelle Traditionen':
        case 'Tradizioni Spirituali':
          key = 'optgroups.spiritualTraditions'; break;
        case 'Traditions Ésotériques':
        case 'Esoteric Traditions':
        case 'Tradiciones Esotéricas':
        case 'Esoterische Traditionen':
        case 'Tradizioni Esoteriche':
          key = 'optgroups.esotericTraditions'; break;
        case 'Psychanalystes':
        case 'Psychoanalysts':
        case 'Psicoanalistas':
        case 'Psychoanalytiker':
        case 'Psicoanalisti':
          key = 'optgroups.psychoanalysts'; break;
        case 'Entités Surnaturelles':
        case 'Supernatural Entities':
        case 'Entidades Sobrenaturales':
        case 'Übernatürliche Wesenheiten':
        case 'Entità Soprannaturali':
          key = 'optgroups.supernaturalEntities'; break;
      }
      if (key) {
        child.label = getTranslation(key, langue);
      }
    }
  }
  
  // Mettre à jour les optgroups du menu IA
  const iaSelect = document.getElementById('ia-model');
  for (let i = 0; i < iaSelect.children.length; i++) {
    const child = iaSelect.children[i];
    if (child.tagName === 'OPTGROUP') {
      if (child.label === 'OpenAI') {
        child.label = getTranslation('optgroups.openai', langue);
      } else if (child.label === 'Ollama') {
        child.label = getTranslation('optgroups.ollama', langue);
      }
    }
  }
}

/**
 * Met à jour le titre de l'application avec le type de tirage sélectionné
 */
function updateAppTitle() {
  const langue = document.getElementById('language').value;
  const modeTirage = document.getElementById('spread-type').value;
  
  // Obtenir la base du titre et le nom du tirage
  const baseTitle = getTranslation('appTitle', langue);
  const spreadName = getTranslation(`spreadTypes.${modeTirage}`, langue);
  
  // Mettre à jour le titre de la page et de l'application
  const fullTitle = `${baseTitle} ${spreadName}`;
  document.getElementById('page-title').textContent = fullTitle;
  document.getElementById('app-title').textContent = fullTitle;
}

// Exporter les fonctions
export {
  initSpread,
  afficherTirage,
  afficherTirageHorseshoe,
  mettreAJourAffichageCartes,
  updatePersonaLogo,
  getPersonaLabel,
  updateUILanguage,
  updatePersonaOptions,
  updateSpreadTypeOptions,
  updateAppTitle
}; 