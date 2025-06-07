/**
 * Simple Modal System
 * A very basic, reliable modal implementation
 */

// Create the modal HTML structure
document.addEventListener('DOMContentLoaded', function() {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.id = 'simple-modal-container';
  modalContainer.style.display = 'none';
  modalContainer.style.position = 'fixed';
  modalContainer.style.zIndex = '9999';
  modalContainer.style.left = '0';
  modalContainer.style.top = '0';
  modalContainer.style.width = '100%';
  modalContainer.style.height = '100%';
  modalContainer.style.overflow = 'auto';
  modalContainer.style.backgroundColor = 'rgba(0,0,0,0.4)';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.id = 'simple-modal-content';
  modalContent.style.backgroundColor = '#fefefe';
  modalContent.style.margin = '5% auto';
  modalContent.style.padding = '20px';
  modalContent.style.border = '1px solid #888';
  modalContent.style.width = '80%';
  modalContent.style.maxWidth = '800px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.position = 'relative';
  
  // Create close button
  const closeButton = document.createElement('span');
  closeButton.id = 'simple-modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.style.color = '#aaa';
  closeButton.style.float = 'right';
  closeButton.style.fontSize = '28px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.cursor = 'pointer';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '15px';
  
  // Add hover effect to close button
  closeButton.addEventListener('mouseover', function() {
    this.style.color = '#000';
  });
  
  closeButton.addEventListener('mouseout', function() {
    this.style.color = '#aaa';
  });
  
  // Add close functionality
  closeButton.addEventListener('click', function() {
    modalContainer.style.display = 'none';
    document.body.style.overflow = '';
  });
  
  // Close when clicking outside the modal
  modalContainer.addEventListener('click', function(event) {
    if (event.target === modalContainer) {
      modalContainer.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Add elements to DOM
  modalContent.appendChild(closeButton);
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);
});

// Show modal with content
function showModal(title, content) {
  const modalContainer = document.getElementById('simple-modal-container');
  const modalContent = document.getElementById('simple-modal-content');
  
  if (!modalContainer || !modalContent) {
    console.error('Modal elements not found');
    return;
  }
  
  // Clear previous content
  modalContent.innerHTML = '';
  
  // Add close button
  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;';
  closeButton.style.color = '#aaa';
  closeButton.style.float = 'right';
  closeButton.style.fontSize = '28px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.cursor = 'pointer';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '15px';
  
  // Add hover effect to close button
  closeButton.addEventListener('mouseover', function() {
    this.style.color = '#000';
  });
  
  closeButton.addEventListener('mouseout', function() {
    this.style.color = '#aaa';
  });
  
  // Add close functionality
  closeButton.addEventListener('click', function() {
    modalContainer.style.display = 'none';
    document.body.style.overflow = '';
  });
  
  // Add title
  const titleElement = document.createElement('h2');
  titleElement.textContent = title;
  titleElement.style.marginTop = '0';
  titleElement.style.paddingRight = '30px';
  
  // Add content
  const contentElement = document.createElement('div');
  contentElement.innerHTML = content;
  
  // Add elements to modal
  modalContent.appendChild(closeButton);
  modalContent.appendChild(titleElement);
  modalContent.appendChild(contentElement);
  
  // Show modal
  modalContainer.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Show event details
function showEventDetails(event) {
  console.log('Showing event details for:', event.name);
  
  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Create content HTML
  const content = `
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; background-color: #6c5ce7; color: white;">${event.type}</span>
      <div style="color: #666; font-size: 0.9rem; margin-top: 5px;">By ${event.organizer || 'TechVerse'}</div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <img src="${event.image}" alt="${event.name}" style="width: 100%; border-radius: 8px;">
    </div>
    
    <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 5px;">
        <i class="fas fa-map-marker-alt"></i>
        <span>${event.location}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 5px;">
        <i class="far fa-calendar-alt"></i>
        <span>${formattedDate}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 5px;">
        <i class="fas fa-rupee-sign"></i>
        <span>${event.fee === 0 ? 'Free' : `₹${event.fee}`}</span>
      </div>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h3>About the Event</h3>
      <p>${event.description}</p>
    </div>
    
    ${event.problemStatements && event.problemStatements.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h3>Problem Statements</h3>
        <ul>
          ${event.problemStatements.map(statement => `<li>${statement}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    <div style="display: flex; gap: 10px; margin-top: 20px;">
      <button id="register-btn" style="padding: 10px 20px; background-color: #6c5ce7; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Register Now</button>
      <button id="share-btn" style="padding: 10px 20px; background-color: #a29bfe; color: white; border: none; border-radius: 5px; cursor: pointer;">Share <i class="fas fa-share-alt"></i></button>
    </div>
  `;
  
  // Show modal
  showModal(event.name, content);
  
  // Add event listeners after modal is shown
  setTimeout(() => {
    // Register button
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
      registerBtn.addEventListener('click', function() {
        document.getElementById('simple-modal-container').style.display = 'none';
        setTimeout(() => {
          showRegistrationForm(event);
        }, 100);
      });
    }
    
    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function() {
        const shareableText = `Check out this event: ${event.name} on ${formattedDate} at ${event.location}`;
        alert(`Share this event:\n\n${shareableText}`);
      });
    }
  }, 100);
}

// Show registration form
function showRegistrationForm(event) {
  console.log('Showing registration form for:', event.name);
  
  // Create content HTML
  const content = `
    <p>Please fill out the form below to register for this event.</p>
    
    <form id="registration-form" style="margin-top: 20px;">
      <div style="margin-bottom: 15px;">
        <label for="full-name" style="display: block; margin-bottom: 5px; font-weight: 500;">Full Name</label>
        <input type="text" id="full-name" name="full-name" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: inherit;">
      </div>
      
      <div style="margin-bottom: 15px;">
        <label for="email" style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
        <input type="email" id="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: inherit;">
      </div>
      
      <div style="margin-bottom: 15px;">
        <label for="phone" style="display: block; margin-bottom: 5px; font-weight: 500;">Phone Number</label>
        <input type="tel" id="phone" name="phone" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: inherit;">
      </div>
      
      <div style="margin-bottom: 15px;">
        <label for="college" style="display: block; margin-bottom: 5px; font-weight: 500;">College/University</label>
        <input type="text" id="college" name="college" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: inherit;">
      </div>
      
      <div style="margin-bottom: 15px;">
        <label for="year" style="display: block; margin-bottom: 5px; font-weight: 500;">Year of Study</label>
        <select id="year" name="year" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: inherit;">
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
          <option value="pg">Post Graduate</option>
        </select>
      </div>
      
      <div style="margin-top: 20px;">
        <button type="submit" style="padding: 10px 20px; background-color: #6c5ce7; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Submit Registration</button>
      </div>
    </form>
  `;
  
  // Show modal
  showModal(`Register for ${event.name}`, content);
  
  // Add form submission handler
  setTimeout(() => {
    const form = document.getElementById('registration-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        const modalContainer = document.getElementById('simple-modal-container');
        if (modalContainer) {
          modalContainer.style.display = 'none';
          document.body.style.overflow = '';
        }
        
        // Show notification
        showNotification(`Registration for ${event.name} submitted successfully!`);
      });
    }
  }, 100);
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#6c5ce7';
  notification.style.color = 'white';
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  notification.style.zIndex = '10000';
  
  // Add to body
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(function() {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    
    // Remove from DOM after fade out
    setTimeout(function() {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

// Make functions globally available
window.showEventDetails = showEventDetails;
window.showRegistrationForm = showRegistrationForm;
