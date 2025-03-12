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