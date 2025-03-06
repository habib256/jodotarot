/**
 * Point d'entrée principal de l'application Jodotarot
 */

import { drawCards } from './tarot.js';
import { obtenirReponseGPT4O, obtenirModelesOllama } from './api.js';
import { 
  initSpread, 
  afficherTirage, 
  mettreAJourAffichageCartes, 
  updatePersonaLogo, 
  getPersonaLabel 
} from './ui.js';

// Variables pour stocker le tirage actuel
let tirageActuel = [];
let questionActuelle = "";

// Rendre la fonction toggleEnlarge disponible globalement
window.toggleEnlarge = function(img) {
  if (img.classList.contains('enlarged')) {
    // Si la carte est déjà agrandie, la réduire
    img.classList.remove('enlarged');
    img.style.left = '';
  } else {
    // Agrandir la carte et l'aligner précisément avec le panneau
    img.classList.add('enlarged');
    
    // Obtenir la position et les dimensions du panneau
    const rightPanel = document.querySelector('.right-panel');
    const rightPanelRect = rightPanel.getBoundingClientRect();
    
    // Positionner la carte agrandie exactement au-dessus du panneau
    img.style.left = rightPanelRect.left + 'px';
  }
};

/**
 * Fonction pour effectuer un tirage de 5 cartes
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
  
  // Effectuer le tirage
  tirageActuel = drawCards(jeuSelectionne);
  
  // Afficher les cartes dans la croix
  afficherTirage(tirageActuel);
  
  // Obtenir l'interprétation
  obtenirInterpretation(tirageActuel, questionActuelle, modeTirage);
}

/**
 * Fonction pour obtenir l'interprétation du tirage via le modèle d'IA
 * @param {Array} tirage - Tableau des cartes tirées
 * @param {string} question - Question posée par l'utilisateur
 * @param {string} modeTirage - Mode de tirage sélectionné (ex: "cross" pour tirage en croix)
 */
async function obtenirInterpretation(tirage, question, modeTirage) {
  const interpretationsDiv = document.getElementById('interpretations');
  interpretationsDiv.innerHTML = '<p class="loading">Analyse du tirage en cours...</p>';
  
  // Récupération des options sélectionnées
  const modeleIA = document.getElementById('ia-model').value;
  const persona = document.getElementById('persona').value;
  const langue = document.getElementById('language').value;
  
  // Préparation de la question pour l'interprétation
  let typeDeSpread = "en croix";
  if (modeTirage === "cross") {
    typeDeSpread = "en croix";
  }
  // D'autres modes pourront être ajoutés ici à l'avenir
  
  const prompt = `Interprétez ce tirage de tarot ${typeDeSpread} en relation avec ma question: "${question}"`;
  
  try {
    // Affichage d'un message indiquant le modèle et le personnage utilisés
    interpretationsDiv.innerHTML = `<p class="loading">Analyse du tirage ${typeDeSpread} en cours avec ${modeleIA} interprété par un(e) ${getPersonaLabel(persona)}...</p>`;
    
    // Appel à l'API via notre fonction avec les options sélectionnées
    const reponse = await obtenirReponseGPT4O(prompt, [], modeleIA, persona, tirage, langue);
    
    // Mise en forme de la réponse
    const formattedResponse = reponse.split('\n').map(paragraph => 
      paragraph ? `<p>${paragraph}</p>` : ''
    ).join('');
    
    interpretationsDiv.innerHTML = formattedResponse;
  } catch (error) {
    console.error("Erreur lors de l'interprétation:", error);
    interpretationsDiv.innerHTML = '<p>Une erreur est survenue lors de l\'interprétation. Veuillez réessayer.</p>';
  }
}

/**
 * Fonction pour charger les modèles Ollama disponibles
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
    } else {
      // Ajouter les modèles disponibles
      modeles.forEach(modele => {
        const option = document.createElement('option');
        option.value = `ollama/${modele.name}`;
        option.textContent = modele.name;
        groupeOllama.appendChild(option);
      });
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
  }
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
  // Afficher le dos des cartes
  initSpread();
  
  // Ajouter un gestionnaire d'événements au bouton de tirage
  document.getElementById('tirer').addEventListener('click', faireUnTirage);
  
  // Ajouter un gestionnaire d'événements au menu déroulant de langue
  document.getElementById('language').addEventListener('change', function() {
    console.log(`Langue sélectionnée : ${this.value}`);
    // Ici, dans une future mise à jour, on pourrait ajouter une fonction pour traduire l'interface
  });
  
  // Ajouter un gestionnaire d'événements au menu déroulant des personas
  document.getElementById('persona').addEventListener('change', function() {
    updatePersonaLogo(this.value);
  });
  
  // Ajouter un gestionnaire d'événements au menu déroulant du jeu de cartes
  document.getElementById('card-set').addEventListener('change', function() {
    tirageActuel = mettreAJourAffichageCartes(tirageActuel, this.value);
  });
  
  // Ajouter un gestionnaire d'événements au menu déroulant du mode de tirage
  document.getElementById('spread-type').addEventListener('change', function() {
    // Pour l'instant, nous n'avons qu'un seul mode de tirage
    // À l'avenir, on pourra ajouter une logique pour changer l'affichage en fonction du mode
    console.log(`Mode de tirage sélectionné : ${this.value}`);
  });
  
  // Initialiser le logo avec le persona par défaut
  updatePersonaLogo(document.getElementById('persona').value);
  
  // Charger les modèles Ollama disponibles
  chargerModelesOllama();
}); 