/**
 * Message Templates View More/Less Functionality
 * Allows users to expand or collapse the template grid to show more or fewer templates
 */

document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const VISIBLE_TEMPLATES_COUNT = 6; // Number of templates to show by default
    
    // Get all template cards
    const templateContainer = document.querySelector('.template-container');
    if (!templateContainer) return; // Exit if container not found
    
    const templateCards = templateContainer.querySelectorAll('.template-card');
    if (templateCards.length <= VISIBLE_TEMPLATES_COUNT) return; // Exit if not enough templates to hide
    
    // Create and append the View More/Less button
    const viewMoreContainer = document.createElement('div');
    viewMoreContainer.className = 'view-more-container';
    
    const viewMoreBtn = document.createElement('button');
    viewMoreBtn.id = 'view-more-templates';
    viewMoreBtn.className = 'view-more-btn';
    viewMoreBtn.innerHTML = `
        <span class="view-more-text">View More Templates</span>
        <span class="view-less-text" style="display: none;">View Less</span>
        <i class="fas fa-chevron-down view-more-icon"></i>
        <i class="fas fa-chevron-up view-less-icon" style="display: none;"></i>
    `;
    
    viewMoreContainer.appendChild(viewMoreBtn);
    templateContainer.parentNode.insertBefore(viewMoreContainer, templateContainer.nextSibling);
    
    // Hide templates beyond the visible count
    let isExpanded = false;
    
    function toggleTemplateVisibility() {
        templateCards.forEach((card, index) => {
            if (index >= VISIBLE_TEMPLATES_COUNT) {
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
    
    // Initial setup - hide templates beyond the visible count
    toggleTemplateVisibility();
    
    // Toggle visibility when button is clicked
    viewMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        toggleTemplateVisibility();
        
        // Smooth scroll to newly visible templates if expanding
        if (isExpanded) {
            const lastVisibleCard = templateCards[VISIBLE_TEMPLATES_COUNT - 1];
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
    
    // Handle category filtering with view more/less functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Reset to view less state when changing categories
                if (isExpanded) {
                    isExpanded = false;
                    toggleTemplateVisibility();
                }
                
                // Wait for category filter to apply before recalculating visibility
                setTimeout(() => {
                    const visibleCards = Array.from(templateCards).filter(card => 
                        !card.style.display || card.style.display !== 'none');
                    
                    if (visibleCards.length <= VISIBLE_TEMPLATES_COUNT) {
                        viewMoreContainer.style.display = 'none';
                    } else {
                        viewMoreContainer.style.display = 'flex';
                        
                        // Hide cards beyond visible count for the filtered category
                        visibleCards.forEach((card, index) => {
                            if (index >= VISIBLE_TEMPLATES_COUNT) {
                                card.classList.add('hidden');
                            } else {
                                card.classList.remove('hidden');
                            }
                        });
                    }
                }, 100);
            });
        });
    }
    
    // Handle search with view more/less functionality
    const searchInput = document.getElementById('template-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // Reset to view less state when searching
            if (isExpanded) {
                isExpanded = false;
                toggleTemplateVisibility();
            }
            
            // Wait for search filter to apply before recalculating visibility
            setTimeout(() => {
                const visibleCards = Array.from(templateCards).filter(card => 
                    !card.style.display || card.style.display !== 'none');
                
                if (visibleCards.length <= VISIBLE_TEMPLATES_COUNT) {
                    viewMoreContainer.style.display = 'none';
                } else {
                    viewMoreContainer.style.display = 'flex';
                    
                    // Hide cards beyond visible count for the search results
                    visibleCards.forEach((card, index) => {
                        if (index >= VISIBLE_TEMPLATES_COUNT) {
                            card.classList.add('hidden');
                        } else {
                            card.classList.remove('hidden');
                        }
                    });
                }
            }, 100);
        });
    }
});
