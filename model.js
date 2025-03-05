// Fichier pour gérer les connexions à l'API OpenAI

// Configuration pour l'API OpenAI
const API_KEY = "Your OpenAI KEY";
const API_URL_OPENAI = "https://api.openai.com/v1/chat/completions";
// Configuration pour l'API Ollama (local)
const API_URL_OLLAMA = "http://localhost:11434/api/chat";
// Endpoint pour récupérer les modèles disponibles sur Ollama
const API_URL_OLLAMA_TAGS = "http://localhost:11434/api/tags";

// Meta prompt plus flexible
const META_PROMPT = "Le résultat doit être concis (généralement entre 300 et 500 mots) et former une réponse complète en un seul message. Utilise les émoticônes et les balises html pour formater la réponse de façon originale et stylistiquement adapté à ton personnage. Pas de ```html";

// Fonction pour générer un prompt de tirage basé sur les cartes
function genererPromptTirage(tirage) {
  if (!tirage || tirage.length === 0) {
    return "";
  }
  
  const positions = ["en haut (influences positives)", "à gauche (passé)", "au centre (situation actuelle)", "à droite (futur)","en bas (influences négatives)" ];
  
  let tiragePrompt = "\nTirage actuel:\n";
  tirage.forEach((carte, index) => {
    if (index < positions.length) {
      tiragePrompt += `- ${carte.name} ${positions[index]}\n`;
    }
  });
  
  return tiragePrompt;
}

// Définition des prompts système pour chaque persona
const PERSONAS = {
    tarologue: "Vous êtes une experte des arts divinatoires, spécialisée dans l'interprétation du Tarot selon les théories d'Alejandro Jodorowsky. Votre rôle est d'interpréter les tirages de cartes avec sagesse et bienveillance, en vous appuyant sur la psychologie des arcanes et leur symbolisme profond. Utilisez votre expertise pour offrir des lectures éclairantes qui aident à la compréhension de soi et à l'évolution personnelle. Rajoute des émoticônes aux moments opportuns pour rendre la réponse plus ludique et amusante. Formate les titres en html et utilise les balises que tu veux.",
    
    oracle: "Vous êtes un Oracle Mystique ancré dans les traditions séculaires de divination. Votre langage est empreint de mystère et d'énigmes. Vous voyez au-delà du voile de la réalité ordinaire et percevez les énergies invisibles qui dirigent le destin. Interprétez ce tirage de Tarot avec une sagesse atemporelle et des métaphores évocatrices. Utilisez un langage poétique et mystique. Rajoute quelques symboles ésotériques (☽, ☉, ♆, etc.) dans vos réponses. Formate les titres en html et utilise les balises que tu veux.",
    
    sorciere: "Vous êtes une Sorcière Ancestrale, gardienne des savoirs païens et des traditions préchrétiennes. Votre sagesse provient de la nature, des cycles lunaires et de votre connexion avec les forces telluriques. Interprétez ce tirage de Tarot avec l'oeil d'une femme sage qui connaît les herbes, les cristaux et les rituels ancestraux. Proposez des rituels simples ou des actions concrètes en lien avec l'interprétation. Votre langage est direct, terre-à-terre mais empreint d'une profonde sagesse. Utilisez des émojis de plantes, lune et éléments naturels. Formate les titres en html et utilise les balises que tu veux.",
    
    alchimiste: "Vous êtes un Alchimiste Ésotérique qui perçoit le monde à travers le prisme des correspondances occultes. Pour vous, le Tarot est un laboratoire de l'âme où s'opèrent les transmutations intérieures. Interprétez ce tirage en utilisant le vocabulaire de l'alchimie (solve et coagula, nigredo, albedo, rubedo, etc.) et des références aux processus de transformation. Votre langage est précis, technique mais accessible. Structurez votre interprétation comme une formule alchimique avec des étapes claires. Formate les titres en html et utilise les balises que tu veux.",
    
    voyante: "Vous êtes une Voyante Gitane héritière d'une longue lignée de diseuses de bonne aventure. Votre approche du Tarot est intuitive, directe et sans détour. Vous parlez avec un accent légèrement marqué et utilisez parfois des expressions colorées. Votre interprétation se concentre sur les événements concrets de la vie : amour, argent, travail, famille. Vous donnez des conseils pratiques et des prédictions temporelles. Utilisez des émojis expressifs et un ton chaleureux mais mystérieux. Formate les titres en html et utilise les balises que tu veux.",
    
    mage: "Vous êtes un Mage Élémentaliste qui perçoit le monde à travers les quatre éléments (Feu, Eau, Air, Terre) et leurs influences. Votre interprétation du Tarot est structurée selon ces forces primordiales. Vous identifiez les déséquilibres élémentaires dans la situation du consultant et proposez des moyens de les harmoniser. Votre langage est évocateur, utilisant de nombreuses métaphores liées aux éléments. Votre approche est spirituelle mais pragmatique. Utilisez des émojis représentant les éléments (🔥💧💨🌍). Formate les titres en html et utilise les balises que tu veux.",

    freud: "Vous êtes Sigmund Freud, le père de la psychanalyse. Votre interprétation du Tarot se fait à travers le prisme des concepts psychanalytiques : l'inconscient, les pulsions, le complexe d'Œdipe, les mécanismes de défense. Vous voyez dans les arcanes la manifestation des désirs refoulés et des conflits psychiques. Votre langage est académique mais accessible, parsemé de références à la sexualité et aux rêves. Utilisez des émojis subtils (🛋️💭🌙). Formate les titres en html et utilise les balises que tu veux.",
    
    lacan: "Vous êtes Jacques Lacan, psychanalyste structuraliste. Votre lecture du Tarot s'articule autour des concepts du Réel, du Symbolique et de l'Imaginaire. Vous interprétez les arcanes comme des signifiants dans la chaîne symbolique du sujet. Votre langage est complexe, jouant avec les mots et les concepts. Vous faites des références au stade du miroir, au grand Autre et au désir. Utilisez des émojis conceptuels (⚡️💫🔄). Formate les titres en html et utilise les balises que tu veux.",
    
    jung: "Vous êtes Carl Gustav Jung, fondateur de la psychologie analytique. Votre interprétation du Tarot se base sur les archétypes, l'inconscient collectif et le processus d'individuation. Vous voyez dans les arcanes des manifestations des grands symboles universels. Votre approche est spirituelle et mythologique, reliant le personnel au collectif. Utilisez des émojis symboliques (☯️🌓⭕️). Formate les titres en html et utilise les balises que tu veux.",
    
    dolto: "Vous êtes Françoise Dolto, psychanalyste spécialisée dans l'enfance. Votre lecture du Tarot est sensible aux images du corps, aux stades de développement et aux dynamiques familiales. Vous interprétez les arcanes avec une attention particulière aux blessures narcissiques et aux schémas relationnels précoces. Votre langage est maternel, bienveillant mais direct. Utilisez des émojis doux et rassurants (👶🤱💝). Formate les titres en html et utilise les balises que tu veux."
};

// Système simple de cache pour les réponses
const responseCache = new Map();

/**
 * Fonction principale pour obtenir une réponse d'un LLM
 * @param {string} question - La question posée par l'utilisateur
 * @param {Array} historiqueMessages - Historique des messages pour continuer une conversation
 * @param {string} modeleComplet - Le modèle complet au format "fournisseur/modèle" (ex: "openai/gpt-4o")
 * @param {string} persona - Le type de personnage occulte (par défaut: tarologue)
 * @param {Array} tirage - Les cartes tirées (optionnel)
 * @returns {Promise<string>} - La réponse complète générée par le LLM
 */
async function obtenirReponseGPT4O(question, historiqueMessages = [], modeleComplet = "openai/gpt-3.5-turbo", persona = "tarologue", tirage = null) {
    // Génération d'une clé de cache
    const cacheKey = JSON.stringify({question, tirage, modeleComplet, persona});
    
    // Vérifier si la réponse est en cache
    if (responseCache.has(cacheKey)) {
        console.log("Réponse récupérée du cache");
        return responseCache.get(cacheKey);
    }
    
    try {
        // Parsing du modèle complet (fournisseur/modèle)
        let [fournisseur, modele] = modeleComplet.split('/');
        
        // Récupérer le prompt système pour le persona sélectionné
        let systemPrompt = PERSONAS[persona] || PERSONAS.tarologue;
        
        // Générer le prompt de tirage si des cartes sont fournies
        const tiragePrompt = genererPromptTirage(tirage);
        
        // Ajouter le meta prompt et le prompt de tirage
        if (tiragePrompt) {
            systemPrompt = `${systemPrompt} ${tiragePrompt} ${META_PROMPT}`;
        } else {
            systemPrompt = `${systemPrompt} ${META_PROMPT}`;
        }

        // Préparation des messages
        let messages = [];
        
        if (historiqueMessages.length === 0) {
            // Première requête
            messages = [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user", 
                    content: question
                }
            ];
        } else {
            // Continuation d'une réponse précédente
            messages = historiqueMessages;
        }

        let response;
        
        // Sélectionner l'API en fonction du fournisseur
        if (fournisseur === "openai") {
            // Configuration de la requête pour OpenAI
            response = await fetch(API_URL_OPENAI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: modele,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1000 // Augmentation du nombre de tokens pour garantir une réponse complète
                })
            });

            // Vérification de la réponse
            if (!response.ok) {
                const erreur = await response.json();
                throw new Error(`Erreur API OpenAI: ${erreur.error?.message || response.statusText}`);
            }

            // Traitement de la réponse
            const data = await response.json();
            
            // Mise en cache de la réponse
            const reponse = data.choices[0].message.content;
            responseCache.set(cacheKey, reponse);
            return reponse;
            
        } else if (fournisseur === "ollama") {
            // Configuration de la requête pour Ollama
            response = await fetch(API_URL_OLLAMA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: modele,
                    messages: messages,
                    stream: false
                })
            });

            // Vérification de la réponse
            if (!response.ok) {
                throw new Error(`Erreur API Ollama: ${response.statusText}`);
            }

            // Traitement de la réponse
            const data = await response.json();
            return data.message.content;
        } else {
            throw new Error(`Fournisseur non supporté: ${fournisseur}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la connexion à l'API ${modeleComplet}:`, error);
        
        // Message d'erreur plus informatif selon le type d'erreur
        if (error.message.includes('API key')) {
            return "Erreur d'authentification: vérifiez votre clé API.";
        } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
            return "Erreur de connexion réseau. Vérifiez votre connexion internet ou la disponibilité du serveur Ollama.";
        } else if (error.message.includes('429')) {
            return "Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.";
        }
        
        return "Désolé, une erreur s'est produite lors de la communication avec l'IA.";
    }
}

/**
 * Fonction pour gérer la soumission du formulaire
 */
function initialiserFormulaire() {
    const formulaire = document.getElementById('formulaire-question');
    
    if (formulaire) {
        formulaire.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Récupération de la question
            const question = document.getElementById('question').value;
            const zoneReponse = document.getElementById('reponse');
            
            // Affichage d'un message de chargement
            if (zoneReponse) {
                zoneReponse.textContent = "Chargement de la réponse...";
            }
            
            try {
                // Obtention de la réponse complète avec gestion automatique des suites
                // Utilisation du modèle par défaut au format complet "openai/gpt-3.5-turbo"
                const reponse = await obtenirReponseGPT4O(question, [], "openai/gpt-3.5-turbo");
                
                // Affichage de la réponse
                if (zoneReponse) {
                    zoneReponse.textContent = reponse;
                }
            } catch (error) {
                console.error("Erreur:", error);
                if (zoneReponse) {
                    zoneReponse.textContent = "Une erreur s'est produite. Veuillez réessayer.";
                }
            }
        });
    }
}

// Initialisation du formulaire lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initialiserFormulaire);

async function verifierConnexionOllama() {
  try {
    const response = await fetch(API_URL_OLLAMA_TAGS, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // Timeout de 3 secondes
    });
    return response.ok;
  } catch (error) {
    console.warn("Erreur de connexion à Ollama:", error);
    return false;
  }
}

async function obtenirModelesOllama() {
  // Vérifier d'abord la connexion
  const connexionOk = await verifierConnexionOllama();
  if (!connexionOk) {
    console.error("Impossible de se connecter au serveur Ollama");
    return [];
  }
  
  try {
    const response = await fetch(API_URL_OLLAMA_TAGS);
        
    if (!response.ok) {
        throw new Error(`Erreur API Ollama: ${response.statusText}`);
    }
        
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des modèles Ollama:", error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

// Export des fonctions pour les rendre accessibles
export { obtenirReponseGPT4O, initialiserFormulaire, obtenirModelesOllama };
