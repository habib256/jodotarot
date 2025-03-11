/**
 * Traductions françaises
 */

const fr = {
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
    drawButton: "Tirer les cartes",
    streamingOption: "Réponse en direct :"
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
      love: "Voici le tirage du Tarot de l'amour à interpréter pour la personne consultant le tarot:",
      celticCross: "Voici le tirage de la Croix Celtique à interpréter pour la personne consultant le tarot:"
    },
    positions: {
      top: "Le haut",
      left: "La gauche",
      center: "Le centre",
      right: "La droite",
      bottom: "Le bas",
      position1: "Position 1: Le passé lointain",
      position2: "Position 2: Le passé récent",
      position3: "Position 3: Le présent",
      position4: "Position 4: Le futur proche",
      position5: "Position 5: Les obstacles potentiels",
      position6: "Position 6: Les influences externes",
      position7: "Position 7: Le résultat final",
      topLeft: "L'état d'esprit",
      topRight: "Les attentes",
      middleLeft: "Le passé amoureux",
      middleCenter: "La relation actuelle", 
      middleRight: "La dynamique future",
      bottomLeft: "Les émotions profondes",
      bottomRight: "Les perspectives à court terme",
      celticPosition1: "Position 1: Situation actuelle/Problème central",
      celticPosition2: "Position 2: Obstacle ou défi immédiat",
      celticPosition3: "Position 3: Passé récent/Ce qui s'en va",
      celticPosition4: "Position 4: Futur proche/Ce qui vient",
      celticPosition5: "Position 5: Influence consciente/Objectifs",
      celticPosition6: "Position 6: Influence inconsciente/Émotions cachées",
      celticPosition7: "Position 7: Votre attitude/Comment vous êtes perçu",
      celticPosition8: "Position 8: Influences extérieures/Environnement",
      celticPosition9: "Position 9: Espérances ou craintes",
      celticPosition10: "Position 10: Résultat final"
    },
    instructions: {
      top: "Analyse les forces spirituelles, mentales ou conscientes qui soutiennent la personne. Explore comment ces énergies peuvent être utilisées comme ressources.",
      left: "Explore en profondeur comment les événements passés ont façonné et contribué à la situation actuelle. Identifie les patterns ou les leçons importantes.",
      center: "Décris précisément la situation actuelle, les enjeux centraux et les énergies dominantes. Cette carte représente le cœur de la question.",
      right: "Projette l'évolution probable si la personne suit le chemin actuel. Offre des conseils sur la meilleure façon d'aborder ce futur potentiel.",
      bottom: "Identifie les obstacles, les peurs, les blocages inconscients à surmonter et propose des moyens concrets de les transformer ou de les gérer.",
      position1: "Révèle les racines profondes de la situation, les événements passés qui ont initié le chemin actuel. Explore l'origine de la question.",
      position2: "Analyse les influences récentes qui ont eu un impact sur la situation, les événements qui ont catalysé le questionnement actuel.",
      position3: "Décris l'état d'esprit actuel, les circonstances présentes et comment la personne perçoit et vit la situation maintenant.",
      position4: "Identifie les forces centrales en jeu, les motivations profondes et les facteurs cruciaux qui influencent l'ensemble de la situation.",
      position5: "Projette les énergies qui se manifestent dans un futur proche, les opportunités ou les obstacles imminents à anticiper.",
      position6: "Révèle les défis spécifiques, les obstacles ou les résistances à surmonter pour progresser vers la résolution souhaitée.",
      position7: "Indique le résultat probable si le chemin actuel est suivi, l'aboutissement potentiel de la situation et les leçons à intégrer.",
      topLeft: "Explore les sentiments profonds de la personne, leurs émotions actuelles et comment elles influencent leur vie amoureuse.",
      topRight: "Révèle les attentes et les espérances de la personne concernant le futur.",
      middleLeft: "Détaille l'histoire d'amour de la personne, ses émotions et les événements qui l'ont marquée.",
      middleCenter: "Explique comment la personne perçoit et vit sa relation actuelle.",
      middleRight: "Prévoie les tendances et les dynamiques futures de la personne.",
      bottomLeft: "Détaille les émotions profondes et les réactions de la personne face à la situation.",
      bottomRight: "Révèle les perspectives à court terme et les préoccupations de la personne concernant le futur.",
      celticPosition1: "Détaille la situation actuelle, les éléments centraux et les enjeux. Cette carte représente le cœur de la question.",
      celticPosition2: "Analyse l'obstacle principal ou le défi auquel la personne est confrontée actuellement.",
      celticPosition3: "Explore les influences passées qui s'éloignent mais qui ont contribué à façonner la situation actuelle.",
      celticPosition4: "Projette les énergies qui arrivent et qui influenceront la situation dans un futur proche.",
      celticPosition5: "Révèle les objectifs conscients, les aspirations et ce que la personne espère accomplir.",
      celticPosition6: "Identifie les influences inconscientes, les peurs cachées ou les motivations profondes qui agissent subtilement.",
      celticPosition7: "Décrit comment la personne se perçoit et est perçue par les autres dans cette situation.",
      celticPosition8: "Analyse l'environnement extérieur, les personnes ou les circonstances qui influencent la situation.",
      celticPosition9: "Explore les espérances secrètes ou les craintes non exprimées concernant la situation.",
      celticPosition10: "Indique le résultat probable si la trajectoire actuelle est maintenue et les leçons à intégrer."
    }
  },
  
  // Textes pour les prompts personnalisés
  tarotPrompt: "{persona}, que révèle ce tirage {spreadType} sur ma question : \"{question}\" ? Analysez les cartes individuellement et dans leur ensemble, en tenant compte de leurs positions et interactions. Partagez votre vision unique.",
  
  // Types de personas
  personaGroups: {
    divinationArts: "🔮 Arts Divinatoires",
    spiritualTraditions: "🕊️ Traditions Spirituelles",
    esotericTraditions: "⚡ Traditions Ésotériques",
    psychoanalysts: "🧠 Psychanalystes",
    philosophersSages: "📚 Philosophes et Sages",
    supernaturalEntities: "👻 Entités Surnaturelles"
  },
  
  // Groupes de modèles d'IA
  iaGroups: {
    ollama: "🧠 Ollama",
    openai: "🤖 OpenAI"
  },
  
  // Noms des personas
  personas: {
    tarologue: "🎴 Tarologue",
    oracle: "🌟 Oracle Mystique",
    voyante: "🔮 Voyante Gitane",
    pretre: "✝️ Prêtre Exégète",
    rabbin: "✡️ Rabbin Kabbaliste",
    imam: "☪️ Imam Soufis",
    dalailama: "☸️ Dalaï-Lama",
    sorciere: "🧙‍♀️ Sorcière Ancestrale",
    alchimiste: "⚗️ Alchimiste Ésotérique",
    mage: "🌌 Mage Élémentaliste",
    francmacon: "🏛️ Maître Franc-Maçon",
    freud: "🛋️ Sigmund Freud",
    jung: "🌓 Carl Gustav Jung",
    lacan: "🪞 Jacques Lacan",
    dolto: "👶 Françoise Dolto",
    socrate: "🏺 Socrate",
    salomon: "👑 Roi Salomon",
    montaigne: "✒️ Michel de Montaigne",
    quichotte: "🗡️ Don Quichotte",
    demon: "😈 Mortrarion",
    noegoman: "🧘 No EGO man"
  },
  
  // Types de tirages
  spreadTypes: {
    cross: "Croix",
    horseshoe: "Fer à Cheval",
    love: "Tarot de l'amour",
    celticCross: "Croix Celtique"
  },
  
  // Divers
  misc: {
    loadingModels: "Chargement des modèles...",
    crossSpread: "Tirage en Croix",
    horseshoeSpread: "Tirage en Fer à Cheval",
    loveSpread: "Tarot de l'Amour",
    celticCross: "Croix Celtique"
  },
  
  // Meta prompt pour l'IA
  metaprompt: {
    base: `Format obligatoire (400-450 mots):
1) Réponse concise et complète en un message
2) Utilise des émojis pertinents pour illustrer les concepts de tarot
3) Formatage HTML uniquement: <h1>/<h2>/<h3> titres, <em>/<strong> importance, <blockquote> citations, <ul>/<li> listes
4) Intègre l'aspect psychologique et symbolique des cartes
5) Fais des connexions entre les cartes qui se complètent ou s'opposent
6) Évite le jargon trop ésotérique pour rester accessible
7) Termine par un conseil pratique et une suggestion d'action
8) PAS DE CODE MARKDOWN (**titre**,# Titre) Pas de passage à la ligne.
9) Exprime toi intégralement en français
10) Tu dois absolument répondre en incarnant le persona choisi, avec son style, son vocabulaire et sa vision du monde spécifiques`,
    
    emphasis: `IMPORTANT: Ta réponse doit être DIRECTEMENT et SPÉCIFIQUEMENT liée à cette question.
Concentre-toi sur ce que la question demande précisément et adapte ton interprétation 
en fonction des éléments mentionnés dans la question. Ne donne pas une réponse générique.
Chaque aspect de ton interprétation doit répondre à un aspect de cette question.`
  }
};

export default fr; 