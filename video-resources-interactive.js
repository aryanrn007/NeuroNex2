/**
 * Video Resources Interactive Features
 * Adds animations, hover effects, and interactive elements to the video resources panel
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get all video cards
    const videoCards = document.querySelectorAll('#video-resources .video-card');
    
    // Add hover effects and animations
    videoCards.forEach((card, index) => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit the rotation to a small amount (5 degrees)
            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;
            
            // Apply the transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('mousedown', () => {
            card.style.transform = 'perspective(1000px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', () => {
            card.style.transform = 'perspective(1000px) scale(1.02)';
        });
        
        // Create ripple effect on play button click
        const playButton = card.querySelector('.play-button');
        playButton.addEventListener('click', (e) => {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            playButton.appendChild(ripple);
            
            // Position the ripple
            const rect = playButton.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size * 2}px`;
            ripple.style.left = `${e.clientX - rect.left - size}px`;
            ripple.style.top = `${e.clientY - rect.top - size}px`;
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    videoCards.forEach(card => {
        observer.observe(card);
    });
    
    // Add video preview on hover (simulated)
    videoCards.forEach(card => {
        const thumbnail = card.querySelector('.video-thumbnail img');
        const originalSrc = thumbnail.src;
        
        // Generate preview frames (using original image with filter effects for demo)
        const frames = [
            originalSrc,
            originalSrc.replace('hqdefault', 'mqdefault'),
            originalSrc
        ];
        
        let currentFrame = 0;
        let previewInterval;
        
        card.addEventListener('mouseenter', () => {
            // Simulate video preview by cycling through frames
            previewInterval = setInterval(() => {
                currentFrame = (currentFrame + 1) % frames.length;
                // Add a subtle transition effect
                thumbnail.style.opacity = 0.8;
                setTimeout(() => {
                    thumbnail.src = frames[currentFrame];
                    thumbnail.style.opacity = 1;
                }, 100);
            }, 1000);
        });
        
        card.addEventListener('mouseleave', () => {
            clearInterval(previewInterval);
            thumbnail.src = originalSrc;
            thumbnail.style.opacity = 1;
        });
    });
    
    // Add floating particles animation
    animateParticles();
});

// Function to animate the floating particles
function animateParticles() {
    const particles = document.querySelectorAll('.video-particle');
    
    particles.forEach(particle => {
        // Random initial position within constraints
        const section = document.getElementById('video-resources');
        const sectionRect = section.getBoundingClientRect();
        
        // Set random positions within the section
        const randomX = Math.random() * sectionRect.width;
        const randomY = Math.random() * sectionRect.height;
        
        particle.style.left = `${randomX}px`;
        particle.style.top = `${randomY}px`;
        
        // Add additional random movements
        setInterval(() => {
            // Get current position
            const currentX = parseFloat(particle.style.left);
            const currentY = parseFloat(particle.style.top);
            
            // Add small random movement
            const newX = Math.max(0, Math.min(sectionRect.width, currentX + (Math.random() - 0.5) * 20));
            const newY = Math.max(0, Math.min(sectionRect.height, currentY + (Math.random() - 0.5) * 20));
            
            // Apply with transition
            particle.style.transition = 'left 3s ease, top 3s ease';
            particle.style.left = `${newX}px`;
            particle.style.top = `${newY}px`;
        }, 3000);
    });
}

// Add CSS for ripple effect
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        #video-resources .video-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});
