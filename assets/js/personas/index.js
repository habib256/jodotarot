/**
 * Point d'entrée pour tous les personas
 * Ce fichier importe tous les personas individuels et les exporte dans une structure unifiée
 */

// Import des personas
import tarologue from './tarologue.js';
import oracle from './oracle.js';
import voyante from './voyante.js';
import pretre from './pretre.js';
import rabbin from './rabbin.js';
import imam from './imam.js';
import sorciere from './sorciere.js';
import alchimiste from './alchimiste.js';
import mage from './mage.js';
import freud from './freud.js';
import jung from './jung.js';
import lacan from './lacan.js';
import dolto from './dolto.js';
import demon from './demon.js';
import noegoman from './noegoman.js';
import socrate from './socrate.js';
import salomon from './salomon.js';
import quichotte from './quichotte.js';
import montaigne from './montaigne.js';

// Construction de la structure PERSONAS
const PERSONAS = {
  fr: {
    tarologue: tarologue.fr,
    oracle: oracle.fr,
    voyante: voyante.fr,
    pretre: pretre.fr,
    rabbin: rabbin.fr,
    imam: imam.fr,
    sorciere: sorciere.fr,
    alchimiste: alchimiste.fr,
    mage: mage.fr,
    freud: freud.fr,
    jung: jung.fr,
    lacan: lacan.fr,
    dolto: dolto.fr,
    demon: demon.fr,
    noegoman: noegoman.fr,
    socrate: socrate.fr,
    salomon: salomon.fr,
    quichotte: quichotte.fr,
    montaigne: montaigne.fr
  },
  en: {
    tarologue: tarologue.en,
    oracle: oracle.en,
    voyante: voyante.en,
    pretre: pretre.en,
    rabbin: rabbin.en,
    imam: imam.en,
    sorciere: sorciere.en,
    alchimiste: alchimiste.en,
    mage: mage.en,
    freud: freud.en,
    jung: jung.en,
    lacan: lacan.en,
    dolto: dolto.en,
    demon: demon.en,
    noegoman: noegoman.en,
    socrate: socrate.en,
    salomon: salomon.en,
    quichotte: quichotte.en,
    montaigne: montaigne.en
  },
  es: {
    tarologue: tarologue.es,
    oracle: oracle.es,
    voyante: voyante.es,
    pretre: pretre.es,
    rabbin: rabbin.es,
    imam: imam.es,
    sorciere: sorciere.es,
    alchimiste: alchimiste.es,
    mage: mage.es,
    freud: freud.es,
    jung: jung.es,
    lacan: lacan.es,
    dolto: dolto.es,
    demon: demon.es,
    noegoman: noegoman.es,
    socrate: socrate.es,
    salomon: salomon.es,
    quichotte: quichotte.es,
    montaigne: montaigne.es
  },
  de: {
    tarologue: tarologue.de,
    oracle: oracle.de,
    voyante: voyante.de,
    pretre: pretre.de,
    rabbin: rabbin.de,
    imam: imam.de,
    sorciere: sorciere.de,
    alchimiste: alchimiste.de,
    mage: mage.de,
    freud: freud.de,
    jung: jung.de,
    lacan: lacan.de,
    dolto: dolto.de,
    demon: demon.de,
    noegoman: noegoman.de,
    socrate: socrate.de,
    salomon: salomon.de,
    quichotte: quichotte.de,
    montaigne: montaigne.de
  },
  it: {
    tarologue: tarologue.it,
    oracle: oracle.it,
    voyante: voyante.it,
    pretre: pretre.it,
    rabbin: rabbin.it,
    imam: imam.it,
    sorciere: sorciere.it,
    alchimiste: alchimiste.it,
    mage: mage.it,
    freud: freud.it,
    jung: jung.it,
    lacan: lacan.it,
    dolto: dolto.it,
    demon: demon.it,
    noegoman: noegoman.it,
    socrate: socrate.it,
    salomon: salomon.it,
    quichotte: quichotte.it,
    montaigne: montaigne.it
  }
};

/**
 * Récupère le prompt d'un persona dans la langue spécifiée
 * @param {string} personaKey - Clé du persona
 * @param {string} lang - Code de langue (fr, en, es, de, it)
 * @returns {string} - Le prompt du persona
 */
function getPersonaPrompt(personaKey, lang = 'fr') {
  // Si la langue n'est pas supportée ou si le persona n'existe pas dans cette langue, utiliser le français par défaut
  if (!PERSONAS[lang] || !PERSONAS[lang][personaKey]) {
    return PERSONAS['fr'][personaKey] || '';
  }
  
  return PERSONAS[lang][personaKey];
}

export default PERSONAS;
export { getPersonaPrompt }; 