/**
 * Service responsable des fonctionnalités d'interface utilisateur communes
 * Gère les interactions UI génériques
 */
class UIService {
  constructor() {
    // Initialiser les gestionnaires d'événements globaux si nécessaire
    this.initGlobalEvents();
  }
  
  /**
   * Initialise les gestionnaires d'événements globaux
   */
  initGlobalEvents() {
    // S'assurer que le panneau d'interprétation est toujours visible
    window.addEventListener('DOMContentLoaded', () => {
      const interpretationPanel = document.querySelector('.interpretation-panel');
      if (interpretationPanel) {
        interpretationPanel.style.display = 'block';
      }
    });
    
    // S'assurer que le panneau d'interprétation reste visible après les redimensionnements de fenêtre
    window.addEventListener('resize', () => {
      const interpretationPanel = document.querySelector('.interpretation-panel');
      if (interpretationPanel) {
        interpretationPanel.style.display = 'block';
        
        // Ajuster la hauteur minimale en fonction de la hauteur de la fenêtre sur mobile
        if (window.innerWidth <= 1200) {
          const minHeight = Math.max(250, window.innerHeight * 0.3);
          interpretationPanel.style.minHeight = `${minHeight}px`;
        }
      }
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
  
  /**
   * Affiche un message de notification
   * @param {string} message - Message à afficher
   * @param {string} type - Type de notification (info, success, warning)
   * @param {number} duration - Durée d'affichage en ms
   */
  showNotification(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.right = '20px';
      container.style.zIndex = '10000';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast notification-' + type;
    toast.innerText = message;
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    container.appendChild(toast);
    
    // Forcer un reflow pour déclencher la transition
    void toast.offsetWidth;
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, duration);
  }
}

export default UIService; 