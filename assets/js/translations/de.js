/**
 * Traductions allemandes
 */

const de = {
  // Titre de la page
  pageTitle: "Tarot-Kreuzlegung",
  appTitle: "JodoTarot:",
  
  // Éléments de l'en-tête
  header: {
    language: "Sprache:",
    persona: "Charakter:",
    cardSet: "Kartendeck:",
    spreadType: "Legemuster:",
    iaModel: "KI-Modell:",
    question: "Deine Frage:",
    questionPlaceholder: "Gib deine Frage für diese Lesung ein...",
    drawButton: "Karten ziehen",
    drawButtonGenerating: "Generierung läuft... Bitte warten",
    streamingOption: "Live-Antwort:",
    stopGeneration: "Generierung stoppen",
    copyButton: "Kopieren",
    copyButtonCopied: "Kopiert!",
    copyButtonError: "Fehler!"
  },
  
  // Messages d'interprétation
  interpretation: {
    loading: "Analyse der Kartenlegung...",
    loadingWithModel: "Analyse der Kartenlegung mit {model}, interpretiert von einem/einer {persona}...",
    default: "Die Interpretationen erscheinen hier, nachdem Sie die Karten gezogen haben.",
    loadingError: "Fehler beim Laden der Interpretation",
    retry: "Erneut versuchen",
    cardTitle: "Karte",
    questionTitle: "Frage",
    noModelAvailable: "Kein KI-Modell verfügbar",
    promptDisplay: "Hier ist der Prompt, der an die KI gesendet worden wäre:",
    error: {
      general: "Bei der Interpretation ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      noQuestion: "Bitte gib eine Frage ein, bevor du die Karten ziehst",
      api: "API-Fehler: {0}"
    },
    apiWarning: "Die Interpretation wurde unerwartet beendet. Hier ist das teilweise Ergebnis:",
    userQuestion: "Die vom Benutzer gestellte Frage lautet:",
    userMessage: "Ich hätte gerne eine detaillierte und personalisierte Interpretation meiner Tarot-Kreuzlegung. Analysiere die Symbolik jeder Karte entsprechend ihrer Position und stelle Verbindungen zwischen den Karten her, um eine kohärente Lesung zu bieten, die genau auf meine Frage eingeht.",
    ollamaPromo: "Lade <a href='https://ollama.com' target='_blank'>ollama</a> mit <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> herunter, um zu beginnen. Lade die Seite neu und ziehe deine Karten",
    streamingResponse: "Generiere Antwort",
    // Messages pour les cartes spécifiques
    loveCardsMeaning: {
      moon_bottomLeft: "\"Der Mond\" in der Position der Gefühle offenbart tiefe, manchmal verwirrende oder ambivalente Emotionen. Erforsche deine innere Welt, um deine wahren Wünsche besser zu verstehen.",
      sun_bottomRight: "\"Die Sonne\" in der Position der nahen Zukunft kündigt eine Zeit des Wachstums und der Klarheit in deinem Liebesleben an. Neue, strahlende Möglichkeiten eröffnen sich dir."
    }
  },
  
  // Textes pour le prompt de tirage
  tarotReading: {
    intro: {
      cross: "Hier ist die Kreuzlegung zu interpretieren für die Person, die das Tarot konsultiert:",
      horseshoe: "Hier ist die Hufeisenlegung zu interpretieren für die Person, die das Tarot konsultiert:",
      love: "Hier ist die Liebes-Tarot-Legung zu interpretieren für die Person, die das Tarot konsultiert:",
      celticCross: "Hier ist die Keltische-Kreuz-Legung zu interpretieren für die Person, die das Tarot konsultiert:"
    },
    positions: {
      top: "Oben",
      right: "Rechts",
      bottom: "Unten",
      left: "Links",
      center: "Zentrum",
      horseshoe1: "Aktuelle Situation",
      horseshoe2: "Herausforderung oder Hindernis",
      horseshoe3: "Jüngste Vergangenheit",
      horseshoe4: "Nahe Zukunft",
      horseshoe5: "Externe Einflüsse",
      horseshoe6: "Empfohlene Einstellung",
      horseshoe7: "Wahrscheinliches Ergebnis",
      love1: "Du selbst",
      love2: "Dein Partner oder Liebesinteresse",
      love3: "Aktuelle Dynamik",
      love4: "Herausforderungen in der Beziehung",
      love5: "Externe Einflüsse",
      love6: "Weiterer Weg",
      love7: "Wahrscheinliches Ergebnis",
      celticCross1: "Aktuelle Situation",
      celticCross2: "Herausforderung oder Hindernis",
      celticCross3: "Jüngste Vergangenheit",
      celticCross4: "Nahe Zukunft",
      celticCross5: "Ziel oder Ideal",
      celticCross6: "Einflüsse aus der Vergangenheit",
      celticCross7: "Deine Einstellung zur Situation",
      celticCross8: "Externe Einflüsse",
      celticCross9: "Hoffnungen oder Ängste",
      celticCross10: "Endgültiges Ergebnis"
    }
  },
  
  // Personas et leurs descriptions
  personas: {
    tarologue: "🎴 Tarot-Leser",
    oracle: "🌟 Mystisches Orakel",
    voyante: "🔮 Zigeuner-Wahrsagerin",
    pretre: "✝️ Exegetischer Priester",
    rabbin: "✡️ Kabbalistischer Rabbiner",
    imam: "☪️ Sufi-Imam",
    dalailama: "☸️ Dalai Lama",
    sorciere: "🧙‍♀️ Uralte Hexe",
    alchimiste: "⚗️ Esoterischer Alchemist",
    mage: "🌌 Elementar-Magier",
    francmacon: "🏛️ Freimaurer-Meister",
    freud: "🛋️ Sigmund Freud",
    jung: "🌓 Carl Gustav Jung",
    lacan: "🪞 Jacques Lacan",
    dolto: "👶 Françoise Dolto",
    socrate: "🏺 Sokrates",
    salomon: "👑 König Salomon",
    montaigne: "✒️ Michel de Montaigne",
    quichotte: "🗡️ Don Quijote",
    demon: "😈 Mortrarion",
    noegoman: "🧘 No EGO man"
  },
  
  // Types de tirages
  spreadTypes: {
    cross: "Kreuz",
    horseshoe: "Hufeisen",
    love: "Liebes-Tarot",
    celticCross: "Keltisches Kreuz"
  },
  
  // Diverses
  misc: {
    loadingModels: "Modelle werden geladen...",
    crossSpread: "➕ Kreuzlegung",
    horseshoeSpread: "🧲 Hufeisenlegung",
    loveSpread: "❤️ Liebes-Tarot",
    celticCross: "☘️ Keltisches Kreuz"
  },
  
  tarotPrompt: "{persona}, was offenbart dieses {spreadType} über meine Frage: \"{question}\"? Analysiere die Karten einzeln und als Ganzes, unter Berücksichtigung ihrer Positionen und Interaktionen. Teile deine einzigartige Sicht.",
  
  // Messages d'avertissement
  warnings: {
    connectionFailed: "Verbindungsfehler",
    modelNotFound: "Modell nicht gefunden",
    noConnection: "Konnte keine Verbindung zu {model} herstellen. Stelle sicher, dass der Ollama-Server läuft.",
    suggestions: "Vorschläge:",
    checkRunning: "Überprüfe, ob Ollama läuft",
    installOllama: "Installiere Ollama von ollama.com",
    downloadModel: "Lade das Modell herunter mit: ollama pull {model}",
    useOpenAI: "Verwende ein OpenAI-Modell als Alternative",
    customizePrompt: "Passe deinen Prompt an, um bessere Ergebnisse zu erzielen",
    useStandardPrompt: "Verwende einen Standardprompt für bessere Kompatibilität",
    modelUnavailable: "Modell nicht verfügbar",
    modelUnavailableDetails: "Das Modell {modelName} ist nicht verfügbar",
    error: "Fehler",
    checkConnection: "Überprüfe deine Internetverbindung",
    checkOllamaRunning: "Ollama nicht gestartet",
    checkNetworkConnection: "Überprüfe deine Netzwerkverbindung",
    checkOllama: "Ollama nicht verfügbar",
    checkAPIKey: "Überprüfe deinen API-Schlüssel",
    configureOpenAI: "API-Schlüssel hinzufügen",
    apiKeyMissing: "OpenAI API nicht zugänglich",
    apiKeyMissingDetails: "API-Schlüssel erforderlich für {modelName}",
    configureAPIKey: "API-Schlüssel konfigurieren",
    useLocalModel: "Lokales Modell verwenden (Ollama)",
    refreshOllamaModels: "Ollama-Modellliste aktualisieren",
    tryAgain: "Erneut versuchen",
    unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
    pullModel: "Über 'ollama pull' installieren",
    selectDifferentModel: "Anderes Modell auswählen",
    modelMayBeLoading: "Das Modell wird möglicherweise gerade geladen",
    checkOllamaMemory: "Überprüfe, ob dein System genügend Speicher hat",
    pullModelManually: "Über <a href='https://ollama.com/library' target='_blank'>ollama.com/library</a> installieren",
    checkOllamaVersion: "Überprüfe, ob du die neueste Ollama-Version verwendest",
    modelTooLarge: "Das Modell ist möglicherweise zu groß für dein System",
    ollamaUnavailable: "Ollama-Problem",
    noOllamaModels: "Fehlende Modelle",
    noOllamaModelsDetails: "Ollama-Modell installieren",
    installModel: "Über <a href='https://ollama.com/library' target='_blank'>ollama.com</a> installieren",
    selectModel: "Modell auswählen"
  },
  
  // Meta prompt pour l'IA
  metaprompt: {
    base: `Antwortformat (400-450 Wörter, eine Nachricht):
- Verwende Emojis und Markdown zur Formatierung
- Integriere Psychologie und Symbolik, stelle Verbindungen zwischen Karten her
- Bleibe verständlich, vermeide übermäßigen Fachjargon
- Schließe mit praktischem und umsetzbarem Rat ab
- Verkörpere die Persona vollständig: Stil, Vokabular, Weltanschauung`,
    
    emphasis: `⚠️ IMPERATIV: Antworte PRÄZISE auf die gestellte Frage. 
Jedes Element deiner Interpretation muss einen spezifischen Aspekt dieser Frage beleuchten.`
  },
  
  personaGroups: {
    divinationArts: "🔮 Wahrsagekünste",
    spiritualTraditions: "🕊️ Spirituelle Traditionen",
    esotericTraditions: "⚡ Esoterische Traditionen",
    psychoanalysts: "🧠 Psychoanalytiker",
    philosophersSages: "📚 Philosophen & Weise",
    supernaturalEntities: "👻 Übernatürliche Wesen"
  },
  
  // KI-Modellgruppen
  iaGroups: {
    ollama: "🧠 Ollama",
    openai: "🤖 OpenAI"
  },
  
  // Konnektivitätsmeldungen
  connectivity: {
    connecting: "Verbindung wird hergestellt...",
    connected: "Verbunden",
    disconnected: "Getrennt",
    error: "Verbindungsfehler"
  },
  
  // Abschnittstitel
  sections: {
    reading: "Kartenlegung",
    interpretations: "Interpretation"
  },
  
  // Konfiguration
  config: {
    apiKeyTitle: "OpenAI API-Schlüssel-Konfiguration",
    apiKeyDescription: "Gib deinen OpenAI API-Schlüssel ein, um auf OpenAI-Modelle zuzugreifen. Dein API-Schlüssel wird lokal in deinem Browser gespeichert und niemals geteilt.",
    configureAPIKey: "API-Schlüssel konfigurieren",
    save: "Speichern",
    cancel: "Abbrechen",
    apiKeySaved: "API-Schlüssel erfolgreich gespeichert",
    apiKeyEmpty: "Der API-Schlüssel darf nicht leer sein"
  },
  
  // Nachrichten
  messages: {
    ollamaConnected: "Ollama erfolgreich verbunden",
    modelAvailable: "Modell verfügbar",
    modelUnavailable: "Modell nicht verfügbar"
  },
  
  // Karten
  cards: {
    reversed: "Umgekehrt",
    major_arcana: {
      fool: "Der Narr",
      magician: "Der Magier",
      high_priestess: "Die Hohepriesterin",
      empress: "Die Herrscherin",
      emperor: "Der Herrscher",
      hierophant: "Der Hierophant",
      lovers: "Die Liebenden",
      chariot: "Der Wagen",
      justice: "Die Gerechtigkeit",
      hermit: "Der Eremit",
      wheel_of_fortune: "Rad des Schicksals",
      strength: "Die Kraft",
      hanged_man: "Der Gehängte",
      death: "Der Tod",
      temperance: "Die Mäßigkeit",
      devil: "Der Teufel",
      tower: "Der Turm",
      star: "Der Stern",
      moon: "Der Mond",
      sun: "Die Sonne",
      judgement: "Das Gericht",
      world: "Die Welt",
      back: "Kartenrückseite"
    }
  }
};

export default de; 