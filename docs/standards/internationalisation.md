# Standards d'Internationalisation (i18n)

## Vue d'Ensemble

JodoTarot est conçu pour être entièrement multilingue, avec un support pour six langues : français, anglais, espagnol, allemand, italien et chinois. Ce document détaille les standards et pratiques pour maintenir et étendre l'internationalisation de l'application.

## Structure des Traductions

### Organisation des Fichiers

```
assets/js/translations/
├── index.js           # Point d'entrée avec API getTranslation et configuration
├── fr.js              # Traductions françaises (langue par défaut)
├── en.js              # Traductions anglaises
├── es.js              # Traductions espagnoles
├── de.js              # Traductions allemandes
├── it.js              # Traductions italiennes
├── zh.js              # Traductions chinoises
└── README.md          # Documentation pour les traducteurs
```

### Format des Fichiers de Traduction

Les fichiers de traduction sont des modules JavaScript exportant un objet de traductions organisé hiérarchiquement :

```javascript
// Exemple de fr.js
export default {
  // Interface générale
  pageTitle: "Tirage en Croix",
  appTitle: "JodoTarot:",
  
  // Éléments d'en-tête
  header: {
    language: "Langue :",
    persona: "Personnage :",
    // Autres traductions...
  },
  
  // Traductions avec variables d'interpolation
  interpretation: {
    loadingWithModel: "Analyse du tirage en croix avec {model} interprété par un {persona}..."
  },
  
  // Groupes logiques de traductions
  spreadTypes: {
    cross: "➕ Croix",
    horseshoe: "🧲 Fer à Cheval",
    love: "❤️ Tarot de l'Amour",
    celticCross: "☘️ Croix Celtique"
  }
};
```

## API de Traduction

### Fonction getTranslation

Le système expose la fonction `getTranslation` pour accéder aux traductions :

```javascript
// Importation de la fonction
import { getTranslation } from '../translations/index.js';

// Récupérer une traduction simple (langue 'fr' par défaut)
const welcomeText = getTranslation('header.language', 'fr');

// Avec langue explicite
const englishTitle = getTranslation('pageTitle', 'en');

// Avec paramètres de remplacement
const loadingMessage = getTranslation('interpretation.loadingWithModel', 'fr', { 
  model: 'GPT-4', 
  persona: 'Tarologue' 
});
```

### Fonctionnement

La fonction `getTranslation` :
1. Accepte une clé de traduction, un code de langue et des paramètres optionnels
2. Navigue dans l'objet de traductions pour trouver la valeur
3. Si la traduction n'existe pas dans la langue demandée, utilise le français comme fallback
4. Effectue la substitution des paramètres avec la syntaxe `{paramName}`
5. Retourne la chaîne traduite

## Conventions de Nommage

### Clés de Traduction

1. **Format**: `camelCase` ou `snake_case` pour les sous-sections
2. **Hiérarchie**: `section.soussection.clé`
3. **Organisation**: Regrouper par fonctionnalité ou composant

Exemples :
```javascript
{
  "header": {
    "language": "Langue :",
    "persona": "Personnage :"
  },
  "spreadTypes": {
    "cross": "➕ Croix",
    "horseshoe": "🧲 Fer à Cheval"
  }
}
```

### Variables d'Interpolation

1. **Format**: `{variable}` (accolades simples)
2. **Nommage**: Descriptif et en camelCase
3. **Documentation**: Indiquer les variables attendues dans les commentaires

```javascript
{
  "interpretation": {
    // Variables: model, persona
    "loadingWithModel": "Analyse du tirage en croix avec {model} interprété par un {persona}..."
  }
}
```

## Langues Supportées

| Code | Langue   | Fichier | État         |
|------|----------|---------|--------------|
| fr   | Français | `fr.js` | Complet (référence) |
| en   | Anglais  | `en.js` | Complet      |
| es   | Espagnol | `es.js` | Complet      |
| de   | Allemand | `de.js` | Complet      |
| it   | Italien  | `it.js` | Complet      |
| zh   | Chinois  | `zh.js` | Complet      |

## Gestion des Nombres et Dates

### Nombres

Pour améliorer l'internationalisation, utiliser les fonctions de formatage :

```javascript
// Utiliser les fonctions de formatage dédiées
const formatNumber = (number, locale) => {
  return new Intl.NumberFormat(locale).format(number);
};

// Exemple
formatNumber(1234.56, 'fr-FR'); // "1 234,56"
formatNumber(1234.56, 'en-US'); // "1,234.56"
```

### Dates

Pour les dates localisées :

```javascript
// Utiliser les fonctions de formatage dédiées
const formatDate = (date, locale, options) => {
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Exemple
const options = { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
};
formatDate(new Date(), 'fr-FR', options); // "12 mars 2024"
formatDate(new Date(), 'en-US', options); // "March 12, 2024"
```

## Bonnes Pratiques

### 1. Extraction des Chaînes

- Extraire TOUTES les chaînes visibles par l'utilisateur
- Ne pas concaténer les chaînes manuellement
- Utiliser des clés descriptives et organisées
- Toujours utiliser l'API getTranslation

```javascript
// ❌ Mauvais
const title = "Bienvenue " + username;
// ou
if (language === 'fr') {
  text = "à l'endroit";
} else {
  text = "upright";
}

// ✅ Bon
const title = getTranslation('welcome.user', language, { username });
const text = getTranslation('card.orientation.upright', language);
```

### 2. Contexte et Variables d'Interpolation

- Fournir du contexte pour les traducteurs
- Gérer correctement les variantes linguistiques
- Utiliser les variables d'interpolation pour les parties dynamiques

```javascript
// ❌ Mauvais
const message = count === 1 ? "1 carte" : count + " cartes";

// ✅ Bon
const message = getTranslation('cards.count', language, { count });
```

### 3. Maintenance

- Documenter les changements dans les fichiers de traduction
- Vérifier régulièrement les clés non utilisées
- Maintenir la cohérence entre les différentes langues
- S'assurer que les nouvelles fonctionnalités sont correctement traduites

## Intégration avec le StateManager

Le système de traduction s'intègre avec le StateManager pour réagir aux changements de langue :

```javascript
// Exemple d'abonnement aux changements de langue
stateManager.subscribe((state, changes) => {
  if ('language' in changes) {
    updateUILanguage(state.language);
  }
});

// Mise à jour de l'interface selon la langue
function updateUILanguage(language) {
  // Mettre à jour les textes de l'interface
  document.title = getTranslation('pageTitle', language);
  
  // Mettre à jour des éléments spécifiques
  const drawButton = document.getElementById('draw-button');
  if (drawButton) {
    drawButton.textContent = getTranslation('header.drawButton', language);
  }
}
```

## Tests Recommandés

### Tests Manuels

Checklist pour la revue des traductions :
- [ ] Toutes les chaînes sont traduites
- [ ] Les variables sont correctement utilisées
- [ ] La grammaire et l'orthographe sont correctes
- [ ] Le contexte est respecté
- [ ] L'affichage est correct dans l'interface

### Tests Automatisés (à implémenter)

```javascript
// Exemple de test pour vérifier la présence des clés essentielles
function checkTranslationCompleteness() {
  const languages = ['fr', 'en', 'es', 'de', 'it', 'zh'];
  const requiredKeys = ['pageTitle', 'header.language', 'header.drawButton'];
  
  for (const lang of languages) {
    for (const key of requiredKeys) {
      const translation = getTranslation(key, lang);
      if (translation === key) {
        console.warn(`Traduction manquante: ${key} en ${lang}`);
      }
    }
  }
}
```

## Ajout d'une Nouvelle Langue

1. **Création du Fichier**
   - Créer un nouveau fichier JS dans le dossier `assets/js/translations/`
   - Copier la structure d'un fichier existant (préférablement `en.js`)

2. **Implémentation**
   ```javascript
   // Exemple pour jp.js (japonais)
   export default {
     pageTitle: "クロスタロットリーディング",
     appTitle: "ジョドタロット:",
     
     header: {
       language: "言語:",
       persona: "キャラクター:",
       // ... autres traductions ...
     },
     
     // ... autres sections ...
   };
   ```

3. **Intégration**
   ```javascript
   // Dans index.js
   import fr from './fr.js';
   import en from './en.js';
   // ... autres langues ...
   import jp from './jp.js';
   
   export const TRANSLATIONS = {
     fr,
     en,
     // ... autres langues ...
     jp
   };
   ```

4. **Mise à jour de l'interface**
   - Ajouter la nouvelle langue dans le sélecteur de langue
   - Mettre à jour le StateManager pour supporter cette langue

## Recommandations pour l'Avenir

1. **Extraction Automatique des Clés**
   - Implémenter un outil pour identifier les chaînes non traduites
   - Vérifier automatiquement la complétude des traductions

2. **Validation des Traductions**
   - Mettre en place des tests automatisés pour vérifier la présence des clés
   - Valider le formatage correct des traductions

3. **Interface pour Traducteurs**
   - Envisager un outil dédié pour faciliter le travail des traducteurs
   - Permettre l'édition des traductions sans connaissances techniques

## Ressources

- [Documentation du système de traduction](../composants/traduction.md)
- [MDN Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [MDN Intl.DateTimeFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) 