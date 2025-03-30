# 🔮 JodoTarot - Application de Tirage de Tarot avec IA

![Logo JodoTarot](assets/images/personas/tarologue.png)

## ✨ Présentation

JodoTarot est une application web élégante et intuitive qui vous permet de réaliser des tirages de tarot et d'obtenir des interprétations générées par intelligence artificielle. Inspirée par l'univers mystique du tarot, cette application combine l'art divinatoire traditionnel avec les technologies modernes d'IA pour vous offrir une expérience de consultation unique.

[Essayer JodoTarot](https://habib256.github.io/jodotarot/index.html) | [Documentation complète](docs/index.md) | [Guide de dépannage](docs/troubleshooting.md)

## 🚀 Guide rapide

1. **Choisissez votre langue** dans le menu déroulant
2. **Posez votre question** dans le champ dédié
3. **Sélectionnez** votre persona, jeu de cartes et type de tirage
4. **Cliquez sur "Tirer les cartes"**
5. **Explorez** l'interprétation générée par l'IA

## 🌟 Fonctionnalités principales

- 🎴 **4 types de tirages** (Croix Celtique, Croix, Fer à cheval, Amour)
- 🧠 **Interprétation par IA** personnalisée
- 👤 **[Multiples personas](docs/composants/personas.md)** pour des lectures variées
- 🎨 **4 jeux de tarot** (Marseille, Thiago Lehmann, Renaissance, Rick & Morty)
- 🌍 **6 langues** supportées
- 🤖 **Modèles d'IA** flexibles (OpenAI et Ollama)

## 🃏 Aperçu des jeux

| <img src="assets/images/cards/marseille/13_La_mort.png" alt="La Mort" width="200" /> | <img src="assets/images/cards/renaissance/13_La_mort.png" alt="La Mort" width="200" /> |
|:-------------------------:|:-------------------------:|
| **Tarot de Marseille** | **Tarot Renaissance** |

| <img src="assets/images/cards/rick&morty/13_La_mort.png" alt="La Mort" width="200" /> | <img src="assets/images/cards/lehmann/17_Etoile.jpg" alt="L'Étoile" width="200" /> |
|:-------------------------:|:-------------------------:|
| **Tarot Rick & Morty** | **Tarot Thiago Lehmann** |

## ⚙️ Installation et configuration

1. Clonez ce dépôt
2. Configurez votre clé API dans `assets/js/config.js` (variable `SETTINGS.API_KEY`)
3. Pour utiliser Ollama, vérifiez que le service est lancé (`ollama serve`)
4. Ouvrez `index.html` dans votre navigateur

Pour plus de détails sur l'installation et la configuration, consultez notre [guide technique](docs/index.md).

## 🔧 Besoin d'aide ?

Si vous rencontrez des problèmes :
- Consultez notre [guide de dépannage](docs/troubleshooting.md)
- Explorez la [documentation complète](docs/index.md)
- Découvrez nos [personas](docs/composants/personas.md)
- Vérifiez les [paramètres de configuration](docs/troubleshooting.md#vérification-de-la-configuration)

## 📝 Licence

JodoTarot est distribué sous licence GNU General Public License v3.0.

---

*"Le tarot ne prédit pas l'avenir, il aide à le créer." – Alejandro Jodorowsky*

Développé avec ❤️ pour les amateurs de tarot et d'exploration intérieure.
