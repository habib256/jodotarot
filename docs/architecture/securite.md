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
// Exemple de sécurisation des appels API
async function secureApiCall(endpoint, data) {
  try {
    // Validation des entrées avant envoi
    const sanitizedData = sanitizeData(data);
    
    // Utilisation de HTTPS
    const response = await fetch(`https://api.example.com/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(sanitizedData)
    });
    
    // Validation de la réponse
    validateResponse(response);
    
    return await response.json();
  } catch (error) {
    logSecurityEvent('api_call_error', error);
    throw new Error('Communication sécurisée échouée');
  }
}
```

## Stockage des Données

### 1. Données Locales

JodoTarot utilise principalement le stockage local pour les données utilisateur :

```javascript
// Exemple de gestion sécurisée du localStorage
class SecureStorage {
  constructor(namespace) {
    this.namespace = namespace;
  }
  
  // Sauvegarde avec version et chiffrement si nécessaire
  save(key, data) {
    const storageObject = {
      version: APP_VERSION,
      timestamp: Date.now(),
      data: this.sensitive ? this.encrypt(data) : data
    };
    
    localStorage.setItem(
      `${this.namespace}_${key}`, 
      JSON.stringify(storageObject)
    );
  }
  
  // Récupération avec validation
  load(key) {
    try {
      const stored = localStorage.getItem(`${this.namespace}_${key}`);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      
      // Vérification de version
      if (this.isVersionCompatible(parsed.version)) {
        return this.sensitive ? this.decrypt(parsed.data) : parsed.data;
      }
      
      // Migration des données si nécessaire
      return this.migrateData(parsed);
    } catch (error) {
      console.error('Erreur de chargement des données:', error);
      return null;
    }
  }
  
  // Suppression sécurisée
  clear(key) {
    if (key) {
      localStorage.removeItem(`${this.namespace}_${key}`);
    } else {
      // Suppression de toutes les données du namespace
      Object.keys(localStorage)
        .filter(k => k.startsWith(`${this.namespace}_`))
        .forEach(k => localStorage.removeItem(k));
    }
  }
}
```

### 2. Types de Données Stockées

JodoTarot stocke les types de données suivants :

| Type de donnée | Sensibilité | Stockage | Durée |
|---------------|------------|----------|-------|
| Préférences utilisateur | Faible | localStorage | Persistante |
| Historique des tirages | Moyenne | localStorage | Persistante (avec option d'effacement) |
| Questions utilisateur | Moyenne | Mémoire + localStorage | Session + persistante (si enregistrée) |
| Clés API personnelles | Haute | localStorage (chiffrées) | Persistante |

## Gestion des Clés API

Pour les utilisateurs qui configurent leurs propres clés API (OpenAI) :

```javascript
// Stockage sécurisé des clés API
function storeApiKey(apiKey) {
  // Masquage de la clé pour l'affichage
  const displayKey = maskApiKey(apiKey);
  
  // Chiffrement simple pour le stockage
  // Note: Le chiffrement côté client a des limites de sécurité
  const encryptedKey = btoa(apiKey.split('').reverse().join(''));
  
  localStorage.setItem('jodotarot_api_key', encryptedKey);
  
  // Affichage pour confirmation
  return displayKey;
}

// Récupération sécurisée
function getApiKey() {
  const encrypted = localStorage.getItem('jodotarot_api_key');
  if (!encrypted) return null;
  
  // Déchiffrement
  return atob(encrypted).split('').reverse().join('');
}

// Masquage pour affichage
function maskApiKey(key) {
  if (!key || key.length < 8) return '****';
  return key.substring(0, 3) + '...' + key.substring(key.length - 3);
}
```

## Protection Contre les Vulnérabilités Courantes

### 1. Injection

- **Validation des entrées** : Toutes les entrées utilisateur sont validées avant utilisation
- **Échappement des sorties** : Les données affichées sont échappées pour éviter les injections XSS

```javascript
// Exemple de protection contre les injections XSS
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Utilisation sur les entrées utilisateur
questionInput.addEventListener('input', (e) => {
  const sanitizedValue = sanitizeInput(e.target.value);
  // Traitement avec la valeur sécurisée
});
```

### 2. Validation des Données

Toutes les données, qu'elles proviennent de l'utilisateur ou d'API externes, sont validées :

```javascript
// Schéma de validation pour les réponses API
const responseSchema = {
  interpretation: {
    required: true,
    type: 'string',
    maxLength: 10000,
    sanitize: true
  },
  cards: {
    required: true,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', required: true },
        name: { type: 'string', required: true }
      }
    }
  }
};

// Fonction de validation
function validateData(data, schema) {
  // Implémentation de la validation selon le schéma
  // ...
}
```

## Confidentialité des Interactions IA

Pour les interactions avec les modèles d'IA :

1. **Information utilisateur** : L'utilisateur est informé que ses questions sont envoyées à un service externe
2. **Anonymisation** : Aucune donnée personnelle identifiable n'est incluse dans les prompts
3. **Rétention minimale** : Les échanges ne sont conservés que pour la durée de la session, sauf demande explicite de sauvegarde

```javascript
// Exemple de gestion de la confidentialité des prompts
function preparePrompt(userQuestion, cards, spreadType) {
  // Anonymisation de la question si elle contient des informations personnelles
  const processedQuestion = anonymizePersonalInfo(userQuestion);
  
  // Construction du prompt sans identifiants personnels
  return {
    question: processedQuestion,
    spread: spreadType,
    cards: cards.map(card => card.id)  // Envoi uniquement des IDs, pas des noms
  };
}
```

## Journalisation et Audit

JodoTarot implémente une journalisation minimale pour les événements de sécurité :

```javascript
// Journalisation des événements de sécurité
function logSecurityEvent(eventType, details = {}) {
  // Stockage local uniquement pour le débogage
  // Pas d'envoi à un serveur distant
  const securityLog = JSON.parse(localStorage.getItem('security_log') || '[]');
  
  securityLog.push({
    timestamp: Date.now(),
    type: eventType,
    // Anonymisation des détails sensibles
    details: anonymizeDetails(details)
  });
  
  // Conservation d'un historique limité
  if (securityLog.length > 100) {
    securityLog.shift();
  }
  
  localStorage.setItem('security_log', JSON.stringify(securityLog));
  
  // En mode développement uniquement
  if (isDevelopmentMode()) {
    console.warn(`Événement de sécurité: ${eventType}`, anonymizeDetails(details));
  }
}
```

## Sécurité Côté Client

Bien que JodoTarot soit une application client-side, plusieurs mesures sont prises pour renforcer la sécurité :

1. **Content Security Policy** : Restriction des sources de contenu
2. **Subresource Integrity** : Vérification de l'intégrité des ressources externes
3. **HTTPS uniquement** : L'application est conçue pour fonctionner exclusivement en HTTPS

```html
<!-- Exemple d'en-têtes de sécurité (à intégrer au serveur) -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; connect-src https://api.openai.com;">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
```

## Politique de Divulgation des Vulnérabilités

JodoTarot maintient une politique de divulgation responsable :

1. Les vulnérabilités découvertes doivent être signalées à l'équipe de développement
2. Un délai raisonnable est accordé pour la correction avant divulgation publique
3. Les correctifs de sécurité sont traités en priorité

## Protection des Données Personnelles

### Conformité RGPD/GDPR

Bien que JodoTarot ne collecte pas de données personnelles par défaut, l'application respecte les principes du RGPD :

1. **Consentement** : Information claire sur les données utilisées
2. **Finalité** : Utilisation des données uniquement pour le service demandé
3. **Minimisation** : Collecte limitée aux données nécessaires
4. **Exactitude** : Possibilité de corriger les données
5. **Limitation de stockage** : Conservation limitée dans le temps
6. **Droit à l'oubli** : Fonction d'effacement des données

```javascript
// Implémentation du droit à l'oubli
function eraseUserData() {
  // Suppression des données de localStorage
  Object.keys(localStorage)
    .filter(key => key.startsWith('jodotarot_'))
    .forEach(key => localStorage.removeItem(key));
  
  // Réinitialisation de l'application
  stateManager.resetToDefaults();
  
  // Notification à l'utilisateur
  showNotification('Toutes vos données ont été effacées');
}
```

## Bonnes Pratiques

Pour maintenir un niveau de sécurité optimal :

1. **Revue de code régulière** avec focus sur la sécurité
2. **Tests de sécurité** pour les nouvelles fonctionnalités
3. **Mise à jour des dépendances** pour corriger les vulnérabilités connues
4. **Principe du moindre privilège** pour toutes les interactions
5. **Documentation** des mesures de sécurité et des procédures

## Ressources

- [OWASP Top 10 pour les applications Web](https://owasp.org/www-project-top-ten/)
- [Guide de sécurité JavaScript de Mozilla](https://developer.mozilla.org/fr/docs/Web/Security)
- [Documentation du RGPD/GDPR](https://gdpr-info.eu/) 