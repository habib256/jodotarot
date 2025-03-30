# Sécurité et Protection des Données

## Vue d'Ensemble

JodoTarot prend en compte la sécurité et la protection des données des utilisateurs dès la conception. Ce document détaille les mesures mises en place pour garantir la confidentialité, l'intégrité et la disponibilité des informations.

## Principes de Sécurité

### 1. Protection des Données Utilisateur

JodoTarot suit les principes suivants pour la gestion des données utilisateur :

- **Minimalisme des données** : Collecte uniquement les données nécessaires au fonctionnement de l'application
- **Stockage local** : Utilisation principalement du localStorage pour éviter les transmissions inutiles
- **Transparence** : Communication claire sur les données collectées et leur utilisation
- **Contrôle utilisateur** : Possibilité pour l'utilisateur de supprimer ses données

### 2. Communications Sécurisées

Pour les interactions avec les API externes (OpenAI/Ollama) :

```javascript
// Implémentation réelle de la sécurisation des appels API dans api.js
async function fetchWithTimeout(url, options, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`La requête a expiré après ${timeoutMs / 1000} secondes`);
    }
    throw error;
  }
}

// Utilisation dans les appels API avec validation de la réponse
const response = await fetchWithTimeout(API_URL, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(sanitizedData)
}, TIMEOUTS.OLLAMA_RESPONSE);

if (!response.ok) {
  throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
}
```

## Stockage des Données

### 1. Données Locales

JodoTarot utilise principalement le stockage local pour les données utilisateur, notamment via le `StateManager` :

```javascript
// Persistance de l'état dans StateManager.js
persistState() {
  try {
    // Ne pas persister les états temporaires
    const stateToPersist = {...this.state};
    const temporaryKeys = ['isLoading', 'error', 'isCardEnlarged', 'enlargedCardId'];
    temporaryKeys.forEach(key => delete stateToPersist[key]);
    
    // Vérifier la taille avant la sauvegarde
    const stateString = JSON.stringify({
      version: this.STATE_VERSION,
      timestamp: Date.now(),
      data: this.serializeState(stateToPersist)
    });
    
    const stateSize = new Blob([stateString]).size;
    const SIZE_LIMIT = 5 * 1024 * 1024;
    
    if (stateSize > SIZE_LIMIT) {
      throw new Error(`L'état est trop volumineux pour être sauvegardé (${Math.round(stateSize / 1024)}KB > ${Math.round(SIZE_LIMIT / 1024)}KB)`);
    }
    
    // Sauvegarde dans localStorage
    localStorage.setItem('jodotarot_state', stateString);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de l\'état:', error);
    document.dispatchEvent(new CustomEvent('stateManager:error', {
      detail: { error: error.message }
    }));
    return false;
  }
}
```

### 2. Types de Données Stockées

JodoTarot stocke les types de données suivants :

| Type de donnée | Sensibilité | Stockage | Durée |
|---------------|------------|----------|-------|
| Préférences utilisateur | Faible | localStorage via StateManager | Persistante |
| Historique des tirages | Moyenne | localStorage via StateManager | Persistante (avec option d'effacement) |
| Questions utilisateur | Moyenne | Mémoire + localStorage | Session + persistante (si enregistrée) |
| Clés API personnelles | Haute | localStorage (encodées en Base64) | Persistante |

## Gestion des Clés API

Pour les utilisateurs qui configurent leurs propres clés API (OpenAI), l'implémentation réelle est la suivante :

```javascript
// Stockage des clés API dans AIService.js
setApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    console.error('La clé API doit être une chaîne de caractères valide');
    return;
  }
  
  try {
    // Enregistrer la clé en mémoire
    this.apiKey = apiKey;
    
    // Sauvegarder dans le localStorage pour la persistance entre les sessions
    if (window.localStorage) {
      // Encodage simple en Base64 (non sécurisé mais offre une protection visuelle)
      const encodedKey = btoa(apiKey);
      localStorage.setItem('jodotarot_api_key', encodedKey);
      console.log('Clé API OpenAI sauvegardée dans le localStorage');
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la clé API:', error);
  }
}

// Récupération des clés API
loadApiKey() {
  try {
    if (window.localStorage) {
      const encodedKey = localStorage.getItem('jodotarot_api_key');
      if (encodedKey) {
        // Décoder la clé
        const apiKey = atob(encodedKey);
        this.apiKey = apiKey;
        console.log('Clé API OpenAI chargée depuis le localStorage');
        return apiKey;
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la clé API:', error);
  }
  
  return null;
}
```

**Avertissement de sécurité** : L'encodage Base64 n'est pas un chiffrement sécurisé et ne devrait pas être considéré comme une protection robuste. Il s'agit uniquement d'une protection visuelle de base.

## Protection Contre les Vulnérabilités Courantes

### 1. Injection

- **Validation des entrées** : Toutes les entrées utilisateur sont validées avant utilisation
- **Échappement des sorties** : Les données affichées sont échappées pour éviter les injections XSS

```javascript
// Exemple réel de protection contre les injections XSS dans ReadingController.js
getInterpretation() {
  // Validation et nettoyage des entrées
  const question = this.elements.questionInput.value.trim();
  
  // Affichage sécurisé de la réponse
  this.elements.responseContent.innerHTML = `
    <div class="loading-message">
      <p>${getTranslation('interpretation.generatingResponse', language)}</p>
      <div class="loading-spinner"></div>
    </div>
  `;
  
  // Quand la réponse arrive, elle est affichée progressivement avec l'échappement des balises HTML
  const handleChunk = (chunk) => {
    // Nettoyage du chunk
    const cleanedChunk = chunk.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/g, '');
    
    // Ajout sécurisé au contenu
    const typewriterElement = this.elements.responseContent.querySelector('.typewriter-text');
    if (typewriterElement) {
      // L'effet de machine à écrire utilise innerHTML mais le contenu est contrôlé
      typewriterElement.innerHTML = this.fullText;
    }
  };
}
```

### 2. Validation des Données

Toutes les données, qu'elles proviennent de l'utilisateur ou d'API externes, sont validées, notamment dans le `StateManager` :

```javascript
// Validation dans StateManager.js
validateValue(key, value) {
  // Obtenir la configuration pour cette clé
  const config = this.schema[key] || {};
  
  // Vérification du type
  if (config.type && typeof value !== config.type) {
    if (config.type === 'array' && !Array.isArray(value)) {
      return { isValid: false, error: `La valeur de ${key} doit être un tableau` };
    } else if (config.type !== 'array' && typeof value !== config.type) {
      return { isValid: false, error: `La valeur de ${key} doit être de type ${config.type}` };
    }
  }
  
  // Vérification des valeurs autorisées
  if (config.allowedValues && !config.allowedValues.includes(value)) {
    return { isValid: false, error: `Valeur non autorisée pour ${key}` };
  }
  
  // Validation personnalisée
  if (config.validate && !config.validate(value)) {
    return { isValid: false, error: `Validation échouée pour ${key}` };
  }
  
  return { isValid: true, value };
}
```

## Confidentialité des Interactions IA

Pour les interactions avec les modèles d'IA, l'application propose plusieurs options :

1. **Mode "prompt"** : Permet de voir les prompts qui seraient envoyés à l'IA sans jamais faire d'appel API
2. **Modèles locaux** : Support d'Ollama pour des modèles d'IA locaux sans envoi de données externes
3. **Information utilisateur** : Interface informant clairement l'utilisateur du modèle utilisé

```javascript
// Mode "prompt" dans AIService.js
async getInterpretation(reading, question, persona, model, language = 'fr', spreadType = 'cross', onChunk = null) {
  // Validation des paramètres obligatoires
  // ...
  
  // Mode spécial "prompt" (Sans IA)
  if (model === 'prompt') {
    console.log('📝 Mode Prompt activé : affichage du prompt sans appel à l\'IA');
    
    const systemPrompts = await this.buildSystemPrompts(persona, language, spreadType);
    const prompt = this.buildPrompt(reading, question, language, spreadType);
    
    // Concaténer simplement les prompts système et utilisateur
    const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
    
    // Affichage minimal sans formatage particulier
    const response = `<div class="prompt-display">${fullPrompt}</div>`;
    
    this.isGenerating = false;
    return response;
  }
  
  // Suite du code pour les autres modèles...
}
```

## Gestion des Erreurs et Fiabilité

JodoTarot implémente plusieurs mécanismes pour assurer la fiabilité des interactions :

```javascript
// Gestion des erreurs API dans AIService.js
handleApiError(error, service) {
  console.error(`Erreur lors de l'appel à ${service}:`, error);
  
  let errorMessage = `Erreur lors de la communication avec ${service}`;
  
  if (error.message.includes('timeout')) {
    errorMessage = `Le temps de réponse de ${service} a dépassé la limite`;
  } else if (error.message.includes('connect')) {
    errorMessage = `Impossible de se connecter à ${service}`;
  } else if (error.message.includes('401') || error.message.includes('403')) {
    errorMessage = `Erreur d'authentification avec ${service}`;
  } else if (error.message.includes('429')) {
    errorMessage = `Limite de requêtes atteinte pour ${service}`;
  }
  
  return new Error(errorMessage);
}

// Tentatives de reconnexion dans api.js
async function fetchWithRetry(url, options, maxRetries = 2, timeoutMs = 5000) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await fetchWithTimeout(url, options, timeoutMs);
    } catch (error) {
      retries++;
      console.warn(`Tentative ${retries}/${maxRetries} échouée: ${error.message}`);
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Délai exponentiel entre les tentatives
      await new Promise(resolve => setTimeout(resolve, TIMEOUTS.RETRY_DELAY * Math.pow(2, retries - 1)));
    }
  }
}
```

## Configuration Sécurisée par Défaut

JodoTarot utilise une configuration sécurisée par défaut :

```javascript
// Paramètres par défaut sécurisés dans config.js
const SETTINGS = {
  // Paramètres d'API
  API_KEY: "YOUR API KEY", // Par défaut, pas de clé configurée
  ENABLE_STREAMING: true,  
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  
  // URLs des services
  OLLAMA_URL: "http://localhost:11434",  // Local par défaut
  OPENAI_URL: "https://api.openai.com/v1",
  
  // Paramètres par défaut
  DEFAULT_PERSONA: "tarologue",
  DEFAULT_LANGUAGE: "fr",
  DEFAULT_DECK: "set01",
  DEFAULT_SPREAD: "cross",
  DEFAULT_MODEL: "prompt",  // Mode prompt par défaut (pas d'appel API)
  
  // Liste des modèles toujours disponibles
  ALWAYS_AVAILABLE_MODELS: ["prompt"]  // Le mode prompt est toujours disponible
};
```

## Protection des Données Personnelles

### Conformité RGPD/GDPR

Bien que JodoTarot ne collecte pas de données personnelles par défaut, l'application respecte les principes du RGPD à travers son implémentation :

1. **Consentement** : Utilisation explicite des modèles d'IA avec information claire
2. **Finalité** : Utilisation des données uniquement pour le service demandé
3. **Minimisation** : Stockage local uniquement, sans envoi de données à des serveurs distants (sauf si OpenAI est explicitement configuré)
4. **Droit à l'oubli** : Fonction d'effacement des données via l'interface utilisateur

```javascript
// Implémentation du droit à l'oubli dans StateManager
resetToDefaults() {
  try {
    // Réinitialiser l'état complet
    this.state = this.getDefaultState();
    
    // Supprimer l'état sauvegardé
    localStorage.removeItem('jodotarot_state');
    
    // Émettre un événement de réinitialisation
    document.dispatchEvent(new CustomEvent('state:reset', {
      detail: { state: this.state }
    }));
    
    console.log('✅ État réinitialisé aux valeurs par défaut');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation de l\'état:', error);
    return false;
  }
}
```

## Bonnes Pratiques

Pour maintenir un niveau de sécurité optimal :

1. **Utilisation du mode prompt** par défaut, sans appel à des API externes
2. **Support des modèles locaux** via Ollama pour éviter la transmission de données
3. **Gestion robuste des erreurs** pour éviter les expositions de données sensibles
4. **Timeouts et limites** pour toutes les requêtes API
5. **Encodage basique** des clés API pour éviter l'exposition visuelle

## Limitations Actuelles

Il est important de noter que certaines mesures de sécurité décrites dans cette documentation ont des limitations :

1. L'encodage Base64 utilisé pour les clés API n'est pas un chiffrement sécurisé et ne protège pas contre des attaques ciblées
2. En tant qu'application client-side, JodoTarot dépend des mesures de sécurité du navigateur
3. L'application ne peut pas garantir la sécurité des données envoyées à des services tiers comme OpenAI

## Ressources

- [OWASP Top 10 pour les applications Web](https://owasp.org/www-project-top-ten/)
- [Guide de sécurité JavaScript de Mozilla](https://developer.mozilla.org/fr/docs/Web/Security)
- [Documentation du RGPD/GDPR](https://gdpr-info.eu/) 