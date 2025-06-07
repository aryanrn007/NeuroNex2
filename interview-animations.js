/**
 * Enhanced Interview Preparation Panel Animations
 * Adds modern animations, transitions, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations when the page loads
    initAnimations();
    
    // Add event listeners for interactive elements
    setupInteractiveElements();
    
    // Add scroll animations
    setupScrollAnimations();
});

/**
 * Initialize animations for the interview preparation panel
 */
function initAnimations() {
    // Add animation classes to elements
    document.querySelector('.interview-header').classList.add('animated');
    
    // Animate mode options
    const modeOptions = document.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        option.classList.add('animated');
    });
    
    // Animate difficulty buttons
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
        btn.classList.add('animated');
    });
    
    // Animate action buttons
    const actionBtns = document.querySelectorAll('.interview-actions .juno-button');
    actionBtns.forEach(btn => {
        btn.classList.add('animated');
    });
    
    // Animate welcome screen elements
    if (document.querySelector('.interview-welcome.active')) {
        document.querySelector('.welcome-illustration').classList.add('animated');
        document.querySelector('.welcome-text h2').classList.add('animated');
        document.querySelector('.welcome-text p').classList.add('animated');
        document.querySelector('.welcome-stats').classList.add('animated');
        
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            item.classList.add('animated');
        });
    }
    
    // Add hover effects to elements
    addHoverEffects();
}

/**
 * Add hover effects to interactive elements
 */
function addHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.juno-button, .difficulty-btn, .mode-option');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', createRippleEffect);
    });
    
    // Add hover effect to select inputs
    const selects = document.querySelectorAll('.domain-select, .company-select');
    selects.forEach(select => {
        select.addEventListener('mouseenter', () => {
            select.style.transform = 'translateY(-2px)';
            select.style.boxShadow = '0 4px 12px rgba(103, 58, 183, 0.15)';
        });
        
        select.addEventListener('mouseleave', () => {
            select.style.transform = 'translateY(0)';
            select.style.boxShadow = 'none';
        });
    });
}

/**
 * Create ripple effect on button click
 * @param {Event} e - Mouse event
 */
function createRippleEffect(e) {
    const button = e.currentTarget;
    
    // Remove any existing ripple
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    // Position the ripple
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    
    // Remove ripple after animation completes
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * Setup interactive elements for the interview preparation panel
 */
function setupInteractiveElements() {
    // Mode option selection
    const modeOptions = document.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            modeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Add pulse animation
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 600);
            
            // Show/hide relevant selectors based on mode
            const mode = this.getAttribute('data-mode');
            toggleModeSelectors(mode);
        });
    });
    
    // Difficulty button selection
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            difficultyBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the selected difficulty
            const selectedDifficulty = this.getAttribute('data-difficulty');
            console.log('Difficulty selected:', selectedDifficulty);
            
            // Update interview context if it exists (for the chatbot)
            if (typeof interviewContext !== 'undefined') {
                interviewContext.difficulty = selectedDifficulty;
                console.log('Updated interview context:', interviewContext);
            }
            
            // Add pulse animation
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 600);
        });
    });
    
    // Start interview button
    const startBtn = document.getElementById('start-interview-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            // Show interview session
            showInterviewSession();
        });
    }
}

/**
 * Toggle visibility of selectors based on selected mode
 * @param {string} mode - Selected interview mode
 */
function toggleModeSelectors(mode) {
    const techDomainSelector = document.getElementById('tech-domain-selector');
    const companySelector = document.getElementById('company-selector');
    const hrDomainSelector = document.getElementById('hr-domain-selector');
    
    // Hide all selectors first
    techDomainSelector.classList.add('hidden');
    companySelector.classList.add('hidden');
    
    // Add hr-domain-selector if it doesn't exist
    if (!hrDomainSelector && mode === 'hr') {
        // Create HR domain selector
        const hrSelectorHTML = `
            <div class="domain-selector" id="hr-domain-selector">
                <h3>Select HR Topic</h3>
                <select id="hr-domain" class="domain-select">
                    <option value="leadership">Leadership & Management</option>
                    <option value="teamwork">Teamwork & Collaboration</option>
                    <option value="conflict">Conflict Resolution</option>
                    <option value="communication">Communication Skills</option>
                    <option value="culture">Cultural Fit & Values</option>
                    <option value="motivation">Motivation & Goals</option>
                    <option value="stress">Stress Management</option>
                    <option value="adaptability">Adaptability & Change</option>
                </select>
            </div>
        `;
        
        // Insert after tech-domain-selector
        const techSelector = document.getElementById('tech-domain-selector');
        if (techSelector && techSelector.parentNode) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = hrSelectorHTML;
            techSelector.parentNode.insertBefore(tempDiv.firstElementChild, techSelector.nextSibling);
        }
    }
    
    // Get the HR domain selector again after potentially creating it
    const updatedHrDomainSelector = document.getElementById('hr-domain-selector');
    if (updatedHrDomainSelector) {
        updatedHrDomainSelector.classList.add('hidden');
    }
    
    // Show relevant selector based on mode
    if (mode === 'technical') {
        techDomainSelector.classList.remove('hidden');
        
        // Add fade-in animation
        techDomainSelector.classList.add('fade-in');
        setTimeout(() => {
            techDomainSelector.classList.remove('fade-in');
        }, 500);
    } else if (mode === 'company') {
        companySelector.classList.remove('hidden');
        
        // Add fade-in animation
        companySelector.classList.add('fade-in');
        setTimeout(() => {
            companySelector.classList.remove('fade-in');
        }, 500);
    } else if (mode === 'hr' && updatedHrDomainSelector) {
        updatedHrDomainSelector.classList.remove('hidden');
        
        // Add fade-in animation
        updatedHrDomainSelector.classList.add('fade-in');
        setTimeout(() => {
            updatedHrDomainSelector.classList.remove('fade-in');
        }, 500);
    }
}

/**
 * Show interview session and hide welcome screen
 */
function showInterviewSession() {
    const welcomeScreen = document.getElementById('interview-welcome');
    const sessionScreen = document.getElementById('interview-session');
    
    // Hide welcome screen with fade-out animation
    welcomeScreen.classList.add('fade-out');
    
    setTimeout(() => {
        welcomeScreen.classList.remove('active');
        welcomeScreen.classList.add('hidden');
        welcomeScreen.classList.remove('fade-out');
        
        // Show session screen with fade-in animation
        sessionScreen.classList.remove('hidden');
        sessionScreen.classList.add('active');
        sessionScreen.classList.add('fade-in');
        
        setTimeout(() => {
            sessionScreen.classList.remove('fade-in');
            
            // Animate session elements
            animateSessionElements();
        }, 500);
    }, 300);
}

/**
 * Animate interview session elements
 */
function animateSessionElements() {
    const sessionHeader = document.querySelector('.session-header');
    const questionContainer = document.querySelector('.question-container');
    const answerContainer = document.querySelector('.answer-container');
    
    // Add animations with delays
    sessionHeader.classList.add('fade-in-down');
    
    setTimeout(() => {
        questionContainer.classList.add('fade-in-left');
    }, 200);
    
    setTimeout(() => {
        answerContainer.classList.add('fade-in-up');
    }, 400);
    
    // Remove animation classes after they complete
    setTimeout(() => {
        sessionHeader.classList.remove('fade-in-down');
        questionContainer.classList.remove('fade-in-left');
        answerContainer.classList.remove('fade-in-up');
    }, 1000);
}

/**
 * Setup scroll animations for elements
 */
function setupScrollAnimations() {
    // Add animation classes to elements when they come into view
    const animatedElements = document.querySelectorAll('.interview-sidebar, .interview-main, .interview-history');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Add CSS for dynamic animations
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .pulse {
            animation: pulse 0.6s cubic-bezier(0.4, 0, 0.6, 1);
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .clicked {
            animation: click 0.3s cubic-bezier(0.4, 0, 0.6, 1);
        }
        
        @keyframes click {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.95); }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .fade-in-down {
            animation: fadeInDown 0.5s ease forwards;
        }
        
        @keyframes fadeInDown {
            from { 
                opacity: 0;
                transform: translateY(-20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeInUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-left {
            animation: fadeInLeft 0.5s ease forwards;
        }
        
        @keyframes fadeInLeft {
            from { 
                opacity: 0;
                transform: translateX(-20px);
            }
            to { 
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .in-view {
            animation: scaleIn 0.5s ease forwards;
        }
        
        @keyframes scaleIn {
            from { 
                opacity: 0.8;
                transform: scale(0.95);
            }
            to { 
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Add dynamic styles when the script loads
addDynamicStyles();
