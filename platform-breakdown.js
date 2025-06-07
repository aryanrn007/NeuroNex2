/**
 * Platform Breakdown Interactive Features
 * Adds animations and interactive elements to the platform breakdown component
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    animatePlatformCards();
    addHoverEffects();
    initializeParticleEffects();
    // Dark mode toggle removed
    addTipsExpandability();
});

/**
 * Animates platform cards when they come into view
 */
function animatePlatformCards() {
    const platformCards = document.querySelectorAll('.platform-card');
    
    // Create Intersection Observer to animate cards when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation
                setTimeout(() => {
                    entry.target.classList.add('scale-in');
                }, index * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe each card
    platformCards.forEach(card => {
        card.style.opacity = 0;
        observer.observe(card);
    });
}

/**
 * Adds hover effects to platform cards
 */
function addHoverEffects() {
    const platformCards = document.querySelectorAll('.platform-card');
    
    platformCards.forEach(card => {
        // Add 3D tilt effect on mouse move
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add necessary styles if not already in the document
    if (!document.getElementById('hover-effects-style')) {
        const style = document.createElement('style');
        style.id = 'hover-effects-style';
        style.textContent = `
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.3);
                width: 100px;
                height: 100px;
                margin-top: -50px;
                margin-left: -50px;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initializes particle effects for platform logos
 */
function initializeParticleEffects() {
    const platformLogos = document.querySelectorAll('.platform-logo');
    
    platformLogos.forEach(logo => {
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.position = 'absolute';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.pointerEvents = 'none';
        particleContainer.style.zIndex = '0';
        particleContainer.style.overflow = 'hidden';
        
        logo.style.position = 'relative';
        logo.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'logo-particle';
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            particle.style.top = '50%';
            particle.style.left = '50%';
            
            // Random position
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 15 + 5;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            // Random animation duration
            const duration = Math.random() * 3 + 2;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.animation = `particleOrbit ${duration}s infinite linear`;
            
            particleContainer.appendChild(particle);
        }
    });
    
    // Add necessary styles if not already in the document
    if (!document.getElementById('particle-effects-style')) {
        const style = document.createElement('style');
        style.id = 'particle-effects-style';
        style.textContent = `
            @keyframes particleOrbit {
                0% {
                    transform: translate(var(--x), var(--y)) rotate(0deg) translateX(var(--distance));
                }
                100% {
                    transform: translate(var(--x), var(--y)) rotate(360deg) translateX(var(--distance));
                }
            }
            
            .logo-particle {
                --x: 0px;
                --y: 0px;
                --distance: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Apply random orbits to particles
    document.querySelectorAll('.logo-particle').forEach(particle => {
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 10 - 5;
        const distance = Math.random() * 8 + 8;
        
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        particle.style.setProperty('--distance', `${distance}px`);
    });
}

/**
 * Sets up dark mode toggle functionality - REMOVED
 */
function setupDarkModeToggle() {
    // Function intentionally left empty to prevent dark mode toggle creation
    console.log('Dark mode toggle disabled');
}

/**
 * Makes tips expandable with animation
 */
function addTipsExpandability() {
    const tipsList = document.querySelectorAll('.tips-list');
    
    tipsList.forEach(list => {
        const items = list.querySelectorAll('li');
        
        // Show only first 2 items initially if there are more than 3
        if (items.length > 3) {
            for (let i = 2; i < items.length; i++) {
                items[i].style.display = 'none';
                items[i].classList.add('hidden-tip');
            }
            
            // Create "Show More" button
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-btn';
            showMoreBtn.textContent = 'Show More';
            showMoreBtn.style.background = 'none';
            showMoreBtn.style.border = 'none';
            showMoreBtn.style.color = '#6c63ff';
            showMoreBtn.style.cursor = 'pointer';
            showMoreBtn.style.fontSize = '12px';
            showMoreBtn.style.fontWeight = '600';
            showMoreBtn.style.marginTop = '10px';
            showMoreBtn.style.padding = '0';
            showMoreBtn.style.display = 'block';
            showMoreBtn.style.transition = 'all 0.3s ease';
            
            list.parentNode.appendChild(showMoreBtn);
            
            // Toggle hidden tips on click
            showMoreBtn.addEventListener('click', () => {
                const hiddenTips = list.querySelectorAll('.hidden-tip');
                const isExpanded = showMoreBtn.textContent === 'Show Less';
                
                hiddenTips.forEach(tip => {
                    if (isExpanded) {
                        tip.style.display = 'none';
                    } else {
                        tip.style.display = 'block';
                        tip.style.animation = 'slideUp 0.3s ease forwards';
                    }
                });
                
                showMoreBtn.textContent = isExpanded ? 'Show More' : 'Show Less';
            });
            
            // Add hover effect
            showMoreBtn.addEventListener('mouseenter', () => {
                showMoreBtn.style.transform = 'translateX(3px)';
            });
            
            showMoreBtn.addEventListener('mouseleave', () => {
                showMoreBtn.style.transform = 'translateX(0)';
            });
        }
    });
}

// Add animated underline effect to platform names
document.querySelectorAll('.platform-name').forEach(name => {
    name.addEventListener('mouseenter', () => {
        const underline = name.querySelector('.platform-underline');
        if (underline) {
            underline.style.width = '100%';
        }
    });
    
    name.addEventListener('mouseleave', () => {
        const underline = name.querySelector('.platform-underline');
        if (underline) {
            underline.style.width = '40px';
        }
    });
});
