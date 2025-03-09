/**
 * Point d'entrée principal de l'application Jodotarot
 */

import { drawCards, cardsData } from './tarot.js';
import { obtenirReponseGPT4O, obtenirModelesOllama, testOllamaConnectivity } from './api.js';
import { 
  initSpread, 
  afficherTirage, 
  afficherTirageHorseshoe,
  afficherTirageLove,
  mettreAJourAffichageCartes, 
  updatePersonaLogo, 
  getPersonaLabel,
  updateUILanguage,
  updateAppTitle,
  resetAllDisplays
} from './ui.js';

// Import des fonctions de traduction
import { getTranslation } from './translations.js';

// Variables pour stocker le tirage actuel
let tirageActuel = [];
let questionActuelle = "";

// Rendre la fonction toggleEnlarge disponible globalement
window.toggleEnlarge = function(img, event) {
  console.log("toggleEnlarge appelé avec", img);
  
  // Empêcher la propagation du clic pour éviter les déclenchements multiples
  if (event) {
    event.stopPropagation();
  }
  
  // Une variable pour suivre si l'image cliquée était déjà agrandie
  const wasEnlarged = img.classList.contains('enlarged');
  
  // 1. Nettoyage complet : supprimer tous les états précédents
  
  // Supprimer les anciens conteneurs d'agrandissement
  const existingContainer = document.getElementById('enlarge-container');
  if (existingContainer) {
    existingContainer.remove();
  }
  
  // Supprimer les anciens écouteurs d'événements (précaution)
  window.removeEventListener('resize', window.currentAdjustFunction);
  
  // Réinitialiser toutes les images
  document.querySelectorAll('.card.enlarged').forEach(card => {
    card.classList.remove('enlarged');
  });
  
  // Réactiver le défilement par défaut
  document.body.style.overflow = '';
  
  // 2. Si l'image était déjà agrandie, on s'arrête ici (fermeture)
  if (wasEnlarged) {
    console.log("Fermeture de la carte agrandie");
    return;
  }
  
  // 3. Création d'une nouvelle carte agrandie
  console.log("Création d'une nouvelle carte agrandie");
  
  // Permettre le défilement avec la molette tout en gardant l'overlay en place
  // Au lieu de bloquer complètement le défilement (overflow: hidden)
  // on garde le défilement actif (overflow: auto)
  // document.body.style.overflow = 'hidden';
  
  // Marquer l'image comme agrandie
  img.classList.add('enlarged');
  
  // Créer un nouveau conteneur pour l'overlay
  const enlargeContainer = document.createElement('div');
  enlargeContainer.id = 'enlarge-container';
  enlargeContainer.style.position = 'fixed';
  enlargeContainer.style.top = '2.5%'; // Ajusté pour centrer verticalement avec la nouvelle hauteur de 95%
  enlargeContainer.style.left = '15px'; // Positionnement à exactement 15px du bord gauche
  enlargeContainer.style.width = '30%'; // Définir une largeur pour l'overlay
  enlargeContainer.style.height = '95%'; // 95% de la hauteur de la page
  enlargeContainer.style.zIndex = '99999';
  enlargeContainer.style.pointerEvents = 'none';
  
  // Créer une image agrandie
  const imgClone = new Image();
  
  // Configurer l'image AVANT de définir sa source
  imgClone.style.position = 'fixed';
  imgClone.style.top = '50%';
  imgClone.style.left = '325px'; // Ajusté pour tenir compte du décalage de 15px (15px + 310px qui est la moitié de 620px)
  imgClone.style.transform = 'translate(-50%, -50%)'; // Garde le centre de l'image aligné
  imgClone.style.width = '620px'; // Largeur fixe de 620px
  imgClone.style.height = 'auto'; // Hauteur proportionnelle pour préserver le ratio
  imgClone.style.maxHeight = '100vh'; // Utilise toute la hauteur de l'écran

  imgClone.style.objectFit = 'contain';
  imgClone.style.padding = '10px';
  imgClone.style.boxSizing = 'border-box';
  imgClone.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  imgClone.style.borderRadius = '10px';
  imgClone.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
  imgClone.style.pointerEvents = 'auto';
  imgClone.style.cursor = 'pointer';
  imgClone.style.transition = 'none !important';
  imgClone.style.animation = 'none !important';
  imgClone.style.willChange = 'auto';
  
  // Fonction pour fermer la carte agrandie
  const closeEnlargedCard = function() {
    console.log("Fermeture via closeEnlargedCard");
    
    // Nettoyer l'état des cartes
    document.querySelectorAll('.card.enlarged').forEach(card => {
      card.classList.remove('enlarged');
    });
    
    // Supprimer l'overlay
    const container = document.getElementById('enlarge-container');
    if (container) {
      container.remove();
    }
    
    // Réactiver le défilement
    document.body.style.overflow = '';
    
    // Supprimer l'écouteur d'événement
    document.body.removeEventListener('click', bodyClickHandler);
  };
  
  // Gestionnaire de clic sur l'image agrandie
  imgClone.addEventListener('click', function(e) {
    e.stopPropagation();
    closeEnlargedCard();
  });
  
  // Gestionnaire de clic sur le body
  const bodyClickHandler = function(e) {
    const container = document.getElementById('enlarge-container');
    const enlargedImg = container ? container.querySelector('img') : null;
    
    if (enlargedImg && !enlargedImg.contains(e.target)) {
      closeEnlargedCard();
    }
  };
  
  // Ajouter les éléments au DOM
  document.body.appendChild(enlargeContainer);
  enlargeContainer.appendChild(imgClone);
  
  // Forcer un reflow
  void enlargeContainer.offsetWidth;
  
  // Définir la source de l'image
  imgClone.src = img.src;
  imgClone.alt = img.alt;
  imgClone.className = 'enlarged-card';
  
  // Ajouter l'écouteur de clic sur le body
  document.body.addEventListener('click', bodyClickHandler);
};

/**
 * Fonction pour effectuer un tirage de cartes
 */
function faireUnTirage() {
  // Récupérer la question
  const question = document.getElementById('question').value.trim();
  
  // Vérifier si une question a été posée
  if (!question) {
    alert("Veuillez entrer une question avant de tirer les cartes.");
    return;
  }
  
  // Mémoriser la question
  questionActuelle = question;
  
  // Récupérer le jeu de cartes et le mode de tirage sélectionnés
  const jeuSelectionne = document.getElementById('card-set').value;
  const modeTirage = document.getElementById('spread-type').value;
  
  // Effectuer le tirage avec le mode sélectionné
  tirageActuel = drawCards(jeuSelectionne, modeTirage);
  
  // Afficher les cartes selon le mode de tirage
  if (modeTirage === 'horseshoe') {
    // Cacher les autres tirages et afficher le tirage en fer à cheval
    document.getElementById('spread').style.display = 'none';
    document.getElementById('love-spread').style.display = 'none';
    document.getElementById('horseshoe-spread').style.display = 'grid';
    
    // Afficher les cartes dans le fer à cheval
    afficherTirageHorseshoe(tirageActuel);
  } else if (modeTirage === 'love') {
    // Cacher les autres tirages et afficher le tirage de l'amour
    document.getElementById('spread').style.display = 'none';
    document.getElementById('horseshoe-spread').style.display = 'none';
    document.getElementById('love-spread').style.display = 'grid';
    
    // Afficher les cartes dans le tirage de l'amour
    afficherTirageLove(tirageActuel);
  } else {
    // Cacher les autres tirages et afficher le tirage en croix
    document.getElementById('horseshoe-spread').style.display = 'none';
    document.getElementById('love-spread').style.display = 'none';
    document.getElementById('spread').style.display = 'grid';
    
    // Afficher les cartes dans la croix
    afficherTirage(tirageActuel);
  }
  
  // Obtenir l'interprétation
  obtenirInterpretation(tirageActuel, questionActuelle, modeTirage);
}

/**
 * Change l'affichage selon le type de tirage sélectionné
 */
function changementModeTirage() {
  // Récupérer le mode de tirage sélectionné
  const modeTirage = document.getElementById('spread-type').value;
  
  // Réinitialiser les tirages précédents
  tirageActuel = [];
  questionActuelle = "";
  
  // Réinitialiser complètement l'affichage
  resetAllDisplays();
}

/**
 * Fonction pour obtenir l'interprétation du tirage via le modèle d'IA
 * @param {Array} tirage - Tableau des cartes tirées
 * @param {string} question - Question posée par l'utilisateur
 * @param {string} modeTirage - Mode de tirage sélectionné (ex: "cross" pour tirage en croix)
 */
async function obtenirInterpretation(tirage, question, modeTirage) {
  const interpretationsDiv = document.getElementById('interpretations');
  const langue = document.getElementById('language').value;
  interpretationsDiv.innerHTML = `<p class="loading">${getTranslation('interpretation.loading', langue)}</p>`;
  
  // Sauvegarder l'état initial pour pouvoir le restaurer en cas d'erreur
  const initialContent = interpretationsDiv.innerHTML;
  
  // Récupération des options sélectionnées
  const modeleIA = document.getElementById('ia-model').value;
  const persona = document.getElementById('persona').value;
  
  // Préparation de la question pour l'interprétation
  let typeDeSpread = getTranslation(`misc.${modeTirage}Spread`, langue);
  
  const prompt = getTranslation('misc.tarotPrompt', langue, { persona: getPersonaLabel(persona), spreadType: typeDeSpread, question: question });
  
  try {
    // Affichage d'un message indiquant le modèle et le personnage utilisés
    interpretationsDiv.innerHTML = `<p class="loading">${getTranslation('interpretation.loadingWithModel', langue, { model: modeleIA, persona: getPersonaLabel(persona) })}</p>`;
    
    // Variable pour stocker l'éventuel contenu de streaming déjà affiché
    let partialContent = null;
    
    // Observer les changements dans le div des interprétations pour sauvegarder le contenu du streaming
    const observer = new MutationObserver((mutations) => {
      const partialResponseElement = document.querySelector('.partial-response');
      if (partialResponseElement && partialResponseElement.innerHTML.length > 50) {
        // Sauvegarder le contenu partiel actuel
        partialContent = partialResponseElement.innerHTML;
      }
    });
    
    // Commencer à observer le div des interprétations
    observer.observe(interpretationsDiv, { childList: true, subtree: true });
    
    // Appel à l'API via notre fonction avec les options sélectionnées
    try {
      const reponse = await obtenirReponseGPT4O(question, [], modeleIA, persona, tirage, langue, modeTirage);
      
      // Arrêter l'observation
      observer.disconnect();
      
      // Vérifier si la réponse s'est terminée correctement
      const completedCorrectly = reponse.includes("<!-- streaming-completed -->");
      
      // Si la réponse contient le marqueur, le supprimer
      const cleanResponse = reponse.replace("<!-- streaming-completed -->", "").trim();
      
      // Mise en forme de la réponse
      const formattedResponse = cleanResponse.split('\n').map(paragraph => 
        paragraph ? `<p>${paragraph}</p>` : ''
      ).join('');
      
      // Afficher la réponse
      interpretationsDiv.innerHTML = formattedResponse;
    } catch (apiError) {
      console.error("Erreur API lors de l'interprétation:", apiError);
      
      // Arrêter l'observation
      observer.disconnect();
      
      // Si nous avons capturé du contenu partiel pendant le streaming, l'afficher
      if (partialContent && partialContent.length > 100) {
        // Ajouter un message d'avertissement mais conserver le contenu
        interpretationsDiv.innerHTML = `
          <div class="api-warning">
            <p><strong>${getTranslation('interpretation.apiWarning', langue) || 'Attention:'}</strong> ${apiError.message}</p>
          </div>
          ${partialContent}
        `;
      } else {
        // Si pas de contenu partiel, afficher l'erreur standard
        interpretationsDiv.innerHTML = `<p class="error">${getTranslation('interpretation.error', langue)}</p>`;
      }
    }
  } catch (error) {
    console.error("Erreur globale lors de l'interprétation:", error);
    interpretationsDiv.innerHTML = `<p class="error">${getTranslation('interpretation.error', langue)}</p>`;
  }
}

/**
 * Fonction pour charger les modèles Ollama disponibles
 * @returns {Promise<boolean>} - true si un modèle Ollama a été sélectionné, false sinon
 */
async function chargerModelesOllama() {
  try {
    const selectModele = document.getElementById('ia-model');
    const groupeOllama = selectModele.querySelector('optgroup[label="Ollama"]');
    
    // Afficher un message de chargement
    const optionChargement = document.createElement('option');
    optionChargement.textContent = "Chargement des modèles...";
    optionChargement.disabled = true;
    groupeOllama.appendChild(optionChargement);
    
    // Récupérer les modèles disponibles
    const modeles = await obtenirModelesOllama();
    
    // Supprimer le message de chargement
    groupeOllama.removeChild(optionChargement);
    
    // Supprimer les options existantes du groupe Ollama
    while (groupeOllama.firstChild) {
      groupeOllama.removeChild(groupeOllama.firstChild);
    }
    
    if (modeles.length === 0) {
      // Si aucun modèle n'est disponible
      const optionErreur = document.createElement('option');
      optionErreur.textContent = "Aucun modèle disponible";
      optionErreur.disabled = true;
      groupeOllama.appendChild(optionErreur);
      return false;
    } else {
      // Ajouter les modèles disponibles
      modeles.forEach((modele, index) => {
        const option = document.createElement('option');
        option.value = `ollama/${modele.name}`;
        option.textContent = modele.name;
        groupeOllama.appendChild(option);
        
        // Sélectionner le premier modèle par défaut
        if (index === 0) {
          selectModele.value = `ollama/${modele.name}`;
        }
      });
      return true;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des modèles Ollama:", error);
    
    // Mettre à jour le groupe avec un message d'erreur
    const selectModele = document.getElementById('ia-model');
    const groupeOllama = selectModele.querySelector('optgroup[label="Ollama"]');
    
    // Supprimer les options existantes
    while (groupeOllama.firstChild) {
      groupeOllama.removeChild(groupeOllama.firstChild);
    }
    
    // Ajouter un message d'erreur
    const optionErreur = document.createElement('option');
    optionErreur.textContent = "Erreur de connexion à Ollama";
    optionErreur.disabled = true;
    groupeOllama.appendChild(optionErreur);
    return false;
  }
}

/**
 * Fonction pour tester la connectivité avec le modèle actuellement sélectionné
 * et afficher un message d'avertissement si nécessaire
 */
async function testerConnectiviteModele() {
  const modeleIA = document.getElementById('ia-model').value;
  const isOllama = !modeleIA.startsWith('openai/');
  const langue = document.getElementById('language').value;
  
  console.log("🔍 DEBUG - Test préliminaire de connectivité au démarrage pour:", modeleIA);
  
  // Créer/récupérer le conteneur pour les messages d'avertissement
  let warningContainer = document.getElementById('connectivity-warning');
  if (!warningContainer) {
    warningContainer = document.createElement('div');
    warningContainer.id = 'connectivity-warning';
    warningContainer.className = 'warning-container';
    
    // Insérer avant la division des interprétations
    const interpretationsDiv = document.getElementById('interpretations');
    interpretationsDiv.parentNode.insertBefore(warningContainer, interpretationsDiv);
  }
  
  try {
    if (isOllama) {
      const modelName = modeleIA.split('/')[1];
      const connectivityTest = await testOllamaConnectivity(modelName);
      
      if (!connectivityTest.success) {
        console.error("🔍 DEBUG - Problème de connectivité détecté:", connectivityTest.message);
        
        // Afficher un avertissement à l'utilisateur
        warningContainer.innerHTML = `
          <div class="warning-box">
            <h3>⚠️ ${getTranslation('connectivity.warning', langue) || 'Problème de connectivité détecté'}</h3>
            <p>${connectivityTest.message}</p>
            <p>${getTranslation('connectivity.suggestions', langue) || 'Suggestions:'}</p>
            <ul>
              <li>${getTranslation('connectivity.checkOllama', langue) || 'Vérifiez que le serveur Ollama est en cours d\'exécution (ollama serve)'}</li>
              <li>${getTranslation('connectivity.tryOtherModel', langue) || 'Essayez un autre modèle dans la liste déroulante'}</li>
              <li>${getTranslation('connectivity.checkConsole', langue) || 'Consultez la console du navigateur (F12) pour plus de détails'}</li>
            </ul>
            <button id="dismiss-warning">${getTranslation('connectivity.dismiss', langue) || 'Ignorer cet avertissement'}</button>
          </div>
        `;
        
        // Ajouter un gestionnaire d'événements pour fermer l'avertissement
        document.getElementById('dismiss-warning').addEventListener('click', function() {
          warningContainer.innerHTML = '';
        });
        
        return false;
      }
    } else {
      // Pour OpenAI, vérifier simplement que la clé API est définie
      const API_KEY = (await import('./config.js')).API_KEY;
      
      if (!API_KEY || API_KEY === "YOUR API KEY") {
        console.error("🔍 DEBUG - Problème de connectivité OpenAI: Clé API non configurée");
        
        // Afficher un avertissement à l'utilisateur
        warningContainer.innerHTML = `
          <div class="warning-box">
            <h3>⚠️ ${getTranslation('connectivity.warning', langue) || 'Problème de configuration OpenAI détecté'}</h3>
            <p>${getTranslation('connectivity.apiKeyMissing', langue) || 'La clé API OpenAI n\'est pas configurée'}</p>
            <p>${getTranslation('connectivity.suggestions', langue) || 'Suggestions:'}</p>
            <ul>
              <li>${getTranslation('connectivity.configureApiKey', langue) || 'Configurez votre clé API dans assets/js/config.js'}</li>
              <li>${getTranslation('connectivity.tryOllama', langue) || 'Essayez un modèle Ollama local à la place'}</li>
            </ul>
            <button id="dismiss-warning">${getTranslation('connectivity.dismiss', langue) || 'Ignorer cet avertissement'}</button>
          </div>
        `;
        
        // Ajouter un gestionnaire d'événements pour fermer l'avertissement
        document.getElementById('dismiss-warning').addEventListener('click', function() {
          warningContainer.innerHTML = '';
        });
        
        return false;
      }
    }
    
    // Si nous arrivons ici, tout est OK
    warningContainer.innerHTML = '';
    return true;
  } catch (error) {
    console.error("🔍 DEBUG - Erreur lors du test de connectivité:", error);
    
    // Afficher un avertissement à l'utilisateur
    warningContainer.innerHTML = `
      <div class="warning-box">
        <h3>⚠️ ${getTranslation('connectivity.error', langue) || 'Erreur lors du test de connectivité'}</h3>
        <p>${error.message}</p>
        <button id="dismiss-warning">${getTranslation('connectivity.dismiss', langue) || 'Ignorer cet avertissement'}</button>
      </div>
    `;
    
    // Ajouter un gestionnaire d'événements pour fermer l'avertissement
    document.getElementById('dismiss-warning').addEventListener('click', function() {
      warningContainer.innerHTML = '';
    });
    
    return false;
  }
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Forcer la sélection du tirage en croix au démarrage
    document.getElementById('spread-type').value = 'cross';
    
    // Initialisation complète de l'affichage
    resetAllDisplays();
    
    // Attacher l'événement au bouton pour effectuer un tirage
    document.getElementById('tirer').addEventListener('click', faireUnTirage);
    
    // Attacher un event listener pour détecter les changements du jeu de cartes
    document.getElementById('card-set').addEventListener('change', function() {
      // Récupérer le jeu sélectionné et le type de tirage actuel
      const jeuSelectionne = this.value;
      const typeTirageActuel = document.getElementById('spread-type').value;
      
      // Si un tirage a déjà été effectué, mettre à jour les images des cartes
      if (tirageActuel.length > 0) {
        tirageActuel = mettreAJourAffichageCartes(tirageActuel, jeuSelectionne);
        
        // Assurons-nous que seul le bon conteneur est affiché
        document.getElementById('spread').style.display = 'none';
        document.getElementById('horseshoe-spread').style.display = 'none';
        document.getElementById('love-spread').style.display = 'none';
        
        if (typeTirageActuel === 'horseshoe') {
          document.getElementById('horseshoe-spread').style.display = 'grid';
        } else if (typeTirageActuel === 'love') {
          document.getElementById('love-spread').style.display = 'grid';
        } else {
          document.getElementById('spread').style.display = 'grid';
        }
      } else {
        // Sinon, réinitialiser complètement l'affichage
        resetAllDisplays();
      }
    });
    
    // Attacher un event listener pour détecter le changement de type de tirage
    document.getElementById('spread-type').addEventListener('change', changementModeTirage);
    
    // Attacher un event listener pour détecter les changements de persona
    document.getElementById('persona').addEventListener('change', function() {
      // Mettre à jour le logo du persona
      updatePersonaLogo(this.value);
      
      // Réinitialiser l'interprétation si un tirage est affiché
      if (tirageActuel.length > 0) {
        // Réinitialiser la question et le tirage pour forcer un nouveau tirage
        questionActuelle = "";
        tirageActuel = [];
        
        // Réinitialiser complètement l'affichage
        resetAllDisplays();
      }
    });
    
    // Ajouter un gestionnaire d'événements au menu déroulant de langue
    document.getElementById('language').addEventListener('change', function() {
      const selectedLanguage = this.value;
      console.log(`Langue sélectionnée : ${selectedLanguage}`);
      
      // Mettre à jour l'interface avec les traductions
      updateUILanguage(selectedLanguage);
      
      // Stocker la préférence de langue dans le localStorage
      localStorage.setItem('jodotarot_language', selectedLanguage);
      
      // Re-tester la connectivité avec les nouveaux textes
      testerConnectiviteModele();
    });
    
    // Ajouter un gestionnaire d'événements pour le changement de modèle d'IA
    document.getElementById('ia-model').addEventListener('change', function() {
      // Tester la connectivité avec le nouveau modèle sélectionné
      testerConnectiviteModele();
    });
    
    // Initialiser le logo avec le persona par défaut
    updatePersonaLogo(document.getElementById('persona').value);
    
    // Charger les modèles Ollama disponibles et sélectionner le premier comme modèle par défaut
    // Si aucun modèle Ollama n'est disponible, utiliser GPT-3.5 Turbo comme modèle par défaut
    chargerModelesOllama().then(modelleOllamaSelectionne => {
      if (!modelleOllamaSelectionne) {
        // Si aucun modèle Ollama n'a été sélectionné, utiliser GPT-3.5 Turbo
        const selectModele = document.getElementById('ia-model');
        selectModele.value = 'openai/gpt-3.5-turbo';
      }
      
      // Une fois les modèles chargés, tester la connectivité avec le modèle sélectionné
      setTimeout(testerConnectiviteModele, 1000);
    });
    
    // Toujours définir la langue française au démarrage
    document.getElementById('language').value = 'fr';
    // Déclencher l'événement de changement pour appliquer les traductions
    const event = new Event('change');
    document.getElementById('language').dispatchEvent(event);
    // Stocker la préférence de langue en français dans le localStorage
    localStorage.setItem('jodotarot_language', 'fr');
    
    // S'assurer que le titre reflète bien le type de tirage par défaut (Croix)
    updateAppTitle();
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la page:", error);
  }
}); 