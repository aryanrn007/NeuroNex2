// Industry Comparison Chart Animation and Interactivity

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the industry comparison chart
    initIndustryChart();
    
    // Set up observers and event listeners
    setupChartInteractions();
});

// Initialize the chart with animation
function initIndustryChart() {
    const ctx = document.getElementById('industryComparisonChart').getContext('2d');
    
    // Sample data for the chart
    const industryData = {
        labels: ['IT Services', 'Product Development', 'E-commerce', 'FinTech', 'Healthcare Tech', 'EdTech'],
        datasets: [{
            label: 'Average Salary (LPA)',
            data: [12, 17, 14.5, 19, 15.5, 13.8],
            backgroundColor: [
                'rgba(39, 174, 96, 0.7)',
                'rgba(46, 204, 113, 0.7)',
                'rgba(52, 152, 219, 0.7)',
                'rgba(41, 128, 185, 0.7)',
                'rgba(142, 68, 173, 0.7)',
                'rgba(155, 89, 182, 0.7)'
            ],
            borderColor: [
                'rgba(39, 174, 96, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(52, 152, 219, 1)',
                'rgba(41, 128, 185, 1)',
                'rgba(142, 68, 173, 1)',
                'rgba(155, 89, 182, 1)'
            ],
            borderWidth: 1,
            borderRadius: 8,
            hoverOffset: 4
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: industryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeOutQuart',
                delay: (context) => {
                    return context.dataIndex * 150;
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value + 'L';
                        },
                        font: {
                            family: "'Poppins', sans-serif"
                        },
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Poppins', sans-serif"
                        },
                        color: '#64748b'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    external: externalTooltipHandler
                }
            },
            onHover: (event, chartElements) => {
                const chartCanvas = event.chart.canvas;
                chartCanvas.style.cursor = chartElements.length ? 'pointer' : 'default';
            }
        }
    };
    
    // Create and store the chart instance
    window.industryChart = new Chart(ctx, config);
    
    // Add the animation class to bars after chart is created
    setTimeout(() => {
        document.querySelectorAll('.industry-chart-container canvas').forEach(canvas => {
            canvas.classList.add('animated');
        });
    }, 100);
}

// Custom tooltip handler
function externalTooltipHandler(context) {
    // Get tooltip element
    const tooltip = document.getElementById('chartTooltip');
    
    // Hide if no tooltip
    if (context.tooltip.opacity === 0) {
        tooltip.style.opacity = 0;
        return;
    }
    
    // Set Text
    if (context.tooltip.body) {
        const titleLines = context.tooltip.title || [];
        const bodyLines = context.tooltip.body.map(b => b.lines);
        
        const titleElement = tooltip.querySelector('.chart-tooltip-title');
        const valueElement = tooltip.querySelector('.chart-tooltip-value');
        
        if (titleLines[0]) {
            titleElement.textContent = titleLines[0];
        }
        
        if (bodyLines[0]) {
            const value = bodyLines[0][0].split(':')[1].trim();
            valueElement.textContent = value;
        }
    }
    
    // Position tooltip
    const position = context.chart.canvas.getBoundingClientRect();
    const chartContainer = document.querySelector('.industry-chart-container');
    const containerPosition = chartContainer.getBoundingClientRect();
    
    // Calculate position relative to container
    const tooltipX = position.left + context.tooltip.caretX - containerPosition.left;
    const tooltipY = position.top + context.tooltip.caretY - containerPosition.top;
    
    // Set tooltip position
    tooltip.style.left = tooltipX + 'px';
    tooltip.style.top = tooltipY + 'px';
    tooltip.style.opacity = 1;
    tooltip.classList.add('visible');
    
    // Transform based on position to avoid edge overflow
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    
    // Adjust horizontal position if needed
    if (tooltipX + tooltipWidth > containerPosition.width) {
        tooltip.style.left = (tooltipX - tooltipWidth) + 'px';
    }
    
    // Adjust vertical position if needed
    if (tooltipY + tooltipHeight > containerPosition.height) {
        tooltip.style.top = (tooltipY - tooltipHeight) + 'px';
    }
}

// Set up interactions for the chart
function setupChartInteractions() {
    // Set up intersection observer for animation on scroll
    if ('IntersectionObserver' in window) {
        const chartContainer = document.querySelector('.industry-chart-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Trigger bar animations when in view
                    if (window.industryChart) {
                        window.industryChart.update();
                    }
                    
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(chartContainer);
    }
    
    // Toggle between chart types (bar/line)
    const chartViewOptions = document.querySelectorAll('.chart-view-option');
    chartViewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            chartViewOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get the view type
            const viewType = this.getAttribute('data-view');
            
            // Update chart type
            if (window.industryChart) {
                window.industryChart.config.type = viewType;
                window.industryChart.update();
            }
        });
    });
    
    // Legend item click handler for filtering
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach(item => {
        item.addEventListener('click', function() {
            const industry = this.getAttribute('data-industry');
            
            // Toggle active state
            this.classList.toggle('active');
            
            // Filter chart data based on active legend items
            // This is a placeholder - in a real implementation, you would filter the data
            // based on which legend items are active
            
            // For demonstration, just update the chart
            if (window.industryChart) {
                window.industryChart.update();
            }
        });
    });
    
    // Info button click handler
    const infoButton = document.querySelector('.chart-info-button');
    if (infoButton) {
        infoButton.addEventListener('click', function() {
            // Show info modal or tooltip
            alert('This chart shows average salary data across different industries based on our 2025 salary survey of 5,000+ professionals.');
        });
    }
}

// Helper function to format currency
function formatCurrency(value) {
    return '₹' + value.toFixed(1) + ' LPA';
}
