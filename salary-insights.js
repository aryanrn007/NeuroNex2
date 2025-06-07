document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    setupPageForUser();
    
    // Initialize charts
    initCharts();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load salary data with real-time API
    loadSalaryData();
    
    // Set up auto-refresh for real-time data
    setupAutoRefresh();
});

// --- Basic Login Check & Header Setup ---
function setupPageForUser() {
    const loggedInUserName = document.getElementById('loggedInUserName');
    const settingsButton = document.getElementById('settings-button');
    
    // Check if user is logged in (from localStorage)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Display user name if logged in, otherwise show 'Guest'
    if (loggedInUserName) {
        if (currentUser) {
            loggedInUserName.textContent = currentUser.name;
        } else {
            loggedInUserName.textContent = 'Guest';
        }
    }
    
    return true; // Always return true to continue loading the page
}

// --- Initialize Event Listeners ---
function initEventListeners() {
    // Location tabs
    const locationTabs = document.querySelectorAll('.location-tab');
    const indiaLocations = document.getElementById('india-locations');
    const globalLocations = document.getElementById('global-locations');
    
    locationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            locationTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.location === 'india') {
                indiaLocations.classList.remove('hidden');
                globalLocations.classList.add('hidden');
            } else {
                indiaLocations.classList.add('hidden');
                globalLocations.classList.remove('hidden');
            }
        });
    });
    
    // View toggle
    const viewButtons = document.querySelectorAll('.view-btn');
    const chartView = document.querySelector('.chart-view');
    const tableView = document.querySelector('.table-view');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            if (button.dataset.view === 'chart') {
                chartView.classList.add('active');
                tableView.classList.remove('active');
            } else {
                chartView.classList.remove('active');
                tableView.classList.add('active');
            }
        });
    });
    
    // Filter buttons
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            filterSalaryData();
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            resetFilters();
        });
    }
    
    // Company comparison
    const compareCompaniesBtn = document.getElementById('compare-companies-btn');
    
    if (compareCompaniesBtn) {
        compareCompaniesBtn.addEventListener('click', () => {
            compareCompanies();
        });
    }
    
    // Download report
    const downloadReportBtn = document.getElementById('download-report-btn');
    const downloadReportModal = document.getElementById('download-report-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const generateReportBtn = document.getElementById('generate-report-btn');
    
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', () => {
            downloadReportModal.style.display = 'block';
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            downloadReportModal.style.display = 'none';
        });
    }
    
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => {
            generateReport();
            downloadReportModal.style.display = 'none';
        });
    }
    
    // Personalize button
    const personalizeBtn = document.getElementById('personalize-btn');
    
    if (personalizeBtn) {
        personalizeBtn.addEventListener('click', () => {
            personalizeInsights();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === downloadReportModal) {
            downloadReportModal.style.display = 'none';
        }
    });
}

// --- Initialize Charts ---
function initCharts() {
    // Salary chart
    const salaryChartCtx = document.getElementById('salary-chart').getContext('2d');
    
    // Sample data
    const roles = ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Marketing Specialist'];
    const avgSalaries = [14.5, 18.2, 13.8, 16.2, 11.5];
    const minSalaries = [10.2, 14.5, 10.0, 12.5, 8.0];
    const maxSalaries = [18.7, 22.0, 17.5, 20.0, 15.0];
    
    window.salaryChart = new Chart(salaryChartCtx, {
        type: 'bar',
        data: {
            labels: roles,
            datasets: [
                {
                    label: 'Average Salary (LPA)',
                    data: avgSalaries,
                    backgroundColor: '#27ae60',
                    borderColor: '#219653',
                    borderWidth: 1
                },
                {
                    label: 'Min Salary (LPA)',
                    data: minSalaries,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1
                },
                {
                    label: 'Max Salary (LPA)',
                    data: maxSalaries,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Salary (LPA)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Job Roles'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Salary Comparison by Role',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Company comparison chart (hidden initially)
    const companyChartCtx = document.getElementById('company-comparison-chart').getContext('2d');
    
    window.companyChart = new Chart(companyChartCtx, {
        type: 'radar',
        data: {
            labels: ['Entry Level', 'Junior (1-3 yrs)', 'Mid-level (3-5 yrs)', 'Senior (5-8 yrs)', 'Lead (8+ yrs)'],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    min: 0,
                    max: 50,
                    ticks: {
                        stepSize: 10
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Salary Comparison by Experience Level',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// --- Mock Data is now loaded from fixed-salary-data.js ---

// --- Load Salary Data ---
async function loadSalaryData(filters = {}) {
    try {
        // Show loading indicator
        showDataLoadingState();
        
        // Get current filters if not provided
        if (Object.keys(filters).length === 0) {
            filters = getCurrentFilters();
        }
        
        // Fetch data from API service
        const salaryData = await salaryApiService.getSalaryData(filters);
        
        // Check if data is from mock source and show notification if needed
        if (salaryData.isFromMockData) {
            showOfflineDataNotification();
        }
        
        // Update UI with the data
        updateSalaryDashboard(salaryData);
        populateSalaryTable(salaryData);
        
        // Hide loading indicator
        hideDataLoadingState();
        
        // Update last refresh timestamp
        updateLastRefreshTime();
        
        return salaryData;
    } catch (error) {
        console.error('Error loading salary data:', error);
        
        // Show error message
        showDataLoadError();
        
        // Fallback to mock data
        const fallbackData = mockSalaryData;
        updateSalaryDashboard(fallbackData);
        populateSalaryTable(fallbackData);
        
        // Hide loading indicator
        hideDataLoadingState();
        
        return fallbackData;
    }
}

// --- Update Salary Dashboard ---
function updateSalaryDashboard(data) {
    // Check if data is empty
    if (!data || data.length === 0) {
        // Display no data message
        document.getElementById('average-salary').textContent = 'No data';
        document.getElementById('top-role').textContent = 'N/A';
        document.getElementById('top-location').textContent = 'N/A';
        
        document.querySelector('#average-salary + .overview-range').textContent = 'No matching results';
        document.querySelector('#top-role + .overview-range').textContent = 'Try different filters';
        document.querySelector('#top-location + .overview-range').textContent = '';
        
        // Update chart with empty data
        updateSalaryChart([]);
        return;
    }
    
    // Calculate average salary across all roles
    const avgSalary = data.reduce((sum, item) => sum + item.avgSalary, 0) / data.length;
    const minSalary = Math.min(...data.map(item => item.minSalary));
    const maxSalary = Math.max(...data.map(item => item.maxSalary));
    
    // Find top paying role
    const topRole = [...data].sort((a, b) => b.avgSalary - a.avgSalary)[0];
    
    // Find top paying location
    const locationMap = {};
    data.forEach(item => {
        if (!locationMap[item.location]) {
            locationMap[item.location] = { total: 0, count: 0 };
        }
        locationMap[item.location].total += item.avgSalary;
        locationMap[item.location].count += 1;
    });
    
    const locationAvgs = Object.entries(locationMap).map(([location, data]) => ({
        location,
        avg: data.total / data.count
    }));
    
    const topLocation = locationAvgs.sort((a, b) => b.avg - a.avg)[0];
    const percentAboveAvg = ((topLocation.avg - avgSalary) / avgSalary * 100).toFixed(0);
    
    // Update UI
    document.getElementById('average-salary').textContent = `₹${avgSalary.toFixed(1)} LPA`;
    document.getElementById('top-role').textContent = topRole.role;
    document.getElementById('top-location').textContent = topLocation.location;
    
    document.querySelector('#average-salary + .overview-range').textContent = `Range: ₹${minSalary.toFixed(1)} - ${maxSalary.toFixed(1)} LPA`;
    document.querySelector('#top-role + .overview-range').textContent = `Avg: ₹${topRole.avgSalary.toFixed(1)} LPA`;
    document.querySelector('#top-location + .overview-range').textContent = `+${percentAboveAvg}% above avg`;
    
    // Update chart
    updateSalaryChart(data);
}

// --- Update Salary Chart ---
function updateSalaryChart(data) {
    // Check if data is empty
    if (!data || data.length === 0) {
        // Update chart with empty data
        window.salaryChart.data.labels = [];
        window.salaryChart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        
        // Add a "No data" label
        window.salaryChart.data.labels = ['No matching data'];
        window.salaryChart.data.datasets.forEach(dataset => {
            dataset.data = [0];
        });
        
        window.salaryChart.update();
        
        // Display a message on the chart
        const ctx = window.salaryChart.ctx;
        const width = window.salaryChart.width;
        const height = window.salaryChart.height;
        
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText('No matching data found. Try adjusting your filters.', width / 2, height / 2);
        ctx.restore();
        
        return;
    }
    
    // Group data by role
    const roleMap = {};
    data.forEach(item => {
        if (!roleMap[item.role]) {
            roleMap[item.role] = {
                avgSalaries: [],
                minSalaries: [],
                maxSalaries: []
            };
        }
        roleMap[item.role].avgSalaries.push(item.avgSalary);
        roleMap[item.role].minSalaries.push(item.minSalary);
        roleMap[item.role].maxSalaries.push(item.maxSalary);
    });
    
    // Calculate average for each role
    const roles = Object.keys(roleMap);
    const avgSalaries = roles.map(role => {
        const salaries = roleMap[role].avgSalaries;
        return salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
    });
    
    const minSalaries = roles.map(role => {
        const salaries = roleMap[role].minSalaries;
        return Math.min(...salaries);
    });
    
    const maxSalaries = roles.map(role => {
        const salaries = roleMap[role].maxSalaries;
        return Math.max(...salaries);
    });
    
    // Update chart
    window.salaryChart.data.labels = roles;
    window.salaryChart.data.datasets[0].data = avgSalaries;
    window.salaryChart.data.datasets[1].data = minSalaries;
    window.salaryChart.data.datasets[2].data = maxSalaries;
    window.salaryChart.update();
}

// --- Populate Salary Table ---
function populateSalaryTable(data) {
    const tableBody = document.getElementById('salary-table-body');
    tableBody.innerHTML = '';
    
    // Check if data is empty
    if (!data || data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="no-data-message">No matching data found. Try adjusting your filters.</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    // Populate table with data
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.role}</td>
            <td>${item.experience}</td>
            <td>${item.location}</td>
            <td>₹${item.avgSalary.toFixed(1)} LPA</td>
            <td>₹${item.minSalary.toFixed(1)} - ${item.maxSalary.toFixed(1)} LPA</td>
        `;
        tableBody.appendChild(row);
    });
}

// --- Filter Salary Data ---
async function filterSalaryData() {
    // Get filter values
    const roleSearch = document.getElementById('role-search').value.toLowerCase().trim();
    const experienceLevel = document.getElementById('experience-level').value;
    const locationTab = document.querySelector('.location-tab.active').dataset.location;
    const indiaCity = document.getElementById('india-cities').value;
    const globalCountry = document.getElementById('global-countries').value;
    const industry = document.getElementById('industry-filter').value;

    // Determine location based on active tab
    let location = '';
    if (locationTab === 'india') {
        location = indiaCity;
    } else {
        location = globalCountry;
    }

    // Create filters object
    const filters = {
        role: roleSearch,
        experience: experienceLevel,
        location: location,
        locationType: locationTab,
        industry: industry
    };

    // Show loading state on the apply button
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        const originalText = applyFiltersBtn.innerHTML;
        applyFiltersBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Filtering...';
        applyFiltersBtn.disabled = true;

        try {
            // Fetch filtered data from API
            const filteredData = await salaryApiService.getSalaryData(filters);

            // Update UI with filtered data
            updateSalaryDashboard(filteredData);
            populateSalaryTable(filteredData);

            // Restore button state
            applyFiltersBtn.innerHTML = originalText;
            applyFiltersBtn.disabled = false;

            // Check if data is from mock source
            if (filteredData.isFromMockData) {
                showOfflineDataNotification();
            }
        } catch (error) {
            console.error('Error applying filters:', error);

            // Fallback to client-side filtering of mock data
            const filteredData = mockSalaryData.filter(item => {
                // Role filter
                if (roleSearch && !item.role.toLowerCase().includes(roleSearch)) {
                    return false;
                }

                // Experience filter
                if (experienceLevel !== 'all' && item.experience.toLowerCase() !== experienceLevel) {
                    return false;
                }

                // Location filter - case insensitive comparison
                if (location !== 'all' && item.location.toLowerCase() !== location.toLowerCase()) {
                    return false;
                }

                // Industry filter
                if (industry !== 'all' && item.industry.toLowerCase() !== industry.toLowerCase()) {
                    return false;
                }

                return true;
            });

            // Update UI with filtered data
            updateSalaryDashboard(filteredData);
            populateSalaryTable(filteredData);

            // Restore button state
            applyFiltersBtn.innerHTML = originalText;
            applyFiltersBtn.disabled = false;

            // Show error notification
            showDataLoadError();
        }
    } else {
        // If button not found, just filter and update
        try {
            // Fetch filtered data from API
            const filteredData = await salaryApiService.getSalaryData(filters);

            // Update UI with filtered data
            updateSalaryDashboard(filteredData);
            populateSalaryTable(filteredData);

            // Check if data is from mock source
            if (filteredData.isFromMockData) {
                showOfflineDataNotification();
            }
        } catch (error) {
            console.error('Error applying filters:', error);

            // Fallback to client-side filtering of mock data
            const filteredData = mockSalaryData.filter(item => {
                // Role filter
                if (roleSearch && !item.role.toLowerCase().includes(roleSearch)) {
                    return false;
                }

                // Experience filter
                if (experienceLevel !== 'all' && item.experience.toLowerCase() !== experienceLevel) {
                    return false;
                }

                // Location filter
                if (location !== 'all' && item.location.toLowerCase() !== location.toLowerCase()) {
                    return false;
                }

                // Industry filter
                if (industry !== 'all' && item.industry.toLowerCase() !== industry.toLowerCase()) {
                    return false;
                }

                return true;
            });

            // Update UI with filtered data
            updateSalaryDashboard(filteredData);
            populateSalaryTable(filteredData);

            // Show error notification
            showDataLoadError();
        }
    }
}

// --- Reset Filters ---
async function resetFilters() {
    // Reset all form inputs
    document.getElementById('role-search').value = '';
    document.getElementById('experience-level').value = 'all';
    document.getElementById('india-cities').value = 'all';
    document.getElementById('global-countries').value = 'all';
    document.getElementById('industry-filter').value = 'all';
    
    // Reset to India tab
    document.querySelectorAll('.location-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.location === 'india') {
            tab.classList.add('active');
        }
    });
    
    document.getElementById('india-locations').classList.remove('hidden');
    document.getElementById('global-locations').classList.add('hidden');
    
    // Show a brief message to the user
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        const originalText = applyFiltersBtn.innerHTML;
        applyFiltersBtn.innerHTML = '<i class="fas fa-sync fa-spin"></i> Refreshing Data';
        applyFiltersBtn.disabled = true;
        
        try {
            // Load fresh data from API
            await loadSalaryData({});
            
            // Update button text
            applyFiltersBtn.innerHTML = '<i class="fas fa-check"></i> Filters Reset';
            
            setTimeout(() => {
                applyFiltersBtn.innerHTML = originalText;
                applyFiltersBtn.disabled = false;
            }, 1500);
        } catch (error) {
            console.error('Error resetting filters:', error);
            
            // Fallback to mock data
            updateSalaryDashboard(mockSalaryData);
            populateSalaryTable(mockSalaryData);
            
            // Update button text
            applyFiltersBtn.innerHTML = '<i class="fas fa-check"></i> Filters Reset';
            
            setTimeout(() => {
                applyFiltersBtn.innerHTML = originalText;
                applyFiltersBtn.disabled = false;
            }, 1500);
        }
    } else {
        // If button not found, just reset and update
        try {
            // Load fresh data from API
            await loadSalaryData({});
        } catch (error) {
            console.error('Error resetting filters:', error);
            
            // Fallback to mock data
            updateSalaryDashboard(mockSalaryData);
            populateSalaryTable(mockSalaryData);
        }
    }
}

// --- Compare Companies ---
function compareCompanies() {
    const companySelect1 = document.getElementById('company-select-1').value;
    const companySelect2 = document.getElementById('company-select-2').value;
    const companySelect3 = document.getElementById('company-select-3').value;
    
    const selectedCompanies = [companySelect1, companySelect2, companySelect3].filter(company => company);
    
    if (selectedCompanies.length === 0) {
        alert('Please select at least one company to compare');
        return;
    }
    
    // Show comparison chart
    document.querySelector('.company-comparison-chart').classList.remove('hidden');
    
    // Prepare data for chart
    const companyData = {};
    selectedCompanies.forEach(company => {
        companyData[company] = {
            'Entry Level': 0,
            'Junior (1-3 yrs)': 0,
            'Mid-level (3-5 yrs)': 0,
            'Senior (5-8 yrs)': 0,
            'Lead (8+ yrs)': 0
        };
    });
    
    // Get salary data for each company by experience level
    mockSalaryData.forEach(item => {
        selectedCompanies.forEach(company => {
            if (item.companies[company]) {
                companyData[company][item.experience] = item.companies[company];
            }
        });
    });
    
    // Update company comparison chart
    const datasets = selectedCompanies.map(company => {
        const color = getCompanyColor(company);
        return {
            label: company,
            data: [
                companyData[company]['Entry Level'] || 0,
                companyData[company]['Junior (1-3 yrs)'] || 0,
                companyData[company]['Mid-level (3-5 yrs)'] || 0,
                companyData[company]['Senior (5-8 yrs)'] || 0,
                companyData[company]['Lead (8+ yrs)'] || 0
            ],
            backgroundColor: `${color}33`,
            borderColor: color,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointRadius: 4
        };
    });
    
    window.companyChart.data.datasets = datasets;
    window.companyChart.update();
}

// --- Generate Report ---
function generateReport() {
    // In a real application, this would generate a PDF or Excel file
    alert('Report generation functionality would be implemented here. In a real application, this would create a downloadable PDF or Excel file with the salary insights data.');
}

// --- Personalize Insights ---
async function personalizeInsights() {
    // Show loading state
    const personalizeBtn = document.getElementById('personalize-btn');
    if (personalizeBtn) {
        const originalText = personalizeBtn.innerHTML;
        personalizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Personalizing...';
        personalizeBtn.disabled = true;
        
        try {
            // Get user profile data from localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            
            // Create personalized filters based on user profile
            const personalizedFilters = {
                role: currentUser.role || '',
                experience: currentUser.experience || 'all',
                location: currentUser.location || 'all',
                industry: currentUser.industry || 'all'
            };
            
            // Fetch personalized data
            const personalizedData = await salaryApiService.getSalaryData(personalizedFilters);
            
            // Update UI with personalized data
            updateSalaryDashboard(personalizedData);
            populateSalaryTable(personalizedData);
            
            // Show personalization notification
            showPersonalizationNotification();
            
            // Restore button state
            personalizeBtn.innerHTML = originalText;
            personalizeBtn.disabled = false;
        } catch (error) {
            console.error('Error personalizing insights:', error);
            
            // Show error message
            alert('Unable to personalize insights at this time. Please try again later.');
            
            // Restore button state
            personalizeBtn.innerHTML = originalText;
            personalizeBtn.disabled = false;
        }
    } else {
        // If button not found, show alert
        alert('Personalization feature coming soon!');
    }
}

// --- Helper Functions for Real-time Data ---

/**
 * Get current filter values from UI
 * @returns {Object} Filter values
 */
function getCurrentFilters() {
    const roleSearch = document.getElementById('role-search').value.trim();
    const experienceLevel = document.getElementById('experience-level').value;
    const locationTab = document.querySelector('.location-tab.active').dataset.location;
    const location = locationTab === 'india' 
        ? document.getElementById('india-cities').value 
        : document.getElementById('global-countries').value;
    const industry = document.getElementById('industry-filter').value;
    
    return {
        role: roleSearch,
        experience: experienceLevel,
        location: location,
        locationType: locationTab,
        industry: industry
    };
}

/**
 * Show loading state for data operations
 */
function showDataLoadingState() {
    // Add loading overlay to salary dashboard
    const dashboard = document.querySelector('.salary-dashboard');
    
    if (dashboard) {
        // Check if loading overlay already exists
        if (!document.querySelector('.data-loading-overlay')) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'data-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-sync-alt fa-spin"></i>
                    <p>Fetching latest salary data...</p>
                </div>
            `;
            dashboard.appendChild(loadingOverlay);
        }
    }
    
    // Disable filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.disabled = true);
}

/**
 * Hide loading state for data operations
 */
function hideDataLoadingState() {
    // Remove loading overlay
    const loadingOverlay = document.querySelector('.data-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
    
    // Enable filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.disabled = false);
}

/**
 * Show notification when using offline/mock data
 */
function showOfflineDataNotification() {
    // Create notification if it doesn't exist
    if (!document.querySelector('.offline-data-notification')) {
        const notification = document.createElement('div');
        notification.className = 'offline-data-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Using cached data. Unable to fetch real-time updates.</span>
            <button class="retry-btn"><i class="fas fa-sync"></i> Retry</button>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        // Add to page
        document.querySelector('.salary-content').prepend(notification);
        
        // Add event listeners
        notification.querySelector('.retry-btn').addEventListener('click', () => {
            notification.remove();
            salaryApiService.forceRefresh().then(data => {
                updateSalaryDashboard(data);
                populateSalaryTable(data);
            });
        });
        
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
}

/**
 * Show error message when data loading fails
 */
function showDataLoadError() {
    // Create error message if it doesn't exist
    if (!document.querySelector('.data-error-message')) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'data-error-message';
        errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Unable to fetch real-time salary data. Using cached information.</span>
            <button class="close-error"><i class="fas fa-times"></i></button>
        `;
        
        // Add to page
        document.querySelector('.salary-content').prepend(errorMessage);
        
        // Add event listener to close button
        errorMessage.querySelector('.close-error').addEventListener('click', () => {
            errorMessage.remove();
        });
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 8000);
    }
}

/**
 * Show notification when personalization is applied
 */
function showPersonalizationNotification() {
    // Create notification if it doesn't exist
    if (!document.querySelector('.personalization-notification')) {
        const notification = document.createElement('div');
        notification.className = 'personalization-notification';
        notification.innerHTML = `
            <i class="fas fa-magic"></i>
            <span>Insights personalized based on your profile!</span>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        // Add to page
        document.querySelector('.salary-content').prepend(notification);
        
        // Add event listener to close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

/**
 * Update last refresh time display
 */
function updateLastRefreshTime() {
    // Create or update the last refresh time element
    let refreshTimeElement = document.querySelector('.last-refresh-time');
    
    if (!refreshTimeElement) {
        refreshTimeElement = document.createElement('div');
        refreshTimeElement.className = 'last-refresh-time';
        const headerElement = document.querySelector('.salary-overview-section h2');
        if (headerElement) {
            headerElement.appendChild(refreshTimeElement);
        }
    }
    
    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    refreshTimeElement.innerHTML = `<i class="fas fa-sync"></i> Last updated: ${timeString}`;
}

/**
 * Set up auto-refresh for real-time data
 */
function setupAutoRefresh() {
    // Add refresh button to the page
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-data-btn';
    refreshButton.innerHTML = '<i class="fas fa-sync"></i> Refresh Data';
    
    // Insert after the salary header
    const salaryHeader = document.querySelector('.salary-header');
    if (salaryHeader) {
        salaryHeader.after(refreshButton);
    }
    
    // Add event listener for manual refresh
    refreshButton.addEventListener('click', () => {
        refreshButton.innerHTML = '<i class="fas fa-sync fa-spin"></i> Refreshing...';
        refreshButton.disabled = true;
        
        salaryApiService.forceRefresh().then(data => {
            updateSalaryDashboard(data);
            populateSalaryTable(data);
            refreshButton.innerHTML = '<i class="fas fa-sync"></i> Refresh Data';
            refreshButton.disabled = false;
        }).catch(error => {
            console.error('Error refreshing data:', error);
            refreshButton.innerHTML = '<i class="fas fa-sync"></i> Refresh Data';
            refreshButton.disabled = false;
            showDataLoadError();
        });
    });
    
    // Set up auto-refresh every 5 minutes
    setInterval(() => {
        // Only refresh if the page is visible
        if (document.visibilityState === 'visible') {
            salaryApiService.getSalaryData(getCurrentFilters(), false).then(data => {
                updateSalaryDashboard(data);
                populateSalaryTable(data);
                updateLastRefreshTime();
            }).catch(error => {
                console.error('Error auto-refreshing data:', error);
            });
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// --- Helper Functions ---
function getCompanyColor(company) {
    const colorMap = {
        'Google': '#4285F4',
        'Microsoft': '#00A4EF',
        'Amazon': '#FF9900',
        'TCS': '#0072C6',
        'Infosys': '#007CC3',
        'Wipro': '#341C53',
        'Accenture': '#A100FF'
    };
    
    return colorMap[company] || '#27ae60';
}
