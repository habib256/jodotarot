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
    
    // S'abonner aux changements d'état pour maintenir l'UI synchronisée
    this.stateManager.subscribe((newState, changes = {}) => {
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
    
    // Initialiser l'UI
    this.syncUIWithState();
    
    // Note: Le chargement initial des modèles Ollama est fait dans main.js (loadInitialResources)
    // Ne pas charger les modèles ici pour éviter le double chargement
    
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
    
    // Ajouter du débogage
    console.log(`🃏 Changement de jeu de cartes: ${cardSet}`);
    
    // Mettre à jour l'état via StateManager uniquement
    this.stateManager.setState({ cardSet });
    
    // Vérifier si CardSet et DeckId sont synchronisés
    console.log(`🔄 État après mise à jour - cardSet: ${this.stateManager.state.cardSet}, deckId: ${this.stateManager.state.deckId}`);
    
    // Nous devrions aussi mettre à jour deckId pour être cohérent
    if (this.stateManager.state.deckId !== cardSet) {
      console.log(`⚠️ Synchronisation deckId avec cardSet: ${cardSet}`);
      this.stateManager.setState({ deckId: cardSet });
    }
    
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
   * @param {Event} event - L'événement de changement
   */
  async handleModelChange(event) {
    const iaModel = event.target.value;
    const previousModel = this.stateManager.getState().iaModel;
    
    if (iaModel === previousModel) {
      return; // Pas de changement, ne rien faire
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
        this.showTemporaryMessage(`Modèle ${iaModel} activé avec succès`, 'success');
      } else {
        // Le modèle n'est pas disponible, annuler le changement
        console.warn(`Modèle ${iaModel} non disponible:`, modelTest);
        this.elements.iaModelSelect.value = previousModel;
        
        // Afficher un avertissement
        this.showWarning(
          'Modèle non disponible',
          modelTest.message || `Le modèle ${iaModel} n'est pas accessible.`,
          modelTest.suggestions || []
        );
      }
    } catch (error) {
      // En cas d'erreur, annuler le changement
      console.error(`Erreur lors du test du modèle ${iaModel}:`, error);
      this.elements.iaModelSelect.value = previousModel;
      
      // Afficher l'erreur dans le conteneur d'avertissement au lieu d'un message temporaire
      this.showWarning(
        'Erreur de changement de modèle',
        `${error.message}`,
        ['Vérifier la disponibilité du modèle', 'Vérifier la configuration de votre API']
      );
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
        
        this.showWarning(
          getTranslation('warnings.apiKeyMissing', state.language),
          getTranslation('warnings.apiKeyMissingDetails', state.language, { modelName }),
          [
            getTranslation('warnings.configureAPIKey', state.language),
            getTranslation('warnings.useLocalModel', state.language)
          ]
        );
        
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
          this.showWarning(
            getTranslation('warnings.modelUnavailable', state.language),
            result.message || getTranslation('warnings.modelUnavailableDetails', state.language, { modelName }),
            [
              getTranslation('warnings.checkOllamaRunning', state.language),
              getTranslation('warnings.refreshOllamaModels', state.language),
              getTranslation('warnings.selectDifferentModel', state.language)
            ]
          );
          
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
        this.showWarning(
          getTranslation('warnings.modelUnavailable', state.language),
          result.message || getTranslation('warnings.modelUnavailableDetails', state.language, { modelName }),
          suggestions
        );
      } else {
        console.log(`Modèle ${modelName} disponible:`, result);
      }
    } catch (error) {
      console.error('Erreur lors du test de connectivité:', error);
      this.showWarning(
        getTranslation('warnings.error', state.language),
        error.message,
        [getTranslation('warnings.tryAgain', state.language)]
      );
    }
  }
  
  /**
   * Affiche un avertissement
   * @param {string} title - Titre de l'avertissement
   * @param {string} message - Message de l'avertissement
   * @param {Array} suggestions - Suggestions pour résoudre le problème
   */
  showWarning(title = 'Avertissement', message = '', suggestions = []) {
    const state = this.stateManager.getState();
    const language = state.language || 'fr';
    
    // S'assurer que title et message sont des chaînes
    title = String(title || 'Avertissement');
    message = String(message || '');
    
    // S'assurer que suggestions est un tableau
    if (!Array.isArray(suggestions)) {
      suggestions = [];
    }
    
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
    
    // Vérifier que le conteneur d'avertissement existe
    if (!this.elements.warningContainer) {
      this.elements.warningContainer = this.createWarningContainer();
    }
    
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
          this.showWarning(
            "Problème de chargement des modèles Ollama",
            `Erreur: ${error.message}`,
            ["Vérifier que le serveur Ollama est démarré", "Vérifier votre connexion réseau"]
          );
          
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
        this.showWarning(
          "Aucun modèle Ollama disponible",
          "Vous devez installer au moins un modèle pour utiliser Ollama.",
          ["Utilisez la commande 'ollama pull llama3' pour installer un modèle", 
           "Consultez ollama.com pour plus d'informations"]
        );
        
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
      
      return true;
    } catch (error) {
      console.error("Erreur lors du chargement des modèles Ollama:", error);
      const ollamaOptgroup = this.elements.iaModelSelect.querySelector('optgroup[label="🤖 Ollama"]');
      if (ollamaOptgroup) {
        ollamaOptgroup.innerHTML = '<option disabled>Erreur de connexion à Ollama</option>';
      }
      
      // Afficher un message d'erreur
      this.showWarning(
        getTranslation('warnings.error', this.stateManager.getState().language),
        error.message,
        [getTranslation('warnings.tryAgain', this.stateManager.getState().language)]
      );
      
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
   * @param {Object} [previousState] - État précédent pour comparaison
   */
  syncUIWithState(previousState = null) {
    const state = this.stateManager.getState();
    
    // Mise à jour des sélecteurs uniquement si nécessaire
    if (!previousState || previousState.language !== state.language) {
      this.elements.languageSelect.value = state.language;
      this.updateDropdownOptions(state.language);
    }
    
    if (!previousState || previousState.persona !== state.persona) {
      this.elements.personaSelect.value = state.persona;
      this.updatePersonaLogo(state.persona);
    }
    
    if (!previousState || previousState.cardSet !== state.cardSet) {
      this.elements.cardSetSelect.value = state.cardSet;
    }
    
    if (!previousState || previousState.spreadType !== state.spreadType) {
      this.elements.spreadTypeSelect.value = state.spreadType;
      this.updateAppTitle();
    }
    
    if (!previousState || previousState.iaModel !== state.iaModel) {
      this.elements.iaModelSelect.value = state.iaModel;
    }
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
      messageElement.style.display = 'none';
      messageElement.style.marginTop = '5px';
      messageElement.style.padding = '5px';
      messageElement.style.borderRadius = '4px';
      messageElement.style.fontSize = '0.9em';
      
      // Ajouter l'élément après le sélecteur de modèle
      const modelSelect = document.getElementById('ia-model');
      if (modelSelect && modelSelect.parentNode) {
        modelSelect.parentNode.appendChild(messageElement);
      } else {
        // Fallback: ajouter au corps du document
        document.body.appendChild(messageElement);
      }
    }
    
    // Définir le contenu et le style
    messageElement.textContent = message;
    messageElement.className = `${type}-message`;
    messageElement.style.display = 'block';
    
    // Masquer après la durée spécifiée
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, duration);
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
}

export default ConfigController; 