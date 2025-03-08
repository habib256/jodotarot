/**
 * Fichier de traductions pour l'internationalisation de l'interface
 */

const TRANSLATIONS = {
  // Français (langue par défaut)
  fr: {
    // Titre de la page
    pageTitle: "Tirage de Tarot en Croix",
    appTitle: "JodoTarot: L'intelligence artificielle",
    // Éléments de l'en-tête
    header: {
      language: "Langue :",
      persona: "Personnage :",
      cardSet: "Jeu de cartes :",
      spreadType: "Mode de tirage :",
      iaModel: "Modèle d'IA :",
      question: "Votre question :",
      questionPlaceholder: "Entrez votre question pour ce tirage...",
      drawButton: "Tirer les cartes"
    },
    // Messages d'interprétation
    interpretation: {
      loading: "Analyse du tirage en cours...",
      loadingWithModel: "Analyse du tirage en croix en cours avec {model} interprété par un(e) {persona}...",
      default: "Les interprétations s'afficheront ici après le tirage.",
      error: "Une erreur est survenue lors de l'interprétation. Veuillez réessayer.",
      userQuestion: "La question posée par l'utilisateur est:",
      userMessage: "J'aimerais une interprétation détaillée et personnalisée de mon tirage de tarot en croix. Analysez la symbolique de chaque carte en fonction de sa position et établissez les connexions entre les cartes pour offrir une lecture cohérente qui réponde précisément à ma question.",
      ollamaPromo: "Télécharge <a href='https://ollama.com' target='_blank'>ollama</a> avec <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> pour commencer. Recharge la page et réalise ton tirage de cartes"
    },
    // Textes pour le prompt de tirage
    tarotReading: {
      intro: "Voici le tirage en croix à interpréter pour la personne consultant le tarot:",
      positions: {
        top: "en haut (influences positives/spirituelles/conscientes)",
        left: "à gauche (passé/origines de la situation/causes)",
        center: "au centre (situation actuelle/enjeu principal/question essentielle)",
        right: "à droite (futur/évolution probable/direction)",
        bottom: "en bas (influences négatives/défis à surmonter/inconscient)"
      },
      instructions: {
        top: "Analyse les forces spirituelles, mentales ou conscientes qui soutiennent la personne. Explore comment ces énergies peuvent être utilisées comme ressources.",
        left: "Explore en profondeur comment les événements passés ont façonné et contribué à la situation actuelle. Identifie les patterns ou les leçons importantes.",
        center: "Décris précisément la situation actuelle, les enjeux centraux et les énergies dominantes. Cette carte représente le cœur de la question.",
        right: "Projette l'évolution probable si la personne suit le chemin actuel. Offre des conseils sur la meilleure façon d'aborder ce futur potentiel.",
        bottom: "Identifie les obstacles, les peurs, les blocages inconscients à surmonter et propose des moyens concrets de les transformer ou de les gérer."
      },
      conclusion: "Synthétise l'ensemble du tirage en prenant en compte les interactions dynamiques entre les cartes, leur symbolisme et leur position relative. Conclue avec des conseils pratiques et une perspective globale qui répond directement à la question posée."
    },
    // Groupes d'options dans les menus déroulants
    optgroups: {
      divinationArts: "Arts Divinatoires",
      spiritualTraditions: "Traditions Spirituelles",
      esotericTraditions: "Traditions Ésotériques",
      psychoanalysts: "Psychanalystes",
      supernaturalEntities: "Entités Surnaturelles",
      openai: "OpenAI",
      ollama: "Ollama"
    },
    // Personas - Noms traduits
    personas: {
      tarologue: "Tarologue",
      oracle: "Oracle Mystique",
      voyante: "Voyante Gitane",
      pretre: "Prêtre Exégète",
      rabbin: "Rabbin Kabbaliste",
      imam: "Imam Soufis",
      sorciere: "Sorcière Ancestrale",
      alchimiste: "Alchimiste Ésotérique",
      mage: "Mage Élémentaliste",
      freud: "Sigmund Freud",
      jung: "Carl Gustav Jung",
      lacan: "Jacques Lacan",
      dolto: "Françoise Dolto",
      demon: "Mortrarion",
      noegoman: "No EGO man",
      socrate: "Socrate",
      salomon: "Roi Salomon",
      quichotte: "Don Quichotte",
      montaigne: "Michel de Montaigne",
      francmacon: "Maître Franc-Maçon",
      dalailama: "Dalaï-Lama"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Tirage en Croix"
    },
    // Messages divers
    misc: {
      loadingModels: "Chargement des modèles...",
      crossSpread: "Tirage en Croix",
      tarotPrompt: "{persona}, que révèle ce tirage {spreadType} sur ma question : \"{question}\" ? Analysez les cartes individuellement puis globalement, en considérant leurs positions et interactions. Partagez votre vision unique."
    }
  },
  
  // Anglais
  en: {
    // Titre de la page
    pageTitle: "Tarot Cross Spread",
    appTitle: "JodoTarot: Artificial Intelligence",
    // Éléments de l'en-tête
    header: {
      language: "Language:",
      persona: "Character:",
      cardSet: "Card deck:",
      spreadType: "Spread type:",
      iaModel: "AI Model:",
      question: "Your question:",
      questionPlaceholder: "Enter your question for this reading...",
      drawButton: "Draw cards"
    },
    interpretation: {
      loading: "Analyzing the spread...",
      loadingWithModel: "Analyzing the cross spread with {model} interpreted by a {persona}...",
      default: "Interpretations will appear here after the cards are drawn.",
      error: "An error occurred during the interpretation. Please try again.",
      userQuestion: "The question posed by the user is:",
      userMessage: "I would like a detailed and personalized interpretation of my cross tarot spread. Analyze the symbolism of each card based on its position and establish connections between the cards to offer a coherent reading that precisely addresses my question.",
      ollamaPromo: "Download <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> to start drawing cards with <a href='https://ollama.com' target='_blank'>ollama</a> and reload the page to see your models."
    },
    // Tarot reading prompt texts
    tarotReading: {
      intro: "Here is the cross spread to interpret for the person consulting the tarot:",
      positions: {
        top: "at the top (positive/spiritual/conscious influences)",
        left: "on the left (past/origins of the situation/causes)",
        center: "at the center (current situation/main issue/essential question)",
        right: "on the right (future/probable evolution/direction)",
        bottom: "at the bottom (negative influences/challenges to overcome/unconscious)"
      },
      instructions: {
        top: "Analyze the spiritual, mental or conscious forces supporting the person. Explore how these energies can be used as resources.",
        left: "Explore in depth how past events have shaped and contributed to the current situation. Identify important patterns or lessons.",
        center: "Describe precisely the current situation, central issues and dominant energies. This card represents the heart of the question.",
        right: "Project the likely evolution if the person follows the current path. Offer advice on the best way to approach this potential future.",
        bottom: "Identify obstacles, fears, unconscious blocks to overcome and suggest concrete ways to transform or manage them."
      },
      conclusion: "Synthesize the entire spread by taking into account the dynamic interactions between the cards, their symbolism and their relative position. Conclude with practical advice and a global perspective that directly addresses the question asked."
    },
    // Groupes d'options dans les menus déroulants
    optgroups: {
      divinationArts: "Divination Arts",
      spiritualTraditions: "Spiritual Traditions",
      esotericTraditions: "Esoteric Traditions",
      psychoanalysts: "Psychoanalysts",
      supernaturalEntities: "Supernatural Entities",
      openai: "OpenAI",
      ollama: "Ollama"
    },
    // Personas - Noms traduits
    personas: {
      tarologue: "Tarot Reader",
      oracle: "Mystic Oracle",
      voyante: "Gypsy Fortune Teller",
      pretre: "Exegetical Priest",
      rabbin: "Kabbalistic Rabbi",
      imam: "Sufi Imam",
      sorciere: "Ancestral Witch",
      alchimiste: "Esoteric Alchemist",
      mage: "Elementalist Mage",
      freud: "Sigmund Freud",
      jung: "Carl Gustav Jung",
      lacan: "Jacques Lacan",
      dolto: "Françoise Dolto",
      demon: "Mortrarion",
      noegoman: "No EGO man",
      socrate: "Socrates",
      salomon: "King Solomon",
      quichotte: "Don Quixote",
      montaigne: "Michel de Montaigne",
      francmacon: "Master Freemason",
      dalailama: "Dalai Lama"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Cross Spread"
    },
    misc: {
      loadingModels: "Loading models...",
      crossSpread: "Cross Spread",
      tarotPrompt: "{persona}, what does this {spreadType} reveal about my question: \"{question}\"? Analyze the cards individually then as a whole, considering their positions and interactions. Share your unique insight."
    }
  },
  
  // Espagnol
  es: {
    // Titre de la page
    pageTitle: "Tirada de Tarot en Cruz",
    appTitle: "JodoTarot: La inteligencia artificial",
    // Éléments de l'en-tête
    header: {
      language: "Idioma:",
      persona: "Personaje:",
      cardSet: "Baraja de cartas:",
      spreadType: "Tipo de tirada:",
      iaModel: "Modelo de IA:",
      question: "Tu pregunta:",
      questionPlaceholder: "Introduce tu pregunta para esta tirada...",
      drawButton: "Sacar cartas"
    },
    interpretation: {
      loading: "Analizando la tirada...",
      loadingWithModel: "Analizando la tirada en cruz con {model} interpretado por un(a) {persona}...",
      default: "Las interpretaciones aparecerán aquí después de la tirada.",
      error: "Ha ocurrido un error durante la interpretación. Por favor, inténtelo de nuevo.",
      userQuestion: "La pregunta planteada por el usuario es:",
      userMessage: "Me gustaría una interpretación detallada y personalizada de mi tirada de tarot en cruz. Analice el simbolismo de cada carta según su posición y establezca conexiones entre las cartas para ofrecer una lectura coherente que responda con precisión a mi pregunta.",
      ollamaPromo: "Descarga <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> para empezar a tirar cartas con <a href='https://ollama.com' target='_blank'>ollama</a> y recarga la página para ver tus modelos."
    },
    // Textes pour le tirage de tarot en espagnol
    tarotReading: {
      intro: "Aquí está la tirada en cruz para interpretar para la persona que consulta el tarot:",
      positions: {
        top: "en la parte superior (influencias positivas/espirituales/conscientes)",
        left: "a la izquierda (pasado/orígenes de la situación/causas)",
        center: "en el centro (situación actual/tema principal/pregunta esencial)",
        right: "a la derecha (futuro/evolución probable/dirección)",
        bottom: "en la parte inferior (influencias negativas/desafíos a superar/inconsciente)"
      },
      instructions: {
        top: "Analiza las fuerzas espirituales, mentales o conscientes que apoyan a la persona. Explora cómo estas energías pueden utilizarse como recursos.",
        left: "Explora en profundidad cómo los eventos pasados han moldeado y contribuido a la situación actual. Identifica patrones o lecciones importantes.",
        center: "Describe con precisión la situación actual, los temas centrales y las energías dominantes. Esta carta representa el corazón de la cuestión.",
        right: "Proyecta la evolución probable si la persona sigue el camino actual. Ofrece consejos sobre la mejor manera de abordar este futuro potencial.",
        bottom: "Identifica los obstáculos, miedos, bloqueos inconscientes a superar y sugiere formas concretas de transformarlos o gestionarlos."
      },
      conclusion: "Sintetiza toda la tirada teniendo en cuenta las interacciones dinámicas entre las cartas, su simbolismo y su posición relativa. Concluye con consejos prácticos y una perspectiva global que responda directamente a la pregunta planteada."
    },
    optgroups: {
      divinationArts: "Artes Adivinatorias",
      spiritualTraditions: "Tradiciones Espirituales",
      esotericTraditions: "Tradiciones Esotéricas",
      psychoanalysts: "Psicoanalistas",
      supernaturalEntities: "Entidades Sobrenaturales",
      openai: "OpenAI",
      ollama: "Ollama"
    },
    // Personas - Noms traduits
    personas: {
      tarologue: "Tarólogo",
      oracle: "Oráculo Místico",
      voyante: "Vidente Gitana",
      pretre: "Sacerdote Exégeta",
      rabbin: "Rabino Cabalista",
      imam: "Imán Sufí",
      sorciere: "Bruja Ancestral",
      alchimiste: "Alquimista Esotérico",
      mage: "Mago Elementalista",
      freud: "Sigmund Freud",
      jung: "Carl Gustav Jung",
      lacan: "Jacques Lacan",
      dolto: "Françoise Dolto",
      demon: "Mortrarion",
      noegoman: "No EGO man",
      socrate: "Sócrates",
      salomon: "Rey Salomón",
      quichotte: "Don Quijote",
      montaigne: "Michel de Montaigne",
      francmacon: "Maestro Francmasón",
      dalailama: "Dalái Lama"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Tirada en Cruz"
    },
    misc: {
      loadingModels: "Cargando modelos...",
      crossSpread: "Tirada en Cruz",
      tarotPrompt: "{persona}, ¿qué revela esta tirada {spreadType} sobre mi pregunta: \"{question}\"? Analiza las cartas individualmente y en conjunto, considerando sus posiciones e interacciones. Comparte tu visión única."
    }
  },
  
  // Allemand
  de: {
    // Titre de la page
    pageTitle: "Tarot Kreuzlegung",
    appTitle: "JodoTarot: Künstliche Intelligenz",
    // Éléments de l'en-tête
    header: {
      language: "Sprache:",
      persona: "Charakter:",
      cardSet: "Kartendeck:",
      spreadType: "Legeweise:",
      iaModel: "KI-Modell:",
      question: "Deine Frage:",
      questionPlaceholder: "Gib deine Frage für diese Legung ein...",
      drawButton: "Karten ziehen"
    },
    interpretation: {
      loading: "Analyse der Legung...",
      loadingWithModel: "Analyse der Kreuzlegung mit {model} interpretiert durch einen {persona}...",
      default: "Die Interpretationen erscheinen hier nach dem Kartenziehen.",
      error: "Bei der Interpretation ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      userQuestion: "Die von dem Benutzer gestellte Frage ist:",
      userMessage: "Ich hätte gerne eine detaillierte und personalisierte Interpretation meiner Tarot-Kreuzlegung. Analysieren Sie die Symbolik jeder Karte basierend auf ihrer Position und stellen Sie Verbindungen zwischen den Karten her, um eine kohärente Deutung anzubieten, die genau auf meine Frage eingeht.",
      ollamaPromo: "Laden Sie <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> herunter, um mit <a href='https://ollama.com' target='_blank'>ollama</a> Karten zu ziehen, und laden Sie die Seite neu, um Ihre Modelle zu sehen."
    },
    // Textes pour le tirage de tarot en allemand
    tarotReading: {
      intro: "Hier ist die Kreuzlegung zu interpretieren für die Person, die das Tarot konsultiert:",
      positions: {
        top: "oben (positive/spirituelle/bewusste Einflüsse)",
        left: "links (Vergangenheit/Ursprünge der Situation/Ursachen)",
        center: "in der Mitte (aktuelle Situation/Hauptthema/wesentliche Frage)",
        right: "rechts (Zukunft/wahrscheinliche Entwicklung/Richtung)",
        bottom: "unten (negative Einflüsse/zu überwindende Herausforderungen/Unbewusstes)"
      },
      instructions: {
        top: "Analysiere die spirituellen, mentalen oder bewussten Kräfte, die die Person unterstützen. Erkunde, wie diese Energien als Ressourcen genutzt werden können.",
        left: "Erkunde eingehend, wie vergangene Ereignisse die aktuelle Situation geprägt und zu ihr beigetragen haben. Identifiziere wichtige Muster oder Lektionen.",
        center: "Beschreibe präzise die aktuelle Situation, die zentralen Themen und die dominierenden Energien. Diese Karte repräsentiert den Kern der Frage.",
        right: "Projiziere die wahrscheinliche Entwicklung, wenn die Person dem aktuellen Weg folgt. Biete Ratschläge zur besten Herangehensweise an diese potenzielle Zukunft.",
        bottom: "Identifiziere Hindernisse, Ängste, unbewusste Blockaden, die überwunden werden müssen, und schlage konkrete Wege vor, um sie zu transformieren oder mit ihnen umzugehen."
      },
      conclusion: "Fasse die gesamte Legung zusammen, indem du die dynamischen Wechselwirkungen zwischen den Karten, ihre Symbolik und ihre relative Position berücksichtigst. Schließe mit praktischen Ratschlägen und einer globalen Perspektive, die direkt auf die gestellte Frage eingeht."
    },
    optgroups: {
      divinationArts: "Wahrsagekünste",
      spiritualTraditions: "Spirituelle Traditionen",
      esotericTraditions: "Esoterische Traditionen",
      psychoanalysts: "Psychoanalytiker",
      supernaturalEntities: "Übernatürliche Wesenheiten",
      openai: "OpenAI",
      ollama: "Ollama"
    },
    // Personas - Noms traduits
    personas: {
      tarologue: "Tarotleger",
      oracle: "Mystisches Orakel",
      voyante: "Zigeuner-Wahrsagerin",
      pretre: "Exegetischer Priester",
      rabbin: "Kabbalistischer Rabbiner",
      imam: "Sufi-Imam",
      sorciere: "Ahnenhexe",
      alchimiste: "Esoterischer Alchemist",
      mage: "Elementar-Magier",
      freud: "Sigmund Freud",
      jung: "Carl Gustav Jung",
      lacan: "Jacques Lacan",
      dolto: "Françoise Dolto",
      demon: "Mortrarion",
      noegoman: "No EGO man",
      socrate: "Sokrates",
      salomon: "König Salomon",
      quichotte: "Don Quijote",
      montaigne: "Michel de Montaigne",
      francmacon: "Meister Freimaurer",
      dalailama: "Dalai Lama"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Kreuzlegung"
    },
    misc: {
      loadingModels: "Lade Modelle...",
      crossSpread: "Kreuzlegung",
      tarotPrompt: "{persona}, was offenbart diese {spreadType} über meine Frage: \"{question}\"? Analysiere die Karten einzeln und im Gesamtbild, unter Berücksichtigung ihrer Positionen und Wechselwirkungen. Teile deine einzigartige Perspektive mit."
    }
  },
  
  // Italien
  it: {
    // Titre de la page
    pageTitle: "Stesa di Tarocchi a Croce",
    appTitle: "JodoTarot: L'intelligenza artificiale",
    // Éléments de l'en-tête
    header: {
      language: "Lingua:",
      persona: "Personaggio:",
      cardSet: "Mazzo di carte:",
      spreadType: "Tipo di stesa:",
      iaModel: "Modello IA:",
      question: "La tua domanda:",
      questionPlaceholder: "Inserisci la tua domanda per questa lettura...",
      drawButton: "Pesca le carte"
    },
    interpretation: {
      loading: "Analisi della stesa in corso...",
      loadingWithModel: "Analisi della stesa a croce in corso con {model} interpretato da un(a) {persona}...",
      default: "Le interpretazioni appariranno qui dopo aver pescato le carte.",
      error: "Si è verificato un errore durante l'interpretazione. Per favore riprova.",
      userQuestion: "La domanda posta dall'utente è:",
      userMessage: "Vorrei un'interpretazione dettagliata e personalizzata della mia stesa di tarocchi a croce. Analizza il simbolismo di ogni carta in base alla sua posizione e stabilisci connessioni tra le carte per offrire una lettura coerente che risponda con precisione alla mia domanda.",
      ollamaPromo: "Scarica <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> per iniziare a pescare carte con <a href='https://ollama.com' target='_blank'>ollama</a> e ricarica la pagina per vedere i tuoi modelli."
    },
    // Textes pour le prompt de tirage en italien
    tarotReading: {
      intro: "Ecco la stesa a croce da interpretare per la persona che consulta i tarocchi:",
      positions: {
        top: "in alto (influenze positive/spirituali/coscienti)",
        left: "a sinistra (passato/origini della situazione/cause)",
        center: "al centro (situazione attuale/questione principale/domanda essenziale)",
        right: "a destra (futuro/evoluzione probabile/direzione)",
        bottom: "in basso (influenze negative/sfide da superare/inconscio)"
      },
      instructions: {
        top: "Analizza le forze spirituali, mentali o coscienti che sostengono la persona. Esplora come queste energie possono essere utilizzate come risorse.",
        left: "Esplora in profondità come gli eventi passati hanno plasmato e contribuito alla situazione attuale. Identifica pattern o lezioni importanti.",
        center: "Descrivi precisamente la situazione attuale, le questioni centrali e le energie dominanti. Questa carta rappresenta il cuore della questione.",
        right: "Proietta l'evoluzione probabile se la persona segue il percorso attuale. Offri consigli sul modo migliore di affrontare questo potenziale futuro.",
        bottom: "Identifica gli ostacoli, le paure, i blocchi inconsci da superare e proponi modi concreti per trasformarli o gestirli."
      },
      conclusion: "Sintetizza l'intera stesa tenendo conto delle interazioni dinamiche tra le carte, il loro simbolismo e la loro posizione relativa. Concludi con consigli pratici e una prospettiva globale che risponda direttamente alla domanda posta."
    },
    optgroups: {
      divinationArts: "Arti Divinatorie",
      spiritualTraditions: "Tradizioni Spirituali",
      esotericTraditions: "Tradizioni Esoteriche",
      psychoanalysts: "Psicoanalisti",
      supernaturalEntities: "Entità Soprannaturali",
      openai: "OpenAI",
      ollama: "Ollama"
    },
    // Personas - Noms traduits
    personas: {
      tarologue: "Tarologo",
      oracle: "Oracolo Mistico",
      voyante: "Veggente Gitana",
      pretre: "Sacerdote Esegetico",
      rabbin: "Rabbino Cabalista",
      imam: "Imam Sufi",
      sorciere: "Strega Ancestrale",
      alchimiste: "Alchimista Esoterico",
      mage: "Mago Elementalista",
      freud: "Sigmund Freud",
      jung: "Carl Gustav Jung",
      lacan: "Jacques Lacan",
      dolto: "Françoise Dolto",
      demon: "Mortrarion",
      noegoman: "No EGO man",
      socrate: "Socrate",
      salomon: "Re Salomone",
      quichotte: "Don Chisciotte",
      montaigne: "Michel de Montaigne",
      francmacon: "Maestro Massone",
      dalailama: "Dalai Lama"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Stesa a Croce"
    },
    misc: {
      loadingModels: "Caricamento modelli...",
      crossSpread: "Stesa a Croce",
      tarotPrompt: "{persona}, cosa rivela questa {spreadType} sulla mia domanda: \"{question}\"? Analizza le carte singolarmente e nel loro insieme, considerando le loro posizioni e interazioni. Condividi la tua visione unica."
    }
  }
};

/**
 * Fonction pour obtenir une traduction
 * @param {string} key - Clé de traduction au format "section.sousCle"
 * @param {string} lang - Code de la langue (fr, en, es, de, it)
 * @param {Object} params - Paramètres de remplacement (optionnel)
 * @returns {string} - Le texte traduit
 */
function getTranslation(key, lang = 'fr', params = {}) {
  // Si la langue n'est pas supportée, utiliser le français par défaut
  if (!TRANSLATIONS[lang]) {
    lang = 'fr';
  }
  
  // Diviser la clé en sections (ex: "header.language" -> ["header", "language"])
  const keys = key.split('.');
  
  // Naviguer dans l'objet de traductions pour trouver la valeur
  let translation = TRANSLATIONS[lang];
  for (const k of keys) {
    translation = translation[k];
    // Si la traduction n'existe pas, revenir au français
    if (translation === undefined) {
      translation = TRANSLATIONS['fr'];
      for (const k of keys) {
        translation = translation[k];
        if (translation === undefined) {
          return key; // Clé non trouvée, retourner la clé elle-même
        }
      }
    }
  }
  
  // Remplacer les paramètres {param} par leurs valeurs
  if (params && typeof translation === 'string') {
    return translation.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? params[paramName] : match;
    });
  }
  
  return translation;
}

export {
  TRANSLATIONS,
  getTranslation
}; 