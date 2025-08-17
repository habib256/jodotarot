# 🔧 Guide de Dépannage

## 🚨 Problèmes Courants

### 1. Problèmes de Connexion API

#### Erreur de connexion à l'API OpenAI
- ✔️ Vérifiez votre clé API dans `config.js` (variable `SETTINGS.API_KEY`)
- ✔️ Assurez-vous d'avoir des crédits suffisants sur votre compte OpenAI
- ✔️ Vérifiez votre connexion internet
- ✔️ Vérifiez que `SETTINGS.OPENAI_URL` pointe vers la bonne URL

#### Impossible de se connecter à Ollama
- ✔️ Vérifiez que le serveur Ollama est lancé : `ollama serve`
- ✔️ Confirmez que le port 11434 est disponible 
- ✔️ Vérifiez l'installation des modèles avec : `ollama list`
- ✔️ Assurez-vous que `SETTINGS.OLLAMA_URL` est correctement configuré (par défaut "http://localhost:11434")
- ✔️ Vérifiez les timeouts dans `config.js` (variables `TIMEOUTS`)

### 2. Problèmes d'Affichage

#### Le tirage ne s'affiche pas
- ✔️ Rafraîchissez la page
- ✔️ Vérifiez que JavaScript est activé dans votre navigateur
- ✔️ Contrôlez les chemins des images dans les fichiers CSS
- ✔️ Consultez la console développeur (F12) pour identifier les erreurs

#### Images manquantes
- ✔️ Vérifiez les chemins dans `assets/images/`
- ✔️ Contrôlez les permissions des dossiers
- ✔️ Assurez-vous que les fichiers existent et ont les bonnes extensions
- ✔️ Vérifiez les URLs relatives dans le code CSS et JS

### 3. Problèmes d'Interprétation

#### Interprétation incomplète
- ✔️ Vérifiez votre connexion internet
- ✔️ Essayez un autre modèle d'IA dans les paramètres
- ✔️ Vérifiez que le modèle Ollama est correctement chargé
- ✔️ Consultez `SETTINGS.MAX_TOKENS` dans `config.js` (augmentez si nécessaire)
- ✔️ Vérifiez `DEBUG_LEVEL` dans `config.js` pour activer plus de logs

#### Erreurs de langue
- ✔️ Attendez le chargement complet des traductions
- ✔️ Vérifiez que le fichier de traduction existe dans `assets/js/translations/`
- ✔️ Assurez-vous que `SETTINGS.DEFAULT_LANGUAGE` est correctement configuré
- ✔️ Vérifiez la compatibilité du modèle avec la langue sélectionnée

## 🛠️ Outils de Diagnostic

### Vérification de la Configuration
```javascript
// Dans la console du navigateur
console.log(window.JODOTAROT_SETTINGS);
```

### Activation du Débogage
```javascript
// Dans la console du navigateur, le niveau de debug est défini dans config.js
// Modifiez DEBUG_LEVEL à 2 ou 3 pour plus de détails puis rechargez
```

### Vérification des Modèles Ollama
```javascript
// Dans la console du navigateur
async function checkOllamaModels() {
  try {
    const response = await fetch(`${SETTINGS.OLLAMA_URL}/api/tags`);
    const data = await response.json();
    console.log('Modèles Ollama disponibles:', data.models);
    return data.models;
  } catch (error) {
    console.error('Erreur de connexion à Ollama:', error);
    return [];
  }
}
checkOllamaModels();
```

## 📝 Logs et Débogage

### Niveaux de Débogage
Le système utilise plusieurs niveaux de débogage configurés dans `config.js` :
```javascript
// Dans config.js
const DEBUG_LEVEL = 1; // 0: aucun, 1: basique, 2: détaillé, 3: verbeux
```

### Console Développeur
1. Ouvrez les outils développeur (F12)
2. Sélectionnez l'onglet "Console"
3. Filtrez par "Error" pour voir les erreurs
4. Recherchez les messages préfixés par 🔍 pour les logs de débogage

### Lire les Logs Spécifiques
```javascript
// Dans la console du navigateur
// Filtrer les logs spécifiques à l'IA
console.filter('IA');
// Filtrer les logs spécifiques au StateManager
console.filter('StateManager');
```

## 🔄 Réinitialisation

### Cache du Navigateur
1. Ouvrez les paramètres du navigateur
2. Accédez à "Confidentialité et sécurité" ou équivalent
3. Sélectionnez "Effacer les données de navigation"
4. Cochez "Images et fichiers en cache"
5. Cliquez sur "Effacer les données"

### Réinitialisation Complète
```javascript
// Dans la console du navigateur
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

### Reload Forcé
Pour recharger la page sans utiliser le cache :
- Windows/Linux: Ctrl+F5 ou Ctrl+Shift+R
- Mac: Cmd+Shift+R

## 🔎 Vérification du Système

### Modèles Disponibles
Vérifiez les modèles disponibles dans la configuration :
```javascript
// Dans la console du navigateur
console.log('Modèles toujours disponibles:', SETTINGS.ALWAYS_AVAILABLE_MODELS);
console.log('Modèle par défaut:', SETTINGS.DEFAULT_MODEL);
```

### Paramètres Réseau
Le système utilise plusieurs timeouts configurés dans `config.js` :
```javascript
// Dans config.js
const TIMEOUTS = {
  OLLAMA_CONNECT: 30000,    // 30 secondes pour la connexion
  OLLAMA_RESPONSE: 120000,  // 120 secondes pour la génération
  MAX_RETRIES: 3,           // Nombre maximum de tentatives
  // ...autres timeouts
};
```

## 📞 Support

### Contact
- 📧 Email : support@jodotarot.com
- 💬 Discord : [JodoTarot Community](https://discord.gg/jodotarot)
- 🐙 GitHub : [Issues](https://github.com/habib256/jodotarot/issues)

### Rapporter un Bug
1. Décrivez précisément le problème rencontré
2. Fournissez les étapes détaillées pour reproduire le problème
3. Ajoutez des captures d'écran si possible
4. Indiquez votre navigateur, système d'exploitation et configuration 