// Modern Card Design - Clean, Minimalist Style
document.addEventListener('DOMContentLoaded', () => {
    // Add the CSS file link to the head if not already present
    if (!document.querySelector('link[href="modern-card-design.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'modern-card-design.css';
        document.head.appendChild(link);
    }

    // Override the displayCompanies function to use our modern design
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

        // Generate modern company cards
        companies.forEach((company, index) => {
            const companyCard = document.createElement('div');
            companyCard.className = 'company-card';
            
            // Add company-specific class for styling
            const companyNameLower = company.name.toLowerCase();
            if (companyNameLower.includes('google')) {
                companyCard.classList.add('google-card');
            } else if (companyNameLower.includes('microsoft')) {
                companyCard.classList.add('microsoft-card');
            } else if (companyNameLower.includes('amazon')) {
                companyCard.classList.add('amazon-card');
            } else if (companyNameLower.includes('flipkart')) {
                companyCard.classList.add('flipkart-card');
            }
            
            // Get company description or use default
            let companyDescription = company.description || '';
            if (!companyDescription) {
                if (company.domain === 'Software Development' || companyNameLower.includes('google')) {
                    companyDescription = 'Crafts engaging, user-friendly software solutions.';
                } else if (company.domain === 'Cloud Computing' || companyNameLower.includes('microsoft')) {
                    companyDescription = 'Builds functional and scalable cloud solutions.';
                } else if (company.domain === 'E-commerce' || companyNameLower.includes('amazon') || companyNameLower.includes('flipkart')) {
                    companyDescription = 'Delivers innovative e-commerce and technology services.';
                } else {
                    companyDescription = 'Innovative technology solutions for modern businesses.';
                }
            }
            
            // Generate tags based on company domain and type
            let tags = [];
            
            // Domain-based tags
            if (company.domain === 'Software Development' || companyNameLower.includes('google')) {
                tags.push('Software Development', 'AI/ML', 'Cloud');
            } else if (company.domain === 'Cloud Computing' || companyNameLower.includes('microsoft')) {
                tags.push('Cloud Computing', 'Hybrid', 'Enterprise');
            } else if (company.domain === 'E-commerce' || companyNameLower.includes('amazon')) {
                tags.push('E-commerce', 'AWS', 'Logistics');
            } else if (companyNameLower.includes('flipkart')) {
                tags.push('E-commerce', 'Supply Chain', 'Fintech');
            } else {
                tags.push(company.domain || 'Technology', company.type || 'Hybrid');
            }
            
            // Generate HTML for tags
            const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            
            companyCard.innerHTML = `
                <div class="company-card-content">
                    <h2 class="company-title">${company.name}</h2>
                    <p class="company-description">${companyDescription}</p>
                    <div class="tag-container">
                        ${tagsHTML}
                    </div>
                    <button class="direct-view-btn" onclick="showCompanyDetails('${company.name}', '${company.domain || 'Technology'}', '${company.location || 'Multiple Locations'}', '${company.type || 'Hybrid'}', '${company.salary || '8-15'}')">
                        <span>View Details</span>
                        <span class="arrow-icon"><i class="fas fa-external-link-alt"></i></span>
                    </button>
                </div>
            `;
            
            // Add event listeners
            const exploreButton = companyCard.querySelector('.explore-button');
            if (exploreButton) {
                exploreButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Show company details modal
                    const modal = document.getElementById('company-details-modal');
                    if (modal) {
                        const modalCompanyName = document.getElementById('modal-company-name');
                        const modalMatchPercentage = document.getElementById('match-percentage');
                        
                        if (modalCompanyName) modalCompanyName.textContent = company.name;
                        if (modalMatchPercentage) modalMatchPercentage.textContent = `${company.matchScore || 85}%`;
                        
                        modal.style.display = 'flex';
                    }
                });
            }
            
            // Add to grid
            if (companySuggestionsGrid) {
                companySuggestionsGrid.appendChild(companyCard);
            }
        });
    };
    
    // Update trending companies section with modern cards
    function updateTrendingCompanies() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;
        
        // Clear existing content
        carouselContainer.innerHTML = '';
        
        // Sample trending companies data
        const trendingCompanies = [
            { name: 'Google', domain: 'Software Development', description: 'Crafts engaging, user-friendly software solutions.', location: 'Bangalore', matchScore: 95 },
            { name: 'Microsoft', domain: 'Cloud Computing', description: 'Builds functional and scalable cloud solutions.', location: 'Hyderabad', matchScore: 88 },
            { name: 'Amazon', domain: 'E-commerce', description: 'Delivers innovative retail and cloud computing services.', location: 'Bangalore', matchScore: 85 },
            { name: 'Flipkart', domain: 'E-commerce', description: 'India\'s leading e-commerce marketplace with nationwide reach.', location: 'Bangalore', matchScore: 82 }
        ];
        
        // Generate modern cards for trending companies
        trendingCompanies.forEach((company, index) => {
            const companyCard = document.createElement('div');
            companyCard.className = 'company-card';
            
            // Add company-specific class for styling
            const companyNameLower = company.name.toLowerCase();
            if (companyNameLower.includes('google')) {
                companyCard.classList.add('google-card');
            } else if (companyNameLower.includes('microsoft')) {
                companyCard.classList.add('microsoft-card');
            } else if (companyNameLower.includes('amazon')) {
                companyCard.classList.add('amazon-card');
            } else if (companyNameLower.includes('flipkart')) {
                companyCard.classList.add('flipkart-card');
            }
            
            // Generate tags based on company
            let tags = [];
            
            if (companyNameLower.includes('google')) {
                tags.push('Software Development', 'AI/ML', 'Cloud');
            } else if (companyNameLower.includes('microsoft')) {
                tags.push('Cloud Computing', 'Hybrid', 'Enterprise');
            } else if (companyNameLower.includes('amazon')) {
                tags.push('E-commerce', 'AWS', 'Logistics');
            } else if (companyNameLower.includes('flipkart')) {
                tags.push('E-commerce', 'Supply Chain', 'Fintech');
            }
            
            // Generate HTML for tags
            const tagsHTML = tags.map(tag => `<span class=\"tag\">${tag}</span>`).join('');
            
            companyCard.innerHTML = `
                <div class=\"company-card-content\">
                    <h2 class=\"company-title\">${company.name}</h2>
                    <p class=\"company-description\">${company.description}</p>
                    <div class=\"tag-container\">
                        ${tagsHTML}
                    </div>
                    <a href=\"#\" class=\"explore-button\">
                        <span>Explore</span>
                        <span class=\"arrow-icon\">→</span>
                    </a>
                </div>
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
            
            carouselContainer.appendChild(companyCard);
        });
        
        // Enhance carousel navigation
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        
        if (prevBtn && nextBtn && carouselContainer) {
            prevBtn.addEventListener('click', () => {
                carouselContainer.scrollBy({ left: -300, behavior: 'smooth' });
            });
            
            nextBtn.addEventListener('click', () => {
                carouselContainer.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    }
    
    // Add hover animations to company cards
    function addCardAnimations() {
        // Create a style element for the animations
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .company-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .company-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            }
            
            .explore-button .arrow-icon {
                transition: transform 0.3s ease;
            }
            
            .explore-button:hover .arrow-icon {
                transform: translateX(5px);
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Call functions to update UI
    setTimeout(() => {
        updateTrendingCompanies();
        addCardAnimations();
        
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
    }, 500);
    
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
    
    // Function to show company details in the modal
    window.showCompanyDetails = function(company) {
        const modal = document.getElementById('company-details-modal');
        const modalCompanyName = document.getElementById('modal-company-name');
        const modalCompanyBody = document.getElementById('modal-company-body');
        const matchPercentage = document.getElementById('match-percentage');
        const modalApplyBtn = document.getElementById('modal-apply-btn');
        
        if (!modal || !modalCompanyName || !modalCompanyBody) {
            console.error('Modal elements not found');
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
        
        // Add skills section if company has skills
        if (company.skills && company.skills.length > 0) {
            const skillsHTML = company.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
            detailsHTML += `
                <div class="company-details-section">
                    <h3><i class="fas fa-code"></i> Required Skills</h3>
                    <div class="skills-container">
                        ${skillsHTML}
                    </div>
                </div>
            `;
        } else {
            // Generate some default skills based on company domain
            let defaultSkills = [];
            if (company.domain === 'Software Development' || company.name.toLowerCase().includes('google')) {
                defaultSkills = ['Python', 'JavaScript', 'Cloud Computing', 'Data Structures'];
            } else if (company.domain === 'Cloud Computing' || company.name.toLowerCase().includes('microsoft')) {
                defaultSkills = ['Azure', 'AWS', 'DevOps', 'System Architecture'];
            } else if (company.domain === 'E-commerce' || company.name.toLowerCase().includes('amazon')) {
                defaultSkills = ['Supply Chain', 'Data Analysis', 'Customer Experience', 'Operations'];
            } else {
                defaultSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Technical Skills'];
            }
            
            const skillsHTML = defaultSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
            detailsHTML += `
                <div class="company-details-section">
                    <h3><i class="fas fa-code"></i> Preferred Skills</h3>
                    <div class="skills-container">
                        ${skillsHTML}
                    </div>
                </div>
            `;
        }
        
        // Add positions section
        if (company.positions && company.positions.length > 0) {
            const positionsHTML = company.positions.map(position => `<li>${position}</li>`).join('');
            detailsHTML += `
                <div class="company-details-section">
                    <h3><i class="fas fa-briefcase"></i> Open Positions</h3>
                    <ul class="positions-list">
                        ${positionsHTML}
                    </ul>
                </div>
            `;
        } else {
            // Generate some default positions
            detailsHTML += `
                <div class="company-details-section">
                    <h3><i class="fas fa-briefcase"></i> Open Positions</h3>
                    <ul class="positions-list">
                        <li>Software Engineer</li>
                        <li>Product Manager</li>
                        <li>Data Analyst</li>
                        <li>UX Designer</li>
                    </ul>
                </div>
            `;
        }
        
        // Set the modal content
        modalCompanyBody.innerHTML = detailsHTML;
        
        // Update apply button if needed
        if (modalApplyBtn) {
            modalApplyBtn.onclick = function() {
                alert(`Application submitted for ${company.name}!`);
                // Here you could redirect to an application form or process the application
            };
        }
        
        // Display the modal
        modal.style.display = 'block';
    };
});
