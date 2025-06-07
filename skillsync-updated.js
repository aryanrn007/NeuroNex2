// SkillSync Updated with Sint Theme Integration

document.addEventListener('DOMContentLoaded', () => {
    const loggedInUserNameDisplaySS = document.getElementById('loggedInUserNameSS');
    const logoutButtonSS = document.getElementById('logout-buttonSS');
    
    // Sint Theme Integration
    initializeSintTheme();
    
    // --- Basic Login Check & Header Setup ---
    function setupPageForUser() {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (!studentDataString) {
            window.location.href = 'login.html';
            return false;
        }
        const loggedInStudent = JSON.parse(studentDataString);
        if (loggedInUserNameDisplaySS) {
            loggedInUserNameDisplaySS.textContent = `Hi, ${loggedInStudent.fullName.split(' ')[0]}!`;
        }
        return true;
    }

    if (!setupPageForUser()) return;

    // Apply theme from localStorage
    applyThemeFromStorage();
    
    // Logout functionality
    if (logoutButtonSS) {
        logoutButtonSS.addEventListener('click', () => {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
        });
    }
    
    // Sint Theme Functions
    function initializeSintTheme() {
        // Check if Sint theme option exists, if not, add it
        const themeOptions = document.querySelector('.theme-options');
        if (themeOptions && !themeOptions.querySelector('[data-theme="sint"]')) {
            const sintOption = document.createElement('button');
            sintOption.className = 'theme-option';
            sintOption.setAttribute('data-theme', 'sint');
            sintOption.innerHTML = `
                <i class="fas fa-robot"></i>
                <span>Sint</span>
            `;
            themeOptions.appendChild(sintOption);
        }
        
        // We don't add the robot container here anymore
        // It's only added on the login page via sint-theme.js
        
        // Add event listeners to theme options
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                localStorage.setItem('theme', theme);
            });
        });
    }
    
    function applyThemeFromStorage() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        }
    }
    
    function applyTheme(theme) {
        // Remove all theme classes
        document.documentElement.classList.remove('dark-mode', 'office-mode', 'sint-theme');
        
        // Apply the selected theme
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else if (theme === 'office') {
            document.documentElement.classList.add('office-mode');
        } else if (theme === 'sint') {
            document.documentElement.classList.add('sint-theme');
        } else if (theme === 'system') {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark-mode');
            }
        }
        // We don't handle the robot here anymore
        // It's only shown on the login page via sint-theme.js
    }
});
