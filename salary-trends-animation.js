// Salary Trends Animation Script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initSalaryTrendsAnimations();
    
    // Set up intersection observer for progress bars
    setupProgressBarObserver();
});

// Initialize animations for salary trend cards
function initSalaryTrendsAnimations() {
    const salaryCards = document.querySelectorAll('.salary-card');
    
    // Add hover listeners for interactive effects
    salaryCards.forEach(card => {
        // Add mouse enter/leave events for additional effects if needed
        card.addEventListener('mouseenter', function() {
            // Additional hover effects can be added here
        });
    });
}

// Set up intersection observer to animate progress bars when they come into view
function setupProgressBarObserver() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const progressBars = document.querySelectorAll('.skill-impact-progress');
        
        const options = {
            root: null, // Use viewport as root
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% of the element is visible
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width') + '%';
                    
                    // Delay the animation slightly for better visual effect
                    setTimeout(() => {
                        progressBar.style.width = width;
                        progressBar.classList.add('animate-progress');
                        
                        // Add animated class to parent card
                        const card = progressBar.closest('.salary-card');
                        if (card) {
                            card.classList.add('animated');
                        }
                    }, 300);
                    
                    // Unobserve after animation is triggered
                    observer.unobserve(progressBar);
                }
            });
        }, options);
        
        // Observe all progress bars
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const progressBars = document.querySelectorAll('.skill-impact-progress');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width') + '%';
            bar.style.width = width;
        });
    }
}

// Add a scroll effect to animate cards when they come into view
window.addEventListener('scroll', function() {
    const salaryCards = document.querySelectorAll('.salary-card');
    
    salaryCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if card is in viewport
        if (cardPosition.top < windowHeight * 0.9) {
            card.classList.add('in-view');
        }
    });
});
