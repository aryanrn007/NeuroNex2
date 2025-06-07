/**
 * Scholarship API Integration
 * This file handles fetching and displaying scholarship data dynamically
 * using the OpenRouter API.
 */

// API Configuration
const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Store scholarship data
let scholarshipData = [];
let isLoading = false;

// DOM Elements
let scholarshipContainer;
let loadingIndicator;
let noResultsMessage;
let filterButtons;
let stateFilter;
let searchInput;

// Initialize the scholarship system
function initScholarshipSystem() {
    console.log("Initializing scholarship system...");
    
    // Get DOM elements
    scholarshipContainer = document.getElementById('scholarship-list');
    loadingIndicator = document.getElementById('loading-indicator');
    noResultsMessage = document.getElementById('no-results');
    filterButtons = document.querySelectorAll('.filter-btn');
    stateFilter = document.getElementById('state-filter');
    searchInput = document.getElementById('scholarship-search');
    
    // Add event listeners for filters
    setupFilterListeners();
    
    // Fetch scholarship data
    fetchScholarshipData();
}

// Setup filter event listeners
function setupFilterListeners() {
    // Category and education filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = Array.from(this.parentNode.children);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply filters
            applyFilters();
        });
    });
    
    // State filter
    stateFilter.addEventListener('change', applyFilters);
    
    // Search input
    searchInput.addEventListener('input', applyFilters);
    
    // Search button
    document.getElementById('search-btn').addEventListener('click', applyFilters);
    
    // Reset button
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

// Reset all filters
function resetFilters() {
    // Reset category and education filters
    document.querySelectorAll('.filter-buttons').forEach(group => {
        const buttons = Array.from(group.children);
        buttons.forEach(button => button.classList.remove('active'));
        buttons[0].classList.add('active'); // Set 'All' button as active
    });
    
    // Reset state filter
    stateFilter.value = 'all';
    
    // Reset search input
    searchInput.value = '';
    
    // Apply filters
    applyFilters();
}

// Apply filters to scholarship data
function applyFilters() {
    // Get active category filter
    const activeCategoryBtn = document.querySelector('.filter-buttons:nth-child(1) .filter-btn.active');
    const categoryFilter = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-filter') : 'all';
    
    // Get active education filter
    const activeEducationBtn = document.querySelector('.filter-buttons:nth-child(2) .filter-btn.active');
    const educationFilter = activeEducationBtn ? activeEducationBtn.getAttribute('data-filter') : 'all';
    
    // Get state filter
    const stateFilterValue = stateFilter.value;
    
    // Get search query
    const searchQuery = searchInput.value.toLowerCase().trim();
    
    // Filter scholarships
    const filteredScholarships = scholarshipData.filter(scholarship => {
        // Check if scholarship matches category filter
        const matchesCategory = categoryFilter === 'all' || 
            scholarship.categories.includes(categoryFilter);
        
        // Check if scholarship matches education filter
        const matchesEducation = educationFilter === 'all' || 
            scholarship.educationLevels.includes(educationFilter);
        
        // Check if scholarship matches state filter
        const matchesState = stateFilterValue === 'all' || 
            scholarship.state === stateFilterValue || 
            scholarship.level === 'National';
        
        // Check if scholarship matches search query
        const matchesSearch = searchQuery === '' || 
            scholarship.name.toLowerCase().includes(searchQuery) || 
            scholarship.description.toLowerCase().includes(searchQuery);
        
        // Return true if scholarship matches all filters
        return matchesCategory && matchesEducation && matchesState && matchesSearch;
    });
    
    // Render filtered scholarships
    renderScholarships(filteredScholarships);
}

// Render scholarships to the DOM
function renderScholarships(scholarships) {
    // Clear scholarship container
    scholarshipContainer.innerHTML = '';
    
    // Show no results message if no scholarships match filters
    if (scholarships.length === 0) {
        noResultsMessage.style.display = 'block';
        return;
    }
    
    // Hide no results message
    noResultsMessage.style.display = 'none';
    
    // Render each scholarship
    scholarships.forEach(scholarship => {
        // Create scholarship item
        const scholarshipItem = document.createElement('div');
        scholarshipItem.className = 'scholarship-item';
        scholarshipItem.setAttribute('data-category', scholarship.categories.join(','));
        scholarshipItem.setAttribute('data-education', scholarship.educationLevels.join(','));
        scholarshipItem.setAttribute('data-state', scholarship.state);
        
        // Create scholarship header
        const header = document.createElement('div');
        header.className = 'scholarship-header-item';
        
        // Create scholarship name
        const name = document.createElement('h3');
        name.className = 'scholarship-name';
        name.textContent = scholarship.name;
        
        // Create scholarship badge
        const badge = document.createElement('span');
        badge.className = `badge ${scholarship.level.toLowerCase()}-badge`;
        badge.textContent = scholarship.level;
        
        // Add name and badge to header
        header.appendChild(name);
        header.appendChild(badge);
        
        // Create scholarship details container
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'scholarship-details-container';
        
        // Create scholarship details
        const details = document.createElement('div');
        details.className = 'scholarship-details';
        
        // Add category tags
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-tags';
        
        scholarship.categories.forEach(category => {
            const categoryTag = document.createElement('span');
            categoryTag.className = `category-tag ${category.toLowerCase()}`;
            categoryTag.textContent = category;
            categoryContainer.appendChild(categoryTag);
        });
        
        // Add education level
        const educationLevel = document.createElement('p');
        educationLevel.innerHTML = `<strong>Education Level:</strong> ${scholarship.educationLevels.join(', ')}`;
        
        // Add amount
        const amount = document.createElement('p');
        amount.className = 'scholarship-amount';
        amount.innerHTML = `<strong>Amount:</strong> <span>₹${scholarship.amount}</span>`;
        
        // Add deadline
        const deadline = document.createElement('p');
        deadline.innerHTML = `<strong>Deadline:</strong> ${scholarship.deadline}`;
        
        // Add details to details container
        details.appendChild(categoryContainer);
        details.appendChild(educationLevel);
        details.appendChild(amount);
        details.appendChild(deadline);
        
        // Create documents list
        const documents = document.createElement('div');
        documents.className = 'required-documents';
        
        // Add documents title
        const documentsTitle = document.createElement('h4');
        documentsTitle.textContent = 'Required Documents:';
        documents.appendChild(documentsTitle);
        
        // Add documents list
        const documentsList = document.createElement('ul');
        scholarship.requiredDocuments.forEach(document => {
            const documentItem = document.createElement('li');
            documentItem.textContent = document;
            documentsList.appendChild(documentItem);
        });
        
        documents.appendChild(documentsList);
        
        // Add details and documents to details container
        detailsContainer.appendChild(details);
        detailsContainer.appendChild(documents);
        
        // Create eligibility section
        const eligibility = document.createElement('div');
        eligibility.className = 'eligibility-criteria';
        
        // Add eligibility title
        const eligibilityTitle = document.createElement('h4');
        eligibilityTitle.textContent = 'Eligibility Criteria:';
        eligibility.appendChild(eligibilityTitle);
        
        // Add eligibility description
        const eligibilityDesc = document.createElement('p');
        eligibilityDesc.textContent = scholarship.eligibility;
        eligibility.appendChild(eligibilityDesc);
        
        // Create apply button
        const applyBtn = document.createElement('a');
        applyBtn.className = 'apply-btn';
        applyBtn.href = scholarship.applicationLink || '#';
        applyBtn.target = '_blank';
        applyBtn.textContent = 'Apply Now';
        
        // Add event listener to apply button
        applyBtn.addEventListener('click', function(e) {
            if (applyBtn.href === '#') {
                e.preventDefault();
                alert('Application portal will be available soon.');
            } else {
                alert('You will be redirected to the official scholarship application portal.');
            }
        });
        
        // Add all elements to scholarship item
        scholarshipItem.appendChild(header);
        scholarshipItem.appendChild(detailsContainer);
        scholarshipItem.appendChild(eligibility);
        scholarshipItem.appendChild(applyBtn);
        
        // Add scholarship item to container
        scholarshipContainer.appendChild(scholarshipItem);
    });
}

// Fetch scholarship data from OpenRouter API
async function fetchScholarshipData() {
    try {
        // Show loading indicator
        isLoading = true;
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        
        // Prepare the prompt for the API
        const prompt = `
            Generate a comprehensive JSON array of Indian government scholarships with the following structure:
            [
              {
                "name": "Scholarship Name",
                "categories": ["SC", "ST", "OBC", "EWS", "General"],
                "educationLevels": ["10th", "12th", "Diploma", "UG", "PG"],
                "amount": "Amount in rupees",
                "deadline": "Application deadline",
                "applicationLink": "URL to application portal",
                "eligibility": "Detailed eligibility criteria",
                "level": "National or State",
                "state": "State name if state level, empty if national",
                "requiredDocuments": ["Document 1", "Document 2", "..."],
                "description": "Brief description of the scholarship"
              }
            ]
            
            Include at least 15 real Indian government scholarships with accurate details. Include scholarships for different castes (SC, ST, OBC, EWS) and education levels. Make sure to include both national and state-level scholarships.
        `;
        
        // Make API request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "anthropic/claude-3-opus",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        // Parse response
        const data = await response.json();
        
        // Extract scholarship data from response
        const content = data.choices[0].message.content;
        
        // Find JSON in the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
            // Parse JSON
            scholarshipData = JSON.parse(jsonMatch[0]);
            
            // Apply filters to render scholarships
            applyFilters();
        } else {
            // If no JSON found, use fallback data
            console.error("No JSON found in API response, using fallback data");
            scholarshipData = getFallbackScholarshipData();
            applyFilters();
        }
    } catch (error) {
        console.error("Error fetching scholarship data:", error);
        // Use fallback data in case of error
        scholarshipData = getFallbackScholarshipData();
        applyFilters();
    } finally {
        // Hide loading indicator
        isLoading = false;
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

// Fallback scholarship data in case API fails
function getFallbackScholarshipData() {
    return [
        {
            name: "Post-Matric Scholarship for SC Students",
            categories: ["SC"],
            educationLevels: ["12th", "UG", "PG"],
            amount: "230 to 1,200 per month",
            deadline: "October 31, 2025",
            applicationLink: "https://scholarships.gov.in",
            eligibility: "SC students with family income less than ₹2.5 lakh per annum, pursuing post-matriculation studies.",
            level: "National",
            state: "",
            requiredDocuments: ["Caste Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook", "Previous Marksheet"],
            description: "Financial assistance to SC students for pursuing post-matriculation education"
        },
        {
            name: "Post-Matric Scholarship for ST Students",
            categories: ["ST"],
            educationLevels: ["12th", "UG", "PG"],
            amount: "230 to 1,200 per month",
            deadline: "November 30, 2025",
            applicationLink: "https://scholarships.gov.in",
            eligibility: "ST students with family income less than ₹2.5 lakh per annum, pursuing post-matriculation studies.",
            level: "National",
            state: "",
            requiredDocuments: ["Tribe Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook", "Previous Marksheet"],
            description: "Financial assistance to ST students for pursuing post-matriculation education"
        },
        {
            name: "Pre-Matric Scholarship for OBC Students",
            categories: ["OBC"],
            educationLevels: ["10th"],
            amount: "100 per month",
            deadline: "September 30, 2025",
            applicationLink: "https://scholarships.gov.in",
            eligibility: "OBC students with family income less than ₹2.5 lakh per annum, studying in classes 9-10.",
            level: "National",
            state: "",
            requiredDocuments: ["OBC Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook", "Previous Marksheet"],
            description: "Financial assistance to OBC students for pre-matric education"
        },
        {
            name: "Central Sector Scheme of Scholarship for College and University Students",
            categories: ["SC", "ST", "OBC", "EWS", "General"],
            educationLevels: ["UG", "PG"],
            amount: "12,000 per annum",
            deadline: "December 31, 2025",
            applicationLink: "https://scholarships.gov.in",
            eligibility: "Students who are above 80th percentile in their 12th standard and pursuing higher education.",
            level: "National",
            state: "",
            requiredDocuments: ["12th Marksheet", "Income Certificate", "Aadhaar Card", "Bank Passbook", "College ID Card"],
            description: "Merit-based scholarship for top performing students in higher education"
        },
        {
            name: "National Scholarship Portal (NSP) Scheme",
            categories: ["SC", "ST", "OBC", "EWS"],
            educationLevels: ["10th", "12th", "UG", "PG"],
            amount: "5,000 to 20,000 per annum",
            deadline: "October 15, 2025",
            applicationLink: "https://scholarships.gov.in",
            eligibility: "Students from marginalized communities with family income less than ₹2.5 lakh per annum.",
            level: "National",
            state: "",
            requiredDocuments: ["Caste/Category Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook", "Previous Marksheet"],
            description: "Comprehensive scholarship scheme for students from marginalized communities"
        },
        {
            name: "Maharashtra State Scholarship for EWS Students",
            categories: ["EWS"],
            educationLevels: ["UG"],
            amount: "10,000 per annum",
            deadline: "September 15, 2025",
            applicationLink: "https://mahadbt.maharashtra.gov.in",
            eligibility: "EWS students from Maharashtra with family income less than ₹8 lakh per annum.",
            level: "State",
            state: "Maharashtra",
            requiredDocuments: ["EWS Certificate", "Income Certificate", "Domicile Certificate", "Aadhaar Card", "Bank Passbook"],
            description: "State scholarship for economically weaker section students in Maharashtra"
        },
        {
            name: "Karnataka Minorities Scholarship",
            categories: ["OBC"],
            educationLevels: ["UG", "PG"],
            amount: "15,000 per annum",
            deadline: "November 15, 2025",
            applicationLink: "https://sw.kar.nic.in",
            eligibility: "Minority students from Karnataka with family income less than ₹2 lakh per annum.",
            level: "State",
            state: "Karnataka",
            requiredDocuments: ["Minority Certificate", "Income Certificate", "Domicile Certificate", "Aadhaar Card", "Bank Passbook"],
            description: "Scholarship for minority students in Karnataka"
        },
        {
            name: "Tamil Nadu Chief Minister's Merit Scholarship",
            categories: ["SC", "ST", "OBC", "EWS", "General"],
            educationLevels: ["UG"],
            amount: "10,000 per annum",
            deadline: "August 31, 2025",
            applicationLink: "https://tn.gov.in/scholarship",
            eligibility: "Students who scored above 90% in 12th standard and pursuing undergraduate studies in Tamil Nadu.",
            level: "State",
            state: "Tamil Nadu",
            requiredDocuments: ["12th Marksheet", "Domicile Certificate", "Aadhaar Card", "Bank Passbook", "College ID Card"],
            description: "Merit-based scholarship for top performing students in Tamil Nadu"
        },
        {
            name: "Pragati Scholarship for Girl Students (AICTE)",
            categories: ["SC", "ST", "OBC", "EWS", "General"],
            educationLevels: ["Diploma", "UG"],
            amount: "50,000 per annum",
            deadline: "December 31, 2025",
            applicationLink: "https://www.aicte-pragati-saksham-gov.in",
            eligibility: "Girl students admitted to AICTE approved technical institutions with family income less than ₹8 lakh per annum.",
            level: "National",
            state: "",
            requiredDocuments: ["Income Certificate", "Aadhaar Card", "Bank Passbook", "College ID Card", "Previous Marksheet"],
            description: "Scholarship scheme for girl students in technical education"
        },
        {
            name: "Prime Minister's Scholarship Scheme for Central Armed Police Forces and Assam Rifles",
            categories: ["General"],
            educationLevels: ["UG", "PG"],
            amount: "36,000 per annum for boys, 37,000 per annum for girls",
            deadline: "September 30, 2025",
            applicationLink: "https://scholarships.gov.in",
            eligibility: "Dependent children of personnel of CAPFs and Assam Rifles who died in harness/action or are disabled due to causes attributable to Government service.",
            level: "National",
            state: "",
            requiredDocuments: ["Parent's Service Certificate", "Death/Disability Certificate", "Aadhaar Card", "Bank Passbook", "College ID Card"],
            description: "Scholarship for children of CAPF and Assam Rifles personnel"
        }
    ];
}

// Initialize the scholarship system when DOM is loaded
document.addEventListener('DOMContentLoaded', initScholarshipSystem);
