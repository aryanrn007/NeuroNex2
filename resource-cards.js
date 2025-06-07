/**
 * Resource Cards Functionality
 * Enhances all resource cards with interactive features
 */

// Initialize all resource cards when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update counters for each card
    updateResumeCounter();
    updateInterviewCounter();
    updateSalaryCounter();
    updateNetworkingCounter();
    
    // Update progress bars
    updateResumeProgress();
    updateInterviewProgress();
    updateSalaryProgress();
    updateNetworkingProgress();
});

/**
 * Resume Builder Card Functions
 */
function updateResumeCounter() {
    const counterElement = document.querySelector('.resume-card .counter .count');
    if (!counterElement) return;
    
    // Get resume count from localStorage or use default
    let resumeCount = localStorage.getItem('resumeCount');
    
    if (!resumeCount) {
        // Default to 2 resumes
        resumeCount = 2;
        localStorage.setItem('resumeCount', resumeCount);
    }
    
    // Update the displayed count
    counterElement.textContent = resumeCount;
}

function updateResumeProgress() {
    const progressBar = document.querySelector('.resume-card .progress-bar');
    if (!progressBar) return;
    
    // Get resume completion percentage from localStorage or use default
    const completionPercentage = localStorage.getItem('resumeCompletionPercentage') || 65;
    
    // Update progress bar width
    progressBar.style.width = `${completionPercentage}%`;
    
    // Add tooltip with progress information
    progressBar.parentElement.setAttribute('title', `${completionPercentage}% of your resume completed`);
}

function startResumeBuilder() {
    window.location.href = 'resume-builder.html';
}

function startResumeAnalyzer() {
    window.location.href = 'resume-analyzer.html';
}

function viewResumes() {
    window.location.href = 'resume-builder.html?view=saved';
}

/**
 * Interview Prep Card Functions
 */
function updateInterviewCounter() {
    const counterElement = document.querySelector('.interview-card .counter .count');
    if (!counterElement) return;
    
    // Get interview count from localStorage or use default
    let interviewCount = localStorage.getItem('completedInterviewCount');
    
    if (!interviewCount) {
        // Default to 3 interviews
        interviewCount = 3;
        localStorage.setItem('completedInterviewCount', interviewCount);
    }
    
    // Update the displayed count
    counterElement.textContent = interviewCount;
}

function updateInterviewProgress() {
    const progressBar = document.querySelector('.interview-card .progress-bar');
    if (!progressBar) return;
    
    // Get interview skill level from localStorage or use default
    const skillLevel = localStorage.getItem('interviewSkillLevel') || 42;
    
    // Update progress bar width
    progressBar.style.width = `${skillLevel}%`;
    
    // Add tooltip with progress information
    progressBar.parentElement.setAttribute('title', `Interview readiness: ${skillLevel}%`);
}

function startInterviewPractice() {
    window.location.href = 'interview-prep.html';
}

function viewPastInterviews() {
    window.location.href = 'interview-prep.html?view=history';
}

/**
 * Salary Insights Card Functions
 */
function updateSalaryCounter() {
    const counterElement = document.querySelector('.salary-card .counter .count');
    if (!counterElement) return;
    
    // Get saved salary insights count from localStorage or use default
    let savedInsightsCount = localStorage.getItem('savedSalaryInsightsCount');
    
    if (!savedInsightsCount) {
        // Default to 5 saved insights
        savedInsightsCount = 5;
        localStorage.setItem('savedSalaryInsightsCount', savedInsightsCount);
    }
    
    // Update the displayed count
    counterElement.textContent = savedInsightsCount;
}

function updateSalaryProgress() {
    const progressBar = document.querySelector('.salary-card .progress-bar');
    if (!progressBar) return;
    
    // Get salary research completion from localStorage or use default
    const researchCompletion = localStorage.getItem('salaryResearchCompletion') || 30;
    
    // Update progress bar width
    progressBar.style.width = `${researchCompletion}%`;
    
    // Add tooltip with progress information
    progressBar.parentElement.setAttribute('title', `${researchCompletion}% of salary research completed`);
}

function viewSalaryInsights() {
    window.location.href = 'salary-insights.html';
}

function compareSalaries() {
    window.location.href = 'salary-insights.html?view=compare';
}

/**
 * Networking Card Functions
 */
function updateNetworkingCounter() {
    const counterElement = document.querySelector('.networking-card .counter .count');
    if (!counterElement) return;
    
    // Get connection count from localStorage or use default
    let connectionCount = localStorage.getItem('networkingConnectionCount');
    
    if (!connectionCount) {
        // Generate a random number between 40 and 60 for initial count
        connectionCount = Math.floor(Math.random() * 21) + 40;
        localStorage.setItem('networkingConnectionCount', connectionCount);
    }
    
    // Update the displayed count
    counterElement.textContent = connectionCount;
}

function updateNetworkingProgress() {
    const progressBar = document.querySelector('.networking-card .progress-bar');
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

function readNetworkingGuide() {
    window.location.href = 'networking-tips.html';
}

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
                    ${generateNetworkingTasksHTML()}
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
    updateNetworkingTasksStatus();
}

function generateNetworkingTasksHTML() {
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

function updateNetworkingTasksStatus() {
    const completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
    
    // Update checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        const taskId = checkbox.id;
        checkbox.checked = completedTasks.includes(taskId);
        
        // Add event listener to save state when changed
        checkbox.addEventListener('change', function() {
            saveNetworkingTaskStatus(taskId, this.checked);
        });
    });
}

function saveNetworkingTaskStatus(taskId, isCompleted) {
    let completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
    
    if (isCompleted && !completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        // Increment connection count when task is completed
        incrementNetworkingConnectionCount();
    } else if (!isCompleted && completedTasks.includes(taskId)) {
        completedTasks = completedTasks.filter(id => id !== taskId);
    }
    
    localStorage.setItem('networkingCompletedTasks', JSON.stringify(completedTasks));
    
    // Update progress bar
    updateNetworkingProgress();
}

function incrementNetworkingConnectionCount() {
    let connectionCount = parseInt(localStorage.getItem('networkingConnectionCount') || '45');
    connectionCount += Math.floor(Math.random() * 3) + 1; // Add 1-3 connections
    localStorage.setItem('networkingConnectionCount', connectionCount);
    
    // Update the displayed count
    const connectionCountElement = document.querySelector('.networking-card .counter .count');
    if (connectionCountElement) {
        connectionCountElement.textContent = connectionCount;
        
        // Add animation to highlight the change
        connectionCountElement.classList.add('highlight');
        setTimeout(() => {
            connectionCountElement.classList.remove('highlight');
        }, 1500);
    }
}

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
}

function closeNetworkingModal() {
    const modal = document.getElementById('networking-challenge-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

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
