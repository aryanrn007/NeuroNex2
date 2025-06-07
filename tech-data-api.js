/**
 * Tech Data API Integration
 * Fetches real-time technology data and news using OpenRouter API
 */

// API configuration
const API_CONFIG = {
    apiKey: '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',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: {
        default: 'anthropic/claude-3-opus-20240229'
    }
};

// Cache for API responses to avoid excessive calls
const responseCache = {
    data: {},
    timestamp: {},
    // Cache expiration in minutes
    expirationTime: 30
};

/**
 * Fetch real-time technology data based on category
 * @param {string} category - Technology category (coding, algorithms, database, system)
 * @param {boolean} [forceFresh=false] - Force fresh data fetch, bypassing cache
 * @returns {Promise<Object>} - Technology data
 */
async function fetchTechData(category, forceFresh = false) {
    // Track analytics
    trackDataRequest(category, forceFresh);
    
    // Check cache first unless force fresh is specified
    if (!forceFresh && isCacheValid(category)) {
        console.log(`Using cached data for ${category}`);
        return responseCache.data[category];
    }
    
    try {
        // Show in console that we're fetching fresh data
        console.log(`Fetching fresh ${category} data from API${forceFresh ? ' (forced)' : ''}`);
        
        // Generate appropriate prompt for this category
        const prompt = generatePromptForCategory(category);
        
        // Add random request ID for tracking and debugging
        const requestId = generateRequestId();
        console.log(`API Request ID: ${requestId} for ${category}`);
        
        // Fetch data with timeout and retry logic
        const response = await fetchFromOpenRouterWithRetry(prompt, requestId);
        
        // Parse and process the response
        const processedData = processApiResponse(response, category);
        
        // Add timestamp and request metadata
        processedData.metadata = {
            fetchedAt: new Date().toISOString(),
            requestId: requestId,
            source: 'OpenRouter API',
            category: category
        };
        
        // Update cache
        responseCache.data[category] = processedData;
        responseCache.timestamp[category] = Date.now();
        
        // Log success
        console.log(`Successfully fetched and processed ${category} data`);
        
        return processedData;
    } catch (error) {
        console.error(`Error fetching tech data for ${category}:`, error);
        
        // Log the error for analytics
        logApiError(category, error);
        
        // Check if we have cached data even if it's expired
        if (responseCache.data[category]) {
            console.log(`Using expired cache for ${category} due to API error`);
            return responseCache.data[category];
        }
        
        // Return fallback data if API call fails and no cache exists
        return getFallbackData(category);
    }
}

/**
 * Check if cached data is still valid
 * @param {string} category - Technology category
 * @returns {boolean} - Whether cache is valid
 */
function isCacheValid(category) {
    if (!responseCache.data[category] || !responseCache.timestamp[category]) {
        return false;
    }
    
    const now = Date.now();
    const cacheTime = responseCache.timestamp[category];
    const expirationMs = responseCache.expirationTime * 60 * 1000;
    
    return (now - cacheTime) < expirationMs;
}

/**
 * Generate appropriate prompt for each category
 * @param {string} category - Technology category
 * @returns {string} - Prompt for API
 */
function generatePromptForCategory(category) {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const prompts = {
        coding: `As of ${currentDate}, provide the following data about programming languages in JSON format:
1. Current popularity ranking of top 5 programming languages with percentage market share
2. Trending languages in the last 6 months with growth percentage
3. Average salaries for developers by language
4. Most in-demand frameworks for each language
5. Three latest significant news about programming languages
Format as valid JSON with these keys: popularity, trending, salaries, frameworks, news`,

        algorithms: `As of ${currentDate}, provide the following data about algorithms and data structures in JSON format:
1. Most frequently asked algorithm questions in technical interviews (top 5)
2. Trending algorithm topics in research with brief description
3. Algorithm efficiency benchmarks for common problems
4. Companies known for algorithm-heavy interviews with their focus areas
5. Three latest significant news or research breakthroughs about algorithms
Format as valid JSON with these keys: interviewQuestions, researchTrends, benchmarks, companies, news`,

        database: `As of ${currentDate}, provide the following data about database technologies in JSON format:
1. Current market share of top database systems with percentage
2. Trending database technologies with growth metrics
3. Average salaries for database specialists by technology
4. Performance benchmarks of popular database systems
5. Three latest significant news about database technologies
Format as valid JSON with these keys: marketShare, trending, salaries, performance, news`,

        system: `As of ${currentDate}, provide the following data about system design and architecture in JSON format:
1. Current popular system architecture patterns with adoption rates
2. Trending cloud services and technologies with growth metrics
3. Average salaries for system architects and DevOps engineers
4. Scalability benchmarks for different architecture approaches
5. Three latest significant news about system design and architecture
Format as valid JSON with these keys: patterns, cloudTrends, salaries, scalability, news`
    };
    
    return prompts[category] || prompts.coding;
}

/**
 * Fetch data from OpenRouter API
 * @param {string} prompt - Prompt to send to API
 * @param {string} [requestId] - Optional request ID for tracking
 * @returns {Promise<Object>} - API response
 */
async function fetchFromOpenRouter(prompt, requestId = null) {
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const startTime = Date.now();
        console.log(`API request started${requestId ? ` (ID: ${requestId})` : ''}`);
        
        const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`,
                'X-Request-ID': requestId || generateRequestId(),
                'X-Client-Info': 'Juno Tech Data Visualization'
            },
            body: JSON.stringify({
                model: API_CONFIG.models.default,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500,
                stream: false
            }),
            signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        // Log response time
        const responseTime = Date.now() - startTime;
        console.log(`API response received in ${responseTime}ms`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Handle abort errors specifically
        if (error.name === 'AbortError') {
            throw new Error('API request timed out after 15 seconds');
        }
        
        console.error('Error fetching from OpenRouter:', error);
        throw error;
    }
}

/**
 * Process and extract relevant data from API response
 * @param {Object} response - API response
 * @param {string} category - Technology category
 * @returns {Object} - Processed data
 */
function processApiResponse(response, category) {
    try {
        // Extract the content from the API response
        const content = response.choices[0].message.content;
        
        // Parse JSON from the content
        // Look for JSON in the response - it might be wrapped in markdown code blocks
        let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                       content.match(/```\n([\s\S]*?)\n```/) ||
                       content.match(/{[\s\S]*}/);
        
        let jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
        
        // Clean up any non-JSON content
        jsonContent = jsonContent.replace(/```json|```/g, '').trim();
        
        // Parse the JSON
        const parsedData = JSON.parse(jsonContent);
        
        // Add timestamp
        parsedData.timestamp = new Date().toISOString();
        parsedData.category = category;
        
        return parsedData;
    } catch (error) {
        console.error('Error processing API response:', error);
        // Return fallback data if processing fails
        return getFallbackData(category);
    }
}

/**
 * Get fallback data if API call fails
 * @param {string} category - Technology category
 * @returns {Object} - Fallback data
 */
function getFallbackData(category) {
    const timestamp = new Date().toISOString();
    
    const fallbackData = {
        coding: {
            popularity: [
                { language: "JavaScript", share: 24.3 },
                { language: "Python", share: 19.6 },
                { language: "Java", share: 17.1 },
                { language: "C#", share: 8.4 },
                { language: "PHP", share: 6.7 }
            ],
            trending: [
                { language: "Rust", growth: 26.5 },
                { language: "TypeScript", growth: 21.2 },
                { language: "Go", growth: 16.4 }
            ],
            salaries: [
                { language: "Scala", salary: 150000 },
                { language: "Go", salary: 140000 },
                { language: "Rust", salary: 135000 },
                { language: "Python", salary: 130000 },
                { language: "JavaScript", salary: 120000 }
            ],
            frameworks: [
                { language: "JavaScript", frameworks: ["React", "Vue", "Angular"] },
                { language: "Python", frameworks: ["Django", "Flask", "FastAPI"] },
                { language: "Java", frameworks: ["Spring", "Hibernate", "Jakarta EE"] }
            ],
            news: [
                { title: "TypeScript 5.0 Released with Major Performance Improvements", date: "2023-03-20" },
                { title: "Python Continues to Dominate Data Science and AI Development", date: "2023-02-15" },
                { title: "WebAssembly Adoption Accelerates Across Industries", date: "2023-01-30" }
            ],
            timestamp: timestamp,
            category: "coding"
        },
        algorithms: {
            interviewQuestions: [
                { name: "Two Sum Problem", difficulty: "Easy", frequency: "Very High" },
                { name: "Reverse Linked List", difficulty: "Easy", frequency: "High" },
                { name: "Binary Tree Level Order Traversal", difficulty: "Medium", frequency: "High" },
                { name: "Merge Intervals", difficulty: "Medium", frequency: "High" },
                { name: "LRU Cache Implementation", difficulty: "Hard", frequency: "Medium" }
            ],
            researchTrends: [
                { topic: "Quantum Algorithms", description: "Algorithms designed for quantum computers" },
                { topic: "Federated Learning", description: "Machine learning across decentralized devices" },
                { topic: "Graph Neural Networks", description: "Neural networks for graph-structured data" }
            ],
            benchmarks: [
                { algorithm: "QuickSort", complexity: "O(n log n)", performance: "Excellent for most cases" },
                { algorithm: "Dijkstra's Algorithm", complexity: "O((V+E)log V)", performance: "Optimal for shortest path" },
                { algorithm: "Dynamic Programming", complexity: "Varies", performance: "Excellent for optimization problems" }
            ],
            companies: [
                { name: "Google", focus: ["Graph Algorithms", "Dynamic Programming"] },
                { name: "Facebook", focus: ["Array Manipulation", "System Design"] },
                { name: "Amazon", focus: ["Trees", "Dynamic Programming"] }
            ],
            news: [
                { title: "New Linear-Time Algorithm for Maximum Flow Problem Discovered", date: "2023-04-10" },
                { title: "Advances in Quantum Algorithms Show Promise for Cryptography", date: "2023-03-05" },
                { title: "Machine Learning Algorithms Achieve New Benchmark in Protein Folding", date: "2023-02-20" }
            ],
            timestamp: timestamp,
            category: "algorithms"
        },
        database: {
            marketShare: [
                { database: "Oracle", share: 27.2 },
                { database: "MySQL", share: 19.8 },
                { database: "Microsoft SQL Server", share: 15.6 },
                { database: "PostgreSQL", share: 12.9 },
                { database: "MongoDB", share: 5.3 }
            ],
            trending: [
                { database: "Snowflake", growth: 32.1 },
                { database: "Clickhouse", growth: 28.7 },
                { database: "Fauna", growth: 23.4 }
            ],
            salaries: [
                { role: "Database Architect", salary: 160000 },
                { role: "Data Engineer", salary: 140000 },
                { role: "Database Administrator", salary: 120000 }
            ],
            performance: [
                { database: "Redis", metric: "Read Operations", score: 95 },
                { database: "Cassandra", metric: "Write Operations", score: 92 },
                { database: "PostgreSQL", metric: "Complex Queries", score: 88 }
            ],
            news: [
                { title: "Snowflake Announces New Serverless Database Features", date: "2023-04-15" },
                { title: "MongoDB Atlas Expands Multi-Cloud Capabilities", date: "2023-03-22" },
                { title: "PostgreSQL 15 Released with Performance Improvements", date: "2023-02-10" }
            ],
            timestamp: timestamp,
            category: "database"
        },
        system: {
            patterns: [
                { pattern: "Microservices", adoption: 68.4 },
                { pattern: "Serverless Architecture", adoption: 42.7 },
                { pattern: "Event-Driven Architecture", adoption: 39.2 }
            ],
            cloudTrends: [
                { service: "Kubernetes", growth: 35.8 },
                { service: "Serverless Functions", growth: 29.4 },
                { service: "Service Mesh", growth: 24.1 }
            ],
            salaries: [
                { role: "Cloud Architect", salary: 170000 },
                { role: "DevOps Engineer", salary: 145000 },
                { role: "Site Reliability Engineer", salary: 155000 }
            ],
            scalability: [
                { approach: "Horizontal Scaling with Kubernetes", score: 92 },
                { approach: "Serverless Architecture", score: 88 },
                { approach: "Vertical Scaling with Cloud Instances", score: 75 }
            ],
            news: [
                { title: "AWS Announces New Multi-Region Resilience Service", date: "2023-04-20" },
                { title: "Google Cloud Enhances Its Service Mesh Offerings", date: "2023-03-15" },
                { title: "Microsoft Azure Introduces New Serverless Database Options", date: "2023-02-25" }
            ],
            timestamp: timestamp,
            category: "system"
        }
    };
    
    return fallbackData[category] || fallbackData.coding;
}

/**
 * Fetch from OpenRouter API with retry logic
 * @param {string} prompt - Prompt to send to API
 * @param {string} requestId - Unique request ID for tracking
 * @returns {Promise<Object>} - API response
 */
async function fetchFromOpenRouterWithRetry(prompt, requestId) {
    const maxRetries = 2;
    let retryCount = 0;
    let lastError = null;
    
    while (retryCount <= maxRetries) {
        try {
            // Add exponential backoff for retries
            if (retryCount > 0) {
                const backoffTime = Math.pow(2, retryCount) * 1000;
                console.log(`Retry ${retryCount}/${maxRetries} after ${backoffTime}ms delay...`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
            }
            
            return await fetchFromOpenRouter(prompt, requestId);
        } catch (error) {
            lastError = error;
            console.warn(`API request failed (attempt ${retryCount + 1}/${maxRetries + 1}):`, error.message);
            retryCount++;
        }
    }
    
    // If we've exhausted all retries, throw the last error
    throw lastError || new Error('Failed to fetch data after multiple attempts');
}

/**
 * Generate a unique request ID
 * @returns {string} - Unique request ID
 */
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Track data request for analytics
 * @param {string} category - Technology category
 * @param {boolean} forceFresh - Whether cache was bypassed
 */
function trackDataRequest(category, forceFresh) {
    // In a real implementation, this would send analytics data to a server
    console.log(`[Analytics] Data request: ${category}, forceFresh: ${forceFresh}`);
    
    // Track user interaction patterns
    if (!window.techDataAnalytics) {
        window.techDataAnalytics = {
            requests: [],
            categories: {}
        };
    }
    
    // Add request to history
    window.techDataAnalytics.requests.push({
        timestamp: Date.now(),
        category: category,
        forceFresh: forceFresh
    });
    
    // Update category counts
    if (!window.techDataAnalytics.categories[category]) {
        window.techDataAnalytics.categories[category] = 0;
    }
    window.techDataAnalytics.categories[category]++;
}

/**
 * Log API errors for monitoring
 * @param {string} category - Technology category
 * @param {Error} error - Error object
 */
function logApiError(category, error) {
    // In a real implementation, this would send error logs to a server
    console.error(`[Error Log] API error for ${category}:`, error.message);
    
    // Track errors for potential reporting
    if (!window.techDataAnalytics) {
        window.techDataAnalytics = {
            errors: []
        };
    }
    
    if (!window.techDataAnalytics.errors) {
        window.techDataAnalytics.errors = [];
    }
    
    window.techDataAnalytics.errors.push({
        timestamp: Date.now(),
        category: category,
        message: error.message,
        stack: error.stack
    });
}

// Export functions for use in other files
window.techDataApi = {
    fetchTechData,
    getFallbackData,
    // Expose analytics for debugging
    getAnalytics: () => window.techDataAnalytics || {}
};
