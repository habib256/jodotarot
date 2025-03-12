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
const fullPrompt = [
  ...systemPrompts,  // Instructions générales
  prompt            // Question et contexte
].join('\n\n');
```

### 1. Prompts Système

Les prompts système définissent le cadre général de l'interprétation :

```javascript
const systemPrompts = [
  getMetaPrompt(language),      // Instructions générales
  getPersonaPrompt(persona)     // Personnalité de l'interprète
];
```

### 2. Prompt Principal

Le prompt principal combine :
- La description du tirage
- La question de l'utilisateur
- Le contexte spécifique

```javascript
const prompt = buildPrompt(reading, question, language, spreadType);
```

## Enrichissement Contextuel

Le système enrichit les prompts avec des informations contextuelles :

1. **Emphase** : Mise en valeur des éléments importants
2. **Formatage** : Structuration claire des informations
3. **Adaptation linguistique** : Ajustement selon la langue

## Exemples de Prompts

### Prompt Système (Meta)

```
En tant qu'interprète de tarot, vous devez :
1. Analyser chaque carte dans son contexte
2. Considérer les relations entre les cartes
3. Fournir une interprétation cohérente
4. Adapter le ton selon le persona choisi
```

### Prompt de Persona

```
Vous êtes un tarologue expérimenté avec :
- 30 ans de pratique
- Une approche psychologique
- Un style bienveillant et professionnel
```

### Description du Tirage

```
Tirage en croix avec :
1. Centre : Le Bateleur (position actuelle)
2. Nord : La Papesse (influences passées)
3. Est : L'Impératrice (influences futures)
...
```

## Bonnes Pratiques

1. **Clarté** : Instructions précises et non ambiguës
2. **Contexte** : Fournir suffisamment d'informations
3. **Structure** : Organisation logique des éléments
4. **Adaptation** : Flexibilité selon le modèle d'IA

## Personnalisation des Prompts

### Par Langue

```javascript
const metaPrompt = {
  fr: "En tant qu'interprète de tarot...",
  en: "As a tarot interpreter...",
  // autres langues...
};
```

### Par Type de Tirage

```javascript
const spreadPrompts = {
  cross: "Tirage en croix traditionnel...",
  simple: "Tirage simple à trois cartes...",
  // autres types...
};
```

## Optimisation des Prompts

1. **Longueur** : Équilibre entre détail et concision
2. **Température** : Ajustement selon le besoin de créativité
3. **Formatage** : Structure claire pour l'IA
4. **Mots-clés** : Utilisation de termes spécifiques

## Débogage des Prompts

Pour faciliter le débogage, le mode "prompt" permet de voir le prompt final :

```javascript
if (model === 'prompt') {
  return `
    <div class="prompt-display">
      <h3>Mode Prompt</h3>
      <div class="system-prompts">
        <h4>Prompts système :</h4>
        <pre>${systemPrompts.join('\n\n')}</pre>
      </div>
      <div class="user-prompt">
        <h4>Prompt utilisateur :</h4>
        <pre>${prompt}</pre>
      </div>
    </div>
  `;
}
```

## Évolutions Futures

1. **Templates dynamiques** : Système de templates plus flexible
2. **Apprentissage** : Amélioration basée sur les retours
3. **Multilinguisme** : Support de plus de langues
4. **Personnalisation** : Plus d'options de personnalisation
5. **Optimisation** : Réduction de la consommation de tokens 