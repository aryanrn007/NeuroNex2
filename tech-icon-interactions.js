/**
 * Tech Icon Interactions
 * Handles the interactive functionality for tech icons with enhanced animations and real-time data
 */

document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners for tech icons
    setupTechIconListeners();
    
    // Add pulse animation to tech icons to draw attention
    setTimeout(() => {
        addPulseAnimation();
    }, 1500);
    
    // Preload data for faster initial display
    preloadTechData();
});

/**
 * Set up event listeners for tech icons
 */
function setupTechIconListeners() {
    const techIcons = document.querySelectorAll('.tech-icon');
    const modal = document.getElementById('techInfoModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    // Add click event to each tech icon with enhanced feedback
    techIcons.forEach(icon => {
        // Add ripple effect on click
        icon.addEventListener('mousedown', createRippleEffect);
        
        // Main click handler
        icon.addEventListener('click', () => {
            const techType = icon.getAttribute('data-tech-type');
            
            // Highlight the active icon
            techIcons.forEach(i => i.classList.remove('active-icon'));
            icon.classList.add('active-icon');
            
            // Update modal content based on tech type with loading indicator
            showLoadingIndicator(modalBody);
            
            // Simulate loading for smoother experience
            setTimeout(() => {
                updateModalContent(techType, modalTitle, modalBody);
                
                // Show the modal
                modal.classList.add('active');
                
                // Add scroll to top button if content is long
                addScrollToTopButton(modalBody);
                
                // Prevent scrolling on the body when modal is open
                document.body.style.overflow = 'hidden';
            }, 300);
        });
    });
    
    // Close modal when clicking the close button with animation
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            animateModalClose(modal);
        });
    }
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            animateModalClose(modal);
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            animateModalClose(modal);
        }
    });
}

/**
 * Create ripple effect on icon click
 * @param {Event} e - Click event
 */
function createRippleEffect(e) {
    const icon = e.currentTarget;
    
    // Remove any existing ripple
    const existingRipple = icon.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    icon.appendChild(ripple);
    
    // Position the ripple
    const rect = icon.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    
    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Add pulse animation to tech icons to draw attention
 */
function addPulseAnimation() {
    const techIcons = document.querySelectorAll('.tech-icon');
    let delay = 0;
    
    techIcons.forEach(icon => {
        setTimeout(() => {
            icon.classList.add('pulse');
            setTimeout(() => {
                icon.classList.remove('pulse');
            }, 1000);
        }, delay);
        delay += 300;
    });
}

/**
 * Show loading indicator in modal body
 * @param {HTMLElement} modalBody - The modal body element
 */
function showLoadingIndicator(modalBody) {
    modalBody.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Loading content...</p>
        </div>
    `;
}

/**
 * Add scroll to top button for long content with enhanced animation
 * @param {HTMLElement} modalBody - The modal body element
 */
function addScrollToTopButton(modalBody) {
    // Remove any existing scroll button
    const existingBtn = modalBody.querySelector('.scroll-top-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Create scroll to top button with tooltip
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i><span class="tooltip">Back to Top</span>';
    scrollBtn.setAttribute('aria-label', 'Scroll back to top');
    modalBody.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position with smooth transition
    modalBody.addEventListener('scroll', () => {
        if (modalBody.scrollTop > 100) {
            scrollBtn.classList.add('visible');
            // Add pulse animation occasionally to draw attention
            if (modalBody.scrollTop > 500 && !scrollBtn.classList.contains('pulse')) {
                scrollBtn.classList.add('pulse');
                setTimeout(() => {
                    scrollBtn.classList.remove('pulse');
                }, 1000);
            }
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click with enhanced animation
    scrollBtn.addEventListener('click', () => {
        // Add click feedback
        scrollBtn.classList.add('clicked');
        
        // Smooth scroll with easing
        const scrollDuration = 500;
        const scrollStep = -modalBody.scrollTop / (scrollDuration / 15);
        const scrollInterval = setInterval(() => {
            if (modalBody.scrollTop !== 0) {
                modalBody.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
                scrollBtn.classList.remove('clicked');
            }
        }, 15);
    });
}

/**
 * Animate modal close with fade out effect
 * @param {HTMLElement} modal - The modal element
 */
function animateModalClose(modal) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translateY(10px) scale(0.98)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        closeModal(modal);
        // Reset styles for next opening
        modalContent.style.transform = '';
        modalContent.style.opacity = '';
    }, 200);
}

/**
 * Close the modal and restore body scrolling
 * @param {HTMLElement} modal - The modal element
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remove active state from icons
    document.querySelectorAll('.tech-icon').forEach(icon => {
        icon.classList.remove('active-icon');
    });
}

/**
 * Update modal content based on tech type with real-time data
 * @param {string} techType - The type of tech icon clicked
 * @param {HTMLElement} modalTitle - The modal title element
 * @param {HTMLElement} modalBody - The modal body element
 */
async function updateModalContent(techType, modalTitle, modalBody) {
    // Set the title based on tech type
    const titles = {
        'coding': 'Programming Skills',
        'algorithms': 'Algorithms & Data Structures',
        'database': 'Database Technologies',
        'system': 'System Design & Architecture'
    };
    
    // Update modal title with animated text effect
    animateTextChange(modalTitle, titles[techType] || 'Technical Information');
    
    try {
        // Show enhanced loading indicator with progress animation
        showEnhancedLoadingIndicator(modalBody, techType);
        
        // Check if API is available
        if (!window.techDataApi || typeof window.techDataApi.fetchTechData !== 'function') {
            throw new Error('Tech Data API not available');
        }
        
        // Fetch real-time data for the selected category
        const data = await window.techDataApi.fetchTechData(techType);
        
        // Check if visualization module is available
        if (!window.techDataVisualization || typeof window.techDataVisualization.initDataVisualizations !== 'function') {
            throw new Error('Tech Data Visualization module not available');
        }
        
        // Add a slight delay for smoother transition
        setTimeout(() => {
            // Initialize data visualizations with entrance animations
            window.techDataVisualization.initDataVisualizations(techType, data, modalBody);
            
            // Add interactive elements after data is loaded
            addInteractiveElements(modalBody, techType);
        }, 500);
        
    } catch (error) {
        console.error('Error loading tech data:', error);
        
        // Show enhanced error message with animated icon
        modalBody.innerHTML = `
            <div class="error-message">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle fa-pulse"></i>
                </div>
                <h4>Data Retrieval Error</h4>
                <p>We couldn't load the latest tech industry data. This might be due to network issues or API limitations.</p>
                <button class="refresh-data-btn" onclick="refreshModalContent('${techType}', document.getElementById('modalTitle'), document.getElementById('modalBody'))">
                    <i class="fas fa-redo-alt"></i> Try Again
                </button>
                <p class="error-help-text">If the problem persists, try again later or contact support.</p>
            </div>
        `;
    }
}

/**
 * Refresh modal content with improved feedback
 * @param {string} techType - The type of tech icon clicked
 * @param {HTMLElement} modalTitle - The modal title element
 * @param {HTMLElement} modalBody - The modal body element
 */
async function refreshModalContent(techType, modalTitle, modalBody) {
    try {
        // Show enhanced loading indicator with progress animation
        modalBody.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
                <p>Refreshing real-time data...</p>
                <span class="loading-message">Connecting to industry databases</span>
            </div>
        `;
        
        // Simulate loading progress
        simulateLoadingProgress(modalBody);
        
        // Check if API is available
        if (!window.techDataApi || typeof window.techDataApi.fetchTechData !== 'function') {
            throw new Error('Tech Data API not available');
        }
        
        // Fetch fresh data with cache busting
        const data = await window.techDataApi.fetchTechData(techType, true);
        
        // Check if visualization module is available
        if (!window.techDataVisualization || typeof window.techDataVisualization.initDataVisualizations !== 'function') {
            throw new Error('Tech Data Visualization module not available');
        }
        
        // Add a slight delay for smoother transition
        setTimeout(() => {
            // Initialize visualizations with new data and entrance animations
            window.techDataVisualization.initDataVisualizations(techType, data, modalBody);
            
            // Add success notification
            showSuccessNotification(modalBody, 'Data successfully refreshed with the latest industry insights');
            
            // Add interactive elements
            addInteractiveElements(modalBody, techType);
        }, 500);
    } catch (error) {
        console.error('Error refreshing data:', error);
        modalBody.innerHTML = `
            <div class="error-message">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle fa-pulse"></i>
                </div>
                <h4>Refresh Failed</h4>
                <p>We couldn't refresh the data at this time. Please try again later.</p>
                <button class="refresh-data-btn" onclick="refreshModalContent('${techType}', document.getElementById('modalTitle'), document.getElementById('modalBody'))">
                    <i class="fas fa-redo-alt"></i> Try Again
                </button>
            </div>
        `;
    }
}

/**
 * Preload tech data for faster initial display
 */
async function preloadTechData() {
    try {
        // Check if API is available
        if (!window.techDataApi || typeof window.techDataApi.fetchTechData !== 'function') {
            console.warn('Tech Data API not available for preloading');
            return;
        }
        
        // Preload data for all categories in the background
        const categories = ['coding', 'algorithms', 'database', 'system'];
        
        for (const category of categories) {
            // Use low priority fetch to avoid blocking main interactions
            setTimeout(async () => {
                try {
                    await window.techDataApi.fetchTechData(category);
                    console.log(`Preloaded data for ${category} category`);
                } catch (error) {
                    console.warn(`Failed to preload ${category} data:`, error);
                }
            }, 2000 + Math.random() * 2000); // Stagger requests
        }
    } catch (error) {
        console.warn('Error in preloading tech data:', error);
    }
}

/**
 * Show enhanced loading indicator with animated messages
 * @param {HTMLElement} container - Container element
 * @param {string} techType - The type of tech being loaded
 */
function showEnhancedLoadingIndicator(container, techType) {
    container.innerHTML = `
        <div class="loading-indicator enhanced">
            <div class="spinner-container">
                <div class="spinner"></div>
                <div class="spinner-overlay"></div>
            </div>
            <h4>Retrieving ${getTechTypeLabel(techType)} Data</h4>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
            <p class="loading-status">Connecting to industry databases...</p>
        </div>
    `;
    
    // Simulate loading progress
    simulateLoadingProgress(container);
    
    // Cycle through loading messages
    const loadingMessages = [
        'Connecting to industry databases...',
        'Analyzing latest tech trends...',
        'Processing market data...',
        'Generating visualizations...',
        'Almost there...'
    ];
    
    let messageIndex = 0;
    const messageElement = container.querySelector('.loading-status');
    
    const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        if (messageElement) {
            // Fade out
            messageElement.style.opacity = 0;
            
            setTimeout(() => {
                // Update text and fade in
                messageElement.textContent = loadingMessages[messageIndex];
                messageElement.style.opacity = 1;
            }, 200);
        } else {
            clearInterval(messageInterval);
        }
    }, 2000);
    
    // Clear interval after a reasonable timeout
    setTimeout(() => {
        clearInterval(messageInterval);
    }, 10000);
}

/**
 * Simulate loading progress animation
 * @param {HTMLElement} container - Container with loading indicator
 */
function simulateLoadingProgress(container) {
    const progressBar = container.querySelector('.progress-bar');
    if (!progressBar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) {
            progress = 90 + Math.random() * 5; // Slow down at the end
            clearInterval(interval);
        }
        progressBar.style.width = `${Math.min(progress, 95)}%`;
    }, 300);
    
    // Clear interval after a reasonable timeout
    setTimeout(() => {
        clearInterval(interval);
        progressBar.style.width = '100%';
    }, 5000);
}

/**
 * Add interactive elements to the modal body
 * @param {HTMLElement} modalBody - The modal body element
 * @param {string} techType - The type of tech
 */
function addInteractiveElements(modalBody, techType) {
    // Add data filters if not already present
    if (!modalBody.querySelector('.data-filters')) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'data-filters';
        filtersContainer.innerHTML = `
            <div class="filter-label">Filter Data:</div>
            <div class="filter-options">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="trends">Trends</button>
                <button class="filter-btn" data-filter="stats">Statistics</button>
                <button class="filter-btn" data-filter="news">News</button>
            </div>
        `;
        
        // Insert after the real-time-data-section
        const dataSection = modalBody.querySelector('.real-time-data-section');
        if (dataSection && dataSection.nextSibling) {
            modalBody.insertBefore(filtersContainer, dataSection.nextSibling);
        } else {
            modalBody.prepend(filtersContainer);
        }
        
        // Add event listeners to filter buttons
        const filterButtons = filtersContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Apply filtering
                const filter = btn.getAttribute('data-filter');
                applyDataFilter(modalBody, filter, techType);
            });
        });
    }
    
    // Add share button
    addShareButton(modalBody, techType);
}

/**
 * Apply data filter to show/hide sections
 * @param {HTMLElement} container - Container element
 * @param {string} filter - Filter type
 * @param {string} techType - The type of tech
 */
function applyDataFilter(container, filter, techType) {
    // Define which sections belong to which filter
    const filterMap = {
        'trends': ['.chart-container', '.frameworks-container', '.research-trends-container'],
        'stats': ['.data-table-container', '.benchmarks-container', '.salaries-container'],
        'news': ['.news-container']
    };
    
    // Get all filterable sections
    const allSections = [
        ...container.querySelectorAll('.chart-container'),
        ...container.querySelectorAll('.data-table-container'),
        ...container.querySelectorAll('.frameworks-container'),
        ...container.querySelectorAll('.research-trends-container'),
        ...container.querySelectorAll('.benchmarks-container'),
        ...container.querySelectorAll('.companies-container'),
        ...container.querySelectorAll('.salaries-container'),
        ...container.querySelectorAll('.news-container')
    ];
    
    if (filter === 'all') {
        // Show all sections with staggered animation
        allSections.forEach((section, index) => {
            setTimeout(() => {
                section.style.display = 'block';
                section.style.opacity = 0;
                section.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    section.style.opacity = 1;
                    section.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    } else {
        // Get selectors for the current filter
        const showSelectors = filterMap[filter] || [];
        
        // Hide all sections first
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show only filtered sections with animation
        showSelectors.forEach(selector => {
            const sections = container.querySelectorAll(selector);
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.style.display = 'block';
                    section.style.opacity = 0;
                    section.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        section.style.opacity = 1;
                        section.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        });
    }
}

/**
 * Add share button to modal
 * @param {HTMLElement} container - Container element
 * @param {string} techType - The type of tech
 */
function addShareButton(container, techType) {
    // Create share button if not exists
    if (!container.querySelector('.share-tech-data')) {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-tech-data';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share Insights';
        
        // Add to container
        container.appendChild(shareBtn);
        
        // Add click event
        shareBtn.addEventListener('click', () => {
            showShareOptions(container, techType);
        });
    }
}

/**
 * Show share options popup
 * @param {HTMLElement} container - Container element
 * @param {string} techType - The type of tech
 */
function showShareOptions(container, techType) {
    // Create share popup
    const sharePopup = document.createElement('div');
    sharePopup.className = 'share-popup';
    sharePopup.innerHTML = `
        <div class="share-popup-content">
            <h4>Share ${getTechTypeLabel(techType)} Insights</h4>
            <p>Share these tech insights with your network:</p>
            <div class="share-options">
                <button class="share-option" data-platform="linkedin">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </button>
                <button class="share-option" data-platform="twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button class="share-option" data-platform="email">
                    <i class="fas fa-envelope"></i> Email
                </button>
                <button class="share-option" data-platform="copy">
                    <i class="fas fa-copy"></i> Copy Link
                </button>
            </div>
            <button class="close-share-popup">Cancel</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(sharePopup);
    
    // Show with animation
    setTimeout(() => {
        sharePopup.classList.add('active');
    }, 10);
    
    // Close popup handler
    const closeBtn = sharePopup.querySelector('.close-share-popup');
    closeBtn.addEventListener('click', () => {
        sharePopup.classList.remove('active');
        setTimeout(() => {
            sharePopup.remove();
        }, 300);
    });
    
    // Share option handlers
    const shareOptions = sharePopup.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
        option.addEventListener('click', () => {
            const platform = option.getAttribute('data-platform');
            handleShare(platform, techType);
            
            // Show success message
            option.innerHTML = '<i class="fas fa-check"></i> Done!';
            option.classList.add('shared');
            
            // Close popup after a delay
            setTimeout(() => {
                sharePopup.classList.remove('active');
                setTimeout(() => {
                    sharePopup.remove();
                }, 300);
            }, 1500);
        });
    });
}

/**
 * Handle share action based on platform
 * @param {string} platform - Sharing platform
 * @param {string} techType - The type of tech
 */
function handleShare(platform, techType) {
    const title = `Latest ${getTechTypeLabel(techType)} Insights from Juno`;
    const url = window.location.href;
    
    switch (platform) {
        case 'linkedin':
            // Simulate LinkedIn sharing
            console.log(`Sharing to LinkedIn: ${title}`);
            // In a real implementation, you would use the LinkedIn Share API
            break;
            
        case 'twitter':
            // Simulate Twitter sharing
            console.log(`Sharing to Twitter: ${title}`);
            // In a real implementation, you would use the Twitter Web Intent
            break;
            
        case 'email':
            // Simulate email sharing
            console.log(`Sharing via Email: ${title}`);
            // In a real implementation, you would use mailto: protocol
            break;
            
        case 'copy':
            // Copy link to clipboard
            navigator.clipboard.writeText(url).then(() => {
                console.log('Link copied to clipboard');
                showSuccessNotification(document.body, 'Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy link:', err);
            });
            break;
    }
}

/**
 * Show success notification
 * @param {HTMLElement} container - Container element
 * @param {string} message - Success message
 */
function showSuccessNotification(container, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Animate text change with fade effect
 * @param {HTMLElement} element - Element to animate
 * @param {string} newText - New text content
 */
function animateTextChange(element, newText) {
    // Fade out
    element.style.transition = 'opacity 0.2s ease';
    element.style.opacity = 0;
    
    // Change text and fade in
    setTimeout(() => {
        element.textContent = newText;
        element.style.opacity = 1;
    }, 200);
}

/**
 * Get human-readable label for tech type
 * @param {string} techType - Tech type identifier
 * @returns {string} - Human-readable label
 */
function getTechTypeLabel(techType) {
    const labels = {
        'coding': 'Programming',
        'algorithms': 'Algorithm',
        'database': 'Database',
        'system': 'System Design'
    };
    
    return labels[techType] || 'Technical';
}
