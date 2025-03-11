/**
 * Traductions espagnoles
 */

const es = {
  // Titre de la page
  pageTitle: "Tirada de Tarot en Cruz",
  appTitle: "JodoTarot:",
  
  // Éléments de l'en-tête
  header: {
    language: "Idioma:",
    persona: "Personaje:",
    cardSet: "Baraja:",
    spreadType: "Tipo de tirada:",
    iaModel: "Modelo de IA:",
    question: "Tu pregunta:",
    questionPlaceholder: "Introduce tu pregunta para esta lectura...",
    drawButton: "Tirar las cartas",
    drawButtonGenerating: "Generando... Por favor espera",
    streamingOption: "Respuesta en vivo:",
    stopGeneration: "Detener generación"
  },
  
  // Messages d'interprétation
  interpretation: {
    loading: "Analizando la tirada...",
    loadingWithModel: "Analizando la tirada en cruz con {model} interpretado por un/una {persona}...",
    default: "Las interpretaciones aparecerán aquí después de tirar las cartas.",
    loadingError: "Error al cargar la interpretación",
    retry: "Reintentar",
    cardTitle: "Carta",
    questionTitle: "Pregunta",
    noModelAvailable: "Ningún modelo de IA disponible",
    promptDisplay: "Aquí está el prompt que se habría enviado a la IA:",
    error: {
      general: "Ha ocurrido un error durante la interpretación. Por favor, inténtalo de nuevo.",
      noQuestion: "Por favor, introduce una pregunta antes de tirar las cartas",
      api: "Error de API: {0}"
    },
    apiWarning: "La interpretación se ha terminado de forma inesperada. Aquí está el resultado parcial:",
    userQuestion: "La pregunta planteada por el usuario es:",
    userMessage: "Me gustaría una interpretación detallada y personalizada de mi tirada de tarot en cruz. Analiza el simbolismo de cada carta según su posición y establece las conexiones entre las cartas para ofrecer una lectura coherente que responda con precisión a mi pregunta.",
    ollamaPromo: "Descarga <a href='https://ollama.com' target='_blank'>ollama</a> con <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> para empezar. Recarga la página y haz tu tirada",
    streamingResponse: "Generando respuesta",
    // Messages pour les cartes spécifiques
    loveCardsMeaning: {
      moon_bottomLeft: "\"La Luna\" en la posición de sentimientos revela emociones profundas, a veces confusas o ambivalentes. Explora tu mundo interior para entender mejor tus verdaderos deseos.",
      sun_bottomRight: "\"El Sol\" en la posición de futuro cercano anuncia un período de florecimiento y claridad en tu vida amorosa. Nuevas oportunidades luminosas se presentan ante ti."
    }
  },
  
  // Textes pour le prompt de tirage
  tarotReading: {
    intro: {
      cross: "Aquí está la tirada en cruz a interpretar para la persona que consulta el tarot:",
      horseshoe: "Aquí está la tirada en herradura a interpretar para la persona que consulta el tarot:",
      love: "Aquí está la tirada del Tarot del Amor a interpretar para la persona que consulta el tarot:",
      celticCross: "Aquí está la tirada de la Cruz Celta a interpretar para la persona que consulta el tarot:"
    },
    positions: {
      top: "Arriba",
      right: "Derecha",
      bottom: "Abajo",
      left: "Izquierda",
      center: "Centro",
      horseshoe1: "Situación actual",
      horseshoe2: "Desafío o obstáculo",
      horseshoe3: "Pasado reciente",
      horseshoe4: "Futuro cercano",
      horseshoe5: "Influencias externas",
      horseshoe6: "Actitud recomendada",
      horseshoe7: "Resultado probable",
      love1: "Tú mismo",
      love2: "Tu pareja o interés amoroso",
      love3: "La dinámica actual",
      love4: "Desafíos en la relación",
      love5: "Influencias externas",
      love6: "Camino a seguir",
      love7: "Resultado probable",
      celticCross1: "Situación actual",
      celticCross2: "Desafío o obstáculo",
      celticCross3: "Pasado reciente",
      celticCross4: "Futuro cercano",
      celticCross5: "Objetivo o ideal",
      celticCross6: "Influencias del pasado",
      celticCross7: "Tu actitud hacia la situación",
      celticCross8: "Influencias externas",
      celticCross9: "Esperanzas o temores",
      celticCross10: "Resultado final"
    }
  },
  
  // Personas et leurs descriptions
  personas: {
    tarologue: "🎴 Tarotista",
    oracle: "🌟 Oráculo Místico",
    voyante: "🔮 Gitana Vidente",
    pretre: "✝️ Sacerdote Exégeta",
    rabbin: "✡️ Rabino Cabalista",
    imam: "☪️ Imán Sufí",
    dalailama: "☸️ Dalai Lama",
    sorciere: "🧙‍♀️ Bruja Ancestral",
    alchimiste: "⚗️ Alquimista Esotérico",
    mage: "🌌 Mago Elementalista",
    francmacon: "🏛️ Maestro Masón",
    freud: "🛋️ Sigmund Freud",
    jung: "🌓 Carl Gustav Jung",
    lacan: "🪞 Jacques Lacan",
    dolto: "👶 Françoise Dolto",
    socrate: "🏺 Sócrates",
    salomon: "👑 Rey Salomón",
    montaigne: "✒️ Michel de Montaigne",
    quichotte: "🗡️ Don Quijote",
    demon: "😈 Mortrarion",
    noegoman: "🧘 No EGO man"
  },
  
  // Types de tirages
  spreadTypes: {
    cross: "Cruz",
    horseshoe: "Herradura",
    love: "Tarot del Amor",
    celticCross: "Cruz Celta"
  },
  
  // Messages d'avertissement
  warnings: {
    connectionFailed: "Error de conexión",
    modelNotFound: "Modelo no encontrado",
    noConnection: "No se pudo conectar a {model}. Asegúrate de que el servidor Ollama esté funcionando.",
    suggestions: "Sugerencias:",
    checkRunning: "Comprueba que Ollama esté funcionando",
    installOllama: "Instala Ollama desde ollama.com",
    downloadModel: "Descarga el modelo con: ollama pull {model}",
    useOpenAI: "Usa un modelo OpenAI como alternativa",
    customizePrompt: "Personaliza tu petición para obtener mejores resultados",
    useStandardPrompt: "Usa un prompt estándar para mejorar la compatibilidad",
    modelUnavailable: "Modelo no disponible",
    modelUnavailableDetails: "El modelo {modelName} no está disponible",
    error: "Error",
    checkConnection: "Verifica tu conexión a internet",
    checkOllamaRunning: "Ollama no iniciado",
    checkNetworkConnection: "Verifica tu conexión de red",
    checkOllama: "Ollama no disponible",
    checkAPIKey: "Verifica tu clave API",
    configureOpenAI: "Añade una clave API",
    apiKeyMissing: "API de OpenAI inaccesible",
    apiKeyMissingDetails: "Clave API requerida para {modelName}",
    configureAPIKey: "Configurar una clave API",
    useLocalModel: "Usar un modelo local (Ollama)",
    refreshOllamaModels: "Actualizar la lista de modelos de Ollama",
    tryAgain: "Intentar de nuevo",
    unexpectedError: "Ha ocurrido un error inesperado",
    pullModel: "Instalar vía 'ollama pull'",
    selectDifferentModel: "Selecciona un modelo diferente",
    modelMayBeLoading: "El modelo podría estar cargándose",
    checkOllamaMemory: "Verifica que tu sistema tiene suficiente memoria",
    pullModelManually: "Instalar vía <a href='https://ollama.com/library' target='_blank'>ollama.com/library</a>",
    checkOllamaVersion: "Verifica que estás usando la última versión de Ollama",
    modelTooLarge: "El modelo puede ser demasiado grande para tu sistema",
    ollamaUnavailable: "Problema con Ollama",
    noOllamaModels: "Modelos faltantes",
    noOllamaModelsDetails: "Instalar un modelo de Ollama",
    installModel: "Instalar vía <a href='https://ollama.com/library' target='_blank'>ollama.com</a>",
    selectModel: "Selecciona un modelo"
  },
  
  // Meta prompt pour l'IA
  metaprompt: {
    base: `Formato requerido (400-450 palabras):
1) Respuesta concisa y completa en un solo mensaje
2) Utiliza emojis relacionados con el tarot para ilustrar conceptos
3) Formateo HTML únicamente: <h1>/<h2>/<h3> títulos, <em>/<strong> importancia, <blockquote> citas, <ul>/<li> listas
4) Incorpora aspectos psicológicos y simbólicos de las cartas
5) Establece conexiones entre cartas que se complementan o se oponen
6) Evita el lenguaje excesivamente esotérico para ser accesible
7) Finaliza con un consejo práctico y una sugerencia de acción
8) No uses Markdown ni títulos en texto plano. No uses títulos en este formato: ** **
9) En español
10) Debes responder absolutamente encarnando al personaje elegido, con su estilo, vocabulario y visión del mundo específicos`,
    
    emphasis: `IMPORTANTE: Tu respuesta debe estar DIRECTA y ESPECÍFICAMENTE relacionada con esta pregunta.
Concéntrate en lo que la pregunta pide precisamente y adapta tu interpretación
según los elementos mencionados en la pregunta. No des una respuesta genérica.
Cada aspecto de tu interpretación debe abordar un aspecto de esta pregunta.`
  },
  
  personaGroups: {
    divinationArts: "🔮 Artes Adivinatorias",
    spiritualTraditions: "🕊️ Tradiciones Espirituales",
    esotericTraditions: "⚡ Tradiciones Esotéricas",
    psychoanalysts: "🧠 Psicoanalistas",
    philosophersSages: "📚 Filósofos y Sabios",
    supernaturalEntities: "👻 Entidades Sobrenaturales"
  },
  
  // Grupos de modelos IA
  iaGroups: {
    ollama: "🧠 Ollama",
    openai: "🤖 OpenAI"
  },
  
  // Mensajes de conectividad
  connectivity: {
    connecting: "Conectando...",
    connected: "Conectado",
    disconnected: "Desconectado",
    error: "Error de conexión"
  },
  
  // Títulos de secciones
  sections: {
    reading: "Tirada",
    interpretations: "Interpretación"
  },
  
  // Configuration
  config: {
    apiKeyTitle: "Configuración de la clave API de OpenAI",
    apiKeyDescription: "Introduce tu clave API de OpenAI para acceder a los modelos de OpenAI. Tu clave API se almacena localmente en tu navegador y nunca se comparte.",
    configureAPIKey: "Configurar clave API",
    save: "Guardar",
    cancel: "Cancelar",
    apiKeySaved: "Clave API guardada con éxito",
    apiKeyEmpty: "La clave API no puede estar vacía"
  },
  
  // Mensajes
  messages: {
    ollamaConnected: "Ollama conectado con éxito",
    modelAvailable: "Modelo disponible",
    modelUnavailable: "Modelo no disponible"
  }
};

export default es; 