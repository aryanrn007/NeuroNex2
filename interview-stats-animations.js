/**
 * Interview Statistics Animations
 * Adds interactive animations to the interview statistics section
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations when document is loaded
    initStatsAnimations();
    
    // Set up intersection observer for animation on scroll
    setupScrollAnimations();
});

/**
 * Initialize animations for statistics
 */
function initStatsAnimations() {
    // Animate stat values with counting effect
    animateStatValues();
    
    // Add hover effects to stat items
    addStatItemInteractivity();
}

/**
 * Animate stat values with counting effect
 */
function animateStatValues() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        const valueElement = item.querySelector('.stat-value');
        const targetValue = parseInt(item.getAttribute('data-value')) || 0;
        const hasPlusSign = valueElement.textContent.includes('+');
        const hasPercentSign = valueElement.textContent.includes('%');
        
        // Add animation class
        valueElement.classList.add('animated');
        
        // Animate counting
        animateCounter(valueElement, 0, targetValue, 2000, hasPlusSign, hasPercentSign);
    });
}

/**
 * Animate counter from start to end value
 * @param {Element} element - The element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in milliseconds
 * @param {boolean} hasPlusSign - Whether to add a plus sign
 * @param {boolean} hasPercentSign - Whether to add a percent sign
 */
function animateCounter(element, start, end, duration, hasPlusSign, hasPercentSign) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        // Format the display text
        let displayText = current.toString();
        if (hasPlusSign) displayText += '+';
        if (hasPercentSign) displayText += '%';
        
        element.textContent = displayText;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

/**
 * Add interactivity to stat items
 */
function addStatItemInteractivity() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        // Add pulse effect on hover
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.stat-icon i');
            if (icon) {
                icon.classList.add('fa-beat');
                setTimeout(() => {
                    icon.classList.remove('fa-beat');
                }, 1000);
            }
        });
        
        // Add click effect
        item.addEventListener('click', () => {
            item.classList.add('clicked');
            setTimeout(() => {
                item.classList.remove('clicked');
            }, 300);
        });
    });
}

/**
 * Set up intersection observer for animation on scroll
 */
function setupScrollAnimations() {
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation classes when element is visible
                entry.target.classList.add('in-view');
                
                // If it's the stats section, trigger animations
                if (entry.target.classList.contains('welcome-stats')) {
                    animateStatValues();
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });
    
    // Observe welcome stats
    const welcomeStats = document.querySelector('.welcome-stats');
    if (welcomeStats) {
        observer.observe(welcomeStats);
    }
    
    // Observe heading
    const heading = document.querySelector('.interview-welcome h2');
    if (heading) {
        observer.observe(heading);
    }
}

// Add additional CSS for animation effects
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .stat-item.clicked {
            transform: scale(0.95);
            transition: transform 0.2s ease;
        }
        
        .interview-welcome h2.in-view {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .welcome-stats.in-view {
            animation: fadeIn 1s ease forwards;
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
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Call to add animation styles
addAnimationStyles();
