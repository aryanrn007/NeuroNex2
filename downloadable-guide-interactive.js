/**
 * Enhanced Downloadable PDF Guide Interactive Features
 * Adds animations, effects, and interactive elements to the Downloadable PDF Guide section
 */

document.addEventListener('DOMContentLoaded', () => {
    initDownloadableGuide();
});

/**
 * Initialize all downloadable guide enhancements
 */
function initDownloadableGuide() {
    // Set up download button interaction
    setupDownloadButton();
    
    // Add hover effects to guide card
    addGuideCardHoverEffects();
    
    // Initialize guide preview animation
    initGuidePreviewAnimation();
    
    // Add floating elements animation
    addFloatingElements();
}

/**
 * Set up the download button interaction
 */
function setupDownloadButton() {
    const downloadBtn = document.getElementById('download-guide-btn');
    
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function() {
        // Add downloading class for animation
        this.classList.add('downloading');
        
        // Create and add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'download-progress';
        this.appendChild(progressBar);
        
        // Disable button during "download"
        this.disabled = true;
        
        // Simulate download progress
        setTimeout(() => {
            progressBar.style.width = '30%';
            
            setTimeout(() => {
                progressBar.style.width = '60%';
                
                setTimeout(() => {
                    progressBar.style.width = '100%';
                    
                    // Show success message after "download" completes
                    setTimeout(() => {
                        showDownloadSuccess();
                        
                        // Remove progress bar and re-enable button
                        progressBar.remove();
                        this.classList.remove('downloading');
                        this.disabled = false;
                    }, 500);
                }, 700);
            }, 800);
        }, 400);
    });
}

/**
 * Show download success message
 */
function showDownloadSuccess() {
    // Check if success message already exists
    let successModal = document.getElementById('download-success-modal');
    
    if (!successModal) {
        // Create success modal
        successModal = document.createElement('div');
        successModal.id = 'download-success-modal';
        successModal.className = 'download-success';
        
        successModal.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Download Complete!</h3>
                <p>Your Networking Guide has been successfully downloaded. Start building your professional network today!</p>
                <button id="success-close-btn" class="success-btn">Continue</button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        
        // Add event listener to close button
        const closeBtn = document.getElementById('success-close-btn');
        closeBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            
            // Remove modal after animation completes
            setTimeout(() => {
                successModal.remove();
            }, 300);
        });
    }
    
    // Show the success modal
    setTimeout(() => {
        successModal.classList.add('active');
    }, 100);
}

/**
 * Add hover effects to guide card
 */
function addGuideCardHoverEffects() {
    const guideCard = document.querySelector('.guide-download-card');
    
    if (!guideCard) return;
    
    // Add subtle movement on mouse move
    guideCard.addEventListener('mousemove', (e) => {
        const rect = guideCard.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate rotation based on mouse position
        // Limit the rotation to a small amount for subtle effect
        const rotateX = (y / rect.height - 0.5) * 2; // -1 to 1
        const rotateY = (x / rect.width - 0.5) * -2; // -1 to 1
        
        guideCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    // Reset transform on mouse leave
    guideCard.addEventListener('mouseleave', () => {
        guideCard.style.transform = '';
    });
}

/**
 * Initialize guide preview animation
 */
function initGuidePreviewAnimation() {
    const guidePreview = document.querySelector('.guide-preview-img');
    
    if (!guidePreview) return;
    
    // Add observer to animate when in view
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            guidePreview.style.transform = 'rotateY(0)';
            observer.unobserve(guidePreview);
        }
    }, { threshold: 0.5 });
    
    observer.observe(guidePreview);
}

/**
 * Add floating elements to the guide section
 */
function addFloatingElements() {
    const guideSection = document.getElementById('downloadable-guide');
    
    if (!guideSection) return;
    
    // Add floating element class to section
    guideSection.classList.add('guide-section');
    
    // Create floating elements
    for (let i = 1; i <= 3; i++) {
        const floatingElement = document.createElement('div');
        floatingElement.className = `guide-floating-element guide-floating-${i}`;
        guideSection.appendChild(floatingElement);
    }
}

/**
 * Update download stats (simulated)
 */
function updateDownloadStats() {
    const downloadCount = document.getElementById('download-count');
    
    if (!downloadCount) return;
    
    // Get current count
    let count = parseInt(downloadCount.textContent);
    
    // Increment count
    count++;
    
    // Update display
    downloadCount.textContent = count;
    
    // Add animation
    downloadCount.classList.add('highlight');
    setTimeout(() => {
        downloadCount.classList.remove('highlight');
    }, 1000);
}
