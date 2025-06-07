// Resume Builder JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user data
    const userData = {
        name: '',
        email: '',
        phone: '',
        location: '',
        education: [],
        skills: [],
        projects: [],
        experience: []
    };

    // DOM Elements
    const sectionLinks = document.querySelectorAll('.sections-navigator li');
    const sectionContainers = document.querySelectorAll('.section-container');
    const templateOptions = document.querySelectorAll('.template-option');
    const resumeDocument = document.getElementById('resume-preview-content');
    const aiSuggestionsBtn = document.getElementById('ai-suggestions-btn');
    const aiSuggestionsModal = document.getElementById('ai-suggestions-modal');
    const closeSuggestionModal = aiSuggestionsModal.querySelector('.close-modal');
    const aiAnalyzing = document.querySelector('.ai-analyzing');
    const aiResults = document.querySelector('.ai-results');
    const autoFillBtn = document.getElementById('auto-fill-btn');
    const linkedinImportBtn = document.getElementById('linkedin-import-btn');
    const downloadPdfBtn = document.getElementById('download-pdf');
    const downloadDocxBtn = document.getElementById('download-docx');
    const saveVersionBtn = document.getElementById('save-version');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
    const addEntryBtns = document.querySelectorAll('.add-entry-btn');
    const skillChips = document.querySelectorAll('.skill-chip');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const applySuggestionBtns = document.querySelectorAll('.apply-suggestion');
    
    // Display username if logged in
    const loggedInUserName = document.getElementById('loggedInUserName');
    if (loggedInUserName) {
        const username = localStorage.getItem('username');
        if (username) {
            loggedInUserName.textContent = username;
        }
    }

    // Section Navigation
    sectionLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            
            // Update active section link
            sectionLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            sectionContainers.forEach(container => {
                container.classList.add('hidden');
                if (container.id === `${sectionName}-section`) {
                    container.classList.remove('hidden');
                }
            });
            
            // Update preview to focus on the selected section
            updatePreview();
        });
    });

    // Template Selection
    templateOptions.forEach(option => {
        option.addEventListener('click', function() {
            const templateName = this.getAttribute('data-template');
            
            // Update active template
            templateOptions.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Update resume preview template
            resumeDocument.className = `resume-document ${templateName}`;
            
            // Show notification for template change
            showNotification(`${templateName.charAt(0).toUpperCase() + templateName.slice(1)} template selected`, 'info');
            
            // Update preview with a slight delay to ensure template changes are applied
            setTimeout(updatePreview, 100);
        });
    });

    // AI Suggestions Modal
    aiSuggestionsBtn.addEventListener('click', function() {
        aiSuggestionsModal.style.display = 'block';
        aiAnalyzing.classList.remove('hidden');
        aiResults.classList.add('hidden');
        
        // Simulate AI analysis
        setTimeout(() => {
            aiAnalyzing.classList.add('hidden');
            aiResults.classList.remove('hidden');
        }, 2000);
    });

    closeSuggestionModal.addEventListener('click', function() {
        aiSuggestionsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === aiSuggestionsModal) {
            aiSuggestionsModal.style.display = 'none';
        }
    });

    // Auto-fill from Juno data
    autoFillBtn.addEventListener('click', function() {
        // Simulate fetching user data from Juno's database
        fetchJunoUserData()
            .then(data => {
                populateFormWithJunoData(data);
                showNotification('Resume data auto-filled from Juno', 'success');
            })
            .catch(error => {
                console.error('Error fetching Juno data:', error);
                showNotification('Could not fetch data from Juno', 'error');
            });
    });

    // LinkedIn Import
    linkedinImportBtn.addEventListener('click', function() {
        showNotification('LinkedIn import feature coming soon', 'info');
    });

    // Download as PDF
    downloadPdfBtn.addEventListener('click', function() {
        generatePDF();
    });

    // Download as DOCX
    downloadDocxBtn.addEventListener('click', function() {
        generateDOCX();
    });

    // Save Version
    saveVersionBtn.addEventListener('click', function() {
        saveCurrentVersion();
        showNotification('Resume version saved successfully', 'success');
    });

    // Toggle Dark Mode
    toggleDarkModeBtn.addEventListener('click', function() {
        resumeDocument.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (resumeDocument.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });

    // Add Entry buttons
    addEntryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.parentElement.id;
            addNewEntry(sectionId);
        });
    });

    // Skill Chips
    skillChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            const technicalSkillsInput = document.getElementById('technicalSkills');
            
            if (technicalSkillsInput.value) {
                if (!technicalSkillsInput.value.includes(skill)) {
                    technicalSkillsInput.value += `, ${skill}`;
                }
            } else {
                technicalSkillsInput.value = skill;
            }
            
            updatePreview();
        });
    });

    // Suggestion Chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const suggestion = this.textContent;
            const objectiveTextarea = document.getElementById('objective');
            
            if (objectiveTextarea.value) {
                objectiveTextarea.value += ` ${suggestion}.`;
            } else {
                objectiveTextarea.value = `${suggestion}.`;
            }
            
            updatePreview();
        });
    });

    // Apply Suggestion buttons
    applySuggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const suggestionText = this.previousElementSibling.textContent;
            applySuggestion(suggestionText);
            this.parentElement.classList.add('applied');
            this.textContent = 'Applied';
            this.disabled = true;
            
            showNotification('Suggestion applied', 'success');
        });
    });

    // Form input event listeners for live preview
    document.addEventListener('input', function(e) {
        // Check if the input is part of the resume form
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Delay update slightly to ensure all changes are captured
            setTimeout(updatePreview, 100);
        }
    });
    
    // Also update preview when sections change
    sectionLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(updatePreview, 100);
        });
    });

    // Helper Functions
    function updatePreview() {
        // Get form data
        const formData = getFormData();
        
        // Generate preview HTML based on selected template
        const template = document.querySelector('.template-option.active').getAttribute('data-template');
        const previewHTML = generateResumeHTML(formData, template);
        
        // Update preview content
        resumeDocument.innerHTML = previewHTML;
        
        // Log update for debugging
        console.log('Preview updated with:', formData.personal.name);
    }

    function getFormData() {
        return {
            personal: {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
                portfolio: document.getElementById('portfolio').value,
                linkedin: document.getElementById('linkedin').value,
                github: document.getElementById('github').value
            },
            objective: document.getElementById('objective').value,
            education: {
                institution: document.getElementById('institution').value,
                degree: document.getElementById('degree').value,
                startDate: document.getElementById('eduStartDate').value,
                endDate: document.getElementById('eduEndDate').value,
                gpa: document.getElementById('gpa').value,
                coursework: document.getElementById('coursework').value
            },
            experience: {
                company: document.getElementById('company').value,
                position: document.getElementById('position').value,
                startDate: document.getElementById('expStartDate').value,
                endDate: document.getElementById('expEndDate').value,
                current: document.getElementById('currentJob').checked,
                responsibilities: document.getElementById('responsibilities').value
            },
            skills: {
                technical: document.getElementById('technicalSkills').value,
                soft: document.getElementById('softSkills').value,
                tools: document.getElementById('tools').value
            },
            projects: {
                title: document.getElementById('projectTitle').value,
                date: document.getElementById('projectDate').value,
                description: document.getElementById('projectDescription').value,
                technologies: document.getElementById('projectTechnologies').value,
                link: document.getElementById('projectLink').value
            },
            certifications: {
                name: document.getElementById('certificationName').value,
                issuer: document.getElementById('issuingOrganization').value,
                date: document.getElementById('certDate').value,
                expiry: document.getElementById('certExpiry').value,
                id: document.getElementById('certificationId').value,
                url: document.getElementById('certificationUrl').value
            },
            achievements: {
                title: document.getElementById('achievementTitle').value,
                date: document.getElementById('achievementDate').value,
                issuer: document.getElementById('achievementIssuer').value,
                description: document.getElementById('achievementDescription').value
            }
        };
    }

    function generateResumeHTML(data, template) {
        // Check if we have any data to display
        const hasData = data.personal.name || data.personal.email || data.personal.phone || 
                      data.personal.location || data.objective || 
                      data.education.institution || data.education.degree;
                      
        // If no data is entered yet, show placeholder
        if (!hasData) {
            return `
                <div class="resume-preview-placeholder">
                    <div class="resume-header-placeholder"></div>
                    <div class="resume-body-placeholder">
                        <div class="placeholder-section"></div>
                        <div class="placeholder-section"></div>
                        <div class="placeholder-section"></div>
                    </div>
                </div>
            `;
        }
        
        // Log data to console for debugging
        console.log('Preview data:', data);

        // Generate HTML based on template
        let html = '';
        
        if (template === 'professional') {
            html = generateProfessionalTemplate(data);
        } else if (template === 'modern') {
            html = generateModernTemplate(data);
        } else if (template === 'creative') {
            html = generateCreativeTemplate(data);
        }
        
        return html;
    }

    function generateProfessionalTemplate(data) {
        let html = `
            <div class="professional-resume">
                <div class="resume-header">
                    <h1>${data.personal.name || 'Your Name'}</h1>
                    <div class="contact-info">
        `;
        
        if (data.personal.email) html += `<span><i class="fas fa-envelope"></i> ${data.personal.email}</span>`;
        if (data.personal.phone) html += `<span><i class="fas fa-phone"></i> ${data.personal.phone}</span>`;
        if (data.personal.location) html += `<span><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</span>`;
        if (data.personal.linkedin) html += `<span><i class="fab fa-linkedin"></i> ${data.personal.linkedin}</span>`;
        if (data.personal.github) html += `<span><i class="fab fa-github"></i> ${data.personal.github}</span>`;
        
        html += `
                    </div>
                </div>
        `;
        
        // Objective Section
        if (data.objective) {
            html += `
                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${data.objective}</p>
                </div>
            `;
        }
        
        // Education Section
        if (data.education.institution || data.education.degree) {
            html += `
                <div class="resume-section">
                    <h2>Education</h2>
                    <div class="education-item">
                        <div class="edu-header">
                            <h3>${data.education.degree || 'Degree'}</h3>
                            <span class="date">${formatDate(data.education.startDate)} - ${formatDate(data.education.endDate)}</span>
                        </div>
                        <div class="institution">${data.education.institution || 'Institution'}</div>
            `;
            
            if (data.education.gpa) {
                html += `<div class="gpa">GPA: ${data.education.gpa}</div>`;
            }
            
            if (data.education.coursework) {
                html += `<div class="coursework"><strong>Relevant Coursework:</strong> ${data.education.coursework}</div>`;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Experience Section
        if (data.experience.company || data.experience.position) {
            html += `
                <div class="resume-section">
                    <h2>Experience</h2>
                    <div class="experience-item">
                        <div class="exp-header">
                            <h3>${data.experience.position || 'Position'}</h3>
                            <span class="date">
                                ${formatDate(data.experience.startDate)} - 
                                ${data.experience.current ? 'Present' : formatDate(data.experience.endDate)}
                            </span>
                        </div>
                        <div class="company">${data.experience.company || 'Company'}</div>
            `;
            
            if (data.experience.responsibilities) {
                const responsibilities = data.experience.responsibilities.split('\n').filter(item => item.trim());
                if (responsibilities.length > 0) {
                    html += `<ul class="responsibilities">`;
                    responsibilities.forEach(item => {
                        html += `<li>${item}</li>`;
                    });
                    html += `</ul>`;
                }
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Skills Section
        if (data.skills.technical || data.skills.soft || data.skills.tools) {
            html += `
                <div class="resume-section">
                    <h2>Skills</h2>
                    <div class="skills-container">
            `;
            
            if (data.skills.technical) {
                html += `
                    <div class="skill-category">
                        <h3>Technical Skills</h3>
                        <div class="skill-list">${formatSkills(data.skills.technical)}</div>
                    </div>
                `;
            }
            
            if (data.skills.soft) {
                html += `
                    <div class="skill-category">
                        <h3>Soft Skills</h3>
                        <div class="skill-list">${formatSkills(data.skills.soft)}</div>
                    </div>
                `;
            }
            
            if (data.skills.tools) {
                html += `
                    <div class="skill-category">
                        <h3>Tools & Technologies</h3>
                        <div class="skill-list">${formatSkills(data.skills.tools)}</div>
                    </div>
                `;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Projects Section
        if (data.projects.title || data.projects.description) {
            html += `
                <div class="resume-section">
                    <h2>Projects</h2>
                    <div class="project-item">
                        <div class="project-header">
                            <h3>${data.projects.title || 'Project Title'}</h3>
                            ${data.projects.date ? `<span class="date">${formatDate(data.projects.date)}</span>` : ''}
                        </div>
                        <p class="project-description">${data.projects.description || 'Project description'}</p>
            `;
            
            if (data.projects.technologies) {
                html += `<div class="project-tech"><strong>Technologies:</strong> ${data.projects.technologies}</div>`;
            }
            
            if (data.projects.link) {
                html += `<div class="project-link"><strong>Link:</strong> <a href="${data.projects.link}" target="_blank">${data.projects.link}</a></div>`;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Certifications Section
        if (data.certifications.name || data.certifications.issuer) {
            html += `
                <div class="resume-section">
                    <h2>Certifications</h2>
                    <div class="certification-item">
                        <div class="cert-header">
                            <h3>${data.certifications.name || 'Certification Name'}</h3>
                            ${data.certifications.date ? `<span class="date">${formatDate(data.certifications.date)}</span>` : ''}
                        </div>
                        <div class="cert-issuer">${data.certifications.issuer || 'Issuing Organization'}</div>
            `;
            
            if (data.certifications.id) {
                html += `<div class="cert-id"><strong>Credential ID:</strong> ${data.certifications.id}</div>`;
            }
            
            if (data.certifications.url) {
                html += `<div class="cert-url"><strong>Credential URL:</strong> <a href="${data.certifications.url}" target="_blank">${data.certifications.url}</a></div>`;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Achievements Section
        if (data.achievements.title || data.achievements.issuer) {
            html += `
                <div class="resume-section">
                    <h2>Achievements</h2>
                    <div class="achievement-item">
                        <div class="achievement-header">
                            <h3>${data.achievements.title || 'Achievement Title'}</h3>
                            ${data.achievements.date ? `<span class="date">${formatDate(data.achievements.date)}</span>` : ''}
                        </div>
                        <div class="achievement-issuer">${data.achievements.issuer || 'Issuing Organization'}</div>
            `;
            
            if (data.achievements.description) {
                html += `<p class="achievement-description">${data.achievements.description}</p>`;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
        
        return html;
    }

    function generateModernTemplate(data) {
        let html = `
            <div class="modern-resume">
                <div class="resume-header modern-header">
                    <h1>${data.personal.name || 'Your Name'}</h1>
                    <p class="job-title">${data.personal.jobTitle || ''}</p>
                    <div class="contact-info modern-contact">
        `;
        
        if (data.personal.email) html += `<span><i class="fas fa-envelope"></i> ${data.personal.email}</span>`;
        if (data.personal.phone) html += `<span><i class="fas fa-phone"></i> ${data.personal.phone}</span>`;
        if (data.personal.location) html += `<span><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</span>`;
        if (data.personal.linkedin) html += `<span><i class="fab fa-linkedin"></i> ${data.personal.linkedin}</span>`;
        if (data.personal.github) html += `<span><i class="fab fa-github"></i> ${data.personal.github}</span>`;
        if (data.personal.portfolio) html += `<span><i class="fas fa-globe"></i> ${data.personal.portfolio}</span>`;
        
        html += `
                    </div>
                </div>
                
                <div class="modern-content">
        `;
        
        // Two-column layout for modern template
        html += `<div class="modern-main-column">`;
        
        // Objective Section
        if (data.objective) {
            html += `
                <div class="resume-section modern-section">
                    <h2>Professional Summary</h2>
                    <div class="modern-section-content">
                        <p>${data.objective}</p>
                    </div>
                </div>
            `;
        }
        
        // Experience Section
        if (data.experience && (data.experience.company || data.experience.position)) {
            html += `
                <div class="resume-section modern-section">
                    <h2>Experience</h2>
                    <div class="modern-section-content">
                        <div class="experience-item">
                            <div class="item-header">
                                <h3>${data.experience.position || 'Position'}</h3>
                                <div class="company-name">${data.experience.company || 'Company'}</div>
                                <span class="date">${formatDate(data.experience.startDate)} - ${data.experience.current ? 'Present' : formatDate(data.experience.endDate)}</span>
                            </div>
                            <p class="description">${data.experience.description || ''}</p>
            `;
            
            if (data.experience.achievements) {
                const achievements = formatHighlights(data.experience.achievements);
                if (achievements.length > 0) {
                    html += `<ul class="achievements-list">`;
                    achievements.forEach(achievement => {
                        html += `<li>${achievement}</li>`;
                    });
                    html += `</ul>`;
                }
            }
            
            html += `
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Projects Section
        if (data.projects && (data.projects.name || data.projects.description)) {
            html += `
                <div class="resume-section modern-section">
                    <h2>Projects</h2>
                    <div class="modern-section-content">
                        <div class="project-item">
                            <div class="item-header">
                                <h3>${data.projects.name || 'Project Name'}</h3>
                                <span class="date">${formatDate(data.projects.startDate)} - ${formatDate(data.projects.endDate)}</span>
                            </div>
                            <p class="description">${data.projects.description || ''}</p>
            `;
            
            if (data.projects.technologies) {
                const technologies = formatSkills(data.projects.technologies);
                if (technologies.length > 0) {
                    html += `<div class="technologies">`;
                    technologies.forEach(tech => {
                        html += `<span class="technology-tag">${tech}</span>`;
                    });
                    html += `</div>`;
                }
            }
            
            html += `
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `</div>`; // End main column
        
        // Side column
        html += `<div class="modern-side-column">`;
        
        // Education Section
        if (data.education && (data.education.institution || data.education.degree)) {
            html += `
                <div class="resume-section modern-section">
                    <h2>Education</h2>
                    <div class="modern-section-content">
                        <div class="education-item">
                            <h3>${data.education.degree || 'Degree'}</h3>
                            <div class="institution">${data.education.institution || 'Institution'}</div>
                            <span class="date">${formatDate(data.education.startDate)} - ${formatDate(data.education.endDate)}</span>
                            ${data.education.gpa ? `<div class="gpa">GPA: ${data.education.gpa}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Skills Section
        if (data.skills && data.skills.technical) {
            html += `
                <div class="resume-section modern-section">
                    <h2>Skills</h2>
                    <div class="modern-section-content">
                        <div class="skills-container">
            `;
            
            const technicalSkills = formatSkills(data.skills.technical);
            if (technicalSkills.length > 0) {
                html += `<div class="skills-group">`;
                html += `<h4>Technical</h4>`;
                html += `<div class="skills-list">`;
                technicalSkills.forEach(skill => {
                    html += `<span class="skill-tag">${skill}</span>`;
                });
                html += `</div></div>`;
            }
            
            const softSkills = formatSkills(data.skills.soft);
            if (softSkills.length > 0) {
                html += `<div class="skills-group">`;
                html += `<h4>Soft Skills</h4>`;
                html += `<div class="skills-list">`;
                softSkills.forEach(skill => {
                    html += `<span class="skill-tag">${skill}</span>`;
                });
                html += `</div></div>`;
            }
            
            html += `
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Certifications Section
        if (data.certifications && data.certifications.name) {
            html += `
                <div class="resume-section modern-section">
                    <h2>Certifications</h2>
                    <div class="modern-section-content">
                        <div class="certification-item">
                            <h3>${data.certifications.name || 'Certification Name'}</h3>
                            <div class="issuer">${data.certifications.issuer || 'Issuing Organization'}</div>
                            ${data.certifications.date ? `<span class="date">${formatDate(data.certifications.date)}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `</div>`; // End side column
        html += `</div>`; // End modern-content
        html += `</div>`; // End modern-resume
        
        return html;
    }

    function generateCreativeTemplate(data) {
        let html = `
            <div class="creative-resume">
                <div class="creative-header">
                    <div class="header-content">
                        <h1>${data.personal.name || 'Your Name'}</h1>
                        <p class="tagline">${data.personal.jobTitle || 'Professional Title'}</p>
                    </div>
                    <div class="header-graphic"></div>
                </div>
                
                <div class="creative-sidebar">
                    <div class="sidebar-section contact-section">
                        <h2>Contact</h2>
                        <ul class="contact-list">
        `;
        
        if (data.personal.email) html += `<li><i class="fas fa-envelope"></i> <span>${data.personal.email}</span></li>`;
        if (data.personal.phone) html += `<li><i class="fas fa-phone"></i> <span>${data.personal.phone}</span></li>`;
        if (data.personal.location) html += `<li><i class="fas fa-map-marker-alt"></i> <span>${data.personal.location}</span></li>`;
        if (data.personal.linkedin) html += `<li><i class="fab fa-linkedin"></i> <span>${data.personal.linkedin}</span></li>`;
        if (data.personal.github) html += `<li><i class="fab fa-github"></i> <span>${data.personal.github}</span></li>`;
        if (data.personal.portfolio) html += `<li><i class="fas fa-globe"></i> <span>${data.personal.portfolio}</span></li>`;
        
        html += `
                        </ul>
                    </div>
                    
                    <div class="sidebar-section skills-section">
                        <h2>Skills</h2>
                        <div class="skills-container">
        `;
        
        // Skills with visual skill bars
        const technicalSkills = formatSkills(data.skills?.technical || '');
        if (technicalSkills.length > 0) {
            technicalSkills.forEach(skill => {
                // Generate random skill level for visual effect
                const skillLevel = Math.floor(Math.random() * 30) + 70; // 70-100%
                html += `
                    <div class="skill-item">
                        <span class="skill-name">${skill}</span>
                        <div class="skill-bar">
                            <div class="skill-level" style="width: ${skillLevel}%"></div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<p class="placeholder-text">Add your skills</p>`;
        }
        
        html += `
                        </div>
                    </div>
                    
                    <div class="sidebar-section education-section">
                        <h2>Education</h2>
        `;
        
        if (data.education && (data.education.institution || data.education.degree)) {
            html += `
                <div class="education-item">
                    <h3>${data.education.degree || 'Degree'}</h3>
                    <div class="institution">${data.education.institution || 'Institution'}</div>
                    <span class="date">${formatDate(data.education.startDate)} - ${formatDate(data.education.endDate)}</span>
                    ${data.education.gpa ? `<div class="gpa">GPA: ${data.education.gpa}</div>` : ''}
                </div>
            `;
        } else {
            html += `<p class="placeholder-text">Add your education</p>`;
        }
        
        html += `
                    </div>
                </div>
                
                <div class="creative-main">
        `;
        
        // About/Summary Section with decorative elements
        if (data.objective) {
            html += `
                <div class="main-section about-section">
                    <div class="section-header">
                        <div class="section-icon"><i class="fas fa-user"></i></div>
                        <h2>About Me</h2>
                    </div>
                    <div class="section-content">
                        <p>${data.objective}</p>
                    </div>
                </div>
            `;
        }
        
        // Experience Section
        html += `
            <div class="main-section experience-section">
                <div class="section-header">
                    <div class="section-icon"><i class="fas fa-briefcase"></i></div>
                    <h2>Experience</h2>
                </div>
                <div class="section-content">
        `;
        
        if (data.experience && (data.experience.company || data.experience.position)) {
            html += `
                <div class="experience-item">
                    <div class="timeline-dot"></div>
                    <div class="item-content">
                        <h3>${data.experience.position || 'Position'}</h3>
                        <div class="company-name">${data.experience.company || 'Company'}</div>
                        <span class="date">${formatDate(data.experience.startDate)} - ${data.experience.current ? 'Present' : formatDate(data.experience.endDate)}</span>
                        <p class="description">${data.experience.description || ''}</p>
            `;
            
            if (data.experience.achievements) {
                const achievements = formatHighlights(data.experience.achievements);
                if (achievements.length > 0) {
                    html += `<ul class="achievements-list">`;
                    achievements.forEach(achievement => {
                        html += `<li>${achievement}</li>`;
                    });
                    html += `</ul>`;
                }
            }
            
            html += `
                    </div>
                </div>
            `;
        } else {
            html += `<p class="placeholder-text">Add your work experience</p>`;
        }
        
        html += `
                </div>
            </div>
        `;
        
        // Projects Section with visual elements
        html += `
            <div class="main-section projects-section">
                <div class="section-header">
                    <div class="section-icon"><i class="fas fa-project-diagram"></i></div>
                    <h2>Projects</h2>
                </div>
                <div class="section-content">
        `;
        
        if (data.projects && (data.projects.name || data.projects.description)) {
            html += `
                <div class="project-item">
                    <div class="project-header">
                        <h3>${data.projects.name || 'Project Name'}</h3>
                        <span class="date">${formatDate(data.projects.startDate)} - ${formatDate(data.projects.endDate)}</span>
                    </div>
                    <p class="description">${data.projects.description || ''}</p>
            `;
            
            if (data.projects.technologies) {
                const technologies = formatSkills(data.projects.technologies);
                if (technologies.length > 0) {
                    html += `<div class="technologies">`;
                    technologies.forEach(tech => {
                        html += `<span class="technology-tag">${tech}</span>`;
                    });
                    html += `</div>`;
                }
            }
            
            html += `
                </div>
            `;
        } else {
            html += `<p class="placeholder-text">Add your projects</p>`;
        }
        
        html += `
                </div>
            </div>
        `;
        
        // Achievements Section
        if (data.achievements && data.achievements.title) {
            html += `
                <div class="main-section achievements-section">
                    <div class="section-header">
                        <div class="section-icon"><i class="fas fa-trophy"></i></div>
                        <h2>Achievements</h2>
                    </div>
                    <div class="section-content">
                        <div class="achievement-item">
                            <div class="achievement-icon"><i class="fas fa-award"></i></div>
                            <div class="achievement-content">
                                <h3>${data.achievements.title || 'Achievement Title'}</h3>
                                ${data.achievements.date ? `<span class="date">${formatDate(data.achievements.date)}</span>` : ''}
                                <p>${data.achievements.description || ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return as is if invalid date
        
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    }
    
    function formatHighlights(highlightsString) {
        if (!highlightsString) return [];
        
        // If it's already an array, return it
        if (Array.isArray(highlightsString)) return highlightsString;
        
        // Split by newlines or bullet points
        return highlightsString
            .split(/[\n\r•]+/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }

    function formatSkills(skillsString) {
        if (!skillsString) return '';
        
        const skills = skillsString.split(',').map(skill => skill.trim());
        return skills.map(skill => `<span class="skill">${skill}</span>`).join('');
    }

    function addNewEntry(sectionId) {
        // Clone the first entry in the section
        const section = document.getElementById(sectionId);
        const entryClass = sectionId.replace('-section', '-entry');
        const firstEntry = section.querySelector(`.${entryClass}`);
        const newEntry = firstEntry.cloneNode(true);
        
        // Clear input values
        const inputs = newEntry.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.value = '';
            if (input.type === 'checkbox') {
                input.checked = false;
            }
        });
        
        // Insert before the add button
        const addButton = section.querySelector('.add-entry-btn');
        section.insertBefore(newEntry, addButton);
        
        // Add event listeners to new inputs
        const newInputs = newEntry.querySelectorAll('input, textarea');
        newInputs.forEach(input => {
            input.addEventListener('input', updatePreview);
        });
    }

    function applySuggestion(suggestionText) {
        // Extract the target section and suggestion from the text
        const match = suggestionText.match(/\*\*(.*?):\*\*/);
        if (match) {
            const target = match[1].toLowerCase();
            
            if (target.includes('experience')) {
                document.getElementById('responsibilities').value = suggestionText.split('Consider:')[1].trim();
            } else if (target.includes('skills')) {
                // Add to technical skills
                const technicalSkills = document.getElementById('technicalSkills');
                technicalSkills.value += ', ' + suggestionText.split('e.g.,')[1].trim();
            } else if (target.includes('missing keywords')) {
                // Add keywords to skills
                const keywords = suggestionText.match(/"([^"]+)"/g).map(k => k.replace(/"/g, ''));
                const technicalSkills = document.getElementById('technicalSkills');
                technicalSkills.value += ', ' + keywords.join(', ');
            }
            
            updatePreview();
        }
    }

    function generatePDF() {
        // In a real implementation, this would use jsPDF or similar library
        showNotification('Generating PDF...', 'info');
        
        // Simulate PDF generation
        setTimeout(() => {
            showNotification('Resume downloaded as PDF', 'success');
        }, 1500);
    }

    function generateDOCX() {
        // In a real implementation, this would use a DOCX generation library
        showNotification('Generating DOCX...', 'info');
        
        // Simulate DOCX generation
        setTimeout(() => {
            showNotification('Resume downloaded as DOCX', 'success');
        }, 1500);
    }

    function saveCurrentVersion() {
        // In a real implementation, this would save to localStorage or a database
        const formData = getFormData();
        const timestamp = new Date().toISOString();
        
        // Simulate saving
        console.log('Saving resume version:', { timestamp, data: formData });
    }

    function fetchJunoUserData() {
        // Simulate API call to Juno's database
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock data that would come from Juno's database
                const mockData = {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+91 9876543210',
                    location: 'Mumbai, India',
                    education: {
                        institution: 'D.Y. Patil University',
                        degree: 'B.Tech in Computer Science',
                        startDate: '2021-08',
                        endDate: '2025-05',
                        gpa: '8.7/10',
                        coursework: 'Data Structures, Algorithms, Database Management, Web Development'
                    },
                    skills: {
                        technical: 'JavaScript, React.js, Node.js, MongoDB, Express.js, HTML/CSS',
                        soft: 'Team Collaboration, Problem Solving, Communication',
                        tools: 'Git, VS Code, Docker, AWS'
                    },
                    projects: [
                        {
                            title: 'E-commerce Platform',
                            date: '2024-03',
                            description: 'Developed a full-stack e-commerce platform with user authentication, product catalog, and payment integration',
                            technologies: 'React, Node.js, Express, MongoDB',
                            link: 'https://github.com/johndoe/ecommerce-platform'
                        }
                    ]
                };
                
                resolve(mockData);
            }, 1500);
        });
    }

    function populateFormWithJunoData(data) {
        // Personal Information
        document.getElementById('fullName').value = data.name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('location').value = data.location || '';
        
        // Education
        if (data.education) {
            document.getElementById('institution').value = data.education.institution || '';
            document.getElementById('degree').value = data.education.degree || '';
            document.getElementById('eduStartDate').value = data.education.startDate || '';
            document.getElementById('eduEndDate').value = data.education.endDate || '';
            document.getElementById('gpa').value = data.education.gpa || '';
            document.getElementById('coursework').value = data.education.coursework || '';
        }
        
        // Skills
        if (data.skills) {
            document.getElementById('technicalSkills').value = data.skills.technical || '';
            document.getElementById('softSkills').value = data.skills.soft || '';
            document.getElementById('tools').value = data.skills.tools || '';
        }
        
        // Projects (first project only for demo)
        if (data.projects && data.projects.length > 0) {
            const project = data.projects[0];
            document.getElementById('projectTitle').value = project.title || '';
            document.getElementById('projectDate').value = project.date || '';
            document.getElementById('projectDescription').value = project.description || '';
            document.getElementById('projectTechnologies').value = project.technologies || '';
            document.getElementById('projectLink').value = project.link || '';
        }
        
        // Update preview
        updatePreview();
    }

    function showNotification(message, type = 'info') {
        // Check if notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add styles if not already in the document
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 9999;
                    }
                    .notification {
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        padding: 12px 20px;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
                        max-width: 300px;
                    }
                    .notification.success { border-left: 4px solid #27ae60; }
                    .notification.error { border-left: 4px solid #e74c3c; }
                    .notification.info { border-left: 4px solid #3498db; }
                    .notification.warning { border-left: 4px solid #f39c12; }
                    
                    .notification-icon {
                        margin-right: 12px;
                        font-size: 18px;
                    }
                    .notification.success .notification-icon { color: #27ae60; }
                    .notification.error .notification-icon { color: #e74c3c; }
                    .notification.info .notification-icon { color: #3498db; }
                    .notification.warning .notification-icon { color: #f39c12; }
                    
                    .notification-message {
                        font-size: 14px;
                        color: #333;
                    }
                    
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Icon based on notification type
        let icon;
        switch (type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            default:
                icon = 'fa-info-circle';
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Remove after animation completes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize the first section and template
    sectionLinks[0].click();
    templateOptions[0].click();
    
    // Force initial preview update
    setTimeout(updatePreview, 500);
    
    // Debug helper - log when preview is updated
    console.log('Resume builder initialized');
});
