/**
 * Chat History Manager
 * Manages the user's chat history with the interview chatbot
 */

class ChatHistoryManager {
    constructor() {
        this.chatHistory = [];
        this.initFromLocalStorage();
        this.initEventListeners();
    }

    initFromLocalStorage() {
        try {
            const savedHistory = localStorage.getItem('junoInterviewChatHistory');
            if (savedHistory) {
                this.chatHistory = JSON.parse(savedHistory);
                console.log('Loaded chat history:', this.chatHistory.length, 'sessions');
            } else {
                // Initialize with empty array instead of sample data
                this.chatHistory = [];
                console.log('No chat history found, initialized empty history');
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            this.chatHistory = [];
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('junoInterviewChatHistory', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    addChatSession(session) {
        this.chatHistory.unshift(session); // Add to beginning of array
        this.saveToLocalStorage();
        this.updateHistoryPanel();
    }

    deleteChatSession(sessionId) {
        this.chatHistory = this.chatHistory.filter(session => session.id !== sessionId);
        this.saveToLocalStorage();
        this.updateHistoryPanel();
        this.updateModalHistory();
    }

    getRecentSessions(limit = 3) {
        return this.chatHistory.slice(0, limit);
    }

    getAllSessions() {
        return this.chatHistory;
    }

    getSessionById(sessionId) {
        return this.chatHistory.find(session => session.id === sessionId);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    createHistoryPanel() {
        const panel = document.createElement('div');
        panel.className = 'chat-history-panel';
        panel.innerHTML = `
            <div class="chat-history-header">
                <h3><i class="fas fa-history"></i> Recent Sessions</h3>
            </div>
            <div class="chat-history-sessions" id="recent-chat-history">
                <!-- Chat history items will be inserted here -->
            </div>
            <a href="#" class="view-all-history" id="view-all-history">
                View All History <i class="fas fa-arrow-right"></i>
            </a>
        `;
        return panel;
    }

    createHistoryModal() {
        const modal = document.createElement('div');
        modal.id = 'chat-history-modal';
        modal.className = 'chat-history-modal';
        modal.innerHTML = `
            <div class="chat-history-modal-content">
                <div class="chat-history-modal-header">
                    <h2><i class="fas fa-history"></i> Chat History</h2>
                    <span class="chat-history-modal-close" id="chat-history-close-btn">&times;</span>
                </div>
                <div class="chat-history-modal-body">
                    <div class="chat-history-filter">
                        <select id="history-type-filter">
                            <option value="all">All Types</option>
                            <option value="technical">Technical</option>
                            <option value="behavioral">Behavioral</option>
                            <option value="company">Company-Specific</option>
                        </select>
                        <select id="history-date-filter">
                            <option value="all">All Time</option>
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="year">Last Year</option>
                        </select>
                    </div>
                    <div class="chat-history-search">
                        <input type="text" placeholder="Search in chat history..." id="history-search">
                        <button><i class="fas fa-search"></i></button>
                    </div>
                    <div class="full-history-list" id="full-chat-history">
                        <!-- Full chat history will be inserted here -->
                    </div>
                    
                    <!-- Conversation display section -->
                    <div class="chat-conversation" id="chat-conversation">
                        <div class="conversation-header">
                            <div class="conversation-title" id="conversation-title">Interview Session</div>
                            <button class="back-to-history" id="back-to-history">
                                <i class="fas fa-arrow-left"></i> Back to History
                            </button>
                        </div>
                        <div class="conversation-messages" id="conversation-messages">
                            <!-- Conversation messages will be inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    updateHistoryPanel() {
        console.log('Updating history panel with', this.chatHistory.length, 'sessions');
        
        // Get the container for the history panel - look for both classes
        let historyPanel = document.querySelector('.interview-history.chat-history-panel');
        
        if (!historyPanel) {
            console.error('Could not find history panel with class .interview-history.chat-history-panel');
            return;
        }
        
        // Get recent sessions
        const recentSessions = this.getRecentSessions(3);
        console.log('Recent sessions to display:', recentSessions.length);
        
        // Get the sessions container
        const sessionsContainer = historyPanel.querySelector('.chat-history-sessions');
        if (!sessionsContainer) {
            console.error('Could not find sessions container with class .chat-history-sessions');
            return;
        }
        
        // Clear existing sessions
        sessionsContainer.innerHTML = '';
        
        // Add recent sessions
        if (recentSessions.length === 0) {
            sessionsContainer.innerHTML = '<div class="no-sessions">No interview sessions yet. Start an interview to see your history here.</div>';
            console.log('No sessions to display');
        } else {
            console.log('Adding sessions to panel');
            recentSessions.forEach(session => {
                const sessionEl = document.createElement('div');
                sessionEl.className = 'chat-history-session';
                sessionEl.setAttribute('data-session-id', session.id);
                
                sessionEl.innerHTML = `
                    <div class="session-info">
                        <h4>${session.title}</h4>
                        <p>${this.formatDate(session.date)}</p>
                    </div>
                    <div class="session-score">${session.score}</div>
                `;
                
                // Add click event to open the session
                sessionEl.addEventListener('click', () => {
                    this.openChatSession(session.id);
                });
                
                sessionsContainer.appendChild(sessionEl);
                console.log('Added session:', session.title);
            });
        }
    }

    updateModalHistory(filter = {}) {
        const historyList = document.getElementById('full-chat-history');
        if (!historyList) return;

        let filteredSessions = this.getAllSessions();

        // Apply type filter
        if (filter.type && filter.type !== 'all') {
            filteredSessions = filteredSessions.filter(session => session.type === filter.type);
        }

        // Apply date filter
        if (filter.dateRange && filter.dateRange !== 'all') {
            const now = new Date();
            let cutoffDate = new Date();
            
            if (filter.dateRange === 'week') {
                cutoffDate.setDate(now.getDate() - 7);
            } else if (filter.dateRange === 'month') {
                cutoffDate.setMonth(now.getMonth() - 1);
            } else if (filter.dateRange === 'year') {
                cutoffDate.setFullYear(now.getFullYear() - 1);
            }
            
            filteredSessions = filteredSessions.filter(session => 
                new Date(session.timestamp) >= cutoffDate
            );
        }

        // Apply search filter
        if (filter.search && filter.search.trim() !== '') {
            const searchTerm = filter.search.toLowerCase().trim();
            filteredSessions = filteredSessions.filter(session => {
                // Search in title
                if (session.title.toLowerCase().includes(searchTerm)) return true;
                
                // Search in messages
                return session.messages.some(msg => 
                    msg.content.toLowerCase().includes(searchTerm)
                );
            });
        }

        if (filteredSessions.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-search"></i>
                    <p>No matching sessions found</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = filteredSessions.map(session => {
            // Get first message from assistant for preview
            const previewMessage = session.messages.find(msg => msg.role === 'assistant')?.content || '';
            const truncatedPreview = previewMessage.length > 100 
                ? previewMessage.substring(0, 100) + '...' 
                : previewMessage;
            
            return `
                <div class="chat-history-item" data-session-id="${session.id}">
                    <div class="chat-session-info">
                        <div class="chat-session-title">${session.title}</div>
                        <div class="chat-session-date">${this.formatDate(session.date)}</div>
                        <div class="chat-message-preview">${truncatedPreview}</div>
                    </div>
                    <div class="chat-session-score">${session.score}</div>
                </div>
            `;
        }).join('');

        // Add click event listeners to history items
        document.querySelectorAll('#full-chat-history .chat-history-item').forEach(item => {
            item.addEventListener('click', () => {
                const sessionId = item.getAttribute('data-session-id');
                this.openChatSession(sessionId);
            });
        });
    }

    openChatSession(sessionId) {
        const session = this.getSessionById(sessionId);
        if (!session) {
            console.error('Session not found:', sessionId);
            return;
        }

        console.log('Opening chat session:', session);
        
        // Check if we're in the modal view or the main panel view
        const isInModal = document.querySelector('.chat-history-modal.visible') !== null;
        console.log('Is in modal view:', isInModal);
        
        if (isInModal) {
            // MODAL VIEW HANDLING
            // Get the conversation container and history list in the modal
            const conversationContainer = document.getElementById('chat-conversation');
            const historyList = document.getElementById('full-chat-history');
            const conversationTitle = document.getElementById('conversation-title');
            const conversationMessages = document.getElementById('conversation-messages');
            
            if (!conversationContainer || !historyList || !conversationTitle || !conversationMessages) {
                console.error('Modal conversation elements not found');
                return;
            }
            
            // Hide the history list and show the conversation
            historyList.style.display = 'none';
            conversationContainer.classList.add('active');
            
            // Set the conversation title
            conversationTitle.textContent = `${session.title} - ${this.formatDate(session.date)}`;
            
            // Clear previous messages
            conversationMessages.innerHTML = '';
            
            // Add each message to the conversation
            this.renderConversationMessages(session, conversationMessages);
            
            // Scroll to the bottom of the conversation
            conversationMessages.scrollTop = conversationMessages.scrollHeight;
            
            // Add event listener for back button if not already added
            const backButton = document.getElementById('back-to-history');
            if (backButton) {
                // Remove existing event listeners by cloning and replacing
                const newBackButton = backButton.cloneNode(true);
                backButton.parentNode.replaceChild(newBackButton, backButton);
                
                newBackButton.addEventListener('click', () => {
                    // Hide conversation and show history list
                    conversationContainer.classList.remove('active');
                    historyList.style.display = 'flex';
                });
            }
        } else {
            // RECENT SESSIONS PANEL VIEW HANDLING
            // Get the elements in the recent sessions panel
            const sessionsContainer = document.getElementById('recent-chat-history');
            const conversationView = document.getElementById('recent-chat-conversation');
            const conversationTitle = document.getElementById('recent-conversation-title');
            const conversationMessages = document.getElementById('recent-conversation-messages');
            const backButton = document.getElementById('back-to-sessions');
            
            if (!sessionsContainer || !conversationView || !conversationTitle || !conversationMessages || !backButton) {
                console.error('Recent sessions conversation elements not found');
                return;
            }
            
            // Hide the sessions list and show the conversation
            sessionsContainer.style.display = 'none';
            conversationView.style.display = 'block';
            
            // Set the conversation title
            conversationTitle.textContent = `${session.title} - ${this.formatDate(session.date)}`;
            
            // Clear previous messages
            conversationMessages.innerHTML = '';
            
            // Add each message to the conversation
            this.renderConversationMessages(session, conversationMessages);
            
            // Scroll to the bottom of the conversation
            conversationMessages.scrollTop = conversationMessages.scrollHeight;
            
            // Add event listener for back button
            const newBackButton = backButton.cloneNode(true);
            backButton.parentNode.replaceChild(newBackButton, backButton);
            
            newBackButton.addEventListener('click', () => {
                // Hide conversation and show sessions list
                conversationView.style.display = 'none';
                sessionsContainer.style.display = 'flex';
                console.log('Back to sessions clicked');
            });
        }
    }
    
    // Helper method to render conversation messages
    renderConversationMessages(session, container) {
        if (!session.messages || session.messages.length === 0) {
            // If no messages, show a placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'no-messages';
            placeholder.textContent = 'No conversation messages available for this session.';
            container.appendChild(placeholder);
            return;
        }
        
        // Add each message to the conversation
        session.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `conversation-message message-${message.role}`;
            
            let roleName = '';
            switch (message.role) {
                case 'user':
                    roleName = 'You';
                    break;
                case 'assistant':
                    roleName = 'AI Interviewer';
                    break;
                case 'system':
                    roleName = 'System';
                    break;
                default:
                    roleName = message.role;
            }
            
            messageElement.innerHTML = `
                <div class="message-role">${roleName}</div>
                <div class="message-content">${message.content}</div>
            `;
            
            container.appendChild(messageElement);
        });
    }

    showHistoryModal() {
        const modal = document.getElementById('chat-history-modal');
        if (modal) {
            modal.style.display = 'block';
            // Force a reflow before adding the visible class for the transition to work
            modal.offsetHeight;
            modal.classList.add('visible');
            this.updateModalHistory();
            
            // Add event listener to close button every time the modal is shown
            const closeBtn = document.getElementById('chat-history-close-btn');
            if (closeBtn) {
                // Remove any existing event listeners by cloning and replacing
                const newCloseBtn = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                
                // Add new event listener
                newCloseBtn.addEventListener('click', () => {
                    this.hideHistoryModal();
                    console.log('Close button clicked (from modal show)'); 
                });
            }
            
            console.log('Showing history modal');
        } else {
            console.error('History modal not found');
        }
    }

    hideHistoryModal() {
        const modal = document.getElementById('chat-history-modal');
        if (modal) {
            modal.classList.remove('visible');
            // Wait for the transition to complete before hiding the modal
            setTimeout(() => {
                if (!modal.classList.contains('visible')) {
                    modal.style.display = 'none';
                }
            }, 300);
        }
    }

    initEventListeners() {
        // These will be initialized after the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Add event listener for "View All History" button
            const viewAllBtn = document.getElementById('view-all-history');
            if (viewAllBtn) {
                viewAllBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showHistoryModal();
                });
            }

            // Add event listener for modal close button
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('chat-history-modal-close')) {
                    this.hideHistoryModal();
                }
            });

            // Add event listeners for filters
            const typeFilter = document.getElementById('history-type-filter');
            const dateFilter = document.getElementById('history-date-filter');
            const searchInput = document.getElementById('history-search');
            const searchButton = searchInput?.nextElementSibling;

            if (typeFilter) {
                typeFilter.addEventListener('change', () => this.applyFilters());
            }

            if (dateFilter) {
                dateFilter.addEventListener('change', () => this.applyFilters());
            }

            if (searchInput && searchButton) {
                searchButton.addEventListener('click', () => this.applyFilters());
                searchInput.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        this.applyFilters();
                    }
                });
            }

            // Add event listener for "Start First Interview" button
            document.addEventListener('click', (e) => {
                if (e.target.id === 'start-first-interview') {
                    // Trigger the start interview button
                    const startInterviewBtn = document.getElementById('start-interview-btn');
                    if (startInterviewBtn) {
                        startInterviewBtn.click();
                    }
                }
            });
        });
    }

    applyFilters() {
        const typeFilter = document.getElementById('history-type-filter');
        const dateFilter = document.getElementById('history-date-filter');
        const searchInput = document.getElementById('history-search');

        const filter = {
            type: typeFilter?.value || 'all',
            dateRange: dateFilter?.value || 'all',
            search: searchInput?.value || ''
        };

        this.updateModalHistory(filter);
    }

    // This method is called when a new interview session is completed
    saveChatSession(sessionData) {
        const sessionId = 'session-' + Date.now();
        const newSession = {
            id: sessionId,
            title: sessionData.title || 'Untitled Interview',
            date: sessionData.date || new Date().toISOString().split('T')[0],
            timestamp: sessionData.timestamp || Date.now(),
            score: sessionData.score || 0,
            type: sessionData.type || 'technical',
            difficulty: sessionData.difficulty || 'medium',
            topic: sessionData.topic || null,
            company: sessionData.company || null,
            messages: sessionData.messages || []
        };
        
        // Add to the beginning of the array (newest first)
        this.chatHistory.unshift(newSession);
        this.saveToLocalStorage();
        this.updateHistoryPanel();
        
        // Display a notification that the session was saved
        this.showSessionSavedNotification(newSession);
        
        return sessionId;
    }
    
    // Show a temporary notification when a session is saved
    showSessionSavedNotification(session) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'session-saved-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <div class="notification-text">
                    <h4>Session Saved</h4>
                    <p>${session.title}</p>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Initialize the Chat History Manager
document.addEventListener('DOMContentLoaded', () => {
    window.chatHistoryManager = new ChatHistoryManager();
    
    // Create and append the history modal
    const modal = window.chatHistoryManager.createHistoryModal();
    document.body.appendChild(modal);
    
    // Add a direct click handler to the modal itself to handle clicks on any elements inside it
    modal.addEventListener('click', (e) => {
        // Check if the clicked element is the close button or has the close button class
        if (e.target.id === 'chat-history-close-btn' || e.target.classList.contains('chat-history-modal-close')) {
            window.chatHistoryManager.hideHistoryModal();
            console.log('Close button clicked via modal event delegation');
        }
        
        // If clicking on the modal background (outside the content), also close it
        if (e.target === modal) {
            window.chatHistoryManager.hideHistoryModal();
            console.log('Modal background clicked');
        }
    });
    console.log('Added event delegation to modal for close button');
    
    // Update the existing history panel in the top right corner
    window.chatHistoryManager.updateHistoryPanel();
    
    // Directly add event listener to the View All History button
    setTimeout(() => {
        const viewAllBtn = document.getElementById('view-all-history');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.chatHistoryManager.showHistoryModal();
            });
            console.log('Added event listener to View All History button');
        } else {
            console.warn('View All History button not found');
        }
    }, 500); // Short delay to ensure the button is in the DOM
    
    console.log('Chat History Manager initialized');
});

// Example of how to save a new chat session after an interview
// This would typically be called from your interview chat logic
function saveInterviewSession(interviewData) {
    if (window.chatHistoryManager) {
        // Calculate a more realistic score based on the conversation if available
        let score = interviewData.score;
        if (!score && interviewData.messages && interviewData.messages.length > 0) {
            // In a real implementation, this would analyze the conversation quality
            // For now, we'll use a weighted calculation based on message count and length
            const messageCount = interviewData.messages.length;
            const userMessages = interviewData.messages.filter(m => m.role === 'user');
            const avgResponseLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / (userMessages.length || 1);
            
            // Simple algorithm: base score (70-85) + bonus for engagement (0-15)
            const baseScore = 70 + Math.floor(Math.random() * 15);
            const engagementBonus = Math.min(15, Math.floor((messageCount / 10) * 5 + (avgResponseLength / 100) * 10));
            score = baseScore + engagementBonus;
        } else if (!score) {
            // Fallback if no messages or score provided
            score = Math.floor(Math.random() * 20) + 75; // 75-95 range
        }
        
        const sessionId = window.chatHistoryManager.saveChatSession({
            title: interviewData.title || 'Untitled Interview',
            score: score,
            type: interviewData.type || 'technical',
            company: interviewData.company,
            messages: interviewData.messages || []
        });
        
        console.log('Saved interview session:', sessionId);
        return sessionId;
    }
    return null;
}

// Connect to the existing interview system
// This would be integrated with your existing interview chat logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up start interview button handler');
    const startInterviewBtn = document.getElementById('start-interview-btn');
    
    if (startInterviewBtn) {
        console.log('Found start interview button');
        // Remove any existing event listeners by cloning the button
        const newBtn = startInterviewBtn.cloneNode(true);
        startInterviewBtn.parentNode.replaceChild(newBtn, startInterviewBtn);
        
        // Add our event handler
        newBtn.addEventListener('click', function(e) {
            console.log('Start Interview button clicked');
            
            // Get the current date in YYYY-MM-DD format
            const today = new Date();
            const formattedDate = today.getFullYear() + '-' + 
                                 String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                                 String(today.getDate()).padStart(2, '0');
            
            // Get the selected interview mode
            const selectedMode = document.querySelector('.mode-option.active')?.getAttribute('data-mode') || 'technical';
            console.log('Selected mode:', selectedMode);
            
            // Get the selected difficulty
            const selectedDifficulty = document.querySelector('.difficulty-btn.active')?.getAttribute('data-difficulty') || 'medium';
            console.log('Selected difficulty:', selectedDifficulty);
            
            // Get the selected topic if applicable
            const selectedTopic = document.getElementById('topic-select')?.value || '';
            
            // Get the selected company if company mode
            let company = null;
            if (selectedMode === 'company') {
                company = document.getElementById('company-select')?.value || 'Google';
            }
            
            // Create a title based on the mode and other selections
            let title = 'Technical Interview';
            if (selectedMode === 'behavioral') {
                title = 'HR Interview - Behavioral';
            } else if (selectedMode === 'company') {
                title = `${company} - Technical`;
            } else if (selectedTopic) {
                title = `Technical Interview - ${selectedTopic}`;
            }
            
            console.log('Creating session with title:', title);
            
            // Generate a random score for demo purposes (75-95)
            const randomScore = Math.floor(Math.random() * 21) + 75;
            
            // Create initial messages for the session
            const messages = [
                { role: 'system', content: `${title} started with ${selectedDifficulty} difficulty` },
                { role: 'assistant', content: `Hello! I'm your interview assistant for this ${selectedDifficulty} difficulty ${selectedMode} interview${selectedTopic ? ' on ' + selectedTopic : ''}. Let's begin.` },
                { role: 'user', content: 'I\'m ready to start.' }
            ];
            
            // Save the session with current date
            const sessionId = saveInterviewSession({
                title: title,
                date: formattedDate,
                timestamp: today.getTime(),
                score: randomScore, // Add a predefined score for immediate display
                type: selectedMode,
                difficulty: selectedDifficulty,
                topic: selectedTopic,
                company: company,
                messages: messages
            });
            
            console.log('Session saved with ID:', sessionId);
            
            // Force update the history panel
            setTimeout(() => {
                if (window.chatHistoryManager) {
                    console.log('Forcing history panel update');
                    window.chatHistoryManager.updateHistoryPanel();
                }
            }, 500);
        });
        
        console.log('Start interview button handler set up successfully');
    } else {
        console.error('Could not find start interview button');
    }
});
