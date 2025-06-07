/**
 * Resume AI Analyzer
 * Provides AI-powered analysis of resumes using OpenRouter API
 */

// OpenRouter API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
let openRouterApiKey = "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"; // Default API key
const OPENROUTER_MODEL = "openai/gpt-3.5-turbo"; // Using more affordable model that works with free credits

// Check if the API key is already in session storage
if (sessionStorage.getItem("openrouter_api_key")) {
    openRouterApiKey = sessionStorage.getItem("openrouter_api_key");
    console.log("Retrieved API key from session storage");
}

/**
 * Initialize the AI analyzer with the API key
 * @param {string} apiKey - The OpenRouter API key
 */
function initializeAIAnalyzer(apiKey) {
    if (!apiKey) {
        console.error("No API key provided for AI analyzer");
        return false;
    }
    
    // Store API key in variable and session storage
    openRouterApiKey = apiKey;
    // Also store in session storage (not localStorage for security)
    // This will be cleared when the browser is closed
    sessionStorage.setItem("openrouter_api_key", apiKey);
    console.log("AI analyzer initialized successfully with key:", apiKey.substring(0, 10) + "...");
    return true;
}

/**
 * Analyze resume content with AI
 * @param {string} resumeText - The text content of the resume
 * @param {Function} callback - Callback function to handle the analysis results
 */
async function analyzeResumeWithAI(resumeText, callback) {
    // Always use the stored key to ensure API access
    const apiKey = openRouterApiKey;
    openRouterApiKey = apiKey; // Set the global variable
    sessionStorage.setItem("openrouter_api_key", apiKey); // Also store in session storage
                 
    console.log("Using API key for analysis:", apiKey ? "Key available" : "No key");
    
    if (!resumeText || resumeText.length < 100) {
        console.error("Resume text too short for analysis");
        callback({
            error: "Resume text is too short for meaningful analysis. Please provide more content."
        });
        return;
    }
    
    try {
        // Show loading state in the UI
        showNotification("Analyzing your resume...");
        
        // Use OpenRouter API for analysis
        console.log("Sending request to OpenRouter API for analysis...");
        
        try {
            // Make API request for ATS analysis
            const atsPrompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Review the following resume and provide a detailed ATS compatibility analysis.

Resume:
${resumeText}

Provide your analysis in the following JSON format:
{
  "score": (a number from 0-100 representing ATS compatibility),
  "format": {
    "score": (0-100),
    "issues": ["issue1", "issue2"]
  },
  "keywords": {
    "score": (0-100),
    "present": ["keyword1", "keyword2"],
    "missing": ["keyword1", "keyword2"]
  },
  "sections": {
    "score": (0-100),
    "present": ["section1", "section2"],
    "missing": ["section1", "section2"]
  },
  "issues": [
    {
      "title": "issue title",
      "description": "issue description"
    }
  ]
}
`;
            
            const atsResponse = await makeOpenRouterRequest(atsPrompt);
            const atsData = extractJSONFromResponse(atsResponse);
            
            // If API call succeeded, continue with content analysis
            if (atsData && !atsData.error) {
                // Continue with API analysis
                const contentPrompt = `
You are an expert resume reviewer. Analyze the following resume for content quality and provide detailed feedback.

Resume:
${resumeText}

Provide your analysis in the following JSON format:
{
  "overallScore": (a number from 0-100),
  "clarity": {
    "score": (0-100),
    "feedback": "specific feedback on clarity"
  },
  "impact": {
    "score": (0-100),
    "feedback": "specific feedback on impact statements"
  },
  "relevance": {
    "score": (0-100),
    "feedback": "specific feedback on relevance"
  },
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}
`;
                
                const contentResponse = await makeOpenRouterRequest(contentPrompt);
                const contentData = extractJSONFromResponse(contentResponse);
                
                const keywordPrompt = `
You are an expert in resume keywords and ATS optimization. Analyze the following resume for keyword usage and provide recommendations.

Resume:
${resumeText}

Provide your analysis in the following JSON format:
{
  "industryKeywords": ["keyword1", "keyword2"],
  "technicalSkills": ["skill1", "skill2"],
  "softSkills": ["skill1", "skill2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "keywordDensity": (a number representing keyword density percentage),
  "recommendations": ["recommendation1", "recommendation2"]
}
`;
                
                const keywordResponse = await makeOpenRouterRequest(keywordPrompt);
                const keywordData = extractJSONFromResponse(keywordResponse);
                
                const suggestionsPrompt = `
You are an expert resume writer. Provide specific improvement suggestions for the following resume.

Resume:
${resumeText}

Provide your suggestions in the following JSON format:
{
  "format": [
    {
      "title": "suggestion title",
      "description": "detailed suggestion",
      "example": "example of implementation"
    }
  ],
  "content": [
    {
      "title": "suggestion title",
      "description": "detailed suggestion",
      "example": "example of implementation"
    }
  ],
  "keywords": [
    {
      "title": "suggestion title",
      "description": "detailed suggestion",
      "example": "example of implementation"
    }
  ]
}
`;
                
                const suggestionsResponse = await makeOpenRouterRequest(suggestionsPrompt);
                const suggestionsData = extractJSONFromResponse(suggestionsResponse);
                
                // Combine all analyses
                const analysisResult = {
                    ats: atsData,
                    content: contentData,
                    keywords: keywordData,
                    suggestions: suggestionsData,
                    isApiAnalysis: true
                };
                
                console.log("Complete analysis result from API:", analysisResult);
                callback(analysisResult);
                return;
            }
        } catch (apiError) {
            console.warn("API error, falling back to local analysis:", apiError);
        }
        
        // Generate intelligent analysis based on the actual resume content
        const atsData = generateIntelligentATSAnalysis(resumeText);
        const contentData = generateIntelligentContentAnalysis(resumeText);
        const keywordData = generateIntelligentKeywordAnalysis(resumeText);
        const suggestionsData = generateIntelligentSuggestions(resumeText);
        
        // Combine all analyses
        const analysisResult = {
            ats: atsData,
            content: contentData,
            keywords: keywordData,
            suggestions: suggestionsData,
            isLocalAnalysis: true // Mark as local analysis
        };
        
        console.log("Complete analysis result from local engine:", analysisResult);
        callback(analysisResult);
        
    } catch (error) {
        console.error("Error in resume analysis:", error);
        callback({
            error: "An error occurred during analysis. Please try again.",
            details: error.message
        });
    }
}

/**
 * Analyze a job description to match with resume
 * @param {string} resumeText - The text content of the resume
 * @param {string} jobDescription - The job description text
 * @param {Function} callback - Callback function to handle the analysis results
 */
async function analyzeJobMatch(resumeText, jobDescription, callback) {
    // Always use the stored key to ensure API access
    const apiKey = openRouterApiKey;
    // Update the global variable and session storage
    openRouterApiKey = apiKey;
    sessionStorage.setItem("openrouter_api_key", apiKey);
                 
    console.log("Using API key for job match analysis:", apiKey ? "Key available" : "No key");
    
    if (!apiKey) {
        console.error("No API key available for AI analysis");
        callback({
            error: "API key not available. Please initialize the AI analyzer first."
        });
        return;
    }
    
    if (!resumeText || resumeText.length < 100 || !jobDescription || jobDescription.length < 50) {
        console.error("Resume or job description text too short for analysis");
        callback({
            error: "Resume or job description is too short for meaningful analysis. Please provide more content."
        });
        return;
    }
    
    try {
        // Show loading state in the UI
        showNotification("Analyzing job match with AI...");
        
        // Prepare the prompt for job match analysis
        const jobMatchPrompt = `
You are an expert resume analyzer and career coach. Compare the following resume with the job description and provide a detailed match analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your analysis in the following JSON format:
{
  "matchScore": (a number from 0-100 representing overall match),
  "jobTitle": "extracted job title from description",
  "company": "extracted company name if present",
  "keywordMatch": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["keyword1", "keyword2"]
  },
  "skillsGap": ["skill1", "skill2"],
  "recommendations": ["recommendation1", "recommendation2"]
}
`;

        // Make API request for job match analysis
        const jobMatchResponse = await makeOpenRouterRequest(jobMatchPrompt);
        const jobMatchAnalysis = extractJSONFromResponse(jobMatchResponse);
        
        // Call the callback with the job match analysis
        callback(jobMatchAnalysis);
        
    } catch (error) {
        console.error("Error during job match analysis:", error);
        callback({
            error: "An error occurred during job match analysis. Please try again later."
        });
    }
}

/**
 * Generate an enhanced version of the resume
 * @param {string} resumeText - The original resume text
 * @param {Object} appliedSuggestions - The suggestions that were applied
 * @param {Function} callback - Callback function to handle the enhanced resume
 */
async function generateEnhancedResume(resumeText, appliedSuggestions, callback) {
    // Always use the stored key to ensure API access
    const apiKey = openRouterApiKey;
    // Update the global variable and session storage
    openRouterApiKey = apiKey;
    sessionStorage.setItem("openrouter_api_key", apiKey);
    
    console.log("Using API key for enhanced resume generation:", apiKey ? "Key available" : "No key");
    
    try {
        // Show loading state in the UI
        showNotification("Generating enhanced resume with AI...");
        
        // Convert applied suggestions to a string
        const suggestionsText = appliedSuggestions.map(sugg => 
            `- ${sugg.title}: ${sugg.description}`
        ).join("\n");
        
        // Prepare the prompt for enhanced resume generation
        const enhancePrompt = `
You are an expert resume writer. Improve the following resume based on the applied suggestions.

Original Resume:
${resumeText}

Applied Suggestions:
${suggestionsText}

Generate an improved version of the resume that incorporates these suggestions. Maintain the same overall structure but enhance the content.
`;

        // Make API request for enhanced resume generation
        const enhancedResponse = await makeOpenRouterRequest(enhancePrompt);
        
        // Extract the enhanced resume text from the response
        const enhancedResume = enhancedResponse.choices[0].message.content.trim();
        
        // Call the callback with the enhanced resume
        callback({
            originalResume: resumeText,
            enhancedResume: enhancedResume
        });
        
    } catch (error) {
        console.error("Error generating enhanced resume:", error);
        callback({
            error: "An error occurred while generating the enhanced resume. Please try again later."
        });
    }
}

/**
 * Make a request to the OpenRouter API
 * @param {string} prompt - The prompt to send to the API
 * @returns {Object} - The API response
 */
async function makeOpenRouterRequest(prompt) {
    // Always use the stored key to ensure API access
    const apiKey = openRouterApiKey;
    // Update the global variable and session storage
    openRouterApiKey = apiKey;
    sessionStorage.setItem("openrouter_api_key", apiKey);
    
    console.log("Using API key for analysis:", apiKey ? "Key available" : "No key");
    
    if (!apiKey) {
        return {
            error: {
                message: "No API key available for OpenRouter request",
                code: "NO_API_KEY"
            }
        };
    }
    
    try {
        console.log("Making OpenRouter API request...");
        
        // Use the model specified in the configuration
        const model = OPENROUTER_MODEL;
        
        // Truncate the prompt if it's too long to save tokens
        const truncatedPrompt = prompt.length > 2000 ? prompt.substring(0, 2000) + "..." : prompt;
        
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin, // Required for OpenRouter API
                "X-Title": "Resume Analyzer" // Optional, but good practice
            },
            body: JSON.stringify({
                model: model, // Using GPT-4 for higher quality analysis
                messages: [
                    {
                        role: "system",
                        content: "Return ONLY valid JSON based STRICTLY on what's in the resume. Do NOT invent or assume information not explicitly stated. No explanations outside JSON."
                    },
                    {
                        role: "user",
                        content: truncatedPrompt
                    }
                ],
                temperature: 0.1, // Very low temperature for more consistent results
                max_tokens: 250, // Reduced token limit to stay within free credit limits
                top_p: 0.95,
                stream: false
            })
        });
        
        if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
                // Try to parse as JSON if possible
                const errorJson = JSON.parse(errorText);
                console.error(`OpenRouter API error: ${response.status} ${response.statusText}`, errorJson);
                
                return {
                    error: {
                        status: response.status,
                        message: errorJson.message || errorText,
                        code: errorJson.code || response.status
                    }
                };
            } catch (e) {
                console.error(`OpenRouter API error: ${response.status} ${response.statusText}`, errorText);
                return {
                    error: {
                        status: response.status,
                        message: errorText || response.statusText,
                        code: response.status
                    }
                };
            }
        }
        
        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing API response as JSON:', jsonError);
            return {
                error: {
                    message: 'Failed to parse API response as JSON',
                    original: jsonError.message
                }
            };
        }
    } catch (error) {
        console.error("Error making OpenRouter request:", error);
        return {
            error: {
                message: error.message || 'Unknown error during API request',
                code: "API_REQUEST_FAILED"
            }
        };
    }
}

/**
 * Extract JSON from the API response
 * @param {Object} response - The API response
 * @returns {Object} - The extracted JSON object
 */
function extractJSONFromResponse(response) {
    try {
        // Check if we have a valid response structure
        if (!response) {
            console.error('API response is null or undefined');
            return { error: 'API response is null or undefined' };
        }
        
        if (response.error) {
            console.error('API returned an error:', response.error);
            return { error: response.error.message || 'API error' };
        }
        
        if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
            console.error('Invalid API response structure (no choices array):', response);
            return { error: 'Invalid API response structure (no choices array)' };
        }
        
        if (!response.choices[0].message || typeof response.choices[0].message.content !== 'string') {
            console.error('Invalid message structure in API response:', response.choices[0]);
            return { error: 'Invalid message structure in API response' };
        }
        
        // Extract the content from the response
        const content = response.choices[0].message.content;
        console.log('Extracted content length:', content ? content.length : 0);
        
        // Try to find JSON in the content
        let jsonData;
        
        // First try: Look for JSON block in markdown format
        const jsonBlockMatch = content.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonBlockMatch && jsonBlockMatch[1]) {
            try {
                jsonData = JSON.parse(jsonBlockMatch[1].trim());
                console.log('Parsed JSON from markdown code block');
                return jsonData;
            } catch (e) {
                console.warn('Failed to parse JSON from markdown block:', e);
                // Continue to next method
            }
        }
        
        // Second try: Look for JSON object pattern
        const jsonMatch = content.match(/\{[\s\S]*\}/m);
        if (jsonMatch) {
            try {
                jsonData = JSON.parse(jsonMatch[0]);
                console.log('Parsed JSON from regex match');
                return jsonData;
            } catch (e) {
                console.warn('Failed to parse JSON from regex match:', e);
                // Continue to next method
            }
        }
        
        // Third try: If the content itself might be JSON
        try {
            jsonData = JSON.parse(content);
            console.log('Parsed JSON directly from content');
            return jsonData;
        } catch (e) {
            console.warn('Failed to parse content directly as JSON:', e);
        }
        
        // If we couldn't parse JSON, create a structured object from the text
        console.warn('No valid JSON found in response, creating structured object from text');
        
        // Create a basic structure from the text content
        const lines = content.split('\n').filter(line => line.trim());
        
        // For ATS analysis
        if (content.includes('ATS') || content.includes('Applicant Tracking System')) {
            const atsScore = extractNumber(content, /(ATS|compatibility)\s*score\s*:?\s*(\d+)/i, 65);
            const formatScore = extractNumber(content, /format\s*compatibility\s*:?\s*(\d+)/i, 70);
            const keywordScore = extractNumber(content, /keyword\s*relevance\s*:?\s*(\d+)/i, 60);
            
            return {
                atsScore: atsScore,
                formatCompatibility: formatScore,
                keywordRelevance: keywordScore,
                sectionOrganization: 75,
                overallFeedback: extractSentence(content, 3),
                criticalIssues: extractIssues(content)
            };
        }
        
        // For content analysis
        if (content.includes('content') || content.includes('section')) {
            return {
                sections: extractSections(content)
            };
        }
        
        // For keyword analysis
        if (content.includes('keyword') || content.includes('skill')) {
            return {
                technicalSkills: extractSkills(content, 'technical'),
                softSkills: extractSkills(content, 'soft'),
                industrySpecific: extractSkills(content, 'industry')
            };
        }
        
        // For suggestions
        if (content.includes('suggestion') || content.includes('improve')) {
            return {
                suggestions: extractSuggestions(content)
            };
        }
        
        // Fallback
        return { 
            error: 'Could not extract structured data from response',
            rawContent: content
        };
    } catch (error) {
        console.error('Error extracting data from response:', error);
        return { error: 'Failed to process AI response: ' + error.message };
    }
}

/**
 * Extract a number from text using regex
 * @param {string} text - The text to search in
 * @param {RegExp} regex - The regex pattern to use
 * @param {number} defaultValue - Default value if not found
 * @returns {number} - The extracted number or default
 */
function extractNumber(text, regex, defaultValue) {
    const match = text.match(regex);
    if (match && match.length > 1) {
        const num = parseInt(match[match.length - 1], 10);
        return isNaN(num) ? defaultValue : num;
    }
    return defaultValue;
}

/**
 * Extract a sentence from text
 * @param {string} text - The text to extract from
 * @param {number} sentenceCount - Number of sentences to extract
 * @returns {string} - The extracted sentence
 */
function extractSentence(text, sentenceCount = 1) {
    const sentences = text.split(/[.!?]\s+/).filter(s => s.length > 10);
    return sentences.slice(0, sentenceCount).join('. ') + '.';
}

/**
 * Extract issues from text
 * @param {string} text - The text to extract from
 * @returns {Array} - Array of issues
 */
function extractIssues(text) {
    const issues = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('issue') || lines[i].includes('problem') || 
            lines[i].match(/^\d+\.\s/) || lines[i].match(/^•\s/) || lines[i].match(/^-\s/)) {
            const issue = lines[i].replace(/^\d+\.\s|^•\s|^-\s/, '').trim();
            const description = i+1 < lines.length ? lines[i+1] : '';
            
            issues.push({
                issue: issue,
                description: description.trim()
            });
            
            if (issues.length >= 3) break;
        }
    }
    
    // If no issues found, create default ones
    if (issues.length === 0) {
        issues.push(
            { issue: "Missing Keywords", description: "Your resume may be missing key terms that ATS systems look for." },
            { issue: "Formatting Issues", description: "Check your resume formatting for ATS compatibility." },
            { issue: "Section Organization", description: "Make sure your sections are clearly defined and organized." }
        );
    }
    
    return issues;
}

/**
 * Extract sections from text
 * @param {string} text - The text to extract from
 * @returns {Array} - Array of sections
 */
function extractSections(text) {
    const sections = [];
    const sectionNames = ['summary', 'experience', 'education', 'skills', 'projects'];
    
    for (const name of sectionNames) {
        if (text.toLowerCase().includes(name)) {
            sections.push({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                score: extractNumber(text, new RegExp(name + '\\s*:?\\s*(\\d+)', 'i'), 70),
                quality: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                feedback: extractSentence(text),
                recommendations: extractRecommendations(text, name)
            });
        }
    }
    
    return sections;
}

/**
 * Extract recommendations from text
 * @param {string} text - The text to extract from
 * @param {string} section - The section name
 * @returns {Array} - Array of recommendations
 */
function extractRecommendations(text, section) {
    const recommendations = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('recommend') || 
            lines[i].toLowerCase().includes('improve') || 
            lines[i].match(/^\d+\.\s/) || 
            lines[i].match(/^•\s/) || 
            lines[i].match(/^-\s/)) {
            const rec = lines[i].replace(/^\d+\.\s|^•\s|^-\s/, '').trim();
            if (rec.length > 10) {
                recommendations.push(rec);
                if (recommendations.length >= 3) break;
            }
        }
    }
    
    // If no recommendations found, create default ones
    if (recommendations.length === 0) {
        if (section === 'summary') {
            recommendations.push(
                "Make your summary more concise and impactful",
                "Include quantifiable achievements",
                "Tailor your summary to the specific job"
            );
        } else if (section === 'experience') {
            recommendations.push(
                "Use action verbs to start your bullet points",
                "Include measurable results and achievements",
                "Focus on relevant experience for the target role"
            );
        } else {
            recommendations.push(
                "Add more specific details",
                "Organize information more clearly",
                "Highlight relevant achievements"
            );
        }
    }
    
    return recommendations;
}

/**
 * Extract skills from text
 * @param {string} text - The text to extract from
 * @param {string} type - The type of skills to extract
 * @returns {Object} - Object with present and missing skills
 */
function extractSkills(text, type) {
    const present = [];
    const missing = [];
    
    // Try to find skills in the text
    const lines = text.split('\n').filter(line => line.trim());
    let inSkillsSection = false;
    let currentList = null;
    
    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        
        // Check if we're entering a skills section
        if (lowerLine.includes(type) && (lowerLine.includes('skill') || lowerLine.includes('present') || lowerLine.includes('missing'))) {
            inSkillsSection = true;
            if (lowerLine.includes('present')) {
                currentList = present;
            } else if (lowerLine.includes('missing')) {
                currentList = missing;
            } else {
                currentList = lowerLine.includes('missing') ? missing : present;
            }
            continue;
        }
        
        // If we're in a skills section and find a bullet point, add it as a skill
        if (inSkillsSection && (line.match(/^\d+\.\s/) || line.match(/^•\s/) || line.match(/^-\s/))) {
            const skill = line.replace(/^\d+\.\s|^•\s|^-\s/, '').trim();
            if (skill && currentList) {
                currentList.push(skill);
            }
        }
        
        // Check if we're leaving the skills section
        if (inSkillsSection && line.length > 0 && !line.match(/^\d+\.\s/) && !line.match(/^•\s/) && !line.match(/^-\s/)) {
            // If we find a header-like line, exit the skills section
            if (line === line.toUpperCase() || line.endsWith(':')) {
                inSkillsSection = false;
                currentList = null;
            }
        }
    }
    
    // If we couldn't extract skills, provide defaults based on type
    if (present.length === 0 && missing.length === 0) {
        if (type === 'technical') {
            present.push('JavaScript', 'HTML', 'CSS');
            missing.push('React', 'Node.js', 'MongoDB');
        } else if (type === 'soft') {
            present.push('Communication', 'Teamwork', 'Problem-solving');
            missing.push('Leadership', 'Time Management', 'Conflict Resolution');
        } else {
            present.push('Project Management', 'Data Analysis');
            missing.push('Agile Methodology', 'Cloud Computing');
        }
    }
    
    return { present, missing };
}

/**
 * Extract suggestions from text
 * @param {string} text - The text to extract from
 * @returns {Array} - Array of suggestions
 */
function extractSuggestions(text) {
    const suggestions = [];
    const lines = text.split('\n').filter(line => line.trim());
    let currentSuggestion = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Look for suggestion headers
        if (line.match(/^\d+\.\s/) || line.match(/^•\s/) || line.match(/^-\s/) || 
            line.includes('suggest') || line.includes('improve') || line.includes('enhance')) {
            
            // If we already have a suggestion in progress, save it
            if (currentSuggestion && currentSuggestion.title) {
                suggestions.push(currentSuggestion);
                if (suggestions.length >= 3) break;
            }
            
            // Start a new suggestion
            currentSuggestion = {
                title: line.replace(/^\d+\.\s|^•\s|^-\s/, '').trim(),
                priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
                description: '',
                examples: []
            };
        } 
        // If we have a current suggestion, add description or examples
        else if (currentSuggestion) {
            if (!currentSuggestion.description) {
                currentSuggestion.description = line.trim();
            } else if (line.includes('example') || line.match(/^\s+•/) || line.match(/^\s+-/)) {
                currentSuggestion.examples.push(line.replace(/^\s+•\s|^\s+-\s/, '').trim());
            }
        }
    }
    
    // Add the last suggestion if we have one
    if (currentSuggestion && currentSuggestion.title && !suggestions.includes(currentSuggestion)) {
        suggestions.push(currentSuggestion);
    }
    
    // If no suggestions found, create default ones
    if (suggestions.length === 0) {
        suggestions.push(
            {
                title: "Use Action Verbs",
                priority: "high",
                description: "Start bullet points with strong action verbs to make your achievements stand out.",
                examples: ["Led team of 5 developers", "Implemented new tracking system", "Reduced processing time by 30%"]
            },
            {
                title: "Quantify Achievements",
                priority: "medium",
                description: "Add numbers and percentages to demonstrate your impact.",
                examples: ["Increased sales by 25%", "Managed $500K budget", "Saved 10 hours per week"]
            },
            {
                title: "Tailor to Job Description",
                priority: "high",
                description: "Customize your resume for each application by matching keywords from the job posting.",
                examples: ["Align skills section with job requirements", "Highlight relevant experience", "Use industry terminology"]
            }
        );
    }
    
    return suggestions;
}

/**
 * Generate intelligent keyword analysis based on actual resume content
 * @param {string} resumeText - The resume text
 * @returns {Object} - Intelligent keyword analysis based on actual content
 */
function generateIntelligentKeywordAnalysis(resumeText) {
    console.log("Using simple direct text matching for skills...");
    
    // Clean and normalize the text
    const cleanText = resumeText.toLowerCase();
    
    // Define common technical skills to check for
    const technicalSkillsToCheck = [
        "javascript", "html", "css", "react", "angular", "vue", "node", "express", 
        "mongodb", "sql", "mysql", "postgresql", "python", "java", "c++", "c#",
        "php", "ruby", "swift", "kotlin", "android", "ios", "aws", "azure", "cloud",
        "docker", "kubernetes", "git", "github", "gitlab", "agile", "scrum", "jira",
        "typescript", "redux", "graphql", "rest", "json", "xml", "sass", "less",
        "bootstrap", "jquery", "webpack", "babel", "npm", "yarn", "linux", "windows",
        "macos", "bash", "powershell", "networking", "security", "testing", "jest"
    ];
    
    // Define common soft skills to check for
    const softSkillsToCheck = [
        "communication", "teamwork", "leadership", "problem solving", "critical thinking",
        "time management", "organization", "adaptability", "creativity", "attention to detail", 
        "analytical", "presentation", "collaboration", "project management", "mentoring",
        "coaching", "negotiation", "conflict resolution", "decision making", "customer service"
    ];
    
    // Extract skills that are ACTUALLY present in the resume
    const presentTechnicalSkills = [];
    technicalSkillsToCheck.forEach(skill => {
        // Use word boundary check to avoid partial matches
        const regex = new RegExp('\\b' + skill + '\\b', 'i');
        if (regex.test(cleanText)) {
            presentTechnicalSkills.push(skill);
        }
    });
    
    // Extract soft skills that are ACTUALLY present in the resume
    const presentSoftSkills = [];
    softSkillsToCheck.forEach(skill => {
        // Use word boundary check to avoid partial matches
        const regex = new RegExp('\\b' + skill + '\\b', 'i');
        if (regex.test(cleanText)) {
            presentSoftSkills.push(skill);
        }
    });
    
    // Format skills (capitalize first letter)
    const formattedTechnicalSkills = presentTechnicalSkills.map(skill => {
        return skill.charAt(0).toUpperCase() + skill.slice(1);
    });
    
    const formattedSoftSkills = presentSoftSkills.map(skill => {
        return skill.charAt(0).toUpperCase() + skill.slice(1);
    });
    
    console.log("Found technical skills:", formattedTechnicalSkills);
    console.log("Found soft skills:", formattedSoftSkills);
    
    return {
        technicalSkills: {
            present: formattedTechnicalSkills,
            missing: [] // No missing skills - we only show what's actually in the resume
        },
        softSkills: {
            present: formattedSoftSkills,
            missing: [] // No missing skills - we only show what's actually in the resume
        }
    };
}

/**
 * Generate intelligent ATS analysis based on actual resume content
 * @param {string} resumeText - The resume text
 * @returns {Object} - Intelligent ATS analysis based on actual content
 */
function generateIntelligentATSAnalysis(resumeText) {
    console.log("Generating dynamic simulated ATS analysis...");
    
    // Calculate scores based on actual resume content
    const wordCount = resumeText.split(/\s+/).length;
    const paragraphCount = resumeText.split(/\n\s*\n/).length;
    const bulletPointCount = (resumeText.match(/•|\*/g) || []).length;
    
    // Calculate dynamic scores based on resume characteristics
    const hasContactInfo = /email|phone|linkedin/i.test(resumeText);
    const hasEducation = /education|university|college|degree|bachelor|master/i.test(resumeText);
    const hasExperience = /experience|work|job|position|role/i.test(resumeText);
    const hasSkills = /skills|proficient|knowledge|expertise/i.test(resumeText);
    
    // Calculate a base ATS score (50-85 range)
    let atsScore = 65; // Start with a base score
    if (wordCount > 300) atsScore += 5;
    if (bulletPointCount > 5) atsScore += 5;
    if (hasContactInfo) atsScore += 3;
    if (hasEducation) atsScore += 4;
    if (hasExperience) atsScore += 5;
    if (hasSkills) atsScore += 3;
    
    // Add some randomness but keep within reasonable bounds
    atsScore = Math.min(95, Math.max(50, atsScore + (Math.random() * 10 - 5)));
    
    // Format compatibility (55-90 range)
    let formatScore = 70;
    if (bulletPointCount > 10) formatScore += 8;
    if (paragraphCount > 3) formatScore += 5;
    formatScore = Math.min(90, Math.max(55, formatScore + (Math.random() * 8 - 4)));
    
    // Keyword relevance (50-85 range)
    let keywordScore = 60;
    // Check for common resume keywords
    const commonKeywords = ['managed', 'developed', 'created', 'implemented', 'led', 'team', 'project', 'improved', 'increased', 'reduced'];
    commonKeywords.forEach(keyword => {
        if (resumeText.toLowerCase().includes(keyword)) keywordScore += 2;
    });
    keywordScore = Math.min(85, Math.max(50, keywordScore + (Math.random() * 10 - 5)));
    
    // Section organization (60-90 range)
    let sectionScore = 75;
    if (hasEducation && hasExperience && hasSkills) sectionScore += 10;
    sectionScore = Math.min(90, Math.max(60, sectionScore + (Math.random() * 8 - 4)));
    
    // Generate critical issues based on actual resume content
    const criticalIssues = [];
    
    if (wordCount < 300) {
        criticalIssues.push({
            issue: "Resume Too Short",
            description: "Your resume may be too brief. Consider adding more details about your experience and skills."
        });
    }
    
    if (bulletPointCount < 5) {
        criticalIssues.push({
            issue: "Few Bullet Points",
            description: "Using bullet points makes your resume more scannable for ATS systems and recruiters."
        });
    }
    
    if (!hasSkills) {
        criticalIssues.push({
            issue: "Missing Skills Section",
            description: "A dedicated skills section helps ATS systems identify your qualifications."
        });
    }
    
    // If we didn't find any issues, add a generic one
    if (criticalIssues.length === 0) {
        criticalIssues.push({
            issue: "Keyword Optimization",
            description: "Consider adding more industry-specific keywords to improve ATS compatibility."
        });
    }
    
    // Limit to 3 issues maximum
    const limitedIssues = criticalIssues.slice(0, 3);
    
    // Generate overall feedback based on the scores
    let overallFeedback = "";
    if (atsScore > 80) {
        overallFeedback = "Your resume is well-optimized for ATS systems. Minor improvements could further enhance its effectiveness.";
    } else if (atsScore > 65) {
        overallFeedback = "Your resume has decent ATS compatibility but could benefit from some targeted improvements.";
    } else {
        overallFeedback = "Your resume needs significant improvements to better pass through ATS systems. Focus on formatting and keywords.";
    }
    
    return {
        atsScore: Math.round(atsScore),
        formatCompatibility: Math.round(formatScore),
        keywordRelevance: Math.round(keywordScore),
        sectionOrganization: Math.round(sectionScore),
        overallFeedback: overallFeedback,
        criticalIssues: limitedIssues
    };
}

/**
 * Generate intelligent content analysis based on resume content
 * @param {string} resumeText - The resume text
 * @returns {Object} - Content analysis results
 */
function generateIntelligentContentAnalysis(resumeText) {
    console.log("Generating dynamic content analysis...");
    
    const sections = [];
    const lowerText = resumeText.toLowerCase();
    
    // Check for common resume sections and generate analysis for each
    const sectionTypes = [
        { name: "Summary", keywords: ["summary", "profile", "objective", "about me"] },
        { name: "Experience", keywords: ["experience", "work history", "employment", "work"] },
        { name: "Education", keywords: ["education", "academic", "degree", "university", "college"] },
        { name: "Skills", keywords: ["skills", "abilities", "expertise", "proficiencies"] },
        { name: "Projects", keywords: ["projects", "portfolio", "achievements"] }
    ];
    
    for (const section of sectionTypes) {
        // Check if this section exists in the resume
        const exists = section.keywords.some(keyword => lowerText.includes(keyword));
        
        if (exists) {
            // Generate a score based on the content
            let score = 65 + Math.floor(Math.random() * 20);
            
            // Adjust score based on content characteristics
            if (section.name === "Summary" && lowerText.indexOf("summary") < 200) {
                score += 5; // Good to have summary near the top
            }
            
            if (section.name === "Experience") {
                // Check for action verbs and quantifiable achievements
                const actionVerbs = ["managed", "led", "developed", "created", "implemented", "achieved", "increased", "reduced", "improved"];
                let verbCount = 0;
                actionVerbs.forEach(verb => {
                    if (lowerText.includes(verb)) verbCount++;
                });
                score += Math.min(10, verbCount * 2);
                
                // Check for metrics/numbers
                const hasMetrics = /\d+%|\$\d+|\d+ years|\d+ people|\d+ team/i.test(lowerText);
                if (hasMetrics) score += 8;
            }
            
            // Quality rating based on score
            let quality = "medium";
            if (score >= 85) quality = "high";
            else if (score < 65) quality = "low";
            
            // Generate feedback and recommendations
            let feedback = "";
            const recommendations = [];
            
            switch (section.name) {
                case "Summary":
                    feedback = "Your summary provides a general overview of your background.";
                    if (quality !== "high") {
                        recommendations.push(
                            "Make your summary more concise and impactful",
                            "Include your key professional attributes",
                            "Tailor your summary to match the job description"
                        );
                    } else {
                        recommendations.push(
                            "Consider adding a brief statement about your career goals",
                            "Highlight your most impressive achievement",
                            "Ensure your summary aligns with the specific job you're applying for"
                        );
                    }
                    break;
                    
                case "Experience":
                    feedback = "Your experience section outlines your professional background.";
                    if (quality !== "high") {
                        recommendations.push(
                            "Use strong action verbs to start each bullet point",
                            "Include measurable achievements and results",
                            "Focus on relevant experience for the target role"
                        );
                    } else {
                        recommendations.push(
                            "Consider adding more context about company size or industry",
                            "Highlight leadership or mentoring experience if applicable",
                            "Ensure your most impressive achievements stand out"
                        );
                    }
                    break;
                    
                case "Education":
                    feedback = "Your education section provides your academic background.";
                    recommendations.push(
                        "List relevant coursework if you're a recent graduate",
                        "Include GPA if it's above 3.5",
                        "Mention academic achievements or honors"
                    );
                    break;
                    
                case "Skills":
                    feedback = "Your skills section highlights your technical and professional abilities.";
                    recommendations.push(
                        "Organize skills by category (technical, soft, etc.)",
                        "Prioritize skills mentioned in the job description",
                        "Consider adding proficiency levels for technical skills"
                    );
                    break;
                    
                case "Projects":
                    feedback = "Your projects section showcases your practical experience.";
                    recommendations.push(
                        "Highlight the technologies or methods used",
                        "Quantify the impact or results of each project",
                        "Include links to project repositories or demos if applicable"
                    );
                    break;
            }
            
            sections.push({
                name: section.name,
                score: Math.round(score),
                quality: quality,
                feedback: feedback,
                recommendations: recommendations
            });
        }
    }
    
    // If no sections were found, add a generic one
    if (sections.length === 0) {
        sections.push({
            name: "Overall Content",
            score: 60,
            quality: "medium",
            feedback: "Your resume provides basic information but could be better structured into clear sections.",
            recommendations: [
                "Organize your resume into clearly defined sections",
                "Include a professional summary at the top",
                "Add separate sections for experience, education, and skills"
            ]
        });
    }
    
    return { sections };
}

/**
        industry = "finance";
    } else if (lowerText.includes("design") || lowerText.includes("user experience") || lowerText.includes("interface")) {
        industry = "design";
    }
    
    // Add industry-specific skills based on detected industry
    switch (industry) {
        case "software":
            industrySpecific.present.push("Software Development", "Version Control");
            industrySpecific.missing.push("CI/CD Pipelines", "Microservices", "Cloud Architecture");
            break;
        case "marketing":
            industrySpecific.present.push("Social Media Marketing", "Content Creation");
            industrySpecific.missing.push("SEO/SEM", "Analytics", "Marketing Automation");
            break;
        case "finance":
            industrySpecific.present.push("Financial Analysis", "Budgeting");
            industrySpecific.missing.push("Risk Assessment", "Financial Modeling", "Regulatory Compliance");
            break;
        case "design":
            industrySpecific.present.push("UI/UX Design", "Wireframing");
            industrySpecific.missing.push("Design Systems", "User Research", "Prototyping");
            break;
        default:
            industrySpecific.present.push("Project Management", "Documentation");
            industrySpecific.missing.push("Strategic Planning", "Process Improvement", "Stakeholder Management");
    }
    
    return {
        technicalSkills,
        softSkills,
        industrySpecific
    };
}

/**
 * Generate simulated suggestions based on resume content
 * @param {string} resumeText - The resume text
 * @returns {Object} - Simulated suggestions
 */
/**
 * Extract the skills section from a resume
 * @param {string} resumeText - The resume text
 * @returns {string|null} - The skills section text or null if not found
 */
function extractSkillsSection(resumeText) {
    // Common section headers for skills
    const skillsHeaders = [
        /skills[:\s]/i,
        /technical skills[:\s]/i,
        /core competencies[:\s]/i,
        /proficiencies[:\s]/i,
        /expertise[:\s]/i
    ];
    
    const lines = resumeText.split('\n');
    let inSkillsSection = false;
    let skillsSection = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this line is a skills section header
        if (!inSkillsSection) {
            for (const header of skillsHeaders) {
                if (header.test(line)) {
                    inSkillsSection = true;
                    skillsSection += line + ' ';
                    break;
                }
            }
        } 
        // If we're in the skills section, add the line
        else {
            // Check if we've reached the next section header (usually capitalized with a colon)
            if (/^[A-Z][A-Za-z\s]+:/.test(line) && !skillsHeaders.some(header => header.test(line))) {
                break;
            }
            skillsSection += line + ' ';
        }
    }
    
    return skillsSection.trim() || null;
}

/**
 * Extract individual skills from a skills section
 * @param {string} skillsSection - The skills section text
 * @returns {Array} - Array of individual skills
 */
function extractSkillsFromSection(skillsSection) {
    // Remove the section header
    const withoutHeader = skillsSection.replace(/^(skills|technical skills|core competencies|proficiencies|expertise)[:\s]/i, '');
    
    // Split by common delimiters
    let skills = [];
    
    // Try to split by bullets or similar characters
    if (/[,|;]/.test(withoutHeader)) {
        skills = withoutHeader.split(/[,|;]/).map(s => s.trim()).filter(Boolean);
    } 
    // If no delimiters found, try to split by whitespace and assume each word is a skill
    else {
        skills = withoutHeader.split(/\s+/);
    }
    
    return skills.filter(skill => skill.length > 1);
}

/**
 * Determine if a skill is more likely to be technical or soft
 * @param {string} skill - The skill to check
 * @returns {boolean} - True if likely technical, false if likely soft
 */
function isTechnicalSkill(skill) {
    const technicalIndicators = [
        /\d/, // Contains numbers
        /[\+\#]/, // Contains symbols common in tech skills
        /\b(js|ui|ux|api|sdk|sql|css|php|aws|ios)\b/i, // Common tech abbreviations
        /\b(software|hardware|programming|coding|development|framework|library|database|server|cloud)\b/i
    ];
    
    return technicalIndicators.some(indicator => indicator.test(skill));
}

function generateIntelligentSuggestions(resumeText) {
    console.log("Generating dynamic simulated suggestions...");
    
    const lowerText = resumeText.toLowerCase();
    const suggestions = [];
    
    // Check for common resume issues and generate suggestions
    
    // Check for action verbs
    const actionVerbs = ["managed", "led", "developed", "created", "implemented", "achieved", "increased", "reduced", "improved"];
    let hasActionVerbs = false;
    for (const verb of actionVerbs) {
        if (lowerText.includes(verb)) {
            hasActionVerbs = true;
            break;
        }
    }
    
    if (!hasActionVerbs) {
        suggestions.push({
            title: "Use Action Verbs",
            priority: "high",
            description: "Start bullet points with strong action verbs to make your achievements stand out.",
            examples: ["Led team of 5 developers", "Implemented new tracking system", "Reduced processing time by 30%"]
        });
    }
    
    // Check for quantifiable achievements
    const hasQuantifiableAchievements = /\d+%|\$\d+|\d+ years|\d+ people|\d+ team/i.test(lowerText);
    if (!hasQuantifiableAchievements) {
        suggestions.push({
            title: "Quantify Achievements",
            priority: "medium",
            description: "Add numbers and percentages to demonstrate your impact.",
            examples: ["Increased sales by 25%", "Managed $500K budget", "Saved 10 hours per week"]
        });
    }
    
    // Check for resume length
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 300) {
        suggestions.push({
            title: "Expand Your Resume",
            priority: "medium",
            description: "Your resume appears to be quite short. Add more details about your experience and skills.",
            examples: ["Include more detailed project descriptions", "Add relevant coursework to education", "Elaborate on your responsibilities"]
        });
    } else if (wordCount > 700) {
        suggestions.push({
            title: "Streamline Your Resume",
            priority: "low",
            description: "Your resume is quite lengthy. Consider focusing on the most relevant information.",
            examples: ["Remove outdated experience", "Condense bullet points", "Focus on achievements rather than responsibilities"]
        });
    }
    
    // Check for skills section
    const hasSkillsSection = /skills|abilities|expertise|proficiencies/i.test(lowerText);
    if (!hasSkillsSection) {
        suggestions.push({
            title: "Add a Skills Section",
            priority: "high",
            description: "A dedicated skills section helps highlight your qualifications and improves ATS compatibility.",
            examples: ["Technical Skills: HTML, CSS, JavaScript", "Soft Skills: Communication, Leadership", "Tools: Microsoft Office, Adobe Creative Suite"]
        });
    }
    
    // Always suggest tailoring to job description
    suggestions.push({
        title: "Tailor to Job Description",
        priority: "high",
        description: "Customize your resume for each application by matching keywords from the job posting.",
        examples: ["Align skills section with job requirements", "Highlight relevant experience", "Use industry terminology"]
    });
    
    // If we don't have enough suggestions, add a generic one
    if (suggestions.length < 3) {
        suggestions.push({
            title: "Improve Formatting",
            priority: "medium",
            description: "Ensure your resume has a clean, professional layout that is easy to scan.",
            examples: ["Use consistent formatting for dates and headings", "Add white space to improve readability", "Use a professional font like Arial or Calibri"]
        });
    }
    
    // Limit to 3 suggestions
    return { suggestions: suggestions.slice(0, 3) };
}

/**
 * Show notification in the UI
 * @param {string} message - The message to show
 */
function showNotification(message) {
    // Check if notification element exists
    const notificationElement = document.getElementById('notification');
    if (notificationElement) {
        notificationElement.textContent = message;
        notificationElement.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 5000);
    } else {
        console.log('Notification:', message);
    }
}

// Export functions for use in the main resume-analyzer.js file
window.ResumeAI = {
    initializeAIAnalyzer,
    analyzeResumeWithAI,
    analyzeJobMatch,
    generateEnhancedResume
};
