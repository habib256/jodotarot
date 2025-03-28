class TarotCard {
  constructor(id, translationKey, image, arcana = 'major', suit = null, rank = null) {
    this.id = id;
    this.translationKey = translationKey;
    this.image = image;
    this.arcana = arcana;
    this.suit = suit;
    this.rank = rank;
    this.orientation = 'upright';
    this.imageUrl = this.encodeImageUrl(image);
  }

  // Encode l'URL de l'image pour gérer les espaces et caractères spéciaux
  encodeImageUrl(url) {
    // Sépare le chemin de base du nom de fichier
    const lastSlashIndex = url.lastIndexOf('/');
    const basePath = url.substring(0, lastSlashIndex + 1);
    const fileName = url.substring(lastSlashIndex + 1);
    
    // Encode uniquement le nom du fichier
    return basePath + encodeURIComponent(fileName);
  }

  // ... existing code ...
}

// ... existing code ... 