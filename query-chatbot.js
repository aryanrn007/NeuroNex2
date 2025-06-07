/**
 * Query Chatbot - AI Assistant for Interview Preparation
 * Uses OpenRouter API to provide fully dynamic interactive interview practice
 */

// OpenRouter API configuration
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Fallback to local mock responses if API fails
let useMockResponses = false;

// Store conversation history
let conversationHistory = [];

// Store current interview context
let interviewContext = {
    mode: 'technical',
    difficulty: 'beginner',
    questionCount: 0,
    maxQuestions: 5,
    inProgress: false
};

// Models to use
const MODELS = {
    default: 'anthropic/claude-3-haiku',  // Using a smaller model to avoid token limits
    fallback: 'openai/gpt-3.5-turbo'      // Fallback to a different provider
};

// Initialize chatbot when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeChatbot();
    setupEventListeners();
});

/**
 * Initialize the chatbot interface
 */
function initializeChatbot() {
    // Create chatbot container if it doesn't exist
    if (!document.getElementById('query-chatbot')) {
        const chatbotHTML = `
            <div id="query-chatbot" class="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <h3>Query - Interview Assistant</h3>
                    </div>
                    <div class="chatbot-controls">
                        <button id="minimize-chatbot" class="chatbot-control-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button id="close-chatbot" class="chatbot-control-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="message bot-message">
                        <div class="message-content">
                            <p>Hi, I'm Query! I'll help you practice for your interviews. Select an interview mode and difficulty level, then click "Start Interview" to begin.</p>
                        </div>
                    </div>
                </div>
                <div class="chatbot-input">
                    <textarea id="user-input" placeholder="Type your answer here..." rows="2"></textarea>
                    <button id="send-message" class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <button id="open-chatbot" class="open-chatbot-btn">
                <i class="fas fa-comments"></i>
            </button>
        `;
        
        const chatbotContainer = document.createElement('div');
        chatbotContainer.innerHTML = chatbotHTML;
        document.body.appendChild(chatbotContainer);
    }
}

/**
 * Set up event listeners for chatbot interactions
 */
function setupEventListeners() {
    // Wait for elements to be added to DOM
    setTimeout(() => {
        // Chatbot toggle buttons
        const openChatbotBtn = document.getElementById('open-chatbot');
        const minimizeChatbotBtn = document.getElementById('minimize-chatbot');
        const closeChatbotBtn = document.getElementById('close-chatbot');
        const chatbotContainer = document.getElementById('query-chatbot');
        const sendMessageBtn = document.getElementById('send-message');
        const userInput = document.getElementById('user-input');
        const startInterviewBtn = document.getElementById('start-interview-btn');
        
        if (openChatbotBtn) {
            openChatbotBtn.addEventListener('click', () => {
                chatbotContainer.classList.add('open');
                openChatbotBtn.style.display = 'none';
            });
        }
        
        if (minimizeChatbotBtn) {
            minimizeChatbotBtn.addEventListener('click', () => {
                chatbotContainer.classList.remove('open');
                openChatbotBtn.style.display = 'flex';
            });
        }
        
        if (closeChatbotBtn) {
            closeChatbotBtn.addEventListener('click', () => {
                // Hide the chatbot instead of removing it
                if (chatbotContainer) {
                    chatbotContainer.classList.remove('open');
                    chatbotContainer.classList.remove('interview-mode');
                }
                
                // Show the open button
                if (openChatbotBtn) {
                    openChatbotBtn.style.display = 'flex';
                }
                
                // Reset conversation history and context
                conversationHistory = [];
                interviewContext = {
                    mode: 'technical',
                    difficulty: 'beginner',
                    questionCount: 0,
                    maxQuestions: 5,
                    inProgress: false
                };
                
                // Stop any active speech recognition
                if (typeof stopRecognition === 'function') {
                    stopRecognition();
                }
                
                console.log('Chatbot closed (hidden)');
            });
        }
        
        if (sendMessageBtn && userInput) {
            // Send message on button click
            sendMessageBtn.addEventListener('click', () => {
                sendUserMessage();
            });
            
            // Send message on Enter key (but allow Shift+Enter for new line)
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendUserMessage();
                }
            });
        }
        
        // Start interview button
        if (startInterviewBtn) {
            startInterviewBtn.addEventListener('click', () => {
                startInterview();
            });
        }
    }, 500);
}

/**
 * Start the interview process
 */
function startInterview() {
    // Get selected mode and difficulty
    const selectedMode = document.querySelector('.mode-option.active')?.getAttribute('data-mode') || 'technical';
    const selectedDifficulty = document.querySelector('.difficulty-btn.active')?.getAttribute('data-difficulty') || 'beginner';
    
    console.log(`Starting interview with mode: ${selectedMode}, difficulty: ${selectedDifficulty}`);
    
    // Check if chatbot exists, if not, reinitialize it
    let chatbotContainer = document.getElementById('query-chatbot');
    let openChatbotBtn = document.getElementById('open-chatbot');
    
    if (!chatbotContainer || !openChatbotBtn) {
        // Reinitialize the chatbot if it doesn't exist
        console.log('Chatbot not found, reinitializing...');
        initializeChatbot();
        
        // Set up event listeners for the new chatbot
        setTimeout(() => {
            setupEventListeners();
            
            // Get the newly created elements
            chatbotContainer = document.getElementById('query-chatbot');
            openChatbotBtn = document.getElementById('open-chatbot');
            
            // Continue with opening the chatbot
            if (chatbotContainer && openChatbotBtn) {
                chatbotContainer.classList.add('open');
                chatbotContainer.classList.add('interview-mode'); // Add class for wider interface
                openChatbotBtn.style.display = 'none';
            }
        }, 100);
    } else {
        // Open chatbot with wider interface for interview mode
        chatbotContainer.classList.add('open');
        chatbotContainer.classList.add('interview-mode'); // Add class for wider interface
        openChatbotBtn.style.display = 'none';
    }
    
    // Clear previous messages
    const messagesContainer = document.getElementById('chatbot-messages');
    if (messagesContainer) {
        // Keep only the first welcome message
        const firstMessage = messagesContainer.querySelector('.message');
        if (firstMessage) {
            messagesContainer.innerHTML = '';
            messagesContainer.appendChild(firstMessage);
        }
    } else {
        // If messagesContainer doesn't exist yet (chatbot is being reinitialized)
        setTimeout(() => {
            const newMessagesContainer = document.getElementById('chatbot-messages');
            if (newMessagesContainer) {
                // Keep only the first welcome message
                const firstMessage = newMessagesContainer.querySelector('.message');
                if (firstMessage) {
                    newMessagesContainer.innerHTML = '';
                    newMessagesContainer.appendChild(firstMessage);
                }
            }
        }, 200);
    }
    
    // Reset conversation history
    conversationHistory = [];
    
    // Update interview context
    interviewContext = {
        mode: selectedMode,
        difficulty: selectedDifficulty,
        questionCount: 0,
        maxQuestions: 5,
        inProgress: true
    };
    
    // Welcome message based on selected mode and difficulty
    let welcomeMessage = '';
    
    switch(selectedDifficulty) {
        case 'intermediate':
            welcomeMessage = `I'll be your ${selectedMode} interview coach today. I'll ask intermediate-level questions that require more in-depth knowledge and some practical experience. Ready to begin?`;
            break;
        case 'advanced':
            welcomeMessage = `I'll be your ${selectedMode} interview coach today. I'll challenge you with advanced questions that test deep understanding and expertise in ${selectedMode} topics. Let's see how you handle complex scenarios.`;
            break;
        default: // beginner
            welcomeMessage = `I'll be your ${selectedMode} interview coach today. We'll start with beginner-friendly questions to build your confidence. Ready for your first question?`;
    }
    
    addBotMessage(welcomeMessage);
    
    // Add to conversation history
    conversationHistory.push({
        role: 'assistant',
        content: welcomeMessage
    });
    
    // Start with the first question
    setTimeout(() => {
        askQuestion(selectedMode, selectedDifficulty);
    }, 1000);
}

/**
 * Ask an interview question based on mode and difficulty using the OpenRouter API
 * @param {string} mode - Interview mode (technical, hr, company)
 * @param {string} difficulty - Difficulty level (beginner, intermediate, advanced)
 */
function askQuestion(mode, difficulty) {
    // Increment question count
    interviewContext.questionCount++;
    
    // Show typing indicator
    showTypingIndicator();
    
    console.log(`Generating ${difficulty} level ${mode} interview question`);
    
    // Prepare prompt for question generation based on difficulty
    let prompt = '';
    
    switch(difficulty) {
        case 'intermediate':
            prompt = `Generate a realistic intermediate-level ${mode} interview question that requires deeper knowledge and some practical experience.`;
            break;
        case 'advanced':
            prompt = `Generate a challenging advanced-level ${mode} interview question that tests deep understanding and expertise. The question should be complex and require significant experience.`;
            break;
        default: // beginner
            prompt = `Generate a beginner-friendly ${mode} interview question that's suitable for candidates with basic knowledge.`;
    }
    
    // Add domain-specific context
    if (mode === 'technical') {
        const domain = document.getElementById('tech-domain')?.value || 'dsa';
        prompt += ` The technical domain is ${domain}.`;
        
        // Add domain-specific difficulty guidance
        if (difficulty === 'intermediate') {
            prompt += ` For ${domain}, include concepts that require understanding of underlying principles.`;
        } else if (difficulty === 'advanced') {
            prompt += ` For ${domain}, focus on optimization, edge cases, or system design aspects.`;
        }
    } else if (mode === 'company') {
        const company = document.getElementById('company-select')?.value || 'google';
        prompt += ` The company is ${company}.`;
        
        // Add company-specific difficulty guidance
        if (difficulty === 'intermediate' || difficulty === 'advanced') {
            prompt += ` The question should reflect ${company}'s known interview style and values at this difficulty level.`;
        }
    }
    
    prompt += `
        Make the question appropriately challenging for a ${difficulty} level candidate.
        Provide ONLY the question itself, without any additional text, explanations, or commentary.
    `;
    
    // Update interview context
    interviewContext.mode = mode;
    interviewContext.difficulty = difficulty;
    interviewContext.inProgress = true;
    
    // Prepare system message with interview context
    const systemMessage = `
        You are Query, an AI interview assistant helping with interview preparation.
        
        Current interview mode: ${mode}
        Current difficulty level: ${difficulty}
        Question count: ${interviewContext.questionCount} of ${interviewContext.maxQuestions}
        
        Your task is to generate a realistic interview question based on the provided prompt.
        The question difficulty should match ${difficulty} level.
        
        Provide ONLY the question itself, without any additional text, explanations, or commentary.
    `;
    
    // If using mock responses due to API issues, generate a mock question
    if (useMockResponses) {
        generateMockQuestion(mode, difficulty);
        return;
    }
    
    // Call OpenRouter API to generate a question
    fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Query Interview Assistant'
        },
        body: JSON.stringify({
            model: MODELS.default,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: prompt }
            ],
            max_tokens: 300,
            temperature: 0.7
        })
    })
    .then(response => response.json())
    .then(data => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Extract the generated question
        const generatedQuestion = data.choices[0].message.content.trim();
        
        // Store current question for later reference
        window.currentQuestion = {
            text: generatedQuestion,
            mode: mode,
            difficulty: difficulty
        };
        
        // Add question to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: generatedQuestion
        });
        
        // Add question to chat
        addBotMessage(generatedQuestion);
    })
    .catch(error => {
        console.error('Error generating question:', error);
        hideTypingIndicator();
        
        // Switch to mock responses for future requests
        useMockResponses = true;
        
        // Use mock question generator
        generateMockQuestion(mode, difficulty);
    });
}

/**
 * Send user message to chatbot
 */
function sendUserMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        userInput.value = '';
        
        // Check for special commands
        const lowerCaseMessage = message.toLowerCase();
        
        if (lowerCaseMessage === 'yes' && interviewContext.inProgress) {
            // User wants another question with the same settings
            addBotMessage("Great! Here's another question.");
            
            // Add to conversation history
            conversationHistory.push({
                role: 'user',
                content: message
            });
            
            conversationHistory.push({
                role: 'assistant',
                content: "Great! Here's another question."
            });
            
            setTimeout(() => {
                askQuestion(interviewContext.mode, interviewContext.difficulty);
            }, 1000);
            
        } else if (lowerCaseMessage === 'change' || lowerCaseMessage === 'new') {
            // User wants to change interview settings
            addBotMessage("Let's try different settings. Please select a new interview mode and difficulty level, then click 'Start Interview' again.");
            
            // Add to conversation history
            conversationHistory.push({
                role: 'user',
                content: message
            });
            
            conversationHistory.push({
                role: 'assistant',
                content: "Let's try different settings. Please select a new interview mode and difficulty level, then click 'Start Interview' again."
            });
            
            // Reset interview context
            interviewContext.inProgress = false;
            
        } else if (lowerCaseMessage === 'help') {
            // User needs help with commands
            const helpMessage = "Here are the commands you can use:\n" +
                "- 'yes': Get another question with the same settings\n" +
                "- 'change' or 'new': Start a new interview with different settings\n" +
                "- 'help': Show this help message";
            
            addBotMessage(helpMessage);
            
            // Add to conversation history
            conversationHistory.push({
                role: 'user',
                content: message
            });
            
            conversationHistory.push({
                role: 'assistant',
                content: helpMessage
            });
            
        } else {
            // Process as a regular answer
            processUserAnswer(message);
        }
    }
}

/**
 * Process user's answer and provide feedback using conversation history
 */
function processUserAnswer(userAnswer) {
    // Show typing indicator
    showTypingIndicator();
    
    // Get current question context
    const currentQuestion = window.currentQuestion;
    
    if (!currentQuestion) {
        addBotMessage("I'm not sure what question you're answering. Let's start a new interview by selecting a mode and difficulty, then clicking 'Start Interview'.");
        hideTypingIndicator();
        return;
    }
    
    // Add user's answer to conversation history
    conversationHistory.push({
        role: 'user',
        content: userAnswer
    });
    
    // Prepare system message with interview context
    const systemMessage = `
        You are Query, an AI interview coach helping with interview preparation.
        
        Current interview mode: ${currentQuestion.mode}
        Current difficulty level: ${currentQuestion.difficulty}
        Question count: ${interviewContext.questionCount} of ${interviewContext.maxQuestions}
        
        Your task is to evaluate the user's answer to your interview question and provide constructive feedback.
        
        Include in your feedback:
        1. What was good about their answer
        2. What could be improved
        3. A model answer or explanation of key points they should have covered
        
        Keep your response conversational, supportive, and educational. If the user says they don't know or asks for help, provide a helpful explanation.
        
        After providing feedback, ask if they would like another question only if they haven't reached the maximum number of questions.
    `;
    
    // Create messages array with conversation history
    const messages = [
        { role: 'system', content: systemMessage },
        ...conversationHistory.slice(-6) // Include last 6 messages for context but limit token usage
    ];
    
    // If using mock responses due to API issues, generate a mock response
    if (useMockResponses) {
        generateMockFeedback(userAnswer, currentQuestion);
        return;
    }
    
    // Call OpenRouter API
    fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Query Interview Assistant'
        },
        body: JSON.stringify({
            model: MODELS.default,
            messages: messages,
            max_tokens: 800,
            temperature: 0.7
        })
    })
    .then(response => response.json())
    .then(data => {
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        const aiResponse = data.choices[0].message.content;
        addBotMessage(aiResponse);
        
        // Add response to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });
        
        // Check if we've reached the maximum number of questions
        if (interviewContext.questionCount >= interviewContext.maxQuestions) {
            setTimeout(() => {
                addBotMessage("You've completed this interview session! Would you like to start a new session with different settings? Type 'new' to select different options.");
                
                // Add to conversation history
                conversationHistory.push({
                    role: 'assistant',
                    content: "You've completed this interview session! Would you like to start a new session with different settings?"
                });
                
                // Reset interview context
                interviewContext.inProgress = false;
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        hideTypingIndicator();
        
        // Switch to mock responses for future requests
        useMockResponses = true;
        
        // Generate mock feedback
        generateMockFeedback(userAnswer, currentQuestion);
    });
}

/**
 * Add user message to chat
 */
function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (messagesContainer) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        scrollToBottom(messagesContainer);
    }
}

/**
 * Add bot message to chat
 */
function addBotMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (messagesContainer) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        scrollToBottom(messagesContainer);
    }
}

/**
 * Format message with markdown-like syntax
 */
function formatMessage(message) {
    // Replace newlines with <br>
    let formattedMessage = message.replace(/\n/g, '<br>');
    
    // Bold text between ** **
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text between * *
    formattedMessage = formattedMessage.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code blocks
    formattedMessage = formattedMessage.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    formattedMessage = formattedMessage.replace(/`(.*?)`/g, '<code>$1</code>');
    
    return formattedMessage;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (messagesContainer) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingIndicator);
        scrollToBottom(messagesContainer);
    }
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

/**
 * Generate a mock interview question when API fails
 */
function generateMockQuestion(mode, difficulty) {
    console.log(`Generating mock ${difficulty} level ${mode} question`);
    
    // Get domain or company if applicable
    let domain = '';
    let company = '';
    let hrTopic = '';
    
    if (mode === 'technical') {
        domain = document.getElementById('tech-domain')?.value || 'dsa';
    } else if (mode === 'company') {
        company = document.getElementById('company-select')?.value || 'google';
    } else if (mode === 'hr') {
        hrTopic = document.getElementById('hr-domain')?.value || 'leadership';
    }
    
    // Predefined questions by category and difficulty
    const mockQuestions = {
        company: {
            beginner: {
                google: [
                    "What interests you about working at Google?",
                    "How would you contribute to Google's mission to organize the world's information?",
                    "Tell me about a time when you had to solve a problem creatively.",
                    "How do you stay updated with the latest technology trends?",
                    "What Google product would you improve and how?"
                ],
                microsoft: [
                    "Why are you interested in working at Microsoft?",
                    "How do you align with Microsoft's mission to empower every person and organization on the planet?",
                    "Tell me about a time when you had to adapt to a significant change.",
                    "What Microsoft product do you use the most and why?",
                    "How would you explain cloud computing to someone non-technical?"
                ],
                amazon: [
                    "Which of Amazon's leadership principles resonates with you the most and why?",
                    "Tell me about a time when you had to make a decision without all the information you needed.",
                    "How would you handle a situation where you had to deliver results under tight deadlines?",
                    "What interests you about Amazon's business model?",
                    "How do you prioritize customer needs in your work?"
                ],
                meta: [
                    "Why are you interested in working at Meta?",
                    "How do you feel about Meta's mission to connect people?",
                    "Tell me about a time when you had to work with a diverse team.",
                    "What Meta product would you improve and how?",
                    "How do you stay innovative in your work?"
                ],
                tcs: [
                    "Why do you want to work at TCS?",
                    "Tell me about a time when you had to learn a new technology quickly.",
                    "How do you handle working with clients from different cultural backgrounds?",
                    "What do you know about TCS's business model and services?",
                    "How do you maintain quality in your work?"
                ],
                infosys: [
                    "Why are you interested in joining Infosys?",
                    "Tell me about a time when you had to work under pressure.",
                    "How do you approach continuous learning in your career?",
                    "What do you know about Infosys's digital transformation services?",
                    "How would you contribute to Infosys's innovation initiatives?"
                ],
                wipro: [
                    "Why do you want to work at Wipro?",
                    "Tell me about a time when you had to collaborate across teams.",
                    "How do you adapt to changing project requirements?",
                    "What do you know about Wipro's sustainability initiatives?",
                    "How do you handle constructive criticism?"
                ],
                default: [
                    "Why are you interested in this company?",
                    "What do you know about our products/services?",
                    "How would you contribute to our company culture?",
                    "Tell me about a time when you demonstrated leadership skills.",
                    "Where do you see yourself in five years if you join our company?"
                ]
            },
            intermediate: {
                google: [
                    "How would you improve Google's search algorithm to better handle ambiguous queries?",
                    "Describe a situation where you had to balance user experience with business requirements.",
                    "How would you approach scaling a service to handle Google-scale traffic?",
                    "Tell me about a time when you had to make a data-driven decision that wasn't popular.",
                    "How would you measure the success of a new Google feature?"
                ],
                microsoft: [
                    "How would you approach integrating AI capabilities into Microsoft's productivity suite?",
                    "Tell me about a time when you had to manage competing priorities in a project.",
                    "How would you improve Microsoft Teams to better support remote collaboration?",
                    "Describe a situation where you had to influence stakeholders without direct authority.",
                    "How would you approach security challenges in Microsoft's cloud services?"
                ],
                amazon: [
                    "Describe how you would apply Amazon's 'Working Backwards' principle to develop a new product.",
                    "Tell me about a time when you had to make a difficult decision that affected your team.",
                    "How would you improve Amazon's recommendation system?",
                    "Describe a situation where you had to dive deep into data to solve a problem.",
                    "How would you balance innovation with operational excellence?"
                ],
                meta: [
                    "How would you address privacy concerns in Meta's products while maintaining user engagement?",
                    "Tell me about a time when you had to pivot a project based on user feedback.",
                    "How would you improve content moderation at Meta's scale?",
                    "Describe a situation where you had to balance technical debt with new feature development.",
                    "How would you approach building cross-platform experiences across Meta's family of apps?"
                ],
                tcs: [
                    "How would you approach digital transformation for a traditional enterprise client?",
                    "Tell me about a time when you had to manage a challenging client relationship.",
                    "How would you improve knowledge transfer in distributed teams?",
                    "Describe a situation where you had to optimize a process for efficiency.",
                    "How would you approach implementing agile methodologies in a traditional organization?"
                ],
                infosys: [
                    "How would you leverage Infosys's AI platform to solve a specific industry challenge?",
                    "Tell me about a time when you had to lead a cross-functional team.",
                    "How would you approach cloud migration for a legacy system?",
                    "Describe a situation where you had to balance quality with time constraints.",
                    "How would you measure the success of a digital transformation project?"
                ],
                wipro: [
                    "How would you approach implementing IoT solutions for manufacturing clients?",
                    "Tell me about a time when you had to manage a project with limited resources.",
                    "How would you improve Wipro's delivery model for better client outcomes?",
                    "Describe a situation where you had to handle a technical crisis.",
                    "How would you approach building AI-driven solutions for enterprise clients?"
                ],
                default: [
                    "How would you approach solving a complex business problem in our industry?",
                    "Tell me about a time when you had to lead a project from conception to delivery.",
                    "How would you improve our current product/service offering?",
                    "Describe a situation where you had to make a strategic decision with limited information.",
                    "How would you approach building and managing high-performing teams?"
                ]
            },
            advanced: {
                google: [
                    "How would you design a system to detect and prevent abuse across Google's products at scale?",
                    "Describe how you would approach building Google's next billion-user product.",
                    "How would you balance innovation with reliability in Google's infrastructure?",
                    "Tell me about a time when you had to make a strategic decision that affected your organization's direction.",
                    "How would you approach solving technical challenges in emerging markets with limited connectivity?"
                ],
                microsoft: [
                    "How would you design Microsoft's strategy for competing in the AI space over the next decade?",
                    "Describe how you would approach integrating Microsoft's diverse product ecosystem for enterprise customers.",
                    "How would you balance security, privacy, and usability in Microsoft's cloud services?",
                    "Tell me about a time when you had to transform a struggling team or product.",
                    "How would you approach Microsoft's sustainability goals through technology?"
                ],
                amazon: [
                    "How would you design Amazon's next major business vertical?",
                    "Describe how you would approach optimizing Amazon's global logistics network.",
                    "How would you balance automation with human judgment in Amazon's operations?",
                    "Tell me about a time when you had to make a high-stakes decision with significant business impact.",
                    "How would you approach solving the last-mile delivery challenge in rural areas?"
                ],
                meta: [
                    "How would you design Meta's strategy for the metaverse over the next decade?",
                    "Describe how you would approach content governance at global scale while respecting cultural differences.",
                    "How would you balance monetization with user experience in Meta's products?",
                    "Tell me about a time when you had to lead through a significant organizational or industry change.",
                    "How would you approach building trust with users regarding data privacy and security?"
                ],
                tcs: [
                    "How would you design TCS's strategy for competing in the AI and automation services market?",
                    "Describe how you would approach building innovation capabilities in a large services organization.",
                    "How would you balance global delivery standards with local market needs?",
                    "Tell me about a time when you had to transform a traditional business process through technology.",
                    "How would you approach talent development and retention in a competitive market?"
                ],
                infosys: [
                    "How would you design Infosys's strategy for the next generation of digital services?",
                    "Describe how you would approach building strategic partnerships with technology providers.",
                    "How would you balance offshore and onshore delivery models for optimal client outcomes?",
                    "Tell me about a time when you had to navigate complex organizational politics to achieve results.",
                    "How would you approach building a culture of innovation in a large organization?"
                ],
                wipro: [
                    "How would you design Wipro's strategy for competing in the cloud services market?",
                    "Describe how you would approach digital transformation for healthcare clients with strict regulatory requirements.",
                    "How would you balance service quality with cost efficiency in global delivery?",
                    "Tell me about a time when you had to make difficult decisions during a business downturn.",
                    "How would you approach building industry-specific solutions that differentiate Wipro in the market?"
                ],
                default: [
                    "How would you design our company's strategic roadmap for the next five years?",
                    "Describe how you would approach transforming our organization to be more innovative and agile.",
                    "How would you balance short-term results with long-term sustainability?",
                    "Tell me about a time when you had to lead significant organizational change.",
                    "How would you approach building and scaling our company's capabilities in emerging technologies?"
                ]
            }
        },
        hr: {
            beginner: {
                leadership: [
                    "Tell me about a time when you had to lead a team. What was your approach?",
                    "How do you motivate team members who are struggling with their tasks?",
                    "What leadership qualities do you think are most important and why?",
                    "Describe your leadership style in three words and explain why you chose them.",
                    "How do you delegate tasks to team members?"
                ],
                teamwork: [
                    "Tell me about a time when you worked effectively in a team. What was your role?",
                    "How do you handle disagreements within a team?",
                    "What makes a team successful in your opinion?",
                    "Describe a situation where you had to adapt to a team member's working style.",
                    "How do you contribute to a positive team environment?"
                ],
                conflict: [
                    "Tell me about a time when you had a conflict with a colleague. How did you resolve it?",
                    "How do you handle criticism from peers or supervisors?",
                    "Describe a situation where you had to give difficult feedback to someone.",
                    "What approach do you take when mediating conflicts between team members?",
                    "How do you stay professional in tense situations?"
                ],
                communication: [
                    "How do you ensure your communication is clear and effective?",
                    "Tell me about a time when you had to explain a complex concept to someone.",
                    "How do you tailor your communication style for different audiences?",
                    "Describe a situation where miscommunication led to a problem and how you addressed it.",
                    "How do you handle communication in remote or virtual team settings?"
                ],
                culture: [
                    "What type of work environment helps you thrive?",
                    "How do you adapt to a company's culture?",
                    "What values are most important to you in a workplace?",
                    "Tell me about a time when your values aligned well with an organization's culture.",
                    "How do you contribute to a positive work culture?"
                ],
                motivation: [
                    "What motivates you professionally?",
                    "Tell me about a time when you were particularly motivated at work. What factors contributed to that?",
                    "How do you stay motivated during routine or repetitive tasks?",
                    "What are your short-term and long-term career goals?",
                    "How do you maintain enthusiasm when facing setbacks?"
                ],
                stress: [
                    "How do you handle stress and pressure?",
                    "Tell me about a time when you worked under significant pressure. How did you manage it?",
                    "What techniques do you use to maintain work-life balance?",
                    "How do you prioritize when you have multiple deadlines?",
                    "Describe a stressful situation at work and how you handled it."
                ],
                adaptability: [
                    "Tell me about a time when you had to adapt to a significant change at work.",
                    "How do you approach learning new skills or technologies?",
                    "Describe a situation where you had to be flexible with your approach.",
                    "How do you handle unexpected obstacles or challenges?",
                    "What's your approach to adapting to new team dynamics or management styles?"
                ],
                default: [
                    "Tell me about yourself and your professional background.",
                    "Why are you interested in this role/company?",
                    "What are your greatest strengths and weaknesses?",
                    "Where do you see yourself in five years?",
                    "Tell me about a challenge you faced at work and how you overcame it."
                ]
            },
            intermediate: {
                leadership: [
                    "Describe a situation where you had to make an unpopular decision as a leader. How did you handle it?",
                    "Tell me about a time when you had to lead through a significant change or transition.",
                    "How do you develop leadership skills in your team members?",
                    "Describe how you've handled a situation where team members weren't meeting expectations.",
                    "How do you balance being authoritative and collaborative as a leader?"
                ],
                teamwork: [
                    "Tell me about a time when you had to work with a diverse team with different working styles.",
                    "How have you handled situations where team dynamics were challenging?",
                    "Describe a project where you had to collaborate across multiple departments or teams.",
                    "How do you ensure accountability within a team without micromanaging?",
                    "Tell me about a time when you had to step up and take on responsibilities outside your role for the team."
                ],
                conflict: [
                    "Describe a situation where you had to resolve a conflict between team members.",
                    "Tell me about a time when you had a serious disagreement with your manager. How did you handle it?",
                    "How do you approach situations where there are competing priorities or interests?",
                    "Describe how you've handled receiving feedback that you disagreed with.",
                    "Tell me about a time when you had to rebuild a damaged professional relationship."
                ],
                communication: [
                    "How do you ensure effective communication in cross-functional teams?",
                    "Tell me about a time when you had to communicate a significant change or bad news to your team.",
                    "Describe how you adapt your communication style when dealing with technical and non-technical stakeholders.",
                    "How do you handle situations where you need to influence without authority?",
                    "Describe a situation where you improved communication processes in your team or organization."
                ],
                culture: [
                    "Tell me about a time when you had to adapt to a company culture that was different from what you were used to.",
                    "How have you contributed to improving diversity and inclusion in your workplace?",
                    "Describe a situation where you had to navigate political dynamics in an organization.",
                    "How do you maintain your authenticity while adapting to different organizational cultures?",
                    "Tell me about a time when you helped shape or change aspects of a company's culture."
                ],
                motivation: [
                    "How do you maintain motivation during long-term projects with distant outcomes?",
                    "Tell me about a time when you helped motivate a demoralized team or colleague.",
                    "How do you align your personal goals with organizational objectives?",
                    "Describe how you've stayed motivated during periods of organizational uncertainty.",
                    "What strategies do you use to recover from professional setbacks or failures?"
                ],
                stress: [
                    "Describe a situation where you had to manage multiple high-priority projects simultaneously.",
                    "How do you recognize and address signs of burnout in yourself and others?",
                    "Tell me about a time when you had to perform under extreme pressure. What strategies did you use?",
                    "How do you maintain perspective when dealing with workplace challenges?",
                    "Describe how you've helped create a healthier approach to stress in your team or organization."
                ],
                adaptability: [
                    "Tell me about a time when you had to quickly master a new skill or technology due to changing business needs.",
                    "How have you adapted your management or working style for different generations in the workplace?",
                    "Describe a situation where you had to pivot a project or strategy significantly midway through.",
                    "How do you approach ambiguous situations where there's no clear path forward?",
                    "Tell me about a time when you had to abandon a long-standing practice or approach for something new."
                ],
                default: [
                    "Describe a situation where you had to influence stakeholders with differing priorities.",
                    "Tell me about a time when you failed. What did you learn from it?",
                    "How do you approach making difficult decisions with limited information?",
                    "Describe how you've contributed to improving processes or efficiency in your previous roles.",
                    "How do you balance competing priorities when resources are limited?"
                ]
            },
            advanced: {
                leadership: [
                    "Tell me about a time when you had to lead an organization or department through a crisis or significant challenge.",
                    "How have you handled situations where you needed to drive cultural transformation in an organization?",
                    "Describe how you've built and developed high-performing leadership teams.",
                    "Tell me about a time when you had to make difficult decisions that affected people's livelihoods or careers.",
                    "How do you balance short-term results with long-term organizational health as a leader?"
                ],
                teamwork: [
                    "Describe how you've built and managed global or highly distributed teams effectively.",
                    "Tell me about a time when you had to integrate teams with different cultures or working practices after a merger or acquisition.",
                    "How do you foster innovation and creative collaboration in teams?",
                    "Describe how you've handled situations where you needed to rebuild a dysfunctional team.",
                    "How do you approach building high-trust environments in teams with diverse backgrounds and perspectives?"
                ],
                conflict: [
                    "Tell me about a time when you had to resolve a high-stakes conflict between senior stakeholders or executives.",
                    "How have you handled situations where ethical considerations created conflicts within the organization?",
                    "Describe how you've navigated complex political situations that involved competing departmental interests.",
                    "Tell me about a time when you had to address systemic conflict issues in an organization.",
                    "How do you approach conflicts that involve deeply held values or principles?"
                ],
                communication: [
                    "Describe how you've communicated complex strategic changes across large organizations.",
                    "Tell me about a time when you had to manage communications during a crisis or sensitive situation.",
                    "How do you ensure alignment and consistent messaging across different levels and departments in an organization?",
                    "Describe how you've built communication strategies that support organizational transformation.",
                    "How do you approach communicating unpopular decisions to various stakeholders?"
                ],
                culture: [
                    "Tell me about your experience shaping or transforming organizational culture at scale.",
                    "How have you handled situations where there was a significant disconnect between stated values and actual practices in an organization?",
                    "Describe how you've built inclusive cultures in traditionally homogeneous environments.",
                    "How do you measure and evaluate cultural health in an organization?",
                    "Tell me about a time when you had to align subcultures across different business units or geographies."
                ],
                motivation: [
                    "How do you foster intrinsic motivation in organizations that have traditionally relied on extrinsic rewards?",
                    "Tell me about how you've maintained team engagement during periods of significant organizational change or uncertainty.",
                    "Describe how you've built systems that align individual motivations with organizational objectives.",
                    "How do you approach motivating teams with diverse generational or cultural backgrounds?",
                    "Tell me about a time when you had to remotivate an organization after a significant setback or failure."
                ],
                stress: [
                    "How have you built organizational resilience to help teams manage through extended periods of high pressure?",
                    "Tell me about how you've addressed systemic causes of burnout in an organization.",
                    "Describe how you've balanced driving high performance while maintaining sustainable work practices.",
                    "How do you approach mental health and wellbeing as a leadership responsibility?",
                    "Tell me about a time when you had to lead through a prolonged crisis while maintaining team health."
                ],
                adaptability: [
                    "Describe how you've led significant organizational transformation or change management initiatives.",
                    "Tell me about how you've built adaptive capacity in teams or organizations to respond to rapidly changing market conditions.",
                    "How have you fostered a culture of continuous learning and adaptation in your organization?",
                    "Describe how you've helped traditional businesses or teams adapt to digital transformation.",
                    "Tell me about a time when you had to completely reimagine a business model or core strategy due to disruption."
                ],
                default: [
                    "How do you approach building and executing long-term strategic visions?",
                    "Tell me about how you've handled navigating competing stakeholder interests in complex situations.",
                    "Describe your approach to developing future leaders and succession planning.",
                    "How do you balance innovation and risk management in your leadership approach?",
                    "Tell me about a time when you had to make decisions with significant ethical dimensions or tradeoffs."
                ]
            }
        },
        technical: {
            beginner: {
                dsa: [
                    "What is the difference between an array and a linked list?",
                    "Explain what a stack data structure is and give a real-world example.",
                    "What is the time complexity of searching in a sorted array?",
                    "Explain the concept of recursion with a simple example.",
                    "What is the difference between a queue and a stack?"
                ],
                webdev: [
                    "What is the difference between let, const, and var in JavaScript?",
                    "Explain what HTML semantic tags are and give examples.",
                    "What is the box model in CSS?",
                    "What is the difference between inline and block elements in HTML?",
                    "Explain the concept of responsive design."
                ],
                ml: [
                    "What is the difference between supervised and unsupervised learning?",
                    "Explain what a decision tree is.",
                    "What is overfitting in machine learning?",
                    "Explain the concept of linear regression.",
                    "What is the purpose of a training set in machine learning?"
                ],
                default: [
                    "What is the difference between let, const, and var in JavaScript?",
                    "Explain the concept of Object-Oriented Programming.",
                    "What is the difference between a stack and a queue?",
                    "Explain what HTML semantic tags are and give examples.",
                    "What is the box model in CSS?"
                ]
            },
            intermediate: {
                dsa: [
                    "Explain the time and space complexity of quicksort. When might it perform poorly?",
                    "How would you implement a queue using two stacks?",
                    "Explain the concept of dynamic programming and when you would use it.",
                    "What is the difference between a binary tree and a binary search tree?",
                    "How would you detect a cycle in a linked list?"
                ],
                webdev: [
                    "Explain the concept of closures in JavaScript and provide a practical example.",
                    "Describe the differences between REST and GraphQL APIs.",
                    "Explain how virtual DOM works in React and why it's beneficial.",
                    "What are promises in JavaScript and how do they work?",
                    "Explain the concept of CSS Grid and how it differs from Flexbox."
                ],
                ml: [
                    "Explain the bias-variance tradeoff in machine learning.",
                    "What is the difference between bagging and boosting in ensemble learning?",
                    "Explain how backpropagation works in neural networks.",
                    "What is regularization and why is it important in machine learning?",
                    "Explain the concept of feature engineering and why it matters."
                ],
                default: [
                    "Explain the concept of closures in JavaScript.",
                    "What is the time complexity of common sorting algorithms?",
                    "Describe the differences between REST and GraphQL.",
                    "Explain how virtual DOM works in React.",
                    "What are promises in JavaScript and how do they work?"
                ]
            },
            advanced: {
                dsa: [
                    "Explain how you would implement an LRU cache with O(1) time complexity for both get and put operations.",
                    "Describe how you would solve the traveling salesman problem and analyze its complexity.",
                    "Explain the concept of red-black trees and their self-balancing properties.",
                    "How would you implement a distributed system to count unique visitors across multiple servers?",
                    "Describe an efficient algorithm for finding the kth smallest element in an unsorted array."
                ],
                webdev: [
                    "Explain how the JavaScript event loop works in detail, including microtasks and macrotasks.",
                    "How would you architect a large-scale, high-performance single-page application?",
                    "Explain the concept of server-side rendering vs. client-side rendering and the tradeoffs.",
                    "How would you implement a real-time collaborative editing feature like in Google Docs?",
                    "Describe how you would optimize a web application for performance and accessibility."
                ],
                ml: [
                    "Explain the mathematics behind gradient descent optimization and its variants.",
                    "How would you handle extremely imbalanced datasets in a classification problem?",
                    "Describe the architecture of a transformer model and how attention mechanisms work.",
                    "How would you design a recommendation system that balances exploration and exploitation?",
                    "Explain the concept of generative adversarial networks and their training challenges."
                ],
                default: [
                    "Explain how event loop works in JavaScript.",
                    "Describe the implementation of a distributed cache system.",
                    "How would you design a scalable microservice architecture?",
                    "Explain the concept of eventual consistency in distributed systems.",
                    "Describe different approaches to handle concurrency in a database."
                ]
            }
        },
        hr: {
            beginner: [
                "Tell me about yourself.",
                "What are your strengths and weaknesses?",
                "Why do you want to work for this company?",
                "Where do you see yourself in 5 years?",
                "Describe a challenge you faced and how you overcame it."
            ],
            intermediate: [
                "Tell me about a time when you had to work with a difficult team member.",
                "How do you handle criticism?",
                "Describe a situation where you had to meet a tight deadline.",
                "How do you prioritize your work?",
                "Tell me about a time you went above and beyond for a project."
            ],
            advanced: [
                "Describe a situation where you had to make an unpopular decision.",
                "Tell me about a time when you failed and what you learned from it.",
                "How do you handle ambiguity in your work?",
                "Describe a situation where you had to influence others without direct authority.",
                "How do you stay motivated during challenging projects?"
            ]
        },
        company: {
            beginner: {
                google: [
                    "What do you know about Google's core values?",
                    "Why are you interested in working at Google?",
                    "How do your skills align with this position at Google?",
                    "What Google product do you use the most and how would you improve it?",
                    "What aspects of Google's culture appeal to you?"
                ],
                microsoft: [
                    "What do you know about Microsoft's mission?",
                    "Why are you interested in working at Microsoft?",
                    "How do your skills align with this position at Microsoft?",
                    "What Microsoft product do you use the most and how would you improve it?",
                    "What aspects of Microsoft's culture appeal to you?"
                ],
                default: [
                    "What do you know about our company?",
                    "Why are you interested in this role?",
                    "How do your skills align with this position?",
                    "What value can you bring to our team?",
                    "What aspects of our company culture appeal to you?"
                ]
            },
            intermediate: {
                google: [
                    "How would you improve one of Google's products or services?",
                    "What industry trends do you think will affect Google's business?",
                    "How would you contribute to Google's mission to organize the world's information?",
                    "What challenges do you think Google is facing in the market today?",
                    "How do you stay updated with developments in Google's technology stack?"
                ],
                microsoft: [
                    "How would you improve one of Microsoft's products or services?",
                    "What industry trends do you think will affect Microsoft's business?",
                    "How would you contribute to Microsoft's mission to empower every person and organization?",
                    "What challenges do you think Microsoft is facing in the cloud computing space?",
                    "How do you stay updated with developments in Microsoft's technology ecosystem?"
                ],
                default: [
                    "How would you improve one of our products/services?",
                    "What industry trends do you think will affect our business?",
                    "How do you stay updated with our industry developments?",
                    "What challenges do you think our company is facing?",
                    "How would you contribute to our company's mission?"
                ]
            },
            advanced: {
                google: [
                    "How would you implement Google's strategy in your role?",
                    "What competitive advantages does Google have over its competitors?",
                    "How would you handle a situation where Google's values conflict with business goals?",
                    "What changes would you recommend to improve Google's market position in cloud services?",
                    "How would you align your team with Google's long-term vision?"
                ],
                microsoft: [
                    "How would you implement Microsoft's cloud-first strategy in your role?",
                    "What competitive advantages does Microsoft have in the enterprise market?",
                    "How would you handle a situation where Microsoft's values conflict with business goals?",
                    "What changes would you recommend to improve Microsoft's position against competitors like AWS?",
                    "How would you align your team with Microsoft's vision for the future of work?"
                ],
                default: [
                    "How would you implement our company's strategy in your role?",
                    "What competitive advantages do we have over our competitors?",
                    "How would you handle a situation where our company's values conflict with business goals?",
                    "What changes would you recommend to improve our market position?",
                    "How would you align your team with our company's long-term vision?"
                ]
            }
        }
    };
    
    // Select questions based on mode, difficulty, and domain/company/hrTopic
    let questions = [];
    
    if (mode === 'technical' && mockQuestions[mode][difficulty][domain]) {
        questions = mockQuestions[mode][difficulty][domain];
    } else if (mode === 'company' && mockQuestions[mode][difficulty][company]) {
        questions = mockQuestions[mode][difficulty][company];
    } else if (mode === 'hr' && mockQuestions[mode][difficulty][hrTopic]) {
        questions = mockQuestions[mode][difficulty][hrTopic];
    } else if (mockQuestions[mode][difficulty].default) {
        questions = mockQuestions[mode][difficulty].default;
    } else {
        questions = mockQuestions[mode][difficulty];
    }
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Store current question for later reference
    window.currentQuestion = {
        text: question,
        mode: mode,
        difficulty: difficulty
    };
    
    // Add question to conversation history
    conversationHistory.push({
        role: 'assistant',
        content: question
    });
    
    // Add question to chat
    addBotMessage(question);
}

/**
 * Generate mock feedback when API fails
 */
function generateMockFeedback(userAnswer, currentQuestion) {
    // Hide typing indicator
    hideTypingIndicator();
    
    const lowerCaseAnswer = userAnswer.toLowerCase();
    let feedback = "";
    
    // Generate appropriate feedback based on answer length and content
    if (lowerCaseAnswer.includes("i don't know") || lowerCaseAnswer.includes("not sure")) {
        feedback = `That's okay! It's better to acknowledge when you're not sure about something rather than making up an answer. 

For this question about "${currentQuestion.text}", here are some key points you could consider:

1. Start by acknowledging the question
2. Share what you do know about the topic
3. Explain how you would approach finding the answer
4. Demonstrate your willingness to learn

Would you like to try another question?`;
    } 
    else if (lowerCaseAnswer.length < 50) {
        feedback = `Your answer is quite brief. In an interview, it's usually better to provide more detailed responses with examples or explanations.

For the question "${currentQuestion.text}", try to:

1. Provide a clear, structured response
2. Include specific examples from your experience
3. Explain your reasoning or thought process
4. Connect your answer to the role you're applying for

Would you like to try answering this question again, or move on to another one?`;
    } 
    else if (lowerCaseAnswer.length > 200) {
        feedback = `You've provided a detailed answer, which is good! Your response shows depth of knowledge and thoughtfulness.

Some strengths in your answer:
1. You covered multiple aspects of the question
2. Your explanation was thorough

Areas for improvement:
1. Consider being more concise for certain key points
2. Make sure to directly address the core of the question

Overall, this is a solid response. Would you like to try another question?`;
    }
    else {
        feedback = `Thank you for your answer to "${currentQuestion.text}".

Strengths of your response:
1. You addressed the main points of the question
2. Your answer was well-structured

Suggestions for improvement:
1. Consider adding a specific example to illustrate your points
2. Connect your answer more explicitly to the job requirements

Would you like to try another question?`;
    }
    
    // Add feedback to conversation history
    conversationHistory.push({
        role: 'assistant',
        content: feedback
    });
    
    // Add feedback to chat
    addBotMessage(feedback);
    
    // Check if we've reached the maximum number of questions
    if (interviewContext.questionCount >= interviewContext.maxQuestions) {
        setTimeout(() => {
            const completionMessage = "You've completed this interview session! Would you like to start a new session with different settings? Type 'new' to select different options.";
            
            addBotMessage(completionMessage);
            
            // Add to conversation history
            conversationHistory.push({
                role: 'assistant',
                content: completionMessage
            });
            
            // Reset interview context
            interviewContext.inProgress = false;
        }, 1000);
    }
}
