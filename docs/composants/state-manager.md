# Gestionnaire d'État (StateManager)

## Vue d'Ensemble

Le StateManager est le composant central de gestion d'état dans JodoTarot. Il agit comme une "source unique de vérité" pour l'ensemble de l'application, assurant la cohérence des données et leur persistance entre les sessions.

## Rôle dans l'Architecture

Le `StateManager` est l'élément central et nerveux de JodoTarot, agissant comme un "source unique de vérité" pour toute l'application. Voici ses fonctionnalités clés:

- **Validation automatique des données**: Toutes les modifications d'état sont validées selon un schéma strict pour garantir la cohérence des données
- **Pattern Observer**: Notification automatique des composants abonnés à chaque changement d'état
- **Système d'événements**: Émission d'événements spécifiques (`iaModel:changed`, `cardSet:changed`, etc.) pour des réactions ciblées
- **Persistance localStorage**: Sauvegarde automatique de l'état dans le stockage local du navigateur
- **Migrations de données**: Conversion automatique des anciennes versions d'état lors des mises à jour de l'application
- **Optimisation des performances**: Notification sélective uniquement lors de changements réels des valeurs
- **Débogage intégré**: Journalisation détaillée des changements d'état pour faciliter le développement

L'utilisation du StateManager dans JodoTarot suit un flux unidirectionnel:
1. Les contrôleurs appellent `stateManager.setState()` pour mettre à jour l'état
2. Le StateManager valide les changements et notifie les composants abonnés
3. Les composants réagissent aux changements et mettent à jour l'interface utilisateur
4. Les services utilisent `stateManager.getState()` pour accéder aux données actuelles

Ce pattern évite les problèmes de synchronisation et garantit la cohérence des données dans toute l'application.

## Architecture du StateManager

```mermaid
graph TD
    A[StateManager] -->|Stocke| B[LocalStorage]
    A -->|Notifie| C[Abonnés/Observers]
    D[Controllers] -->|Lit/Modifie| A
    E[Services] -->|Lit/Modifie| A
    F[UI Components] -->|Lit| A
    A -->|Met à jour| F
    A -->|Valide| G[Schémas de Validation]
```

### Caractéristiques Principales

- **Centralisation** : Point unique pour l'état global de l'application
- **Réactivité** : Système d'abonnement pour réagir aux changements d'état
- **Persistance** : Sauvegarde automatique dans le localStorage
- **Validation** : Vérification de la validité des données avant mise à jour
- **Immutabilité** : Modifications contrôlées pour éviter les effets de bord
- **Segmentation** : Organisation de l'état en domaines fonctionnels

## Structure du Code

Le StateManager est implémenté dans `assets/js/utils/StateManager.js` (907 lignes).

```javascript
// Structure simplifiée de StateManager
class StateManager {
  constructor() {
    this.state = {};
    this.subscribers = {};
    this.validators = {};
    this.loadFromStorage();
  }
  
  // Méthodes principales
  get(domain, key) { /* ... */ }
  set(domain, key, value) { /* ... */ }
  subscribe(domain, callback) { /* ... */ }
  unsubscribe(domain, callbackId) { /* ... */ }
  
  // Méthodes auxiliaires
  validate(domain, key, value) { /* ... */ }
  notifySubscribers(domain) { /* ... */ }
  loadFromStorage() { /* ... */ }
  saveToStorage() { /* ... */ }
}
```

## Domaines d'État

L'état est organisé dans une structure plate avec des propriétés spécifiques :

1. **Configuration générale**
   - `language` : Langue actuelle (fr, en, es, de, it, zh)
   - `persona` : Persona sélectionné pour l'interprétation
   - `modelStatus` : État actuel du modèle d'IA
   - `availableModels` : Liste des modèles disponibles par type

2. **Tirage courant**
   - `cardSet` : Jeu de cartes sélectionné
   - `spreadType` : Type de tirage (cross, horseshoe, love, celticCross)
   - `selectedCards` : Cartes tirées
   - `question` : Question de l'utilisateur
   - `interpretation` : Interprétation générée

3. **Interface utilisateur**
   - `isLoading` : Indique si une opération est en cours
   - `error` : Message d'erreur éventuel
   - `isCardEnlarged` : Indique si une carte est agrandie
   - `enlargedCardId` : ID de la carte agrandie
   - `currentSpreadType` : Type de tirage actuel
   - `currentCardsDrawn` : Cartes actuellement tirées

## Utilisation du StateManager

### Initialisation

```javascript
// Extrait de l'initialisation dans main.js
const stateManager = new StateManager();
await stateManager.initialize();
```

### Lecture de l'État

```javascript
// Obtenir une valeur
const currentLanguage = stateManager.getState().language;
const drawnCards = stateManager.getState().selectedCards;

// Vérifier l'existence d'une propriété
if (stateManager.getState().interpretation) {
  // ...
}
```

### Modification de l'État

```javascript
// Définir une valeur
stateManager.setState({ language: 'fr' });

// Mettre à jour plusieurs propriétés
stateManager.setState({ 
  spreadType: 'cross',
  question: 'Ma nouvelle question'
});
```

### Abonnement aux Changements

```javascript
// S'abonner aux changements d'état
const subscriberId = stateManager.subscribe((newState, oldState) => {
  if (newState.language !== oldState.language) {
    updateUILanguage(newState.language);
  }
});

// Se désabonner
stateManager.unsubscribe(subscriberId);
```

## Persistance des Données

Le StateManager utilise le localStorage pour persister l'état entre les sessions :

```javascript
// Sauvegarde dans localStorage
saveToStorage() {
  const serializedState = {};
  for (const domain in this.state) {
    // Filtrer les données à ne pas sauvegarder
    if (this.persistentDomains.includes(domain)) {
      serializedState[domain] = this.state[domain];
    }
  }
  
  localStorage.setItem('jodotarot_state', JSON.stringify(serializedState));
}

// Chargement depuis localStorage
loadFromStorage() {
  try {
    const saved = localStorage.getItem('jodotarot_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const domain in parsed) {
        this.state[domain] = {...parsed[domain]};
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'état:', error);
  }
}
```

## Validation des Données

Le StateManager implémente un système de validation pour assurer l'intégrité des données :

```javascript
// Enregistrement d'un validateur
registerValidator(domain, key, validatorFn) {
  if (!this.validators[domain]) {
    this.validators[domain] = {};
  }
  this.validators[domain][key] = validatorFn;
}

// Validation avant mise à jour
validate(domain, key, value) {
  if (this.validators[domain] && this.validators[domain][key]) {
    return this.validators[domain][key](value);
  }
  return true;
}
```

Exemples de validateurs :

```javascript
// Validateur de langue
function validateLanguage(language) {
  const supportedLanguages = ['fr', 'en', 'es', 'de', 'it', 'zh'];
  return supportedLanguages.includes(language);
}

// Validateur de cartes
function validateCards(cards) {
  if (!Array.isArray(cards)) return false;
  return cards.every(card => 
    typeof card === 'object' && 'id' in card && 'name' in card
  );
}
```

## Gestion des Transactions

Pour les mises à jour complexes impliquant plusieurs modifications, le StateManager fournit un mécanisme de transaction :

```javascript
// Exemple de transaction
stateManager.transaction(() => {
  stateManager.set('reading', 'cards', selectedCards);
  stateManager.set('reading', 'spreadType', 'cross');
  stateManager.set('reading', 'timestamp', Date.now());
});
```

Cela permet d'éviter des notifications intermédiaires et d'assurer que les abonnés ne reçoivent qu'une seule notification lorsque l'état est stable.

## Intégration avec les Services et Contrôleurs

### Controllers

```javascript
// Exemple d'utilisation dans ReadingController
class ReadingController {
  constructor(stateManager, deckService, aiService) {
    this.stateManager = stateManager;
    this.deckService = deckService;
    this.aiService = aiService;
    
    // Abonnement aux changements
    this.stateSubscription = stateManager.subscribe('reading', 
      this.handleStateChange.bind(this)
    );
  }
  
  performReading(spreadType) {
    const cards = this.deckService.drawCards(spreadType);
    this.stateManager.set('reading', 'cards', cards);
    this.stateManager.set('reading', 'spreadType', spreadType);
    this.stateManager.set('reading', 'timestamp', Date.now());
  }
  
  handleStateChange(domain, changes) {
    // Réagir aux changements d'état
    if ('cards' in changes && 'spreadType' in changes) {
      this.updateUI(changes.cards, changes.spreadType);
    }
  }
}
```

### Services

```javascript
// Exemple d'utilisation dans AIService
class AIService {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.modelCache = new Map();
    
    // Initialisation de l'état AI
    if (!stateManager.has('ai', 'models')) {
      stateManager.set('ai', 'models', []);
    }
  }
  
  async detectAvailableModels() {
    const models = await this.fetchModels();
    this.stateManager.set('ai', 'models', models);
    return models;
  }
  
  async interpretReading() {
    const cards = this.stateManager.get('reading', 'cards');
    const spreadType = this.stateManager.get('reading', 'spreadType');
    const persona = this.stateManager.get('config', 'selectedPersona');
    
    // ... logique d'interprétation ...
    
    this.stateManager.set('reading', 'interpretation', interpretation);
  }
}
```

## Optimisations

Le StateManager inclut plusieurs optimisations :

1. **Comparaison intelligente** : Évite les notifications si la valeur n'a pas changé
2. **Mise à jour sélective** : Notifie uniquement pour les champs modifiés
3. **Memoization** : Cache des résultats de calculs dépendant de l'état
4. **Debouncing** : Limite la fréquence des sauvegardes dans le localStorage
5. **Lazy Loading** : Chargement à la demande de certains domaines d'état volumineux

## Débogage et Monitoring

Le StateManager intègre des fonctionnalités pour faciliter le débogage :

```javascript
// Activer le mode debug
stateManager.enableDebug();

// Logger les changements d'état
stateManager.on('change', (domain, key, oldValue, newValue) => {
  console.log(`[StateManager] ${domain}.${key} changed:`, 
              { old: oldValue, new: newValue });
});

// Exporter l'état actuel
const stateSnapshot = stateManager.export();
```

## Bonnes Pratiques

Pour travailler efficacement avec le StateManager :

1. **Accès Centralisé** : Toujours passer par le StateManager pour les données partagées
2. **Segmentation Logique** : Organiser l'état en domaines cohérents
3. **Validation Stricte** : Utiliser des validateurs pour tous les champs critiques
4. **Réactions Minimalistes** : Dans les abonnements, ne réagir qu'aux changements pertinents
5. **Transactions** : Regrouper les modifications liées en transactions
6. **Immutabilité** : Ne jamais modifier directement les objets obtenus du StateManager
7. **Désabonnement** : Toujours se désabonner quand un composant est détruit

## Références

- [Flux de Données](../architecture/flux-donnees.md)
- [Bonnes Pratiques](../standards/bonnes-pratiques.md)
- [Interactions entre Composants](../architecture/interactions-composants.md)

## Schéma de Validation

Le StateManager utilise un schéma de validation strict pour chaque propriété d'état :

```javascript
{
  language: {
    type: 'string',
    enum: ['fr', 'en', 'es', 'de', 'it', 'zh'],
    default: 'fr'
  },
  persona: {
    type: 'string',
    enum: [
      'tarologue', 'oracle', 'voyante', 'pretre', 'rabbin', 'imam',
      'dalailama', 'sorciere', 'alchimiste', 'mage', 'francmacon',
      'freud', 'jung', 'lacan', 'dolto', 'socrate', 'salomon',
      'montaigne', 'quichotte', 'demon', 'noegoman'
    ],
    default: 'tarologue'
  },
  cardSet: {
    type: 'string',
    enum: ['set01', 'set02'],
    default: 'set01'
  },
  spreadType: {
    type: 'string',
    enum: ['cross', 'horseshoe', 'love', 'celticCross'],
    default: 'cross'
  },
  iaModel: {
    type: 'string',
    validate: (value) => {
      // Validation des modèles OpenAI et Ollama
      // Voir implémentation complète dans le code
    },
    default: 'prompt'
  }
}
```