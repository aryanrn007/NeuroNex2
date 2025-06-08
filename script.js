// --- START OF FILE script.js ---
// NO GoogleGenerativeAI import needed

document.addEventListener('DOMContentLoaded', () => {
    const studentProfileSection = document.getElementById('student-profile-section');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const linkedinUrlInput = document.getElementById('linkedin-url-input');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const logoutButton = document.getElementById('logout-button');
    const loggedInUserNameDisplay = document.getElementById('loggedInUserName');
    const menuBtn = document.getElementById('chatbot-menu-btn');
    const menuDropdown = document.getElementById('chatbot-menu-dropdown');
    const emojiBtn = document.getElementById('chat-emoji');
    const emojiPicker = document.getElementById('emoji-picker');
    const chatbotContainer = document.querySelector('.glassmorphic');
    const aboutMeBtn = document.getElementById('aboutMeBtn');
    const aboutMeModal = document.getElementById('aboutMeModal');
    const closeAboutMeModal = document.getElementById('closeAboutMeModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditProfileModal = document.getElementById('closeEditProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');
    const avatarInput = document.getElementById('avatarInput');
    const coverPhotoInput = document.getElementById('coverPhotoInput');

    let loggedInStudent = null;
    let isBotTyping = false;
    let allCompanyOpportunitiesData = [];

    // Add hover animation to menu button
    if (menuBtn) {
        menuBtn.addEventListener('mouseenter', () => {
            menuBtn.classList.add('hover');
        });
        
        menuBtn.addEventListener('mouseleave', () => {
            menuBtn.classList.remove('hover');
        });
    }
    
    // Close dropdown when clicking anywhere outside the menu
    document.addEventListener('click', (e) => {
        if (menuDropdown && menuBtn && !menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
            // Close the dropdown by setting display to none
            if (menuDropdown.style.display === 'block') {
                menuDropdown.style.display = 'none';
                console.log('Menu closed by outside click');
            }
        }
    });
    
    // Also close dropdown when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuDropdown && menuDropdown.style.display === 'block') {
            menuDropdown.style.display = 'none';
            console.log('Menu closed by Escape key');
        }
    });

    // Enhanced menu toggle with smooth animation
    window.toggleMenu = function(e) {
        if (!menuDropdown) {
            console.error('Menu dropdown not found');
            return;
        }
        
        // Stop event propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Toggle dropdown with animation
        if (menuDropdown.style.display === 'block') {
            // Add closing animation
            menuDropdown.classList.remove('show');
            menuBtn.classList.remove('active');
            
            // Delay hiding to allow animation to complete
            setTimeout(() => {
                menuDropdown.style.display = 'none';
                console.log('Menu closed with animation');
            }, 300);
        } else {
            // Show dropdown first, then animate
            menuDropdown.style.display = 'block';
            
            // Trigger reflow to ensure animation works
            void menuDropdown.offsetWidth;
            
            // Add opening animation
            menuDropdown.classList.add('show');
            menuBtn.classList.add('active');
            console.log('Menu opened with animation');
        }
        
        // Add enhanced ripple effect
        if (menuBtn) {
            // Remove any existing ripples
            const existingRipples = menuBtn.querySelectorAll('.menu-btn-ripple');
            existingRipples.forEach(ripple => ripple.remove());
            
            // Create new ripple
            const ripple = document.createElement('span');
            ripple.className = 'menu-btn-ripple';
            menuBtn.appendChild(ripple);
            
            // Set ripple position based on click coordinates
            if (e && e.clientX && e.clientY) {
                const rect = menuBtn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
            }
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
        
        return false;
    };
    
    // Direct implementation of new chat with welcome message
    window.startNewChat = function() {
        console.log('Starting new chat');
        
        if (!chatWindow) {
            console.error('Chat window not found');
            return;
        }
        
        // Get welcome template
        const welcomeTemplate = document.getElementById('welcome-template');
        if (!welcomeTemplate) {
            console.error('Welcome template not found');
        }
        
        // Clear the chat window but keep the template
        chatWindow.innerHTML = '';
        console.log('Chat window cleared');
        
        // Close the dropdown
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
        } catch (e) { studentName = 'there'; }
        
        // Create a clone of the welcome template
        const welcomeHTML = `
            <div class="chat-message aura-message">
                <i class="fas fa-sparkles"></i>
                <div class="message-content">Hello ${studentName}! I'm Aura, your AI assistant. How can I help you today?</div>
            </div>
        `;
        
        // Add the welcome message
        chatWindow.innerHTML = welcomeHTML;
        console.log('Welcome message added');
        
        // Add the template back
        if (welcomeTemplate) {
            chatWindow.appendChild(welcomeTemplate);
        }
        
        // Show notification
        showNotification("New chat started", "success");
    };
    
    // Function to add a bot message to the chat window
    function addBotMessage(message) {
        if (!chatWindow) return;
        
        // Create bot message container
        const botMessageContainer = document.createElement('div');
        botMessageContainer.className = 'chat-message bot';
        
        // Add bot avatar
        const botAvatar = document.createElement('div');
        botAvatar.className = 'chat-avatar';
        botAvatar.innerHTML = '<i class="fas fa-robot"></i>';
        botMessageContainer.appendChild(botAvatar);
        
        // Add message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        botMessageContainer.appendChild(messageContent);
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        const now = new Date();
        timestamp.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        botMessageContainer.appendChild(timestamp);
        
        // Add to chat window
        chatWindow.appendChild(botMessageContainer);
        
        // Scroll to bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    // Function to show a notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    async function initializeDashboard() {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (!studentDataString) {
            window.location.href = 'login.html';
            return;
        }
        loggedInStudent = JSON.parse(studentDataString);

        if (!loggedInStudent || !loggedInStudent.fullName) {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
            return;
        }

        if (loggedInUserNameDisplay) {
            loggedInUserNameDisplay.textContent = `Hi, ${loggedInStudent.fullName.split(' ')[0]}!`;
        }

        populateStudentProfile(loggedInStudent);
        await loadAndProcessInitialCompanyData();
    }

    // Dark mode functionality removed

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
        });
    }

    function populateStudentProfile(student) {
        if (!studentProfileSection || !student) {
            console.warn("populateStudentProfile: studentProfileSection or student data missing.");
            return;
        }
        studentProfileSection.innerHTML = '';
        let displayInitials = "NA";

        if (student.fullName && typeof student.fullName === 'string' && student.fullName.trim() !== '') {
            const nameParts = student.fullName.trim().split(/\s+/);
            if (nameParts[0] && nameParts[0].length > 0) {
                displayInitials = nameParts[0][0].toUpperCase();
                if (nameParts.length > 1 && nameParts[1] && nameParts[1].length > 0) {
                    displayInitials += nameParts[1][0].toUpperCase();
                } else if (nameParts[0].length > 1 && displayInitials.length === 1) {
                    displayInitials += nameParts[0][1].toUpperCase();
                }
            }
        }
        displayInitials = displayInitials.replace(/[^A-Z0-9]/gi, '').substring(0, 2);
        if (!displayInitials) displayInitials = "NA";

        const defaultPlaceholder = `https://via.placeholder.com/80/CCCCCC/FFFFFF?text=${displayInitials}`;
        
        // Determine status classes for CGPA and Attendance
        const cgpaClass = student.cgpa >= 8.5 ? 'good-stat' : (student.cgpa >= 7.0 ? 'warning-stat' : 'danger-stat');
        const attendanceClass = student.attendance >= 85 ? 'good-stat' : (student.attendance >= 75 ? 'warning-stat' : 'danger-stat');
        const backlogsClass = student.backlogs === 0 ? 'good-stat' : (student.backlogs <= 2 ? 'warning-stat' : 'danger-stat');
        
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <h2>My Dashboard</h2>
            <div class="student-card-header">
                <img src="${student.profilePic || defaultPlaceholder}" alt="${student.fullName || 'Student'} Profile Pic" onerror="this.onerror=null; this.src='${defaultPlaceholder}'; console.warn('Image load error, using placeholder for:', '${student.profilePic || 'default'}');">
                <div>
                    <h3>${student.fullName || 'N/A'}</h3>
                    <p>${student.branch || 'N/A'}</p>
                </div>
            </div>
            <p><strong>CGPA:</strong> <span class="stat-value ${cgpaClass}">${student.cgpa !== undefined ? student.cgpa.toFixed(2) : 'N/A'}</span></p>
            <p><strong>Attendance:</strong> <span class="stat-value ${attendanceClass}">${student.attendance !== undefined ? student.attendance + '%' : 'N/A'}</span></p>
            <p><strong>Backlogs:</strong> <span class="stat-value ${backlogsClass}">${student.backlogs !== undefined ? (student.backlogs > 0 ? student.backlogs : 'None') : 'N/A'}</span></p>
            
            <p><strong>Key Skills/Certs:</strong></p>
            <ul class="skills-list">${(student.keySkills || []).map(skill => `<li>${skill}</li>`).join('')}</ul>
            
            <p><strong>Suggested Companies:</strong></p>
            <ul class="companies-list">${(student.suggestedCompanies || []).map(company => `<li>${company}</li>`).join('')}</ul>
            
            <div class="profile-buttons">
                ${student.linkedInProfile ? `<a href="${student.linkedInProfile}" class="linkedin-btn" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i> LinkedIn Profile</a>` : ''}
            </div>
        `;
        studentProfileSection.appendChild(card);
    }

    function addMessageToChat(text, sender, isTyping = false) {
        if (!chatWindow) return;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        if (isTyping) {
            msgDiv.classList.add('typing-indicator');
            msgDiv.innerHTML = `<span></span><span></span><span></span>`;
        } else {
            msgDiv.innerHTML = text;
        }
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function addUserMessage(text) { addMessageToChat(text, 'user'); }
    function addBotMessage(text) {
        const ti = chatWindow ? chatWindow.querySelector('.typing-indicator') : null;
        if (ti) ti.remove();
        isBotTyping = false;
        addMessageToChat(text, 'bot');
    }
    function showTypingIndicator() {
        if (!isBotTyping) {
            addMessageToChat('', 'bot', true);
            isBotTyping = true;
        }
    }

    if (sendChatBtn) sendChatBtn.addEventListener('click', handleSendMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });

    function handleSendMessage() {
        if (!chatInput) return;
        const msg = chatInput.value.trim();
        if (msg === '') return;
        addUserMessage(msg);
        chatInput.value = '';
        processUserQuery(msg);
    }

    async function loadAndProcessInitialCompanyData() {
        try {
            const response = await fetch('data/company_opportunities.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allCompanyOpportunitiesData = await response.json();
            console.log("Company opportunities data loaded for rule-based suggestions:", allCompanyOpportunitiesData.length, "entries.");
        } catch (error)
{            console.error("Error loading company_opportunities.json:", error);
        }
    }
    
    // --- RULE-BASED CHATBOT LOGIC with Keyword Matching ---
    async function processUserQuery(query) {
        showTypingIndicator();
        
        const student = loggedInStudent;
        if (!student) {
            addBotMessage("I'm sorry, I can't access your details. Please try logging in again.");
            return;
        }

        try {
            // Create context about the student
            const studentContext = `
                Student Name: ${student.fullName}
                Branch: ${student.branch}
                CGPA: ${student.cgpa}
                Attendance: ${student.attendance}%
                Backlogs: ${student.backlogs}
                Skills: ${student.keySkills.join(', ')}
            `;

            // Prepare the message for the AI
            const messages = [
                {
                    role: "system",
                    content: `You are Juno, a helpful college companion AI. You have access to the following student information: ${studentContext}. 
                    Provide helpful, friendly, and accurate responses. Keep responses concise and relevant to college life and academics.`
                },
                {
                    role: "user",
                    content: query
                }
            ];

            // Make API call to OpenRouter
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY_HERE', // Replace with your actual API key
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Juno College Companion'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-3.5-turbo',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Add a small delay to make the response feel more natural
            await new Promise(resolve => setTimeout(resolve, 500));
            addBotMessage(aiResponse);

        } catch (error) {
            console.error('Error fetching AI response:', error);
            addBotMessage("I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.");
        }
    }
    
    function skillsForCompanyResponse(companyName, student) {
         return `For <strong>${companyName}</strong>, <strong>${student.fullName.split(' ')[0]}</strong>, you'd generally need:<br>
                1. Strong Data Structures and Algorithms (DSA) skills.<br>
                2. Proficiency in languages like Python, Java, or C++.<br>
                3. Good problem-solving and analytical abilities.<br>
                4. Projects showcasing your skills (Your skills: ${(student.keySkills && student.keySkills.join(', ')) || 'N/A'}).<br>
                5. Knowledge of System Design for some roles.<br>
                Consider relevant cloud certifications if applicable (e.g., GCP for Google, Azure for Microsoft, AWS for Amazon).`;
    }

    initializeDashboard();
    initializeJunoDataFetcher();

    // --- Glassmorphic Chatbot Menu Dropdown Logic ---
    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuDropdown.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
                menuDropdown.classList.remove('show');
            }
        });

        // New Chat functionality - without welcome message
        const newChatBtn = menuDropdown.querySelector('.chatbot-menu-item');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                // Clear chat window
                if (chatWindow) chatWindow.innerHTML = '';
                // Clear chat history
                if (typeof chatHistory !== 'undefined') chatHistory.length = 0;
                // Hide menu after click
                menuDropdown.classList.remove('show');
                // Show notification
                showNotification("New chat started", "success");
            });
        }
    }

    // Add welcome message on page load
    window.addEventListener('load', () => {
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
        
        // Add the greeting message directly to the chat window
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
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
        }
    });

    // Enhanced Emoji Picker Functionality
    const emojiPickerContainer = document.getElementById('emoji-picker-container');
    
    if (emojiBtn && emojiPicker && chatInput && emojiPickerContainer) {
        // Initially hide the emoji picker container
        emojiPickerContainer.style.display = 'none';
        
        // Array of emojis to cycle through on hover
        const hoverEmojis = ['😊', '😁', '😄', '😍', '🥰', '😎', '🤩', '😋', '🤗', '😉'];
        let originalEmoji = emojiBtn.textContent || '😊';
        
        // Change emoji on hover
        emojiBtn.addEventListener('mouseenter', () => {
            // Save original emoji if not already saved
            if (!emojiBtn.dataset.originalEmoji) {
                emojiBtn.dataset.originalEmoji = originalEmoji;
            }
            
            // Get random emoji from array that's different from current
            let randomEmoji;
            do {
                randomEmoji = hoverEmojis[Math.floor(Math.random() * hoverEmojis.length)];
            } while (randomEmoji === emojiBtn.textContent);
            
            // Apply the new emoji with animation
            emojiBtn.animate([
                { transform: 'scale(1) rotate(0deg)', opacity: 1 },
                { transform: 'scale(0.5) rotate(10deg)', opacity: 0.7 },
                { transform: 'scale(1.2) rotate(-5deg)', opacity: 1 }
            ], {
                duration: 300,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
            
            emojiBtn.textContent = randomEmoji;
        });
        
        // Restore original emoji when not hovering
        emojiBtn.addEventListener('mouseleave', () => {
            // Only restore if we have saved the original
            if (emojiBtn.dataset.originalEmoji) {
                // Apply animation for changing back
                emojiBtn.animate([
                    { transform: 'scale(1) rotate(0deg)', opacity: 1 },
                    { transform: 'scale(0.8) rotate(-5deg)', opacity: 0.7 },
                    { transform: 'scale(1) rotate(0deg)', opacity: 1 }
                ], {
                    duration: 200,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
                
                emojiBtn.textContent = emojiBtn.dataset.originalEmoji;
            }
        });
        
        
        // Enhanced emoji picker toggle with smooth animation
        emojiBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle display with enhanced animation
            if (emojiPickerContainer.style.display === 'none') {
                // Show emoji picker with improved animation
                emojiPickerContainer.style.display = 'block';
                
                // Trigger reflow to ensure animation works
                void emojiPickerContainer.offsetWidth;
                
                // Add show class for animation
                emojiPickerContainer.classList.add('show');
                
                // Add active state to button with enhanced animation
                emojiBtn.classList.add('active');
                
                // Create ripple effect on emoji button
                const ripple = document.createElement('span');
                ripple.className = 'emoji-btn-ripple';
                emojiBtn.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Play a subtle bounce animation
                emojiBtn.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.2) rotate(5deg)' },
                    { transform: 'scale(1.1) rotate(-3deg)' },
                    { transform: 'scale(1.15) rotate(0deg)' }
                ], {
                    duration: 400,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
            } else {
                // Hide emoji picker with smooth animation
                emojiPickerContainer.classList.remove('show');
                emojiBtn.classList.remove('active');
                
                // Play closing animation
                emojiBtn.animate([
                    { transform: 'scale(1.1)' },
                    { transform: 'scale(0.95)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 300,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
                
                // Delay hiding to allow animation to complete
                setTimeout(() => {
                    emojiPickerContainer.style.display = 'none';
                }, 300);
            }
        });
        
        // Close emoji picker when clicking outside
        document.addEventListener('click', (e) => {
            if (emojiPickerContainer.style.display !== 'none' && 
                !emojiPickerContainer.contains(e.target) && 
                e.target !== emojiBtn) {
                
                // Hide with animation
                emojiPickerContainer.classList.remove('show');
                emojiBtn.classList.remove('active');
                
                setTimeout(() => {
                    emojiPickerContainer.style.display = 'none';
                }, 300);
            }
        });
        
        // Handle emoji selection with enhanced visual feedback
        emojiPicker.addEventListener('emoji-click', event => {
            const emoji = event.detail.unicode;
            
            // Update the emoji button to show the selected emoji with animation
            emojiBtn.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(1.3) rotate(5deg)', opacity: 0.7 },
                { transform: 'scale(1) rotate(0deg)', opacity: 1 }
            ], {
                duration: 400,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            });
            
            // Update emoji button and save as the new original
            emojiBtn.textContent = emoji;
            emojiBtn.dataset.originalEmoji = emoji;
            
            // Create sparkle effect around the emoji button
            createSparkles(emojiBtn, 8);
            
            // Insert emoji at cursor position
            const start = chatInput.selectionStart;
            const end = chatInput.selectionEnd;
            const value = chatInput.value;
            chatInput.value = value.slice(0, start) + emoji + value.slice(end);
            
            // Update cursor position
            chatInput.focus();
            chatInput.selectionStart = chatInput.selectionEnd = start + emoji.length;
            
            // Add subtle animation to input
            chatInput.animate([
                { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                { backgroundColor: 'rgba(255, 255, 255, 0)' }
            ], {
                duration: 500,
                easing: 'ease-out'
            });
            
            // Hide emoji picker with animation
            emojiPickerContainer.classList.remove('show');
            emojiBtn.classList.remove('active');
            
            setTimeout(() => {
                emojiPickerContainer.style.display = 'none';
            }, 300);
            
            // Save selected emoji to localStorage for persistence
            try {
                localStorage.setItem('userPreferredEmoji', emoji);
            } catch (e) {
                console.log('Could not save emoji preference');
            }
        });
        
        // Function to create sparkle effects
        function createSparkles(element, count = 5) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            for (let i = 0; i < count; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'emoji-sparkle';
                
                // Random position around the emoji
                const angle = Math.random() * Math.PI * 2; // Random angle
                const distance = 20 + Math.random() * 30; // Random distance
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                sparkle.style.left = `${x}px`;
                sparkle.style.top = `${y}px`;
                sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
                
                element.appendChild(sparkle);
                
                // Remove sparkle after animation
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }
        }
        
        // Load saved emoji preference if available
        try {
            const savedEmoji = localStorage.getItem('userPreferredEmoji');
            if (savedEmoji) {
                emojiBtn.textContent = savedEmoji;
                emojiBtn.dataset.originalEmoji = savedEmoji;
            }
        } catch (e) {
            console.log('Could not load emoji preference');
        }
        
        // Close emoji picker with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && emojiPickerContainer.style.display !== 'none') {
                emojiPickerContainer.classList.remove('show');
                emojiBtn.classList.remove('active');
                
                setTimeout(() => {
                    emojiPickerContainer.style.display = 'none';
                }, 300);
            }
        });
        
        // Handle window resize for responsive positioning
        window.addEventListener('resize', () => {
            if (emojiPickerContainer.style.display !== 'none') {
                // Adjust position based on viewport size
                if (window.innerWidth < 768) {
                    // Center on mobile
                    emojiPickerContainer.style.left = '50%';
                    emojiPickerContainer.style.transform = 'translateX(-50%)';
                } else {
                    // Position near emoji button on desktop
                    emojiPickerContainer.style.left = '10px';
                    emojiPickerContainer.style.transform = 'none';
                }
            }
        });
    }

    if (chatInput && chatbotContainer) {
        let wasGlowing = false;
        function updateGlow() {
            const isActive = document.activeElement === chatInput || chatInput.value.length > 0;
            if (isActive && !wasGlowing) {
                chatbotContainer.classList.remove('chatbot-glow-down');
                chatbotContainer.classList.add('chatbot-glow-up');
                chatbotContainer.classList.add('chatbot-glow');
                wasGlowing = true;
            } else if (!isActive && wasGlowing) {
                chatbotContainer.classList.remove('chatbot-glow-up');
                chatbotContainer.classList.add('chatbot-glow-down');
                setTimeout(() => {
                    chatbotContainer.classList.remove('chatbot-glow');
                    chatbotContainer.classList.remove('chatbot-glow-down');
                }, 350);
                wasGlowing = false;
            }
        }
        chatInput.addEventListener('focus', updateGlow);
        chatInput.addEventListener('blur', updateGlow);
        chatInput.addEventListener('input', updateGlow);
    }

    // Settings Panel Functionality - Fixed
    let settingsInitialized = false;

    function initializeSettings() {
        // Prevent multiple initializations
        if (settingsInitialized) return;
        settingsInitialized = true;

        const settingsButton = document.getElementById('settings-button');
        const settingsPanel = document.getElementById('settings-panel');
        const closeSettingsBtn = document.getElementById('close-settings');
        const themeOptions = document.querySelectorAll('.theme-option');

        if (!settingsButton || !settingsPanel || !closeSettingsBtn) {
            console.warn('Settings elements not found');
            return;
        }

        // Function to open settings panel
        function openSettings(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Force panel to be visible
            settingsPanel.style.display = 'block';
            // Trigger reflow
            settingsPanel.offsetHeight;
            // Add show class
            settingsPanel.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        // Function to close settings panel
        function closeSettings(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            settingsPanel.classList.remove('show');
            document.body.style.overflow = '';
        }

        // Function to set theme
        function setTheme(theme) {
            if (!theme) return;
            
            // Remove active class from all theme options
            themeOptions.forEach(option => option.classList.remove('active'));
            
            // Add active class to selected theme option
            const selectedOption = document.querySelector(`.theme-option[data-theme="${theme}"]`);
            if (selectedOption) {
                selectedOption.classList.add('active');
            }
            // Remove all theme classes
            document.body.classList.remove('dark-mode', 'office-mode', 'aroma-mode');
            // Handle theme setting
            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.toggle('dark-mode', prefersDark);
            } else if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else if (theme === 'office') {
                document.body.classList.add('office-mode');
            }
            // Save theme preference
            localStorage.setItem('theme', theme);
        }

        // Remove any existing event listeners
        const newSettingsButton = settingsButton.cloneNode(true);
        settingsButton.parentNode.replaceChild(newSettingsButton, settingsButton);
        
        const newCloseSettingsBtn = closeSettingsBtn.cloneNode(true);
        closeSettingsBtn.parentNode.replaceChild(newCloseSettingsBtn, closeSettingsBtn);

        // Add event listeners
        newSettingsButton.addEventListener('click', openSettings, { capture: true });
        newCloseSettingsBtn.addEventListener('click', closeSettings, { capture: true });

        // Close settings panel when clicking outside
        document.addEventListener('click', (e) => {
            if (settingsPanel.classList.contains('show') && 
                !settingsPanel.contains(e.target) && 
                e.target !== newSettingsButton) {
                closeSettings();
            }
        }, { capture: true });

        // Theme option click handlers
        themeOptions.forEach(option => {
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
            newOption.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const theme = newOption.dataset.theme;
                if (theme) setTheme(theme);
            }, { capture: true });
        });

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
        
        // Listen for system theme changes if system theme is selected
        if (savedTheme === 'system') {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                document.body.classList.toggle('dark-mode', e.matches);
            });
        }

        // Force initial state
        if (settingsPanel.classList.contains('show')) {
            settingsPanel.style.display = 'block';
        }
    }

    // Initialize settings when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSettings);
    } else {
        initializeSettings();
    }

    // Backup initialization
    window.addEventListener('load', initializeSettings);

    if (aboutMeBtn && aboutMeModal && closeAboutMeModal) {
        aboutMeBtn.addEventListener('click', function() {
            aboutMeModal.classList.add('show');
            // Draw progress graphs when modal opens
            setTimeout(drawProgressGraphs, 100);
        });
        closeAboutMeModal.addEventListener('click', function() {
            aboutMeModal.classList.remove('show');
        });
        window.addEventListener('click', function(event) {
            if (event.target === aboutMeModal) {
                aboutMeModal.classList.remove('show');
            }
        });
    }

    function drawProgressGraphs() {
        // Avoid duplicate charts
        if (window.cgpaChartInstance) window.cgpaChartInstance.destroy();
        if (window.attendanceChartInstance) window.attendanceChartInstance.destroy();
        const cgpa = 8.75;
        const attendance = 92;
        const cgpaCtx = document.getElementById('cgpaChart').getContext('2d');
        const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
        window.cgpaChartInstance = new Chart(cgpaCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [cgpa, 10-cgpa],
                    backgroundColor: ['#6a11cb', '#f3eaff'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    tooltip: {enabled: false},
                    legend: {display: false},
                    title: {display: true, text: cgpa + ' / 10', color: '#6a11cb', font: {size: 18, weight: 'bold'}}
                }
            }
        });
        window.attendanceChartInstance = new Chart(attendanceCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [attendance, 100-attendance],
                    backgroundColor: ['#f8b500', '#f3eaff'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    tooltip: {enabled: false},
                    legend: {display: false},
                    title: {display: true, text: attendance + '%', color: '#f8b500', font: {size: 18, weight: 'bold'}}
                }
            }
        });
    }

    // Edit Profile Modal open/close logic
    if (editProfileBtn && editProfileModal && closeEditProfileModal) {
        console.log('Edit Profile elements found:', { editProfileBtn, editProfileModal, closeEditProfileModal });
        
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Edit Profile button clicked');
            editProfileModal.classList.add('show');
            if (typeof populateEditProfileForm === 'function') {
                populateEditProfileForm();
            }
            if (typeof showImagePreviews === 'function') {
                showImagePreviews();
            }
        });

        closeEditProfileModal.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Close Edit Profile button clicked');
            editProfileModal.classList.remove('show');
        });

        window.addEventListener('click', function(event) {
            if (event.target === editProfileModal) {
                console.log('Clicked outside modal');
                editProfileModal.classList.remove('show');
            }
        });
    } else {
        console.error('Edit Profile elements not found:', { 
            editProfileBtn: !!editProfileBtn, 
            editProfileModal: !!editProfileModal, 
            closeEditProfileModal: !!closeEditProfileModal 
        });
    }

    // Show image previews in modal
    function showImagePreviews() {
        const avatarPreview = document.getElementById('avatarPreview');
        const coverPhotoPreview = document.getElementById('coverPhotoPreview');
        const avatarData = localStorage.getItem('profilePic');
        const coverData = localStorage.getItem('coverPhoto');
        if (avatarPreview) avatarPreview.src = avatarData || '';
        if (coverPhotoPreview) coverPhotoPreview.src = coverData || '';
    }

    // Update dashboard/profile card after save/delete
    function updateProfileCard() {
        if (!loggedInStudent) return;
        populateStudentProfile(loggedInStudent);
        showImagePreviews();
    }

    // After saving profile
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                status: document.getElementById('statusInput').value,
                bloodGroup: document.getElementById('bloodGroupInput').value,
                motherTongue: document.getElementById('motherTongueInput').value,
                aadhaar: document.getElementById('aadhaarInput').value,
                category: document.getElementById('categoryInput').value,
                caste: document.getElementById('casteInput').value,
                country: document.getElementById('countryInput').value,
                state: document.getElementById('stateInput').value,
                city: document.getElementById('cityInput').value,
                address: document.getElementById('addressInput').value,
                pincode: document.getElementById('pincodeInput').value,
                father: {
                    name: document.getElementById('fatherNameInput').value,
                    occupation: document.getElementById('fatherOccupationInput').value,
                    contact: document.getElementById('fatherContactInput').value
                },
                mother: {
                    name: document.getElementById('motherNameInput').value,
                    occupation: document.getElementById('motherOccupationInput').value,
                    contact: document.getElementById('motherContactInput').value
                },
                ssc: {
                    board: document.getElementById('sscBoardInput').value,
                    school: document.getElementById('sscSchoolInput').value,
                    year: document.getElementById('sscYearInput').value,
                    marks: document.getElementById('sscMarksInput').value,
                    percentage: document.getElementById('sscPercentageInput').value
                },
                hsc: {
                    board: document.getElementById('hscBoardInput').value,
                    school: document.getElementById('hscSchoolInput').value,
                    year: document.getElementById('hscYearInput').value,
                    marks: document.getElementById('hscMarksInput').value,
                    percentage: document.getElementById('hscPercentageInput').value
                }
            };
            localStorage.setItem('extraProfileData', JSON.stringify(formData));
            editProfileModal.classList.remove('show');
            alert('Profile updated!');
            updateProfileCard();
        });
    }
    // After deleting profile
    if (editProfileForm) {
        const deleteBtn = editProfileForm.querySelector('button[style*="background: #f44336"]');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to delete your profile details?')) {
                    localStorage.removeItem('extraProfileData');
                    localStorage.removeItem('profilePic');
                    localStorage.removeItem('coverPhoto');
                    editProfileModal.classList.remove('show');
                    alert('Profile deleted!');
                    updateProfileCard();
                }
            });
        }
    }
    // Show previews when modal opens and after image upload
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', showImagePreviews);
    }
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    localStorage.setItem('profilePic', evt.target.result);
                    showImagePreviews();
                };
                reader.readAsDataURL(file);
            }
        });
    }
    if (coverPhotoInput) {
        coverPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    localStorage.setItem('coverPhoto', evt.target.result);
                    showImagePreviews();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Populate form with saved data
    function populateEditProfileForm() {
        const data = JSON.parse(localStorage.getItem('extraProfileData') || '{}');
        document.getElementById('statusInput').value = data.status || '';
        document.getElementById('bloodGroupInput').value = data.bloodGroup || '';
        document.getElementById('motherTongueInput').value = data.motherTongue || '';
        document.getElementById('aadhaarInput').value = data.aadhaar || '';
        document.getElementById('categoryInput').value = data.category || '';
        document.getElementById('casteInput').value = data.caste || '';
        document.getElementById('countryInput').value = data.country || '';
        document.getElementById('stateInput').value = data.state || '';
        document.getElementById('cityInput').value = data.city || '';
        document.getElementById('addressInput').value = data.address || '';
        document.getElementById('pincodeInput').value = data.pincode || '';
        document.getElementById('fatherNameInput').value = (data.father && data.father.name) || '';
        document.getElementById('fatherOccupationInput').value = (data.father && data.father.occupation) || '';
        document.getElementById('fatherContactInput').value = (data.father && data.father.contact) || '';
        document.getElementById('motherNameInput').value = (data.mother && data.mother.name) || '';
        document.getElementById('motherOccupationInput').value = (data.mother && data.mother.occupation) || '';
        document.getElementById('motherContactInput').value = (data.mother && data.mother.contact) || '';
        document.getElementById('sscBoardInput').value = (data.ssc && data.ssc.board) || '';
        document.getElementById('sscSchoolInput').value = (data.ssc && data.ssc.school) || '';
        document.getElementById('sscYearInput').value = (data.ssc && data.ssc.year) || '';
        document.getElementById('sscMarksInput').value = (data.ssc && data.ssc.marks) || '';
        document.getElementById('sscPercentageInput').value = (data.ssc && data.ssc.percentage) || '';
        document.getElementById('hscBoardInput').value = (data.hsc && data.hsc.board) || '';
        document.getElementById('hscSchoolInput').value = (data.hsc && data.hsc.school) || '';
        document.getElementById('hscYearInput').value = (data.hsc && data.hsc.year) || '';
        document.getElementById('hscMarksInput').value = (data.hsc && data.hsc.marks) || '';
        document.getElementById('hscPercentageInput').value = (data.hsc && data.hsc.percentage) || '';
    }
});

// OpenRouter API configuration
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// DOM Elements
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-chat-btn');

// Chat history
let chatHistory = [];

// Function to add a message to the chat window
function addMessageToChat(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'aura-message'}`;
    
    const icon = document.createElement('i');
    icon.className = isUser ? 'fas fa-user' : 'fas fa-sparkles';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(icon);
    messageDiv.appendChild(messageContent);
    chatWindow.appendChild(messageDiv);
    
    // Scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to send message to OpenRouter API
async function sendMessageToAI(message) {
    // Get user profile from localStorage
    let studentProfile = null;
    try {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (studentDataString) {
            studentProfile = JSON.parse(studentDataString);
        }
    } catch (e) { studentProfile = null; }

    // Build system prompt with user context
    let systemPrompt = '';
    if (studentProfile) {
        systemPrompt = `You are Aura, an AI assistant for college students. The current user profile is as follows:\n` +
            `Name: ${studentProfile.fullName || ''}\n` +
            `Branch: ${studentProfile.branch || ''}\n` +
            `CGPA: ${studentProfile.cgpa !== undefined ? studentProfile.cgpa : ''}\n` +
            `Attendance: ${studentProfile.attendance !== undefined ? studentProfile.attendance : ''}\n` +
            `Backlogs: ${studentProfile.backlogs !== undefined ? studentProfile.backlogs : ''}\n` +
            `Key Skills: ${(studentProfile.keySkills && studentProfile.keySkills.join(', ')) || ''}\n` +
            `Suggested Companies: ${(studentProfile.suggestedCompanies && studentProfile.suggestedCompanies.join(', ')) || ''}`;
    } else {
        systemPrompt = 'You are Aura, an AI assistant for college students.';
    }

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Referer': window.location.origin,
                'X-Title': 'Aura AI'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...chatHistory,
                    { role: 'user', content: message }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        if (!data.choices || !Array.isArray(data.choices) || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            let errorMsg = 'Sorry, I encountered an error with the AI response. Please try again later.';
            if (data.error && data.error.message) {
                errorMsg = `API Error: ${data.error.message}`;
            } else if (data.error) {
                errorMsg = `API Error: ${JSON.stringify(data.error)}`;
            }
            console.error('Unexpected API response:', data);
            addMessageToChat(errorMsg, false);
            return;
        }
        const aiResponse = data.choices[0].message.content;
        
        // Update chat history
        chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse }
        );

        // Add AI response to chat
        addMessageToChat(aiResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat('Sorry, I encountered an error. Please try again.', false);
    }
}

// Event Listeners
sendButton.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message to chat
        addMessageToChat(message, true);
        
        // Clear input
        chatInput.value = '';
        
        // Send to AI
        await sendMessageToAI(message);
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Juno Data API Module
function initializeJunoDataFetcher() {
    const fetchJunoDataBtn = document.getElementById('fetch-juno-data-btn');
    const fetchJunoDataSettingsBtn = document.getElementById('fetchJunoDataBtn');
    const junoDataContainer = document.getElementById('juno-data-container');
    const junoDataModal = document.getElementById('juno-data-modal');
    
    if (!junoDataContainer || !junoDataModal) {
        console.warn('Juno Data elements not found in the DOM');
        return;
    }
    
    // Add event listeners to both buttons
    if (fetchJunoDataBtn) {
        fetchJunoDataBtn.addEventListener('click', fetchJunoData);
    }
    
    if (fetchJunoDataSettingsBtn) {
        fetchJunoDataSettingsBtn.addEventListener('click', fetchJunoData);
    }
    
    // Close modal when clicking outside the content
    junoDataModal.addEventListener('click', function(e) {
        if (e.target === junoDataModal) {
            closeJunoModal();
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && junoDataModal.classList.contains('show-modal')) {
            closeJunoModal();
        }
    });
    
    function closeJunoModal() {
        junoDataModal.classList.remove('show-modal');
        setTimeout(() => {
            junoDataModal.style.display = 'none';
        }, 300); // Match transition duration
    }
    
    function fetchJunoData() {
        // Show modal and loading spinner
        junoDataModal.style.display = 'block';
        // Force reflow to ensure animation works
        void junoDataModal.offsetWidth;
        junoDataModal.classList.add('show-modal');
        
        junoDataContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
                <span>Fetching your data...</span>
            </div>
        `;
        
        // Get student ID or session token from localStorage
        let studentId = null;
        try {
            const studentDataString = localStorage.getItem('loggedInStudentData');
            if (studentDataString) {
                const studentData = JSON.parse(studentDataString);
                studentId = studentData.id || studentData.studentId;
            }
        } catch (error) {
            console.error('Error retrieving student ID:', error);
        }
        
        if (!studentId) {
            showJunoDataError('Unable to identify student. Please log in again.');
            return;
        }
        
        // API endpoint configuration - can be easily updated
        const JUNO_API = {
            baseUrl: 'https://juno.example.com/api',
            endpoints: {
                studentData: '/student-data'
            }
        };
        
        // Make the API call
        fetch(`${JUNO_API.baseUrl}${JUNO_API.endpoints.studentData}?studentId=${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayJunoData(data);
        })
        .catch(error => {
            console.error('Error fetching Juno data:', error);
            
            // For demo purposes, show mock data if API fails
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Using mock data for local development');
                displayJunoData(getMockJunoData(studentId));
            } else {
                showJunoDataError('Unable to fetch data. Please try again.');
            }
        });
    }
    
    function displayJunoData(data) {
        if (!data || Object.keys(data).length === 0) {
            showJunoDataError('No data available at this time.');
            return;
        }
        
        // Create HTML for the data card with tabs like the provided image
        const html = `
            <div class="juno-data-card">
                <button class="close-juno-data-btn" aria-label="Close"><i class="fas fa-times"></i></button>
                
                <div class="juno-student-header">
                    <div class="student-photo-container">
                        <img src="https://ui-avatars.com/api/?name=Aaryan+Santosh&background=0D8ABC&color=fff&size=100" alt="${data.name || 'Student'} Photo" class="student-photo" onerror="this.src='https://via.placeholder.com/100/CCCCCC/333333?text=Aaryan'">
                    </div>
                    <div class="student-info">
                        <h2>${data.name || 'Student'} ${data.lastName || 'SANTOSH GAJGESHWAR'}</h2>
                        <p>Roll No.: ${data.rollNumber || 'N/A'}</p>
                        <p>First Year Semester II</p>
                        <p>${data.branch || 'B.Tech - Computer Science & Engineering'}</p>
                        <p>A</p>
                    </div>
                </div>
                
                <div class="juno-tabs-container">
                    <div class="juno-sidebar">
                        <div class="juno-tab active" data-tab="dashboard">
                            <i class="fas fa-tachometer-alt"></i> DASHBOARD
                        </div>
                        <div class="juno-tab" data-tab="profile">
                            <i class="fas fa-user"></i> PROFILE
                        </div>
                        <div class="juno-tab" data-tab="syllabus">
                            <i class="fas fa-book"></i> SYLLABUS
                        </div>
                        <div class="juno-tab" data-tab="calendar">
                            <i class="fas fa-calendar-alt"></i> CALENDAR
                        </div>
                        <div class="juno-tab" data-tab="timetable">
                            <i class="fas fa-clock"></i> TIME TABLE
                        </div>
                        <div class="juno-tab" data-tab="library">
                            <i class="fas fa-chart-bar"></i> LIBRARY(1 issued)
                        </div>
                        <div class="juno-tab" data-tab="fees">
                            <i class="fas fa-rupee-sign"></i> FEES DETAILS
                        </div>
                        <div class="juno-tab" data-tab="leave">
                            <i class="fas fa-file-alt"></i> LEAVE DETAILS
                        </div>
                        <div class="juno-tab" data-tab="hostel">
                            <i class="fas fa-home"></i> HOSTEL
                        </div>
                        <div class="juno-tab" data-tab="mentor">
                            <i class="fas fa-user-tie"></i> CONTACT MENTOR
                        </div>
                        <div class="juno-tab" data-tab="blogs">
                            <i class="fas fa-comment"></i> BLOGS
                        </div>
                    </div>
                    
                    <div class="juno-tab-content">
                        <!-- Dashboard Tab (Active by Default) -->
                        <div class="tab-pane active" id="dashboard-tab">
                            <h3>Dashboard Overview</h3>
                            <div class="dashboard-stats">
                                <div class="stat-card">
                                    <h4>Attendance</h4>
                                    <div class="progress-bar-container">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${data.attendance || 0}%"></div>
                                        </div>
                                        <span>${data.attendance || 0}%</span>
                                    </div>
                                    <p class="attendance-status">
                                        ${getAttendanceStatus(data.attendance)}
                                    </p>
                                </div>
                                
                                <div class="stat-card">
                                    <h4>Upcoming Classes</h4>
                                    ${renderTimetable(data.timetable)}
                                </div>
                                
                                <div class="stat-card">
                                    <h4>Fees Status</h4>
                                    <p><strong>Total:</strong> ₹${data.fees?.total || 'N/A'}</p>
                                    <p><strong>Paid:</strong> ₹${data.fees?.paid || 'N/A'}</p>
                                    <p><strong>Due:</strong> ₹${data.fees?.due || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Profile Tab -->
                        <div class="tab-pane" id="profile-tab">
                            <h3>Student Profile</h3>
                            <div class="profile-container">
                                <div class="profile-header">
                                    <div class="profile-avatar">
                                        <img src="https://ui-avatars.com/api/?name=Aaryan+Santosh&background=0D8ABC&color=fff&size=100" alt="${data.name || 'Student'} Photo" onerror="this.src='https://via.placeholder.com/100/CCCCCC/333333?text=Aaryan'">
                                    </div>
                                    <div class="profile-name-container">
                                        <h2>${data.name || 'N/A'} ${data.lastName || 'SANTOSH GAJGESHWAR'}</h2>
                                        <p class="profile-role">Computer Science Engineering Student</p>
                                    </div>
                                </div>
                                
                                <div class="profile-cards-container">
                                    <!-- Personal Information Card -->
                                    <div class="profile-card">
                                        <div class="card-header">
                                            <i class="fas fa-user-circle"></i>
                                            <h4>Personal Information</h4>
                                        </div>
                                        <div class="card-content">
                                            <div class="profile-detail-item">
                                                <i class="fas fa-id-card"></i>
                                                <div>
                                                    <span class="detail-label">Full Name</span>
                                                    <span class="detail-value">${data.name || 'N/A'} ${data.lastName || 'SANTOSH GAJGESHWAR'}</span>
                                                </div>
                                            </div>
                                            <div class="profile-detail-item">
                                                <i class="fas fa-home"></i>
                                                <div>
                                                    <span class="detail-label">Address</span>
                                                    <span class="detail-value">${data.address || 'Mumbai, Maharashtra'}</span>
                                                </div>
                                            </div>
                                            <div class="profile-detail-item">
                                                <i class="fas fa-birthday-cake"></i>
                                                <div>
                                                    <span class="detail-label">Date of Birth</span>
                                                    <span class="detail-value">${data.dob || '15 Aug 2004'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Academic Information Card -->
                                    <div class="profile-card">
                                        <div class="card-header">
                                            <i class="fas fa-graduation-cap"></i>
                                            <h4>Academic Information</h4>
                                        </div>
                                        <div class="card-content">
                                            <div class="profile-detail-item">
                                                <i class="fas fa-id-badge"></i>
                                                <div>
                                                    <span class="detail-label">Roll Number</span>
                                                    <span class="detail-value">${data.rollNumber || 'EN24263171'}</span>
                                                </div>
                                            </div>
                                            <div class="profile-detail-item">
                                                <i class="fas fa-code-branch"></i>
                                                <div>
                                                    <span class="detail-label">Branch</span>
                                                    <span class="detail-value">${data.branch || 'B.Tech - Computer Science & Engineering'}</span>
                                                </div>
                                            </div>
                                            <div class="profile-detail-item">
                                                <i class="fas fa-calendar-alt"></i>
                                                <div>
                                                    <span class="detail-label">Semester</span>
                                                    <span class="detail-value">${data.semester || 'First Year Semester II'}</span>
                                                </div>
                                            </div>
                                            <div class="profile-detail-item">
                                                <i class="fas fa-chart-line"></i>
                                                <div>
                                                    <span class="detail-label">CGPA</span>
                                                    <span class="detail-value">${data.cgpa || '8.75'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Contact Information Card -->
                                    <div class="profile-card">
                                        <div class="card-header">
                                            <i class="fas fa-address-book"></i>
                                            <h4>Contact Information</h4>
                                        </div>
                                        <div class="card-content">
                                            <div class="profile-detail-item">
                                                <i class="fas fa-envelope"></i>
                                                <div>
                                                    <span class="detail-label">Email</span>
                                                    <span class="detail-value">${data.email || 'aaryan.santosh@example.com'}</span>
                                                </div>
                                            </div>
                                            <div class="profile-detail-item">
                                                <i class="fas fa-phone-alt"></i>
                                                <div>
                                                    <span class="detail-label">Phone</span>
                                                    <span class="detail-value">${data.phone || '+91 9876543210'}</span>
                                                </div>
                                            </div>
                                            <div class="profile-detail-item">
                                                <i class="fab fa-linkedin"></i>
                                                <div>
                                                    <span class="detail-label">LinkedIn</span>
                                                    <span class="detail-value">${data.linkedin || 'linkedin.com/in/aaryan-santosh'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="profile-actions">
                                    <button class="action-button download-btn"><i class="fas fa-download"></i> Download Profile</button>
                                    <button class="action-button share-btn"><i class="fas fa-share-alt"></i> Share Profile</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Syllabus Tab -->
                        <div class="tab-pane" id="syllabus-tab">
                            <h3>Course Syllabus</h3>
                            ${renderSyllabusProgress(data.syllabusProgress)}
                        </div>
                        
                        <!-- Calendar Tab -->
                        <div class="tab-pane" id="calendar-tab">
                            <h3>Academic Calendar</h3>
                            <div class="academic-calendar">
                                <div class="calendar-header">
                                    <h4>D. Y. PATIL COLLEGE OF ENGINEERING & TECHNOLOGY</h4>
                                    <p>Kasaba Bawada, Kolhapur</p>
                                    <p>(An Autonomous Institute)</p>
                                    <p>ACADEMIC CALENDAR EVEN SEMESTER: A.Y. 2024-25</p>
                                    <p>(F.Y. B. Tech./F.Y.B. Arch)</p>
                                </div>
                                
                                <div class="calendar-month">
                                    <h5>February 2025</h5>
                                    <div class="calendar-events">
                                        <div class="calendar-event">
                                            <div class="event-date">16<sup>th</sup> - 18<sup>th</sup> February</div>
                                            <div class="event-desc">Annual Social Gathering</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">17<sup>th</sup> - 21<sup>st</sup> February</div>
                                            <div class="event-desc">Display of Course Delivery Plan and Notices etc.</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">24<sup>th</sup> February</div>
                                            <div class="event-desc">Commencement of Instructional Activities for Even Semester</div>
                                        </div>
                                    </div>
                                    <div class="calendar-holidays">
                                        <p><span class="holiday-tag">Holidays:</span> Chhatrapati Shivaji Maharaj Jayanti: 19<sup>th</sup> February, Maha Shivaratri: 26<sup>th</sup> February</p>
                                    </div>
                                    <div class="calendar-working-days">
                                        <p>Working Days: 05</p>
                                    </div>
                                </div>
                                
                                <div class="calendar-month">
                                    <h5>March 2025</h5>
                                    <div class="calendar-events">
                                        <div class="calendar-event">
                                            <div class="event-date">7<sup>th</sup> March</div>
                                            <div class="event-desc">Test /Quiz on pre-requisites</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">12<sup>th</sup>-13<sup>th</sup> March</div>
                                            <div class="event-desc">Course feedback (Department level)</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">28<sup>th</sup> March</div>
                                            <div class="event-desc">Display of Students Defaulter List</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">27<sup>th</sup> - 28<sup>th</sup> March</div>
                                            <div class="event-desc">Course Monitoring meeting (CMC)</div>
                                        </div>
                                    </div>
                                    <div class="calendar-holidays">
                                        <p><span class="holiday-tag">Holidays:</span> Holi: 14<sup>th</sup> March, Gudi padwa: 30<sup>th</sup> March, Ramzan Eid: 31<sup>st</sup> March</p>
                                    </div>
                                    <div class="calendar-working-days">
                                        <p>Working Days: 22</p>
                                    </div>
                                </div>
                                
                                <div class="calendar-month">
                                    <h5>April 2025</h5>
                                    <div class="calendar-events">
                                        <div class="calendar-event">
                                            <div class="event-date">1<sup>st</sup> - 5<sup>th</sup> April</div>
                                            <div class="event-desc">Conduct of In Semester Evaluation (ISE-I)</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">15<sup>th</sup>-20<sup>th</sup> April</div>
                                            <div class="event-desc">Mid Term Course Feedback (Central Level)</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">30<sup>th</sup> April - 3<sup>rd</sup> May</div>
                                            <div class="event-desc">Mid Semester Examination</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">27<sup>th</sup> April</div>
                                            <div class="event-desc">Students mentoring and CMC meeting</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">30<sup>th</sup> April</div>
                                            <div class="event-desc">Display of Students Defaulter List</div>
                                        </div>
                                    </div>
                                    <div class="calendar-holidays">
                                        <p><span class="holiday-tag">Holidays:</span> Ram Navami: 6<sup>th</sup> April, Mahaveer Jayanti: 10<sup>th</sup> April, Dr. Babasaheb Ambedkar Jayanti: 14<sup>th</sup> April, Good Friday: 18<sup>th</sup> April</p>
                                    </div>
                                    <div class="calendar-working-days">
                                        <p>Working Days: 21</p>
                                    </div>
                                </div>
                                
                                <div class="calendar-month">
                                    <h5>May 2025</h5>
                                    <div class="calendar-events">
                                        <div class="calendar-event">
                                            <div class="event-date">8<sup>th</sup>-9<sup>th</sup> May</div>
                                            <div class="event-desc">Showing of evaluated MSE answer scripts</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">16<sup>th</sup> May</div>
                                            <div class="event-desc">Display of student's competency</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">17<sup>th</sup> May</div>
                                            <div class="event-desc">Parents Meet</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">30<sup>th</sup> May</div>
                                            <div class="event-desc">Display of Students Defaulter List</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">30<sup>th</sup>-31<sup>st</sup> May</div>
                                            <div class="event-desc">CMC meeting</div>
                                        </div>
                                    </div>
                                    <div class="calendar-holidays">
                                        <p><span class="holiday-tag">Holidays:</span> Maharashtra Day: 1<sup>st</sup> May, Buddha Purnima: 12<sup>th</sup> May</p>
                                    </div>
                                    <div class="calendar-working-days">
                                        <p>Working Days: 23</p>
                                    </div>
                                </div>
                                
                                <div class="calendar-month">
                                    <h5>June 2025</h5>
                                    <div class="calendar-events">
                                        <div class="calendar-event">
                                            <div class="event-date">2<sup>nd</sup> - 7<sup>th</sup> June</div>
                                            <div class="event-desc">Conduct of In Semester Evaluation (ISE-II)</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">13<sup>th</sup> June</div>
                                            <div class="event-desc">Display Students final detention List</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">14<sup>th</sup> June</div>
                                            <div class="event-desc">End of Instructional Activities</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">14<sup>th</sup> June</div>
                                            <div class="event-desc">Finalization of ISE/MSE/Project marks on JUNO</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">16<sup>th</sup> June</div>
                                            <div class="event-desc">Capstone Project, LLC exhibition</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">21<sup>st</sup> - 30<sup>th</sup> June</div>
                                            <div class="event-desc">End Semester Examination</div>
                                        </div>
                                        <div class="calendar-event">
                                            <div class="event-date">8<sup>th</sup> July</div>
                                            <div class="event-desc">Result Declaration</div>
                                        </div>
                                    </div>
                                    <div class="calendar-holidays">
                                        <p><span class="holiday-tag">Holidays:</span> Bakri Eid: 7<sup>th</sup> June</p>
                                    </div>
                                    <div class="calendar-working-days">
                                        <p>Working Days: 10</p>
                                    </div>
                                </div>
                                
                                <div class="calendar-footer">
                                    <div class="calendar-info">
                                        <p><strong>Instructional Days:</strong> 80</p>
                                        <p><strong>OBE Revision & Dept. Meeting:</strong> 3<sup>rd</sup> Saturday of Every Month</p>
                                        <p><strong>HoD & Deans Meeting:</strong> Every Tuesday, Friday of Week</p>
                                        <p><strong>Students Mentoring & Counselling:</strong> Last Week of Every Month</p>
                                        <p><strong>Commencement of Next Semester:</strong> 8<sup>th</sup> July, 2025-26</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Other tabs would be implemented similarly -->
                        <div class="tab-pane" id="timetable-tab"><h3>Complete Timetable</h3><p>Coming soon</p></div>
                        <div class="tab-pane" id="library-tab"><h3>Library</h3><p>Coming soon</p></div>
                        <div class="tab-pane" id="fees-tab">
                            <h3>Fees Details</h3>
                            <p><strong>Total Fees:</strong> ₹${data.fees?.total || 'N/A'}</p>
                            <p><strong>Paid:</strong> ₹${data.fees?.paid || 'N/A'}</p>
                            <p><strong>Due:</strong> ₹${data.fees?.due || 'N/A'}</p>
                            <p><strong>Due Date:</strong> ${data.fees?.dueDate || 'N/A'}</p>
                        </div>
                        <div class="tab-pane" id="leave-tab"><h3>Leave Applications</h3><p>No leave applications</p></div>
                        <div class="tab-pane" id="hostel-tab"><h3>Hostel Information</h3><p>Not currently enrolled in hostel</p></div>
                        <div class="tab-pane" id="mentor-tab"><h3>Mentor Details</h3><p>Prof. Rajesh Kumar<br>rajesh.kumar@example.edu<br>+91 9876543211</p></div>
                        <div class="tab-pane" id="blogs-tab"><h3>Student Blogs</h3><p>No blog posts available</p></div>
                    </div>
                </div>
                
                <div class="juno-data-footer">
                    <p>Last Updated: ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;
        
        junoDataContainer.innerHTML = html;
        
        // Add event listener to close button
        const closeBtn = junoDataContainer.querySelector('.close-juno-data-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeJunoModal);
        }
        
        // Add event listeners for profile action buttons
        const downloadBtn = junoDataContainer.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                // Show notification for download action
                showNotification("Profile download initiated", "success");
                
                // Generate PDF-like format or export data
                setTimeout(() => {
                    showNotification("Profile downloaded successfully", "success");
                }, 1500);
            });
        }
        
        const shareBtn = junoDataContainer.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                // Create a popup for sharing options
                const sharePopup = document.createElement('div');
                sharePopup.className = 'share-popup';
                sharePopup.innerHTML = `
                    <div class="share-popup-content">
                        <h4>Share Profile</h4>
                        <div class="share-options">
                            <button class="share-option" data-platform="email"><i class="fas fa-envelope"></i> Email</button>
                            <button class="share-option" data-platform="whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                            <button class="share-option" data-platform="linkedin"><i class="fab fa-linkedin"></i> LinkedIn</button>
                        </div>
                        <button class="close-share-popup"><i class="fas fa-times"></i></button>
                    </div>
                `;
                
                document.body.appendChild(sharePopup);
                
                // Add animation class after a small delay
                setTimeout(() => {
                    sharePopup.classList.add('show');
                }, 10);
                
                // Close button event
                const closeShareBtn = sharePopup.querySelector('.close-share-popup');
                if (closeShareBtn) {
                    closeShareBtn.addEventListener('click', () => {
                        sharePopup.classList.remove('show');
                        setTimeout(() => {
                            sharePopup.remove();
                        }, 300);
                    });
                }
                
                // Share option buttons
                const shareOptions = sharePopup.querySelectorAll('.share-option');
                shareOptions.forEach(option => {
                    option.addEventListener('click', () => {
                        const platform = option.getAttribute('data-platform');
                        showNotification(`Sharing via ${platform}`, "info");
                        
                        // Close the popup
                        sharePopup.classList.remove('show');
                        setTimeout(() => {
                            sharePopup.remove();
                        }, 300);
                    });
                });
                
                // Close when clicking outside
                sharePopup.addEventListener('click', (e) => {
                    if (e.target === sharePopup) {
                        sharePopup.classList.remove('show');
                        setTimeout(() => {
                            sharePopup.remove();
                        }, 300);
                    }
                });
            });
        }
        
        // Add some animation
        const dataCard = junoDataContainer.querySelector('.juno-data-card');
        if (dataCard) {
            dataCard.classList.add('animate-in');
        }
        
        // Add tab functionality
        const tabs = junoDataContainer.querySelectorAll('.juno-tab');
        const tabPanes = junoDataContainer.querySelectorAll('.tab-pane');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding tab content
                const tabName = tab.getAttribute('data-tab');
                const tabContent = junoDataContainer.querySelector(`#${tabName}-tab`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }
    
    function showJunoDataError(message) {
        junoDataContainer.innerHTML = `
            <div class="juno-data-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="close-juno-data-btn">Close</button>
            </div>
        `;
        
        const closeBtn = junoDataContainer.querySelector('.close-juno-data-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeJunoModal);
        }
    }
    
    function getAttendanceStatus(attendance) {
        if (!attendance) return '<span class="status-unknown">No data available</span>';
        
        if (attendance >= 85) {
            return '<span class="status-good">Good Standing</span>';
        } else if (attendance >= 75) {
            return '<span class="status-warning">Warning: Attendance below 85%</span>';
        } else {
            return '<span class="status-danger">Critical: Attendance below 75%</span>';
        }
    }
    
    function renderTimetable(timetable) {
        if (!timetable || timetable.length === 0) {
            return '<p>No classes scheduled for today.</p>';
        }
        
        return `
            <table class="juno-timetable">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Subject</th>
                        <th>Room</th>
                    </tr>
                </thead>
                <tbody>
                    ${timetable.map(item => `
                        <tr>
                            <td>${item.time || 'N/A'}</td>
                            <td>${item.subject || 'N/A'}</td>
                            <td>${item.room || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    function renderSyllabusProgress(syllabusProgress) {
        if (!syllabusProgress || syllabusProgress.length === 0) {
            return '<p>No syllabus data available.</p>';
        }
        
        return `
            <div class="syllabus-progress-container">
                ${syllabusProgress.map(item => `
                    <div class="syllabus-item">
                        <div class="syllabus-header">
                            <span>${item.subject || 'Subject'}</span>
                            <span>${item.completed || 0}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${item.completed || 0}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    function getMockJunoData(studentId) {
        // Mock data for testing purposes
        return {
            name: "Aaryan",
            rollNumber: "EN24263171",
            branch: "Computer Science Engineering",
            semester: "2nd",
            attendance: 74,
            timetable: [
                { time: "09:00 - 10:00", subject: "Data Structures", room: "CS-201" },
                { time: "10:15 - 11:15", subject: "Database Systems", room: "CS-301" },
                { time: "11:30 - 12:30", subject: "Computer Networks", room: "CS-401" },
                { time: "14:00 - 15:00", subject: "Web Development Lab", room: "CS-Lab-2" }
            ],
            syllabusProgress: [
                { subject: "Data Structures", completed: 75 },
                { subject: "Database Systems", completed: 60 },
                { subject: "Computer Networks", completed: 45 },
                { subject: "Web Development", completed: 85 }
            ],
            fees: {
                total: 85000,
                paid: 45000,
                due: 40000,
                dueDate: "2025-06-30"
            }
        };
    }
}