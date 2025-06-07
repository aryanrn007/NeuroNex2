/**
 * Advanced Interview Preparation Panel Animations
 * Adds particle effects, floating elements, and interactive animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all advanced animations
    initializeParticleBackground();
    initializeFloatingElements();
    initializeTypingEffect();
    initializeInteractiveCards();
    initializeProgressBars();
    initializeImageEffects();
});

/**
 * Creates an animated particle background for the interview panel header
 */
function initializeParticleBackground() {
    const headerElement = document.querySelector('.interview-header');
    if (!headerElement) return;
    
    // Create canvas element for particles
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    headerElement.style.position = 'relative';
    headerElement.style.overflow = 'hidden';
    headerElement.appendChild(canvas);
    
    // Set canvas size
    const setCanvasSize = () => {
        canvas.width = headerElement.offsetWidth;
        canvas.height = headerElement.offsetHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Particle configuration
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 30;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: 'rgba(255, 255, 255, 0.3)',
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }
    
    // Draw and animate particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX = -particle.speedX;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY = -particle.speedY;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        // Draw connections between nearby particles
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Make header content relative to appear above canvas
    const headerContent = headerElement.querySelector('h1, p');
    if (headerContent) {
        headerContent.style.position = 'relative';
        headerContent.style.zIndex = '2';
    }
}

/**
 * Adds floating decorative elements to the interview panel
 */
function initializeFloatingElements() {
    const container = document.querySelector('.interview-prep-container');
    if (!container) return;
    
    // Create floating elements
    const floatingElements = [
        { size: 100, top: '5%', left: '5%', delay: 0 },
        { size: 60, top: '70%', left: '10%', delay: 1 },
        { size: 80, top: '40%', left: '90%', delay: 2 },
        { size: 50, top: '80%', left: '85%', delay: 3 },
        { size: 70, top: '20%', left: '80%', delay: 4 }
    ];
    
    floatingElements.forEach((element, index) => {
        const floatingEl = document.createElement('div');
        floatingEl.className = 'floating-element';
        floatingEl.style.position = 'absolute';
        floatingEl.style.width = `${element.size}px`;
        floatingEl.style.height = `${element.size}px`;
        floatingEl.style.top = element.top;
        floatingEl.style.left = element.left;
        floatingEl.style.borderRadius = '50%';
        floatingEl.style.background = 'rgba(103, 58, 183, 0.05)';
        floatingEl.style.zIndex = '0';
        floatingEl.style.pointerEvents = 'none';
        floatingEl.style.animation = `float 8s ease-in-out infinite`;
        floatingEl.style.animationDelay = `${element.delay}s`;
        
        container.appendChild(floatingEl);
    });
    
    // Add keyframes for floating animation if not already present
    if (!document.getElementById('floating-keyframes')) {
        const style = document.createElement('style');
        style.id = 'floating-keyframes';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                50% {
                    transform: translateY(-20px) rotate(5deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Adds a typing effect to headings in the interview panel
 */
function initializeTypingEffect() {
    const heading = document.querySelector('.interview-header h1');
    if (!heading || heading.dataset.typingInitialized) return;
    
    heading.dataset.typingInitialized = 'true';
    const text = heading.textContent;
    heading.textContent = '';
    heading.style.borderRight = '2px solid #673AB7';
    heading.style.display = 'inline-block';
    heading.style.whiteSpace = 'nowrap';
    heading.style.overflow = 'hidden';
    heading.style.animation = 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite';
    
    // Add keyframes for typing animation if not already present
    if (!document.getElementById('typing-keyframes')) {
        const style = document.createElement('style');
        style.id = 'typing-keyframes';
        style.textContent = `
            @keyframes typing {
                from { width: 0 }
                to { width: 100% }
            }
            
            @keyframes blink-caret {
                from, to { border-color: transparent }
                50% { border-color: #673AB7 }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Type the text
    let i = 0;
    function typeText() {
        if (i < text.length) {
            heading.textContent += text.charAt(i);
            i++;
            setTimeout(typeText, 100);
        } else {
            // Remove border when typing is complete
            setTimeout(() => {
                heading.style.borderRight = 'none';
                heading.style.animation = 'none';
            }, 1500);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeText, 500);
}

/**
 * Adds subtle hover effects to cards in the interview panel (without tilt)
 */
function initializeInteractiveCards() {
    const cards = document.querySelectorAll('.mode-option, .difficulty-btn, .interview-sidebar, .interview-main');
    
    cards.forEach(card => {
        // Skip if already processed
        if (card.dataset.effectsInitialized) return;
        card.dataset.effectsInitialized = 'true';
        
        // Add subtle shine effect on hover without tilt
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Add shine effect
            const shine = card.querySelector('.shine') || document.createElement('div');
            if (!card.querySelector('.shine')) {
                shine.className = 'shine';
                shine.style.position = 'absolute';
                shine.style.top = '0';
                shine.style.left = '0';
                shine.style.right = '0';
                shine.style.bottom = '0';
                shine.style.pointerEvents = 'none';
                shine.style.background = 'radial-gradient(circle at ' + 
                    (x / rect.width * 100) + '% ' + 
                    (y / rect.height * 100) + '%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)';
                shine.style.zIndex = '1';
                
                // Ensure card has position relative
                if (getComputedStyle(card).position === 'static') {
                    card.style.position = 'relative';
                }
                
                card.appendChild(shine);
            } else {
                shine.style.background = 'radial-gradient(circle at ' + 
                    (x / rect.width * 100) + '% ' + 
                    (y / rect.height * 100) + '%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)';
            }
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            const shine = card.querySelector('.shine');
            if (shine) {
                shine.style.background = 'none';
            }
        });
    });
}

/**
 * Adds animated progress bars to the interview panel
 */
function initializeProgressBars() {
    // Add animation to existing progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        // Skip if already processed
        if (bar.dataset.animationInitialized) return;
        bar.dataset.animationInitialized = 'true';
        
        const value = bar.style.width || bar.dataset.value || '0%';
        
        // Reset width to 0
        bar.style.width = '0%';
        
        // Animate to actual value when visible
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.transition = 'width 1.5s cubic-bezier(0.1, 0.5, 0.5, 1)';
                        bar.style.width = value;
                    }, 300);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(bar);
    });
    
    // Add progress indicators to the welcome screen
    const welcomeStats = document.querySelector('.welcome-stats');
    if (welcomeStats && !welcomeStats.dataset.progressInitialized) {
        welcomeStats.dataset.progressInitialized = 'true';
        
        const statItems = welcomeStats.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            const statValue = item.querySelector('.stat-value');
            if (!statValue) return;
            
            const value = parseInt(statValue.textContent);
            if (isNaN(value)) return;
            
            // Create circular progress indicator
            const progressCircle = document.createElement('div');
            progressCircle.className = 'progress-circle';
            progressCircle.style.position = 'absolute';
            progressCircle.style.top = '-10px';
            progressCircle.style.right = '-10px';
            progressCircle.style.width = '40px';
            progressCircle.style.height = '40px';
            
            // Set up SVG for circular progress
            const percentage = Math.min(value, 100);
            const circumference = 2 * Math.PI * 18; // 18 is the radius
            const dashoffset = circumference * (1 - percentage / 100);
            
            progressCircle.innerHTML = `
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#f0f0f0" stroke-width="3"></circle>
                    <circle class="progress-circle-value" cx="20" cy="20" r="18" fill="none" 
                        stroke="#673AB7" stroke-width="3" stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${circumference}" transform="rotate(-90 20 20)"></circle>
                </svg>
            `;
            
            // Ensure item has position relative
            if (getComputedStyle(item).position === 'static') {
                item.style.position = 'relative';
            }
            
            item.appendChild(progressCircle);
            
            // Animate the progress circle when visible
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            const circle = progressCircle.querySelector('.progress-circle-value');
                            circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.1, 0.5, 0.5, 1)';
                            circle.style.strokeDashoffset = dashoffset;
                        }, 500);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(item);
        });
    }
}

/**
 * Adds animation effects to images in the interview panel
 */
function initializeImageEffects() {
    // Find welcome illustration or any images
    const illustrations = document.querySelectorAll('.welcome-illustration img, .interview-main img');
    
    illustrations.forEach(img => {
        // Skip if already processed
        if (img.dataset.effectsInitialized) return;
        img.dataset.effectsInitialized = 'true';
        
        // Add parallax effect
        const container = img.parentElement;
        
        container.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const moveX = (x - rect.width / 2) / 20;
            const moveY = (y - rect.height / 2) / 20;
            
            img.style.transform = `translate(${moveX}px, ${moveY}px)`;
            img.style.transition = 'transform 0.2s ease-out';
        });
        
        container.addEventListener('mouseleave', () => {
            img.style.transform = 'translate(0, 0)';
            img.style.transition = 'transform 0.5s ease';
        });
        
        // Add subtle animation
        img.style.animation = 'float-subtle 6s ease-in-out infinite';
        
        // Add keyframes for subtle floating animation if not already present
        if (!document.getElementById('float-subtle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'float-subtle-keyframes';
            style.textContent = `
                @keyframes float-subtle {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    });
}
