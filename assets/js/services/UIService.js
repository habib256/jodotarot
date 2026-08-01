/**
 * Service responsable des fonctionnalités d'interface utilisateur communes
 * Gère les interactions UI génériques
 */
class UIService {
  constructor() {
    // Initialiser les gestionnaires d'événements globaux
    this.initGlobalEvents();
  }

  /**
   * S'assure que le panneau d'interprétation est toujours visible
   */
  ensureInterpretationPanelVisibility() {
    const interpretationPanel = document.querySelector('.interpretation-panel');
    if (interpretationPanel) {
      interpretationPanel.style.display = 'block';
      
      // Ajuster la hauteur minimale en fonction de la hauteur de la fenêtre sur mobile
      if (window.innerWidth <= 1200) {
        const minHeight = Math.max(250, window.innerHeight * 0.3);
        interpretationPanel.style.minHeight = `${minHeight}px`;
      }
    }
  }
  
  /**
   * Initialise les gestionnaires d'événements globaux
   */
  initGlobalEvents() {
    // S'assurer que le panneau d'interprétation est toujours visible
    window.addEventListener('DOMContentLoaded', () => {
      this.ensureInterpretationPanelVisibility();
    });
    
    // S'assurer que le panneau d'interprétation reste visible après les redimensionnements de fenêtre
    window.addEventListener('resize', () => {
      this.ensureInterpretationPanelVisibility();
    });
  }
  
  /**
   * Affiche un message d'erreur
   * @param {string} message - Message d'erreur
   * @param {boolean} isApi - Si l'erreur est liée à l'API
   * @param {number} duration - Durée d'affichage en ms (0 = permanent)
   */
  showError(message, isApi = false, duration = 5000) {
    // Créer/récupérer le conteneur d'erreur
    let errorContainer = document.querySelector('.error-container');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'error-container';
      document.body.appendChild(errorContainer);
    }
    
    // Créer le message d'erreur
    const errorElement = document.createElement('div');
    errorElement.className = `error-message ${isApi ? 'api-error' : ''}`;
    errorElement.textContent = message;
    
    // Ajouter au conteneur
    errorContainer.appendChild(errorElement);
    
    // Ajouter une classe visible pour l'animation
    setTimeout(() => {
      errorElement.classList.add('visible');
    }, 10);
    
    // Supprimer après la durée spécifiée (si > 0)
    if (duration > 0) {
      setTimeout(() => {
        // Animation de sortie
        errorElement.classList.remove('visible');
        
        // Supprimer après l'animation
        setTimeout(() => {
          errorElement.remove();
          
          // Supprimer le conteneur s'il est vide
          if (errorContainer.children.length === 0) {
            errorContainer.remove();
          }
        }, 300);
      }, duration);
    }
    
    return errorElement;
  }
  
}

export default UIService;
