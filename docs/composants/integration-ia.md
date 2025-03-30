# Intégration IA

## Vue d'ensemble

JodoTarot utilise deux fournisseurs d'IA pour l'interprétation des tirages :
- OpenAI (API cloud)
- Ollama (API locale)

Cette documentation se concentre sur l'intégration avec Ollama, qui permet d'exécuter des modèles d'IA localement.

## Configuration Ollama

### Prérequis

1. Installer Ollama sur votre machine : [https://ollama.ai](https://ollama.ai)
2. Démarrer le serveur Ollama :
```bash
ollama serve
```
3. Télécharger un modèle compatible (par exemple llama2) :
```bash
ollama pull llama2
```

### Configuration dans JodoTarot

La configuration d'Ollama se fait dans `assets/js/config.js` :

```javascript
// Paramètres utilisateur configurables
const SETTINGS = {
  // URLs des services
  OLLAMA_URL: "http://localhost:11434",  // URL du serveur Ollama local
  OPENAI_URL: "https://api.openai.com/v1", // URL de l'API OpenAI
  
  // Autres paramètres...
};

// Points d'accès de l'API Ollama
const API_URL_OLLAMA = `${SETTINGS.OLLAMA_URL}/api/generate`;
const API_URL_OLLAMA_TAGS = `${SETTINGS.OLLAMA_URL}/api/tags`;
```

### Timeouts et Paramètres

```javascript
// Configuration des timeouts (en millisecondes)
const TIMEOUTS = {
  OLLAMA_CONNECT: 30000,    // 30 secondes pour la connexion initiale
  OLLAMA_MODEL_LOAD: 60000, // 60 secondes pour le chargement du modèle
  OLLAMA_RESPONSE: 120000,  // 120 secondes pour la génération de réponse
  OLLAMA_CHECK: 5000,      // 5 secondes pour vérifier l'état des modèles
  MAX_RETRIES: 3,          // Nombre maximum de tentatives
  RETRY_DELAY: 1000,       // Délai entre les tentatives (1 seconde)
  MODEL_LOAD_CHECK: 10000  // 10 secondes pour vérifier si un modèle est chargé
};
```

## Mécanismes Avancés

Le module d'API de JodoTarot intègre plusieurs mécanismes sophistiqués pour assurer une communication fiable avec les services d'IA:

### Gestion intelligente des timeouts

- **Timeouts différenciés par étape**: Différents timeouts sont configurés pour chaque phase (connexion, chargement du modèle, génération de réponse)
- **Détection automatique d'inactivité**: Le système surveille l'arrivée des chunks de données et déclenche une erreur si aucune donnée n'est reçue pendant une période configurable
- **Timers adaptatifs**: Les délais d'attente sont ajustés automatiquement selon le type de modèle (local vs cloud)

### Système de retry automatique

L'implémentation utilise un système de retry intelligent dans la méthode `fetchWithRetry` :

```javascript
async fetchWithRetry(url, options, maxRetries = TIMEOUTS.MAX_RETRIES, timeoutMs = TIMEOUTS.OLLAMA_CONNECT) {
  let retries = 0;
  let lastError = null;
  
  while (retries <= maxRetries) {
    try {
      // Créer un contrôleur d'abandon pour le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      // Ajouter le signal au options
      const optionsWithSignal = {
        ...options,
        signal: controller.signal
      };
      
      try {
        // Tenter la requête
        const response = await fetch(url, optionsWithSignal);
        clearTimeout(timeoutId);
        
        // Si la réponse est OK, la retourner
        if (response.ok) {
          return response;
        }
        
        // Sinon, lire le texte d'erreur et le lancer
        const errorText = await response.text();
        throw new Error(`Erreur API (${response.status}): ${errorText.slice(0, 100)}`);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      lastError = error;
      retries++;
      
      const isTimeout = error.name === 'AbortError';
      const retriesLeft = maxRetries - retries + 1;
      
      if (retriesLeft > 0) {
        // Délai exponentiel avec un peu d'aléatoire pour éviter les collisions
        const delay = Math.pow(2, retries) * 1000 + Math.random() * 500;
        console.warn(`Tentative ${retries}/${maxRetries} échouée${isTimeout ? ' (timeout)' : ''}: ${error.message}. Nouvelle tentative dans ${delay/1000} secondes...`);
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error(`Toutes les tentatives ont échoué (${retries}/${maxRetries}):`, error);
        throw error;
      }
    }
  }
  
  // Ce code ne devrait jamais être atteint, mais par précaution
  throw lastError || new Error("Erreur inconnue pendant les tentatives de connexion");
}
```

### Détection et adaptation de format

La classe AIService comprend une gestion sophistiquée des différents formats de réponse selon le modèle utilisé :

```javascript
// Configuration des modèles Ollama
const OLLAMA_MODEL_FORMATS = {
  "llama3.1": {
    pattern: /\bllama3\.1\b/i,
    responseKey: "choices.0.message.content",
    description: "Llama 3.1 (retourne choices[0].message.content)"
  },
  "llama3": {
    pattern: /\bllama3\b(?!\.1)/i, // llama3 mais pas llama3.1
    responseKey: "message.content",
    description: "Llama 3 (retourne message.content)"
  },
  "llama2": {
    pattern: /\bllama2\b/i,
    responseKey: "response",
    description: "Llama 2 (retourne response)"
  },
  // ... autres modèles ...
};

function getOllamaModelFormat(modelName) {
  // Recherche du format approprié selon le nom du modèle
}
```

### Cache optimisé des réponses

```javascript
// Système simple de cache pour les réponses
const responseCache = new Map();

// Exemple d'utilisation du cache
const cacheKey = JSON.stringify({
  persona,
  message,
  tirage: tirage.map(card => card.id),
  spreadType,
  langue
});

if (responseCache.has(cacheKey)) {
  return responseCache.get(cacheKey);
}
// ... génération de la réponse ...
responseCache.set(cacheKey, fullResponse);
```

### Streaming efficace

Le service AIService implémente un streaming efficace via une méthode dédiée :

```javascript
async getOllamaStreamingResponse(prompt, systemPrompts, modelName, onChunk, signal) {
  // Nettoyer le nom du modèle
  const cleanModelName = modelName.replace('ollama:', '');
  
  // Construire le prompt complet
  const fullPrompt = [
    ...systemPrompts,
    prompt
  ].join('\n\n');
  
  // Corps de la requête
  const body = {
    model: cleanModelName,
    prompt: fullPrompt,
    stream: true,
    options: {
      temperature: 0.7,
      num_predict: 1000
    }
  };
  
  // Effectuer la requête
  const response = await fetch(API_URL_OLLAMA, options);
  
  // Lire le flux de réponse
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let completeResponse = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    // Convertir et traiter les chunks
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      const data = JSON.parse(line);
      if (data.response) {
        completeResponse += data.response;
        onChunk(data.response);
      }
    }
  }
  
  return completeResponse;
}
```

### Gestion robuste des erreurs

L'application gère de manière robuste différents types d'erreurs :

```javascript
try {
  // Appel API
} catch (error) {
  this.isGenerating = false;
  
  if (this.handleAbortError(error)) {
    return "";
  }
  
  // Gestion plus détaillée des erreurs
  let errorMessage = "Une erreur est survenue lors de l'interprétation.";
  
  if (!this.apiKey && model.startsWith('openai/')) {
    errorMessage = "La clé API OpenAI n'est pas configurée.";
  } else if (error.message.includes('timeout')) {
    errorMessage = "Le temps de réponse a dépassé la limite.";
  } else if (error.message.includes('connect')) {
    errorMessage = "Impossible de se connecter au service d'IA.";
  }
  
  throw new Error(errorMessage);
}
```

## Communication avec Ollama

### Format de Requête

Pour générer une interprétation, nous utilisons l'endpoint `/api/generate` (Ollama) ou le format correspondant pour OpenAI :

```javascript
// Format pour Ollama (méthode non streaming)
{
  model: cleanModelName,
  messages: [
    { role: 'system', content: systemContent },
    { role: 'user', content: prompt }
  ],
  stream: false
}

// Format pour le streaming Ollama
{
  model: cleanModelName,
  prompt: fullPrompt,
  stream: true,
  options: {
    temperature: 0.7,
    num_predict: 1000
  }
}

// Format pour OpenAI
{
  model: model,
  messages: [
    { role: 'system', content: systemContent },
    { role: 'user', content: prompt }
  ],
  temperature: 0.7
}
```

### Gestion du Streaming

Le streaming est implémenté selon ces étapes :

1. Création d'une requête avec `stream: true`
2. Utilisation de l'API ReadableStream via `response.body.getReader()`
3. Décodage des chunks avec TextDecoder
4. Parsing du JSON ligne par ligne
5. Extraction du contenu via le callback `onChunk`

## Formats de Réponse

La configuration des formats de réponse est définie dans `config.js` et utilisée par `AIService` :

```javascript
// Exemple d'extraction du contenu adapté au format du modèle
const modelNameWithoutPrefix = model.replace('ollama:', '');
const modelFormat = getOllamaModelFormat(modelNameWithoutPrefix);
const responseKey = modelFormat.responseKey || "message.content";

return this.extractResponseContent(data, responseKey, modelNameWithoutPrefix);
```

## Test de Connectivité

Le système inclut des fonctions pour tester la disponibilité du serveur Ollama et des modèles :

```javascript
async testOllamaConnectivity(modelName = null) {
  try {
    // 1. Vérifier d'abord les modèles déjà chargés
    const loadedModels = await checkLoadedModels();
    if (modelName && loadedModels.models) {
      const isLoaded = loadedModels.models.some(m => m.name === modelName || m.model === modelName);
      // ...
    }

    // 2. Test de ping du serveur
    const pingResponse = await fetch(`${SETTINGS.OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(TIMEOUTS.OLLAMA_CONNECT)
    });
    
    // ...

    // 3. Test rapide du modèle avec préchargement
    const preloadResult = await preloadModel(modelName);
    // ...
  }
}
```

## Bonnes Pratiques

1. **Toujours vérifier la connectivité** avant d'envoyer des requêtes
2. **Utiliser le mode "prompt"** comme fallback si Ollama n'est pas disponible
3. **Nettoyer le nom du modèle** en retirant le préfixe "ollama:"
4. **Gérer les timeouts** appropriés selon l'opération
5. **Utiliser le système de retry** pour les opérations sensibles
6. **Extraire correctement les réponses** selon le format du modèle utilisé

## Débogage

Le niveau de débogage est configurable dans `config.js` :

```javascript
// Configuration de debug
const DEBUG_LEVEL = 1; // 0: aucun, 1: basique, 2: détaillé, 3: verbeux
```

La classe AIService inclut un mode debug conditionnel :

```javascript
if (this.debugMode) {
  // Construire le prompt complet comme il sera envoyé à l'IA
  const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
  
  console.log('📨 PROMPT FINAL ENVOYÉ À L\'IA:');
  console.log(fullPrompt);
  
  // Afficher des informations supplémentaires sur le persona
  if (PERSONAS[persona]) {
    const personaInstance = new PERSONAS[persona](language);
    console.log(`🧙‍♂️ Persona: ${personaInstance.getName()}`);
    console.log(`📝 Description: ${personaInstance.getDescription()}`);
    console.log(`🔮 Spécialisations: ${personaInstance.getSpecializations().join(', ')}`);
  }
}
```

## Mode "Prompt"

Le système inclut un mode spécial "prompt" qui fonctionne comme un fallback et un outil de débogage :

```javascript
// Mode spécial "prompt" (Sans IA)
if (model === 'prompt') {
  console.log('📝 Mode Prompt activé : affichage du prompt sans appel à l\'IA');
  
  // Concaténer simplement les prompts système et utilisateur
  const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
  
  // Affichage minimal sans formatage particulier
  const response = `<div class="prompt-display">${fullPrompt}</div>`;
  
  this.isGenerating = false;
  return response;
}
```

## Limitations Connues

1. Certains modèles peuvent nécessiter beaucoup de RAM
2. Les temps de chargement initial peuvent être longs
3. La qualité des réponses dépend du modèle utilisé
4. Le streaming peut être instable sur certains modèles
5. Différents modèles utilisent différents formats de réponse

## Évolutions Futures

1. Support de modèles multimodaux (images)
2. Amélioration de la gestion de la mémoire
3. Optimisation du système de cache
4. Interface de gestion des modèles Ollama
5. Support de nouveaux formats de modèles 