document.addEventListener('DOMContentLoaded', () => {
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
        
        try {
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
        } catch (error) {
            console.error('Error parsing student data:', error);
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
            return false;
        }
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
                <div class="company-brand-header" style="background-image: url('${company.logo || (knownLogos[company.name] || '')}')">
                    <div class="brand-overlay"></div>
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
    
    // Show company details modal
    function showCompanyDetailsModal(company) {
        if (!companyDetailsModal) return;
        
        // Set company name
        if (modalCompanyName) {
            modalCompanyName.textContent = company.name;
        }
        
        // Set match percentage
        if (matchPercentage) {
            matchPercentage.textContent = `${company.matchScore}%`;
        }
        
        // Populate modal body
        if (modalCompanyBody) {
            modalCompanyBody.innerHTML = `
                <div class="modal-section">
                    <h3>About</h3>
                    <p>${company.description}</p>
                </div>
                
                <div class="modal-section">
                    <h3>Key Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <h4>Location</h4>
                                <p>${company.location}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-building"></i>
                            <div>
                                <h4>Work Type</h4>
                                <p>${company.type}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-rupee-sign"></i>
                            <div>
                                <h4>Salary Range</h4>
                                <p>${company.salary} LPA+</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-graduation-cap"></i>
                            <div>
                                <h4>Min. CGPA</h4>
                                <p>${company.minCGPA}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Required Skills</h3>
                    <div class="skills-tags modal-skills">
                        ${company.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Available Positions</h3>
                    <ul class="positions-list">
                        ${company.positions.map(position => `<li>${position}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Show modal
        companyDetailsModal.style.display = 'flex';
    }
    
    // Hide company details modal
    function hideCompanyDetailsModal() {
        if (companyDetailsModal) {
            companyDetailsModal.style.display = 'none';
        }
    }
    
    // --- Event Listeners ---
    
    // Filter change handlers
    if (salaryFilter) {
        salaryFilter.addEventListener('input', () => {
            if (salaryValue) {
                salaryValue.textContent = `₹${salaryFilter.value} LPA+`;
            }
        });
    }
    
    // Find companies button
    if (findCompaniesBtn) {
        findCompaniesBtn.addEventListener('click', () => {
            const filteredCompanies = filterCompanies();
            displayCompanies(filteredCompanies);
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
                if (salaryValue) {
                    salaryValue.textContent = `₹0 LPA+`;
                }
            }
            
            const filteredCompanies = filterCompanies();
            displayCompanies(filteredCompanies);
        });
    }
    
    // View toggle
    if (viewToggleButtons) {
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.getAttribute('data-view');
                
                // Update active button
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update view
                if (companySuggestionsGrid) {
                    if (view === 'list') {
                        companySuggestionsGrid.classList.add('list-view');
                        companySuggestionsGrid.classList.remove('card-view');
                    } else {
                        companySuggestionsGrid.classList.add('card-view');
                        companySuggestionsGrid.classList.remove('list-view');
                    }
                }
            });
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
    
    // Check if user is logged in
    if (!setupPageForUser()) return;
    
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
