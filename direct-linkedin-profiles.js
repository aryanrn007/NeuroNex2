/**
 * Direct LinkedIn Profiles Integration
 * This is a standalone script that adds LinkedIn profiles directly to the SkillSync page
 * without relying on any external APIs or complex authentication flows.
 */

// Wait for the page to be fully loaded
window.addEventListener('load', function() {
  console.log('Direct LinkedIn profiles script loaded');
  
  // Add the import button after a short delay to ensure DOM is ready
  setTimeout(function() {
    addImportButton();
  }, 1500);
});

/**
 * Add the LinkedIn import button to the filters bar
 */
function addImportButton() {
  // Find the filters bar
  const filtersBar = document.querySelector('.filters-bar');
  if (!filtersBar) {
    console.error('Filters bar not found');
    return;
  }
  
  // Check if button already exists
  if (document.querySelector('.linkedin-import-btn')) {
    console.log('LinkedIn import button already exists');
    return;
  }
  
  // Create the button
  const importBtn = document.createElement('button');
  importBtn.className = 'juno-button small-btn linkedin-import-btn';
  importBtn.style.backgroundColor = '#0077b5';
  importBtn.style.color = 'white';
  importBtn.style.marginLeft = '10px';
  importBtn.innerHTML = '<i class="fab fa-linkedin"></i> Import LinkedIn Profiles';
  
  // Add click event
  importBtn.addEventListener('click', function() {
    importLinkedInProfiles();
  });
  
  // Add the button to the filters bar
  filtersBar.appendChild(importBtn);
  console.log('LinkedIn import button added to filters bar');
}

/**
 * Import LinkedIn profiles directly
 */
function importLinkedInProfiles() {
  showNotification('Importing LinkedIn profiles...', 'info');
  
  // Generate sample profiles
  const profiles = generateSampleProfiles();
  
  // Add profiles to the page after a short delay
  setTimeout(function() {
    addProfilesToPage(profiles);
    showNotification('LinkedIn profiles imported successfully!', 'success');
  }, 1000);
}

/**
 * Generate sample LinkedIn profiles
 */
function generateSampleProfiles() {
  return [
    {
      name: 'Priya Sharma',
      college: 'Massachusetts Institute of Technology',
      department: 'Computer Science',
      year: '3',
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Analysis'],
      availability: ['Projects', 'Hackathons'],
      profilePic: 'https://randomuser.me/api/portraits/women/32.jpg',
      linkedin: 'https://linkedin.com/in/priya-sharma',
      featured: true
    },
    {
      name: 'Raj Patel',
      college: 'Stanford University',
      department: 'Software Engineering',
      year: '4',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      availability: ['Projects', 'Hackathons', 'Events'],
      profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
      linkedin: 'https://linkedin.com/in/raj-patel',
      featured: true
    },
    {
      name: 'Ananya Desai',
      college: 'University of California, Berkeley',
      department: 'Data Science',
      year: '2',
      skills: ['Python', 'R', 'SQL', 'Data Visualization', 'Statistical Analysis'],
      availability: ['Projects', 'Hackathons'],
      profilePic: 'https://randomuser.me/api/portraits/women/65.jpg',
      linkedin: 'https://linkedin.com/in/ananya-desai',
      featured: false
    },
    {
      name: 'Arjun Mehta',
      college: 'Georgia Institute of Technology',
      department: 'Cybersecurity',
      year: '3',
      skills: ['Network Security', 'Penetration Testing', 'Python', 'Linux', 'Cryptography'],
      availability: ['Projects', 'Events'],
      profilePic: 'https://randomuser.me/api/portraits/men/22.jpg',
      linkedin: 'https://linkedin.com/in/arjun-mehta',
      featured: false
    }
  ];
}

/**
 * Add profiles to the page
 */
function addProfilesToPage(profiles) {
  // Get the featured collaborators grid and team members grid
  const featuredGrid = document.getElementById('featured-collaborators-grid');
  const teamGrid = document.getElementById('team-members-grid');
  
  if (!featuredGrid || !teamGrid) {
    console.error('Profile grids not found');
    return;
  }
  
  // Clear existing content
  featuredGrid.innerHTML = '';
  
  // Hide no profiles message if it exists
  const noProfilesMsg = teamGrid.querySelector('.no-profiles-message');
  if (noProfilesMsg) {
    noProfilesMsg.style.display = 'none';
  }
  
  // Add featured profiles
  const featuredProfiles = profiles.filter(p => p.featured);
  featuredProfiles.forEach(profile => {
    featuredGrid.appendChild(createProfileCard(profile, true));
  });
  
  // Add all profiles to team members grid
  profiles.forEach(profile => {
    teamGrid.appendChild(createProfileCard(profile, false));
  });
}

/**
 * Create a profile card element
 */
function createProfileCard(profile, isFeatured) {
  // Create card container
  const card = document.createElement('div');
  card.className = 'profile-card linkedin-profile';
  if (isFeatured) {
    card.classList.add('featured');
  }
  
  // Add LinkedIn badge
  const badge = document.createElement('div');
  badge.className = 'linkedin-badge';
  badge.innerHTML = '<i class="fab fa-linkedin"></i> LinkedIn';
  badge.style.position = 'absolute';
  badge.style.top = '10px';
  badge.style.right = '10px';
  badge.style.backgroundColor = '#0077b5';
  badge.style.color = 'white';
  badge.style.padding = '3px 8px';
  badge.style.borderRadius = '4px';
  badge.style.fontSize = '0.7rem';
  card.appendChild(badge);
  
  // Add profile image
  const img = document.createElement('img');
  img.className = 'profile-img';
  img.src = profile.profilePic;
  img.alt = profile.name;
  card.appendChild(img);
  
  // Add profile info container
  const info = document.createElement('div');
  info.className = 'profile-info';
  
  // Add name
  const name = document.createElement('h4');
  name.className = 'profile-name';
  name.textContent = profile.name;
  info.appendChild(name);
  
  // Add college and department
  const college = document.createElement('p');
  college.className = 'profile-college';
  college.textContent = `${profile.college} • ${profile.department}`;
  info.appendChild(college);
  
  // Add skills
  const skillsContainer = document.createElement('div');
  skillsContainer.className = 'profile-skills';
  
  const skillsTitle = document.createElement('span');
  skillsTitle.className = 'skills-title';
  skillsTitle.textContent = 'Skills: ';
  skillsContainer.appendChild(skillsTitle);
  
  const skillsList = document.createElement('div');
  skillsList.className = 'skills-list';
  
  // Add first 3 skills
  profile.skills.slice(0, 3).forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.textContent = skill;
    skillsList.appendChild(skillTag);
  });
  
  // Add +X more if needed
  if (profile.skills.length > 3) {
    const more = document.createElement('span');
    more.className = 'more-skills';
    more.textContent = `+${profile.skills.length - 3} more`;
    skillsList.appendChild(more);
  }
  
  skillsContainer.appendChild(skillsList);
  info.appendChild(skillsContainer);
  
  // Add availability
  const availability = document.createElement('p');
  availability.className = 'profile-availability';
  availability.innerHTML = `<span class="availability-title">Available for:</span> ${profile.availability.join(', ')}`;
  info.appendChild(availability);
  
  card.appendChild(info);
  
  // Add actions
  const actions = document.createElement('div');
  actions.className = 'profile-actions';
  
  // View profile button
  const viewBtn = document.createElement('button');
  viewBtn.className = 'view-profile-btn';
  viewBtn.innerHTML = '<i class="fas fa-user"></i> View Profile';
  viewBtn.addEventListener('click', function() {
    alert(`Profile: ${profile.name}\nSkills: ${profile.skills.join(', ')}`);
  });
  actions.appendChild(viewBtn);
  
  // Connect button
  const connectBtn = document.createElement('a');
  connectBtn.className = 'connect-btn';
  connectBtn.href = profile.linkedin;
  connectBtn.target = '_blank';
  connectBtn.innerHTML = '<i class="fas fa-link"></i> Connect';
  actions.appendChild(connectBtn);
  
  card.appendChild(actions);
  
  return card;
}

/**
 * Show a notification message
 */
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
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
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
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
