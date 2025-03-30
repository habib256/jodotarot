# Gestion des Interactions Utilisateur

## Vue d'Ensemble

JodoTarot implémente un système d'interactions utilisateur basé sur une architecture événementielle et une gestion d'état centralisée. Le système est conçu pour être réactif, accessible et maintenir une cohérence entre l'état de l'application et l'interface utilisateur.

## Services Principaux

### UIService

Le `UIService` est le service central pour la gestion des interactions UI :

```javascript
class UIService {
  constructor() {
    // Initialiser les gestionnaires d'événements globaux
    this.initGlobalEvents();
    
    // Écouter l'événement de disponibilité de l'état
    document.addEventListener('stateManager:ready', this.handleStateReady.bind(this));
    
    // Écouter les changements globaux d'état
    document.addEventListener('state:changed', this.handleStateChanged.bind(this));
  }
  
  handleStateReady(event) {
    console.log('🔄 UIService: État disponible, synchronisation de l\'interface');
    this.synchronizeUIWithState(event.detail.state);
  }
  
  handleStateChanged(event) {
    const { changes, state } = event.detail;
    this.synchronizeUIWithState(state, changes);
  }
  
  synchronizeUIWithState(state, changes = null) {
    // Vérifier les propriétés critiques et les synchroniser avec l'UI
    this.ensureInterpretationPanelVisibility();
    
    // Synchroniser d'autres éléments d'interface selon les besoins
    this.updateStatusIndicators(state);
  }
}
```

### AppController

Le `AppController` coordonne les interactions entre les différents composants :

```javascript
class AppController {
  constructor(stateManager) {
    this.stateManager = stateManager;
    
    // Services
    this.aiService = null;
    this.deckService = null;
    this.uiService = null;
    
    // Contrôleurs
    this.readingController = null;
    this.configController = null;
    
    // Écouter les changements d'état pour mettre à jour l'UI
    this.stateManager.subscribe(this.handleStateChange.bind(this));
    
    // Synchroniser l'UI avec l'état restauré
    this.syncUIWithState();
  }
  
  handleStateChange(state) {
    // Mettre à jour le titre du document en fonction du type de tirage
    let title = 'JodoTarot';
    
    switch (state.spreadType) {
      case 'cross':
        title += ' - Tirage en Croix';
        break;
      case 'horseshoe':
        title += ' - Tirage en Fer à Cheval';
        break;
      case 'love':
        title += ' - Tarot de l\'Amour';
        break;
      case 'celticCross':
        title += ' - Croix Celtique';
        break;
    }
    
    document.title = title;
    
    // Mettre à jour la visibilité des messages d'erreur
    if (state.error) {
      this.showError(state.error);
    }
    
    // Afficher/masquer le spinner de chargement
    this.updateLoadingState(state.isLoading);
  }
}
```

### ConfigController

Le `ConfigController` gère les interactions de configuration :

```javascript
class ConfigController {
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
    
    // Écouter l'événement spécifique pour la mise à jour du menu déroulant des modèles IA
    document.addEventListener('iaModelUI:update', (event) => {
      this.updateModelSelectUI(event.detail.model);
    });
  }
}
```

## États d'Interface

### Schéma d'État UI

L'état de l'interface est géré via le StateManager avec les propriétés suivantes :

```javascript
{
  isLoading: {
    type: 'boolean',
    default: false
  },
  error: {
    type: 'string',
    nullable: true,
    default: null
  },
  isCardEnlarged: {
    type: 'boolean',
    default: false
  },
  enlargedCardId: {
    type: 'number',
    nullable: true,
    default: null
  },
  modelStatus: {
    type: 'object',
    description: 'État actuel du modèle d\'IA',
    default: {
      isLoading: false,
      isConnected: false,
      error: null,
      lastCheck: null
    }
  },
  availableModels: {
    type: 'object',
    description: 'Liste des modèles disponibles par type',
    default: {
      ollama: [],
      openai: [
        'gpt-3.5-turbo',
        'gpt-4',
        'gpt-4o',
        'gpt-4o-mini'
      ]
    }
  }
}
```

### Gestion des États de Chargement

```javascript
// Exemple de gestion d'état de chargement dans le ConfigController
async handleModelChange(event) {
  const model = event.target.value;
  try {
    // Commencer le chargement
    this.stateManager.setState({ 
      modelStatus: { 
        isLoading: true,
        isConnected: false,
        error: null 
      } 
    });
    
    // Vérifier la connectivité
    const testResult = await this.testModelConnectivity(model);
    
    // Mettre à jour l'état avec le résultat
    this.stateManager.setState({ 
      iaModel: model,
      modelStatus: { 
        isLoading: false,
        isConnected: testResult.success,
        error: testResult.success ? null : testResult.message,
        lastCheck: new Date().toISOString()
      } 
    });
  } catch (error) {
    this.stateManager.setState({ 
      modelStatus: { 
        isLoading: false,
        isConnected: false,
        error: error.message 
      } 
    });
  }
}
```

## Événements Personnalisés

### Événements Système

- `stateManager:ready` : État initialisé
- `stateManager:error` : Erreur de gestion d'état
- `state:changed` : Changement d'état global
- `iaModelUI:update` : Mise à jour UI du modèle IA

### Événements de Cartes

- `card:selected` : Carte sélectionnée
- `card:deselected` : Carte désélectionnée
- `card:flip:start` : Début d'animation de retournement
- `card:flip:end` : Fin d'animation de retournement
- `deckId:changed` : Changement de jeu de cartes

### Événements de Tirage

- `spread:card:placed` : Carte placée dans le tirage
- `spread:complete` : Tirage complété

## Synchronisation UI/État

### Principe de Base

1. L'état est la source unique de vérité
2. Les changements d'état déclenchent des mises à jour UI
3. Les interactions UI mettent à jour l'état
4. L'état met à jour l'UI via les écouteurs

### Exemple de Flux

```javascript
// 1. Interaction utilisateur - Exemple de changement de langue
languageSelect.addEventListener('change', (event) => {
  const language = event.target.value;
  
  // 2. Mise à jour de l'état
  this.stateManager.setState({ language });
});

// 3. Écouteur d'état dans ConfigController
this.stateManager.subscribe((newState, changes = {}) => {
  // 4. Réactions aux changements spécifiques
  if (changes.language) {
    this.updateUILanguage(newState.language);
  }
});
```

## Notifications et Retours Utilisateur

### Affichage des Erreurs

Le UIService fournit des méthodes pour afficher des notifications et erreurs:

```javascript
showError(message, isApi = false, duration = 5000) {
  // Créer/récupérer le conteneur d'erreur
  let errorContainer = document.querySelector('.error-container');
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    document.body.appendChild(errorContainer);
  }
  
  // Créer le message d'erreur
  const errorElement = document.createElement('div');
  errorElement.className = `error-message ${isApi ? 'api-error' : ''}`;
  errorElement.textContent = message;
  
  // Ajouter au conteneur
  errorContainer.appendChild(errorElement);
  
  // Animation et disparition automatique
  setTimeout(() => {
    errorElement.classList.add('visible');
  }, 10);
  
  if (duration > 0) {
    setTimeout(() => {
      errorElement.classList.remove('visible');
      setTimeout(() => errorElement.remove(), 300);
    }, duration);
  }
  
  return errorElement;
}
```

### Notifications Temporaires

```javascript
showNotification(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '10000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast notification-' + type;
  toast.innerText = message;
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.5s ease';
  container.appendChild(toast);
  
  // Animation et disparition automatique
  void toast.offsetWidth;
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
```

## Bonnes Pratiques

1. **Gestion d'État**
   - Utiliser le StateManager pour toutes les modifications d'état
   - Valider les données avant mise à jour
   - Maintenir la cohérence de l'état

2. **Événements**
   - Utiliser les événements personnalisés pour la communication
   - Nettoyer les écouteurs inutilisés
   - Éviter la propagation excessive d'événements

3. **Performance**
   - Débouncer les événements fréquents
   - Optimiser les mises à jour UI
   - Éviter les calculs inutiles

4. **Accessibilité**
   - Maintenir une navigation clavier cohérente
   - Fournir des annonces appropriées
   - Respecter les standards ARIA

## Ressources

- [Guide d'Accessibilité](https://www.w3.org/WAI/ARIA/apg/)
- [Patterns d'Interaction](https://www.patterns.dev/)
- [Tests d'Interface](https://testing-library.com/) 