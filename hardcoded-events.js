/**
 * Hardcoded Events Handler
 * This script handles the hardcoded events in the TechVerse tab
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Hardcoded Events Handler loaded');
  
  // Wait for the page to fully load
  setTimeout(initializeHardcodedEvents, 1000);
});

function initializeHardcodedEvents() {
  console.log('Initializing hardcoded events...');
  
  // Find all event cards in the events section
  const eventCards = document.querySelectorAll('.events-section .event-card');
  
  if (eventCards.length === 0) {
    console.log('No hardcoded event cards found');
    return;
  }
  
  console.log(`Found ${eventCards.length} hardcoded event cards`);
  
  // Process each event card
  eventCards.forEach((card, index) => {
    // Extract event data from the card
    const eventName = card.querySelector('h3')?.textContent || `Event ${index + 1}`;
    const eventType = card.querySelector('.event-type')?.textContent.toLowerCase() || 'event';
    const locationEl = card.querySelector('.event-detail:nth-child(1)');
    const dateEl = card.querySelector('.event-detail:nth-child(2)');
    const descriptionEl = card.querySelector('.event-description');
    const imageEl = card.querySelector('img');
    
    const eventLocation = locationEl ? locationEl.textContent.replace('📍', '').trim() : 'TBD';
    const eventDateText = dateEl ? dateEl.textContent.replace('📅', '').trim() : 'TBD';
    const eventDescription = descriptionEl ? descriptionEl.textContent : 'No description available';
    const eventImage = imageEl ? imageEl.src : 'https://placehold.co/600x400/6c5ce7/ffffff?text=Event';
    
    // Create event object with enhanced details
    const event = {
      id: 1000 + index,
      name: eventName,
      type: eventType,
      location: eventLocation,
      date: new Date().toISOString(), // Default to today
      organizer: getRandomOrganizer(),
      description: eventDescription,
      image: eventImage,
      fee: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 5) * 100,
      registrationDeadline: getRandomFutureDate(30),
      prizeDetails: getPrizeDetails(),
      problemStatements: getProblemStatements(),
      rules: getEventRules(),
      contact: {
        email: `${eventType.toLowerCase()}@techverse.edu`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
      },
      pastHighlights: getPastHighlights()
    };
    
    // Replace the buttons
    replaceButtons(card, event);
  });
}

function replaceButtons(card, event) {
  // Find the action buttons container
  const actionsContainer = card.querySelector('.event-actions');
  if (!actionsContainer) {
    console.log(`No actions container found for event: ${event.name}`);
    return;
  }
  
  // Add enhanced class to the card
  card.classList.add('enhanced-event-card');
  
  // Update the card's inner structure to match enhanced UI
  const cardContent = card.querySelector('.event-card-content');
  if (cardContent) {
    cardContent.classList.add('enhanced-event-card-content');
    
    // Update event type element
    const eventTypeEl = cardContent.querySelector('.event-type');
    if (eventTypeEl) {
      eventTypeEl.classList.add('enhanced-event-type');
    }
    
    // Update event title
    const titleEl = cardContent.querySelector('h3');
    if (titleEl) {
      titleEl.classList.add('enhanced-event-title');
    }
    
    // Update event details
    const detailsEl = cardContent.querySelector('.event-details');
    if (detailsEl) {
      detailsEl.classList.add('enhanced-event-details');
      
      // Update individual details
      const detailItems = detailsEl.querySelectorAll('.event-detail');
      detailItems.forEach(item => {
        item.classList.add('enhanced-event-detail');
      });
    }
    
    // Update description
    const descriptionEl = cardContent.querySelector('.event-description');
    if (descriptionEl) {
      descriptionEl.classList.add('enhanced-event-description');
    }
  }
  
  // Clear existing buttons
  actionsContainer.innerHTML = '';
  actionsContainer.classList.add('enhanced-event-actions');
  
  // Create new View Details button
  const viewDetailsBtn = document.createElement('button');
  viewDetailsBtn.className = 'hardcoded-view-details-btn enhanced-view-details-btn';
  viewDetailsBtn.textContent = 'View Details';
  
  // Create new Register button
  const registerBtn = document.createElement('button');
  registerBtn.className = 'hardcoded-register-btn enhanced-register-btn';
  registerBtn.textContent = 'Register';
  
  // Add buttons to container
  actionsContainer.appendChild(viewDetailsBtn);
  actionsContainer.appendChild(registerBtn);
  
  // Add event listeners
  viewDetailsBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    showHardcodedEventDetails(event);
  });
  
  registerBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    showHardcodedRegistrationForm(event);
  });
}

function showHardcodedEventDetails(event) {
  console.log('Showing hardcoded event details for:', event.name);
  
  // Create a fixed modal div directly in the body with enhanced UI
  const modalHTML = `
    <div id="hardcoded-event-modal" class="enhanced-modal-backdrop" style="
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
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        padding: 25px;
      ">
        <button id="close-hardcoded-event-modal" class="enhanced-close-button">&times;</button>
        
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
          <button id="register-hardcoded-event-btn" class="enhanced-button enhanced-primary-button">Register Now</button>
          <button id="share-hardcoded-event-btn" class="enhanced-button enhanced-secondary-button">Share <i class="fas fa-share-alt"></i></button>
        </div>
      </div>
    </div>
  `;
  
  // Remove any existing modal
  const existingModal = document.getElementById('hardcoded-event-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  // Insert the modal HTML
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer.firstElementChild);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Add event listeners after the modal is in the DOM
  const modal = document.getElementById('hardcoded-event-modal');
  const closeBtn = document.getElementById('close-hardcoded-event-modal');
  const registerBtn = document.getElementById('register-hardcoded-event-btn');
  const shareBtn = document.getElementById('share-hardcoded-event-btn');
  
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
          showHardcodedRegistrationForm(event);
        }, 100);
      }, 300);
    };
  }
  
  // Share button functionality
  if (shareBtn) {
    shareBtn.onclick = function() {
      // Add a pulse animation to the share button
      shareBtn.classList.add('pulse');
      setTimeout(() => {
        shareBtn.classList.remove('pulse');
      }, 500);
      
      const shareableText = `Check out this event: ${event.name} at ${event.location}`;
      alert(`Share this event:\n\n${shareableText}`);
    };
  }
}

// Helper functions for generating random event details
function getRandomOrganizer() {
  const organizers = [
    'Tech University', 'Innovation Hub', 'Microsoft', 'Google', 
    'Amazon', 'IBM', 'TCS', 'Infosys', 'Wipro', 'NASSCOM', 
    'Startup India', 'IIT', 'NIT', 'BITS', 'IIIT'
  ];
  return organizers[Math.floor(Math.random() * organizers.length)];
}

function getRandomFutureDate(maxDays) {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * maxDays) + 1);
  return date.toISOString().split('T')[0];
}

function getPrizeDetails() {
  const prizes = [
    '1st Prize: ₹50,000\n2nd Prize: ₹30,000\n3rd Prize: ₹20,000',
    '1st Prize: ₹75,000\n2nd Prize: ₹45,000\n3rd Prize: ₹30,000',
    '1st Prize: ₹100,000\n2nd Prize: ₹60,000\n3rd Prize: ₹40,000',
    'Winner: ₹50,000 + Internship Opportunity\nRunner-up: ₹25,000',
    'Cash prizes worth ₹2,00,000 to be won!'
  ];
  return prizes[Math.floor(Math.random() * prizes.length)];
}

function getProblemStatements() {
  const allStatements = [
    'Smart City Solutions', 'Healthcare Innovation', 'Education Technology',
    'Sustainable Development', 'Financial Inclusion', 'Digital Transformation',
    'AI for Social Good', 'Climate Tech', 'Accessibility Solutions',
    'Future of Work', 'Smart Agriculture', 'Disaster Management',
    'Cybersecurity Challenges', 'Supply Chain Optimization', 'Mental Health Tech',
    'Clean Energy Solutions', 'Waste Management', 'Rural Development'
  ];
  
  // Get 2-4 random problem statements
  const count = Math.floor(Math.random() * 3) + 2;
  const statements = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allStatements.length);
    statements.push(allStatements[randomIndex]);
    allStatements.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return statements;
}

function getEventRules() {
  const allRules = [
    'Team size: 2-4 members',
    'All participants must be college students',
    'No pre-built solutions allowed',
    'Individual or team participation',
    'Open to all students and professionals',
    'Must use provided frameworks',
    'Submission deadline is final',
    'Judges decision will be final',
    'Code must be original',
    'Participants must bring their own laptops',
    'Internet access will be provided',
    'Participants must be present for the entire duration'
  ];
  
  // Get 2-4 random rules
  const count = Math.floor(Math.random() * 3) + 2;
  const rules = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allRules.length);
    rules.push(allRules[randomIndex]);
    allRules.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return rules;
}

function getPastHighlights() {
  const highlights = [
    '2024: 500+ participants from 50+ colleges',
    '2023 Winner: Smart Traffic Management System',
    '2023: 120+ internships offered',
    '2024: 20+ solutions implemented',
    '2023: 50+ teams participated',
    '2024: 10 startups incubated',
    '2023: 80+ projects showcased',
    '2024: 200+ participants',
    '2024: 60+ demos'
  ];
  
  // Get 1-2 random highlights
  const count = Math.floor(Math.random() * 2) + 1;
  const selected = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * highlights.length);
    selected.push(highlights[randomIndex]);
    highlights.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return selected;
}

function showHardcodedRegistrationForm(event) {
  console.log('Showing registration form for:', event.name);
  
  // Create a fixed modal div directly in the body with enhanced UI
  const modalHTML = `
    <div id="hardcoded-registration-modal" class="enhanced-modal-backdrop" style="
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
        <button id="close-hardcoded-registration-modal" class="enhanced-close-button">&times;</button>
        
        <div class="enhanced-modal-header">
          <h2 class="enhanced-event-title delay-1">Register for ${event.name}</h2>
          <p class="enhanced-event-organizer delay-2">Please fill out the form below to register for this event.</p>
        </div>
        
        <form id="hardcoded-registration-form" class="enhanced-form delay-3">
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
            <button type="submit" id="submit-hardcoded-registration" class="enhanced-button enhanced-primary-button">Submit Registration</button>
            <button type="button" id="cancel-hardcoded-registration" class="enhanced-button enhanced-secondary-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Remove any existing modal
  const existingModal = document.getElementById('hardcoded-registration-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  // Insert the modal HTML
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer.firstElementChild);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Add event listeners after the modal is in the DOM
  const modal = document.getElementById('hardcoded-registration-modal');
  const closeBtn = document.getElementById('close-hardcoded-registration-modal');
  const form = document.getElementById('hardcoded-registration-form');
  const cancelBtn = document.getElementById('cancel-hardcoded-registration');
  
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
          const notification = document.createElement('div');
          notification.textContent = `Registration for ${event.name} submitted successfully!`;
          notification.style.position = 'fixed';
          notification.style.bottom = '20px';
          notification.style.right = '20px';
          notification.style.backgroundColor = '#6c5ce7';
          notification.style.color = 'white';
          notification.style.padding = '12px 20px';
          notification.style.borderRadius = '4px';
          notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          notification.style.zIndex = '10000';
          
          document.body.appendChild(notification);
          
          // Remove notification after 3 seconds
          setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            
            setTimeout(function() {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 500);
          }, 3000);
        }, 300);
      }, 2000);
    };
  }
}
