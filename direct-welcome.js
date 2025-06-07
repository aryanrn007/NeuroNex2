// Super simple direct welcome message implementation
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const newChatButton = document.querySelector('.chatbot-menu-item');
    const chatWindow = document.getElementById('chat-window');
    const menuDropdown = document.getElementById('chatbot-menu-dropdown');
    
    // Add click handler to New Chat button
    if (newChatButton) {
        newChatButton.onclick = function(e) {
            // Prevent default action
            e.preventDefault();
            
            console.log('New Chat button clicked');
            
            // Clear chat window except for welcome message
            if (chatWindow) {
                // Get the welcome message element
                const welcomeMessage = document.getElementById('welcome-message');
                
                // Clear everything else
                chatWindow.innerHTML = '';
                
                // Add welcome message back
                if (welcomeMessage) {
                    chatWindow.appendChild(welcomeMessage);
                } else {
                    // Create new welcome message if it doesn't exist
                    const newWelcomeMessage = document.createElement('div');
                    newWelcomeMessage.id = 'welcome-message';
                    newWelcomeMessage.className = 'chat-message aura-message';
                    
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-sparkles';
                    newWelcomeMessage.appendChild(icon);
                    
                    const content = document.createElement('div');
                    content.className = 'message-content';
                    content.textContent = "Hello! I'm Aura, your AI assistant. How can I help you today?";
                    newWelcomeMessage.appendChild(content);
                    
                    chatWindow.appendChild(newWelcomeMessage);
                }
                
                console.log('Welcome message displayed');
            }
            
            // Close dropdown
            if (menuDropdown) {
                menuDropdown.style.display = 'none';
            }
            
            // Show notification if available
            if (typeof window.showNotification === 'function') {
                window.showNotification("New chat started", "success");
            }
            
            return false;
        };
    }
});
