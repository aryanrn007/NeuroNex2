document.addEventListener('DOMContentLoaded', () => {
    // Header Elements (specific IDs for this page)
    const loggedInUserNameDisplaySugg = document.getElementById('loggedInUserNameSugg');
    const logoutButtonSugg = document.getElementById('logout-buttonSugg');
    const themeToggleBtnSugg = document.getElementById('theme-toggleSugg');
    
    // Company Suggestion Elements
    const companySuggestionsGrid = document.getElementById('company-suggestions-grid');
    const domainFilterSelect = document.getElementById('domain-filter');
    const locationFilterInput = document.getElementById('location-filter');
    const typeFilterSelect = document.getElementById('type-filter');
    const findCompaniesBtn = document.getElementById('find-companies-btn');
    const studentCGPADisplayFilter = document.getElementById('student-cgpa-display-filter');

    // Modal Elements
    const companyDetailsModal = document.getElementById('company-details-modal');
    const closeModalBtn = document.getElementById('close-company-modal');
    const modalCompanyLogo = document.getElementById('modal-company-logo');
    const modalCompanyName = document.getElementById('modal-company-name');
    const modalCompanyBody = document.getElementById('modal-company-body');
    const modalApplyLink = document.getElementById('modal-apply-link');

    let loggedInStudent = null;
    let allCompanyOpportunitiesData = []; // Store fetched company data

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

        if (loggedInUserNameDisplaySugg) {
            loggedInUserNameDisplaySugg.textContent = `Hi, ${loggedInStudent.fullName.split(' ')[0]}!`;
        }
         if (studentCGPADisplayFilter && loggedInStudent.cgpa) {
             studentCGPADisplayFilter.textContent = loggedInStudent.cgpa.toFixed(2);
         }
        return true;
    }

    if (!setupPageForUser()) return;

    const currentThemeSugg = localStorage.getItem('theme');
    if (currentThemeSugg === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtnSugg) themeToggleBtnSugg.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        if (themeToggleBtnSugg) themeToggleBtnSugg.innerHTML = '<i class="fas fa-sun"></i>';
    }
    if (themeToggleBtnSugg) {
        themeToggleBtnSugg.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            themeToggleBtnSugg.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', theme);
        });
    }
    if (logoutButtonSugg) {
        logoutButtonSugg.addEventListener('click', () => {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
        });
    }

    // --- Company Suggestion Logic (Copied and adapted from original script.js) ---
    async function loadAndProcessInitialCompanyData() {
        if (!companySuggestionsGrid) return;
        try {
            const response = await fetch('data/company_opportunities.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allCompanyOpportunitiesData = await response.json();
            populateDomainFilterFromOpportunities(allCompanyOpportunitiesData);
            // Trigger initial display with student's CGPA and no other filters
            if (loggedInStudent) {
                const companies = getFilteredCompanies(loggedInStudent.cgpa);
                displayCompanySuggestions(companies);
            } else {
                if(companySuggestionsGrid) companySuggestionsGrid.innerHTML = '<p class="no-suggestions">User data not found. Please log in again.</p>';
            }
        } catch (error) {
            console.error("Error loading company_opportunities.json:", error);
            if(companySuggestionsGrid) companySuggestionsGrid.innerHTML = `<p class="no-suggestions">Error loading company data: ${error.message}</p>`;
        }
    }
    
    function populateDomainFilterFromOpportunities(opportunities) {
        if (!domainFilterSelect || !opportunities) return;
        const allDomains = new Set();
        if (opportunities.length > 0) {
            opportunities.forEach(company => (company.techStackOrDomain || []).forEach(domain => allDomains.add(domain)));
        } else { 
            ["Web Development", "Machine Learning", "Cybersecurity", "Cloud Computing", "Data Analysis", "Mobile Development"].forEach(d => allDomains.add(d));
        }
        const currentDomainValue = domainFilterSelect.value;
        domainFilterSelect.innerHTML = '<option value="">All Domains</option>';
        allDomains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain; option.textContent = domain;
            domainFilterSelect.appendChild(option);
        });
        if (currentDomainValue && Array.from(domainFilterSelect.options).some(opt => opt.value === currentDomainValue)) {
            domainFilterSelect.value = currentDomainValue;
        }
    }

    function getFilteredCompanies(studentCGPA, domain = "", location = "", type = "") {
        if (!allCompanyOpportunitiesData || allCompanyOpportunitiesData.length === 0) return [];
        return allCompanyOpportunitiesData.filter(company => {
            const cgpaMatch = studentCGPA >= company.minCGPA;
            const domainMatch = domain === "" || (company.techStackOrDomain && company.techStackOrDomain.some(d => d.toLowerCase().includes(domain.toLowerCase())));
            const locationMatch = location === "" || (company.location && company.location.toLowerCase().includes(location.toLowerCase()));
            const typeMatch = type === "" || (company.type && company.type.toLowerCase() === type.toLowerCase());
            return cgpaMatch && domainMatch && locationMatch && typeMatch;
        });
    }

    function displayCompanySuggestions(companies) {
        if (!companySuggestionsGrid) return;
        companySuggestionsGrid.innerHTML = '';
        if (!companies || companies.length === 0) {
            companySuggestionsGrid.innerHTML = '<p class="no-suggestions">No companies match your current criteria. Try broadening your search!</p>'; return;
        }
        companies.forEach(company => {
            const card = document.createElement('div'); card.className = 'company-card';
            card.innerHTML = `
                <div class="company-card-header">
                    <img src="${company.logoUrl || 'https://via.placeholder.com/50/CCCCCC/FFFFFF?text=C'}" alt="${company.companyName} Logo">
                    <h3>${company.companyName}</h3>
                </div>
                <p><strong>Min. CGPA:</strong> ${company.minCGPA ? company.minCGPA.toFixed(1) : 'N/A'}</p>
                <p><strong>Roles:</strong> ${(company.rolesOffered || []).join(', ')}</p>
                <p><strong>Location:</strong> ${company.location || 'N/A'} (${company.type || 'N/A'})</p>
                <p><strong>Focus:</strong></p>
                <div class="tags">${(company.techStackOrDomain || []).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                <p>${company.description || 'No description available.'}</p>
                <button class="apply-button juno-button" data-company-id="${company.id}">Show Role Details</button>`;
            companySuggestionsGrid.appendChild(card);
            const viewCareersBtn = card.querySelector('.apply-button');
            if (viewCareersBtn) {
                viewCareersBtn.addEventListener('click', () => showCompanyDetailsModal(company));
            }
        });
    }

    if (findCompaniesBtn) {
        findCompaniesBtn.addEventListener('click', () => {
            if (loggedInStudent) {
                const domain = domainFilterSelect ? domainFilterSelect.value : "";
                const loc = locationFilterInput ? locationFilterInput.value.trim() : "";
                const type = typeFilterSelect ? typeFilterSelect.value : "";
                const companies = getFilteredCompanies(loggedInStudent.cgpa, domain, loc, type);
                displayCompanySuggestions(companies);
            } else if (companySuggestionsGrid) {
                companySuggestionsGrid.innerHTML = '<p class="no-suggestions">Please log in.</p>';
            }
        });
    }
    
    // Modal Functions (Copied from original script.js, ensure they are present)
    function showCompanyDetailsModal(company) {
        if (!companyDetailsModal || !company) return;
        if(modalCompanyLogo) modalCompanyLogo.src = company.logoUrl || 'https://via.placeholder.com/60/CCCCCC/FFFFFF?text=C';
        if(modalCompanyLogo) modalCompanyLogo.alt = `${company.companyName} Logo`;
        if(modalCompanyName) modalCompanyName.textContent = company.companyName;
        if(modalCompanyBody) {
            let modalBodyHTML = '<h3>Roles Offered:</h3><ul>';
            if (company.rolesOffered && company.rolesOffered.length > 0) {
                company.rolesOffered.forEach(role => { modalBodyHTML += `<li><strong>${role}</strong></li>`; });
            } else { modalBodyHTML += '<li>No specific roles listed.</li>'; }
            modalBodyHTML += '</ul>';
            if (company.techStackOrDomain && company.techStackOrDomain.length > 0) {
                 modalBodyHTML += `<h3>Key Skills/Domains:</h3><div class="tags">${company.techStackOrDomain.map(tag => `<span class="tag">${tag}</span>`).join('')}</div><br>`;
            } else { modalBodyHTML += `<h3>Key Skills/Domains:</h3><p>Not specified.</p><br>`; }
            if (company.description) { modalBodyHTML += `<h3>Description:</h3><p>${company.description}</p>`; }
            modalBodyHTML += `
                <h3>Why Join ${company.companyName}? (Simulated)</h3>
                <p>We foster innovation and collaboration, empowering employees to grow and make an impact. Our projects are at the forefront of the ${company.techStackOrDomain && company.techStackOrDomain.length > 0 ? company.techStackOrDomain[0] : 'relevant'} domain.</p>
                <h3>Application Process (Simulated):</h3>
                <ol style="padding-left: 20px; margin-bottom: 1rem;"><li>Submit application.</li><li>Online Assessment.</li><li>Technical Interview(s).</li><li>HR/Managerial Round.</li><li>Offer.</li></ol>
                <p><em>We encourage eligible candidates passionate about ${company.techStackOrDomain && company.techStackOrDomain.length > 0 ? company.techStackOrDomain.join(', ') : 'these fields'} to apply!</em></p>`;
            modalCompanyBody.innerHTML = modalBodyHTML;
        }
        if(modalApplyLink) modalApplyLink.href = company.applicationLink || '#';
        if(modalApplyLink) modalApplyLink.textContent = `Visit ${company.companyName} Careers`;
        
        // Enhanced modal display with animations
        companyDetailsModal.style.display = 'block';
        // Trigger a reflow before adding the active class for the animation to work
        companyDetailsModal.offsetHeight;
        companyDetailsModal.classList.add('active');
    }

    function hideCompanyDetailsModal() {
        if (companyDetailsModal) {
            companyDetailsModal.classList.remove('active');
            // Wait for the animation to complete before hiding the modal
            setTimeout(() => {
                companyDetailsModal.style.display = 'none';
            }, 300); // Match this with the CSS transition duration
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideCompanyDetailsModal);
    window.addEventListener('click', (event) => {
        if (event.target === companyDetailsModal) hideCompanyDetailsModal();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && companyDetailsModal && companyDetailsModal.style.display === 'block') {
            hideCompanyDetailsModal();
        }
    });

    // Initial Load for this page
    loadAndProcessInitialCompanyData();

    // Settings Panel Functionality for Suggestions
    function initializeSettingsSugg() {
        const settingsButton = document.getElementById('settings-buttonSugg');
        const settingsPanel = document.getElementById('settings-panelSugg');
        const closeSettingsBtn = document.getElementById('close-settingsSugg');
        const themeOptions = settingsPanel ? settingsPanel.querySelectorAll('.theme-option') : [];
        if (!settingsButton || !settingsPanel || !closeSettingsBtn) return;

        function openSettings(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            settingsPanel.style.display = 'block';
            settingsPanel.offsetHeight;
            settingsPanel.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        function closeSettings(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            settingsPanel.classList.remove('show');
            document.body.style.overflow = '';
        }
        function setTheme(theme) {
            if (!theme) return;
            themeOptions.forEach(option => option.classList.remove('active'));
            const selectedOption = settingsPanel.querySelector(`.theme-option[data-theme="${theme}"]`);
            if (selectedOption) selectedOption.classList.add('active');
            document.body.classList.remove('dark-mode', 'office-mode', 'aroma-mode');
            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.toggle('dark-mode', prefersDark);
            } else if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else if (theme === 'office') {
                document.body.classList.add('office-mode');
            }
            localStorage.setItem('theme', theme);
        }
        settingsButton.addEventListener('click', openSettings, { capture: true });
        closeSettingsBtn.addEventListener('click', closeSettings, { capture: true });
        document.addEventListener('click', (e) => {
            if (settingsPanel.classList.contains('show') && !settingsPanel.contains(e.target) && e.target !== settingsButton) {
                closeSettings();
            }
        }, { capture: true });
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const theme = option.dataset.theme;
                if (theme) setTheme(theme);
            }, { capture: true });
        });
        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
        if (savedTheme === 'system') {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                document.body.classList.toggle('dark-mode', e.matches);
            });
        }
        if (settingsPanel.classList.contains('show')) {
            settingsPanel.style.display = 'block';
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSettingsSugg);
    } else {
        initializeSettingsSugg();
    }
    window.addEventListener('load', initializeSettingsSugg);
});