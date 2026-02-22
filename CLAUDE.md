# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JodoTarot is a modular web application for tarot readings with AI-powered interpretations. It's built in vanilla JavaScript ES6+ (no build system) with a clean MVC architecture and follows a unidirectional data flow pattern.

**Key Tech**: HTML5, CSS3, JavaScript ES6+ modules, LocalStorage
**AI Integration**: OpenAI API, Ollama (local models)
**Dev mode**: Direct browser execution via `index.html` (requires HTTP server)
**Standalone mode**: `npm run build` generates `index-standalone.html` (works via `file://`)

## Development Commands

### Running the Application
```bash
# Development: use an HTTP server (ES modules require it)
python -m http.server 8000
# Then navigate to http://localhost:8000

# Standalone: build and open directly in browser (no server needed)
npm install          # Install esbuild (one-time)
npm run build        # Generates index-standalone.html
open index-standalone.html   # Works via file://
```

### Testing AI Connectivity
```bash
# For Ollama (local models)
ollama serve  # Start Ollama server on port 11434
ollama pull llama2  # Download a model
```

### Configuration
- Edit `assets/js/config.js` for API keys and service URLs
- Set `SETTINGS.API_KEY` for OpenAI
- Set `SETTINGS.OLLAMA_URL` for local Ollama instance (default: `http://localhost:11434`)
- Set `DEBUG_LEVEL` (0-3) for console logging verbosity

## Architecture Overview

### Core Pattern: MVC with Centralized State

The application follows a unidirectional data flow:
**User Action → Controller → Service → StateManager → UI Update**

```
Controllers (orchestration)
    ↓
Services (business logic)
    ↓
StateManager (single source of truth)
    ↓ (observers/subscriptions)
UI Components (rendering)
```

### Key Architectural Principles

1. **StateManager is Central**: ALL shared state goes through `StateManager` (907 lines in `assets/js/utils/StateManager.js`)
   - Automatic validation via schema
   - Observer pattern for reactivity
   - LocalStorage persistence
   - Data migration support
   - Custom events emission (`iaModel:changed`, `cardSet:changed`, etc.)

2. **Never Modify DOM Directly**: Always use `UIService` for DOM manipulation

3. **No Circular Dependencies**: Services are independent, Controllers coordinate them

4. **Validation Everywhere**: StateManager validates all state changes before applying

### File Organization

```
./
├── index.html               # Main entry point (requires HTTP server)
├── build.js                 # Standalone build script (esbuild)
├── package.json             # Dev dependencies (esbuild)
├── index-standalone.html    # Generated standalone version (gitignored)
└── assets/js/
    ├── controllers/     # App coordination (AppController, ReadingController, ConfigController)
    ├── services/        # Business logic (AIService, DeckService, UIService)
    ├── models/
    │   ├── personas/    # 21 AI interpretation personas (inherit from BasePersona)
    │   └── spreads/     # 4 spread types (inherit from BaseSpread)
    ├── utils/           # StateManager (centralized state management)
    ├── translations/    # 6 language files (fr, en, es, de, it, zh)
    ├── main.js          # Entry point
    ├── api.js           # Low-level AI API calls
    ├── config.js        # Configuration constants
    ├── prompt.js        # Prompt construction utilities
    └── ui.js            # Legacy UI functions (being migrated to UIService)
```

## Critical Implementation Details

### StateManager Usage

**Reading State:**
```javascript
const state = stateManager.getState();
const currentLanguage = state.language;
```

**Updating State:**
```javascript
// Single property
stateManager.setState({ language: 'fr' });

// Multiple properties (atomic update)
stateManager.setState({
  spreadType: 'cross',
  cards: drawnCards,
  isLoading: false
});
```

**Subscribing to Changes:**
```javascript
const unsubscribe = stateManager.subscribe((state, changes) => {
  if ('language' in changes) {
    updateUILanguage(state.language);
  }
});

// Always unsubscribe when component is destroyed
unsubscribe();
```

**State Schema** (`StateManager.js` line ~100-250):
- `language`: 'fr'|'en'|'es'|'de'|'it'|'zh'
- `persona`: One of 21 persona IDs (tarologue, oracle, voyante, pretre, rabbin, imam, dalailama, sorciere, alchimiste, mage, francmacon, freud, jung, lacan, dolto, socrate, salomon, montaigne, quichotte, demon, noegoman)
- `cardSet`: 'set01'|'set02'|'set03'|'set04' (Marseille, Lehmann, Renaissance, Rick&Morty)
- `spreadType`: 'cross'|'horseshoe'|'love'|'celticCross'
- `iaModel`: 'prompt'|'openai/*'|'ollama:*'
- `cards`: Array of drawn cards with validation
- `interpretation`: Generated AI response (plain text, not HTML)
- `isLoading`, `error`, `isCardEnlarged`, `enlargedCardId`: UI state

### AI Service Architecture

**Two Providers:**
1. **OpenAI**: Cloud API (requires `SETTINGS.API_KEY`)
2. **Ollama**: Local models (requires running `ollama serve`)

**Special Mode:**
- `iaModel: 'prompt'`: Debug mode - returns full prompt without AI call

**Model Format Detection** (`AIService.js` ~50-100):
Different Ollama models return different JSON structures. The system auto-detects format:
- `llama3.1`: `choices[0].message.content`
- `llama3`: `message.content`
- `llama2`: `response`

**Retry Logic** (`api.js` ~200-300):
- Exponential backoff with jitter
- Configurable timeouts per operation (connect, model load, response)
- Automatic fallback to "prompt" mode on connectivity errors

**Streaming Implementation** (`AIService.js` ~400-500):
Uses `response.body.getReader()` with `TextDecoder` for chunk-by-chunk processing. Calls `onChunk` callback for progressive UI updates.

### Persona System

**Location**: `assets/js/models/personas/`

**21 Personas** organized in categories:
- Arts Divinatoires: tarologue, oracle, voyante
- Traditions Spirituelles: pretre, rabbin, imam, dalailama
- Occultisme: sorciere, alchimiste, mage, francmacon
- Psychologie: freud, jung, lacan, dolto
- Philosophie: socrate, salomon, montaigne, quichotte
- Autres: demon, noegoman

**All inherit from `BasePersona`**:
```javascript
class CustomPersona extends BasePersona {
  constructor(language = 'fr') {
    super('persona_id', language);
    this.promptTemplate = {
      'fr': '...',
      'en': '...'
    };
  }
}
```

**Prompt Construction** (`AIService.js` ~150-200):
1. Meta prompt (system instructions) from translations
2. Persona prompt (style/approach) via `persona.buildSystemPrompt()`
3. Reading description (cards + positions) via `spread.generateReadingDescription()`
4. User question with contextual enrichment

### Spread System

**4 Spread Types** in `assets/js/models/spreads/`:
- `CrossSpread.js`: 5 cards (past, present, future, advice, outcome)
- `HorseshoeSpread.js`: 7 cards (horseshoe layout)
- `LoveSpread.js`: 5 cards (love/relationship focus)
- `CelticCrossSpread.js`: 10 cards (comprehensive reading)

**All inherit from `BaseSpread`** (370 lines):
- Card position definitions with semantic names
- `draw()`: Shuffle and draw cards
- `generateReadingDescription()`: Creates detailed prompt text

**Position Editor**: `spread-editor.html` at project root for visual spread configuration

### Translation System

**Usage Pattern**:
```javascript
import { getTranslation } from './translations/index.js';

// Simple
const text = getTranslation('header.question', 'fr');

// With substitutions
const msg = getTranslation('interpretation.loadingWithModel', 'fr', {
  model: 'GPT-4',
  persona: 'Tarologue'
});
```

**CRITICAL**: NEVER hardcode user-facing text. Always use `getTranslation()`.

**Files**: `assets/js/translations/{fr,en,es,de,it,zh}.js`

### CSS Architecture

**Modular Structure** (`assets/css/`):
- `main.css`: Entry point, imports all modules
- `buttons.css`, `cards.css`, `forms.css`, `modal.css`, `warnings.css`: Component styles
- Uses CSS variables for theming
- BEM naming convention for classes

**Card Positioning**:
- Dual identification: semantic names + numeric IDs
- Position data defined in spread classes (e.g., `CrossSpread.js`)
- Z-index management for overlapping cards
- Visual editor available in `spread-editor.html`

## Common Tasks

### Adding a New Persona

1. Create `assets/js/models/personas/NewPersona.js` inheriting from `BasePersona`
2. Define `promptTemplate` for each supported language
3. Register in `assets/js/models/personas/index.js` PERSONA_PATHS
4. Add to StateManager schema enum (`assets/js/utils/StateManager.js` ~140)
5. Add translations in all language files (`translations/*.js`)

### Adding a New Spread Type

1. Create `assets/js/models/spreads/NewSpread.js` extending `BaseSpread`
2. Define `positions` array with card placements
3. Implement position-specific meanings
4. Register in spread factory (`services/DeckService.js` or spread index)
5. Add to StateManager schema enum
6. Use `spread-editor.html` to visually define positions

### Modifying AI Behavior

**Prompt Engineering**:
- Meta prompts: `assets/js/translations/{lang}.js` under `metaprompt.base`
- Persona prompts: Individual persona classes' `promptTemplate`
- Debug mode: Set `iaModel` to `'prompt'` to see full prompt
- Enable debug logging: `config.js` set `DEBUG_LEVEL = 3`

**Model Configuration**:
- OpenAI models: Add to `config.js` OPENAI_MODELS list
- Ollama format: Add to `config.js` OLLAMA_MODEL_FORMATS if using custom format

### Debugging State Issues

1. Check browser console for StateManager logs (🔄 for updates, ✅ for changes)
2. Listen to custom events: `document.addEventListener('state:changed', e => console.log(e.detail))`
3. Use browser DevTools → Application → LocalStorage → `jodotarot_state`
4. Inspect `stateManager.getState()` in console
5. Check validation errors in console

### Working with Cards

**Card Structure**:
```javascript
{
  id: 'M01',           // Major Arcana format
  name: 'Le Bateleur', // Card name
  imageUrl: 'assets/images/cards/marseille/01_Le_bateleur.png',
  position: 'upright' | 'reversed'
}
```

**Card Sets** (`assets/images/cards/`):
- `set01`: marseille (Tarot de Marseille)
- `set02`: lehmann (Thiago Lehmann)
- `set03`: renaissance
- `set04`: rick&morty

**Validation**: StateManager validates card structure on every update (`StateManager.js` ~600-650)

## Important Constraints

### NEVER Do This

1. **Direct DOM manipulation** - Always use `UIService`
2. **Bypass StateManager** - All shared state must go through it
3. **Hardcode text** - Use translation system
4. **Modify state directly** - Use `setState()`, never `state.property = value`
5. **Create circular service dependencies**
6. **Use `pointer-events: none` on scrollable containers** - Breaks scrolling
7. **Return HTML from AI services** - Always return plain text for security

### Always Do This

1. **Validate inputs** before calling `setState()`
2. **Unsubscribe** from StateManager when components unmount
3. **Handle loading states** (`isLoading: true/false`)
4. **Manage errors gracefully** with fallback to "prompt" mode
5. **Use atomic state updates** for related changes
6. **Check connectivity** before AI calls
7. **Support all 6 languages** when adding features

## Data Flow Examples

### Typical Reading Flow

1. User selects spread type → `ConfigController` → `stateManager.setState({ spreadType })`
2. StateManager validates → emits `spreadType:changed` event
3. UI updates via subscription in `ReadingController`
4. User clicks "Draw Cards" → `ReadingController.performReading()`
5. `DeckService.drawCards()` → shuffles and selects cards
6. Cards validated and stored → `stateManager.setState({ cards })`
7. `AIService.getInterpretation()` builds prompt from cards + persona + question
8. API call (OpenAI or Ollama) with streaming
9. Chunks arrive → `onChunk` callback → progressive UI update
10. Complete interpretation → `stateManager.setState({ interpretation, isLoading: false })`
11. StateManager persists to localStorage

### Error Recovery Flow

1. AI call fails → `AIService` catches error
2. Determines error type (timeout, auth, connection)
3. Formats user-friendly message via translations
4. Falls back to "prompt" mode option if desired
5. `stateManager.setState({ error, isLoading: false })`
6. UI shows error with retry option

## Performance Considerations

- **Selective Updates**: StateManager only notifies on actual value changes (`isEqual` check)
- **Debouncing**: Use for frequent events (resize, scroll)
- **Response Cache**: AIService includes Map-based response cache (see `api.js` ~100)
- **Lazy Loading**: Personas loaded on-demand via dynamic imports
- **Stream Processing**: Chunks processed immediately without buffering entire response

## Security Notes

- API keys stored Base64-encoded in localStorage (weak encoding, client-side only)
- User questions and card data sent to AI providers
- "Prompt" mode: No external API calls, data stays local
- Input validation prevents injection attacks
- AI responses returned as plain text, not HTML (XSS prevention)

## Standalone Build System

The project includes a build system (`build.js`) using esbuild to generate a self-contained `index-standalone.html` that works via `file://` without any HTTP server.

### How It Works

1. **esbuild bundles JS** — `assets/js/main.js` is bundled as IIFE (no `type="module"` needed)
2. **esbuild bundles CSS** — `assets/css/main.css` with all `@import` resolved
3. **HTML generation** — `index.html` is used as template, CSS and JS inlined via `<style>` and `<script>` tags
4. **Images stay external** — `assets/images/` remains as-is (relative paths work in `file://`)

### Build Plugins

Two esbuild plugins handle `file://` compatibility:

- **`personaStaticImportPlugin`** — Converts dynamic `await import()` calls in `personas/index.js` to static imports (esbuild cannot bundle dynamic imports with variable paths)
- **`deckServicePatchPlugin`** — Removes the `fetch()`-based image validation in `DeckService.loadDeck()` (fetch fails on `file://`, but `<img>` tags load fine)

### Key Files

| File | Description |
|------|-------------|
| `package.json` | Dev dependency: esbuild |
| `build.js` | Build script with plugins |
| `index-standalone.html` | Generated output (gitignored) |

### Rebuilding After Changes

After modifying any source JS/CSS, run `npm run build` to regenerate the standalone file.

## Additional Resources

- `spread-editor.html`: Visual editor for configuring card positions in spreads
- `assets/js/models/personas/`: All 22 persona implementations
- `assets/js/models/spreads/`: All 4 spread type implementations
- `assets/js/translations/`: Translation files for 6 supported languages
- `assets/css/`: Modular CSS architecture with BEM naming
