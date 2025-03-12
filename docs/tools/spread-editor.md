# Éditeur de Positions de Cartes (Spread Editor)

## Présentation

L'Éditeur de Positions des Cartes (`spread-editor.html`) est un outil autonome en HTML/CSS/JavaScript qui permet de définir visuellement les positions des cartes pour les différents types de tirages de JodoTarot.

![Aperçu de l'éditeur](../images/spread-editor-preview.png)

## Fonctionnalités Principales

- **Interface visuelle interactive** permettant de déplacer les cartes à la souris
- **Contrôle de rotation** pour orienter les cartes à différents angles
- **Adaptation automatique aux dimensions de l'écran** utilisant les media queries
- **Génération automatique de variables CSS** prêtes à être copiées dans `variables.css`
- **Comparaison en temps réel** avec les positions initiales pour n'afficher que les modifications
- **Support des 4 types de tirages** : Croix, Fer à Cheval, Amour et Croix Celtique
- **Contrôle des dimensions des cartes** via des curseurs interactifs

## Architecture Technique

Cet outil suit l'architecture de "variables.css comme source unique de vérité" en générant des variables CSS optimisées pour le positionnement des cartes. Les positions sont exprimées en pourcentages pour assurer une adaptabilité à toutes les tailles d'écran.

### Principes Architecturaux

1. **Utilisation des variables CSS** comme source de vérité pour les positions
2. **Pas de redéfinition** des variables déjà présentes dans `variables.css`
3. **Génération de variables CSS** à copier dans `variables.css`
4. **Adaptation automatique** selon les media queries

### Structure du Code

L'outil est contenu dans un seul fichier HTML (`tools/spread-editor.html`) qui comprend :

- **HTML** : Structure de l'interface utilisateur
- **CSS** : Styles intégrés dans une balise `<style>`
- **JavaScript** : Logique interactive dans une balise `<script>`

## Utilisation

### Interface Utilisateur

1. **Sélection du type de tirage** via le menu déroulant en haut
2. **Déplacement des cartes** par glisser-déposer
3. **Ajustement de la rotation** via les contrôles associés à chaque carte
4. **Contrôle des dimensions** via les curseurs au bas de l'interface
5. **Copie du CSS généré** via le bouton de copie

### Génération de CSS

L'éditeur génère des variables CSS au format standardisé :

```css
/* Exemple de sortie générée par l'éditeur */
--cross-position-1-x: 50%;  /* center */
--cross-position-1-y: 50%;
--cross-position-2-x: 50%;  /* top */
--cross-position-2-y: 20%;
--cross-position-3-x: 80%;  /* right */
--cross-position-3-y: 50%;
/* etc. */
```

Ces variables respectent la convention de nommage définie dans le document [Conventions de Nommage CSS](../standards/css-naming-conventions.md).

### Mode Comparaison

Une caractéristique importante de l'éditeur est sa capacité à comparer les positions actuelles avec les positions initiales, et à n'afficher que les variables qui ont été modifiées. Cela facilite l'intégration des changements dans `variables.css` sans duplication.

## Architecture Technique Détaillée

### Gestion du Glisser-Déposer

Le système de déplacement des cartes utilise des gestionnaires d'événements pour les actions utilisateur :

1. **mousedown** : Initialisation du déplacement
2. **mousemove** : Suivi du mouvement
3. **mouseup** : Finalisation du déplacement

Les positions sont calculées en pourcentages par rapport à la zone de tirage, assurant ainsi une adaptabilité à différentes tailles d'écran.

### Génération Dynamique du CSS

Le processus de génération du CSS comprend :

1. Récupération des positions actuelles de chaque carte
2. Comparaison avec les valeurs initiales
3. Génération des déclarations CSS uniquement pour les valeurs modifiées
4. Formatage du résultat avec des commentaires explicatifs

### Système de Positionnement

L'éditeur utilise un système de coordonnées relatives à la zone de tirage :

- X : 0% (gauche) à 100% (droite)
- Y : 0% (haut) à 100% (bas)
- Rotation : -180° à 180°

Ces coordonnées sont ensuite traduites en variables CSS selon la convention établie.

## Bonnes Pratiques pour l'Utilisation

1. **Préservation de la Cohérence** : Maintenir une disposition intuitive et cohérente entre les différents tirages
2. **Adaptation Mobile** : Tester les positions sur différentes tailles d'écran
3. **Documentation** : Commenter les changements significatifs
4. **Sauvegarde** : Copier le CSS généré avant de fermer l'éditeur
5. **Mise à Jour Progressive** : Intégrer les changements par petit groupes dans `variables.css`

## Réalisations Techniques

L'éditeur démontre plusieurs concepts avancés :

- **Architecture orientée composants** avec séparation des responsabilités
- **Interface réactive** offrant un feedback visuel immédiat
- **Génération dynamique de code** avec formatage optimisé
- **Système de comparaison** pour n'afficher que les différences pertinentes
- **Application des principes DRY** (Don't Repeat Yourself) dans la conception

## Limitations Actuelles et Évolutions Futures

- Pas de sauvegarde automatique (nécessite une copie manuelle)
- Interface basique sans thème sophistiqué
- Pas d'import direct depuis un fichier CSS existant
- Éventuelles évolutions : ajout d'un système de préréglages, sauvegarde locale, export en fichier 