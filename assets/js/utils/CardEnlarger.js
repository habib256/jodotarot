/**
 * Gère l'agrandissement des cartes avec animation
 */
class CardEnlarger {
  constructor() {
    this.overlay = null;
    this.isEnlarged = false;
    this.currentCard = null;
    this.init();
  }

  /**
   * Initialise le gestionnaire d'agrandissement
   */
  init() {
    // Écouter les clics sur les cartes
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (card && !this.isEnlarged) {
        this.enlargeCard(card);
      }
    });

    // Fermer avec la touche ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isEnlarged) {
        this.closeCard();
      }
    });
  }

  /**
   * Extrait l'angle de rotation depuis une transformation CSS
   * @param {string} transform - La transformation CSS
   * @returns {number} L'angle en degrés
   */
  getRotationAngle(transform) {
    if (!transform || transform === 'none') return 0;
    
    const values = transform.split('(')[1].split(')')[0].split(',');
    const a = values[0];
    const b = values[1];
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    
    return angle;
  }

  /**
   * Agrandit une carte avec animation depuis sa position d'origine
   * @param {HTMLElement} cardElement - L'élément de carte à agrandir
   */
  enlargeCard(cardElement) {
    if (this.isEnlarged) return;

    this.isEnlarged = true;
    this.currentCard = cardElement;

    // Obtenir la position et dimensions d'origine
    const rect = cardElement.getBoundingClientRect();
    const originalTransform = window.getComputedStyle(cardElement).transform;
    const rotationAngle = this.getRotationAngle(originalTransform);

    // Bloquer le défilement du body
    document.body.classList.add('card-enlarged-active');
    
    // Créer l'overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'card-enlarge-overlay';
    document.body.appendChild(this.overlay);

    // Créer le clone de la carte
    const cardClone = cardElement.cloneNode(true);
    const isReversed = cardElement.classList.contains('reversed');
    cardClone.className = 'card card-enlarged';
    if (isReversed) {
      cardClone.classList.add('reversed');
    }
    
    // Positionner le clone à la position d'origine
    cardClone.style.position = 'fixed';
    cardClone.style.left = `${rect.left}px`;
    cardClone.style.top = `${rect.top}px`;
    cardClone.style.width = `${rect.width}px`;
    cardClone.style.height = `${rect.height}px`;
    cardClone.style.margin = '0';
    cardClone.style.zIndex = '10001';
    cardClone.style.transformOrigin = 'center center';
    
    // Préserver la transformation d'origine (rotation, etc.)
    if (originalTransform && originalTransform !== 'none') {
      cardClone.style.transform = originalTransform;
    }

    // Ajouter le clone au body
    document.body.appendChild(cardClone);

    // Créer le conteneur pour les informations de la carte
    const cardInfo = this.createCardInfo(cardElement);
    if (cardInfo) {
      cardClone.appendChild(cardInfo);
    }

    // Forcer un reflow pour que la transition fonctionne
    cardClone.offsetHeight;

    // Animer vers le centre avec agrandissement
    requestAnimationFrame(() => {
      this.overlay.classList.add('active');
      
      // Calculer la nouvelle taille (plus grande)
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculer les dimensions en tenant compte de la rotation
      const isRotated90 = Math.abs(rotationAngle) === 90 || Math.abs(rotationAngle) === 270;
      
      // Obtenir les vraies dimensions de la carte (dimensions de l'image, pas de la zone tournée)
      const baseWidth = isRotated90 ? rect.height : rect.width;
      const baseHeight = isRotated90 ? rect.width : rect.height;
      const aspectRatio = baseHeight / baseWidth;
      
      // Calculer la taille maximale en fonction du viewport
      const maxWidth = Math.min(viewportWidth * 0.7, 500);
      const maxHeight = viewportHeight * 0.8;
      
      let newWidth = maxWidth;
      let newHeight = newWidth * aspectRatio;
      
      // Si la hauteur dépasse, ajuster par la hauteur
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight / aspectRatio;
      }
      
      // Pour les cartes tournées de 90° ou 270°, on doit inverser les dimensions du conteneur
      // car l'image à l'intérieur sera tournée
      let finalWidth, finalHeight;
      if (isRotated90) {
        // Le conteneur doit avoir les dimensions inversées pour accommoder l'image tournée
        finalWidth = newHeight;
        finalHeight = newWidth;
      } else {
        finalWidth = newWidth;
        finalHeight = newHeight;
      }

      // Position centrée (basée sur les dimensions APRÈS rotation)
      const centerX = (viewportWidth - finalWidth) / 2;
      const centerY = (viewportHeight - finalHeight) / 2;

      cardClone.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
      cardClone.style.left = `${centerX}px`;
      cardClone.style.top = `${centerY}px`;
      cardClone.style.width = `${finalWidth}px`;
      cardClone.style.height = `${finalHeight}px`;
      
      // Le conteneur est toujours à 0°, on gère la rotation avec l'image
      cardClone.style.transform = 'rotate(0deg)';
      
      // Gérer la rotation de l'image
      const img = cardClone.querySelector('img');
      if (img) {
        // Calculer la rotation totale (rotation de position + renversement éventuel)
        let totalRotation = rotationAngle;
        if (isReversed) {
          totalRotation += 180;
        }
        
        if (isRotated90) {
          // Pour les cartes tournées de 90° ou 270°
          // L'image doit être dimensionnée inversée et tournée
          img.style.width = `${finalHeight}px`;
          img.style.height = `${finalWidth}px`;
          img.style.position = 'absolute';
          img.style.left = '50%';
          img.style.top = '50%';
          img.style.transformOrigin = 'center center';
          img.style.transform = `translate(-50%, -50%) rotate(${totalRotation}deg)`;
        } else if (isReversed) {
          // Pour les cartes renversées (mais pas tournées), le CSS le gère déjà
          // mais on s'assure que c'est bien appliqué
          img.style.transform = 'rotate(180deg)';
        }
      }
      
      cardClone.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)';
    });

    // Fermer au clic sur l'overlay
    this.overlay.addEventListener('click', () => {
      this.closeCard();
    });

    // Empêcher la fermeture lors du clic sur la carte
    cardClone.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Crée les informations détaillées de la carte
   * @param {HTMLElement} cardElement - L'élément de carte
   * @returns {HTMLElement|null} L'élément d'information ou null
   */
  createCardInfo(cardElement) {
    const cardName = cardElement.getAttribute('data-card-name');
    const position = cardElement.getAttribute('data-position');
    const positionElement = cardElement.closest('.card-position');
    
    if (!cardName || !positionElement) return null;

    const positionName = positionElement.getAttribute('data-position-name');
    const isReversed = cardElement.classList.contains('reversed');

    const infoDiv = document.createElement('div');
    infoDiv.className = 'card-enlarged-info';
    
    // Ajouter le nom de la carte avec indication de renversement
    let cardNameWithOrientation = cardName;
    if (isReversed) {
      cardNameWithOrientation += ' <span style="color: #ffc107; font-weight: bold;">(Renversée)</span>';
    }
    let infoHTML = `<div class="card-enlarged-name">${cardNameWithOrientation}</div>`;
    
    if (positionName) {
      infoHTML += `<div class="card-enlarged-position">${positionName}</div>`;
    }
    
    // Description détaillée retirée
    
    infoDiv.innerHTML = infoHTML;
    
    return infoDiv;
  }

  /**
   * Ferme la carte agrandie avec animation de retour
   */
  closeCard() {
    if (!this.isEnlarged || !this.currentCard) return;

    const cardClone = document.querySelector('.card-enlarged');
    if (!cardClone) return;

    // Obtenir la position d'origine
    const rect = this.currentCard.getBoundingClientRect();
    const originalTransform = window.getComputedStyle(this.currentCard).transform;

    // Animer le retour
    this.overlay.classList.remove('active');
    
    cardClone.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
    cardClone.style.left = `${rect.left}px`;
    cardClone.style.top = `${rect.top}px`;
    cardClone.style.width = `${rect.width}px`;
    cardClone.style.height = `${rect.height}px`;
    cardClone.style.transform = originalTransform && originalTransform !== 'none' ? originalTransform : 'none';
    cardClone.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

    // Supprimer les éléments après l'animation
    setTimeout(() => {
      if (cardClone && cardClone.parentNode) {
        cardClone.remove();
      }
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.remove();
      }
      // Réactiver le défilement du body
      document.body.classList.remove('card-enlarged-active');
      
      this.overlay = null;
      this.currentCard = null;
      this.isEnlarged = false;
    }, 300);
  }
}

// Exporter la classe
export default CardEnlarger;

