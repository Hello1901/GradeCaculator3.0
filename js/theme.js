// Theme Management
const THEME_KEY = 'gradeCalcTheme';

// Get current theme
export function getCurrentTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

// Set theme
export function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

// Apply theme to document
export function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Toggle theme
export function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    return newTheme;
}

// Initialize theme on page load
export function initTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme);
}
