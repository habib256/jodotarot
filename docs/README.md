# Documentation Technique de JodoTarot

## Structure du Projet

Le projet JodoTarot est organisé selon une architecture modulaire avec la structure suivante :

```
jodotarot/
├── assets/                    # Ressources statiques
│   ├── css/                  # Styles CSS
│   │   ├── base/            # Styles de base (variables, reset)
│   │   ├── components/      # Styles des composants
│   │   ├── layouts/         # Styles de mise en page
│   │   ├── modules/         # Styles spécifiques aux modules
│   │   └── utils/           # Utilitaires CSS
│   ├── images/               # Images et ressources graphiques
│   └── js/                   # Code JavaScript
│       ├── controllers/      # Contrôleurs de l'application
│       ├── models/           # Modèles de données
│       │   └── spreads/      # Modèles des différents tirages
│       ├── services/         # Services métier (API, IA, etc.)
│       │   ├── AIService.js     # Service d'intelligence artificielle
│       │   ├── DeckService.js   # Service de gestion du jeu de cartes
│       │   └── UIService.js     # Service d'interface utilisateur
│       ├── utils/            # Utilitaires
│       │   ├── CardEnlarger.js  # Gestionnaire d'agrandissement des cartes
│       │   └── StateManager.js  # Gestionnaire d'état global
│       ├── translations/     # Fichiers de traduction
│       ├── api.js            # Gestion des API externes
│       ├── main.js           # Point d'entrée principal de l'application
│       ├── config.js         # Configuration globale
│       ├── prompt.js         # Gestion des prompts
│       └── ui.js             # Interface utilisateur
├── docs/                      # Documentation technique
│   ├── architecture/         # Documentation de l'architecture
│   ├── composants/           # Documentation des composants
│   ├── standards/            # Standards et conventions
│   ├── tools/                # Documentation des outils
│   ├── ui/                   # Documentation de l'interface
│   ├── index.md              # Point d'entrée de la documentation
│   ├── README.md             # Ce fichier explicatif
│   └── troubleshooting.md    # Guide de dépannage
├── index.html                # Page principale
├── spread-editor.html        # Éditeur de positions
└── README.md                 # Documentation générale du projet
```

## Organisation de la Documentation

La documentation technique est organisée en sections thématiques pour faciliter la navigation et la maintenance :

```
docs/
├── index.md                         # Point d'entrée de la documentation
├── README.md                        # Ce fichier explicatif
├── troubleshooting.md               # Guide de dépannage
├── architecture/                    # Documentation sur l'architecture
│   ├── flux-donnees.md              # Circulation des informations
│   ├── interactions-composants.md   # Communication entre composants
│   ├── securite.md                  # Aspects de sécurité
│   ├── structure-fichiers.md        # Organisation des fichiers du projet
│   └── vue-ensemble.md              # Vue d'ensemble de l'architecture
├── composants/                      # Documentation des composants
│   ├── cards.md                     # Système de gestion des cartes
│   ├── construction-prompts.md      # Construction des prompts
│   ├── integration-ia.md            # Intégration IA
│   ├── interactions-utilisateur.md  # Gestion des interactions
│   ├── personas.md                  # Styles d'interprétation
│   ├── reading-description-generator.md # Génération des descriptions
│   ├── spreads.md                   # Types de tirages et positions
│   ├── state-manager.md             # Gestion de l'état global
│   └── traduction.md                # Support multilingue
├── standards/                       # Standards et conventions
│   ├── bonnes-pratiques.md          # Bonnes pratiques de développement
│   ├── card-positions.md            # Référence des positions de cartes 
│   ├── css-naming-conventions.md    # Conventions de nommage CSS
│   └── internationalisation.md      # Standards i18n
├── tools/                           # Documentation des outils
│   └── spread-editor.md             # Documentation de l'éditeur de positions
└── ui/                              # Documentation de l'interface utilisateur
    ├── dimensions-cartes.md         # Gestion des dimensions
    ├── positionnement-cartes.md     # Système de positionnement des cartes
    ├── rotation-cartes.md           # Transformations des cartes
    └── z-index.md                   # Gestion des superpositions
```

## Comment Naviguer dans la Documentation

- Commencez par consulter `index.md` qui sert de table des matières et de point d'entrée
- Chaque section contient des documents spécifiques à un aspect du projet
- Des liens entre les documents facilitent la navigation entre les sections connexes
- Le fichier `troubleshooting.md` fournit des solutions aux problèmes courants

## Avantages de cette Organisation

1. **Documents plus courts et ciblés** : Chaque fichier traite d'un sujet spécifique
2. **Navigation simplifiée** : Structure logique facilitant la recherche d'informations
3. **Maintenance plus facile** : Mise à jour de sections spécifiques sans toucher à l'ensemble
4. **Meilleure visibilité** : Découverte facilitée des différents aspects du projet
5. **Évolutivité** : Ajout simple de nouvelles sections sans réorganisation majeure

## Recommandations pour les Contributions

Pour contribuer à la documentation :

1. Identifiez le document le plus approprié pour votre contribution
2. Respectez le format et le style des documents existants (Markdown avec emojis)
3. Mettez à jour les liens entre documents si nécessaire
4. Actualisez l'`index.md` pour référencer tout nouveau document
5. Assurez-vous que la documentation reflète fidèlement le code

## Documentation des Composants Principaux

La documentation des composants principaux est complète et couvre tous les aspects essentiels de l'application :

- **State Manager** : Gestion de l'état global de l'application
- **Cartes** : Système de gestion des cartes et du deck
- **Tirages** : Implémentation des différents types de tirages
- **Intégration IA** : Configuration et utilisation des APIs OpenAI et Ollama
- **Interface Utilisateur** : Positionnement, dimensions et interactions des éléments 