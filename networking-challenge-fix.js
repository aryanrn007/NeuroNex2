/**
 * Networking Challenge Fix
 * This script directly fixes the issue with the "Take Challenge" button
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all "Take Challenge" buttons
    const challengeButtons = document.querySelectorAll('button.secondary-btn, button.hero-secondary-btn');
    
    // Attach direct event listeners to all potential challenge buttons
    challengeButtons.forEach(button => {
        if (button.textContent.trim() === 'Take Challenge') {
            // Remove any existing onclick handlers
            button.removeAttribute('onclick');
            
            // Add our own click event listener
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openNetworkingChallengeModal();
            });
            
            console.log('Fixed "Take Challenge" button:', button);
        }
    });
    
    // Create a global function to open the networking challenge modal
    window.openNetworkingChallengeModal = function() {
        console.log('Opening networking challenge modal...');
        
        // Create the modal if it doesn't exist
        let modal = document.getElementById('networking-challenge-modal');
        
        if (!modal) {
            console.log('Creating new modal...');
            modal = document.createElement('div');
            modal.id = 'networking-challenge-modal';
            modal.className = 'modal';
            
            const modalContent = `
                <div class="modal-content networking-challenge-content">
                    <span class="close-modal-btn" onclick="closeNetworkingChallengeModal()">&times;</span>
                    <div class="modal-header">
                        <h2><i class="fas fa-users"></i> 7-Day Networking Challenge</h2>
                        <p>Complete these tasks to expand your professional network</p>
                    </div>
                    <div class="challenge-tasks">
                        ${generateChallengeTasksHTML()}
                    </div>
                    <div class="modal-footer">
                        <button class="challenge-start-btn" onclick="acceptNetworkingChallenge()">Accept Challenge</button>
                        <button class="challenge-cancel-btn" onclick="closeNetworkingChallengeModal()">Maybe Later</button>
                    </div>
                </div>
            `;
            
            modal.innerHTML = modalContent;
            document.body.appendChild(modal);
            
            // Add modal styles
            addNetworkingModalStyles();
        }
        
        // Show the modal
        modal.style.display = 'block';
        
        // Update task checkboxes
        updateChallengeTasksStatus();
    };
    
    // Create a global function to close the networking challenge modal
    window.closeNetworkingChallengeModal = function() {
        console.log('Closing networking challenge modal...');
        const modal = document.getElementById('networking-challenge-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
    
    // Generate HTML for challenge tasks
    function generateChallengeTasksHTML() {
        const tasks = [
            { id: 'task1', text: 'Connect with 3 classmates or colleagues on LinkedIn' },
            { id: 'task2', text: 'Join 2 industry-specific groups on LinkedIn or Facebook' },
            { id: 'task3', text: 'Attend a virtual networking event or webinar' },
            { id: 'task4', text: 'Reach out to a professional you admire for advice' },
            { id: 'task5', text: 'Update your LinkedIn profile with recent achievements' },
            { id: 'task6', text: 'Share an industry article with your network' },
            { id: 'task7', text: 'Comment meaningfully on 3 posts from your connections' }
        ];
        
        return tasks.map(task => `
            <div class="challenge-task">
                <input type="checkbox" id="${task.id}" class="task-checkbox" onchange="saveTaskStatus('${task.id}', this.checked)">
                <label for="${task.id}">${task.text}</label>
            </div>
        `).join('');
    }
    
    // Update challenge tasks status based on localStorage
    function updateChallengeTasksStatus() {
        const completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
        
        completedTasks.forEach(taskId => {
            const checkbox = document.getElementById(taskId);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
    
    // Save task status to localStorage
    window.saveTaskStatus = function(taskId, isCompleted) {
        let completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
        
        if (isCompleted && !completedTasks.includes(taskId)) {
            completedTasks.push(taskId);
        } else if (!isCompleted && completedTasks.includes(taskId)) {
            completedTasks = completedTasks.filter(id => id !== taskId);
        }
        
        localStorage.setItem('networkingCompletedTasks', JSON.stringify(completedTasks));
        
        // Increment connection count when completing a task
        if (isCompleted) {
            incrementConnectionCount();
        }
    };
    
    // Increment connection count
    function incrementConnectionCount() {
        let connectionCount = parseInt(localStorage.getItem('networkingConnectionCount')) || 50;
        connectionCount += 1;
        localStorage.setItem('networkingConnectionCount', connectionCount);
        
        // Update displayed count if present
        const counterElement = document.querySelector('.connection-counter .count');
        if (counterElement) {
            counterElement.textContent = connectionCount;
            
            // Add animation
            counterElement.classList.add('highlight');
            setTimeout(() => {
                counterElement.classList.remove('highlight');
            }, 1500);
        }
    }
    
    // Accept networking challenge
    window.acceptNetworkingChallenge = function() {
        // Set challenge as accepted in localStorage
        localStorage.setItem('networkingChallengeAccepted', 'true');
        localStorage.setItem('networkingChallengeDate', new Date().toISOString());
        
        // Show success message
        const modal = document.getElementById('networking-challenge-modal');
        if (modal) {
            modal.querySelector('.modal-content').innerHTML = `
                <div class="challenge-success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Challenge Accepted!</h2>
                    <p>You've started the 7-day networking challenge. Complete the tasks to grow your professional network!</p>
                    <button class="challenge-close-btn" onclick="closeNetworkingChallengeModal()">Start Now</button>
                </div>
            `;
        }
    };
    
    // Add networking modal styles
    function addNetworkingModalStyles() {
        // Check if styles already exist
        if (document.getElementById('networking-challenge-modal-styles')) {
            return;
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'networking-challenge-modal-styles';
        styleElement.textContent = `
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                overflow: auto;
            }
            
            .modal-content {
                position: relative;
                background-color: #fff;
                margin: 10% auto;
                width: 90%;
                max-width: 500px;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                animation: modalFadeIn 0.3s ease-out;
            }
            
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-header {
                background: linear-gradient(135deg, #f2994a, #f8b500);
                color: white;
                padding: 20px;
                text-align: center;
            }
            
            .modal-header h2 {
                margin: 0 0 10px;
                font-size: 24px;
                font-weight: 600;
            }
            
            .modal-header p {
                margin: 0;
                font-size: 16px;
                opacity: 0.9;
            }
            
            .challenge-tasks {
                padding: 20px;
                max-height: 300px;
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
});
