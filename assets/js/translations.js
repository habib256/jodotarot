/**
 * Fichier de traductions pour l'internationalisation de l'interface
 */

const TRANSLATIONS = {
  // Français (langue par défaut)
  fr: {
    // Titre de la page
    pageTitle: "Tirage de Tarot en Croix",
    appTitle: "JodoTarot:",
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
      apiError: "Erreur de l'API: {0}",
      apiWarning: "L'interprétation s'est terminée de façon inattendue. Voici le résultat partiel:",
      userQuestion: "La question posée par l'utilisateur est:",
      userMessage: "J'aimerais une interprétation détaillée et personnalisée de mon tirage de tarot en croix. Analysez la symbolique de chaque carte en fonction de sa position et établissez les connexions entre les cartes pour offrir une lecture cohérente qui réponde précisément à ma question.",
      ollamaPromo: "Télécharge <a href='https://ollama.com' target='_blank'>ollama</a> avec <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> pour commencer. Recharge la page et réalise ton tirage de cartes",
      streamingResponse: "Génération de la réponse",
      // Messages pour les cartes spécifiques
      loveCardsMeaning: {
        moon_bottomLeft: "\"La lune\" en position des sentiments révèle des émotions profondes, parfois confuses ou ambivalentes. Explorez votre monde intérieur pour mieux comprendre vos désirs véritables.",
        sun_bottomRight: "\"Le soleil\" en position d'avenir proche annonce une période d'épanouissement et de clarté dans votre vie amoureuse. De nouvelles opportunités lumineuses se présentent à vous."
      }
    },
    // Textes pour le prompt de tirage
    tarotReading: {
      intro: {
        cross: "Voici le tirage en croix à interpréter pour la personne consultant le tarot:",
        horseshoe: "Voici le tirage en fer à cheval à interpréter pour la personne consultant le tarot:",
        love: "Voici le tirage du Tarot de l'amour à interpréter pour la personne consultant le tarot:"
      },
      positions: {
        top: "en haut (influences positives/spirituelles/conscientes)",
        left: "à gauche (passé/origines de la situation/causes)",
        center: "au centre (vos désirs)",
        right: "à droite (votre amoureux actuel ou à venir)",
        bottom: "en bas (actions que vous allez ou devriez poser dans votre vie sentimentale)",
        // Positions pour le tirage en fer à cheval
        horseshoe1: "à gauche (passé lointain/fondations)",
        horseshoe2: "deuxième position (passé récent/influences précédentes)",
        horseshoe3: "troisième position (présent/situation actuelle)",
        horseshoe4: "position centrale (facteurs déterminants/enjeux centraux)",
        horseshoe5: "cinquième position (avenir immédiat/prochaines étapes)",
        horseshoe6: "sixième position (obstacles/défis à surmonter)",
        horseshoe7: "à droite (résultat final/conclusion possible)",
        
        // Positions pour le tirage de l'amour
        bottomLeft: "en bas à gauche (vos sentiments)",
        bottomRight: "en bas à droite (votre avenir proche)",
        top: "au sommet (votre perception de la situation)",
        left: "à gauche (le \"pour\" dans la réalisation de vos désirs)",
        right: "à droite (votre amoureux actuel ou à venir)",
        bottom: "en bas (actions que vous allez ou devriez poser dans votre vie sentimentale)"
      },
      instructions: {
        top: "Analyse les forces spirituelles, mentales ou conscientes qui soutiennent la personne. Explore comment ces énergies peuvent être utilisées comme ressources.",
        left: "Explore en profondeur comment les événements passés ont façonné et contribué à la situation actuelle. Identifie les patterns ou les leçons importantes.",
        center: "Décris précisément la situation actuelle, les enjeux centraux et les énergies dominantes. Cette carte représente le cœur de la question.",
        right: "Projette l'évolution probable si la personne suit le chemin actuel. Offre des conseils sur la meilleure façon d'aborder ce futur potentiel.",
        bottom: "Identifie les obstacles, les peurs, les blocages inconscients à surmonter et propose des moyens concrets de les transformer ou de les gérer.",
        // Instructions pour le tirage en fer à cheval
        horseshoe1: "Révèle les racines profondes de la situation, les événements passés qui ont initié le chemin actuel. Explore l'origine de la question.",
        horseshoe2: "Analyse les influences récentes qui ont eu un impact sur la situation, les événements qui ont catalysé le questionnement actuel.",
        horseshoe3: "Décris l'état d'esprit actuel, les circonstances présentes et comment la personne perçoit et vit la situation maintenant.",
        horseshoe4: "Identifie les forces centrales en jeu, les motivations profondes et les facteurs cruciaux qui influencent l'ensemble de la situation.",
        horseshoe5: "Projette les énergies qui se manifestent dans un futur proche, les opportunités ou les obstacles imminents à anticiper.",
        horseshoe6: "Révèle les défis spécifiques, les obstacles ou les résistances à surmonter pour progresser vers la résolution souhaitée.",
        horseshoe7: "Indique le résultat probable si le chemin actuel est suivi, l'aboutissement potentiel de la situation et les leçons à intégrer.",
        
        // Instructions pour le tirage de l'amour
        bottomLeft: "Explore les sentiments profonds de la personne, ses émotions actuelles et comment elles influencent sa vie amoureuse. Décris les courants émotionnels sous-jacents.",
        bottomRight: "Révèle les perspectives amoureuses à court terme, les opportunités ou changements qui se présentent dans un avenir proche. Offre des conseils sur la manière d'aborder ces développements."
      },
      conclusion: "Synthétise l'ensemble du tirage en prenant en compte les interactions dynamiques entre les cartes, leur symbolisme et leur position relative. Conclue avec des conseils pratiques et une perspective globale qui répond directement à la question posée."
    },
    // Groupes d'options dans les menus déroulants
    optgroups: {
      divinationArts: "Arts Divinatoires",
      spiritualTraditions: "Traditions Spirituelles",
      esotericTraditions: "Traditions Ésotériques",
      psychoanalysts: "Psychanalystes",
      philosophers: "Philosophes et Sages",
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
      cross: "Tirage en Croix",
      horseshoe: "Tirage en Fer à Cheval",
      love: "Tarot de l'amour"
    },
    // Messages divers
    misc: {
      loadingModels: "Chargement des modèles...",
      crossSpread: "Tirage en Croix",
      horseshoeSpread: "Tirage en Fer à Cheval",
      loveSpread: "Tarot de l'amour",
      tarotPrompt: "{persona}, que révèle ce tirage {spreadType} sur ma question : \"{question}\" ? Analysez les cartes individuellement puis globalement, en considérant leurs positions et interactions. Partagez votre vision unique."
    }
  },
  
  // Anglais
  en: {
    // Titre de la page
    pageTitle: "Tarot Cross Spread",
    appTitle: "JodoTarot:",
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
      apiError: "API Error: {0}",
      apiWarning: "Interpretation ended unexpectedly. Here is the partial result:",
      userQuestion: "The user's question is:",
      userMessage: "I would like a detailed and personalized interpretation of my tarot cross spread. Analyze the symbolism of each card according to its position and establish connections between the cards to offer a coherent reading that precisely addresses my question.",
      ollamaPromo: "Download <a href='https://ollama.com' target='_blank'>ollama</a> with <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> to get started. Reload the page to see your models.",
      streamingResponse: "Generating response",
      // Messages for specific cards
      loveCardsMeaning: {
        moon_bottomLeft: "\"The Moon\" in the feelings position reveals deep emotions, sometimes confused or ambivalent. Explore your inner world to better understand your true desires.",
        sun_bottomRight: "\"The Sun\" in the near future position announces a period of fulfillment and clarity in your love life. New bright opportunities are presenting themselves to you."
      }
    },
    // Tarot reading prompt texts
    tarotReading: {
      intro: {
        cross: "Here is the cross spread to interpret for the person consulting the tarot:",
        horseshoe: "Here is the horseshoe spread to interpret for the person consulting the tarot:",
        love: "Here is the love tarot spread to interpret for the person consulting the tarot:"
      },
      positions: {
        top: "at the top (positive/spiritual/conscious influences)",
        left: "on the left (past/origins of the situation/causes)",
        center: "at the center (current situation/main issue/essential question)",
        right: "on the right (future/probable evolution/direction)",
        bottom: "at the bottom (negative influences/challenges to overcome/unconscious)",
        // Positions for the horseshoe spread
        horseshoe1: "on the far left (distant past/foundations)",
        horseshoe2: "second position (recent past/previous influences)",
        horseshoe3: "third position (present/current situation)",
        horseshoe4: "center position (determining factors/central issues)",
        horseshoe5: "fifth position (immediate future/next steps)",
        horseshoe6: "sixth position (obstacles/challenges to overcome)",
        horseshoe7: "on the far right (final outcome/possible conclusion)",
        
        // Positions for the love tarot spread
        bottomLeft: "bottom left (your feelings)",
        bottomRight: "bottom right (your near future)",
        top: "at the top (your perception of the situation)",
        left: "on the left (favorable elements for your desires)",
        right: "on the right (your current or future lover)"
      },
      instructions: {
        top: "Analyze the spiritual, mental or conscious forces supporting the person. Explore how these energies can be used as resources.",
        left: "Explore in depth how past events have shaped and contributed to the current situation. Identify important patterns or lessons.",
        center: "Describe precisely the current situation, central issues and dominant energies. This card represents the heart of the question.",
        right: "Project the likely evolution if the person follows the current path. Offer advice on the best way to approach this potential future.",
        bottom: "Identify obstacles, fears, unconscious blocks to overcome and suggest concrete ways to transform or manage them.",
        // Instructions for the horseshoe spread
        horseshoe1: "Reveal the deep roots of the situation, past events that initiated the current path. Explore the origin of the question.",
        horseshoe2: "Analyze recent influences that have impacted the situation, events that have catalyzed the current questioning.",
        horseshoe3: "Describe the current state of mind, present circumstances and how the person perceives and experiences the situation now.",
        horseshoe4: "Identify the central forces at play, deep motivations and crucial factors influencing the whole situation.",
        horseshoe5: "Projette the energies manifesting in the near future, opportunities or imminent obstacles to anticipate.",
        horseshoe6: "Reveal specific challenges, obstacles or resistances to overcome in order to progress toward the desired resolution.",
        horseshoe7: "Indicate the probable outcome if the current path is followed, potential resolution of the situation and lessons to integrate.",
        
        // Instructions for the love tarot spread
        bottomLeft: "Explore the deep feelings of the person, their current emotions and how they influence their love life. Describe the underlying emotional currents.",
        bottomRight: "Reveal the short-term love perspectives, opportunities or changes that are present in a near future. Offer advice on how to approach these developments."
      },
      conclusion: "Synthesize the entire spread by taking into account the dynamic interactions between the cards, their symbolism and their relative position. Conclude with practical advice and a global perspective that directly addresses the question asked."
    },
    // Groupes d'options dans les menus déroulants
    optgroups: {
      divinationArts: "Divination Arts",
      spiritualTraditions: "Spiritual Traditions",
      esotericTraditions: "Esoteric Traditions",
      psychoanalysts: "Psychoanalysts",
      philosophers: "Philosophers and Sages",
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
      cross: "Cross Spread",
      horseshoe: "Horseshoe Spread",
      love: "Love Tarot"
    },
    misc: {
      loadingModels: "Loading models...",
      crossSpread: "Cross Spread",
      horseshoeSpread: "Horseshoe Spread",
      loveSpread: "Love Tarot",
      tarotPrompt: "{persona}, what does this {spreadType} reveal about my question: \"{question}\"? Analyze the cards individually and as a whole, considering their positions and interactions. Share your unique insight."
    }
  },
  
  // Espagnol
  es: {
    // Titre de la page
    pageTitle: "Tirada de Tarot en Cruz",
    appTitle: "JodoTarot:",
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
      default: "Las interpretaciones aparecerán aquí después de tirar las cartas.",
      error: "Ocurrió un error durante la interpretación. Por favor, inténtelo de nuevo.",
      apiError: "Error de la API: {0}",
      apiWarning: "La interpretación terminó inesperadamente. Aquí está el resultado parcial:",
      userQuestion: "La pregunta del usuario es:",
      userMessage: "Me gustaría una interpretación detallada y personalizada de mi tirada de tarot en cruz. Analice el simbolismo de cada carta según su posición y establezca conexiones entre las cartas para ofrecer una lectura coherente que responda con precisión a mi pregunta.",
      ollamaPromo: "Descarga <a href='https://ollama.com' target='_blank'>ollama</a> con <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> para comenzar. Recarga la página para ver tus modelos.",
      streamingResponse: "Generando respuesta",
      // Messages for specific cards
      loveCardsMeaning: {
        moon_bottomLeft: "\"La Luna\" en la posición de los sentimientos revela emociones profundas, a veces confusas o ambivalentes. Explora tu mundo interior para comprender mejor tus verdaderos deseos.",
        sun_bottomRight: "\"El Sol\" en la posición de futuro cercano anuncia un período de plenitud y claridad en tu vida amorosa. Nuevas oportunidades brillantes se presentan ante ti."
      }
    },
    // Textes pour le tirage de tarot en espagnol
    tarotReading: {
      intro: {
        cross: "Aquí está la tirada en cruz para interpretar para la persona que consulta el tarot:",
        horseshoe: "Aquí está la tirada en herradura para interpretar para la persona que consulta el tarot:",
        love: "Aquí está la tirada del Tarot del Amor para interpretar para la persona que consulta el tarot:"
      },
      positions: {
        top: "en la parte superior (influencias positivas/espirituales/conscientes)",
        left: "a la izquierda (pasado/orígenes de la situación/causas)",
        center: "en el centro (situación actual/tema principal/pregunta esencial)",
        right: "a la derecha (futuro/evolución probable/dirección)",
        bottom: "en la parte inferior (influencias negativas/desafíos a superar/inconsciente)",
        // Posiciones para la tirada en herradura
        horseshoe1: "en el extremo izquierdo (pasado distante/fundamentos)",
        horseshoe2: "segunda posición (pasado reciente/influencias previas)",
        horseshoe3: "tercera posición (presente/situación actual)",
        horseshoe4: "posición central (factores determinantes/temas centrales)",
        horseshoe5: "quinta posición (futuro inmediato/próximos pasos)",
        horseshoe6: "sexta posición (obstáculos/desafíos a superar)",
        horseshoe7: "en el extremo derecho (resultado final/conclusión posible)",
        
        // Posiciones para el amor tarot
        bottomLeft: "en la parte inferior izquierda (tus sentimientos)",
        bottomRight: "en la parte inferior derecha (tu futuro cercano)",
        top: "en la parte superior (tu percepción de la situación)",
        left: "a la izquierda (elementos favorevoli for tus deseos)",
        right: "a la derecha (tu amante actual o futuro)"
      },
      instructions: {
        top: "Analiza las fuerzas espirituales, mentales o conscientes que apoyan a la persona. Explora cómo estas energías pueden utilizarse como recursos.",
        left: "Explora en profundidad cómo los eventos pasados han moldeado y contribuido a la situación actual. Identifica patrones o lecciones importantes.",
        center: "Describe precisamente la situación actual, los temas centrales y las energías dominantes. Esta carta representa el corazón de la cuestión.",
        right: "Proyecta la evolución probable si la persona sigue el camino actual. Ofrece consejos sobre la mejor manera de abordar este futuro potencial.",
        bottom: "Identifica los obstáculos, miedos, bloqueos inconscientes a superar y sugiere formas concretas de transformarlos o gestionarlos.",
        // Instrucciones para la tirada en herradura
        horseshoe1: "Revela las raíces profundas de la situación, eventos pasados que iniciaron el camino actual. Explora el origen de la cuestión.",
        horseshoe2: "Analiza las influenzes recientes que han impactado en la situación, eventos que han catalizado el cuestionamiento actual.",
        horseshoe3: "Describe el estado de ánimo actual, las circunstancias presentes y cómo la persona percibe y experimenta la situación ahora.",
        horseshoe4: "Identifica las fuerzas centrales en juego, motivaciones profundas y factores cruciales que influyen en toda la situación.",
        horseshoe5: "Proyecta las energías que se manifiestan en un futuro cercano, oportunidades o obstáculos inminentes a anticipar.",
        horseshoe6: "Revela desafíos específicos, obstáculos o resistencias da superar para progredir hacia la resolución deseada.",
        horseshoe7: "Indica el resultado probable si se sigue el camino actual, la resolución potencial de la situación y las lecciones a integrar.",
        
        // Instructions for the love tarot spread
        bottomLeft: "Explora los sentimientos profundos de la persona, sus emociones actuales y cómo influyen en su vida amorosa. Describe las corrientes emozionales subyacentes.",
        bottomRight: "Rivela las prospettive amorose a breve termine, les opportunités ou changements qui se présentent dans un avenir proche. Ofre des conseils sur la manière d'aborder ces développements."
      },
      conclusion: "Sintetiza toda la tirada teniendo en cuenta las interacciones dinámicas entre las cartas, su simbolismo y su posición relativa. Concluye con consejos prácticos y una perspectiva global que responda directamente a la pregunta planteada."
    },
    optgroups: {
      divinationArts: "Artes Adivinatorias",
      spiritualTraditions: "Tradiciones Espirituales",
      esotericTraditions: "Tradiciones Esotéricas",
      psychoanalysts: "Psicoanalistas",
      philosophers: "Filósofos y Sabios",
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
      cross: "Tirada en Cruz",
      horseshoe: "Tirada en Herradura",
      love: "Tarot del Amor"
    },
    misc: {
      loadingModels: "Cargando modelos...",
      crossSpread: "Tirada en Cruz",
      horseshoeSpread: "Tirada en Herradura",
      loveSpread: "Tarot del Amor",
      tarotPrompt: "{persona}, ¿qué revela esta tirada {spreadType} sobre mi pregunta: \"{question}\"? Analice las cartas individualmente y en conjunto, considerando sus posiciones e interacciones. Comparta su visión única."
    }
  },
  
  // Allemand
  de: {
    // Titre de la page
    pageTitle: "Tarot Kreuzlegung",
    appTitle: "JodoTarot:",
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
      apiError: "API-Fehler: {0}",
      apiWarning: "Die Interpretation endete unerwartet. Hier ist das teilweise Ergebnis:",
      userQuestion: "Die von dem Benutzer gestellte Frage ist:",
      userMessage: "Ich hätte gerne eine detaillierte und personalisierte Interpretation meiner Tarot-Kreuzlegung. Analysieren Sie die Symbolik jeder Karte basierend auf ihrer Position und stellen Sie Verbindungen zwischen den Karten her, um eine kohärente Deutung anzubieten, die genau auf meine Frage eingeht.",
      ollamaPromo: "Laden Sie <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> herunter, um mit <a href='https://ollama.com' target='_blank'>ollama</a> Karten zu ziehen, und laden Sie die Seite neu, um Ihre Modelle zu sehen.",
      streamingResponse: "Antwort wird generiert",
      // Messages for specific cards
      loveCardsMeaning: {
        moon_bottomLeft: "\"Der Mond\" in der Gefühlsposition offenbart tiefe Emotionen, manchmal verwirrend oder ambivalent. Erkunde deine innere Welt, um deine wahren Wünsche besser zu verstehen.",
        sun_bottomRight: "\"Die Sonne\" in der Position der nahen Zukunft kündigt eine Zeit der Erfüllung und Klarheit in deinem Liebesleben an. Neue strahlende Möglichkeiten bieten sich dir."
      }
    },
    // Textes pour le tirage de tarot en allemand
    tarotReading: {
      intro: {
        cross: "Hier ist die Kreuzlegung zu interpretieren für die Person, die das Tarot konsultiert:",
        horseshoe: "Hier ist die Hufeisenlegung zu interpretieren für die Person, die das Tarot konsultiert:",
        love: "Hier ist die Liebetarot-Legung zu interpretieren für die Person, die das Tarot konsultiert:"
      },
      positions: {
        top: "oben (positive/spirituelle/bewusste Einflüsse)",
        left: "links (Vergangenheit/Ursprünge der Situation/Ursachen)",
        center: "in der Mitte (aktuelle Situation/Hauptthema/wesentliche Frage)",
        right: "rechts (Zukunft/wahrscheinliche Entwicklung/Richtung)",
        bottom: "unten (negative Einflüsse/zu überwindende Herausforderungen/Unbewusstes)",
        // Positionen für die Hufeisenlegung
        horseshoe1: "ganz links (ferne Vergangenheit/Grundlagen)",
        horseshoe2: "zweite Position (jüngste Vergangenheit/vorherige Einflüsse)",
        horseshoe3: "dritte Position (Gegenwart/aktuelle Situation)",
        horseshoe4: "mittlere Position (bestimmende Faktoren/zentrale Themen)",
        horseshoe5: "fünfte Position (unmittelbare Zukunft/nächste Schritte)",
        horseshoe6: "sechste Position (Hindernisse/zu überwindende Herausforderungen)",
        horseshoe7: "ganz rechts (endgültiges Ergebnis/mögliche Schlussfolgerung)",
        
        // Positionen für die Liebestarot-Legung
        bottomLeft: "unten links (deine Gefühle)",
        bottomRight: "unten rechts (deine nahe Zukunft)",
        top: "oben (deine Wahrnehmung der Situation)",
        left: "links (günstige Elemente für deine Wünsche)",
        right: "rechts (dein aktueller oder zukünftiger Liebhaber)",
        
        // Positions for the love tarot spread
        bottomLeft: "en la parte inferior izquierda (tus sentimientos)",
        bottomRight: "en la parte inferior derecha (tu futuro cercano)",
        top: "en la parte superior (tu percepción de la situación)",
        left: "a la izquierda (elementos favorables para tus deseos)",
        right: "a la derecha (tu amante actual o futuro)"
      },
      instructions: {
        top: "Analysiere die spirituellen, mentalen oder bewussten Kräfte, die die Person unterstützen. Erkunde, wie diese Energien als Ressourcen genutzt werden können.",
        left: "Erkunde eingehend, wie vergangene Ereignisse die aktuelle Situation geprägt und zu ihr beigetragen haben. Identifiziere wichtige Muster oder Lektionen.",
        center: "Beschreibe präzise die aktuelle Situation, die zentralen Themen und die dominierenden Energien. Diese Karte repräsentiert den Kern der Frage.",
        right: "Projiziere die wahrscheinliche Entwicklung, wenn die Person dem aktuellen Weg folgt. Offer advice on the best way to approach this potential future.",
        bottom: "Identifiziere Hindernisse, Ängste, unbewusste Blockaden, die überwunden werden müssen, und schlage konkrete Wege vor, um sie zu transformieren oder mit ihnen umzugehen.",
        // Anweisungen für die Hufeisenlegung
        horseshoe1: "Decke die tiefen Wurzeln der Situation auf, vergangene Ereignisse, die den aktuellen Weg eingeleitet haben. Erforsche den Ursprung der Frage.",
        horseshoe2: "Analysiere jüngste Einflüsse, die sich auf die Situation ausgewirkt haben, Ereignisse, die das aktuelle Hinterfragen katalysiert haben.",
        horseshoe3: "Beschreibe die aktuelle Gemütsverfassung, die gegenwärtigen Umstände und wie die Person die Situation jetzt wahrnimmt und erlebt.",
        horseshoe4: "Identifiziere die zentralen wirkenden Kräfte, tiefe Motivationen und entscheidende Faktoren, die die gesamte Situation beeinflussen.",
        horseshoe5: "Projiziere die Energien, die sich in naher Zukunft manifestieren, Chancen oder bevorstehende Hindernisse, die es zu antizipieren gilt.",
        horseshoe6: "Enthülle spezifische Herausforderungen, Hindernisse oder Widerstände, die überwunden werden müssen, um zur gewünschten Lösung zu gelangen.",
        horseshoe7: "Zeige das wahrscheinliche Ergebnis auf, wenn der aktuelle Weg befolgt wird, die potenzielle Auflösung der Situation und die zu integrierenden Lektionen."
      },
      conclusion: "Fasse die gesamte Legung zusammen, indem du die dynamischen Wechselwirkungen zwischen den Karten, ihre Symbolik und ihre relative Position berücksichtigst. Schließe mit praktischen Ratschlägen und einer globalen Perspektive, die direkt auf die gestellte Frage eingeht."
    },
    optgroups: {
      divinationArts: "Wahrsagekünste",
      spiritualTraditions: "Spirituelle Traditionen",
      esotericTraditions: "Esoterische Traditionen",
      psychoanalysts: "Psychoanalytiker",
      philosophers: "Philosophen und Weise",
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
      cross: "Kreuzlegung",
      horseshoe: "Hufeisenlegung",
      love: "Liebestarot"
    },
    misc: {
      loadingModels: "Modelle werden geladen...",
      crossSpread: "Kreuzlegung",
      horseshoeSpread: "Hufeisenlegung",
      loveSpread: "Liebestarot",
      tarotPrompt: "{persona}, was offenbart diese {spreadType} über meine Frage: \"{question}\"? Analysieren Sie die Karten einzeln und als Ganzes, unter Berücksichtigung ihrer Positionen und Wechselwirkungen. Teilen Sie Ihre einzigartige Einsicht mit."
    }
  },
  
  // Italien
  it: {
    // Titre de la page
    pageTitle: "Stesa di Tarocchi a Croce",
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
      drawButton: "Pesca le carte"
    },
    interpretation: {
      loading: "Analisi della stesa in corso...",
      loadingWithModel: "Analisi della stesa a croce in corso con {model} interpretato da un(a) {persona}...",
      default: "Le interpretazioni appariranno qui dopo aver tirato le carte.",
      error: "Si è verificato un errore durante l'interpretazione. Si prega di riprovare.",
      apiError: "Errore API: {0}",
      apiWarning: "La interpretazione è terminata inaspettatamente. Ecco il risultato parziale:",
      userQuestion: "La domanda posta dall'utente è:",
      userMessage: "Vorrei un'interpretazione dettagliata e personalizzata della mia stesa di tarocchi a croce. Analizza il simbolismo di ogni carta in base alla sua posizione e stabilisci connessioni tra le carte per offrire una lettura coerente che risponda con precisione alla mia domanda.",
      ollamaPromo: "Scarica <a href='https://ollama.com' target='_blank'>ollama</a> con <a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a> per iniziare. Ricarica la pagina per vedere i tuoi modelli.",
      streamingResponse: "Generazione della risposta",
      // Messages for specific cards
      loveCardsMeaning: {
        moon_bottomLeft: "\"La Luna\" nella posizione dei sentimenti rivela emozioni profonde, a volte confuse o ambivalenti. Esplora il tuo mondo interiore per comprendere meglio i tuoi veri desideri.",
        sun_bottomRight: "\"Il Sole\" nella posizione del futuro vicino annuncia un periodo di realizzazione e chiarezza nella tua vita amorosa. Nuove opportunità luminose si presentano a te."
      }
    },
    // Textes pour le prompt de tirage en italien
    tarotReading: {
      intro: {
        cross: "Ecco la stesa a croce da interpretare per la persona che consulta i tarocchi:",
        horseshoe: "Ecco la stesa a ferro di cavallo da interpretare per la persona che consulta i tarocchi:",
        love: "Ecco la stesa del Tarot dell'amore da interpretare per la persona che consulta i tarocchi:"
      },
      positions: {
        top: "in alto (influenze positive/spirituali/coscienti)",
        left: "a sinistra (passato/origini della situazione/cause)",
        center: "al centro (vos désirs)",
        right: "a destra (votre amoureux actuel ou à venir)",
        bottom: "in basso (actions que vous allez ou devriez poser dans votre vie sentimentale)",
        // Posizioni per la stesa a ferro di cavallo
        horseshoe1: "all'estrema sinistra (passato lontano/fondamenta)",
        horseshoe2: "seconda posizione (passato recente/influenze precedenti)",
        horseshoe3: "terza posizione (presente/situazione attuale)",
        horseshoe4: "posizione centrale (fattori determinanti/questioni centrali)",
        horseshoe5: "quinta posizione (futuro immediato/prossimi passi)",
        horseshoe6: "sesta posizione (ostacoli/sfide da superare)",
        horseshoe7: "all'estrema destra (risultato finale/possibile conclusione)",
        
        // Posizioni per i tarocchi dell'amore
        bottomLeft: "in basso a sinistra (i tuoi sentimenti)",
        bottomRight: "in basso a destra (il tuo futuro immediato)",
        top: "in alto (la tua percezione della situazione)",
        left: "a sinistra (elementi favorevoli per i tuoi desideri)",
        right: "a destra (il tuo amante attuale o futuro)"
      },
      instructions: {
        top: "Analizza le forze spirituali, mentali o coscienti che sostengono la persona. Esplora come queste energie possono essere utilizzate come risorse.",
        left: "Esplora in profondità come gli eventi passati hanno plasmato e contribuito alla situazione attuale. Identifica pattern o lezioni importanti.",
        center: "Descrivi precisamente la situazione attuale, le questioni centrali e le energie dominanti. Questa carta rappresenta il cuore della questione.",
        right: "Proietta l'evoluzione probabile se la persona segue il percorso attuale. Offri consigli sul modo migliore di affrontare questo potenziale futuro.",
        bottom: "Identifica gli ostacoli, le paure, i blocchi inconsci da superare e proponi modi concreti per trasformarli o gestirli.",
        // Istruzioni per la stesa a ferro di cavallo
        horseshoe1: "Rivela le radici profonde della situazione, gli eventi passati che hanno iniziato il percorso attuale. Esplora l'origine della questione.",
        horseshoe2: "Analizza le influenze recenti che hanno avuto un impatto sulla situazione, gli eventi che hanno catalizzato il questionamento attuale.",
        horseshoe3: "Descrivi lo stato d'animo attuale, le circostanze presenti e come la persona percepisce e vive la situazione ora.",
        horseshoe4: "Identifica le forze centrali in gioco, le motivazioni profonde e i fattori cruciali che influenzano l'intera situazione.",
        horseshoe5: "Proietta le energie che si manifestano nel futuro prossimo, le opportunità o gli ostacoli imminenti da anticipare.",
        horseshoe6: "Rivela le sfide specifiche, gli ostacoli o le resistenze da superare per progredire verso la risoluzione desiderata.",
        horseshoe7: "Indica il risultato probabile se viene seguito il percorso attuale, la possibile risoluzione della situazione e le lezioni da integrare.",
        
        // Instructions for the love tarot spread
        bottomLeft: "Esplora i sentimenti profondi della persona, le sue emozioni attuali e come influenzano la sua vita amorosa. Descrivi le correnti emozionali sottostanti.",
        bottomRight: "Rivela le prospettive amorose a breve termine, le opportunità o i cambiamenti che si presentano in un futuro prossimo. Offri consigli su come affrontare questi sviluppi."
      },
      conclusion: "Sintetizza l'intera stesa tenendo conto delle interazioni dinamiche tra le carte, il loro simbolismo e la loro posizione relativa. Concludi con consigli pratici e una prospettiva globale che risponda direttamente alla domanda posta."
    },
    optgroups: {
      divinationArts: "Arti Divinatorie",
      spiritualTraditions: "Tradizioni Spirituali",
      esotericTraditions: "Tradizioni Esoteriche",
      psychoanalysts: "Psicoanalisti",
      philosophers: "Filosofi e Saggi",
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
      cross: "Stesa a Croce",
      horseshoe: "Stesa a Ferro di Cavallo",
      love: "Tarot dell'amore"
    },
    misc: {
      loadingModels: "Caricamento modelli...",
      crossSpread: "Stesa a Croce",
      horseshoeSpread: "Stesa a Ferro di Cavallo",
      loveSpread: "Tarot dell'amore",
      tarotPrompt: "{persona}, cosa rivela questa {spreadType} sulla mia domanda: \"{question}\"? Analizza le carte individualmente e nel loro insieme, considerando le loro posizioni e interazioni. Condividi la tua visione unica."
    }
  },
  
  // Chinois
  zh: {
    // Titre de la page
    pageTitle: "塔罗十字牌阵",
    appTitle: "神秘塔罗:",
    // Éléments de l'en-tête
    header: {
      language: "语言:",
      persona: "角色:",
      cardSet: "牌组:",
      spreadType: "牌阵类型:",
      iaModel: "人工智能模型:",
      question: "您的问题:",
      questionPlaceholder: "请输入您想为此牌阵解答的问题...",
      drawButton: "抽牌"
    },
    interpretation: {
      loading: "正在分析牌阵...",
      loadingWithModel: "正在使用{model}由{persona}解读十字牌阵...",
      default: "抽牌后解读将显示在这里。",
      error: "解读过程中出现错误。请重试。",
      apiError: "API错误: {0}",
      apiWarning: "解读意外结束。这里是部分结果:",
      userQuestion: "用户提出的问题是:",
      userMessage: "我想要一个详细且个性化的十字塔罗牌阵解读。请根据每张牌的位置分析其象征意义，并建立牌与牌之间的联系，以提供准确回应我问题的连贯解读。",
      ollamaPromo: "下载<a href='https://ollama.com/library/llama3.2' target='_blank'>llama3.2:3b</a>开始使用<a href='https://ollama.com' target='_blank'>ollama</a>抽牌，并重新加载页面查看您的模型。",
      streamingResponse: "正在生成回应",
      // Messages for specific cards
      loveCardsMeaning: {
        moon_bottomLeft: "\"月亮\"在感情位置揭示了深层情感，有时混乱或矛盾。探索你的内心世界，以更好地理解你真正的渴望。",
        sun_bottomRight: "\"太阳\"在近期未来位置预示着你爱情生活中的一段充实和明晰时期。新的光明机会正呈现在你面前。"
      }
    },
    // 塔罗解读提示文本
    tarotReading: {
      intro: {
        cross: "以下是为咨询者解读的十字牌阵:",
        horseshoe: "以下是为咨询者解读的马蹄形牌阵:",
        love: "以下是为咨询者解读的塔罗爱情牌阵:"
      },
      positions: {
        top: "在顶部（您对情况的看法）",
        left: "在左侧（实现愿望的有利因素）",
        center: "在中心（您的愿望）",
        right: "在右侧（您现在或未来的爱人）",
        bottom: "在底部（您在情感生活中应采取的行动）",
        // 马蹄形牌阵的位置
        horseshoe1: "在最左侧（远古过去/基础）",
        horseshoe2: "第二个位置（近期过去/先前的影响）",
        horseshoe3: "第三个位置（现在/当前情况）",
        horseshoe4: "中心位置（决定性因素/核心问题）",
        horseshoe5: "第五个位置（即将到来的未来/下一步）",
        horseshoe6: "第六个位置（障碍/需要克服的挑战）",
        horseshoe7: "在最右侧（最终结果/可能的结论）",
        
        // 爱情塔罗牌阵的位置
        bottomLeft: "左下方（您的感受）",
        bottomRight: "右下方（您的近期未来）",
        top: "顶部（您的观点）",
        left: "左侧（实现愿望的有利因素）",
        right: "右侧（您现在的爱人或未来爱人）"
      },
      instructions: {
        top: "分析支持此人的精神、心理或意识力量。探索如何将这些能量用作资源。",
        left: "深入探索过去事件如何塑造并促成当前情况。识别重要的模式或教训。",
        center: "准确描述当前情况、核心问题和主导能量。这张牌代表问题的核心。",
        right: "如果此人沿着当前路径前进，预测可能的发展。提供关于如何最好地应对这个潜在未来的建议。",
        bottom: "识别需要克服的障碍、恐惧、潜意识阻碍，并提出具体的转化或管理方法。",
        // 马蹄形牌阵的指导
        horseshoe1: "揭示情况的深层根源，启动当前路径的过去事件。探索问题的起源。",
        horseshoe2: "分析最近影响当前情况的因素，催化当前疑问的事件。",
        horseshoe3: "描述当前心态，目前环境以及此人如何感知和体验当前情况。",
        horseshoe4: "识别核心作用力，深层动机和影响整体情况的关键因素。",
        horseshoe5: "预测近期未来出现的能量，需要预见的即将到来的机会或障碍。",
        horseshoe6: "揭示特定挑战、障碍或阻力，这些需要克服才能朝着期望的解决方向前进。",
        horseshoe7: "指出如果继续当前路径的可能结果，情况的潜在解决方案和需要整合的教训。",
        
        // Instructions for the love tarot spread
        bottomLeft: "探索此人的深层感受，当前情绪以及它们如何影响爱情生活。描述潜在的情感暗流。",
        bottomRight: "揭示短期爱情前景，即将出现的机会或变化。提供关于如何应对这些发展的建议。"
      },
      conclusion: "综合整个牌阵，考虑牌之间的动态互动，它们的象征意义和相对位置。以实用建议和直接回应所提问题的全局视角结束。"
    },
    // 下拉菜单中的选项组
    optgroups: {
      divinationArts: "占卜艺术",
      spiritualTraditions: "精神传统",
      esotericTraditions: "密传传统",
      psychoanalysts: "精神分析学家",
      philosophers: "哲学家和智者",
      supernaturalEntities: "超自然实体",
      openai: "OpenAI",
      ollama: "Ollama"
    },
    // 角色 - 翻译名称
    personas: {
      tarologue: "塔罗占卜师",
      oracle: "神秘预言者",
      voyante: "吉普赛占卜师",
      pretre: "解经牧师",
      rabbin: "卡巴拉犹太教士",
      imam: "苏菲伊玛目",
      sorciere: "祖传女巫",
      alchimiste: "密传炼金术士",
      mage: "元素法师",
      freud: "西格蒙德·弗洛伊德",
      jung: "卡尔·古斯塔夫·荣格",
      lacan: "雅克·拉康",
      dolto: "弗朗索瓦兹·多尔托",
      demon: "莫特拉里恩",
      noegoman: "无我人",
      socrate: "苏格拉底",
      salomon: "所罗门王",
      quichotte: "堂吉诃德",
      montaigne: "米歇尔·德·蒙田",
      francmacon: "共济会大师",
      dalailama: "达赖喇嘛"
    },
    // 牌阵类型 - 翻译名称
    spreadTypes: {
      cross: "十字牌阵",
      horseshoe: "马蹄形牌阵",
      love: "爱情塔罗"
    },
    misc: {
      loadingModels: "正在加载模型...",
      crossSpread: "十字牌阵",
      horseshoeSpread: "马蹄形牌阵",
      loveSpread: "爱情塔罗",
      tarotPrompt: "{persona}，这个{spreadType}关于我的问题：\"{question}\"揭示了什么？请逐个分析牌并考虑其整体，考虑它们的位置和相互作用。分享您独特的见解。"
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
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      // Si la traduction n'existe pas dans la langue courante, essayer le français
      const frenchTranslation = getFrenchTranslation(key);
      return frenchTranslation !== undefined ? frenchTranslation : key;
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

/**
 * Fonction auxiliaire pour obtenir une traduction en français
 * @param {string} key - La clé de traduction
 * @returns {string|undefined} - La traduction ou undefined si non trouvée
 */
function getFrenchTranslation(key) {
  const keys = key.split('.');
  let translation = TRANSLATIONS['fr'];
  
  for (const k of keys) {
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      return undefined;
    }
  }
  
  return translation;
}

export {
  TRANSLATIONS,
  getTranslation
}; 