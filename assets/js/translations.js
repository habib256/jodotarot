/**
 * Fichier de traductions pour l'internationalisation de l'interface
 */

const TRANSLATIONS = {
  // Français (langue par défaut)
  fr: {
    // Titre de la page
    pageTitle: "Tirage de Tarot en Croix",
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
      userMessage: "J'aimerais une interprétation détaillée de mon tirage de tarot en lien avec ma question."
    },
    // Textes pour le prompt de tirage
    tarotReading: {
      intro: "Voici le tirage en croix à interpréter:",
      positions: {
        top: "en haut (influences positives/spirituelles)",
        left: "à gauche (passé/origines de la situation)",
        center: "au centre (situation actuelle/enjeu principal)",
        right: "à droite (futur/évolution probable)",
        bottom: "en bas (influences négatives/défis à surmonter)"
      },
      instructions: {
        top: "Analyse les forces spirituelles ou mentales qui soutiennent la personne.",
        left: "Explore comment les événements passés ont contribué à la situation actuelle.",
        center: "Décris précisément la situation actuelle et les enjeux centraux.",
        right: "Projette l'évolution probable si la personne suit le chemin actuel.",
        bottom: "Identifie les obstacles à surmonter et propose des moyens de les gérer."
      },
      conclusion: "Prends en compte l'interaction entre les cartes et leur position relative dans ton interprétation globale."
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
      montaigne: "Michel de Montaigne"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Tirage en Croix"
    },
    // Messages divers
    misc: {
      loadingModels: "Chargement des modèles...",
      crossSpread: "Tirage en Croix",
      tarotPrompt: "Interprétez ce tirage de tarot {spreadType} en relation avec ma question: \"{question}\""
    }
  },
  
  // Anglais
  en: {
    // Titre de la page
    pageTitle: "Tarot Cross Spread",
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
      userMessage: "I would like a detailed interpretation of my tarot spread in relation to my question."
    },
    // Tarot reading prompt texts
    tarotReading: {
      intro: "Here is the cross spread to interpret:",
      positions: {
        top: "at the top (positive/spiritual influences)",
        left: "on the left (past/origins of the situation)",
        center: "at the center (current situation/main issue)",
        right: "on the right (future/probable evolution)",
        bottom: "at the bottom (negative influences/challenges to overcome)"
      },
      instructions: {
        top: "Analyze the spiritual or mental forces supporting the person.",
        left: "Explore how past events have contributed to the current situation.",
        center: "Describe precisely the current situation and central issues.",
        right: "Project the likely evolution if the person follows the current path.",
        bottom: "Identify the obstacles to overcome and suggest ways to manage them."
      },
      conclusion: "Take into account the interaction between the cards and their relative position in your overall interpretation."
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
      montaigne: "Michel de Montaigne"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Cross Spread"
    },
    misc: {
      loadingModels: "Loading models...",
      crossSpread: "Cross Spread",
      tarotPrompt: "Interpret this {spreadType} tarot reading in relation to my question: \"{question}\""
    }
  },
  
  // Espagnol
  es: {
    // Titre de la page
    pageTitle: "Tirada de Tarot en Cruz",
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
      userMessage: "Me gustaría una interpretación detallada de mi tirada de tarot en relación con mi pregunta."
    },
    // Textes pour le tirage de tarot en espagnol
    tarotReading: {
      intro: "Aquí está la tirada en cruz para interpretar:",
      positions: {
        top: "en la parte superior (influencias positivas/espirituales)",
        left: "a la izquierda (pasado/orígenes de la situación)",
        center: "en el centro (situación actual/tema principal)",
        right: "a la derecha (futuro/evolución probable)",
        bottom: "en la parte inferior (influencias negativas/desafíos a superar)"
      },
      instructions: {
        top: "Analiza las fuerzas espirituales o mentales que apoyan a la persona.",
        left: "Explora cómo los eventos pasados han contribuido a la situación actual.",
        center: "Describe con precisión la situacion actual y los temas centrales.",
        right: "Proyecta la evolución probable si la persona sigue el camino actual.",
        bottom: "Identifica los obstáculos a superar y sugiere formas de gestionarlos."
      },
      conclusion: "Ten en cuenta la interacción entre las cartas y su posición relativa en tu interpretación general."
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
      montaigne: "Michel de Montaigne"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Tirada en Cruz"
    },
    misc: {
      loadingModels: "Cargando modelos...",
      crossSpread: "Tirada en Cruz",
      tarotPrompt: "Interpreta esta tirada de tarot {spreadType} en relación con mi pregunta: \"{question}\""
    }
  },
  
  // Allemand
  de: {
    // Titre de la page
    pageTitle: "Tarot Kreuzlegung",
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
      userMessage: "Ich hätte gerne eine detaillierte Interpretation meiner Tarot-Legung in Bezug auf meine Frage."
    },
    // Textes pour le tirage de tarot en allemand
    tarotReading: {
      intro: "Hier ist die Kreuzlegung zu interpretieren:",
      positions: {
        top: "oben (positive/spirituelle Einflüsse)",
        left: "links (Vergangenheit/Ursprünge der Situation)",
        center: "in der Mitte (aktuelle Situation/Hauptthema)",
        right: "rechts (Zukunft/wahrscheinliche Entwicklung)",
        bottom: "unten (negative Einflüsse/zu überwindende Herausforderungen)"
      },
      instructions: {
        top: "Analysiere die spirituellen oder mentalen Kräfte, die die Person unterstützen.",
        left: "Erkunde, wie vergangene Ereignisse zur aktuellen Situation beigetragen haben.",
        center: "Beschreibe präzise die aktuelle Situation und die zentralen Themen.",
        right: "Projiziere die wahrscheinliche Entwicklung, wenn die Person dem aktuellen Weg folgt.",
        bottom: "Identifiziere die zu überwindenden Hindernisse und schlage Wege vor, um mit ihnen umzugehen."
      },
      conclusion: "Berücksichtige die Wechselwirkung zwischen den Karten und ihre relative Position in deiner Gesamtinterpretation."
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
      montaigne: "Michel de Montaigne"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Kreuzlegung"
    },
    misc: {
      loadingModels: "Lade Modelle...",
      crossSpread: "Kreuzlegung",
      tarotPrompt: "Interpretiere diese {spreadType} Tarot-Legung in Bezug auf meine Frage: \"{question}\""
    }
  },
  
  // Italien
  it: {
    // Titre de la page
    pageTitle: "Stesa di Tarocchi a Croce",
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
      userMessage: "Vorrei un'interpretazione dettagliata della mia stesa di tarocchi in relazione alla mia domanda."
    },
    // Textes pour le prompt de tirage en italien
    tarotReading: {
      intro: "Ecco la stesa a croce da interpretare:",
      positions: {
        top: "in alto (influenze positive/spirituali)",
        left: "a sinistra (passato/origini della situazione)",
        center: "al centro (situazione attuale/questione principale)",
        right: "a destra (futuro/evoluzione probabile)",
        bottom: "in basso (influenze negative/sfide da superare)"
      },
      instructions: {
        top: "Analizza le forze spirituali o mentali che sostengono la persona.",
        left: "Esplora come gli eventi passati hanno contribuito alla situazione attuale.",
        center: "Descrivi precisamente la situazione attuale e le questioni centrali.",
        right: "Proietta l'evoluzione probabile se la persona segue il percorso attuale.",
        bottom: "Identifica gli ostacoli da superare e proponi modi per gestirli."
      },
      conclusion: "Tieni conto dell'interazione tra le carte e la loro posizione relativa nella tua interpretazione globale."
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
      montaigne: "Michel de Montaigne"
    },
    // Types de tirage - Noms traduits
    spreadTypes: {
      cross: "Stesa a Croce"
    },
    misc: {
      loadingModels: "Caricamento modelli...",
      crossSpread: "Stesa a Croce",
      tarotPrompt: "Interpreta questa lettura dei tarocchi {spreadType} in relazione alla mia domanda: \"{question}\""
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