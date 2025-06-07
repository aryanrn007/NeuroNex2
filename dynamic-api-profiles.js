/**
 * Dynamic API Profiles
 * 
 * This script uses OpenRouter API to dynamically generate LinkedIn profiles 
 * of students from Kolhapur colleges in real-time
 */

// OpenRouter API configuration
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Global variables
let isLoading = false;
let currentPage = 0;

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dynamic API Profiles loaded');
  
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
  if (document.querySelector('.dynamic-api-btn')) {
    console.log('Dynamic API button already exists');
    return;
  }
  
  // Create button
  const importBtn = document.createElement('button');
  importBtn.className = 'juno-button small-btn dynamic-api-btn';
  importBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
  importBtn.style.backgroundColor = '#0077b5';
  importBtn.style.color = 'white';
  importBtn.style.marginLeft = '10px';
  
  // Add click event
  importBtn.addEventListener('click', function() {
    importKolhapurProfiles();
  });
  
  // Add button to filters bar
  filtersBar.appendChild(importBtn);
  console.log('Dynamic API button added');
}

/**
 * Import LinkedIn profiles of students from Kolhapur
 */
function importKolhapurProfiles() {
  if (isLoading) return;
  
  console.log('Importing Kolhapur profiles via API');
  showNotification('Generating LinkedIn profiles of Kolhapur students...', 'info');
  
  // Reset pagination
  currentPage = 0;
  isLoading = true;
  
  // Update button state
  const importBtn = document.querySelector('.dynamic-api-btn');
  if (importBtn) {
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERATING...';
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
  
  // Generate profiles
  generateDynamicProfiles(4)
    .then(profiles => {
      // Display profiles
      displayProfiles(profiles);
      
      // Add view more button
      addViewMoreButton();
      
      // Update featured collaborators
      const featuredProfiles = profiles.filter(p => p.featured);
      updateFeaturedProfiles(featuredProfiles);
      
      // Reset button state
      if (importBtn) {
        importBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
        importBtn.disabled = false;
      }
      
      isLoading = false;
      showNotification('LinkedIn profiles generated successfully!', 'success');
    })
    .catch(error => {
      console.error('Error generating profiles:', error);
      
      // Show error message
      showNotification('Error generating profiles. Please try again.', 'error');
      
      // Reset button state
      if (importBtn) {
        importBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
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
  
  console.log('Loading more profiles via API');
  isLoading = true;
  
  // Update button state
  const viewMoreBtn = document.getElementById('dynamic-api-view-more-btn');
  if (viewMoreBtn) {
    viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERATING...';
    viewMoreBtn.disabled = true;
  }
  
  // Increment page
  currentPage++;
  
  // Generate more profiles
  generateDynamicProfiles(4)
    .then(profiles => {
      // Display profiles
      displayProfiles(profiles);
      
      // Reset button state
      if (viewMoreBtn) {
        viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
        viewMoreBtn.disabled = false;
      }
      
      isLoading = false;
      showNotification('More profiles generated!', 'success');
    })
    .catch(error => {
      console.error('Error generating more profiles:', error);
      
      // Show error message
      showNotification('Error generating more profiles. Please try again.', 'error');
      
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
  if (document.getElementById('dynamic-api-view-more-btn')) {
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
  viewMoreBtn.id = 'dynamic-api-view-more-btn';
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
    // Create prompt for generating profiles
    const prompt = `Generate ${count} realistic LinkedIn profiles of engineering students from colleges in Kolhapur, India. 
    For each profile, include:
    - Full name (common Indian names)
    - College (from these colleges in Kolhapur: DY Patil College of Engineering, Shivaji University, KIT College of Engineering, Rajarambapu Institute of Technology, Bharati Vidyapeeth College of Engineering)
    - Department (like Computer Science, Information Technology, Mechanical Engineering, Electronics, etc.)
    - Year (2-4)
    - Skills (3-5 relevant technical skills)
    - Availability (Projects, Hackathons, Research, Internships)
    - Short bio (1-2 sentences about interests and goals)
    
    Format the response as a JSON array of objects. Do not include profile pictures.
    Make the profiles diverse in terms of skills, interests, and backgrounds.`;
    
    // Make API request
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus:beta',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates realistic student profile data in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    // Check for errors
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse response
    const data = await response.json();
    console.log('API response:', data);
    
    // Extract profiles from response
    let profilesText = data.choices[0].message.content;
    
    // Find JSON array in the response
    let jsonStart = profilesText.indexOf('[');
    let jsonEnd = profilesText.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON array found in response');
    }
    
    let jsonText = profilesText.substring(jsonStart, jsonEnd);
    
    // Parse JSON
    let profiles = JSON.parse(jsonText);
    
    // Process profiles
    return profiles.map((profile, index) => {
      return {
        id: `dynamic-api-${Date.now()}-${index}`,
        name: profile.name,
        college: profile.college,
        department: profile.department,
        year: profile.year.toString(),
        skills: profile.skills || [],
        availability: profile.availability || [],
        bio: profile.bio || '',
        featured: index < 2 // First two profiles are featured
      };
    });
  } catch (error) {
    console.error('Error generating profiles:', error);
    
    // Fallback to sample data if API fails
    return getFallbackProfiles();
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
    // Show profile details
    alert(`Profile: ${profile.name}\nCollege: ${profile.college}\nDepartment: ${profile.department}\nYear: ${profile.year}\nSkills: ${profile.skills.join(', ')}\nBio: ${profile.bio}`);
  });
  actionsContainer.appendChild(viewProfileBtn);
  
  // Connect button
  const connectBtn = document.createElement('a');
  connectBtn.className = 'juno-button small-btn';
  connectBtn.href = '#';
  connectBtn.innerHTML = '<i class="fab fa-linkedin"></i> Connect';
  actionsContainer.appendChild(connectBtn);
  
  card.appendChild(actionsContainer);
  
  return card;
}

/**
 * Get fallback profiles if API fails
 */
function getFallbackProfiles() {
  return [
    {
      id: `fallback-1-${Date.now()}`,
      name: 'Aditya Patil',
      college: 'DY Patil College of Engineering, Kolhapur',
      department: 'Computer Science',
      year: '3',
      skills: ['JavaScript', 'React', 'Node.js'],
      availability: ['Projects', 'Hackathons'],
      bio: 'Full stack web developer specializing in MERN stack.',
      featured: true
    },
    {
      id: `fallback-2-${Date.now()}`,
      name: 'Sneha Jadhav',
      college: 'Shivaji University, Kolhapur',
      department: 'Data Science',
      year: '4',
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      availability: ['Research', 'Projects'],
      bio: 'Passionate about applying machine learning to solve real-world problems.',
      featured: true
    },
    {
      id: `fallback-3-${Date.now()}`,
      name: 'Rahul Deshmukh',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Mechanical Engineering',
      year: '3',
      skills: ['IoT', 'Arduino', 'CAD'],
      availability: ['Projects', 'Internships'],
      bio: 'Combining mechanical engineering with IoT technologies.',
      featured: false
    },
    {
      id: `fallback-4-${Date.now()}`,
      name: 'Priya Kulkarni',
      college: 'Rajarambapu Institute of Technology, Kolhapur',
      department: 'Electronics Engineering',
      year: '4',
      skills: ['Embedded Systems', 'C++', 'PCB Design'],
      availability: ['Projects', 'Research'],
      bio: 'Specializing in embedded systems and FPGA design.',
      featured: false
    }
  ];
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
  
  .dynamic-api-btn {
    transition: all 0.3s ease;
  }
  
  .dynamic-api-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  #dynamic-api-view-more-btn {
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
  
  #dynamic-api-view-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 119, 181, 0.3);
  }
  
  #dynamic-api-view-more-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

document.head.appendChild(style);
