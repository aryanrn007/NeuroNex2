// Direct welcome message implementation
window.showWelcomeMessage = function() {
    console.log('Show welcome message function called');
    
    // Get chat window
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) {
        console.error('Chat window not found');
        return;
    }
    
    // Clear the chat window
    chatWindow.innerHTML = '';
    console.log('Chat window cleared');
    
    // Close the dropdown
    const menuDropdown = document.getElementById('chatbot-menu-dropdown');
    if (menuDropdown) {
        menuDropdown.style.display = 'none';
        console.log('Menu closed after new chat');
    }
    
    // Get user name from localStorage
    let studentName = 'there';
    try {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (studentDataString) {
            const studentProfile = JSON.parse(studentDataString);
            if (studentProfile && studentProfile.fullName) {
                studentName = studentProfile.fullName.split(' ')[0];
            }
        }
    } catch (e) { 
        console.error('Error getting student name:', e);
        studentName = 'there'; 
    }
    
    // Create welcome message HTML
    const welcomeHTML = `
        <div class="chat-message aura-message">
            <i class="fas fa-sparkles"></i>
            <div class="message-content">Hello ${studentName}! I'm Aura, your AI assistant. How can I help you today?</div>
        </div>
    `;
    
    // Add the welcome message
    chatWindow.innerHTML = welcomeHTML;
    console.log('Welcome message added');
    
    // Show notification if available
    if (typeof showNotification === 'function') {
        showNotification("New chat started", "success");
    } else {
        console.log('showNotification function not available');
    }
};
