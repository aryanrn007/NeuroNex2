// Basic Events Generator for TechVerse
document.addEventListener('DOMContentLoaded', function() {
  console.log('Basic Events Generator loaded');
  
  // Add buttons after a delay
  setTimeout(function() {
    addSyncButtons();
    // Generate initial events if none exist
    if (!localStorage.getItem('techverse-events')) {
      generateEvents();
    } else {
      loadSavedEvents();
    }
  }, 1000);
});

// Add sync buttons at top and bottom
function addSyncButtons() {
  // Add top button in filters section
  const filtersSection = document.querySelector('.filters-section');
  if (filtersSection) {
    const topBtn = createSyncButton('top-sync-btn');
    filtersSection.appendChild(topBtn);
  }
  
  // Add bottom button after events container
  const eventsSection = document.querySelector('.events-section');
  if (eventsSection) {
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
  
  // Add click event
  btn.addEventListener('click', function() {
    generateEvents();
  });
  
  return btn;
}

// Generate events
function generateEvents() {
  console.log('Generating events...');
  
  // Get events container
  const container = document.getElementById('events-container');
  if (!container) {
    console.error('Events container not found');
    return;
  }
  
  // Create 4 simple events
  const events = [
    {
      name: "AI Hackathon 2025",
      type: "hackathon",
      location: "Mumbai",
      date: "2025-08-15",
      description: "Join this exciting event to enhance your skills and network with professionals.",
      image: "https://via.placeholder.com/400x200?text=AI+Hackathon"
    },
    {
      name: "Web Development Workshop",
      type: "workshop",
      location: "Bangalore",
      date: "2025-07-20",
      description: "Learn the latest web technologies from industry experts.",
      image: "https://via.placeholder.com/400x200?text=Web+Dev+Workshop"
    },
    {
      name: "Summer Internship Fair",
      type: "internship",
      location: "Delhi",
      date: "2025-06-10",
      description: "Connect with potential employers and explore career opportunities.",
      image: "https://via.placeholder.com/400x200?text=Internship+Fair"
    },
    {
      name: "Tech Conference 2025",
      type: "conference",
      location: "Hyderabad",
      date: "2025-09-05",
      description: "Expand your knowledge and stay ahead in the rapidly evolving tech landscape.",
      image: "https://via.placeholder.com/400x200?text=Tech+Conference"
    }
  ];
  
  // Add events to container
  events.forEach(function(event) {
    // Create event card
    const card = document.createElement('div');
    card.className = 'event-card';
    
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
          alert(`Event details for ${event.name} will be available soon!`);
        });
      }
      
      const registerBtn = card.querySelector('.register-btn');
      if (registerBtn) {
        registerBtn.addEventListener('click', () => {
          alert(`Registration for ${event.name} will open soon!`);
        });
      }
    }, 100);
    
    // Add to container
    container.appendChild(card);
  });
  
  // Save events to localStorage
  saveEvents(events);
  
  // Show success message
  showNotification('New events added successfully!');
}

// Save events to localStorage
function saveEvents(events) {
  try {
    localStorage.setItem('techverse-events', JSON.stringify(events));
    console.log(`Saved ${events.length} events`);
  } catch (error) {
    console.error('Error saving events:', error);
  }
}

// Load saved events from localStorage
function loadSavedEvents() {
  try {
    console.log('Loading saved events...');
    const savedEvents = localStorage.getItem('techverse-events');
    if (!savedEvents) {
      console.log('No saved events found');
      return;
    }
    
    const events = JSON.parse(savedEvents);
    if (!events || !events.length) return;
    
    // Get events container
    const container = document.getElementById('events-container');
    if (!container) return;
    
    // Add events to container
    events.forEach(function(event) {
      // Create event card
      const card = document.createElement('div');
      card.className = 'event-card';
      
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
          viewDetailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // Use the global showEventDetails function from dynamic-tech-events.js
            if (typeof window.showEventDetails === 'function') {
              // Add missing properties to match the dynamic events format
              const fullEvent = {
                ...event,
                organizer: event.organizer || 'TechVerse',
                fee: event.fee || 0,
                problemStatements: event.problemStatements || [],
                // Generate a random ID if not present
                id: event.id || Math.floor(Math.random() * 10000)
              };
              window.showEventDetails(fullEvent);
            } else {
              // Fallback to a simple alert if the function is not available
              alert(`Event details for ${event.name} will be available soon!`);
            }
          });
        }
        
        const registerBtn = card.querySelector('.register-btn');
        if (registerBtn) {
          registerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // Use the global showRegistrationForm function from dynamic-tech-events.js
            if (typeof window.showRegistrationForm === 'function') {
              // Add missing properties to match the dynamic events format
              const fullEvent = {
                ...event,
                organizer: event.organizer || 'TechVerse',
                fee: event.fee || 0,
                // Generate a random ID if not present
                id: event.id || Math.floor(Math.random() * 10000)
              };
              window.showRegistrationForm(fullEvent);
            } else {
              // Fallback to a simple alert if the function is not available
              alert(`Registration for ${event.name} will open soon!`);
            }
          });
        }
      }, 100);
      
      // Add to container
      container.appendChild(card);
    });
    
    console.log(`Loaded ${events.length} events`);
  } catch (error) {
    console.error('Error loading saved events:', error);
  }
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

// Add some basic styles for event cards
function addEventCardStyles() {
  // Check if styles already exist
  if (document.getElementById('event-card-styles')) return;
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'event-card-styles';
  
  // Add CSS
  style.textContent = `
    .event-card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .event-card:hover {
      transform: translateY(-5px);
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
  `;
  
  // Add to document
  document.head.appendChild(style);
}

// Add styles when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addEventCardStyles();
});
