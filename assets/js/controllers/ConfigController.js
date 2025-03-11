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
   * Change le jeu de cartes utilisé
   * @param {Event} event - Événement de changement
   */
  handleCardSetChange(event) {
    const cardSet = event.target.value;
    try {
      // Annuler toute génération en cours
      if (this.aiService && this.aiService.cancelCurrentInterpretation()) {
        console.log('Génération annulée suite au changement de jeu de cartes');
      }
      
      // Mettre à jour l'état
      this.stateManager.setState({ cardSet });
      
      console.log(`✅ Jeu de cartes changé pour: ${cardSet}`);
      
      // Émettre un événement pour notifier le changement de jeu
      document.dispatchEvent(new CustomEvent('deckId:changed', { detail: { deckId: cardSet } }));
    } catch (error) {
      console.error("Erreur lors du changement de jeu de cartes:", error);
    }
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
   * Teste la connectivité avec le modèle d'IA sélectionné
   * et affiche des avertissements appropriés en cas de problème
   */
  async testModelConnectivity() {
    const state = this.stateManager.getState();
    const modelName = state.iaModel;
    
    try {
      this.clearWarnings();
      
      // Si aucun modèle n'est spécifié, ne rien faire
      if (!modelName) {
        console.warn('Tentative de test de connectivité sans modèle spécifié');
        return;
      }
      
      // Si c'est un modèle OpenAI et qu'il n'y a pas de clé API configurée,
      // afficher un avertissement spécifique
      if (modelName.startsWith('openai/') && (!this.aiService.apiKey || this.aiService.apiKey === "YOUR API KEY")) {
        console.warn(`La clé API OpenAI n'est pas configurée pour utiliser ${modelName}`);
        
        this.showModelWarning({
          title: getTranslation('warnings.apiKeyMissing', state.language),
          message: getTranslation('warnings.apiKeyMissingDetails', state.language, { modelName }),
          suggestions: [
            getTranslation('warnings.configureAPIKey', state.language),
            getTranslation('warnings.useLocalModel', state.language)
          ]
        });
        
        // Ajouter un bouton pour configurer la clé API
        const configButton = document.createElement('button');
        configButton.textContent = getTranslation('config.configureAPIKey', state.language);
        configButton.className = 'config-button';
        configButton.style.marginTop = '10px';
        configButton.style.padding = '8px 12px';
        configButton.style.backgroundColor = '#4CAF50';
        configButton.style.color = 'white';
        configButton.style.border = 'none';
        configButton.style.borderRadius = '4px';
        configButton.style.cursor = 'pointer';
        configButton.onclick = () => this.showAPIKeyConfigDialog();
        
        const warningElement = document.querySelector('.warning-message');
        if (warningElement) {
          warningElement.appendChild(configButton);
        }
        
        // On ne recharge pas automatiquement les modèles Ollama ici pour éviter les doublons
        // Ajouter juste un bouton pour suggérer de passer à Ollama
        const switchToOllamaButton = document.createElement('button');
        switchToOllamaButton.textContent = getTranslation('warnings.useLocalModel', state.language);
        switchToOllamaButton.className = 'config-button';
        switchToOllamaButton.style.marginTop = '10px';
        switchToOllamaButton.style.marginLeft = '10px';
        switchToOllamaButton.style.padding = '8px 12px';
        switchToOllamaButton.style.backgroundColor = '#2196F3';
        switchToOllamaButton.style.color = 'white';
        switchToOllamaButton.style.border = 'none';
        switchToOllamaButton.style.borderRadius = '4px';
        switchToOllamaButton.style.cursor = 'pointer';
        switchToOllamaButton.onclick = async () => {
          // On recharge les modèles Ollama seulement lorsque l'utilisateur clique sur le bouton
          await this.loadOllamaModels();
        };
        
        if (warningElement) {
          warningElement.appendChild(switchToOllamaButton);
        }
        
        return;
      }
      
      // Utiliser le test amélioré qui fournit des informations détaillées
      const result = await this.aiService.testModelAvailability(modelName);
      
      if (!result.available) {
        console.warn(`Modèle ${modelName} non disponible:`, result);
        
        // Si le modèle n'est pas disponible, afficher un avertissement approprié
        // mais ne pas recharger automatiquement les modèles pour éviter les doublons
        if (modelName.startsWith('ollama:')) {
          // Au lieu de recharger automatiquement, proposer un bouton
          this.showModelWarning({
            title: getTranslation('warnings.modelUnavailable', state.language),
            message: result.message || getTranslation('warnings.modelUnavailableDetails', state.language, { modelName }),
            suggestions: [
              getTranslation('warnings.checkOllamaRunning', state.language),
              getTranslation('warnings.refreshOllamaModels', state.language),
              getTranslation('warnings.selectDifferentModel', state.language)
            ]
          });
          
          // Ajouter un bouton pour recharger la liste des modèles
          const refreshButton = document.createElement('button');
          refreshButton.textContent = getTranslation('warnings.refreshOllamaModels', state.language);
          refreshButton.className = 'config-button';
          refreshButton.style.marginTop = '10px';
          refreshButton.style.padding = '8px 12px';
          refreshButton.style.backgroundColor = '#2196F3';
          refreshButton.style.color = 'white';
          refreshButton.style.border = 'none';
          refreshButton.style.borderRadius = '4px';
          refreshButton.style.cursor = 'pointer';
          refreshButton.onclick = async () => {
            await this.loadOllamaModels();
          };
          
          setTimeout(() => {
            const warningElement = document.querySelector('.warning-message');
            if (warningElement) {
              warningElement.appendChild(refreshButton);
            }
          }, 100);
        } else if (modelName.startsWith('openai/')) {
          // Si l'échec est dû à une clé API invalide, proposer de la configurer
          if (result.message && result.message.includes('API')) {
            const configButton = document.createElement('button');
            configButton.textContent = getTranslation('config.configureAPIKey', state.language);
            configButton.className = 'config-button';
            configButton.style.marginTop = '10px';
            configButton.style.padding = '8px 12px';
            configButton.style.backgroundColor = '#4CAF50';
            configButton.style.color = 'white';
            configButton.style.border = 'none';
            configButton.style.borderRadius = '4px';
            configButton.style.cursor = 'pointer';
            configButton.onclick = () => this.showAPIKeyConfigDialog();
            
            // Ajouter après l'affichage de l'avertissement
            setTimeout(() => {
              const warningElement = document.querySelector('.warning-message');
              if (warningElement) {
                warningElement.appendChild(configButton);
              }
            }, 100);
          }
          
          this.selectDefaultOpenAIModel();
        }
        
        // Utiliser les suggestions fournies par le test de disponibilité
        // ou une liste par défaut si aucune suggestion n'est fournie
        const suggestions = result.suggestions && result.suggestions.length > 0 
          ? result.suggestions.map(s => getTranslation(s, state.language, s))
          : [
              getTranslation('warnings.checkConnection', state.language),
              getTranslation('warnings.tryAgain', state.language)
            ];
        
        // Afficher un avertissement avec les informations détaillées
        this.showModelWarning({
          title: getTranslation('warnings.modelUnavailable', state.language),
          message: result.message || getTranslation('warnings.modelUnavailableDetails', state.language, { modelName }),
          suggestions: suggestions
        });
      } else {
        console.log(`Modèle ${modelName} disponible:`, result);
      }
    } catch (error) {
      console.error('Erreur lors du test de connectivité:', error);
      this.showModelWarning({
        title: getTranslation('warnings.error', state.language),
        message: error.message,
        suggestions: [getTranslation('warnings.tryAgain', state.language)]
      });
    }
  }
  
  /**
   * Affiche un avertissement
   * @param {Object} status - Objet contenant les informations de l'avertissement
   */
  showModelWarning(status) {
    const language = this.stateManager.getState().language || 'fr';
    
    // Extraire les informations de l'état et s'assurer qu'elles existent
    const { title = 'warnings.modelUnavailable', message = '', suggestions = [] } = status || {};
    
    // S'assurer que le conteneur d'avertissement existe
    if (!this.elements.warningContainer) {
      this.elements.warningContainer = this.createWarningContainer();
    } else {
      // Nettoyer les avertissements précédents
      this.clearWarnings();
    }
    
    // Traduire le titre
    const translatedTitle = title.startsWith('warnings.') ? 
      getTranslation(title.replace('warnings.', ''), language) : 
      getTranslation(title, language) || title;
    
    // Traduire le message principal
    let translatedMessage;
    if (message.startsWith('connectivity.')) {
      translatedMessage = getTranslation(message, language);
    } else if (message.startsWith('warnings.')) {
      translatedMessage = getTranslation(message.replace('warnings.', ''), language);
    } else {
      translatedMessage = message;
    }
    
    // S'assurer que suggestions est un tableau
    if (!Array.isArray(suggestions)) {
      suggestions = [];
    }
    
    // Créer le contenu HTML de l'avertissement
    let warningHTML = `
      <div class="warning-box">
        <h3>⚠️ ${translatedTitle}</h3>
        <p>${translatedMessage}</p>
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
    const dismissButton = document.getElementById('dismiss-warning');
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        this.clearWarnings();
      });
    }
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

      // Trouver ou créer le groupe Ollama
      let ollamaOptgroup = this.elements.iaModelSelect.querySelector('optgroup[label="🤖 Ollama"]');
      if (!ollamaOptgroup) {
        console.log("Création du groupe Ollama");
        ollamaOptgroup = document.createElement('optgroup');
        ollamaOptgroup.label = "🤖 Ollama";
        
        // Trouver le groupe OpenAI pour insérer après
        const openaiGroup = this.elements.iaModelSelect.querySelector('optgroup[label="OpenAI"]');
        if (openaiGroup) {
          openaiGroup.after(ollamaOptgroup);
        } else {
          this.elements.iaModelSelect.appendChild(ollamaOptgroup);
        }
      }
      
      // Marquer un modèle sélectionné avant de vider le groupe
      const currentModelName = this.elements.iaModelSelect.value;
      const isOllamaModelSelected = currentModelName && currentModelName.startsWith('ollama:');
      
      // Afficher un message de chargement
      ollamaOptgroup.innerHTML = '<option disabled>Chargement des modèles Ollama...</option>';
      
      // Vérifier la cache - Éviter de recharger trop fréquemment
      const cacheKey = 'ollama_models_cache';
      const cacheTimeout = 60 * 1000; // 1 minute de cache
      const cachedData = localStorage.getItem(cacheKey);
      
      let ollamaModels = [];
      let usedCache = false;
      
      if (cachedData) {
        try {
          const cache = JSON.parse(cachedData);
          const now = Date.now();
          
          // Utiliser le cache si pas trop ancien
          if (cache.timestamp && (now - cache.timestamp < cacheTimeout) && cache.models && Array.isArray(cache.models)) {
            ollamaModels = cache.models;
            usedCache = true;
            console.log("Utilisation de la cache pour les modèles Ollama", ollamaModels.length, "modèles");
          }
        } catch (e) {
          console.warn("Erreur lors de la lecture de la cache Ollama:", e);
          // En cas d'erreur, on continue sans utiliser la cache
        }
      }
      
      // Si pas de cache valide, récupérer les modèles frais
      if (!usedCache) {
        // Définir un timeout pour le chargement des modèles
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout lors du chargement des modèles Ollama')), 10000);
        });
        
        try {
          // Utiliser Promise.race pour limiter le temps d'attente
          const modelsPromise = this.aiService.getOllamaModels();
          ollamaModels = await Promise.race([modelsPromise, timeoutPromise]);
          
          // Mettre à jour la cache
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            models: ollamaModels
          }));
        } catch (error) {
          console.warn("Erreur lors du chargement des modèles Ollama:", error);
          
          // Afficher un message d'erreur
          ollamaOptgroup.innerHTML = '<option disabled>Erreur de chargement des modèles</option>';
          
          // Afficher un avertissement avec un bouton pour réessayer
          this.showModelWarning({
            title: "Problème de chargement des modèles Ollama",
            message: `Erreur: ${error.message}`,
            suggestions: ["Vérifier que le serveur Ollama est démarré", "Vérifier votre connexion réseau"]
          });
          
          // Si un modèle Ollama était sélectionné, mais pas de modèles, fallback sur OpenAI
          if (isOllamaModelSelected) {
            this.selectDefaultOpenAIModel();
          }
          
          return false;
        }
      }
      
      // Si aucun modèle n'a été trouvé (même après tentative)
      if (!ollamaModels || ollamaModels.length === 0) {
        console.warn("Aucun modèle Ollama trouvé");
        ollamaOptgroup.innerHTML = '<option disabled>Aucun modèle Ollama trouvé</option>';
        
        // Afficher un message d'erreur avec instructions pour installer des modèles
        this.showModelWarning({
          title: "warnings.noOllamaModels",
          message: "warnings.noOllamaModelsDetails",
          suggestions: [
            "warnings.installModel"
          ]
        });
        
        // Si un modèle Ollama était sélectionné, fallback sur OpenAI
        if (isOllamaModelSelected) {
          this.selectDefaultOpenAIModel();
        }
        
        return false;
      }
      
      // Vider le groupe Ollama pour le remplir avec les nouveaux modèles
      ollamaOptgroup.innerHTML = '';
      
      // Remplir le groupe avec les modèles disponibles, en triant alphabétiquement
      ollamaModels
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(model => {
          // Formater le nom pour l'affichage
          const displayName = model.name.replace(/^ollama:/, '');
          const optionValue = `ollama:${model.name}`;
          
          const option = document.createElement('option');
          option.value = optionValue;
          option.textContent = displayName;
          
          ollamaOptgroup.appendChild(option);
          
          // Conserver le modèle si précédemment sélectionné
          if (currentModelName === optionValue) {
            option.selected = true;
          }
        });
      
      // Ajouter les modèles au Set des modèles disponibles
      const availableModels = new Set();
      ollamaModels.forEach(model => {
        availableModels.add(`ollama:${model.name}`);
      });
      
      // Mettre à jour l'état avec les modèles disponibles
      this.stateManager.setState({ availableModels });
      
      // Si aucun modèle n'est actuellement sélectionné ou si c'est un modèle OpenAI par défaut, 
      // sélectionner le premier modèle Ollama
      const currentModel = this.stateManager.getState().iaModel;
      if (currentModel === 'openai/gpt-3.5-turbo' && ollamaModels.length > 0) {
        this.selectFirstOllamaModel();
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors du chargement des modèles Ollama:", error);
      const ollamaOptgroup = this.elements.iaModelSelect.querySelector('optgroup[label="🤖 Ollama"]');
      if (ollamaOptgroup) {
        ollamaOptgroup.innerHTML = '<option disabled>Erreur de connexion à Ollama</option>';
      }
      
      // Afficher un message d'erreur
      this.showModelWarning({
        title: getTranslation('warnings.error', this.stateManager.getState().language),
        message: error.message,
        suggestions: [getTranslation('warnings.tryAgain', this.stateManager.getState().language)]
      });
      
      const currentModelName = this.elements.iaModelSelect.value;
      if (currentModelName && currentModelName.startsWith('ollama:')) {
        this.selectDefaultOpenAIModel();
      }
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
   * Synchronise l'interface utilisateur avec l'état actuel
   * @param {Object} previousState - État précédent pour déterminer les changements
   */
  syncUIWithState(previousState = null) {
    const state = this.stateManager.getState();
    console.log('🔄 Synchronisation de l\'UI avec l\'état:', {
      language: state.language,
      persona: state.persona,
      cardSet: state.cardSet,
      spreadType: state.spreadType,
      iaModel: state.iaModel
    });
    
    // Vérifier que tous les éléments DOM existent
    if (!this.elements.languageSelect || !this.elements.personaSelect || 
        !this.elements.cardSetSelect || !this.elements.spreadTypeSelect || 
        !this.elements.iaModelSelect || !this.elements.personaLogo) {
      console.error('❌ Certains éléments DOM sont manquants pour la synchronisation UI/État');
      return;
    }
    
    // Mise à jour des sélecteurs uniquement si nécessaire
    if (!previousState || previousState.language !== state.language) {
      console.log(`🔤 Mise à jour du sélecteur de langue: ${state.language}`);
      
      // Vérifier si la valeur est une option valide
      if (this.isValidOption(this.elements.languageSelect, state.language)) {
        this.elements.languageSelect.value = state.language;
        this.updateDropdownOptions(state.language);
      } else {
        console.warn(`⚠️ Langue invalide dans l'état: ${state.language}`);
      }
    }
    
    if (!previousState || previousState.persona !== state.persona) {
      console.log(`👤 Mise à jour du sélecteur de persona: ${state.persona}`);
      
      if (this.isValidOption(this.elements.personaSelect, state.persona)) {
        this.elements.personaSelect.value = state.persona;
        this.updatePersonaLogo(state.persona);
      } else {
        console.warn(`⚠️ Persona invalide dans l'état: ${state.persona}`);
      }
    }
    
    if (!previousState || previousState.cardSet !== state.cardSet) {
      console.log(`🃏 Mise à jour du sélecteur de jeu de cartes: ${state.cardSet}`);
      
      if (this.isValidOption(this.elements.cardSetSelect, state.cardSet)) {
        this.elements.cardSetSelect.value = state.cardSet;
      } else {
        console.warn(`⚠️ Jeu de cartes invalide dans l'état: ${state.cardSet}`);
      }
    }
    
    if (!previousState || previousState.spreadType !== state.spreadType) {
      console.log(`🔀 Mise à jour du sélecteur de type de tirage: ${state.spreadType}`);
      
      if (this.isValidOption(this.elements.spreadTypeSelect, state.spreadType)) {
        this.elements.spreadTypeSelect.value = state.spreadType;
        this.updateAppTitle();
      } else {
        console.warn(`⚠️ Type de tirage invalide dans l'état: ${state.spreadType}`);
      }
    }
    
    if (!previousState || previousState.iaModel !== state.iaModel) {
      console.log(`🤖 Mise à jour du sélecteur de modèle IA: ${state.iaModel}`);
      
      if (this.isValidOption(this.elements.iaModelSelect, state.iaModel)) {
        this.elements.iaModelSelect.value = state.iaModel;
      } else {
        console.warn(`⚠️ Modèle IA invalide dans l'état: ${state.iaModel}`);
      }
    }
    
    console.log('✅ Synchronisation UI/État terminée');
  }
  
  /**
   * Vérifie si une valeur est une option valide dans un élément select
   * @param {HTMLSelectElement} selectElement - L'élément select à vérifier
   * @param {string} value - La valeur à rechercher
   * @return {boolean} True si l'option existe
   */
  isValidOption(selectElement, value) {
    if (!selectElement) return false;
    
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
        const ollamaOptgroup = this.elements.iaModelSelect.querySelector('optgroup[label="🤖 Ollama"]');
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
    const ollamaOptgroup = this.elements.iaModelSelect.querySelector('optgroup[label="🤖 Ollama"]');
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