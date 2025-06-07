/**
 * Enhanced Networking Challenge Interactive Features
 * Adds animations, effects, and interactive elements to the Networking Challenge panel
 */

document.addEventListener('DOMContentLoaded', () => {
    initNetworkingChallenge();
    setupViewMoreLess();
});

/**
 * Initialize all networking challenge enhancements
 */
/**
 * Set up the View More/Less functionality for challenge weeks
 */
function setupViewMoreLess() {
    const challengeWeeks = document.querySelectorAll('.challenge-week');
    const viewMoreBtn = document.getElementById('view-more-challenges');
    const viewLessBtn = document.getElementById('view-less-challenges');
    const visibleCountElement = document.getElementById('visible-challenge-count');
    const totalCountElement = document.getElementById('total-challenge-count');
    
    if (!challengeWeeks.length || !viewMoreBtn || !viewLessBtn) return;
    
    // Set total count
    const totalWeeks = challengeWeeks.length;
    if (totalCountElement) totalCountElement.textContent = totalWeeks;
    
    // Initially show only first 6 weeks
    let visibleCount = 6;
    updateVisibleWeeks(challengeWeeks, visibleCount);
    
    // Initially set the visible count display
    if (visibleCountElement) visibleCountElement.textContent = visibleCount;
    
    // View More button click handler
    viewMoreBtn.addEventListener('click', () => {
        // Show 4 more weeks
        visibleCount = Math.min(visibleCount + 4, totalWeeks);
        updateVisibleWeeks(challengeWeeks, visibleCount);
        
        // Update counter
        if (visibleCountElement) visibleCountElement.textContent = visibleCount;
        
        // Show/hide buttons based on current state
        if (visibleCount >= totalWeeks) {
            viewMoreBtn.style.display = 'none';
        }
        viewLessBtn.style.display = 'flex';
        
        // Smooth scroll to newly visible weeks
        const lastVisibleWeek = challengeWeeks[visibleCount - 1];
        if (lastVisibleWeek) {
            setTimeout(() => {
                lastVisibleWeek.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
    
    // View Less button click handler
    viewLessBtn.addEventListener('click', () => {
        // Show only first 6 weeks
        visibleCount = 6;
        updateVisibleWeeks(challengeWeeks, visibleCount);
        
        // Update counter
        if (visibleCountElement) visibleCountElement.textContent = visibleCount;
        
        // Show/hide buttons based on current state
        viewMoreBtn.style.display = 'flex';
        viewLessBtn.style.display = 'none';
        
        // Smooth scroll to top of challenge section
        const challengeSection = document.getElementById('challenge-tracker');
        if (challengeSection) {
            setTimeout(() => {
                challengeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    });
}

/**
 * Update which challenge weeks are visible
 * @param {NodeList} challengeWeeks - All challenge week elements
 * @param {number} visibleCount - Number of weeks to show
 */
function updateVisibleWeeks(challengeWeeks, visibleCount) {
    challengeWeeks.forEach((week, index) => {
        if (index < visibleCount) {
            // Show this week with animation
            week.classList.remove('hidden');
            // Add visible class for animation, but remove first to reset animation
            week.classList.remove('visible');
            setTimeout(() => {
                week.classList.add('visible');
            }, 10);
        } else {
            // Hide this week
            week.classList.add('hidden');
            week.classList.remove('visible');
        }
    });
}

function initNetworkingChallenge() {
    // Apply animations to challenge cards
    animateChallengeCards();
    
    // Set up checkbox interactions with confetti effects
    setupTaskCheckboxes();
    
    // Initialize progress bar animation
    initProgressBar();
    
    // Add hover effects to challenge cards
    addCardHoverEffects();
    
    // Add weekly progress indicators
    addWeeklyProgressIndicators();
}

/**
 * Animate challenge cards with staggered entrance
 */
function animateChallengeCards() {
    const challengeWeeks = document.querySelectorAll('.challenge-week');
    
    if (challengeWeeks.length === 0) return;
    
    // Create observer for entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 150 * index);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial styles and observe
    challengeWeeks.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

/**
 * Set up task checkboxes with animations and persistence
 */
function setupTaskCheckboxes() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    
    if (checkboxes.length === 0) return;
    
    // Load saved states
    loadTaskStates();
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Save state
            saveTaskStates();
            
            // Update progress bar
            updateProgressBar();
            
            // Create confetti effect if checked
            if (this.checked) {
                createConfettiEffect(this);
                
                // Add completion animation to parent task item
                this.closest('.task-item').classList.add('task-completed');
                setTimeout(() => {
                    this.closest('.task-item').classList.remove('task-completed');
                }, 1000);
            }
        });
    });
}

/**
 * Save task checkbox states to localStorage
 */
function saveTaskStates() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const states = {};
    
    checkboxes.forEach(checkbox => {
        states[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('networkingChallengeTaskStates', JSON.stringify(states));
}

/**
 * Load task checkbox states from localStorage
 */
function loadTaskStates() {
    const savedStates = localStorage.getItem('networkingChallengeTaskStates');
    
    if (savedStates) {
        const states = JSON.parse(savedStates);
        const checkboxes = document.querySelectorAll('.task-checkbox');
        
        checkboxes.forEach(checkbox => {
            if (states[checkbox.id] !== undefined) {
                checkbox.checked = states[checkbox.id];
                
                // Apply styles for completed tasks
                if (checkbox.checked) {
                    const label = checkbox.nextElementSibling;
                    if (label && label.tagName === 'LABEL') {
                        label.style.textDecoration = 'line-through';
                        label.style.color = '#888';
                    }
                }
            }
        });
        
        // Update progress bar based on loaded states
        updateProgressBar();
    }
}

/**
 * Create confetti effect when a task is completed
 */
function createConfettiEffect(checkbox) {
    const taskItem = checkbox.closest('.task-item');
    const rect = taskItem.getBoundingClientRect();
    
    // Create 20 confetti particles
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random position around the checkbox
        const x = rect.left + (Math.random() * rect.width);
        const y = rect.top + (Math.random() * 10);
        
        // Random color
        const colors = ['#6c2fff', '#8a64ff', '#f2994a', '#27ae60', '#2d9cdb'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random rotation
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Position and append to body
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        document.body.appendChild(confetti);
        
        // Animate
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 1}s forwards`;
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

/**
 * Initialize progress bar with animation
 */
function initProgressBar() {
    const progressBar = document.getElementById('challenge-progress-bar');
    const progressText = document.getElementById('challenge-progress-text');
    
    if (!progressBar || !progressText) return;
    
    // Initial update
    updateProgressBar();
    
    // Add observer to animate when visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            progressBar.style.transition = 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
            updateProgressBar();
            observer.unobserve(progressBar);
        }
    }, { threshold: 0.1 });
    
    observer.observe(progressBar.parentElement);
}

/**
 * Update progress bar based on completed tasks
 */
function updateProgressBar() {
    const progressBar = document.getElementById('challenge-progress-bar');
    const progressText = document.getElementById('challenge-progress-text');
    
    if (!progressBar || !progressText) return;
    
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const totalTasks = checkboxes.length;
    let completedTasks = 0;
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            completedTasks++;
        }
    });
    
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    
    // Update progress bar width with animation
    progressBar.style.width = `${progressPercentage}%`;
    
    // Update text
    progressText.textContent = `${progressPercentage}%`;
    
    // Add special effects for milestones
    if (progressPercentage >= 100) {
        progressBar.classList.add('progress-complete');
        celebrateCompletion();
    } else {
        progressBar.classList.remove('progress-complete');
    }
    
    // Update weekly progress indicators
    updateWeeklyProgressIndicators();
}

/**
 * Add hover effects to challenge cards
 */
function addCardHoverEffects() {
    const challengeWeeks = document.querySelectorAll('.challenge-week');
    
    challengeWeeks.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle floating animation
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(108, 47, 255, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset to original state
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.02)';
        });
    });
}

/**
 * Add weekly progress indicators to each challenge week
 */
function addWeeklyProgressIndicators() {
    const challengeWeeks = document.querySelectorAll('.challenge-week');
    
    challengeWeeks.forEach(week => {
        // Check if indicator already exists
        if (week.querySelector('.week-progress-indicator')) return;
        
        // Create progress indicator
        const indicator = document.createElement('div');
        indicator.className = 'week-progress-indicator';
        week.appendChild(indicator);
        
        // Style the indicator
        indicator.style.position = 'absolute';
        indicator.style.top = '22px';
        indicator.style.right = '22px';
        indicator.style.width = '30px';
        indicator.style.height = '30px';
        indicator.style.borderRadius = '50%';
        indicator.style.display = 'flex';
        indicator.style.alignItems = 'center';
        indicator.style.justifyContent = 'center';
        indicator.style.fontSize = '0.8rem';
        indicator.style.fontWeight = 'bold';
        indicator.style.color = 'white';
        indicator.style.transition = 'all 0.3s ease';
    });
    
    // Update indicators
    updateWeeklyProgressIndicators();
}

/**
 * Update weekly progress indicators based on task completion
 */
function updateWeeklyProgressIndicators() {
    const challengeWeeks = document.querySelectorAll('.challenge-week');
    
    challengeWeeks.forEach(week => {
        const indicator = week.querySelector('.week-progress-indicator');
        if (!indicator) return;
        
        // Count completed tasks in this week
        const checkboxes = week.querySelectorAll('.task-checkbox');
        const totalTasks = checkboxes.length;
        let completedTasks = 0;
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                completedTasks++;
            }
        });
        
        // Calculate percentage
        const percentage = Math.round((completedTasks / totalTasks) * 100);
        
        // Update indicator
        indicator.textContent = `${completedTasks}/${totalTasks}`;
        
        // Color based on completion
        if (percentage === 0) {
            indicator.style.backgroundColor = '#e0e0e0';
            indicator.style.color = '#666';
        } else if (percentage < 50) {
            indicator.style.backgroundColor = '#f2994a';
        } else if (percentage < 100) {
            indicator.style.backgroundColor = '#6c2fff';
        } else {
            indicator.style.backgroundColor = '#27ae60';
            
            // Add checkmark for completed weeks
            indicator.innerHTML = '<i class="fas fa-check"></i>';
        }
    });
}

/**
 * Celebrate completion of all tasks
 */
function celebrateCompletion() {
    // Check if already celebrated to avoid multiple celebrations
    if (localStorage.getItem('networkingChallengeCelebrated') === 'true') return;
    
    // Create large confetti effect
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position at the top of the challenge section
            const challengeSection = document.getElementById('networking-challenge');
            const rect = challengeSection.getBoundingClientRect();
            const x = rect.left + (Math.random() * rect.width);
            const y = rect.top;
            
            // Random color
            const colors = ['#6c2fff', '#8a64ff', '#f2994a', '#27ae60', '#2d9cdb'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random size
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random shape (square or circle)
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            // Random rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Position and append to body
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            document.body.appendChild(confetti);
            
            // Animate with random duration
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s forwards`;
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 20); // Stagger the confetti creation
    }
    
    // Mark as celebrated
    localStorage.setItem('networkingChallengeCelebrated', 'true');
    
    // Show celebration message
    setTimeout(() => {
        showCompletionMessage();
    }, 1000);
}

/**
 * Show completion message
 */
function showCompletionMessage() {
    // Check if message already exists
    if (document.getElementById('challenge-completion-message')) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.id = 'challenge-completion-message';
    messageDiv.innerHTML = `
        <div class="completion-icon">
            <i class="fas fa-trophy"></i>
        </div>
        <h3>Challenge Complete!</h3>
        <p>Congratulations! You've completed all networking tasks. Your professional network is growing stronger!</p>
        <button id="close-completion-message">Continue</button>
    `;
    
    // Style the message
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '50%';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translate(-50%, -50%)';
    messageDiv.style.background = 'white';
    messageDiv.style.padding = '30px';
    messageDiv.style.borderRadius = '15px';
    messageDiv.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.maxWidth = '400px';
    messageDiv.style.animation = 'fadeInUp 0.5s ease-out';
    
    // Style the icon
    const iconDiv = messageDiv.querySelector('.completion-icon');
    iconDiv.style.fontSize = '50px';
    iconDiv.style.color = '#f2994a';
    iconDiv.style.marginBottom = '15px';
    
    // Style the heading
    const heading = messageDiv.querySelector('h3');
    heading.style.margin = '0 0 10px';
    heading.style.color = '#333';
    heading.style.fontSize = '24px';
    
    // Style the paragraph
    const paragraph = messageDiv.querySelector('p');
    paragraph.style.margin = '0 0 20px';
    paragraph.style.color = '#666';
    
    // Style the button
    const button = messageDiv.querySelector('button');
    button.style.background = 'linear-gradient(90deg, #6c2fff, #8a64ff)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '25px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.transition = 'all 0.2s ease';
    
    // Add hover effect to button
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
    
    // Close message when button is clicked
    button.addEventListener('click', () => {
        messageDiv.style.animation = 'fadeOutDown 0.5s ease-out forwards';
        setTimeout(() => {
            messageDiv.remove();
        }, 500);
    });
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOutDown {
            from {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            to {
                opacity: 0;
                transform: translate(-50%, 30%);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(messageDiv);
}
