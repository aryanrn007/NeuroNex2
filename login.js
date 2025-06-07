document.addEventListener('DOMContentLoaded', () => {
    // Initialize tech lines animation
    initTechLinesAnimation();
    
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('toggle-password');
    const errorMessageElement = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');
    const loginButtonText = loginButton.childNodes[0].nodeValue.trim();

    // Student data and credentials will be loaded from JSON file
    let studentCredentials = {};
    let allStudentsData = [];

    // Function to load student data from JSON file
    async function loadStudentData() {
        try {
            const response = await fetch('data/students.json');
            if (!response.ok) {
                throw new Error(`Failed to load student data: ${response.status}`);
            }
            
            const data = await response.json();
            allStudentsData = data;
            
            // Build credentials object from student data
            studentCredentials = {};
            data.forEach(student => {
                if (student.id && student.password) {
                    studentCredentials[student.id] = student.password;
                }
            });
            
            console.log("Student data loaded successfully");
            return true;
        } catch (error) {
            console.error("Error loading student data:", error);
            // Fallback to demo data if loading fails
            useDefaultStudentData();
            return false;
        }
    }
    
    // Fallback function to use default data if JSON loading fails
    function useDefaultStudentData() {
        console.log("Using default student data");
        studentCredentials = {
            "AaryanSantoshGajgeshwar": "aaryan123",
            "AnanyaPradeepSutar": "ananya123",
            "KhadijaYunusMulla": "khadija123",
            "SakshiManikSherkhane": "sakshi123",
            "ShrutiRavindraShanware": "shruti123",
            "AdityaMadhukarMane": "aditya123",
            "SrushtiChandrakantKore": "srushti123"
        };
        
        allStudentsData = [
            {
                "id": "AaryanSantoshGajgeshwar",
                "fullName": "Aaryan Santosh Gajgeshwar",
                "branch": "CSE",
                "cgpa": 8.75,
                "attendance": 92,
                "backlogs": 0,
                "keySkills": ["Python", "Machine Learning", "Data Analysis", "AWS Certified Cloud Practitioner"],
                "suggestedCompanies": ["Google", "Amazon", "Microsoft", "Infosys"],
                "linkedInProfile": "https://www.linkedin.com/in/aaryan-gajgeshwar-2259b7308/",
                "profilePic": "images/aaryan.jpg"
            },
            {
                "id": "AnanyaPradeepSutar",
                "fullName": "Ananya Pradeep Sutar",
                "branch": "CSE",
                "cgpa": 8.75,
                "attendance": 92,
                "backlogs": 0,
                "keySkills": ["Python", "Machine Learning", "Data Analysis", "AWS"],
                "suggestedCompanies": ["Google", "Amazon", "Microsoft", "Infosys"],
                "linkedInProfile": "#",
                "profilePic": "images/ananya.jpg"
            }
            // Other students would be here, but we're keeping it minimal for the fallback
        ];
    }

    async function loadStudentDataForLogin() {
        try {
            // Load student data from JSON file
            await loadStudentData();
            
            // Log available students and their credentials
            console.log("Available students:", Object.keys(studentCredentials));
            return true;
        } catch (error) {
            console.error("Error in login:", error);
            return false;
        }
    }

    // Load data but don't block login process
    loadStudentDataForLogin();

    // Function to generate a random 7-digit enrollment number prefixed with EN
    function generateEnrollmentNumber() {
        const randomNumber = Math.floor(1000000 + Math.random() * 9000000); // Generates a 7-digit number
        return `EN${randomNumber}`;
    }

    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordButton.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearErrors();
            loginButton.disabled = true;
            loginButton.innerHTML = 'Logging in...';

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (username === '' || password === '') {
                displayError("Username and password are required.");
                resetLoginButton();
                return;
            }
            
            // Remove @ prefix if present
            const formattedUsername = username.startsWith('@') ? username.substring(1) : username;
            
            // Find the student by exact ID match
            const loggedInStudent = allStudentsData.find(student => 
                student.id === formattedUsername
            );

            // For debugging
            console.log('Login attempt:', {
                enteredUsername: formattedUsername,
                enteredPassword: password,
                foundStudent: loggedInStudent ? loggedInStudent.id : 'not found',
                correctPassword: studentCredentials[formattedUsername] || 'N/A'
            });

            // Check if student exists and password matches
            if (loggedInStudent && password === studentCredentials[formattedUsername]) {
                
                loginButton.classList.add('success');
                loginButton.innerHTML = `Welcome! <span class="button-success-icon"><i class="fas fa-check"></i></span>`;
                
                // Manage persistent enrollment numbers
                let userEnrollmentNumbers = JSON.parse(localStorage.getItem('userEnrollmentNumbers')) || {};
                const studentId = loggedInStudent.id;
                let assignedEnrollmentNumber;

                if (userEnrollmentNumbers[studentId]) {
                    assignedEnrollmentNumber = userEnrollmentNumbers[studentId];
                    console.log(`Retrieved existing enrollment number for ${studentId}: ${assignedEnrollmentNumber}`);
                } else {
                    assignedEnrollmentNumber = generateEnrollmentNumber();
                    userEnrollmentNumbers[studentId] = assignedEnrollmentNumber;
                    localStorage.setItem('userEnrollmentNumbers', JSON.stringify(userEnrollmentNumbers));
                    console.log(`Generated and stored new enrollment number for ${studentId}: ${assignedEnrollmentNumber}`);
                }

                // Create a new object for storage, copying existing student data and adding the enrollment number
                const studentDataToStore = {
                    ...loggedInStudent, // Spread properties from the found student object
                    enrollmentNumber: assignedEnrollmentNumber // Use the persistent enrollment number
                };
                
                console.log("Logged in as:", studentDataToStore.fullName);
                console.log("Assigned Enrollment No.:", studentDataToStore.enrollmentNumber);
                
                localStorage.setItem('loggedInStudentData', JSON.stringify(studentDataToStore));
                localStorage.setItem('loggedInUser', JSON.stringify({ name: studentDataToStore.fullName.split(' ')[0] }));
                // Set default theme to light mode
                localStorage.setItem('theme', 'light');
                document.body.classList.remove('dark', 'office', 'aroma', 'system');
                document.body.classList.add('light');

                setTimeout(() => {
                    window.location.href = 'index.html'; 
                }, 1500);

            } else {
                if (!loggedInStudent) {
                    displayError("User not found. Please check your username.");
                } else {
                    displayError("Invalid password. Please try again.");
                }
                shakeCard();
                resetLoginButton();
            }
        });
    }

    function displayError(message) { errorMessageElement.textContent = message; }
    function clearErrors() { errorMessageElement.textContent = ''; }
    function resetLoginButton() {
        loginButton.disabled = false;
        loginButton.classList.remove('success');
        loginButton.innerHTML = `${loginButtonText} <span class="button-success-icon"><i class="fas fa-check"></i></span>`;
    }
    function shakeCard() {
        const card = document.querySelector('.login-card');
        if (card) {
            card.classList.add('shake-animation');
            setTimeout(() => card.classList.remove('shake-animation'), 500);
        }
    }
    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = `
        .shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; transform: translate3d(0, 0, 0); }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }`;
    document.head.appendChild(styleSheet);

    // Typewriter effect for greeting
    function typeWriterGreeting(text, element, speed = 60, callback) {
        element.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Typewriter greeting
    const greetings = [
        "Welcome, Developer!",
        "Hello, Coder!",
        "Greetings, Tech Explorer!",
        "Welcome Back, Programmer!"
    ];
    const greetingText = document.querySelector('.greeting-text');
    let greetIndex = 0;
    function showNextGreeting() {
        typeWriterGreeting(greetings[greetIndex], greetingText, 60, () => {
            setTimeout(() => {
                greetIndex = (greetIndex + 1) % greetings.length;
                showNextGreeting();
            }, 1800);
        });
    }
    showNextGreeting();

    // Input focus effects
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // Tech Lines Animation
    function initTechLinesAnimation() {
        const canvas = document.getElementById('tech-lines-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Node class
        class Node {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = Math.random() * 2 + 1; // Slightly larger nodes
                this.speed = Math.random() * 0.3 + 0.1;
                this.dirX = Math.random() > 0.5 ? 1 : -1;
                this.dirY = Math.random() > 0.5 ? 1 : -1;
                this.color = this.getRandomColor();
                this.connections = [];
                this.connectionDistance = 180; // Increased connection distance
            }
            
            getRandomColor() {
                const colors = [
                    {r: 0, g: 255, b: 157}, // Primary: #00ff9d
                    {r: 0, g: 184, b: 255}, // Secondary: #00b8ff
                    {r: 74, g: 222, b: 222}, // Bright teal
                    {r: 200, g: 255, b: 255} // Bright white-blue
                ];
                
                return colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.speed * this.dirX;
                this.y += this.speed * this.dirY;
                
                // Bounce off edges
                if (this.x <= 0 || this.x >= canvas.width) {
                    this.dirX *= -1;
                }
                
                if (this.y <= 0 || this.y >= canvas.height) {
                    this.dirY *= -1;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
                ctx.fill();
            }
            
            findConnections(nodes) {
                this.connections = [];
                
                for (let node of nodes) {
                    if (node === this) continue;
                    
                    const dx = this.x - node.x;
                    const dy = this.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.connectionDistance) {
                        this.connections.push({
                            node: node,
                            distance: distance
                        });
                    }
                }
            }
            
            drawConnections() {
                for (let connection of this.connections) {
                    const opacity = 1 - (connection.distance / this.connectionDistance);
                    
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(connection.node.x, connection.node.y);
                    ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity * 0.7})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        
        // Create nodes
        const nodeCount = 30;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw nodes
            for (let node of nodes) {
                node.update();
                node.findConnections(nodes);
            }
            
            // Draw connections first (so they appear behind nodes)
            for (let node of nodes) {
                node.drawConnections();
            }
            
            // Draw nodes on top
            for (let node of nodes) {
                node.draw();
            }
            
            requestAnimationFrame(animate);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        // Start animation
        animate();
    }

    // Forgot Password Modal Logic
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotModal = document.getElementById('forgot-modal');
    const closeForgotModal = document.getElementById('close-forgot-modal');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const forgotUsernameInput = document.getElementById('forgot-username');
    const otpMessage = document.getElementById('otp-message');

    if (forgotPasswordLink && forgotModal && closeForgotModal) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.style.display = 'flex';
            forgotUsernameInput.value = '';
            otpMessage.textContent = '';
        });
        closeForgotModal.addEventListener('click', () => {
            forgotModal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === forgotModal) {
                forgotModal.style.display = 'none';
            }
        });
    }

    if (sendOtpBtn && forgotUsernameInput && otpMessage) {
        sendOtpBtn.addEventListener('click', () => {
            const username = forgotUsernameInput.value.trim().toLowerCase();
            if (!username) {
                otpMessage.textContent = 'Please enter your user name.';
                otpMessage.style.color = '#ff4444';
                return;
            }
            // Simulate sending OTP
            otpMessage.textContent = `OTP sent to ${username}!`;
            otpMessage.style.color = 'var(--primary-color)';
        });
    }
});