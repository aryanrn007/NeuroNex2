document.addEventListener('DOMContentLoaded', () => {
    const loggedInUserNameDisplaySS = document.getElementById('loggedInUserNameSS');
    const logoutButtonSS = document.getElementById('logout-buttonSS');
    const themeToggleBtnSS = document.getElementById('theme-toggleSS');

    const featuredCollaboratorsGrid = document.getElementById('featured-collaborators-grid');
    const skillSearchInput = document.getElementById('skill-search-input');
    const departmentFilterSelect = document.getElementById('department-filter');
    const availabilityFilterSelect = document.getElementById('availability-filter');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const teamMembersGrid = document.getElementById('team-members-grid');

    const postRequirementForm = document.getElementById('post-requirement-form');
    const reqProjectNameInput = document.getElementById('req-project-name');
    const reqSkillNeedsTextarea = document.getElementById('req-skill-needs');
    const reqContactInfoInput = document.getElementById('req-contact-info');
    const teamPostingsList = document.getElementById('team-postings-list');
    
    // User Profile Modal Elements
    const userProfileModal = document.getElementById('user-profile-modal');
    const closeUserProfileModalBtn = document.getElementById('close-user-profile-modal');
    const modalUserPic = document.getElementById('modal-user-pic');
    const modalUserName = document.getElementById('modal-user-name');
    const modalUserCollegeDept = document.getElementById('modal-user-college-dept');
    const modalUserSkills = document.getElementById('modal-user-skills');
    const modalUserAvailability = document.getElementById('modal-user-availability');
    const modalUserBio = document.getElementById('modal-user-bio');
    const modalUserLinkedin = document.getElementById('modal-user-linkedin');
    const modalUserEmail = document.getElementById('modal-user-email');

    // Add Profile Panel Functionality
    const addProfileButton = document.getElementById('add-profile-buttonSS');
    const addProfilePanel = document.getElementById('add-profile-panel');
    const closeAddProfileBtn = document.getElementById('close-add-profile');

    let allSkillSyncProfiles = [];
    let userCreatedProfiles = JSON.parse(localStorage.getItem('userCreatedProfiles') || '[]');
    let simulatedTeamPostings = [];

    // --- Basic Login Check & Header Setup ---
    function setupPageForUser() {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (!studentDataString) {
            window.location.href = 'login.html';
            return false;
        }
        const loggedInStudent = JSON.parse(studentDataString);
        if (loggedInUserNameDisplaySS) {
            loggedInUserNameDisplaySS.textContent = `Hi, ${loggedInStudent.fullName.split(' ')[0]}!`;
        }
        return true;
    }

    if (!setupPageForUser()) return;

    const currentThemeSS = localStorage.getItem('theme');
    if (currentThemeSS === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtnSS) themeToggleBtnSS.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        if (themeToggleBtnSS) themeToggleBtnSS.innerHTML = '<i class="fas fa-sun"></i>';
    }
    if (themeToggleBtnSS) {
        themeToggleBtnSS.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            themeToggleBtnSS.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', theme);
        });
    }
    if (logoutButtonSS) {
        logoutButtonSS.addEventListener('click', () => {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
        });
    }

    // --- SkillSync Functionality ---
    async function loadSkillSyncData() {
        try {
            const response = await fetch('data/skill_sync_profiles.json');
            const data = await response.json();
            
            // Combine system profiles with user-created profiles
            allSkillSyncProfiles = [...data, ...userCreatedProfiles];
            
            renderTeamMembers();
            renderFeaturedCollaborators();
            populateDepartmentFilter();
        } catch (error) {
            console.error('Error loading SkillSync data:', error);
            
            // If we can't load system profiles, at least show user profiles
            allSkillSyncProfiles = [...userCreatedProfiles];
            renderTeamMembers();
            renderFeaturedCollaborators();
            populateDepartmentFilter();
        }
    }

    function renderProfileCard(profile, container) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.setAttribute('data-profile-id', profile.id);
        
        // Check if this is a user-created profile
        const isUserCreated = profile.id.startsWith('user-');
        
        // Create card content
        card.innerHTML = `
            <div class="profile-card-header">
                <div>
                    <h4>${profile.name}</h4>
                    <p>${profile.college} - ${profile.department}, Year ${profile.year}</p>
                </div>
                ${isUserCreated ? '<span class="user-created-badge">Your Profile</span>' : ''}
            </div>
            <div class="skills-tags">
               <span class="tags-label">Skills:</span>
               <div class="tags-container">
                  ${(profile.skills || []).map(skill => `<span class="tag">${skill}</span>`).join('')}
               </div>
            </div>
             <div class="availability-tags">
                <span class="tags-label">Available for:</span>
                <div class="tags-container">
                    ${(profile.availability || []).map(av => `<span class="tag">${av}</span>`).join('')}
                </div>
            </div>
            <div class="profile-card-actions">
                <button class="juno-button small-btn view-profile-btn" data-userid="${profile.id}"><i class="fas fa-eye"></i> View Profile</button>
                ${isUserCreated ? 
                    `<button class="juno-button small-btn delete-profile-btn"><i class="fas fa-trash"></i> Delete</button>` : 
                    `<a href="${profile.linkedin || '#'}" target="_blank" class="juno-button small-btn"><i class="fab fa-linkedin"></i> Connect</a>`
                }
            </div>
        `;
        
        // Add event listener to view profile button
        const viewProfileBtn = card.querySelector('.view-profile-btn');
        if (viewProfileBtn) {
            viewProfileBtn.addEventListener('click', () => showUserProfileModal(profile));
        }
        
        // Add event listener to delete button if this is a user-created profile
        if (isUserCreated) {
            const deleteProfileBtn = card.querySelector('.delete-profile-btn');
            if (deleteProfileBtn) {
                deleteProfileBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this profile?')) {
                        deleteUserProfile(profile.id);
                    }
                });
            }
        }
        
        container.appendChild(card);
    }

    function renderFeaturedCollaborators() {
        if (!featuredCollaboratorsGrid) return;
        featuredCollaboratorsGrid.innerHTML = '';
        const featured = allSkillSyncProfiles.filter(p => p.featured).slice(0, 3); // Show max 3 featured
        if (featured.length === 0 && allSkillSyncProfiles.length > 0) { // Fallback if no one is 'featured'
            allSkillSyncProfiles.slice(0,3).forEach(p => renderProfileCard(p, featuredCollaboratorsGrid));
        } else if (featured.length > 0) {
             featured.forEach(p => renderProfileCard(p, featuredCollaboratorsGrid));
        } else {
             featuredCollaboratorsGrid.innerHTML = "<p class='no-profiles-message'>No featured collaborators yet.</p>";
        }
    }
    
    function populateDepartmentFilter() {
        if (!departmentFilterSelect || allSkillSyncProfiles.length === 0) return;
        const departments = [...new Set(allSkillSyncProfiles.map(p => p.department))];
        departments.sort().forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentFilterSelect.appendChild(option);
        });
    }

    function renderTeamMembers() {
        if (!teamMembersGrid) return;
        const searchTerm = skillSearchInput.value.toLowerCase();
        const selectedDept = departmentFilterSelect.value;
        const selectedAvailability = availabilityFilterSelect.value;

        const filteredProfiles = allSkillSyncProfiles.filter(profile => {
            const nameMatch = profile.name.toLowerCase().includes(searchTerm);
            const collegeMatch = profile.college.toLowerCase().includes(searchTerm);
            const skillMatch = (profile.skills || []).some(skill => skill.toLowerCase().includes(searchTerm));
            const textSearchMatch = searchTerm === "" || nameMatch || collegeMatch || skillMatch;
            
            const deptMatch = selectedDept === "" || profile.department === selectedDept;
            const availabilityMatch = selectedAvailability === "" || (profile.availability || []).includes(selectedAvailability);

            return textSearchMatch && deptMatch && availabilityMatch;
        });

        teamMembersGrid.innerHTML = '';
        if (filteredProfiles.length === 0) {
            teamMembersGrid.innerHTML = '<p class="no-profiles-message">No profiles match your current criteria.</p>';
            return;
        }
        filteredProfiles.forEach(profile => renderProfileCard(profile, teamMembersGrid));
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', renderTeamMembers);
    }
    // Also filter on typing in search or changing selects
    if (skillSearchInput) skillSearchInput.addEventListener('input', renderTeamMembers);
    if (departmentFilterSelect) departmentFilterSelect.addEventListener('change', renderTeamMembers);
    if (availabilityFilterSelect) availabilityFilterSelect.addEventListener('change', renderTeamMembers);


    // Simulate "Post a Team Requirement"
    if (postRequirementForm) {
        postRequirementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPosting = {
                projectName: reqProjectNameInput.value,
                skillsNeeded: reqSkillNeedsTextarea.value,
                contact: reqContactInfoInput.value,
                postedDate: new Date().toLocaleDateString()
            };
            simulatedTeamPostings.unshift(newPosting); // Add to beginning
            renderTeamPostings();
            postRequirementForm.reset();
            alert("Requirement posted (Simulated)!");
        });
    }

    function renderTeamPostings() {
        if (!teamPostingsList) return;
        teamPostingsList.innerHTML = '';
         const noPostingsLi = teamPostingsList.querySelector('.no-postings');
         if(noPostingsLi) noPostingsLi.remove();


        if (simulatedTeamPostings.length === 0) {
            teamPostingsList.innerHTML = '<li class="no-postings">No current postings. Be the first!</li>';
            return;
        }
        simulatedTeamPostings.forEach(post => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${post.projectName}</strong>
                <p><strong>Skills Needed:</strong> ${post.skillsNeeded}</p>
                <p><strong>Contact:</strong> ${post.contact}</p>
                <p><small>Posted: ${post.postedDate}</small></p>
            `;
            teamPostingsList.appendChild(li);
        });
    }
    
    // User Profile Modal Functions
     function showUserProfileModal(profile) {
         if (!userProfileModal || !profile) return;

         // Show profile picture for hardcoded students, but not for imported ones
         if (modalUserPic) {
             if (profile.id && (profile.id.startsWith('user-') || profile.id.startsWith('imported-'))) {
                 modalUserPic.style.display = 'none';
             } else {
                 modalUserPic.style.display = '';
                 modalUserPic.src = profile.profilePic || 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=U';
             }
         }
         if (modalUserName) modalUserName.textContent = profile.name;
         if (modalUserCollegeDept) modalUserCollegeDept.textContent = `${profile.college} - ${profile.department}, Year ${profile.year}`;
         
         if (modalUserSkills) {
             modalUserSkills.innerHTML = (profile.skills || []).map(skill => `<span class="tag">${skill}</span>`).join('');
         }
         if (modalUserAvailability) {
             modalUserAvailability.innerHTML = (profile.availability || []).map(av => `<span class="tag">${av}</span>`).join('');
         }
         if (modalUserBio) modalUserBio.textContent = profile.bio || "No bio available.";
         
         if (modalUserLinkedin) modalUserLinkedin.href = profile.linkedin || "#";
         if (modalUserEmail) modalUserEmail.href = `mailto:${profile.email || ''}`;

         // Show the modal
         userProfileModal.style.display = 'block';
         userProfileModal.classList.add('show');
     }

     function hideUserProfileModal() {
         if (userProfileModal) {
             userProfileModal.style.display = 'none';
             userProfileModal.classList.remove('show');
         }
     }

     if (closeUserProfileModalBtn) {
         closeUserProfileModalBtn.addEventListener('click', hideUserProfileModal);
     }
     window.addEventListener('click', (event) => { // Close on outside click
         if (event.target === userProfileModal) {
             hideUserProfileModal();
         }
     });
     window.addEventListener('keydown', (event) => { // Close on Esc
         if (event.key === 'Escape' && userProfileModal && userProfileModal.classList.contains('show')) {
             hideUserProfileModal();
         }
     });


    // Initial Load
    loadSkillSyncData();
    renderTeamPostings(); // Render empty state initially

    // Settings Panel Functionality for SkillSync
    function initializeSettingsSS() {
        const settingsButton = document.getElementById('settings-buttonSS');
        const settingsPanel = document.getElementById('settings-panelSS');
        const closeSettingsBtn = document.getElementById('close-settingsSS');
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
        document.addEventListener('DOMContentLoaded', initializeSettingsSS);
    } else {
        initializeSettingsSS();
    }
    window.addEventListener('load', initializeSettingsSS);

    // Handle profile form submission
    document.getElementById('add-profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('profile-name').value;
        const college = document.getElementById('profile-college').value;
        const department = document.getElementById('profile-department').value;
        const year = document.getElementById('profile-year').value;
        const skills = document.getElementById('profile-skills').value.split(',').map(skill => skill.trim());
        const availability = Array.from(document.querySelectorAll('input[name="availability"]:checked'))
            .map(checkbox => checkbox.value);
        const linkedin = document.getElementById('profile-linkedin').value;
        const email = document.getElementById('profile-email').value;
        const bio = document.getElementById('profile-bio').value;
        const profilePic = document.getElementById('profile-pic').value || 'https://via.placeholder.com/150';

        // Create new profile object
        const newProfile = {
            id: `student-${Date.now()}`, // Generate unique ID
            name,
            college,
            department,
            year,
            skills,
            availability,
            profilePic,
            linkedin,
            email,
            bio,
            featured: false,
            upvotes: 0
        };

        // Mark as user-created profile
        newProfile.id = `user-${Date.now()}`;
        
        // Add to profiles arrays
        userCreatedProfiles.push(newProfile);
        allSkillSyncProfiles.push(newProfile);
        
        // Save to localStorage
        localStorage.setItem('userCreatedProfiles', JSON.stringify(userCreatedProfiles));
        
        // Update the display
        renderTeamMembers();
        renderFeaturedCollaborators();
        
        // Show success message
        showNotification('Profile added successfully!', 'success');
        
        // Close the panel
        closeAddProfilePanel();
        
        // Reset form
        this.reset();
    });

    // Function to show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function openAddProfilePanel(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!addProfilePanel) return;
        
        // Set initial state
        addProfilePanel.style.display = 'block';
        // Force reflow
        addProfilePanel.offsetHeight;
        // Add show class for animation
        addProfilePanel.classList.add('show');
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeAddProfilePanel(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!addProfilePanel) return;
        
        // Remove show class for animation
        addProfilePanel.classList.remove('show');
        // Re-enable body scroll
        document.body.style.overflow = '';
        // Hide panel after animation
        setTimeout(() => {
            if (!addProfilePanel.classList.contains('show')) {
                addProfilePanel.style.display = 'none';
            }
        }, 300); // Match transition duration
    }

    // Initialize panel state
    if (addProfilePanel) {
        addProfilePanel.style.display = 'none';
    }

    // Add event listeners
    if (addProfileButton) {
        addProfileButton.addEventListener('click', openAddProfilePanel);
    }

    if (closeAddProfileBtn) {
        closeAddProfileBtn.addEventListener('click', closeAddProfilePanel);
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (addProfilePanel && 
            addProfilePanel.classList.contains('show') && 
            !addProfilePanel.contains(e.target) && 
            e.target !== addProfileButton) {
            closeAddProfilePanel();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && addProfilePanel && addProfilePanel.classList.contains('show')) {
            closeAddProfilePanel();
        }
    });
    
    // Function to delete a user profile
    function deleteUserProfile(profileId) {
        // Remove from userCreatedProfiles array
        userCreatedProfiles = userCreatedProfiles.filter(profile => profile.id !== profileId);
        
        // Remove from allSkillSyncProfiles array
        allSkillSyncProfiles = allSkillSyncProfiles.filter(profile => profile.id !== profileId);
        
        // Save updated profiles to localStorage
        localStorage.setItem('userCreatedProfiles', JSON.stringify(userCreatedProfiles));
        
        // Update the display
        renderTeamMembers();
        renderFeaturedCollaborators();
        
        // Show success message
        showNotification('Profile deleted successfully!', 'success');
    }
});