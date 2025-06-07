// Career Resources Panel Implementation
document.addEventListener('DOMContentLoaded', () => {
    // Find the container where we'll add the career resources panel
    const mainContainer = document.querySelector('.main-content') || document.querySelector('.container');
    
    if (!mainContainer) return;
    
    // Create the career resources panel
    const careerResourcesPanel = document.createElement('div');
    careerResourcesPanel.className = 'career-resources';
    
    // Add panel content
    careerResourcesPanel.innerHTML = `
        <h2>Career Resources</h2>
        <div class="resources-grid">
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="resource-title">Resume Builder</div>
                <div class="resource-description">Create an ATS-friendly resume with our smart builder</div>
                <button class="resource-button">Build Resume</button>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-laptop"></i>
                </div>
                <div class="resource-title">Interview Prep</div>
                <div class="resource-description">Practice with our AI-powered mock interviews</div>
                <button class="resource-button">Start Practice</button>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="resource-title">Salary Insights</div>
                <div class="resource-description">Explore salary trends for your target roles</div>
                <button class="resource-button">View Insights</button>
            </div>
            
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="resource-title">Networking Tips</div>
                <div class="resource-description">Learn how to build your professional network</div>
                <button class="resource-button">Read Guide</button>
            </div>
        </div>
    `;
    
    // Add event listeners to the resource buttons
    setTimeout(() => {
        const resourceButtons = careerResourcesPanel.querySelectorAll('.resource-button');
        
        resourceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const resourceTitle = button.parentElement.querySelector('.resource-title').textContent;
                
                // Handle specific resources
                if (resourceTitle === 'Resume Builder') {
                    // Open the Resume Builder page
                    window.location.href = 'resume-builder.html';
                    return;
                }
                
                // Show notification for other resources
                if (typeof window.showNotification === 'function') {
                    window.showNotification(`${resourceTitle} resource opened`, "success");
                } else {
                    alert(`${resourceTitle} resource will be available soon!`);
                }
            });
        });
        
        // Add hover effects for better UX
        const resourceCards = careerResourcesPanel.querySelectorAll('.resource-card');
        resourceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const button = card.querySelector('.resource-button');
                button.style.backgroundColor = getComputedStyle(card.querySelector('.resource-icon')).backgroundColor;
                button.style.color = 'white';
            });
            
            card.addEventListener('mouseleave', () => {
                const button = card.querySelector('.resource-button');
                button.style.backgroundColor = 'transparent';
                button.style.color = getComputedStyle(card.querySelector('.resource-icon')).backgroundColor;
            });
        });
    }, 100);
    
    // Insert the panel at the appropriate position in the page
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        // Insert after profile section if it exists
        profileSection.parentNode.insertBefore(careerResourcesPanel, profileSection.nextSibling);
    } else {
        // Otherwise insert at the beginning of the main container
        mainContainer.insertBefore(careerResourcesPanel, mainContainer.firstChild);
    }
    
    // Add the CSS file if it's not already added
    if (!document.querySelector('link[href*="career-resources.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'career-resources.css';
        document.head.appendChild(cssLink);
    }
});
