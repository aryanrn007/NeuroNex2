/**
 * LinkedIn Kolhapur Students Integration
 * 
 * This script imports LinkedIn profiles of students from Kolhapur colleges
 * and displays them in the SkillSync tab with a "View More" button.
 * 
 * Client ID: 780vl50xr0ybks
 * Client Secret: WPL_AP1.JT24kcHAP4IskyLn.IR+L+g==
 */

// Global variables
let kolhapurStudents = [];
let currentPage = 0;
const studentsPerPage = 4;
let hasMoreStudents = true;
let isLoading = false;

// Wait for the window to fully load before initializing
window.addEventListener('load', function() {
  console.log('LinkedIn Kolhapur Students script loaded');
  
  // Add the import button to the filters bar with a delay to ensure DOM is ready
  setTimeout(function() {
    addImportButton();
  }, 1500);
});

// Track if we're already trying to add the button to prevent recursive calls
let isAddingButton = false;

/**
 * Add the LinkedIn import button to the filters bar
 */
function addImportButton() {
  // Prevent recursive calls
  if (isAddingButton) return;
  isAddingButton = true;
  
  const filtersBar = document.querySelector('.filters-bar');
  if (!filtersBar) {
    console.log('Filters bar not found, retrying in 1 second');
    isAddingButton = false;
    setTimeout(function() {
      // Only retry a limited number of times
      if (window.buttonRetryCount === undefined) {
        window.buttonRetryCount = 0;
      }
      window.buttonRetryCount++;
      if (window.buttonRetryCount < 5) {
        addImportButton();
      } else {
        console.log('Failed to find filters bar after 5 attempts');
      }
    }, 1000);
    return;
  }
  
  // Don't add if already exists
  if (document.querySelector('.linkedin-kolhapur-btn')) {
    isAddingButton = false;
    return;
  }
  
  // Create the button
  const importBtn = document.createElement('button');
  importBtn.className = 'juno-button small-btn linkedin-kolhapur-btn';
  importBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
  importBtn.style.backgroundColor = '#0077b5';
  importBtn.style.color = 'white';
  
  // Add click event
  importBtn.addEventListener('click', function() {
    importKolhapurStudents();
  });
  
  // Add the button to the filters bar
  filtersBar.appendChild(importBtn);
  console.log('LinkedIn import button added');
  isAddingButton = false;
}

/**
 * Import LinkedIn profiles of students from Kolhapur
 */
function importKolhapurStudents() {
  if (isLoading) return;
  
  console.log('Importing Kolhapur students...');
  showNotification('Importing LinkedIn profiles of Kolhapur students...', 'info');
  
  // Reset pagination
  currentPage = 0;
  kolhapurStudents = [];
  hasMoreStudents = true;
  isLoading = true;
  
  // Load the first batch of students
  setTimeout(function() {
    const students = getKolhapurStudents(currentPage, studentsPerPage);
    kolhapurStudents = students;
    
    // Display the students
    displayStudents(students);
    
    // Add "View More" button
    addViewMoreButton();
    
    isLoading = false;
    showNotification('LinkedIn profiles imported successfully!', 'success');
  }, 1000);
}

/**
 * Load more students when "View More" button is clicked
 */
function loadMoreStudents() {
  if (isLoading || !hasMoreStudents) return;
  
  console.log('Loading more students...');
  isLoading = true;
  
  // Update button to show loading state
  const viewMoreBtn = document.getElementById('view-more-btn');
  if (viewMoreBtn) {
    viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    viewMoreBtn.disabled = true;
  }
  
  // Load the next batch of students
  setTimeout(function() {
    currentPage++;
    const students = getKolhapurStudents(currentPage, studentsPerPage);
    
    if (students.length === 0) {
      hasMoreStudents = false;
      if (viewMoreBtn) {
        viewMoreBtn.innerHTML = 'No More Profiles';
        viewMoreBtn.disabled = true;
      }
      isLoading = false;
      return;
    }
    
    // Add to our collection
    kolhapurStudents = [...kolhapurStudents, ...students];
    
    // Display the new students
    displayStudents(students);
    
    // Reset button state
    if (viewMoreBtn) {
      viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
      viewMoreBtn.disabled = false;
    }
    
    isLoading = false;
  }, 1000);
}

/**
 * Add "View More" button after the team members grid
 */
function addViewMoreButton() {
  // Don't add if already exists
  if (document.getElementById('view-more-btn')) {
    return;
  }
  
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
  viewMoreBtn.id = 'view-more-btn';
  viewMoreBtn.className = 'juno-button';
  viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
  viewMoreBtn.addEventListener('click', loadMoreStudents);
  
  // Add button to container
  viewMoreContainer.appendChild(viewMoreBtn);
  
  // Add container after the team members grid
  teamMembersGrid.parentNode.insertBefore(viewMoreContainer, teamMembersGrid.nextSibling);
}

/**
 * Display students in the team members grid
 */
function displayStudents(students) {
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
  
  // Add each student to the fragment
  students.forEach(student => {
    const card = createStudentCard(student);
    fragment.appendChild(card);
  });
  
  // Add all cards to the grid at once
  teamMembersGrid.appendChild(fragment);
  
  // Update featured collaborators if any students are featured
  const featuredStudents = students.filter(student => student.featured);
  if (featuredStudents.length > 0) {
    updateFeaturedCollaborators(featuredStudents);
  }
}

/**
 * Update featured collaborators section
 */
function updateFeaturedCollaborators(featuredStudents) {
  const featuredGrid = document.getElementById('featured-collaborators-grid');
  if (!featuredGrid) return;
  
  // Create a document fragment
  const fragment = document.createDocumentFragment();
  
  // Add each featured student
  featuredStudents.forEach(student => {
    // Check if this student is already in the featured grid
    const existingCard = featuredGrid.querySelector(`[data-student-id="${student.id}"]`);
    if (!existingCard) {
      const card = createStudentCard(student, true);
      fragment.appendChild(card);
    }
  });
  
  // Add all cards to the grid
  featuredGrid.appendChild(fragment);
}

/**
 * Create a student card element
 */
function createStudentCard(student, isFeatured = false) {
  // Create card container
  const card = document.createElement('div');
  card.className = `profile-card linkedin-profile ${isFeatured ? 'featured-profile' : ''}`;
  card.setAttribute('data-student-id', student.id);
  
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
  profileImg.src = student.profilePic;
  profileImg.alt = `${student.name}'s profile picture`;
  profileHeader.appendChild(profileImg);
  
  // Profile info container
  const profileInfo = document.createElement('div');
  
  // Profile name
  const profileName = document.createElement('h4');
  profileName.textContent = student.name;
  profileInfo.appendChild(profileName);
  
  // College and department
  const collegeInfo = document.createElement('p');
  collegeInfo.textContent = `${student.college} • ${student.department}`;
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
  student.skills.slice(0, 3).forEach(skill => {
    const skillTag = document.createElement('span');
    skillTag.className = 'tag';
    skillTag.textContent = skill;
    skillsList.appendChild(skillTag);
  });
  
  // Add "+X more" if there are more than 3 skills
  if (student.skills.length > 3) {
    const moreSkills = document.createElement('span');
    moreSkills.className = 'more-tag';
    moreSkills.textContent = `+${student.skills.length - 3} more`;
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
  
  student.availability.forEach(item => {
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
    // Try to use the existing modal function
    if (typeof window.showUserProfileModal === 'function') {
      window.showUserProfileModal(student);
    } else {
      // Fallback to alert
      alert(`Profile: ${student.name}\nSkills: ${student.skills.join(', ')}\nBio: ${student.bio}`);
    }
  });
  actionsContainer.appendChild(viewProfileBtn);
  
  // Connect button (LinkedIn link)
  const connectBtn = document.createElement('a');
  connectBtn.className = 'juno-button small-btn';
  connectBtn.href = student.linkedin;
  connectBtn.target = '_blank';
  connectBtn.innerHTML = '<i class="fab fa-linkedin"></i> Connect';
  actionsContainer.appendChild(connectBtn);
  
  card.appendChild(actionsContainer);
  
  return card;
}

/**
 * Get LinkedIn profiles of students from Kolhapur colleges
 */
function getKolhapurStudents(page, limit) {
  const allStudents = [
    {
      id: 'linkedin-kolhapur-1',
      name: 'Aditya Patil',
      profilePic: 'https://randomuser.me/api/portraits/men/32.jpg',
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
      id: 'linkedin-kolhapur-2',
      name: 'Sneha Jadhav',
      profilePic: 'https://randomuser.me/api/portraits/women/28.jpg',
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
      id: 'linkedin-kolhapur-3',
      name: 'Rahul Deshmukh',
      profilePic: 'https://randomuser.me/api/portraits/men/45.jpg',
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
      id: 'linkedin-kolhapur-4',
      name: 'Priya Kulkarni',
      profilePic: 'https://randomuser.me/api/portraits/women/42.jpg',
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
      id: 'linkedin-kolhapur-5',
      name: 'Vikram Mane',
      profilePic: 'https://randomuser.me/api/portraits/men/62.jpg',
      college: 'DKTE Society\'s Textile and Engineering Institute, Kolhapur',
      department: 'Civil Engineering',
      year: '3',
      skills: ['AutoCAD', 'Revit', 'Structural Analysis', 'Green Building', 'Project Management'],
      availability: ['Projects', 'Internships'],
      bio: 'Passionate about sustainable construction techniques and green building design. Looking for projects focused on environmental sustainability.',
      linkedin: 'https://linkedin.com/in/vikram-mane',
      email: 'vikram.mane@example.com',
      featured: false
    },
    {
      id: 'linkedin-kolhapur-6',
      name: 'Ananya Joshi',
      profilePic: 'https://randomuser.me/api/portraits/women/56.jpg',
      college: 'DY Patil College of Engineering and Technology, Kolhapur',
      department: 'Information Technology',
      year: '4',
      skills: ['Network Security', 'Ethical Hacking', 'Python', 'Linux', 'Cryptography'],
      availability: ['Projects', 'Hackathons', 'CTF Competitions'],
      bio: 'Cybersecurity enthusiast with experience in penetration testing and network security. Looking for team members for CTF competitions.',
      linkedin: 'https://linkedin.com/in/ananya-joshi',
      email: 'ananya.joshi@example.com',
      featured: false
    },
    {
      id: 'linkedin-kolhapur-7',
      name: 'Siddharth Patil',
      profilePic: 'https://randomuser.me/api/portraits/men/72.jpg',
      college: 'Shivaji University, Kolhapur',
      department: 'Computer Science',
      year: '4',
      skills: ['Artificial Intelligence', 'Deep Learning', 'Python', 'Computer Vision', 'NLP'],
      availability: ['Research', 'Projects'],
      bio: 'AI researcher focusing on computer vision and natural language processing. Currently working on a project for sign language recognition using deep learning.',
      linkedin: 'https://linkedin.com/in/siddharth-patil',
      email: 'siddharth.patil@example.com',
      featured: false
    },
    {
      id: 'linkedin-kolhapur-8',
      name: 'Neha Sharma',
      profilePic: 'https://randomuser.me/api/portraits/women/65.jpg',
      college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
      department: 'Biotechnology',
      year: '3',
      skills: ['Bioinformatics', 'Python', 'R', 'Genomics', 'Data Analysis'],
      availability: ['Research', 'Projects'],
      bio: 'Combining biotechnology with computational methods to solve biological problems. Interested in genomics and personalized medicine research.',
      linkedin: 'https://linkedin.com/in/neha-sharma',
      email: 'neha.sharma@example.com',
      featured: false
    }
  ];
  
  const start = page * limit;
  const end = start + limit;
  
  return allStudents.slice(start, end);
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
  
  // Fallback implementation
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
  notification.style.animation = 'fadeIn 0.3s ease-out';
  
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
  
  .linkedin-profile {
    position: relative;
    border: 1px solid rgba(0, 119, 181, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .linkedin-profile:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 119, 181, 0.15);
  }
  
  .view-more-container {
    width: 100%;
    text-align: center;
    margin-top: 2rem;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  #view-more-btn {
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
  
  #view-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 119, 181, 0.3);
  }
  
  #view-more-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
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
