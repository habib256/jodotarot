/**
 * Contrôleur responsable des configurations et préférences de l'application
 * Gère les langues, jeux de cartes, modèles IA, etc.
 */
import StateManager from '../utils/StateManager.js';
import AIService from '../services/AIService.js';
import { createPersona } from '../main.js';
import { TRANSLATIONS, getTranslation } from '../translations/index.js';
import { updateUILanguage, updatePersonaLogo, resetAllDisplays } from '../ui.js';

class ConfigController {
  /**
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   * @param {AIService} aiService - Service IA pour tester la connectivité
   */
  constructor(stateManager, aiService) {
    this.stateManager = stateManager;
    this.aiService = aiService;
    
    // Éléments DOM
    this.elements = {
      languageSelect: document.getElementById('language'),
      personaSelect: document.getElementById('persona'),
      cardSetSelect: document.getElementById('card-set'),
      spreadTypeSelect: document.getElementById('spread-type'),
      iaModelSelect: document.getElementById('ia-model'),
      appTitle: document.getElementById('app-title'),
      personaLogo: document.getElementById('persona-logo'),
      warningContainer: document.getElementById('connectivity-warning') || this.createWarningContainer()
    };
    
    // Initialiser les warning containers
    this.createWarningContainer();
    
    // Initialiser les écouteurs d'événements
    this.initEventListeners();
    
    // Synchroniser l'UI avec l'état actuel
    this.syncUIWithState();
    
    // S'abonner aux changements d'état pour maintenir l'UI synchronisée
    // On utilise directement l'abonnement au StateManager plutôt que les événements
    this.stateManager.subscribe(() => this.syncUIWithState());
    
    // Écouter les événements spécifiques pour les traitements additionnels
    document.addEventListener('language:changed', () => this.updateUILanguage(this.stateManager.getState().language));
    document.addEventListener('spreadType:changed', () => this.updateAppTitle());
    
    // Écouter l'événement global pour les changements d'état
    document.addEventListener('state:changed', (event) => {
      // S'il y a eu des changements liés à la connectivité ou au modèle IA
      if (event.detail.changes.iaModel) {
        this.testModelConnectivity();
      }
    });
  }
  
  /**
   * Crée un conteneur pour les avertissements s'il n'existe pas
   * @return {HTMLElement} Le conteneur créé
   */
  createWarningContainer() {
    const container = document.createElement('div');
    container.id = 'connectivity-warning';
    container.className = 'warning-container';
    
    // Insérer avant la zone d'interprétation
    const interpretationsInfo = document.getElementById('interpretations-info');
    interpretationsInfo.parentNode.insertBefore(container, interpretationsInfo);
    
    return container;
  }
  
  /**
   * Initialise les écouteurs d'événements
   */
  initEventListeners() {
    // Langue
    this.elements.languageSelect.addEventListener('change', this.handleLanguageChange.bind(this));
    
    // Persona
    this.elements.personaSelect.addEventListener('change', this.handlePersonaChange.bind(this));
    
    // Jeu de cartes
    this.elements.cardSetSelect.addEventListener('change', this.handleCardSetChange.bind(this));
    
    // Type de tirage
    this.elements.spreadTypeSelect.addEventListener('change', this.handleSpreadTypeChange.bind(this));
    
    // Modèle IA
    this.elements.iaModelSelect.addEventListener('change', this.handleModelChange.bind(this));
  }
  
  /**
   * Gère le changement de langue
   * @param {Event} event - Événement de changement
   */
  handleLanguageChange(event) {
    const language = event.target.value;
    
    // Mettre à jour l'état via StateManager uniquement
    this.stateManager.setState({ language });
    
    // Mettre à jour l'interface avec les traductions
    this.updateUILanguage(language);
    
    // Re-tester la connectivité avec les nouveaux textes
    this.testModelConnectivity();
  }
  
  /**
   * Gère le changement de persona
   * @param {Event} event - Événement de changement
   */
  handlePersonaChange(event) {
    const persona = event.target.value;
    
    // Mettre à jour l'état via StateManager uniquement
    this.stateManager.setState({ persona });
    
    // Les mises à jour visuelles seront gérées par les écouteurs d'événements
  }
  
  /**
   * Gère le changement de jeu de cartes
   * @param {Event} event - Événement de changement
   */
  handleCardSetChange(event) {
    const cardSet = event.target.value;
    
    // Mettre à jour l'état via StateManager uniquement
    this.stateManager.setState({ cardSet });
    
    // Réinitialiser l'affichage du tirage aux positions par défaut
    resetAllDisplays();
  }
  
  /**
   * Gère le changement de type de tirage
   * @param {Event} event - Événement de changement
   */
  handleSpreadTypeChange(event) {
    const spreadType = event.target.value;
    
    // Mettre à jour l'état via StateManager uniquement
    this.stateManager.setState({ spreadType });
  }
  
  /**
   * Gère le changement de modèle d'IA
   * @param {Event} event - Événement de changement
   */
  handleModelChange(event) {
    const iaModel = event.target.value;
    
    // Mettre à jour l'état
    this.stateManager.setState({ iaModel });
    
    // Tester la connectivité avec le nouveau modèle
    this.testModelConnectivity();
  }
  
  /**
   * Met à jour le logo du persona
   * @param {string} persona - La clé du persona
   */
  updatePersonaLogo(persona) {
    // Suppression du cas spécial pour le Mage Élémentaliste
    // Note: Il serait préférable de renommer le fichier image en "mage.png" pour assurer la cohérence
    this.elements.personaLogo.src = `assets/images/personas/${persona}.png`;
    this.elements.personaLogo.alt = this.getPersonaLabel(persona);
  }
  
  /**
   * Obtient le libellé d'un persona à partir de sa valeur
   * @param {string} personaValue - La valeur du persona
   * @return {string} - Le libellé du persona
   */
  getPersonaLabel(personaValue) {
    for (let i = 0; i < this.elements.personaSelect.options.length; i++) {
      if (this.elements.personaSelect.options[i].value === personaValue) {
        return this.elements.personaSelect.options[i].text;
      }
    }
    return "Tarologue";
  }
  
  /**
   * Met à jour le titre de l'application en fonction du type de tirage
   */
  updateAppTitle() {
    const state = this.stateManager.getState();
    const spreadType = state.spreadType;
    const language = state.language;
    
    let spreadTitle;
    switch (spreadType) {
      case 'cross':
        spreadTitle = getTranslation('spreadTypes.cross', language, 'Croix');
        break;
      case 'horseshoe':
        spreadTitle = getTranslation('spreadTypes.horseshoe', language, 'Fer à Cheval');
        break;
      case 'love':
        spreadTitle = getTranslation('spreadTypes.love', language, 'Tarot de l\'amour');
        break;
      case 'celticCross':
        spreadTitle = getTranslation('spreadTypes.celticCross', language, 'Croix Celtique');
        break;
      // Suppression du cas par défaut redondant
    }
    
    this.elements.appTitle.textContent = `JodoTarot ${spreadTitle}`;
  }
  
  /**
   * Met à jour l'interface utilisateur avec les traductions
   * @param {string} language - Code de langue
   */
  updateUILanguage(language) {
    // Mettre à jour l'attribut lang de la balise HTML
    document.documentElement.lang = language;
    
    // Mettre à jour le titre avec le type de tirage
    this.updateAppTitle();
    
    // Mettre à jour les labels dans l'en-tête
    const selectors = [
      { selector: '.select-group:nth-child(1) .select-label', key: 'header.language' },
      { selector: '.select-group:nth-child(2) .select-label', key: 'header.persona' },
      { selector: '.select-group:nth-child(3) .select-label', key: 'header.cardSet' },
      { selector: '.select-group:nth-child(4) .select-label', key: 'header.spreadType' },
      { selector: '.select-group:nth-child(5) .select-label', key: 'header.iaModel' }
    ];
    
    selectors.forEach(item => {
      const element = document.querySelector(item.selector);
      if (element) {
        element.textContent = getTranslation(item.key, language);
      }
    });
    
    // Mettre à jour le label et le placeholder de la question
    const questionLabel = document.querySelector('.input-group label');
    const questionInput = document.getElementById('question');
    
    if (questionLabel) {
      questionLabel.textContent = getTranslation('header.question', language);
    }
    
    if (questionInput) {
      questionInput.placeholder = getTranslation('header.questionPlaceholder', language);
    }
    
    // Mettre à jour le bouton de tirage
    const drawButton = document.getElementById('tirer');
    if (drawButton) {
      drawButton.textContent = getTranslation('header.drawButton', language);
    }
    
    // Mettre à jour les textes des options des menus déroulants
    this.updateDropdownOptions(language);
    
    // Mettre à jour l'interprétation par défaut
    const defaultInterpretation = document.getElementById('default-interpretation');
    if (defaultInterpretation) {
      defaultInterpretation.textContent = getTranslation('interpretation.default', language);
    }
    
    // Mettre à jour le texte promotionnel pour Ollama si présent
    const ollamaPromo = document.getElementById('ollama-promo');
    if (ollamaPromo) {
      ollamaPromo.innerHTML = getTranslation('interpretation.ollamaPromo', language);
    }
    
    // Notifier les écouteurs que la langue a changé
    document.dispatchEvent(new CustomEvent('language:changed', { 
      detail: { language } 
    }));
  }
  
  /**
   * Met à jour les textes des options dans les menus déroulants
   * @param {string} language - Code de langue
   */
  updateDropdownOptions(language) {
    // Mettre à jour les optgroups et options du menu "persona"
    const personaSelect = document.getElementById('persona');
    if (personaSelect) {
      // Mettre à jour les légendes des groupes d'options
      const optgroups = personaSelect.querySelectorAll('optgroup');
      optgroups.forEach(optgroup => {
        // Utiliser l'attribut data-optgroup-key s'il existe, sinon le déterminer à partir du label actuel
        let key = optgroup.getAttribute('data-optgroup-key');
        
        if (!key) {
          const label = optgroup.getAttribute('label');
          
          // Map pour associer les labels dans différentes langues à leurs clés
          const labelToKeyMap = {
            // Français
            'Arts Divinatoires': 'personaGroups.divinationArts',
            'Traditions Spirituelles': 'personaGroups.spiritualTraditions',
            'Traditions Ésotériques': 'personaGroups.esotericTraditions',
            'Psychanalystes': 'personaGroups.psychoanalysts',
            'Philosophes et Sages': 'personaGroups.philosophersSages',
            'Entités Surnaturelles': 'personaGroups.supernaturalEntities',
            
            // Anglais
            'Divination Arts': 'personaGroups.divinationArts',
            'Spiritual Traditions': 'personaGroups.spiritualTraditions',
            'Esoteric Traditions': 'personaGroups.esotericTraditions',
            'Psychoanalysts': 'personaGroups.psychoanalysts',
            'Philosophers and Sages': 'personaGroups.philosophersSages',
            'Supernatural Entities': 'personaGroups.supernaturalEntities',
            
            // Espagnol
            'Artes Adivinatorias': 'personaGroups.divinationArts',
            'Tradiciones Espirituales': 'personaGroups.spiritualTraditions',
            'Tradiciones Esotéricas': 'personaGroups.esotericTraditions',
            'Psicoanalistas': 'personaGroups.psychoanalysts',
            'Filósofos y Sabios': 'personaGroups.philosophersSages',
            'Entidades Sobrenaturales': 'personaGroups.supernaturalEntities',
            
            // Allemand
            'Wahrsagekünste': 'personaGroups.divinationArts',
            'Spirituelle Traditionen': 'personaGroups.spiritualTraditions',
            'Esoterische Traditionen': 'personaGroups.esotericTraditions',
            'Psychoanalytiker': 'personaGroups.psychoanalysts',
            'Philosophen und Weise': 'personaGroups.philosophersSages',
            'Übernatürliche Wesenheiten': 'personaGroups.supernaturalEntities',
            
            // Italien
            'Arti Divinatorie': 'personaGroups.divinationArts',
            'Tradizioni Spirituali': 'personaGroups.spiritualTraditions',
            'Tradizioni Esoteriche': 'personaGroups.esotericTraditions',
            'Psicoanalisti': 'personaGroups.psychoanalysts',
            'Filosofi e Saggi': 'personaGroups.philosophersSages',
            'Entità Soprannaturali': 'personaGroups.supernaturalEntities',
            
            // Chinois
            '占卜艺术': 'personaGroups.divinationArts',
            '精神传统': 'personaGroups.spiritualTraditions',
            '密传传统': 'personaGroups.esotericTraditions',
            '精神分析学家': 'personaGroups.psychoanalysts',
            '哲学家和智者': 'personaGroups.philosophersSages',
            '超自然实体': 'personaGroups.supernaturalEntities'
          };
          
          key = labelToKeyMap[label];
          
          // Si la clé a été trouvée, stocker pour une utilisation future
          if (key) {
            optgroup.setAttribute('data-optgroup-key', key);
          }
        }
        
        if (key) {
          optgroup.setAttribute('label', getTranslation(key, language));
        }
      });
      
      // Mettre à jour les textes des options de persona
      const options = personaSelect.querySelectorAll('option');
      options.forEach(option => {
        const value = option.value;
        if (value && value !== '') {
          const key = `personas.${value}`;
          const translation = getTranslation(key, language);
          if (translation) {
            // Utiliser directement la traduction complète (avec émoji)
            option.textContent = translation;
          }
        }
      });
    }
    
    // Mettre à jour les options du menu "spread-type"
    const spreadTypeSelect = document.getElementById('spread-type');
    if (spreadTypeSelect) {
      const options = spreadTypeSelect.querySelectorAll('option');
      options.forEach(option => {
        const value = option.value;
        if (value && value !== '') {
          let key = `spreadTypes.${value}`;
          option.textContent = getTranslation(key, language);
        }
      });
    }
    
    // Mettre à jour les optgroups dans le menu "ia-model"
    const iaModelSelect = document.getElementById('ia-model');
    if (iaModelSelect) {
      const optgroups = iaModelSelect.querySelectorAll('optgroup');
      optgroups.forEach(optgroup => {
        const label = optgroup.getAttribute('label');
        let key = '';
        if (label === 'Ollama' || label.toLowerCase().includes('ollama')) {
          key = 'iaGroups.ollama';
        } else if (label === 'OpenAI' || label.toLowerCase().includes('openai')) {
          key = 'iaGroups.openai';
        }
        if (key) {
          optgroup.setAttribute('label', getTranslation(key, language));
        }
      });
    }
  }
  
  /**
   * Teste la connectivité avec le modèle d'IA sélectionné
   */
  async testModelConnectivity() {
    const state = this.stateManager.getState();
    const model = state.iaModel;
    const language = state.language;
    
    try {
      const isConnected = await this.aiService.testConnectivity(model);
      
      if (!isConnected) {
        // Afficher un avertissement
        this.showWarning(
          getTranslation('connectivity.warning', language),
          getTranslation('connectivity.modelUnavailable', language),
          [
            getTranslation('connectivity.checkConnection', language),
            getTranslation('connectivity.tryOtherModel', language)
          ]
        );
        return false;
      } else {
        // Effacer les avertissements
        this.clearWarnings();
        return true;
      }
    } catch (error) {
      // Afficher l'erreur
      this.showWarning(
        getTranslation('connectivity.error', language),
        error.message,
        [getTranslation('connectivity.tryOtherModel', language)]
      );
      return false;
    }
  }
  
  /**
   * Affiche un avertissement
   * @param {string} title - Titre de l'avertissement
   * @param {string} message - Message de l'avertissement
   * @param {Array} suggestions - Suggestions pour résoudre le problème
   */
  showWarning(title, message, suggestions = []) {
    const state = this.stateManager.getState();
    const language = state.language;
    
    // Créer le contenu HTML de l'avertissement
    let warningHTML = `
      <div class="warning-box">
        <h3>⚠️ ${title}</h3>
        <p>${message}</p>
    `;
    
    // Ajouter les suggestions si présentes
    if (suggestions.length > 0) {
      warningHTML += `<p>${getTranslation('connectivity.suggestions', language) || 'Suggestions:'}</p><ul>`;
      
      suggestions.forEach(suggestion => {
        warningHTML += `<li>${suggestion}</li>`;
      });
      
      warningHTML += `</ul>`;
    }
    
    // Ajouter le bouton de fermeture
    warningHTML += `
        <button id="dismiss-warning">${getTranslation('connectivity.dismiss', language) || 'Ignorer cet avertissement'}</button>
      </div>
    `;
    
    // Afficher l'avertissement
    this.elements.warningContainer.innerHTML = warningHTML;
    
    // Ajouter un gestionnaire d'événements pour fermer l'avertissement
    document.getElementById('dismiss-warning').addEventListener('click', () => {
      this.clearWarnings();
    });
  }
  
  /**
   * Efface tous les avertissements
   */
  clearWarnings() {
    this.elements.warningContainer.innerHTML = '';
  }
  
  /**
   * Charge les modèles Ollama disponibles
   * @return {Promise<boolean>} True si un modèle Ollama a été sélectionné
   */
  async loadOllamaModels() {
    try {
      const ollamaOptgroup = this.elements.iaModelSelect.querySelector('optgroup[label="Ollama"]');
      
      // Afficher un message de chargement
      ollamaOptgroup.innerHTML = '<option disabled>Chargement des modèles...</option>';
      
      // Récupérer les modèles Ollama
      const models = await this.aiService.getOllamaModels();
      
      // Vider le groupe
      ollamaOptgroup.innerHTML = '';
      
      if (models.length === 0) {
        // Aucun modèle disponible
        ollamaOptgroup.innerHTML = '<option disabled>Aucun modèle disponible</option>';
        return false;
      }
      
      // Ajouter les modèles au select
      models.forEach((model, index) => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = model.name;
        ollamaOptgroup.appendChild(option);
      });
      
      // Chercher un modèle Llama3 pour le sélectionner par défaut
      const llama3Model = this.aiService.findLlama3Model(models);
      
      if (llama3Model) {
        // Si un modèle Llama3 est trouvé, le sélectionner par défaut
        this.elements.iaModelSelect.value = llama3Model.name;
        this.stateManager.setState({ iaModel: llama3Model.name });
        console.log(`Modèle Llama3 sélectionné par défaut: ${llama3Model.name}`);
      } else {
        // Sinon, sélectionner le premier modèle
        this.elements.iaModelSelect.value = models[0].name;
        this.stateManager.setState({ iaModel: models[0].name });
        console.log(`Premier modèle sélectionné par défaut: ${models[0].name}`);
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors du chargement des modèles Ollama:", error);
      
      // Afficher un message d'erreur
      const ollamaOptgroup = this.elements.iaModelSelect.querySelector('optgroup[label="Ollama"]');
      ollamaOptgroup.innerHTML = '<option disabled>Erreur de connexion à Ollama</option>';
      
      return false;
    }
  }
  
  /**
   * Synchronise l'interface utilisateur avec l'état actuel du StateManager
   * Garantit que les menus déroulants reflètent toujours l'état unique de vérité
   */
  syncUIWithState() {
    const state = this.stateManager.getState();
    let stateUpdated = false;
    const updates = {};
    
    // Synchroniser chaque menu avec l'état correspondant, avec fallback pour valeurs invalides
    
    // Langue
    if (this.elements.languageSelect) {
      if (this.isValidOption(this.elements.languageSelect, state.language)) {
        this.elements.languageSelect.value = state.language;
      } else {
        // Fallback: utiliser la première option valide
        const defaultLanguage = this.elements.languageSelect.options[0].value;
        this.elements.languageSelect.value = defaultLanguage;
        updates.language = defaultLanguage;
        stateUpdated = true;
      }
    }
    
    // Persona
    if (this.elements.personaSelect) {
      if (this.isValidOption(this.elements.personaSelect, state.persona)) {
        this.elements.personaSelect.value = state.persona;
      } else {
        // Fallback: utiliser la première option valide
        const defaultPersona = this.elements.personaSelect.options[0].value;
        this.elements.personaSelect.value = defaultPersona;
        updates.persona = defaultPersona;
        stateUpdated = true;
      }
    }
    
    // Jeu de cartes
    if (this.elements.cardSetSelect) {
      if (this.isValidOption(this.elements.cardSetSelect, state.cardSet)) {
        this.elements.cardSetSelect.value = state.cardSet;
      } else {
        // Fallback: utiliser la première option valide
        const defaultCardSet = this.elements.cardSetSelect.options[0].value;
        this.elements.cardSetSelect.value = defaultCardSet;
        updates.cardSet = defaultCardSet;
        stateUpdated = true;
      }
    }
    
    // Type de tirage
    if (this.elements.spreadTypeSelect) {
      if (this.isValidOption(this.elements.spreadTypeSelect, state.spreadType)) {
        this.elements.spreadTypeSelect.value = state.spreadType;
      } else {
        // Fallback: utiliser la première option valide
        const defaultSpreadType = this.elements.spreadTypeSelect.options[0].value;
        this.elements.spreadTypeSelect.value = defaultSpreadType;
        updates.spreadType = defaultSpreadType;
        stateUpdated = true;
      }
    }
    
    // Modèle IA
    if (this.elements.iaModelSelect) {
      if (this.isValidOption(this.elements.iaModelSelect, state.iaModel)) {
        this.elements.iaModelSelect.value = state.iaModel;
      } else {
        // Fallback: utiliser la première option valide
        const defaultIaModel = this.elements.iaModelSelect.options[0].value;
        this.elements.iaModelSelect.value = defaultIaModel;
        updates.iaModel = defaultIaModel;
        stateUpdated = true;
      }
    }
    
    // Si des valeurs ont été mises à jour, mettre à jour l'état
    if (stateUpdated) {
      // Mettre à jour l'état sans déclencher à nouveau syncUIWithState
      setTimeout(() => this.stateManager.setState(updates), 0);
    }
    
    // Mettre à jour les éléments visuels correspondants
    this.updatePersonaLogo(state.persona);
    this.updateAppTitle();
  }
  
  /**
   * Vérifie si une valeur est une option valide dans un select
   * @param {HTMLSelectElement} selectElement - Élément select à vérifier
   * @param {string} value - Valeur à vérifier
   * @return {boolean} - True si l'option existe, sinon False
   */
  isValidOption(selectElement, value) {
    return Array.from(selectElement.options).some(option => option.value === value);
  }
}

export default ConfigController; 