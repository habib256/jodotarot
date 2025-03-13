# Guide de Simplification de JodoTarot

## Résumé des Modifications

Le code de JodoTarot a été simplifié pour améliorer la maintenabilité et réduire la duplication. Voici les principales modifications :

1. **Consolidation des fonctionnalités IA** - Toutes les fonctionnalités liées à l'IA ont été regroupées dans `AIService.js`
2. **Suppression des duplications** - Le code redondant entre l'ancien `api.js` et `AIService.js` a été éliminé
3. **Suppression complète de api.js** - Le fichier `api.js` a été entièrement supprimé, toutes les fonctionnalités sont maintenant dans `AIService.js`
4. **Amélioration de la gestion d'erreur** - Centralisation du traitement des erreurs
5. **Optimisation du cache** - Système de cache intégré pour les réponses d'IA

## Comment utiliser le nouveau code

### Utilisation de l'AIService

L'`AIService` est maintenant le point d'entrée principal et unique pour toutes les fonctionnalités liées à l'IA :

```javascript
import AIService from './assets/js/services/AIService.js';
import StateManager from './assets/js/utils/StateManager.js';

// Créer un gestionnaire d'état
const stateManager = new StateManager();
await stateManager.initialize();

// Initialiser le service d'IA
const aiService = new AIService(stateManager);

// Obtenir une interprétation
const interpretation = await aiService.getInterpretation(
  tirage,          // Le tirage de cartes
  question,        // La question posée
  persona,         // Le persona sélectionné (ex: 'tarologue')
  model,           // Le modèle d'IA (ex: 'openai/gpt-4o' ou 'ollama:llama3')
  language,        // La langue (ex: 'fr')
  spreadType       // Le type de tirage (ex: 'cross')
);
```

### Tester la disponibilité des modèles

```javascript
// Tester la disponibilité d'un modèle Ollama
const ollamaAvailability = await aiService.testOllamaConnectivity('llama3');

// Tester la disponibilité d'un modèle OpenAI
const openaiAvailability = await aiService.testModelAvailability('openai/gpt-4');

// Obtenir la liste des modèles Ollama disponibles
const ollamaModels = await aiService.getOllamaModels();
```

### Streaming des réponses

Pour recevoir les réponses en temps réel (streaming) :

```javascript
let currentResponse = '';
const onChunk = (chunk) => {
  currentResponse = chunk;
  updateUI(currentResponse); // Fonction pour mettre à jour l'interface
};

const finalResponse = await aiService.getInterpretation(
  tirage, question, persona, model, language, spreadType, 
  onChunk // Fonction de callback pour le streaming
);
```

### Mode Prompt Uniquement

Pour obtenir seulement le prompt sans appel à l'IA :

```javascript
// Utiliser 'prompt' comme modèle
const promptOnly = await aiService.getInterpretation(
  tirage, question, persona, 'prompt', language, spreadType
);
```

## Migration depuis l'ancien code

⚠️ **ATTENTION** : Le fichier `api.js` a été complètement supprimé. Si votre code utilisait des fonctions de ce fichier, vous devez impérativement les remplacer par les nouvelles méthodes de `AIService`.

### Table de correspondance pour la migration

Vous devez remplacer les anciennes fonctions par les nouvelles :

| Ancienne fonction (SUPPRIMÉE) | Nouvelle fonction |
|-------------------|-------------------|
| `obtenirReponseGPT4O()` | `aiService.getInterpretation()` |
| `obtenirModelesOllama()` | `aiService.getOllamaModels()` |
| `testOllamaConnectivity()` | `aiService.testOllamaConnectivity()` |
| `verifierConnexionOllama()` | `aiService.testOllamaConnectivity()` |

### Exemple de migration

Ancien code (NE FONCTIONNE PLUS) :
```javascript
import { obtenirReponseGPT4O } from './assets/js/api.js'; // ❌ Ce fichier n'existe plus

// Appel à l'ancienne API
const reponse = await obtenirReponseGPT4O(question, prompts, modele, persona, tirage, langue, type);
```

Nouveau code :
```javascript
import AIService from './assets/js/services/AIService.js';
import StateManager from './assets/js/utils/StateManager.js';

// Initialisation
const stateManager = new StateManager();
await stateManager.initialize();
const aiService = new AIService(stateManager);

// Nouvel appel équivalent
const reponse = await aiService.getInterpretation(tirage, question, persona, modele, langue, type);
```

## Changements dans les fichiers de projet

Voici les modifications apportées aux fichiers du projet pour prendre en compte la suppression de `api.js` :

1. `assets/js/app.js` - Mise à jour des imports pour utiliser directement `AIService`
2. Suppression complète du fichier `assets/js/api.js`
3. Migration de toutes les fonctionnalités vers `AIService.js`

## Avantages de la nouvelle implémentation

1. **Code plus maintenable** - Organisation plus claire et moins de duplication
2. **Meilleure gestion des erreurs** - Traitement centralisé et messages d'erreur plus précis
3. **Cache optimisé** - Les réponses identiques sont mises en cache pour améliorer les performances
4. **Flexibilité** - Séparation claire entre la logique métier et l'interface utilisateur
5. **Réduction de la taille du code** - Moins de lignes de code à maintenir

## Prochaines étapes

Pour continuer à améliorer le code, les actions suivantes pourraient être envisagées :

1. **Tests unitaires** - Ajouter des tests pour `AIService`
2. **Documentation complète** - Ajouter des commentaires JSDoc à toutes les méthodes
3. **Gestion des modèles IA** - Interface unifiée pour ajouter de nouveaux modèles
4. **Optimisation des performances** - Améliorer la gestion des requêtes simultanées
5. **Module d'historique** - Sauvegarde et chargement des interprétations précédentes 