/**
 * Video Resources View More/Less Functionality
 * Allows users to expand or collapse the video grid to show more or fewer videos
 */

document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const VISIBLE_VIDEOS_COUNT = 6; // Number of videos to show by default
    
    // Get all video cards
    const videoGrid = document.getElementById('video-resources-grid');
    if (!videoGrid) return; // Exit if grid not found
    
    const videoCards = videoGrid.querySelectorAll('.video-card');
    if (videoCards.length <= VISIBLE_VIDEOS_COUNT) return; // Exit if not enough videos to hide
    
    // Create and append the View More/Less button if it doesn't exist
    let viewMoreBtn = document.getElementById('view-more-videos');
    if (!viewMoreBtn) {
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'view-more-container';
        
        viewMoreBtn = document.createElement('button');
        viewMoreBtn.id = 'view-more-videos';
        viewMoreBtn.className = 'view-more-btn';
        viewMoreBtn.innerHTML = `
            <span class="view-more-text">View More</span>
            <span class="view-less-text" style="display: none;">View Less</span>
            <i class="fas fa-chevron-down view-more-icon"></i>
            <i class="fas fa-chevron-up view-less-icon" style="display: none;"></i>
        `;
        
        viewMoreContainer.appendChild(viewMoreBtn);
        videoGrid.parentNode.insertBefore(viewMoreContainer, videoGrid.nextSibling);
    }
    
    // Hide videos beyond the visible count
    let isExpanded = false;
    
    function toggleVideoVisibility() {
        videoCards.forEach((card, index) => {
            if (index >= VISIBLE_VIDEOS_COUNT) {
                if (isExpanded) {
                    // Show with animation
                    card.classList.remove('hidden');
                    card.classList.add('showing');
                    
                    // Remove the animation class after it completes
                    setTimeout(() => {
                        card.classList.remove('showing');
                    }, 500);
                } else {
                    card.classList.add('hidden');
                }
            }
        });
        
        // Update button text and icon
        const viewMoreText = viewMoreBtn.querySelector('.view-more-text');
        const viewLessText = viewMoreBtn.querySelector('.view-less-text');
        const viewMoreIcon = viewMoreBtn.querySelector('.view-more-icon');
        const viewLessIcon = viewMoreBtn.querySelector('.view-less-icon');
        
        if (isExpanded) {
            viewMoreText.style.display = 'none';
            viewLessText.style.display = 'inline';
            viewMoreIcon.style.display = 'none';
            viewLessIcon.style.display = 'inline';
        } else {
            viewMoreText.style.display = 'inline';
            viewLessText.style.display = 'none';
            viewMoreIcon.style.display = 'inline';
            viewLessIcon.style.display = 'none';
        }
    }
    
    // Initial setup - hide videos beyond the visible count
    toggleVideoVisibility();
    
    // Toggle visibility when button is clicked
    viewMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        toggleVideoVisibility();
        
        // Smooth scroll to newly visible videos if expanding
        if (isExpanded) {
            const lastVisibleCard = videoCards[VISIBLE_VIDEOS_COUNT - 1];
            lastVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
    
    // Add ripple effect to the button
    viewMoreBtn.addEventListener('click', (e) => {
        const rect = viewMoreBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        viewMoreBtn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Add ripple effect styles if not already present
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            .view-more-btn {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-effect 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-effect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});
