/**
 * Resume Builder Utilities
 * Enhanced data processing and validation for the resume builder
 */

// Resume Schema - Based on JSON Resume Schema
const RESUME_SCHEMA = {
    basics: {
        name: { type: 'string', required: true },
        label: { type: 'string', required: false },
        email: { type: 'string', required: true, format: 'email' },
        phone: { type: 'string', required: false },
        location: { 
            type: 'object', 
            properties: {
                address: { type: 'string' },
                city: { type: 'string' },
                region: { type: 'string' },
                postalCode: { type: 'string' },
                countryCode: { type: 'string' }
            }
        },
        profiles: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    network: { type: 'string' },
                    username: { type: 'string' },
                    url: { type: 'string' }
                }
            }
        },
        summary: { type: 'string' },
        url: { type: 'string' },
        picture: { type: 'string' }
    },
    work: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                company: { type: 'string', required: true },
                position: { type: 'string', required: true },
                website: { type: 'string' },
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                summary: { type: 'string' },
                highlights: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } }
            }
        }
    },
    education: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                institution: { type: 'string', required: true },
                area: { type: 'string' },
                studyType: { type: 'string' },
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                gpa: { type: 'string' },
                courses: { type: 'array', items: { type: 'string' } }
            }
        }
    },
    skills: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: { type: 'string', required: true },
                level: { type: 'string' },
                keywords: { type: 'array', items: { type: 'string' } }
            }
        }
    },
    projects: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: { type: 'string', required: true },
                description: { type: 'string' },
                highlights: { type: 'array', items: { type: 'string' } },
                keywords: { type: 'array', items: { type: 'string' } },
                startDate: { type: 'string', format: 'date' },
                endDate: { type: 'string', format: 'date' },
                url: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } }
            }
        }
    },
    certifications: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: { type: 'string', required: true },
                date: { type: 'string', format: 'date' },
                issuer: { type: 'string' },
                url: { type: 'string' }
            }
        }
    },
    achievements: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                title: { type: 'string', required: true },
                date: { type: 'string', format: 'date' },
                description: { type: 'string' }
            }
        }
    },
    coverLetter: { type: 'string' }
};

/**
 * Validate resume data against schema
 * @param {Object} data - Resume data to validate
 * @returns {Object} - Validation result with errors if any
 */
function validateResumeData(data) {
    const errors = [];
    const result = { isValid: true, errors };

    // Basic validation for required fields
    if (!data.basics || !data.basics.name) {
        errors.push('Name is required');
        result.isValid = false;
    }

    if (!data.basics || !data.basics.email) {
        errors.push('Email is required');
        result.isValid = false;
    } else if (!isValidEmail(data.basics.email)) {
        errors.push('Email format is invalid');
        result.isValid = false;
    }

    // Validate work experience entries
    if (data.work && Array.isArray(data.work)) {
        data.work.forEach((work, index) => {
            if (!work.company) {
                errors.push(`Work experience #${index + 1}: Company name is required`);
                result.isValid = false;
            }
            if (!work.position) {
                errors.push(`Work experience #${index + 1}: Position is required`);
                result.isValid = false;
            }
            if (work.startDate && work.endDate && new Date(work.startDate) > new Date(work.endDate)) {
                errors.push(`Work experience #${index + 1}: Start date cannot be after end date`);
                result.isValid = false;
            }
        });
    }

    // Validate education entries
    if (data.education && Array.isArray(data.education)) {
        data.education.forEach((edu, index) => {
            if (!edu.institution) {
                errors.push(`Education #${index + 1}: Institution name is required`);
                result.isValid = false;
            }
            if (edu.startDate && edu.endDate && new Date(edu.startDate) > new Date(edu.endDate)) {
                errors.push(`Education #${index + 1}: Start date cannot be after end date`);
                result.isValid = false;
            }
        });
    }

    // Validate skills entries
    if (data.skills && Array.isArray(data.skills)) {
        data.skills.forEach((skill, index) => {
            if (!skill.name) {
                errors.push(`Skill #${index + 1}: Skill name is required`);
                result.isValid = false;
            }
        });
    }

    return result;
}

/**
 * Convert form data to JSON Resume format
 * @param {Object} formData - Form data from the UI
 * @returns {Object} - Formatted resume data in JSON Resume format
 */
function convertFormToResumeJSON(formData) {
    const resumeData = {
        basics: {
            name: formData.fullName || '',
            label: formData.jobTitle || '',
            email: formData.email || '',
            phone: formData.phone || '',
            summary: formData.objective || '',
            url: formData.portfolio || '',
            location: {
                address: '',
                city: '',
                region: '',
                postalCode: '',
                countryCode: ''
            },
            profiles: []
        },
        work: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        coverLetter: formData.coverLetter || ''
    };

    // Parse location
    if (formData.location) {
        const locationParts = formData.location.split(',').map(part => part.trim());
        if (locationParts.length >= 1) resumeData.basics.location.city = locationParts[0];
        if (locationParts.length >= 2) resumeData.basics.location.region = locationParts[1];
        if (locationParts.length >= 3) resumeData.basics.location.countryCode = locationParts[2];
    }

    // Add social profiles
    if (formData.linkedin) {
        resumeData.basics.profiles.push({
            network: 'LinkedIn',
            username: extractUsernameFromUrl(formData.linkedin, 'linkedin.com/in/'),
            url: formData.linkedin
        });
    }
    
    if (formData.github) {
        resumeData.basics.profiles.push({
            network: 'GitHub',
            username: extractUsernameFromUrl(formData.github, 'github.com/'),
            url: formData.github
        });
    }

    // Process work experience
    if (formData.experience && Array.isArray(formData.experience)) {
        resumeData.work = formData.experience.map(exp => ({
            company: exp.company || '',
            position: exp.position || '',
            website: exp.website || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            summary: exp.description || '',
            highlights: parseHighlights(exp.highlights),
            keywords: parseKeywords(exp.keywords)
        }));
    }

    // Process education
    if (formData.education && Array.isArray(formData.education)) {
        resumeData.education = formData.education.map(edu => ({
            institution: edu.institution || '',
            area: edu.area || '',
            studyType: edu.degree || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            gpa: edu.gpa || '',
            courses: parseHighlights(edu.courses)
        }));
    }

    // Process skills
    if (formData.skills) {
        // Handle if skills is a string (comma-separated)
        if (typeof formData.skills === 'string') {
            const skillsList = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
            resumeData.skills = skillsList.map(skill => ({
                name: skill,
                level: '',
                keywords: []
            }));
        } 
        // Handle if skills is already an array of objects
        else if (Array.isArray(formData.skills)) {
            resumeData.skills = formData.skills.map(skill => {
                if (typeof skill === 'string') {
                    return {
                        name: skill,
                        level: '',
                        keywords: []
                    };
                }
                return {
                    name: skill.name || '',
                    level: skill.level || '',
                    keywords: Array.isArray(skill.keywords) ? skill.keywords : []
                };
            });
        }
    }

    // Process projects
    if (formData.projects && Array.isArray(formData.projects)) {
        resumeData.projects = formData.projects.map(project => ({
            name: project.name || '',
            description: project.description || '',
            highlights: parseHighlights(project.highlights),
            keywords: parseKeywords(project.technologies),
            startDate: project.startDate || '',
            endDate: project.endDate || '',
            url: project.url || '',
            roles: parseHighlights(project.roles)
        }));
    }

    // Process certifications
    if (formData.certifications && Array.isArray(formData.certifications)) {
        resumeData.certifications = formData.certifications.map(cert => ({
            name: cert.name || '',
            date: cert.date || '',
            issuer: cert.issuer || '',
            url: cert.url || ''
        }));
    }

    // Process achievements
    if (formData.achievements && Array.isArray(formData.achievements)) {
        resumeData.achievements = formData.achievements.map(achievement => ({
            title: achievement.title || '',
            date: achievement.date || '',
            description: achievement.description || ''
        }));
    }

    return resumeData;
}

/**
 * Convert JSON Resume format to form data
 * @param {Object} resumeData - Resume data in JSON Resume format
 * @returns {Object} - Form data for the UI
 */
function convertResumeJSONToForm(resumeData) {
    const formData = {
        fullName: resumeData.basics?.name || '',
        jobTitle: resumeData.basics?.label || '',
        email: resumeData.basics?.email || '',
        phone: resumeData.basics?.phone || '',
        objective: resumeData.basics?.summary || '',
        portfolio: resumeData.basics?.url || '',
        coverLetter: resumeData.coverLetter || '',
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        achievements: []
    };

    // Format location
    if (resumeData.basics?.location) {
        const loc = resumeData.basics.location;
        const locationParts = [];
        if (loc.city) locationParts.push(loc.city);
        if (loc.region) locationParts.push(loc.region);
        if (loc.countryCode) locationParts.push(loc.countryCode);
        formData.location = locationParts.join(', ');
    }

    // Extract social profiles
    const linkedInProfile = resumeData.basics?.profiles?.find(p => p.network.toLowerCase() === 'linkedin');
    if (linkedInProfile) {
        formData.linkedin = linkedInProfile.url;
    }

    const githubProfile = resumeData.basics?.profiles?.find(p => p.network.toLowerCase() === 'github');
    if (githubProfile) {
        formData.github = githubProfile.url;
    }

    // Format work experience
    if (resumeData.work && Array.isArray(resumeData.work)) {
        formData.experience = resumeData.work.map(work => ({
            company: work.company || '',
            position: work.position || '',
            website: work.website || '',
            startDate: work.startDate || '',
            endDate: work.endDate || '',
            description: work.summary || '',
            highlights: Array.isArray(work.highlights) ? work.highlights.join('\n') : '',
            keywords: Array.isArray(work.keywords) ? work.keywords.join(', ') : ''
        }));
    }

    // Format education
    if (resumeData.education && Array.isArray(resumeData.education)) {
        formData.education = resumeData.education.map(edu => ({
            institution: edu.institution || '',
            area: edu.area || '',
            degree: edu.studyType || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            gpa: edu.gpa || '',
            courses: Array.isArray(edu.courses) ? edu.courses.join('\n') : ''
        }));
    }

    // Format skills
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
        formData.skills = resumeData.skills.map(skill => ({
            name: skill.name || '',
            level: skill.level || '',
            keywords: Array.isArray(skill.keywords) ? skill.keywords : []
        }));
        
        // Also create a simple string version for text inputs
        formData.skillsString = resumeData.skills.map(skill => skill.name).join(', ');
    }

    // Format projects
    if (resumeData.projects && Array.isArray(resumeData.projects)) {
        formData.projects = resumeData.projects.map(project => ({
            name: project.name || '',
            description: project.description || '',
            highlights: Array.isArray(project.highlights) ? project.highlights.join('\n') : '',
            technologies: Array.isArray(project.keywords) ? project.keywords.join(', ') : '',
            startDate: project.startDate || '',
            endDate: project.endDate || '',
            url: project.url || '',
            roles: Array.isArray(project.roles) ? project.roles.join('\n') : ''
        }));
    }

    // Format certifications
    if (resumeData.certifications && Array.isArray(resumeData.certifications)) {
        formData.certifications = resumeData.certifications.map(cert => ({
            name: cert.name || '',
            date: cert.date || '',
            issuer: cert.issuer || '',
            url: cert.url || ''
        }));
    }

    // Format achievements
    if (resumeData.achievements && Array.isArray(resumeData.achievements)) {
        formData.achievements = resumeData.achievements.map(achievement => ({
            title: achievement.title || '',
            date: achievement.date || '',
            description: achievement.description || ''
        }));
    }

    return formData;
}

/**
 * Export resume data to JSON file
 * @param {Object} resumeData - Resume data in JSON Resume format
 */
function exportResumeToJSON(resumeData) {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `resume_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

/**
 * Import resume data from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} - Promise resolving to the parsed resume data
 */
function importResumeFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON file'));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file);
    });
}

/**
 * Helper function to parse highlights from string to array
 * @param {string|Array} highlights - Highlights as string or array
 * @returns {Array} - Array of highlights
 */
function parseHighlights(highlights) {
    if (!highlights) return [];
    if (Array.isArray(highlights)) return highlights;
    
    return highlights
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean);
}

/**
 * Helper function to parse keywords from string to array
 * @param {string|Array} keywords - Keywords as string or array
 * @returns {Array} - Array of keywords
 */
function parseKeywords(keywords) {
    if (!keywords) return [];
    if (Array.isArray(keywords)) return keywords;
    
    return keywords
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

/**
 * Helper function to extract username from URL
 * @param {string} url - URL to extract username from
 * @param {string} domain - Domain to look for
 * @returns {string} - Extracted username
 */
function extractUsernameFromUrl(url, domain) {
    if (!url) return '';
    
    const domainIndex = url.indexOf(domain);
    if (domainIndex === -1) return '';
    
    const usernameStart = domainIndex + domain.length;
    const usernameEnd = url.indexOf('/', usernameStart);
    
    if (usernameEnd === -1) {
        return url.substring(usernameStart);
    }
    
    return url.substring(usernameStart, usernameEnd);
}

/**
 * Helper function to validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Generate a resume template with markdown support
 * @param {Object} resumeData - Resume data in JSON Resume format
 * @param {string} templateName - Name of the template to use
 * @returns {string} - HTML string for the resume
 */
function generateResumeHTML(resumeData, templateName = 'professional') {
    const templates = {
        professional: generateProfessionalTemplate,
        modern: generateModernTemplate,
        creative: generateCreativeTemplate
    };
    
    const templateFunction = templates[templateName] || templates.professional;
    return templateFunction(resumeData);
}

// Export all functions
window.ResumeUtils = {
    RESUME_SCHEMA,
    validateResumeData,
    convertFormToResumeJSON,
    convertResumeJSONToForm,
    exportResumeToJSON,
    importResumeFromJSON,
    generateResumeHTML
};
