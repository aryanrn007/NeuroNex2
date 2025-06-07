// Sint Theme and 3D Robot Integration

document.addEventListener('DOMContentLoaded', () => {
    // Wait a short moment to ensure remove-dark-mode.js has executed
    setTimeout(() => {
    // Add Sint theme option to all theme option containers
    const themeOptionContainers = document.querySelectorAll('.theme-options');
    
    themeOptionContainers.forEach(container => {
        // Check if Sint theme option already exists
        if (!container.querySelector('[data-theme="sint"]')) {
            const sintThemeOption = document.createElement('button');
            sintThemeOption.className = 'theme-option';
            sintThemeOption.setAttribute('data-theme', 'sint');
            sintThemeOption.innerHTML = `
                <i class="fas fa-robot"></i>
                <span>Sint</span>
            `;
            container.appendChild(sintThemeOption);
        }
    });

    // Only add robot to login page, not to other pages
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (isLoginPage && !document.querySelector('.robot-container')) {
        const robotContainer = document.createElement('div');
        robotContainer.className = 'robot-container';
        robotContainer.innerHTML = `
            <spline-viewer url="https://prod.spline.design/DPQzRW06x0vDqNOF/scene.splinecode"></spline-viewer>
        `;
        // Make the robot bigger and position it to show the robot but hide watermark
        robotContainer.style.transform = 'scale(1.3) translateY(-70px)';
        robotContainer.style.transformOrigin = 'center bottom';
        document.body.appendChild(robotContainer);
        
        // Wait for the spline viewer to load
        setTimeout(() => {
            // Always show robot on login page
            robotContainer.style.display = 'block';
            
            // Find and adjust the spline viewer to position the robot correctly
            const splineViewer = robotContainer.querySelector('spline-viewer');
            if (splineViewer) {
                splineViewer.style.marginBottom = '80px';
                // Try to adjust any watermark elements directly
                const watermarkElements = splineViewer.shadowRoot ? 
                    splineViewer.shadowRoot.querySelectorAll('a[href*="spline.design"]') : [];
                
                watermarkElements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                    el.style.display = 'none';
                });
            }
        }, 500);
    }

    // Apply Sint theme if it's the saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'sint') {
        applyTheme('sint');
    } else {
        // Store the Sint theme option in localStorage to ensure it's available
        // This doesn't apply the theme, just makes it available as an option
        const storedThemes = localStorage.getItem('availableThemes') || '';
        if (!storedThemes.includes('sint')) {
            localStorage.setItem('availableThemes', storedThemes + ',sint');
        }
    }

    // Add event listeners for Sint theme option
    document.querySelectorAll('.theme-option[data-theme="sint"]').forEach(button => {
        // Remove any existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new event listener
        newButton.addEventListener('click', () => {
            applyTheme('sint');
            localStorage.setItem('theme', 'sint');
            console.log('Sint theme applied');
        });
    });

    // Function to apply theme
    function applyTheme(theme) {
        // Remove all theme classes
        document.documentElement.classList.remove('dark-mode', 'office-mode', 'sint-theme');
        document.body.classList.remove('dark-mode', 'office-mode', 'sint-theme');
        
        // Apply selected theme
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else if (theme === 'office') {
            document.documentElement.classList.add('office-mode');
            document.body.classList.add('office-mode');
        } else if (theme === 'sint') {
            document.documentElement.classList.add('sint-theme');
            document.body.classList.add('sint-theme');
            // Add Sint theme CSS variables
            applySintThemeStyles();
            // Don't show robot on non-login pages
            if (!isLoginPage) {
                hideRobot();
            } else {
                showRobot();
            }
        } else {
            // Light theme (default)
            hideRobot();
        }
    }
    
    // Function to apply Sint theme styles
    function applySintThemeStyles() {
        // Create or update the Sint theme style element
        let sintStyleElement = document.getElementById('sint-theme-styles');
        if (!sintStyleElement) {
            sintStyleElement = document.createElement('style');
            sintStyleElement.id = 'sint-theme-styles';
            document.head.appendChild(sintStyleElement);
        }
        
        // Define the Sint theme CSS
        sintStyleElement.textContent = `
            .sint-theme {
                --primary-color: #00FFCC;
                --secondary-color: #33CCFF;
                --background-color: #121212;
                --text-color: #FFFFFF;
                --input-bg: rgba(255, 255, 255, 0.08);
                --glow-color: rgba(0, 255, 204, 0.5);
            }
            
            .sint-theme body {
                background-color: var(--background-color);
                color: var(--text-color);
            }
            
            .sint-theme .background {
                background: linear-gradient(45deg, #121212, #1E1E1E);
            }
            
            .sint-theme .login-btn,
            .sint-theme button.primary-button {
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                color: #000;
            }
            
            .sint-theme .greeting-text,
            .sint-theme h1, .sint-theme h2, .sint-theme h3 {
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                text-shadow: 0 0 10px var(--glow-color);
            }
            
            /* Outer chat container styling with cyan/teal gradient */
            .sint-theme .chat-outer-container,
            .sint-theme .chat-container,
            .sint-theme .message-outer-wrapper {
                background: linear-gradient(135deg, #00FFCC, #33CCFF) !important; /* Cyan/teal gradient like the logo */
                border-radius: 20px !important;
                padding: 8px !important;
                margin: 8px 0 !important;
                box-shadow: 0 0 15px rgba(0, 255, 204, 0.5) !important; /* Glowing effect */
                max-width: 80% !important;
                display: inline-block !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            /* Inner chat message styling with black background */
            .sint-theme .chat-message,
            .sint-theme .chat-bubble,
            .sint-theme .message-text,
            .sint-theme .bot-message,
            .sint-theme .assistant-message,
            .sint-theme .ai-message {
                color: #FFFFFF !important;
                background: #000000 !important; /* Black background for inner message */
                border-radius: 15px !important;
                padding: 12px 20px !important;
                margin: 0 !important;
                display: inline-block !important;
                width: 100% !important;
            }
            
            /* Target specific chat elements that might be used */
            .sint-theme .chat-container .message-content,
            .sint-theme .chat-area .message-text,
            .sint-theme .chat-interface .bot-text,
            .sint-theme .chat-widget .ai-response {
                color: #FFFFFF !important;
            }
            
            /* Add hover effect for interactive feel */
            .sint-theme .chat-message:hover,
            .sint-theme .chat-bubble:hover,
            .sint-theme .bot-message:hover,
            .sint-theme .assistant-message:hover,
            .sint-theme .ai-message:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                transition: all 0.3s ease !important;
            }
        `;
    }

    // Function to show robot (only used on login page)
    function showRobot() {
        if (!isLoginPage) return; // Only show on login page
        
        const robotContainer = document.querySelector('.robot-container');
        if (robotContainer) {
            robotContainer.style.display = 'block';
        }
    }

    // Function to hide robot
    function hideRobot() {
        const robotContainer = document.querySelector('.robot-container');
        if (robotContainer) {
            robotContainer.style.display = 'none';
        }
    }

    // Override existing theme switcher functionality but only for Sint theme
    document.querySelectorAll('.theme-option').forEach(button => {
        // Only add our custom handler to the Sint theme button
        // This prevents conflicts with other theme handlers
        if (button.getAttribute('data-theme') === 'sint') {
            // Remove existing listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add our custom handler
            newButton.addEventListener('click', function() {
                localStorage.setItem('theme', 'sint');
                applyTheme('sint');
                console.log('Sint theme applied via theme switcher');
            });
        }
    });
    
    // Add a MutationObserver to watch for dynamically added theme options
    const themeObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('theme-option')) {
                        if (node.getAttribute('data-theme') === 'sint') {
                            // Add our custom handler to the newly added Sint theme button
                            node.addEventListener('click', function() {
                                localStorage.setItem('theme', 'sint');
                                applyTheme('sint');
                                console.log('Sint theme applied via dynamically added button');
                            });
                        }
                    }
                });
            }
        });
    });
    
    // Start observing theme option containers
    themeOptionContainers.forEach(container => {
        themeObserver.observe(container, { childList: true });
    });
    }, 100); // End of setTimeout to ensure this runs after remove-dark-mode.js
});
