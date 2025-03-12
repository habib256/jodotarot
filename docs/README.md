# Documentation Technique de JodoTarot

## Réorganisation de la Documentation

La documentation technique de JodoTarot a été réorganisée pour améliorer la lisibilité, la maintenance et l'accessibilité des informations. L'ancien fichier monolithique `codestructure.md` a été divisé en plusieurs documents plus spécifiques et organisés dans une structure de dossiers thématiques.

## Structure de la Documentation

La documentation est maintenant organisée selon la structure suivante :

```
docs/
├── index.md                         # Point d'entrée de la documentation
├── README.md                        # Ce fichier explicatif
├── architecture/                    # Documentation sur l'architecture
│   ├── structure-fichiers.md        # Organisation des fichiers du projet
│   └── vue-ensemble.md              # Vue d'ensemble de l'architecture
├── standards/                       # Standards et conventions
│   ├── bonnes-pratiques.md          # Bonnes pratiques de développement
│   ├── card-positions.md            # Référence des positions de cartes 
│   ├── css-naming-conventions.md    # Conventions de nommage CSS
│   └── tarot-position-standardization.md # Projet de standardisation
├── tools/                           # Documentation des outils
│   └── spread-editor.md             # Documentation de l'éditeur de positions
└── ui/                              # Documentation de l'interface utilisateur
    └── positionnement-cartes.md     # Système de positionnement des cartes
```

## Comment Naviguer dans la Documentation

- Commencez par consulter `index.md` qui sert de table des matières et de point d'entrée
- Chaque section contient des documents spécifiques à un aspect du projet
- Des liens entre les documents facilitent la navigation entre les sections connexes

## Avantages de cette Nouvelle Organisation

1. **Documents plus courts et ciblés** : Chaque fichier traite d'un sujet spécifique
2. **Navigation simplifiée** : Structure logique facilitant la recherche d'informations
3. **Maintenance plus facile** : Mise à jour de sections spécifiques sans toucher à l'ensemble
4. **Meilleure visibilité** : Découverte facilitée des différents aspects du projet
5. **Évolutivité** : Ajout simple de nouvelles sections sans réorganisation majeure

## Correspondance avec l'Ancien Document

L'ancien fichier `codestructure.md` reste disponible pour référence, mais son contenu a été redistribué dans les nouveaux documents selon la logique thématique.

## Recommandations pour les Contributions

Pour contribuer à la documentation :

1. Identifiez le document le plus approprié pour votre contribution
2. Respectez le format et le style des documents existants
3. Mettez à jour les liens entre documents si nécessaire
4. Actualisez l'`index.md` pour référencer tout nouveau document

## Prochaines Étapes

Cette réorganisation est une première étape. Les sections suivantes seront développées progressivement :

- Documentation des composants principaux
- Guide d'intégration IA
- Documentation détaillée du StateManager
- Guides sur la gestion des événements
- Documentation du cycle de vie de l'application 