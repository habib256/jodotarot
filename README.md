# 🔮 JodoTarot - Application de Tirage de Tarot avec IA

![Logo JodoTarot](assets/images/personas/tarologue.png)

## ✨ Présentation

JodoTarot est une application web élégante et intuitive qui vous permet de réaliser des tirages de tarot en croix et d'obtenir des interprétations générées par intelligence artificielle. Inspirée par l'univers mystique du tarot, cette application combine l'art divinatoire traditionnel avec les technologies modernes d'IA pour vous offrir une expérience de consultation unique.

## 🌟 Fonctionnalités principales

- 🎴 **Tirage en croix** avec 5 cartes (influences positives, passé, situation actuelle, futur, influences négatives)
- 🧠 **Interprétation par IA** de votre tirage en fonction de votre question
- 👤 **Personnages variés** pour interpréter votre tirage (14 personas différents)
- 🔄 **Flexibilité des modèles d'IA** (OpenAI et modèles locaux Ollama)
- 📱 **Interface responsive** adaptée à tous les appareils
- 🖼️ **Visualisation claire** des cartes et de leur signification dans le tirage
- 🎨 **Choix de jeux de cartes** (Tarot de Marseille et Tarot Thiago Lehmann)

## 🎭 Les personas disponibles

JodoTarot propose 14 personnages différents pour interpréter votre tirage:

### Arts Divinatoires:
- 🔮 **Tarologue** - L'expert traditionnel du tarot
- ✨ **Oracle Mystique** - Porteur de messages des plans supérieurs
- 🎯 **Voyante Gitane** - Celle qui voit au-delà des apparences

### Traditions Spirituelles:
- ✝️ **Prêtre Exégète** - Interprète des textes sacrés chrétiens
- ✡️ **Rabbin Kabbaliste** - Érudit des mystères de la Kabbale
- ☪️ **Imam Soufi** - Guide spirituel dans la tradition islamique

### Traditions Ésotériques:
- 🌙 **Sorcière Ancestrale** - Gardienne des savoirs occultes
- ⚗️ **Alchimiste Ésotérique** - Maître des transformations intérieures
- 🌟 **Mage Élémentaliste** - Maître des forces de la nature

### Psychanalystes:
- 🛋️ **Sigmund Freud** - Père de la psychanalyse
- ☯️ **Carl Gustav Jung** - Explorateur de l'inconscient collectif
- 🔄 **Jacques Lacan** - Théoricien du symbolisme
- 👶 **Françoise Dolto** - Spécialiste de la psychanalyse de l'enfant

### Entités Surnaturelles:
- 😈 **Démon des Pactes** - Être des ténèbres offrant des vérités cachées

## 🃏 Les jeux de tarot

L'application propose deux jeux complets des 22 arcanes majeurs:

### Tarot de Marseille (set01)
Le jeu traditionnel avec ses illustrations classiques.

### Tarot Thiago Lehmann (set02)
Une interprétation artistique moderne des arcanes.

## 🤖 Modèles d'IA supportés

### OpenAI (nécessite une clé API):
- GPT-4o Mini
- GPT-3.5 Turbo (par défaut)
- GPT-4o

### Ollama (modèles locaux):
- Tous les modèles installés sur votre serveur Ollama local sont automatiquement détectés

## 🚀 Comment utiliser JodoTarot

1. **Posez votre question** dans le champ dédié
2. **Choisissez votre persona**, le **jeu de cartes** et le **modèle d'IA** souhaités
3. **Cliquez sur "Tirer les cartes"**
4. **Contemplez** le tirage qui s'affiche
5. **Lisez l'interprétation** générée par l'IA dans le style du persona choisi
6. **Cliquez sur une carte** pour l'agrandir et mieux l'observer

## 📸 Exemple de tirage

**Exemple de tirage en croix JodoTarot** (L'image illustre un tirage complet avec 5 cartes)

*L'image montre un tirage complet avec l'interprétation de chaque carte et leur signification dans les différentes positions: influences positives (La Force), passé (Le Chariot), situation actuelle (La Papesse), futur (La Roue) et influences négatives (L'Étoile).*

## ⚙️ Installation et configuration

1. Clonez ce dépôt sur votre serveur
2. Ouvrez le fichier `assets/js/config.js` et configurez votre clé API OpenAI: `const API_KEY = "Your OpenAI KEY";`
3. Pour utiliser les modèles Ollama, assurez-vous que le serveur Ollama est en cours d'exécution sur `http://localhost:11434`
4. Ouvrez `index.html` dans votre navigateur ou déployez l'application sur un serveur web

## 💡 Conseils d'utilisation

- Formulez des questions ouvertes et personnelles pour obtenir des interprétations plus pertinentes
- Expérimentez avec différents personas pour découvrir diverses perspectives sur votre tirage
- Les modèles plus avancés comme GPT-4o offrent généralement des interprétations plus nuancées
- Essayez les deux jeux de cartes pour voir lequel résonne le plus avec vous
- Prenez le temps de méditer sur chaque carte avant de lire l'interprétation complète

## 🔧 Caractéristiques techniques

- Application entièrement modulaire en JavaScript ES6
- Approche orientée composants avec séparation des responsabilités
- Interface utilisateur intuitive et réactive
- Système de cache pour les réponses d'IA afin d'optimiser les performances
- Support complet pour les modèles d'IA locaux (Ollama) et distants (OpenAI)

## 📝 Licence

JodoTarot est distribué sous licence GNU General Public License v3.0. Vous êtes libre de:
- Utiliser le logiciel
- Modifier le code source
- Distribuer le logiciel
- Distribuer vos modifications

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Inspiré par l'univers symbolique d'Alejandro Jodorowsky
- Personas créés spécifiquement pour cette application
- Technologie propulsée par les API OpenAI et Ollama

---

*"Le tarot ne prédit pas l'avenir, il aide à le créer." – Alejandro Jodorowsky*

---

## 🔮 Exemples d'arcanes de tarot

| <img src="assets/images/set01/13 La mort.png" alt="Carte de La Mort - Tarot de Marseille" width="250" /> | <img src="assets/images/set02/17 Etoile.jpg" alt="Carte de L'Étoile - Tarot Thiago Lehmann" width="250" /> | <img src="assets/images/set02/00 Le fou.jpg" alt="Carte du Fou - Tarot Thiago Lehmann" width="250" /> |
|:-------------------------:|:-------------------------:|:-------------------------:|
| **XIII - La Mort**<br>Tarot de Marseille | **XVII - L'Étoile**<br>Tarot Thiago Lehmann | **0 - Le Fou**<br>Tarot Thiago Lehmann |

Développé avec ❤️ pour les amateurs de tarot et d'exploration intérieure.

## 🔧 Dépannage

### Problèmes courants et solutions

1. **"Erreur de connexion à l'API OpenAI"**
   - Vérifiez que votre clé API est correcte et possède des crédits suffisants
   - Assurez-vous que votre connexion internet fonctionne correctement

2. **"Impossible de se connecter à Ollama"**
   - Vérifiez que le serveur Ollama est bien lancé: `ollama serve`
   - Assurez-vous qu'Ollama écoute sur le port 11434
   - Vérifiez que vous avez au moins un modèle installé: `ollama list`

3. **"Le tirage ne s'affiche pas correctement"**
   - Essayez de rafraîchir la page
   - Vérifiez que JavaScript est activé dans votre navigateur
   - Assurez-vous que le chemin vers les images est correct

4. **"L'interprétation est toujours la même"**
   - Essayez de poser des questions plus variées
   - Utilisez un modèle d'IA plus avancé (comme GPT-4o)
   - Alternez entre différents personas
