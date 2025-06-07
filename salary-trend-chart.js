// Salary Trend Chart Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Get the chart canvas element
    const ctx = document.getElementById('salaryTrendChart').getContext('2d');
    
    // Chart data
    const years = ['2021', '2022', '2023', '2024', '2025'];
    const entryLevelData = [5.2, 5.8, 6.5, 7.2, 8.0];
    const midLevelData = [12.5, 14.2, 16.8, 18.5, 21.2];
    const seniorLevelData = [25.8, 28.5, 32.4, 36.8, 42.5];
    
    // Create the chart
    const salaryTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Entry Level',
                    data: entryLevelData,
                    borderColor: '#2980b9',
                    backgroundColor: 'rgba(41, 128, 185, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#2980b9',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Mid Level',
                    data: midLevelData,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#27ae60',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Senior Level',
                    data: seniorLevelData,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#f39c12',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Legend is handled by custom HTML
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.raw + 'L';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Salary (LPA)',
                        color: '#64748b',
                        font: {
                            size: 12,
                            weight: 500
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value + 'L';
                        },
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        color: '#64748b',
                        font: {
                            size: 12,
                            weight: 500
                        }
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Add data table below chart
    const sampleDataContainer = document.createElement('div');
    sampleDataContainer.className = 'sample-data-container';
    
    const table = document.createElement('table');
    table.className = 'sample-data-table';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Year', 'Entry Level', 'Mid Level', 'Senior Level'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    for (let i = 0; i < years.length; i++) {
        const row = document.createElement('tr');
        
        const yearCell = document.createElement('td');
        yearCell.textContent = years[i];
        row.appendChild(yearCell);
        
        const entryLevelCell = document.createElement('td');
        entryLevelCell.textContent = '₹' + entryLevelData[i] + 'L';
        row.appendChild(entryLevelCell);
        
        const midLevelCell = document.createElement('td');
        midLevelCell.textContent = '₹' + midLevelData[i] + 'L';
        row.appendChild(midLevelCell);
        
        const seniorLevelCell = document.createElement('td');
        seniorLevelCell.textContent = '₹' + seniorLevelData[i] + 'L';
        row.appendChild(seniorLevelCell);
        
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    sampleDataContainer.appendChild(table);
    
    // Add the table after the chart
    const chartCanvas = document.getElementById('salaryTrendChart');
    chartCanvas.parentNode.insertBefore(sampleDataContainer, chartCanvas.nextSibling);
    
    // Clear any existing dashboard content that might be overlapping
    const dashboardElements = document.querySelectorAll('.salary-overview');
    if (dashboardElements.length > 0) {
        dashboardElements.forEach(element => {
            if (element.style) {
                element.style.clear = 'both';
            }
        });
    }
});
