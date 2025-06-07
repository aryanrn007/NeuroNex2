document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loggedInUserNameNT = document.getElementById('loggedInUserNameNT');
    const logoutButtonNT = document.getElementById('logout-buttonNT');
    const settingsButtonNT = document.getElementById('settings-buttonNT');
    const settingsPanelNT = document.getElementById('settings-panelNT');
    const closeSettingsNT = document.getElementById('close-settingsNT');
    const themeOptions = document.querySelectorAll('.theme-option');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const challengeProgressBar = document.getElementById('challenge-progress-bar');
    const challengeProgressText = document.getElementById('challenge-progress-text');
    const downloadGuideBtn = document.getElementById('download-guide-btn');

    // --- Basic Login Check & Header Setup ---
    function setupPageForUser() {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            window.location.href = 'login.html';
            return false;
        }

        // Parse user data
        const userData = JSON.parse(loggedInUser);
        
        // Display user name in header
        if (loggedInUserNameNT) {
            loggedInUserNameNT.textContent = userData.name;
        }
        
        // Logout functionality
        if (logoutButtonNT) {
            logoutButtonNT.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            });
        }
        
        return true;
    }

    // --- Theme Management ---
    function initializeSettings() {
        // Settings panel toggle
        if (settingsButtonNT && settingsPanelNT) {
            settingsButtonNT.addEventListener('click', () => {
                settingsPanelNT.classList.toggle('visible');
            });
        }
        
        // Close settings panel
        if (closeSettingsNT && settingsPanelNT) {
            closeSettingsNT.addEventListener('click', () => {
                settingsPanelNT.classList.remove('visible');
            });
        }
        
        // Click outside to close settings panel
        window.addEventListener('click', (e) => {
            if (settingsPanelNT && 
                settingsPanelNT.classList.contains('visible') && 
                !settingsPanelNT.contains(e.target) && 
                e.target !== settingsButtonNT) {
                settingsPanelNT.classList.remove('visible');
            }
        });
        
        // Theme selection
        if (themeOptions.length > 0) {
            // Get current theme
            const currentTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', currentTheme);
            
            // Highlight current theme option
            themeOptions.forEach(option => {
                if (option.getAttribute('data-theme') === currentTheme) {
                    option.classList.add('active');
                }
                
                // Add click event to change theme
                option.addEventListener('click', () => {
                    const selectedTheme = option.getAttribute('data-theme');
                    
                    // If system theme is selected
                    if (selectedTheme === 'system') {
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                    } else {
                        document.body.setAttribute('data-theme', selectedTheme);
                    }
                    
                    // Save theme preference
                    localStorage.setItem('theme', selectedTheme);
                    
                    // Update active class
                    themeOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                });
            });
        }
    }

    // --- Copy Template Functionality ---
    function setupCopyButtons() {
        if (copyButtons.length > 0) {
            copyButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const templateCard = button.closest('.template-card');
                    const templateText = templateCard.querySelector('.template-text').innerText;
                    
                    // Copy to clipboard
                    navigator.clipboard.writeText(templateText)
                        .then(() => {
                            // Change button text temporarily
                            const originalText = button.innerHTML;
                            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                            
                            // Revert button text after 2 seconds
                            setTimeout(() => {
                                button.innerHTML = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy: ', err);
                            alert('Failed to copy text. Please try again.');
                        });
                });
            });
        }
    }

    // --- Challenge Tracker Functionality ---
    function setupChallengeTracker() {
        // Load saved progress from localStorage
        const savedProgress = JSON.parse(localStorage.getItem('networkingChallengeProgress') || '{}');
        
        // Update checkboxes based on saved progress
        if (taskCheckboxes.length > 0) {
            taskCheckboxes.forEach(checkbox => {
                const taskId = checkbox.id;
                if (savedProgress[taskId]) {
                    checkbox.checked = true;
                }
                
                // Add change event listener
                checkbox.addEventListener('change', () => {
                    // Update saved progress
                    savedProgress[taskId] = checkbox.checked;
                    localStorage.setItem('networkingChallengeProgress', JSON.stringify(savedProgress));
                    
                    // Update progress bar
                    updateProgressBar();
                });
            });
            
            // Initial progress bar update
            updateProgressBar();
        }
    }
    
    // Update progress bar based on checked tasks
    function updateProgressBar() {
        if (challengeProgressBar && challengeProgressText && taskCheckboxes.length > 0) {
            const totalTasks = taskCheckboxes.length;
            const completedTasks = Array.from(taskCheckboxes).filter(checkbox => checkbox.checked).length;
            const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
            
            // Update progress bar width
            challengeProgressBar.style.width = `${progressPercentage}%`;
            
            // Update progress text
            challengeProgressText.textContent = `${progressPercentage}%`;
        }
    }

    // --- PDF Generation ---
    function setupPDFDownload() {
        if (downloadGuideBtn) {
            downloadGuideBtn.addEventListener('click', () => {
                // Using jsPDF to generate PDF
                import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
                    .then(() => {
                        // Create new PDF document
                        const { jsPDF } = window.jspdf;
                        const doc = new jsPDF();
                        
                        // Add content to PDF
                        doc.setFontSize(22);
                        doc.setTextColor(108, 47, 255);
                        doc.text('Networking Tips Guide', 105, 20, { align: 'center' });
                        
                        doc.setFontSize(16);
                        doc.setTextColor(0, 0, 0);
                        doc.text('A Complete Guide for Students', 105, 30, { align: 'center' });
                        
                        doc.setFontSize(12);
                        doc.setTextColor(80, 80, 80);
                        doc.text('Juno Companion', 105, 38, { align: 'center' });
                        
                        // Add sections
                        doc.setFontSize(14);
                        doc.setTextColor(0, 0, 0);
                        doc.text('What is Networking?', 20, 50);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('Networking is the process of building and maintaining professional relationships for', 20, 60);
                        doc.text('mutual benefit. It involves connecting with peers, seniors, alumni, industry professionals,', 20, 65);
                        doc.text('and potential employers to exchange information, advice, and support.', 20, 70);
                        
                        // Platform section
                        doc.setFontSize(14);
                        doc.setTextColor(0, 0, 0);
                        doc.text('Key Platforms for Networking', 20, 85);
                        
                        doc.setFontSize(12);
                        doc.setTextColor(108, 47, 255);
                        doc.text('LinkedIn', 20, 95);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('• Connect with classmates, professors, and alumni', 25, 102);
                        doc.text('• Join industry-specific groups and engage regularly', 25, 107);
                        doc.text('• Share relevant content and comment on others\' posts', 25, 112);
                        
                        doc.setFontSize(12);
                        doc.setTextColor(108, 47, 255);
                        doc.text('GitHub', 20, 122);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('• Contribute to open-source projects', 25, 129);
                        doc.text('• Create a detailed profile README', 25, 134);
                        doc.text('• Showcase your best projects with thorough documentation', 25, 139);
                        
                        // Message templates
                        doc.setFontSize(14);
                        doc.setTextColor(0, 0, 0);
                        doc.text('Message Templates', 20, 155);
                        
                        doc.setFontSize(12);
                        doc.setTextColor(108, 47, 255);
                        doc.text('Connecting with Alumni', 20, 165);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('Hi [Name],', 20, 172);
                        doc.text('I\'m [Your Name], a [Year] student at [Your College] studying [Your Major]. I came', 20, 177);
                        doc.text('across your profile and was impressed by your work at [Their Company/Field].', 20, 182);
                        doc.text('I\'m particularly interested in [specific aspect of their work/career path] and would', 20, 187);
                        doc.text('appreciate the opportunity to learn from your experience.', 20, 192);
                        doc.text('Thank you for considering,', 20, 197);
                        doc.text('[Your Name]', 20, 202);
                        
                        // Add new page
                        doc.addPage();
                        
                        // Networking Challenge
                        doc.setFontSize(14);
                        doc.setTextColor(0, 0, 0);
                        doc.text('Networking Challenge', 20, 20);
                        
                        doc.setFontSize(12);
                        doc.setTextColor(108, 47, 255);
                        doc.text('Week 1: Foundation', 20, 30);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('□ Optimize your LinkedIn profile', 25, 37);
                        doc.text('□ Connect with 5 classmates', 25, 42);
                        doc.text('□ Follow 3 companies you\'re interested in', 25, 47);
                        doc.text('□ Join 2 LinkedIn groups related to your field', 25, 52);
                        
                        doc.setFontSize(12);
                        doc.setTextColor(108, 47, 255);
                        doc.text('Week 2: Engagement', 20, 62);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('□ Comment on 3 LinkedIn posts', 25, 69);
                        doc.text('□ Share an industry article with your thoughts', 25, 74);
                        doc.text('□ Connect with 3 professors or teaching assistants', 25, 79);
                        doc.text('□ Ask a question in a LinkedIn group', 25, 84);
                        
                        // Do's and Don'ts
                        doc.setFontSize(14);
                        doc.setTextColor(0, 0, 0);
                        doc.text('Networking Do\'s and Don\'ts', 20, 100);
                        
                        doc.setFontSize(12);
                        doc.setTextColor(108, 47, 255);
                        doc.text('Do:', 20, 110);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('• Personalize your connection requests', 25, 117);
                        doc.text('• Follow up after meetings or events', 25, 122);
                        doc.text('• Offer help before asking for favors', 25, 127);
                        doc.text('• Be consistent in your online presence', 25, 132);
                        doc.text('• Express genuine interest in others', 25, 137);
                        
                        doc.setFontSize(12);
                        doc.setTextColor(108, 47, 255);
                        doc.text('Don\'t:', 20, 147);
                        
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('• Send generic connection requests', 25, 154);
                        doc.text('• Ask for a job in your first interaction', 25, 159);
                        doc.text('• Neglect to maintain relationships', 25, 164);
                        doc.text('• Share inappropriate or controversial content', 25, 169);
                        doc.text('• Be discouraged by non-responses', 25, 174);
                        
                        // Footer
                        doc.setFontSize(10);
                        doc.setTextColor(108, 47, 255);
                        doc.text('© 2025 Juno Companion', 105, 280, { align: 'center' });
                        
                        // Save the PDF
                        doc.save('Networking_Tips_Guide.pdf');
                    })
                    .catch(error => {
                        console.error('Error loading jsPDF:', error);
                        alert('Failed to generate PDF. Please try again later.');
                    });
            });
        }
    }

    // Check if user is logged in
    if (!setupPageForUser()) return;
    
    // Initialize settings
    initializeSettings();
    
    // Setup copy buttons
    setupCopyButtons();
    
    // Setup challenge tracker
    setupChallengeTracker();
    
    // Setup PDF download
    setupPDFDownload();
});
