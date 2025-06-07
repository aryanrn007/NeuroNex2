/**
 * Networking Challenge Functionality
 * Enhances the LaunchPad networking card with interactive features and animations
 */

// Initialize networking challenge features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update connection count with a random number between 40-60 if available in localStorage
    updateConnectionCount();
    
    // Update progress bar based on completed networking tasks
    updateNetworkingProgress();
    
    // Initialize floating background circles
    initFloatingCircles();
    
    // Add hover effects to networking buttons
    addButtonHoverEffects();
    
    // Initialize animated statistics
    initAnimatedStats();
});

/**
 * Updates the connection counter with data from localStorage or a default value
 */
function updateConnectionCount() {
    const connectionCountElement = document.querySelector('.connection-counter .count');
    if (!connectionCountElement) return;
    
    // Get connection count from localStorage or use default
    let connectionCount = localStorage.getItem('networkingConnectionCount');
    
    if (!connectionCount) {
        // Generate a random number between 40 and 60 for initial count
        connectionCount = Math.floor(Math.random() * 21) + 40;
        localStorage.setItem('networkingConnectionCount', connectionCount);
    }
    
    // Update the displayed count
    connectionCountElement.textContent = connectionCount;
    
    // Add subtle animation to the counter
    connectionCountElement.classList.add('highlight');
    setTimeout(() => {
        connectionCountElement.classList.remove('highlight');
    }, 1500);
}

/**
 * Updates the networking progress bar based on completed tasks
 */
function updateNetworkingProgress() {
    const progressBar = document.querySelector('.networking-progress-bar');
    if (!progressBar) return;
    
    // Get completed networking tasks from localStorage
    const completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
    
    // Calculate progress percentage (out of 10 possible tasks)
    const totalTasks = 10;
    const completedTasksCount = completedTasks.length;
    const progressPercentage = Math.min((completedTasksCount / totalTasks) * 100, 100);
    
    // Update progress bar width
    progressBar.style.width = `${progressPercentage}%`;
    
    // Add tooltip with progress information
    progressBar.parentElement.setAttribute('title', `${completedTasksCount}/${totalTasks} networking tasks completed`);
}

/**
 * Starts the networking challenge with a modal dialog
 */
function startNetworkingChallenge() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('networking-challenge-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'networking-challenge-modal';
        modal.className = 'modal';
        
        const modalContent = `
            <div class="modal-content networking-challenge-content">
                <span class="close-modal-btn" onclick="closeNetworkingModal()">&times;</span>
                <div class="modal-header">
                    <h2><i class="fas fa-users"></i> 7-Day Networking Challenge</h2>
                    <p>Complete these tasks to expand your professional network</p>
                </div>
                <div class="challenge-tasks">
                    ${generateChallengeTasksHTML()}
                </div>
                <div class="modal-footer">
                    <button class="challenge-start-btn" onclick="acceptNetworkingChallenge()">Accept Challenge</button>
                    <button class="challenge-cancel-btn" onclick="closeNetworkingModal()">Maybe Later</button>
                </div>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        // Add modal styles if not already present
        addNetworkingModalStyles();
    }
    
    // Show the modal
    modal.style.display = 'block';
    
    // Update task checkboxes based on localStorage data
    updateChallengeTasksStatus();
}

/**
 * Generates HTML for the networking challenge tasks
 */
function generateChallengeTasksHTML() {
    const tasks = [
        { id: 'optimize-linkedin', text: 'Optimize your LinkedIn profile with keywords' },
        { id: 'connect-5', text: 'Connect with 5 professionals in your field' },
        { id: 'join-group', text: 'Join an industry-specific group or community' },
        { id: 'share-article', text: 'Share an industry article with your thoughts' },
        { id: 'comment-posts', text: 'Comment meaningfully on 3 posts from your network' },
        { id: 'attend-event', text: 'Attend a virtual or in-person networking event' },
        { id: 'informational-interview', text: 'Request an informational interview' },
        { id: 'update-resume', text: 'Update your resume with networking achievements' },
        { id: 'follow-companies', text: 'Follow 5 target companies on social media' },
        { id: 'create-content', text: 'Create and share original content in your field' }
    ];
    
    return tasks.map(task => `
        <div class="challenge-task" data-task-id="${task.id}">
            <input type="checkbox" id="${task.id}" class="task-checkbox">
            <label for="${task.id}">${task.text}</label>
        </div>
    `).join('');
}

/**
 * Updates the challenge tasks checkboxes based on localStorage data
 */
function updateChallengeTasksStatus() {
    const completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
    
    // Update checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        const taskId = checkbox.id;
        checkbox.checked = completedTasks.includes(taskId);
        
        // Add event listener to save state when changed
        checkbox.addEventListener('change', function() {
            saveTaskStatus(taskId, this.checked);
        });
    });
}

/**
 * Saves the task status to localStorage and updates the progress
 */
function saveTaskStatus(taskId, isCompleted) {
    let completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
    
    if (isCompleted && !completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        // Increment connection count when task is completed
        incrementConnectionCount();
    } else if (!isCompleted && completedTasks.includes(taskId)) {
        completedTasks = completedTasks.filter(id => id !== taskId);
    }
    
    localStorage.setItem('networkingCompletedTasks', JSON.stringify(completedTasks));
    
    // Update progress bar
    updateNetworkingProgress();
}

/**
 * Increments the connection count when tasks are completed
 */
function incrementConnectionCount() {
    let connectionCount = parseInt(localStorage.getItem('networkingConnectionCount') || '45');
    connectionCount += Math.floor(Math.random() * 3) + 1; // Add 1-3 connections
    localStorage.setItem('networkingConnectionCount', connectionCount);
    
    // Update the displayed count
    const connectionCountElement = document.querySelector('.connection-counter .count');
    if (connectionCountElement) {
        connectionCountElement.textContent = connectionCount;
        
        // Add animation to highlight the change
        connectionCountElement.classList.add('highlight');
        setTimeout(() => {
            connectionCountElement.classList.remove('highlight');
        }, 1500);
    }
}

/**
 * Accepts the networking challenge and sets up reminders
 */
function acceptNetworkingChallenge() {
    // Save challenge acceptance to localStorage
    localStorage.setItem('networkingChallengeAccepted', 'true');
    localStorage.setItem('networkingChallengeStartDate', new Date().toISOString());
    
    // Show success message
    const modalContent = document.querySelector('.networking-challenge-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="challenge-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Challenge Accepted!</h2>
                <p>You've started the 7-Day Networking Challenge. Complete tasks to grow your network!</p>
                <button class="challenge-close-btn" onclick="closeNetworkingModal()">Let's Get Started</button>
            </div>
        `;
    }
    
    // Set a reminder notification
    scheduleNetworkingReminder();
}

/**
 * Schedules a reminder notification for the networking challenge
 */
function scheduleNetworkingReminder() {
    // This is a simulated reminder - in a real app, this would use the Notifications API
    // For demo purposes, we'll just set a flag in localStorage
    localStorage.setItem('showNetworkingReminder', 'true');
}

/**
 * Closes the networking challenge modal
 */
function closeNetworkingModal() {
    const modal = document.getElementById('networking-challenge-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
    }
}

/**
 * Creates and animates floating background circles in the networking card header
 */
function initFloatingCircles() {
    const networkingCardHeader = document.querySelector('.networking-card-header');
    if (!networkingCardHeader) return;
    
    // Create container for circles if it doesn't exist
    let circlesContainer = networkingCardHeader.querySelector('.floating-circles');
    if (!circlesContainer) {
        circlesContainer = document.createElement('div');
        circlesContainer.className = 'floating-circles';
        networkingCardHeader.appendChild(circlesContainer);
    }
    
    // Clear existing circles
    circlesContainer.innerHTML = '';
    
    // Create 5 floating circles with different sizes and animations
    for (let i = 0; i < 5; i++) {
        const circle = document.createElement('div');
        circle.className = 'floating-circle';
        
        // Random size between 10px and 30px
        const size = Math.floor(Math.random() * 20) + 10;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        
        // Random position within the header
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration between 10s and 20s
        const duration = Math.floor(Math.random() * 10) + 10;
        circle.style.animation = `floatCircle ${duration}s infinite ease-in-out`;
        
        // Random delay for animation
        circle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Random opacity between 0.1 and 0.3
        circle.style.opacity = (Math.random() * 0.2 + 0.1).toFixed(2);
        
        circlesContainer.appendChild(circle);
    }
    
    // Add necessary styles if not already in the document
    if (!document.getElementById('floating-circles-style')) {
        const style = document.createElement('style');
        style.id = 'floating-circles-style';
        style.textContent = `
            .floating-circles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                pointer-events: none;
            }
            
            .floating-circle {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.3);
                pointer-events: none;
            }
            
            @keyframes floatCircle {
                0% { transform: translate(0, 0) scale(1); }
                25% { transform: translate(10px, -15px) scale(1.05); }
                50% { transform: translate(20px, 10px) scale(1.1); }
                75% { transform: translate(-10px, 15px) scale(1.05); }
                100% { transform: translate(0, 0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Adds hover effects to networking buttons
 */
function addButtonHoverEffects() {
    const networkingButtons = document.querySelectorAll('.networking-card .card-button, .networking-panel .btn');
    
    networkingButtons.forEach(button => {
        // Skip if already processed
        if (button.dataset.hoverInitialized) return;
        button.dataset.hoverInitialized = 'true';
        
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
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
        
        // Add hover glow effect
        button.addEventListener('mouseenter', function() {
            this.classList.add('button-glow');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('button-glow');
        });
    });
    
    // Add necessary styles if not already in the document
    if (!document.getElementById('button-hover-effects-style')) {
        const style = document.createElement('style');
        style.id = 'button-hover-effects-style';
        style.textContent = `
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.7);
                width: 100px;
                height: 100px;
                margin-top: -50px;
                margin-left: -50px;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
            
            .button-glow {
                box-shadow: 0 0 10px rgba(242, 153, 74, 0.5), 0 0 20px rgba(242, 153, 74, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initializes animated statistics in the networking card
 */
function initAnimatedStats() {
    const statsElements = document.querySelectorAll('.networking-card .stat-value, .networking-panel .stat-number');
    
    // Create Intersection Observer to animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1 });
    
    statsElements.forEach(stat => {
        // Skip if already processed
        if (stat.dataset.animationInitialized) return;
        stat.dataset.animationInitialized = 'true';
        
        // Store the target value
        const targetValue = parseInt(stat.textContent, 10);
        stat.setAttribute('data-target', targetValue);
        stat.textContent = '0';
        
        // Observe the stat element
        observer.observe(stat);
    });
}

/**
 * Animates a statistic from 0 to its target value
 * @param {HTMLElement} statElement - The element containing the statistic
 */
function animateStat(statElement) {
    const targetValue = parseInt(statElement.getAttribute('data-target'), 10);
    const duration = 1500; // Animation duration in milliseconds
    const frameDuration = 16; // Approx. 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let currentFrame = 0;
    
    function updateValue() {
        currentFrame++;
        const progress = currentFrame / totalFrames;
        const currentValue = Math.round(easeOutQuad(progress) * targetValue);
        
        statElement.textContent = currentValue;
        
        if (currentFrame < totalFrames) {
            requestAnimationFrame(updateValue);
        } else {
            statElement.textContent = targetValue;
            statElement.classList.add('stat-highlighted');
            setTimeout(() => {
                statElement.classList.remove('stat-highlighted');
            }, 500);
        }
    }
    
    // Easing function for smoother animation
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    updateValue();
    
    // Add necessary styles if not already in the document
    if (!document.getElementById('animated-stats-style')) {
        const style = document.createElement('style');
        style.id = 'animated-stats-style';
        style.textContent = `
            .stat-highlighted {
                color: var(--networking-primary) !important;
                transform: scale(1.1);
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Adds necessary styles for the networking challenge modal
 */
function addNetworkingModalStyles() {
    // Check if styles already exist
    if (document.getElementById('networking-challenge-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'networking-challenge-styles';
    
    styleElement.textContent = `
        /* Networking Challenge Modal Styles */
        #networking-challenge-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            overflow: auto;
        }
        
        .networking-challenge-content {
            background: #fff;
            margin: 5% auto;
            width: 90%;
            max-width: 600px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }
        
        .modal-header {
            background: linear-gradient(135deg, #f2994a, #f8b500);
            padding: 20px;
            color: white;
            text-align: center;
        }
        
        .modal-header h2 {
            font-size: 22px;
            margin: 0 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .modal-header p {
            font-size: 14px;
            margin: 0;
            opacity: 0.9;
        }
        
        .challenge-tasks {
            padding: 20px;
            max-height: 350px;
            overflow-y: auto;
        }
        
        .challenge-task {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 8px;
            transition: background-color 0.2s;
        }
        
        .challenge-task:hover {
            background-color: #f9f9f9;
        }
        
        .task-checkbox {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            accent-color: #f2994a;
        }
        
        .challenge-task label {
            font-size: 14px;
            cursor: pointer;
            flex: 1;
        }
        
        .modal-footer {
            padding: 15px 20px;
            display: flex;
            justify-content: center;
            gap: 15px;
            border-top: 1px solid #eee;
        }
        
        .challenge-start-btn {
            background: linear-gradient(135deg, #f2994a, #f8b500);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 10px rgba(242, 153, 74, 0.2);
        }
        
        .challenge-start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(242, 153, 74, 0.3);
        }
        
        .challenge-cancel-btn {
            background: transparent;
            color: #666;
            border: 1px solid #ddd;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .challenge-cancel-btn:hover {
            background: #f5f5f5;
        }
        
        .close-modal-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            color: white;
            cursor: pointer;
            z-index: 10;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .close-modal-btn:hover {
            opacity: 1;
        }
        
        .challenge-success {
            padding: 40px 20px;
            text-align: center;
        }
        
        .success-icon {
            font-size: 60px;
            color: #27ae60;
            margin-bottom: 20px;
        }
        
        .challenge-success h2 {
            font-size: 24px;
            margin: 0 0 15px;
            color: #333;
        }
        
        .challenge-success p {
            font-size: 16px;
            color: #666;
            margin: 0 0 25px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .challenge-close-btn {
            background: linear-gradient(135deg, #f2994a, #f8b500);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 10px rgba(242, 153, 74, 0.2);
        }
        
        .challenge-close-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(242, 153, 74, 0.3);
        }
        
        /* Animation for connection counter */
        .connection-counter .count.highlight {
            animation: pulse 1.5s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            25% { transform: scale(1.2); color: #f2994a; }
            50% { transform: scale(1); }
            100% { transform: scale(1); }
        }
        
        /* Dark mode support */
        .dark-mode .networking-challenge-content {
            background: #2a2a2a;
        }
        
        .dark-mode .challenge-task label {
            color: #e0e0e0;
        }
        
        .dark-mode .challenge-task:hover {
            background-color: #333;
        }
        
        .dark-mode .modal-footer {
            border-top: 1px solid #444;
        }
        
        .dark-mode .challenge-cancel-btn {
            color: #ccc;
            border: 1px solid #555;
        }
        
        .dark-mode .challenge-cancel-btn:hover {
            background: #333;
        }
        
        .dark-mode .challenge-success h2 {
            color: #e0e0e0;
        }
        
        .dark-mode .challenge-success p {
            color: #b0b0b0;
        }
    `;
    
    document.head.appendChild(styleElement);
}
