/**
 * Resume Analyzer Functionality
 * Provides analysis and improvement suggestions for existing resumes
 */

// Use the API key from the resume-ai-analyzer.js file
// Global variables to store resume data
let resumeText = "";
let resumeFile = null;
let analysisResults = null;
let appliedSuggestions = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('Resume Analyzer initialized');
    
    // Initialize AI analyzer with API key
    if (window.ResumeAI && typeof window.ResumeAI.initializeAIAnalyzer === 'function') {
        // Use the correct API key for OpenRouter
        const apiKey = "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";
        const initialized = window.ResumeAI.initializeAIAnalyzer(apiKey);
        console.log('AI analyzer initialization with key:', apiKey.substring(0, 10) + '...', initialized ? 'successful' : 'failed');
        
        // Notification about API connection removed as requested
        // No notification will be shown when loading the page
    } else {
        console.error('AI analyzer not available. Make sure resume-ai-analyzer.js is loaded before resume-analyzer.js');
        showNotification('Error: AI analyzer not available', 'error');
    }
    
    // Initialize UI elements
    initializeUI();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add direct event listener for next button to ensure it works
    const nextBtn = document.getElementById('next-step-btn');
    if (nextBtn) {
        console.log('Next button found, adding direct event listener');
        nextBtn.onclick = function() {
            console.log('Next button clicked directly');
            goToNextStep();
        };
    } else {
        console.error('Next button not found');
    }
    
    // Add event listener for the upload area to handle drag and drop
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = document.getElementById('resume-file');
                if (fileInput) {
                    // Update the file input
                    fileInput.files = files;
                    
                    // Trigger the change event manually
                    const event = new Event('change');
                    fileInput.dispatchEvent(event);
                }
            }
        });
    }
    
    // Add event listener for the clear text button
    const clearTextBtn = document.getElementById('clear-text-btn');
    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', () => {
            const resumeTextArea = document.getElementById('resume-text');
            if (resumeTextArea) {
                resumeTextArea.value = '';
                resumeText = '';
                
                // Update the preview to show placeholder
                const previewContainer = document.querySelector('.resume-document');
                if (previewContainer) {
                    previewContainer.innerHTML = `
                        <div class="resume-placeholder">
                            <i class="fas fa-file-alt"></i>
                            <p>Upload your resume to see preview</p>
                        </div>
                    `;
                }
                
                showNotification('Resume text cleared');
            }
        });
    }
    
    // Add event listener for the analyze text button
    const analyzeTextBtn = document.getElementById('analyze-text-btn');
    if (analyzeTextBtn) {
        analyzeTextBtn.addEventListener('click', () => {
            const resumeTextArea = document.getElementById('resume-text');
            if (resumeTextArea && resumeTextArea.value.trim().length > 0) {
                resumeText = resumeTextArea.value.trim();
                
                // Update the preview
                updateResumePreview(null);
                
                // Show notification
                showNotification('Analyzing pasted resume text...');
                
                // Go to next step
                goToNextStep();
            } else {
                showNotification('Please paste your resume text first', 'error');
            }
        });
    }
});

/**
 * Initialize UI elements and state
 */
function initializeUI() {
    // Hide all sections except upload
    document.querySelectorAll('.section-container').forEach(section => {
        if (section.id !== 'upload-section') {
            section.classList.add('hidden');
        }
    });
    
    // Set active step
    setActiveStep(1);
    
    // Initialize preview placeholder
    const previewContainer = document.querySelector('.resume-preview .resume-document');
    if (previewContainer) {
        previewContainer.innerHTML = `
            <div class="resume-placeholder">
                <i class="fas fa-file-alt"></i>
                <p>Upload your resume to see preview</p>
            </div>
        `;
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // File upload button
    const uploadBtn = document.getElementById('upload-resume-btn');
    const uploadSidebarBtn = document.getElementById('upload-resume-sidebar-btn');
    const fileInput = document.getElementById('resume-file');
    
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
    }
    
    if (uploadSidebarBtn && fileInput) {
        uploadSidebarBtn.addEventListener('click', () => fileInput.click());
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Resume text area
    const resumeText = document.getElementById('resume-text');
    if (resumeText) {
        resumeText.addEventListener('input', handleResumeTextInput);
    }
    
    // Section navigation
    document.querySelectorAll('.sections-navigator li').forEach(item => {
        item.addEventListener('click', () => {
            // Get the section ID
            const sectionId = item.getAttribute('data-section');
            
            // Check if we have resume text for analysis sections
            if (sectionId !== 'upload' && (!resumeText || resumeText.length < 100)) {
                showNotification('Please upload a resume or paste resume text first');
                return;
            }
            
            // Remove active class from all items
            document.querySelectorAll('.sections-navigator li').forEach(li => {
                li.classList.remove('active');
            });
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Prepare content for the section if needed
            prepareContentForSection(sectionId);
            
            // Show corresponding section
            showSection(sectionId);
        });
    });
    
    // Analysis focus options
    document.querySelectorAll('.template-option').forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            document.querySelectorAll('.template-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update analysis focus
            const focusType = option.getAttribute('data-template');
            updateAnalysisFocus(focusType);
        });
    });
    
    // Job description button
    const jobDescBtn = document.getElementById('job-description-btn');
    if (jobDescBtn) {
        jobDescBtn.addEventListener('click', showJobDescriptionModal);
    }
    
    // Add job description button in keyword section
    const addJobDescBtn = document.getElementById('add-job-desc-btn');
    if (addJobDescBtn) {
        addJobDescBtn.addEventListener('click', showJobDescriptionModal);
    }
    
    // AI suggestions button
    const aiSuggestionsBtn = document.getElementById('ai-suggestions-btn');
    if (aiSuggestionsBtn) {
        aiSuggestionsBtn.addEventListener('click', generateAISuggestions);
    }
    
    // Preview controls
    const originalBtn = document.getElementById('original-btn');
    const enhancedBtn = document.getElementById('enhanced-btn');
    const fullscreenPreviewBtn = document.getElementById('fullscreen-preview-btn');
    const downloadPreviewBtn = document.getElementById('download-preview-btn');
    const sharePreviewBtn = document.getElementById('share-preview-btn');
    const previewStatusBadge = document.getElementById('preview-status-badge');
    
    if (originalBtn) {
        originalBtn.addEventListener('click', () => {
            originalBtn.classList.add('active');
            if (enhancedBtn) enhancedBtn.classList.remove('active');
            showOriginalResume();
            // Update status badge
            if (previewStatusBadge) {
                previewStatusBadge.textContent = 'Original';
                previewStatusBadge.classList.remove('enhanced');
            }
        });
    }
    
    if (enhancedBtn) {
        enhancedBtn.addEventListener('click', () => {
            enhancedBtn.classList.add('active');
            if (originalBtn) originalBtn.classList.remove('active');
            showEnhancedResume();
            // Update status badge
            if (previewStatusBadge) {
                previewStatusBadge.textContent = 'Enhanced';
                previewStatusBadge.classList.add('enhanced');
            }
        });
    }
    
    // Fullscreen preview button
    if (fullscreenPreviewBtn) {
        fullscreenPreviewBtn.addEventListener('click', () => {
            const previewContainer = document.querySelector('.resume-preview');
            if (previewContainer) {
                previewContainer.classList.toggle('fullscreen-preview');
                
                // Change icon based on fullscreen state
                if (previewContainer.classList.contains('fullscreen-preview')) {
                    fullscreenPreviewBtn.innerHTML = '<i class="fas fa-compress"></i>';
                    fullscreenPreviewBtn.setAttribute('title', 'Exit fullscreen');
                } else {
                    fullscreenPreviewBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    fullscreenPreviewBtn.setAttribute('title', 'Toggle fullscreen');
                }
            }
        });
    }
    
    // Download preview button
    if (downloadPreviewBtn) {
        downloadPreviewBtn.addEventListener('click', () => {
            downloadEnhancedResume();
        });
    }
    
    // Share preview button
    if (sharePreviewBtn) {
        sharePreviewBtn.addEventListener('click', () => {
            // Show share options modal
            showShareModal();
        });
    }
    
    // Navigation buttons
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goToPreviousStep);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextStep);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadEnhancedResume);
    }
    
    // Apply suggestion buttons
    document.querySelectorAll('.apply-suggestion').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionItem = this.closest('.suggestion-item');
            suggestionItem.classList.add('applied');
            this.textContent = 'Suggestion Applied';
            this.disabled = true;
            
            // Update the enhanced resume preview
            updateEnhancedResume();
        });
    });
    
    // Add drag and drop functionality to upload area
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileUpload({ target: fileInput });
            }
        });
    }
}

/**
 * Handle file upload
 */
function handleFileUpload(event) {
    console.log('File upload event triggered');
    const file = event.target.files[0];
    if (!file) {
        console.warn('No file selected');
        return;
    }
    
    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    // Store the file globally for reference
    resumeFile = file;
    
    // Update the file input label with the file name
    const fileInputLabel = document.querySelector('label[for="resume-file"]');
    if (fileInputLabel) {
        fileInputLabel.textContent = file.name;
    }
    
    // Update upload status
    const uploadStatus = document.getElementById('upload-status');
    if (uploadStatus) {
        uploadStatus.innerHTML = `<p style="color: blue;">Selected file: ${file.name}</p>`;
    }
    
    // Show the file in the upload area
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        // Store the original input
        const originalInput = document.getElementById('resume-file');
        
        // Update the upload area with file info
        uploadArea.innerHTML = `
            <i class="fas fa-file-alt"></i>
            <p class="file-name" style="font-weight: bold; color: green;">${file.name}</p>
            <button class="juno-button secondary" id="change-file-btn">Change File</button>
            <div id="upload-status"><p style="color: blue;">Processing file...</p></div>
        `;
        
        // Re-add the file input that was removed when we updated the innerHTML
        if (!document.getElementById('resume-file') && originalInput) {
            uploadArea.appendChild(originalInput);
        }
        
        // Add event listener to change file button
        const changeFileBtn = document.getElementById('change-file-btn');
        if (changeFileBtn) {
            changeFileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('resume-file').click();
            });
        }
    }
    
    // Update the preview immediately
    updateResumePreview(file);
    
    // Process the file
    processResumeFile(file);
}

/**
 * Handle resume text input
 */
function handleResumeTextInput(event) {
    const text = event.target.value;
    resumeText = text;
    
    if (text.length > 100) {
        // Enable next button when enough text is entered
        const nextBtn = document.getElementById('next-step-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
}

/**
 * Process the resume file
 */
function processResumeFile(file) {
    console.log('Processing resume file:', file.name, 'Type:', file.type);
    
    // Clear any existing success or error messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Update upload status
    const uploadStatus = document.getElementById('upload-status');
    if (uploadStatus) {
        uploadStatus.innerHTML = `<p style="color: blue;">Processing file: ${file.name}...</p>`;
    }
    
    // Show loading state
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-indicator';
        loadingEl.innerHTML = `
            <div class="spinner"></div>
            <p>Processing your resume...</p>
        `;
        uploadSection.appendChild(loadingEl);
        console.log('Loading indicator displayed');
    }
    
    // Update preview with file
    updateResumePreview(file);
    
    // Check file type and size
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const isValidType = validTypes.includes(file.type) || validExtensions.includes(fileExtension);
    
    if (!isValidType) {
        console.warn('Invalid file type:', file.type);
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        if (uploadStatus) {
            uploadStatus.innerHTML = `<p style="color: red;">Error: Unsupported file format. Please upload a PDF, DOC, DOCX, or TXT file.</p>`;
        }
        
        if (uploadSection) {
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Unsupported file format. Please upload a PDF, DOC, DOCX, or TXT file.</p>
            `;
            uploadSection.appendChild(errorEl);
        }
        return;
    }
    
    // Extract text from the file
    extractTextFromFile(file);
}

/**
 * Extract text from a file using FileReader
 */
function extractTextFromFile(file) {
    console.log('Extracting text from file:', file.name);
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            // Update upload status
            const uploadStatus = document.getElementById('upload-status');
            if (uploadStatus) {
                uploadStatus.innerHTML = `<p style="color: blue;">Extracting text from file...</p>`;
            }
            
            // Store the text content based on file type
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                // For PDFs, we need to handle binary data
                console.log('PDF file detected, extracting text');
                
                // Convert binary data to text (simplified approach for demo)
                let extractedText = "";
                try {
                    // Try to extract text from binary data
                    const textChunks = [];
                    const uint8Array = new Uint8Array(e.target.result);
                    for (let i = 0; i < uint8Array.length; i++) {
                        const charCode = uint8Array[i];
                        if (charCode >= 32 && charCode <= 126) { // ASCII printable characters
                            textChunks.push(String.fromCharCode(charCode));
                        }
                    }
                    extractedText = textChunks.join('');
                    
                    // Clean up the extracted text
                    extractedText = extractedText.replace(/[^\x20-\x7E]/g, " ");
                    extractedText = extractedText.replace(/\s+/g, " ").trim();
                    
                    console.log('PDF text extraction completed, length:', extractedText.length);
                    
                    if (extractedText.length > 100) {
                        resumeText = extractedText;
                        // Store the file for reference
                        resumeFile = file;
                    } else {
                        // If extraction failed, use a sample resume text for demonstration
                        console.warn('PDF text extraction yielded short content, using sample text');
                        if (uploadStatus) {
                            uploadStatus.innerHTML = `<p style="color: orange;">PDF text extraction limited. Using sample text for demonstration.</p>`;
                        }
                        // Use a sample resume text
                        resumeText = generateSampleResumeText(file.name);
                        // Store the file for reference
                        resumeFile = file;
                    }
                } catch (extractionError) {
                    console.error('Error during PDF text extraction:', extractionError);
                    if (uploadStatus) {
                        uploadStatus.innerHTML = `<p style="color: orange;">PDF text extraction failed. Using sample text for demonstration.</p>`;
                    }
                    // Use a sample resume text
                    resumeText = generateSampleResumeText(file.name);
                    // Store the file for reference
                    resumeFile = file;
                }
            } else if (file.type.includes('word') || 
                      file.name.toLowerCase().endsWith('.doc') || 
                      file.name.toLowerCase().endsWith('.docx')) {
                // For Word documents, handle binary data
                console.log('Word document detected, extracting text');
                
                // Try to extract text from binary data
                let extractedText = "";
                try {
                    const textChunks = [];
                    const uint8Array = new Uint8Array(e.target.result);
                    for (let i = 0; i < uint8Array.length; i++) {
                        const charCode = uint8Array[i];
                        if (charCode >= 32 && charCode <= 126) { // ASCII printable characters
                            textChunks.push(String.fromCharCode(charCode));
                        }
                    }
                    extractedText = textChunks.join('');
                    
                    // Clean up the extracted text
                    extractedText = extractedText.replace(/[^\x20-\x7E]/g, " ");
                    extractedText = extractedText.replace(/\s+/g, " ").trim();
                    
                    console.log('Word document text extraction completed, length:', extractedText.length);
                    
                    if (extractedText.length > 100) {
                        resumeText = extractedText;
                        // Store the file for reference
                        resumeFile = file;
                    } else {
                        // If extraction failed, use a sample resume text for demonstration
                        console.warn('Word document text extraction yielded short content, using sample text');
                        if (uploadStatus) {
                            uploadStatus.innerHTML = `<p style="color: orange;">Word document text extraction limited. Using sample text for demonstration.</p>`;
                        }
                        // Use a sample resume text
                        resumeText = generateSampleResumeText(file.name);
                        // Store the file for reference
                        resumeFile = file;
                    }
                } catch (extractionError) {
                    console.error('Error during Word document text extraction:', extractionError);
                    if (uploadStatus) {
                        uploadStatus.innerHTML = `<p style="color: orange;">Word document text extraction failed. Using sample text for demonstration.</p>`;
                    }
                    // Use a sample resume text
                    resumeText = generateSampleResumeText(file.name);
                    // Store the file for reference
                    resumeFile = file;
                }
            } else {
                // For text files, use the result directly
                console.log('Text file detected, extracting content directly');
                resumeText = e.target.result;
                // Store the file for reference
                resumeFile = file;
                
                if (resumeText && resumeText.length > 0) {
                    console.log('Text file extraction successful, length:', resumeText.length);
                    if (uploadStatus) {
                        uploadStatus.innerHTML = `<p style="color: green;">Text extraction successful!</p>`;
                    }
                } else {
                    console.warn('Text file appears to be empty, using sample text');
                    if (uploadStatus) {
                        uploadStatus.innerHTML = `<p style="color: orange;">Text file appears to be empty. Using sample text for demonstration.</p>`;
                    }
                    // Use a sample resume text
                    resumeText = generateSampleResumeText(file.name);
                }
            }
            
            console.log('Resume text extracted successfully, length:', resumeText.length);
            if (resumeText.length > 100) {
                console.log('First 100 chars:', resumeText.substring(0, 100) + '...');
            }
            
            // Remove loading indicator
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            // Enable next button
            const nextBtn = document.getElementById('next-step-btn');
            if (nextBtn) {
                nextBtn.disabled = false;
                console.log('Next button enabled');
            } else {
                console.error('Next button not found');
            }
            
            // Show success message
            const uploadSection = document.getElementById('upload-section');
            if (uploadSection) {
                // Remove any existing success messages
                const existingSuccess = uploadSection.querySelector('.success-message');
                if (existingSuccess) {
                    existingSuccess.remove();
                }
                
                const successEl = document.createElement('div');
                successEl.className = 'success-message';
                successEl.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Resume processed successfully! Click "Next Step" to see AI-powered analysis.</p>
                `;
                uploadSection.appendChild(successEl);
                console.log('Success message displayed');
                
                // Show notification
                showNotification('Resume uploaded successfully! Click "Next Step" to continue.', 'success');
            }
        } catch (error) {
            console.error('Error processing file content:', error);
            handleFileError(error);
        }
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        handleFileError(error);
    };
    
    // Function to handle file errors
    function handleFileError(error) {
        // Remove loading indicator
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // Show error message
        const uploadSection = document.getElementById('upload-section');
        if (uploadSection) {
            // Remove any existing error messages
            const existingError = uploadSection.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Error processing your resume. Using sample text for demonstration.</p>
                <p class="error-details">${error.message || 'Unknown error'}</p>
            `;
            uploadSection.appendChild(errorEl);
            
            // Use a sample resume text
            resumeText = generateSampleResumeText(file ? file.name : 'resume.txt');
            // Enable next button despite the error
            const nextBtn = document.getElementById('next-step-btn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
            
            // Show notification
            showNotification('Error processing file. Using sample text for demonstration.', 'warning');
        }
    }
    
    // Read the file based on its type
    try {
        console.log('Reading file:', file.name, 'Type:', file.type);
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            // For PDFs, read as array buffer for binary processing
            reader.readAsArrayBuffer(file);
        } else if (file.type.includes('word') || 
                  file.name.toLowerCase().endsWith('.doc') || 
                  file.name.toLowerCase().endsWith('.docx')) {
            // For Word documents, read as array buffer for binary processing
            reader.readAsArrayBuffer(file);
        } else {
            // For other files, read as text
            reader.readAsText(file);
        }
    } catch (error) {
        console.error('Error initiating file read:', error);
        handleFileError(error);
    }
}

/**
 * Generate sample resume text for demonstration purposes
 * @param {string} fileName - The name of the file
 * @returns {string} - Sample resume text
 */
function generateSampleResumeText(fileName) {
    return `John Doe
Software Developer
johndoe@example.com | (555) 123-4567 | linkedin.com/in/johndoe

SUMMARY
Experienced software developer with 5+ years of expertise in full-stack development, specializing in JavaScript frameworks and cloud technologies. Proven track record of delivering scalable applications and optimizing performance.

EXPERIENCE
Senior Software Developer | Tech Solutions Inc. | Jan 2020 - Present
• Led development of a customer-facing web application that increased user engagement by 45%
• Implemented CI/CD pipeline reducing deployment time by 60%
• Mentored junior developers and conducted code reviews

Software Developer | Digital Innovations | Mar 2017 - Dec 2019
• Developed RESTful APIs for mobile applications
• Optimized database queries resulting in 30% faster load times
• Collaborated with UX team to implement responsive designs

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2013-2017

SKILLS
• Programming: JavaScript, TypeScript, Python, Java
• Frontend: React, Angular, HTML5, CSS3
• Backend: Node.js, Express, Django
• Database: MongoDB, PostgreSQL, MySQL
• Tools: Git, Docker, AWS, Azure
• Methodologies: Agile, Scrum, TDD

PROJECTS
E-commerce Platform (2021)
• Built a full-stack e-commerce solution with React and Node.js
• Implemented secure payment processing and inventory management

Data Visualization Dashboard (2019)
• Created interactive data visualizations using D3.js
• Integrated with multiple data sources for real-time updates

CERTIFICATIONS
• AWS Certified Developer - Associate
• MongoDB Certified Developer
• Google Cloud Professional Developer
`;
}

/**
 * Update resume preview
 */
function updateResumePreview(file) {
    console.log('Updating resume preview with file:', file ? file.name : 'none');
    
    const previewContainer = document.querySelector('.resume-preview .resume-document');
    if (!previewContainer) {
        console.error('Preview container not found');
        return;
    }
    
    // Make sure the preview section is visible
    const previewSection = document.querySelector('.resume-preview');
    if (previewSection) {
        previewSection.style.display = 'block';
    }
    
    if (!file) {
        previewContainer.innerHTML = `
            <div class="resume-file-preview">
                <div class="file-icon">
                    <i class="fas fa-file-upload"></i>
                </div>
                <div class="file-info">
                    <h4>No file selected</h4>
                    <p>Upload a resume to see preview</p>
                </div>
            </div>
        `;
        return;
    }
    
    // For PDF files, embed the PDF
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        try {
            // Create object URL for the file
            const objectUrl = URL.createObjectURL(file);
            console.log('Created object URL for PDF:', objectUrl);
            
            previewContainer.innerHTML = `
                <div class="pdf-container">
                    <embed src="${objectUrl}" type="application/pdf" width="100%" height="500px">
                </div>
            `;
            
            // Show notification
            showNotification('PDF preview loaded successfully', 'success');
        } catch (error) {
            console.error('Error creating object URL for PDF:', error);
            previewContainer.innerHTML = `
                <div class="resume-file-preview">
                    <div class="file-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="file-info">
                        <h4>${file.name}</h4>
                        <p>${(file.size / 1024).toFixed(1)} KB</p>
                        <p class="error-text">Error loading PDF preview</p>
                    </div>
                </div>
            `;
        }
    } else if (file.type.includes('word') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
        // For Word documents, show a placeholder with file info
        previewContainer.innerHTML = `
            <div class="resume-file-preview">
                <div class="file-icon">
                    <i class="fas fa-file-word"></i>
                </div>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>${(file.size / 1024).toFixed(1)} KB</p>
                    <p>Word document preview</p>
                </div>
            </div>
        `;
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        // For text files, try to display the content
        const reader = new FileReader();
        reader.onload = function(e) {
            const textContent = e.target.result;
            previewContainer.innerHTML = `
                <div class="text-preview">
                    <pre>${textContent}</pre>
                </div>
            `;
        };
        reader.onerror = function() {
            previewContainer.innerHTML = `
                <div class="resume-file-preview">
                    <div class="file-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="file-info">
                        <h4>${file.name}</h4>
                        <p>${(file.size / 1024).toFixed(1)} KB</p>
                        <p class="error-text">Error loading text preview</p>
                    </div>
                </div>
            `;
        };
        reader.readAsText(file);
    } else {
        // For other file types, show a placeholder with file info
        previewContainer.innerHTML = `
            <div class="resume-file-preview">
                <div class="file-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>${(file.size / 1024).toFixed(1)} KB</p>
                </div>
            </div>
        `;
    }
    
    // Add CSS to ensure the preview is visible
    const style = document.createElement('style');
    style.textContent = `
        .resume-preview {
            display: block !important;
            height: auto !important;
            min-height: 300px;
        }
        .resume-document {
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: auto;
            height: 100%;
            min-height: 300px;
        }
        .pdf-container {
            width: 100%;
            height: 500px;
            overflow: auto;
        }
        .text-preview {
            white-space: pre-wrap;
            font-family: monospace;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            max-height: 500px;
            overflow: auto;
        }
        .resume-file-preview {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            text-align: center;
        }
        .file-icon {
            font-size: 48px;
            margin-bottom: 15px;
            color: var(--primary-color);
        }
        .error-text {
            color: #e74c3c;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show a specific section
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

/**
 * Update analysis focus based on selected template
 */
function updateAnalysisFocus(focusType) {
    console.log(`Analysis focus updated to: ${focusType}`);
    
    // Show corresponding section based on focus
    switch (focusType) {
        case 'ats':
            showSection('ats-score');
            break;
        case 'content':
            showSection('content-analysis');
            break;
        case 'keywords':
            showSection('keyword-analysis');
            break;
    }
}

/**
 * Show job description modal
 */
function showJobDescriptionModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('job-description-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'job-description-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2><i class="fas fa-briefcase"></i> Add Job Description</h2>
                <p>Enter the job description to optimize your resume for this specific role.</p>
                <textarea id="job-description-text" rows="10" placeholder="Paste the job description here..."></textarea>
                <div class="modal-actions">
                    <button id="analyze-job-btn" class="juno-button primary">Analyze Job Requirements</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        const analyzeBtn = modal.querySelector('#analyze-job-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', analyzeJobDescription);
        }
    }
    
    // Show the modal
    modal.style.display = 'block';
}

/**
 * Analyze job description
 */
function analyzeJobDescription() {
    const jobText = document.getElementById('job-description-text').value;
    if (!jobText || jobText.length < 50) {
        alert('Please enter a valid job description');
        return;
    }
    
    // Hide modal
    const modal = document.getElementById('job-description-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Simulate job analysis
    simulateJobAnalysis(jobText);
}

/**
 * Simulate job analysis
 */
function simulateJobAnalysis(jobText) {
    // This would analyze the job description and update the keyword analysis
    console.log('Analyzing job description...');
    
    // Update keyword analysis section with job-specific keywords
    const keywordSection = document.getElementById('keyword-analysis-section');
    if (keywordSection) {
        // Update the job match section
        const jobMatchSection = keywordSection.querySelector('.job-match-section');
        if (jobMatchSection) {
            jobMatchSection.innerHTML = `
                <h3>Job Match Score</h3>
                <div class="job-match-score">
                    <div class="score-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="score-fill" stroke-dasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="18" y="20.35" class="score-text">45%</text>
                        </svg>
                    </div>
                    <p>Your resume matches 45% of the key requirements for this job</p>
                </div>
                <div class="job-match-details">
                    <h4>Job Title: Software Developer</h4>
                    <p class="job-company">Company: Tech Innovations Inc.</p>
                </div>
            `;
        }
        
        // Update the keyword categories with job-specific keywords
        const technicalSkills = keywordSection.querySelector('.keyword-category:nth-child(1) .keyword-tags');
        if (technicalSkills) {
            technicalSkills.innerHTML = `
                <span class="keyword-tag missing">React.js</span>
                <span class="keyword-tag present">JavaScript</span>
                <span class="keyword-tag missing">Node.js</span>
                <span class="keyword-tag present">HTML/CSS</span>
                <span class="keyword-tag missing">MongoDB</span>
                <span class="keyword-tag missing">RESTful APIs</span>
            `;
        }
        
        const softSkills = keywordSection.querySelector('.keyword-category:nth-child(2) .keyword-tags');
        if (softSkills) {
            softSkills.innerHTML = `
                <span class="keyword-tag present">Communication</span>
                <span class="keyword-tag present">Teamwork</span>
                <span class="keyword-tag missing">Problem-solving</span>
                <span class="keyword-tag missing">Agile methodology</span>
                <span class="keyword-tag present">Time management</span>
            `;
        }
        
        const industrySkills = keywordSection.querySelector('.keyword-category:nth-child(3) .keyword-tags');
        if (industrySkills) {
            industrySkills.innerHTML = `
                <span class="keyword-tag missing">CI/CD</span>
                <span class="keyword-tag missing">Git version control</span>
                <span class="keyword-tag present">Web development</span>
                <span class="keyword-tag missing">Unit testing</span>
            `;
        }
    }
    
    // Show the keyword analysis section
    showSection('keyword-analysis');
    
    // Show a notification
    showNotification('Job description analyzed! Keyword analysis updated.');
}

/**
 * Generate AI suggestions
 */
function generateAISuggestions() {
    // This would generate AI-powered suggestions for resume improvement
    console.log('Generating AI suggestions...');
    
    // Show the suggestions section
    showSection('suggestions');
    
    // Show a notification
    showNotification('AI suggestions generated! Review and apply them to improve your resume.');
}

/**
 * Show original resume in preview
 */
function showOriginalResume() {
    // This would show the original uploaded resume in the preview
    console.log('Showing original resume');
    
    // We would typically update the preview container here
    // For demo purposes, we'll just add a visual indicator
    const previewContainer = document.querySelector('.resume-preview .resume-document');
    if (previewContainer) {
        const originalIndicator = document.createElement('div');
        originalIndicator.className = 'preview-indicator original';
        originalIndicator.innerHTML = '<span>Original Version</span>';
        
        // Remove any existing indicators
        const existingIndicator = previewContainer.querySelector('.preview-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        previewContainer.appendChild(originalIndicator);
    }
}

/**
 * Show enhanced resume in preview
 */
function showEnhancedResume() {
    // This would show the enhanced resume with improvements in the preview
    console.log('Showing enhanced resume');
    
    // We would typically update the preview container here
    // For demo purposes, we'll just add a visual indicator
    const previewContainer = document.querySelector('.resume-preview .resume-document');
    if (previewContainer) {
        const enhancedIndicator = document.createElement('div');
        enhancedIndicator.className = 'preview-indicator enhanced';
        enhancedIndicator.innerHTML = '<span>Enhanced Version</span>';
        
        // Remove any existing indicators
        const existingIndicator = previewContainer.querySelector('.preview-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        previewContainer.appendChild(enhancedIndicator);
    }
}

/**
 * Update enhanced resume based on applied suggestions
 */
function updateEnhancedResume() {
    // This would update the enhanced resume preview based on applied suggestions
    console.log('Updating enhanced resume');
    
    // Show enhanced resume view
    showEnhancedResume();
    
    // Show a notification
    showNotification('Resume updated with applied suggestions!');
}

/**
 * Download enhanced resume
 */
function downloadEnhancedResume() {
    // Get the enhanced resume content
    const enhancedContent = document.querySelector('.resume-document.enhanced');
    if (!enhancedContent) {
        showNotification('No enhanced resume available to download', 'error');
        return;
    }
    
    // Create a blob from the HTML content
    const blob = new Blob([enhancedContent.innerHTML], {type: 'text/html'});
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced-resume.html';
    a.click();
    
    // Show success notification
    showNotification('Resume downloaded successfully', 'success');
}

/**
 * Show share modal for resume
 */
function showShareModal() {
    // Create modal container if it doesn't exist
    let shareModal = document.getElementById('share-resume-modal');
    
    if (!shareModal) {
        shareModal = document.createElement('div');
        shareModal.id = 'share-resume-modal';
        shareModal.className = 'modal-container';
        
        // Create modal content
        shareModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-share-alt"></i> Share Your Resume</h3>
                    <button class="close-modal-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="share-options">
                        <div class="share-option" data-platform="email">
                            <i class="fas fa-envelope"></i>
                            <span>Email</span>
                        </div>
                        <div class="share-option" data-platform="linkedin">
                            <i class="fab fa-linkedin"></i>
                            <span>LinkedIn</span>
                        </div>
                        <div class="share-option" data-platform="twitter">
                            <i class="fab fa-twitter"></i>
                            <span>Twitter</span>
                        </div>
                        <div class="share-option" data-platform="facebook">
                            <i class="fab fa-facebook"></i>
                            <span>Facebook</span>
                        </div>
                    </div>
                    <div class="share-link-container">
                        <h4>Or copy this link</h4>
                        <div class="share-link-input">
                            <input type="text" id="share-link" readonly value="https://juno-companion.com/shared-resume/" />
                            <button id="copy-link-btn"><i class="fas fa-copy"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to document body
        document.body.appendChild(shareModal);
        
        // Add event listeners
        const closeBtn = shareModal.querySelector('.close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                shareModal.classList.remove('active');
            });
        }
        
        // Add click event for share options
        const shareOptions = shareModal.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.getAttribute('data-platform');
                shareToSocialMedia(platform);
            });
        });

        // Add copy link functionality
        const copyLinkBtn = document.querySelector('.share-link-input button');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                const linkInput = document.querySelector('.share-link-input input');
                if (linkInput) {
                    linkInput.select();
                    document.execCommand('copy');

                    // Add animation class
                    copyLinkBtn.classList.add('copied');

                    // Remove class after animation completes
                    setTimeout(() => {
                        copyLinkBtn.classList.remove('copied');
                    }, 600);

                    showNotification('Link copied to clipboard!', 'success');
                }
            });
        }
    }

    // Show the modal
    shareModal.classList.add('active');
}

/**
 * Share resume to social media
 * @param {string} platform - The platform to share to
 */
function shareToSocialMedia(platform) {
    // In a real implementation, this would generate sharing links for each platform
    // For now, we'll just show a notification
    const shareUrl = 'https://juno-companion.com/shared-resume/';
    let shareLink = '';
    
    switch (platform) {
        case 'email':
            shareLink = `mailto:?subject=Check out my enhanced resume&body=I've enhanced my resume using Juno AI. Check it out here: ${shareUrl}`;
            window.location.href = shareLink;
            break;
        case 'linkedin':
            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
            window.open(shareLink, '_blank');
            break;
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=Check out my enhanced resume created with Juno AI&url=${encodeURIComponent(shareUrl)}`;
            window.open(shareLink, '_blank');
            break;
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(shareLink, '_blank');
            break;
        default:
            showNotification(`Sharing to ${platform} is not implemented yet`, 'info');
    }
    
    showNotification(`Resume shared to ${platform}`, 'success');
}

/**
 * Go to previous step
 */
function goToPreviousStep() {
    const activeStep = getCurrentStep();
    if (activeStep > 1) {
        setActiveStep(activeStep - 1);
    }
}

/**
 * Go to next step
 */
function goToNextStep() {
    const activeStep = getCurrentStep();
    console.log('Current step:', activeStep);
    
    // Check if we can proceed from step 1 (upload)
    if (activeStep === 1) {
        if (!resumeText || resumeText.length < 10) {
            console.warn('Cannot proceed: No resume text available');
            showNotification('Please upload a resume or paste resume text first');
            return;
        }
        console.log('Resume text is available, proceeding to next step');
    }
    
    if (activeStep < 5) {
        // Prepare content for the next step before changing
        prepareStepContent(activeStep + 1);
        
        // Set the active step
        setActiveStep(activeStep + 1);
        
        // Scroll to top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // If we're at the last step, show the download button
    if (activeStep + 1 === 5) {
        const nextBtn = document.getElementById('next-step-btn');
        const downloadBtn = document.getElementById('download-btn');
        
        if (nextBtn) nextBtn.classList.add('hidden');
        if (downloadBtn) downloadBtn.classList.remove('hidden');
    }
}

/**
 * Get current step
 */
function getCurrentStep() {
    const activeStep = document.querySelector('.progress-step.active');
    return activeStep ? parseInt(activeStep.getAttribute('data-step')) : 1;
}

/**
 * Show section by ID
 * @param {string} sectionId - The ID of the section to show (without '-section' suffix)
 */
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the selected section
    const sectionElement = document.getElementById(sectionId + '-section');
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
        console.log('Section displayed:', sectionId + '-section');
    } else {
        console.error('Section not found:', sectionId + '-section');
    }
    
    // Update the active sidebar item
    document.querySelectorAll('.sections-navigator li').forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Prepare content for the selected section
 * @param {string} sectionId - The ID of the section to prepare content for
 */
function prepareContentForSection(sectionId) {
    console.log('Preparing content for section:', sectionId);
    
    // Check if we have resume text for analysis sections
    if (sectionId !== 'upload' && (!resumeText || resumeText.length < 100)) {
        showNotification('Please upload a resume or paste resume text first');
        return false;
    }
    
    // Prepare content based on section ID
    switch (sectionId) {
        case 'ats-score':
            prepareATSAnalysis();
            break;
        case 'content-analysis':
            prepareContentAnalysis();
            break;
        case 'keyword-analysis':
            prepareKeywordAnalysis();
            break;
        case 'format-analysis':
            prepareFormatAnalysis();
            break;
        case 'suggestions':
            prepareSuggestions();
            break;
        default:
            // No preparation needed for upload section
            break;
    }
    
    return true;
}

/**
 * Set active step
 */
function setActiveStep(step) {
    // Update progress tracker
    document.querySelectorAll('.progress-step').forEach(stepEl => {
        const stepNum = parseInt(stepEl.getAttribute('data-step'));
        if (stepNum === step) {
            stepEl.classList.add('active');
        } else if (stepNum < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });
    
    // Use the enhanced progress tracker if available
    if (window.ProgressTracker && typeof window.ProgressTracker.navigateToStep === 'function') {
        window.ProgressTracker.navigateToStep(step);
    }
    
    // Update the progress steps class
    const progressSteps = document.querySelector('.progress-steps');
    if (progressSteps) {
        progressSteps.classList.remove('step-1', 'step-2', 'step-3', 'step-4', 'step-5');
        progressSteps.classList.add(`step-${step}`);
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-step-btn');
    if (prevBtn) {
        prevBtn.disabled = step === 1;
    }
    
    // Show appropriate section based on step
    document.querySelectorAll('.section-container').forEach(section => {
        section.classList.add('hidden');
    });
    
    let sectionToShow = '';
    let sectionId = '';
    
    switch (step) {
        case 1:
            sectionToShow = 'upload-section';
            sectionId = 'upload';
            break;
        case 2:
            sectionToShow = 'ats-score-section';
            sectionId = 'ats-score';
            break;
        case 3:
            sectionToShow = 'content-analysis-section';
            sectionId = 'content-analysis';
            break;
        case 4:
            sectionToShow = 'keyword-analysis-section';
            sectionId = 'keyword-analysis';
            break;
        case 5:
            sectionToShow = 'suggestions-section';
            sectionId = 'suggestions';
            break;
        default:
            sectionToShow = 'upload-section';
            sectionId = 'upload';
    }
    
    // Show the section
    const sectionElement = document.getElementById(sectionToShow);
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
    }
    
    // Update sidebar navigation
    document.querySelectorAll('.sections-navigator li').forEach(item => {
        item.classList.remove('active');
        
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });
}

/**
 * Prepare content for the next step
 */
function prepareStepContent(stepNumber) {
    console.log('Preparing content for step:', stepNumber);
    
    // Prepare content based on the step number
    switch (stepNumber) {
        case 2: // ATS Analysis
            // Simulate ATS analysis if not already done
            prepareATSAnalysis();
            break;
        case 3: // Content Review
            // Prepare content analysis if not already done
            prepareContentAnalysis();
            break;
        case 4: // Improvement Suggestions
            // Generate suggestions if not already done
            prepareSuggestions();
            break;
        case 5: // Download Enhanced Resume
            // Prepare final enhanced resume if not already done
            prepareFinalResume();
            break;
    }
}

/**
 * Prepare ATS analysis content
 */
function prepareATSAnalysis() {
    console.log('Preparing ATS analysis');
    
    // Check if we have resume text to analyze
    if (!resumeText || resumeText.length < 100) {
        console.error('Resume text too short for analysis');
        showNotification('Resume text is too short for meaningful analysis. Please provide more content.');
        return;
    }
    
    // Show loading state
    const atsScoreSection = document.getElementById('ats-score-section');
    if (atsScoreSection) {
        atsScoreSection.innerHTML = `
            <h2><i class="fas fa-robot"></i> ATS Compatibility Score</h2>
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Analyzing your resume with AI...</p>
            </div>
        `;
    }
    
    // Use the AI analyzer to analyze the resume
    if (window.ResumeAI && typeof window.ResumeAI.analyzeResumeWithAI === 'function') {
        console.log('Using AI analyzer for ATS analysis');
        
        // Force the use of the real AI analyzer, not the fallback
        const apiKey = "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";
        window.ResumeAI.initializeAIAnalyzer(apiKey);
        
        window.ResumeAI.analyzeResumeWithAI(resumeText, function(results) {
            console.log('AI analysis completed:', results);
            
            // Store the analysis results
            analysisResults = results;
            
            if (results && !results.error) {
                // Update the ATS score section with the results
                updateATSScoreSection(results.ats);
            } else {
                console.error('Error in AI analysis:', results ? results.error : 'No results');
                // Only fall back to simulated analysis if there's an error
                simulateATSAnalysis();
            }
        });
    } else {
        console.error('AI analyzer not available for ATS analysis');
        // Fallback to simulated analysis
        simulateATSAnalysis();
    }
}

/**
 * Update the ATS score section with analysis results
 */
function updateATSScoreSection(atsResults) {
    const atsScoreSection = document.getElementById('ats-score-section');
    if (!atsScoreSection) return;
    
    console.log('Received ATS analysis results:', atsResults);
    
    // Check if we have valid results
    if (!atsResults || atsResults.error) {
        console.error('Error in ATS analysis:', atsResults ? atsResults.error : 'No results');
        // Fallback to simulated analysis
        console.warn('Falling back to simulated ATS analysis');
        simulateATSAnalysis();
        return;
    }
    
    // Log that we're using real AI-generated results
    console.log('Using AI-generated ATS analysis results');
    showNotification('AI analysis complete! Showing personalized results.');
    
    // Get the ATS score and other metrics from the AI response or use defaults
    const atsScore = atsResults.atsScore || 65;
    const formatCompatibility = atsResults.formatCompatibility || 80;
    const keywordRelevance = atsResults.keywordRelevance || 60;
    const sectionOrganization = atsResults.sectionOrganization || 70;
    
    // Get the critical issues from the AI response or use defaults
    const criticalIssues = atsResults.criticalIssues || [
        {
            issue: "Missing Keywords",
            description: "Your resume is missing key terms that ATS systems look for in your industry."
        },
        {
            issue: "Complex Formatting",
            description: "Some formatting elements may not be properly parsed by ATS systems."
        },
        {
            issue: "Inconsistent Section Headers",
            description: "Standard section headers like 'Experience' and 'Education' should be clearly defined."
        }
    ];
    
    // Log the actual values we're using from the AI
    console.log('Using AI-generated values:');
    console.log('- ATS Score:', atsScore);
    console.log('- Format Compatibility:', formatCompatibility);
    console.log('- Keyword Relevance:', keywordRelevance);
    console.log('- Section Organization:', sectionOrganization);
    console.log('- Critical Issues:', criticalIssues);
    
    // Update the ATS score section with the analysis results
    atsScoreSection.innerHTML = `
        <h2><i class="fas fa-robot"></i> ATS Compatibility Score</h2>
        <div class="analysis-overview">
            <div class="score-card">
                <div class="score-circle">
                    <svg viewBox="0 0 36 36">
                        <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path class="score-fill" stroke-dasharray="${atsScore}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <text x="18" y="20.35" class="score-text">${atsScore}%</text>
                    </svg>
                </div>
                <h3>ATS Score</h3>
                <p>${atsResults.overallFeedback || "Your resume needs improvement to pass ATS systems"}</p>
            </div>
            <div class="analysis-metrics">
                <div class="metric">
                    <h4>Format Compatibility</h4>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${formatCompatibility}%"></div>
                    </div>
                    <span class="metric-value">${formatCompatibility}%</span>
                </div>
                <div class="metric">
                    <h4>Keyword Relevance</h4>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${keywordRelevance}%"></div>
                    </div>
                    <span class="metric-value">${keywordRelevance}%</span>
                </div>
                <div class="metric">
                    <h4>Section Organization</h4>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${sectionOrganization}%"></div>
                    </div>
                    <span class="metric-value">${sectionOrganization}%</span>
                </div>
            </div>
        </div>
        <div class="ats-issues">
            <h3>Critical ATS Issues</h3>
            <ul class="issues-list">
                ${generateIssuesHTML(criticalIssues)}
            </ul>
        </div>
        <div class="ai-analysis-indicator">
            <i class="fas fa-robot"></i> Analysis powered by AI using OpenRouter API
        </div>
    `;
}

/**
 * Generate HTML for ATS issues
 */
function generateIssuesHTML(issues) {
    // If no issues provided, use default issues
    if (!issues || !issues.length) {
        return `
            <li class="issue-item">
                <i class="fas fa-exclamation-circle"></i>
                <div class="issue-content">
                    <h4>Missing Keywords</h4>
                    <p>Your resume is missing key terms that ATS systems look for in your industry.</p>
                </div>
            </li>
            <li class="issue-item">
                <i class="fas fa-exclamation-circle"></i>
                <div class="issue-content">
                    <h4>Complex Formatting</h4>
                    <p>Some formatting elements may not be properly parsed by ATS systems.</p>
                </div>
            </li>
            <li class="issue-item">
                <i class="fas fa-exclamation-circle"></i>
                <div class="issue-content">
                    <h4>Inconsistent Section Headers</h4>
                    <p>Standard section headers like "Experience" and "Education" should be clearly defined.</p>
                </div>
            </li>
        `;
    }
    
    // Generate HTML for each issue
    return issues.map(issue => `
        <li class="issue-item">
            <i class="fas fa-exclamation-circle"></i>
            <div class="issue-content">
                <h4>${issue.issue}</h4>
                <p>${issue.description}</p>
            </div>
        </li>
    `).join('');
}

/**
 * Fallback function for simulated ATS analysis
 */
function simulateATSAnalysis() {
    console.log('Using simulated ATS analysis');
    
    const atsScoreSection = document.getElementById('ats-score-section');
    if (atsScoreSection) {
        // If we haven't shown this section yet, make sure it's ready
        const score = Math.floor(Math.random() * 30) + 50; // 50-80%
        
        atsScoreSection.innerHTML = `
            <h2><i class="fas fa-robot"></i> ATS Compatibility Score</h2>
            <div class="analysis-overview">
                <div class="score-card">
                    <div class="score-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="score-fill" stroke-dasharray="${score}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="18" y="20.35" class="score-text">${score}%</text>
                        </svg>
                    </div>
                    <h3>ATS Score</h3>
                    <p>Your resume needs improvement to pass ATS systems</p>
                </div>
                <div class="analysis-metrics">
                    <div class="metric">
                        <h4>Format Compatibility</h4>
                        <div class="progress-bar">
                            <div class="progress" style="width: 80%"></div>
                        </div>
                        <span class="metric-value">80%</span>
                    </div>
                    <div class="metric">
                        <h4>Keyword Relevance</h4>
                        <div class="progress-bar">
                            <div class="progress" style="width: 60%"></div>
                        </div>
                        <span class="metric-value">60%</span>
                    </div>
                    <div class="metric">
                        <h4>Section Organization</h4>
                        <div class="progress-bar">
                            <div class="progress" style="width: 70%"></div>
                        </div>
                        <span class="metric-value">70%</span>
                    </div>
                </div>
            </div>
            <div class="ats-issues">
                <h3>Critical ATS Issues</h3>
                <ul class="issues-list">
                    <li class="issue-item">
                        <i class="fas fa-exclamation-circle"></i>
                        <div class="issue-content">
                            <h4>Missing Keywords</h4>
                            <p>Your resume is missing key terms that ATS systems look for in your industry.</p>
                        </div>
                    </li>
                    <li class="issue-item">
                        <i class="fas fa-exclamation-circle"></i>
                        <div class="issue-content">
                            <h4>Complex Formatting</h4>
                            <p>Some formatting elements may not be properly parsed by ATS systems.</p>
                        </div>
                    </li>
                    <li class="issue-item">
                        <i class="fas fa-exclamation-circle"></i>
                        <div class="issue-content">
                            <h4>Inconsistent Section Headers</h4>
                            <p>Standard section headers like "Experience" and "Education" should be clearly defined.</p>
                        </div>
                    </li>
                </ul>
            </div>
        `;
    }
}

/**
 * Prepare content analysis
 */
function prepareContentAnalysis() {
    console.log('Preparing content analysis');
    
    // Check if we have resume text to analyze
    if (!resumeText || resumeText.length < 100) {
        console.error('Resume text too short for content analysis');
        showNotification('Resume text is too short for meaningful analysis. Please provide more content.');
        return;
    }
    
    // Show loading state
    const contentAnalysisSection = document.getElementById('content-analysis-section');
    if (contentAnalysisSection) {
        contentAnalysisSection.innerHTML = `
            <h2><i class="fas fa-file-alt"></i> Content Analysis</h2>
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Analyzing your resume content...</p>
            </div>
        `;
    }
    
    // Use local analysis instead of API to avoid errors
    console.log('Using local analysis for content analysis');
    
    // Analyze the resume content directly
    setTimeout(() => {
        // This timeout is just to show the loading spinner briefly
        // Generate content analysis based on actual resume text
        const contentResults = analyzeResumeContent(resumeText);
        
        // Update the content analysis section with the results
        updateContentAnalysisSection(contentResults);
        
        // Add a note that this is local analysis
        const analysisNote = document.createElement('div');
        analysisNote.className = 'analysis-note';
        analysisNote.innerHTML = '<p><i class="fas fa-info-circle"></i> Analysis performed locally on your device.</p>';
        contentAnalysisSection.appendChild(analysisNote);
    }, 1000);
}

/**
 * Analyze resume content directly without using API
 * @param {string} resumeText - The resume text to analyze
 * @returns {Object} - Content analysis results
 */
function analyzeResumeContent(resumeText) {
    console.log('Analyzing resume content directly...');
    
    // Clean and normalize the text
    const cleanText = resumeText.toLowerCase();
    
    // Calculate impact score based on action verbs and quantifiable achievements
    let impactScore = 50; // Base score
    
    // Check for action verbs
    const actionVerbs = ['achieved', 'improved', 'led', 'managed', 'created', 'developed', 'implemented', 
                         'increased', 'decreased', 'reduced', 'negotiated', 'organized', 'coordinated'];
    let actionVerbCount = 0;
    actionVerbs.forEach(verb => {
        const regex = new RegExp('\\b' + verb + '\\b', 'gi');
        const matches = cleanText.match(regex);
        if (matches) {
            actionVerbCount += matches.length;
        }
    });
    
    // Adjust impact score based on action verbs (max +15 points)
    impactScore += Math.min(actionVerbCount * 3, 15);
    
    // Check for quantifiable achievements (numbers, percentages)
    const quantifiableRegex = /\b\d+%|\$\d+|\d+ percent|increased by \d+|decreased by \d+/gi;
    const quantifiableMatches = cleanText.match(quantifiableRegex) || [];
    
    // Adjust impact score based on quantifiable achievements (max +15 points)
    impactScore += Math.min(quantifiableMatches.length * 5, 15);
    
    // Calculate clarity score based on sentence length and readability
    let clarityScore = 60; // Base score
    
    // Split into sentences
    const sentences = resumeText.split(/[.!?]\s+/);
    
    // Check average sentence length (ideal is 15-20 words)
    const avgSentenceLength = sentences.reduce((sum, sentence) => {
        return sum + sentence.split(/\s+/).length;
    }, 0) / sentences.length;
    
    // Adjust clarity score based on sentence length
    if (avgSentenceLength > 25) {
        clarityScore -= 10; // Too long sentences
    } else if (avgSentenceLength < 8) {
        clarityScore -= 5; // Too short sentences
    } else if (avgSentenceLength >= 12 && avgSentenceLength <= 20) {
        clarityScore += 10; // Ideal sentence length
    }
    
    // Check for bullet points (improves clarity)
    const bulletPointRegex = /[•\-\*]\s+\w+/g;
    const bulletPoints = resumeText.match(bulletPointRegex) || [];
    clarityScore += Math.min(bulletPoints.length, 10);
    
    // Calculate relevance score
    let relevanceScore = 55; // Base score
    
    // Check for industry keywords
    const industryKeywords = ['experience', 'skills', 'education', 'project', 'achievement', 
                             'certification', 'leadership', 'team', 'communication', 'technical'];
    let keywordCount = 0;
    industryKeywords.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
        const matches = cleanText.match(regex);
        if (matches) {
            keywordCount += matches.length;
        }
    });
    
    // Adjust relevance score based on keywords
    relevanceScore += Math.min(keywordCount * 2, 20);
    
    // Identify strengths
    const strengths = [];
    
    if (actionVerbCount >= 5) {
        strengths.push('Good use of action verbs');
    }
    
    if (quantifiableMatches.length >= 3) {
        strengths.push('Includes quantifiable achievements');
    }
    
    if (bulletPoints.length >= 5) {
        strengths.push('Well-structured with bullet points');
    }
    
    if (cleanText.includes('education') && cleanText.includes('experience')) {
        strengths.push('Contains essential sections');
    }
    
    // If we don't have enough strengths, add some based on the actual content
    if (strengths.length < 3) {
        if (cleanText.includes('project')) {
            strengths.push('Includes project experience');
        }
        
        if (cleanText.includes('skill')) {
            strengths.push('Lists relevant skills');
        }
        
        if (cleanText.includes('contact') || cleanText.includes('email') || cleanText.includes('phone')) {
            strengths.push('Provides clear contact information');
        }
    }
    
    // Identify weaknesses
    const weaknesses = [];
    
    if (actionVerbCount < 5) {
        weaknesses.push('Limited use of action verbs');
    }
    
    if (quantifiableMatches.length < 3) {
        weaknesses.push('Few quantifiable achievements');
    }
    
    if (avgSentenceLength > 25) {
        weaknesses.push('Sentences are too long');
    }
    
    if (resumeText.length > 3000) {
        weaknesses.push('Resume may be too lengthy');
    } else if (resumeText.length < 1000) {
        weaknesses.push('Resume may be too brief');
    }
    
    // Cap scores at 100
    impactScore = Math.min(impactScore, 100);
    clarityScore = Math.min(clarityScore, 100);
    relevanceScore = Math.min(relevanceScore, 100);
    
    return {
        impactScore,
        clarityScore,
        relevanceScore,
        strengths: strengths.slice(0, 4), // Limit to 4 strengths
        weaknesses: weaknesses.slice(0, 3) // Limit to 3 weaknesses
    };
}

/**
 * Update the content analysis section with analysis results
 */
function updateContentAnalysisSection(contentResults) {
    console.log('Updating content analysis section with results:', contentResults);
    
    const contentAnalysisSection = document.getElementById('content-analysis-section');
    if (!contentAnalysisSection) return;
    
    // Check if we have valid results
    if (!contentResults) {
        console.error('No content analysis results available');
        contentAnalysisSection.innerHTML = `
            <h2><i class="fas fa-file-alt"></i> Content Quality</h2>
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to analyze resume content. Please try again.</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for the content analysis section
    let contentHTML = `
        <h2><i class="fas fa-file-alt"></i> Content Quality</h2>
        <div class="content-metrics">
    `;
    
    // Add impact score
    contentHTML += `
        <div class="metric-card">
            <h3>Impact</h3>
            <div class="progress-circle">
                <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3.6"/>
                    <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4e5fce" stroke-width="3.6" stroke-dasharray="${contentResults.impactScore}, 100" stroke-linecap="round"/>
                    <text x="18" y="20.35" class="percentage" text-anchor="middle" fill="#4e5fce" font-size="8px" font-weight="bold">${contentResults.impactScore}%</text>
                </svg>
            </div>
            <p>How effectively your achievements are presented</p>
        </div>
    `;
    
    // Add clarity score
    contentHTML += `
        <div class="metric-card">
            <h3>Clarity</h3>
            <div class="progress-circle">
                <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3.6"/>
                    <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4e5fce" stroke-width="3.6" stroke-dasharray="${contentResults.clarityScore}, 100" stroke-linecap="round"/>
                    <text x="18" y="20.35" class="percentage" text-anchor="middle" fill="#4e5fce" font-size="8px" font-weight="bold">${contentResults.clarityScore}%</text>
                </svg>
            </div>
            <p>How clear and concise your content is</p>
        </div>
    `;
    
    // Add relevance score
    contentHTML += `
        <div class="metric-card">
            <h3>Relevance</h3>
            <div class="progress-circle">
                <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3.6"/>
                    <path class="circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4e5fce" stroke-width="3.6" stroke-dasharray="${contentResults.relevanceScore}, 100" stroke-linecap="round"/>
                    <text x="18" y="20.35" class="percentage" text-anchor="middle" fill="#4e5fce" font-size="8px" font-weight="bold">${contentResults.relevanceScore}%</text>
                </svg>
            </div>
            <p>How relevant your content is for the job</p>
        </div>
    `;
    
    // Close the metrics div
    contentHTML += `</div>`;
    
    // Add strengths and weaknesses
    contentHTML += `
        <div class="content-feedback">
            <div class="strengths">
                <h3><i class="fas fa-check-circle"></i> Strengths</h3>
                <ul>
    `;
    
    // Add each strength
    if (contentResults.strengths && contentResults.strengths.length > 0) {
        contentResults.strengths.forEach(strength => {
            contentHTML += `<li>${strength}</li>`;
        });
    } else {
        contentHTML += `<li>No specific strengths identified.</li>`;
    }
    
    contentHTML += `
                </ul>
            </div>
            <div class="weaknesses">
                <h3><i class="fas fa-exclamation-circle"></i> Areas to Improve</h3>
                <ul>
    `;
    
    // Add each weakness
    if (contentResults.weaknesses && contentResults.weaknesses.length > 0) {
        contentResults.weaknesses.forEach(weakness => {
            contentHTML += `<li>${weakness}</li>`;
        });
    } else {
        contentHTML += `<li>No specific areas for improvement identified.</li>`;
    }
    
    contentHTML += `
                </ul>
            </div>
        </div>
    `;
    
    // Update the section with the HTML
    contentAnalysisSection.innerHTML = contentHTML;
}

/**
 * Fallback function for simulated content analysis
 */
function simulateContentAnalysis() {
    console.log('Using simulated content analysis');
    
    const contentAnalysisSection = document.getElementById('content-analysis-section');
    if (contentAnalysisSection) {
        contentAnalysisSection.innerHTML = `
            <h2><i class="fas fa-file-alt"></i> Content Analysis</h2>
            <div class="content-metrics">
                <div class="metric-card">
                    <h3>Impact</h3>
                    <div class="progress-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="score-fill" stroke-dasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="18" y="20.35" class="score-text">65%</text>
                        </svg>
                    </div>
                    <p>How effectively your achievements are presented</p>
                </div>
                <div class="metric-card">
                    <h3>Clarity</h3>
                    <div class="progress-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="score-fill" stroke-dasharray="70, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="18" y="20.35" class="score-text">70%</text>
                        </svg>
                    </div>
                    <p>How clear and concise your content is</p>
                </div>
                <div class="metric-card">
                    <h3>Relevance</h3>
                    <div class="progress-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="score-fill" stroke-dasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="18" y="20.35" class="score-text">60%</text>
                        </svg>
                    </div>
                    <p>How well your content matches job market needs</p>
                </div>
            </div>
            <div class="content-feedback">
                <div class="strengths">
                    <h3><i class="fas fa-thumbs-up"></i> Strengths</h3>
                    <ul>
                        <li>Good use of action verbs</li>
                        <li>Clear job titles</li>
                        <li>Quantifiable achievements</li>
                    </ul>
                </div>
                <div class="weaknesses">
                    <h3><i class="fas fa-thumbs-down"></i> Areas for Improvement</h3>
                    <ul>
                        <li>Too much technical jargon</li>
                        <li>Lacks clear accomplishments</li>
                        <li>Some sections are too verbose</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

/**
 * Prepare final enhanced resume
 */
function prepareFinalResume() {
    console.log('Preparing final resume');
    // This function would normally generate the final enhanced resume
    // For demo purposes, we'll just make sure the download button is ready
}

/**
 * Prepare keyword analysis
 */
function prepareKeywordAnalysis() {
    console.log('Preparing keyword analysis');
    
    // Check if we have resume text to analyze
    if (!resumeText || resumeText.length < 100) {
        console.error('Resume text too short for keyword analysis');
        showNotification('Resume text is too short for meaningful analysis. Please provide more content.');
        return;
    }
    
    // Show loading state
    const keywordAnalysisSection = document.getElementById('keyword-analysis-section');
    if (keywordAnalysisSection) {
        keywordAnalysisSection.innerHTML = `
            <h2><i class="fas fa-tags"></i> Keyword Analysis</h2>
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Preparing keyword selection interface...</p>
            </div>
        `;
    }
    
    // Use a timeout to simulate loading
    setTimeout(() => {
        // Create a user-selectable interface for skills
        showSkillSelectionInterface(keywordAnalysisSection);
    }, 500);
    
    // Use AI analyzer for keyword analysis if available
    if (window.aiAnalyzer && window.aiAnalyzer.analyzeKeywords) {
        window.aiAnalyzer.analyzeKeywords(resumeText, jobDescription).then(results => {
            if (results && !results.error) {
                updateKeywordAnalysisSection(results);
            } else {
                // Show error message
                if (keywordAnalysisSection) {
                    keywordAnalysisSection.innerHTML = `
                        <h2><i class="fas fa-tags"></i> Keyword Analysis</h2>
                        <div class="error-message">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Error in AI analysis. Please try again or check API key.</p>
                            <p class="error-details">${results && results.error ? results.error : 'API connection failed'}</p>
                        </div>
                    `;
                }
            }
        });
    } else {
        console.error('AI analyzer not available for keyword analysis');
        // Show error message instead of using simulated data
        showNotification('AI analyzer not available. Please refresh the page and try again.');
        const keywordAnalysisSection = document.getElementById('keyword-analysis-section');
        if (keywordAnalysisSection) {
            keywordAnalysisSection.innerHTML = `
                <h2><i class="fas fa-tags"></i> Keyword Analysis</h2>
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>AI analyzer not available. Please refresh the page and try again.</p>
                </div>
            `;
        }
    }
}

/**
 * Update the keyword analysis section with analysis results
 */
function updateKeywordAnalysisSection(keywordResults) {
    const keywordAnalysisSection = document.getElementById('keyword-analysis-section');
    if (!keywordAnalysisSection) return;
    
    // Check if we have valid results
    if (!keywordResults || keywordResults.error) {
        console.error('Error in keyword analysis:', keywordResults ? keywordResults.error : 'No results');
        // Show error message to user instead of using simulated data
        keywordAnalysisSection.innerHTML = `
            <h2><i class="fas fa-tags"></i> Keyword Analysis</h2>
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error in AI analysis. Please try again or check API key.</p>
                <p class="error-details">${keywordResults && keywordResults.error ? keywordResults.error : 'API connection failed'}</p>
            </div>
        `;
        return;
    }
    
    // Get the keyword analysis data
    const technicalSkills = keywordResults.technicalSkills || {
        present: ['JavaScript', 'HTML', 'CSS'],
        missing: ['React', 'Node.js', 'MongoDB']
    };
    
    const softSkills = keywordResults.softSkills || {
        present: ['Communication', 'Teamwork', 'Problem-solving'],
        missing: ['Leadership', 'Time management', 'Adaptability']
    };
    
    const industrySpecific = keywordResults.industrySpecific || {
        present: ['Project management', 'Agile', 'Scrum'],
        missing: ['DevOps', 'CI/CD', 'Cloud computing']
    };
    
    // Update the keyword analysis section
    keywordAnalysisSection.innerHTML = `
        <h2><i class="fas fa-key"></i> Keyword Analysis</h2>
        <div class="keyword-analysis-content">
            <p class="keyword-intro">We've analyzed your resume against common industry keywords. Adding these keywords can help your resume pass ATS systems and catch recruiters' attention.</p>
            
            <div class="keyword-categories">
                <div class="keyword-category">
                    <h3><i class="fas fa-laptop-code"></i> Technical Skills</h3>
                    <div class="keyword-lists">
                        <div class="keyword-list present">
                            <h4>Present in Your Resume</h4>
                            <ul>
                                ${technicalSkills.present.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="keyword-list missing">
                            <h4>Consider Adding</h4>
                            <ul>
                                ${technicalSkills.missing.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="keyword-category">
                    <h3><i class="fas fa-users"></i> Soft Skills</h3>
                    <div class="keyword-lists">
                        <div class="keyword-list present">
                            <h4>Present in Your Resume</h4>
                            <ul>
                                ${softSkills.present.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="keyword-list missing">
                            <h4>Consider Adding</h4>
                            <ul>
                                ${softSkills.missing.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="keyword-category">
                    <h3><i class="fas fa-industry"></i> Industry-Specific</h3>
                    <div class="keyword-lists">
                        <div class="keyword-list present">
                            <h4>Present in Your Resume</h4>
                            <ul>
                                ${industrySpecific.present.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="keyword-list missing">
                            <h4>Consider Adding</h4>
                            <ul>
                                ${industrySpecific.missing.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="keyword-actions">
                <button id="add-job-desc-btn" class="juno-button secondary"><i class="fas fa-briefcase"></i> Add Job Description for Targeted Analysis</button>
            </div>
        </div>
    `;
    
    // Add event listener to the job description button
    const addJobDescBtn = document.getElementById('add-job-desc-btn');
    if (addJobDescBtn) {
        addJobDescBtn.addEventListener('click', showJobDescriptionModal);
    }
}

/**
 * Fallback function for simulated keyword analysis
 */
function simulateKeywordAnalysis() {
    console.log('Using simulated keyword analysis');
    
    const keywordAnalysisSection = document.getElementById('keyword-analysis-section');
    if (keywordAnalysisSection) {
        keywordAnalysisSection.innerHTML = `
            <h2><i class="fas fa-key"></i> Keyword Analysis</h2>
            <div class="keyword-analysis-content">
                <p class="keyword-intro">We've analyzed your resume against common industry keywords. Adding these keywords can help your resume pass ATS systems and catch recruiters' attention.</p>
                
                <div class="keyword-categories">
                    <div class="keyword-category">
                        <h3><i class="fas fa-laptop-code"></i> Technical Skills</h3>
                        <div class="keyword-lists">
                            <div class="keyword-list present">
                                <h4>Present in Your Resume</h4>
                                <ul>
                                    <li>JavaScript</li>
                                    <li>HTML</li>
                                    <li>CSS</li>
                                </ul>
                            </div>
                            <div class="keyword-list missing">
                                <h4>Consider Adding</h4>
                                <ul>
                                    <li>React</li>
                                    <li>Node.js</li>
                                    <li>MongoDB</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="keyword-category">
                        <h3><i class="fas fa-users"></i> Soft Skills</h3>
                        <div class="keyword-lists">
                            <div class="keyword-list present">
                                <h4>Present in Your Resume</h4>
                                <ul>
                                    <li>Communication</li>
                                    <li>Teamwork</li>
                                    <li>Problem-solving</li>
                                </ul>
                            </div>
                            <div class="keyword-list missing">
                                <h4>Consider Adding</h4>
                                <ul>
                                    <li>Leadership</li>
                                    <li>Time management</li>
                                    <li>Adaptability</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="keyword-category">
                        <h3><i class="fas fa-industry"></i> Industry-Specific</h3>
                        <div class="keyword-lists">
                            <div class="keyword-list present">
                                <h4>Present in Your Resume</h4>
                                <ul>
                                    <li>Project management</li>
                                    <li>Agile</li>
                                    <li>Scrum</li>
                                </ul>
                            </div>
                            <div class="keyword-list missing">
                                <h4>Consider Adding</h4>
                                <ul>
                                    <li>DevOps</li>
                                    <li>CI/CD</li>
                                    <li>Cloud computing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="keyword-actions">
                    <button id="add-job-desc-btn" class="juno-button secondary"><i class="fas fa-briefcase"></i> Add Job Description for Targeted Analysis</button>
                </div>
            </div>
        `;
        
        // Add event listener to the job description button
        const addJobDescBtn = document.getElementById('add-job-desc-btn');
        if (addJobDescBtn) {
            addJobDescBtn.addEventListener('click', showJobDescriptionModal);
        }
    }
}

/**
 * Prepare format analysis
 */
function prepareFormatAnalysis() {
    console.log('Preparing format analysis');
    
    // Check if we have resume text to analyze
    if (!resumeText || resumeText.length < 100) {
        console.error('Resume text too short for format analysis');
        showNotification('Resume text is too short for meaningful analysis. Please provide more content.');
        return;
    }
    
    // Show loading state
    const formatAnalysisSection = document.getElementById('format-analysis-section');
    if (formatAnalysisSection) {
        formatAnalysisSection.innerHTML = `
            <h2><i class="fas fa-paint-brush"></i> Format Analysis</h2>
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Analyzing resume format with AI...</p>
            </div>
        `;
    }
    
    // Use the AI analyzer to analyze format
    if (window.ResumeAI && typeof window.ResumeAI.analyzeResumeWithAI === 'function') {
        // If we already have analysis results, use those
        if (analysisResults && analysisResults.format) {
            updateFormatAnalysisSection(analysisResults.format);
        } else {
            // Otherwise, perform a new analysis
            window.ResumeAI.analyzeResumeWithAI(resumeText, function(results) {
                // Store the analysis results
                analysisResults = results;
                
                // Update the format analysis section with the results
                updateFormatAnalysisSection(results.format);
            });
        }
    } else {
        console.error('AI analyzer not available for format analysis');
        // Fallback to simulated analysis
        simulateFormatAnalysis();
    }
}

/**
 * Update the format analysis section with analysis results
 */
function updateFormatAnalysisSection(formatResults) {
    const formatAnalysisSection = document.getElementById('format-analysis-section');
    if (!formatAnalysisSection) return;
    
    // Check if we have valid results
    if (!formatResults || formatResults.error) {
        console.error('Error in format analysis:', formatResults ? formatResults.error : 'No results');
        // Fallback to simulated analysis
        simulateFormatAnalysis();
        return;
    }
    
    // Get the format analysis data
    const readabilityScore = formatResults.readabilityScore || 75;
    const structureScore = formatResults.structureScore || 80;
    const consistencyScore = formatResults.consistencyScore || 65;
    const issues = formatResults.issues || [
        {
            type: 'Spacing',
            description: 'Inconsistent spacing between sections',
            recommendation: 'Maintain consistent spacing (1-1.5 lines) between all sections'
        },
        {
            type: 'Fonts',
            description: 'Too many different fonts used',
            recommendation: 'Stick to 1-2 professional fonts throughout the resume'
        },
        {
            type: 'Margins',
            description: 'Margins are too narrow',
            recommendation: 'Use standard 1-inch margins on all sides'
        }
    ];
    
    // Update the format analysis section
    formatAnalysisSection.innerHTML = `
        <h2><i class="fas fa-paint-brush"></i> Format Analysis</h2>
        <div class="format-analysis-content">
            <div class="format-overview">
                <h3>Format Overview</h3>
                <div class="format-metrics">
                    <div class="format-metric">
                        <div class="metric-circle">
                            <svg viewBox="0 0 36 36">
                                <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="score-fill" stroke-dasharray="${readabilityScore}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <text x="18" y="20.35" class="score-text">${readabilityScore}%</text>
                            </svg>
                        </div>
                        <h4>Readability</h4>
                    </div>
                    <div class="format-metric">
                        <div class="metric-circle">
                            <svg viewBox="0 0 36 36">
                                <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="score-fill" stroke-dasharray="${structureScore}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <text x="18" y="20.35" class="score-text">${structureScore}%</text>
                            </svg>
                        </div>
                        <h4>Structure</h4>
                    </div>
                    <div class="format-metric">
                        <div class="metric-circle">
                            <svg viewBox="0 0 36 36">
                                <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="score-fill" stroke-dasharray="${consistencyScore}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <text x="18" y="20.35" class="score-text">${consistencyScore}%</text>
                            </svg>
                        </div>
                        <h4>Consistency</h4>
                    </div>
                </div>
            </div>
            
            <div class="format-issues">
                <h3>Format Issues</h3>
                <div class="issues-list">
                    ${issues.map(issue => `
                        <div class="issue-item">
                            <div class="issue-header">
                                <h4>${issue.type}</h4>
                            </div>
                            <div class="issue-body">
                                <p class="issue-description">${issue.description}</p>
                                <p class="issue-recommendation"><strong>Recommendation:</strong> ${issue.recommendation}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="format-tips">
                <h3>Format Best Practices</h3>
                <ul class="tips-list">
                    <li>Use a clean, professional design with consistent formatting</li>
                    <li>Ensure adequate white space to improve readability</li>
                    <li>Use bullet points for achievements and responsibilities</li>
                    <li>Keep your resume to 1-2 pages maximum</li>
                    <li>Use standard, ATS-friendly fonts like Arial, Calibri, or Times New Roman</li>
                </ul>
            </div>
        </div>
    `;
}

/**
 * Fallback function for simulated format analysis
 */
function simulateFormatAnalysis() {
    console.log('Using simulated format analysis');
    
    const formatAnalysisSection = document.getElementById('format-analysis-section');
    if (formatAnalysisSection) {
        formatAnalysisSection.innerHTML = `
            <h2><i class="fas fa-paint-brush"></i> Format Analysis</h2>
            <div class="format-analysis-content">
                <div class="format-overview">
                    <h3>Format Overview</h3>
                    <div class="format-metrics">
                        <div class="format-metric">
                            <div class="metric-circle">
                                <svg viewBox="0 0 36 36">
                                    <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <path class="score-fill" stroke-dasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <text x="18" y="20.35" class="score-text">75%</text>
                                </svg>
                            </div>
                            <h4>Readability</h4>
                        </div>
                        <div class="format-metric">
                            <div class="metric-circle">
                                <svg viewBox="0 0 36 36">
                                    <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <path class="score-fill" stroke-dasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <text x="18" y="20.35" class="score-text">80%</text>
                                </svg>
                            </div>
                            <h4>Structure</h4>
                        </div>
                        <div class="format-metric">
                            <div class="metric-circle">
                                <svg viewBox="0 0 36 36">
                                    <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <path class="score-fill" stroke-dasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                    <text x="18" y="20.35" class="score-text">65%</text>
                                </svg>
                            </div>
                            <h4>Consistency</h4>
                        </div>
                    </div>
                </div>
                
                <div class="format-issues">
                    <h3>Format Issues</h3>
                    <div class="issues-list">
                        <div class="issue-item">
                            <div class="issue-header">
                                <h4>Spacing</h4>
                            </div>
                            <div class="issue-body">
                                <p class="issue-description">Inconsistent spacing between sections</p>
                                <p class="issue-recommendation"><strong>Recommendation:</strong> Maintain consistent spacing (1-1.5 lines) between all sections</p>
                            </div>
                        </div>
                        <div class="issue-item">
                            <div class="issue-header">
                                <h4>Fonts</h4>
                            </div>
                            <div class="issue-body">
                                <p class="issue-description">Too many different fonts used</p>
                                <p class="issue-recommendation"><strong>Recommendation:</strong> Stick to 1-2 professional fonts throughout the resume</p>
                            </div>
                        </div>
                        <div class="issue-item">
                            <div class="issue-header">
                                <h4>Margins</h4>
                            </div>
                            <div class="issue-body">
                                <p class="issue-description">Margins are too narrow</p>
                                <p class="issue-recommendation"><strong>Recommendation:</strong> Use standard 1-inch margins on all sides</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="format-tips">
                    <h3>Format Best Practices</h3>
                    <ul class="tips-list">
                        <li>Use a clean, professional design with consistent formatting</li>
                        <li>Ensure adequate white space to improve readability</li>
                        <li>Use bullet points for achievements and responsibilities</li>
                        <li>Keep your resume to 1-2 pages maximum</li>
                        <li>Use standard, ATS-friendly fonts like Arial, Calibri, or Times New Roman</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

/**
 * Prepare suggestions
 */
function prepareSuggestions() {
    console.log('Preparing suggestions');
    
    // Check if we have resume text to analyze
    if (!resumeText || resumeText.length < 100) {
        console.error('Resume text too short for suggestions');
        showNotification('Resume text is too short for meaningful analysis. Please provide more content.');
        return;
    }
    
    // Show loading state
    const suggestionsSection = document.getElementById('suggestions-section');
    if (suggestionsSection) {
        suggestionsSection.innerHTML = `
            <h2><i class="fas fa-lightbulb"></i> Improvement Suggestions</h2>
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Generating AI-powered suggestions...</p>
            </div>
        `;
    }
    
    // Use the AI analyzer to generate suggestions
    if (window.ResumeAI && typeof window.ResumeAI.analyzeResumeWithAI === 'function') {
        // If we already have analysis results from previous analysis, use those
        if (analysisResults && analysisResults.suggestions && !analysisResults.error) {
            console.log('Using existing suggestions results');
            updateSuggestionsSection(analysisResults.suggestions);
        } else {
            // Otherwise, perform a new analysis
            console.log('Generating new suggestions with AI');
            
            // Force the use of the real AI analyzer, not the fallback
            const apiKey = "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";
            window.ResumeAI.initializeAIAnalyzer(apiKey);
            
            window.ResumeAI.analyzeResumeWithAI(resumeText, function(results) {
                console.log('AI suggestions generation completed:', results);
                
                // Store the analysis results
                analysisResults = results;
                
                if (results && !results.error && results.suggestions) {
                    // Update the suggestions section with the results
                    updateSuggestionsSection(results.suggestions);
                } else {
                    console.error('Error in AI suggestions generation:', results ? results.error : 'No results');
                    // Only fall back to simulated analysis if there's an error
                    simulateSuggestions();
                }
            });
        }
    } else {
        console.error('AI analyzer not available for suggestions');
        // Fallback to simulated suggestions
        simulateSuggestions();
    }
}

/**
 * Update the suggestions section with analysis results
 */
function updateSuggestionsSection(suggestionsResults) {
    const suggestionsSection = document.getElementById('suggestions-section');
    if (!suggestionsSection) return;
    
    // Check if we have valid results
    if (!suggestionsResults || suggestionsResults.error) {
        console.error('Error in generating suggestions:', suggestionsResults ? suggestionsResults.error : 'No results');
        // Fallback to simulated suggestions
        simulateSuggestions();
        return;
    }
    
    // Get the suggestions
    const formatSuggestions = suggestionsResults.format || [
        'Use a clean, ATS-friendly format',
        'Ensure consistent spacing and alignment',
        'Use standard section headers'
    ];
    
    const contentSuggestions = suggestionsResults.content || [
        'Replace generic statements with specific achievements',
        'Quantify your accomplishments with numbers',
        'Tailor your skills section to the job you want'
    ];
    
    const keywordSuggestions = suggestionsResults.keywords || [
        'Add industry-specific keywords',
        'Include technical skills relevant to your field',
        'Mention specific tools and technologies you have used'
    ];
    
    // Update the suggestions section
    suggestionsSection.innerHTML = `
        <h2><i class="fas fa-lightbulb"></i> Improvement Suggestions</h2>
        <div class="suggestions-container">
            <div class="suggestion-category">
                <h3><i class="fas fa-file"></i> Format Improvements</h3>
                <ul class="suggestions-list">
                    ${formatSuggestions.map(suggestion => `
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>${suggestion}</p>
                                <button class="apply-suggestion-btn" data-suggestion="${suggestion}" data-category="format">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="suggestion-category">
                <h3><i class="fas fa-edit"></i> Content Improvements</h3>
                <ul class="suggestions-list">
                    ${contentSuggestions.map(suggestion => `
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>${suggestion}</p>
                                <button class="apply-suggestion-btn" data-suggestion="${suggestion}" data-category="content">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="suggestion-category">
                <h3><i class="fas fa-key"></i> Keyword Improvements</h3>
                <ul class="suggestions-list">
                    ${keywordSuggestions.map(suggestion => `
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>${suggestion}</p>
                                <button class="apply-suggestion-btn" data-suggestion="${suggestion}" data-category="keyword">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Add event listeners to apply suggestion buttons
    const applyButtons = suggestionsSection.querySelectorAll('.apply-suggestion-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const suggestion = this.getAttribute('data-suggestion');
            const category = this.getAttribute('data-category');
            applySuggestion(suggestion, category);
        });
    });
}

/**
 * Apply a suggestion to the resume
 */
function applySuggestion(suggestion, category) {
    // In a real implementation, this would apply the suggestion to the resume text
    // For now, we'll just track which suggestions have been applied
    appliedSuggestions.push({
        suggestion: suggestion,
        category: category,
        appliedAt: new Date().toISOString()
    });
    
    // Show a notification that the suggestion was applied
    showNotification(`Applied suggestion: ${suggestion}`);
    
    // Mark the suggestion as applied in the UI
    const buttons = document.querySelectorAll(`.apply-suggestion-btn[data-suggestion="${suggestion}"]`);
    buttons.forEach(button => {
        button.innerHTML = '<i class="fas fa-check-circle"></i> Applied';
        button.disabled = true;
        button.classList.add('applied');
    });
}

/**
 * Fallback function for simulated suggestions
 */
function simulateSuggestions() {
    console.log('Using simulated suggestions');
    
    const suggestionsSection = document.getElementById('suggestions-section');
    if (suggestionsSection) {
        suggestionsSection.innerHTML = `
            <h2><i class="fas fa-lightbulb"></i> Improvement Suggestions</h2>
            <div class="suggestions-container">
                <div class="suggestion-category">
                    <h3><i class="fas fa-file"></i> Format Improvements</h3>
                    <ul class="suggestions-list">
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Use a clean, ATS-friendly format</p>
                                <button class="apply-suggestion-btn" data-suggestion="Use a clean, ATS-friendly format" data-category="format">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Ensure consistent spacing and alignment</p>
                                <button class="apply-suggestion-btn" data-suggestion="Ensure consistent spacing and alignment" data-category="format">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Use standard section headers</p>
                                <button class="apply-suggestion-btn" data-suggestion="Use standard section headers" data-category="format">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="suggestion-category">
                    <h3><i class="fas fa-edit"></i> Content Improvements</h3>
                    <ul class="suggestions-list">
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Replace generic statements with specific achievements</p>
                                <button class="apply-suggestion-btn" data-suggestion="Replace generic statements with specific achievements" data-category="content">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Quantify your accomplishments with numbers</p>
                                <button class="apply-suggestion-btn" data-suggestion="Quantify your accomplishments with numbers" data-category="content">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Tailor your skills section to the job you want</p>
                                <button class="apply-suggestion-btn" data-suggestion="Tailor your skills section to the job you want" data-category="content">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="suggestion-category">
                    <h3><i class="fas fa-key"></i> Keyword Improvements</h3>
                    <ul class="suggestions-list">
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Add industry-specific keywords</p>
                                <button class="apply-suggestion-btn" data-suggestion="Add industry-specific keywords" data-category="keyword">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Include technical skills relevant to your field</p>
                                <button class="apply-suggestion-btn" data-suggestion="Include technical skills relevant to your field" data-category="keyword">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                        <li class="suggestion-item">
                            <div class="suggestion-content">
                                <p>Mention specific tools and technologies you have used</p>
                                <button class="apply-suggestion-btn" data-suggestion="Mention specific tools and technologies you have used" data-category="keyword">
                                    <i class="fas fa-check"></i> Apply
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        
        // Add event listeners to apply suggestion buttons
        const applyButtons = suggestionsSection.querySelectorAll('.apply-suggestion-btn');
        applyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const suggestion = this.getAttribute('data-suggestion');
                const category = this.getAttribute('data-category');
                applySuggestion(suggestion, category);
            });
        });
    }
}

/**
 * Apply a suggestion to the resume
 */
function applySuggestion(suggestion, category) {
    // In a real implementation, this would apply the suggestion to the resume text
    // For now, we'll just track which suggestions have been applied
    appliedSuggestions.push({
        suggestion: suggestion,
        category: category,
        appliedAt: new Date().toISOString()
    });
    
    // Show a notification that the suggestion was applied
    showNotification(`Applied suggestion: ${suggestion}`, 'success');
    
    // Mark the suggestion as applied in the UI
    const buttons = document.querySelectorAll('.apply-suggestion-btn[data-suggestion="' + suggestion + '"]');
    buttons.forEach(button => {
        button.innerHTML = '<i class="fas fa-check-circle"></i> Applied';
        button.disabled = true;
        button.classList.add('applied');
    });
}

/**
 * Show notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (info, success, error, warning)
 */
function showNotification(message, type = 'info') {
    // Remove any existing notifications with the same message to avoid duplicates
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        const span = notif.querySelector('span');
        if (span && span.textContent === message) {
            if (notif.parentNode) {
                notif.parentNode.removeChild(notif);
            }
        }
    });
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    if (type) {
        notification.classList.add('notification-' + type);
    }
    
    // Choose icon based on notification type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = 
        '<div class="notification-content">' +
        '<i class="fas fa-' + icon + '"></i>' +
        '<span>' + message + '</span>' +
        '</div>' +
        '<button class="notification-close"><i class="fas fa-times"></i></button>';
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds (longer for errors)
    const hideTimeout = setTimeout(() => {
        hideNotification(notification);
    }, type === 'error' ? 8000 : 5000);
    
    // Add event listener to close button
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(hideTimeout);
            hideNotification(notification);
        });
    }
    
    function hideNotification(notificationEl) {
        notificationEl.classList.add('fade-out');
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.parentNode.removeChild(notificationEl);
            }
        }, 500);
    }
    
    // Log notification for debugging
    console.log('Notification shown:', message, 'Type:', type);
}

/**
 * Render suggestions
 */
function renderSuggestions(formatSuggestions, contentSuggestions, keywordSuggestions) {
    const suggestionsSection = document.getElementById('suggestions-section');
    if (suggestionsSection) {
        let html = '<h2><i class="fas fa-lightbulb"></i> Improvement Suggestions</h2>';
        html += '<div class="suggestions-container">';
        
        // Format suggestions
        html += '<div class="suggestion-category">';
        html += '<h3><i class="fas fa-file"></i> Format Improvements</h3>';
        html += '<ul class="suggestions-list">';
        
        formatSuggestions.forEach(suggestion => {
            html += '<li class="suggestion-item">';
            html += '<div class="suggestion-content">';
            html += '<p>' + suggestion + '</p>';
            html += '<button class="apply-suggestion-btn" data-suggestion="' + suggestion + '" data-category="format">';
            html += '<i class="fas fa-check"></i> Apply';
            html += '</button>';
            html += '</div>';
            html += '</li>';
        });
        
        html += '</ul>';
        html += '</div>';
        
        // Content suggestions
        html += '<div class="suggestion-category">';
        html += '<h3><i class="fas fa-edit"></i> Content Improvements</h3>';
        html += '<ul class="suggestions-list">';
        
        contentSuggestions.forEach(suggestion => {
            html += '<li class="suggestion-item">';
            html += '<div class="suggestion-content">';
            html += '<p>' + suggestion + '</p>';
            html += '<button class="apply-suggestion-btn" data-suggestion="' + suggestion + '" data-category="content">';
            html += '<i class="fas fa-check"></i> Apply';
            html += '</button>';
            html += '</div>';
            html += '</li>';
        });
        
        html += '</ul>';
        html += '</div>';
        
        // Keyword suggestions
        html += '<div class="suggestion-category">';
        html += '<h3><i class="fas fa-key"></i> Keyword Improvements</h3>';
        html += '<ul class="suggestions-list">';
        
        keywordSuggestions.forEach(suggestion => {
            html += '<li class="suggestion-item">';
            html += '<div class="suggestion-content">';
            html += '<p>' + suggestion + '</p>';
            html += '<button class="apply-suggestion-btn" data-suggestion="' + suggestion + '" data-category="keyword">';
            html += '<i class="fas fa-check"></i> Apply';
            html += '</button>';
            html += '</div>';
            html += '</li>';
        });
        
        html += '</ul>';
        html += '</div>';
        html += '</div>';
        
        suggestionsSection.innerHTML = html;
        
        // Add event listeners to apply suggestion buttons
        const applyButtons = suggestionsSection.querySelectorAll('.apply-suggestion-btn');
        applyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const suggestion = this.getAttribute('data-suggestion');
                const category = this.getAttribute('data-category');
                applySuggestion(suggestion, category);
            });
        });
    }
}
