# Flux de Données dans JodoTarot

## Vue d'Ensemble

Le flux de données dans JodoTarot suit un modèle circulaire unidirectionnel, garantissant la prévisibilité et la traçabilité des changements d'état. Ce document décrit comment les données circulent entre les différents composants de l'application.

## Principes du Flux de Données

```mermaid
graph TD
    A[Interaction Utilisateur] -->|Déclenche| B[Controllers]
    B -->|Manipule| C[Services]
    C -->|Modifie| D[StateManager]
    D -->|Notifie| E[UI Components]
    E -->|Rend| F[DOM]
    F -->|Affiche| G[Interface Utilisateur]
    G -->|Génère| A
```

### Caractéristiques Clés

1. **Unidirectionnalité** : Les données circulent toujours dans la même direction
2. **Centralisation** : Le StateManager est le point central de toutes les données
3. **Réactivité** : Les changements d'état déclenchent automatiquement des mises à jour UI
4. **Séparation** : Claire distinction entre la manipulation des données et l'affichage
5. **Traçabilité** : Chaque changement d'état peut être tracé à son origine

## Cycle de Vie des Données

### 1. Acquisition des Données

Les données entrent dans le système par plusieurs sources :

- **Interactions utilisateur** (clics, formulaires, sélections)
- **Chargement initial** (configuration par défaut, état sauvegardé)
- **Réponses des API externes** (OpenAI, Ollama)
- **Événements système** (redimensionnement, orientation, etc.)

### 2. Traitement par les Controllers

Les controllers orchestrent le traitement des données :

```javascript
// Exemple dans ReadingController
handleUserSelection(spreadType, personaId) {
  // Validation des entrées
  if (!this.spreadValidator.isValid(spreadType)) {
    this.uiService.showError('Invalid spread type');
    return;
  }
  
  // Coordination des services
  const spread = this.spreadService.getSpread(spreadType);
  const persona = this.personaService.getPersona(personaId);
  
  // Mise à jour de l'état centralisé
  this.stateManager.setState({
    spreadType: spreadType,
    persona: personaId,
    currentScreen: 'cardSelection'
  });
}
```

### 3. Transformation par les Services

Les services appliquent la logique métier aux données :

```javascript
// Exemple dans DeckService
drawCards(spreadType) {
  // Récupère la configuration du tirage
  const spread = this.spreads[spreadType];
  const cardCount = spread.cardCount;
  
  // Applique la logique métier (mélange, sélection)
  const shuffledDeck = this.shuffleDeck(this.deck);
  const selectedCards = shuffledDeck.slice(0, cardCount);
  
  // Enrichit les données avec des métadonnées
  return selectedCards.map((card, index) => ({
    ...card,
    position: spread.positions[index],
    isReversed: Math.random() > 0.5
  }));
}
```

### 4. Stockage dans le StateManager

Toutes les données sont centralisées dans le StateManager :

```javascript
// Mise à jour atomique dans le StateManager
this.stateManager.setState({ cards: selectedCards });

// Mises à jour multiples liées
this.stateManager.setState({
  timestamp: Date.now(),
  isComplete: true,
  currentScreen: 'interpretation'
});
```

### 5. Notification aux Abonnés

Le StateManager notifie les composants abonnés des changements :

```javascript
// Système d'abonnement
class UIComponent {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.unsubscribe = stateManager.subscribe(
      this.handleStateUpdate.bind(this)
    );
  }
  
  handleStateUpdate(newState, changes) {
    if ('cards' in changes) {
      this.renderCards(newState.cards);
    }
    if ('interpretation' in changes) {
      this.renderInterpretation(newState.interpretation);
    }
  }
  
  destroy() {
    // Importante pour éviter les fuites mémoire
    this.unsubscribe();
  }
}
```

### 6. Rendu de l'Interface Utilisateur

Les composants UI actualisent l'affichage en fonction des changements d'état :

```javascript
// Exemple de UIService
updateInterpretationSection(interpretation) {
  const container = document.getElementById('interpretation-container');
  
  // Nettoyage
  container.innerHTML = '';
  
  // Création des éléments DOM selon l'état
  const header = document.createElement('h2');
  header.textContent = interpretation.title;
  container.appendChild(header);
  
  // ... création d'autres éléments ...
  
  // Animations et scroll
  this.animateElement(container, 'fade-in');
  this.scrollToElement(container);
}
```

## Flux de Données Spécifiques

### Flux de Tirage de Cartes

1. **Déclencheur** : Utilisateur clique sur "Effectuer un tirage"
2. **Controller** : `ReadingController.performReading()`
3. **Service** : `DeckService.drawCards()`
4. **État** : Mise à jour de `cards`, `spreadType`
5. **UI** : Affichage des cartes selon positions définies
6. **Persistance** : Sauvegarde du tirage dans localStorage

### Flux d'Interprétation IA

1. **Déclencheur** : Cartes tirées et persona sélectionné
2. **Controller** : `ReadingController.getInterpretation()`
3. **Service** : `AIService.getInterpretation()`
4. **API** : Appel à OpenAI ou Ollama
5. **État** : Mise à jour de `interpretation`, `isLoading`
6. **UI** : Affichage progressif de l'interprétation
7. **Événements** : Émission de 'state:changed'

### Flux de Configuration

1. **Déclencheur** : Utilisateur modifie les préférences
2. **Controller** : Gestionnaire d'événement sur les éléments select
3. **Validation** : `StateManager.validateValue()`
4. **État** : Mise à jour via `stateManager.setState()`
5. **UI** : Adaptation de l'interface selon la configuration
6. **Persistance** : Sauvegarde des préférences via `persistState()`

## Gestion des Erreurs et Cas Particuliers

### Erreurs de Connexion API

```mermaid
graph TD
    A[Appel API] -->|Échec| B[AIService.handleApiError]
    B -->|Examine erreur| C[Détermination du type d'erreur]
    C -->|Timeout| D[Erreur de temps dépassé]
    C -->|Authentification| E[Erreur d'authentification]
    C -->|Connexion| F[Erreur de connexion]
    C -->|Limite dépassée| G[Erreur de quota]
    C -->|Autre| H[Erreur générique]
    D -->|Formatage| I[Message d'erreur formaté]
    E -->|Formatage| I
    F -->|Formatage| I
    G -->|Formatage| I
    H -->|Formatage| I
    I -->|Propagation| J[Controller.catch]
    J -->|UI| K[Affichage message d'erreur]
```

### État de Chargement

Les états de chargement sont propagés à travers le système :

```javascript
// Exemple de gestion d'état de chargement
async getInterpretation(reading, question, persona, model, language) {
  try {
    // Indique l'état de chargement
    this.stateManager.setState({ isLoading: true });
    
    // Opération asynchrone
    const interpretation = await this.aiService.getInterpretation(
      reading,
      question,
      persona,
      model,
      language
    );
    
    // Mise à jour de l'état avec le résultat
    this.stateManager.setState({ interpretation: interpretation });
  } catch (error) {
    // Gestion d'erreur
    console.error("Erreur lors de l'interprétation:", error);
    
    // Afficher un message d'erreur
    this.elements.responseContent.innerHTML = `
      <div class="error-message">
        <p>${getTranslation('interpretation.error.interpretationError', language)}: ${error.message}</p>
      </div>
    `;
  } finally {
    // Toujours réinitialiser l'état de chargement
    this.stateManager.setState({ isLoading: false });
  }
}
```

## Interactions entre États Dépendants

Les composants peuvent réagir à des combinaisons d'états :

```javascript
// Réagir à des combinaisons d'états
stateManager.subscribe((newState, changes) => {
  if (changes.language && newState.interpretation) {
    // L'utilisateur a changé de langue alors qu'une interprétation est affichée
    // Demander une nouvelle interprétation dans la nouvelle langue
    aiService.getInterpretation(
      newState.cards,
      newState.question,
      newState.persona,
      newState.iaModel,
      newState.language
    );
  }
});
```

## Performance et Optimisations

### Mise à jour Sélective

Le StateManager et les composants UI n'actualisent que ce qui est nécessaire :

```javascript
// Dans StateManager.setState()
for (const [key, value] of Object.entries(validatedUpdates)) {
  if (!this.isEqual(this.state[key], value)) {
    changedValues[key] = value;
  }
}

// Notifier uniquement si des valeurs ont effectivement changé
if (Object.keys(changedValues).length > 0) {
  this.notifyListeners(changedValues);
  this.emitChangeEvents(changedValues);
  this.persistState();
}
```

### Debouncing et Throttling

Exemple de traitement optimisé pour les événements fréquents :

```javascript
// Préparation de la fonction debounced
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Utilisation pour un événement fréquent
const debouncedResize = debounce(() => {
  const windowSize = { width: window.innerWidth, height: window.innerHeight };
  this.updateLayoutForSize(windowSize);
}, 250);

window.addEventListener('resize', debouncedResize);
```

## Débogage du Flux de Données

Le StateManager inclut des fonctionnalités de débogage :

```javascript
// Traçage des mises à jour dans setState()
const importantKeys = ['language', 'persona', 'cardSet', 'spreadType', 'iaModel'];
const importantUpdates = Object.keys(updates).filter(key => importantKeys.includes(key));

if (importantUpdates.length > 0) {
  console.log('🔄 Mise à jour de clés importantes:', importantUpdates.map(key => `${key}: ${updates[key]}`));
}

// Traçage des changements effectifs
if (Object.keys(changedValues).length > 0) {
  const importantChanges = Object.keys(changedValues).filter(key => importantKeys.includes(key));
  if (importantChanges.length > 0) {
    console.log('✅ Changements effectifs de clés importantes:', importantChanges.map(key => `${key}: ${changedValues[key]}`));
  }
}
```

## Intégration avec les Systèmes Externes

### API externes

```mermaid
graph TD
    A[AIService] -->|Request| B[API Adapter]
    B -->|OpenAI Request| C[OpenAI API]
    B -->|Ollama Request| D[Ollama API]
    C -->|Response| E[Response Parser]
    D -->|Response| E
    E -->|Streaming| F[onChunk Callback]
    F -->|Formatted Output| G[UI Display]
    E -->|Standardized Data| H[StateManager]
```

### Événements du Navigateur

```javascript
// Intégration avec les événements standard du navigateur
document.addEventListener('DOMContentLoaded', () => {
  // Initialisation du StateManager
  const stateManager = new StateManager();
  stateManager.initialize().then(() => {
    // Initialiser les contrôleurs une fois l'état prêt
    const controllers = initializeControllers(stateManager);
  });
});

// Synchronisation avec les événements du navigateur
window.addEventListener('beforeunload', () => {
  // Sauvegarder l'état actuel avant de quitter
  stateManager.persistState();
});
```

## Bonnes Pratiques

1. **Toujours passer par le StateManager** pour les données partagées
2. **Éviter les effets de bord** dans les abonnements aux changements d'état
3. **Utiliser des mises à jour atomiques** pour les changements liés
4. **Valider toutes les entrées utilisateur** avant de modifier l'état
5. **Gérer tous les états possibles** (chargement, erreur, vide, etc.)
6. **Se désabonner proprement** pour éviter les fuites mémoire
7. **Maintenir une séparation claire** entre données et présentation

## Références

- [Vue d'Ensemble de l'Architecture](vue-ensemble.md)
- [Gestionnaire d'État](../composants/state-manager.md)
- [Interactions entre Composants](interactions-composants.md)
- [Bonnes Pratiques](../standards/bonnes-pratiques.md) 