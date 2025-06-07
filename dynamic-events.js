/**
 * Dynamic TechVerse Events
 * 
 * This script generates dynamic tech events for the TechVerse tab
 * using predefined templates.
 */

// Global variables
let isLoading = false;
const EVENTS_PER_PAGE = 4;

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Dynamic TechVerse Events loaded');
  
  // Add the sync button to the filters section with a delay
  setTimeout(function() {
    addSyncButton();
  }, 1000);
  
  // Load saved events on page load
  const savedEvents = JSON.parse(localStorage.getItem('dynamicTechverseEvents') || '[]');
  if (savedEvents.length > 0) {
    displayEvents(savedEvents);
    addViewMoreButton();
  }
});

/**
 * Add Sync More Events button to the filters section
 */
function addSyncButton() {
  const filtersSection = document.querySelector('.filters-section');
  if (!filtersSection) {
    console.log('Filters section not found');
    return;
  }
  
  // Check if button already exists
  if (document.querySelector('.dynamic-events-btn')) {
    console.log('Dynamic Events button already exists');
    return;
  }
  
  // Create button
  const syncBtn = document.createElement('button');
  syncBtn.className = 'juno-button small-btn dynamic-events-btn';
  syncBtn.innerHTML = '<i class="fas fa-sync"></i> SYNC MORE EVENTS';
  syncBtn.style.backgroundColor = '#6c5ce7';
  syncBtn.style.color = 'white';
  syncBtn.style.marginLeft = '10px';
  
  // Add click event
  syncBtn.addEventListener('click', function() {
    generateDynamicEvents();
  });
  
  // Add button to filters section
  filtersSection.appendChild(syncBtn);
  console.log('Dynamic Events button added');
}

/**
 * Generate dynamic events
 */
function generateDynamicEvents() {
  if (isLoading) return;
  
  console.log('Generating dynamic events');
  showNotification('Generating new tech events...', 'info');
  
  isLoading = true;
  
  // Update button state
  const syncBtn = document.querySelector('.dynamic-events-btn');
  if (syncBtn) {
    syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> LOADING...';
    syncBtn.disabled = true;
  }
  
  // Get events container
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) {
    console.error('Events container not found');
    return;
  }
  
  try {
    // Generate events from templates
    const events = generateEvents(EVENTS_PER_PAGE);
    
    // Display events
    displayEvents(events);
    
    // Add view more button if not already present
    addViewMoreButton();
    
    // Reset button state
    if (syncBtn) {
      syncBtn.innerHTML = '<i class="fas fa-sync"></i> SYNC MORE EVENTS';
      syncBtn.disabled = false;
    }
    
    isLoading = false;
    showNotification('New tech events generated successfully!', 'success');
  } catch (error) {
    console.error('Error generating events:', error);
    
    // Show error message
    showNotification('Error generating events. Please try again.', 'error');
    
    // Reset button state
    if (syncBtn) {
      syncBtn.innerHTML = '<i class="fas fa-sync"></i> SYNC MORE EVENTS';
      syncBtn.disabled = false;
    }
    
    isLoading = false;
  }
}

/**
 * Generate events from templates
 * @param {number} count - Number of events to generate
 * @returns {Array} - Array of event objects
 */
function generateEvents(count) {
  // Predefined event templates
  const eventTemplates = [
    {
      name: "AI Innovation Challenge",
      type: "hackathon",
      location: "Mumbai",
      description: "Build innovative AI solutions for real-world problems in this 48-hour hackathon.",
      prizeDetails: "1st Prize: ₹75,000\n2nd Prize: ₹45,000\n3rd Prize: ₹30,000",
      problemStatements: [
        "AI for Healthcare",
        "Natural Language Processing",
        "Computer Vision Applications"
      ],
      rules: [
        "Team size: 2-4 members",
        "All participants must be college students",
        "No pre-built solutions allowed"
      ],
      contact: {
        email: "ai-challenge@techinnovate.edu",
        phone: "+91 9876543210"
      },
      fee: 200
    },
    {
      name: "Web3 Blockchain Bootcamp",
      type: "workshop",
      location: "Bangalore",
      description: "Learn blockchain development and build your first decentralized application in this intensive bootcamp.",
      prizeDetails: "Certification and job placement assistance for top performers",
      problemStatements: [
        "Smart Contract Development",
        "DeFi Applications",
        "NFT Marketplaces"
      ],
      rules: [
        "Basic programming knowledge required",
        "Bring your own laptop",
        "Limited to 100 participants"
      ],
      contact: {
        email: "blockchain@techskills.org",
        phone: "+91 9876543211"
      },
      fee: 500
    },
    {
      name: "TechFest 2025",
      type: "techfest",
      location: "Delhi",
      description: "The largest student-run technical festival in North India featuring competitions, workshops, and talks.",
      prizeDetails: "Over ₹10,00,000 in prizes across all events",
      problemStatements: [
        "Technical Competitions",
        "Robotics Challenges",
        "Coding Contests"
      ],
      rules: [
        "Open to all college students",
        "Online and offline participation options",
        "Register for individual events separately"
      ],
      contact: {
        email: "techfest@dtu.ac.in",
        phone: "+91 9876543212"
      },
      fee: 0
    },
    {
      name: "Summer Internship Drive",
      type: "internship",
      location: "Hyderabad",
      description: "Connect with top tech companies offering summer internships in various domains.",
      prizeDetails: "Paid internships with stipends ranging from ₹15,000 to ₹75,000 per month",
      problemStatements: [
        "Software Development",
        "Data Science",
        "UI/UX Design"
      ],
      rules: [
        "For 2nd and 3rd year students",
        "Bring your resume and portfolio",
        "On-spot interviews"
      ],
      contact: {
        email: "internships@techconnect.in",
        phone: "+91 9876543213"
      },
      fee: 0
    }
  ];
  
  // Generate random events based on templates
  const events = [];
  for (let i = 0; i < count; i++) {
    // Select a random template
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    
    // Generate a future date (between 1-6 months from now)
    const eventDate = new Date();
    eventDate.setMonth(eventDate.getMonth() + Math.floor(Math.random() * 6) + 1);
    const formattedDate = eventDate.toISOString().split('T')[0];
    
    // Generate a registration deadline (2 weeks before event)
    const deadlineDate = new Date(eventDate);
    deadlineDate.setDate(deadlineDate.getDate() - 14);
    const formattedDeadline = deadlineDate.toISOString().split('T')[0];
    
    // Create a new event based on the template
    const event = {
      ...template,
      id: `ai-${Date.now()}-${i}`,
      date: formattedDate,
      time: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'][Math.floor(Math.random() * 5)],
      registrationDeadline: formattedDeadline,
      isAIGenerated: true
    };
    
    // Set image URL based on event name
    const eventNameForUrl = event.name.replace(/\s+/g, '+');
    event.image = `https://via.placeholder.com/400x200?text=${eventNameForUrl}`;
    
    events.push(event);
  }
  
  // Store the events in localStorage
  const existingEvents = JSON.parse(localStorage.getItem('dynamicTechverseEvents') || '[]');
  const updatedEvents = [...existingEvents, ...events];
  localStorage.setItem('dynamicTechverseEvents', JSON.stringify(updatedEvents));
  
  return events;
}

/**
 * Display events in the events container
 * @param {Array} events - Array of event objects
 */
function displayEvents(events) {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;
  
  // Add each event to the container
  events.forEach(event => {
    const eventCard = createEventCard(event);
    eventsContainer.appendChild(eventCard);
  });
}

/**
 * Create an event card element
 * @param {Object} event - Event object
 * @returns {HTMLElement} - Event card element
 */
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card panel-animate fade-in';
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
  
  // Create card content
  card.innerHTML = `
    <div class="event-card-image">
      <img src="${event.image}" alt="${event.name}">
      ${event.isAIGenerated ? '<div class="ai-badge"><i class="fas fa-robot"></i> AI Generated</div>' : ''}
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
  const viewDetailsBtn = card.querySelector('.view-details-btn');
  if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener('click', () => {
      showEventModal(event);
    });
  }
  
  const registerBtn = card.querySelector('.register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      showRegistrationForm(event);
    });
  }
  
  return card;
}

/**
 * Add View More button to load additional events
 */
function addViewMoreButton() {
  // Check if button already exists
  if (document.getElementById('dynamic-view-more-btn')) {
    return;
  }
  
  const eventsSection = document.querySelector('.events-section');
  if (!eventsSection) return;
  
  const viewMoreBtn = document.createElement('button');
  viewMoreBtn.id = 'dynamic-view-more-btn';
  viewMoreBtn.className = 'view-more-btn';
  viewMoreBtn.innerHTML = 'View More Events <i class="fas fa-chevron-down"></i>';
  
  viewMoreBtn.addEventListener('click', () => {
    loadMoreEvents();
  });
  
  eventsSection.appendChild(viewMoreBtn);
}

/**
 * Load more events when View More button is clicked
 */
function loadMoreEvents() {
  if (isLoading) return;
  
  console.log('Loading more events');
  isLoading = true;
  
  // Update button state
  const viewMoreBtn = document.getElementById('dynamic-view-more-btn');
  if (viewMoreBtn) {
    viewMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    viewMoreBtn.disabled = true;
  }
  
  try {
    // Generate more events
    const events = generateEvents(EVENTS_PER_PAGE);
    
    // Display events
    displayEvents(events);
    
    // Reset button state
    if (viewMoreBtn) {
      viewMoreBtn.innerHTML = 'View More Events <i class="fas fa-chevron-down"></i>';
      viewMoreBtn.disabled = false;
    }
    
    isLoading = false;
  } catch (error) {
    console.error('Error loading more events:', error);
    
    // Show error message
    showNotification('Error loading more events. Please try again.', 'error');
    
    // Reset button state
    if (viewMoreBtn) {
      viewMoreBtn.innerHTML = 'View More Events <i class="fas fa-chevron-down"></i>';
      viewMoreBtn.disabled = false;
    }
    
    isLoading = false;
  }
}

/**
 * Show event details in a modal
 * @param {Object} event - Event object
 */
function showEventModal(event) {
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
  
  // Format deadline
  const deadlineDate = new Date(event.registrationDeadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('en-IN', {
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
        <div class="event-organizer">By ${event.organizer}</div>
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
          <i class="far fa-clock"></i>
          <span>${event.time}</span>
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
      <div class="event-details-section">
        <div class="details-col">
          <h3>Problem Statements</h3>
          <ul>
            ${event.problemStatements.map(statement => `<li>${statement}</li>`).join('')}
          </ul>
        </div>
        <div class="details-col">
          <h3>Rules</h3>
          <ul>
            ${event.rules.map(rule => `<li>${rule}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="event-prize-section">
        <h3>Prize Details</h3>
        <p>${event.prizeDetails.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="event-deadline">
        <h3>Registration Deadline</h3>
        <p>${formattedDeadline}</p>
      </div>
      <div class="event-contact">
        <h3>Contact Information</h3>
        <p>Email: <a href="mailto:${event.contact.email}">${event.contact.email}</a></p>
        <p>Phone: ${event.contact.phone}</p>
      </div>
      <div class="modal-actions">
        <button class="register-btn-large">Register Now</button>
        <button class="share-btn">Share <i class="fas fa-share-alt"></i></button>
      </div>
    </div>
  `;
  
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
      // Create a shareable link (in a real app, this would be a unique URL)
      const shareableText = `Check out this event: ${event.name} on ${formattedDate} at ${event.location}`;
      
      // Show share options (simplified for demo)
      alert(`Share this event:\n\n${shareableText}`);
    });
  }
}

/**
 * Show registration form for an event
 * @param {Object} event - Event object
 */
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
      
      // In a real app, this would submit the form data to a server
      showNotification('Registration submitted successfully!', 'success');
      regForm.style.display = 'none';
    });
  }
}

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'success') {
  // Check if notification function already exists in global scope
  if (window.showNotification && typeof window.showNotification === 'function') {
    // Use existing notification function
    window.showNotification(message, type);
  } else {
    // Create our own notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
  .dynamic-events-btn {
    transition: all 0.3s ease;
  }
  
  .dynamic-events-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  #dynamic-view-more-btn {
    display: block;
    margin: 20px auto;
    padding: 12px 24px;
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(108, 92, 231, 0.2);
  }
  
  #dynamic-view-more-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(108, 92, 231, 0.3);
  }
  
  #dynamic-view-more-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
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
  
  /* Modal styles */
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
    background-color: var(--card-bg, #fff);
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
    color: var(--text-muted, #666);
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
    background-color: var(--primary-color, #6c5ce7);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
  }
  
  .share-btn {
    padding: 10px 20px;
    background-color: var(--secondary-color, #a29bfe);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

document.head.appendChild(style);
