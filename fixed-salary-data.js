// Fixed Salary Data
const mockSalaryData = [
    // India locations
    {
        role: 'Software Engineer',
        experience: 'Fresher (0-1 yr)',
        location: 'Bangalore',
        industry: 'Tech',
        avgSalary: 8.5,
        minSalary: 6.0,
        maxSalary: 12.0,
        companies: {
            'Google': 16.0,
            'Microsoft': 15.0,
            'Amazon': 14.5,
            'TCS': 5.5,
            'Infosys': 5.0,
            'Wipro': 4.8,
            'Accenture': 6.2
        }
    },
    {
        role: 'Software Engineer',
        experience: 'Junior (1-3 yrs)',
        location: 'Bangalore',
        industry: 'Tech',
        avgSalary: 12.5,
        minSalary: 9.0,
        maxSalary: 16.0,
        companies: {
            'Google': 22.0,
            'Microsoft': 20.0,
            'Amazon': 19.5,
            'TCS': 8.0,
            'Infosys': 7.5,
            'Wipro': 7.2,
            'Accenture': 9.5
        }
    },
    {
        role: 'Software Engineer',
        experience: 'Mid-level (3-5 yrs)',
        location: 'Bangalore',
        industry: 'Tech',
        avgSalary: 18.0,
        minSalary: 14.0,
        maxSalary: 24.0,
        companies: {
            'Google': 32.0,
            'Microsoft': 30.0,
            'Amazon': 28.0,
            'TCS': 12.0,
            'Infosys': 11.0,
            'Wipro': 10.5,
            'Accenture': 14.0
        }
    },
    {
        role: 'Data Scientist',
        experience: 'Fresher (0-1 yr)',
        location: 'Bangalore',
        industry: 'Tech',
        avgSalary: 10.0,
        minSalary: 7.0,
        maxSalary: 14.0,
        companies: {
            'Google': 18.0,
            'Microsoft': 17.0,
            'Amazon': 16.5,
            'TCS': 6.5,
            'Infosys': 6.0,
            'Wipro': 5.8,
            'Accenture': 7.5
        }
    },
    {
        role: 'Data Scientist',
        experience: 'Junior (1-3 yrs)',
        location: 'Bangalore',
        industry: 'Tech',
        avgSalary: 15.0,
        minSalary: 12.0,
        maxSalary: 20.0,
        companies: {
            'Google': 25.0,
            'Microsoft': 24.0,
            'Amazon': 23.0,
            'TCS': 10.0,
            'Infosys': 9.5,
            'Wipro': 9.0,
            'Accenture': 12.0
        }
    },
    {
        role: 'Product Manager',
        experience: 'Mid-level (3-5 yrs)',
        location: 'Mumbai',
        industry: 'E-commerce',
        avgSalary: 16.0,
        minSalary: 12.0,
        maxSalary: 22.0,
        companies: {
            'Google': 30.0,
            'Microsoft': 28.0,
            'Amazon': 26.0,
            'TCS': 14.0,
            'Infosys': 13.0,
            'Wipro': 12.5,
            'Accenture': 16.0
        }
    },
    {
        role: 'UX Designer',
        experience: 'Junior (1-3 yrs)',
        location: 'Pune',
        industry: 'Tech',
        avgSalary: 12.0,
        minSalary: 9.0,
        maxSalary: 16.0,
        companies: {
            'Google': 22.0,
            'Microsoft': 20.0,
            'Amazon': 19.0,
            'TCS': 8.0,
            'Infosys': 7.5,
            'Wipro': 7.0,
            'Accenture': 10.0
        }
    },
    {
        role: 'Frontend Developer',
        experience: 'Senior (5-8 yrs)',
        location: 'Delhi',
        industry: 'Tech',
        avgSalary: 22.0,
        minSalary: 18.0,
        maxSalary: 28.0,
        companies: {
            'Google': 35.0,
            'Microsoft': 33.0,
            'Amazon': 31.0,
            'TCS': 15.0,
            'Infosys': 14.0,
            'Wipro': 13.5,
            'Accenture': 18.0
        }
    },
    {
        role: 'Backend Developer',
        experience: 'Mid-level (3-5 yrs)',
        location: 'Hyderabad',
        industry: 'Finance',
        avgSalary: 17.0,
        minSalary: 13.0,
        maxSalary: 22.0,
        companies: {
            'Google': 29.0,
            'Microsoft': 27.0,
            'Amazon': 25.0,
            'TCS': 13.0,
            'Infosys': 12.0,
            'Wipro': 11.5,
            'Accenture': 15.0
        }
    },
    {
        role: 'DevOps Engineer',
        experience: 'Junior (1-3 yrs)',
        location: 'Chennai',
        industry: 'Tech',
        avgSalary: 13.0,
        minSalary: 10.0,
        maxSalary: 17.0,
        companies: {
            'Google': 23.0,
            'Microsoft': 21.0,
            'Amazon': 20.0,
            'TCS': 9.0,
            'Infosys': 8.5,
            'Wipro': 8.0,
            'Accenture': 11.0
        }
    },
    
    // Global locations
    {
        role: 'Software Engineer',
        experience: 'Mid-level (3-5 yrs)',
        location: 'USA',
        industry: 'Tech',
        avgSalary: 120.0,
        minSalary: 100.0,
        maxSalary: 150.0,
        companies: {
            'Google': 180.0,
            'Microsoft': 170.0,
            'Amazon': 160.0,
            'Facebook': 175.0,
            'Apple': 165.0,
            'Netflix': 190.0,
            'LinkedIn': 155.0
        }
    },
    {
        role: 'Data Scientist',
        experience: 'Senior (5-8 yrs)',
        location: 'UK',
        industry: 'Finance',
        avgSalary: 85.0,
        minSalary: 70.0,
        maxSalary: 110.0,
        companies: {
            'Google': 120.0,
            'Microsoft': 110.0,
            'Amazon': 105.0,
            'HSBC': 90.0,
            'Barclays': 85.0,
            'JP Morgan': 95.0,
            'Goldman Sachs': 100.0
        }
    },
    {
        role: 'Product Manager',
        experience: 'Lead (8+ yrs)',
        location: 'Canada',
        industry: 'E-commerce',
        avgSalary: 110.0,
        minSalary: 90.0,
        maxSalary: 140.0,
        companies: {
            'Google': 150.0,
            'Microsoft': 140.0,
            'Amazon': 135.0,
            'Shopify': 130.0,
            'IBM': 100.0,
            'Salesforce': 120.0,
            'Adobe': 125.0
        }
    },
    {
        role: 'UX Designer',
        experience: 'Mid-level (3-5 yrs)',
        location: 'Germany',
        industry: 'Consulting',
        avgSalary: 75.0,
        minSalary: 60.0,
        maxSalary: 95.0,
        companies: {
            'Google': 100.0,
            'Microsoft': 95.0,
            'Amazon': 90.0,
            'SAP': 85.0,
            'Siemens': 80.0,
            'Bosch': 75.0,
            'Deutsche Bank': 70.0
        }
    },
    {
        role: 'Frontend Developer',
        experience: 'Junior (1-3 yrs)',
        location: 'Australia',
        industry: 'Tech',
        avgSalary: 80.0,
        minSalary: 65.0,
        maxSalary: 100.0,
        companies: {
            'Google': 110.0,
            'Microsoft': 105.0,
            'Amazon': 100.0,
            'Atlassian': 95.0,
            'Canva': 90.0,
            'Telstra': 75.0,
            'Commonwealth Bank': 80.0
        }
    },
    {
        role: 'DevOps Engineer',
        experience: 'Senior (5-8 yrs)',
        location: 'Singapore',
        industry: 'Finance',
        avgSalary: 95.0,
        minSalary: 80.0,
        maxSalary: 120.0,
        companies: {
            'Google': 130.0,
            'Microsoft': 125.0,
            'Amazon': 120.0,
            'DBS Bank': 100.0,
            'OCBC': 95.0,
            'Standard Chartered': 90.0,
            'Grab': 110.0
        }
    }
];
