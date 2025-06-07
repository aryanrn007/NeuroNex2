/**
 * Voice Recognition for Interview Chatbot
 * Implements speech-to-text functionality for the chatbot interface
 */

// Initialize variables for speech recognition
let recognition;
let isRecognizing = false;
let voiceMode = false;
let recognitionTimeout;

// Add styles for voice recognition
const voiceStyles = document.createElement('style');
voiceStyles.textContent = `
    body.voice-active .chatbot-container {
        border: 2px solid #ff4081;
    }
    
    .voice-message {
        font-size: 0.8rem;
        color: #888;
        text-align: center;
        margin-top: 5px;
        padding: 5px;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        position: absolute;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1001;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        pointer-events: none;
        transition: opacity 0.3s ease;
        opacity: 0;
    }
    
    .voice-message.visible {
        opacity: 1;
    }
`;
document.head.appendChild(voiceStyles);

// Initialize speech recognition when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initVoiceRecognition();
        setupVoiceButtons();
    }, 1000); // Delay to ensure DOM is fully loaded
});

/**
 * Initialize the speech recognition functionality
 */
function initVoiceRecognition() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
            // Create speech recognition instance
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            
            // Configure recognition
            recognition.continuous = false; // Changed to false for better reliability
            recognition.interimResults = true;
            recognition.maxAlternatives = 1; // Get best match only
            recognition.lang = 'en-US';
            
            // Set up event handlers
            setupRecognitionEvents();
            
            console.log('Speech recognition initialized');
            
            // Add voice button to chatbot interface
            setTimeout(() => {
                addVoiceButtonToChatbot();
            }, 1500);
            
            // Add voice button styles
            addVoiceButtonStyles();
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            showVoiceMessage('Error initializing speech recognition. Please try a different browser.');
        }
    } else {
        console.warn('Speech recognition not supported in this browser');
        
        // Disable voice button if speech recognition is not supported
        const voiceBtn = document.querySelector('.input-btn[data-input="voice"]');
        if (voiceBtn) {
            voiceBtn.classList.add('disabled');
            voiceBtn.setAttribute('title', 'Speech recognition not supported in this browser');
        }
    }
}

/**
 * Test speech recognition to ensure it's working
 */
function testRecognition() {
    try {
        // Start recognition briefly to test if it works
        recognition.start();
        
        // Stop after a short delay
        setTimeout(() => {
            if (recognition) {
                recognition.stop();
                console.log('Speech recognition test completed');
            }
        }, 100);
    } catch (error) {
        console.error('Speech recognition test failed:', error);
    }
}

/**
 * Set up event handlers for speech recognition
 */
function setupRecognitionEvents() {
    // Handle results
    recognition.onresult = (event) => {
        const userInput = document.getElementById('user-input');
        if (!userInput) return;
        
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Process results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            // Get the most confident result
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                console.log('Final transcript:', transcript);
            } else {
                interimTranscript += transcript;
                console.log('Interim transcript:', transcript);
            }
        }
        
        // Update input field with transcribed text
        if (finalTranscript) {
            userInput.value = finalTranscript;
            // Show success message
            showVoiceMessage('Recognized: "' + finalTranscript + '"');
        } else if (interimTranscript) {
            userInput.value = interimTranscript;
        }
    };
    
    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // Show error message to user
        if (event.error === 'no-speech') {
            showVoiceMessage('No speech detected. Please try again.');
        } else if (event.error === 'audio-capture') {
            showVoiceMessage('No microphone detected. Please check your microphone settings.');
        } else if (event.error === 'not-allowed') {
            showVoiceMessage('Microphone access denied. Please allow microphone access.');
        } else if (event.error === 'network') {
            showVoiceMessage('Network error. Please check your internet connection.');
        } else if (event.error === 'aborted') {
            showVoiceMessage('Speech recognition aborted.');
        } else {
            showVoiceMessage('Speech recognition error: ' + event.error + '. Please try again.');
        }
        
        stopRecognition();
        
        // Attempt to restart after a brief delay if still in voice mode
        if (voiceMode) {
            setTimeout(() => {
                if (voiceMode) startRecognition();
            }, 1000);
        }
    };
    
    // Handle end of recognition
    recognition.onend = () => {
        console.log('Speech recognition ended');
        
        if (isRecognizing && voiceMode) {
            // Restart recognition if it ended but we're still in voice mode
            console.log('Restarting speech recognition...');
            setTimeout(() => {
                try {
                    recognition.start();
                    console.log('Speech recognition restarted');
                } catch (error) {
                    console.error('Error restarting speech recognition:', error);
                    isRecognizing = false;
                    updateVoiceButtonState();
                }
            }, 300);
        } else {
            isRecognizing = false;
            updateVoiceButtonState();
        }
    };
    
    // Handle start of recognition
    recognition.onstart = () => {
        console.log('Speech recognition started');
        isRecognizing = true;
        updateVoiceButtonState();
        showVoiceMessage('Listening... Speak now');
    };
}

/**
 * Set up voice button functionality
 */
function setupVoiceButtons() {
    // Get input mode buttons
    const textBtn = document.querySelector('.input-btn[data-input="text"]');
    const voiceBtn = document.querySelector('.input-btn[data-input="voice"]');
    
    if (textBtn && voiceBtn) {
        // Text button click handler
        textBtn.addEventListener('click', () => {
            setInputMode('text');
        });
        
        // Voice button click handler
        voiceBtn.addEventListener('click', () => {
            setInputMode('voice');
        });
    }
    
    // Add voice button to chatbot interface
    addVoiceButtonToChatbot();
}

/**
 * Set the input mode (text or voice)
 * @param {string} mode - Input mode ('text' or 'voice')
 */
function setInputMode(mode) {
    // Get input mode buttons
    const textBtn = document.querySelector('.input-btn[data-input="text"]');
    const voiceBtn = document.querySelector('.input-btn[data-input="voice"]');
    
    if (textBtn && voiceBtn) {
        // Remove active class from all buttons
        textBtn.classList.remove('active');
        voiceBtn.classList.remove('active');
        
        // Add active class to selected button
        if (mode === 'text') {
            textBtn.classList.add('active');
            voiceMode = false;
            stopRecognition();
        } else if (mode === 'voice') {
            voiceBtn.classList.add('active');
            voiceMode = true;
            startRecognition();
        }
    }
}

/**
 * Start speech recognition
 */
function startRecognition() {
    if (recognition && !isRecognizing) {
        try {
            // Reset recognition instance to ensure a fresh start
            recognition.abort();
            
            // Small delay before starting to ensure previous instance is fully stopped
            setTimeout(() => {
                try {
                    recognition.start();
                    isRecognizing = true;
                    updateVoiceButtonState();
                    showVoiceMessage('Listening... Please speak clearly');
                    console.log('Speech recognition started');
                    
                    // Focus the input field to ensure mobile keyboard doesn't appear
                    const userInput = document.getElementById('user-input');
                    if (userInput) {
                        userInput.blur();
                    }
                    
                    // Add visual indicator to show microphone is active
                    document.body.classList.add('voice-active');
                } catch (error) {
                    console.error('Error starting speech recognition:', error);
                    showVoiceMessage('Error starting speech recognition. Please try again.');
                    isRecognizing = false;
                    updateVoiceButtonState();
                }
            }, 200);
        } catch (error) {
            console.error('Error aborting previous recognition:', error);
        }
    }
}

/**
 * Stop speech recognition
 */
function stopRecognition() {
    if (recognition) {
        try {
            recognition.stop();
            console.log('Speech recognition stopped');
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
            
            // If stopping fails, try to abort
            try {
                recognition.abort();
                console.log('Speech recognition aborted');
            } catch (abortError) {
                console.error('Error aborting speech recognition:', abortError);
            }
        } finally {
            isRecognizing = false;
            updateVoiceButtonState();
            document.body.classList.remove('voice-active');
        }
    }
}

/**
 * Toggle speech recognition
 */
function toggleRecognition() {
    if (isRecognizing) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

/**
 * Update the voice button state based on recognition status
 */
function updateVoiceButtonState() {
    const voiceButton = document.getElementById('voice-toggle-btn');
    if (voiceButton) {
        if (isRecognizing) {
            voiceButton.classList.add('recording');
            voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
            voiceButton.setAttribute('title', 'Stop listening');
        } else {
            voiceButton.classList.remove('recording');
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.setAttribute('title', 'Start listening');
        }
    }
}

/**
 * Add voice button to chatbot interface
 */
function addVoiceButtonToChatbot() {
    const chatbotInput = document.querySelector('.chatbot-input');
    if (chatbotInput) {
        // Check if button already exists
        if (!document.getElementById('voice-toggle-btn')) {
            // Create voice toggle button
            const voiceButton = document.createElement('button');
            voiceButton.id = 'voice-toggle-btn';
            voiceButton.className = 'voice-btn';
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.setAttribute('title', 'Start listening');
            
            // Add click handler
            voiceButton.addEventListener('click', (e) => {
                e.preventDefault();
                toggleRecognition();
            });
            
            // Add button to chatbot input area
            if (document.getElementById('send-message')) {
                chatbotInput.insertBefore(voiceButton, document.getElementById('send-message'));
            } else {
                chatbotInput.appendChild(voiceButton);
            }
            
            // Create voice message element
            const messageElement = document.createElement('div');
            messageElement.className = 'voice-message';
            messageElement.id = 'voice-message';
            chatbotInput.appendChild(messageElement);
            
            console.log('Voice button added to chatbot');
        }
    } else {
        console.warn('Chatbot input not found, retrying in 2 seconds');
        setTimeout(addVoiceButtonToChatbot, 2000);
    }
}

/**
 * Show voice message to the user
 * @param {string} message - Message to display
 */
function showVoiceMessage(message) {
    console.log('Voice message:', message);
    
    // Get or create message element
    let messageElement = document.getElementById('voice-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'voice-message';
        messageElement.id = 'voice-message';
        
        const chatbotInput = document.querySelector('.chatbot-input');
        if (chatbotInput) {
            chatbotInput.appendChild(messageElement);
        } else {
            document.body.appendChild(messageElement);
        }
    }
    
    // Update message
    messageElement.textContent = message;
    messageElement.classList.add('visible');
    
    // Hide message after delay
    clearTimeout(window.messageTimeout);
    window.messageTimeout = setTimeout(() => {
        if (messageElement) {
            messageElement.classList.remove('visible');
        }
    }, 3000);
}

/**
 * Show voice message to the user
 * @param {string} message - Message to display
 */
function showVoiceMessage(message) {
    // Get or create message element
    let messageElement = document.querySelector('.voice-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'voice-message';
        
        const chatbotInput = document.querySelector('.chatbot-input');
        if (chatbotInput) {
            chatbotInput.appendChild(messageElement);
        }
    }
    
    // Update message
    messageElement.textContent = message;
    messageElement.classList.add('visible');
    
    // Hide message after delay
    setTimeout(() => {
        messageElement.classList.remove('visible');
    }, 3000);
}

/**
 * Add voice button styles
 */
function addVoiceButtonStyles() {
    // Create style element if it doesn't exist
    if (!document.getElementById('voice-button-styles')) {
        const style = document.createElement('style');
        style.id = 'voice-button-styles';
        style.textContent = `
            .voice-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #f5f5f7;
                color: #673AB7;
                border: 1px solid rgba(103, 58, 183, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-right: 10px;
                outline: none;
            }
            
            .voice-btn:hover {
                background-color: #ebe5f9;
                transform: scale(1.05);
            }
            
            .voice-btn.recording {
                background-color: #ff4081;
                color: white;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.4);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(255, 64, 129, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(255, 64, 129, 0);
                }
            }
        `;
        
        // Add style to document
        document.head.appendChild(style);
        console.log('Voice button styles added');
    }
}

// Add event listeners for chatbot interaction
document.addEventListener('DOMContentLoaded', () => {
    // Wait for chatbot to be initialized
    setTimeout(() => {
        const sendButton = document.getElementById('send-message');
        const userInput = document.getElementById('user-input');
        
        if (sendButton && userInput) {
            // Add event listener to send button
            sendButton.addEventListener('click', () => {
                // If we're in voice mode and have recognized text, stop recognition after sending
                if (voiceMode && isRecognizing && userInput.value.trim() !== '') {
                    // Stop recognition temporarily to avoid capturing the chatbot's response
                    stopRecognition();
                    
                    // Restart recognition after a delay
                    setTimeout(() => {
                        if (voiceMode) {
                            startRecognition();
                        }
                    }, 1000);
                }
            });
            
            // Add event listener for Enter key
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    // If we're in voice mode and have recognized text, stop recognition after sending
                    if (voiceMode && isRecognizing && userInput.value.trim() !== '') {
                        // Stop recognition temporarily to avoid capturing the chatbot's response
                        stopRecognition();
                        
                        // Restart recognition after a delay
                        setTimeout(() => {
                            if (voiceMode) {
                                startRecognition();
                            }
                        }, 1000);
                    }
                }
            });
        }
    }, 1000);
});
