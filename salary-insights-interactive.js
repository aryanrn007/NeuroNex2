/**
 * Salary Insights Explorer - Interactive Effects
 * Enhances the UI/UX with animations and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and effects
    initSalaryInsightsAnimations();
    
    // Add event listeners for interactive elements
    addInteractiveEffects();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Initialize charts
    initSalaryCharts();
});

/**
 * Initialize the main animations for the Salary Insights Explorer
 */
function initSalaryInsightsAnimations() {
    // Add staggered animation class to elements
    const animatedElements = document.querySelectorAll('.filter-group, .company-select-group, .recommendation-role, .skill-item');
    
    animatedElements.forEach((element, index) => {
        // Add animation delay based on index
        element.style.animationDelay = `${0.1 * (index + 1)}s`;
        element.classList.add('animated-element');
    });
    
    // Add particle background to header
    createParticleBackground();
}

/**
 * Create a particle background effect for the header
 */
function createParticleBackground() {
    const header = document.querySelector('.salary-header');
    if (!header) return;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    header.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position, size and animation delay
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particleContainer.appendChild(particle);
    }
}

/**
 * Add interactive effects to buttons and form elements
 */
function addInteractiveEffects() {
    // Button click effects
    const buttons = document.querySelectorAll('.juno-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add special effects to personalize button
    const personalizeBtn = document.getElementById('personalize-btn');
    if (personalizeBtn) {
        personalizeBtn.addEventListener('click', function() {
            // Add loading state
            this.classList.add('loading-state');
            
            // Simulate personalization process
            setTimeout(() => {
                this.classList.remove('loading-state');
                
                // Show personalization effect
                const salaryContent = document.querySelector('.salary-content');
                if (salaryContent) {
                    salaryContent.classList.add('personalizing');
                    
                    setTimeout(() => {
                        salaryContent.classList.remove('personalizing');
                        showPersonalizationComplete();
                    }, 1000);
                }
            }, 1500);
        });
    }
    
    // Add download animation to download button
    const downloadBtn = document.getElementById('download-report-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            this.classList.add('downloading');
            
            // Add download icon animation
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin';
                
                setTimeout(() => {
                    icon.className = 'fas fa-check';
                    
                    setTimeout(() => {
                        icon.className = 'fas fa-file-download';
                        this.classList.remove('downloading');
                    }, 1000);
                }, 1500);
            }
        });
    }
    
    // Location tab switching effect
    const locationTabs = document.querySelectorAll('.location-tab');
    locationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            locationTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding location options
            const location = this.dataset.location;
            document.querySelectorAll('.location-options').forEach(opt => {
                opt.classList.add('hidden');
            });
            
            const targetOptions = document.getElementById(`${location}-locations`);
            if (targetOptions) {
                targetOptions.classList.remove('hidden');
                
                // Add fade-in effect
                targetOptions.classList.add('fade-in');
                setTimeout(() => {
                    targetOptions.classList.remove('fade-in');
                }, 500);
            }
        });
    });
    
    // Filter application effect
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Add loading state
            this.classList.add('loading-state');
            
            // Simulate filter application
            setTimeout(() => {
                this.classList.remove('loading-state');
                
                // Show filter applied notification
                showNotification('Filters applied successfully!', 'success');
            }, 800);
        });
    }
    
    // Reset filters effect
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset all form elements with animation
            const formElements = document.querySelectorAll('input, select');
            
            formElements.forEach((element, index) => {
                setTimeout(() => {
                    if (element.tagName === 'SELECT') {
                        element.selectedIndex = 0;
                    } else if (element.type === 'text') {
                        element.value = '';
                    }
                    
                    // Add reset animation
                    element.classList.add('reset-animation');
                    setTimeout(() => {
                        element.classList.remove('reset-animation');
                    }, 500);
                }, index * 50);
            });
            
            // Show reset notification
            showNotification('Filters have been reset', 'info');
        });
    }
}

/**
 * Initialize hover effects for interactive elements
 */
function initHoverEffects() {
    // Add hover effect to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const impact = this.querySelector('.skill-impact');
            if (impact) {
                impact.classList.add('pulse-animation');
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const impact = this.querySelector('.skill-impact');
            if (impact) {
                impact.classList.remove('pulse-animation');
            }
        });
    });
    
    // Add hover effect to recommendation roles
    const recommendationRoles = document.querySelectorAll('.recommendation-role');
    recommendationRoles.forEach(role => {
        role.addEventListener('mouseenter', function() {
            this.classList.add('highlight-role');
        });
        
        role.addEventListener('mouseleave', function() {
            this.classList.remove('highlight-role');
        });
    });
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements for scroll animation
    const scrollAnimElements = document.querySelectorAll('.recommendation-card, .filter-section, .company-comparison');
    scrollAnimElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, info, warning, error)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.salary-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'salary-notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `salary-notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Show personalization complete effect
 */
function showPersonalizationComplete() {
    // Create confetti effect
    createConfettiEffect();
    
    // Show success message
    showNotification('Personalized insights ready for you!', 'success');
    
    // Highlight personalized elements
    const elements = document.querySelectorAll('.recommendation-card, .salary-dashboard');
    elements.forEach(element => {
        element.classList.add('personalized');
        
        setTimeout(() => {
            element.classList.remove('personalized');
        }, 3000);
    });
}

/**
 * Create confetti effect for celebrations
 */
function createConfettiEffect() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random properties
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation completes
    setTimeout(() => {
        confettiContainer.remove();
    }, 4000);
}

/**
 * Initialize salary charts using Chart.js
 */
function initSalaryCharts() {
    // Initialize Industry Comparison Chart
    initIndustryComparisonChart();
    
    // Initialize Salary Trend Chart
    initSalaryTrendChart();
}

/**
 * Initialize the industry comparison chart
 */
function initIndustryComparisonChart() {
    const ctx = document.getElementById('industryComparisonChart');
    if (!ctx) return;
    
    // Chart data
    const data = {
        labels: ['IT Services', 'Product Development', 'E-commerce', 'FinTech', 'Healthcare Tech', 'EdTech'],
        datasets: [{
            label: 'Average Salary (LPA)',
            data: [12, 18, 15, 20, 16, 14],
            backgroundColor: 'rgba(39, 174, 96, 0.5)',
            borderColor: '#27ae60',
            borderWidth: 1,
            borderRadius: 5,
            hoverBackgroundColor: 'rgba(39, 174, 96, 0.7)'
        }]
    };
    
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `₹${context.raw} LPA`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return `₹${value}L`;
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    };
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

/**
 * Initialize the salary trend chart
 */
function initSalaryTrendChart() {
    const ctx = document.getElementById('salaryTrendChart');
    if (!ctx) return;
    
    // Chart data
    const data = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025 (Projected)'],
        datasets: [{
            label: 'Entry Level',
            data: [5, 5.5, 6, 7, 8, 9],
            borderColor: 'rgba(41, 128, 185, 0.8)',
            backgroundColor: 'rgba(41, 128, 185, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Mid Level',
            data: [10, 11, 12, 14, 16, 18],
            borderColor: 'rgba(39, 174, 96, 0.8)',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Senior Level',
            data: [18, 20, 22, 25, 28, 32],
            borderColor: 'rgba(243, 156, 18, 0.8)',
            backgroundColor: 'rgba(243, 156, 18, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ₹${context.raw}L`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return `₹${value}L`;
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    };
    
    // Create chart
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// Add CSS for dynamic elements
function addDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .animated-element {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .particle-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }
        
        .particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: floatParticle 10s infinite ease-in-out;
        }
        
        @keyframes floatParticle {
            0%, 100% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(30px, 30px);
            }
            50% {
                transform: translate(0, 60px);
            }
            75% {
                transform: translate(-30px, 30px);
            }
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
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
        
        .salary-notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transition: bottom 0.3s ease;
        }
        
        .salary-notification.show {
            bottom: 20px;
        }
        
        .salary-notification.success {
            background-color: #27ae60;
        }
        
        .salary-notification.info {
            background-color: #3498db;
        }
        
        .salary-notification.warning {
            background-color: #f39c12;
        }
        
        .salary-notification.error {
            background-color: #e74c3c;
        }
        
        .personalizing {
            animation: blur 1s forwards;
        }
        
        @keyframes blur {
            0% {
                filter: blur(0);
            }
            50% {
                filter: blur(5px);
            }
            100% {
                filter: blur(0);
            }
        }
        
        .personalized {
            animation: glow 3s;
        }
        
        @keyframes glow {
            0%, 100% {
                box-shadow: 0 0 0 rgba(39, 174, 96, 0);
            }
            50% {
                box-shadow: 0 0 20px rgba(39, 174, 96, 0.5);
            }
        }
        
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        }
        
        .confetti {
            position: absolute;
            top: -10px;
            width: 10px;
            height: 20px;
            opacity: 0.7;
            animation: confettiFall 4s linear forwards;
        }
        
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.7;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        .reset-animation {
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            20%, 60% {
                transform: translateX(-5px);
            }
            40%, 80% {
                transform: translateX(5px);
            }
        }
        
        .pulse-animation {
            animation: pulsate 0.8s infinite;
        }
        
        @keyframes pulsate {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
        
        .highlight-role {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(39, 174, 96, 0.2);
        }
        
        .fade-in {
            animation: fadeIn 0.5s;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .in-view {
            animation: slideInUp 0.8s forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .downloading i {
            margin-right: 8px;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Call dynamic styles function
addDynamicStyles();
