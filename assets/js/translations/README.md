# Système de Traductions JodoTarot

Ce dossier contient les traductions pour l'internationalisation de l'application JodoTarot.

## Structure

- `index.js` - Point d'entrée central qui exporte la fonction `getTranslation` et l'objet `TRANSLATIONS`
- `fr.js` - Traductions françaises (langue par défaut)
- `en.js` - Traductions anglaises
- `es.js` - Traductions espagnoles
- `de.js` - Traductions allemandes
- `it.js` - Traductions italiennes
- `zh.js` - Traductions chinoises

## Comment utiliser les traductions

Pour obtenir une traduction, utilisez la fonction `getTranslation` :

```javascript
import { getTranslation } from '../translations/index.js';

// Obtenir une traduction
const translation = getTranslation('header.question', 'fr');
```

## Format des clés

Les clés de traduction suivent une structure hiérarchique avec séparateur point :

```
section.soussection.cle
```

Par exemple :
- `header.question` - Label de la question dans l'en-tête
- `interpretation.loading` - Message de chargement
- `tarotReading.intro.cross` - Introduction pour le tirage en croix

## Ajouter une nouvelle traduction

Pour ajouter une nouvelle traduction :

1. Ajoutez la clé et la valeur dans le fichier `fr.js` (langue par défaut)
2. Ajoutez la même clé avec sa traduction dans chaque fichier de langue

## Migration depuis l'ancienne architecture

Cette nouvelle architecture remplace l'ancien fichier monolithique `translations.js` pour améliorer la maintenabilité.

Pour faciliter la transition, un fichier de compatibilité `translations-compat.js` est fourni qui réexporte les fonctions 
du nouveau système. Cela permet aux modules existants de continuer à fonctionner sans modification immédiate.

### Scripts de migration

Des scripts utilitaires sont disponibles dans le dossier `assets/js/tools` :

- `migration-translations.js` - Extrait les traductions du fichier original et crée les fichiers individuels
- `update-imports.js` - Met à jour les imports dans les fichiers JavaScript existants

## Avantages de la nouvelle architecture

1. **Meilleure organisation** - Chaque langue est maintenant dans son propre fichier
2. **Maintenabilité améliorée** - Plus facile à maintenir et à mettre à jour
3. **Performances** - Chargement à la demande possible dans le futur
4. **Cohérence** - Structure normalisée entre toutes les langues
5. **Évolutivité** - Facilite l'ajout de nouvelles langues 