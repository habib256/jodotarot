# Bonnes Pratiques de Développement

## Principes Généraux

### 1. Architecture et Organisation du Code

- **Séparation des Responsabilités** : Chaque composant doit avoir une responsabilité unique et bien définie
- **Modularité** : Favoriser les petites fonctions et classes avec des objectifs clairement définis
- **DRY (Don't Repeat Yourself)** : Éviter la duplication de code, factoriser les fonctionnalités communes
- **KISS (Keep It Simple, Stupid)** : Privilégier les solutions simples et lisibles aux implémentations complexes
- **Convention over Configuration** : Suivre les conventions établies pour minimiser les décisions arbitraires

### 2. Qualité du Code

- **Documentation** : Tout code non évident doit être documenté
- **Tests** : Écrire des tests pour les fonctionnalités critiques
- **Revue de Code** : Faire relire le code par d'autres développeurs avant intégration
- **Refactoring** : Améliorer régulièrement le code existant sans changer son comportement
- **Nommage Explicite** : Choisir des noms clairs et descriptifs pour les variables, fonctions et classes

## Bonnes Pratiques Spécifiques

### Pour les Modifications UI

- **TOUJOURS passer par UIService** pour les modifications du DOM
- **NE JAMAIS modifier le DOM directement** depuis les controllers
- **TOUJOURS vérifier la validité des options** avant mise à jour
- **UTILISER les événements personnalisés** pour la synchronisation
- **IMPLÉMENTER le défilement** avec les propriétés appropriées (`overflow`, `pointer-events`)

### Pour la Gestion des Modèles IA

- **TOUJOURS vérifier la connectivité** avant changement
- **GÉRER les fallbacks** de manière appropriée
- **MAINTENIR la cohérence** entre UI et état
- **SUPPORTER l'ajout dynamique** de modèles Ollama
- **UTILISER l'option "Prompt"** comme fallback si aucun modèle n'est disponible ou connecté
- **PERMETTRE à l'utilisateur** de sélectionner manuellement l'option "Prompt" pour le débogage

### Pour la Gestion de l'État

- **TOUJOURS utiliser StateManager** pour gérer l'état global
- **NE JAMAIS stocker l'état** dans les composants
- **SYNCHRONISER l'UI avec l'état** de manière bidirectionnelle
- **VALIDER les options** avant mise à jour
- **UTILISER les abonnements** pour réagir aux changements d'état

### Pour les Traductions

- **TOUJOURS utiliser getTranslation()** pour les textes affichés
- **NE JAMAIS hardcoder les textes** directement dans le code
- **MAINTENIR les fichiers de traduction** synchronisés entre langues
- **DOCUMENTER** les changements importants dans les traductions

### Pour les Personas

- **TOUJOURS hériter de BasePersona** pour les nouveaux personas
- **TOUJOURS définir les méthodes requises** dans les classes dérivées
- **NE JAMAIS modifier d'autres composants** depuis les personas
- **MAINTENIR la cohérence** dans le style d'expression

### Pour les Services

- **Respecter la séparation des responsabilités** entre services
- **NE PAS dupliquer la logique** entre services
- **UTILISER les interfaces définies** pour communiquer entre services
- **NE PAS créer de dépendances circulaires** entre services

### Pour la Gestion du Défilement et des Interactions

- **UTILISER la méthode `initScrollHandlers()`** pour initialiser le défilement
- **ÉVITER `pointer-events: none`** sur les conteneurs défilables
- **ASSURER la compatibilité** avec la molette de souris et le tactile
- **MAINTENIR des niveaux z-index cohérents** pour éviter les problèmes d'interaction
- **PERMETTRE les interactions utilisateur** avec le texte généré

## Gestion des Événements

### Règles pour les Événements

1. **Propagation**
   - TOUJOURS utiliser la délégation d'événements quand possible
   - NE JAMAIS arrêter la propagation sans raison valide

2. **État**
   - TOUJOURS mettre à jour StateManager avant l'UI
   - TOUJOURS émettre des événements personnalisés pour les changements d'état

3. **Performance**
   - UTILISER la délégation pour les listes dynamiques
   - DÉBOUNCER les événements fréquents (resize, scroll)

4. **Erreurs**
   - TOUJOURS avoir un gestionnaire d'erreurs global
   - LOGGER les erreurs importantes
   - INFORMER l'utilisateur de manière appropriée
   - BASCULER sur l'option "Prompt" en cas d'erreurs de connectivité IA
   - PERMETTRE la poursuite de l'utilisation sans modèle IA disponible

## CSS et Styles

### Organisation des Styles

- **SUIVRE l'architecture CSS** modularisée (base, modules, components)
- **UTILISER les variables CSS** pour les valeurs réutilisables
- **PRÉFÉRER les classes aux ID** pour les sélecteurs CSS
- **RESPECTER la convention BEM** pour le nommage des classes CSS
- **ÉVITER les styles inline** sauf cas exceptionnels

### Positionnement des Cartes

- **UTILISER les conventions de nommage standardisées** pour les variables CSS
- **MAINTENIR les deux systèmes d'identification** (sémantique et numérique)
- **SUIVRE le système documenté** pour l'ajout de nouveaux tirages
- **UTILISER l'éditeur visuel** pour définir de nouvelles positions
- **TESTER les positions** sur différentes tailles d'écran

## Contributions et Évolutions

### Processus de Contribution

1. **Comprendre l'architecture** existante avant de modifier le code
2. **Discuter des changements majeurs** avant implémentation
3. **Suivre les conventions** de code et de nommage
4. **Documenter les modifications** significatives
5. **Tester exhaustivement** les changements avant soumission

### Évolutions Futures

- **Maintenir la rétrocompatibilité** avec le code existant
- **Documenter les API** pour faciliter l'extension
- **Prévoir la scalabilité** des nouvelles fonctionnalités
- **Considérer l'impact sur les performances** des ajouts
- **Intégrer gracieusement** les nouvelles technologies

## Standards de Code

### 1. JavaScript

```javascript
// Utiliser const par défaut, let si nécessaire
const config = {
  // Configuration
};
let counter = 0;

// Classes avec PascalCase
class StateManager {
  constructor() {
    // ...
  }
}

// Méthodes et variables en camelCase
function calculateTotal() {
  // ...
}

// Constantes en SNAKE_CASE
const MAX_RETRIES = 3;
```

### 2. Documentation

```javascript
/**
 * Description de la fonction
 * @param {Type} paramName - Description du paramètre
 * @returns {Type} Description du retour
 * @throws {Error} Description de l'erreur
 */
function example(paramName) {
  // ...
}
```

### 3. Gestion des Erreurs

```javascript
try {
  // Opération risquée
  await riskyOperation();
} catch (error) {
  console.error('Description claire:', error);
  throw new Error(`Contexte: ${error.message}`);
}
```

## Organisation du Code

### 1. Structure des Fichiers

```
src/
├── components/     # Composants réutilisables
├── services/      # Services métier
├── models/        # Modèles de données
├── utils/         # Utilitaires
└── config/        # Configuration
```

### 2. Imports/Exports

```javascript
// Un export par fichier
export default class MainClass { }

// Exports multiples nommés
export { func1, func2 };
```

## Tests

### 1. Tests Unitaires

```javascript
describe('StateManager', () => {
  it('should initialize with default state', () => {
    const manager = new StateManager();
    expect(manager.getState()).toBeDefined();
  });
});
```

### 2. Tests d'Intégration

```javascript
describe('AIService Integration', () => {
  it('should handle API responses', async () => {
    const service = new AIService();
    const response = await service.getInterpretation();
    expect(response).toBeDefined();
  });
});
```

## Performance

### 1. Optimisation du Code

```javascript
// Éviter les calculs répétés
const cachedValue = expensiveOperation();
results.forEach(item => {
  process(item, cachedValue);
});
```

### 2. Gestion de la Mémoire

```javascript
// Nettoyage des listeners
class Component {
  destroy() {
    this.listeners.forEach(l => l.remove());
    this.listeners = [];
  }
}
```

## Sécurité

### 1. Validation des Entrées

```javascript
function processUserInput(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input');
  }
  return sanitizeInput(input);
}
```

### 2. Protection des Données

```javascript
// Stockage sécurisé des clés API
function storeApiKey(key) {
  const encoded = btoa(key);
  localStorage.setItem('api_key', encoded);
}
```

## Gestion de l'État

### 1. Modifications d'État

```javascript
// Immutabilité
function updateState(state, changes) {
  return {
    ...state,
    ...changes
  };
}
```

### 2. Événements

```javascript
// Publication d'événements
class EventEmitter {
  emit(event, data) {
    this.listeners[event]?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Event handler error: ${error}`);
      }
    });
  }
}
```

## Internationalisation

### 1. Textes

```javascript
const translations = {
  fr: {
    welcome: 'Bienvenue',
    error: 'Erreur: {{message}}'
  }
};
```

### 2. Formatage

```javascript
function formatMessage(key, params) {
  let message = translations[currentLang][key];
  return message.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key]);
}
```

## Débogage

### 1. Logging

```javascript
const DEBUG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
};

function log(level, message, ...args) {
  if (level <= currentDebugLevel) {
    console.log(`[${new Date().toISOString()}] ${message}`, ...args);
  }
}
```

### 2. Monitoring

```javascript
class PerformanceMonitor {
  start(operation) {
    this.timers[operation] = performance.now();
  }

  end(operation) {
    const duration = performance.now() - this.timers[operation];
    log('perf', `${operation}: ${duration}ms`);
  }
}
```

## Versionnement

### 1. Git

```bash
# Branches
feature/nom-feature
bugfix/nom-bug
release/x.y.z

# Commits
type(scope): description

# Types: feat, fix, docs, style, refactor, test, chore
```

### 2. Releases

```bash
# Tags sémantiques
v1.0.0 # Major
v1.1.0 # Minor
v1.1.1 # Patch
```

## Déploiement

### 1. Environnements

```javascript
const config = {
  development: {
    apiUrl: 'http://localhost:3000'
  },
  production: {
    apiUrl: 'https://api.example.com'
  }
}[process.env.NODE_ENV];
```

### 2. Build

```bash
# Scripts npm
"scripts": {
  "build": "webpack --mode production",
  "test": "jest --coverage",
  "lint": "eslint src/**/*.js"
}
```

## Maintenance

### 1. Documentation

- README.md à jour
- Changelog maintenu
- Documentation API
- Guides d'utilisation

### 2. Revue de Code

- Pull requests documentées
- Tests inclus
- Revue par pairs
- Standards respectés 