/**
 * Classe de base pour tous les personas
 * Définit l'interface commune et les fonctionnalités partagées
 */
class BasePersona {
  /**
   * @param {string} key - Identifiant unique du persona
   * @param {string} language - Code de langue (fr, en, etc.)
   */
  constructor(key, language = 'fr') {
    this.key = key;
    this.language = language;
    
    // Ces propriétés seront surchargées par les classes enfants
    this.name = {};
    this.description = {};
    this.imageUrl = `assets/images/personas/${key}.png`;
    this.promptTemplate = {};
    this.specializations = [];
  }
  
  /**
   * Retourne le nom localisé du persona
   * @return {string} Nom du persona
   */
  getName() {
    return this.name[this.language] || this.name['fr'] || this.key;
  }
  
  /**
   * Retourne la description localisée du persona
   * @return {string} Description du persona
   */
  getDescription() {
    return this.description[this.language] || this.description['fr'] || '';
  }
  
  /**
   * Retourne l'URL de l'image du persona
   * @return {string} URL de l'image
   */
  getImageUrl() {
    return this.imageUrl;
  }
  
  /**
   * Retourne les spécialisations du persona
   * @return {Array} Liste des spécialisations
   */
  getSpecializations() {
    return this.specializations;
  }
  
  /**
   * Construit et retourne le prompt système pour ce persona
   * @param {string} spreadType - Type de tirage (cross, horseshoe, love)
   * @return {string} Prompt système formaté
   */
  buildSystemPrompt(spreadType = 'cross') {
    const template = this.promptTemplate[this.language] || this.promptTemplate['fr'] || '';
    
    // Remplacer les variables dans le template
    let formattedTemplate = template
      .replace('{{PERSONA_NAME}}', this.getName())
      .replace('{{PERSONA_DESCRIPTION}}', this.getDescription())
      .replace('{{SPREAD_TYPE}}', spreadType);
      
    // Ajouter les spécialisations si elles ne sont pas déjà mentionnées dans le template
    if (this.specializations && this.specializations.length > 0 && !template.includes('{{SPECIALIZATIONS}}')) {
      if (this.language === 'fr') {
        formattedTemplate += `\n\nVos domaines d'expertise incluent: ${this.specializations.join(', ')}.`;
      } else {
        formattedTemplate += `\n\nYour areas of expertise include: ${this.specializations.join(', ')}.`;
      }
    } else if (template.includes('{{SPECIALIZATIONS}}')) {
      formattedTemplate = formattedTemplate.replace('{{SPECIALIZATIONS}}', this.specializations.join(', '));
    }
    
    return formattedTemplate;
  }
  
  /**
   * Méthode utilitaire pour formater l'interprétation selon le style du persona
   * @param {string} interpretation - Texte d'interprétation brut
   * @return {string} Interprétation formatée
   */
  formatInterpretation(interpretation) {
    // Par défaut, retourne l'interprétation telle quelle
    // Les personas spécifiques peuvent surcharger cette méthode
    return interpretation;
  }
}

export default BasePersona; 