/**
 * Tech Data Visualization
 * Creates charts and visualizations for tech data
 */

// Chart configuration and colors
const CHART_CONFIG = {
    colors: {
        primary: ['rgba(103, 58, 183, 0.8)', 'rgba(156, 39, 176, 0.8)', 'rgba(33, 150, 243, 0.8)'],
        secondary: ['rgba(103, 58, 183, 0.4)', 'rgba(156, 39, 176, 0.4)', 'rgba(33, 150, 243, 0.4)'],
        background: ['rgba(103, 58, 183, 0.1)', 'rgba(156, 39, 176, 0.1)', 'rgba(33, 150, 243, 0.1)']
    },
    fontFamily: "'Poppins', sans-serif",
    animation: {
        duration: 1500,
        easing: 'easeOutQuart'
    }
};

// Store chart instances to destroy when needed
const chartInstances = {};

/**
 * Initialize data visualizations for a specific category
 * @param {string} category - Technology category
 * @param {Object} data - Technology data
 * @param {HTMLElement} container - Container element for visualizations
 */
function initDataVisualizations(category, data, container) {
    // Clear previous content
    container.innerHTML = '';
    
    // Create real-time data section
    const realTimeSection = document.createElement('div');
    realTimeSection.className = 'real-time-data-section';
    container.appendChild(realTimeSection);
    
    // Add last updated timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'data-timestamp';
    const date = new Date(data.timestamp);
    timestamp.innerHTML = `<i class="fas fa-sync-alt"></i> Last updated: ${date.toLocaleString()}`;
    realTimeSection.appendChild(timestamp);
    
    // Add refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'refresh-data-btn';
    refreshBtn.innerHTML = '<i class="fas fa-redo-alt"></i> Refresh Data';
    refreshBtn.addEventListener('click', () => refreshData(category, container));
    realTimeSection.appendChild(refreshBtn);
    
    // Create visualizations based on category
    switch(category) {
        case 'coding':
            createCodingVisualizations(data, container);
            break;
        case 'algorithms':
            createAlgorithmsVisualizations(data, container);
            break;
        case 'database':
            createDatabaseVisualizations(data, container);
            break;
        case 'system':
            createSystemVisualizations(data, container);
            break;
        default:
            createCodingVisualizations(data, container);
    }
    
    // Add news section
    createNewsSection(data.news, container);
}

/**
 * Refresh data for a category
 * @param {string} category - Technology category
 * @param {HTMLElement} container - Container element for visualizations
 */
async function refreshData(category, container) {
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Refreshing data...</p>';
    container.innerHTML = '';
    container.appendChild(loadingIndicator);
    
    try {
        // Fetch fresh data
        const data = await window.techDataApi.fetchTechData(category);
        
        // Initialize visualizations with new data
        initDataVisualizations(category, data, container);
    } catch (error) {
        console.error('Error refreshing data:', error);
        container.innerHTML = '<div class="error-message">Failed to refresh data. Please try again later.</div>';
    }
}

/**
 * Create visualizations for coding category
 * @param {Object} data - Coding data
 * @param {HTMLElement} container - Container element
 */
function createCodingVisualizations(data, container) {
    // Create language popularity chart
    createChart('popularity-chart', 'bar', container, {
        title: 'Programming Language Popularity',
        labels: data.popularity.map(item => item.language),
        datasets: [{
            label: 'Market Share (%)',
            data: data.popularity.map(item => item.share),
            backgroundColor: CHART_CONFIG.colors.primary
        }]
    });
    
    // Create trending languages chart with direct DOM manipulation
    if (data.trending && data.trending.length > 0) {
        // Create trending container with fixed height
        const trendingContainer = document.createElement('div');
        trendingContainer.className = 'trending-chart-container';
        container.appendChild(trendingContainer);
        
        // Add title
        const title = document.createElement('h4');
        title.textContent = 'Trending Languages (Growth %)';
        trendingContainer.appendChild(title);
        
        // Create a simple bar chart using DOM elements instead of Canvas
        const chartDiv = document.createElement('div');
        chartDiv.className = 'horizontal-bar-chart';
        trendingContainer.appendChild(chartDiv);
        
        // Sort trending data by growth (descending)
        const sortedData = [...data.trending].sort((a, b) => b.growth - a.growth);
        
        // Create bars for each language
        sortedData.forEach(item => {
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';
            chartDiv.appendChild(barContainer);
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'bar-label';
            labelDiv.textContent = item.language;
            barContainer.appendChild(labelDiv);
            
            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-wrapper';
            barContainer.appendChild(barWrapper);
            
            const barDiv = document.createElement('div');
            barDiv.className = 'bar';
            barDiv.style.width = `${Math.min(item.growth * 3, 100)}%`; // Scale for better visualization
            barDiv.style.backgroundColor = CHART_CONFIG.colors.primary[0];
            barWrapper.appendChild(barDiv);
            
            const valueDiv = document.createElement('div');
            valueDiv.className = 'bar-value';
            valueDiv.textContent = `${item.growth}%`;
            barWrapper.appendChild(valueDiv);
        });
    }
    
    // Create salary comparison chart
    createChart('salary-chart', 'bar', container, {
        title: 'Average Developer Salaries by Language',
        labels: data.salaries.map(item => item.language),
        datasets: [{
            label: 'Salary (USD)',
            data: data.salaries.map(item => item.salary),
            backgroundColor: CHART_CONFIG.colors.primary
        }]
    });
    
    // Create frameworks section
    createFrameworksSection(data.frameworks, container);
}

/**
 * Create visualizations for algorithms category
 * @param {Object} data - Algorithms data
 * @param {HTMLElement} container - Container element
 */
function createAlgorithmsVisualizations(data, container) {
    // Check if trending data exists and create trending chart
    if (data.trending && data.trending.length > 0) {
        createChart('trending-algorithms-chart', 'horizontalBar', container, {
            title: 'Trending Algorithms (Growth %)',
            labels: data.trending.map(item => item.algorithm || item.name || 'Unknown'),
            datasets: [{
                label: 'Growth (%)',
                data: data.trending.map(item => item.growth || 0),
                backgroundColor: CHART_CONFIG.colors.primary
            }]
        });
    }
    
    // Check if popularity data exists and create popularity chart
    if (data.popularity && data.popularity.length > 0) {
        createChart('algorithm-popularity-chart', 'bar', container, {
            title: 'Algorithm Popularity in Technical Interviews',
            labels: data.popularity.map(item => item.algorithm || item.name || 'Unknown'),
            datasets: [{
                label: 'Usage (%)',
                data: data.popularity.map(item => item.usage || item.share || 0),
                backgroundColor: CHART_CONFIG.colors.primary
            }]
        });
    }
    
    // Create interview questions table if data exists
    if (data.interviewQuestions && data.interviewQuestions.length > 0) {
        createDataTable('interview-questions', container, {
            title: 'Most Frequently Asked Algorithm Questions',
            headers: ['Algorithm', 'Difficulty', 'Frequency'],
            rows: data.interviewQuestions.map(item => [
                item.name,
                item.difficulty,
                item.frequency
            ])
        });
    }
    
    // Create research trends section if data exists
    if (data.researchTrends && data.researchTrends.length > 0) {
        createResearchTrendsSection(data.researchTrends, container);
    }
    
    // Create benchmarks chart if data exists
    if (data.benchmarks && data.benchmarks.length > 0) {
        createAlgorithmBenchmarksSection(data.benchmarks, container);
    }
    
    // Create companies focus chart if data exists
    if (data.companies && data.companies.length > 0) {
        createCompanyFocusSection(data.companies, container);
    }
}

/**
 * Create visualizations for database category
 * @param {Object} data - Database data
 * @param {HTMLElement} container - Container element
 */
function createDatabaseVisualizations(data, container) {
    // Create database market share chart
    createChart('market-share-chart', 'doughnut', container, {
        title: 'Database Market Share',
        labels: data.marketShare.map(item => item.database),
        datasets: [{
            data: data.marketShare.map(item => item.share),
            backgroundColor: CHART_CONFIG.colors.primary
        }]
    });
    
    // Create trending databases chart with direct DOM manipulation
    if (data.trending && data.trending.length > 0) {
        // Create trending container
        const trendingContainer = document.createElement('div');
        trendingContainer.className = 'trending-chart-container';
        container.appendChild(trendingContainer);
        
        // Add title
        const title = document.createElement('h4');
        title.textContent = 'Trending Database Technologies (Growth %)';
        trendingContainer.appendChild(title);
        
        // Create a simple bar chart using DOM elements instead of Canvas
        const chartDiv = document.createElement('div');
        chartDiv.className = 'horizontal-bar-chart';
        trendingContainer.appendChild(chartDiv);
        
        // Sort trending data by growth (descending)
        const sortedData = [...data.trending].sort((a, b) => b.growth - a.growth);
        
        // Create bars for each database technology
        sortedData.forEach(item => {
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';
            chartDiv.appendChild(barContainer);
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'bar-label';
            labelDiv.textContent = item.database || item.technology || item.name || item.language || 'Unknown';
            barContainer.appendChild(labelDiv);
            
            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-wrapper';
            barContainer.appendChild(barWrapper);
            
            const barDiv = document.createElement('div');
            barDiv.className = 'bar';
            barDiv.style.width = `${Math.min(item.growth * 3, 100)}%`; // Scale for better visualization
            barDiv.style.backgroundColor = CHART_CONFIG.colors.primary[0];
            barWrapper.appendChild(barDiv);
            
            const valueDiv = document.createElement('div');
            valueDiv.className = 'bar-value';
            valueDiv.textContent = `${item.growth}%`;
            barWrapper.appendChild(valueDiv);
        });
    }
    
    // Database salaries section removed per user request
    
    // Create performance benchmarks chart
    createChart('performance-chart', 'radar', container, {
        title: 'Database Performance Benchmarks',
        labels: data.performance.map(item => item.database),
        datasets: [{
            label: 'Performance Score',
            data: data.performance.map(item => item.score),
            backgroundColor: CHART_CONFIG.colors.background[0],
            borderColor: CHART_CONFIG.colors.primary[0],
            pointBackgroundColor: CHART_CONFIG.colors.primary[0]
        }]
    });
}

/**
 * Create visualizations for system design category
 * @param {Object} data - System design data
 * @param {HTMLElement} container - Container element
 */
function createSystemVisualizations(data, container) {
    // Create architecture patterns chart - handle different data structures
    const architectureData = data.architectures || data.patterns || [];
    createChart('patterns-chart', 'bar', container, {
        title: 'Architecture Patterns Adoption',
        labels: architectureData.map(item => item.name || item.pattern || 'Unknown'),
        datasets: [{
            label: 'Adoption Rate (%)',
            data: architectureData.map(item => item.adoption || item.share || 0),
            backgroundColor: CHART_CONFIG.colors.primary
        }]
    });
    
    // Create cloud trends chart with direct DOM manipulation
    const trendingData = data.trending || data.cloudTrends || [];
    if (trendingData && trendingData.length > 0) {
        // Create trending container
        const trendingContainer = document.createElement('div');
        trendingContainer.className = 'trending-chart-container';
        container.appendChild(trendingContainer);
        
        // Add title
        const title = document.createElement('h4');
        title.textContent = 'Trending Cloud Technologies (Growth %)';
        trendingContainer.appendChild(title);
        
        // Create a simple bar chart using DOM elements instead of Canvas
        const chartDiv = document.createElement('div');
        chartDiv.className = 'horizontal-bar-chart';
        trendingContainer.appendChild(chartDiv);
        
        // Sort trending data by growth (descending)
        const sortedData = [...trendingData].sort((a, b) => b.growth - a.growth);
        
        // Create bars for each cloud technology
        sortedData.forEach(item => {
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';
            chartDiv.appendChild(barContainer);
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'bar-label';
            labelDiv.textContent = item.technology || item.service || item.name || 'Unknown';
            barContainer.appendChild(labelDiv);
            
            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-wrapper';
            barContainer.appendChild(barWrapper);
            
            const barDiv = document.createElement('div');
            barDiv.className = 'bar';
            barDiv.style.width = `${Math.min(item.growth * 3, 100)}%`; // Scale for better visualization
            barDiv.style.backgroundColor = CHART_CONFIG.colors.primary[0];
            barWrapper.appendChild(barDiv);
            
            const valueDiv = document.createElement('div');
            valueDiv.className = 'bar-value';
            valueDiv.textContent = `${item.growth}%`;
            barWrapper.appendChild(valueDiv);
        });
    }
    
    // System architect salaries section removed per user request
    
    // Create scalability benchmarks chart
    createChart('scalability-chart', 'radar', container, {
        title: 'Scalability Approach Benchmarks',
        labels: data.scalability.map(item => item.approach),
        datasets: [{
            label: 'Score',
            data: data.scalability.map(item => item.score),
            backgroundColor: CHART_CONFIG.colors.background[0],
            borderColor: CHART_CONFIG.colors.primary[0],
            pointBackgroundColor: CHART_CONFIG.colors.primary[0]
        }]
    });
}

/**
 * Create a chart
 * @param {string} id - Chart ID
 * @param {string} type - Chart type
 * @param {HTMLElement} container - Container element
 * @param {Object} data - Chart data
 */
function createChart(id, type, container, data) {
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    container.appendChild(chartContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = data.title;
    chartContainer.appendChild(title);
    
    // Create canvas for chart
    const canvas = document.createElement('canvas');
    canvas.id = id;
    chartContainer.appendChild(canvas);
    
    // Destroy existing chart if it exists
    if (chartInstances[id]) {
        chartInstances[id].destroy();
    }
    
    // Create chart
    const ctx = canvas.getContext('2d');
    chartInstances[id] = new Chart(ctx, {
        type: type,
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: CHART_CONFIG.animation.duration,
                easing: CHART_CONFIG.animation.easing
            },
            legend: {
                position: 'bottom',
                labels: {
                    fontFamily: CHART_CONFIG.fontFamily,
                    padding: 15
                }
            },
            title: {
                display: false
            },
            scales: type !== 'doughnut' && type !== 'radar' ? {
                xAxes: [{
                    ticks: {
                        fontFamily: CHART_CONFIG.fontFamily
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontFamily: CHART_CONFIG.fontFamily,
                        beginAtZero: true
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }]
            } : undefined
        }
    });
}

/**
 * Create a data table
 * @param {string} id - Table ID
 * @param {HTMLElement} container - Container element
 * @param {Object} data - Table data
 */
function createDataTable(id, container, data) {
    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'data-table-container';
    container.appendChild(tableContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = data.title;
    tableContainer.appendChild(title);
    
    // Create table
    const table = document.createElement('table');
    table.id = id;
    table.className = 'data-table';
    tableContainer.appendChild(table);
    
    // Create table header
    const thead = document.createElement('thead');
    table.appendChild(thead);
    
    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
    
    data.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    // Create table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    
    data.rows.forEach(row => {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
    });
}

/**
 * Create frameworks section
 * @param {Array} frameworks - Frameworks data
 * @param {HTMLElement} container - Container element
 */
function createFrameworksSection(frameworks, container) {
    // Create frameworks container
    const frameworksContainer = document.createElement('div');
    frameworksContainer.className = 'frameworks-container';
    container.appendChild(frameworksContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = 'Most In-Demand Frameworks by Language';
    frameworksContainer.appendChild(title);
    
    // Create frameworks list
    frameworks.forEach(item => {
        const frameworkItem = document.createElement('div');
        frameworkItem.className = 'framework-item';
        frameworksContainer.appendChild(frameworkItem);
        
        const language = document.createElement('h5');
        language.textContent = item.language;
        frameworkItem.appendChild(language);
        
        const frameworksList = document.createElement('div');
        frameworksList.className = 'frameworks-list';
        frameworkItem.appendChild(frameworksList);
        
        item.frameworks.forEach(framework => {
            const frameworkBadge = document.createElement('span');
            frameworkBadge.className = 'framework-badge';
            frameworkBadge.textContent = framework;
            frameworksList.appendChild(frameworkBadge);
        });
    });
}

/**
 * Create research trends section
 * @param {Array} trends - Research trends data
 * @param {HTMLElement} container - Container element
 */
function createResearchTrendsSection(trends, container) {
    // Create trends container
    const trendsContainer = document.createElement('div');
    trendsContainer.className = 'research-trends-container';
    container.appendChild(trendsContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = 'Trending Algorithm Research Topics';
    trendsContainer.appendChild(title);
    
    // Create trends list
    trends.forEach(trend => {
        const trendItem = document.createElement('div');
        trendItem.className = 'trend-item';
        trendsContainer.appendChild(trendItem);
        
        const trendTitle = document.createElement('h5');
        trendTitle.textContent = trend.topic;
        trendItem.appendChild(trendTitle);
        
        const trendDescription = document.createElement('p');
        trendDescription.textContent = trend.description;
        trendItem.appendChild(trendDescription);
    });
}

/**
 * Create algorithm benchmarks section
 * @param {Array} benchmarks - Benchmarks data
 * @param {HTMLElement} container - Container element
 */
function createAlgorithmBenchmarksSection(benchmarks, container) {
    // Create benchmarks container
    const benchmarksContainer = document.createElement('div');
    benchmarksContainer.className = 'benchmarks-container';
    container.appendChild(benchmarksContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = 'Algorithm Efficiency Benchmarks';
    benchmarksContainer.appendChild(title);
    
    // Create benchmarks table
    const table = document.createElement('table');
    table.className = 'benchmarks-table';
    benchmarksContainer.appendChild(table);
    
    // Create table header
    const thead = document.createElement('thead');
    table.appendChild(thead);
    
    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
    
    ['Algorithm', 'Time Complexity', 'Performance'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    // Create table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    
    benchmarks.forEach(benchmark => {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        
        const tdAlgorithm = document.createElement('td');
        tdAlgorithm.textContent = benchmark.algorithm;
        tr.appendChild(tdAlgorithm);
        
        const tdComplexity = document.createElement('td');
        tdComplexity.textContent = benchmark.complexity;
        tr.appendChild(tdComplexity);
        
        const tdPerformance = document.createElement('td');
        tdPerformance.textContent = benchmark.performance;
        tr.appendChild(tdPerformance);
    });
}

/**
 * Create company focus section
 * @param {Array} companies - Companies data
 * @param {HTMLElement} container - Container element
 */
function createCompanyFocusSection(companies, container) {
    // Create companies container
    const companiesContainer = document.createElement('div');
    companiesContainer.className = 'companies-container';
    container.appendChild(companiesContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = 'Companies Known for Algorithm-Heavy Interviews';
    companiesContainer.appendChild(title);
    
    // Create companies list
    companies.forEach(company => {
        const companyItem = document.createElement('div');
        companyItem.className = 'company-item';
        companiesContainer.appendChild(companyItem);
        
        const companyName = document.createElement('h5');
        companyName.textContent = company.name;
        companyItem.appendChild(companyName);
        
        const focusList = document.createElement('div');
        focusList.className = 'focus-list';
        companyItem.appendChild(focusList);
        
        company.focus.forEach(focus => {
            const focusBadge = document.createElement('span');
            focusBadge.className = 'focus-badge';
            focusBadge.textContent = focus;
            focusList.appendChild(focusBadge);
        });
    });
}

/**
 * Create salary section
 * @param {Array} salaries - Salaries data
 * @param {HTMLElement} container - Container element
 */
function createSalarySection(salaries, container) {
    // Create salaries container
    const salariesContainer = document.createElement('div');
    salariesContainer.className = 'salaries-container';
    container.appendChild(salariesContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = 'Average Salaries by Role';
    salariesContainer.appendChild(title);
    
    // Create salaries chart
    const canvas = document.createElement('canvas');
    canvas.id = 'salaries-chart';
    salariesContainer.appendChild(canvas);
    
    // Create chart
    const ctx = canvas.getContext('2d');
    chartInstances['salaries-chart'] = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: salaries.map(item => item.role),
            datasets: [{
                label: 'Salary (USD)',
                data: salaries.map(item => item.salary),
                backgroundColor: CHART_CONFIG.colors.primary
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: CHART_CONFIG.animation.duration,
                easing: CHART_CONFIG.animation.easing
            },
            legend: {
                position: 'bottom',
                labels: {
                    fontFamily: CHART_CONFIG.fontFamily,
                    padding: 15
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontFamily: CHART_CONFIG.fontFamily,
                        beginAtZero: true,
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontFamily: CHART_CONFIG.fontFamily
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }]
            }
        }
    });
}

/**
 * Create news section
 * @param {Array} news - News data
 * @param {HTMLElement} container - Container element
 */
function createNewsSection(news, container) {
    // Create news container
    const newsContainer = document.createElement('div');
    newsContainer.className = 'news-container';
    container.appendChild(newsContainer);
    
    // Add title
    const title = document.createElement('h4');
    title.textContent = 'Latest Technology News';
    newsContainer.appendChild(title);
    
    // Create news list
    const newsList = document.createElement('div');
    newsList.className = 'news-list';
    newsContainer.appendChild(newsList);
    
    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsList.appendChild(newsItem);
        
        const newsTitle = document.createElement('h5');
        newsTitle.textContent = item.title;
        newsItem.appendChild(newsTitle);
        
        const newsDate = document.createElement('div');
        newsDate.className = 'news-date';
        newsDate.textContent = new Date(item.date).toLocaleDateString();
        newsItem.appendChild(newsDate);
    });
}

// Export functions for use in other files
window.techDataVisualization = {
    initDataVisualizations,
    refreshData
};
