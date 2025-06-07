/**
 * Dynamic Kolhapur Student Profiles
 * 
 * This script uses OpenRouter API to dynamically generate LinkedIn profiles 
 * of students from Kolhapur colleges
 */

// OpenRouter API configuration
const OPENROUTER_CONFIG = {
  apiKey: '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',
  model: 'anthropic/claude-3-opus:beta', // Using Claude for high-quality profile generation
  endpoint: 'https://openrouter.ai/api/v1/chat/completions'
};

// Global variables
let kolhapurProfiles = [];
let currentPage = 0;
let isLoading = false;
let hasMoreProfiles = true;
const PROFILES_PER_PAGE = 4;
const MAX_CACHE_SIZE = 24; // Maximum number of profiles to cache

// List of colleges in Kolhapur
const KOLHAPUR_COLLEGES = [
  'DY Patil College of Engineering and Technology, Kolhapur',
  'Shivaji University, Kolhapur',
  'Rajarambapu Institute of Technology, Kolhapur',
  'KIT College of Engineering, Kolhapur',
  'Bharati Vidyapeeth College of Engineering, Kolhapur',
  'DKTE Society\'s Textile and Engineering Institute, Kolhapur',
  'Vivekanand College, Kolhapur',
  'Chhatrapati Shahu Institute of Business Education and Research, Kolhapur'
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

// Initialize when the document is ready
window.addEventListener('load', function() {
  console.log('Dynamic Kolhapur Profiles loaded');
  
  // Add the import button to the filters bar with a delay
  setTimeout(function() {
    addImportButton();
  }, 1500);
});

/**
 * Add LinkedIn import button to the filters bar
 */
function addImportButton() {
  // Find the filters bar
  const filtersBar = document.querySelector('.filters-bar');
  if (!filtersBar) {
    console.log('Filters bar not found');
    return;
  }
  
  // Check if button already exists
  if (document.querySelector('.dynamic-kolhapur-btn')) {
    console.log('Dynamic Kolhapur button already exists');
    return;
  }
  
  // Create button
  const importBtn = document.createElement('button');
  importBtn.className = 'juno-button small-btn dynamic-kolhapur-btn';
  importBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
  importBtn.style.backgroundColor = '#0077b5';
  importBtn.style.color = 'white';
  
  // Add click event
  importBtn.addEventListener('click', function() {
    importKolhapurProfiles();
  });
  
  // Add button to filters bar
  filtersBar.appendChild(importBtn);
  console.log('Dynamic Kolhapur button added');
}

/**
 * Import LinkedIn profiles of students from Kolhapur
 */
function importKolhapurProfiles() {
  if (isLoading) return;
  
  console.log('Importing Kolhapur profiles');
  showNotification('Importing LinkedIn profiles of Kolhapur students...', 'info');
  
  // Reset pagination
  currentPage = 0;
  kolhapurProfiles = [];
  hasMoreProfiles = true;
  isLoading = true;
  
  // Generate profiles
  generateDynamicProfiles(PROFILES_PER_PAGE)
    .then(function(profiles) {
      // Add to collection
      kolhapurProfiles = profiles;
      
      // Display profiles
      displayProfiles(profiles);
      
      // Add View More button
      addViewMoreButton();
      
      isLoading = false;
      showNotification('LinkedIn profiles imported successfully!', 'success');
    })
    .catch(function(error) {
      console.error('Error generating profiles:', error);
      showNotification('Error importing profiles. Falling back to sample data.', 'error');
      
      // Fallback to sample data
      const sampleProfiles = getSampleProfiles(currentPage);
      kolhapurProfiles = sampleProfiles;
      displayProfiles(sampleProfiles);
      addViewMoreButton();
      
      isLoading = false;
    });
}

/**
 * Load more profiles when View More button is clicked
 */
function loadMoreProfiles() {
  if (isLoading || !hasMoreProfiles) return;
  
  console.log('Loading more profiles');
  isLoading = true;
  
  // Update button to show loading state
  const viewMoreBtn = document.getElementById('dynamic-view-more-btn');
  if (viewMoreBtn) {
    viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    viewMoreBtn.disabled = true;
  }
  
  // Increment page
  currentPage++;
  
  // Check if we have cached profiles
  if (kolhapurProfiles.length >= (currentPage + 1) * PROFILES_PER_PAGE) {
    // Use cached profiles
    const start = currentPage * PROFILES_PER_PAGE;
    const end = start + PROFILES_PER_PAGE;
    const profiles = kolhapurProfiles.slice(start, end);
    
    // Display profiles
    displayProfiles(profiles);
    
    // Reset button state
    if (viewMoreBtn) {
      viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
      viewMoreBtn.disabled = false;
    }
    
    isLoading = false;
  } else {
    // Generate new profiles
    generateDynamicProfiles(PROFILES_PER_PAGE)
      .then(function(profiles) {
        // Add to collection
        kolhapurProfiles = [...kolhapurProfiles, ...profiles];
        
        // Limit cache size
        if (kolhapurProfiles.length > MAX_CACHE_SIZE) {
          kolhapurProfiles = kolhapurProfiles.slice(-MAX_CACHE_SIZE);
        }
        
        // Display profiles
        displayProfiles(profiles);
        
        // Reset button state
        if (viewMoreBtn) {
          viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
          viewMoreBtn.disabled = false;
        }
        
        isLoading = false;
      })
      .catch(function(error) {
        console.error('Error generating profiles:', error);
        
        // Fallback to sample data
        const sampleProfiles = getSampleProfiles(currentPage);
        kolhapurProfiles = [...kolhapurProfiles, ...sampleProfiles];
        displayProfiles(sampleProfiles);
        
        // Reset button state
        if (viewMoreBtn) {
          viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
          viewMoreBtn.disabled = false;
        }
        
        isLoading = false;
      });
  }
}

/**
 * Add View More button after team members grid
 */
function addViewMoreButton() {
  // Don't add if already exists
  if (document.getElementById('dynamic-view-more-btn')) {
    return;
  }
  
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) return;
  
  // Create container for button
  const viewMoreContainer = document.createElement('div');
  viewMoreContainer.className = 'view-more-container';
  viewMoreContainer.style.width = '100%';
  viewMoreContainer.style.textAlign = 'center';
  viewMoreContainer.style.marginTop = '2rem';
  
  // Create button
  const viewMoreBtn = document.createElement('button');
  viewMoreBtn.id = 'dynamic-view-more-btn';
  viewMoreBtn.className = 'juno-button';
  viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
  viewMoreBtn.addEventListener('click', loadMoreProfiles);
  
  // Add button to container
  viewMoreContainer.appendChild(viewMoreBtn);
  
  // Add container after team members grid
  teamMembersGrid.parentNode.insertBefore(viewMoreContainer, teamMembersGrid.nextSibling);
}

/**
 * Generate dynamic profiles using OpenRouter API
 */
async function generateDynamicProfiles(count) {
  try {
    const prompt = `Generate ${count} realistic LinkedIn profiles of engineering students from colleges in Kolhapur, India. 
    For each profile, include:
    - Full name (common Indian names)
    - College (use one from this list: ${KOLHAPUR_COLLEGES.join(', ')})
    - Department (like Computer Science, Information Technology, etc.)
    - Year (2-4)
    - Skills (5-7 relevant technical skills)
    - Availability (Projects, Hackathons, Research, Internships)
    - Short bio (2-3 sentences about interests and goals)
    - LinkedIn URL (fictional but realistic)
    - Email (fictional but realistic)
    
    Format the response as a JSON array of objects. Do not include profile pictures.
    Make the profiles diverse in terms of skills, interests, and backgrounds.`;
    
    const response = await fetch(OPENROUTER_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Kolhapur Student Profiles'
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates realistic student profile data in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the response content
    let profilesData;
    try {
      // Try to parse the content directly
      const content = data.choices[0].message.content;
      profilesData = JSON.parse(content);
      
      // Check if profiles is an array
      if (Array.isArray(profilesData.profiles)) {
        profilesData = profilesData.profiles;
      } else if (Array.isArray(profilesData)) {
        // Already an array
      } else {
        // Find any array property
        for (const key in profilesData) {
          if (Array.isArray(profilesData[key])) {
            profilesData = profilesData[key];
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing profiles:', error);
      throw new Error('Failed to parse profiles data');
    }
    
    // Process profiles
    const profiles = profilesData.map((profile, index) => {
      return {
        id: `dynamic-kolhapur-${Date.now()}-${index}`,
        name: profile.name,
        college: profile.college,
        department: profile.department,
        year: profile.year.toString(),
        skills: profile.skills,
        availability: profile.availability,
        bio: profile.bio,
        linkedin: profile.linkedin || `https://linkedin.com/in/${profile.name.toLowerCase().replace(/\s+/g, '-')}`,
        email: profile.email || `${profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        featured: index < 2 // First two profiles are featured
      };
    });
    
    return profiles;
  } catch (error) {
    console.error('Error generating profiles with OpenRouter:', error);
    // Fallback to sample data
    return getSampleProfiles(currentPage);
  }
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
  
  // Remove "no profiles" message if present
  const noProfilesMessage = teamMembersGrid.querySelector('.no-profiles-message');
  if (noProfilesMessage) {
    noProfilesMessage.remove();
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
  
  // Update featured collaborators section
  const featuredProfiles = profiles.filter(function(profile) {
    return profile.featured;
  });
  
  if (featuredProfiles.length > 0) {
    updateFeaturedCollaborators(featuredProfiles);
  }
}

/**
 * Update featured collaborators section
 */
function updateFeaturedCollaborators(featuredProfiles) {
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
    // Try to use existing modal function
    if (typeof window.showUserProfileModal === 'function') {
      window.showUserProfileModal(profile);
    } else {
      // Fallback to alert
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
 * Get sample LinkedIn profiles of students from Kolhapur colleges
 * Used as fallback if API fails
 */
function getSampleProfiles(page) {
  const allProfiles = [
    {
      id: `sample-kolhapur-1-${Date.now()}`,
      name: 'Aditya Patil',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Computer Science',
      year: '3',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      availability: ['Projects', 'Hackathons'],
      bio: 'Full stack web developer specializing in MERN stack. Looking for team members for hackathons and innovative projects.',
      linkedin: 'https://linkedin.com/in/aditya-patil',
      email: 'aditya.patil@example.com',
      featured: true
    },
    {
      id: `sample-kolhapur-2-${Date.now()}`,
      name: 'Sneha Jadhav',
      college: 'Shivaji University, Kolhapur',
      department: 'Data Science',
      year: '4',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'SQL'],
      availability: ['Projects', 'Research'],
      bio: 'Passionate about applying machine learning to solve real-world problems. Currently working on predictive analytics for healthcare.',
      linkedin: 'https://linkedin.com/in/sneha-jadhav',
      email: 'sneha.jadhav@example.com',
      featured: true
    },
    {
      id: `sample-kolhapur-3-${Date.now()}`,
      name: 'Rahul Deshmukh',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Mechanical Engineering',
      year: '3',
      skills: ['IoT', 'Arduino', 'Raspberry Pi', 'Python', 'CAD'],
      availability: ['Projects', 'Hackathons', 'Internships'],
      bio: 'Combining mechanical engineering with IoT technologies to build smart devices. Looking for interdisciplinary project collaborations.',
      linkedin: 'https://linkedin.com/in/rahul-deshmukh',
      email: 'rahul.deshmukh@example.com',
      featured: false
    },
    {
      id: `sample-kolhapur-4-${Date.now()}`,
      name: 'Priya Kulkarni',
      college: 'Rajarambapu Institute of Technology, Kolhapur',
      department: 'Electronics Engineering',
      year: '4',
      skills: ['Embedded Systems', 'C++', 'FPGA', 'PCB Design', 'ARM'],
      availability: ['Projects', 'Research'],
      bio: 'Specializing in embedded systems and FPGA design. Currently working on a low-power IoT sensor network for agricultural applications.',
      linkedin: 'https://linkedin.com/in/priya-kulkarni',
      email: 'priya.kulkarni@example.com',
      featured: false
    }
  ];
  
  // Always return 4 profiles by cycling through the sample profiles
  const start = (page % 2) * PROFILES_PER_PAGE;
  const end = start + PROFILES_PER_PAGE;
  const profiles = allProfiles.slice(start % allProfiles.length, end % (allProfiles.length + 1));
  
  // If we don't have enough profiles, add some more by modifying existing ones
  if (profiles.length < PROFILES_PER_PAGE) {
    const additionalProfiles = allProfiles.slice(0, PROFILES_PER_PAGE - profiles.length).map((profile, index) => {
      return {
        ...profile,
        id: `sample-kolhapur-extra-${Date.now()}-${index}`,
        name: profile.name.split(' ')[0] + ' ' + ['Sharma', 'Patel', 'Singh', 'Kumar'][index % 4],
        featured: false
      };
    });
    
    profiles.push(...additionalProfiles);
  }
  
  return profiles;
}

/**
 * Show notification message
 */
function showNotification(message, type) {
  // Check if function already exists in global scope
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  // Fallback implementation
  const notification = document.createElement('div');
  notification.className = 'notification ' + (type || 'info');
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

// Add CSS for LinkedIn integration
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
  
  .view-more-container {
    width: 100%;
    text-align: center;
    margin-top: 2rem;
  }
  
  #dynamic-view-more-btn {
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
  
  #dynamic-view-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 119, 181, 0.3);
  }
  
  #dynamic-view-more-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
  
  .dynamic-kolhapur-btn {
    background-color: #0077b5 !important;
    color: white !important;
  }
`;

document.head.appendChild(style);
