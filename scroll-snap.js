/**
 * NeuroNex Scroll Snapping Functionality
 * 
 * This script implements smooth scroll snapping between full-page sections
 * with navigation highlighting and smooth transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('.scroll-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Check if we're on the landing page with scroll sections or a regular page
    const isLandingPage = scrollContainer && sections.length > 0;
    
    // Variables for scroll handling
    let isScrolling = false;
    let currentSection = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Initialize the page
    function init() {
        if (isLandingPage) {
            // Set the first section as active
            setActiveSection(0);
            
            // Add event listeners for scroll snapping
            setupEventListeners();
        } else {
            // For regular pages, just set up navigation link click handlers
            navLinks.forEach(link => {
                link.addEventListener('click', handleNavClick);
            });
        }
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        if (!isLandingPage) return;
        
        // Scroll event with debounce for better performance
        scrollContainer.addEventListener('scroll', debounce(handleScroll, 50));
        
        // Click events for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
        
        // Click events for scroll indicator dots
        if (scrollDots && scrollDots.length > 0) {
            scrollDots.forEach(dot => {
                dot.addEventListener('click', handleDotClick);
            });
        }
        
        // Touch events for mobile swipe
        scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
        
        // Wheel event for more precise scrolling
        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // Handle the scroll event
    function handleScroll() {
        if (isScrolling) return;
        
        const scrollPosition = scrollContainer.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = scrollContainer.scrollHeight;
        
        // Update scroll progress bar
        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
        scrollProgress.style.width = `${scrollPercentage}%`;
        
        // Determine which section is currently in view
        let newSection = 0;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop - windowHeight / 2) {
                newSection = index;
            }
        });
        
        // Update active section if changed
        if (newSection !== currentSection) {
            setActiveSection(newSection);
        }
    }
    
    // Handle navigation link clicks
    function handleNavClick(e) {
        // Check if this is a link to another page or a section within this page
        const targetSection = e.currentTarget.getAttribute('data-section');
        const targetHref = e.currentTarget.getAttribute('href');
        
        // If it's a link to another page (not starting with #)
        if (targetHref && !targetHref.startsWith('#')) {
            // Let the default navigation happen (don't prevent default)
            return;
        }
        
        // If it's a section within this page
        e.preventDefault();
        if (isLandingPage && targetSection) {
            const sectionIndex = Array.from(sections).findIndex(section => section.id === targetSection);
            if (sectionIndex !== -1) {
                scrollToSection(sectionIndex);
            }
        }
    }
    
    // Handle scroll indicator dot clicks
    function handleDotClick(e) {
        const targetSection = e.currentTarget.getAttribute('data-section');
        const sectionIndex = Array.from(sections).findIndex(section => section.id === targetSection);
        
        if (sectionIndex !== -1) {
            scrollToSection(sectionIndex);
        }
    }
    
    // Handle touch start event for swipe detection
    function handleTouchStart(e) {
        touchStartY = e.changedTouches[0].screenY;
    }
    
    // Handle touch end event for swipe detection
    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }
    
    // Process swipe direction and navigate accordingly
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        if (swipeDistance > 0) {
            // Swipe up - go to next section
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else {
            // Swipe down - go to previous section
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    }
    
    // Handle keyboard navigation
    function handleKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentSection < sections.length - 1) {
                    scrollToSection(currentSection + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentSection > 0) {
                    scrollToSection(currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                scrollToSection(0);
                break;
            case 'End':
                e.preventDefault();
                scrollToSection(sections.length - 1);
                break;
        }
    }
    
    // Handle mouse wheel events for smoother scrolling
    function handleWheel(e) {
        // Prevent default only during transitions to avoid choppy scrolling
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        // Wait a bit to see if the user is continuously scrolling
        clearTimeout(window.wheelTimeout);
        window.wheelTimeout = setTimeout(() => {
            const direction = e.deltaY > 0 ? 1 : -1;
            
            // Calculate the target section based on scroll direction
            const targetSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
            
            // Only scroll if we're changing sections
            if (targetSection !== currentSection) {
                e.preventDefault();
                scrollToSection(targetSection);
            }
        }, 50);
    }
    
    // Scroll to a specific section
    function scrollToSection(index) {
        if (isScrolling) return;
        
        isScrolling = true;
        currentSection = index;
        
        // Update active states
        setActiveSection(index);
        
        // Smooth scroll to the target section
        sections[index].scrollIntoView({ behavior: 'smooth' });
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
    
    // Set the active section and update UI
    function setActiveSection(index) {
        currentSection = index;
        
        // Update section active states
        sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
                section.querySelector('.section-content').classList.add('animate-in');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Update navigation links
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sections[index].id) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update scroll indicator dots
        scrollDots.forEach(dot => {
            const dotSection = dot.getAttribute('data-section');
            if (dotSection === sections[index].id) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update URL hash without triggering scroll
        const sectionId = sections[index].id;
        history.replaceState(null, null, `#${sectionId}`);
    }
    
    // Utility function to debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Check URL hash on page load to navigate to the correct section
    function checkUrlHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = hash.substring(1);
            const sectionIndex = Array.from(sections).findIndex(section => section.id === targetSection);
            
            if (sectionIndex !== -1) {
                // Small delay to ensure page is fully loaded
                setTimeout(() => {
                    scrollToSection(sectionIndex);
                }, 300);
            }
        }
    }
    
    // Initialize the page
    init();
    
    // Check URL hash after initialization
    checkUrlHash();
    
    // Handle window resize events to ensure correct positioning
    window.addEventListener('resize', debounce(() => {
        // Reposition to the current section after resize
        scrollToSection(currentSection);
    }, 100));
});
