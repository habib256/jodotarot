# Construction des Prompts

## Vue d'ensemble

La construction des prompts est un élément crucial de JodoTarot. Le système utilise une approche modulaire pour assembler des prompts efficaces qui guident l'IA dans l'interprétation des tirages de tarot.

## Structure des Prompts

Un prompt complet est composé de plusieurs parties :

1. **Prompts Système** : Instructions générales pour l'IA
2. **Prompt du Persona** : Style et personnalité de l'interprète
3. **Contexte du Tirage** : Description des cartes et leur position
4. **Question de l'Utilisateur** : La question spécifique posée

## Assemblage du Prompt

```javascript
// Dans AIService.js, méthode getInterpretation
const systemPrompts = await this.buildSystemPrompts(persona, language, spreadType);
const prompt = this.buildPrompt(reading, question, language, spreadType);

// Pour le mode streaming d'Ollama
const fullPrompt = [
  ...systemPrompts,
  prompt
].join('\n\n');
```

### 1. Prompts Système

Les prompts système définissent le cadre général de l'interprétation :

```javascript
// Dans AIService.js, méthode buildSystemPrompts
async buildSystemPrompts(persona, language, spreadType) {
  try {
    const personaPrompt = await getPersonaPrompt(persona, language, spreadType);
    const metaPrompt = getMetaPrompt(language);
    
    const basePrompts = [
      metaPrompt,
      personaPrompt
    ];
    
    return basePrompts;
  } catch (error) {
    return [getMetaPrompt(language)];
  }
}
```

### 2. Prompt Principal

Le prompt principal combine :
- La description du tirage
- La question de l'utilisateur
- Le contexte spécifique

```javascript
// Dans AIService.js, méthode buildPrompt
buildPrompt(reading, question, language, spreadType = 'cross') {
  // Créer une instance temporaire du tirage pour générer une description
  const spreadInstance = createSpread(spreadType, null, language);
  
  // Copier les cartes dans l'instance de tirage
  spreadInstance.cards = [...reading];
  
  // Générer une description détaillée du tirage avec les cartes
  const spreadDescription = spreadInstance.generateReadingDescription(true);
  
  // Construction du prompt de base avec toutes les informations
  let promptBase = `${spreadDescription}\n\n`;
  
  // Enrichir le prompt avec la question et le texte d'emphase
  return enrichirPromptContextuel(question, promptBase, language);
}
```

## Enrichissement Contextuel

Le système enrichit les prompts avec des informations contextuelles :

```javascript
// Dans prompt.js, méthode enrichirPromptContextuel
function enrichirPromptContextuel(question, systemPrompt, langue = 'fr') {
  if (!question || !question.trim()) {
    return systemPrompt;
  }
  
  // Obtenir la traduction de l'introduction à la question
  const questionIntro = getTranslation('interpretation.userQuestion', langue);
  
  // Sélectionner le texte d'emphase dans la langue appropriée
  const emphaseTexte = getEmphasisText(langue);
  
  // Former le bloc d'emphase avec les délimiteurs et la question
  const questionBlock = `====================
${questionIntro}:
"${question.trim()}"
====================`;

  return `
${questionBlock}

${emphaseTexte}

${systemPrompt}`;
}
```

## Exemples de Prompts

### Prompt Système (Meta)

```javascript
// Exemple depuis la fonction getMetaPrompt dans prompt.js
function getMetaPrompt(langue = 'fr') {
  // Récupérer le prompt de base depuis le système de traductions
  return getTranslation('metaprompt.base', langue);
}
```

### Prompt de Persona

```javascript
// Exemple depuis TarologuePersona.js
class TarologuePersona extends BasePersona {
  constructor(language = 'fr') {
    super('tarologue', language);
    
    // Autres propriétés...
    
    this.promptTemplate = {
      'fr': `Vous êtes {{PERSONA_NAME}}, {{PERSONA_DESCRIPTION}}
      
Pour cette lecture de tarot en {{SPREAD_TYPE}}, adoptez le ton d'un tarologue expérimenté. 
Vos interprétations doivent refléter une connaissance approfondie de la symbolique traditionnelle des cartes.
Vous devez:
1. Examiner chaque carte individuellement, en expliquant sa signification générale et spécifique à sa position
2. Considérer l'orientation de chaque carte (à l'endroit ou renversée)
3. Établir des connections entre les cartes pour former une narration cohérente
4. Répondre directement à la question posée avec sagesse et clarté
5. Conclure par un conseil pratique`
    };
  }
}
```

## Bonnes Pratiques

1. **Clarté** : Instructions précises et non ambiguës
2. **Contexte** : Fournir suffisamment d'informations
3. **Structure** : Organisation logique des éléments
4. **Adaptation** : Flexibilité selon le modèle d'IA

## Personnalisation des Prompts

### Par Langue

```javascript
// Dans BasePersona.js, méthode buildSystemPrompt
buildSystemPrompt(spreadType = 'cross') {
  const template = this.promptTemplate[this.language] || this.promptTemplate['fr'] || '';
  
  // Remplacer les variables dans le template
  let formattedTemplate = template
    .replace('{{PERSONA_NAME}}', this.getName())
    .replace('{{PERSONA_DESCRIPTION}}', this.getDescription())
    .replace('{{SPREAD_TYPE}}', spreadType);
    
  // Ajouter les spécialisations
  if (this.specializations && this.specializations.length > 0) {
    if (this.language === 'fr') {
      formattedTemplate += `\n\nVos domaines d'expertise incluent: ${this.specializations.join(', ')}.`;
    } else {
      formattedTemplate += `\n\nYour areas of expertise include: ${this.specializations.join(', ')}.`;
    }
  }
  
  return formattedTemplate;
}
```

## Débogage des Prompts

Le mode "prompt" permet de voir le prompt final sans appel à l'IA :

```javascript
// Dans AIService.js, méthode getInterpretation
if (model === 'prompt') {
  console.log('📝 Mode Prompt activé : affichage du prompt sans appel à l\'IA');
  
  // Concaténer simplement les prompts système et utilisateur
  const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
  
  // Retourner du TEXTE BRUT (pas de HTML)
  this.isGenerating = false;
  return fullPrompt;
}
```

Il existe aussi un mode debug qui affiche les prompts dans la console :

```javascript
// Dans AIService.js, méthode getInterpretation
if (this.debugMode) {
  // Construire le prompt complet comme il sera envoyé à l'IA
  const fullPrompt = `${systemPrompts.join('\n\n')}\n\n${prompt}`;
  
  console.log('📨 PROMPT FINAL ENVOYÉ À L\'IA:');
  console.log(fullPrompt);
  
  // Afficher des informations sur le persona
  if (PERSONAS[persona]) {
    const personaInstance = new PERSONAS[persona](language);
    console.log(`🧙‍♂️ Persona: ${personaInstance.getName()}`);
    console.log(`📝 Description: ${personaInstance.getDescription()}`);
    console.log(`🔮 Spécialisations: ${personaInstance.getSpecializations().join(', ')}`);
  }
}
```

## Évolutions Futures

1. **Templates dynamiques** : Système de templates plus flexible
2. **Apprentissage** : Amélioration basée sur les retours
3. **Multilinguisme** : Support de plus de langues
4. **Personnalisation** : Plus d'options de personnalisation
5. **Optimisation** : Réduction de la consommation de tokens 