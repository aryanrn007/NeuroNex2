/**
 * Dynamic Tech Events Generator
 * 
 * This script fetches tech event data and displays it dynamically
 * in the TechVerse tab, similar to how SkillSync handles profiles
 */

// Global variables
let isLoading = false;
let currentPage = 0;
const EVENTS_PER_PAGE = 4;

// Tech event types
const EVENT_TYPES = [
  'hackathon', 'workshop', 'techfest', 'internship', 
  'conference', 'competition', 'bootcamp', 'webinar'
];

// Event locations
const EVENT_LOCATIONS = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi', 'Online'
];

// Tech domains
const TECH_DOMAINS = [
  'AI', 'Web', 'Mobile', 'Cloud', 'IoT', 'Blockchain', 
  'Data Science', 'Cybersecurity', 'DevOps', 'Machine Learning', 
  'AR/VR', 'Quantum', 'Robotics', 'FinTech', 'EdTech', 'HealthTech'
];

// Event formats
const EVENT_FORMATS = [
  'Hackathon', 'Challenge', 'Summit', 'Conference', 'Workshop', 
  'Bootcamp', 'Symposium', 'Meetup', 'Fair', 'Expo', 'Jam', 
  'Sprint', 'Fest', 'Drive', 'Competition'
];

// Event organizers
const EVENT_ORGANIZERS = [
  'Tech University', 'Innovation Hub', 'Microsoft', 'Google', 
  'Amazon', 'IBM', 'TCS', 'Infosys', 'Wipro', 'NASSCOM', 
  'Startup India', 'IIT', 'NIT', 'BITS', 'IIIT'
];

// Event descriptions
const EVENT_DESCRIPTIONS = [
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

// Problem statements
const PROBLEM_STATEMENTS = [
  'Smart City Solutions', 'Healthcare Innovation', 'Education Technology',
  'Sustainable Development', 'Financial Inclusion', 'Digital Transformation',
  'AI for Social Good', 'Climate Tech', 'Accessibility Solutions',
  'Future of Work', 'Smart Agriculture', 'Disaster Management',
  'Cybersecurity Challenges', 'Supply Chain Optimization', 'Mental Health Tech',
  'Clean Energy Solutions', 'Waste Management', 'Rural Development'
];

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dynamic Tech Events Generator loaded');
  
  // Add buttons after a delay
  setTimeout(function() {
    addSyncButtons();
  }, 1000);
  
  // Load any saved events
  loadSavedEvents();
});

/**
 * Add sync buttons at top and bottom of the page
 */
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

/**
 * Create a sync button with given class
 */
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
    if (!isLoading) {
      generateEvents();
    }
  });
  
  return btn;
}

/**
 * Generate dynamic tech events
 */
function generateEvents() {
  if (isLoading) return;
  
  console.log('Generating dynamic tech events');
  showNotification('Generating new tech events...', 'info');
  
  // Update button state
  isLoading = true;
  updateButtonsState(true, 'GENERATING...');
  
  // Get events container
  const container = document.getElementById('events-container');
  if (!container) {
    console.error('Events container not found');
    isLoading = false;
    updateButtonsState(false);
    return;
  }
  
  // Generate events with a slight delay to show loading state
  setTimeout(() => {
    try {
      // Generate 4 random events
      const events = [];
      for (let i = 0; i < EVENTS_PER_PAGE; i++) {
        events.push(createRandomEvent());
      }
      
      // Display the events
      displayEvents(events);
      
      // Save events to localStorage
      saveEvents(events);
      
      // Show success message
      showNotification('New tech events added successfully!', 'success');
    } catch (error) {
      console.error('Error generating events:', error);
      showNotification('Error generating events. Please try again.', 'error');
    } finally {
      // Reset loading state
      isLoading = false;
      updateButtonsState(false);
    }
  }, 1500);
}

/**
 * Create a random tech event
 */
function createRandomEvent() {
  // Random type
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  
  // Random domain and format
  const domain = TECH_DOMAINS[Math.floor(Math.random() * TECH_DOMAINS.length)];
  const format = EVENT_FORMATS[Math.floor(Math.random() * EVENT_FORMATS.length)];
  
  // Random year (2025-2027)
  const year = Math.floor(Math.random() * 3) + 2025;
  
  // Event name
  const name = `${domain} ${format} ${year}`;
  
  // Random location
  const location = EVENT_LOCATIONS[Math.floor(Math.random() * EVENT_LOCATIONS.length)];
  
  // Random future date (1-12 months from now)
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + Math.floor(Math.random() * 12) + 1);
  const date = futureDate.toISOString().split('T')[0];
  
  // Random organizer
  let organizer = EVENT_ORGANIZERS[Math.floor(Math.random() * EVENT_ORGANIZERS.length)];
  if (location !== 'Online') {
    organizer += ` ${location}`;
  }
  
  // Random description
  const description = EVENT_DESCRIPTIONS[Math.floor(Math.random() * EVENT_DESCRIPTIONS.length)];
  
  // Random fee (0, 100, 200, 500, 1000)
  const fees = [0, 100, 200, 500, 1000];
  const fee = fees[Math.floor(Math.random() * fees.length)];
  
  // Random problem statements (3 random ones)
  const problemStatements = [];
  const shuffled = [...PROBLEM_STATEMENTS].sort(() => 0.5 - Math.random());
  problemStatements.push(...shuffled.slice(0, 3));
  
  // Create image URL - using a more reliable service
  const imageText = encodeURIComponent(name.substring(0, 30));
  const image = `https://placehold.co/400x200/6c5ce7/ffffff?text=${imageText}`;
  
  // Create event object
  return {
    id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    type,
    location,
    date,
    organizer,
    description,
    fee,
    problemStatements,
    image,
    isGenerated: true,
    createdAt: new Date().toISOString()
  };
}

/**
 * Display events in the container
 */
function displayEvents(events) {
  const container = document.getElementById('events-container');
  if (!container) return;
  
  // Add events to container with animation
  events.forEach(function(event, index) {
    // Create event card
    const card = document.createElement('div');
    card.className = 'event-card panel-animate fade-in enhanced-event-card';
    card.style.animationDelay = `${index * 0.2}s`;
    card.setAttribute('data-event-id', event.id);
    card.setAttribute('data-event-type', event.type);
    card.setAttribute('data-event-location', event.location);
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    // Set card content - without image as requested
    card.innerHTML = `
      <div class="enhanced-event-card-content">
        <div class="enhanced-event-type ${event.type}">${event.type}</div>
        <h3 class="enhanced-event-title">${event.name}</h3>
        <div class="enhanced-event-details">
          <div class="enhanced-event-detail"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
          <div class="enhanced-event-detail"><i class="far fa-calendar-alt"></i> ${formattedDate}</div>
          <div class="enhanced-event-detail"><i class="fas fa-user-tie"></i> ${event.organizer || 'TechVerse'}</div>
        </div>
        <p class="enhanced-event-description">${event.description}</p>
        <div class="enhanced-event-actions">
          <button class="enhanced-view-details-btn">View Details</button>
          <button class="enhanced-register-btn">Register</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    setTimeout(() => {
      const viewDetailsBtn = card.querySelector('.enhanced-view-details-btn');
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          // Use our local showEventDetails function
          showEventDetails(event);
        });
      }
      
      const registerBtn = card.querySelector('.enhanced-register-btn');
      if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          // Use our local showRegistrationForm function
          showRegistrationForm(event);
        });
      }
    }, 100);
    
    // Add to container
    container.appendChild(card);
  });
  
  // Add CSS for animations and card styles
  addEventCardStyles();
}

/**
 * Update the state of all sync buttons
 */
function updateButtonsState(disabled, text) {
  const buttons = document.querySelectorAll('.sync-events-btn');
  buttons.forEach(btn => {
    btn.disabled = disabled;
    if (text) {
      btn.innerHTML = `<i class="fas fa-${disabled ? 'spinner fa-spin' : 'sync'}"></i> ${text || 'SYNC MORE EVENTS'}`;
    } else {
      btn.innerHTML = `<i class="fas fa-sync"></i> SYNC MORE EVENTS`;
    }
  });
}

/**
 * Save events to localStorage
 */
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

/**
 * Load saved events from localStorage
 */
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
    
    console.log(`Found ${events.length} saved events`);
    
    // Display the events
    displayEvents(events);
  } catch (error) {
    console.error('Error loading saved events:', error);
    // If error, generate initial events
    setTimeout(() => {
      generateEvents();
    }, 1500);
  }
}

/**
 * Show event details in a modal with enhanced UI and animations
 */
function showEventDetails(event) {
  console.log('Showing event details for:', event.name);
  
  // Create a fixed modal div directly in the body with enhanced UI
  const modalHTML = `
    <div id="fixed-event-modal" class="enhanced-modal-backdrop" style="
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
    ">
      <div class="enhanced-modal-content" style="
        background-color: white;
        border-radius: 12px;
        padding: 25px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: fadeIn 0.3s ease-out forwards;
      ">
        <button id="close-event-modal" class="enhanced-close-button">&times;</button>
        
        <div class="enhanced-modal-header">
          <span class="enhanced-event-type delay-1">${event.type}</span>
          <h2 class="enhanced-event-title delay-2">${event.name}</h2>
          <div class="enhanced-event-organizer delay-3">By ${event.organizer || 'TechVerse'}</div>
        </div>
        
        <!-- Image removed as requested -->
        
        <div class="enhanced-info-grid delay-4">
          <div class="enhanced-info-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>${event.location}</span>
          </div>
          <div class="enhanced-info-item">
            <i class="far fa-calendar-alt"></i>
            <span>${new Date(event.date).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
          <div class="enhanced-info-item">
            <i class="fas fa-rupee-sign"></i>
            <span>${event.fee === 0 ? 'Free' : `₹${event.fee}`}</span>
          </div>
        </div>
        
        <div class="enhanced-section delay-5">
          <h3 class="enhanced-section-title">About the Event</h3>
          <p class="enhanced-description">${event.description}</p>
        </div>
        
        ${event.problemStatements && event.problemStatements.length > 0 ? `
          <div class="enhanced-section">
            <h3 class="enhanced-section-title">Problem Statements</h3>
            <ul class="enhanced-list">
              ${event.problemStatements.map(statement => `<li class="enhanced-list-item">${statement}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${event.prizeDetails ? `
          <div class="enhanced-section">
            <h3 class="enhanced-section-title">Prize Details</h3>
            <pre class="enhanced-prize-box">${event.prizeDetails}</pre>
          </div>
        ` : ''}
        
        ${event.rules && event.rules.length > 0 ? `
          <div class="enhanced-section">
            <h3 class="enhanced-section-title">Rules</h3>
            <ul class="enhanced-list">
              ${event.rules.map(rule => `<li class="enhanced-list-item">${rule}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${event.pastHighlights && event.pastHighlights.length > 0 ? `
          <div class="enhanced-section">
            <h3 class="enhanced-section-title">Past Highlights</h3>
            <ul class="enhanced-list">
              ${event.pastHighlights.map(highlight => `<li class="enhanced-list-item">${highlight}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${event.contact ? `
          <div class="enhanced-section">
            <h3 class="enhanced-section-title">Contact Information</h3>
            <div class="enhanced-contact-info">
              <div class="enhanced-contact-item">
                <span class="enhanced-contact-label">Email:</span>
                <span>${event.contact.email}</span>
              </div>
              <div class="enhanced-contact-item">
                <span class="enhanced-contact-label">Phone:</span>
                <span>${event.contact.phone}</span>
              </div>
            </div>
          </div>
        ` : ''}
        
        <div class="enhanced-button-container">
          <button id="register-event-btn" class="enhanced-button enhanced-primary-button">Register Now</button>
          <button id="share-event-btn" class="enhanced-button enhanced-secondary-button">Share <i class="fas fa-share-alt"></i></button>
        </div>
      </div>
    </div>
  `;
  
  // Remove any existing modal
  const existingModal = document.getElementById('fixed-event-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  // Insert the modal HTML
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer.firstElementChild);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Get modal elements and add opening animation class
  const modal = document.getElementById('fixed-event-modal');
  const closeBtn = document.getElementById('close-event-modal');
  const registerBtn = document.getElementById('register-event-btn');
  const shareBtn = document.getElementById('share-event-btn');
  
  // Add opening animation
  if (modal) {
    setTimeout(() => {
      modal.classList.add('modal-opening');
    }, 10);  // Small delay to ensure DOM is ready
  }
  
  // Close button functionality
  if (closeBtn) {
    closeBtn.onclick = function() {
      // Add closing animation
      modal.classList.add('modal-closing');
      setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }, 300);
    };
  }
  
  // Close when clicking outside the modal content
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === modal) {
        // Add closing animation
        modal.classList.add('modal-closing');
        setTimeout(() => {
          document.body.removeChild(modal);
          document.body.style.overflow = '';
        }, 300);
      }
    };
  }
  
  // Register button functionality
  if (registerBtn) {
    registerBtn.onclick = function() {
      // Add closing animation
      modal.classList.add('modal-closing');
      setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
        setTimeout(() => {
          showRegistrationForm(event);
        }, 100);
      }, 300);
    };
  }
  
  // Share button functionality
  if (shareBtn) {
    shareBtn.onclick = function() {
      const shareableText = `Check out this event: ${event.name} at ${event.location}`;
      alert(`Share this event:\n\n${shareableText}`);
    };
  }
}

/**
 * Show registration form for an event with enhanced UI and animations
 */
function showRegistrationForm(event) {
  console.log('Showing registration form for:', event.name);
  
  // Create a fixed modal div directly in the body with enhanced UI
  const modalHTML = `
    <div id="fixed-registration-modal" class="enhanced-modal-backdrop" style="
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
    ">
      <div class="enhanced-modal-content" style="
        background-color: white;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        padding: 25px;
      ">
        <button id="close-registration-modal" class="enhanced-close-button">&times;</button>
        
        <div class="enhanced-modal-header">
          <h2 class="enhanced-event-title delay-1">Register for ${event.name}</h2>
          <p class="enhanced-event-organizer delay-2">Please fill out the form below to register for this event.</p>
        </div>
        
        <form id="fixed-registration-form" class="enhanced-form delay-3">
          <div class="enhanced-form-group">
            <label for="full-name" class="enhanced-form-label">Full Name</label>
            <input type="text" id="full-name" name="full-name" required class="enhanced-form-input">
          </div>
          
          <div class="enhanced-form-group">
            <label for="email" class="enhanced-form-label">Email</label>
            <input type="email" id="email" name="email" required class="enhanced-form-input">
          </div>
          
          <div class="enhanced-form-group">
            <label for="phone" class="enhanced-form-label">Phone Number</label>
            <input type="tel" id="phone" name="phone" required class="enhanced-form-input">
          </div>
          
          <div class="enhanced-form-group">
            <label for="college" class="enhanced-form-label">College/University</label>
            <input type="text" id="college" name="college" required class="enhanced-form-input">
          </div>
          
          <div class="enhanced-form-group">
            <label for="year" class="enhanced-form-label">Year of Study</label>
            <select id="year" name="year" required class="enhanced-form-input">
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="pg">Post Graduate</option>
            </select>
          </div>
          
          <div class="enhanced-button-container delay-4">
            <button type="submit" id="submit-registration" class="enhanced-button enhanced-primary-button">Submit Registration</button>
            <button type="button" id="cancel-registration" class="enhanced-button enhanced-secondary-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Remove any existing modal
  const existingModal = document.getElementById('fixed-registration-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer.firstElementChild);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Get modal elements
  const modal = document.getElementById('fixed-registration-modal');
  const closeBtn = document.getElementById('close-registration-modal');
  const form = document.getElementById('fixed-registration-form');
  const cancelBtn = document.getElementById('cancel-registration');
  
  // Add opening animation
  if (modal) {
    setTimeout(() => {
      modal.classList.add('modal-opening');
    }, 10);  // Small delay to ensure DOM is ready
  }
  
  // Close button functionality
  if (closeBtn) {
    closeBtn.onclick = function() {
      // Add closing animation
      modal.classList.add('modal-closing');
      setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }, 300);
    };
  }
  
  // Cancel button functionality
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      // Add closing animation
      modal.classList.add('modal-closing');
      setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
      }, 300);
    };
  }
  
  // Close when clicking outside the modal content
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === modal) {
        // Add closing animation
        modal.classList.add('modal-closing');
        setTimeout(() => {
          document.body.removeChild(modal);
          document.body.style.overflow = '';
        }, 300);
      }
    };
  }
  
  // Form submission
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        college: document.getElementById('college').value,
        year: document.getElementById('year').value,
        event: event.name,
        date: new Date().toISOString()
      };
      
      console.log('Registration submitted:', formData);
      
      // Add success animation to the form
      form.classList.add('form-success');
      
      // Show a temporary success message inside the modal
      const successMessage = document.createElement('div');
      successMessage.className = 'enhanced-success-message';
      successMessage.innerHTML = `
        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
        <h3>Registration Successful!</h3>
        <p>Thank you ${formData.name}! Your registration for ${event.name} has been received.</p>
      `;
      
      // Replace form with success message
      form.parentNode.replaceChild(successMessage, form);
      
      // Close the modal after a delay
      setTimeout(() => {
        // Add closing animation
        modal.classList.add('modal-closing');
        setTimeout(() => {
          document.body.removeChild(modal);
          document.body.style.overflow = '';
          
          // Show notification
          showNotification('Registration successful!', 'success');
        }, 300);
      }, 2000);
    };
  }
}

/**
 * Add event card styles
 */
function addEventCardStyles() {
  // Check if styles already exist
  if (document.getElementById('event-card-styles')) return;
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'event-card-styles';
  
  // Add CSS
  style.textContent = `
    .event-card {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      margin-bottom: 25px;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }
    
    .enhanced-event-card {
      background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
      border: 1px solid rgba(0,0,0,0.05);
      height: 100%;
    }
    
    .enhanced-event-card-content {
      padding: 22px;
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .enhanced-event-type {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 12px;
      color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .enhanced-event-card:hover .enhanced-event-type {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .enhanced-event-type.hackathon {
      background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    }
    
    .enhanced-event-type.workshop {
      background: linear-gradient(135deg, #00b894, #55efc4);
    }
    
    .enhanced-event-type.techfest {
      background: linear-gradient(135deg, #e17055, #fab1a0);
    }
    
    .enhanced-event-type.internship {
      background: linear-gradient(135deg, #0984e3, #74b9ff);
    }
    
    .enhanced-event-type.conference {
      background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    }
    
    .enhanced-event-type.competition {
      background: linear-gradient(135deg, #e84393, #fd79a8);
    }
    
    .enhanced-event-type.bootcamp {
      background: linear-gradient(135deg, #fdcb6e, #ffeaa7);
      color: #6b5900;
    }
    
    .enhanced-event-type.webinar {
      background: linear-gradient(135deg, #00cec9, #81ecec);
    }
    
    .enhanced-event-title {
      margin: 0 0 15px 0;
      font-size: 1.3rem;
      line-height: 1.3;
      font-weight: 700;
      color: #2d3436;
      transition: color 0.3s ease;
    }
    
    .enhanced-event-card:hover .enhanced-event-title {
      color: #6c5ce7;
    }
    
    .enhanced-event-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 15px;
      font-size: 0.9rem;
      color: #636e72;
    }
    
    .enhanced-event-detail {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .enhanced-event-detail i {
      color: #6c5ce7;
      font-size: 1rem;
      width: 20px;
      text-align: center;
    }
    
    .enhanced-event-description {
      margin: 0 0 20px 0;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #444;
      flex: 1;
    }
    
    .enhanced-event-actions {
      display: flex;
      gap: 12px;
      margin-top: auto;
    }
    
    .enhanced-view-details-btn {
      padding: 10px 18px;
      background-color: transparent;
      color: #6c5ce7;
      border: 2px solid #6c5ce7;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      flex: 1;
    }
    
    .enhanced-view-details-btn:hover {
      background-color: #6c5ce7;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(108, 92, 231, 0.3);
    }
    
    .enhanced-register-btn {
      padding: 10px 18px;
      background-color: #6c5ce7;
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      flex: 1;
    }
    
    .enhanced-register-btn:hover {
      background-color: #5341d6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
    }
    
    /* Animation classes */
    .panel-animate {
      animation-duration: 0.6s;
      animation-fill-mode: both;
    }
    
    .fade-in {
      animation-name: fadeIn;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Enhanced form styles */
    .enhanced-form-group {
      margin-bottom: 20px;
    }
    
    .enhanced-form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #2d3436;
    }
    
    .enhanced-form-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #dfe6e9;
      border-radius: 8px;
      font-family: inherit;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    
    .enhanced-form-input:focus {
      outline: none;
      border-color: #6c5ce7;
      box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
    }
    
    .enhanced-button-container {
      display: flex;
      gap: 15px;
      margin-top: 25px;
    }
    
    .enhanced-button {
      padding: 12px 20px;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      font-size: 1rem;
    }
    
    .enhanced-primary-button {
      background-color: #6c5ce7;
      color: white;
    }
    
    .enhanced-primary-button:hover {
      background-color: #5341d6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
    }
    
    .enhanced-secondary-button {
      background-color: #dfe6e9;
      color: #2d3436;
    }
    
    .enhanced-secondary-button:hover {
      background-color: #b2bec3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .form-success {
      animation: successPulse 0.5s ease;
    }
    
    @keyframes successPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    
    .enhanced-success-message {
      text-align: center;
      padding: 30px 20px;
    }
    
    .success-icon {
      font-size: 4rem;
      color: #00b894;
      margin-bottom: 20px;
      animation: fadeInDown 0.5s ease;
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .modal-closing {
      animation: modalClose 0.3s ease forwards;
    }
    
    @keyframes modalClose {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `;
  
  // Add to document
  document.head.appendChild(style);
}

/**
 * Add modal styles
 */
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
  `;
  
  // Add to document
  document.head.appendChild(style);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.zIndex = '9999';
  
  // Set colors based on type
  switch(type) {
    case 'success':
      notification.style.backgroundColor = '#6c5ce7';
      notification.style.color = 'white';
      break;
    case 'error':
      notification.style.backgroundColor = '#ff7675';
      notification.style.color = 'white';
      break;
    case 'warning':
      notification.style.backgroundColor = '#fdcb6e';
      notification.style.color = '#6b5900';
      break;
    default: // info
      notification.style.backgroundColor = '#74b9ff';
      notification.style.color = 'white';
  }
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(function() {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    
    // Remove from DOM after fade out
    setTimeout(function() {
      notification.remove();
    }, 500);
  }, 3000);
}
