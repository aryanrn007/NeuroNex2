/**
 * Resume AI Module
 * Provides intelligent suggestions and improvements for resume content
 */

// Sample data for AI suggestions (in a real implementation, this would use an actual AI API)
const SKILLS_KEYWORDS = {
    'software development': ['JavaScript', 'Python', 'Java', 'C#', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'REST API', 'GraphQL', 'Git', 'GitHub', 'GitLab', 'CI/CD', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Microservices', 'Serverless', 'TDD', 'Agile', 'Scrum'],
    'data science': ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'SciPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Visualization', 'Tableau', 'Power BI', 'Statistics', 'A/B Testing', 'Big Data', 'Hadoop', 'Spark', 'Data Mining', 'Data Cleaning', 'Feature Engineering'],
    'design': ['UI/UX', 'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Typography', 'Color Theory', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Responsive Design', 'Accessibility', 'Design Systems', 'Visual Design', 'Interaction Design'],
    'marketing': ['SEO', 'SEM', 'PPC', 'Google Analytics', 'Google Ads', 'Facebook Ads', 'Instagram Ads', 'LinkedIn Ads', 'Content Marketing', 'Email Marketing', 'Social Media Marketing', 'Influencer Marketing', 'Affiliate Marketing', 'Marketing Automation', 'CRM', 'Salesforce', 'HubSpot', 'Mailchimp', 'A/B Testing', 'Conversion Rate Optimization', 'Brand Strategy', 'Market Research'],
    'project management': ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'JIRA', 'Confluence', 'Trello', 'Asana', 'Monday.com', 'MS Project', 'Gantt Charts', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'Resource Allocation', 'Team Leadership', 'Communication', 'Problem Solving', 'Decision Making', 'PMP', 'PRINCE2', 'Six Sigma']
};

const RESUME_IMPROVEMENT_TIPS = {
    summary: [
        "Start with a strong professional summary that highlights your most relevant skills and experience",
        "Keep your summary concise (3-5 sentences) and tailored to the job you're seeking",
        "Use action verbs and quantify your achievements where possible",
        "Highlight your unique value proposition - what sets you apart from other candidates",
        "Avoid using generic phrases like 'hard worker' or 'team player'"
    ],
    experience: [
        "Use the PAR (Problem-Action-Result) formula to describe your achievements",
        "Quantify your achievements with numbers, percentages, and metrics",
        "Focus on your accomplishments rather than just listing job duties",
        "Use action verbs to start each bullet point (e.g., 'Developed', 'Implemented', 'Managed')",
        "Tailor your experience to highlight skills relevant to the job you're applying for",
        "Include keywords from the job description to pass ATS (Applicant Tracking Systems)"
    ],
    skills: [
        "Organize your skills into categories (e.g., Technical, Soft, Languages)",
        "List the most relevant skills for the job first",
        "Include both hard skills (technical) and soft skills (interpersonal)",
        "Be specific about your technical skills (e.g., 'React.js' instead of just 'JavaScript')",
        "Include your proficiency level for each skill if appropriate"
    ],
    education: [
        "List your highest degree first",
        "Include relevant coursework, academic achievements, and extracurricular activities",
        "Mention any scholarships, honors, or awards",
        "Include your GPA if it's 3.5 or higher",
        "For recent graduates, education should come before experience"
    ],
    projects: [
        "Highlight projects that demonstrate skills relevant to the job",
        "Include a brief description of each project and your role",
        "Mention the technologies and tools used",
        "Include links to live demos or GitHub repositories if available",
        "Quantify the impact of your projects where possible"
    ],
    general: [
        "Use a clean, professional layout with consistent formatting",
        "Keep your resume to 1-2 pages maximum",
        "Use bullet points for better readability",
        "Proofread carefully for spelling and grammar errors",
        "Save your resume as a PDF to preserve formatting",
        "Use a professional file name (e.g., 'John_Smith_Resume.pdf')",
        "Include your contact information at the top of the resume",
        "Use a professional email address"
    ]
};

const ACTION_VERBS = {
    achievement: ['Achieved', 'Attained', 'Completed', 'Demonstrated', 'Earned', 'Exceeded', 'Improved', 'Pioneered', 'Reduced', 'Resolved', 'Restored', 'Surpassed', 'Transformed', 'Won'],
    communication: ['Addressed', 'Arbitrated', 'Arranged', 'Authored', 'Collaborated', 'Convinced', 'Corresponded', 'Delivered', 'Developed', 'Directed', 'Documented', 'Edited', 'Influenced', 'Interpreted', 'Mediated', 'Moderated', 'Negotiated', 'Persuaded', 'Promoted', 'Publicized', 'Reconciled', 'Recruited', 'Spoke', 'Translated', 'Wrote'],
    creativity: ['Conceptualized', 'Created', 'Customized', 'Designed', 'Developed', 'Directed', 'Established', 'Founded', 'Illustrated', 'Initiated', 'Instituted', 'Integrated', 'Introduced', 'Invented', 'Originated', 'Performed', 'Planned', 'Revitalized', 'Shaped'],
    leadership: ['Administered', 'Appointed', 'Approved', 'Assigned', 'Attained', 'Authorized', 'Chaired', 'Consolidated', 'Contracted', 'Controlled', 'Coordinated', 'Delegated', 'Directed', 'Evaluated', 'Executed', 'Headed', 'Hired', 'Hosted', 'Improved', 'Incorporated', 'Increased', 'Led', 'Managed', 'Merged', 'Motivated', 'Organized', 'Oversaw', 'Planned', 'Prioritized', 'Produced', 'Recommended', 'Reorganized', 'Replaced', 'Restored', 'Reviewed', 'Scheduled', 'Secured', 'Selected', 'Strengthened', 'Supervised'],
    technical: ['Assembled', 'Built', 'Calculated', 'Computed', 'Designed', 'Devised', 'Engineered', 'Fabricated', 'Maintained', 'Operated', 'Optimized', 'Overhauled', 'Programmed', 'Remodeled', 'Repaired', 'Solved', 'Trained', 'Upgraded'],
    analysis: ['Analyzed', 'Assessed', 'Clarified', 'Collected', 'Compared', 'Conducted', 'Critiqued', 'Detected', 'Determined', 'Diagnosed', 'Evaluated', 'Examined', 'Experimented', 'Explored', 'Extracted', 'Formulated', 'Gathered', 'Identified', 'Inspected', 'Interpreted', 'Interviewed', 'Investigated', 'Located', 'Measured', 'Organized', 'Researched', 'Reviewed', 'Searched', 'Solved', 'Summarized', 'Surveyed', 'Systematized', 'Tested']
};

/**
 * Generate skill suggestions based on job title and experience
 * @param {string} jobTitle - Target job title
 * @param {Array} experience - Work experience entries
 * @returns {Array} - Array of suggested skills
 */
function suggestSkills(jobTitle, experience) {
    let suggestedSkills = new Set();
    
    // Find relevant skill categories based on job title
    const jobTitleLower = jobTitle.toLowerCase();
    let relevantCategories = [];
    
    for (const category in SKILLS_KEYWORDS) {
        if (jobTitleLower.includes(category) || category.includes(jobTitleLower)) {
            relevantCategories.push(category);
        }
    }
    
    // If no categories match, use some default categories
    if (relevantCategories.length === 0) {
        if (jobTitleLower.includes('developer') || jobTitleLower.includes('engineer') || jobTitleLower.includes('programmer')) {
            relevantCategories.push('software development');
        } else if (jobTitleLower.includes('data') || jobTitleLower.includes('analyst') || jobTitleLower.includes('scientist')) {
            relevantCategories.push('data science');
        } else if (jobTitleLower.includes('design') || jobTitleLower.includes('ux') || jobTitleLower.includes('ui')) {
            relevantCategories.push('design');
        } else if (jobTitleLower.includes('market') || jobTitleLower.includes('content') || jobTitleLower.includes('brand')) {
            relevantCategories.push('marketing');
        } else if (jobTitleLower.includes('manager') || jobTitleLower.includes('lead') || jobTitleLower.includes('coordinator')) {
            relevantCategories.push('project management');
        } else {
            // Default to software development and project management
            relevantCategories.push('software development', 'project management');
        }
    }
    
    // Add skills from relevant categories
    relevantCategories.forEach(category => {
        const skills = SKILLS_KEYWORDS[category] || [];
        skills.forEach(skill => suggestedSkills.add(skill));
    });
    
    // Extract keywords from experience descriptions
    if (experience && Array.isArray(experience)) {
        experience.forEach(job => {
            if (job.description) {
                const words = job.description.toLowerCase().split(/\s+/);
                
                // Check if any words match skills in our database
                for (const category in SKILLS_KEYWORDS) {
                    SKILLS_KEYWORDS[category].forEach(skill => {
                        const skillLower = skill.toLowerCase();
                        if (words.some(word => word.includes(skillLower) || skillLower.includes(word))) {
                            suggestedSkills.add(skill);
                        }
                    });
                }
            }
        });
    }
    
    return Array.from(suggestedSkills).slice(0, 15); // Return top 15 skills
}

/**
 * Suggest improvements for resume sections
 * @param {Object} resumeData - Resume data to analyze
 * @returns {Object} - Suggested improvements for each section
 */
function suggestImprovements(resumeData) {
    const suggestions = {
        summary: [],
        experience: [],
        skills: [],
        education: [],
        projects: [],
        general: []
    };
    
    // Check summary
    if (!resumeData.basics?.summary || resumeData.basics.summary.length < 50) {
        suggestions.summary.push("Your professional summary is too short or missing. Add a compelling summary that highlights your key qualifications.");
    } else if (resumeData.basics.summary.length > 500) {
        suggestions.summary.push("Your professional summary is too long. Keep it concise (3-5 sentences).");
    }
    
    // Check experience
    if (!resumeData.work || resumeData.work.length === 0) {
        suggestions.experience.push("You haven't added any work experience. Add your relevant work history.");
    } else {
        resumeData.work.forEach((job, index) => {
            if (!job.company || !job.position) {
                suggestions.experience.push(`Work experience #${index + 1}: Missing company name or position.`);
            }
            
            if (!job.summary || job.summary.length < 50) {
                suggestions.experience.push(`Work experience at ${job.company || `#${index + 1}`}: Add more details about your responsibilities and achievements.`);
            }
            
            if (!job.highlights || job.highlights.length < 2) {
                suggestions.experience.push(`Work experience at ${job.company || `#${index + 1}`}: Add at least 2-3 bullet points highlighting your key achievements.`);
            }
        });
    }
    
    // Check skills
    if (!resumeData.skills || resumeData.skills.length === 0) {
        suggestions.skills.push("You haven't added any skills. Add relevant skills to make your resume stand out.");
    } else if (resumeData.skills.length < 5) {
        suggestions.skills.push("Consider adding more skills to showcase your expertise (aim for 8-12 relevant skills).");
    }
    
    // Check education
    if (!resumeData.education || resumeData.education.length === 0) {
        suggestions.education.push("You haven't added any education. Add your educational background.");
    }
    
    // Check projects
    if (!resumeData.projects || resumeData.projects.length === 0) {
        suggestions.projects.push("Consider adding relevant projects to showcase your practical skills and experience.");
    }
    
    // Add general tips
    suggestions.general = RESUME_IMPROVEMENT_TIPS.general.slice(0, 3);
    
    return suggestions;
}

/**
 * Suggest action verbs to improve job descriptions
 * @param {string} description - Current job description
 * @param {string} category - Job category (optional)
 * @returns {Array} - Suggested action verbs
 */
function suggestActionVerbs(description, category = null) {
    let suggestedVerbs = [];
    
    // If category is provided, use verbs from that category
    if (category && ACTION_VERBS[category]) {
        suggestedVerbs = ACTION_VERBS[category].slice(0, 10);
    } else {
        // Otherwise, provide a mix of verbs from different categories
        for (const category in ACTION_VERBS) {
            suggestedVerbs = suggestedVerbs.concat(ACTION_VERBS[category].slice(0, 3));
        }
    }
    
    // Shuffle the array to get a random selection
    return shuffleArray(suggestedVerbs).slice(0, 10);
}

/**
 * Generate a cover letter template based on resume data
 * @param {Object} resumeData - Resume data to use for the cover letter
 * @param {string} company - Target company name
 * @param {string} position - Target position
 * @returns {string} - Generated cover letter template
 */
function generateCoverLetterTemplate(resumeData, company, position) {
    const name = resumeData.basics?.name || '[Your Name]';
    const email = resumeData.basics?.email || '[Your Email]';
    const phone = resumeData.basics?.phone || '[Your Phone]';
    
    // Extract most recent job details
    let recentJob = { company: '[Previous Company]', position: '[Previous Position]' };
    if (resumeData.work && resumeData.work.length > 0) {
        recentJob = resumeData.work[0];
    }
    
    // Extract top skills
    let skillsList = '[Your Key Skills]';
    if (resumeData.skills && resumeData.skills.length > 0) {
        const skills = resumeData.skills.slice(0, 3).map(skill => skill.name);
        skillsList = skills.join(', ');
    }
    
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `${today}

${name}
${email}
${phone}

[Hiring Manager's Name]
${company}
[Company Address]
[City, State ZIP]

Dear [Hiring Manager's Name],

I am writing to express my interest in the ${position} position at ${company}. With my background in ${recentJob.position} at ${recentJob.company} and expertise in ${skillsList}, I am confident in my ability to make a valuable contribution to your team.

[Paragraph 1: Explain why you're interested in the position and the company. Research the company and mention something specific about their mission, values, or recent achievements that resonates with you.]

[Paragraph 2: Highlight your relevant experience and achievements. Connect your skills to the job requirements and explain how they would benefit the company.]

[Paragraph 3: Provide a specific example of a relevant accomplishment that demonstrates your value. Use the PAR (Problem-Action-Result) formula.]

I am excited about the opportunity to bring my unique skills to ${company} and help [specific goal related to the position]. I would welcome the chance to discuss how my experience and skills would benefit your team.

Thank you for considering my application. I look forward to the possibility of working with you.

Sincerely,

${name}`;
}

/**
 * Analyze a job description and suggest resume optimizations
 * @param {string} jobDescription - Job description to analyze
 * @param {Object} resumeData - Current resume data
 * @returns {Object} - Suggested optimizations
 */
function analyzeJobDescription(jobDescription, resumeData) {
    if (!jobDescription) {
        return {
            keywordMatch: 0,
            missedKeywords: [],
            suggestions: []
        };
    }
    
    const jobDescLower = jobDescription.toLowerCase();
    const words = jobDescLower.split(/\s+/);
    
    // Extract potential keywords (nouns and technical terms)
    const keywords = words.filter(word => 
        word.length > 3 && 
        !['and', 'the', 'for', 'with', 'that', 'this', 'are', 'you', 'your', 'will', 'have', 'from'].includes(word)
    );
    
    // Check if resume contains these keywords
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const matchedKeywords = keywords.filter(keyword => resumeText.includes(keyword));
    const missedKeywords = keywords.filter(keyword => !resumeText.includes(keyword));
    
    // Calculate match percentage
    const keywordMatch = matchedKeywords.length / keywords.length;
    
    // Generate suggestions
    const suggestions = [];
    
    if (keywordMatch < 0.6) {
        suggestions.push("Your resume doesn't match many keywords from the job description. Consider adding more relevant keywords.");
    }
    
    if (missedKeywords.length > 0) {
        const topMissedKeywords = [...new Set(missedKeywords)].slice(0, 10);
        suggestions.push(`Consider adding these keywords to your resume: ${topMissedKeywords.join(', ')}`);
    }
    
    return {
        keywordMatch: Math.round(keywordMatch * 100),
        missedKeywords: [...new Set(missedKeywords)].slice(0, 20),
        suggestions
    };
}

/**
 * Helper function to shuffle an array
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Generate a professional summary based on resume data
 * @param {Object} resumeData - Resume data to use for the summary
 * @returns {string} - Generated professional summary
 */
function generateProfessionalSummary(resumeData) {
    // Extract key information
    const jobTitle = resumeData.basics?.label || '';
    const yearsOfExperience = resumeData.work ? resumeData.work.length : 0;
    
    // Extract top skills
    let skillsList = '';
    if (resumeData.skills && resumeData.skills.length > 0) {
        const skills = resumeData.skills.slice(0, 3).map(skill => skill.name);
        skillsList = skills.join(', ');
    }
    
    // Generate summary templates based on experience level
    let summaryTemplates = [];
    
    if (yearsOfExperience <= 2) {
        // Entry-level templates
        summaryTemplates = [
            `Motivated ${jobTitle} with strong foundation in ${skillsList}. Eager to leverage academic knowledge and passion for [industry/field] to contribute to [target company/role]. Committed to continuous learning and professional growth.`,
            `Recent graduate with a focus on ${skillsList}, seeking to apply my skills in a ${jobTitle} role. Bringing fresh perspectives, technical aptitude, and a strong work ethic to deliver value from day one.`,
            `Detail-oriented ${jobTitle} with hands-on experience in ${skillsList}. Combining academic excellence with practical skills to solve complex problems and contribute to team success.`
        ];
    } else if (yearsOfExperience <= 5) {
        // Mid-level templates
        summaryTemplates = [
            `Results-driven ${jobTitle} with ${yearsOfExperience}+ years of experience specializing in ${skillsList}. Proven track record of delivering high-quality solutions that drive business growth and improve operational efficiency.`,
            `Versatile ${jobTitle} with ${yearsOfExperience} years of experience and expertise in ${skillsList}. Adept at translating business requirements into technical solutions that exceed expectations and deliver measurable results.`,
            `Innovative ${jobTitle} with ${yearsOfExperience} years of hands-on experience in ${skillsList}. Committed to delivering scalable solutions that optimize performance and enhance user experience.`
        ];
    } else {
        // Senior-level templates
        summaryTemplates = [
            `Seasoned ${jobTitle} with ${yearsOfExperience}+ years of experience and deep expertise in ${skillsList}. Proven leader with a track record of building high-performing teams and delivering complex projects that drive business transformation.`,
            `Strategic ${jobTitle} with over ${yearsOfExperience} years of experience spearheading initiatives in ${skillsList}. Combines technical excellence with business acumen to deliver innovative solutions that create competitive advantage.`,
            `Accomplished ${jobTitle} with ${yearsOfExperience}+ years of experience leading projects and teams across ${skillsList}. Recognized for translating complex business challenges into elegant technical solutions that drive growth and efficiency.`
        ];
    }
    
    // Return a random template
    return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
}

// Export all functions
window.ResumeAI = {
    suggestSkills,
    suggestImprovements,
    suggestActionVerbs,
    generateCoverLetterTemplate,
    analyzeJobDescription,
    generateProfessionalSummary,
    ACTION_VERBS,
    RESUME_IMPROVEMENT_TIPS
};
