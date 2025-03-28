# Structure des Cartes de Tarot

Ce dossier contient les différents styles de cartes de tarot utilisés dans l'application.

## Organisation des Fichiers

```
assets/images/cards/
├── marseille/           # Jeu Marseille (majors uniquement)
│   ├── 00 Le fou.png
│   ├── 01 Bateleur.png
│   └── ...
├── lehmann/            # Jeu Lehmann (majors uniquement)
│   ├── 00 Le fou.jpg
│   ├── 01 Bateleur.jpg
│   └── ...
└── renaissance/        # Jeu Renaissance (majors + minors)
    ├── 00 Le fou.png
    ├── 01 Bateleur.png
    ├── ...
    └── minor/          # Arcanes mineurs
        ├── ace of wands.png
        ├── two of cups.png
        └── ...
```

## Structure des Cartes

### Arcanes Majeurs
- Format de nom de fichier : `XX Nom.png` (où XX est le numéro sur 2 chiffres)
- Numérotation : 00-21 (Le Fou à Le Monde)
- Dos de carte : `22 Dos de carte.png`

### Arcanes Mineurs
- Format de nom de fichier : `rank of suit.png`
- Suites :
  - Wands (Bâtons)
  - Cups (Coupes)
  - Swords (Épées)
  - Pentacles (Deniers)
- Rangs :
  - Ace (As)
  - Two (2) à Ten (10)
  - Page
  - Knight (Cavalier)
  - Queen (Reine)
  - King (Roi)

## Conventions de Nommage

### IDs des Cartes
- Arcanes majeurs : `MXX` (ex: `M00` pour Le Fou)
- Arcanes mineurs : `[Suit][Rank]` (ex: `WK` pour Roi de Bâtons)

### Noms de Fichiers
- Arcanes majeurs : `XX Nom.png`
- Arcanes mineurs : `rank of suit.png`

## Ajout d'un Nouveau Style

Pour ajouter un nouveau style de cartes :

1. Créer un nouveau dossier dans `assets/images/cards/`
2. Ajouter les arcanes majeurs avec le format de nommage standard
3. Si le style supporte les arcanes mineurs :
   - Créer un sous-dossier `minor/`
   - Ajouter les 56 cartes mineures avec le format de nommage standard
4. Mettre à jour le service de gestion des cartes (`DeckService.js`) pour inclure le nouveau style 