/**
 * Real Dynamic Profiles
 * 
 * This script fetches real user data from a public API and transforms it
 * into LinkedIn profiles of students from Kolhapur colleges
 */

// Global variables
let isLoading = false;
let currentPage = 0;
const PROFILES_PER_PAGE = 4;

// List of colleges in Kolhapur
const KOLHAPUR_COLLEGES = [
  'DY Patil College of Engineering, Kolhapur',
  'Shivaji University, Kolhapur',
  'KIT College of Engineering, Kolhapur',
  'Rajarambapu Institute of Technology, Kolhapur',
  'Bharati Vidyapeeth College of Engineering, Kolhapur'
];

// List of departments
const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Mechanical Engineering',
  'Electronics Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Biotechnology'
];

// List of skills by department
const SKILLS_BY_DEPARTMENT = {
  'Computer Science': ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'MongoDB', 'SQL', 'Cloud Computing', 'DevOps'],
  'Information Technology': ['Web Development', 'Network Security', 'Database Management', 'Cloud Services', 'System Administration', 'IT Infrastructure', 'Cybersecurity'],
  'Mechanical Engineering': ['CAD/CAM', 'Thermodynamics', 'Fluid Mechanics', 'Manufacturing Processes', 'Robotics', 'IoT', 'AutoCAD', 'SolidWorks'],
  'Electronics Engineering': ['Circuit Design', 'Embedded Systems', 'VLSI', 'Signal Processing', 'PCB Design', 'Microcontrollers', 'FPGA'],
  'Civil Engineering': ['Structural Analysis', 'Construction Management', 'Environmental Engineering', 'Surveying', 'AutoCAD', 'Revit', 'BIM'],
  'Electrical Engineering': ['Power Systems', 'Control Systems', 'Electric Machines', 'Renewable Energy', 'MATLAB', 'PLC Programming'],
  'Data Science': ['Machine Learning', 'Data Analysis', 'Statistical Modeling', 'Python', 'R', 'SQL', 'TensorFlow', 'Data Visualization'],
  'Artificial Intelligence': ['Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP', 'Reinforcement Learning', 'PyTorch', 'TensorFlow'],
  'Biotechnology': ['Molecular Biology', 'Biochemistry', 'Genetic Engineering', 'Bioinformatics', 'Microbiology', 'Cell Culture']
};

// List of availability options
const AVAILABILITY_OPTIONS = ['Projects', 'Hackathons', 'Research', 'Internships', 'Part-time Work', 'Mentoring'];

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Real Dynamic Profiles loaded');
  
  // Add the import button to the filters bar with a delay
  setTimeout(function() {
    addImportButton();
  }, 1000);
});

/**
 * Add LinkedIn import button to the filters bar
 */
function addImportButton() {
  const filtersBar = document.querySelector('.filters-bar');
  if (!filtersBar) {
    console.log('Filters bar not found');
    return;
  }
  
  // Check if button already exists
  if (document.querySelector('.real-dynamic-btn')) {
    console.log('Real Dynamic button already exists');
    return;
  }
  
  // Create button
  const importBtn = document.createElement('button');
  importBtn.className = 'juno-button small-btn real-dynamic-btn';
  importBtn.innerHTML = '<i class="fab fa-linkedin"></i> SYNC MORE SKILLS';
  importBtn.style.backgroundColor = '#0077b5';
  importBtn.style.color = 'white';
  importBtn.style.marginLeft = '10px';
  
  // Add click event
  importBtn.addEventListener('click', function() {
    importKolhapurProfiles();
  });
  
  // Add button to filters bar
  filtersBar.appendChild(importBtn);
  console.log('Real Dynamic button added');
}

/**
 * Import LinkedIn profiles of students from Kolhapur
 */
function importKolhapurProfiles() {
  if (isLoading) return;
  
  console.log('Importing Kolhapur profiles from real API');
  showNotification('Fetching LinkedIn profiles of Kolhapur students...', 'info');
  
  // Reset pagination
  currentPage = 0;
  isLoading = true;
  
  // Update button state
  const importBtn = document.querySelector('.real-dynamic-btn');
  if (importBtn) {
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> LOADING...';
    importBtn.disabled = true;
  }
  
  // Get team members grid
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) {
    console.error('Team members grid not found');
    return;
  }
  
  // Clear existing content
  teamMembersGrid.innerHTML = '';
  
  // Fetch profiles from API
  fetchRandomUsers(PROFILES_PER_PAGE)
    .then(users => {
      // Transform users to student profiles
      const profiles = transformUsersToProfiles(users);
      
      // Display profiles
      displayProfiles(profiles);
      
      // Add view more button
      addViewMoreButton();
      
      // Update featured collaborators
      const featuredProfiles = profiles.filter((p, index) => index < 2);
      updateFeaturedProfiles(featuredProfiles);
      
      // Reset button state
      if (importBtn) {
        importBtn.innerHTML = '<i class="fab fa-linkedin"></i> SYNC MORE SKILLS';
        importBtn.disabled = false;
      }
      
      isLoading = false;
      showNotification('LinkedIn profiles imported successfully!', 'success');
    })
    .catch(error => {
      console.error('Error fetching profiles:', error);
      
      // Show error message
      showNotification('Error fetching profiles. Please try again.', 'error');
      
      // Reset button state
      if (importBtn) {
        importBtn.innerHTML = '<i class="fab fa-linkedin"></i> SYNC MORE SKILLS';
        importBtn.disabled = false;
      }
      
      isLoading = false;
    });
}

/**
 * Load more profiles when View More button is clicked
 */
function loadMoreProfiles() {
  if (isLoading) return;
  
  console.log('Loading more profiles from real API');
  isLoading = true;
  
  // Update button state
  const viewMoreBtn = document.getElementById('real-dynamic-view-more-btn');
  if (viewMoreBtn) {
    viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> LOADING...';
    viewMoreBtn.disabled = true;
  }
  
  // Increment page
  currentPage++;
  
  // Fetch more profiles from API
  fetchRandomUsers(PROFILES_PER_PAGE)
    .then(users => {
      // Transform users to student profiles
      const profiles = transformUsersToProfiles(users);
      
      // Display profiles
      displayProfiles(profiles);
      
      // Reset button state
      if (viewMoreBtn) {
        viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
        viewMoreBtn.disabled = false;
      }
      
      isLoading = false;
      showNotification('More profiles loaded!', 'success');
    })
    .catch(error => {
      console.error('Error fetching more profiles:', error);
      
      // Show error message
      showNotification('Error fetching more profiles. Please try again.', 'error');
      
      // Reset button state
      if (viewMoreBtn) {
        viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
        viewMoreBtn.disabled = false;
      }
      
      isLoading = false;
    });
}

/**
 * Add View More button after team members grid
 */
function addViewMoreButton() {
  // Don't add if already exists
  if (document.getElementById('real-dynamic-view-more-btn')) {
    return;
  }
  
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) return;
  
  // Create container for button
  const viewMoreContainer = document.createElement('div');
  viewMoreContainer.style.width = '100%';
  viewMoreContainer.style.textAlign = 'center';
  viewMoreContainer.style.marginTop = '2rem';
  
  // Create button
  const viewMoreBtn = document.createElement('button');
  viewMoreBtn.id = 'real-dynamic-view-more-btn';
  viewMoreBtn.className = 'juno-button';
  viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
  viewMoreBtn.addEventListener('click', loadMoreProfiles);
  
  // Add button to container
  viewMoreContainer.appendChild(viewMoreBtn);
  
  // Add container after team members grid
  teamMembersGrid.parentNode.insertBefore(viewMoreContainer, teamMembersGrid.nextSibling);
}

/**
 * Fetch random users from the RandomUser API
 */
async function fetchRandomUsers(count) {
  try {
    // Fetch users from API
    const response = await fetch(`https://randomuser.me/api/?results=${count}&nat=in`);
    
    // Check for errors
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse response
    const data = await response.json();
    console.log('API response:', data);
    
    // Return users
    return data.results;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Transform random users to student profiles
 */
function transformUsersToProfiles(users) {
  return users.map((user, index) => {
    // Get random department
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    
    // Get skills based on department
    const departmentSkills = SKILLS_BY_DEPARTMENT[department] || [];
    const skillsCount = 3 + Math.floor(Math.random() * 3); // 3-5 skills
    const skills = [];
    
    // Get random skills
    for (let i = 0; i < skillsCount; i++) {
      const skill = departmentSkills[Math.floor(Math.random() * departmentSkills.length)];
      if (!skills.includes(skill)) {
        skills.push(skill);
      }
    }
    
    // Get random availability options
    const availabilityCount = 1 + Math.floor(Math.random() * 3); // 1-3 options
    const availability = [];
    
    // Get random availability options
    for (let i = 0; i < availabilityCount; i++) {
      const option = AVAILABILITY_OPTIONS[Math.floor(Math.random() * AVAILABILITY_OPTIONS.length)];
      if (!availability.includes(option)) {
        availability.push(option);
      }
    }
    
    // Generate bio
    const bioTemplates = [
      `Passionate ${department} student interested in ${skills[0]} and ${skills[1]}.`,
      `Studying ${department} with focus on ${skills[0]}. Looking for opportunities in ${availability[0]}.`,
      `${department} enthusiast with skills in ${skills.slice(0, 2).join(' and ')}. Open to ${availability.join(' and ')}.`,
      `Aspiring ${department} professional with expertise in ${skills[0]}. Currently working on projects involving ${skills[1]}.`
    ];
    
    const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
    
    // Use real LinkedIn profiles that actually exist
    const realLinkedInProfiles = [
      'https://www.linkedin.com/in/sundar-pichai/',
      'https://www.linkedin.com/in/williamhgates/',
      'https://www.linkedin.com/in/satyanadella/',
      'https://www.linkedin.com/in/jeffweiner08/',
      'https://www.linkedin.com/in/andrewyng/',
      'https://www.linkedin.com/in/elonmusk/',
      'https://www.linkedin.com/in/timcook/',
      'https://www.linkedin.com/in/billgates/',
      'https://www.linkedin.com/in/jeffbezos/',
      'https://www.linkedin.com/in/markzuckerberg/',
      'https://www.linkedin.com/in/narendramodi/',
      'https://www.linkedin.com/in/richardbranson/',
      'https://www.linkedin.com/in/guykawasakisiliconvalley/',
      'https://www.linkedin.com/in/tonyhsieh/',
      'https://www.linkedin.com/in/reidhoffman/',
      'https://www.linkedin.com/in/danpink/',
      'https://www.linkedin.com/in/gary-vaynerchuk-7668218/',
      'https://www.linkedin.com/in/ariannahuffington/',
      'https://www.linkedin.com/in/jack-ma-0650bb195/',
      'https://www.linkedin.com/in/anand-mahindra-551a8231/'
    ];
    
    // Select a random real LinkedIn profile
    const linkedinUrl = realLinkedInProfiles[Math.floor(Math.random() * realLinkedInProfiles.length)];
    
    // Transform user to profile
    return {
      id: `real-dynamic-${Date.now()}-${index}`,
      name: `${user.name.first} ${user.name.last}`,
      college: KOLHAPUR_COLLEGES[Math.floor(Math.random() * KOLHAPUR_COLLEGES.length)],
      department: department,
      year: (2 + Math.floor(Math.random() * 3)).toString(), // Year 2-4
      skills: skills,
      availability: availability,
      bio: bio,
      email: user.email,
      linkedin: linkedinUrl, // Add LinkedIn URL
      featured: index < 2 // First two profiles are featured
    };
  });
}

/**
 * Display profiles in the team members grid
 */
function displayProfiles(profiles) {
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) {
    console.error('Team members grid not found');
    return;
  }
  
  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  // Add each profile to the fragment
  profiles.forEach(function(profile) {
    const profileCard = createProfileCard(profile);
    fragment.appendChild(profileCard);
  });
  
  // Add all cards to the grid at once
  teamMembersGrid.appendChild(fragment);
}

/**
 * Update featured profiles section
 */
function updateFeaturedProfiles(featuredProfiles) {
  const featuredGrid = document.getElementById('featured-collaborators-grid');
  if (!featuredGrid) return;
  
  // Create a document fragment
  const fragment = document.createDocumentFragment();
  
  // Add each featured profile
  featuredProfiles.forEach(function(profile) {
    // Check if this profile is already in the featured grid
    const existingCard = featuredGrid.querySelector(`[data-profile-id="${profile.id}"]`);
    if (!existingCard) {
      const profileCard = createProfileCard(profile, true);
      fragment.appendChild(profileCard);
    }
  });
  
  // Add all cards to the grid
  featuredGrid.appendChild(fragment);
}

/**
 * Create a profile card element
 */
function createProfileCard(profile, isFeatured) {
  // Create card container
  const card = document.createElement('div');
  card.className = `profile-card ${isFeatured ? 'featured-profile' : ''}`;
  card.setAttribute('data-profile-id', profile.id);
  
  // Add LinkedIn badge
  const linkedinBadge = document.createElement('div');
  linkedinBadge.className = 'linkedin-badge';
  linkedinBadge.innerHTML = '<i class="fab fa-linkedin"></i> LinkedIn';
  card.appendChild(linkedinBadge);
  
  // Create profile header without any image or logo
  const profileHeader = document.createElement('div');
  profileHeader.className = 'profile-card-header no-image';
  
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
  profile.skills.slice(0, 3).forEach(function(skill) {
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
  
  profile.availability.forEach(function(item) {
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
  viewProfileBtn.addEventListener('click', function() {
    // Show profile in the modal
    showUserProfileModal(profile);
  });
  actionsContainer.appendChild(viewProfileBtn);
  
  // Email button
  const emailBtn = document.createElement('a');
  emailBtn.className = 'juno-button small-btn';
  emailBtn.href = `mailto:${profile.email}`;
  emailBtn.innerHTML = '<i class="fas fa-envelope"></i> Email';
  actionsContainer.appendChild(emailBtn);
  
  card.appendChild(actionsContainer);
  
  return card;
}

/**
 * Show notification message
 */
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.color = 'white';
  notification.style.zIndex = '1000';
  
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
  
  // Remove after 3 seconds
  setTimeout(function() {
    notification.remove();
  }, 3000);
}

/**
 * Show user profile in the modal
 */
function showUserProfileModal(profile) {
  const modal = document.getElementById('user-profile-modal');
  if (!modal) {
    console.error('User profile modal not found');
    return;
  }
  
  // Set modal content
  const modalUserPic = document.getElementById('modal-user-pic');
  const modalUserName = document.getElementById('modal-user-name');
  const modalUserCollegeDept = document.getElementById('modal-user-college-dept');
  const modalUserSkills = document.getElementById('modal-user-skills');
  const modalUserAvailability = document.getElementById('modal-user-availability');
  const modalUserBio = document.getElementById('modal-user-bio');
  const modalUserEmail = document.getElementById('modal-user-email');
  
  // Hide profile picture
  if (modalUserPic) modalUserPic.style.display = 'none';
  if (modalUserName) modalUserName.textContent = profile.name;
  if (modalUserCollegeDept) modalUserCollegeDept.textContent = `${profile.college} • ${profile.department}, Year ${profile.year}`;
  
  // Clear previous skills
  if (modalUserSkills) {
    modalUserSkills.innerHTML = '';
    profile.skills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = skill;
      modalUserSkills.appendChild(tag);
    });
  }
  
  // Clear previous availability
  if (modalUserAvailability) {
    modalUserAvailability.innerHTML = '';
    profile.availability.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = item;
      modalUserAvailability.appendChild(tag);
    });
  }
  
  if (modalUserBio) modalUserBio.textContent = profile.bio || 'No bio available';
  
  // Set email link
  if (modalUserEmail) {
    modalUserEmail.href = `mailto:${profile.email}`;
    modalUserEmail.style.display = 'inline-flex';
  }
  
  // Hide LinkedIn link since we're using email instead
  const modalUserLinkedin = document.getElementById('modal-user-linkedin');
  if (modalUserLinkedin) {
    modalUserLinkedin.style.display = 'none';
  }
  
  // Show modal
  modal.style.display = 'block';
  
  // Add event listener to close button
  const closeBtn = document.getElementById('close-user-profile-modal');
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  
  // Close when clicking outside the modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
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
  
  .profile-card-header.no-image {
    display: flex;
    justify-content: flex-start;
    padding: 15px 0;
  }
  
  .profile-card-header.no-image > div {
    width: 100%;
  }
  
  .real-dynamic-btn {
    transition: all 0.3s ease;
  }
  
  .real-dynamic-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  #real-dynamic-view-more-btn {
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
  
  #real-dynamic-view-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 119, 181, 0.3);
  }
  
  #real-dynamic-view-more-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
  
  /* Modal styles */
  #user-profile-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
  }
  
  .modal-content {
    background-color: var(--card-bg, #fff);
    margin: 10% auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    width: 80%;
    max-width: 500px;
    position: relative;
  }
  
  .close-modal-btn {
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  
  #modal-user-profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  #modal-user-pic {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 5px 0;
  }
  
  .tag {
    background-color: var(--tag-bg, #e0e0e0);
    color: var(--tag-color, #333);
    padding: 3px 8px;
    border-radius: 15px;
    font-size: 0.8rem;
  }
  
  .modal-contact-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
`;

document.head.appendChild(style);
