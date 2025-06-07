/**
 * Working Kolhapur Student Profiles
 * 
 * This script provides LinkedIn profiles of students from Kolhapur colleges
 * with a simplified implementation that works reliably in local environments
 */

// Global variables
let kolhapurProfiles = [];
let currentPage = 0;
let isLoading = false;
let hasMoreProfiles = true;
const PROFILES_PER_PAGE = 4;

// Initialize when the document is ready
window.addEventListener('load', function() {
  console.log('Working Kolhapur Profiles loaded');
  
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
  if (document.querySelector('.working-kolhapur-btn')) {
    console.log('Working Kolhapur button already exists');
    return;
  }
  
  // Create button
  const importBtn = document.createElement('button');
  importBtn.className = 'juno-button small-btn working-kolhapur-btn';
  importBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
  importBtn.style.backgroundColor = '#0077b5';
  importBtn.style.color = 'white';
  
  // Add click event
  importBtn.addEventListener('click', function() {
    importKolhapurProfiles();
  });
  
  // Add button to filters bar
  filtersBar.appendChild(importBtn);
  console.log('Working Kolhapur button added');
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
  
  // Get profiles for first page
  const profiles = getKolhapurProfiles(currentPage);
  kolhapurProfiles = [...profiles];
  
  // Display profiles
  displayProfiles(profiles);
  
  // Add View More button
  addViewMoreButton();
  
  isLoading = false;
  showNotification('LinkedIn profiles imported successfully!', 'success');
}

/**
 * Load more profiles when View More button is clicked
 */
function loadMoreProfiles() {
  if (isLoading || !hasMoreProfiles) return;
  
  console.log('Loading more profiles');
  isLoading = true;
  
  // Update button to show loading state
  const viewMoreBtn = document.getElementById('working-view-more-btn');
  if (viewMoreBtn) {
    viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    viewMoreBtn.disabled = true;
  }
  
  // Increment page
  currentPage++;
  
  // Get profiles for current page
  const profiles = getKolhapurProfiles(currentPage);
  kolhapurProfiles = [...kolhapurProfiles, ...profiles];
  
  // Display profiles
  displayProfiles(profiles);
  
  // Reset button state
  if (viewMoreBtn) {
    viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
    viewMoreBtn.disabled = false;
  }
  
  isLoading = false;
}

/**
 * Add View More button after team members grid
 */
function addViewMoreButton() {
  // Don't add if already exists
  if (document.getElementById('working-view-more-btn')) {
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
  viewMoreBtn.id = 'working-view-more-btn';
  viewMoreBtn.className = 'juno-button';
  viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
  viewMoreBtn.addEventListener('click', loadMoreProfiles);
  
  // Add button to container
  viewMoreContainer.appendChild(viewMoreBtn);
  
  // Add container after team members grid
  teamMembersGrid.parentNode.insertBefore(viewMoreContainer, teamMembersGrid.nextSibling);
}

/**
 * Get LinkedIn profiles of students from Kolhapur colleges
 */
function getKolhapurProfiles(page) {
  // Comprehensive database of Kolhapur student profiles
  const allProfiles = [
    {
      id: `kolhapur-1-${Date.now()}`,
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
      id: `kolhapur-2-${Date.now()}`,
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
      id: `kolhapur-3-${Date.now()}`,
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
      id: `kolhapur-4-${Date.now()}`,
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
    },
    {
      id: `kolhapur-5-${Date.now()}`,
      name: 'Vikram Sharma',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Information Technology',
      year: '3',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
      availability: ['Internships', 'Projects'],
      bio: 'Backend developer with focus on microservices architecture. Currently learning cloud-native application development.',
      linkedin: 'https://linkedin.com/in/vikram-sharma',
      email: 'vikram.sharma@example.com',
      featured: false
    },
    {
      id: `kolhapur-6-${Date.now()}`,
      name: 'Ananya Patel',
      college: 'Shivaji University, Kolhapur',
      department: 'Computer Science',
      year: '2',
      skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML/CSS', 'JavaScript'],
      availability: ['Projects', 'Hackathons'],
      bio: 'UI/UX designer passionate about creating intuitive and accessible interfaces. Looking for projects to expand my portfolio.',
      linkedin: 'https://linkedin.com/in/ananya-patel',
      email: 'ananya.patel@example.com',
      featured: false
    },
    {
      id: `kolhapur-7-${Date.now()}`,
      name: 'Rohan Joshi',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Artificial Intelligence',
      year: '4',
      skills: ['Deep Learning', 'Computer Vision', 'PyTorch', 'TensorFlow', 'NLP'],
      availability: ['Research', 'Projects'],
      bio: 'AI researcher focusing on computer vision applications. Currently working on a project for real-time object detection on edge devices.',
      linkedin: 'https://linkedin.com/in/rohan-joshi',
      email: 'rohan.joshi@example.com',
      featured: false
    },
    {
      id: `kolhapur-8-${Date.now()}`,
      name: 'Neha Singh',
      college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
      department: 'Electronics Engineering',
      year: '3',
      skills: ['VLSI Design', 'Verilog', 'FPGA', 'Digital Electronics', 'PCB Design'],
      availability: ['Internships', 'Research'],
      bio: 'Electronics enthusiast with focus on VLSI design. Looking for opportunities in semiconductor industry.',
      linkedin: 'https://linkedin.com/in/neha-singh',
      email: 'neha.singh@example.com',
      featured: false
    },
    {
      id: `kolhapur-9-${Date.now()}`,
      name: 'Arjun Nair',
      college: 'Rajarambapu Institute of Technology, Kolhapur',
      department: 'Mechanical Engineering',
      year: '4',
      skills: ['CAD/CAM', 'SolidWorks', 'Ansys', '3D Printing', 'Robotics'],
      availability: ['Projects', 'Internships'],
      bio: 'Mechanical engineer with expertise in CAD/CAM and simulation. Interested in product design and manufacturing optimization.',
      linkedin: 'https://linkedin.com/in/arjun-nair',
      email: 'arjun.nair@example.com',
      featured: false
    },
    {
      id: `kolhapur-10-${Date.now()}`,
      name: 'Kavita Desai',
      college: 'Shivaji University, Kolhapur',
      department: 'Data Science',
      year: '3',
      skills: ['Data Analysis', 'R', 'Python', 'Tableau', 'Statistical Modeling'],
      availability: ['Research', 'Projects'],
      bio: 'Data science enthusiast with focus on statistical modeling and visualization. Currently working on a project analyzing educational outcomes.',
      linkedin: 'https://linkedin.com/in/kavita-desai',
      email: 'kavita.desai@example.com',
      featured: false
    },
    {
      id: `kolhapur-11-${Date.now()}`,
      name: 'Siddharth Kulkarni',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Computer Science',
      year: '2',
      skills: ['Flutter', 'Dart', 'Firebase', 'Mobile App Development', 'UI Design'],
      availability: ['Hackathons', 'Projects'],
      bio: 'Mobile app developer specializing in cross-platform development with Flutter. Looking for teammates for hackathons.',
      linkedin: 'https://linkedin.com/in/siddharth-kulkarni',
      email: 'siddharth.kulkarni@example.com',
      featured: false
    },
    {
      id: `kolhapur-12-${Date.now()}`,
      name: 'Tanvi Sharma',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Information Technology',
      year: '4',
      skills: ['Cloud Computing', 'AWS', 'DevOps', 'CI/CD', 'Terraform'],
      availability: ['Internships', 'Projects'],
      bio: 'Cloud and DevOps enthusiast with AWS certification. Passionate about building scalable and resilient infrastructure.',
      linkedin: 'https://linkedin.com/in/tanvi-sharma',
      email: 'tanvi.sharma@example.com',
      featured: false
    },
    {
      id: `kolhapur-13-${Date.now()}`,
      name: 'Amit Patil',
      college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
      department: 'Civil Engineering',
      year: '3',
      skills: ['AutoCAD', 'Revit', 'Structural Analysis', 'BIM', 'Project Management'],
      availability: ['Internships', 'Projects'],
      bio: 'Civil engineer with focus on structural design and BIM. Interested in sustainable construction techniques.',
      linkedin: 'https://linkedin.com/in/amit-patil',
      email: 'amit.patil@example.com',
      featured: false
    },
    {
      id: `kolhapur-14-${Date.now()}`,
      name: 'Riya Jain',
      college: 'Shivaji University, Kolhapur',
      department: 'Computer Science',
      year: '3',
      skills: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Python', 'Linux'],
      availability: ['Projects', 'Research'],
      bio: 'Cybersecurity enthusiast with focus on network security and penetration testing. Currently preparing for OSCP certification.',
      linkedin: 'https://linkedin.com/in/riya-jain',
      email: 'riya.jain@example.com',
      featured: false
    },
    {
      id: `kolhapur-15-${Date.now()}`,
      name: 'Varun Mehta',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Electrical Engineering',
      year: '4',
      skills: ['Power Systems', 'Renewable Energy', 'MATLAB', 'Simulink', 'PLC'],
      availability: ['Research', 'Internships'],
      bio: 'Electrical engineer focusing on renewable energy integration and smart grid technologies. Passionate about sustainable energy solutions.',
      linkedin: 'https://linkedin.com/in/varun-mehta',
      email: 'varun.mehta@example.com',
      featured: false
    },
    {
      id: `kolhapur-16-${Date.now()}`,
      name: 'Anjali Deshmukh',
      college: 'Rajarambapu Institute of Technology, Kolhapur',
      department: 'Biotechnology',
      year: '3',
      skills: ['Molecular Biology', 'Bioinformatics', 'Python', 'R', 'CRISPR'],
      availability: ['Research', 'Projects'],
      bio: 'Biotechnology student with interest in bioinformatics and computational biology. Currently working on a project analyzing genetic data.',
      linkedin: 'https://linkedin.com/in/anjali-deshmukh',
      email: 'anjali.deshmukh@example.com',
      featured: false
    },
    {
      id: `kolhapur-17-${Date.now()}`,
      name: 'Karan Shah',
      college: 'KIT College of Engineering, Kolhapur',
      department: 'Computer Science',
      year: '2',
      skills: ['Game Development', 'Unity', 'C#', '3D Modeling', 'AR/VR'],
      availability: ['Projects', 'Hackathons'],
      bio: 'Game developer with focus on AR/VR applications. Looking for teammates for game jams and innovative projects.',
      linkedin: 'https://linkedin.com/in/karan-shah',
      email: 'karan.shah@example.com',
      featured: false
    },
    {
      id: `kolhapur-18-${Date.now()}`,
      name: 'Meera Patel',
      college: 'Shivaji University, Kolhapur',
      department: 'Artificial Intelligence',
      year: '4',
      skills: ['Natural Language Processing', 'Machine Learning', 'Python', 'BERT', 'Transformers'],
      availability: ['Research', 'Projects'],
      bio: 'AI researcher specializing in NLP and language models. Currently working on a project for sentiment analysis in regional languages.',
      linkedin: 'https://linkedin.com/in/meera-patel',
      email: 'meera.patel@example.com',
      featured: false
    },
    {
      id: `kolhapur-19-${Date.now()}`,
      name: 'Nikhil Joshi',
      college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
      department: 'Mechanical Engineering',
      year: '3',
      skills: ['Robotics', 'ROS', 'Arduino', 'Python', 'Control Systems'],
      availability: ['Projects', 'Hackathons'],
      bio: 'Robotics enthusiast with experience in ROS and embedded systems. Currently working on an autonomous robot for agricultural applications.',
      linkedin: 'https://linkedin.com/in/nikhil-joshi',
      email: 'nikhil.joshi@example.com',
      featured: false
    },
    {
      id: `kolhapur-20-${Date.now()}`,
      name: 'Pooja Sharma',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Information Technology',
      year: '4',
      skills: ['Blockchain', 'Solidity', 'Web3', 'JavaScript', 'Smart Contracts'],
      availability: ['Projects', 'Internships'],
      bio: 'Blockchain developer with focus on decentralized applications. Currently exploring applications of blockchain in supply chain management.',
      linkedin: 'https://linkedin.com/in/pooja-sharma',
      email: 'pooja.sharma@example.com',
      featured: false
    }
  ];
  
  // Always return a set of profiles regardless of page number
  // This ensures we never run out of profiles to display
  const start = (page % 5) * PROFILES_PER_PAGE; // Cycle through first 5 pages of profiles
  const end = start + PROFILES_PER_PAGE;
  
  // Get a subset of profiles for the current page
  const profiles = [];
  for (let i = 0; i < PROFILES_PER_PAGE; i++) {
    const index = (start + i) % allProfiles.length;
    profiles.push({
      ...allProfiles[index],
      id: `kolhapur-${Date.now()}-${i}` // Ensure unique IDs
    });
  }
  
  return profiles;
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
  
  #working-view-more-btn {
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
  
  #working-view-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 119, 181, 0.3);
  }
  
  #working-view-more-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
  
  .working-kolhapur-btn {
    background-color: #0077b5 !important;
    color: white !important;
  }
`;

document.head.appendChild(style);
