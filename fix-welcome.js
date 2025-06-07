// This script ensures the welcome message appears on New Chat
document.addEventListener('DOMContentLoaded', () => {
    // Override the startNewChat function to show welcome message
    const originalStartNewChat = window.startNewChat;
    if (typeof originalStartNewChat === 'function') {
        window.startNewChat = function() {
            // Get chat window
            const chatWindow = document.getElementById('chat-window');
            if (chatWindow) {
                // Clear chat window directly
                chatWindow.innerHTML = '';
                console.log('Chat cleared by New Chat button');
                
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
                } catch (e) { studentName = 'there'; }
                
                // Add the welcome message
                setTimeout(() => {
                    // Create message container
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'chat-message aura-message';
                    
                    // Add icon
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-sparkles';
                    messageDiv.appendChild(icon);
                    
                    // Add message content
                    const messageContent = document.createElement('div');
                    messageContent.className = 'message-content';
                    messageContent.textContent = `Hello ${studentName}! I'm Aura, your AI assistant. How can I help you today?`;
                    messageDiv.appendChild(messageContent);
                    
                    // Add to chat window
                    chatWindow.appendChild(messageDiv);
                }, 100);
            }
            
            // Close the dropdown
            const menuDropdown = document.getElementById('chatbot-menu-dropdown');
            if (menuDropdown) {
                menuDropdown.style.display = 'none';
                console.log('Menu closed after new chat');
            }
            
            // Show notification
            if (typeof showNotification === 'function') {
                showNotification("New chat started", "success");
            }
            
            return false; // Prevent default
        };
    }
});
