# Standards d'Internationalisation (i18n)

## Vue d'Ensemble

JodoTarot est conçu pour être entièrement multilingue, avec un support initial pour le français et l'anglais. Ce document détaille les standards et pratiques pour maintenir et étendre l'internationalisation de l'application.

## Structure des Traductions

### Organisation des Fichiers

```
locales/
├── fr/
│   ├── common.json
│   ├── cards.json
│   ├── spreads.json
│   └── interpretations.json
├── en/
│   ├── common.json
│   ├── cards.json
│   ├── spreads.json
│   └── interpretations.json
└── README.md
```

### Format des Fichiers de Traduction

```json
{
  "key": "value",
  "namespace": {
    "nested_key": "value"
  },
  "interpolation": {
    "welcome": "Bonjour {{name}}"
  },
  "plurals": {
    "card": "carte",
    "card_plural": "cartes"
  }
}
```

## Conventions de Nommage

### Clés de Traduction

1. **Format**: `lowercase_with_underscores`
2. **Hiérarchie**: `context.sous_context.clé`
3. **Pluriel**: Suffixe `_plural` pour les formes plurielles

Exemples :
```json
{
  "cards": {
    "major_arcana": {
      "fool": {
        "name": "Le Mat",
        "keywords": "spontanéité, innocence, liberté",
        "description": "Le Mat représente..."
      }
    }
  }
}
```

### Variables d'Interpolation

1. **Format**: `{{variable}}`
2. **Nommage**: Descriptif et en camelCase
3. **Documentation**: Commenter les variables attendues

```json
{
  "reading": {
    "position_description": "La carte {{cardName}} en position {{positionName}} indique {{interpretation}}",
    // Variables: cardName, positionName, interpretation
    "time_ago": "Il y a {{time}} {{unit}}"
    // Variables: time (number), unit (string: 'minute'|'heure'|'jour')
  }
}
```

## Gestion des Nombres et Dates

### Nombres

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

```javascript
// ❌ Mauvais
const title = "Bienvenue " + username;

// ✅ Bon
const title = t('welcome.user', { username });
```

### 2. Contexte et Pluralisation

- Fournir du contexte pour les traducteurs
- Gérer correctement les pluriels
- Utiliser les variables d'interpolation

```javascript
// ❌ Mauvais
const message = count === 1 ? "1 carte" : count + " cartes";

// ✅ Bon
const message = t('cards.count', { count });
```

### 3. Maintenance

- Documenter les changements dans les fichiers de traduction
- Vérifier régulièrement les clés non utilisées
- Maintenir la cohérence entre les différentes langues

## Tests

### Tests Automatisés

```javascript
describe('Internationalization', () => {
  it('should have all keys in all languages', () => {
    const languages = ['fr', 'en'];
    const files = ['common', 'cards', 'spreads'];
    
    languages.forEach(lang => {
      files.forEach(file => {
        const translations = require(`../locales/${lang}/${file}.json`);
        expect(translations).toBeDefined();
        // Vérifier la présence des clés essentielles
        expect(translations).toHaveProperty('key');
      });
    });
  });
});
```

### Vérification Manuelle

Checklist pour la revue des traductions :
- [ ] Toutes les chaînes sont traduites
- [ ] Les variables sont correctement utilisées
- [ ] La grammaire et l'orthographe sont correctes
- [ ] Le contexte est respecté
- [ ] Les pluriels sont gérés correctement

## Ajout d'une Nouvelle Langue

1. **Création des Fichiers**
   ```bash
   mkdir -p locales/new_lang
   cp locales/en/* locales/new_lang/
   ```

2. **Traduction**
   - Traduire tous les fichiers JSON
   - Vérifier les spécificités culturelles
   - Adapter les formats de date/nombre

3. **Configuration**
   ```javascript
   // config/i18n.js
   const supportedLanguages = ['fr', 'en', 'new_lang'];
   ```

4. **Tests**
   - Exécuter les tests automatisés
   - Effectuer une revue manuelle
   - Vérifier le rendu dans l'interface

## Outils Recommandés

1. **Extraction des Clés**
   ```bash
   i18n-extract "src/**/*.{js,jsx}" -o missing-keys.json
   ```

2. **Validation**
   ```bash
   i18n-validator locales/*/
   ```

3. **Statistiques**
   ```bash
   i18n-coverage locales/
   ```

## Ressources

- [Documentation i18next](https://www.i18next.com/)
- [Guide des Bonnes Pratiques](https://phrase.com/blog/posts/i18n-best-practices/)
- [Outils de Traduction](https://lokalise.com/) 