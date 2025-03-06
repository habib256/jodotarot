/**
 * Module de gestion des appels API aux modèles d'IA
 */

import { API_KEY, API_URL_OPENAI, API_URL_OLLAMA, API_URL_OLLAMA_TAGS, META_PROMPT } from './config.js';
import { genererPromptTirage } from './tarot.js';
import PERSONAS from './personas.js';

// Système simple de cache pour les réponses
const responseCache = new Map();

/**
 * Fonction pour enrichir le prompt système avec le contexte spécifique à la question
 * @param {string} question - La question posée par l'utilisateur
 * @param {string} systemPrompt - Le prompt système de base
 * @returns {string} - Le prompt système enrichi
 */
function enrichirPromptContextuel(question, systemPrompt) {
  // Analyse simple de la question pour adapter le prompt
  const questionLower = question.toLowerCase();
  
  // Détection de thèmes spécifiques pour adapter la réponse
  if (questionLower.includes('amour') || questionLower.includes('relation') || questionLower.includes('couple')) {
    systemPrompt += "\nLa question semble porter sur des relations amoureuses ou sentimentales. Concentre-toi particulièrement sur cet aspect dans ton interprétation.";
  } else if (questionLower.includes('travail') || questionLower.includes('carrière') || questionLower.includes('emploi') || questionLower.includes('job')) {
    systemPrompt += "\nLa question porte sur la carrière professionnelle. Oriente ton interprétation vers cet aspect de la vie.";
  } else if (questionLower.includes('argent') || questionLower.includes('finance') || questionLower.includes('économie')) {
    systemPrompt += "\nLa question concerne les finances ou l'argent. Focalise ton interprétation sur cet aspect.";
  } else if (questionLower.includes('santé') || questionLower.includes('maladie') || questionLower.includes('guérison')) {
    systemPrompt += "\nLa question est liée à la santé. Dirige ton interprétation vers cet aspect, tout en rappelant que tu ne remplaces pas un avis médical professionnel.";
  } else if (questionLower.includes('décision') || questionLower.includes('choix') || questionLower.includes('dilemme')) {
    systemPrompt += "\nLa personne semble face à un choix important. Propose des éclairages sur les différentes options sans décider à sa place.";
  }

  return systemPrompt;
}

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
    
    // Enrichir le prompt avec le contexte de la question
    systemPrompt = enrichirPromptContextuel(question, systemPrompt);
    
    // Ajouter le meta prompt et le prompt de tirage
    if (tiragePrompt) {
      systemPrompt = `${systemPrompt} ${tiragePrompt} ${META_PROMPT}`;
    } else {
      systemPrompt = `${systemPrompt} ${META_PROMPT}`;
    }
    
    // Log pour le développement (à retirer en production)
    console.log("Prompt système utilisé:", systemPrompt);

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

// Exporter les fonctions
export {
  obtenirReponseGPT4O,
  obtenirModelesOllama,
  verifierConnexionOllama,
  enrichirPromptContextuel
};