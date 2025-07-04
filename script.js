// Mode Sombre
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode);
});

// Charger l'état du mode sombre
const savedDarkMode = localStorage.getItem('dark-mode');
if (savedDarkMode === 'true') {
    body.classList.add('dark-mode');
}