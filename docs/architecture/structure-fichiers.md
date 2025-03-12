# Structure des Fichiers

## Organisation du Projet

L'application JodoTarot est organisée selon une structure hiérarchique claire, séparant les différents aspects du code :

```
jodotarot/
├── assets/                  # Ressources de l'application
│   ├── js/                  # Code JavaScript
│   │   ├── main.js           # Point d'entrée et initialisation (203 lignes)
│   │   ├── api.js            # Communication avec OpenAI et Ollama (864 lignes)
│   │   ├── ui.js             # Gestion de l'interface utilisateur (255 lignes)
│   │   ├── config.js         # Configuration globale (143 lignes)
│   │   ├── app.js            # Gestion des événements et interactions (228 lignes)
│   │   ├── prompt.js         # Gestion des prompts IA (72 lignes)
│   │   ├── translations/     # Fichiers de traduction
│   │   │   ├── fr.js        # Français (246 lignes)
│   │   │   ├── en.js        # Anglais (246 lignes)
│   │   │   ├── es.js        # Espagnol (166 lignes)
│   │   │   ├── de.js        # Allemand (166 lignes)
│   │   │   ├── it.js        # Italien (166 lignes)
│   │   │   ├── zh.js        # Chinois (167 lignes)
│   │   │   ├── README.md    # Documentation des traductions (66 lignes)
│   │   │   └── index.js     # Point d'entrée des traductions (80 lignes)
│   │   ├── services/        # Services métier
│   │   │   ├── AIService.js     # Service d'intelligence artificielle (883 lignes)
│   │   │   ├── UIService.js     # Service d'interface utilisateur (187 lignes)
│   │   │   └── DeckService.js   # Service de gestion du jeu de cartes (445 lignes)
│   │   ├── controllers/     # Contrôleurs
│   │   │   ├── AppController.js       # Contrôleur principal (217 lignes)
│   │   │   ├── ConfigController.js    # Contrôleur de configuration (1320 lignes)
│   │   │   └── ReadingController.js   # Contrôleur de lecture (869 lignes)
│   │   ├── utils/           # Utilitaires
│   │   │   └── StateManager.js   # Gestionnaire d'état (816 lignes)
│   │   └── models/          # Modèles de données
│   │       ├── personas/         # Définitions des personas (23 personas)
│   │       │   ├── BasePersona.js           # Classe de base (94 lignes)
│   │       │   ├── TarologuePersona.js      # (75 lignes)
│   │       │   ├── OraclePersona.js         # (80 lignes)
│   │       │   └── ... (20 autres personas)
│   │       ├── spreads/          # Types de tirages
│   │       │   ├── BaseSpread.js         # Classe de base (331 lignes)
│   │       │   ├── CrossSpread.js        # Tirage en Croix (141 lignes)
│   │       │   ├── HorseshoeSpread.js    # Tirage en Fer à Cheval (184 lignes)
│   │       │   ├── LoveSpread.js         # Tirage de l'Amour (216 lignes)
│   │       │   ├── CelticCrossSpread.js  # Croix Celtique (295 lignes)
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
│   │   └── utils/                # Utilitaires CSS
│   └── images/               # Images et ressources graphiques
├── tools/                    # Outils de développement
│   └── spread-editor.html        # Éditeur visuel des positions des cartes (901 lignes)
├── docs/                     # Documentation technique
│   ├── index.md                  # Point d'entrée de la documentation
│   ├── architecture/             # Documentation sur l'architecture
│   ├── composants/               # Documentation des composants
│   ├── ui/                       # Documentation de l'interface utilisateur
│   ├── tools/                    # Documentation des outils
│   └── standards/                # Standards et conventions
├── index.html                # Page principale (147 lignes)
├── favicon.ico               # Icône du site (23 lignes)
├── screenshot.png            # Capture d'écran de l'application (2165 lignes)
├── LICENSE                   # Licence du projet (675 lignes)
└── README.md                 # Documentation du projet (289 lignes)
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

- **controllers/** : Orchestrent les différentes parties de l'application
  - **AppController.js** : Contrôleur principal et initialisation
  - **ConfigController.js** : Gestion des configurations et préférences
  - **ReadingController.js** : Gestion du processus de tirage et d'interprétation

### Modèles et Données

- **models/personas/** : Définitions des différents interprètes de tarot
- **models/spreads/** : Types de tirages disponibles
- **models/cards/** : Définitions des cartes de tarot

### Structure CSS

L'architecture CSS suit une organisation modulaire inspirée de la méthodologie ITCSS :

1. **base/** : Styles de base et fondations
   - **variables.css** : Définitions des variables CSS (couleurs, dimensions, etc.)
   - **reset.css** : Normalisation des styles par défaut
   - **typography.css** : Styles typographiques globaux

2. **modules/** : Styles spécifiques aux fonctionnalités
   - **[spread]-spread.css** : Styles pour chaque type de tirage
   - **interpretations.css** : Styles pour l'affichage des interprétations
   - **persona.css** : Styles spécifiques aux personas

3. **components/** : Composants d'interface réutilisables
   - **buttons.css** : Styles des boutons
   - **cards.css** : Styles des cartes de tarot
   - **forms.css** : Styles des formulaires et contrôles

4. **layouts/** : Mises en page globales
   - Structures de disposition générales

5. **utils/** : Utilitaires CSS
   - Classes utilitaires et aides

### Outils de Développement

- **tools/spread-editor.html** : Outil autonome permettant de définir visuellement les positions des cartes pour les différents types de tirages

## Conventions de Nommage

- **camelCase** pour les fichiers JavaScript (ex: `appController.js`)
- **kebab-case** pour les fichiers CSS (ex: `celtic-cross-spread.css`)
- **PascalCase** pour les classes JavaScript (ex: `BasePersona`)
- **kebab-case** pour les classes et identifiants CSS (ex: `.card-present`, `#tarot-app`)
- Les noms de fichiers reflètent la fonctionnalité qu'ils contiennent 