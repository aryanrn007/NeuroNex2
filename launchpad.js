/**
 * Navigate to the Resume Analyzer page
 */
function startResumeAnalyzer() {
    console.log('Starting Resume Analyzer');
    window.location.href = 'resume-analyzer.html';
}

/**
 * View saved resumes
 */
function viewResumes() {
    console.log('Viewing saved resumes');
    window.location.href = 'resume-analyzer.html?view=saved';
}

/**
 * Start interview practice
 */
function startInterviewPractice() {
    console.log('Starting interview practice');
    // This would navigate to the interview practice page
    // window.location.href = 'interview-practice.html';
    alert('Interview Practice feature coming soon!');
}

/**
 * View past interviews
 */
function viewPastInterviews() {
    console.log('Viewing past interviews');
    // This would navigate to the past interviews page
    // window.location.href = 'interview-practice.html?view=history';
    alert('Interview History feature coming soon!');
}

document.addEventListener('DOMContentLoaded', () => {
    // Career Resources Modal Elements
    const resourceDetailsModal = document.getElementById('resource-details-modal');
    const closeResourceModalBtn = document.getElementById('close-resource-modal');
    const modalResourceIcon = document.getElementById('modal-resource-icon');
    const modalResourceTitle = document.getElementById('modal-resource-title');
    const modalResourceBody = document.getElementById('modal-resource-body');
    const modalResourceActionBtn = document.getElementById('modal-resource-action-btn');
    
    // Resource content data
    const resourceContents = {
        'Resume Builder': {
            icon: 'fa-file-alt',
            color: '#6c2fff',
            content: `
                <div class="resource-content">
                    <h3>Create a Professional Resume</h3>
                    <p>Our ATS-friendly resume builder helps you create a professional resume that stands out to recruiters and passes through Applicant Tracking Systems.</p>
                    
                    <div class="resource-features">
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>ATS-Optimized Templates</h4>
                                <p>Choose from multiple templates designed to pass through ATS systems with proper formatting and keywords.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Skill Suggestions</h4>
                                <p>Get AI-powered suggestions for skills based on your experience and target role.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Achievement Formatter</h4>
                                <p>Turn your responsibilities into achievement statements with our guided formatter.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="resource-steps">
                        <h3>How It Works</h3>
                        <ol>
                            <li>Select a template that matches your industry and experience level</li>
                            <li>Fill in your personal information, education, and work experience</li>
                            <li>Add skills and achievements with our AI-powered suggestions</li>
                            <li>Preview and download your resume in PDF format</li>
                        </ol>
                    </div>
                </div>
            `,
            buttonText: 'Build Resume'
        },
        'Interview Prep': {
            icon: 'fa-laptop',
            color: '#2f80ed',
            content: `
                <div class="resource-content">
                    <h3>Ace Your Interviews</h3>
                    <p>Practice with our AI-powered mock interviews to improve your confidence and performance in real interviews.</p>
                    
                    <div class="resource-features">
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Industry-Specific Questions</h4>
                                <p>Practice with questions tailored to your industry, role, and experience level.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Real-time Feedback</h4>
                                <p>Get instant feedback on your answers, communication skills, and body language.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Interview Scenarios</h4>
                                <p>Practice different interview formats including behavioral, technical, and case interviews.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="resource-steps">
                        <h3>Available Interview Types</h3>
                        <div class="interview-types">
                            <div class="interview-type">
                                <div class="type-icon"><i class="fas fa-comments"></i></div>
                                <h4>Behavioral</h4>
                                <p>Practice answering questions about your past experiences and how you handled situations.</p>
                            </div>
                            <div class="interview-type">
                                <div class="type-icon"><i class="fas fa-code"></i></div>
                                <h4>Technical</h4>
                                <p>Demonstrate your technical knowledge and problem-solving skills.</p>
                            </div>
                            <div class="interview-type">
                                <div class="type-icon"><i class="fas fa-briefcase"></i></div>
                                <h4>Case Study</h4>
                                <p>Solve business problems and showcase your analytical thinking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            buttonText: 'Start Practice'
        },
        'Salary Insights': {
            icon: 'fa-chart-line',
            color: '#27ae60',
            content: `
                <div class="resource-content">
                    <h3>Know Your Worth</h3>
                    <p>Explore salary trends and compensation data for your target roles to negotiate better offers.</p>
                    
                    <div class="resource-features">
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Industry Benchmarks</h4>
                                <p>Compare salaries across different industries, companies, and locations.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Experience-Based Insights</h4>
                                <p>See how compensation changes with experience level and skills.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Negotiation Tips</h4>
                                <p>Get personalized tips for negotiating better compensation packages.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="salary-trends">
                        <h3>Trending Roles</h3>
                        <div class="salary-chart">
                            <div class="chart-bar" style="height: 80%">
                                <div class="bar-label">Software Engineer</div>
                                <div class="bar-value">₹12-18 LPA</div>
                            </div>
                            <div class="chart-bar" style="height: 95%">
                                <div class="bar-label">Data Scientist</div>
                                <div class="bar-value">₹14-22 LPA</div>
                            </div>
                            <div class="chart-bar" style="height: 70%">
                                <div class="bar-label">Product Manager</div>
                                <div class="bar-value">₹10-16 LPA</div>
                            </div>
                            <div class="chart-bar" style="height: 85%">
                                <div class="bar-label">UX Designer</div>
                                <div class="bar-value">₹12-20 LPA</div>
                            </div>
                            <div class="chart-bar" style="height: 60%">
                                <div class="bar-label">Marketing Specialist</div>
                                <div class="bar-value">₹8-14 LPA</div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            buttonText: 'View Insights'
        },
        'Networking Tips': {
            icon: 'fa-users',
            color: '#f2994a',
            content: `
                <div class="resource-content">
                    <h3>Build Your Professional Network</h3>
                    <p>Learn effective strategies to build and leverage your professional network for career growth.</p>
                    
                    <div class="resource-features">
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Connection Strategies</h4>
                                <p>Learn how to make meaningful connections with professionals in your field.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Online Presence</h4>
                                <p>Optimize your LinkedIn and other professional profiles to attract opportunities.</p>
                            </div>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Networking Events</h4>
                                <p>Find and make the most of industry events, conferences, and meetups.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="networking-tips">
                        <h3>Top Networking Tips</h3>
                        <div class="tip">
                            <div class="tip-number">1</div>
                            <div class="tip-content">
                                <h4>Quality Over Quantity</h4>
                                <p>Focus on building meaningful relationships rather than collecting connections.</p>
                            </div>
                        </div>
                        <div class="tip">
                            <div class="tip-number">2</div>
                            <div class="tip-content">
                                <h4>Give Before You Ask</h4>
                                <p>Offer help, share knowledge, and provide value before asking for favors.</p>
                            </div>
                        </div>
                        <div class="tip">
                            <div class="tip-number">3</div>
                            <div class="tip-content">
                                <h4>Follow Up Consistently</h4>
                                <p>Maintain relationships by checking in regularly and sharing relevant updates.</p>
                            </div>
                        </div>
                        <div class="tip">
                            <div class="tip-number">4</div>
                            <div class="tip-content">
                                <h4>Be Authentic</h4>
                                <p>Be genuine in your interactions and show your real personality and interests.</p>
                            </div>
                        </div>
                        <div class="tip">
                            <div class="tip-number">5</div>
                            <div class="tip-content">
                                <h4>Leverage Alumni Networks</h4>
                                <p>Connect with alumni from your university who are working in your target companies.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            buttonText: 'Read Guide'
        }
    };
    
    // Function to show resource details modal
    function showResourceDetailsModal(resourceTitle) {
        if (!resourceDetailsModal) return;
        
        const resourceData = resourceContents[resourceTitle];
        if (!resourceData) return;
        
        // Update modal content
        if (modalResourceIcon) {
            modalResourceIcon.innerHTML = `<i class="fas ${resourceData.icon}"></i>`;
            modalResourceIcon.style.backgroundColor = resourceData.color;
        }
        
        if (modalResourceTitle) {
            modalResourceTitle.textContent = resourceTitle;
        }
        
        if (modalResourceBody) {
            modalResourceBody.innerHTML = resourceData.content;
        }
        
        if (modalResourceActionBtn) {
            modalResourceActionBtn.textContent = resourceData.buttonText;
        }
        
        // Show modal
        resourceDetailsModal.style.display = 'block';
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
    }
    
    // Function to hide resource details modal
    function hideResourceDetailsModal() {
        if (!resourceDetailsModal) return;
        
        resourceDetailsModal.style.display = 'none';
        
        // Re-enable scrolling on body
        document.body.style.overflow = '';
    }
    
    // Add event listeners to resource buttons
    const resourceButtons = document.querySelectorAll('.resource-btn');
    if (resourceButtons.length > 0) {
        resourceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const resourceCard = button.closest('.resource-card');
                const resourceTitle = resourceCard.querySelector('h3').textContent;
                showResourceDetailsModal(resourceTitle);
            });
        });
    }
    
    // Also make the entire resource card clickable
    const resourceCards = document.querySelectorAll('.resource-card');
    if (resourceCards.length > 0) {
        resourceCards.forEach(card => {
            card.addEventListener('click', () => {
                const resourceTitle = card.querySelector('h3').textContent;
                showResourceDetailsModal(resourceTitle);
            });
        });
    }
    
    // Close modal with close button
    if (closeResourceModalBtn) {
        closeResourceModalBtn.addEventListener('click', hideResourceDetailsModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (resourceDetailsModal && e.target === resourceDetailsModal) {
            hideResourceDetailsModal();
        }
    });
    
    // Resource action button functionality
    if (modalResourceActionBtn) {
        modalResourceActionBtn.addEventListener('click', () => {
            const resourceTitle = modalResourceTitle.textContent;
            
            // Show notification
            if (typeof window.showNotification === 'function') {
                window.showNotification(`${resourceTitle} action initiated`, "success");
            }
            
            // Close the modal
            hideResourceDetailsModal();
        });
    }

    // DOM Elements
    const loggedInUserNameLP = document.getElementById('loggedInUserNameLP');
    const logoutButtonLP = document.getElementById('logout-buttonLP');
    const settingsButtonLP = document.getElementById('settings-buttonLP');
    const settingsPanelLP = document.getElementById('settings-panelLP');
    const closeSettingsLP = document.getElementById('close-settingsLP');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Profile Elements
    const profileName = document.getElementById('profile-name');
    const profileProgram = document.getElementById('profile-program');
    const profileCGPA = document.getElementById('profile-cgpa');
    const profileSkills = document.getElementById('profile-skills');
    const profileMatches = document.getElementById('profile-matches');
    const topSkillsContainer = document.getElementById('top-skills-container');
    
    // Filter Elements
    const domainFilter = document.getElementById('domain-filter');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');
    const salaryFilter = document.getElementById('salary-filter');
    const salaryValue = document.getElementById('salary-value');
    const findCompaniesBtn = document.getElementById('find-companies-btn');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const matchesCount = document.getElementById('matches-count');
    
    // View Toggle
    const viewToggleButtons = document.querySelectorAll('.toggle-view button');
    
    // Company Grid
    const companySuggestionsGrid = document.getElementById('company-suggestions-grid');
    
    // Carousel Elements
    const carouselContainer = document.querySelector('.carousel-container');
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');
    
    // Modal Elements
    const companyDetailsModal = document.getElementById('company-details-modal');
    const closeModalBtn = document.getElementById('close-company-modal');
    const modalCompanyName = document.getElementById('modal-company-name');
    const modalCompanyBody = document.getElementById('modal-company-body');
    const matchPercentage = document.getElementById('match-percentage');
    const modalApplyBtn = document.getElementById('modal-apply-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    
    // State
    let loggedInStudent = null;
    let allCompanyOpportunitiesData = [];
    let filteredCompanies = [];
    
    // --- Basic Login Check & Header Setup ---
    function setupPageForUser() {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (!studentDataString) {
            window.location.href = 'login.html';
            return false;
        }
        
        loggedInStudent = JSON.parse(studentDataString);
        if (!loggedInStudent || !loggedInStudent.fullName) {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
            return false;
        }

        if (loggedInUserNameLP) {
            loggedInUserNameLP.textContent = `Hi, ${loggedInStudent.fullName.split(' ')[0]}!`;
        }
        
        // Update profile information
        updateProfileInfo();
        
        return true;
    }
    
    // Update profile information
    function updateProfileInfo() {
        if (!loggedInStudent) return;
        
        if (profileName) {
            profileName.textContent = loggedInStudent.fullName || 'Your Profile';
        }
        
        if (profileProgram) {
            profileProgram.textContent = loggedInStudent.program || 'Computer Science & Engineering';
        }
        
        if (profileCGPA && loggedInStudent.cgpa) {
            profileCGPA.textContent = loggedInStudent.cgpa.toFixed(2);
        }
        
        // Simulate skills count
        if (profileSkills) {
            const skillsCount = loggedInStudent.skills ? loggedInStudent.skills.length : 5;
            profileSkills.textContent = skillsCount;
        }
        
        // Update top skills
        if (topSkillsContainer && loggedInStudent.skills && loggedInStudent.skills.length > 0) {
            topSkillsContainer.innerHTML = '';
            loggedInStudent.skills.slice(0, 5).forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                topSkillsContainer.appendChild(skillTag);
            });
        }
    }
    
    // Check if user is logged in
    if (!setupPageForUser()) return;
    
    // --- Theme Management ---
    function initializeSettings() {
        // Set initial theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', currentTheme);
        
        // Highlight the current theme option
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === currentTheme) {
                option.classList.add('active');
            }
        });
        
        // Theme option click handlers
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                
                // Update active class
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Settings panel toggle
        if (settingsButtonLP) {
            settingsButtonLP.addEventListener('click', () => {
                settingsPanelLP.classList.toggle('open');
            });
        }
        
        // Close settings panel
        if (closeSettingsLP) {
            closeSettingsLP.addEventListener('click', () => {
                settingsPanelLP.classList.remove('open');
            });
        }
        
        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (settingsPanelLP && settingsPanelLP.classList.contains('open') && 
                !settingsPanelLP.contains(e.target) && 
                e.target !== settingsButtonLP) {
                settingsPanelLP.classList.remove('open');
            }
        });
        
        // Logout functionality
        if (logoutButtonLP) {
            logoutButtonLP.addEventListener('click', () => {
                localStorage.removeItem('loggedInStudentData');
                window.location.href = 'login.html';
            });
        }
    }
    
    // --- Company Data Management ---
    async function loadCompanyData() {
        try {
            // In a real app, this would be an API call
            // For demo purposes, we'll use sample data
            const sampleCompanies = [
                {
                    id: 1,
                    name: 'Google',
                    logo: 'https://logo.clearbit.com/google.com',
                    description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products.',
                    domain: 'Software Development',
                    location: 'Bangalore',
                    type: 'In-Office',
                    minCGPA: 7.5,
                    salary: 25,
                    skills: ['Python', 'Machine Learning', 'JavaScript', 'React', 'Cloud Computing'],
                    positions: ['Software Engineer', 'Data Scientist', 'Product Manager'],
                    matchScore: 95
                },
                {
                    id: 2,
                    name: 'Microsoft',
                    logo: 'https://logo.clearbit.com/microsoft.com',
                    description: 'Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, and related services.',
                    domain: 'Cloud Computing',
                    location: 'Hyderabad',
                    type: 'Hybrid',
                    minCGPA: 7.0,
                    salary: 20,
                    skills: ['C#', '.NET', 'Azure', 'SQL', 'React'],
                    positions: ['Software Engineer', 'Cloud Solutions Architect', 'DevOps Engineer'],
                    matchScore: 88
                },
                {
                    id: 3,
                    name: 'Amazon',
                    logo: 'https://logo.clearbit.com/amazon.com',
                    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
                    domain: 'E-commerce',
                    location: 'Bangalore',
                    type: 'In-Office',
                    minCGPA: 7.0,
                    salary: 18,
                    skills: ['Java', 'AWS', 'Python', 'Data Structures', 'Algorithms'],
                    positions: ['SDE', 'Business Analyst', 'Operations Manager'],
                    matchScore: 85
                },
                {
                    id: 4,
                    name: 'Flipkart',
                    logo: 'https://logo.clearbit.com/flipkart.com',
                    description: 'Flipkart is an Indian e-commerce company, headquartered in Bangalore, and incorporated in Singapore as a private limited company.',
                    domain: 'E-commerce',
                    location: 'Bangalore',
                    type: 'In-Office',
                    minCGPA: 6.5,
                    salary: 15,
                    skills: ['Java', 'Spring Boot', 'React', 'Node.js', 'MongoDB'],
                    positions: ['Software Developer', 'UI/UX Designer', 'Data Analyst'],
                    matchScore: 82
                },
                {
                    id: 5,
                    name: 'TCS',
                    logo: 'https://logo.clearbit.com/tcs.com',
                    description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
                    domain: 'IT Services',
                    location: 'Mumbai',
                    type: 'Hybrid',
                    minCGPA: 6.0,
                    salary: 8,
                    skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'JavaScript'],
                    positions: ['System Engineer', 'Business Analyst', 'Project Manager'],
                    matchScore: 75
                },
                {
                    id: 6,
                    name: 'Infosys',
                    logo: 'https://logo.clearbit.com/infosys.com',
                    description: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.',
                    domain: 'IT Services',
                    location: 'Pune',
                    type: 'In-Office',
                    minCGPA: 6.0,
                    salary: 7,
                    skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'JavaScript'],
                    positions: ['Systems Engineer', 'Technology Analyst', 'Associate Consultant'],
                    matchScore: 72
                },
                {
                    id: 7,
                    name: 'Wipro',
                    logo: 'https://logo.clearbit.com/wipro.com',
                    description: 'Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services.',
                    domain: 'IT Services',
                    location: 'Bangalore',
                    type: 'Hybrid',
                    minCGPA: 6.0,
                    salary: 7,
                    skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'JavaScript'],
                    positions: ['Project Engineer', 'Technical Support', 'Software Developer'],
                    matchScore: 70
                }
            ];
            
            allCompanyOpportunitiesData = sampleCompanies;
            
            // Populate domain filter options
            populateDomainFilter();
            
            return sampleCompanies;
        } catch (error) {
            console.error('Error loading company data:', error);
            return [];
        }
    }
    
    // Populate domain filter options
    function populateDomainFilter() {
        if (!domainFilter) return;
        
        // Get unique domains
        const domains = [...new Set(allCompanyOpportunitiesData.map(company => company.domain))];
        
        // Clear existing options except the first one
        while (domainFilter.options.length > 1) {
            domainFilter.remove(1);
        }
        
        // Add domain options
        domains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            domainFilter.appendChild(option);
        });
    }
    
    // Filter companies based on criteria
    function filterCompanies() {
        if (!allCompanyOpportunitiesData.length) return [];
        
        const domain = domainFilter ? domainFilter.value : '';
        const location = locationFilter ? locationFilter.value.toLowerCase() : '';
        const type = typeFilter ? typeFilter.value : '';
        const minSalary = salaryFilter ? parseInt(salaryFilter.value) : 0;
        const studentCGPA = loggedInStudent && loggedInStudent.cgpa ? loggedInStudent.cgpa : 0;
        
        filteredCompanies = allCompanyOpportunitiesData.filter(company => {
            // Domain filter
            const matchesDomain = !domain || company.domain === domain;
            
            // Location filter
            const matchesLocation = !location || company.location.toLowerCase().includes(location);
            
            // Type filter
            const matchesType = !type || company.type === type;
            
            // Salary filter
            const matchesSalary = company.salary >= minSalary;
            
            // CGPA filter
            const matchesCGPA = studentCGPA >= company.minCGPA;
            
            return matchesDomain && matchesLocation && matchesType && matchesSalary && matchesCGPA;
        });
        
        // Return the filtered companies
        return filteredCompanies;
    }
    
    // --- Company Display ---
    function displayCompanies(companies) {
        if (!companySuggestionsGrid) return;
        
        // Clear previous results
        companySuggestionsGrid.innerHTML = '';
        
        // Update matches count
        if (matchesCount) {
            matchesCount.textContent = companies.length;
        }
        
        // Show no matches message if no companies match
        if (companies.length === 0) {
            const noMatchesMessage = document.createElement('div');
            noMatchesMessage.className = 'no-matches-message';
            noMatchesMessage.innerHTML = `
                <img src="https://d8it4huxumps7.cloudfront.net/uploads/images/63d0d7a2a903d_empty_state.svg" alt="No matches found" class="empty-state-img">
                <h3>No matches found</h3>
                <p>Adjust your filters or click "Find Matching Companies" to discover opportunities tailored to your profile.</p>
            `;
            companySuggestionsGrid.appendChild(noMatchesMessage);
            return;
        }
        
        // Helper function to get company logo or generate one
        function getCompanyLogo(company) {
            // Known company logos
            const knownLogos = {
                'Google': 'https://logo.clearbit.com/google.com',
                'Microsoft': 'https://logo.clearbit.com/microsoft.com',
                'Amazon': 'https://logo.clearbit.com/amazon.com',
                'Flipkart': 'https://logo.clearbit.com/flipkart.com',
                'TCS': 'https://logo.clearbit.com/tcs.com',
                'Infosys': 'https://logo.clearbit.com/infosys.com',
                'Wipro': 'https://logo.clearbit.com/wipro.com',
                'Apple': 'https://logo.clearbit.com/apple.com',
                'Facebook': 'https://logo.clearbit.com/facebook.com',
                'IBM': 'https://logo.clearbit.com/ibm.com',
                'Oracle': 'https://logo.clearbit.com/oracle.com',
                'Intel': 'https://logo.clearbit.com/intel.com',
                'Adobe': 'https://logo.clearbit.com/adobe.com',
                'Cisco': 'https://logo.clearbit.com/cisco.com',
                'Accenture': 'https://logo.clearbit.com/accenture.com'
            };
            
            if (company.logo) {
                return `<img src="${company.logo}" alt="${company.name} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="logo-fallback" style="display:none;"><span>${company.name.charAt(0)}</span></div>`;
            } else if (knownLogos[company.name]) {
                return `<img src="${knownLogos[company.name]}" alt="${company.name} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="logo-fallback" style="display:none;"><span>${company.name.charAt(0)}</span></div>`;
            } else {
                // Generate a color based on company name
                const hash = company.name.split('').reduce((acc, char) => {
                    return char.charCodeAt(0) + ((acc << 5) - acc);
                }, 0);
                const hue = Math.abs(hash % 360);
                const color = `hsl(${hue}, 70%, 60%)`;
                
                return `<div class="logo-fallback" style="background-color: ${color};"><span>${company.name.charAt(0)}</span></div>`;
            }
        }
        
        // Helper function to generate a tag with a color based on text
        function generateColorfulTag(text) {
            const hash = text.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            const hue = Math.abs(hash % 360);
            const color = `hsl(${hue}, 70%, 85%)`;
            const textColor = `hsl(${hue}, 70%, 30%)`;
            
            return `<span class="company-tag" style="background-color: ${color}; color: ${textColor};">${text}</span>`;
        }
        
        // Generate company cards
        companies.forEach(company => {
            // Calculate match score class
            const matchScoreClass = company.matchScore >= 90 ? 'excellent-match' : 
                                   company.matchScore >= 80 ? 'good-match' : 
                                   company.matchScore >= 70 ? 'average-match' : 'low-match';
            
            const companyCard = document.createElement('div');
            companyCard.className = 'company-card';
            
            // Generate a subtle background pattern based on company name
            const patternSeed = company.name.length % 5; // 0-4 pattern types
            const patternClass = `pattern-${patternSeed}`;
            
            companyCard.innerHTML = `
                <div class="card-background ${patternClass}"></div>
                <div class="match-indicator ${matchScoreClass}">
                    <span>${company.matchScore}%</span>
                </div>
                <div class="company-header">
                    <div class="company-logo">
                        ${getCompanyLogo(company)}
                    </div>
                    <h3 class="company-name">${company.name}</h3>
                </div>
                <div class="company-tags">
                    ${generateColorfulTag(company.domain)}
                    ${generateColorfulTag(company.type)}
                </div>
                <div class="company-stats">
                    <div class="stat">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${company.location}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-rupee-sign"></i>
                        <span>${company.salary} LPA</span>
                    </div>
                </div>
                <div class="company-actions">
                    <button class="view-details-btn" data-company-id="${company.id}">View Details</button>
                    <button class="save-btn" data-company-id="${company.id}"><i class="far fa-bookmark"></i></button>
                </div>
            `;
            
            companySuggestionsGrid.appendChild(companyCard);
            
            // Add click event to view details button
            const viewDetailsBtn = companyCard.querySelector('.view-details-btn');
            viewDetailsBtn.addEventListener('click', () => {
                showCompanyDetailsModal(company);
            });
            
            // Add click event to save button
            const saveBtn = companyCard.querySelector('.save-btn');
            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Toggle bookmark icon
                saveBtn.classList.toggle('saved');
                if (saveBtn.classList.contains('saved')) {
                    saveBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
                } else {
                    saveBtn.innerHTML = '<i class="far fa-bookmark"></i>';
                }
            });
        });
    }
    
    // This is a placeholder to maintain file structure
    // The actual showCompanyDetailsModal and hideCompanyDetailsModal functions are defined later in the file
    
    // --- Basic Login Check & Header Setup ---
    function setupPageForUser() {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (!studentDataString) {
            window.location.href = 'login.html';
            return false;
        }
        
        loggedInStudent = JSON.parse(studentDataString);
        if (!loggedInStudent || !loggedInStudent.fullName) {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
            return false;
        }

        if (loggedInUserNameLP) {
            loggedInUserNameLP.textContent = `Hi, ${loggedInStudent.fullName.split(' ')[0]}!`;
        }
        
        // Update profile information
        updateProfileInfo();
        
        return true;
    }
    
    // Update profile information
    function updateProfileInfo() {
        if (!loggedInStudent) return;
        
        if (profileName) {
            profileName.textContent = loggedInStudent.fullName || 'Your Profile';
        }
        
        if (profileProgram) {
            profileProgram.textContent = loggedInStudent.program || 'Computer Science & Engineering';
        }
        
        if (profileCGPA && loggedInStudent.cgpa) {
            profileCGPA.textContent = loggedInStudent.cgpa.toFixed(2);
        }
        
        // Simulate skills count
        if (profileSkills) {
            const skillsCount = loggedInStudent.skills ? loggedInStudent.skills.length : 5;
            profileSkills.textContent = skillsCount;
        }
        
        // Update top skills
        if (topSkillsContainer && loggedInStudent.skills && loggedInStudent.skills.length > 0) {
            topSkillsContainer.innerHTML = '';
            loggedInStudent.skills.slice(0, 5).forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                topSkillsContainer.appendChild(skillTag);
            });
        }
    }
    
    // Check if user is logged in
    if (!setupPageForUser()) return;
    
    // --- Theme Management ---
    function initializeSettings() {
        // Set initial theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', currentTheme);
        
        // Highlight the current theme option
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === currentTheme) {
                option.classList.add('active');
            }
        });
        
        // Theme option click handlers
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                
                // Update active class
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Settings panel toggle
        if (settingsButtonLP) {
            settingsButtonLP.addEventListener('click', () => {
                settingsPanelLP.classList.toggle('open');
            });
        }
        
        // Close settings panel
        if (closeSettingsLP) {
            closeSettingsLP.addEventListener('click', () => {
                settingsPanelLP.classList.remove('open');
            });
        }
        
        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (settingsPanelLP && settingsPanelLP.classList.contains('open') && 
                !settingsPanelLP.contains(e.target) && 
                e.target !== settingsButtonLP) {
                settingsPanelLP.classList.remove('open');
            }
        });
        
        // Logout functionality
        if (logoutButtonLP) {
            logoutButtonLP.addEventListener('click', () => {
                localStorage.removeItem('loggedInStudentData');
                window.location.href = 'login.html';
            });
        }
    }
    
    // --- Company Data Management ---
    async function loadCompanyData() {
        try {
            // In a real app, this would be an API call
            // For demo purposes, we'll use sample data
            const sampleCompanies = [
                {
                    id: 1,
                    name: 'Google',
                    logo: 'https://logo.clearbit.com/google.com',
                    description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products.',
                    domain: 'Software Development',
                    location: 'Bangalore',
                    type: 'In-Office',
                    minCGPA: 7.5,
                    salary: 25,
                    skills: ['Python', 'Machine Learning', 'JavaScript', 'React', 'Cloud Computing'],
                    positions: ['Software Engineer', 'Data Scientist', 'Product Manager'],
                    matchScore: 95
                },
                {
                    id: 2,
                    name: 'Microsoft',
                    logo: 'https://logo.clearbit.com/microsoft.com',
                    description: 'Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, and related services.',
                    domain: 'Cloud Computing',
                    location: 'Hyderabad',
                    type: 'Hybrid',
                    minCGPA: 7.0,
                    salary: 20,
                    skills: ['C#', '.NET', 'Azure', 'SQL', 'React'],
                    positions: ['Software Engineer', 'Cloud Solutions Architect', 'DevOps Engineer'],
                    matchScore: 88
                },
                {
                    id: 3,
                    name: 'Amazon',
                    logo: 'https://logo.clearbit.com/amazon.com',
                    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
                    domain: 'E-commerce',
                    location: 'Bangalore',
                    type: 'In-Office',
                    minCGPA: 7.0,
                    salary: 18,
                    skills: ['Java', 'AWS', 'Python', 'Data Structures', 'Algorithms'],
                    positions: ['SDE', 'Business Analyst', 'Operations Manager'],
                    matchScore: 85
                },
                {
                    id: 4,
                    name: 'Flipkart',
                    logo: 'https://logo.clearbit.com/flipkart.com',
                    description: 'Flipkart is an Indian e-commerce company, headquartered in Bangalore, and incorporated in Singapore as a private limited company.',
                    domain: 'E-commerce',
                    location: 'Bangalore',
                    type: 'In-Office',
                    minCGPA: 6.5,
                    salary: 15,
                    skills: ['Java', 'Spring Boot', 'React', 'Node.js', 'MongoDB'],
                    positions: ['Software Developer', 'UI/UX Designer', 'Data Analyst'],
                    matchScore: 82
                },
                {
                    id: 5,
                    name: 'TCS',
                    logo: 'https://logo.clearbit.com/tcs.com',
                    description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
                    domain: 'IT Services',
                    location: 'Mumbai',
                    type: 'Hybrid',
                    minCGPA: 6.0,
                    salary: 8,
                    skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'JavaScript'],
                    positions: ['System Engineer', 'Business Analyst', 'Project Manager'],
                    matchScore: 75
                },
                {
                    id: 6,
                    name: 'Infosys',
                    logo: 'https://logo.clearbit.com/infosys.com',
                    description: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.',
                    domain: 'IT Services',
                    location: 'Pune',
                    type: 'In-Office',
                    minCGPA: 6.0,
                    salary: 7,
                    skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'JavaScript'],
                    positions: ['Systems Engineer', 'Technology Analyst', 'Associate Consultant'],
                    matchScore: 72
                },
                {
                    id: 7,
                    name: 'Wipro',
                    logo: 'https://logo.clearbit.com/wipro.com',
                    description: 'Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services.',
                    domain: 'IT Services',
                    location: 'Bangalore',
                    type: 'Hybrid',
                    minCGPA: 6.0,
                    salary: 7,
                    skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'JavaScript'],
                    positions: ['Project Engineer', 'Technical Support', 'Software Developer'],
                    matchScore: 70
                },
                {
                    name: 'IBM',
                    logo: 'https://logo.clearbit.com/ibm.com',
                    description: 'International Business Machines Corporation is an American multinational technology corporation headquartered in Armonk, New York.',
                    domain: 'Cloud Computing',
                    location: 'Bangalore',
                    type: 'Hybrid',
                    minCGPA: 7.0,
                    salary: 12,
                    skills: ['Java', 'Python', 'Cloud Computing', 'AI/ML', 'Blockchain'],
                    positions: ['Software Developer', 'Data Scientist', 'Cloud Engineer'],
                    matchScore: 78
                }
            ];
            
            allCompanyOpportunitiesData = sampleCompanies;
            
            // Populate domain filter options
            populateDomainFilter();
            
            return sampleCompanies;
        } catch (error) {
            console.error('Error loading company data:', error);
            return [];
        }
    }
    
    // Populate domain filter options
    function populateDomainFilter() {
        if (!domainFilter) return;
        
        // Get unique domains
        const domains = [...new Set(allCompanyOpportunitiesData.map(company => company.domain))];
        
        // Clear existing options except the first one
        while (domainFilter.options.length > 1) {
            domainFilter.remove(1);
        }
        
        // Add domain options
        domains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            domainFilter.appendChild(option);
        });
    }
    
    // Filter companies based on criteria
    function filterCompanies() {
        if (!allCompanyOpportunitiesData.length) return [];
        
        const domain = domainFilter ? domainFilter.value : '';
        const location = locationFilter ? locationFilter.value.toLowerCase() : '';
        const type = typeFilter ? typeFilter.value : '';
        const minSalary = salaryFilter ? parseInt(salaryFilter.value) : 0;
        const studentCGPA = loggedInStudent && loggedInStudent.cgpa ? loggedInStudent.cgpa : 0;
        
        filteredCompanies = allCompanyOpportunitiesData.filter(company => {
        // Domain filter
        const matchesDomain = !domain || company.domain === domain;
        
        // Location filter
        const matchesLocation = !location || company.location.toLowerCase().includes(location);
        
        // Type filter
        const matchesType = !type || company.type === type;
        
        // Salary filter
        const matchesSalary = company.salary >= minSalary;
        
        // CGPA filter
        const matchesCGPA = studentCGPA >= company.minCGPA;
        
            return matchesDomain && matchesLocation && matchesType && matchesSalary && matchesCGPA;
        });
        
        // Return the filtered companies
        return filteredCompanies;
    }
    
    // Display filtered companies
    function displayCompanies(companies) {
        const companySuggestionsGrid = document.getElementById('company-suggestions-grid');
        const noMatchesMessage = document.querySelector('.no-matches-message');
        const matchesCount = document.getElementById('matches-count');
        
        // Clear previous results
        companySuggestionsGrid.innerHTML = '';
        
        // Update matches count
        if (matchesCount) {
            matchesCount.textContent = companies.length;
        }
        
        // Show no matches message if no companies match
        if (companies.length === 0) {
            if (noMatchesMessage) {
                noMatchesMessage.style.display = 'block';
            }
            return;
        } else {
            if (noMatchesMessage) {
                noMatchesMessage.style.display = 'none';
            }
        }
    
    // Helper function to get company logo or generate one
    function getCompanyLogo(company) {
        // Known company logos
        const knownLogos = {
            'Google': 'https://logo.clearbit.com/google.com',
            'Microsoft': 'https://logo.clearbit.com/microsoft.com',
            'Amazon': 'https://logo.clearbit.com/amazon.com',
            'Flipkart': 'https://logo.clearbit.com/flipkart.com',
            'TCS': 'https://logo.clearbit.com/tcs.com',
            'Infosys': 'https://logo.clearbit.com/infosys.com',
            'Wipro': 'https://logo.clearbit.com/wipro.com',
            'Apple': 'https://logo.clearbit.com/apple.com',
            'Facebook': 'https://logo.clearbit.com/facebook.com',
            'IBM': 'https://logo.clearbit.com/ibm.com',
            'Oracle': 'https://logo.clearbit.com/oracle.com',
            'Intel': 'https://logo.clearbit.com/intel.com',
            'Adobe': 'https://logo.clearbit.com/adobe.com',
            'Cisco': 'https://logo.clearbit.com/cisco.com',
            'Accenture': 'https://logo.clearbit.com/accenture.com'
        };
        
        if (company.logo) {
            return `<img src="${company.logo}" alt="${company.name} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="logo-fallback" style="display:none;"><span>${company.name.charAt(0)}</span></div>`;
        } else if (knownLogos[company.name]) {
            return `<img src="${knownLogos[company.name]}" alt="${company.name} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="logo-fallback" style="display:none;"><span>${company.name.charAt(0)}</span></div>`;
        } else {
            // Generate a color based on company name
            const hash = company.name.split('').reduce((acc, char) => {
                return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0);
            const hue = Math.abs(hash % 360);
            const color = `hsl(${hue}, 70%, 60%)`;
            
            return `<div class="logo-fallback" style="background-color: ${color};"><span>${company.name.charAt(0)}</span></div>`;
        }
    }
    
    // Helper function to generate a tag with a color based on text
    function generateColorfulTag(text) {
        const hash = text.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        const hue = Math.abs(hash % 360);
        const color = `hsl(${hue}, 70%, 85%)`;
        const textColor = `hsl(${hue}, 70%, 30%)`;
        
        return `<span class="company-tag" style="background-color: ${color}; color: ${textColor};">${text}</span>`;
    }
    
    // Generate company cards
    companies.forEach(company => {
        const companyCard = document.createElement('div');
        companyCard.className = 'company-card';
        
        // Generate a subtle background pattern based on company name
        const patternSeed = company.name.length % 5; // 0-4 pattern types
        const patternClass = `pattern-${patternSeed}`;
        
        companyCard.innerHTML = `
            <div class="card-background ${patternClass}"></div>
            <div class="match-indicator">
                <span>${company.matchScore}%</span>
            </div>
            <div class="company-header">
                <div class="company-logo">
                    ${getCompanyLogo(company)}
                </div>
                <h3 class="company-name">${company.name}</h3>
            </div>
            <div class="company-tags">
                ${generateColorfulTag(company.domain)}
                ${generateColorfulTag(company.type)}
            </div>
            <div class="company-stats">
                <div class="stat">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${company.location}</span>
                </div>
                <div class="stat">
                    <i class="fas fa-rupee-sign"></i>
                    <span>${company.salary} LPA</span>
                </div>
            </div>
            <div class="company-actions">
                <button class="view-details-btn" data-company-id="${company.id}">View Details</button>
                <button class="save-btn" data-company-id="${company.id}"><i class="far fa-bookmark"></i></button>
            </div>
        `;
        
        // Add event listener for view details button
        const viewDetailsBtn = companyCard.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                showCompanyDetailsModal(company);
            });
        }
        
        // Add event listener for save button
        const saveBtn = companyCard.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                this.classList.toggle('saved');
                if (this.classList.contains('saved')) {
                    this.innerHTML = '<i class="fas fa-bookmark"></i>';
                } else {
                    this.innerHTML = '<i class="far fa-bookmark"></i>';
                }
            });
        }
        
        if (matchPercentage) {
            matchPercentage.textContent = `${company.matchScore}%`;
        }
        
        if (modalCompanyBody) {
            modalCompanyBody.innerHTML = `
                <div class="company-description">
                    <h3>About ${company.name}</h3>
                    <p>${company.description}</p>
                </div>
                
                <div class="company-details-grid">
                    <div class="detail-item">
                        <h4>Domain</h4>
                        <p>${company.domain}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Location</h4>
                        <p>${company.location}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Work Type</h4>
                        <p>${company.type}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Min. CGPA</h4>
                        <p>${company.minCGPA}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Salary Range</h4>
                        <p>₹${company.salary} LPA+</p>
                    </div>
                </div>
                
                <div class="company-skills">
                    <h3>Required Skills</h3>
                    <div class="skills-tags">
                        ${company.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="company-positions">
                    <h3>Open Positions</h3>
                    <ul class="positions-list">
                        ${company.positions.map(position => `<li>${position}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Show modal
        companyDetailsModal.style.display = 'block';
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
    },
    
    // Hide company details modal
    function hideCompanyDetailsModal() {
        if (!companyDetailsModal) return;
        
        companyDetailsModal.style.display = 'none';
        
        // Re-enable scrolling on body
        document.body.style.overflow = '';
    }
    
    // --- Event Listeners ---
    // Salary range slider
    if (salaryFilter && salaryValue) {
        salaryFilter.addEventListener('input', () => {
            const value = salaryFilter.value;
            salaryValue.textContent = `₹${value} LPA+`;
        });
    }
    
    // Find companies button
    if (findCompaniesBtn) {
        findCompaniesBtn.addEventListener('click', () => {
            const filteredCompanies = filterCompanies();
            displayCompanies(filteredCompanies);
            
            // Update profile matches count
            if (profileMatches) {
                profileMatches.textContent = filteredCompanies.length;
            }
            
            // Scroll to company matches section
            document.querySelector('.company-matches').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (domainFilter) domainFilter.value = '';
            if (locationFilter) locationFilter.value = '';
            if (typeFilter) typeFilter.value = '';
            if (salaryFilter) {
                salaryFilter.value = 0;
                if (salaryValue) salaryValue.textContent = '₹0 LPA+';
            }
        });
    }
    
    // View toggle buttons
    if (viewToggleButtons.length > 0) {
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Toggle view mode
                const viewMode = button.getAttribute('data-view');
                if (companySuggestionsGrid) {
                    companySuggestionsGrid.className = viewMode === 'list' ? 'company-list' : 'company-grid';
                }
            });
        });
    }
    
    // Carousel navigation
    if (carouselContainer && prevButton && nextButton) {
        const scrollAmount = 300;
        
        prevButton.addEventListener('click', () => {
            carouselContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        nextButton.addEventListener('click', () => {
            carouselContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
    
    // Modal close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideCompanyDetailsModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (companyDetailsModal && e.target === companyDetailsModal) {
            hideCompanyDetailsModal();
        }
    });
    
    // Explore opportunities button
    const exploreOpportunitiesBtn = document.getElementById('explore-opportunities-btn');
    if (exploreOpportunitiesBtn) {
        exploreOpportunitiesBtn.addEventListener('click', () => {
            document.querySelector('.smart-filters').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Initialize
    initializeSettings();
    loadCompanyData().then(() => {
        // Set initial filtered companies (show all)
        const initialCompanies = filterCompanies();
        displayCompanies(initialCompanies);
        
        // Update profile matches count
        if (profileMatches) {
            profileMatches.textContent = initialCompanies.length;
        }
    });
});
