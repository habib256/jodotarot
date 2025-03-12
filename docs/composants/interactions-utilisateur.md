# Gestion des Interactions Utilisateur

## Vue d'Ensemble

JodoTarot implémente un système d'interactions utilisateur basé sur une architecture événementielle et une gestion d'état centralisée. Le système est conçu pour être réactif, accessible et maintenir une cohérence entre l'état de l'application et l'interface utilisateur.

## Services Principaux

### UIService

Le `UIService` est le service central pour la gestion des interactions UI :

```javascript
class UIService {
  constructor() {
    // Initialisation des gestionnaires d'événements globaux
    this.initGlobalEvents();
    
    // Écoute des événements d'état
    document.addEventListener('stateManager:ready', this.handleStateReady.bind(this));
    document.addEventListener('state:changed', this.handleStateChanged.bind(this));
  }
  
  handleStateReady(event) {
    this.synchronizeUIWithState(event.detail.state);
  }
  
  handleStateChanged(event) {
    const { changes, state } = event.detail;
    this.synchronizeUIWithState(state, changes);
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
    
    // Synchronisation avec l'état
    this.stateManager.subscribe(this.handleStateChange.bind(this));
    this.syncUIWithState();
  }
}
```

### ConfigController

Le `ConfigController` gère les interactions de configuration :

```javascript
class ConfigController {
  constructor(stateManager, aiService, uiService) {
    this.stateManager = stateManager;
    
    // Abonnement aux changements d'état
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
    
    // Gestion spécifique des modèles IA
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
    default: {
      isLoading: false,
      isConnected: false,
      error: null,
      lastCheck: null
    }
  }
}
```

### Gestion des États de Chargement

```javascript
// Exemple de gestion d'état de chargement
async performAction() {
  try {
    this.stateManager.setState({ isLoading: true });
    await this.someAsyncOperation();
  } catch (error) {
    this.stateManager.setState({ 
      error: error.message 
    });
  } finally {
    this.stateManager.setState({ 
      isLoading: false 
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
// 1. Interaction utilisateur
buttonElement.addEventListener('click', () => {
  // 2. Mise à jour de l'état
  stateManager.setState({ 
    isCardEnlarged: true,
    enlargedCardId: cardId 
  });
});

// 3. Écouteur d'état
stateManager.subscribe((newState, changes) => {
  if ('isCardEnlarged' in changes) {
    updateCardDisplay(
      newState.isCardEnlarged,
      newState.enlargedCardId
    );
  }
});
```

## Accessibilité

### Gestion du Focus

```javascript
// Exemple de gestion du focus pour les cartes
function handleCardSelection(cardElement) {
  // Mettre à jour l'état
  stateManager.setState({ 
    selectedCardId: cardElement.dataset.cardId 
  });
  
  // Gérer le focus
  cardElement.setAttribute('tabindex', '0');
  cardElement.focus();
  
  // Annoncer la sélection
  announceCardSelection(cardElement.dataset.cardName);
}
```

### Annonces pour Lecteurs d'Écran

```javascript
function announceCardSelection(cardName) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = `Carte ${cardName} sélectionnée`;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
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