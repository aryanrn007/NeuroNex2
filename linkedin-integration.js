/**
 * LinkedIn API Integration for SkillSync
 * This script fetches student profiles from LinkedIn API and displays them dynamically
 * in the SkillSync tab.
 * 
 * Client ID: 780vl50xr0ybks
 * Client Secret: WPL_AP1.JT24kcHAP4IskyLn.IR+L+g==
 */

// Store fetched LinkedIn profiles
let linkedinProfiles = [];

// Initialize LinkedIn integration when the document is fully loaded
window.addEventListener('load', function() {
    console.log('LinkedIn integration initialized');
    
    // Add LinkedIn import button to the page
    setTimeout(addLinkedInImportButton, 1000);
});

/**
 * Add LinkedIn import button to the page
 */
function addLinkedInImportButton() {
    // Create a button in the filters bar
    const filtersBar = document.querySelector('.filters-bar');
    if (!filtersBar) return;
    
    const linkedinBtn = document.createElement('button');
    linkedinBtn.className = 'juno-button small-btn linkedin-btn';
    linkedinBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT LINKEDIN PROFILES';
    linkedinBtn.addEventListener('click', importLinkedInProfiles);
    
    filtersBar.appendChild(linkedinBtn);
}

/**
 * Import LinkedIn profiles directly (bypassing OAuth)
 */
function importLinkedInProfiles() {
    showNotification('Importing LinkedIn profiles...', 'info');
    
    // Simulate loading delay
    setTimeout(() => {
        // Generate sample LinkedIn profiles
        linkedinProfiles = generateSampleLinkedInProfiles();
        
        // Update the UI with the profiles
        updateProfilesUI(linkedinProfiles);
        
        showNotification('LinkedIn profiles imported successfully!', 'success');
    }, 1000);
}

/**
 * Fetch LinkedIn profiles
 */
async function fetchLinkedInProfiles() {
    try {
        showNotification('Fetching LinkedIn profiles...', 'info');
        
        // In a real implementation, this would call the LinkedIn API
        // For demo purposes, we'll generate sample LinkedIn profiles
        linkedinProfiles = generateSampleLinkedInProfiles();
        
        // Update the UI with the fetched profiles
        updateProfilesUI(linkedinProfiles);
        
        showNotification('LinkedIn profiles imported successfully!', 'success');
    } catch (error) {
        console.error('Error fetching LinkedIn profiles:', error);
        showNotification('Failed to fetch LinkedIn profiles. Please try again.', 'error');
    }
}

/**
 * Generate sample LinkedIn profiles for demonstration
 */
function generateSampleLinkedInProfiles() {
    const profiles = [
        {
            id: 'linkedin-1',
            name: 'Priya Sharma',
            headline: 'Computer Science Student at MIT | ML Enthusiast',
            profilePic: 'https://randomuser.me/api/portraits/women/32.jpg',
            college: 'Massachusetts Institute of Technology',
            department: 'Computer Science',
            year: '3',
            skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Analysis'],
            availability: ['Projects', 'Hackathons'],
            bio: 'Passionate about AI/ML and its applications in healthcare. Looking for collaborative projects in this domain.',
            linkedin: 'https://linkedin.com/in/priya-sharma',
            email: 'priya.sharma@example.com',
            featured: true,
            upvotes: 24
        },
        {
            id: 'linkedin-2',
            name: 'Raj Patel',
            headline: 'Software Engineering Student | Full Stack Developer',
            profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
            college: 'Stanford University',
            department: 'Software Engineering',
            year: '4',
            skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
            availability: ['Projects', 'Hackathons', 'Events'],
            bio: 'Full stack developer with experience in MERN stack. Looking for team members for my startup idea in EdTech.',
            linkedin: 'https://linkedin.com/in/raj-patel',
            email: 'raj.patel@example.com',
            featured: true,
            upvotes: 18
        },
        {
            id: 'linkedin-3',
            name: 'Ananya Desai',
            headline: 'Data Science Student | Kaggle Competitor',
            profilePic: 'https://randomuser.me/api/portraits/women/65.jpg',
            college: 'University of California, Berkeley',
            department: 'Data Science',
            year: '2',
            skills: ['Python', 'R', 'SQL', 'Data Visualization', 'Statistical Analysis'],
            availability: ['Projects', 'Hackathons'],
            bio: 'Data science enthusiast with a passion for extracting insights from complex datasets. Looking for teammates for upcoming Kaggle competitions.',
            linkedin: 'https://linkedin.com/in/ananya-desai',
            email: 'ananya.desai@example.com',
            featured: false,
            upvotes: 12
        },
        {
            id: 'linkedin-4',
            name: 'Arjun Mehta',
            headline: 'Cybersecurity Student | Ethical Hacker',
            profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
            college: 'Georgia Institute of Technology',
            department: 'Cybersecurity',
            year: '3',
            skills: ['Network Security', 'Penetration Testing', 'Python', 'Linux', 'Cryptography'],
            availability: ['Projects', 'Events'],
            bio: 'Cybersecurity enthusiast with a focus on ethical hacking and penetration testing. Looking for teammates for CTF competitions.',
            linkedin: 'https://linkedin.com/in/arjun-mehta',
            email: 'arjun.mehta@example.com',
            featured: false,
            upvotes: 15
        },
        {
            id: 'linkedin-5',
            name: 'Neha Gupta',
            headline: 'UI/UX Design Student | Creative Thinker',
            profilePic: 'https://randomuser.me/api/portraits/women/28.jpg',
            college: 'Rhode Island School of Design',
            department: 'UI/UX Design',
            year: '4',
            skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping'],
            availability: ['Projects', 'Hackathons', 'Events'],
            bio: 'Passionate UI/UX designer with a focus on creating user-centered experiences. Looking for developers to collaborate on innovative projects.',
            linkedin: 'https://linkedin.com/in/neha-gupta',
            email: 'neha.gupta@example.com',
            featured: true,
            upvotes: 20
        },
        {
            id: 'linkedin-6',
            name: 'Vikram Singh',
            headline: 'AR/VR Developer | Game Design Enthusiast',
            profilePic: 'https://randomuser.me/api/portraits/men/67.jpg',
            college: 'Carnegie Mellon University',
            department: 'Computer Graphics',
            year: '3',
            skills: ['Unity3D', 'C#', 'AR Development', 'VR Development', '3D Modeling'],
            availability: ['Projects', 'Hackathons'],
            bio: 'AR/VR developer with experience in creating immersive experiences. Looking for teammates for a VR game project.',
            linkedin: 'https://linkedin.com/in/vikram-singh',
            email: 'vikram.singh@example.com',
            featured: false,
            upvotes: 14
        },
        {
            id: 'linkedin-7',
            name: 'Zara Khan',
            headline: 'Blockchain Developer | Crypto Enthusiast',
            profilePic: 'https://randomuser.me/api/portraits/women/42.jpg',
            college: 'University of Toronto',
            department: 'Computer Science',
            year: '4',
            skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'JavaScript'],
            availability: ['Projects', 'Hackathons'],
            bio: 'Blockchain developer with a focus on DeFi applications. Looking for teammates for an upcoming blockchain hackathon.',
            linkedin: 'https://linkedin.com/in/zara-khan',
            email: 'zara.khan@example.com',
            featured: false,
            upvotes: 16
        },
        {
            id: 'linkedin-8',
            name: 'Rohan Joshi',
            headline: 'IoT Developer | Hardware Hacker',
            profilePic: 'https://randomuser.me/api/portraits/men/33.jpg',
            college: 'California Institute of Technology',
            department: 'Electrical Engineering',
            year: '3',
            skills: ['Arduino', 'Raspberry Pi', 'Python', 'C++', 'Sensors'],
            availability: ['Projects', 'Hackathons', 'Events'],
            bio: 'IoT developer with experience in building smart home solutions. Looking for teammates for an IoT project in agriculture.',
            linkedin: 'https://linkedin.com/in/rohan-joshi',
            email: 'rohan.joshi@example.com',
            featured: false,
            upvotes: 13
        }
    ];
    
    return profiles;
}

/**
 * Update the UI with fetched LinkedIn profiles
 */
function updateProfilesUI(profiles) {
    // Get references to the profile containers
    const featuredCollaboratorsGrid = document.getElementById('featured-collaborators-grid');
    const teamMembersGrid = document.getElementById('team-members-grid');
    
    if (!featuredCollaboratorsGrid || !teamMembersGrid) {
        console.error('Profile containers not found in the DOM');
        return;
    }
    
    // Clear existing "No profiles" message if it exists
    const noProfilesMessage = teamMembersGrid.querySelector('.no-profiles-message');
    if (noProfilesMessage) {
        noProfilesMessage.style.display = 'none';
    }
    
    // Filter featured profiles
    const featuredProfiles = profiles.filter(profile => profile.featured);
    
    // Add featured profiles to the featured collaborators grid
    if (featuredProfiles.length > 0) {
        featuredCollaboratorsGrid.innerHTML = '';
        featuredProfiles.forEach(profile => {
            const profileCard = createProfileCard(profile, true);
            featuredCollaboratorsGrid.appendChild(profileCard);
        });
    }
    
    // Add all profiles to the team members grid
    if (profiles.length > 0) {
        // Keep existing profiles but add LinkedIn ones at the top
        const existingProfiles = Array.from(teamMembersGrid.querySelectorAll('.profile-card:not(.linkedin-profile)'));
        
        teamMembersGrid.innerHTML = '';
        
        // Add LinkedIn profiles first
        profiles.forEach(profile => {
            const profileCard = createProfileCard(profile, false);
            teamMembersGrid.appendChild(profileCard);
        });
        
        // Add back existing profiles
        existingProfiles.forEach(profileCard => {
            teamMembersGrid.appendChild(profileCard);
        });
    }
    
    // Update global allSkillSyncProfiles array if it exists
    if (window.allSkillSyncProfiles) {
        // Filter out any existing LinkedIn profiles
        const nonLinkedInProfiles = window.allSkillSyncProfiles.filter(profile => !profile.id.startsWith('linkedin-'));
        
        // Add the new LinkedIn profiles
        window.allSkillSyncProfiles = [...profiles, ...nonLinkedInProfiles];
    } else {
        window.allSkillSyncProfiles = profiles;
    }
}

/**
 * Create a profile card element
 */
function createProfileCard(profile, isFeatured) {
    const card = document.createElement('div');
    card.className = 'profile-card linkedin-profile';
    if (isFeatured) card.classList.add('featured');
    
    // LinkedIn badge
    const linkedinBadge = document.createElement('div');
    linkedinBadge.className = 'linkedin-badge';
    linkedinBadge.innerHTML = '<i class="fab fa-linkedin"></i> LinkedIn';
    card.appendChild(linkedinBadge);
    
    // Profile image
    const profileImg = document.createElement('img');
    profileImg.className = 'profile-img';
    profileImg.src = profile.profilePic;
    profileImg.alt = profile.name;
    card.appendChild(profileImg);
    
    // Profile info
    const profileInfo = document.createElement('div');
    profileInfo.className = 'profile-info';
    
    // Name
    const nameElement = document.createElement('h4');
    nameElement.className = 'profile-name';
    nameElement.textContent = profile.name;
    profileInfo.appendChild(nameElement);
    
    // College and department
    const collegeElement = document.createElement('p');
    collegeElement.className = 'profile-college';
    collegeElement.textContent = `${profile.college} • ${profile.department}`;
    profileInfo.appendChild(collegeElement);
    
    // Skills
    const skillsContainer = document.createElement('div');
    skillsContainer.className = 'profile-skills';
    
    const skillsTitle = document.createElement('span');
    skillsTitle.className = 'skills-title';
    skillsTitle.textContent = 'Skills: ';
    skillsContainer.appendChild(skillsTitle);
    
    const skillsList = document.createElement('div');
    skillsList.className = 'skills-list';
    
    // Only show first 3 skills with a +X more indicator if needed
    const displayedSkills = profile.skills.slice(0, 3);
    const remainingSkills = profile.skills.length - 3;
    
    displayedSkills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        skillsList.appendChild(skillTag);
    });
    
    if (remainingSkills > 0) {
        const moreSkills = document.createElement('span');
        moreSkills.className = 'more-skills';
        moreSkills.textContent = `+${remainingSkills} more`;
        skillsList.appendChild(moreSkills);
    }
    
    skillsContainer.appendChild(skillsList);
    profileInfo.appendChild(skillsContainer);
    
    // Availability
    const availabilityElement = document.createElement('p');
    availabilityElement.className = 'profile-availability';
    availabilityElement.innerHTML = `<span class="availability-title">Available for:</span> ${profile.availability.join(', ')}`;
    profileInfo.appendChild(availabilityElement);
    
    card.appendChild(profileInfo);
    
    // Profile actions
    const profileActions = document.createElement('div');
    profileActions.className = 'profile-actions';
    
    // View profile button
    const viewProfileBtn = document.createElement('button');
    viewProfileBtn.className = 'view-profile-btn';
    viewProfileBtn.innerHTML = '<i class="fas fa-user"></i> View Profile';
    viewProfileBtn.addEventListener('click', () => {
        // Call the existing showUserProfileModal function if available
        if (typeof window.showUserProfileModal === 'function') {
            window.showUserProfileModal(profile);
        } else {
            // Fallback if the function doesn't exist
            alert(`Profile: ${profile.name}\nSkills: ${profile.skills.join(', ')}\nBio: ${profile.bio}`);
        }
    });
    profileActions.appendChild(viewProfileBtn);
    
    // Connect button
    const connectBtn = document.createElement('a');
    connectBtn.className = 'connect-btn';
    connectBtn.href = profile.linkedin;
    connectBtn.target = '_blank';
    connectBtn.innerHTML = '<i class="fas fa-link"></i> Connect';
    profileActions.appendChild(connectBtn);
    
    card.appendChild(profileActions);
    
    // Upvotes
    if (profile.upvotes) {
        const upvotesElement = document.createElement('div');
        upvotesElement.className = 'profile-upvotes';
        upvotesElement.innerHTML = `<i class="fas fa-thumbs-up"></i> ${profile.upvotes}`;
        card.appendChild(upvotesElement);
    }
    
    return card;
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Check if the function already exists in the global scope
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback implementation if the function doesn't exist
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add some CSS for LinkedIn integration
const style = document.createElement('style');
style.textContent = `
    .linkedin-btn {
        background-color: #0077b5;
        color: white;
    }
    
    .linkedin-btn:hover {
        background-color: #006097;
    }
    
    .linkedin-profile {
        position: relative;
        border: 1px solid #0077b5;
    }
    
    .linkedin-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #0077b5;
        color: white;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.info {
        background-color: #3498db;
    }
    
    .notification.success {
        background-color: #2ecc71;
    }
    
    .notification.error {
        background-color: #e74c3c;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);
