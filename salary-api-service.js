/**
 * Salary API Service
 * This service handles fetching real-time salary data using OpenRouter API
 */

class SalaryApiService {
    constructor() {
        // OpenRouter API settings
        this.apiKey = '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';
        this.apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
        
        // Cache settings
        this.cacheExpiration = 15 * 60 * 1000; // 15 minutes in milliseconds
        this.cachedData = null;
        this.lastFetchTime = null;
    }

    /**
     * Fetch salary data based on filters
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} - Salary data
     */
    async getSalaryData(filters = {}) {
        try {
            // Check if we have valid cached data
            if (this.cachedData && this.lastFetchTime && 
                (Date.now() - this.lastFetchTime < this.cacheExpiration)) {
                console.log('Using cached salary data');
                return this.filterCachedData(this.cachedData, filters);
            }
            
            // Fetch from OpenRouter API
            const data = await this.fetchFromOpenRouter(filters);
            
            // Update cache
            this.cachedData = data;
            this.lastFetchTime = Date.now();
            
            return data;
        } catch (error) {
            console.error('Error fetching real-time salary data:', error);
            
            // If API fails, return mock data with a warning flag
            const mockData = this.getMockData();
            mockData.isFromMockData = true;
            return mockData;
        }
    }

    /**
     * Fetch data from OpenRouter API
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} - Salary data
     */
    async fetchFromOpenRouter(filters) {
        // Create a prompt based on filters
        const prompt = this.createPrompt(filters);
        
        // Prepare request options
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Juno Salary Insights'
            },
            body: JSON.stringify({
                model: "anthropic/claude-3-haiku",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" }
            })
        };
        
        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(this.apiEndpoint, { 
                ...requestOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const responseData = await response.json();
            
            // Parse the AI response to extract salary data
            const salaryData = this.parseSalaryDataFromResponse(responseData, filters);
            return salaryData;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Create a prompt for the OpenRouter API based on filters
     * @param {Object} filters - Filter criteria
     * @returns {string} - Prompt text
     */
    createPrompt(filters) {
        let prompt = `Generate realistic and up-to-date salary data for tech professionals in JSON format. `;
        
        // Add filter context if available
        if (filters.role) {
            prompt += `Focus on the role: ${filters.role}. `;
        }
        
        if (filters.experience && filters.experience !== 'all') {
            prompt += `For experience level: ${filters.experience}. `;
        }
        
        if (filters.location && filters.location !== 'all') {
            prompt += `In location: ${filters.location}. `;
        }
        
        if (filters.industry && filters.industry !== 'all') {
            prompt += `For the ${filters.industry} industry. `;
        }
        
        // Specify the exact format needed
        prompt += `
        Return ONLY a JSON array of salary data objects with NO explanations or other text. Each object should have the following structure:
        {
            "role": "Job Title",
            "experience": "Experience Level (e.g., 'Fresher (0-1 yr)', 'Junior (1-3 yrs)', etc.)",
            "location": "City or Country",
            "industry": "Industry Type",
            "avgSalary": number (average salary in lakhs for India, thousands for global),
            "minSalary": number (minimum typical salary),
            "maxSalary": number (maximum typical salary),
            "growthRate": number (YoY growth percentage),
            "companies": {
                "Company1": number (salary in same units as avgSalary),
                "Company2": number,
                ...
            }
        }
        
        Include data for at least 5 different roles with realistic salary figures based on current market trends. For Indian locations, provide salaries in Lakhs Per Annum (LPA). For global locations, provide salaries in thousands USD.
        
        Include the following companies in the data: Google, Microsoft, Amazon, TCS, Infosys, Wipro, Accenture.
        
        Make sure the data reflects realistic market conditions as of 2025, with appropriate salary ranges and growth rates.`;
        
        return prompt;
    }

    /**
     * Parse the OpenRouter API response to extract salary data
     * @param {Object} response - API response
     * @param {Object} filters - Original filters used
     * @returns {Array} - Parsed salary data
     */
    parseSalaryDataFromResponse(response, filters) {
        try {
            // Extract the content from the response
            const content = response.choices[0].message.content;
            
            // Parse the JSON from the content
            let salaryData;
            
            try {
                // Try to parse the entire content as JSON
                salaryData = JSON.parse(content);
            } catch (e) {
                // If that fails, try to extract JSON from the content using regex
                const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
                if (jsonMatch) {
                    salaryData = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Could not extract JSON from response');
                }
            }
            
            // Ensure the data has the expected format
            if (!Array.isArray(salaryData)) {
                throw new Error('Response is not an array');
            }
            
            // Add timestamp to the data
            salaryData.timestamp = new Date().toISOString();
            
            return salaryData;
        } catch (error) {
            console.error('Error parsing salary data from response:', error);
            throw error;
        }
    }

    /**
     * Filter cached data based on provided filters
     * @param {Array} data - Cached data
     * @param {Object} filters - Filter criteria
     * @returns {Array} - Filtered data
     */
    filterCachedData(data, filters) {
        if (Object.keys(filters).length === 0) {
            return data;
        }
        
        return data.filter(item => {
            let match = true;
            
            if (filters.role && !item.role.toLowerCase().includes(filters.role.toLowerCase())) {
                match = false;
            }
            
            if (filters.experience !== 'all' && item.experience !== filters.experience) {
                match = false;
            }
            
            if (filters.location !== 'all' && item.location !== filters.location) {
                match = false;
            }
            
            if (filters.industry !== 'all' && item.industry !== filters.industry) {
                match = false;
            }
            
            return match;
        });
    }

    /**
     * Get mock data if API calls fail
     * @returns {Array} - Mock salary data
     */
    getMockData() {
        return window.mockSalaryData || []; // Fallback to the existing mock data
    }

    /**
     * Force refresh the data cache
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} - Fresh salary data
     */
    async forceRefresh(filters = {}) {
        // Invalidate cache
        this.lastFetchTime = null;
        this.cachedData = null;
        
        // Fetch fresh data
        return await this.getSalaryData(filters);
    }
}

// Create a singleton instance
const salaryApiService = new SalaryApiService();
