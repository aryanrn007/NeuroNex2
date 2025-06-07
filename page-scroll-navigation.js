/**
 * Page Scroll Navigation
 * 
 * This script enables scrolling between different pages (tabs) of the NeuroNex application.
 * When a user scrolls down at the bottom of a page, it will navigate to the next page.
 * When a user scrolls up at the top of a page, it will navigate to the previous page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigation order - defines the sequence of pages to navigate through
    const pageOrder = [
        'index.html',        // Dashboard
        'brainbox.html',     // BrainBox
        'skillsync.html',    // SkillSync
        'techverse.html',    // TechVerse
        'launchpad.html'     // LaunchPad
    ];
    
    // Get current page index in the navigation order
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentPageIndex = pageOrder.indexOf(currentPage);
    
    // Variables to track scroll behavior
    let lastScrollTop = 0;
    let scrollThreshold = 50; // Minimum scroll amount to trigger navigation
    let isScrolling = false;
    let scrollTimeout;
    let scrollLock = false;
    
    // Function to navigate to the next or previous page
    function navigateToPage(direction) {
        if (scrollLock) return;
        
        let targetIndex;
        if (direction === 'next') {
            targetIndex = Math.min(currentPageIndex + 1, pageOrder.length - 1);
        } else {
            targetIndex = Math.max(currentPageIndex - 1, 0);
        }
        
        // Only navigate if we're moving to a different page
        if (targetIndex !== currentPageIndex) {
            scrollLock = true;
            
            // Add a smooth transition effect before navigating
            document.body.classList.add('page-transition-out');
            
            // Navigate after a short delay for the transition effect
            setTimeout(() => {
                window.location.href = pageOrder[targetIndex];
            }, 400);
        }
    }
    
    // Handle wheel events for desktop
    document.addEventListener('wheel', (e) => {
        // Clear the timeout if it exists
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Set a timeout to detect when scrolling stops
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
        
        // If we're already scrolling or locked, ignore this event
        if (isScrolling || scrollLock) return;
        
        isScrolling = true;
        
        // Determine scroll direction
        const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
        
        // Check if we're at the top or bottom of the page
        const isAtTop = window.scrollY <= 0;
        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
        
        // Navigate based on scroll direction and position
        if (scrollDirection === 'down' && isAtBottom) {
            navigateToPage('next');
        } else if (scrollDirection === 'up' && isAtTop) {
            navigateToPage('prev');
        } else {
            isScrolling = false;
        }
    }, { passive: false });
    
    // Handle touch events for mobile
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        // If we're locked, ignore this event
        if (scrollLock) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        // Check if the touch was a significant swipe
        if (Math.abs(touchDiff) > scrollThreshold) {
            // Check if we're at the top or bottom of the page
            const isAtTop = window.scrollY <= 0;
            const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
            
            // Navigate based on swipe direction and position
            if (touchDiff > 0 && isAtBottom) {
                // Swipe up at bottom -> next page
                navigateToPage('next');
            } else if (touchDiff < 0 && isAtTop) {
                // Swipe down at top -> previous page
                navigateToPage('prev');
            }
        }
    }, { passive: true });
    
    // Add page transition styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        body.page-transition-out {
            opacity: 0.5;
            transform: translateY(20px);
        }
        body.page-transition-in {
            opacity: 0;
            transform: translateY(-20px);
        }
    `;
    document.head.appendChild(style);
    
    // Add entrance transition
    document.body.classList.add('page-transition-in');
    setTimeout(() => {
        document.body.classList.remove('page-transition-in');
    }, 100);
});
