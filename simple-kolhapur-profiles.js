/**
 * Simple Kolhapur Student Profiles
 * 
 * This is a simplified implementation that directly adds profiles to the page
 * without any complex logic or API calls
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Simple Kolhapur Profiles script loaded');
  
  // Add import button after a short delay
  setTimeout(function() {
    addImportButton();
  }, 1000);
});

// Add the import button to the filters bar
function addImportButton() {
  const filtersBar = document.querySelector('.filters-bar');
  if (!filtersBar) {
    console.log('Filters bar not found');
    return;
  }
  
  // Create button
  const importBtn = document.createElement('button');
  importBtn.className = 'juno-button small-btn';
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
  console.log('Import button added');
}

// Import profiles when button is clicked
function importKolhapurProfiles() {
  console.log('Importing Kolhapur profiles');
  
  // Get team members grid
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) {
    console.error('Team members grid not found');
    return;
  }
  
  // Clear existing content
  teamMembersGrid.innerHTML = '';
  
  // Add profiles
  const profiles = getKolhapurProfiles();
  
  // Add each profile to the grid
  profiles.forEach(function(profile) {
    const profileCard = createProfileCard(profile);
    teamMembersGrid.appendChild(profileCard);
  });
  
  // Add view more button
  addViewMoreButton();
  
  // Add featured profiles
  updateFeaturedProfiles(profiles.filter(p => p.featured));
  
  // Show success message
  showNotification('LinkedIn profiles imported successfully!', 'success');
}

// Load more profiles when View More button is clicked
function loadMoreProfiles() {
  console.log('Loading more profiles');
  
  // Get team members grid
  const teamMembersGrid = document.getElementById('team-members-grid');
  if (!teamMembersGrid) return;
  
  // Get more profiles
  const profiles = getMoreKolhapurProfiles();
  
  // Add each profile to the grid
  profiles.forEach(function(profile) {
    const profileCard = createProfileCard(profile);
    teamMembersGrid.appendChild(profileCard);
  });
  
  // Show success message
  showNotification('More profiles loaded!', 'success');
}

// Add View More button
function addViewMoreButton() {
  // Don't add if already exists
  if (document.getElementById('simple-view-more-btn')) {
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
  viewMoreBtn.id = 'simple-view-more-btn';
  viewMoreBtn.className = 'juno-button';
  viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
  viewMoreBtn.addEventListener('click', loadMoreProfiles);
  
  // Add button to container
  viewMoreContainer.appendChild(viewMoreBtn);
  
  // Add container after team members grid
  teamMembersGrid.parentNode.insertBefore(viewMoreContainer, teamMembersGrid.nextSibling);
}

// Update featured profiles section
function updateFeaturedProfiles(featuredProfiles) {
  const featuredGrid = document.getElementById('featured-collaborators-grid');
  if (!featuredGrid) return;
  
  // Add each featured profile
  featuredProfiles.forEach(function(profile) {
    const profileCard = createProfileCard(profile, true);
    featuredGrid.appendChild(profileCard);
  });
}

// Create a profile card element
function createProfileCard(profile, isFeatured) {
  // Create card container
  const card = document.createElement('div');
  card.className = `profile-card ${isFeatured ? 'featured-profile' : ''}`;
  
  // Add LinkedIn badge
  const linkedinBadge = document.createElement('div');
  linkedinBadge.className = 'linkedin-badge';
  linkedinBadge.innerHTML = '<i class="fab fa-linkedin"></i> LinkedIn';
  card.appendChild(linkedinBadge);
  
  // Create profile header without any image
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
  
  // Add skills as tags
  profile.skills.slice(0, 3).forEach(function(skill) {
    const skillTag = document.createElement('span');
    skillTag.className = 'tag';
    skillTag.textContent = skill;
    skillsList.appendChild(skillTag);
  });
  
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
    alert(`Profile: ${profile.name}\nCollege: ${profile.college}\nSkills: ${profile.skills.join(', ')}`);
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

// Get initial set of Kolhapur profiles
function getKolhapurProfiles() {
  return [
    {
      name: 'Aditya Patil',
      college: 'DY Patil College of Engineering, Kolhapur',
      department: 'Computer Science',
      skills: ['JavaScript', 'React', 'Node.js'],
      availability: ['Projects', 'Hackathons'],
      featured: true
    },
    {
      name: 'Sneha Jadhav',
      college: 'Shivaji University, Kolhapur',
      department: 'Data Science',
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      availability: ['Research', 'Projects'],
      featured: true
    },
    {
      name: 'Rahul Deshmukh',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Mechanical Engineering',
      skills: ['IoT', 'Arduino', 'CAD'],
      availability: ['Projects', 'Internships'],
      featured: false
    },
    {
      name: 'Priya Kulkarni',
      college: 'Rajarambapu Institute of Technology, Kolhapur',
      department: 'Electronics Engineering',
      skills: ['Embedded Systems', 'C++', 'PCB Design'],
      availability: ['Projects', 'Research'],
      featured: false
    }
  ];
}

// Get more Kolhapur profiles
function getMoreKolhapurProfiles() {
  return [
    {
      name: 'Vikram Sharma',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Information Technology',
      skills: ['Java', 'Spring Boot', 'Microservices'],
      availability: ['Internships', 'Projects'],
      featured: false
    },
    {
      name: 'Ananya Patel',
      college: 'Shivaji University, Kolhapur',
      department: 'Computer Science',
      skills: ['UI/UX Design', 'Figma', 'HTML/CSS'],
      availability: ['Projects', 'Hackathons'],
      featured: false
    },
    {
      name: 'Rohan Joshi',
      college: 'DY Patil College of Engineering, Kolhapur',
      department: 'Artificial Intelligence',
      skills: ['Deep Learning', 'Computer Vision', 'PyTorch'],
      availability: ['Research', 'Projects'],
      featured: false
    },
    {
      name: 'Neha Singh',
      college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
      department: 'Electronics Engineering',
      skills: ['VLSI Design', 'Verilog', 'FPGA'],
      availability: ['Internships', 'Research'],
      featured: false
    }
  ];
}

// Show notification message
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
`;

document.head.appendChild(style);
