function displayPersona(personaName) {
    const personaImg = document.getElementById('persona-image');
    personaImg.src = `personas/${personaName}.png`;
    personaImg.style.width = '150%';  // augmente la taille de 1,5 fois
} 