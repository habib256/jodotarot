# Structure des Fichiers

## Organisation du Projet

L'application JodoTarot est organisée selon une structure hiérarchique claire, séparant les différents aspects du code :

```
jodotarot/
├── assets/                  # Ressources de l'application
│   ├── js/                  # Code JavaScript
│   │   ├── main.js           # Point d'entrée et initialisation (322 lignes)
│   │   ├── api.js            # Communication avec OpenAI et Ollama (857 lignes)
│   │   ├── ui.js             # Gestion de l'interface utilisateur (255 lignes)
│   │   ├── config.js         # Configuration globale (158 lignes)
│   │   ├── app.js            # Gestion des événements et interactions (143 lignes)
│   │   ├── prompt.js         # Gestion des prompts IA (72 lignes)
│   │   ├── translations/     # Fichiers de traduction
│   │   │   ├── fr.js        # Français (303 lignes)
│   │   │   ├── en.js        # Anglais (256 lignes)
│   │   │   ├── es.js        # Espagnol (236 lignes)
│   │   │   ├── de.js        # Allemand (236 lignes)
│   │   │   ├── it.js        # Italien (236 lignes)
│   │   │   ├── zh.js        # Chinois (237 lignes)
│   │   │   ├── README.md    # Documentation des traductions (66 lignes)
│   │   │   └── index.js     # Point d'entrée des traductions (80 lignes)
│   │   ├── services/        # Services métier
│   │   │   ├── AIService.js     # Service d'intelligence artificielle (764 lignes)
│   │   │   ├── UIService.js     # Service d'interface utilisateur (187 lignes)
│   │   │   ├── DeckService.js   # Service de gestion du jeu de cartes (194 lignes)
│   │   │   └── StateManager.js  # Simple fichier de liaison vers l'implémentation principale dans utils/
│   │   ├── controllers/     # Contrôleurs
│   │   │   ├── AppController.js       # Contrôleur principal (222 lignes)
│   │   │   ├── ConfigController.js    # Contrôleur de configuration (1193 lignes)
│   │   │   └── ReadingController.js   # Contrôleur de lecture (935 lignes)
│   │   ├── utils/           # Utilitaires
│   │   │   └── StateManager.js   # Implémentation principale du gestionnaire d'état global de l'application
│   │   └── models/          # Modèles de données
│   │       ├── personas/         # Définitions des personas (22 personas)
│   │       │   ├── BasePersona.js           # Classe de base (94 lignes)
│   │       │   ├── TarologuePersona.js      # (75 lignes)
│   │       │   ├── OraclePersona.js         # (80 lignes)
│   │       │   └── ... (19 autres personas)
│   │       ├── spreads/          # Types de tirages
│   │       │   ├── BaseSpread.js         # Classe de base (370 lignes)
│   │       │   ├── CrossSpread.js        # Tirage en Croix (118 lignes)
│   │       │   ├── HorseshoeSpread.js    # Tirage en Fer à Cheval (138 lignes)
│   │       │   ├── LoveSpread.js         # Tirage de l'Amour (136 lignes)
│   │       │   ├── CelticCrossSpread.js  # Croix Celtique (176 lignes)
│   │       │   ├── ReadingDescriptionGenerator.js # Générateur de descriptions (81 lignes)
│   │       │   └── index.js              # (50 lignes)
│   │       └── cards/            # Définitions des cartes
│   ├── css/                # Styles CSS
│   │   ├── main.css              # Point d'entrée CSS (79 lignes)
│   │   ├── style.css             # Styles généraux (24 lignes)
│   │   ├── base/                 # Styles de base
│   │   │   ├── variables.css     # Variables CSS (172 lignes)
│   │   │   ├── reset.css         # Reset CSS (222 lignes)
│   │   │   └── typography.css    # Typographie (138 lignes)
│   │   ├── modules/              # Modules CSS
│   │   │   ├── cross-spread.css         # Tirage en Croix (131 lignes)
│   │   │   ├── horseshoe-spread.css     # Tirage en Fer à Cheval (110 lignes)
│   │   │   ├── love-spread.css          # Tirage de l'Amour (113 lignes)
│   │   │   ├── celtic-cross-spread.css  # Croix Celtique (162 lignes)
│   │   │   ├── interpretations.css      # Interprétations (504 lignes)
│   │   │   ├── persona.css              # Styles des personas (1372 lignes)
│   │   │   └── select.css               # Styles des select (60 lignes)
│   │   ├── components/           # Composants CSS
│   │   │   ├── buttons.css              # Styles des boutons (119 lignes)
│   │   │   ├── cards.css                # Styles des cartes (170 lignes)
│   │   │   ├── forms.css                # Styles des formulaires (170 lignes)
│   │   │   ├── information-zone.css     # Zone d'information (118 lignes)
│   │   │   ├── loading.css              # Indicateurs de chargement (120 lignes)
│   │   │   ├── modal.css                # Fenêtres modales (168 lignes)
│   │   │   ├── select.css               # Sélecteurs (134 lignes)
│   │   │   └── warnings.css             # Messages d'avertissement (167 lignes)
│   │   ├── layouts/              # Mises en page
│   │   │   ├── container.css            # Conteneurs principaux
│   │   │   ├── header.css               # En-tête de l'application  
│   │   │   └── panels.css               # Panneaux d'interface
│   │   └── utils/                # Utilitaires CSS
│   │       ├── scrolling.css            # Gestion du défilement
│   │       ├── animations.css           # Animations réutilisables
│   │       └── helpers.css              # Classes utilitaires
│   └── images/               # Images et ressources graphiques
├── spread-editor.html        # Éditeur visuel des positions des cartes
├── docs/                     # Documentation technique
│   ├── index.md                  # Point d'entrée de la documentation
│   ├── README.md                 # Structure de la documentation
│   ├── architecture/             # Documentation sur l'architecture
│   │   ├── vue-ensemble.md              # Vue d'ensemble de l'architecture
│   │   ├── interactions-composants.md   # Interactions entre composants
│   │   ├── flux-donnees.md              # Flux de données
│   │   ├── structure-fichiers.md        # Ce document
│   │   └── securite.md                  # Sécurité et protection des données
│   ├── composants/               # Documentation des composants
│   │   ├── construction-prompts.md      # Construction des prompts IA
│   │   ├── integration-ia.md            # Intégration avec l'IA
│   │   ├── personas.md                  # Système de personas
│   │   ├── state-manager.md             # Gestionnaire d'état
│   │   ├── traduction.md                # Système de traduction
│   │   └── interactions-utilisateur.md  # Gestion des interactions utilisateur
│   ├── ui/                       # Documentation de l'interface utilisateur
│   │   └── positionnement-cartes.md     # Système de positionnement des cartes
│   ├── tools/                    # Documentation des outils
│   │   └── spread-editor.md             # Éditeur de positions
│   └── standards/                # Standards et conventions
│       ├── bonnes-pratiques.md          # Bonnes pratiques de développement
│       ├── card-positions.md            # Référence des positions
│       ├── css-naming-conventions.md    # Conventions de nommage CSS
│       ├── tarot-position-standardization.md # Standardisation des positions
│       └── internationalisation.md      # Standards d'internationalisation
├── index.html                # Page principale
├── favicon.ico               # Icône du site
├── screenshot.png            # Capture d'écran de l'application
├── LICENSE                   # Licence du projet
└── README.md                 # Documentation du projet
```

## Répartition et Rôles des Fichiers

### Fichiers Principaux

- **index.html** : Page unique de l'application contenant la structure HTML de base
- **main.js** : Point d'entrée JavaScript initialisant l'application
- **main.css** : Point d'entrée CSS important tous les modules de style

### Services et Contrôleurs

- **services/** : Implémentent la logique métier spécifique
  - **AIService.js** : Gestion des interactions avec les modèles d'IA
  - **DeckService.js** : Manipulation des cartes et des tirages
  - **UIService.js** : Interaction avec le DOM et l'interface utilisateur
  - **StateManager.js** : Simple fichier de liaison vers l'implémentation principale dans utils/

- **controllers/** : Orchestrent les différentes parties de l'application
  - **AppController.js** : Contrôleur principal et initialisation
  - **ConfigController.js** : Gestion des configurations et préférences
  - **ReadingController.js** : Gestion du processus de tirage et d'interprétation

- **utils/** : Utilitaires et outils transversaux
  - **StateManager.js** : Implémentation principale du gestionnaire d'état global de l'application

### Modèles et Données

- **models/personas/** : Définitions des différents interprètes de tarot (22 personas au total)
- **models/spreads/** : Types de tirages disponibles
  - **BaseSpread.js** : Classe de base pour tous les types de tirages
  - **CrossSpread.js**, **HorseshoeSpread.js**, **LoveSpread.js**, **CelticCrossSpread.js** : Types de tirages spécifiques
  - **ReadingDescriptionGenerator.js** : Générateur de descriptions pour les tirages
- **models/cards/** : Définitions des cartes de tarot

### Système de Traduction

Le système de traduction est organisé pour faciliter l'internationalisation :

- **translations/** : Fichiers de traduction par langue
  - **index.js** : Exporte la fonction `getTranslation` et l'objet `TRANSLATIONS`
  - **[language].js** : Fichiers de traduction spécifiques à chaque langue (fr, en, etc.)
  - **README.md** : Documentation du système de traduction

Structure des clés de traduction :
```
section.soussection.cle
```

Exemple d'utilisation :
```javascript
import { getTranslation } from '../translations/index.js';
const translation = getTranslation('header.question', 'fr');
```

### Structure CSS

L'architecture CSS suit une organisation modulaire inspirée de la méthodologie ITCSS :

1. **base/** : Styles de base et fondations
   - **variables.css** : Définitions des variables CSS (couleurs, dimensions, etc.)
   - **reset.css** : Normalisation des styles par défaut
   - **typography.css** : Styles typographiques globaux

2. **utils/** : Utilitaires CSS (placés en début de cascade)
   - **scrolling.css** : Optimisation du défilement
   - **animations.css** : Animations réutilisables
   - **helpers.css** : Classes utilitaires génériques

3. **layouts/** : Mises en page globales
   - **container.css** : Conteneurs principaux
   - **header.css** : En-tête de l'application
   - **panels.css** : Structure des panneaux

4. **components/** : Composants d'interface réutilisables
   - **buttons.css** : Styles des boutons
   - **cards.css** : Styles des cartes de tarot
   - **forms.css** : Styles des formulaires et contrôles
   - **modal.css** : Fenêtres modales
   - **select.css** : Sélecteurs personnalisés
   - **loading.css** : Indicateurs de chargement
   - **warnings.css** : Affichage des messages d'erreur

5. **modules/** : Styles spécifiques aux fonctionnalités
   - **[spread]-spread.css** : Styles pour chaque type de tirage
   - **interpretations.css** : Styles pour l'affichage des interprétations
   - **persona.css** : Styles spécifiques aux personas

L'ordre d'importation dans main.css est crucial pour maintenir la cascade CSS :
1. Variables et reset (fondation)
2. Utilitaires (disponibles partout) 
3. Layouts (structures)
4. Composants atomiques réutilisables
5. Modules spécifiques à l'application

### Outils de Développement

- **spread-editor.html** : Outil autonome permettant de définir visuellement les positions des cartes pour les différents types de tirages. Cet outil génère les variables CSS correspondantes pour les positions des cartes.

### Documentation

La documentation est organisée thématiquement :

- **architecture/** : Documentation sur l'architecture globale
- **composants/** : Documentation des composants techniques
- **ui/** : Documentation de l'interface utilisateur
- **tools/** : Documentation des outils de développement
- **standards/** : Standards et conventions de développement

## Conventions de Nommage

- **camelCase** pour les fichiers JavaScript (ex: `appController.js`)
- **kebab-case** pour les fichiers CSS (ex: `celtic-cross-spread.css`)
- **PascalCase** pour les classes JavaScript (ex: `BasePersona`)
- **kebab-case** pour les classes et identifiants CSS (ex: `.card-present`, `#tarot-app`)
- Les noms de fichiers reflètent la fonctionnalité qu'ils contiennent
- Les variables CSS suivent la convention `--category-name-property` (ex: `--celtic-position-1-x`)
- Les événements personnalisés sont nommés selon le format `objet:action` (ex: `stateManager:ready`)

## Gestion des Dépendances

JodoTarot est conçu comme une application sans dépendances externes majeures. Tous les composants sont développés en interne pour garantir :

1. **Performance** : Minimisation du poids des ressources chargées
2. **Indépendance** : Pas de bibliothèques tierces à maintenir
3. **Contrôle** : Maîtrise totale du comportement de chaque fonctionnalité
4. **Cohérence** : Style de code uniforme à travers l'application

Cette approche "vanilla" améliore la maintenabilité à long terme et facilite l'évolution de l'application sans se soucier de la compatibilité avec des bibliothèques externes. 