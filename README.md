# 🔮 JodoTarot - Application de Tirage de Tarot avec IA

![Logo JodoTarot](personas/tarologue.png)

## ✨ Présentation

JodoTarot est une application web élégante et intuitive qui vous permet de réaliser des tirages de tarot en croix et d'obtenir des interprétations générées par intelligence artificielle. Inspirée par l'univers mystique du tarot, cette application combine l'art divinatoire traditionnel avec les technologies modernes d'IA pour vous offrir une expérience de consultation unique.

## 🌟 Fonctionnalités principales

- 🎴 **Tirage en croix** avec 5 cartes (influences positives, passé, situation actuelle, futur, influences négatives)
- 🧠 **Interprétation par IA** de votre tirage en fonction de votre question
- 👤 **Personnages variés** pour interpréter votre tirage (10 personas différents)
- 🔄 **Flexibilité des modèles d'IA** (OpenAI et modèles locaux Ollama)
- 📱 **Interface responsive** adaptée à tous les appareils
- 🖼️ **Visualisation claire** des cartes et de leur signification dans le tirage

## 🎭 Les personas disponibles

JodoTarot propose 10 personnages différents pour interpréter votre tirage:

### Univers mystique et ésotérique:
- 🔮 **Tarologue** - L'expert traditionnel du tarot
- ✨ **Oracle Mystique** - Porteur de messages des plans supérieurs
- 🌙 **Sorcière Ancestrale** - Gardienne des savoirs occultes
- ⚗️ **Alchimiste Ésotérique** - Maître des transformations intérieures
- 🎯 **Voyante Gitane** - Celle qui voit au-delà des apparences
- 🌟 **Mage Élémentaliste** - Maître des forces de la nature

### Approche psychanalytique:
- 🛋️ **Sigmund Freud** - Père de la psychanalyse
- ☯️ **Carl Gustav Jung** - Explorateur de l'inconscient collectif
- 🔄 **Jacques Lacan** - Théoricien du symbolisme
- 👶 **Françoise Dolto** - Spécialiste de la psychanalyse de l'enfant

## 🃏 Le jeu de tarot

L'application utilise un jeu complet des 22 arcanes majeurs du tarot de Marseille:

- 00 Le Fou
- 01 Le Bateleur
- 02 La Papesse
- 03 L'Impératrice
- 04 L'Empereur
- 05 Le Pape
- 06 Les Amoureux
- 07 Le Chariot
- 08 La Justice
- 09 L'Ermite
- 10 La Roue de Fortune
- 11 La Force
- 12 Le Pendu
- 13 La Mort
- 14 La Tempérance
- 15 Le Diable
- 16 La Tour
- 17 L'Étoile
- 18 La Lune
- 19 Le Soleil
- 20 Le Jugement
- 21 Le Monde

## 🤖 Modèles d'IA supportés

### OpenAI (nécessite une clé API):
- GPT-4o Mini
- GPT-3.5 Turbo (par défaut)
- GPT-4o

### Ollama (modèles locaux):
- Tous les modèles installés sur votre serveur Ollama local sont automatiquement détectés

## 🚀 Comment utiliser JodoTarot

1. **Posez votre question** dans le champ dédié
2. **Choisissez votre persona** et le **modèle d'IA** souhaité
3. **Cliquez sur "Tirer les cartes"**
4. **Contemplez** le tirage qui s'affiche
5. **Lisez l'interprétation** générée par l'IA dans le style du persona choisi
6. **Cliquez sur une carte** pour l'agrandir et mieux l'observer

## ⚙️ Installation et configuration

1. Clonez ce dépôt sur votre serveur
2. Ouvrez le fichier `model.js` et configurez votre clé API OpenAI: `const API_KEY = "Your OpenAI KEY";`
3. Pour utiliser les modèles Ollama, assurez-vous que le serveur Ollama est en cours d'exécution sur `http://localhost:11434`
4. Ouvrez `index.html` dans votre navigateur ou déployez l'application sur un serveur web

## 💡 Conseils d'utilisation

- Formulez des questions ouvertes et personnelles pour obtenir des interprétations plus pertinentes
- Expérimentez avec différents personas pour découvrir diverses perspectives sur votre tirage
- Les modèles plus avancés comme GPT-4o offrent généralement des interprétations plus nuancées
- Prenez le temps de méditer sur chaque carte avant de lire l'interprétation complète

## 📝 Licence

JodoTarot est distribué sous licence GNU General Public License v3.0. Vous êtes libre de:
- Utiliser le logiciel
- Modifier le code source
- Distribuer le logiciel
- Distribuer vos modifications

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Inspiré par l'univers symbolique d'Alejandro Jodorowsky
- Cartes de tarot et personas créés spécifiquement pour cette application
- Technologie propulsée par les API OpenAI et Ollama

---

*"Le tarot ne prédit pas l'avenir, il aide à le créer." – Alejandro Jodorowsky*

---

## 🔮 Capture d'écran

![Capture d'écran de JodoTarot](personas/tarologue.png)

---

Développé avec ❤️ pour les amateurs de tarot et d'exploration intérieure.
