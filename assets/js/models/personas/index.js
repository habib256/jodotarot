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
 * @param {string} spreadType - Type de tirage (cross, horseshoe, love, celticCross)
 * @returns {string} Le prompt spécifique au persona
 */
export async function getPersonaPrompt(personaKey, language = 'fr', spreadType = 'cross') {
  try {
    // Import dynamique du persona
    const module = await import(PERSONA_PATHS[personaKey]);
    const PersonaClass = module.default;
    const persona = new PersonaClass(language);
    return persona.buildSystemPrompt(spreadType);
  } catch (error) {
    console.error(`Erreur lors du chargement du prompt pour ${personaKey}:`, error);
    return '';
  }
}

/**
 * Charge tous les personas et les retourne sous forme d'un objet
 * @returns {Promise<Object>} Un objet avec les clés de personas et leurs classes
 */
export async function getAllPersonas() {
  const personas = {};
  
  // Charger tous les personas de manière asynchrone
  const imports = await Promise.all(
    Object.entries(PERSONA_PATHS).map(async ([key, path]) => {
      try {
        const module = await import(path);
        return [key, module.default];
      } catch (error) {
        console.error(`Erreur lors du chargement du persona ${key}:`, error);
        return [key, null];
      }
    })
  );
  
  // Filtrer les imports qui ont échoué et construire l'objet final
  imports
    .filter(([_, PersonaClass]) => PersonaClass !== null)
    .forEach(([key, PersonaClass]) => {
      personas[key] = PersonaClass;
    });
  
  return personas;
}

// Exporter une constante pour la compatibilité ascendante
const PERSONAS = PERSONA_PATHS;
export default PERSONAS; 