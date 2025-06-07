// Company Cards Redesign - Inspired by SkillSync Student Cards
document.addEventListener('DOMContentLoaded', () => {
    // Add the CSS file link to the head if not already present
    if (!document.querySelector('link[href="company-cards-redesign.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'company-cards-redesign.css';
        document.head.appendChild(link);
    }

    // Override the displayCompanies function to use our new design
    const originalDisplayCompanies = window.displayCompanies;
    
    window.displayCompanies = function(companies) {
        const companySuggestionsGrid = document.getElementById('company-suggestions-grid');
        const noMatchesMessage = document.querySelector('.no-matches-message');
        const matchesCount = document.getElementById('matches-count');
        
        // Clear previous results
        if (companySuggestionsGrid) {
            companySuggestionsGrid.innerHTML = '';
        }
        
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

        // Generate company cards with new design
        companies.forEach(company => {
            const companyCard = document.createElement('div');
            companyCard.className = 'company-card';
            
            // Add high-match class for companies with match score > 70%
            if (company.matchScore > 70) {
                companyCard.classList.add('high-match');
            }
            
            // Determine if company is new or trending (for badge)
            const isNew = company.isNew || Math.random() < 0.2; // Randomly mark some as new for demo
            const isTrending = company.isTrending || (company.matchScore > 85); // High match companies are trending
            
            // Badge HTML
            let badgeHTML = '';
            if (isNew) {
                badgeHTML = `<div class="company-badge new"><i class="fas fa-certificate"></i> New</div>`;
            } else if (isTrending) {
                badgeHTML = `<div class="company-badge"><i class="fas fa-fire"></i> Trending</div>`;
            }
            
            // Generate tag icons based on type
            const typeIcon = getTypeIcon(company.type);
            const domainIcon = getDomainIcon(company.domain);
            
            companyCard.innerHTML = `
                <h2 class="company-title">${company.name}</h2>
                <span class="company-tag-badge">${company.domain}</span>
                
                <div class="company-info-list">
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${company.location}</span>
                    </div>
                    <div class="info-item">
                        <i class="far fa-calendar-alt"></i>
                        <span>${company.type}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-rupee-sign"></i>
                        <span>${company.salary} LPA</span>
                    </div>
                </div>
                
                <div class="company-description">
                    A leading company in the ${company.domain} sector offering exciting career opportunities.
                </div>
                
                <div class="company-actions">
                    <button class="bookmark-btn" data-company-id="${company.id}">
                        <i class="far fa-bookmark"></i>
                    </button>
                    <button class="direct-view-btn" onclick="showCompanyDetails('${company.name}', '${company.domain}', '${company.location}', '${company.type}', '${company.salary}')">
                        View Details <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
                <div class="match-percentage" style="display:none;">${company.matchScore}%</div>
            `;
            
            // Add event listener for view details button
            const viewDetailsBtn = companyCard.querySelector('.view-details-btn');
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', function(e) {
                    e.preventDefault(); // Prevent page redirection
                    e.stopPropagation(); // Stop event bubbling
                    
                    // Show company details in the modal
                    const modal = document.getElementById('company-details-modal');
                    const modalCompanyName = document.getElementById('modal-company-name');
                    const modalCompanyBody = document.getElementById('modal-company-body');
                    const matchPercentage = document.getElementById('match-percentage');
                    
                    if (!modal || !modalCompanyName || !modalCompanyBody) {
                        console.error('Modal elements not found');
                        alert('Unable to display company details. Please try again later.');
                        return;
                    }
                    
                    // Set company name in the modal header
                    modalCompanyName.textContent = company.name;
                    
                    // Set match percentage if available
                    if (matchPercentage && company.matchScore) {
                        matchPercentage.textContent = `${company.matchScore}%`;
                    }
                    
                    // Generate company details content
                    let detailsHTML = `
                        <div class="company-details-section">
                            <h3><i class="fas fa-building"></i> Company Overview</h3>
                            <p>${company.description || 'A leading company offering exciting career opportunities.'}</p>
                        </div>
                        
                        <div class="company-details-section">
                            <h3><i class="fas fa-info-circle"></i> Key Information</h3>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Location</span>
                                    <span class="detail-value">${company.location || 'Multiple Locations'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Work Type</span>
                                    <span class="detail-value">${company.type || 'Hybrid'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Domain</span>
                                    <span class="detail-value">${company.domain || 'Technology'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Salary Range</span>
                                    <span class="detail-value">${company.salary || '8-15'} LPA</span>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Add skills section
                    const skills = company.skills || ['Problem Solving', 'Communication', 'Technical Skills', 'Teamwork'];
                    const skillsHTML = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
                    
                    detailsHTML += `
                        <div class="company-details-section">
                            <h3><i class="fas fa-code"></i> Required Skills</h3>
                            <div class="skills-container">
                                ${skillsHTML}
                            </div>
                        </div>
                    `;
                    
                    // Add positions section
                    const positions = company.positions || ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer'];
                    const positionsHTML = positions.map(position => `<li>${position}</li>`).join('');
                    
                    detailsHTML += `
                        <div class="company-details-section">
                            <h3><i class="fas fa-briefcase"></i> Open Positions</h3>
                            <ul class="positions-list">
                                ${positionsHTML}
                            </ul>
                        </div>
                    `;
                    
                    // Add company benefits section
                    detailsHTML += `
                        <div class="company-details-section">
                            <h3><i class="fas fa-gift"></i> Company Benefits</h3>
                            <ul class="benefits-list">
                                <li><i class="fas fa-check-circle"></i> Health Insurance</li>
                                <li><i class="fas fa-check-circle"></i> Professional Development</li>
                                <li><i class="fas fa-check-circle"></i> Flexible Work Hours</li>
                                <li><i class="fas fa-check-circle"></i> Performance Bonuses</li>
                            </ul>
                        </div>
                    `;
                    
                    // Set the modal content
                    modalCompanyBody.innerHTML = detailsHTML;
                    
                    // Display the modal
                    modal.style.display = 'block';
                });
            }
            
            // Add event listener for bookmark button
            const bookmarkBtn = companyCard.querySelector('.bookmark-btn');
            if (bookmarkBtn) {
                bookmarkBtn.addEventListener('click', function() {
                    this.classList.toggle('active');
                    this.classList.add('animate');
                    
                    setTimeout(() => {
                        this.classList.remove('animate');
                    }, 400);
                    
                    if (this.classList.contains('active')) {
                        this.innerHTML = '<i class="fas fa-bookmark"></i>';
                    } else {
                        this.innerHTML = '<i class="far fa-bookmark"></i>';
                    }
                });
            }
            
            // Add to grid
            if (companySuggestionsGrid) {
                companySuggestionsGrid.appendChild(companyCard);
            }
        });
    };
    
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
    
    // Helper function to get icon for work type
    function getTypeIcon(type) {
        const typeIcons = {
            'In-Office': 'fas fa-building',
            'Remote': 'fas fa-home',
            'Hybrid': 'fas fa-laptop-house',
            'Contract': 'fas fa-file-contract',
            'Internship': 'fas fa-graduation-cap'
        };
        
        return typeIcons[type] || 'fas fa-briefcase';
    }
    
    // Helper function to get icon for domain
    function getDomainIcon(domain) {
        const domainIcons = {
            'Software': 'fas fa-code',
            'IT Services': 'fas fa-server',
            'Web Development': 'fas fa-globe',
            'Mobile Development': 'fas fa-mobile-alt',
            'Data Science': 'fas fa-chart-bar',
            'Machine Learning': 'fas fa-brain',
            'Cloud Computing': 'fas fa-cloud',
            'Cybersecurity': 'fas fa-shield-alt',
            'DevOps': 'fas fa-cogs',
            'E-commerce': 'fas fa-shopping-cart',
            'AI': 'fas fa-robot',
            'Supply Chain': 'fas fa-truck',
            'Cloud': 'fas fa-cloud',
            'AWS': 'fab fa-aws'
        };
        
        return domainIcons[domain] || 'fas fa-laptop-code';
    }
    
    // Also update the trending company cards
    function updateTrendingCompanyCards() {
        const trendingCompanyCards = document.querySelectorAll('.trending-company-card');
        if (trendingCompanyCards.length === 0) return;
        
        // Get the carousel container
        let carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;
        
        // Apply the new CSS to the carousel container
        carouselContainer.style.padding = '10px';
        carouselContainer.style.gap = '20px';
        
        // Sample trending companies data
        const trendingCompanies = [
            {
                id: 1,
                name: 'TCS',
                domain: 'IT Services',
                type: 'Hybrid',
                location: 'Mumbai',
                salary: '8',
                matchScore: 75,
                logo: 'https://logo.clearbit.com/tcs.com'
            },
            {
                id: 2,
                name: 'Infosys',
                domain: 'IT Services',
                type: 'In-Office',
                location: 'Pune',
                salary: '7',
                matchScore: 72,
                logo: 'https://logo.clearbit.com/infosys.com'
            },
            {
                id: 3,
                name: 'Wipro',
                domain: 'IT Services',
                type: 'Hybrid',
                location: 'Bangalore',
                salary: '7',
                matchScore: 70,
                logo: 'https://logo.clearbit.com/wipro.com'
            }
        ];
        
        // Clear existing cards and add CSS class
        carouselContainer.innerHTML = '';
        carouselContainer.classList.add('minimalist-cards');
        
        trendingCompanies.forEach(company => {
                const companyCard = document.createElement('div');
                companyCard.className = 'company-card';
                
                // Determine if company is new or trending (for badge)
                const isNew = company.id === 3; // Make Wipro "new" for demo
                const isTrending = company.id === 1; // Make TCS "trending" for demo
                
                // Badge HTML
                let badgeHTML = '';
                if (isNew) {
                    badgeHTML = `<div class="company-badge new"><i class="fas fa-certificate"></i> New</div>`;
                } else if (isTrending) {
                    badgeHTML = `<div class="company-badge"><i class="fas fa-fire"></i> Trending</div>`;
                }
                
                // Generate tag icons based on type
                const typeIcon = getTypeIcon(company.type);
                const domainIcon = getDomainIcon(company.domain);
                
                companyCard.innerHTML = `
                    <h2 class="company-title">${company.name}</h2>
                    <span class="company-tag-badge">${company.domain}</span>
                    
                    <div class="company-info-list">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${company.location}</span>
                        </div>
                        <div class="info-item">
                            <i class="far fa-calendar-alt"></i>
                            <span>${company.type}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-rupee-sign"></i>
                            <span>${company.salary} LPA</span>
                        </div>
                    </div>
                    
                    <div class="company-description">
                        A leading company in the ${company.domain} sector offering exciting career opportunities.
                    </div>
                    
                    <div class="company-actions">
                        <button class="bookmark-btn">
                            <i class="far fa-bookmark"></i>
                        </button>
                        <button class="view-details-btn">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    <div class="match-score" style="display:none;">${company.matchScore}%</div>
                `;
                
                // Add event listeners for buttons
                const bookmarkBtn = companyCard.querySelector('.bookmark-btn');
                if (bookmarkBtn) {
                    bookmarkBtn.addEventListener('click', function() {
                        this.classList.toggle('active');
                        this.classList.add('animate');
                        
                        setTimeout(() => {
                            this.classList.remove('animate');
                        }, 400);
                        
                        if (this.classList.contains('active')) {
                            this.innerHTML = '<i class="fas fa-bookmark"></i>';
                        } else {
                            this.innerHTML = '<i class="far fa-bookmark"></i>';
                        }
                    });
                }
                
                carouselContainer.appendChild(companyCard);
            });
    }
    
    // Call the function to update trending company cards
    setTimeout(updateTrendingCompanyCards, 500);
    
    // Add CSS for trending companies section
    const style = document.createElement('style');
    style.textContent = `
        .carousel-container.minimalist-cards {
            padding: 10px;
            gap: 20px;
        }
        
        .carousel-container .company-card {
            min-width: 300px;
            margin: 0 10px;
        }
        
        .carousel-nav {
            background: rgba(33, 150, 243, 0.1);
            color: #2196f3;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .carousel-nav:hover {
            background: rgba(33, 150, 243, 0.2);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
    
    // Create sample companies for demonstration if needed
    function createSampleCompanies() {
        return [
            {
                id: 1,
                name: 'TCS',
                domain: 'IT Services',
                type: 'Hybrid',
                location: 'Mumbai',
                salary: '8-12',
                matchScore: 75,
                description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.',
                minCGPA: 7.0,
                skills: ['Java', 'Python', 'SQL', 'Cloud Computing'],
                positions: ['Software Engineer', 'System Analyst', 'Data Engineer']
            },
            {
                id: 2,
                name: 'Infosys',
                domain: 'IT Services',
                type: 'In-Office',
                location: 'Pune',
                salary: '7-10',
                matchScore: 72,
                description: 'Infosys is a global leader in next-generation digital services and consulting.',
                minCGPA: 6.5,
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                positions: ['Full Stack Developer', 'UI/UX Designer', 'QA Engineer']
            },
            {
                id: 3,
                name: 'Wipro',
                domain: 'IT Services',
                type: 'Hybrid',
                location: 'Bangalore',
                salary: '7-11',
                matchScore: 70,
                description: 'Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services.',
                minCGPA: 6.0,
                skills: ['C++', 'Java', 'AWS', 'DevOps'],
                positions: ['Software Developer', 'Cloud Engineer', 'Technical Support']
            }
        ];
    }
    
    // Demo function to show the redesigned cards
    window.showRedesignedCards = function() {
        const sampleCompanies = createSampleCompanies();
        window.displayCompanies(sampleCompanies);
    };
    
    // If the find companies button exists, attach our function
    const findCompaniesBtn = document.getElementById('find-companies-btn');
    if (findCompaniesBtn) {
        const originalClickHandler = findCompaniesBtn.onclick;
        findCompaniesBtn.onclick = function(e) {
            if (originalClickHandler) {
                originalClickHandler.call(this, e);
            }
            
            // After a slight delay to let the original handler run
            setTimeout(() => {
                // If there's a filterCompanies function, use it
                if (typeof filterCompanies === 'function') {
                    const filteredCompanies = filterCompanies();
                    window.displayCompanies(filteredCompanies);
                }
            }, 100);
        };
    }
});
