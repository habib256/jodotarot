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
    if (!url || typeof url !== 'string') return url;
    // Encoder chaque segment du chemin, y compris les dossiers contenant des caractères spéciaux
    return url
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
  }

  // ... existing code ...
}

// ... existing code ... 