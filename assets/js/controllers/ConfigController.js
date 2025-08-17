/**
 * Contrôleur responsable des configurations et préférences de l'application
 * Gère les langues, jeux de cartes, modèles IA, etc.
 */
import StateManager from '../utils/StateManager.js';
import AIService from '../services/AIService.js';
import { createPersona } from '../main.js';
import { TRANSLATIONS, getTranslation } from '../translations/index.js';
import { updateUILanguage, updatePersonaLogo, resetAllDisplays } from '../ui.js';
import { API_URL_OLLAMA_TAGS, SETTINGS } from '../config.js';

class ConfigController {
  /**
   * @param {StateManager} stateManager - Instance du gestionnaire d'état
   * @param {AIService} aiService - Service IA pour tester la connectivité
   * @param {UIService} uiService - Service UI pour les mises à jour d'interface
   */
  constructor(stateManager, aiService, uiService) {
    this.stateManager = stateManager;
    this.aiService = aiService;
    this.uiService = uiService;
    
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
    
    // Initialiser les écouteurs d'événements
    this.initEventListeners();
    
    // Synchroniser l'UI avec l'état actuel lors de l'initialisation
    this.syncUIWithState();
    console.log('🔄 Interface synchronisée avec l\'état restauré');
    
    // S'abonner aux changements d'état pour maintenir l'UI synchronisée
    this.stateManager.subscribe((newState, changes = {}) => {
      console.log('🔄 Changement d\'état détecté:', changes);
      this.syncUIWithState();
      
      // Traitements spécifiques
      if (changes.language) {
        this.updateUILanguage(newState.language);
      }
      if (changes.spreadType) {
        this.updateAppTitle();
      }
      if (changes.iaModel) {
        this.testModelConnectivity();
      }
    });
    
    // Écouter l'événement spécifique pour la mise à jour du menu déroulant des modèles IA
    document.addEventListener('iaModelUI:update', (event) => {
      console.log('ConfigController: Réception de iaModelUI:update avec le modèle:', event.detail.model);
      this.updateModelSelectUI(event.detail.model);
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
    
    // Insérer après le sélecteur de modèle IA ou son parent
    const modelSelect = document.getElementById('ia-model');
    if (modelSelect && modelSelect.parentNode) {
      // Trouver le groupe select parent
      const selectGroup = modelSelect.closest('.select-group');
      if (selectGroup) {
        selectGroup.appendChild(container);
      } else {
        // Fallback: insérer après le parent direct du select
        modelSelect.parentNode.appendChild(container);
      }
    } else {
      // Fallback: insérer dans le header
      const header = document.querySelector('.header');
      if (header) {
        header.appendChild(container);
      } else {
        // Dernier fallback: ajouter au body
        document.body.appendChild(container);
      }
    }
    
    return container;
  }
  
  /**
   * Initialise les écouteurs d'événements
   */
  initEventListeners() {
    // Vérifier que tous les éléments existent avant d'ajouter les écouteurs
    if (!this.elements.languageSelect || !this.elements.personaSelect || 
        !this.elements.cardSetSelect || !this.elements.spreadTypeSelect || 
        !this.elements.iaModelSelect) {
      console.error("Certains éléments du formulaire sont manquants");
      return;
    }

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
    
    console.log("Écouteurs d'événements initialisés avec succès");
  }
  
  /**
   * Change la langue de l'application
   * @param {Event} event - Événement de changement
   */
  handleLanguageChange(event) {
    const language = event.target.value;
    try {
      // Annuler toute génération en cours
      if (this.aiService && this.aiService.cancelCurrentInterpretation()) {
        console.log('Génération annulée suite au changement de langue');
        // Suppression de l'affichage du message
      }
      
      // Mettre à jour l'état
      this.stateManager.setState({ language });
      
      // Mettre à jour l'interface
      this.updateUILanguage(language);
      
      console.log(`✅ Langue changée pour: ${language}`);
    } catch (error) {
      console.error("Erreur lors du changement de langue:", error);
    }
  }
  
  /**
   * Change le persona utilisé pour les interprétations
   * @param {Event} event - Événement de changement
   */
  handlePersonaChange(event) {
    const persona = event.target.value;
    try {
      // Annuler toute génération en cours
      if (this.aiService && this.aiService.cancelCurrentInterpretation()) {
        console.log('Génération annulée suite au changement de persona');
        // Suppression de l'affichage du message
      }
      
      // Mettre à jour l'état
      this.stateManager.setState({ persona });
      
      // Mettre à jour l'interface
      this.updatePersonaLogo(persona);
      
      console.log(`✅ Persona changé pour: ${persona}`);
    } catch (error) {
      console.error("Erreur lors du changement de persona:", error);
    }
  }
  
  /**
   * Gère le changement de jeu de cartes
   * @param {Event} event - Événement de changement
   */
  handleCardSetChange(event) {
    const cardSet = event.target.value;
    
    if (!cardSet) {
      console.warn('⚠️ Valeur de jeu de cartes non spécifiée');
      return;
    }
    
    console.log(`🔄 Changement de jeu de cartes détecté: ${cardSet}`);
    
    // Mettre à jour l'état avec la nouvelle valeur de cardSet
    this.stateManager.setState({ cardSet });
    
    console.log(`✅ Jeu de cartes changé et sauvegardé dans localStorage: ${cardSet}`);
    
    // Déclencher un événement pour informer les autres composants
    document.dispatchEvent(new CustomEvent('deckId:changed', { detail: { deckId: cardSet } }));
  }
  
  /**
   * Change le type de tirage
   * @param {Event} event - Événement de changement
   */
  handleSpreadTypeChange(event) {
    const spreadType = event.target.value;
    try {
      // Annuler toute génération en cours
      if (this.aiService && this.aiService.cancelCurrentInterpretation()) {
        console.log('Génération annulée suite au changement de type de tirage');
        // Suppression de l'affichage du message
      }
      
      // Mettre à jour l'état
      this.stateManager.setState({ spreadType });
      
      console.log(`✅ Type de tirage changé pour: ${spreadType}`);
    } catch (error) {
      console.error("Erreur lors du changement de type de tirage:", error);
    }
  }
  
  /**
   * Gère le changement de modèle d'IA
   * @param {Event} event - L'événement de changement
   */
  async handleModelChange(event) {
    const iaModel = event.target.value;
    const previousModel = this.stateManager.getState().iaModel;
    
    if (iaModel === previousModel) {
      return; // Pas de changement, ne rien faire
    }
    
    // Annuler toute génération en cours
    if (this.aiService && this.aiService.cancelCurrentInterpretation()) {
      console.log('Génération annulée suite au changement de modèle d\'IA');
      // Suppression de l'affichage du message
    }
    
    // Nettoyer les avertissements précédents
    if (this.elements.warningContainer) {
      this.clearWarnings();
    }
    
    // Désactiver le sélecteur pendant le test pour éviter les clics multiples
    this.elements.iaModelSelect.disabled = true;
    
    try {
      // Tester la disponibilité du modèle avant de changer l'état
      const modelTest = await this.aiService.testModelAvailability(iaModel);
      
      // Vérifier que modelTest n'est pas undefined
      if (!modelTest) {
        throw new Error(`Résultat du test pour le modèle ${iaModel} non disponible`);
      }
      
      if (modelTest.available) {
        // Le modèle est disponible, mettre à jour l'état
        this.stateManager.setState({ iaModel });
        
        // Ne plus afficher le message de modèle actif
        // Mais nous gardons la mise à jour du statut qui peut avoir d'autres effets
        if (this.uiService) {
          this.uiService.updateStatusIndicators(this.stateManager.getState());
        } else {
          console.warn("uiService n'est pas défini lors de la mise à jour des indicateurs de statut");
        }
      } else {
        // Le modèle n'est pas disponible, annuler le changement
        console.warn(`Modèle ${iaModel} non disponible:`, modelTest);
        this.elements.iaModelSelect.value = previousModel;
        
        // Afficher un avertissement
        this.showModelWarning(modelTest);
      }
    } catch (error) {
      // En cas d'erreur, annuler le changement
      console.error(`Erreur lors du test du modèle ${iaModel}:`, error);
      this.elements.iaModelSelect.value = previousModel;
      
      // Afficher l'erreur dans le conteneur d'avertissement
      this.showModelWarning({
        title: 'Erreur de changement de modèle',
        message: `${error.message}`,
        suggestions: ['Vérifier la disponibilité du modèle', 'Vérifier la configuration de votre API']
      });
    } finally {
      // Réactiver le sélecteur dans tous les cas
      this.elements.iaModelSelect.disabled = false;
    }
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
    
    // Mettre à jour le texte promotionnel pour Ollama si présent
    const ollamaPromo = document.getElementById('ollama-promo');
    if (ollamaPromo) {
      ollamaPromo.innerHTML = getTranslation('interpretation.ollamaPromo', language);
    }
    
    // Mettre à jour le titre de la section d'interprétation
    const interpretationTitle = document.querySelector('.interpretation-title');
    if (interpretationTitle) {
      interpretationTitle.textContent = getTranslation('sections.interpretations', language);
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
   * Teste la connectivité avec le modèle sélectionné
   * @returns {Promise<void>}
   */
  async testModelConnectivity() {
    const currentModel = this.stateManager.getState().iaModel;
    
    // Le mode prompt est toujours disponible
    if (currentModel === 'prompt') {
      this.clearWarnings();
      return;
    }
    
    try {
      // Tester la connectivité selon le type de modèle
      let status;
      
      if (currentModel.startsWith('openai/')) {
        // Test de connectivité OpenAI
        status = await this.aiService.testOpenAIConnectivity();
      } else if (currentModel.startsWith('ollama:')) {
        // Pour Ollama, on considère que c'est toujours disponible
        status = {
          status: 'success',
          message: 'Modèle Ollama disponible',
          available: true
        };
      } else {
        console.warn(`Type de modèle non reconnu: ${currentModel}`);
        this.selectPromptMode(); // Fallback sur le mode prompt
        return;
      }
      
      // Afficher les avertissements appropriés
      this.showModelWarning(status);
      
    } catch (error) {
      console.error('Erreur lors du test de connectivité:', error);
      this.showModelWarning({
        status: 'error',
        message: error.message
      });
    }
  }
  
  /**
   * Affiche un avertissement concernant le modèle
   * @param {Object} status - Statut du modèle
   */
  showModelWarning(status) {
    // Si c'est le mode prompt, ne pas afficher d'avertissement
    if (this.stateManager.getState().iaModel === 'prompt') {
      this.clearWarnings();
      return;
    }

    // Créer ou récupérer le conteneur d'avertissement
    const warningContainer = this.elements.warningContainer;
    if (!warningContainer) return;

    // Vider les avertissements existants
    warningContainer.innerHTML = '';

    // Si le statut est un succès, ne pas afficher d'avertissement
    if (status.status === 'success') {
      this.clearWarnings();
      return;
    }

    // Créer le message d'avertissement
    const warningElement = document.createElement('div');
    warningElement.className = `warning-message warning-${status.status}`;
    warningElement.textContent = status.message;

    // Ajouter le message au conteneur
    warningContainer.appendChild(warningElement);
  }
  
  /**
   * Efface tous les avertissements
   */
  clearWarnings() {
    this.elements.warningContainer.innerHTML = '';
  }
  
  /**
   * Charge les modèles Ollama disponibles
   * @returns {Promise<boolean>} true si des modèles ont été chargés, false sinon
   */
  async loadOllamaModels() {
    try {
      // Vérifier que le select existe
      if (!this.elements.iaModelSelect) {
        console.error("Sélecteur de modèles IA non trouvé");
        return false;
      }

      // Sauvegarder les options existantes importantes
      const promptOption = Array.from(this.elements.iaModelSelect.options)
        .find(option => option.value === 'prompt');
      // Rechercher un optgroup OpenAI quel que soit l'emoji dans le label
      let openaiGroup = Array.from(this.elements.iaModelSelect.querySelectorAll('optgroup'))
        .find(og => (og.getAttribute('label') || '').toLowerCase().includes('openai'));

      // Vider le select
      this.elements.iaModelSelect.innerHTML = '';

      // Restaurer l'option prompt en première position
      if (promptOption) {
        this.elements.iaModelSelect.appendChild(promptOption);
      } else {
        // Créer l'option prompt si elle n'existait pas
        const newPromptOption = document.createElement('option');
        newPromptOption.value = 'prompt';
        newPromptOption.text = '📝 Prompt (Sans IA)';
        this.elements.iaModelSelect.appendChild(newPromptOption);
      }

      // Restaurer le groupe OpenAI s'il existait
      if (openaiGroup) {
        this.elements.iaModelSelect.appendChild(openaiGroup);
      } else {
        // Créer le groupe OpenAI s'il n'existait pas
        const newOpenAIGroup = document.createElement('optgroup');
        newOpenAIGroup.label = '🧠 OpenAI';
        
        // Ajouter les modèles OpenAI
        const openaiModels = [
          { value: 'openai/gpt-4', text: 'GPT-4' },
          { value: 'openai/gpt-3.5-turbo', text: 'GPT-3.5 Turbo' }
        ];
        
        openaiModels.forEach(model => {
          const option = document.createElement('option');
          option.value = model.value;
          option.textContent = model.text;
          newOpenAIGroup.appendChild(option);
        });
        
        this.elements.iaModelSelect.appendChild(newOpenAIGroup);
      }

      // Créer ou mettre à jour le groupe Ollama
      let ollamaGroup = Array.from(this.elements.iaModelSelect.querySelectorAll('optgroup'))
        .find(og => (og.getAttribute('label') || '').toLowerCase().includes('ollama'));
      if (!ollamaGroup) {
        ollamaGroup = document.createElement('optgroup');
        ollamaGroup.label = '🤖 Ollama';
        this.elements.iaModelSelect.appendChild(ollamaGroup);
      }

      // Afficher un message de chargement dans le groupe Ollama
      ollamaGroup.innerHTML = '<option disabled>Chargement des modèles Ollama...</option>';

      // Vérifier la cache
      const cacheKey = 'ollama_models_cache';
      const cacheTimeout = 60 * 1000; // 1 minute de cache
      const cachedData = localStorage.getItem(cacheKey);
      
      let ollamaModels = [];
      let usedCache = false;
      
      if (cachedData) {
        try {
          const cache = JSON.parse(cachedData);
          const now = Date.now();
          
          if (cache.timestamp && (now - cache.timestamp < cacheTimeout) && cache.models && Array.isArray(cache.models)) {
            ollamaModels = cache.models;
            usedCache = true;
            console.log("Utilisation de la cache pour les modèles Ollama", ollamaModels.length, "modèles");
          }
        } catch (e) {
          console.warn("Erreur lors de la lecture de la cache Ollama:", e);
        }
      }

      // Si pas de cache valide, récupérer les modèles
      if (!usedCache) {
        try {
          const response = await fetch(API_URL_OLLAMA_TAGS);
          
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data.models || !Array.isArray(data.models)) {
            throw new Error('Format de réponse Ollama invalide');
          }
          
          ollamaModels = data.models;
          
          // Mettre en cache
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            models: ollamaModels
          }));
        } catch (error) {
          console.warn("Erreur lors du chargement des modèles Ollama:", error);
          ollamaGroup.innerHTML = '<option disabled>Erreur de chargement des modèles</option>';
          return false;
        }
      }

      // Mettre à jour le groupe Ollama avec les modèles disponibles
      ollamaGroup.innerHTML = '';
      
      if (ollamaModels && ollamaModels.length > 0) {
        ollamaModels
          .filter(model => !model.name.includes('partial') && !model.name.includes('downloading'))
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach(model => {
            const option = document.createElement('option');
            option.value = `ollama:${model.name}`;
            option.textContent = model.name;
            ollamaGroup.appendChild(option);
          });
      } else {
        ollamaGroup.innerHTML = '<option disabled>Aucun modèle Ollama disponible</option>';
      }

      // Choisir un modèle par défaut: préférer le premier modèle Ollama si disponible
      const current = this.stateManager.getState().iaModel;
      const selectEl = this.elements.iaModelSelect;
      const firstOllamaOption = ollamaGroup.querySelector('option:not([disabled])');

      if (firstOllamaOption) {
        const hasOpenAIKey = !!(this.aiService && this.aiService.apiKey);
        const isCurrentOllama = typeof current === 'string' && current.startsWith('ollama:');
        const isCurrentOpenAI = typeof current === 'string' && current.startsWith('openai/');
        const isCurrentPrompt = current === 'prompt' || !current;

        // Si l'état actuel est prompt ou un modèle OpenAI, préférer le premier modèle Ollama
        if (isCurrentPrompt || (isCurrentOpenAI && !hasOpenAIKey)) {
          selectEl.value = firstOllamaOption.value;
          this.stateManager.setState({ iaModel: firstOllamaOption.value });
        } else if (isCurrentOllama && this.isValidOption(selectEl, current)) {
          // Respecter un modèle Ollama existant si valide
          selectEl.value = current;
        } else if (!this.isValidOption(selectEl, current)) {
          // Si le modèle actuel est invalide, basculer sur le premier Ollama
          selectEl.value = firstOllamaOption.value;
          this.stateManager.setState({ iaModel: firstOllamaOption.value });
        }
      }

      return true;
    } catch (error) {
      console.error("Erreur lors du chargement des modèles Ollama:", error);
      return false;
    }
  }
  
  /**
   * Sélectionne le modèle OpenAI par défaut
   */
  selectDefaultOpenAIModel() {
    const defaultOpenAI = 'openai/gpt-3.5-turbo';
    console.log(`Sélection du modèle OpenAI par défaut: ${defaultOpenAI}`);
    
    // D'abord mettre à jour le select
    if (this.elements.iaModelSelect) {
      this.elements.iaModelSelect.value = defaultOpenAI;
    }
    
    // Ensuite mettre à jour l'état
    this.stateManager.setState({ iaModel: defaultOpenAI });
  }
  
  /**
   * Sélectionne l'option "Prompt" comme mode par défaut quand aucun modèle d'IA n'est disponible
   */
  selectPromptMode() {
    const promptMode = 'prompt';
    console.log(`Aucun modèle d'IA disponible. Sélection du mode Prompt: ${promptMode}`);
    
    // D'abord mettre à jour le select
    if (this.elements.iaModelSelect) {
      this.elements.iaModelSelect.value = promptMode;
    }
    
    // Ensuite mettre à jour l'état
    this.stateManager.setState({ iaModel: promptMode });
  }
  
  /**
   * Synchronise l'interface utilisateur avec l'état actuel
   * @param {Object} previousState - État précédent pour comparaison
   */
  syncUIWithState(previousState = null) {
    const state = this.stateManager.getState();
    
    // Mise à jour des sélecteurs
    this.updateSelectors(state, previousState);
    
    // Mise à jour des autres éléments UI
    this.updateOtherUIElements(state);
    
    console.log('✅ Synchronisation UI/État terminée');
  }
  
  /**
   * Met à jour les sélecteurs avec l'état actuel
   * @param {Object} state - État actuel
   * @param {Object} previousState - État précédent (optionnel)
   */
  updateSelectors(state, previousState = null) {
    // Fonction helper pour mettre à jour un sélecteur
    const updateSelector = (selector, value, key) => {
      if (!selector) return;
      
      // Vérifier si la valeur est une option valide
      if (this.isValidOption(selector, value)) {
        selector.value = value;
        console.log(`✅ Mise à jour du sélecteur ${key}: ${value}`);
      } else {
        console.warn(`⚠️ Valeur invalide pour ${key}: ${value}`);
      }
    };

    // Mise à jour de la langue
    if (!previousState || previousState.language !== state.language) {
      updateSelector(this.elements.languageSelect, state.language, 'language');
      this.updateDropdownOptions(state.language);
    }

    // Mise à jour du persona
    if (!previousState || previousState.persona !== state.persona) {
      updateSelector(this.elements.personaSelect, state.persona, 'persona');
      this.updatePersonaLogo(state.persona);
    }

    // Mise à jour du jeu de cartes
    if (!previousState || previousState.cardSet !== state.cardSet) {
      updateSelector(this.elements.cardSetSelect, state.cardSet, 'cardSet');
    }

    // Mise à jour du type de tirage
    if (!previousState || previousState.spreadType !== state.spreadType) {
      updateSelector(this.elements.spreadTypeSelect, state.spreadType, 'spreadType');
      this.updateAppTitle();
    }

    // Mise à jour du modèle IA
    if (!previousState || previousState.iaModel !== state.iaModel) {
      this.updateModelSelector(state.iaModel);
    }
  }
  
  /**
   * Met à jour le sélecteur de modèle IA
   * @param {string} model - Modèle IA sélectionné
   */
  updateModelSelector(model) {
    if (!this.elements.iaModelSelect) return;

    // Cas spécial pour le mode "prompt"
    if (model === 'prompt') {
      this.ensurePromptOption();
      this.elements.iaModelSelect.value = 'prompt';
      console.log('✅ Mode Prompt sélectionné');
      return;
    }

    // Si modèle OpenAI mais clé absente -> avertir et basculer en prompt
    if (model && model.startsWith('openai/') && (!this.aiService || !this.aiService.apiKey)) {
      this.showModelWarning({
        status: 'error',
        message: 'Clé API OpenAI manquante'
      });
      this.ensurePromptOption();
      this.elements.iaModelSelect.value = 'prompt';
      this.stateManager.setState({ iaModel: 'prompt' });
      return;
    }

    // Vérifier si le modèle est une option valide
    if (this.isValidOption(this.elements.iaModelSelect, model)) {
      this.elements.iaModelSelect.value = model;
      console.log(`✅ Modèle IA sélectionné: ${model}`);
    } else {
      console.warn(`⚠️ Modèle IA invalide: ${model}`);
      // Basculer sur le mode prompt par défaut
      if (this.isValidOption(this.elements.iaModelSelect, 'prompt')) {
        console.log('🔄 Basculement sur le mode Prompt');
        this.elements.iaModelSelect.value = 'prompt';
        this.stateManager.setState({ iaModel: 'prompt' });
      }
    }
  }
  
  /**
   * S'assure que l'option "prompt" existe dans le sélecteur de modèle IA
   */
  ensurePromptOption() {
    let promptOption = Array.from(this.elements.iaModelSelect.options)
      .find(option => option.value === 'prompt');

    if (!promptOption) {
      console.log('➕ Ajout de l\'option Prompt');
      promptOption = document.createElement('option');
      promptOption.value = 'prompt';
      promptOption.text = '📝 Prompt (Sans IA)';
      this.elements.iaModelSelect.insertBefore(
        promptOption,
        this.elements.iaModelSelect.firstChild
      );
    }
  }
  
  /**
   * Met à jour les autres éléments UI
   * @param {Object} state - État actuel
   */
  updateOtherUIElements(state) {
    // Mise à jour du titre de l'application
    this.updateAppTitle();

    // Mise à jour des logos et icônes
    this.updatePersonaLogo(state.persona);
  }
  
  /**
   * Met à jour les avertissements de connectivité
   * @param {Object} state - État actuel
   */
  updateConnectivityWarnings(state) {
    // Si c'est le mode prompt, ne pas afficher d'avertissement
    if (state.iaModel === 'prompt') {
      this.clearWarnings();
      return;
    }

    // Tester la connectivité du modèle actuel
    this.testModelConnectivity();
  }
  
  /**
   * Vérifie si une valeur est une option valide dans un élément select
   * @param {HTMLSelectElement} selectElement - L'élément select à vérifier
   * @param {string} value - La valeur à rechercher
   * @return {boolean} True si l'option existe
   */
  isValidOption(selectElement, value) {
    if (!selectElement) return false;
    
    // Cas spécial pour prompt - toujours considéré comme valide
    if (value === 'prompt') {
      return true;
    }
    
    // Pour les modèles Ollama, vérifier avec et sans le préfixe
    const valueToCheck = value.startsWith('ollama:') ? [value, value.replace('ollama:', '')] : [value];
    
    // Vérifier directement dans les options du select
    if (Array.from(selectElement.options).some(option => valueToCheck.includes(option.value))) {
      return true;
    }
    
    // Vérifier également dans les optgroups
    const optgroups = selectElement.querySelectorAll('optgroup');
    for (const optgroup of optgroups) {
      const options = optgroup.querySelectorAll('option');
      if (Array.from(options).some(option => valueToCheck.includes(option.value))) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Met à jour explicitement le menu déroulant des modèles IA pour refléter le modèle actuellement sélectionné
   * @param {string} modelName - Le nom du modèle à sélectionner dans l'interface
   */
  updateModelSelectUI(modelName) {
    if (!this.elements.iaModelSelect) {
      console.error("Élément select des modèles IA non trouvé");
      return;
    }
    
    // Vérifier si le modèle existe dans les options
    if (this.isValidOption(this.elements.iaModelSelect, modelName)) {
      // Mettre à jour la valeur affichée
      this.elements.iaModelSelect.value = modelName;
      // Utiliser console.debug au lieu de console.log pour réduire la verbosité
      console.debug(`Menu déroulant mis à jour pour afficher: ${modelName}`);
    } else {
      console.warn(`Modèle ${modelName} non trouvé dans les options du menu déroulant`);
      
      // Si le modèle n'est pas dans les options, vérifier s'il s'agit d'un modèle Ollama
      if (!modelName.startsWith('openai/')) {
        // Tenter de l'ajouter dynamiquement au groupe Ollama
        const ollamaOptgroup = Array.from(this.elements.iaModelSelect.querySelectorAll('optgroup'))
          .find(og => (og.getAttribute('label') || '').toLowerCase().includes('ollama'));
        if (ollamaOptgroup) {
          const option = document.createElement('option');
          option.value = modelName;
          option.textContent = modelName;
          ollamaOptgroup.appendChild(option);
          this.elements.iaModelSelect.value = modelName;
          console.log(`Modèle ${modelName} ajouté dynamiquement au menu déroulant`);
        }
      }
    }
  }
  
  /**
   * Affiche un message temporaire
   * @param {string} message - Le message à afficher
   * @param {string} type - Le type de message (success, warning, error, info)
   * @param {number} duration - La durée d'affichage en millisecondes
   */
  showTemporaryMessage(message, type = 'info', duration = 3000) {
    // Ne pas afficher le message "Génération arrêtée"
    if (message === 'Génération arrêtée' || message.includes('Génération arrêt')) {
      return;
    }
    
    // Créer ou récupérer l'élément de message
    let messageElement = document.getElementById('status-message');
    
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.id = 'status-message';
      
      // Placer le message sous le bouton "Tirer les cartes" dans le controls-container
      const controlsContainer = document.querySelector('.controls-container');
      if (controlsContainer) {
        controlsContainer.appendChild(messageElement);
      } else {
        // Fallback: ajouter au corps du document
        document.body.appendChild(messageElement);
      }
    }
    
    // Définir le contenu et le style
    messageElement.textContent = message;
    messageElement.className = `${type}-message status-indicator`;
    messageElement.style.display = 'block';
    
    // Ne plus masquer automatiquement après la durée spécifiée pour les messages de succès du modèle
    if (type !== 'success' || !message.includes('Modèle') || !message.includes('activé avec succès')) {
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, duration);
    }
  }
  
  /**
   * Affiche une interface pour permettre à l'utilisateur de configurer sa clé API OpenAI
   */
  showAPIKeyConfigDialog() {
    // Supprimer le dialogue existant s'il y en a un
    const existingDialog = document.getElementById('api-key-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }
    
    // Créer le dialogue
    const dialog = document.createElement('div');
    dialog.id = 'api-key-dialog';
    dialog.className = 'config-dialog';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    dialog.style.zIndex = '1000';
    dialog.style.width = '400px';
    dialog.style.maxWidth = '90%';
    
    // Overlay de fond
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    overlay.onclick = () => {
      overlay.remove();
      dialog.remove();
    };
    
    // Titre
    const title = document.createElement('h3');
    title.textContent = getTranslation('config.apiKeyTitle', this.stateManager.getState().language);
    title.style.marginTop = '0';
    dialog.appendChild(title);
    
    // Description
    const description = document.createElement('p');
    description.textContent = getTranslation('config.apiKeyDescription', this.stateManager.getState().language);
    dialog.appendChild(description);
    
    // Champ pour la clé API
    const apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'text';
    apiKeyInput.id = 'api-key-input';
    apiKeyInput.placeholder = 'sk-...';
    apiKeyInput.value = this.aiService.apiKey && this.aiService.apiKey !== 'YOUR API KEY' ? this.aiService.apiKey : '';
    apiKeyInput.style.width = '100%';
    apiKeyInput.style.padding = '8px';
    apiKeyInput.style.marginBottom = '15px';
    apiKeyInput.style.borderRadius = '4px';
    apiKeyInput.style.border = '1px solid #ccc';
    dialog.appendChild(apiKeyInput);
    
    // Boutons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'flex-end';
    buttonsContainer.style.gap = '10px';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = getTranslation('config.cancel', this.stateManager.getState().language);
    cancelButton.className = 'secondary-button';
    cancelButton.onclick = () => {
      overlay.remove();
      dialog.remove();
    };
    
    const saveButton = document.createElement('button');
    saveButton.textContent = getTranslation('config.save', this.stateManager.getState().language);
    saveButton.className = 'primary-button';
    saveButton.onclick = () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        this.aiService.setApiKey(apiKey);
        this.showTemporaryMessage(
          getTranslation('config.apiKeySaved', this.stateManager.getState().language),
          'success',
          3000
        );
        
        // Tester à nouveau la connexion avec le modèle actuel
        this.testModelConnectivity();
      } else {
        // Message d'erreur si la clé est vide
        this.showTemporaryMessage(
          getTranslation('config.apiKeyEmpty', this.stateManager.getState().language),
          'error',
          3000
        );
      }
      overlay.remove();
      dialog.remove();
    };
    
    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(saveButton);
    dialog.appendChild(buttonsContainer);
    
    // Ajouter au document
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
    
    // Focus sur le champ
    setTimeout(() => apiKeyInput.focus(), 100);
  }
  
  /**
   * Sélectionne le premier modèle Ollama disponible
   */
  selectFirstOllamaModel() {
    // Obtenir le premier modèle du groupe Ollama
    const ollamaOptgroup = Array.from(this.elements.iaModelSelect.querySelectorAll('optgroup'))
      .find(og => (og.getAttribute('label') || '').toLowerCase().includes('ollama'));
    if (ollamaOptgroup && ollamaOptgroup.querySelector('option')) {
      const firstOption = ollamaOptgroup.querySelector('option');
      const ollamaModel = firstOption.value;
      
      console.log(`Sélection du premier modèle Ollama disponible: ${ollamaModel}`);
      
      // D'abord mettre à jour le select
      if (this.elements.iaModelSelect) {
        this.elements.iaModelSelect.value = ollamaModel;
      }
      
      // Ensuite mettre à jour l'état
      this.stateManager.setState({ iaModel: ollamaModel });
    }
  }
}

export default ConfigController; 