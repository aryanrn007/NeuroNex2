/**
 * Premium Settings Buttons Interactions
 * Adds luxury interactive animations to the settings panel buttons
 */

document.addEventListener('DOMContentLoaded', () => {
    initPremiumButtonsInteractions();
});

/**
 * Initialize premium interactions for settings panel buttons
 */
function initPremiumButtonsInteractions() {
    const settingsButtons = document.querySelectorAll('.settings-button');
    
    // Wrap button text in spans for text effects
    settingsButtons.forEach(button => {
        // Skip if already processed
        if (button.querySelector('span.btn-text')) return;
        
        // Get the text content after the icon
        const buttonText = button.innerHTML.split('</i>')[1].trim();
        // Replace the text with a wrapped version
        button.innerHTML = button.innerHTML.replace(buttonText, `<span class="btn-text">${buttonText}</span>`);
        
        // Add premium interactions
        button.addEventListener('click', createPremiumRippleEffect);
        button.addEventListener('mouseenter', addHoverEffects);
        button.addEventListener('mouseleave', removeHoverEffects);
    });
    
    // Add magnetic effect to buttons
    addMagneticEffect(settingsButtons);
}

/**
 * Create premium ripple effect on button click
 * @param {Event} e - The click event
 */
function createPremiumRippleEffect(e) {
    const button = e.currentTarget;
    
    // Remove any existing ripples
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
    const size = Math.max(rect.width, rect.height) * 2.5; // Larger ripple for premium feel
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    
    // Add tactile feedback
    button.style.transform = 'translateY(2px) scale(0.98)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

/**
 * Add hover effects to button
 * @param {Event} e - The mouseenter event
 */
function addHoverEffects(e) {
    const button = e.currentTarget;
    button.classList.add('hover-pulse');
    
    // Add subtle particle effect (simulated with a class for now)
    const particles = document.createElement('div');
    particles.classList.add('button-particles');
    button.appendChild(particles);
}

/**
 * Remove hover effects from button
 * @param {Event} e - The mouseleave event
 */
function removeHoverEffects(e) {
    const button = e.currentTarget;
    button.classList.remove('hover-pulse');
    
    // Remove particle effect
    const particles = button.querySelector('.button-particles');
    if (particles) {
        particles.remove();
    }
}

/**
 * Add magnetic effect to buttons
 * @param {NodeList} buttons - The buttons to add the effect to
 */
function addMagneticEffect(buttons) {
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate distance from center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate the magnetic pull (subtle effect)
            const magneticPullX = (x - centerX) / centerX * 4; // Max 4px movement
            const magneticPullY = (y - centerY) / centerY * 2; // Max 2px movement
            
            // Apply the magnetic effect
            button.style.transform = `translate(${magneticPullX}px, ${magneticPullY}px)`;
            
            // Move the icon slightly more for a layered effect
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = `translate(${magneticPullX * 1.5}px, ${magneticPullY * 1.5}px)`;
            }
        });
        
        // Reset on mouse leave
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
}
