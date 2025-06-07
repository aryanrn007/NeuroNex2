/**
 * Modal Fix - Prevents modals from automatically closing
 * This script fixes issues with modals disappearing unexpectedly
 */

document.addEventListener('DOMContentLoaded', () => {
    // Apply fixes for the networking challenge modal
    fixNetworkingChallengeModal();
    
    // Override global document click handlers that might close modals
    preventGlobalModalClosing();
});

/**
 * Fix for the networking challenge modal
 */
function fixNetworkingChallengeModal() {
    // Override the startNetworkingChallenge function to ensure modal stays open
    const originalStartNetworkingChallenge = window.startNetworkingChallenge;
    
    if (typeof originalStartNetworkingChallenge === 'function') {
        window.startNetworkingChallenge = function() {
            // Call the original function
            if (originalStartNetworkingChallenge) {
                originalStartNetworkingChallenge();
            }
            
            // Get the modal element
            const modal = document.getElementById('networking-challenge-modal');
            
            if (modal) {
                // Make sure the modal is visible
                modal.style.display = 'block';
                
                // Add a class to mark this as a persistent modal
                modal.classList.add('persistent-modal');
                
                // Ensure the modal stays in the DOM
                modal.setAttribute('data-persistent', 'true');
                
                // Prevent clicks outside the modal from closing it
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        e.stopPropagation();
                    }
                });
            }
        };
    }
    
    // Override the closeNetworkingModal function
    const originalCloseNetworkingModal = window.closeNetworkingModal;
    
    if (typeof originalCloseNetworkingModal === 'function') {
        window.closeNetworkingModal = function() {
            const modal = document.getElementById('networking-challenge-modal');
            
            if (modal) {
                // Just hide the modal instead of removing it
                modal.style.display = 'none';
                
                // Remove the closing class if it exists
                modal.classList.remove('closing');
            }
        };
    }
}

/**
 * Prevent global document click handlers from closing modals
 */
function preventGlobalModalClosing() {
    // Create a shield for persistent modals
    document.addEventListener('click', function(e) {
        const persistentModals = document.querySelectorAll('.persistent-modal, [data-persistent="true"]');
        
        persistentModals.forEach(modal => {
            if (modal.style.display === 'block' || modal.style.display === 'flex') {
                // Check if the click was inside the modal content
                const modalContent = modal.querySelector('.modal-content');
                
                if (modalContent && !modalContent.contains(e.target) && e.target === modal) {
                    // Prevent the event from propagating to other handlers
                    e.stopPropagation();
                }
            }
        });
    }, true); // Use capture phase to intercept events before they reach other handlers
    
    // Periodically check if the modal is still visible
    setInterval(() => {
        const modal = document.getElementById('networking-challenge-modal');
        
        if (modal && modal.getAttribute('data-persistent') === 'true' && 
            modal.style.display !== 'block' && modal.style.display !== 'flex' && 
            document.body.contains(modal)) {
            // If the modal should be visible but isn't, make it visible again
            modal.style.display = 'block';
        }
    }, 500); // Check every 500ms
}
