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
    stopGeneration: "Generierung stoppen"
  },
  
  // Messages d'interprétation
  interpretation: {
    loading: "Analysiere die Legung...",
    loadingWithModel: "Analysiere die Kreuzlegung mit {model} interpretiert von einem/einer {persona}...",
    default: "Die Interpretationen werden nach dem Ziehen der Karten hier angezeigt.",
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
    useStandardPrompt: "Verwende einen Standardprompt für bessere Kompatibilität"
  },
  
  // Meta prompt pour l'IA
  metaprompt: {
    base: `Erforderliches Format (400-450 Wörter):
1) Präzise und vollständige Antwort in einer Nachricht
2) Verwende relevante Tarot-Emojis zur Veranschaulichung von Konzepten
3) Nur HTML-Formatierung: <h1>/<h2>/<h3> Überschriften, <em>/<strong> Betonung, <blockquote> Zitate, <ul>/<li> Listen
4) Integriere psychologische und symbolische Aspekte der Karten
5) Stelle Verbindungen zwischen Karten her, die sich ergänzen oder entgegenstehen
6) Vermeide übermäßig esoterischen Fachjargon, um verständlich zu bleiben
7) Schließe mit praktischen Ratschlägen und einem Handlungsvorschlag ab
8) Kein Markdown oder Überschriften im Klartext. Keine Titel im Format: ** **
9) Auf Deutsch
10) Du musst unbedingt in der Rolle der gewählten Persona antworten, mit ihrem spezifischen Stil, Vokabular und ihrer Weltanschauung`,
    
    emphasis: `WICHTIG: Deine Antwort muss DIREKT und SPEZIFISCH mit dieser Frage verbunden sein.
Konzentriere dich darauf, was die Frage genau fragt, und passe deine Interpretation
an die in der Frage genannten Elemente an. Gib keine allgemeine Antwort.
Jeder Aspekt deiner Interpretation muss einen Aspekt dieser Frage ansprechen.`
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
  }
};

export default de; 