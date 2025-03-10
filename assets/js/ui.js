/**
 * Module de gestion de l'interface utilisateur
 */

// Importations
import { createSpread } from './main.js';
import { TRANSLATIONS, getTranslation } from './translations/index.js';

/**
 * Met à jour le logo du persona sélectionné
 * @param {string} persona - La clé du persona sélectionné
 */
function updatePersonaLogo(persona) {
  const logoContainer = document.getElementById('persona-logo');
  if (!logoContainer) return;
  
  // Chemin vers le logo
  const logoPath = `assets/images/personas/${persona}.png`;
  logoContainer.innerHTML = `<img src="${logoPath}" alt="${getPersonaLabel(persona)}">`;
}

/**
 * Obtient le libellé pour un persona
 * @param {string} personaValue - La valeur du persona
 * @returns {string} - Le libellé du persona
 */
function getPersonaLabel(personaValue) {
  const personaSelect = document.getElementById('persona');
  if (!personaSelect) return personaValue;
  
  const option = Array.from(personaSelect.options).find(opt => opt.value === personaValue);
  return option ? option.textContent : personaValue;
}

/**
 * Met à jour les options du select de persona avec les traductions
 * @param {string} langue - Code de langue
 */
function updatePersonaOptions(langue) {
  const personaSelect = document.getElementById('persona');
  if (!personaSelect) return;
  
  const options = personaSelect.querySelectorAll('option');
  options.forEach(option => {
    const value = option.value;
    if (!value) return; // Ignorer l'option vide
    
    let key = `personas.${value}`;
    if (TRANSLATIONS[langue] && TRANSLATIONS[langue][key]) {
      option.text = TRANSLATIONS[langue][key];
    }
  });
}

/**
 * Met à jour les options du select de type de tirage avec les traductions
 * @param {string} langue - Code de langue
 */
function updateSpreadTypeOptions(langue) {
  const spreadTypeSelect = document.getElementById('spread-type');
  if (!spreadTypeSelect) return;
  
  const options = spreadTypeSelect.querySelectorAll('option');
  options.forEach(option => {
    const value = option.value;
    if (!value) return; // Ignorer l'option vide
    
    let key = `spreadTypes.${value}`;
    if (TRANSLATIONS[langue]?.spreadTypes?.[value]) {
      option.text = TRANSLATIONS[langue].spreadTypes[value];
    }
  });
}

/**
 * Met à jour l'interface avec les traductions de la langue sélectionnée
 * @param {string} langue - Code de langue
 */
function updateUILanguage(langue) {
  // Vérifier si la langue existe dans nos traductions
  if (!TRANSLATIONS[langue]) {
    console.error(`Langue non supportée: ${langue}`);
    return;
  }
  
  // Mettre à jour le titre de l'application
  updateAppTitle(langue);
  
  // Mettre à jour les étiquettes des sélecteurs
  document.querySelector('.select-group:nth-child(1) .select-label').textContent = getTranslation('header.deck', langue);
  document.querySelector('.select-group:nth-child(2) .select-label').textContent = getTranslation('header.language', langue);
  document.querySelector('.select-group:nth-child(3) .select-label').textContent = getTranslation('header.persona', langue);
  document.querySelector('.select-group:nth-child(4) .select-label').textContent = getTranslation('header.spreadType', langue);
  document.querySelector('.select-group:nth-child(5) .select-label').textContent = getTranslation('header.model', langue);
  
  // Mettre à jour les textes des personnages et des types de tirages
  updatePersonaOptions(langue);
  updateSpreadTypeOptions(langue);
  
  // Mettre à jour les labels et autres textes
  document.getElementById('question-label').textContent = getTranslation('form.question', langue);
  document.getElementById('question').placeholder = getTranslation('form.questionPlaceholder', langue);
  document.getElementById('question').ariaLabel = getTranslation('form.questionAriaLabel', langue);
  
  // Mettre à jour le bouton
  document.getElementById('tirer').textContent = getTranslation('form.submitButton', langue);
  
  // Mettre à jour le contenu par défaut des interprétations si aucun tirage n'a été effectué
  const interpretationsInfo = document.getElementById('interpretations-info');
  if (interpretationsInfo) {
    const defaultText = getTranslation('interpretation.default', langue, 'Les interprétations s\'afficheront après le tirage.');
    
    // Vérifier si nous devons réinitialiser complètement ou juste mettre à jour le texte
    const defaultInterpretation = interpretationsInfo.querySelector('#default-interpretation');
    
    if (defaultInterpretation) {
      // Le panneau est dans son état par défaut, mettons à jour le texte
      defaultInterpretation.textContent = defaultText;
      
      // Mettre à jour aussi le titre
      const title = interpretationsInfo.querySelector('.information-zone__title');
      if (title) {
        title.textContent = getTranslation('information.title', langue, 'Information');
      }
    } else {
      // Nous sommes en cours de tirage ou d'interprétation, ne pas réinitialiser
      // Le contenu sera mis à jour lors du prochain tirage
    }
  }
  
  // Mettre à jour les étiquettes des groupes d'options
  updateOptGroupsLabels(langue);
  
  // Mettre à jour les titres de section
  document.querySelector('.reading-section h2').textContent = getTranslation('sections.reading', langue);
  document.querySelector('.interpretations-section h2').textContent = getTranslation('sections.interpretations', langue);
  
  // Masquer les autres panneaux d'interprétation
  const interpretationsPrompt = document.getElementById('interpretations-prompt');
  const interpretationsResponse = document.getElementById('interpretations-response');
  if (interpretationsPrompt) interpretationsPrompt.style.display = 'none';
  if (interpretationsResponse) interpretationsResponse.style.display = 'none';
  
  // Mise à jour du sélecteur de langue avec la langue active
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    langSelector.value = langue;
  }
}

/**
 * Met à jour les libellés des groupes d'options
 * @param {string} langue - Code de langue
 */
function updateOptGroupsLabels(langue) {
  // Mettre à jour les optgroups du modèle d'IA
  const modeleSelect = document.getElementById('ia-model');
  if (modeleSelect) {
    const optgroups = modeleSelect.querySelectorAll('optgroup');
    optgroups.forEach(optgroup => {
      const label = optgroup.getAttribute('label');
      if (label === 'OpenAI') {
        optgroup.setAttribute('label', getTranslation('optgroups.openai', langue, 'OpenAI'));
      } else if (label === 'Ollama') {
        optgroup.setAttribute('label', getTranslation('optgroups.ollama', langue, 'Ollama (Local)'));
      } else if (label === 'Other') {
        optgroup.setAttribute('label', getTranslation('optgroups.other', langue, 'Autres'));
      }
    });
  }
  
  // Mettre à jour les optgroups du jeu de cartes
  const deckSelect = document.getElementById('card-set');
  if (deckSelect) {
    const optgroups = deckSelect.querySelectorAll('optgroup');
    optgroups.forEach(optgroup => {
      const label = optgroup.getAttribute('label');
      if (label === 'Traditional') {
        optgroup.setAttribute('label', getTranslation('optgroups.traditional', langue, 'Traditionnels'));
      } else if (label === 'Artistic') {
        optgroup.setAttribute('label', getTranslation('optgroups.artistic', langue, 'Artistiques'));
      } else if (label === 'Modern') {
        optgroup.setAttribute('label', getTranslation('optgroups.modern', langue, 'Modernes'));
      }
    });
  }
  
  // Mettre à jour les optgroups des personas
  const personaSelect = document.getElementById('persona');
  if (personaSelect) {
    const optgroups = personaSelect.querySelectorAll('optgroup');
    optgroups.forEach(optgroup => {
      const label = optgroup.getAttribute('label');
      if (label === 'Spiritual') {
        optgroup.setAttribute('label', getTranslation('optgroups.spiritual', langue, 'Spirituels'));
      } else if (label === 'Philosophical') {
        optgroup.setAttribute('label', getTranslation('optgroups.philosophical', langue, 'Philosophiques'));
      } else if (label === 'Psychological') {
        optgroup.setAttribute('label', getTranslation('optgroups.psychological', langue, 'Psychologiques'));
      } else if (label === 'Cultural') {
        optgroup.setAttribute('label', getTranslation('optgroups.cultural', langue, 'Culturels'));
      }
    });
  }
}

/**
 * Met à jour le titre de l'application
 * @param {string} langue - Code de langue (optionnel)
 */
function updateAppTitle(langue) {
  if (!langue) {
    langue = document.getElementById('language').value;
  }
  
  // Mettre à jour le titre principal
  document.title = getTranslation('app.title', langue, 'Jodotarot');
  
  // Mettre à jour le h1
  const mainTitle = document.querySelector('h1');
  if (mainTitle) {
    mainTitle.textContent = getTranslation('app.title', langue, 'Jodotarot');
  }
}

/**
 * Réinitialise tous les affichages (cartes et interprétations)
 */
function resetAllDisplays() {
  // Obtenir l'état actuel des sélecteurs
  const jeuSelectionne = document.getElementById('card-set').value;
  const langue = document.getElementById('language').value;
  
  // Réinitialiser les conteneurs de tirages
  const spreadContainers = document.querySelectorAll('#spread, #horseshoe-spread, #love-spread, #celtic-cross-spread');
  spreadContainers.forEach(container => {
    // Récupérer le type de tirage correspondant
    let spreadType;
    if (container.id === 'spread') {
      spreadType = 'cross';
    } else if (container.id === 'horseshoe-spread') {
      spreadType = 'horseshoe';
    } else if (container.id === 'love-spread') {
      spreadType = 'love';
    } else if (container.id === 'celtic-cross-spread') {
      spreadType = 'celticCross';
    }
    
    // Créer une instance du tirage et réinitialiser
    if (spreadType) {
      const spread = createSpread(spreadType, container, langue);
      spread.reset();
    }
  });
  
  // Réinitialiser les interprétations
  const interpretationsInfo = document.getElementById('interpretations-info');
  if (interpretationsInfo) {
    const defaultText = getTranslation('interpretation.default', langue, 'Les interprétations s\'afficheront après le tirage.');
    interpretationsInfo.innerHTML = `
      <div class="information-zone__header">
        <h3 class="information-zone__title">${getTranslation('information.title', langue, 'Information')}</h3>
      </div>
      <div class="information-zone__content">
        <p id="default-interpretation">${defaultText}</p>
      </div>
    `;
  }
}

// Exporter les fonctions publiques
export {
  resetAllDisplays,
  updatePersonaLogo,
  getPersonaLabel,
  updatePersonaOptions,
  updateSpreadTypeOptions,
  updateUILanguage,
  updateOptGroupsLabels,
  updateAppTitle
}; 