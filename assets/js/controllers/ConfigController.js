/**
 * Contrôleur responsable des configurations et préférences de l'application
 * Gère les langues, jeux de cartes, modèles IA, etc.
 */
import { getTranslation } from '../translations/index.js';
import { API_URL_OLLAMA_TAGS } from '../config.js';

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

    // Tant que la liste des modèles Ollama n'est pas chargée, le sélecteur ne
    // contient pas encore les options distantes: on évite alors d'écraser le
    // modèle restauré depuis le localStorage par un repli sur le mode prompt.
    this.modelsLoaded = false;

    // Éléments DOM
    this.elements = {
      languageSelect: document.getElementById('language'),
      personaSelect: document.getElementById('persona'),
      cardSetSelect: document.getElementById('card-set'),
      spreadTypeSelect: document.getElementById('spread-type'),
      iaModelSelect: document.getElementById('ia-model'),
      appTitle: document.getElementById('app-title'),
      personaLogo: document.getElementById('persona-logo'),
      warningContainer: document.querySelector('.model-warning-container')
    };
    
    // Initialiser les écouteurs d'événements
    this.initEventListeners();
    
    // Synchroniser l'UI avec l'état actuel lors de l'initialisation
    this.syncUIWithState();

    // S'abonner aux changements d'état pour maintenir l'UI synchronisée
    this.stateManager.subscribe((newState, changes = {}) => {
      this.syncUIWithState();

      // Traitements spécifiques
      if ('language' in changes) {
        this.updateUILanguage(newState.language);
      }
      if ('iaModel' in changes) {
        this.testModelConnectivity();
      }
    });
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
      this.aiService?.cancelCurrentInterpretation();

      // Mettre à jour l'état: l'abonnement déclenche updateUILanguage()
      this.stateManager.setState({ language });
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
      this.aiService?.cancelCurrentInterpretation();

      // Mettre à jour l'état: l'abonnement rafraîchit le logo du persona
      this.stateManager.setState({ persona });
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
    
    // Mettre à jour l'état: ReadingController réagit à `cardSet:changed`
    // pour charger le nouveau jeu et rafraîchir l'affichage.
    this.stateManager.setState({ cardSet });
  }
  
  /**
   * Change le type de tirage
   * @param {Event} event - Événement de changement
   */
  handleSpreadTypeChange(event) {
    const spreadType = event.target.value;
    try {
      // Annuler toute génération en cours
      this.aiService?.cancelCurrentInterpretation();

      // Mettre à jour l'état: ReadingController réagit à `spreadType:changed`
      this.stateManager.setState({ spreadType });
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
    this.aiService?.cancelCurrentInterpretation();

    // Nettoyer les avertissements précédents
    this.clearWarnings();

    // Un modèle OpenAI sans clé API est inutilisable: proposer directement
    // la saisie de la clé plutôt que d'échouer silencieusement.
    if (iaModel.startsWith('openai/') && !this.aiService?.apiKey) {
      this.elements.iaModelSelect.value = previousModel;
      this.showAPIKeyConfigDialog(iaModel);
      return;
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
      this.showModelWarning({ status: 'error', message: error.message });
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
    if (!this.elements.personaLogo) return;

    this.elements.personaLogo.src = `assets/images/personas/${persona}.png`;
    this.elements.personaLogo.alt = this.getPersonaLabel(persona);
  }

  /**
   * Obtient le libellé d'un persona à partir de sa valeur
   * @param {string} personaValue - La valeur du persona
   * @return {string} - Le libellé du persona
   */
  getPersonaLabel(personaValue) {
    const option = Array.from(this.elements.personaSelect?.options || [])
      .find(opt => opt.value === personaValue);
    return option ? option.text : personaValue;
  }
  
  /**
   * Met à jour le titre de l'application en fonction du type de tirage
   */
  updateAppTitle() {
    if (!this.elements.appTitle) return;

    const { spreadType, language } = this.stateManager.getState();
    const spreadTitle = getTranslation(`spreadTypes.${spreadType}`, language);

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

    // Textes statiques de l'interface: sélecteur CSS -> clé de traduction
    const staticTexts = {
      '.select-group:nth-child(1) .select-label': 'header.language',
      '.select-group:nth-child(2) .select-label': 'header.persona',
      '.select-group:nth-child(3) .select-label': 'header.cardSet',
      '.select-group:nth-child(4) .select-label': 'header.spreadType',
      '.select-group:nth-child(5) .select-label': 'header.iaModel',
      '#question-label': 'header.question',
      '#tirer': 'header.drawButton',
      '#stop-generation-text': 'header.stopGeneration',
      '#copy-button span:last-of-type': 'header.copyButton',
      '.interpretation-title': 'sections.interpretations'
    };

    for (const [selector, key] of Object.entries(staticTexts)) {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = getTranslation(key, language);
      }
    }

    // Mettre à jour le placeholder de la question
    const questionInput = document.getElementById('question');
    if (questionInput) {
      questionInput.placeholder = getTranslation('header.questionPlaceholder', language);
    }

    // Mettre à jour les textes des options des menus déroulants
    this.updateDropdownOptions(language);
  }
  
  /**
   * Met à jour les textes des options dans les menus déroulants
   * @param {string} language - Code de langue
   */
  updateDropdownOptions(language) {
    // Traduire les libellés des groupes d'options.
    // La clé de traduction est portée par l'attribut `data-optgroup-key`
    // (défini dans index.html ou à la création dynamique des groupes).
    document.querySelectorAll('optgroup[data-optgroup-key]').forEach(optgroup => {
      const key = optgroup.getAttribute('data-optgroup-key');
      optgroup.setAttribute('label', getTranslation(key, language));
    });

    // Traduire les options dont la valeur correspond à une clé de traduction
    const translatedOptions = {
      persona: 'personas',
      'spread-type': 'spreadTypes'
    };

    for (const [selectId, section] of Object.entries(translatedOptions)) {
      const select = document.getElementById(selectId);
      if (!select) continue;

      select.querySelectorAll('option').forEach(option => {
        if (!option.value) return;
        option.textContent = getTranslation(`${section}.${option.value}`, language);
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
        console.warn(`Type de modèle non reconnu: ${currentModel}, basculement sur le mode Prompt`);
        this.stateManager.setState({ iaModel: 'prompt' });
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
    if (this.elements.warningContainer) {
      this.elements.warningContainer.innerHTML = '';
    }
  }

  /**
   * Charge les modèles Ollama disponibles dans le sélecteur de modèles
   * @returns {Promise<boolean>} true si au moins un modèle Ollama est disponible
   */
  async loadOllamaModels() {
    const ollamaGroup = this.elements.iaModelSelect
      ?.querySelector('optgroup[data-optgroup-key="iaGroups.ollama"]');

    if (!ollamaGroup) {
      console.error("Groupe de modèles Ollama non trouvé dans le sélecteur");
      return false;
    }

    let models = [];
    try {
      models = await this.fetchOllamaModels();
    } catch (error) {
      console.warn("Erreur lors du chargement des modèles Ollama:", error);
    }

    // Reconstruire le contenu du groupe Ollama
    ollamaGroup.innerHTML = '';

    const available = models
      .filter(model => model?.name && !model.name.includes('partial') && !model.name.includes('downloading'))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (available.length === 0) {
      const placeholder = document.createElement('option');
      placeholder.disabled = true;
      placeholder.textContent = getTranslation('warnings.noOllamaModels', this.stateManager.getState().language);
      ollamaGroup.appendChild(placeholder);
    } else {
      available.forEach(model => {
        const option = document.createElement('option');
        option.value = `ollama:${model.name}`;
        option.textContent = model.name;
        ollamaGroup.appendChild(option);
      });
    }

    // Le sélecteur reflète désormais les modèles réellement disponibles
    this.modelsLoaded = true;
    this.resolveSelectedModel(available.length > 0 ? `ollama:${available[0].name}` : null);

    return available.length > 0;
  }

  /**
   * Récupère la liste des modèles Ollama, avec un cache court en localStorage
   * @returns {Promise<Array>} Liste des modèles retournés par Ollama
   */
  async fetchOllamaModels() {
    const CACHE_KEY = 'ollama_models_cache';
    const CACHE_TTL = 60 * 1000; // 1 minute

    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cache && Array.isArray(cache.models) && Date.now() - cache.timestamp < CACHE_TTL) {
        return cache.models;
      }
    } catch {
      // Cache absent ou corrompu: on interroge Ollama
    }

    const response = await fetch(API_URL_OLLAMA_TAGS);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.models)) {
      throw new Error('Format de réponse Ollama invalide');
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      models: data.models
    }));

    return data.models;
  }

  /**
   * Choisit le modèle à utiliser une fois la liste des modèles connue.
   * Un choix explicite de l'utilisateur est toujours respecté; au premier
   * lancement, un modèle Ollama disponible est préféré au mode prompt.
   * @param {string|null} fallbackModel - Premier modèle Ollama disponible
   */
  resolveSelectedModel(fallbackModel) {
    const current = this.stateManager.getState().iaModel;
    const select = this.elements.iaModelSelect;

    // Un modèle OpenAI n'est utilisable qu'avec une clé API
    const needsMissingApiKey = current.startsWith('openai/') && !this.aiService?.apiKey;
    const isUsable = this.isValidOption(select, current) && !needsMissingApiKey;

    // Au premier lancement (aucun état sauvegardé), privilégier Ollama s'il
    // est disponible plutôt que le mode prompt par défaut.
    const isFirstRun = !this.stateManager.hasRestoredState;

    if (isUsable && !(isFirstRun && current === 'prompt' && fallbackModel)) {
      select.value = current;
      return;
    }

    const target = fallbackModel || 'prompt';
    select.value = target;
    this.stateManager.setState({ iaModel: target });
  }

  /**
   * Synchronise l'interface utilisateur avec l'état actuel
   */
  syncUIWithState() {
    const state = this.stateManager.getState();

    const updateSelector = (selector, value) => {
      if (selector && this.isValidOption(selector, value)) {
        selector.value = value;
      }
    };

    updateSelector(this.elements.languageSelect, state.language);
    updateSelector(this.elements.personaSelect, state.persona);
    updateSelector(this.elements.cardSetSelect, state.cardSet);
    updateSelector(this.elements.spreadTypeSelect, state.spreadType);
    this.updateModelSelector(state.iaModel);

    this.updateAppTitle();
    this.updatePersonaLogo(state.persona);
  }

  /**
   * Met à jour le sélecteur de modèle IA
   * @param {string} model - Modèle IA sélectionné
   */
  updateModelSelector(model) {
    if (!this.elements.iaModelSelect) return;

    if (this.isValidOption(this.elements.iaModelSelect, model)) {
      this.elements.iaModelSelect.value = model;
      return;
    }

    // Tant que les modèles Ollama ne sont pas chargés, le sélecteur est
    // incomplet: ne pas écraser le modèle restauré depuis le localStorage.
    if (!this.modelsLoaded) return;

    console.warn(`⚠️ Modèle IA indisponible: ${model}, basculement sur le mode Prompt`);
    this.elements.iaModelSelect.value = 'prompt';
    this.stateManager.setState({ iaModel: 'prompt' });
  }

  /**
   * Vérifie si une valeur est une option valide dans un élément select
   * @param {HTMLSelectElement} selectElement - L'élément select à vérifier
   * @param {string} value - La valeur à rechercher
   * @return {boolean} True si l'option existe
   */
  isValidOption(selectElement, value) {
    if (!selectElement || typeof value !== 'string') return false;

    // `select.options` inclut déjà les options situées dans des optgroups
    return Array.from(selectElement.options)
      .some(option => option.value === value && !option.disabled);
  }

  /**
   * Affiche le dialogue de saisie de la clé API OpenAI.
   * Une fois la clé enregistrée, le modèle demandé est activé.
   * @param {string} [pendingModel] - Modèle OpenAI à activer après enregistrement
   */
  showAPIKeyConfigDialog(pendingModel = null) {
    const language = this.stateManager.getState().language;

    // Supprimer un éventuel dialogue déjà ouvert
    document.getElementById('api-key-dialog')?.remove();
    document.getElementById('api-key-overlay')?.remove();

    // Overlay de fond
    const overlay = document.createElement('div');
    overlay.id = 'api-key-overlay';
    overlay.className = 'config-dialog-overlay';

    // Dialogue
    const dialog = document.createElement('div');
    dialog.id = 'api-key-dialog';
    dialog.className = 'config-dialog';

    const close = () => {
      overlay.remove();
      dialog.remove();
    };
    overlay.onclick = close;

    const title = document.createElement('h3');
    title.textContent = getTranslation('config.apiKeyTitle', language);
    dialog.appendChild(title);

    const description = document.createElement('p');
    description.textContent = getTranslation('config.apiKeyDescription', language);
    dialog.appendChild(description);

    const apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'password';
    apiKeyInput.id = 'api-key-input';
    apiKeyInput.placeholder = 'sk-...';
    apiKeyInput.value = this.aiService.apiKey || '';
    dialog.appendChild(apiKeyInput);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'config-dialog-buttons';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = getTranslation('config.cancel', language);
    cancelButton.className = 'secondary-button';
    cancelButton.onclick = close;

    const saveButton = document.createElement('button');
    saveButton.textContent = getTranslation('config.save', language);
    saveButton.className = 'primary-button';
    saveButton.onclick = () => {
      const apiKey = apiKeyInput.value.trim();

      if (!apiKey) {
        this.showModelWarning({
          status: 'error',
          message: getTranslation('config.apiKeyEmpty', language)
        });
        return; // Laisser le dialogue ouvert pour corriger la saisie
      }

      this.aiService.setApiKey(apiKey);
      close();

      // Activer le modèle demandé maintenant que la clé est disponible
      if (pendingModel) {
        this.elements.iaModelSelect.value = pendingModel;
        this.stateManager.setState({ iaModel: pendingModel });
      } else {
        this.testModelConnectivity();
      }
    };

    buttonsContainer.append(cancelButton, saveButton);
    dialog.appendChild(buttonsContainer);

    document.body.append(overlay, dialog);
    apiKeyInput.focus();
  }
}

export default ConfigController;
