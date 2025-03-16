# 🔧 Guide de Dépannage

## 🚨 Problèmes Courants

### 1. Problèmes de Connexion API

#### Erreur de connexion à l'API OpenAI
- ✔️ Vérifiez votre clé API dans `config.js`
- ✔️ Assurez-vous d'avoir des crédits suffisants
- ✔️ Vérifiez votre connexion internet
- ✔️ Utilisez le test de connectivité intégré

#### Impossible de se connecter à Ollama
- ✔️ Vérifiez que le serveur est lancé : `ollama serve`
- ✔️ Confirmez le port 11434 est disponible
- ✔️ Vérifiez l'installation des modèles : `ollama list`
- ✔️ Testez la connexion avec le bouton dédié

### 2. Problèmes d'Affichage

#### Le tirage ne s'affiche pas
- ✔️ Rafraîchissez la page
- ✔️ Vérifiez que JavaScript est activé
- ✔️ Contrôlez les chemins des images
- ✔️ Consultez la console développeur (F12)

#### Images manquantes
- ✔️ Vérifiez les chemins dans `assets/images/`
- ✔️ Contrôlez les permissions des dossiers
- ✔️ Assurez-vous que les fichiers existent
- ✔️ Vérifiez les extensions des fichiers

### 3. Problèmes d'Interprétation

#### Interprétation incomplète
- ✔️ Vérifiez votre connexion internet
- ✔️ Essayez un autre modèle d'IA
- ✔️ Vérifiez la RAM disponible
- ✔️ Utilisez le bouton de régénération

#### Erreurs de langue
- ✔️ Attendez le chargement complet
- ✔️ Rafraîchissez après changement
- ✔️ Vérifiez la compatibilité du modèle
- ✔️ Contrôlez les fichiers de traduction

## 🛠️ Outils de Diagnostic

### Test de Connectivité
```javascript
async function testConnectivity() {
  try {
    const response = await fetch('/api/test');
    return response.ok;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return false;
  }
}
```

### Vérification des Ressources
```javascript
function checkResources() {
  const images = document.getElementsByTagName('img');
  const failed = Array.from(images).filter(img => !img.complete);
  return failed.length === 0;
}
```

## 📝 Logs et Débogage

### Activation des Logs Détaillés
```javascript
localStorage.setItem('DEBUG', 'true');
```

### Console Développeur
1. Ouvrez les outils développeur (F12)
2. Sélectionnez l'onglet "Console"
3. Filtrez par "Error" pour voir les erreurs
4. Vérifiez les messages d'avertissement

## 🔄 Réinitialisation

### Cache du Navigateur
1. Ouvrez les paramètres
2. Effacez les données de navigation
3. Sélectionnez uniquement le cache
4. Cliquez sur "Effacer les données"

### Préférences Utilisateur
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 📞 Support

### Contact
- 📧 Email : support@jodotarot.com
- 💬 Discord : [JodoTarot Community](https://discord.gg/jodotarot)
- 🐙 GitHub : [Issues](https://github.com/habib256/jodotarot/issues)

### Rapporter un Bug
1. Décrivez le problème
2. Fournissez les étapes de reproduction
3. Ajoutez captures d'écran si possible
4. Indiquez votre environnement 