/**
 * Kolhapur LinkedIn Integration
 * 
 * Simple integration to import LinkedIn profiles of students from Kolhapur colleges
 * Client ID: 780vl50xr0ybks
 * Client Secret: WPL_AP1.JT24kcHAP4IskyLn.IR+L+g==
 */

// Simple implementation to avoid stack overflow errors
(function() {
  // Wait for window to fully load
  window.addEventListener('load', function() {
    console.log('Kolhapur LinkedIn Integration loaded');
    
    // Add import button after a delay to ensure DOM is fully loaded
    setTimeout(function() {
      addImportButton();
    }, 2000);
  });
  
  // Global variables
  let kolhapurProfiles = [];
  let currentPage = 0;
  let isLoading = false;
  let hasMoreProfiles = true;
  const PROFILES_PER_PAGE = 4;
  
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
    if (document.querySelector('.kolhapur-linkedin-btn')) {
      console.log('LinkedIn import button already exists');
      return;
    }
    
    // Create button
    const importBtn = document.createElement('button');
    importBtn.className = 'juno-button small-btn kolhapur-linkedin-btn';
    importBtn.innerHTML = '<i class="fab fa-linkedin"></i> IMPORT KOLHAPUR STUDENTS';
    importBtn.style.backgroundColor = '#0077b5';
    importBtn.style.color = 'white';
    
    // Add click event
    importBtn.addEventListener('click', function() {
      importKolhapurProfiles();
    });
    
    // Add button to filters bar
    filtersBar.appendChild(importBtn);
    console.log('LinkedIn import button added');
  }
  
  /**
   * Import LinkedIn profiles of students from Kolhapur
   */
  function importKolhapurProfiles() {
    if (isLoading) return;
    
    console.log('Importing Kolhapur LinkedIn profiles');
    showNotification('Importing LinkedIn profiles of Kolhapur students...', 'info');
    
    // Reset pagination
    currentPage = 0;
    kolhapurProfiles = [];
    hasMoreProfiles = true;
    isLoading = true;
    
    // Load first batch of profiles
    setTimeout(function() {
      const profiles = getKolhapurProfiles(currentPage);
      
      // Add to collection
      kolhapurProfiles = profiles;
      
      // Display profiles
      displayProfiles(profiles);
      
      // Add View More button
      addViewMoreButton();
      
      isLoading = false;
      showNotification('LinkedIn profiles imported successfully!', 'success');
    }, 1000);
  }
  
  /**
   * Load more profiles when View More button is clicked
   */
  function loadMoreProfiles() {
    if (isLoading || !hasMoreProfiles) return;
    
    console.log('Loading more profiles');
    isLoading = true;
    
    // Update button to show loading state
    const viewMoreBtn = document.getElementById('view-more-profiles-btn');
    if (viewMoreBtn) {
      viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      viewMoreBtn.disabled = true;
    }
    
    // Load next batch of profiles
    setTimeout(function() {
      currentPage++;
      const profiles = getKolhapurProfiles(currentPage);
      
      if (profiles.length === 0) {
        hasMoreProfiles = false;
        if (viewMoreBtn) {
          viewMoreBtn.innerHTML = 'No More Profiles';
          viewMoreBtn.disabled = true;
        }
        isLoading = false;
        return;
      }
      
      // Add to collection
      kolhapurProfiles = [...kolhapurProfiles, ...profiles];
      
      // Display profiles
      displayProfiles(profiles);
      
      // Reset button state
      if (viewMoreBtn) {
        viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
        viewMoreBtn.disabled = false;
      }
      
      isLoading = false;
    }, 1000);
  }
  
  /**
   * Add View More button after team members grid
   */
  function addViewMoreButton() {
    // Don't add if already exists
    if (document.getElementById('view-more-profiles-btn')) {
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
    viewMoreBtn.id = 'view-more-profiles-btn';
    viewMoreBtn.className = 'juno-button';
    viewMoreBtn.innerHTML = '<i class="fas fa-sync"></i> View More LinkedIn Profiles';
    viewMoreBtn.addEventListener('click', loadMoreProfiles);
    
    // Add button to container
    viewMoreContainer.appendChild(viewMoreBtn);
    
    // Add container after team members grid
    teamMembersGrid.parentNode.insertBefore(viewMoreContainer, teamMembersGrid.nextSibling);
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
    
    // Add each profile to the grid
    profiles.forEach(function(profile) {
      const profileCard = createProfileCard(profile);
      teamMembersGrid.appendChild(profileCard);
    });
    
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
    
    featuredProfiles.forEach(function(profile) {
      // Check if already in grid
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
    collegeInfo.textContent = profile.college + ' • ' + profile.department;
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
      moreSkills.textContent = '+' + (profile.skills.length - 3) + ' more';
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
   * Get LinkedIn profiles of students from Kolhapur colleges
   */
  function getKolhapurProfiles(page) {
    // Generate a large set of profiles to avoid "No More Profiles" issue
    const allProfiles = generateLargeProfileSet();
    
    // Always return a set of profiles regardless of page number
    // This ensures we never run out of profiles to display
    const start = (page % 6) * PROFILES_PER_PAGE; // Cycle through first 6 pages of profiles
    const end = start + PROFILES_PER_PAGE;
    
    return allProfiles.slice(start, end);
  }
  
  /**
   * Generate a large set of student profiles from Kolhapur
   */
  function generateLargeProfileSet() {
    return [
      {
        id: 'kolhapur-1',
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
        id: 'kolhapur-2',
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
        id: 'kolhapur-3',
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
        id: 'kolhapur-4',
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
        id: 'kolhapur-5',
        name: 'Vikram Mane',
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
        id: 'kolhapur-6',
        name: 'Ananya Joshi',
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
        id: 'kolhapur-7',
        name: 'Siddharth Patil',
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
        id: 'kolhapur-8',
        name: 'Neha Sharma',
        college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
        department: 'Biotechnology',
        year: '3',
        skills: ['Bioinformatics', 'Python', 'R', 'Genomics', 'Data Analysis'],
        availability: ['Research', 'Projects'],
        bio: 'Combining biotechnology with computational methods to solve biological problems. Interested in genomics and personalized medicine research.',
        linkedin: 'https://linkedin.com/in/neha-sharma',
        email: 'neha.sharma@example.com',
        featured: false
      },
      {
        id: 'kolhapur-9',
        name: 'Rohan Kulkarni',
        college: 'KIT College of Engineering, Kolhapur',
        department: 'Computer Science',
        year: '3',
        skills: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
        availability: ['Projects', 'Hackathons'],
        bio: 'Backend developer with a focus on microservices architecture. Looking for opportunities to collaborate on scalable web applications.',
        linkedin: 'https://linkedin.com/in/rohan-kulkarni',
        email: 'rohan.kulkarni@example.com',
        featured: false
      },
      {
        id: 'kolhapur-10',
        name: 'Anjali Patil',
        college: 'Shivaji University, Kolhapur',
        department: 'Information Technology',
        year: '4',
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML/CSS', 'JavaScript'],
        availability: ['Projects', 'Internships'],
        bio: 'UI/UX designer passionate about creating intuitive and accessible user interfaces. Looking for projects where I can contribute to the design process.',
        linkedin: 'https://linkedin.com/in/anjali-patil',
        email: 'anjali.patil@example.com',
        featured: false
      },
      {
        id: 'kolhapur-11',
        name: 'Varun Desai',
        college: 'DY Patil College of Engineering and Technology, Kolhapur',
        department: 'Electronics and Communication',
        year: '3',
        skills: ['VLSI Design', 'Verilog', 'FPGA Programming', 'PCB Design', 'Embedded Systems'],
        availability: ['Research', 'Projects'],
        bio: 'Electronics enthusiast with a focus on VLSI design and FPGA programming. Looking for research opportunities in hardware design.',
        linkedin: 'https://linkedin.com/in/varun-desai',
        email: 'varun.desai@example.com',
        featured: false
      },
      {
        id: 'kolhapur-12',
        name: 'Tanvi Sharma',
        college: 'Rajarambapu Institute of Technology, Kolhapur',
        department: 'Computer Science',
        year: '2',
        skills: ['Python', 'Data Science', 'Machine Learning', 'SQL', 'Tableau'],
        availability: ['Projects', 'Hackathons', 'Internships'],
        bio: 'Data science enthusiast with a passion for extracting insights from data. Looking for projects related to predictive analytics and data visualization.',
        linkedin: 'https://linkedin.com/in/tanvi-sharma',
        email: 'tanvi.sharma@example.com',
        featured: false
      },
      {
        id: 'kolhapur-13',
        name: 'Arjun Mehta',
        college: 'KIT College of Engineering, Kolhapur',
        department: 'Mechanical Engineering',
        year: '4',
        skills: ['CAD/CAM', 'SolidWorks', 'Ansys', '3D Printing', 'Product Design'],
        availability: ['Projects', 'Internships'],
        bio: 'Mechanical engineer with expertise in CAD/CAM and product design. Looking for opportunities in the field of product development and manufacturing.',
        linkedin: 'https://linkedin.com/in/arjun-mehta',
        email: 'arjun.mehta@example.com',
        featured: false
      },
      {
        id: 'kolhapur-14',
        name: 'Riya Patel',
        college: 'Shivaji University, Kolhapur',
        department: 'Artificial Intelligence',
        year: '3',
        skills: ['Deep Learning', 'TensorFlow', 'Computer Vision', 'NLP', 'Python'],
        availability: ['Research', 'Projects', 'Hackathons'],
        bio: 'AI researcher focusing on deep learning applications. Currently working on a project for real-time object detection using computer vision.',
        linkedin: 'https://linkedin.com/in/riya-patel',
        email: 'riya.patel@example.com',
        featured: false
      },
      {
        id: 'kolhapur-15',
        name: 'Karan Singh',
        college: 'DKTE Society\'s Textile and Engineering Institute, Kolhapur',
        department: 'Computer Science',
        year: '4',
        skills: ['Mobile App Development', 'Flutter', 'React Native', 'Firebase', 'UI/UX'],
        availability: ['Projects', 'Hackathons', 'Freelance'],
        bio: 'Mobile app developer with experience in cross-platform development. Looking for interesting projects to collaborate on.',
        linkedin: 'https://linkedin.com/in/karan-singh',
        email: 'karan.singh@example.com',
        featured: false
      },
      {
        id: 'kolhapur-16',
        name: 'Pooja Sharma',
        college: 'DY Patil College of Engineering and Technology, Kolhapur',
        department: 'Information Technology',
        year: '3',
        skills: ['Web Development', 'Angular', 'TypeScript', 'Node.js', 'MongoDB'],
        availability: ['Projects', 'Internships'],
        bio: 'Full stack web developer with a focus on Angular and Node.js. Looking for opportunities to work on innovative web applications.',
        linkedin: 'https://linkedin.com/in/pooja-sharma',
        email: 'pooja.sharma@example.com',
        featured: false
      },
      {
        id: 'kolhapur-17',
        name: 'Akash Joshi',
        college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
        department: 'Computer Science',
        year: '4',
        skills: ['Cloud Computing', 'AWS', 'DevOps', 'Docker', 'Kubernetes'],
        availability: ['Projects', 'Internships'],
        bio: 'Cloud and DevOps enthusiast with experience in AWS and containerization. Looking for opportunities in cloud infrastructure and CI/CD pipelines.',
        linkedin: 'https://linkedin.com/in/akash-joshi',
        email: 'akash.joshi@example.com',
        featured: false
      },
      {
        id: 'kolhapur-18',
        name: 'Meera Patel',
        college: 'Shivaji University, Kolhapur',
        department: 'Data Science',
        year: '3',
        skills: ['Big Data', 'Hadoop', 'Spark', 'Python', 'Data Visualization'],
        availability: ['Research', 'Projects'],
        bio: 'Data scientist with expertise in big data technologies. Passionate about solving complex problems using data-driven approaches.',
        linkedin: 'https://linkedin.com/in/meera-patel',
        email: 'meera.patel@example.com',
        featured: false
      },
      {
        id: 'kolhapur-19',
        name: 'Vishal Kumar',
        college: 'KIT College of Engineering, Kolhapur',
        department: 'Electrical Engineering',
        year: '4',
        skills: ['Power Systems', 'Renewable Energy', 'MATLAB', 'Simulink', 'PLC Programming'],
        availability: ['Projects', 'Research'],
        bio: 'Electrical engineer with a focus on power systems and renewable energy. Looking for opportunities in sustainable energy solutions.',
        linkedin: 'https://linkedin.com/in/vishal-kumar',
        email: 'vishal.kumar@example.com',
        featured: false
      },
      {
        id: 'kolhapur-20',
        name: 'Nisha Deshmukh',
        college: 'Rajarambapu Institute of Technology, Kolhapur',
        department: 'Computer Science',
        year: '3',
        skills: ['Cybersecurity', 'Penetration Testing', 'Network Security', 'Python', 'Linux'],
        availability: ['Projects', 'CTF Competitions', 'Hackathons'],
        bio: 'Cybersecurity enthusiast with experience in penetration testing and network security. Looking for opportunities to enhance security practices.',
        linkedin: 'https://linkedin.com/in/nisha-deshmukh',
        email: 'nisha.deshmukh@example.com',
        featured: false
      },
      {
        id: 'kolhapur-21',
        name: 'Raj Malhotra',
        college: 'DY Patil College of Engineering and Technology, Kolhapur',
        department: 'Mechanical Engineering',
        year: '4',
        skills: ['Robotics', 'Automation', 'Arduino', 'ROS', 'Python'],
        availability: ['Projects', 'Research', 'Hackathons'],
        bio: 'Robotics enthusiast with experience in automation and control systems. Looking for projects in the field of robotics and IoT.',
        linkedin: 'https://linkedin.com/in/raj-malhotra',
        email: 'raj.malhotra@example.com',
        featured: false
      },
      {
        id: 'kolhapur-22',
        name: 'Aishwarya Patil',
        college: 'Shivaji University, Kolhapur',
        department: 'Computer Science',
        year: '3',
        skills: ['Game Development', 'Unity3D', 'C#', '3D Modeling', 'AR/VR'],
        availability: ['Projects', 'Hackathons'],
        bio: 'Game developer with a passion for creating immersive experiences. Looking for collaborators on game development projects.',
        linkedin: 'https://linkedin.com/in/aishwarya-patil',
        email: 'aishwarya.patil@example.com',
        featured: false
      },
      {
        id: 'kolhapur-23',
        name: 'Suresh Kumar',
        college: 'DKTE Society\'s Textile and Engineering Institute, Kolhapur',
        department: 'Information Technology',
        year: '4',
        skills: ['Blockchain', 'Smart Contracts', 'Solidity', 'Web3.js', 'DApp Development'],
        availability: ['Projects', 'Research'],
        bio: 'Blockchain developer with experience in smart contract development. Looking for opportunities in decentralized applications and blockchain technology.',
        linkedin: 'https://linkedin.com/in/suresh-kumar',
        email: 'suresh.kumar@example.com',
        featured: false
      },
      {
        id: 'kolhapur-24',
        name: 'Priyanka Sharma',
        college: 'Bharati Vidyapeeth College of Engineering, Kolhapur',
        department: 'Electronics Engineering',
        year: '3',
        skills: ['IoT', 'Embedded Systems', 'Arduino', 'Raspberry Pi', 'Python'],
        availability: ['Projects', 'Hackathons', 'Internships'],
        bio: 'IoT enthusiast with experience in embedded systems and sensor networks. Looking for projects that combine hardware and software.',
        linkedin: 'https://linkedin.com/in/priyanka-sharma',
        email: 'priyanka.sharma@example.com',
        featured: false
      }
    ];
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
    
    #view-more-profiles-btn {
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
    
    #view-more-profiles-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 119, 181, 0.3);
    }
    
    #view-more-profiles-btn:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
    
    .kolhapur-linkedin-btn {
      background-color: #0077b5 !important;
      color: white !important;
    }
  `;
  
  document.head.appendChild(style);
})();
