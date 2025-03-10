/**
 * Exporte tous les personas disponibles dans l'application
 */

import TarologuePersona from './TarologuePersona.js';
import OraclePersona from './OraclePersona.js';
import VoyantePersona from './VoyantePersona.js';
import PretrePersona from './PretrePersona.js';
import RabbinPersona from './RabbinPersona.js';
import ImamPersona from './ImamPersona.js';
import DalailamaPersona from './DalailamaPersona.js';
import FrancmaconPersona from './FrancmaconPersona.js';
import SorcierePersona from './SorcierePersona.js';
import AlchimistePersona from './AlchimistePersona.js';
import MagePersona from './MagePersona.js';
import FreudPersona from './FreudPersona.js';
import JungPersona from './JungPersona.js';
import LacanPersona from './LacanPersona.js';
import DoltoPersona from './DoltoPersona.js';
import SocratePersona from './SocratePersona.js';
import SalomonPersona from './SalomonPersona.js';
import MontaignePersona from './MontaignePersona.js';
import QuichottePersona from './QuichottePersona.js';
import DemonPersona from './DemonPersona.js';
import NoEgoPersona from './NoEgoPersona.js';

// Objet contenant tous les personas indexés par leur clé
const PERSONAS = {
  tarologue: TarologuePersona,
  oracle: OraclePersona,
  voyante: VoyantePersona,
  pretre: PretrePersona,
  rabbin: RabbinPersona,
  imam: ImamPersona,
  dalailama: DalailamaPersona,
  francmacon: FrancmaconPersona,
  sorciere: SorcierePersona,
  alchimiste: AlchimistePersona,
  mage: MagePersona,
  freud: FreudPersona,
  jung: JungPersona,
  lacan: LacanPersona,
  dolto: DoltoPersona,
  socrate: SocratePersona,
  salomon: SalomonPersona,
  montaigne: MontaignePersona,
  quichotte: QuichottePersona,
  demon: DemonPersona,
  noegoman: NoEgoPersona
};

/**
 * Obtient le prompt système pour un persona spécifique
 * @param {string} personaKey - Clé du persona
 * @param {string} langue - Code de langue
 * @param {string} spreadType - Type de tirage
 * @returns {string} - Le prompt système formaté
 */
function getPersonaPrompt(personaKey, langue, spreadType = 'cross') {
  // Vérifier si le persona existe
  if (!PERSONAS[personaKey]) {
    console.error(`Persona non trouvé: ${personaKey}`);
    personaKey = 'tarologue'; // Utiliser le tarologue par défaut
  }
  
  // Créer une instance du persona avec la langue spécifiée
  const persona = new PERSONAS[personaKey](langue);
  
  // Retourner le prompt système
  return persona.buildSystemPrompt(spreadType);
}

// Exporter les personas et la fonction utilitaire
export default PERSONAS;
export { getPersonaPrompt }; 