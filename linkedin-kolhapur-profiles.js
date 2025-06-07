/**
 * LinkedIn Kolhapur Student Profiles Integration
 * This script fetches LinkedIn profiles of students from colleges in Kolhapur
 * and displays them dynamically in the SkillSync tab.
 * 
 * Client ID: 780vl50xr0ybks
 * Client Secret: WPL_AP1.JT24kcHAP4IskyLn.IR+L+g==
 */

// IMPORTANT: This is a simplified version that doesn't actually connect to LinkedIn API
// In a real implementation, you would need to handle OAuth flow and API calls

// Configuration
const LINKEDIN_CONFIG = {
  clientId: '780vl50xr0ybks',
  clientSecret: 'WPL_AP1.JT24kcHAP4IskyLn.IR+L+g==',
  redirectUri: window.location.origin + window.location.pathname,
  scope: 'r_emailaddress r_liteprofile r_basicprofile'
};

// Store fetched LinkedIn profiles
let linkedinKolhapurProfiles = [];
let isLoadingProfiles = false;
let hasMoreProfiles = true;
let currentPage = 0;
const PROFILES_PER_PAGE = 4;

// List of colleges in Kolhapur for filtering
const KOLHAPUR_COLLEGES = [
  'DY Patil College of Engineering and Technology, Kolhapur',
  'Shivaji University, Kolhapur',
  'Rajarambapu Institute of Technology, Kolhapur',
  'Sanjay Ghodawat University, Kolhapur',
  'KIT College of Engineering, Kolhapur',
  'Bharati Vidyapeeth College of Engineering, Kolhapur',
  'Tatyasaheb Kore Institute of Engineering and Technology, Kolhapur',
  'DKTE Society\'s Textile and Engineering Institute, Kolhapur',
  'Vivekanand College, Kolhapur',
  'Chhatrapati Shahu Institute of Business Education and Research, Kolhapur'
];

// Initialize LinkedIn integration when the document is fully loaded
window.addEventListener('DOMContentLoaded', function() {
  console.log('LinkedIn Kolhapur Profiles integration initialized');
  
  // Add LinkedIn import button to the page immediately
  initializeLinkedInIntegration();
  
  // Make showUserProfileModal function available globally if it exists in skillsync.js
  if (typeof showUserProfileModal === 'function' && !window.showUserProfileModal) {
    window.showUserProfileModal = showUserProfileModal;
  }
});

/**
 * Initialize LinkedIn integration
 */
function initializeLinkedInIntegration() {
  // Add LinkedIn import button to the filters bar
  addLinkedInImportButton();
  
  // Check if we have a code from LinkedIn OAuth redirect
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    // Exchange code for access token
    exchangeCodeForToken(code);
    
    // Clean up the URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

/**
 * Add LinkedIn import button to the page
 */
function addLinkedInImportButton() {
  // Create a button in the filters bar
  const filtersBar = document.querySelector('.filters-bar');
  if (!filtersBar) {
    console.error('Filters bar not found');
    // Try again after a short delay
    setTimeout(addLinkedInImportButton, 1000);
    return;
  }
  
  // Don't add the button if it already exists
  if (document.querySelector('.linkedin-kolhapur-btn')) {
    console.log('LinkedIn button already exists');
    return;
  }
  
  console.log('Adding LinkedIn import button');
  
  const linkedinBtn = document.createElement('button');
  linkedinBtn.className = 'juno-button small-btn linkedin-kolhapur-btn';
  linkedinBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
  linkedinBtn.addEventListener('click', importLinkedInProfiles);
  
  filtersBar.appendChild(linkedinBtn);
  console.log('LinkedIn import button added successfully');
}

/**
 * Add "View More" button to the page
 */
function addViewMoreButton() {
  // Check if the button already exists
  if (document.getElementById('view-more-linkedin-btn')) return;
  
  // Get the team members grid
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) return;
  
  // Create container for the button
  const viewMoreContainer = document.createElement('div');
  viewMoreContainer.className = 'view-more-container';
  viewMoreContainer.style.width = '100%';
  viewMoreContainer.style.textAlign = 'center';
  viewMoreContainer.style.marginTop = '2rem';
  
  // Create the button
  const viewMoreBtn = document.createElement('button');
  viewMoreBtn.id = 'view-more-linkedin-btn';
  viewMoreBtn.className = 'juno-button';
  viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
  viewMoreBtn.addEventListener('click', loadMoreProfiles);
  
  // Add button to container
  viewMoreContainer.appendChild(viewMoreBtn);
  
  // Add container after the team members grid
  teamMembersGrid.parentNode.insertBefore(viewMoreContainer, teamMembersGrid.nextSibling);
}

/**
 * Import LinkedIn profiles
 */
function importLinkedInProfiles() {
  console.log('Import LinkedIn profiles function called');
  
  // In a real implementation, this would initiate OAuth flow with LinkedIn
  // For demo purposes, we'll use our simulated API
  showNotification('Importing LinkedIn profiles of Kolhapur students...', 'info');
  
  // Reset pagination
  currentPage = 0;
  hasMoreProfiles = true;
  linkedinKolhapurProfiles = [];
  
  // Fetch first batch of profiles with a slight delay to ensure notification is shown
  setTimeout(() => {
    fetchLinkedInProfiles();
  }, 500);
}



/**
 * Initiate LinkedIn OAuth flow
 */
function initiateOAuth() {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CONFIG.clientId}&redirect_uri=${encodeURIComponent(LINKEDIN_CONFIG.redirectUri)}&scope=${encodeURIComponent(LINKEDIN_CONFIG.scope)}`;
  window.location.href = authUrl;
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code) {
  try {
    showNotification('Authenticating with LinkedIn...', 'info');
    
    // In a real implementation, this would make a server-side request to LinkedIn
    // For demo purposes, we'll simulate a successful authentication
    
    // Fetch profiles after successful authentication
    fetchLinkedInProfiles();
    
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    showNotification('Failed to authenticate with LinkedIn. Please try again.', 'error');
  }
}

/**
 * Fetch LinkedIn profiles
 */
function fetchLinkedInProfiles() {
  try {
    if (isLoadingProfiles) return;
    
    console.log('Fetching LinkedIn profiles...');
    isLoadingProfiles = true;
    
    // In a real implementation, this would call the LinkedIn API
    // For demo purposes, we'll generate sample LinkedIn profiles
    const allProfiles = generateKolhapurStudentProfiles();
    const newProfiles = allProfiles.slice(currentPage * PROFILES_PER_PAGE, (currentPage + 1) * PROFILES_PER_PAGE);
    
    console.log('Fetched profiles:', newProfiles.length, 'from page', currentPage);
    
    // If no more profiles, mark as complete
    if (newProfiles.length === 0) {
      hasMoreProfiles = false;
      showNotification('No more profiles to load', 'info');
      if (document.getElementById('view-more-linkedin-btn')) {
        document.getElementById('view-more-linkedin-btn').innerHTML = 'No More Profiles';
        document.getElementById('view-more-linkedin-btn').disabled = true;
      }
      isLoadingProfiles = false;
      return;
    }
    
    // Add to our collection
    linkedinKolhapurProfiles = [...linkedinKolhapurProfiles, ...newProfiles];
    
    // Update the UI with the fetched profiles
    updateProfilesUI(newProfiles);
    
    // Add "View More" button if it doesn't exist
    addViewMoreButton();
    
    // Update button state
    if (document.getElementById('view-more-linkedin-btn')) {
      document.getElementById('view-more-linkedin-btn').innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
      document.getElementById('view-more-linkedin-btn').disabled = false;
    }
    
    // Show success notification only on first load
    if (currentPage === 0) {
      showNotification('LinkedIn profiles imported successfully!', 'success');
    }
    
    isLoadingProfiles = false;
  } catch (error) {
    console.error('Error fetching LinkedIn profiles:', error);
    showNotification('Failed to fetch LinkedIn profiles. Please try again.', 'error');
    isLoadingProfiles = false;
    if (document.getElementById('view-more-linkedin-btn')) {
      document.getElementById('view-more-linkedin-btn').innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
      document.getElementById('view-more-linkedin-btn').disabled = false;
    }
  }
}

/**
 * Update the state of the "View More" button
 */
function updateViewMoreButtonState(isLoading) {
  const viewMoreBtn = document.getElementById('view-more-linkedin-btn');
  if (!viewMoreBtn) return;
  
  if (isLoading) {
    viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    viewMoreBtn.disabled = true;
  } else if (!hasMoreProfiles) {
    viewMoreBtn.innerHTML = 'No More Profiles';
    viewMoreBtn.disabled = true;
  } else {
    viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
    viewMoreBtn.disabled = false;
  }
}

/**
 * Load more profiles when "View More" button is clicked
 */
function loadMoreProfiles() {
  if (isLoadingProfiles || !hasMoreProfiles) return;
  
  console.log('Loading more profiles...');
  currentPage++;
  
  // Update button state to show loading
  if (document.getElementById('view-more-linkedin-btn')) {
    document.getElementById('view-more-linkedin-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    document.getElementById('view-more-linkedin-btn').disabled = true;
  }
  
  // Fetch next batch of profiles with a slight delay to show loading state
  setTimeout(() => {
    fetchLinkedInProfiles();
  }, 500);
}

/**
 * Generate sample LinkedIn profiles of students from Kolhapur colleges
 */
function generateKolhapurStudentProfiles() {
  // This would be replaced with actual API calls in production
  return [
    {
      id: 'linkedin-kolhapur-1',
      name: 'Aditya Patil',
      headline: 'Computer Science Student at DY Patil College | Web Developer',
      profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Computer Science',
      year: '3',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      availability: ['Projects', 'Hackathons'],
      bio: 'Full stack web developer specializing in MERN stack. Looking for team members for hackathons and innovative projects.',
      linkedin: 'https://linkedin.com/in/aditya-patil',
      email: 'aditya.patil@example.com',
      featured: true,
      upvotes: 15
    },
    {
      id: 'linkedin-kolhapur-2',
      name: 'Sneha Jadhav',
      headline: 'Data Science Student at Shivaji University | ML Enthusiast',
      profilePic: 'https://randomuser.me/api/portraits/women/28.jpg',
      college: 'Shivaji University, Kolhapur',
      department: 'Data Science',
      year: '4',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'SQL'],
      availability: ['Projects', 'Research'],
      bio: 'Passionate about applying machine learning to solve real-world problems. Currently working on predictive analytics for healthcare.',
      linkedin: 'https://linkedin.com/in/sneha-jadhav',
      email: 'sneha.jadhav@example.com',
      featured: true,
      upvotes: 22
    },
    {
      id: 'linkedin-kolhapur-3',
      name: 'Rahul Deshmukh',
      headline: 'Mechanical Engineering Student at KIT College | IoT Enthusiast',
      profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Mechanical Engineering',
      year: '3',
      skills: ['IoT', 'Arduino', 'Raspberry Pi', 'Python', 'CAD'],
      availability: ['Projects', 'Hackathons', 'Internships'],
      bio: 'Combining mechanical engineering with IoT technologies to build smart devices. Looking for interdisciplinary project collaborations.',
      linkedin: 'https://linkedin.com/in/rahul-deshmukh',
      email: 'rahul.deshmukh@example.com',
      featured: false,
      upvotes: 12
    },
    {
      id: 'linkedin-kolhapur-4',
      name: 'Priya Kulkarni',
      headline: 'Electronics Engineering Student at RIT | Embedded Systems Developer',
      profilePic: 'https://randomuser.me/api/portraits/women/42.jpg',
      college: 'Rajarambapu Institute of Technology, Kolhapur',
      department: 'Electronics Engineering',
      year: '4',
      skills: ['Embedded Systems', 'C++', 'FPGA', 'PCB Design', 'ARM'],
      availability: ['Projects', 'Research'],
      bio: 'Specializing in embedded systems and FPGA design. Currently working on a low-power IoT sensor network for agricultural applications.',
      linkedin: 'https://linkedin.com/in/priya-kulkarni',
      email: 'priya.kulkarni@example.com',
      featured: false,
      upvotes: 18
    },
    {
      id: 'linkedin-kolhapur-5',
      name: 'Vikram Mane',
      headline: 'Civil Engineering Student at DKTE | Sustainable Construction Enthusiast',
      profilePic: 'https://randomuser.me/api/portraits/men/62.jpg',
      college: 'DKTE Society\'s Textile and Engineering Institute, Kolhapur',
      department: 'Civil Engineering',
      year: '3',
      skills: ['AutoCAD', 'Revit', 'Structural Analysis', 'Green Building', 'Project Management'],
      availability: ['Projects', 'Internships'],
      bio: 'Passionate about sustainable construction techniques and green building design. Looking for projects focused on environmental sustainability.',
      linkedin: 'https://linkedin.com/in/vikram-mane',
      email: 'vikram.mane@example.com',
      featured: false,
      upvotes: 10
    },
    {
      id: 'linkedin-kolhapur-6',
      name: 'Ananya Joshi',
      headline: 'Information Technology Student at DY Patil College | Cybersecurity Enthusiast',
      profilePic: 'https://randomuser.me/api/portraits/women/56.jpg',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Information Technology',
      year: '4',
      skills: ['Network Security', 'Ethical Hacking', 'Python', 'Linux', 'Cryptography'],
      availability: ['Projects', 'Hackathons', 'CTF Competitions'],
      bio: 'Cybersecurity enthusiast with experience in penetration testing and network security. Looking for team members for CTF competitions.',
      linkedin: 'https://linkedin.com/in/ananya-joshi',
      email: 'ananya.joshi@example.com',
      featured: false,
      upvotes: 16
    },
    {
      id: 'linkedin-kolhapur-7',
      name: 'Siddharth Patil',
      headline: 'Computer Science Student at Shivaji University | AI Researcher',
      profilePic: 'https://randomuser.me/api/portraits/men/72.jpg',
      college: 'Shivaji University, Kolhapur',
      department: 'Computer Science',
      year: '4',
      skills: ['Artificial Intelligence', 'Deep Learning', 'Python', 'Computer Vision', 'NLP'],
      availability: ['Research', 'Projects'],
      bio: 'AI researcher focusing on computer vision and natural language processing. Currently working on a project for sign language recognition using deep learning.',
      linkedin: 'https://linkedin.com/in/siddharth-patil',
      email: 'siddharth.patil@example.com',
      featured: false,
      upvotes: 20
    },
    {
      id: 'linkedin-kolhapur-8',
      name: 'Neha Sharma',
      headline: 'Biotechnology Student at Bharati Vidyapeeth | Bioinformatics Enthusiast',
      profilePic: 'https://randomuser.me/api/portraits/women/65.jpg',
      college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
      department: 'Biotechnology',
      year: '3',
      skills: ['Bioinformatics', 'Python', 'R', 'Genomics', 'Data Analysis'],
      availability: ['Research', 'Projects'],
      bio: 'Combining biotechnology with computational methods to solve biological problems. Interested in genomics and personalized medicine research.',
      linkedin: 'https://linkedin.com/in/neha-sharma',
      email: 'neha.sharma@example.com',
      featured: false,
      upvotes: 14
    },
    {
      id: 'linkedin-kolhapur-9',
      name: 'Arjun Desai',
      headline: 'MBA Student at CSIBR | Marketing Specialist',
      profilePic: 'https://randomuser.me/api/portraits/men/82.jpg',
      college: 'Chhatrapati Shahu Institute of Business Education and Research, Kolhapur',
      department: 'Marketing',
      year: '2',
      skills: ['Digital Marketing', 'Market Research', 'Social Media Strategy', 'Content Creation', 'Analytics'],
      availability: ['Internships', 'Projects'],
      bio: 'Marketing specialist with experience in digital marketing and market research. Looking for innovative projects in the tech marketing space.',
      linkedin: 'https://linkedin.com/in/arjun-desai',
      email: 'arjun.desai@example.com',
      featured: false,
      upvotes: 11
    },
    {
      id: 'linkedin-kolhapur-10',
      name: 'Tanvi Gaikwad',
      headline: 'Electrical Engineering Student at Sanjay Ghodawat University | Renewable Energy Enthusiast',
      profilePic: 'https://randomuser.me/api/portraits/women/75.jpg',
      college: 'Sanjay Ghodawat University, Kolhapur',
      department: 'Electrical Engineering',
      year: '3',
      skills: ['Renewable Energy', 'Power Systems', 'Solar PV Design', 'MATLAB', 'Microgrids'],
      availability: ['Projects', 'Research', 'Internships'],
      bio: 'Passionate about renewable energy and sustainable power systems. Currently working on a project for optimizing solar PV installations in rural areas.',
      linkedin: 'https://linkedin.com/in/tanvi-gaikwad',
      email: 'tanvi.gaikwad@example.com',
      featured: false,
      upvotes: 15
    }
  ];
}

/**
 * Update the UI with fetched LinkedIn profiles
 */
function updateProfilesUI(profiles) {
  // Get the team members grid
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) {
    console.error('Team members grid not found');
    return;
  }
  
  // Remove "no profiles" message if present
  const noProfilesMessage = teamMembersGrid.querySelector('.no-profiles-message');
  if (noProfilesMessage) {
    noProfilesMessage.remove();
  }
  
  console.log('Adding profiles to UI:', profiles.length);
  
  // Create a document fragment to improve performance
  const fragment = document.createDocumentFragment();
  
  // Add each profile to the fragment
  profiles.forEach(profile => {
    try {
      const profileCard = createProfileCard(profile, profile.featured);
      fragment.appendChild(profileCard);
    } catch (error) {
      console.error('Error creating profile card for', profile.name, error);
    }
  });
  
  // Add all cards to the grid at once
  teamMembersGrid.appendChild(fragment);
  
  // Update featured collaborators section if any profiles are featured
  updateFeaturedCollaborators(profiles.filter(profile => profile.featured));
}

/**
 * Update featured collaborators section
 */
function updateFeaturedCollaborators(featuredProfiles) {
  if (!featuredProfiles || featuredProfiles.length === 0) return;
  
  // Get the featured collaborators grid
  const featuredGrid = document.getElementById('featured-collaborators-grid');
  if (!featuredGrid) return;
  
  // Add each featured profile to the grid
  featuredProfiles.forEach(profile => {
    // Check if this profile is already in the featured grid
    const existingCard = featuredGrid.querySelector(`[data-profile-id="${profile.id}"]`);
    if (!existingCard) {
      const profileCard = createProfileCard(profile, true);
      featuredGrid.appendChild(profileCard);
    }
  });
}

/**
 * Create a profile card element
 */
function createProfileCard(profile, isFeatured = false) {
  console.log('Creating profile card for:', profile.name);
  
  // Create card container
  const card = document.createElement('div');
  card.className = `profile-card linkedin-profile ${isFeatured ? 'featured-profile' : ''}`;
  card.setAttribute('data-profile-id', profile.id);
  
  // Add LinkedIn badge
  const linkedinBadge = document.createElement('div');
  linkedinBadge.className = 'linkedin-badge';
  linkedinBadge.innerHTML = '<i class="fab fa-linkedin"></i> LinkedIn';
  card.appendChild(linkedinBadge);
  
  // Create profile header
  const profileHeader = document.createElement('div');
  profileHeader.className = 'profile-card-header';
  
  // Profile image
  const profileImg = document.createElement('img');
  profileImg.src = profile.profilePic || 'https://via.placeholder.com/150';
  profileImg.alt = `${profile.name}'s profile picture`;
  profileHeader.appendChild(profileImg);
  
  // Profile info container
  const profileInfo = document.createElement('div');
  
  // Profile name
  const profileName = document.createElement('h4');
  profileName.textContent = profile.name;
  profileInfo.appendChild(profileName);
  
  // College and department
  const collegeInfo = document.createElement('p');
  collegeInfo.textContent = `${profile.college} • ${profile.department}`;
  profileInfo.appendChild(collegeInfo);
  
  profileHeader.appendChild(profileInfo);
  card.appendChild(profileHeader);
  
  // Skills section
  const skillsContainer = document.createElement('div');
  skillsContainer.className = 'skills-tags';
  
  const skillsLabel = document.createElement('span');
  skillsLabel.className = 'tags-label';
  skillsLabel.textContent = 'Skills:';
  skillsContainer.appendChild(skillsLabel);
  
  const skillsList = document.createElement('div');
  skillsList.className = 'tags-list';
  
  // Add first 3 skills as tags
  profile.skills.slice(0, 3).forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.className = 'tag';
    skillTag.textContent = skill;
    skillsList.appendChild(skillTag);
  });
  
  // Add "+X more" if there are more than 3 skills
  if (profile.skills.length > 3) {
    const moreSkills = document.createElement('span');
    moreSkills.className = 'more-tag';
    moreSkills.textContent = `+${profile.skills.length - 3} more`;
    skillsList.appendChild(moreSkills);
  }
  
  skillsContainer.appendChild(skillsList);
  card.appendChild(skillsContainer);
  
  // Availability section
  const availabilityContainer = document.createElement('div');
  availabilityContainer.className = 'availability-tags';
  
  const availabilityLabel = document.createElement('span');
  availabilityLabel.className = 'tags-label';
  availabilityLabel.textContent = 'Available for:';
  availabilityContainer.appendChild(availabilityLabel);
  
  const availabilityList = document.createElement('div');
  availabilityList.className = 'tags-list';
  
  profile.availability.forEach(item => {
    const availabilityTag = document.createElement('span');
    availabilityTag.className = 'tag';
    availabilityTag.textContent = item;
    availabilityList.appendChild(availabilityTag);
  });
  
  availabilityContainer.appendChild(availabilityList);
  card.appendChild(availabilityContainer);
  
  // Actions section
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'profile-card-actions';
  
  // View profile button
  const viewProfileBtn = document.createElement('button');
  viewProfileBtn.className = 'juno-button small-btn';
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
  actionsContainer.appendChild(viewProfileBtn);
  
  // Connect button (LinkedIn link)
  const connectBtn = document.createElement('a');
  connectBtn.className = 'juno-button small-btn';
  connectBtn.href = profile.linkedin;
  connectBtn.target = '_blank';
  connectBtn.innerHTML = '<i class="fab fa-linkedin"></i> Connect';
  actionsContainer.appendChild(connectBtn);
  
  card.appendChild(actionsContainer);
  
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
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.color = 'white';
  notification.style.zIndex = '1000';
  notification.style.animation = 'slideIn 0.3s ease-out';
  
  // Set color based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#2ecc71';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#e74c3c';
  } else {
    notification.style.backgroundColor = '#3498db';
  }
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add CSS for LinkedIn Kolhapur integration
const style = document.createElement('style');
style.textContent = `
  .linkedin-kolhapur-btn {
    background-color: #0077b5;
    color: white;
  }
  
  .linkedin-kolhapur-btn:hover {
    background-color: #006097;
  }
  
  .linkedin-profile {
    position: relative;
    border: 1px solid rgba(0, 119, 181, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .linkedin-profile:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 119, 181, 0.15);
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
    z-index: 1;
  }
  
  .view-more-container {
    width: 100%;
    text-align: center;
    margin-top: 2rem;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  #view-more-linkedin-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #0077b5, #0e4f79);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 119, 181, 0.2);
  }
  
  #view-more-linkedin-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 119, 181, 0.3);
  }
  
  #view-more-linkedin-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
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
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

document.head.appendChild(style);
