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
  // Si aucun tirage en cours, initialiser avec des dos de cartes
  if (!tirageActuel || tirageActuel.length === 0) {
    initSpread();
    return [];
  }
  
  // Récupérer les cartes correspondantes dans le nouveau jeu
  const nouvelleCartes = tirageActuel.map(carte => {
    const id = carte.id;
    return cardsData[jeuSelectionne].find(c => c.id === id);
  });
  
  // Déterminer le type de tirage selon le nombre de cartes
  if (tirageActuel.length === 5) {
    // Tirage en croix
    afficherTirage(nouvelleCartes);
  } else if (tirageActuel.length === 7) {
    // Tirage en fer à cheval
    afficherTirageHorseshoe(nouvelleCartes);
  } else {
    // Cas non géré, initialiser avec des dos de cartes
    console.warn(`Tirage de ${tirageActuel.length} cartes non pris en charge.`);
    initSpread();
    return [];
  }
  
  // Retourner le tirage actualisé
  return nouvelleCartes;
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
      // Vérifier si l'élément a un attribut data-translation-key
      let translationKey = child.getAttribute('data-translation-key');
      
      // Si l'attribut n'existe pas, l'affecter en fonction du texte d'origine
      if (!translationKey) {
        // Déterminer la clé de traduction en fonction du label actuel
        if (child.label.includes('Arts Divinatoires') || child.label.includes('Divination Arts') || 
            child.label.includes('Artes Adivinatorias') || child.label.includes('Wahrsagekünste') || 
            child.label.includes('Arti Divinatorie') || child.label.includes('占卜艺术')) {
          translationKey = 'optgroups.divinationArts';
        } else if (child.label.includes('Traditions Spirituelles') || child.label.includes('Spiritual Traditions') || 
                  child.label.includes('Tradiciones Espirituales') || child.label.includes('Spirituelle Traditionen') || 
                  child.label.includes('Tradizioni Spirituali') || child.label.includes('精神传统')) {
          translationKey = 'optgroups.spiritualTraditions';
        } else if (child.label.includes('Traditions Ésotériques') || child.label.includes('Esoteric Traditions') || 
                  child.label.includes('Tradiciones Esotéricas') || child.label.includes('Esoterische Traditionen') || 
                  child.label.includes('Tradizioni Esoteriche') || child.label.includes('密传传统')) {
          translationKey = 'optgroups.esotericTraditions';
        } else if (child.label.includes('Psychanalystes') || child.label.includes('Psychoanalysts') || 
                  child.label.includes('Psicoanalistas') || child.label.includes('Psychoanalytiker') || 
                  child.label.includes('Psicoanalisti') || child.label.includes('精神分析学家')) {
          translationKey = 'optgroups.psychoanalysts';
        } else if (child.label.includes('Philosophes et Sages') || child.label.includes('Philosophers and Sages') || 
                  child.label.includes('Filósofos y Sabios') || child.label.includes('Philosophen und Weise') || 
                  child.label.includes('Filosofi e Saggi') || child.label.includes('哲学家和智者')) {
          translationKey = 'optgroups.philosophers';
        } else if (child.label.includes('Entités Surnaturelles') || child.label.includes('Supernatural Entities') || 
                  child.label.includes('Entidades Sobrenaturales') || child.label.includes('Übernatürliche Wesenheiten') || 
                  child.label.includes('Entità Soprannaturali') || child.label.includes('超自然实体')) {
          translationKey = 'optgroups.supernaturalEntities';
        }
        
        // Si une clé a été déterminée, la stocker dans un attribut data-
        if (translationKey) {
          child.setAttribute('data-translation-key', translationKey);
        }
      }
      
      // Si une clé de traduction est disponible, mettre à jour le label
      if (translationKey) {
        child.label = getTranslation(translationKey, langue);
      }
    }
  }
  
  // Mettre à jour les optgroups du menu IA
  const iaSelect = document.getElementById('ia-model');
  for (let i = 0; i < iaSelect.children.length; i++) {
    const child = iaSelect.children[i];
    if (child.tagName === 'OPTGROUP') {
      let translationKey = '';
      if (child.label.includes('OpenAI') || child.getAttribute('data-translation-key') === 'optgroups.openai') {
        translationKey = 'optgroups.openai';
        child.setAttribute('data-translation-key', translationKey);
      } else if (child.label.includes('Ollama') || child.getAttribute('data-translation-key') === 'optgroups.ollama') {
        translationKey = 'optgroups.ollama';
        child.setAttribute('data-translation-key', translationKey);
      }
      
      if (translationKey) {
        child.label = getTranslation(translationKey, langue);
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

/**
 * Réinitialise complètement l'affichage des cartes et des interprétations
 * Cette fonction est utilisée lorsque l'utilisateur change de jeu, de persona ou de type de tirage
 */
function resetAllDisplays() {
  // Réinitialiser le tirage en croix
  initSpread();
  
  // Réinitialiser le tirage en fer à cheval
  const jeuSelectionne = document.getElementById('card-set').value;
  const horseshoePositions = document.querySelectorAll('.horseshoe-spread .card-position');
  const backCardHTML = `<img src="${cardsData[jeuSelectionne][22].image}" alt="Dos de carte" class="card">`;
  horseshoePositions.forEach(position => {
    position.innerHTML = backCardHTML;
  });
  
  // Réinitialiser le texte d'interprétation
  const langue = document.getElementById('language').value;
  document.getElementById('interpretations').innerHTML = `
    <p id="default-interpretation">${getTranslation('interpretation.default', langue) || "Les interprétations s'afficheront ici après le tirage."}</p>
    <p id="ollama-promo" class="promo-text">${getTranslation('interpretation.ollamaPromo', langue) || "Télécharge ollama avec llama3.2:3b pour commencer."}</p>
  `;
  
  // Afficher le bon type de tirage selon la sélection
  const modeTirage = document.getElementById('spread-type').value;
  if (modeTirage === 'horseshoe') {
    document.getElementById('spread').style.display = 'none';
    document.getElementById('horseshoe-spread').style.display = 'grid';
  } else {
    document.getElementById('horseshoe-spread').style.display = 'none';
    document.getElementById('spread').style.display = 'grid';
  }
  
  // Mettre à jour le titre de l'application
  updateAppTitle();
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
  updateAppTitle,
  resetAllDisplays
}; 