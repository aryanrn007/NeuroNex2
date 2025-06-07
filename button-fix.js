// Direct button fix script
// This script will be loaded at the end of the page to ensure the buttons work

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Button fix script loaded');
    
    // Fix the Upload Resume button
    const uploadButton = document.getElementById('upload-resume-btn');
    if (uploadButton) {
        console.log('Found upload button, adding direct click handler');
        
        // Remove any existing event listeners by cloning and replacing
        const newUploadButton = uploadButton.cloneNode(true);
        uploadButton.parentNode.replaceChild(newUploadButton, uploadButton);
        
        // Add a direct click handler
        newUploadButton.onclick = function() {
            console.log('Upload button clicked');
            
            // Create a file input if it doesn't exist
            let fileInput = document.getElementById('resume-file');
            if (!fileInput) {
                fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.id = 'resume-file';
                fileInput.accept = '.pdf,.doc,.docx,.txt,.rtf';
                fileInput.style.display = 'none';
                document.body.appendChild(fileInput);
                
                // Add change event listener
                fileInput.addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    if (file) {
                        alert('File selected: ' + file.name);
                        
                        // Try to call the original handler if it exists
                        if (typeof window.handleFileUpload === 'function') {
                            window.handleFileUpload(event);
                        }
                    }
                });
            }
            
            // Trigger the file input click
            fileInput.click();
        };
    } else {
        console.error('Upload button not found');
    }
    
    // Fix the LinkedIn Import button
    const linkedinButton = document.getElementById('linkedin-import-btn');
    if (linkedinButton) {
        console.log('Found LinkedIn button, adding direct click handler');
        
        // Remove any existing event listeners by cloning and replacing
        const newLinkedinButton = linkedinButton.cloneNode(true);
        linkedinButton.parentNode.replaceChild(newLinkedinButton, linkedinButton);
        
        // Add a direct click handler
        newLinkedinButton.onclick = function() {
            console.log('LinkedIn button clicked');
            alert('LinkedIn import feature coming soon!');
        };
    } else {
        console.error('LinkedIn button not found');
    }
});
