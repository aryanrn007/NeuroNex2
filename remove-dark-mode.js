/**
 * Remove Dark Mode Script
 * This script removes dark mode and system theme functionality from the application
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Removing dark mode and system theme functionality...');
    
    // 1. Remove dark-mode class from body if present
    document.body.classList.remove('dark-mode');
    
    // 2. Remove theme-related items from localStorage
    localStorage.removeItem('darkMode');
    localStorage.removeItem('theme');
    localStorage.removeItem('systemTheme');
    localStorage.removeItem('prefersDarkMode');
    
    // 3. Remove any dynamically added dark mode toggle buttons
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    darkModeToggles.forEach(button => button.remove());
    
    // 4. Hide dark theme and system theme options in settings panel if they exist
    const darkThemeOption = document.querySelector('button[data-theme="dark"]');
    if (darkThemeOption) {
        darkThemeOption.style.display = 'none';
    }
    
    const systemThemeOption = document.querySelector('button[data-theme="system"]');
    if (systemThemeOption) {
        systemThemeOption.style.display = 'none';
    }
    
    // 5. Remove dark mode toggle styles if they exist
    const darkModeToggleStyle = document.getElementById('dark-mode-toggle-style');
    if (darkModeToggleStyle) {
        darkModeToggleStyle.remove();
    }
    
    // 6. Override any existing setupDarkModeToggle functions to prevent them from running
    window.setupDarkModeToggle = function() {
        console.log('Dark mode toggle disabled');
        return false;
    };
    
    // 7. Override system theme detection if it exists
    if (window.matchMedia) {
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function(query) {
            if (query.includes('prefers-color-scheme')) {
                // Return a mock media query that always indicates light mode preference
                return {
                    matches: false,
                    addEventListener: function() {},
                    removeEventListener: function() {}
                };
            }
            return originalMatchMedia(query);
        };
    }
    
    // 8. Set default theme to light
    localStorage.setItem('theme', 'light');
});
