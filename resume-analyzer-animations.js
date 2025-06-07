/**
 * Resume Analyzer Animation Effects
 * Adds dynamic particle effects and animations to enhance the UI/UX
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle effects
    initParticles();
    
    // Add animation classes to elements when they come into view
    initScrollAnimations();
    
    // Add hover effects to buttons
    initButtonEffects();
    
    // Fix header buttons functionality
    fixHeaderButtons();
});

/**
 * Initialize particle effects in the header
 */
function initParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

/**
 * Create a single particle element
 */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 10 + 3;
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    
    // Random animation delay
    const delay = Math.random() * 5;
    
    // Set styles
    particle.style.cssText = `
        position: absolute;
        top: ${posY}%;
        left: ${posX}%;
        width: ${size}px;
        height: ${size}px;
        background-color: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        pointer-events: none;
        animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    container.appendChild(particle);
}

/**
 * Initialize animations that trigger on scroll
 */
function initScrollAnimations() {
    // Add animation classes to section containers when they come into view
    const sections = document.querySelectorAll('.section-container');
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Add interactive effects to buttons
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.juno-button');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add special effect to the upload button
    const uploadButton = document.getElementById('upload-resume-btn');
    if (uploadButton) {
        uploadButton.addEventListener('mouseover', function() {
            this.classList.add('animate__headShake');
            setTimeout(() => {
                this.classList.remove('animate__headShake');
            }, 1000);
        });
    }
}

// Add keyframe animation for particle floating
const style = document.createElement('style');
style.textContent = `
@keyframes floatParticle {
    0% {
        transform: translateY(0) translateX(0);
    }
    25% {
        transform: translateY(-20px) translateX(10px);
    }
    50% {
        transform: translateY(0) translateX(20px);
    }
    75% {
        transform: translateY(20px) translateX(10px);
    }
    100% {
        transform: translateY(0) translateX(0);
    }
}

.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
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
`;
document.head.appendChild(style);

/**
 * Fix header buttons functionality
 */
function fixHeaderButtons() {
    console.log('Fixing header buttons functionality');
    
    // Fix Upload Resume button
    const uploadResumeBtn = document.getElementById('upload-resume-btn');
    const fileInput = document.getElementById('resume-file');
    
    if (uploadResumeBtn && fileInput) {
        // Remove any existing event listeners
        const newUploadBtn = uploadResumeBtn.cloneNode(true);
        uploadResumeBtn.parentNode.replaceChild(newUploadBtn, uploadResumeBtn);
        
        // Add new event listener
        newUploadBtn.addEventListener('click', function() {
            console.log('Upload button clicked');
            fileInput.click();
        });
    } else {
        console.error('Upload button or file input not found');
        
        // If file input doesn't exist, create it
        if (!fileInput) {
            const newFileInput = document.createElement('input');
            newFileInput.type = 'file';
            newFileInput.id = 'resume-file';
            newFileInput.className = 'hidden';
            newFileInput.accept = '.pdf,.doc,.docx,.txt,.rtf';
            document.body.appendChild(newFileInput);
            
            // Add change event listener
            newFileInput.addEventListener('change', function(event) {
                if (window.handleFileUpload && typeof window.handleFileUpload === 'function') {
                    window.handleFileUpload(event);
                } else {
                    console.error('handleFileUpload function not found');
                }
            });
            
            console.log('Created new file input element');
            
            // Try again with the new file input
            const uploadBtn = document.getElementById('upload-resume-btn');
            if (uploadBtn) {
                const newUploadBtn = uploadBtn.cloneNode(true);
                uploadBtn.parentNode.replaceChild(newUploadBtn, uploadBtn);
                newUploadBtn.addEventListener('click', function() {
                    console.log('Upload button clicked (retry)');
                    newFileInput.click();
                });
            }
        }
    }
    
    // Fix LinkedIn Import button
    const linkedinImportBtn = document.getElementById('linkedin-import-btn');
    if (linkedinImportBtn) {
        // Remove any existing event listeners
        const newLinkedinBtn = linkedinImportBtn.cloneNode(true);
        linkedinImportBtn.parentNode.replaceChild(newLinkedinBtn, linkedinImportBtn);
        
        // Add new event listener
        newLinkedinBtn.addEventListener('click', function() {
            console.log('LinkedIn import button clicked');
            showNotification('LinkedIn import feature is coming soon!');
        });
    }
    
    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        console.log('Showing notification:', message);
        
        // Check if the showNotification function exists in the global scope
        if (window.showNotification && typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Create a simple notification if the function doesn't exist
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-info-circle"></i>
                    <span>${message}</span>
                </div>
                <button class="close-notification"><i class="fas fa-times"></i></button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
            
            // Close button functionality
            const closeBtn = notification.querySelector('.close-notification');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    notification.classList.add('fade-out');
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                });
            }
        }
    }
}
