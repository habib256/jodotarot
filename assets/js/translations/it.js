/**
 * Traductions italiennes
 */

const it = {
  // Titre de la page
  pageTitle: "Lettura dei Tarocchi a Croce",
  appTitle: "JodoTarot:",
  
  // Éléments de l'en-tête
  header: {
    language: "Lingua:",
    persona: "Personaggio:",
    cardSet: "Mazzo di carte:",
    spreadType: "Tipo di stesa:",
    iaModel: "Modello IA:",
    question: "La tua domanda:",
    questionPlaceholder: "Inserisci la tua domanda per questa lettura...",
    drawButton: "Pesca le carte",
    drawButtonGenerating: "Generazione in corso... Attendere prego",
    streamingOption: "Risposta in diretta:",
    stopGeneration: "Ferma generazione",
    copyButton: "Copia",
    copyButtonCopied: "Copiato!",
    copyButtonError: "Errore!"
  },
  
  // Messages d'interprétation
  interpretation: {
    loading: "Analisi della lettura in corso...",
    loadingWithModel: "Analisi della lettura in corso con {model} interpretato da un/una {persona}...",
    default: "Le interpretazioni appariranno qui dopo aver pescato le carte.",
    loadingError: "Errore durante il caricamento dell'interpretazione",
    retry: "Riprova",
    cardTitle: "Carta",
    questionTitle: "Domanda",
    noModelAvailable: "Nessun modello AI disponibile",
    promptDisplay: "Ecco il prompt che sarebbe stato inviato all'AI:",
    error: {
      general: "Si è verificato un errore durante l'interpretazione. Si prega di riprovare.",
      noQuestion: "Inserisci una domanda prima di pescare le carte",
      api: "Errore API: {0}"
    },
    apiWarning: "L'interpretazione è terminata in modo inaspettato. Ecco il risultato parziale:",
    userQuestion: "La domanda posta dall'utente è:",
    userMessage: "Vorrei un'interpretazione dettagliata e personalizzata della mia stesa di tarocchi a croce. Analizza il simbolismo di ogni carta in base alla sua posizione e stabilisci le connessioni tra le carte per offrire una lettura coerente che risponda con precisione alla mia domanda.",
    ollamaPromo: "Scarica <a href='https://ollama.com' target='_blank'>ollama</a> con <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> per iniziare. Ricarica la pagina e fai la tua pescata",
    streamingResponse: "Generazione della risposta",
    // Messages pour les cartes spécifiques
    loveCardsMeaning: {
      moon_bottomLeft: "\"La Luna\" nella posizione dei sentimenti rivela emozioni profonde, talvolta confuse o ambivalenti. Esplora il tuo mondo interiore per comprendere meglio i tuoi veri desideri.",
      sun_bottomRight: "\"Il Sole\" nella posizione del futuro prossimo annuncia un periodo di fioritura e chiarezza nella tua vita amorosa. Nuove opportunità luminose si presentano a te."
    }
  },
  
  // Textes pour le prompt de tirage
  tarotReading: {
    intro: {
      cross: "Ecco la stesa a croce da interpretare per la persona che consulta i tarocchi:",
      horseshoe: "Ecco la stesa a ferro di cavallo da interpretare per la persona che consulta i tarocchi:",
      love: "Ecco la stesa dei Tarocchi dell'Amore da interpretare per la persona che consulta i tarocchi:",
      celticCross: "Ecco la stesa della Croce Celtica da interpretare per la persona che consulta i tarocchi:"
    },
    positions: {
      top: "In alto",
      right: "A destra",
      bottom: "In basso",
      left: "A sinistra",
      center: "Centro",
      horseshoe1: "Situazione attuale",
      horseshoe2: "Sfida o ostacolo",
      horseshoe3: "Passato recente",
      horseshoe4: "Futuro prossimo",
      horseshoe5: "Influenze esterne",
      horseshoe6: "Atteggiamento consigliato",
      horseshoe7: "Risultato probabile",
      love1: "Te stesso",
      love2: "Il tuo partner o interesse amoroso",
      love3: "Dinamica attuale",
      love4: "Sfide nella relazione",
      love5: "Influenze esterne",
      love6: "Percorso da seguire",
      love7: "Risultato probabile",
      celticCross1: "Situazione attuale",
      celticCross2: "Sfida o ostacolo",
      celticCross3: "Passato recente",
      celticCross4: "Futuro prossimo",
      celticCross5: "Obiettivo o ideale",
      celticCross6: "Influenze dal passato",
      celticCross7: "Il tuo atteggiamento verso la situazione",
      celticCross8: "Influenze esterne",
      celticCross9: "Speranze o timori",
      celticCross10: "Risultato finale"
    }
  },
  
  // Personas et leurs descriptions
  personas: {
    tarologue: "🎴 Lettore di Tarocchi",
    oracle: "🌟 Oracolo Mistico",
    voyante: "🔮 Chiromante Gitana",
    pretre: "✝️ Sacerdote Esegeta",
    rabbin: "✡️ Rabbino Cabalista",
    imam: "☪️ Imam Sufi",
    dalailama: "☸️ Dalai Lama",
    sorciere: "🧙‍♀️ Strega Ancestrale",
    alchimiste: "⚗️ Alchimista Esoterico",
    mage: "🌌 Mago Elementalista",
    francmacon: "🏛️ Maestro Massone",
    freud: "🛋️ Sigmund Freud",
    jung: "🌓 Carl Gustav Jung",
    lacan: "🪞 Jacques Lacan",
    dolto: "👶 Françoise Dolto",
    socrate: "🏺 Socrate",
    salomon: "👑 Re Salomone",
    montaigne: "✒️ Michel de Montaigne",
    quichotte: "🗡️ Don Chisciotte",
    demon: "😈 Mortrarion",
    noegoman: "🧘 No EGO man"
  },
  
  // Types de tirages
  spreadTypes: {
    cross: "Croce",
    horseshoe: "Ferro di Cavallo",
    love: "Tarocchi dell'Amore",
    celticCross: "Croce Celtica"
  },
  
  // Messages d'avertissement
  warnings: {
    connectionFailed: "Errore di connessione",
    modelNotFound: "Modello non trovato",
    noConnection: "Impossibile connettersi a {model}. Assicurati che il server Ollama sia in esecuzione.",
    suggestions: "Suggerimenti:",
    checkRunning: "Verifica che Ollama sia in esecuzione",
    installOllama: "Installa Ollama da ollama.com",
    downloadModel: "Scarica il modello con: ollama pull {model}",
    useOpenAI: "Usa un modello OpenAI come alternativa",
    customizePrompt: "Personalizza la tua richiesta per ottenere risultati migliori",
    useStandardPrompt: "Usa un prompt standard per migliorare la compatibilità",
    modelUnavailable: "Modello non disponibile",
    modelUnavailableDetails: "Il modello {modelName} non è disponibile",
    error: "Errore",
    checkConnection: "Verifica la tua connessione internet",
    checkOllamaRunning: "Ollama non avviato",
    checkNetworkConnection: "Verifica la tua connessione di rete",
    checkOllama: "Ollama non disponibile",
    checkAPIKey: "Verifica la tua chiave API",
    configureOpenAI: "Aggiungi una chiave API",
    apiKeyMissing: "API OpenAI inaccessibile",
    apiKeyMissingDetails: "Chiave API richiesta per {modelName}",
    configureAPIKey: "Configura una chiave API",
    useLocalModel: "Usa un modello locale (Ollama)",
    refreshOllamaModels: "Aggiorna la lista dei modelli Ollama",
    tryAgain: "Riprova",
    unexpectedError: "Si è verificato un errore imprevisto",
    pullModel: "Installa tramite 'ollama pull'",
    selectDifferentModel: "Seleziona un modello diverso",
    modelMayBeLoading: "Il modello potrebbe essere in fase di caricamento",
    checkOllamaMemory: "Verifica che il tuo sistema abbia memoria sufficiente",
    pullModelManually: "Installa tramite <a href='https://ollama.com/library' target='_blank'>ollama.com/library</a>",
    checkOllamaVersion: "Verifica di utilizzare l'ultima versione di Ollama",
    modelTooLarge: "Il modello potrebbe essere troppo grande per il tuo sistema",
    ollamaUnavailable: "Problema Ollama",
    noOllamaModels: "Modelli mancanti",
    noOllamaModelsDetails: "Installa un modello Ollama",
    installModel: "Installa tramite <a href='https://ollama.com/library' target='_blank'>ollama.com</a>",
    selectModel: "Seleziona un modello"
  },
  
  personaGroups: {
    divinationArts: "🔮 Arti Divinatorie",
    spiritualTraditions: "🕊️ Tradizioni Spirituali",
    esotericTraditions: "⚡ Tradizioni Esoteriche",
    psychoanalysts: "🧠 Psicoanalisti",
    philosophersSages: "📚 Filosofi e Saggi",
    supernaturalEntities: "👻 Entità Soprannaturali"
  },
  
  // Gruppi di modelli IA
  iaGroups: {
    ollama: "🧠 Ollama",
    openai: "🤖 OpenAI"
  },
  
  // Meta prompt per l'IA
  metaprompt: {
    base: `Formato risposta (400-450 parole, un solo messaggio):
- Usa emoji e markdown per la formattazione
- Integra psicologia e simbolismo, crea connessioni tra carte
- Rimani accessibile, evita gergo eccessivo
- Concludi con consiglio pratico e attuabile
- Incarna totalmente il personaggio: stile, vocabolario, visione del mondo`,
    
    emphasis: `⚠️ IMPERATIVO: Rispondi PRECISAMENTE alla domanda posta. 
Ogni elemento della tua interpretazione deve illuminare un aspetto specifico di questa domanda.`
  },
  
  // Messaggi di connettività
  connectivity: {
    connecting: "Connessione in corso...",
    connected: "Connesso",
    disconnected: "Disconnesso",
    error: "Errore di connessione"
  },
  
  // Titoli delle sezioni
  sections: {
    reading: "Lettura",
    interpretations: "Interpretazione"
  },
  
  // Configurazione
  config: {
    apiKeyTitle: "Configurazione della chiave API di OpenAI",
    apiKeyDescription: "Inserisci la tua chiave API OpenAI per accedere ai modelli OpenAI. La tua chiave API è memorizzata localmente nel tuo browser e non viene mai condivisa.",
    configureAPIKey: "Configura chiave API",
    save: "Salva",
    cancel: "Annulla",
    apiKeySaved: "Chiave API salvata con successo",
    apiKeyEmpty: "La chiave API non può essere vuota"
  },
  
  // Messaggi
  messages: {
    ollamaConnected: "Ollama connesso con successo",
    modelAvailable: "Modello disponibile",
    modelUnavailable: "Modello non disponibile"
  },
  
  // Carte
  cards: {
    reversed: "Rovesciata",
    major_arcana: {
      fool: "Il Matto",
      magician: "Il Mago",
      high_priestess: "La Papessa",
      empress: "L'Imperatrice",
      emperor: "L'Imperatore",
      hierophant: "Il Papa",
      lovers: "Gli Amanti",
      chariot: "Il Carro",
      justice: "La Giustizia",
      hermit: "L'Eremita",
      wheel_of_fortune: "La Ruota della Fortuna",
      strength: "La Forza",
      hanged_man: "L'Appeso",
      death: "La Morte",
      temperance: "La Temperanza",
      devil: "Il Diavolo",
      tower: "La Torre",
      star: "La Stella",
      moon: "La Luna",
      sun: "Il Sole",
      judgement: "Il Giudizio",
      world: "Il Mondo",
      back: "Retro della carta"
    }
  }
};

export default it; 