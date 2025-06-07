/**
 * Script to forcefully remove "No files yet" element
 */

(function() {
    // Function to remove the "No files yet" element
    function removeNoFilesYet() {
        // Find by exact text content
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
            // Check for heading with exact text
            if (el.tagName === 'H3' && el.textContent.trim() === 'No files yet') {
                console.log('Found "No files yet" heading, removing parent container');
                // Go up 5 levels to make sure we get the full container
                let container = el;
                for (let i = 0; i < 5; i++) {
                    if (container.parentElement) {
                        container = container.parentElement;
                    }
                }
                container.style.display = 'none';
                container.innerHTML = '';
            }
            
            // Check for containing text (less strict match)
            if (el.textContent && el.textContent.includes('No files yet') && 
                el.textContent.includes('Select a section to view materials')) {
                console.log('Found container with "No files yet" text, removing');
                el.style.display = 'none';
                el.innerHTML = '';
                
                // Also try to remove parent
                if (el.parentElement) {
                    el.parentElement.style.display = 'none';
                }
            }
            
            // Look for the specific container based on styles
            if (el.classList && 
                (el.classList.contains('empty-state') || 
                 el.classList.contains('no-files-container') || 
                 el.classList.contains('file-list-empty'))) {
                console.log('Found container with known empty state class, removing');
                el.style.display = 'none';
                el.innerHTML = '';
            }
            
            // Look for container with folder icon and "No files yet" message
            if (el.querySelector && el.querySelector('svg') && 
                el.textContent && el.textContent.includes('No files yet')) {
                console.log('Found container with folder icon and "No files yet", removing');
                el.style.display = 'none';
                el.innerHTML = '';
                
                // Also try to remove parents
                let parent = el.parentElement;
                for (let i = 0; i < 3; i++) {
                    if (parent) {
                        parent.style.display = 'none';
                        parent = parent.parentElement;
                    }
                }
            }
        });
        
        // Also try to find by specific structure shown in the screenshot
        const emptyContainers = document.querySelectorAll('.empty-file-container, .no-files-container, [class*="empty-state"]');
        emptyContainers.forEach(container => {
            console.log('Found empty container by class, removing');
            container.style.display = 'none';
            container.innerHTML = '';
        });
    }
    
    // Run immediately
    removeNoFilesYet();
    
    // Run again after short delay to catch dynamically added content
    setTimeout(removeNoFilesYet, 300);
    setTimeout(removeNoFilesYet, 1000);
    setTimeout(removeNoFilesYet, 2000);
    
    // Also monitor for changes and run again
    const observer = new MutationObserver(() => {
        removeNoFilesYet();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
    
    // Add global CSS to hide any matching element
    const style = document.createElement('style');
    style.textContent = `
        *:has(h3:contains('No files yet')),
        *:has(.folder-icon + h3:contains('No files yet')),
        div:has(> h3:contains('No files yet')),
        .empty-state, .no-files-container, .file-list-empty,
        div:has(> p:contains('Select a section to view materials')),
        div:has(svg + h3:contains('No files yet')),
        [class*="empty-state"], [class*="no-files"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: absolute !important;
            z-index: -9999 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Force refresh the page after a short delay
    setTimeout(() => {
        // Inject a full-page click to force any lazy-loaded UI to update
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        document.body.dispatchEvent(clickEvent);
        
        // Force layout recalculation
        document.body.style.display = 'none';
        void document.body.offsetHeight;
        document.body.style.display = '';
    }, 500);
})(); 