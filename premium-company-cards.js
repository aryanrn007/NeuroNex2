// Premium Company Cards - Modern, Elegant Design
document.addEventListener('DOMContentLoaded', () => {
    // Add the CSS file link to the head if not already present
    if (!document.querySelector('link[href="premium-company-cards.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'premium-company-cards.css';
        document.head.appendChild(link);
    }

    // Override the displayCompanies function to use our premium design
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

        // Generate premium company cards
        companies.forEach(company => {
            const companyCard = document.createElement('div');
            companyCard.className = 'company-card';
            
            // Add high-match class for companies with match score > 70%
            if (company.matchScore > 70) {
                companyCard.classList.add('high-match');
            }
            
            // Get company logo
            const logoUrl = getCompanyLogo(company);
            
            // Format match score for display
            const matchScore = company.matchScore || Math.floor(Math.random() * 30) + 70;
            
            // Get icons for info items
            const typeIcon = getTypeIcon(company.type);
            const domainIcon = getDomainIcon(company.domain);
            
            companyCard.innerHTML = `
                <div class="company-card-header">
                    <div class="company-logo">
                        ${logoUrl}
                    </div>
                    <div class="match-circle">
                        <span class="match-percentage">${matchScore}%</span>
                    </div>
                    <h2 class="company-title">${company.name}</h2>
                    <div class="company-tags">
                        <span class="company-tag">${company.domain}</span>
                        ${company.type ? `<span class="company-tag">${company.type}</span>` : ''}
                    </div>
                    <div class="location-badge">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${company.location}</span>
                    </div>
                </div>
                
                <div class="company-card-body">
                    <div class="company-info-list">
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <span>${company.domain}</span>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas ${typeIcon}"></i>
                            </div>
                            <span>${company.type || 'Hybrid'}</span>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-rupee-sign"></i>
                            </div>
                            <span>${company.salary || '10-20'} LPA</span>
                        </div>
                    </div>
                    
                    <div class="company-actions">
                        <button class="view-details-btn" data-company-id="${company.id || ''}">View Details</button>
                        <button class="bookmark-btn" data-company-id="${company.id || ''}">
                            <i class="far fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners for buttons
            const viewDetailsBtn = companyCard.querySelector('.view-details-btn');
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', () => {
                    // Show company details modal
                    const modal = document.getElementById('company-details-modal');
                    if (modal) {
                        const modalCompanyName = document.getElementById('modal-company-name');
                        const modalMatchPercentage = document.getElementById('match-percentage');
                        
                        if (modalCompanyName) modalCompanyName.textContent = company.name;
                        if (modalMatchPercentage) modalMatchPercentage.textContent = `${matchScore}%`;
                        
                        modal.style.display = 'flex';
                    }
                });
            }
            
            const bookmarkBtn = companyCard.querySelector('.bookmark-btn');
            if (bookmarkBtn) {
                bookmarkBtn.addEventListener('click', (e) => {
                    e.target.closest('.bookmark-btn').classList.toggle('active');
                    const icon = e.target.closest('.bookmark-btn').querySelector('i');
                    if (icon) {
                        icon.classList.toggle('far');
                        icon.classList.toggle('fas');
                    }
                    e.target.closest('.bookmark-btn').classList.add('animate');
                    setTimeout(() => {
                        e.target.closest('.bookmark-btn').classList.remove('animate');
                    }, 400);
                });
            }
            
            companySuggestionsGrid.appendChild(companyCard);
        });
    };

    // Helper function to get company logo or generate one
    function getCompanyLogo(company) {
        // Map of known company logos
        const logoMap = {
            'Google': 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
            'Microsoft': 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31',
            'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
            'Flipkart': 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png',
            'TCS': 'https://www.tcs.com/content/dam/global-tcs/en/images/home/dark-theme.svg',
            'Infosys': 'https://www.infosys.com/content/dam/infosys-web/en/global-resource/logos/infosys-logo.svg',
            'Wipro': 'https://www.wipro.com/content/dam/nexus/en/wipro-logo-new-og-502x263.jpg',
            'TATA': 'https://www.tata.com/content/dam/tata/images/home-page/desktop/logo_card_desktop_362x362.jpg'
        };
        
        if (company.name in logoMap) {
            return `<img src="${logoMap[company.name]}" alt="${company.name} Logo">`;
        } else {
            // Generate a text-based logo for unknown companies
            const initials = company.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
            const colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            return `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: ${randomColor}; color: white; font-weight: bold; font-size: 1.8rem;">${initials}</div>`;
        }
    }

    // Helper function to get icon for work type
    function getTypeIcon(type) {
        const typeIcons = {
            'Remote': 'fa-home',
            'In-Office': 'fa-building',
            'Hybrid': 'fa-laptop-house'
        };
        
        return typeIcons[type] || 'fa-laptop-house';
    }

    // Helper function to get icon for domain
    function getDomainIcon(domain) {
        const domainIcons = {
            'Software Development': 'fa-code',
            'Web Development': 'fa-globe',
            'Mobile Development': 'fa-mobile-alt',
            'Data Science': 'fa-chart-bar',
            'Machine Learning': 'fa-brain',
            'Cloud Computing': 'fa-cloud',
            'Cybersecurity': 'fa-shield-alt',
            'DevOps': 'fa-server',
            'IT Services': 'fa-laptop-code',
            'E-commerce': 'fa-shopping-cart'
        };
        
        return domainIcons[domain] || 'fa-briefcase';
    }

    // Update trending company cards with premium design
    function updateTrendingCompanyCards() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;
        
        // Clear existing cards
        carouselContainer.innerHTML = '';
        carouselContainer.classList.add('minimalist-cards');
        
        // Sample trending companies
        const trendingCompanies = [
            {
                name: 'Google',
                domain: 'Software Development',
                type: 'Hybrid',
                location: 'Bangalore',
                salary: '25',
                matchScore: 95
            },
            {
                name: 'Microsoft',
                domain: 'Cloud Computing',
                type: 'Hybrid',
                location: 'Hyderabad',
                salary: '20',
                matchScore: 88
            },
            {
                name: 'Amazon',
                domain: 'E-commerce',
                type: 'In-Office',
                location: 'Bangalore',
                salary: '18',
                matchScore: 85
            },
            {
                name: 'Flipkart',
                domain: 'E-commerce',
                type: 'In-Office',
                location: 'Bangalore',
                salary: '15',
                matchScore: 82
            },
            {
                name: 'TATA',
                domain: 'IT Services',
                type: 'Hybrid',
                location: 'Mumbai',
                salary: '12',
                matchScore: 75
            }
        ];
        
        // Create premium cards for trending companies
        trendingCompanies.forEach(company => {
            const companyCard = document.createElement('div');
            companyCard.className = 'company-card';
            
            // Get company logo
            const logoUrl = getCompanyLogo(company);
            
            companyCard.innerHTML = `
                <div class="company-card-header">
                    <div class="company-logo">
                        ${logoUrl}
                    </div>
                    <div class="match-circle">
                        <span class="match-percentage">${company.matchScore}%</span>
                    </div>
                    <h2 class="company-title">${company.name}</h2>
                    <div class="company-tags">
                        <span class="company-tag">${company.domain}</span>
                        <span class="company-tag">${company.type}</span>
                    </div>
                    <div class="location-badge">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${company.location}</span>
                    </div>
                </div>
                
                <div class="company-card-body">
                    <div class="company-info-list">
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <span>${company.domain}</span>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas ${getTypeIcon(company.type)}"></i>
                            </div>
                            <span>${company.type}</span>
                        </div>
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-rupee-sign"></i>
                            </div>
                            <span>${company.salary} LPA</span>
                        </div>
                    </div>
                    
                    <div class="company-actions">
                        <button class="view-details-btn">View Details</button>
                        <button class="bookmark-btn">
                            <i class="far fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const viewDetailsBtn = companyCard.querySelector('.view-details-btn');
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', () => {
                    // Show company details modal
                    const modal = document.getElementById('company-details-modal');
                    if (modal) {
                        const modalCompanyName = document.getElementById('modal-company-name');
                        const modalMatchPercentage = document.getElementById('match-percentage');
                        
                        if (modalCompanyName) modalCompanyName.textContent = company.name;
                        if (modalMatchPercentage) modalMatchPercentage.textContent = `${company.matchScore}%`;
                        
                        modal.style.display = 'flex';
                    }
                });
            }
            
            const bookmarkBtn = companyCard.querySelector('.bookmark-btn');
            if (bookmarkBtn) {
                bookmarkBtn.addEventListener('click', (e) => {
                    e.target.closest('.bookmark-btn').classList.toggle('active');
                    const icon = e.target.closest('.bookmark-btn').querySelector('i');
                    if (icon) {
                        icon.classList.toggle('far');
                        icon.classList.toggle('fas');
                    }
                });
            }
            
            carouselContainer.appendChild(companyCard);
        });
        
        // Enhance carousel navigation
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        
        if (prevBtn && nextBtn && carouselContainer) {
            prevBtn.addEventListener('click', () => {
                carouselContainer.scrollBy({ left: -350, behavior: 'smooth' });
            });
            
            nextBtn.addEventListener('click', () => {
                carouselContainer.scrollBy({ left: 350, behavior: 'smooth' });
            });
        }
    }
    
    // Call the function to update trending company cards
    setTimeout(updateTrendingCompanyCards, 500);
    
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
    
    // Close modal when clicking the close button
    const closeModalBtn = document.getElementById('close-company-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const modal = document.getElementById('company-details-modal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('company-details-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
