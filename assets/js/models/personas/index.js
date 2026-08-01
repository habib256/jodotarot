/**
 * Point d'entrée central pour tous les personas
 * Permet l'importation dynamique et l'accès par clé
 */

// Mappage des clés de personas vers leurs chemins de fichiers
const PERSONA_PATHS = {
  'tarologue': './TarologuePersona.js',
  'oracle': './OraclePersona.js',
  'jung': './JungPersona.js',
  'voyante': './VoyantePersona.js',
  'freud': './FreudPersona.js',
  'pretre': './PretrePersona.js',
  'sorciere': './SorcierePersona.js',
  'socrate': './SocratePersona.js',
  'demon': './DemonPersona.js',
  'rabbin': './RabbinPersona.js',
  'alchimiste': './AlchimistePersona.js',
  'lacan': './LacanPersona.js',
  'noegoman': './NoEgoPersona.js',
  'dalailama': './DalailamaPersona.js',
  'mage': './MagePersona.js',
  'dolto': './DoltoPersona.js',
  'montaigne': './MontaignePersona.js',
  'imam': './ImamPersona.js',
  'francmacon': './FrancmaconPersona.js',
  'salomon': './SalomonPersona.js',
  'quichotte': './QuichottePersona.js'
};

/**
 * Récupère le prompt spécifique à un persona
 * @param {string} personaKey - Clé identifiant le persona
 * @param {string} language - Code de langue
 * @param {string} spreadName - Nom localisé du tirage (ex: « Croix Celtique »)
 * @returns {string} Le prompt spécifique au persona
 */
export async function getPersonaPrompt(personaKey, language = 'fr', spreadName = '') {
  const path = PERSONA_PATHS[personaKey];
  if (!path) {
    console.error(`Persona inconnu: ${personaKey}`);
    return '';
  }

  try {
    // Import dynamique du persona
    const module = await import(path);
    const persona = new module.default(language);
    return persona.buildSystemPrompt(spreadName);
  } catch (error) {
    console.error(`Erreur lors du chargement du prompt pour ${personaKey}:`, error);
    return '';
  }
}
