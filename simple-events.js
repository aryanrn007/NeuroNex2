// Dynamic Events Generator for TechVerse
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dynamic Events Generator loaded');
  
  // Add buttons after a delay
  setTimeout(function() {
    addSyncButtons();
  }, 1000);
  
  // Load any saved events
  loadSavedEvents();
});

// Add sync buttons at top and bottom
function addSyncButtons() {
  // Add top button in filters section
  const filtersSection = document.querySelector('.filters-section');
  if (filtersSection && !document.querySelector('.top-sync-btn')) {
    const topBtn = createSyncButton('top-sync-btn');
    filtersSection.appendChild(topBtn);
  }
  
  // Add bottom button after events container
  const eventsSection = document.querySelector('.events-section');
  if (eventsSection && !document.querySelector('.bottom-sync-btn')) {
    const bottomBtnContainer = document.createElement('div');
    bottomBtnContainer.className = 'bottom-btn-container';
    bottomBtnContainer.style.textAlign = 'center';
    bottomBtnContainer.style.margin = '30px 0';
    
    const bottomBtn = createSyncButton('bottom-sync-btn');
    bottomBtn.style.padding = '12px 24px';
    bottomBtn.style.fontSize = '16px';
    
    bottomBtnContainer.appendChild(bottomBtn);
    eventsSection.appendChild(bottomBtnContainer);
  }
}

// Create a sync button with given class
function createSyncButton(className) {
  const btn = document.createElement('button');
  btn.className = `sync-events-btn ${className}`;
  btn.innerHTML = '<i class="fas fa-sync"></i> SYNC MORE EVENTS';
  btn.style.backgroundColor = '#6c5ce7';
  btn.style.color = 'white';
  btn.style.padding = '8px 16px';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.marginLeft = '10px';
  btn.style.cursor = 'pointer';
  btn.style.transition = 'all 0.3s ease';
  
  // Hover effect
  btn.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#5341d6';
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  });
  
  btn.addEventListener('mouseout', function() {
    this.style.backgroundColor = '#6c5ce7';
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'none';
  });
  
  // Add click event
  btn.addEventListener('click', function() {
    generateEvents();
  });
  
  return btn;
}

// Generate events
function generateEvents() {
  console.log('Generating events...');
  
  // Show loading indicator
  const buttons = document.querySelectorAll('.sync-events-btn');
  buttons.forEach(btn => {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> LOADING...';
    btn.disabled = true;
  });
  
  // Get events container
  const container = document.getElementById('events-container');
  if (!container) {
    console.error('Events container not found');
    return;
  }
  
  // Event types
  const eventTypes = [
    'hackathon', 'workshop', 'techfest', 'internship', 'conference', 'competition'
  ];
  
  // Event locations
  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Online'
  ];
  
  // Event name prefixes
  const prefixes = [
    'AI', 'Web', 'Mobile', 'Cloud', 'IoT', 'Blockchain', 'Data Science', 'Cybersecurity',
    'DevOps', 'Machine Learning', 'AR/VR', 'Quantum', 'Robotics', 'FinTech', 'EdTech'
  ];
  
  // Event name suffixes
  const suffixes = [
    'Hackathon', 'Challenge', 'Summit', 'Conference', 'Workshop', 'Bootcamp',
    'Symposium', 'Meetup', 'Fair', 'Expo', 'Jam', 'Sprint', 'Fest', 'Drive', 'Competition'
  ];
  
  // Organizers
  const organizers = [
    'Tech University', 'Innovation Hub', 'Microsoft', 'Google', 'Amazon', 'IBM', 'TCS',
    'Infosys', 'Wipro', 'NASSCOM', 'Startup India', 'IIT', 'NIT', 'BITS', 'IIIT'
  ];
  
  // Event descriptions
  const descriptions = [
    'Join this exciting event to enhance your skills and network with professionals.',
    'A unique opportunity to learn from industry experts and showcase your talent.',
    'Collaborate with like-minded individuals to solve real-world problems.',
    'Gain hands-on experience with cutting-edge technologies and tools.',
    'Connect with potential employers and explore career opportunities.',
    'Learn, build, and deploy innovative solutions in this immersive experience.',
    'Expand your knowledge and stay ahead in the rapidly evolving tech landscape.',
    'Showcase your creativity and technical prowess to win exciting prizes.',
    'Engage with industry leaders and gain insights into emerging trends.',
    'Develop practical skills that will give you a competitive edge in the job market.'
  ];
  
  // Generate 4 random events
  const events = [];
  for (let i = 0; i < 4; i++) {
    // Random type
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    // Random name
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const year = Math.floor(Math.random() * 3) + 2025; // 2025-2027
    const name = `${prefix} ${suffix} ${year}`;
    
    // Random location
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    // Random future date (1-12 months from now)
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + Math.floor(Math.random() * 12) + 1);
    const date = futureDate.toISOString().split('T')[0];
    
    // Random organizer
    let organizer = organizers[Math.floor(Math.random() * organizers.length)];
    if (location !== 'Online') {
      organizer += ` ${location}`;
    }
    
    // Random description
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Random fee (0, 100, 200, 500, 1000)
    const fees = [0, 100, 200, 500, 1000];
    const fee = fees[Math.floor(Math.random() * fees.length)];
    
    // Random problem statements
    const problemStatements = [];
    const allProblemStatements = [
      'Smart City Solutions', 'Healthcare Innovation', 'Education Technology',
      'Sustainable Development', 'Financial Inclusion', 'Digital Transformation',
      'AI for Social Good', 'Climate Tech', 'Accessibility Solutions',
      'Future of Work', 'Smart Agriculture', 'Disaster Management'
    ];
    
    // Pick 3 random problem statements
    const shuffled = [...allProblemStatements].sort(() => 0.5 - Math.random());
    problemStatements.push(...shuffled.slice(0, 3));
    
    // Create image URL
    const imageText = name.replace(/\s+/g, '+');
    const image = `https://via.placeholder.com/400x200?text=${imageText}`;
    
    // Create event object
    const event = {
      id: `event-${Date.now()}-${i}`,
      name,
      type,
      location,
      date,
      organizer,
      description,
      fee,
      problemStatements,
      image,
      isGenerated: true
    };
    
    events.push(event);
  }
  
  // Add events to container with animation
  events.forEach(function(event, index) {
    // Create event card
    const card = document.createElement('div');
    card.className = 'event-card panel-animate fade-in';
    card.style.animationDelay = `${index * 0.2}s`;
    card.setAttribute('data-event-id', event.id);
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    // Set card content
    card.innerHTML = `
      <div class="event-card-image">
        <img src="${event.image}" alt="${event.name}">
        <div class="ai-badge"><i class="fas fa-robot"></i> AI Generated</div>
      </div>
      <div class="event-card-content">
        <div class="event-type ${event.type}">${event.type}</div>
        <h3>${event.name}</h3>
        <div class="event-details">
          <div class="event-detail"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
          <div class="event-detail"><i class="far fa-calendar-alt"></i> ${formattedDate}</div>
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-actions">
          <button class="view-details-btn">View Details</button>
          <button class="register-btn">Register</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
      const viewDetailsBtn = card.querySelector('.view-details-btn');
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
          showEventDetails(event);
        });
      }
      
      const registerBtn = card.querySelector('.register-btn');
      if (registerBtn) {
        registerBtn.addEventListener('click', () => {
          showRegistrationForm(event);
        });
      }
    }, 100);
    
    // Add to container
    container.appendChild(card);
  });
  
  // Save events to localStorage
  saveEvents(events);
  
  // Reset buttons
  setTimeout(() => {
    buttons.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-sync"></i> SYNC MORE EVENTS';
      btn.disabled = false;
    });
    
    // Show success message
    showNotification('New events generated successfully!');
  }, 1000);
}

// Save events to localStorage
function saveEvents(events) {
  try {
    // Get existing events
    const savedEvents = JSON.parse(localStorage.getItem('techverse-events') || '[]');
    
    // Add new events
    savedEvents.push(...events);
    
    // Limit to maximum 20 events to prevent localStorage overflow
    const limitedEvents = savedEvents.slice(-20);
    
    // Save back to localStorage
    localStorage.setItem('techverse-events', JSON.stringify(limitedEvents));
    
    console.log(`Saved ${events.length} new events. Total: ${limitedEvents.length}`);
  } catch (error) {
    console.error('Error saving events:', error);
  }
}

// Load saved events
function loadSavedEvents() {
  try {
    console.log('Loading saved events...');
    const savedEvents = localStorage.getItem('techverse-events');
    if (!savedEvents) {
      console.log('No saved events found, generating initial events...');
      // If no events exist, generate initial events
      setTimeout(() => {
        generateEvents();
      }, 1500);
      return;
    }
    
    const events = JSON.parse(savedEvents);
    if (!events || !events.length) return;
    
    // Get events container
    const container = document.getElementById('events-container');
    if (!container) return;
    
    // Add events to container with animation
    events.forEach(function(event, index) {
      // Create event card
      const card = document.createElement('div');
      card.className = 'event-card panel-animate fade-in';
      card.style.animationDelay = `${index * 0.1}s`;
      card.setAttribute('data-event-id', event.id || `event-${Date.now()}-${index}`);
      
      // Format date
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      // Set card content
      card.innerHTML = `
        <div class="event-card-image">
          <img src="${event.image}" alt="${event.name}">
          ${event.isGenerated ? '<div class="ai-badge"><i class="fas fa-robot"></i> AI Generated</div>' : ''}
        </div>
        <div class="event-card-content">
          <div class="event-type ${event.type}">${event.type}</div>
          <h3>${event.name}</h3>
          <div class="event-details">
            <div class="event-detail"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
            <div class="event-detail"><i class="far fa-calendar-alt"></i> ${formattedDate}</div>
          </div>
          <p class="event-description">${event.description || 'Join this exciting event to enhance your skills and network with professionals.'}</p>
          <div class="event-actions">
            <button class="view-details-btn">View Details</button>
            <button class="register-btn">Register</button>
          </div>
        </div>
      `;
      
      // Add event listeners
      setTimeout(() => {
        const viewDetailsBtn = card.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
          viewDetailsBtn.addEventListener('click', () => {
            showEventDetails(event);
          });
        }
        
        const registerBtn = card.querySelector('.register-btn');
        if (registerBtn) {
          registerBtn.addEventListener('click', () => {
            showRegistrationForm(event);
          });
        }
      }, 100);
      
      // Add to container
      container.appendChild(card);
    });
    
    // Add CSS for animations
    addEventCardStyles();
  } catch (error) {
    console.error('Error loading saved events:', error);
    // If error, generate initial events
    setTimeout(() => {
      generateEvents();
    }, 1500);
  }
}

// Add event card styles
function addEventCardStyles() {
  // Check if styles already exist
  if (document.getElementById('event-card-styles')) return;
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'event-card-styles';
  
  // Add CSS
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .panel-animate.fade-in {
      animation: fadeIn 0.5s ease forwards;
      opacity: 0;
    }
    
    .event-card {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }
    
    .event-card-image {
      position: relative;
      height: 180px;
      overflow: hidden;
    }
    
    .event-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .event-card:hover .event-card-image img {
      transform: scale(1.05);
    }
    
    .event-type {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .event-type.hackathon { background-color: #fdcb6e; color: #6b5900; }
    .event-type.workshop { background-color: #74b9ff; color: #00487e; }
    .event-type.conference { background-color: #a29bfe; color: #4834d4; }
    .event-type.internship { background-color: #55efc4; color: #006c51; }
    .event-type.competition { background-color: #ff7675; color: #9b0000; }
    .event-type.techfest { background-color: #ffeaa7; color: #b68d00; }
    
    .event-details {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 10px 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .event-detail {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .event-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .view-details-btn, .register-btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .view-details-btn {
      background-color: #e9e9e9;
      color: #333;
    }
    
    .register-btn {
      background-color: #6c5ce7;
      color: white;
    }
    
    .view-details-btn:hover {
      background-color: #ddd;
    }
    
    .register-btn:hover {
      background-color: #5341d6;
    }
  `;
  
  // Add to document
  document.head.appendChild(style);
}

// Show event details in a modal
function showEventDetails(event) {
  // Check if modal already exists
  let modal = document.getElementById('event-details-modal');
  
  // Create modal if it doesn't exist
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'event-details-modal';
    modal.className = 'event-modal';
    document.body.appendChild(modal);
  }
  
  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Set modal content
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="event-header">
        <div class="event-type ${event.type}">${event.type}</div>
        <h2>${event.name}</h2>
        <div class="event-organizer">By ${event.organizer || 'TechVerse'}</div>
      </div>
      <div class="event-image">
        <img src="${event.image}" alt="${event.name}">
      </div>
      <div class="event-info">
        <div class="event-info-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>${event.location}</span>
        </div>
        <div class="event-info-item">
          <i class="far fa-calendar-alt"></i>
          <span>${formattedDate}</span>
        </div>
        <div class="event-info-item">
          <i class="fas fa-rupee-sign"></i>
          <span>${event.fee === 0 ? 'Free' : `₹${event.fee}`}</span>
        </div>
      </div>
      <div class="event-description-full">
        <h3>About the Event</h3>
        <p>${event.description}</p>
      </div>
      ${event.problemStatements && event.problemStatements.length > 0 ? `
        <div class="event-details-section">
          <div class="details-col">
            <h3>Problem Statements</h3>
            <ul>
              ${event.problemStatements.map(statement => `<li>${statement}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}
      <div class="modal-actions">
        <button class="register-btn-large">Register Now</button>
        <button class="share-btn">Share <i class="fas fa-share-alt"></i></button>
      </div>
    </div>
  `;
  
  // Add CSS
  addModalStyles();
  
  // Show modal
  modal.style.display = 'block';
  
  // Add event listeners
  const closeBtn = modal.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Close when clicking outside the modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Register button functionality
  const registerBtn = modal.querySelector('.register-btn-large');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      showRegistrationForm(event);
      modal.style.display = 'none';
    });
  }
  
  // Share button functionality
  const shareBtn = modal.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareableText = `Check out this event: ${event.name} on ${formattedDate} at ${event.location}`;
      alert(`Share this event:\n\n${shareableText}`);
    });
  }
}

// Show registration form for an event
function showRegistrationForm(event) {
  // Check if form already exists
  let regForm = document.getElementById('event-registration-form');
  
  // Create form if it doesn't exist
  if (!regForm) {
    regForm = document.createElement('div');
    regForm.id = 'event-registration-form';
    regForm.className = 'registration-modal';
    document.body.appendChild(regForm);
  }
  
  // Set form content
  regForm.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div class="form-header">
        <h2>Register for ${event.name}</h2>
        <p>Please fill out the form below to register for this event.</p>
      </div>
      <form id="registration-form">
        <div class="form-group">
          <label for="full-name">Full Name</label>
          <input type="text" id="full-name" name="full-name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="college">College/University</label>
          <input type="text" id="college" name="college" required>
        </div>
        <div class="form-group">
          <label for="year">Year of Study</label>
          <select id="year" name="year" required>
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
            <option value="pg">Post Graduate</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">Submit Registration</button>
        </div>
      </form>
    </div>
  `;
  
  // Add CSS
  addModalStyles();
  
  // Show form
  regForm.style.display = 'block';
  
  // Add event listeners
  const closeBtn = regForm.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      regForm.style.display = 'none';
    });
  }
  
  // Close when clicking outside the form
  window.addEventListener('click', (e) => {
    if (e.target === regForm) {
      regForm.style.display = 'none';
    }
  });
  
  // Form submission
  const form = regForm.querySelector('#registration-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification(`Registration for ${event.name} submitted successfully!`);
      regForm.style.display = 'none';
    });
  }
}

// Add modal styles
function addModalStyles() {
  // Check if styles already exist
  if (document.getElementById('dynamic-modal-styles')) return;
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'dynamic-modal-styles';
  
  // Add CSS
  style.textContent = `
    .event-modal, .registration-modal {
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
      background-color: white;
      margin: 5% auto;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      width: 90%;
      max-width: 800px;
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .close-modal {
      position: absolute;
      right: 15px;
      top: 10px;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
    
    .event-header {
      margin-bottom: 20px;
    }
    
    .event-header h2 {
      margin: 10px 0;
    }
    
    .event-organizer {
      color: #666;
      font-size: 0.9rem;
    }
    
    .event-image {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .event-image img {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .event-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .event-info-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .event-description-full {
      margin-bottom: 20px;
    }
    
    .event-details-section {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .details-col {
      flex: 1;
      min-width: 250px;
    }
    
    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .register-btn-large {
      padding: 10px 20px;
      background-color: #6c5ce7;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .share-btn {
      padding: 10px 20px;
      background-color: #a29bfe;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: inherit;
    }
    
    .form-actions {
      margin-top: 20px;
    }
    
    .submit-btn {
      padding: 10px 20px;
      background-color: #6c5ce7;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .ai-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(108, 92, 231, 0.9);
      color: white;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 1;
    }
  `;
  
  // Add to document
  document.head.appendChild(style);
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#6c5ce7';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.zIndex = '9999';
  
  document.body.appendChild(notification);
  
  setTimeout(function() {
    notification.remove();
  }, 3000);
}
