# JodoTarot — Guide utilisateur (itch.io)

## Français

### Comment lancer l'application

1. **Téléchargez** le jeu depuis itch.io (fichier ZIP ou dossier).
2. **Décompressez** l’archive si nécessaire.
3. **Ouvrez** le fichier `index.html` dans votre navigateur web (double-clic ou glisser-déposer dans une fenêtre Chrome, Firefox, Edge, Safari).

Aucune installation ni connexion internet n’est requise pour le mode par défaut.

### L’application fonctionne 100 % hors ligne

Tous les fichiers (texte, images, styles, scripts) sont inclus. Vous pouvez utiliser JodoTarot sans connexion internet en restant en mode **Prompt (Sans IA)**.

### Les 3 modes disponibles

| Mode | Description | Connexion / clé |
|------|-------------|------------------|
| **Prompt (Sans IA)** | Affiche le texte du prompt qui serait envoyé à une IA. Idéal pour découvrir l’app et tester les tirages sans aucun coût. | Aucune. 100 % offline. |
| **OpenAI** (GPT-4o, GPT-4o Mini, GPT-3.5 Turbo) | Interprétations générées par l’API OpenAI. | Connexion internet + clé API OpenAI à configurer dans `assets/js/config.js`. |
| **Ollama** | Modèles d’IA locaux (Llama, Mistral, etc.) tournant sur votre machine. | Logiciel [Ollama](https://ollama.com) installé et lancé en local. Pas de clé API. |

Par défaut, l’application est en mode **Prompt** : vous pouvez tirer les cartes et voir le prompt immédiatement, sans configuration.

### Résumé

- Ouvrir **index.html** dans le navigateur.
- Mode par défaut : **Prompt** — gratuit et utilisable sans internet.
- Pour des interprétations IA : configurer une clé OpenAI ou utiliser Ollama en local.

---

## English

### How to run the application

1. **Download** the game from itch.io (ZIP or folder).
2. **Extract** the archive if needed.
3. **Open** the `index.html` file in your web browser (double-click or drag and drop into Chrome, Firefox, Edge, or Safari).

No installation or internet connection is required for the default mode.

### The app runs 100% offline

All assets (text, images, styles, scripts) are bundled locally. You can use JodoTarot with no internet connection by staying in **Prompt (No AI)** mode.

### The 3 available modes

| Mode | Description | Connection / key |
|------|-------------|------------------|
| **Prompt (No AI)** | Shows the prompt text that would be sent to an AI. Perfect to explore the app and try readings at no cost. | None. 100% offline. |
| **OpenAI** (GPT-4o, GPT-4o Mini, GPT-3.5 Turbo) | Interpretations generated via the OpenAI API. | Internet + OpenAI API key, to be set in `assets/js/config.js`. |
| **Ollama** | Local AI models (Llama, Mistral, etc.) running on your machine. | [Ollama](https://ollama.com) installed and running locally. No API key. |

By default, the app is in **Prompt** mode: you can draw cards and see the prompt immediately, with no setup.

### Summary

- Open **index.html** in your browser.
- Default mode: **Prompt** — free and works without internet.
- For AI interpretations: configure an OpenAI API key or use Ollama locally.
