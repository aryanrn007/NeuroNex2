/**
 * Networking Tips Interactive Features
 * Adds advanced interactive elements to the networking tips panel
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive features
    initializeParticleBackground();
    initializeTypingEffect();
    initializeScrollReveal();
    initializeNetworkingTips();
    initializeInteractiveCards();
    // Dark mode toggle removed
});

/**
 * Creates an animated particle background for the networking panel header
 */
function initializeParticleBackground() {
    const headerElement = document.querySelector('.panel-header, .networking-hero');
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
}

/**
 * Adds a typing effect to headings in the networking panel
 */
function initializeTypingEffect() {
    const headings = document.querySelectorAll('.panel-header h2, .networking-hero h1');
    
    headings.forEach(heading => {
        // Skip if already processed
        if (heading.dataset.typingInitialized) return;
        heading.dataset.typingInitialized = 'true';
        
        const text = heading.textContent;
        heading.textContent = '';
        heading.style.borderRight = '2px solid';
        heading.style.animation = 'cursor-blink 1s step-end infinite';
        
        let charIndex = 0;
        
        function typeText() {
            if (charIndex < text.length) {
                heading.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 100);
            } else {
                heading.style.borderRight = 'none';
                heading.style.animation = 'none';
            }
        }
        
        // Add necessary styles if not already in the document
        if (!document.getElementById('typing-effect-style')) {
            const style = document.createElement('style');
            style.id = 'typing-effect-style';
            style.textContent = `
                @keyframes cursor-blink {
                    0%, 100% { border-color: transparent; }
                    50% { border-color: white; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Start typing effect when element is in view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeText, 500);
                    observer.unobserve(heading);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heading);
    });
}

/**
 * Adds scroll reveal animations to elements
 */
function initializeScrollReveal() {
    const elements = document.querySelectorAll('.stat-card, .feature-item, .interactive-tip, .interactive-card, .quote-block');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(element => {
        // Skip if already processed
        if (element.dataset.revealInitialized) return;
        element.dataset.revealInitialized = 'true';
        
        element.classList.add('reveal-element');
        observer.observe(element);
    });
    
    // Add necessary styles if not already in the document
    if (!document.getElementById('scroll-reveal-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-reveal-style';
        style.textContent = `
            .reveal-element {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initializes interactive networking tips with expandable content
 */
function initializeNetworkingTips() {
    // Create tips data
    const networkingTips = [
        {
            title: "Quality Over Quantity",
            content: "Focus on building meaningful relationships rather than collecting contacts. A few strong connections are more valuable than many superficial ones.",
            icon: "fas fa-star"
        },
        {
            title: "Be Genuinely Helpful",
            content: "Look for ways to provide value to your connections. Offer assistance, share relevant resources, or make introductions without expecting immediate returns.",
            icon: "fas fa-hands-helping"
        },
        {
            title: "Follow Up Consistently",
            content: "After meeting someone new, follow up within 48 hours. Regular check-ins keep relationships active and demonstrate your reliability.",
            icon: "fas fa-clock"
        },
        {
            title: "Listen More Than You Speak",
            content: "Practice active listening to understand others' needs and challenges. This helps you identify opportunities to add value and build trust.",
            icon: "fas fa-ear-listen"
        }
    ];
    
    // Find or create tips container
    let tipsContainer = document.querySelector('.networking-tips-container');
    if (!tipsContainer) {
        const panelContent = document.querySelector('.panel-content');
        if (!panelContent) return;
        
        tipsContainer = document.createElement('div');
        tipsContainer.className = 'networking-tips-container';
        
        const tipsHeading = document.createElement('h3');
        tipsHeading.textContent = 'Expert Networking Tips';
        
        panelContent.appendChild(tipsHeading);
        panelContent.appendChild(tipsContainer);
    }
    
    // Generate tips HTML
    networkingTips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-card';
        
        tipElement.innerHTML = `
            <div class="tip-header">
                <div class="tip-icon"><i class="${tip.icon}"></i></div>
                <h4 class="tip-title">${tip.title}</h4>
                <button class="tip-toggle"><i class="fas fa-chevron-down"></i></button>
            </div>
            <div class="tip-content">
                <p>${tip.content}</p>
            </div>
        `;
        
        tipsContainer.appendChild(tipElement);
        
        // Add toggle functionality
        const toggleButton = tipElement.querySelector('.tip-toggle');
        const content = tipElement.querySelector('.tip-content');
        
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease';
        
        toggleButton.addEventListener('click', () => {
            const isExpanded = tipElement.classList.contains('expanded');
            
            if (isExpanded) {
                tipElement.classList.remove('expanded');
                content.style.maxHeight = '0';
                toggleButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
            } else {
                tipElement.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
                toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
            }
        });
    });
    
    // Add necessary styles if not already in the document
    if (!document.getElementById('networking-tips-style')) {
        const style = document.createElement('style');
        style.id = 'networking-tips-style';
        style.textContent = `
            .networking-tips-container {
                margin: 20px 0;
            }
            
            .tip-card {
                background: #f8f9fc;
                border-radius: 8px;
                margin-bottom: 10px;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .tip-card:hover {
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
            }
            
            .tip-header {
                padding: 15px;
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            .tip-icon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: rgba(108, 99, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                color: var(--panel-primary, #6c63ff);
                flex-shrink: 0;
            }
            
            .tip-title {
                flex-grow: 1;
                margin: 0;
                font-size: 15px;
                font-weight: 600;
            }
            
            .tip-toggle {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                transition: transform 0.3s ease;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tip-content {
                padding: 0 15px;
                color: #666;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .tip-content p {
                margin: 0 0 15px;
            }
            
            .tip-card.expanded {
                background: white;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
            }
            
            .dark-mode .tip-card {
                background: #2a2a2a;
            }
            
            .dark-mode .tip-card.expanded {
                background: #333;
            }
            
            .dark-mode .tip-title {
                color: #eee;
            }
            
            .dark-mode .tip-content {
                color: #aaa;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initializes interactive cards with hover effects and animations
 */
function initializeInteractiveCards() {
    const cards = document.querySelectorAll('.stat-card, .feature-item, .interactive-card');
    
    cards.forEach(card => {
        // Skip if already processed
        if (card.dataset.interactiveInitialized) return;
        card.dataset.interactiveInitialized = 'true';
        
        // Add 3D tilt effect on mouse move
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

/**
 * Sets up dark mode toggle functionality - REMOVED
 */
function setupDarkModeToggle() {
    // Function intentionally left empty to prevent dark mode toggle creation
    console.log('Dark mode toggle disabled');
}
