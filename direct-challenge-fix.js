/**
 * Direct Challenge Fix
 * This script directly creates and manages the networking challenge modal
 * without relying on any existing code
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct challenge fix loaded');
    
    // Find all "Take Challenge" buttons
    const challengeButtons = Array.from(document.querySelectorAll('button')).filter(button => 
        button.textContent.trim() === 'Take Challenge' || 
        button.innerText.trim() === 'Take Challenge'
    );
    
    console.log('Found Take Challenge buttons:', challengeButtons.length);
    
    // Attach direct event listeners to all potential challenge buttons
    challengeButtons.forEach(button => {
        // Remove any existing onclick handlers
        const oldOnClick = button.getAttribute('onclick');
        button.removeAttribute('onclick');
        
        // Add our own click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Take Challenge button clicked');
            showDirectChallengeModal();
        });
        
        console.log('Fixed "Take Challenge" button:', button.outerHTML);
    });
    
    // Create and show the direct challenge modal
    function showDirectChallengeModal() {
        console.log('Showing direct challenge modal');
        
        // Remove any existing modal
        const existingModal = document.getElementById('direct-challenge-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        // Create the modal container
        const modal = document.createElement('div');
        modal.id = 'direct-challenge-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';
        
        // Create the modal content
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.borderRadius = '15px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflow = 'hidden';
        modalContent.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        modalContent.style.display = 'flex';
        modalContent.style.flexDirection = 'column';
        
        // Create the header
        const header = document.createElement('div');
        header.style.background = 'linear-gradient(135deg, #f2994a, #f8b500)';
        header.style.color = 'white';
        header.style.padding = '20px';
        header.style.position = 'relative';
        
        const headerTitle = document.createElement('h2');
        headerTitle.textContent = '7-Day Networking Challenge';
        headerTitle.style.margin = '0 0 10px';
        headerTitle.style.fontSize = '24px';
        headerTitle.style.fontWeight = '600';
        headerTitle.style.textAlign = 'center';
        
        const headerIcon = document.createElement('i');
        headerIcon.className = 'fas fa-users';
        headerIcon.style.marginRight = '10px';
        headerTitle.prepend(headerIcon);
        
        const headerText = document.createElement('p');
        headerText.textContent = 'Complete these tasks to expand your professional network';
        headerText.style.margin = '0';
        headerText.style.fontSize = '16px';
        headerText.style.opacity = '0.9';
        headerText.style.textAlign = 'center';
        
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '15px';
        closeButton.style.fontSize = '24px';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '10';
        closeButton.style.opacity = '0.8';
        closeButton.addEventListener('click', closeDirectChallengeModal);
        
        header.appendChild(headerTitle);
        header.appendChild(headerText);
        header.appendChild(closeButton);
        
        // Create the tasks section
        const tasksSection = document.createElement('div');
        tasksSection.style.padding = '20px';
        tasksSection.style.overflowY = 'auto';
        
        const tasks = [
            { id: 'task1', text: 'Connect with 3 classmates or colleagues on LinkedIn' },
            { id: 'task2', text: 'Join 2 industry-specific groups on LinkedIn or Facebook' },
            { id: 'task3', text: 'Attend a virtual networking event or webinar' },
            { id: 'task4', text: 'Reach out to a professional you admire for advice' },
            { id: 'task5', text: 'Update your LinkedIn profile with recent achievements' },
            { id: 'task6', text: 'Share an industry article with your network' },
            { id: 'task7', text: 'Comment meaningfully on 3 posts from your connections' }
        ];
        
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.style.display = 'flex';
            taskDiv.style.alignItems = 'center';
            taskDiv.style.marginBottom = '15px';
            taskDiv.style.padding = '10px';
            taskDiv.style.borderRadius = '8px';
            taskDiv.style.transition = 'background-color 0.2s';
            
            taskDiv.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#f9f9f9';
            });
            
            taskDiv.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = task.id;
            checkbox.style.marginRight = '10px';
            checkbox.style.width = '18px';
            checkbox.style.height = '18px';
            checkbox.style.accentColor = '#f2994a';
            
            const label = document.createElement('label');
            label.htmlFor = task.id;
            label.textContent = task.text;
            label.style.fontSize = '14px';
            label.style.cursor = 'pointer';
            label.style.flex = '1';
            
            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(label);
            tasksSection.appendChild(taskDiv);
        });
        
        // Create the footer
        const footer = document.createElement('div');
        footer.style.padding = '15px 20px';
        footer.style.display = 'flex';
        footer.style.justifyContent = 'center';
        footer.style.gap = '15px';
        footer.style.borderTop = '1px solid #eee';
        
        // Check if challenge has already been accepted
        const challengeAccepted = localStorage.getItem('networkingChallengeAccepted') === 'true';
        
        // Create primary action button (Accept or Discard based on state)
        const primaryButton = document.createElement('button');
        
        if (challengeAccepted) {
            // Challenge already accepted - show Discard button
            primaryButton.textContent = 'Discard Challenge';
            primaryButton.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            primaryButton.addEventListener('click', function() {
                // Remove challenge data from localStorage
                localStorage.removeItem('networkingChallengeAccepted');
                localStorage.removeItem('networkingChallengeDate');
                localStorage.removeItem('networkingCompletedTasks');
                
                // Close the modal
                closeDirectChallengeModal();
                
                // Remove the tracker if it exists
                const tracker = document.getElementById('networking-challenge-tracker');
                if (tracker) {
                    document.body.removeChild(tracker);
                }
                
                // Show confirmation toast
                showToast('Challenge discarded successfully');
            });
        } else {
            // Challenge not yet accepted - show Accept button
            primaryButton.textContent = 'Accept Challenge';
            primaryButton.style.background = 'linear-gradient(135deg, #f2994a, #f8b500)';
            primaryButton.addEventListener('click', acceptNetworkingChallenge);
        }
        
        // Style the primary button
        primaryButton.style.color = 'white';
        primaryButton.style.border = 'none';
        primaryButton.style.padding = '10px 20px';
        primaryButton.style.borderRadius = '20px';
        primaryButton.style.fontWeight = '500';
        primaryButton.style.cursor = 'pointer';
        primaryButton.style.transition = 'all 0.2s';
        primaryButton.style.boxShadow = '0 4px 10px rgba(242, 153, 74, 0.2)';
        
        primaryButton.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 15px rgba(242, 153, 74, 0.3)';
        });
        
        primaryButton.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 10px rgba(242, 153, 74, 0.2)';
        });
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = challengeAccepted ? 'Close' : 'Maybe Later';
        cancelButton.style.background = 'transparent';
        cancelButton.style.color = '#666';
        cancelButton.style.border = '1px solid #ddd';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.borderRadius = '20px';
        cancelButton.style.fontWeight = '500';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.transition = 'all 0.2s';
        
        cancelButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
        
        cancelButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        cancelButton.addEventListener('click', closeDirectChallengeModal);
        
        footer.appendChild(primaryButton);
        footer.appendChild(cancelButton);
        
        // Assemble the modal
        modalContent.appendChild(header);
        modalContent.appendChild(tasksSection);
        modalContent.appendChild(footer);
        modal.appendChild(modalContent);
        
        // Add the modal to the document
        document.body.appendChild(modal);
        
        // Prevent closing when clicking on the modal content
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Close when clicking outside the modal content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDirectChallengeModal();
            }
        });
        
        console.log('Modal added to document');
    }
    
    // Close the direct challenge modal
    function closeDirectChallengeModal() {
        console.log('Closing direct challenge modal');
        const modal = document.getElementById('direct-challenge-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
    }
    
    // Accept networking challenge
    function acceptNetworkingChallenge() {
        console.log('Accepting networking challenge');
        
        // Set challenge as accepted in localStorage
        localStorage.setItem('networkingChallengeAccepted', 'true');
        localStorage.setItem('networkingChallengeDate', new Date().toISOString());
        
        // Get the modal
        const modal = document.getElementById('direct-challenge-modal');
        if (!modal) return;
        
        // Get the modal content
        const modalContent = modal.querySelector('div');
        if (!modalContent) return;
        
        // Clear the modal content
        modalContent.innerHTML = '';
        
        // Create success content
        const successDiv = document.createElement('div');
        successDiv.style.padding = '40px 20px';
        successDiv.style.textAlign = 'center';
        
        const successIcon = document.createElement('div');
        successIcon.style.fontSize = '60px';
        successIcon.style.color = '#27ae60';
        successIcon.style.marginBottom = '20px';
        
        const checkIcon = document.createElement('i');
        checkIcon.className = 'fas fa-check-circle';
        successIcon.appendChild(checkIcon);
        
        const successTitle = document.createElement('h2');
        successTitle.textContent = 'Challenge Accepted!';
        successTitle.style.fontSize = '24px';
        successTitle.style.margin = '0 0 15px';
        successTitle.style.color = '#333';
        
        const successText = document.createElement('p');
        successText.textContent = 'You\'ve started the 7-day networking challenge. Complete the tasks to grow your professional network!';
        successText.style.fontSize = '16px';
        successText.style.color = '#666';
        successText.style.margin = '0 0 25px';
        successText.style.maxWidth = '400px';
        successText.style.marginLeft = 'auto';
        successText.style.marginRight = 'auto';
        
        const startNowBtn = document.createElement('button');
        startNowBtn.textContent = 'Start Now';
        startNowBtn.style.background = 'linear-gradient(135deg, #f2994a, #f8b500)';
        startNowBtn.style.color = 'white';
        startNowBtn.style.border = 'none';
        startNowBtn.style.padding = '12px 25px';
        startNowBtn.style.borderRadius = '25px';
        startNowBtn.style.fontWeight = '500';
        startNowBtn.style.cursor = 'pointer';
        startNowBtn.style.transition = 'all 0.2s';
        startNowBtn.style.boxShadow = '0 4px 10px rgba(242, 153, 74, 0.2)';
        
        startNowBtn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 15px rgba(242, 153, 74, 0.3)';
        });
        
        startNowBtn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 10px rgba(242, 153, 74, 0.2)';
        });
        
        startNowBtn.addEventListener('click', function() {
            // Close the modal
            closeDirectChallengeModal();
            
            // Show the challenge tracker
            showChallengeTracker();
        });
        
        successDiv.appendChild(successIcon);
        successDiv.appendChild(successTitle);
        successDiv.appendChild(successText);
        successDiv.appendChild(startNowBtn);
        
        modalContent.appendChild(successDiv);
    }
    
    // Show a toast notification
    function showToast(message) {
        console.log('Showing toast:', message);
        
        // Create toast container
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '4px';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '500';
        toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        toast.style.zIndex = '10000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-in-out';
        toast.textContent = message;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Show the challenge tracker
    function showChallengeTracker() {
        console.log('Showing challenge tracker');
        
        // Create the tracker container
        const trackerContainer = document.createElement('div');
        trackerContainer.id = 'networking-challenge-tracker';
        trackerContainer.style.position = 'fixed';
        trackerContainer.style.bottom = '20px';
        trackerContainer.style.right = '20px';
        trackerContainer.style.width = '300px';
        trackerContainer.style.backgroundColor = 'white';
        trackerContainer.style.borderRadius = '10px';
        trackerContainer.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        trackerContainer.style.zIndex = '1000';
        trackerContainer.style.overflow = 'hidden';
        trackerContainer.style.transition = 'all 0.3s ease';
        trackerContainer.style.animation = 'slideInFromBottom 0.5s ease-out';
        
        // Add animation keyframes
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes slideInFromBottom {
                0% {
                    transform: translateY(100px);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(styleElement);
        
        // Create the header
        const header = document.createElement('div');
        header.style.background = 'linear-gradient(135deg, #f2994a, #f8b500)';
        header.style.color = 'white';
        header.style.padding = '15px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        
        const headerTitle = document.createElement('h3');
        headerTitle.textContent = '7-Day Challenge';
        headerTitle.style.margin = '0';
        headerTitle.style.fontSize = '16px';
        headerTitle.style.fontWeight = '600';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0';
        closeButton.style.lineHeight = '1';
        closeButton.style.opacity = '0.8';
        closeButton.style.transition = 'opacity 0.2s';
        
        closeButton.addEventListener('mouseover', function() {
            this.style.opacity = '1';
        });
        
        closeButton.addEventListener('mouseout', function() {
            this.style.opacity = '0.8';
        });
        
        closeButton.addEventListener('click', function() {
            document.body.removeChild(trackerContainer);
        });
        
        header.appendChild(headerTitle);
        header.appendChild(closeButton);
        
        // Create the progress section
        const progressSection = document.createElement('div');
        progressSection.style.padding = '15px';
        
        // Get completed tasks from localStorage
        const completedTasks = JSON.parse(localStorage.getItem('networkingCompletedTasks')) || [];
        const totalTasks = 7;
        const completedTaskCount = completedTasks.length;
        const progressPercentage = Math.round((completedTaskCount / totalTasks) * 100);
        
        // Add progress text
        const progressText = document.createElement('div');
        progressText.style.display = 'flex';
        progressText.style.justifyContent = 'space-between';
        progressText.style.marginBottom = '8px';
        
        const progressLabel = document.createElement('span');
        progressLabel.textContent = 'Your Progress:';
        progressLabel.style.fontSize = '14px';
        progressLabel.style.color = '#555';
        
        const progressValue = document.createElement('span');
        progressValue.textContent = `${progressPercentage}%`;
        progressValue.style.fontSize = '14px';
        progressValue.style.fontWeight = '600';
        progressValue.style.color = '#f2994a';
        
        progressText.appendChild(progressLabel);
        progressText.appendChild(progressValue);
        
        // Add progress bar
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.width = '100%';
        progressBarContainer.style.height = '8px';
        progressBarContainer.style.backgroundColor = '#f0f0f0';
        progressBarContainer.style.borderRadius = '4px';
        progressBarContainer.style.overflow = 'hidden';
        
        const progressBar = document.createElement('div');
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#f2994a';
        progressBar.style.transition = 'width 0.5s ease';
        
        progressBarContainer.appendChild(progressBar);
        
        // Add task counter
        const taskCounter = document.createElement('div');
        taskCounter.style.marginTop = '10px';
        taskCounter.style.fontSize = '13px';
        taskCounter.style.color = '#777';
        taskCounter.textContent = `${completedTaskCount} of ${totalTasks} tasks completed`;
        
        // Add days remaining
        const startDate = localStorage.getItem('networkingChallengeDate') 
            ? new Date(localStorage.getItem('networkingChallengeDate')) 
            : new Date();
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        
        const today = new Date();
        const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
        
        const daysRemainingText = document.createElement('div');
        daysRemainingText.style.marginTop = '5px';
        daysRemainingText.style.fontSize = '13px';
        daysRemainingText.style.color = '#777';
        daysRemainingText.textContent = `${daysRemaining} days remaining`;
        
        // Add all elements to progress section
        progressSection.appendChild(progressText);
        progressSection.appendChild(progressBarContainer);
        progressSection.appendChild(taskCounter);
        progressSection.appendChild(daysRemainingText);
        
        // Create the tasks section
        const tasksSection = document.createElement('div');
        tasksSection.style.padding = '0 15px 15px';
        
        // Add view tasks button
        const viewTasksButton = document.createElement('button');
        viewTasksButton.textContent = 'View Challenge Tasks';
        viewTasksButton.style.width = '100%';
        viewTasksButton.style.padding = '10px';
        viewTasksButton.style.backgroundColor = '#f8f8f8';
        viewTasksButton.style.border = '1px solid #eee';
        viewTasksButton.style.borderRadius = '5px';
        viewTasksButton.style.fontSize = '14px';
        viewTasksButton.style.color = '#555';
        viewTasksButton.style.cursor = 'pointer';
        viewTasksButton.style.transition = 'all 0.2s';
        
        viewTasksButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f2f2f2';
        });
        
        viewTasksButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#f8f8f8';
        });
        
        viewTasksButton.addEventListener('click', function() {
            // Show the challenge modal again
            showDirectChallengeModal();
        });
        
        tasksSection.appendChild(viewTasksButton);
        
        // Assemble the tracker
        trackerContainer.appendChild(header);
        trackerContainer.appendChild(progressSection);
        trackerContainer.appendChild(tasksSection);
        
        // Add the tracker to the document
        document.body.appendChild(trackerContainer);
        
        // Add a pulse animation to draw attention
        setTimeout(() => {
            trackerContainer.style.animation = 'pulse 1s infinite';
            setTimeout(() => {
                trackerContainer.style.animation = 'none';
            }, 3000);
        }, 1000);
    }
});
