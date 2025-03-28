validateCards(cards) {
  console.log('🔍 Validation de cards:', cards);
  
  if (!Array.isArray(cards)) {
    console.error('❌ Cards n\'est pas un tableau:', cards);
    return false;
  }
  
  console.log('✅ Cards est bien un tableau de longueur', cards.length);
  
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    console.log(`🔍 Vérification de la carte ${i}:`, card);
    
    if (!card || typeof card !== 'object') {
      console.error(`❌ Carte ${i} n'est pas un objet valide:`, card);
      return false;
    }
    
    if (!card.id || !card.id.match(/^M\d{2}$/)) {
      console.error(`❌ Carte ${i} n'a pas d'id valide:`, card);
      return false;
    }
    
    if (!card.name || typeof card.name !== 'string') {
      console.error(`❌ Carte ${i} n'a pas de nom valide:`, card);
      return false;
    }
    
    if (!card.imageUrl || typeof card.imageUrl !== 'string') {
      console.error(`❌ Carte ${i} n'a pas d'URL d'image valide:`, card);
      return false;
    }
    
    if (!card.position || !['upright', 'reversed'].includes(card.position)) {
      console.error(`❌ Carte ${i} n'a pas de position valide:`, card);
      return false;
    }
  }
  
  return true;
}; 