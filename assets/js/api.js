/**
 * Module de gestion des appels API aux modèles d'IA
 */

import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, getMetaPrompt } from './config.js';
import { genererPromptTirage } from './tarot.js';
import PERSONAS, { getPersonaPrompt } from './personas/index.js';
import { getTranslation } from './translations.js';

// Système simple de cache pour les réponses
const responseCache = new Map();

// Créer un fichier de configuration centrale
const SETTINGS = {
  DEFAULT_PERSONA: "tarologue",
  DEFAULT_LANGUAGE: "fr",
  MAX_TOKENS: 500,
  // etc.
};

/**
 * Fonction pour enrichir le prompt système avec le contexte spécifique à la question
 * @param {string} question - La question posée par l'utilisateur
 * @param {string} systemPrompt - Le prompt système de base
 * @param {string} langue - La langue à utiliser (fr par défaut)
 * @returns {string} - Le prompt système enrichi avec la question
 */
function enrichirPromptContextuel(question, systemPrompt, langue = 'fr') {
  // Ajouter la question de l'utilisateur au prompt système
  if (question && question.trim()) {
    // Obtenir la traduction de l'introduction à la question
    const questionIntro = getTranslation('interpretation.userQuestion', langue);
    
    // Textes d'emphase traduits pour chaque langue
    const emphaseTextes = {
      fr: `IMPORTANT: Ta réponse doit être DIRECTEMENT et SPÉCIFIQUEMENT liée à cette question.
Concentre-toi sur ce que la question demande précisément et adapte ton interprétation 
en fonction des éléments mentionnés dans la question. Ne donne pas une réponse générique.
Chaque aspect de ton interprétation doit répondre à un aspect de cette question.`,
      
      en: `IMPORTANT: Your answer must be DIRECTLY and SPECIFICALLY related to this question.
Focus on what the question precisely asks and adapt your interpretation
based on the elements mentioned in the question. Do not give a generic answer.
Each aspect of your interpretation must address an aspect of this question.`,
      
      es: `IMPORTANTE: Tu respuesta debe estar DIRECTA y ESPECÍFICAMENTE relacionada con esta pregunta.
Concéntrate en lo que la pregunta pide con precisión y adapta tu interpretación
según los elementos mencionados en la pregunta. No des una respuesta genérica.
Cada aspecto de tu interpretación debe responder a un aspecto de esta pregunta.`,
      
      de: `WICHTIG: Deine Antwort muss DIREKT und SPEZIFISCH mit dieser Frage zusammenhängen.
Konzentriere dich darauf, was die Frage genau fragt, und passe deine Interpretation
an die in der Frage genannten Elemente an. Gib keine allgemeine Antwort.
Jeder Aspekt deiner Interpretation muss auf einen Aspekt dieser Frage eingehen.`,
      
      it: `IMPORTANTE: La tua risposta deve essere DIRETTAMENTE e SPECIFICAMENTE legata a questa domanda.
Concentrati su ciò che la domanda chiede precisamente e adatta la tua interpretazione
in base agli elementi menzionati nella domanda. Non dare una risposta generica.
Ogni aspetto della tua interpretazione deve rispondere a un aspetto di questa domanda.`
    };
    
    // Sélectionner le texte d'emphase dans la langue appropriée ou utiliser le français par défaut
    const emphaseTexte = emphaseTextes[langue] || emphaseTextes.fr;
    
    // Mettre beaucoup plus d'emphase sur la question pour améliorer sa prise en compte
    const emphaseQuestion = `

====================
${questionIntro}:
"${question.trim()}"
====================

${emphaseTexte}
`;
    
    // Ajouter le prompt d'emphase sur la question au début du prompt système
    return `${emphaseQuestion}\n\n${systemPrompt}`;
  }
  
  // Retourner le prompt système original si pas de question
  return systemPrompt;
}

/**
 * Fonction pour obtenir une réponse du modèle GPT-4 Omni
 * @param {string} question - La question à poser au modèle
 * @param {Array} historiqueMessages - Messages d'historique optionnels
 * @param {string} modeleComplet - Le modèle complet au format "fournisseur/modèle" (ex: "openai/gpt-4o")
 * @param {string} persona - Le type de personnage occulte (par défaut: tarologue)
 * @param {Array} tirage - Les cartes tirées (optionnel)
 * @param {string} langue - La langue à utiliser pour la réponse (par défaut: fr)
 * @returns {Promise<string>} - La réponse complète générée par le LLM
 */
async function obtenirReponseGPT4O(question, historiqueMessages = [], modeleComplet = "openai/gpt-3.5-turbo", persona = "tarologue", tirage = null, langue = "fr") {
  // Génération d'une clé de cache
  const cacheKey = JSON.stringify({question, tirage, modeleComplet, persona, langue});
  
  // Vérifier si la réponse est en cache
  if (responseCache.has(cacheKey)) {
    console.log("Réponse récupérée du cache");
    return responseCache.get(cacheKey);
  }
  
  try {
    // Parsing du modèle complet (fournisseur/modèle)
    let [fournisseur, modele] = modeleComplet.split('/');
    
    // Si le fournisseur est non spécifié, on considère que c'est OpenAI
    if (!modele) {
      modele = fournisseur;
      fournisseur = "openai";
    }
    
    // Utilisation de getPersonaPrompt pour obtenir le prompt dans la langue demandée
    let systemPrompt = getPersonaPrompt(persona, langue);
    
    // Si le persona n'existe pas, utiliser le tarologue comme fallback
    if (!systemPrompt) {
      console.error(`Persona "${persona}" non trouvé, utilisation du persona par défaut.`);
      systemPrompt = getPersonaPrompt("tarologue", langue);
    }
    
    // Préparer le prompt spécifique au tirage si des cartes sont fournies
    let tiragePrompt = null;
    if (tirage && tirage.length) {
      tiragePrompt = genererPromptTirage(tirage, langue);
    }
    
    // Réorganiser l'ordre des prompts pour augmenter l'impact de la question
    // 1. D'abord le prompt du persona (déjà dans systemPrompt)
    // 2. Ensuite le prompt du tirage si présent
    // 3. Ajouter le meta prompt avant d'enrichir avec la question
    // 4. Finalement, ajouter la question avec emphase (c'est le dernier élément vu par l'IA)
    
    if (tiragePrompt) {
      systemPrompt = `${systemPrompt} ${tiragePrompt}`;
    }
    
    // Ajouter le meta prompt avant d'enrichir avec la question
    systemPrompt = `${systemPrompt} ${getMetaPrompt(langue)}`;
    
    // Enrichir le prompt avec le contexte de la question en dernier
    systemPrompt = enrichirPromptContextuel(question, systemPrompt, langue);
    
    // Ajoutez une vérification avant d'utiliser le prompt
    if (systemPrompt) {
      // Log du prompt système juste avant l'envoi
      logPrompt(persona, question, systemPrompt);
      
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
            content: getTranslation('interpretation.userMessage', langue)
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
            stream: false,
            temperature: 0.7
          })
        });

        // Vérification de la réponse
        if (!response.ok) {
          throw new Error(`Erreur API Ollama: ${response.statusText}`);
        }

        // Traitement de la réponse
        const data = await response.json();
        
        // Mise en cache de la réponse
        const reponse = data.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
        responseCache.set(cacheKey, reponse);
        return reponse;
      } else {
        throw new Error(`Fournisseur non supporté: ${fournisseur}`);
      }
    } else {
      console.error("Erreur: Prompt système non défini");
      return `Une erreur est survenue lors de la communication avec le modèle: Prompt système non défini`;
    }
  } catch (error) {
    console.error("Erreur lors de l'obtention de la réponse:", error);
    return `Une erreur est survenue lors de la communication avec le modèle: ${error.message}`;
  }
}

/**
 * Fonction pour récupérer les modèles disponibles sur Ollama
 * @returns {Promise<Array>} - Liste des modèles disponibles
 */
async function obtenirModelesOllama() {
  try {
    // Vérifier d'abord si Ollama est accessible
    const ollamaConnected = await verifierConnexionOllama();
    
    if (!ollamaConnected) {
      console.warn("Ollama n'est pas accessible");
      return [];
    }
    
    // Récupérer la liste des modèles
    const response = await fetch(API_URL_OLLAMA_TAGS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des modèles: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Retourner la liste des modèles
    return data.models || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des modèles Ollama:", error);
    return [];
  }
}

/**
 * Fonction pour vérifier si Ollama est accessible
 * @returns {Promise<boolean>} - true si Ollama est accessible, false sinon
 */
async function verifierConnexionOllama() {
  try {
    const response = await fetch(API_URL_OLLAMA_TAGS, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(2000) // Timeout après 2 secondes
    });
    
    return response.ok;
  } catch (error) {
    console.warn("Ollama n'est pas accessible:", error);
    return false;
  }
}

// Améliorer les logs
function logPrompt(persona, question, systemPrompt) {
  console.group("Génération de réponse");
  console.log("Persona:", persona);
  console.log("Question:", question);
  console.log("Prompt système:", systemPrompt);
  console.groupEnd();
}

// Exporter les fonctions
export {
  obtenirReponseGPT4O,
  obtenirModelesOllama,
  verifierConnexionOllama,
  enrichirPromptContextuel,
  logPrompt
};