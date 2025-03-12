# Interactions entre Composants

## Vue d'Ensemble

L'architecture de JodoTarot repose sur une communication claire et structurée entre ses différents composants. Ce document décrit les mécanismes d'interaction, les patterns de communication et les principes qui régissent ces échanges.

## Architecture de Communication

```mermaid
graph TD
    A[AppController] -->|Initialise| B[Controllers Spécialisés]
    B -->|Utilisent| C[Services]
    C -->|Interagissent avec| D[StateManager]
    D -->|Notifie| C
    D -->|Notifie| B
    B -->|Mettent à jour| E[UI via UIService]
    C -->|Peuvent mettre à jour| E
    F[Événements DOM] -->|Capturés par| B
    F -->|Peuvent être capturés par| C
    G[Events Personnalisés] -->|Utilisés par| B
    G -->|Utilisés par| C
```

## Principes d'Interaction

JodoTarot suit plusieurs principes fondamentaux pour les interactions entre composants :

1. **Communication Indirecte** : Les composants ne communiquent pas directement entre eux mais passent par le StateManager
2. **Dépendances Explicites** : Les dépendances sont injectées via constructeurs
3. **Interfaces Bien Définies** : Chaque composant expose une API publique claire
4. **Événements pour les Notifications** : Utilisation d'événements pour les communications asynchrones
5. **Source Unique de Vérité** : Le StateManager comme point central de l'état
6. **Propagation Unidirectionnelle** : Flux de données dans une seule direction

## Types d'Interactions

### 1. Interactions via StateManager

Le mode d'interaction principal entre les composants passe par le StateManager :

```javascript
// Controller qui met à jour l'état
class ReadingController {
  constructor(stateManager, deckService) {
    this.stateManager = stateManager;
    this.deckService = deckService;
  }
  
  performReading(spreadType) {
    const cards = this.deckService.drawCards(spreadType);
    
    // Mise à jour de l'état centralisé
    this.stateManager.set('reading', 'cards', cards);
    this.stateManager.set('reading', 'spreadType', spreadType);
  }
}

// Service qui réagit aux changements d'état
class AIService {
  constructor(stateManager) {
    this.stateManager = stateManager;
    
    // Abonnement aux changements pertinents
    this.stateManager.subscribe('reading', (domain, changes) => {
      if (changes.cards && changes.spreadType) {
        this.prepareInterpretation(changes.cards, changes.spreadType);
      }
    });
  }
}
```

### 2. Communication par Événements Personnalisés

Pour certaines interactions spécifiques, JodoTarot utilise des événements personnalisés :

```javascript
// Émission d'un événement personnalisé
class DeckService {
  shuffleDeck() {
    // Logique de mélange
    
    // Notification via événement
    const event = new CustomEvent('deck:shuffled', {
      detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(event);
  }
}

// Réception d'un événement personnalisé
class UIService {
  constructor() {
    document.addEventListener('deck:shuffled', (e) => {
      this.showShuffleAnimation(e.detail.timestamp);
    });
  }
}
```

### 3. Appels Directs via API Publiques

Dans certains cas, les composants s'appellent directement via leurs API publiques :

```javascript
// Appel direct à l'API d'un service
class ReadingController {
  interpretReading() {
    const cards = this.stateManager.get('reading', 'cards');
    const persona = this.stateManager.get('config', 'selectedPersona');
    
    // Appel direct au service
    this.aiService.generateInterpretation(cards, persona)
      .then(interpretation => {
        this.stateManager.set('reading', 'interpretation', interpretation);
      });
  }
}
```

## Flux d'Interactions Typiques

### Exemple 1: Processus de Tirage Complet

```mermaid
sequenceDiagram
    participant User
    participant RC as ReadingController
    participant DS as DeckService
    participant SM as StateManager
    participant US as UIService
    participant AIS as AIService
    
    User->>RC: Demande tirage
    RC->>DS: drawCards(spreadType)
    DS->>DS: shuffleDeck()
    DS->>RC: cards
    RC->>SM: set('reading.cards', cards)
    SM->>US: notify('reading')
    US->>User: Affiche cartes
    SM->>AIS: notify('reading')
    AIS->>AIS: prepareInterpretation()
    AIS->>SM: set('reading.interpretation', result)
    SM->>US: notify('reading')
    US->>User: Affiche interprétation
```

### Exemple 2: Changement de Configuration

```mermaid
sequenceDiagram
    participant User
    participant CC as ConfigController
    participant SM as StateManager
    participant TS as TranslationService
    participant US as UIService
    
    User->>CC: Change langue
    CC->>SM: set('config.language', 'en')
    SM->>TS: notify('config')
    TS->>TS: loadTranslations('en')
    SM->>US: notify('config')
    US->>User: Met à jour UI
```

## Mécanismes d'Interaction Spécifiques

### Injection de Dépendances

JodoTarot utilise l'injection de dépendances pour créer des interactions flexibles :

```javascript
// Dans main.js - Initialisation avec injection de dépendances
const stateManager = new StateManager();
const translationService = new TranslationService(stateManager);
const deckService = new DeckService(stateManager);
const aiService = new AIService(stateManager, translationService);
const uiService = new UIService(stateManager, translationService);

const configController = new ConfigController(
  stateManager, 
  translationService, 
  uiService
);

const readingController = new ReadingController(
  stateManager, 
  deckService, 
  aiService, 
  uiService
);

const appController = new AppController(
  stateManager,
  configController,
  readingController
);

// Démarrage de l'application
appController.initialize();
```

### Abonnements et Notifications

Le système d'abonnement du StateManager permet des interactions réactives :

```javascript
// Abonnement à plusieurs domaines avec filtrage
class InterpretationComponent {
  constructor(stateManager) {
    this.stateManager = stateManager;
    
    // Abonnement multi-domaines
    this.stateManager.subscribeMulti(
      ['reading', 'config'], 
      this.handleStateChanges.bind(this)
    );
  }
  
  handleStateChanges(domains, changes) {
    // Réagir uniquement aux changements pertinents
    if (changes.reading && changes.reading.cards) {
      this.updateCardDisplay(changes.reading.cards);
    }
    
    if (changes.config && changes.config.language) {
      this.updateLanguage(changes.config.language);
    }
    
    // Interaction combinée entre domaines
    if (changes.reading && changes.reading.interpretation && 
        changes.config && changes.config.displayMode) {
      this.renderInterpretation(
        changes.reading.interpretation,
        changes.config.displayMode
      );
    }
  }
}
```

### Délégation d'Événements DOM

Pour les interactions UI, JodoTarot utilise la délégation d'événements :

```javascript
// Délégation d'événements pour gérer de multiples éléments
class UIService {
  initCardInteractions() {
    const container = document.getElementById('reading-area');
    
    // Un seul gestionnaire pour tous les éléments de carte
    container.addEventListener('click', (e) => {
      const cardElement = e.target.closest('.card');
      if (cardElement) {
        const cardId = cardElement.dataset.cardId;
        this.handleCardSelection(cardId);
      }
    });
  }
}
```

## Gestion des Conflits et Synchronisation

### Transactions pour les Mises à Jour Atomiques

Pour éviter les états incohérents lors de mises à jour multiples :

```javascript
// Utilisation des transactions pour les mises à jour groupées
stateManager.transaction(() => {
  stateManager.set('reading', 'cards', selectedCards);
  stateManager.set('reading', 'spreadType', spreadType);
  stateManager.set('reading', 'timestamp', Date.now());
});
```

### Priorités des Notifications

Le StateManager implémente un système de priorité pour les notifications :

```javascript
// Définition des priorités pour les abonnements
stateManager.subscribe('reading', callback, { priority: 10 }); // Priorité élevée
stateManager.subscribe('reading', anotherCallback, { priority: 5 }); // Priorité moyenne
stateManager.subscribe('reading', yetAnotherCallback, { priority: 1 }); // Priorité basse
```

## Interactions avec les Systèmes Externes

### Intégration API

L'AIService coordonne les interactions avec les API externes :

```javascript
// Interaction avec système externe
class AIService {
  async interpretReading() {
    const cards = this.stateManager.get('reading', 'cards');
    const prompt = this.buildPrompt(cards);
    
    try {
      // Notification d'état de chargement
      this.stateManager.set('ui', 'isLoading', true);
      
      // Interaction avec système externe
      const response = await this.apiClient.generateCompletion(prompt);
      
      // Mise à jour de l'état avec résultat externe
      this.stateManager.set('reading', 'interpretation', response.text);
      this.stateManager.set('reading', 'status', 'completed');
    } catch (error) {
      // Gestion des erreurs d'interaction
      this.stateManager.set('reading', 'error', error.message);
      this.stateManager.set('reading', 'status', 'error');
    } finally {
      this.stateManager.set('ui', 'isLoading', false);
    }
  }
}
```

### Interactions avec le Navigateur

L'application interagit également avec les API du navigateur :

```javascript
// Interaction avec les API du navigateur
class ConfigService {
  detectSystemPreferences() {
    // Détection du mode sombre
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.stateManager.set('config', 'theme', 'dark');
    }
    
    // Détection de la langue du navigateur
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLanguages.includes(browserLang)) {
      this.stateManager.set('config', 'language', browserLang);
    }
  }
}
```

## Patterns d'Interaction Avancés

### Mediator Pattern

AppController joue le rôle de médiateur entre les différents contrôleurs :

```javascript
class AppController {
  constructor(stateManager, configController, readingController) {
    this.stateManager = stateManager;
    this.configController = configController;
    this.readingController = readingController;
  }
  
  // Coordination des interactions entre contrôleurs
  startNewReading() {
    // Vérification de l'état de configuration
    const isConfigValid = this.configController.validateCurrentConfig();
    
    if (isConfigValid) {
      // Transition entre contrôleurs
      this.readingController.initializeNewReading();
    } else {
      // Redirection vers configuration
      this.configController.showConfigurationRequired();
    }
  }
}
```

### Observer Pattern

Le système d'abonnement du StateManager implémente le pattern Observer :

```javascript
// Implémentation simplifiée du pattern Observer
class StateManager {
  subscribe(domain, callback) {
    if (!this.subscribers[domain]) {
      this.subscribers[domain] = [];
    }
    
    const subscriberId = this.nextSubscriberId++;
    this.subscribers[domain].push({
      id: subscriberId,
      callback
    });
    
    return subscriberId;
  }
  
  notifySubscribers(domain, changes) {
    if (this.subscribers[domain]) {
      this.subscribers[domain].forEach(subscriber => {
        subscriber.callback(domain, changes);
      });
    }
  }
}
```

### Command Pattern

Pour les opérations complexes, JodoTarot utilise le pattern Command :

```javascript
// Pattern Command pour encapsuler des opérations complexes
class ReadingCommand {
  constructor(stateManager, deckService, spreadType) {
    this.stateManager = stateManager;
    this.deckService = deckService;
    this.spreadType = spreadType;
    this.previousState = null;
  }
  
  execute() {
    // Sauvegarde de l'état précédent pour undo
    this.previousState = {
      cards: this.stateManager.get('reading', 'cards'),
      spreadType: this.stateManager.get('reading', 'spreadType')
    };
    
    // Exécution de la commande
    const cards = this.deckService.drawCards(this.spreadType);
    this.stateManager.set('reading', 'cards', cards);
    this.stateManager.set('reading', 'spreadType', this.spreadType);
  }
  
  undo() {
    if (this.previousState) {
      this.stateManager.set('reading', 'cards', this.previousState.cards);
      this.stateManager.set('reading', 'spreadType', this.previousState.spreadType);
    }
  }
}

// Utilisation
const command = new ReadingCommand(stateManager, deckService, 'cross');
command.execute();
// Plus tard si besoin d'annuler
command.undo();
```

## Optimisations des Interactions

### Debouncing et Throttling

Pour les interactions fréquentes :

```javascript
// Debouncing pour éviter les interactions trop fréquentes
class UIService {
  constructor() {
    this.debouncedUpdateLayout = debounce(this.updateLayout, 250);
    
    window.addEventListener('resize', () => {
      this.debouncedUpdateLayout();
    });
  }
  
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}
```

### Mise en Cache des Interactions

**Note: Cette fonctionnalité est décrite ici comme une pratique recommandée mais n'est actuellement pas implémentée dans le code.**

```javascript
// Exemple conceptuel - Non implémenté dans la version actuelle
function getInterpretation(cards, spreadType) {
  // La mise en cache pourrait être implémentée comme ceci
  const cacheKey = this.getCacheKey(cards, spreadType);
  
  // Vérification si résultat en cache
  if (this.interpretationCache && this.interpretationCache.has(cacheKey)) {
    return this.interpretationCache.get(cacheKey);
  }
  
  // Sinon, générer une nouvelle interprétation
  const interpretation = this.generateInterpretation(cards, spreadType);
  
  // Mettre en cache pour future utilisation
  if (this.interpretationCache) {
    this.interpretationCache.set(cacheKey, interpretation);
  }
  
  return interpretation;
}
```

Cette approche pourrait être implémentée dans de futures versions pour améliorer les performances en évitant de régénérer des interprétations identiques.

## Bonnes Pratiques pour les Interactions

1. **Éviter les Dépendances Circulaires** : Les composants ne doivent pas créer de boucles de dépendance
2. **Limiter la Portée des Interactions** : Préférer les interactions locales aux interactions globales
3. **Documenter les Contrats d'API** : Clarifier les attentes des interfaces publiques
4. **Valider les Entrées** : Vérifier la validité des données avant de les propager
5. **Gérer les Erreurs** : Toujours prévoir la gestion des erreurs dans les interactions
6. **Désabonner Proprement** : Se désabonner des événements et notifications quand un composant est détruit
7. **Préférer les Interactions Asynchrones** : Utiliser Promises et async/await pour les opérations longues

## Débogage des Interactions

JodoTarot inclut des outils pour tracer les interactions :

```javascript
// Activation du mode debug des interactions
stateManager.on('interaction', (source, target, type, data) => {
  console.log(`[Interaction] ${source} → ${target} (${type})`, data);
});

// Journalisation des interactions dans un service
class AIService {
  async interpretReading() {
    stateManager.logInteraction('AIService', 'API', 'request', { 
      timestamp: Date.now() 
    });
    
    // ... logique d'interprétation ...
    
    stateManager.logInteraction('AIService', 'StateManager', 'update', {
      interpretation
    });
  }
}
```

## Références

- [Vue d'Ensemble de l'Architecture](vue-ensemble.md)
- [Flux de Données](flux-donnees.md)
- [Gestionnaire d'État](../composants/state-manager.md)
- [Bonnes Pratiques](../standards/bonnes-pratiques.md) 