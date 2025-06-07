// User name display and logout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the logged-in user's name from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userNameDisplay = document.getElementById('loggedInUserNameTV');
    
    if (loggedInUser) {
        try {
            const userData = JSON.parse(loggedInUser);
            userNameDisplay.textContent = `Hi, ${userData.name || "Guest"}!`;
        } catch {
            userNameDisplay.textContent = "Hi, Guest!";
        }
    } else {
        userNameDisplay.textContent = "Hi, Guest!";
    }

    // Logout functionality
    const logoutButton = document.getElementById('logout-buttonTV');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInStudentData');
        window.location.href = 'login.html';
    });
});

// Sample event data (in a real application, this would come from a backend API)
const sampleEvents = [
    {
        id: 1,
        name: "CodeFest 2024",
        type: "hackathon",
        location: "Mumbai",
        date: "2024-04-15",
        time: "09:00 AM",
        organizer: "Tech University Mumbai",
        description: "A 24-hour hackathon focused on sustainable technology solutions.",
        registrationDeadline: "2024-04-10",
        prizeDetails: "1st Prize: ₹50,000\n2nd Prize: ₹30,000\n3rd Prize: ₹20,000",
        problemStatements: [
            "Smart City Solutions",
            "Healthcare Innovation",
            "Education Technology"
        ],
        rules: [
            "Team size: 2-4 members",
            "All participants must be college students",
            "No pre-built solutions allowed"
        ],
        contact: {
            email: "codefest@techuniversity.edu",
            phone: "+91 9876543210"
        },
        pastHighlights: [
            "2023 Winner: Smart Traffic Management System",
            "2022 Winner: AI-powered Healthcare Assistant"
        ],
        image: "https://via.placeholder.com/400x200?text=CodeFest+2024",
        fee: 0
    },
    {
        id: 2,
        name: "AI Innovation Challenge",
        type: "hackathon",
        location: "Online",
        date: "2024-05-01",
        time: "10:00 AM",
        organizer: "AI Research Institute",
        description: "Build innovative AI solutions for real-world problems.",
        registrationDeadline: "2024-04-25",
        prizeDetails: "1st Prize: ₹75,000\n2nd Prize: ₹45,000\n3rd Prize: ₹30,000",
        problemStatements: [
            "AI for Healthcare",
            "Natural Language Processing",
            "Computer Vision Applications"
        ],
        rules: [
            "Individual or team participation",
            "Open to all students and professionals",
            "Must use provided AI frameworks"
        ],
        contact: {
            email: "ai-challenge@research.edu",
            phone: "+91 9876543211"
        },
        image: "https://via.placeholder.com/400x200?text=AI+Innovation",
        fee: 200
    },
    {
        id: 3,
        name: "TechSpark Internship Fair",
        type: "internship",
        location: "Delhi",
        date: "2024-06-10",
        time: "11:00 AM",
        organizer: "TechSpark Pvt Ltd",
        description: "Meet top tech companies and apply for summer internships.",
        registrationDeadline: "2024-06-01",
        prizeDetails: "Internship offers, certificates, and goodies",
        problemStatements: ["N/A"],
        rules: ["Open to all undergraduate students"],
        contact: { email: "internfair@techspark.com", phone: "+91 9876543212" },
        pastHighlights: ["2023: 120+ internships offered"],
        image: "https://via.placeholder.com/400x200?text=Internship+Fair",
        fee: 0
    },
    {
        id: 4,
        name: "Women in Tech Hackathon",
        type: "hackathon",
        location: "Bangalore",
        date: "2024-07-20",
        time: "08:00 AM",
        organizer: "WomenTech Network",
        description: "Empowering women in technology through innovation.",
        registrationDeadline: "2024-07-10",
        prizeDetails: "Cash prizes, mentorship, and job offers",
        problemStatements: ["Women safety apps", "EdTech for girls"],
        rules: ["Teams must have at least one female member"],
        contact: { email: "wit@womentech.org", phone: "+91 9876543213" },
        pastHighlights: ["2023: 50+ teams participated"],
        image: "https://via.placeholder.com/400x200?text=Women+in+Tech",
        fee: 150
    },
    {
        id: 5,
        name: "GreenTech Fest",
        type: "techfest",
        location: "Chennai",
        date: "2024-08-05",
        time: "10:00 AM",
        organizer: "GreenTech University",
        description: "A festival celebrating green technology and sustainability.",
        registrationDeadline: "2024-07-30",
        prizeDetails: "Trophies, certificates, and eco-gadgets",
        problemStatements: ["Renewable energy solutions"],
        rules: ["Open to all"],
        contact: { email: "greentech@univ.edu", phone: "+91 9876543214" },
        pastHighlights: ["2023: 2000+ attendees"],
        image: "https://via.placeholder.com/400x200?text=GreenTech+Fest",
        fee: 0
    },
    {
        id: 6,
        name: "Startup Bootcamp",
        type: "workshop",
        location: "Hyderabad",
        date: "2024-09-12",
        time: "09:30 AM",
        organizer: "Startup India",
        description: "A hands-on workshop for aspiring entrepreneurs.",
        registrationDeadline: "2024-09-01",
        prizeDetails: "Incubation support, seed funding opportunities",
        problemStatements: ["N/A"],
        rules: ["Open to all students"],
        contact: { email: "bootcamp@startupindia.gov.in", phone: "+91 9876543215" },
        pastHighlights: ["2023: 10 startups incubated"],
        image: "https://via.placeholder.com/400x200?text=Startup+Bootcamp",
        fee: 0
    },
    {
        id: 7,
        name: "CyberSec CTF",
        type: "hackathon",
        location: "Online",
        date: "2024-10-18",
        time: "12:00 PM",
        organizer: "CyberSec Club",
        description: "Capture the Flag competition for cybersecurity enthusiasts.",
        registrationDeadline: "2024-10-10",
        prizeDetails: "Cash prizes, swag, and certificates",
        problemStatements: ["Web security", "Reverse engineering"],
        rules: ["Teams of up to 5"],
        contact: { email: "ctf@cybersec.club", phone: "+91 9876543216" },
        pastHighlights: ["2023: 300+ participants"],
        image: "https://via.placeholder.com/400x200?text=CyberSec+CTF",
        fee: 0
    },
    {
        id: 8,
        name: "Data Science Expo",
        type: "techfest",
        location: "Pune",
        date: "2024-11-03",
        time: "11:00 AM",
        organizer: "Pune Data Society",
        description: "Showcase of data science projects and research.",
        registrationDeadline: "2024-10-25",
        prizeDetails: "Best project awards, internships",
        problemStatements: ["Data visualization", "Predictive analytics"],
        rules: ["Open to all"],
        contact: { email: "expo@pds.org", phone: "+91 9876543217" },
        pastHighlights: ["2023: 80+ projects showcased"],
        image: "https://via.placeholder.com/400x200?text=Data+Science+Expo",
        fee: 0
    },
    {
        id: 9,
        name: "Robotics Internship Drive",
        type: "internship",
        location: "Bangalore",
        date: "2024-12-01",
        time: "10:00 AM",
        organizer: "RoboCorp",
        description: "Apply for winter internships in robotics and automation.",
        registrationDeadline: "2024-11-20",
        prizeDetails: "Internship offers, stipends",
        problemStatements: ["N/A"],
        rules: ["Engineering students only"],
        contact: { email: "interns@robocorp.com", phone: "+91 9876543218" },
        pastHighlights: ["2023: 30 interns placed"],
        image: "https://via.placeholder.com/400x200?text=Robotics+Internship",
        fee: 0
    },
    {
        id: 10,
        name: "Blockchain Bootcamp",
        type: "workshop",
        location: "Kolkata",
        date: "2025-01-15",
        time: "09:00 AM",
        organizer: "BlockChainers",
        description: "Learn blockchain development from industry experts.",
        registrationDeadline: "2025-01-05",
        prizeDetails: "Certification, project showcase",
        problemStatements: ["Smart contracts", "DeFi apps"],
        rules: ["Open to all"],
        contact: { email: "bootcamp@blockchainers.com", phone: "+91 9876543219" },
        pastHighlights: ["2024: 100+ certified"],
        image: "https://via.placeholder.com/400x200?text=Blockchain+Bootcamp",
        fee: 0
    },
    {
        id: 11,
        name: "AppDev Sprint",
        type: "hackathon",
        location: "Ahmedabad",
        date: "2025-02-10",
        time: "10:00 AM",
        organizer: "AppSprint Foundation",
        description: "Build mobile apps in 36 hours for social good.",
        registrationDeadline: "2025-02-01",
        prizeDetails: "Cash prizes, internships",
        problemStatements: ["Health apps", "Education apps"],
        rules: ["Teams of 2-4"],
        contact: { email: "sprint@appsprint.org", phone: "+91 9876543220" },
        pastHighlights: ["2024: 40+ apps built"],
        image: "https://via.placeholder.com/400x200?text=AppDev+Sprint",
        fee: 0
    },
    {
        id: 12,
        name: "Quantum Computing Workshop",
        type: "workshop",
        location: "Online",
        date: "2025-03-05",
        time: "02:00 PM",
        organizer: "QuantumLeap",
        description: "Dive into the world of quantum computing.",
        registrationDeadline: "2025-02-25",
        prizeDetails: "Certification, project showcase",
        problemStatements: ["Quantum algorithms"],
        rules: ["Open to all"],
        contact: { email: "workshop@quantumleap.com", phone: "+91 9876543221" },
        pastHighlights: ["2024: 200+ participants"],
        image: "https://via.placeholder.com/400x200?text=Quantum+Workshop",
        fee: 0
    },
    {
        id: 13,
        name: "FinTech Internship Program",
        type: "internship",
        location: "Mumbai",
        date: "2025-04-01",
        time: "11:00 AM",
        organizer: "FinTech India",
        description: "Internship opportunities in the financial technology sector.",
        registrationDeadline: "2025-03-20",
        prizeDetails: "Internship offers, stipends",
        problemStatements: ["N/A"],
        rules: ["Finance/CS students preferred"],
        contact: { email: "interns@fintechindia.com", phone: "+91 9876543222" },
        pastHighlights: ["2024: 25 interns placed"],
        image: "https://via.placeholder.com/400x200?text=FinTech+Internship",
        fee: 0
    },
    {
        id: 14,
        name: "AR/VR TechFest",
        type: "techfest",
        location: "Hyderabad",
        date: "2025-05-10",
        time: "10:00 AM",
        organizer: "XR Innovators",
        description: "Explore the latest in AR and VR technologies.",
        registrationDeadline: "2025-05-01",
        prizeDetails: "Best demo awards, gadgets",
        problemStatements: ["AR for education", "VR for healthcare"],
        rules: ["Open to all"],
        contact: { email: "arvr@xrinnovators.com", phone: "+91 9876543223" },
        pastHighlights: ["2024: 60+ demos"],
        image: "https://via.placeholder.com/400x200?text=AR+VR+TechFest",
        fee: 0
    },
    {
        id: 15,
        name: "Cloud Computing Hackathon",
        type: "hackathon",
        location: "Chandigarh",
        date: "2025-06-15",
        time: "09:00 AM",
        organizer: "CloudX Labs",
        description: "Solve real-world problems using cloud technologies.",
        registrationDeadline: "2025-06-05",
        prizeDetails: "Cloud credits, cash prizes",
        problemStatements: ["Cloud migration", "Serverless apps"],
        rules: ["Teams of up to 4"],
        contact: { email: "hackathon@cloudxlabs.com", phone: "+91 9876543224" },
        pastHighlights: ["2024: 35 teams participated"],
        image: "https://via.placeholder.com/400x200?text=Cloud+Hackathon",
        fee: 0
    },
    {
        id: 16,
        name: "Smart City Hackathon",
        type: "hackathon",
        location: "Nagpur",
        date: "2025-07-10",
        time: "09:00 AM",
        organizer: "Nagpur Smart City",
        description: "Innovate for smarter urban living.",
        registrationDeadline: "2025-07-01",
        prizeDetails: "Cash prizes, city internships",
        problemStatements: ["Traffic management", "Waste management"],
        rules: ["Teams of 3-5"],
        contact: { email: "smartcity@nagpur.gov.in", phone: "+91 9876543225" },
        pastHighlights: ["2024: 20+ solutions implemented"],
        image: "https://via.placeholder.com/400x200?text=Smart+City+Hackathon",
        fee: 0
    },
    {
        id: 17,
        name: "BioTech Internship Drive",
        type: "internship",
        location: "Pune",
        date: "2025-08-01",
        time: "10:00 AM",
        organizer: "BioGen Labs",
        description: "Internships in biotechnology and life sciences.",
        registrationDeadline: "2025-07-20",
        prizeDetails: "Internship offers, stipends",
        problemStatements: ["N/A"],
        rules: ["Biotech students only"],
        contact: { email: "interns@biogenlabs.com", phone: "+91 9876543226" },
        pastHighlights: ["2024: 15 interns placed"],
        image: "https://via.placeholder.com/400x200?text=BioTech+Internship",
        fee: 0
    },
    {
        id: 18,
        name: "Eco Warriors TechFest",
        type: "techfest",
        location: "Goa",
        date: "2025-09-15",
        time: "11:00 AM",
        organizer: "Goa University",
        description: "Tech fest for environmental innovation.",
        registrationDeadline: "2025-09-01",
        prizeDetails: "Eco-gadgets, certificates",
        problemStatements: ["Plastic alternatives", "Water conservation"],
        rules: ["Open to all"],
        contact: { email: "ecofest@goauniv.edu", phone: "+91 9876543227" },
        pastHighlights: ["2024: 500+ attendees"],
        image: "https://via.placeholder.com/400x200?text=Eco+Warriors+TechFest",
        fee: 0
    },
    {
        id: 19,
        name: "AI for Good Workshop",
        type: "workshop",
        location: "Online",
        date: "2025-10-05",
        time: "03:00 PM",
        organizer: "AI4Good Foundation",
        description: "Workshop on AI solutions for social impact.",
        registrationDeadline: "2025-09-25",
        prizeDetails: "Certification, project showcase",
        problemStatements: ["AI for accessibility", "AI for disaster response"],
        rules: ["Open to all"],
        contact: { email: "workshop@ai4good.org", phone: "+91 9876543228" },
        pastHighlights: ["2024: 100+ projects presented"],
        image: "https://via.placeholder.com/400x200?text=AI+for+Good+Workshop",
        fee: 0
    },
    {
        id: 20,
        name: "EdTech Hackathon",
        type: "hackathon",
        location: "Lucknow",
        date: "2025-11-12",
        time: "09:00 AM",
        organizer: "EdTech India",
        description: "Hackathon for next-gen education solutions.",
        registrationDeadline: "2025-11-01",
        prizeDetails: "Cash prizes, internships",
        problemStatements: ["Remote learning", "Gamification in education"],
        rules: ["Teams of 2-5"],
        contact: { email: "hackathon@edtechindia.com", phone: "+91 9876543229" },
        pastHighlights: ["2024: 60+ teams"],
        image: "https://via.placeholder.com/400x200?text=EdTech+Hackathon",
        fee: 0
    },
    {
        id: 21,
        name: "Women in STEM Internship Fair",
        type: "internship",
        location: "Delhi",
        date: "2025-12-01",
        time: "10:00 AM",
        organizer: "STEM India",
        description: "Internship opportunities for women in STEM.",
        registrationDeadline: "2025-11-20",
        prizeDetails: "Internship offers, mentorship",
        problemStatements: ["N/A"],
        rules: ["Women students only"],
        contact: { email: "interns@stemindia.com", phone: "+91 9876543230" },
        pastHighlights: ["2024: 30 interns placed"],
        image: "https://via.placeholder.com/400x200?text=Women+in+STEM+Internship",
        fee: 0
    },
    {
        id: 22,
        name: "IoT TechFest",
        type: "techfest",
        location: "Bhopal",
        date: "2026-01-20",
        time: "11:00 AM",
        organizer: "IoT Innovators",
        description: "Tech fest for Internet of Things enthusiasts.",
        registrationDeadline: "2026-01-10",
        prizeDetails: "IoT kits, certificates",
        problemStatements: ["Smart homes", "Wearable tech"],
        rules: ["Open to all"],
        contact: { email: "iotfest@iotinnovators.com", phone: "+91 9876543231" },
        pastHighlights: ["2025: 70+ projects"],
        image: "https://via.placeholder.com/400x200?text=IoT+TechFest",
        fee: 0
    },
    {
        id: 23,
        name: "Full Stack Bootcamp",
        type: "workshop",
        location: "Chennai",
        date: "2026-02-15",
        time: "09:30 AM",
        organizer: "CodeMasters",
        description: "Intensive bootcamp on full stack web development.",
        registrationDeadline: "2026-02-01",
        prizeDetails: "Certification, job referrals",
        problemStatements: ["N/A"],
        rules: ["Open to all"],
        contact: { email: "bootcamp@codemasters.com", phone: "+91 9876543232" },
        pastHighlights: ["2025: 150+ certified"],
        image: "https://via.placeholder.com/400x200?text=Full+Stack+Bootcamp",
        fee: 0
    },
    {
        id: 24,
        name: "AgriTech Hackathon",
        type: "hackathon",
        location: "Patna",
        date: "2026-03-10",
        time: "10:00 AM",
        organizer: "AgriTech India",
        description: "Innovate for the future of agriculture.",
        registrationDeadline: "2026-03-01",
        prizeDetails: "Cash prizes, incubation support",
        problemStatements: ["Precision farming", "Agri drones"],
        rules: ["Teams of 2-6"],
        contact: { email: "hackathon@agritechindia.com", phone: "+91 9876543233" },
        pastHighlights: ["2025: 25+ startups incubated"],
        image: "https://via.placeholder.com/400x200?text=AgriTech+Hackathon",
        fee: 0
    },
    {
        id: 25,
        name: "HealthTech Internship Drive",
        type: "internship",
        location: "Mumbai",
        date: "2026-04-05",
        time: "11:00 AM",
        organizer: "HealthTech Solutions",
        description: "Internships in health technology and medtech.",
        registrationDeadline: "2026-03-25",
        prizeDetails: "Internship offers, stipends",
        problemStatements: ["N/A"],
        rules: ["Medical/CS students preferred"],
        contact: { email: "interns@healthtech.com", phone: "+91 9876543234" },
        pastHighlights: ["2025: 20 interns placed"],
        image: "https://via.placeholder.com/400x200?text=HealthTech+Internship",
        fee: 0
    },
    {
        id: 26,
        name: "GameDev TechFest",
        type: "techfest",
        location: "Bangalore",
        date: "2026-05-12",
        time: "10:00 AM",
        organizer: "GameMakers",
        description: "Tech fest for game development and design.",
        registrationDeadline: "2026-05-01",
        prizeDetails: "Best game awards, gadgets",
        problemStatements: ["Mobile games", "VR games"],
        rules: ["Open to all"],
        contact: { email: "gamedev@makers.com", phone: "+91 9876543235" },
        pastHighlights: ["2025: 50+ games showcased"],
        image: "https://via.placeholder.com/400x200?text=GameDev+TechFest",
        fee: 0
    },
    {
        id: 27,
        name: "Cloud Internship Program",
        type: "internship",
        location: "Hyderabad",
        date: "2026-06-01",
        time: "09:00 AM",
        organizer: "CloudWorks",
        description: "Internships in cloud computing and DevOps.",
        registrationDeadline: "2026-05-20",
        prizeDetails: "Internship offers, cloud credits",
        problemStatements: ["N/A"],
        rules: ["CS/IT students only"],
        contact: { email: "interns@cloudworks.com", phone: "+91 9876543236" },
        pastHighlights: ["2025: 18 interns placed"],
        image: "https://via.placeholder.com/400x200?text=Cloud+Internship",
        fee: 0
    },
    {
        id: 28,
        name: "AI & Robotics Workshop",
        type: "workshop",
        location: "Online",
        date: "2026-07-15",
        time: "02:00 PM",
        organizer: "Robotics Society",
        description: "Workshop on AI and robotics integration.",
        registrationDeadline: "2026-07-05",
        prizeDetails: "Certification, project showcase",
        problemStatements: ["AI for robots", "Autonomous navigation"],
        rules: ["Open to all"],
        contact: { email: "workshop@roboticsociety.com", phone: "+91 9876543237" },
        pastHighlights: ["2025: 120+ participants"],
        image: "https://via.placeholder.com/400x200?text=AI+Robotics+Workshop",
        fee: 0
    },
    {
        id: 29,
        name: "Sustainability Hackathon",
        type: "hackathon",
        location: "Jaipur",
        date: "2026-08-10",
        time: "09:00 AM",
        organizer: "SustainTech",
        description: "Hackathon for sustainable development goals.",
        registrationDeadline: "2026-08-01",
        prizeDetails: "Cash prizes, incubation support",
        problemStatements: ["Clean water", "Affordable energy"],
        rules: ["Teams of 2-5"],
        contact: { email: "hackathon@sustaintech.com", phone: "+91 9876543238" },
        pastHighlights: ["2025: 40+ teams"],
        image: "https://via.placeholder.com/400x200?text=Sustainability+Hackathon",
        fee: 0
    },
    {
        id: 30,
        name: "Mobile App Internship Drive",
        type: "internship",
        location: "Kolkata",
        date: "2026-09-01",
        time: "10:00 AM",
        organizer: "AppDev Solutions",
        description: "Internships in mobile app development.",
        registrationDeadline: "2026-08-20",
        prizeDetails: "Internship offers, stipends",
        problemStatements: ["N/A"],
        rules: ["CS/IT students only"],
        contact: { email: "interns@appdevsolutions.com", phone: "+91 9876543239" },
        pastHighlights: ["2025: 22 interns placed"],
        image: "https://via.placeholder.com/400x200?text=Mobile+App+Internship",
        fee: 0
    }
];

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const eventSearch = document.getElementById('event-search');
const eventType = document.getElementById('event-type');
const eventLocation = document.getElementById('event-location');
const eventModal = document.getElementById('event-modal');
const eventDetails = document.getElementById('event-details');
const closeModal = document.querySelector('.close-modal');
const exploreEventsBtn = document.querySelector('.explore-events-btn');
const viewToggleBtns = document.querySelectorAll('.view-toggle button');
const categoryCards = document.querySelectorAll('.category-card');
const hostNowBtn = document.querySelector('.host-now-btn');
const hostModal = document.getElementById('host-modal');
const closeHostModal = document.querySelector('.close-host-modal');

// State
let filteredEvents = [...sampleEvents];
let bookmarkedEvents = new Set();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderEvents(filteredEvents);
    setupEventListeners();

    // Registration Modal HTML
    const registrationModalHTML = `
      <div id="registration-modal" class="modal">
        <div class="modal-content" style="max-width: 400px; padding: 2rem 2.2rem;">
          <div class="modal-accent-bar"></div>
          <span class="close-modal" id="close-registration-modal">&times;</span>
          <h2 style="font-size:1.4rem; margin-bottom:1.2rem; color:#03A9F4;">Event Registration</h2>
          <form id="event-registration-form">
            <div class="form-group">
              <label for="reg-name">Full Name</label>
              <input type="text" id="reg-name" name="name" required autocomplete="off" />
            </div>
            <div class="form-group">
              <label for="reg-email">Email</label>
              <input type="email" id="reg-email" name="email" required autocomplete="off" />
            </div>
            <div class="form-group">
              <label for="reg-phone">Phone</label>
              <input type="tel" id="reg-phone" name="phone" required autocomplete="off" />
            </div>
            <div id="event-fee-label" style="font-weight:600;color:#03A9F4;margin-bottom:0.7rem;"></div>
            <div id="payment-section" style="display:none;margin-bottom:1.2rem;">
              <label style="font-weight:500;">Payment Options</label>
              <div style="display:flex;gap:1rem;margin-top:0.5rem;">
                <label><input type="radio" name="payment-method" value="upi" required> UPI</label>
                <label><input type="radio" name="payment-method" value="card"> Card</label>
                <label><input type="radio" name="payment-method" value="netbanking"> Netbanking</label>
              </div>
              <input type="text" id="payment-details" name="payment-details" placeholder="Enter UPI ID / Card / Bank details" style="margin-top:0.7rem;width:100%;padding:0.6rem;border-radius:8px;border:1px solid #ddd;" required />
            </div>
            <div id="team-section" style="margin-bottom:1.2rem;">
              <label style="font-weight:500;">Team Members (optional, up to 4)</label>
              <input type="text" name="team1" placeholder="Team Member 1 Name" style="margin-top:0.5rem;width:100%;padding:0.6rem;border-radius:8px;border:1px solid #ddd;" />
              <input type="text" name="team2" placeholder="Team Member 2 Name" style="margin-top:0.5rem;width:100%;padding:0.6rem;border-radius:8px;border:1px solid #ddd;" />
              <input type="text" name="team3" placeholder="Team Member 3 Name" style="margin-top:0.5rem;width:100%;padding:0.6rem;border-radius:8px;border:1px solid #ddd;" />
              <input type="text" name="team4" placeholder="Team Member 4 Name" style="margin-top:0.5rem;width:100%;padding:0.6rem;border-radius:8px;border:1px solid #ddd;" />
            </div>
            <button type="submit" class="glow-btn" style="width:100%;margin-top:1.2rem;">Submit Registration</button>
          </form>
        </div>
      </div>
    `;
    // Append registration modal to body if not present
    if (!document.getElementById('registration-modal')) {
      document.body.insertAdjacentHTML('beforeend', registrationModalHTML);
    }
    const registrationModal = document.getElementById('registration-modal');
    const closeRegistrationModal = document.getElementById('close-registration-modal');
    const registrationForm = document.getElementById('event-registration-form');

    window.openRegistrationModal = function(eventId) {
      const event = sampleEvents.find(e => e.id === eventId);
      const registrationModal = document.getElementById('registration-modal');
      const registrationForm = document.getElementById('event-registration-form');
      const paymentSection = document.getElementById('payment-section');
      const teamSection = document.getElementById('team-section');
      // Show/hide payment and team fields
      if (event && event.fee && event.fee > 0) {
        if (paymentSection) paymentSection.style.display = 'block';
        if (teamSection) teamSection.style.display = 'block';
        document.getElementById('event-fee-label').textContent = `Registration Fee: ₹${event.fee}`;
      } else {
        if (paymentSection) paymentSection.style.display = 'none';
        if (teamSection) teamSection.style.display = 'block'; // Still allow team for free events
        document.getElementById('event-fee-label').textContent = '';
      }
      registrationModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      registrationForm.setAttribute('data-event-id', eventId);
    };
    function closeRegistration() {
      registrationModal.style.display = 'none';
      document.body.style.overflow = '';
    }
    if (closeRegistrationModal) closeRegistrationModal.onclick = closeRegistration;
    window.addEventListener('click', (e) => {
      if (e.target === registrationModal) closeRegistration();
    });
    if (registrationForm) {
      registrationForm.onsubmit = function(e) {
        e.preventDefault();
        const eventId = parseInt(registrationForm.getAttribute('data-event-id'));
        const event = sampleEvents.find(e => e.id === eventId);
        if (event && event.fee && event.fee > 0) {
          // Validate payment fields
          const paymentMethod = registrationForm.querySelector('input[name="payment-method"]:checked');
          const paymentDetails = registrationForm.querySelector('#payment-details').value.trim();
          if (!paymentMethod || !paymentDetails) {
            showNotification('Please select a payment method and enter payment details.', 'error');
            return;
          }
        }
        // Optionally collect team members
        const team = [];
        for (let i = 1; i <= 4; i++) {
          const member = registrationForm.querySelector(`[name='team${i}']`).value.trim();
          if (member) team.push(member);
        }
        // Success
        document.getElementById('registration-modal').style.display = 'none';
        document.body.style.overflow = '';
        showNotification('Registration successful! You will be contacted soon.', 'success');
        registrationForm.reset();
      };
    }
});

function setupEventListeners() {
    // Search input
    if (eventSearch) {
        eventSearch.addEventListener('input', filterEvents);
    }

    // Event type filter
    if (eventType) {
        eventType.addEventListener('change', filterEvents);
    }
    
    // Event location filter
    if (eventLocation) {
        eventLocation.addEventListener('change', filterEvents);
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            eventModal.style.display = 'none';
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            eventModal.style.display = 'none';
        }
        if (e.target === hostModal) {
            hostModal.style.display = 'none';
        }
    });
    
    // Explore Events button
    if (exploreEventsBtn) {
        exploreEventsBtn.addEventListener('click', () => {
            // Scroll to events section
            document.querySelector('.events-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Host Now button
    if (hostNowBtn) {
        hostNowBtn.addEventListener('click', () => {
            hostModal.style.display = 'block';
        });
    }
    
    // Close Host Modal
    if (closeHostModal) {
        closeHostModal.addEventListener('click', () => {
            hostModal.style.display = 'none';
        });
    }
    
    // View toggle buttons
    if (viewToggleBtns && viewToggleBtns.length > 0) {
        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                viewToggleBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Toggle view mode
                if (btn.querySelector('.fa-th-large')) {
                    eventsContainer.classList.remove('list-view');
                    eventsContainer.classList.add('grid-view');
                } else {
                    eventsContainer.classList.remove('grid-view');
                    eventsContainer.classList.add('list-view');
                }
            });
        });
    }
    
    // Category cards
    if (categoryCards && categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const categoryText = card.querySelector('span').textContent.toLowerCase();
                let filterValue = '';
                
                // Map category text to filter value
                switch (categoryText) {
                    case 'hackathons':
                        filterValue = 'hackathon';
                        break;
                    case 'workshops':
                        filterValue = 'workshop';
                        break;
                    case 'competitions':
                        filterValue = 'competition';
                        break;
                    case 'scholarships':
                        filterValue = 'scholarship';
                        break;
                    case 'quizzes':
                        filterValue = 'quiz';
                        break;
                }
                
                // Set the event type filter
                if (eventType && filterValue) {
                    eventType.value = filterValue;
                    // Trigger the filter
                    filterEvents();
                    // Scroll to events section
                    document.querySelector('.events-section').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

function filterEvents() {
    // Get current filter values
    const searchTerm = eventSearch ? eventSearch.value.toLowerCase().trim() : '';
    const typeFilter = eventType ? eventType.value : '';
    const locationFilter = eventLocation ? eventLocation.value : '';
    
    console.log('Filtering with:', { searchTerm, typeFilter, locationFilter });

    // Filter events based on criteria
    filteredEvents = sampleEvents.filter(event => {
        // Search term matching
        const matchesSearch = 
            !searchTerm || // Empty search matches all
            event.name.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.organizer.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm) ||
            (event.type && event.type.toLowerCase().includes(searchTerm));
        
        // Type filter matching
        const matchesType = !typeFilter || event.type === typeFilter;
        
        // Location filter matching
        const matchesLocation = !locationFilter || 
            event.location.toLowerCase() === locationFilter.toLowerCase();
        
        // Debug
        if (searchTerm && event.name.toLowerCase().includes(searchTerm)) {
            console.log('Match found:', event.name);
        }
        
        // Return true only if all criteria match
        return matchesSearch && matchesType && matchesLocation;
    });

    console.log('Filtered events:', filteredEvents.length);
    renderEvents(filteredEvents);
}

function renderEvents(events) {
    eventsContainer.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-card-header">
                <h3>${event.name}</h3>
                <span class="event-type ${event.type}">${event.type}</span>
            </div>
            <div class="event-card-content">
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(event.date)} at ${event.time}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-university"></i>
                        <span>${event.organizer}</span>
                    </div>
                </div>
                <p>${event.description}</p>
                <div class="event-actions">
                    <button class="bookmark-btn ${bookmarkedEvents.has(event.id) ? 'active' : ''}"
                            data-event-id="${event.id}" aria-label="Bookmark this event">
                        <i class="fas fa-bookmark"></i>
                    </button>
                    <button class="view-details-btn" data-event-id="${event.id}" aria-label="View event details">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners for View Details and Bookmark buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = parseInt(btn.getAttribute('data-event-id'));
            showEventDetails(eventId);
        });
    });
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = parseInt(btn.getAttribute('data-event-id'));
            toggleBookmark(eventId);
        });
    });
}

function showEventDetails(eventId) {
    const event = sampleEvents.find(e => e.id === eventId);
    if (!event) return;

    const eventDetails = document.getElementById('event-details');
    const eventModal = document.getElementById('event-modal');

    // Get event type color for styling
    const getTypeColor = (type) => {
        switch(type) {
            case 'hackathon': return '#6a11cb';
            case 'techfest': return '#2575fc';
            case 'workshop': return '#f8b500';
            case 'internship': return '#ff5e62';
            default: return '#6a11cb';
        }
    };

    // Set custom property for event type color
    document.documentElement.style.setProperty('--event-type-color', getTypeColor(event.type));

    eventDetails.innerHTML = `
        <div class="modal-accent-bar"></div>
        <button class="close-modal" aria-label="Close modal">
            <i class="fas fa-times"></i>
        </button>
        <h2>${event.name}</h2>
        <div class="event-details-content">
            <section>
                <h3>Event Information</h3>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(event.date)} at ${event.time}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-university"></i>
                        <span>${event.organizer}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-hourglass-end"></i>
                        <span>Registration Deadline: ${formatDate(event.registrationDeadline)}</span>
                    </div>
                </div>
            </section>

            <section>
                <h3>Description</h3>
                <p>${event.description}</p>
            </section>

            <section>
                <h3>Prize Details</h3>
                <pre>${event.prizeDetails}</pre>
            </section>

            <section>
                <h3>Problem Statements</h3>
                <ul>
                    ${event.problemStatements.map(ps => `<li>${ps}</li>`).join('')}
                </ul>
            </section>

            <section>
                <h3>Rules & Eligibility</h3>
                <ul>
                    ${event.rules.map(rule => `<li>${rule}</li>`).join('')}
                </ul>
            </section>

            <section>
                <h3>Contact Information</h3>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="fas fa-envelope"></i>
                        <span>${event.contact.email}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-phone-alt"></i>
                        <span>${event.contact.phone}</span>
                    </div>
                </div>
            </section>

            ${event.pastHighlights ? `
                <section>
                    <h3>Past Highlights</h3>
                    <ul>
                        ${event.pastHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </section>
            ` : ''}

            <div class="event-actions">
                <button class="register-now-btn">
                    Register Now
                </button>
            </div>
        </div>
    `;

    // Show modal with animation
    eventModal.style.display = 'block';
    setTimeout(() => {
        eventModal.style.opacity = '1';
    }, 10);

    // Close modal functionality
    const closeBtn = eventDetails.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            eventModal.style.opacity = '0';
            setTimeout(() => {
                eventModal.style.display = 'none';
            }, 300);
        });
    }

    // Close on click outside
    eventModal.addEventListener('click', function(e) {
        if (e.target === eventModal) {
            eventModal.style.opacity = '0';
            setTimeout(() => {
                eventModal.style.display = 'none';
            }, 300);
        }
    });

    // Attach event listener to Register Now button
    const registerBtn = eventDetails.querySelector('.register-now-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            if (typeof window.openRegistrationModal === 'function') {
                window.openRegistrationModal(event.id);
            }
        });
    }
}

function toggleBookmark(eventId) {
    if (bookmarkedEvents.has(eventId)) {
        bookmarkedEvents.delete(eventId);
    } else {
        bookmarkedEvents.add(eventId);
    }
    renderEvents(filteredEvents);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Notification function (reuse if already present)
function showNotification(message, type = 'success') {
  let notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerText = message;
  document.body.appendChild(notification);
  setTimeout(() => { notification.remove(); }, 3000);
}

// Settings Panel Functionality
let settingsInitialized = false;

function initializeSettings() {
    if (settingsInitialized) return;
    settingsInitialized = true;

    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettingsBtn = document.getElementById('close-settings');
    const themeOptions = document.querySelectorAll('.theme-option');

    if (!settingsButton || !settingsPanel || !closeSettingsBtn) {
        console.warn('Settings elements not found');
        return;
    }

    function openSettings(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        settingsPanel.style.display = 'block';
        settingsPanel.offsetHeight;
        settingsPanel.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSettings(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        settingsPanel.classList.remove('show');
        document.body.style.overflow = '';
    }

    function setTheme(theme) {
        if (!theme) return;
        themeOptions.forEach(option => option.classList.remove('active'));
        const selectedOption = document.querySelector(`.theme-option[data-theme="${theme}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        document.body.classList.remove('dark-mode', 'office-mode', 'aroma-mode');
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.toggle('dark-mode', prefersDark);
        } else if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (theme === 'office') {
            document.body.classList.add('office-mode');
        }
        localStorage.setItem('theme', theme);
    }

    // Remove any existing event listeners
    const newSettingsButton = settingsButton.cloneNode(true);
    settingsButton.parentNode.replaceChild(newSettingsButton, settingsButton);
    const newCloseSettingsBtn = closeSettingsBtn.cloneNode(true);
    closeSettingsBtn.parentNode.replaceChild(newCloseSettingsBtn, closeSettingsBtn);

    newSettingsButton.addEventListener('click', openSettings, { capture: true });
    newCloseSettingsBtn.addEventListener('click', closeSettings, { capture: true });

    document.addEventListener('click', (e) => {
        if (settingsPanel.classList.contains('show') && 
            !settingsPanel.contains(e.target) && 
            e.target !== newSettingsButton) {
            closeSettings();
        }
    }, { capture: true });

    themeOptions.forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
        newOption.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const theme = newOption.dataset.theme;
            if (theme) setTheme(theme);
        }, { capture: true });
    });

    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    if (savedTheme === 'system') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.matches);
        });
    }
    if (settingsPanel.classList.contains('show')) {
        settingsPanel.style.display = 'block';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettings);
} else {
    initializeSettings();
}
window.addEventListener('load', initializeSettings); 