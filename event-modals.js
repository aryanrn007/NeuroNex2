/**
 * Event Modals - Reliable implementation for TechVerse
 * This script handles the event detail and registration modals
 */

// Create modal container if it doesn't exist
function ensureModalContainer() {
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
    
    // Add global styles for modals
    const style = document.createElement('style');
    style.textContent = `
      #modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
        box-sizing: border-box;
      }
      
      .modal-content {
        background-color: white;
        border-radius: 8px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        padding: 20px;
      }
      
      .close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 24px;
        cursor: pointer;
        background: none;
        border: none;
        color: #666;
        z-index: 1;
      }
      
      .close-modal:hover {
        color: #333;
      }
      
      .event-header {
        margin-bottom: 20px;
        padding-right: 30px;
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
      .event-type.bootcamp { background-color: #81ecec; color: #006266; }
      .event-type.webinar { background-color: #dfe6e9; color: #2d3436; }
      
      .event-header h2 {
        margin: 10px 0;
        font-size: 1.8rem;
      }
      
      .event-organizer {
        color: #666;
        font-size: 0.9rem;
      }
      
      .event-image {
        width: 100%;
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .event-image img {
        width: 100%;
        display: block;
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
        margin-bottom: 20px;
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
    document.head.appendChild(style);
  }
  return container;
}

// Close the modal
function closeModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    document.body.removeChild(container);
    document.body.style.overflow = '';
  }
}

// Show event details
function showEventDetails(event) {
  console.log('Showing event details for:', event.name);
  
  // Create modal container
  const container = ensureModalContainer();
  container.innerHTML = '';
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.innerHTML = `
    <button class="close-modal">&times;</button>
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
        <h3>Problem Statements</h3>
        <ul>
          ${event.problemStatements.map(statement => `<li>${statement}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    <div class="modal-actions">
      <button class="register-btn-large">Register Now</button>
      <button class="share-btn">Share <i class="fas fa-share-alt"></i></button>
    </div>
  `;
  
  // Add to container
  container.appendChild(modalContent);
  
  // Add event listeners
  const closeBtn = modalContent.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close when clicking outside the modal content
  container.addEventListener('click', function(e) {
    if (e.target === container) {
      closeModal();
    }
  });
  
  // Register button functionality
  const registerBtn = modalContent.querySelector('.register-btn-large');
  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      closeModal();
      setTimeout(() => {
        showRegistrationForm(event);
      }, 100);
    });
  }
  
  // Share button functionality
  const shareBtn = modalContent.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const shareableText = `Check out this event: ${event.name} on ${formattedDate} at ${event.location}`;
      alert(`Share this event:\n\n${shareableText}`);
    });
  }
}

// Show registration form
function showRegistrationForm(event) {
  console.log('Showing registration form for:', event.name);
  
  // Create modal container
  const container = ensureModalContainer();
  container.innerHTML = '';
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Create form content
  const formContent = document.createElement('div');
  formContent.className = 'modal-content';
  formContent.innerHTML = `
    <button class="close-modal">&times;</button>
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
  `;
  
  // Add to container
  container.appendChild(formContent);
  
  // Add event listeners
  const closeBtn = formContent.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close when clicking outside the form
  container.addEventListener('click', function(e) {
    if (e.target === container) {
      closeModal();
    }
  });
  
  // Form submission
  const form = formContent.querySelector('#registration-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification(`Registration for ${event.name} submitted successfully!`, 'success');
      closeModal();
    });
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    document.body.removeChild(notification);
  });
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style notification
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  notification.style.zIndex = '10000';
  notification.style.maxWidth = '300px';
  notification.style.animation = 'fadeInUp 0.3s ease';
  
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
  
  // Add animation styles
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(animStyle);
  
  // Add to body
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(function() {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Remove from DOM after fade out
    setTimeout(function() {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

// Export functions
window.showEventDetails = showEventDetails;
window.showRegistrationForm = showRegistrationForm;
window.showNotification = showNotification;
