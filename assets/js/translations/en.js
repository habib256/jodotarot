/**
 * English translations
 */

const en = {
  // Page title
  pageTitle: "Cross Tarot Reading",
  appTitle: "JodoTarot:",
  
  // Header elements
  header: {
    language: "Language:",
    persona: "Character:",
    cardSet: "Card Deck:",
    spreadType: "Spread Type:",
    iaModel: "AI Model:",
    question: "Your question:",
    questionPlaceholder: "Enter your question for this reading...",
    drawButton: "Draw Cards",
    drawButtonGenerating: "Generation in progress... Please wait",
    streamingOption: "Live Response:",
    stopGeneration: "Stop Generation"
  },
  
  // Interpretation messages
  interpretation: {
    loading: "Analyzing the spread...",
    loadingWithModel: "Analyzing the cross spread with {model} interpreted by a {persona}...",
    default: "Interpretations will appear here after the cards are drawn.",
    loadingError: "Error loading interpretation",
    retry: "Retry",
    cardTitle: "Card",
    questionTitle: "Question",
    noModelAvailable: "No AI model available",
    promptDisplay: "Here is the prompt that would have been sent to the AI:",
    error: {
      general: "An error occurred during interpretation. Please try again.",
      noQuestion: "Please enter a question before drawing cards",
      api: "API Error: {0}"
    },
    apiWarning: "The interpretation ended unexpectedly. Here is the partial result:",
    userQuestion: "The user's question is:",
    userMessage: "I would like a detailed and personalized interpretation of my tarot cross spread. Analyze the symbolism of each card based on its position and establish connections between the cards to offer a coherent reading that precisely answers my question.",
    ollamaPromo: "Download <a href='https://ollama.com' target='_blank'>ollama</a> with <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> to get started. Reload the page and create your card reading",
    streamingResponse: "Generating response",
    // Messages for specific cards
    loveCardsMeaning: {
      moon_bottomLeft: "\"The Moon\" in the feelings position reveals deep emotions, sometimes confusing or ambivalent. Explore your inner world to better understand your true desires.",
      sun_bottomRight: "\"The Sun\" in the near future position announces a period of fulfillment and clarity in your love life. New bright opportunities are presenting themselves to you."
    }
  },
  
  // Texts for the reading prompt
  tarotReading: {
    intro: {
      cross: "Here is the cross spread to interpret for the person consulting the tarot:",
      horseshoe: "Here is the horseshoe spread to interpret for the person consulting the tarot:",
      love: "Here is the Love Tarot spread to interpret for the person consulting the tarot:",
      celticCross: "Here is the Celtic Cross spread to interpret for the person consulting the tarot:"
    },
    positions: {
      top: "The top",
      left: "The left",
      center: "The center",
      right: "The right",
      bottom: "The bottom",
      position1: "Position 1: Distant past",
      position2: "Position 2: Recent past",
      position3: "Position 3: Present",
      position4: "Position 4: Near future",
      position5: "Position 5: Potential obstacles",
      position6: "Position 6: External influences",
      position7: "Position 7: Final outcome",
      topLeft: "State of mind",
      topRight: "Expectations",
      middleLeft: "Love history",
      middleCenter: "Current relationship", 
      middleRight: "Future dynamics",
      bottomLeft: "Deep emotions",
      bottomRight: "Short-term perspectives",
      celticPosition1: "Position 1: Current situation/Central issue",
      celticPosition2: "Position 2: Immediate obstacle or challenge",
      celticPosition3: "Position 3: Recent past/What's fading away",
      celticPosition4: "Position 4: Near future/What's coming",
      celticPosition5: "Position 5: Conscious influence/Goals",
      celticPosition6: "Position 6: Unconscious influence/Hidden emotions",
      celticPosition7: "Position 7: Your attitude/How you are perceived",
      celticPosition8: "Position 8: External influences/Environment",
      celticPosition9: "Position 9: Hopes or fears",
      celticPosition10: "Position 10: Final outcome"
    },
    instructions: {
      top: "Analyze the spiritual, mental, or conscious forces that support the person. Explore how these energies can be used as resources.",
      left: "Deeply explore how past events have shaped and contributed to the current situation. Identify important patterns or lessons.",
      center: "Precisely describe the current situation, central issues, and dominant energies. This card represents the heart of the question.",
      right: "Project the likely evolution if the person follows the current path. Offer advice on the best way to approach this potential future.",
      bottom: "Identify obstacles, fears, unconscious blockages to overcome and suggest concrete ways to transform or manage them.",
      position1: "Reveal the deep roots of the situation, past events that initiated the current path. Explore the origin of the question.",
      position2: "Analyze recent influences that have impacted the situation, events that have catalyzed the current questioning.",
      position3: "Describe the current state of mind, present circumstances, and how the person perceives and experiences the situation now.",
      position4: "Identify the central forces at play, deep motivations, and crucial factors influencing the entire situation.",
      position5: "Project the energies manifesting in the near future, opportunities or imminent obstacles to anticipate.",
      position6: "Reveal specific challenges, obstacles, or resistances to overcome to progress towards the desired resolution.",
      position7: "Indicate the likely outcome if the current path is followed, the potential culmination of the situation, and lessons to integrate.",
      topLeft: "Explore the person's deep feelings, their current emotions, and how they influence their love life.",
      topRight: "Reveal the person's expectations and hopes concerning the future.",
      middleLeft: "Detail the person's love story, their emotions, and the events that have marked them.",
      middleCenter: "Explain how the person perceives and experiences their current relationship.",
      middleRight: "Forecast future trends and dynamics for the person.",
      bottomLeft: "Detail the deep emotions and reactions of the person facing the situation.",
      bottomRight: "Reveal short-term perspectives and the person's concerns about the future.",
      celticPosition1: "Detail the current situation, central elements, and stakes. This card represents the heart of the question.",
      celticPosition2: "Analyze the main obstacle or challenge the person is currently facing.",
      celticPosition3: "Explore past influences that are fading away but have contributed to shaping the current situation.",
      celticPosition4: "Project the energies that are arriving and will influence the situation in the near future.",
      celticPosition5: "Reveal conscious objectives, aspirations, and what the person hopes to accomplish.",
      celticPosition6: "Identify unconscious influences, hidden fears, or deep motivations that act subtly.",
      celticPosition7: "Describe how the person perceives themselves and is perceived by others in this situation.",
      celticPosition8: "Analyze the external environment, people, or circumstances influencing the situation.",
      celticPosition9: "Explore secret hopes or unexpressed fears concerning the situation.",
      celticPosition10: "Indicate the likely outcome if the current trajectory is maintained and lessons to integrate."
    }
  },
  
  // Texts for custom prompts
  tarotPrompt: "{persona}, what does this {spreadType} spread reveal about my question: \"{question}\"? Analyze the cards individually and as a whole, considering their positions and interactions. Share your unique insight.",
  
  // Persona groups
  personaGroups: {
    divinationArts: "🔮 Divination Arts",
    spiritualTraditions: "🕊️ Spiritual Traditions",
    esotericTraditions: "⚡ Esoteric Traditions",
    psychoanalysts: "🧠 Psychoanalysts",
    philosophersSages: "📚 Philosophers & Sages",
    supernaturalEntities: "👻 Supernatural Entities"
  },
  
  // AI model groups
  iaGroups: {
    ollama: "🧠 Ollama",
    openai: "🤖 OpenAI"
  },
  
  // Persona names
  personas: {
    tarologue: "🎴 Tarot Reader",
    oracle: "🌟 Mystic Oracle",
    voyante: "🔮 Gypsy Fortune Teller",
    pretre: "✝️ Exegete Priest",
    rabbin: "✡️ Kabbalist Rabbi",
    imam: "☪️ Sufi Imam",
    dalailama: "☸️ Dalai Lama",
    sorciere: "🧙‍♀️ Ancestral Witch",
    alchimiste: "⚗️ Esoteric Alchemist",
    mage: "🌌 Elementalist Mage",
    francmacon: "🏛️ Master Freemason",
    freud: "🛋️ Sigmund Freud",
    jung: "🌓 Carl Gustav Jung",
    lacan: "🪞 Jacques Lacan",
    dolto: "👶 Françoise Dolto",
    socrate: "🏺 Socrates",
    salomon: "👑 King Solomon",
    montaigne: "✒️ Michel de Montaigne",
    quichotte: "🗡️ Don Quixote",
    demon: "😈 Mortrarion",
    noegoman: "🧘 No EGO man"
  },
  
  // Spread types
  spreadTypes: {
    cross: "➕ Cross",
    horseshoe: "🧲 Horseshoe",
    love: "❤️ Love Tarot",
    celticCross: "☘️ Celtic Cross"
  },
  
  // Miscellaneous
  misc: {
    loadingModels: "Loading models...",
    crossSpread: "➕ Cross Spread",
    horseshoeSpread: "🧲 Horseshoe Spread",
    loveSpread: "❤️ Love Tarot",
    celticCross: "☘️ Celtic Cross"
  },
  
  // Meta prompt for AI
  metaprompt: {
    base: `Response format (400-450 words, single message):
- Use emojis and markdown for formatting
- Integrate psychology and symbolism, make connections between cards
- Stay accessible, avoid excessive jargon
- End with practical and actionable advice
- Fully embody the persona: style, vocabulary, worldview`,
    
    emphasis: `⚠️ IMPERATIVE: Answer PRECISELY the question asked. 
Each element of your interpretation must illuminate a specific aspect of this question.`
  },
  
  // Configuration
  config: {
    apiKeyTitle: "OpenAI API Key Configuration",
    apiKeyDescription: "Enter your OpenAI API key to access OpenAI models. Your API key is stored locally in your browser and is never shared.",
    configureAPIKey: "Configure API Key",
    save: "Save",
    cancel: "Cancel",
    apiKeySaved: "API key saved successfully",
    apiKeyEmpty: "API key cannot be empty"
  },
  
  // Messages
  messages: {
    ollamaConnected: "Ollama connected successfully",
    modelAvailable: "Model available",
    modelUnavailable: "Model unavailable"
  },
  
  // Warnings
  warnings: {
    modelUnavailable: "Model unavailable",
    modelUnavailableDetails: "The model {modelName} is not available",
    error: "Error",
    checkConnection: "Check your internet connection",
    checkOllamaRunning: "Check if Ollama is running",
    checkNetworkConnection: "Check your network connection",
    installOllama: "Install Ollama from ollama.ai",
    checkOllama: "Check if Ollama is installed and running",
    checkAPIKey: "Check your API key",
    configureOpenAI: "Configure your OpenAI API key",
    apiKeyMissing: "OpenAI API key missing",
    apiKeyMissingDetails: "To use {modelName}, you need to configure a valid OpenAI API key",
    configureAPIKey: "Configure API key in config.js",
    useLocalModel: "Use a local model (Ollama)",
    refreshOllamaModels: "Refresh Ollama models list",
    tryAgain: "Try again",
    unexpectedError: "An unexpected error occurred",
    pullModel: "Download the model with 'ollama pull [model-name]'",
    selectDifferentModel: "Select a different model",
    modelMayBeLoading: "The model may be loading",
    checkOllamaMemory: "Check if your system has enough memory",
    pullModelManually: "Download a model manually with 'ollama pull [model-name]'",
    checkOllamaVersion: "Check if you're using the latest version of Ollama",
    modelTooLarge: "The model may be too large for your system",
    ollamaUnavailable: "Ollama unavailable",
    noOllamaModels: "No Ollama models available",
    noOllamaModelsDetails: "Ollama is accessible but no models are available",
    selectModel: "Select a model"
  },
  
  // Connectivity messages
  connectivity: {
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    error: "Connection error"
  },
  
  // Section titles
  sections: {
    reading: "Reading",
    interpretations: "Interpretation"
  },
  
  // Cards
  cards: {
    major_arcana: {
      fool: "The Fool",
      magician: "The Magician",
      high_priestess: "The High Priestess",
      empress: "The Empress",
      emperor: "The Emperor",
      hierophant: "The Hierophant",
      lovers: "The Lovers",
      chariot: "The Chariot",
      justice: "Justice",
      hermit: "The Hermit",
      wheel_of_fortune: "Wheel of Fortune",
      strength: "Strength",
      hanged_man: "The Hanged Man",
      death: "Death",
      temperance: "Temperance",
      devil: "The Devil",
      tower: "The Tower",
      star: "The Star",
      moon: "The Moon",
      sun: "The Sun",
      judgement: "Judgement",
      world: "The World",
      back: "Card back"
    }
  }
};

export default en; 