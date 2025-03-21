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
const SETTINGS = {
  // URL du serveur Ollama local
  OLLAMA_URL: "http://localhost:11434",
  // ... autres paramètres
};

// Points d'accès de l'API Ollama
const API_URL_OLLAMA = `${SETTINGS.OLLAMA_URL}/api/generate`;
const API_URL_OLLAMA_TAGS = `${SETTINGS.OLLAMA_URL}/api/tags`;
```

### Timeouts et Paramètres

```javascript
const TIMEOUTS = {
  OLLAMA_CONNECT: 30000,    // 30s pour la connexion initiale
  OLLAMA_MODEL_LOAD: 60000, // 60s pour le chargement du modèle
  OLLAMA_RESPONSE: 120000,  // 120s pour la génération
  OLLAMA_CHECK: 5000,       // 5s pour vérifier l'état
  MAX_RETRIES: 3,           // Nombre de tentatives
  RETRY_DELAY: 1000        // Délai entre tentatives
};
```

## Mécanismes Avancés

Le module d'API de JodoTarot intègre plusieurs mécanismes sophistiqués pour assurer une communication fiable avec les services d'IA:

### Gestion intelligente des timeouts

- **Timeouts différenciés par étape**: Différents timeouts sont configurés pour chaque phase (connexion, chargement du modèle, génération de réponse)
- **Détection automatique d'inactivité**: Le système surveille l'arrivée des chunks de données et déclenche une erreur si aucune donnée n'est reçue pendant une période configurable
- **Timers adaptatifs**: Les délais d'attente sont ajustés automatiquement selon le type de modèle (local vs cloud)

### Système de retry automatique

- **Tentatives multiples**: En cas d'erreur réseau, le système tente automatiquement de rétablir la connexion
- **Délai exponentiel**: Le temps d'attente entre les tentatives augmente progressivement pour éviter de surcharger le serveur
- **Paramètres configurables**: Le nombre maximal de tentatives et le délai initial sont définissables via les constantes TIMEOUTS

### Détection et adaptation de format

- **Reconnaissance automatique**: Le système détecte automatiquement le format de réponse selon le modèle d'IA utilisé
- **Support multi-formats**: Prise en charge des formats spécifiques à OpenAI et des différentes versions d'Ollama
- **Normalisation des réponses**: Les différents formats sont convertis en une structure unifiée pour simplifier l'utilisation

### Cache optimisé des réponses

```javascript
// Système simple de cache pour les réponses
const responseCache = new Map();

// Exemple d'utilisation du cache
const cacheKey = `${question}_${persona}_${modele}_${langue}`;
if (responseCache.has(cacheKey) && !forceRefresh) {
  return responseCache.get(cacheKey);
}
// ... génération de la réponse ...
responseCache.set(cacheKey, response);
```

### Streaming efficace

- Support complet du streaming pour toutes les API
- Traitement en temps réel des chunks de données
- Effet machine à écrire pour une expérience utilisateur fluide

### Gestion robuste des erreurs

```javascript
try {
  // Appel API
} catch (error) {
  // Analyse détaillée de l'erreur
  if (error.message.includes('timeout')) {
    // Gestion spécifique des timeouts
  } else if (error.response?.status === 401) {
    // Gestion des erreurs d'authentification
  } else {
    // Gestion des erreurs génériques
  }
}
```

Ces mécanismes permettent à JodoTarot de fonctionner de manière fiable même dans des conditions réseau difficiles ou avec des modèles d'IA ayant des temps de réponse variables.

## Communication avec Ollama

### Format de Requête

Pour générer une interprétation, nous utilisons l'endpoint `/api/generate` avec le format suivant :

```javascript
{
  "model": "nom_du_modele",  // ex: "llama2"
  "prompt": "texte_complet", // Combinaison des prompts système et utilisateur
  "stream": true,            // Activation du streaming
  "options": {
    "temperature": 0.7,      // Créativité de la génération
    "num_predict": 1000      // Nombre max de tokens à générer
  }
}
```

### Gestion du Streaming

Le streaming permet de recevoir la réponse progressivement. Voici comment nous le gérons :

1. Envoi de la requête en streaming
2. Lecture du flux de réponse avec un `ReadableStream`
3. Décodage des chunks en UTF-8
4. Parsing du JSON ligne par ligne
5. Extraction de la réponse et envoi au callback

```javascript
// Exemple de traitement du streaming
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  const lines = chunk.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const data = JSON.parse(line);
    if (data.response) {
      onChunk(data.response);
    }
  }
}
```

## Formats de Réponse

Différents modèles peuvent avoir différents formats de réponse. Nous gérons cela avec une configuration par modèle :

```javascript
const OLLAMA_MODEL_FORMATS = {
  "llama2": {
    pattern: /\bllama2\b/i,
    responseKey: "response",
    description: "Llama 2 (retourne response)"
  },
  // ... autres modèles
};
```

## Gestion des Erreurs

1. **Erreurs de connexion** : Vérification que le serveur Ollama est accessible
2. **Erreurs de modèle** : Vérification que le modèle est installé
3. **Erreurs de génération** : Gestion des timeouts et tentatives multiples
4. **Erreurs de streaming** : Gestion des erreurs de parsing JSON

## Bonnes Pratiques

1. **Toujours vérifier la disponibilité du serveur** avant d'envoyer des requêtes
2. **Utiliser le mode "prompt"** comme fallback si Ollama n'est pas disponible
3. **Nettoyer le nom du modèle** en retirant le préfixe "ollama:"
4. **Gérer les timeouts** appropriés selon l'opération
5. **Logger les erreurs** pour faciliter le débogage

## Débogage

Activer le mode debug dans `config.js` pour plus de détails :

```javascript
const DEBUG_LEVEL = 2; // 0: aucun, 1: basique, 2: détaillé
```

Les logs incluront :
- Les prompts envoyés
- Le format des requêtes
- Les réponses reçues
- Les erreurs détaillées

## Limitations Connues

1. Certains modèles peuvent nécessiter beaucoup de RAM
2. Les temps de chargement initial peuvent être longs
3. La qualité des réponses dépend du modèle utilisé
4. Le streaming peut être instable sur certains modèles

## Évolutions Futures

1. Support de modèles multimodaux (images)
2. Amélioration de la gestion de la mémoire
3. Cache des réponses fréquentes
4. Interface de gestion des modèles
5. Support de nouveaux formats de modèles 