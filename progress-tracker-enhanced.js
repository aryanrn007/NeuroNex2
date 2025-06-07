/**
 * Enhanced Progress Tracker Functionality
 * Provides improved animations and interactions for the resume analyzer progress steps
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress tracker
    initProgressTracker();
    
    // Add event listeners to step indicators for direct navigation
    setupStepNavigation();
});

/**
 * Initialize the progress tracker
 */
function initProgressTracker() {
    // Get the current active step
    const activeStep = document.querySelector('.progress-step.active');
    if (activeStep) {
        const stepNumber = activeStep.getAttribute('data-step');
        updateProgressBar(stepNumber);
    }
}

/**
 * Update the progress bar based on the current step
 * @param {number} stepNumber - The current step number
 */
function updateProgressBar(stepNumber) {
    const progressSteps = document.querySelector('.progress-steps');
    if (progressSteps) {
        // Remove all step classes
        progressSteps.classList.remove('step-1', 'step-2', 'step-3', 'step-4', 'step-5');
        // Add the current step class
        progressSteps.classList.add(`step-${stepNumber}`);
    }
}

/**
 * Set up click events for step navigation
 */
function setupStepNavigation() {
    const stepIndicators = document.querySelectorAll('.progress-step');
    
    stepIndicators.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            const currentStep = getCurrentActiveStep();
            
            // Only allow clicking on completed steps or the next step
            if (stepNumber < currentStep || stepNumber == currentStep || stepNumber == currentStep + 1) {
                navigateToStep(stepNumber);
            }
        });
    });
}

/**
 * Get the current active step number
 * @returns {number} - The current step number
 */
function getCurrentActiveStep() {
    const activeStep = document.querySelector('.progress-step.active');
    return activeStep ? parseInt(activeStep.getAttribute('data-step')) : 1;
}

/**
 * Navigate to a specific step
 * @param {number} stepNumber - The step number to navigate to
 */
function navigateToStep(stepNumber) {
    // This function will be called by the main resume-analyzer.js
    // We just need to update the progress bar here
    updateProgressBar(stepNumber);
    
    // Update step classes
    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        
        // Remove all classes first
        step.classList.remove('active', 'completed');
        
        // Add appropriate classes
        if (stepNum == stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
}

// Expose functions to global scope for use by resume-analyzer.js
window.ProgressTracker = {
    updateProgressBar,
    navigateToStep,
    getCurrentActiveStep
};
