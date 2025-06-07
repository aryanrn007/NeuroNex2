/**
 * Enhanced Juno Profile Section
 * Improves the profile section in the "Fetch My Juno Data" window panel
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the enhanced profile functionality
    initEnhancedJunoProfile();
});

/**
 * Initialize the enhanced Juno profile functionality
 */
function initEnhancedJunoProfile() {
    // Get the original fetch button and replace its functionality
    const originalFetchButton = document.getElementById('fetch-juno-data-btn');
    // Get the fetch button in settings panel
    const settingsFetchButton = document.getElementById('fetchJunoDataBtn');
    
    if (originalFetchButton) {
        // Override the click event with our enhanced version
        originalFetchButton.addEventListener('click', fetchEnhancedJunoData, { capture: true });
    }
    
    if (settingsFetchButton) {
        // Add the same functionality to the settings panel button
        settingsFetchButton.addEventListener('click', fetchEnhancedJunoData, { capture: true });
    }
}

/**
 * Enhanced function to fetch and display Juno data
 * @param {Event} e - The click event
 */
function fetchEnhancedJunoData(e) {
    // Prevent the default fetch action
    e.preventDefault();
    e.stopPropagation();
    
    // Get modal elements
    const junoDataModal = document.getElementById('juno-data-modal');
    const junoDataContainer = document.getElementById('juno-data-container');
    
    if (!junoDataModal || !junoDataContainer) {
        console.error('Juno Data modal elements not found');
        return;
    }
    
    // Show modal and loading spinner
    junoDataModal.style.display = 'flex';
    // Force reflow to ensure animation works
    void junoDataModal.offsetWidth;
    junoDataModal.classList.add('show-modal');
    
    junoDataContainer.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-circle-notch fa-spin"></i>
            <span>Fetching your data...</span>
            <div class="loading-progress">
                <div class="loading-progress-bar"></div>
            </div>
        </div>
    `;
    
    // Animate loading progress bar
    const loadingProgressBar = document.querySelector('.loading-progress-bar');
    if (loadingProgressBar) {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += 5;
            loadingProgressBar.style.width = `${Math.min(progress, 90)}%`;
            if (progress >= 90) clearInterval(loadingInterval);
        }, 100);
        
        // Store the interval ID to clear it when data is loaded
        window.junoLoadingInterval = loadingInterval;
    }
    
    // Get student ID or session token from localStorage
    let studentId = null;
    let studentData = null;
    
    try {
        // Always get the latest data from localStorage to ensure we have the current user
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (studentDataString) {
            studentData = JSON.parse(studentDataString);
            studentId = studentData.id || studentData.studentId;
            console.log("Fetched current user data:", studentData.fullName);
        }
    } catch (error) {
        console.error('Error retrieving student ID:', error);
    }
    
    if (!studentId) {
        showEnhancedJunoDataError('Unable to identify student. Please log in again.');
        return;
    }
    
    // For demo purposes, show mock data with a slight delay to show loading animation
    setTimeout(() => {
        // Clear loading interval if exists
        if (window.junoLoadingInterval) {
            clearInterval(window.junoLoadingInterval);
            delete window.junoLoadingInterval;
        }
        
        // Complete the progress bar animation before showing data
        if (loadingProgressBar) {
            loadingProgressBar.style.width = '100%';
            setTimeout(() => {
                displayEnhancedJunoData(getMockEnhancedJunoData(studentId, studentData));
            }, 300);
        } else {
            displayEnhancedJunoData(getMockEnhancedJunoData(studentId, studentData));
        }
    }, 1000);
}

/**
 * Display enhanced Juno data in the modal
 * @param {Object} data - The student data to display
 */
function displayEnhancedJunoData(data) {
    const junoDataContainer = document.getElementById('juno-data-container');
    
    if (!junoDataContainer) {
        console.error('Juno Data container not found');
        return;
    }
    
    if (!data || Object.keys(data).length === 0) {
        showEnhancedJunoDataError('No data available at this time.');
        return;
    }
    
    // Create HTML for the enhanced data card with tabs
    const html = `
        <div class="juno-data-card">
            <!-- Enhanced Student Header -->
            <div class="juno-student-header">
                <div class="juno-header-bg" style="background-image: url('${data.coverPhoto || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'}');"></div>
                <div class="juno-header-content">
                    <div class="student-photo-container">
                        <img src="${data.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'Student')}&background=6a11cb&color=fff&size=200`}" alt="${data.name || 'Student'} Photo" class="student-photo" onerror="this.src='https://ui-avatars.com/api/?name=Student&background=6a11cb&color=fff&size=200';">
                    </div>
                    <div class="student-info">
                        <h2>${formatStudentName(data.name, data.lastName)}</h2>
                        <p><i class="fas fa-id-card"></i> Roll No.: ${data.rollNumber}</p>
                        <p><i class="fas fa-graduation-cap"></i> ${data.semester}</p>
                        <p><i class="fas fa-code-branch"></i> ${data.branch}</p>
                        
                        <div class="student-badges">
                            <div class="student-badge"><i class="fas fa-award"></i> Grade: ${data.grade || 'A'}</div>
                            <div class="student-badge"><i class="fas fa-chart-line"></i> CGPA: ${data.cgpa || '8.75'}</div>
                            <div class="student-badge"><i class="fas fa-calendar-check"></i> Attendance: ${data.attendance || '92'}%</div>
                        </div>
                    </div>
                </div>
                <button class="close-juno-data-btn" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>
            
            <!-- Enhanced Tabs Container -->
            <div class="juno-tabs-container">
                <div class="juno-sidebar">
                    <div class="juno-tab active" data-tab="dashboard">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </div>
                    <div class="juno-tab" data-tab="profile">
                        <i class="fas fa-user"></i> Profile
                    </div>
                    <div class="juno-tab" data-tab="syllabus">
                        <i class="fas fa-book"></i> Syllabus
                    </div>
                    <div class="juno-tab" data-tab="calendar">
                        <i class="fas fa-calendar-alt"></i> Calendar
                    </div>
                    <div class="juno-tab" data-tab="timetable">
                        <i class="fas fa-clock"></i> Time Table
                    </div>
                    <div class="juno-tab" data-tab="library">
                        <i class="fas fa-book-reader"></i> Library
                    </div>
                    <div class="juno-tab" data-tab="fees">
                        <i class="fas fa-rupee-sign"></i> Fees Details
                    </div>
                    <div class="juno-tab" data-tab="leave">
                        <i class="fas fa-file-alt"></i> Leave Details
                    </div>
                </div>
                
                <div class="juno-tab-content">
                    <!-- Dashboard Tab (Active by Default) -->
                    <div class="tab-pane active" id="dashboard-tab">
                        <h3><i class="fas fa-tachometer-alt"></i> Dashboard Overview</h3>
                        <div class="dashboard-stats">
                            <div class="stat-card">
                                <h4><i class="fas fa-calendar-check"></i> Attendance</h4>
                                <div class="progress-bar-container">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${data.attendance || 92}%"></div>
                                    </div>
                                    <span>${data.attendance || 92}%</span>
                                </div>
                                <p class="attendance-status">
                                    ${getAttendanceStatus(data.attendance || 92)}
                                </p>
                            </div>
                            
                            <div class="stat-card">
                                <h4><i class="fas fa-clock"></i> Upcoming Classes</h4>
                                ${renderTimetable(data.timetable || getDefaultTimetable())}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Enhanced Profile Tab -->
                    <div class="tab-pane" id="profile-tab">
                        <h3><i class="fas fa-user"></i> Student Profile</h3>
                        
                        <div class="profile-details">
                            <div class="profile-card">
                                <h4><i class="fas fa-user-graduate"></i> Academic Information</h4>
                                <div class="profile-field">
                                    <div class="profile-field-label">Roll Number</div>
                                    <div class="profile-field-value">${data.rollNumber || 'EN2426371'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Branch</div>
                                    <div class="profile-field-value">${data.branch || 'Computer Science Engineering'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Semester</div>
                                    <div class="profile-field-value">${data.semester || 'First Year Semester II'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">CGPA</div>
                                    <div class="profile-field-value">${data.cgpa || '8.75'} / 10</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Grade</div>
                                    <div class="profile-field-value">${data.grade || 'A'}</div>
                                </div>
                            </div>
                            
                            <div class="profile-card">
                                <h4><i class="fas fa-address-card"></i> Personal Information</h4>
                                <div class="profile-field">
                                    <div class="profile-field-label">Full Name</div>
                                    <div class="profile-field-value">${data.name || 'Aaryan'} ${data.lastName || 'SANTOSH GAJGESHWAR'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Email</div>
                                    <div class="profile-field-value">${data.email || 'aaryan.santosh@example.com'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Phone</div>
                                    <div class="profile-field-value">${data.phone || '+91 9876543210'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Address</div>
                                    <div class="profile-field-value">${data.address || 'Mumbai, Maharashtra'}</div>
                                </div>
                            </div>
                            
                            <div class="profile-card">
                                <h4><i class="fas fa-shield-alt"></i> Additional Information</h4>
                                <div class="profile-field">
                                    <div class="profile-field-label">Blood Group</div>
                                    <div class="profile-field-value">${data.bloodGroup || 'O+'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Aadhaar No.</div>
                                    <div class="profile-field-value">${data.aadhaarNo ? maskAadhaar(data.aadhaarNo) : 'XXXX-XXXX-XXXX'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Category</div>
                                    <div class="profile-field-value">${data.category || 'General'}</div>
                                </div>
                                <div class="profile-field">
                                    <div class="profile-field-label">Nationality</div>
                                    <div class="profile-field-value">${data.nationality || 'Indian'}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-actions">
                            <button class="profile-action-btn" id="edit-profile-btn">
                                <i class="fas fa-edit"></i> Edit Profile
                            </button>
                            <button class="profile-action-btn secondary" id="download-profile-btn">
                                <i class="fas fa-download"></i> Download Details
                            </button>
                        </div>
                    </div>
                    
                    <!-- Syllabus Tab -->
                    <div class="tab-pane" id="syllabus-tab">
                        <h3><i class="fas fa-book"></i> Course Syllabus</h3>
                        <div class="timetable-container">
                            <h4>D. Y. Patil College of Engineering & Technology</h4>
                            <h5>Department of First Year Engineering</h5>
                            <h5>Time Table-Division Wise</h5>
                            <div class="timetable-info">
                                <div><strong>A.Y.:</strong> 2024-25</div>
                                <div><strong>Semester:</strong> II</div>
                                <div><strong>Class:</strong> A Div.</div>
                                <div><strong>Classroom:</strong> 301</div>
                            </div>
                            
                            <table class="syllabus-timetable">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>09.00-11.00</th>
                                        <th>11.15-12.15</th>
                                        <th>12.15-01.15</th>
                                        <th>02.00-03.00</th>
                                        <th>03.00-04.00</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Monday</td>
                                        <td>A1-Maths-II-VVP / A2-CH-PNG / A3-PC-SMS / A4-GEN AI-PVD / A5-CW-SSB</td>
                                        <td>Maths-II-VVP</td>
                                        <td>Mentoring/Faculty Interaction</td>
                                        <td>GEN AI-RSS</td>
                                        <td>PC-SMS</td>
                                    </tr>
                                    <tr>
                                        <td>Tuesday</td>
                                        <td>A1-CW-SSB / A2-Maths-II-VVP / A3-CH-PNG / A4-PC-SMS / A5-GEN AI-PVD</td>
                                        <td>Maths-II-VVP</td>
                                        <td>CH-PNG</td>
                                        <td>GEN AI-RSS</td>
                                        <td>Activity / L.H.</td>
                                    </tr>
                                    <tr>
                                        <td>Wednesday</td>
                                        <td>A1-GEN AI-RSS / A2-CW-SSB / A3-Maths-II-VVP / A4-CH-PNG / A5-PC-SMS</td>
                                        <td>CW-SSB</td>
                                        <td>GEN AI-RSS</td>
                                        <td>Maths-II-VVP</td>
                                        <td>Training</td>
                                    </tr>
                                    <tr>
                                        <td>Thursday</td>
                                        <td>A1-PC-SMS / A2-GEN AI-PVD / A3-CW-SSB / A4-Maths-II-VVP / A5-CH-HMS</td>
                                        <td>CH-PNG</td>
                                        <td>SE-VVZ</td>
                                        <td>Training</td>
                                        <td>Activity / L.H.</td>
                                    </tr>
                                    <tr>
                                        <td>Friday</td>
                                        <td>A1-CH-HMS / A2-PC-NF / A3-GEN AI-RSS / A4-CW-SSB / A5-Maths-II-VVP</td>
                                        <td>CH-PNG</td>
                                        <td>SE-VVZ</td>
                                        <td>Training</td>
                                        <td>Activity / L.H.</td>
                                    </tr>
                                    <tr>
                                        <td>Saturday</td>
                                        <td colspan="5">Liberal Learning-Slow Learner/Advance Learners/Extra Lectures/Remedial Classes/Make-Up Classes/ Guest Lectures/Etc.</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div class="faculty-info">
                                <h4>Faculty Details:</h4>
                                <ul>
                                    <li><strong>Maths-II (VVP):</strong> Mrs. V.V.Pawale - Mathematics-II for CSE</li>
                                    <li><strong>CH-PNG:</strong> Dr. P.N.Gaikwad - Applied Chemistry for CSE</li>
                                    <li><strong>PC-SMS:</strong> Dr. S.M.Shinde - Professional Communication</li>
                                    <li><strong>GEN AI-RSS:</strong> Mr. R.S. Shrisheshthi - GEN AI</li>
                                    <li><strong>CW-SSB:</strong> Mr. S.S.Bagadi - Computer Workshop</li>
                                    <li><strong>SE-VVZ:</strong> Mr. V.V.Zambare - Software Engineering</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>Syllabus Progress</h4>
                        ${renderSyllabusProgress(data.syllabusProgress || getDefaultSyllabusProgress())}
                    </div>
                    
                    <!-- Other tabs would be implemented similarly -->
                    <div class="tab-pane" id="calendar-tab">
                        <h3><i class="fas fa-calendar-alt"></i> Academic Calendar</h3>
                        <div class="academic-calendar">
                            <div class="calendar-header">
                                <h4>D. Y. PATIL COLLEGE OF ENGINEERING & TECHNOLOGY</h4>
                                <p>Kasaba Bawada, Kolhapur</p>
                                <p>(An Autonomous Institute)</p>
                                <p>ACADEMIC CALENDAR EVEN SEMESTER: A.Y. 2024-25</p>
                                <p>(F.Y. B. Tech./F.Y.B. Arch)</p>
                            </div>
                            
                            <div class="calendar-month">
                                <h5>February 2025</h5>
                                <div class="calendar-events">
                                    <div class="calendar-event">
                                        <div class="event-date">16<sup>th</sup> - 18<sup>th</sup> February</div>
                                        <div class="event-desc">Annual Social Gathering</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">17<sup>th</sup> - 21<sup>st</sup> February</div>
                                        <div class="event-desc">Display of Course Delivery Plan and Notices etc.</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">24<sup>th</sup> February</div>
                                        <div class="event-desc">Commencement of Instructional Activities for Even Semester</div>
                                    </div>
                                </div>
                                <div class="calendar-holidays">
                                    <p><span class="holiday-tag">Holidays:</span> Chhatrapati Shivaji Maharaj Jayanti: 19<sup>th</sup> February, Maha Shivaratri: 26<sup>th</sup> February</p>
                                </div>
                                <div class="calendar-working-days">
                                    <p>Working Days: 05</p>
                                </div>
                            </div>
                            
                            <div class="calendar-month">
                                <h5>March 2025</h5>
                                <div class="calendar-events">
                                    <div class="calendar-event">
                                        <div class="event-date">7<sup>th</sup> March</div>
                                        <div class="event-desc">Test /Quiz on pre-requisites</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">12<sup>th</sup>-13<sup>th</sup> March</div>
                                        <div class="event-desc">Course feedback (Department level)</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">28<sup>th</sup> March</div>
                                        <div class="event-desc">Display of Students Defaulter List</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">27<sup>th</sup> - 28<sup>th</sup> March</div>
                                        <div class="event-desc">Course Monitoring meeting (CMC)</div>
                                    </div>
                                </div>
                                <div class="calendar-holidays">
                                    <p><span class="holiday-tag">Holidays:</span> Holi: 14<sup>th</sup> March, Gudi padwa: 30<sup>th</sup> March, Ramzan Eid: 31<sup>st</sup> March</p>
                                </div>
                                <div class="calendar-working-days">
                                    <p>Working Days: 22</p>
                                </div>
                            </div>
                            
                            <div class="calendar-month">
                                <h5>April 2025</h5>
                                <div class="calendar-events">
                                    <div class="calendar-event">
                                        <div class="event-date">1<sup>st</sup> - 5<sup>th</sup> April</div>
                                        <div class="event-desc">Conduct of In Semester Evaluation (ISE-I)</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">15<sup>th</sup>-20<sup>th</sup> April</div>
                                        <div class="event-desc">Mid Term Course Feedback (Central Level)</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">30<sup>th</sup> April - 3<sup>rd</sup> May</div>
                                        <div class="event-desc">Mid Semester Examination</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">27<sup>th</sup> April</div>
                                        <div class="event-desc">Students mentoring and CMC meeting</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">30<sup>th</sup> April</div>
                                        <div class="event-desc">Display of Students Defaulter List</div>
                                    </div>
                                </div>
                                <div class="calendar-holidays">
                                    <p><span class="holiday-tag">Holidays:</span> Ram Navami: 6<sup>th</sup> April, Mahaveer Jayanti: 10<sup>th</sup> April, Dr. Babasaheb Ambedkar Jayanti: 14<sup>th</sup> April, Good Friday: 18<sup>th</sup> April</p>
                                </div>
                                <div class="calendar-working-days">
                                    <p>Working Days: 21</p>
                                </div>
                            </div>
                            
                            <div class="calendar-month">
                                <h5>May 2025</h5>
                                <div class="calendar-events">
                                    <div class="calendar-event">
                                        <div class="event-date">8<sup>th</sup>-9<sup>th</sup> May</div>
                                        <div class="event-desc">Showing of evaluated MSE answer scripts</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">16<sup>th</sup> May</div>
                                        <div class="event-desc">Display of student's competency</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">17<sup>th</sup> May</div>
                                        <div class="event-desc">Parents Meet</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">30<sup>th</sup> May</div>
                                        <div class="event-desc">Display of Students Defaulter List</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">30<sup>th</sup>-31<sup>st</sup> May</div>
                                        <div class="event-desc">CMC meeting</div>
                                    </div>
                                </div>
                                <div class="calendar-holidays">
                                    <p><span class="holiday-tag">Holidays:</span> Maharashtra Day: 1<sup>st</sup> May, Buddha Purnima: 12<sup>th</sup> May</p>
                                </div>
                                <div class="calendar-working-days">
                                    <p>Working Days: 23</p>
                                </div>
                            </div>
                            
                            <div class="calendar-month">
                                <h5>June 2025</h5>
                                <div class="calendar-events">
                                    <div class="calendar-event">
                                        <div class="event-date">2<sup>nd</sup> - 7<sup>th</sup> June</div>
                                        <div class="event-desc">Conduct of In Semester Evaluation (ISE-II)</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">13<sup>th</sup> June</div>
                                        <div class="event-desc">Display Students final detention List</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">14<sup>th</sup> June</div>
                                        <div class="event-desc">End of Instructional Activities</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">14<sup>th</sup> June</div>
                                        <div class="event-desc">Finalization of ISE/MSE/Project marks on JUNO</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">16<sup>th</sup> June</div>
                                        <div class="event-desc">Capstone Project, LLC exhibition</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">21<sup>st</sup> - 30<sup>th</sup> June</div>
                                        <div class="event-desc">End Semester Examination</div>
                                    </div>
                                    <div class="calendar-event">
                                        <div class="event-date">8<sup>th</sup> July</div>
                                        <div class="event-desc">Result Declaration</div>
                                    </div>
                                </div>
                                <div class="calendar-holidays">
                                    <p><span class="holiday-tag">Holidays:</span> Bakri Eid: 7<sup>th</sup> June</p>
                                </div>
                                <div class="calendar-working-days">
                                    <p>Working Days: 10</p>
                                </div>
                            </div>
                            
                            <div class="calendar-footer">
                                <div class="calendar-info">
                                    <p><strong>Instructional Days:</strong> 80</p>
                                    <p><strong>OBE Revision & Dept. Meeting:</strong> 3<sup>rd</sup> Saturday of Every Month</p>
                                    <p><strong>HoD & Deans Meeting:</strong> Every Tuesday, Friday of Week</p>
                                    <p><strong>Students Mentoring & Counselling:</strong> Last Week of Every Month</p>
                                    <p><strong>Commencement of Next Semester:</strong> 8<sup>th</sup> July, 2025-26</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="timetable-tab">
                        <h3><i class="fas fa-clock"></i> Complete Timetable</h3>
                        <div class="timetable-container">
                            <h4>D. Y. Patil College of Engineering & Technology</h4>
                            <h5>Department of First Year Engineering</h5>
                            <h5>Time Table-Division Wise</h5>
                            <div class="timetable-info">
                                <div><strong>A.Y.:</strong> 2024-25</div>
                                <div><strong>Semester:</strong> II</div>
                                <div><strong>Class:</strong> A Div.</div>
                                <div><strong>Classroom:</strong> 301</div>
                            </div>
                            
                            <table class="syllabus-timetable">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>09.00-11.00</th>
                                        <th>11.15-12.15</th>
                                        <th>12.15-01.15</th>
                                        <th>02.00-03.00</th>
                                        <th>03.00-04.00</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Monday</td>
                                        <td>A1-Maths-II-VVP / A2-CH-PNG / A3-PC-SMS / A4-GEN AI-PVD / A5-CW-SSB</td>
                                        <td>Maths-II-VVP</td>
                                        <td>Mentoring/Faculty Interaction</td>
                                        <td>GEN AI-RSS</td>
                                        <td>PC-SMS</td>
                                    </tr>
                                    <tr>
                                        <td>Tuesday</td>
                                        <td>A1-CW-SSB / A2-Maths-II-VVP / A3-CH-PNG / A4-PC-SMS / A5-GEN AI-PVD</td>
                                        <td>Maths-II-VVP</td>
                                        <td>CH-PNG</td>
                                        <td>GEN AI-RSS</td>
                                        <td>Activity / L.H.</td>
                                    </tr>
                                    <tr>
                                        <td>Wednesday</td>
                                        <td>A1-GEN AI-RSS / A2-CW-SSB / A3-Maths-II-VVP / A4-CH-PNG / A5-PC-SMS</td>
                                        <td>CW-SSB</td>
                                        <td>GEN AI-RSS</td>
                                        <td>Maths-II-VVP</td>
                                        <td>Training</td>
                                    </tr>
                                    <tr>
                                        <td>Thursday</td>
                                        <td>A1-PC-SMS / A2-GEN AI-PVD / A3-CW-SSB / A4-Maths-II-VVP / A5-CH-HMS</td>
                                        <td>CH-PNG</td>
                                        <td>SE-VVZ</td>
                                        <td>Training</td>
                                        <td>Activity / L.H.</td>
                                    </tr>
                                    <tr>
                                        <td>Friday</td>
                                        <td>A1-CH-HMS / A2-PC-NF / A3-GEN AI-RSS / A4-CW-SSB / A5-Maths-II-VVP</td>
                                        <td>CH-PNG</td>
                                        <td>SE-VVZ</td>
                                        <td>Training</td>
                                        <td>Activity / L.H.</td>
                                    </tr>
                                    <tr>
                                        <td>Saturday</td>
                                        <td colspan="5">Liberal Learning-Slow Learner/Advance Learners/Extra Lectures/Remedial Classes/Make-Up Classes/ Guest Lectures/Etc.</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div class="faculty-info">
                                <h4>Faculty Details:</h4>
                                <ul>
                                    <li><strong>Maths-II (VVP):</strong> Mrs. V.V.Pawale - Mathematics-II for CSE</li>
                                    <li><strong>CH-PNG:</strong> Dr. P.N.Gaikwad - Applied Chemistry for CSE</li>
                                    <li><strong>PC-SMS:</strong> Dr. S.M.Shinde - Professional Communication</li>
                                    <li><strong>GEN AI-RSS:</strong> Mr. R.S. Shrisheshthi - GEN AI</li>
                                    <li><strong>CW-SSB:</strong> Mr. S.S.Bagadi - Computer Workshop</li>
                                    <li><strong>SE-VVZ:</strong> Mr. V.V.Zambare - Software Engineering</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="library-tab">
                        <h3><i class="fas fa-book-reader"></i> Library</h3>
                        <div class="library-container">
                            <div class="library-card">
                                <h4>Library Hours</h4>
                                <p><strong>Monday to Friday:</strong> 8:00 AM - 8:00 PM</p>
                                <p><strong>Saturday:</strong> 9:00 AM - 5:00 PM</p>
                                <p><strong>Sunday:</strong> Closed</p>
                                <p class="library-note">Note: L.H. in your timetable refers to Library Hours, when you can visit the library as part of your curriculum.</p>
                            </div>
                            
                            <div class="library-card">
                                <h4>Books Issued</h4>
                                <table class="library-books-table">
                                    <thead>
                                        <tr>
                                            <th>Book Title</th>
                                            <th>Author</th>
                                            <th>Issue Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Engineering Mathematics II</td>
                                            <td>Dr. H.J. Sawant</td>
                                            <td>15 Jun 2024</td>
                                            <td>15 Jul 2024</td>
                                            <td><span class="status-active">Active</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="library-card">
                                <h4>E-Resources Available</h4>
                                <ul class="e-resources-list">
                                    <li><i class="fas fa-laptop-code"></i> <strong>IEEE Xplore Digital Library</strong> - Access to IEEE journals, publications and conference proceedings</li>
                                    <li><i class="fas fa-book"></i> <strong>DELNET</strong> - Developing Library Network for resource sharing</li>
                                    <li><i class="fas fa-graduation-cap"></i> <strong>NPTEL</strong> - National Programme on Technology Enhanced Learning</li>
                                    <li><i class="fas fa-globe"></i> <strong>National Digital Library</strong> - Virtual repository of learning resources</li>
                                    <li><i class="fas fa-newspaper"></i> <strong>J-Gate</strong> - Electronic gateway to global journal literature</li>
                                </ul>
                            </div>
                            
                            <div class="library-card library-rules">
                                <h4>Library Rules</h4>
                                <ol>
                                    <li>Students must carry their ID card while visiting the library.</li>
                                    <li>Silence must be maintained in the library at all times.</li>
                                    <li>Each student can issue a maximum of 3 books at a time.</li>
                                    <li>Books must be returned within 30 days from the date of issue.</li>
                                    <li>Fine for late return is Rs. 5 per day per book.</li>
                                    <li>Damage to books will result in penalty equal to the cost of the book.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="fees-tab">
                        <h3><i class="fas fa-rupee-sign"></i> Fees Details</h3>
                        
                        <div class="fees-container">
                            <!-- Fees Summary Card -->
                            <div class="fees-card fees-summary">
                                <div class="fees-header">
                                    <h4>Fees Summary</h4>
                                    <span class="fees-academic-year">Academic Year 2024-25</span>
                                </div>
                                
                                <div class="fees-overview">
                                    <div class="fees-progress-container">
                                        <div class="fees-progress-circle" data-progress="${Math.round((data.fees?.paid?.replace(/[^\d]/g, '') || 90000) / (data.fees?.total?.replace(/[^\d]/g, '') || 120000) * 100)}">
                                            <svg class="fees-progress-ring" width="120" height="120">
                                                <circle class="fees-progress-ring-bg" stroke="#e6e6e6" stroke-width="8" fill="transparent" r="50" cx="60" cy="60"/>
                                                <circle class="fees-progress-ring-circle" stroke="#6a11cb" stroke-width="8" fill="transparent" r="50" cx="60" cy="60" 
                                                    stroke-dasharray="314.16" 
                                                    stroke-dashoffset="${314.16 * (1 - (data.fees?.paid?.replace(/[^\d]/g, '') || 90000) / (data.fees?.total?.replace(/[^\d]/g, '') || 120000))}"/>
                                            </svg>
                                            <div class="fees-progress-text">
                                                <div class="fees-percent">${Math.round((data.fees?.paid?.replace(/[^\d]/g, '') || 90000) / (data.fees?.total?.replace(/[^\d]/g, '') || 120000) * 100)}%</div>
                                                <div class="fees-label">Paid</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="fees-totals">
                                        <div class="fees-total-item">
                                            <div class="fees-total-label">Total Fees</div>
                                            <div class="fees-total-value">₹${data.fees?.total || '120,000'}</div>
                                        </div>
                                        <div class="fees-total-item paid">
                                            <div class="fees-total-label">Amount Paid</div>
                                            <div class="fees-total-value">₹${data.fees?.paid || '90,000'}</div>
                                        </div>
                                        <div class="fees-total-item due">
                                            <div class="fees-total-label">Amount Due</div>
                                            <div class="fees-total-value">₹${data.fees?.due || '30,000'}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="fees-due-info">
                                    <div class="fees-due-date ${new Date(data.fees?.dueDate || '2025-06-30') < new Date() ? 'overdue' : ''}">
                                        <i class="fas fa-calendar-alt"></i>
                                        <span>Due Date: <strong>${data.fees?.dueDate || '30 June 2025'}</strong></span>
                                        ${new Date(data.fees?.dueDate || '2025-06-30') < new Date() ? '<span class="overdue-tag">OVERDUE</span>' : ''}
                                    </div>
                                    <div class="fees-payment-actions">
                                        <button class="fees-pay-now-btn">
                                            <i class="fas fa-credit-card"></i> Pay Now
                                        </button>
                                        <button class="fees-download-btn">
                                            <i class="fas fa-download"></i> Download Receipt
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Fees Breakdown Card -->
                            <div class="fees-card fees-breakdown">
                                <div class="fees-header">
                                    <h4>Fees Breakdown</h4>
                                </div>
                                <div class="fees-breakdown-content">
                                    <div class="fees-breakdown-item">
                                        <div class="fees-breakdown-label">Tuition Fees</div>
                                        <div class="fees-breakdown-value">₹98,000</div>
                                    </div>
                                    <div class="fees-breakdown-item">
                                        <div class="fees-breakdown-label">Development Fees</div>
                                        <div class="fees-breakdown-value">₹10,000</div>
                                    </div>
                                    <div class="fees-breakdown-item">
                                        <div class="fees-breakdown-label">Library Fees</div>
                                        <div class="fees-breakdown-value">₹5,000</div>
                                    </div>
                                    <div class="fees-breakdown-item">
                                        <div class="fees-breakdown-label">Laboratory Fees</div>
                                        <div class="fees-breakdown-value">₹5,000</div>
                                    </div>
                                    <div class="fees-breakdown-item">
                                        <div class="fees-breakdown-label">Examination Fees</div>
                                        <div class="fees-breakdown-value">₹2,000</div>
                                    </div>
                                    <div class="fees-breakdown-item total">
                                        <div class="fees-breakdown-label">Total Fees</div>
                                        <div class="fees-breakdown-value">₹${data.fees?.total || '120,000'}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Payment History Card -->
                            <div class="fees-card fees-history">
                                <div class="fees-header">
                                    <h4>Payment History</h4>
                                </div>
                                <div class="fees-history-content">
                                    <table class="fees-history-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Receipt No.</th>
                                                <th>Amount</th>
                                                <th>Mode</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>15 Feb 2025</td>
                                                <td>DYP/2025/4582</td>
                                                <td>₹50,000</td>
                                                <td>Bank Transfer</td>
                                                <td><span class="status-success">Successful</span></td>
                                            </tr>
                                            <tr>
                                                <td>10 Jan 2025</td>
                                                <td>DYP/2025/3241</td>
                                                <td>₹40,000</td>
                                                <td>Credit Card</td>
                                                <td><span class="status-success">Successful</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Payment Options Card -->
                            <div class="fees-card fees-options">
                                <div class="fees-header">
                                    <h4>Payment Options</h4>
                                </div>
                                <div class="fees-options-content">
                                    <div class="payment-option">
                                        <div class="payment-option-icon"><i class="fas fa-university"></i></div>
                                        <div class="payment-option-details">
                                            <h5>Bank Transfer</h5>
                                            <p>Account Name: D.Y. Patil College</p>
                                            <p>Account No: XXXX-XXXX-1234</p>
                                            <p>IFSC Code: DYPC0001234</p>
                                        </div>
                                    </div>
                                    
                                    <div class="payment-option">
                                        <div class="payment-option-icon"><i class="fas fa-credit-card"></i></div>
                                        <div class="payment-option-details">
                                            <h5>Online Payment</h5>
                                            <p>Pay securely using Credit/Debit Card or UPI</p>
                                            <p>Zero transaction charges</p>
                                        </div>
                                    </div>
                                    
                                    <div class="payment-option">
                                        <div class="payment-option-icon"><i class="fas fa-money-check-alt"></i></div>
                                        <div class="payment-option-details">
                                            <h5>DD/Cheque</h5>
                                            <p>In favor of: D.Y. Patil College of Engineering</p>
                                            <p>Payable at: Kolhapur</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="fees-note">
                                    <p><i class="fas fa-info-circle"></i> For any fees related queries, contact Accounts Department at <strong>accounts@dypce.edu</strong> or call <strong>0231-2601433</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane" id="leave-tab">
                        <h3><i class="fas fa-file-alt"></i> Leave Applications</h3>
                        
                        <div class="leave-container">
                            <!-- Leave Summary Card -->
                            <div class="leave-card leave-summary">
                                <div class="leave-header">
                                    <h4>Leave Balance</h4>
                                    <div class="academic-year">Academic Year 2024-25</div>
                                </div>
                                
                                <div class="leave-balance-grid">
                                    <div class="leave-balance-item">
                                        <div class="leave-type">
                                            <i class="fas fa-user-md"></i>
                                            <span>Medical</span>
                                        </div>
                                        <div class="leave-count">
                                            <span class="used">2</span>
                                            <span class="separator">/</span>
                                            <span class="total">10</span>
                                        </div>
                                        <div class="leave-progress">
                                            <div class="leave-progress-bar" style="width: 20%"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="leave-balance-item">
                                        <div class="leave-type">
                                            <i class="fas fa-home"></i>
                                            <span>Personal</span>
                                        </div>
                                        <div class="leave-count">
                                            <span class="used">3</span>
                                            <span class="separator">/</span>
                                            <span class="total">10</span>
                                        </div>
                                        <div class="leave-progress">
                                            <div class="leave-progress-bar" style="width: 30%"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="leave-balance-item">
                                        <div class="leave-type">
                                            <i class="fas fa-plane-departure"></i>
                                            <span>Vacation</span>
                                        </div>
                                        <div class="leave-count">
                                            <span class="used">0</span>
                                            <span class="separator">/</span>
                                            <span class="total">5</span>
                                        </div>
                                        <div class="leave-progress">
                                            <div class="leave-progress-bar" style="width: 0%"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="leave-balance-item">
                                        <div class="leave-type">
                                            <i class="fas fa-project-diagram"></i>
                                            <span>Academic</span>
                                        </div>
                                        <div class="leave-count">
                                            <span class="used">1</span>
                                            <span class="separator">/</span>
                                            <span class="total">5</span>
                                        </div>
                                        <div class="leave-progress">
                                            <div class="leave-progress-bar" style="width: 20%"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="apply-leave-btn-container">
                                    <button class="apply-leave-btn">
                                        <i class="fas fa-plus-circle"></i> Apply for Leave
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Leave History Card -->
                            <div class="leave-card leave-history">
                                <div class="leave-header">
                                    <h4>Leave History</h4>
                                    <div class="leave-filter">
                                        <select id="leave-filter-select">
                                            <option value="all">All</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="leave-table-container">
                                    <table class="leave-table">
                                        <thead>
                                            <tr>
                                                <th>Leave Type</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Days</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="leave-row">
                                                <td>
                                                    <div class="leave-type-cell">
                                                        <i class="fas fa-user-md"></i>
                                                        <span>Medical</span>
                                                    </div>
                                                </td>
                                                <td>15 Mar 2025</td>
                                                <td>16 Mar 2025</td>
                                                <td>2</td>
                                                <td class="reason-cell">Fever and cold</td>
                                                <td>
                                                    <span class="leave-status approved">
                                                        <i class="fas fa-check-circle"></i> Approved
                                                    </span>
                                                </td>
                                                <td>
                                                    <button class="view-leave-btn" data-leave-id="1">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr class="leave-row">
                                                <td>
                                                    <div class="leave-type-cell">
                                                        <i class="fas fa-home"></i>
                                                        <span>Personal</span>
                                                    </div>
                                                </td>
                                                <td>10 Apr 2025</td>
                                                <td>12 Apr 2025</td>
                                                <td>3</td>
                                                <td class="reason-cell">Family function</td>
                                                <td>
                                                    <span class="leave-status approved">
                                                        <i class="fas fa-check-circle"></i> Approved
                                                    </span>
                                                </td>
                                                <td>
                                                    <button class="view-leave-btn" data-leave-id="2">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr class="leave-row">
                                                <td>
                                                    <div class="leave-type-cell">
                                                        <i class="fas fa-project-diagram"></i>
                                                        <span>Academic</span>
                                                    </div>
                                                </td>
                                                <td>05 May 2025</td>
                                                <td>05 May 2025</td>
                                                <td>1</td>
                                                <td class="reason-cell">IEEE Conference</td>
                                                <td>
                                                    <span class="leave-status pending">
                                                        <i class="fas fa-clock"></i> Pending
                                                    </span>
                                                </td>
                                                <td>
                                                    <button class="view-leave-btn" data-leave-id="3">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="cancel-leave-btn" data-leave-id="3">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    <div class="leave-table-empty hidden">
                                        <div class="empty-state">
                                            <i class="fas fa-calendar-times"></i>
                                            <p>No leave applications found</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Leave Calendar Card -->
                            <div class="leave-card leave-calendar">
                                <div class="leave-header">
                                    <h4>Leave Calendar</h4>
                                    <div class="calendar-navigation">
                                        <button class="calendar-nav-btn prev-month">
                                            <i class="fas fa-chevron-left"></i>
                                        </button>
                                        <span class="current-month">May 2025</span>
                                        <button class="calendar-nav-btn next-month">
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="leave-calendar-container">
                                    <div class="calendar-weekdays">
                                        <div>Sun</div>
                                        <div>Mon</div>
                                        <div>Tue</div>
                                        <div>Wed</div>
                                        <div>Thu</div>
                                        <div>Fri</div>
                                        <div>Sat</div>
                                    </div>
                                    <div class="calendar-days">
                                        <div class="calendar-day other-month">27</div>
                                        <div class="calendar-day other-month">28</div>
                                        <div class="calendar-day other-month">29</div>
                                        <div class="calendar-day other-month">30</div>
                                        <div class="calendar-day">1</div>
                                        <div class="calendar-day">2</div>
                                        <div class="calendar-day">3</div>
                                        <div class="calendar-day">4</div>
                                        <div class="calendar-day leave-day academic">5</div>
                                        <div class="calendar-day">6</div>
                                        <div class="calendar-day">7</div>
                                        <div class="calendar-day">8</div>
                                        <div class="calendar-day">9</div>
                                        <div class="calendar-day">10</div>
                                        <div class="calendar-day">11</div>
                                        <div class="calendar-day">12</div>
                                        <div class="calendar-day">13</div>
                                        <div class="calendar-day">14</div>
                                        <div class="calendar-day">15</div>
                                        <div class="calendar-day holiday">16</div>
                                        <div class="calendar-day">17</div>
                                        <div class="calendar-day">18</div>
                                        <div class="calendar-day">19</div>
                                        <div class="calendar-day">20</div>
                                        <div class="calendar-day">21</div>
                                        <div class="calendar-day">22</div>
                                        <div class="calendar-day">23</div>
                                        <div class="calendar-day">24</div>
                                        <div class="calendar-day">25</div>
                                        <div class="calendar-day">26</div>
                                        <div class="calendar-day">27</div>
                                        <div class="calendar-day">28</div>
                                        <div class="calendar-day">29</div>
                                        <div class="calendar-day">30</div>
                                        <div class="calendar-day">31</div>
                                        <div class="calendar-day other-month">1</div>
                                        <div class="calendar-day other-month">2</div>
                                        <div class="calendar-day other-month">3</div>
                                        <div class="calendar-day other-month">4</div>
                                        <div class="calendar-day other-month">5</div>
                                        <div class="calendar-day other-month">6</div>
                                        <div class="calendar-day other-month">7</div>
                                    </div>
                                </div>
                                
                                <div class="calendar-legend">
                                    <div class="legend-item">
                                        <span class="legend-color medical"></span>
                                        <span class="legend-text">Medical Leave</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-color personal"></span>
                                        <span class="legend-text">Personal Leave</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-color academic"></span>
                                        <span class="legend-text">Academic Leave</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-color vacation"></span>
                                        <span class="legend-text">Vacation</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-color holiday"></span>
                                        <span class="legend-text">Holiday</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Leave Application Form Modal -->
                        <div class="leave-application-modal">
                            <div class="leave-application-content">
                                <div class="leave-form-header">
                                    <h3>Apply for Leave</h3>
                                    <button class="close-leave-form">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <form class="leave-application-form">
                                    <div class="form-group">
                                        <label for="leave-type">Leave Type</label>
                                        <select id="leave-type" required>
                                            <option value="">Select Leave Type</option>
                                            <option value="medical">Medical Leave</option>
                                            <option value="personal">Personal Leave</option>
                                            <option value="vacation">Vacation Leave</option>
                                            <option value="academic">Academic Leave</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="leave-from">From Date</label>
                                            <input type="date" id="leave-from" required>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="leave-to">To Date</label>
                                            <input type="date" id="leave-to" required>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="leave-reason">Reason for Leave</label>
                                        <textarea id="leave-reason" rows="3" required placeholder="Please provide detailed reason for your leave request"></textarea>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="leave-document">Supporting Document (if any)</label>
                                        <div class="file-upload">
                                            <input type="file" id="leave-document">
                                            <div class="file-upload-label">
                                                <i class="fas fa-cloud-upload-alt"></i>
                                                <span>Choose file or drag & drop</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group contact-during-leave">
                                        <label for="leave-contact">Contact During Leave</label>
                                        <input type="tel" id="leave-contact" placeholder="Mobile Number">
                                    </div>
                                    
                                    <div class="form-actions">
                                        <button type="button" class="cancel-form-btn">Cancel</button>
                                        <button type="submit" class="submit-leave-btn">Submit Application</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        <!-- Leave Details Modal -->
                        <div class="leave-details-modal">
                            <div class="leave-details-content">
                                <div class="leave-details-header">
                                    <h3>Leave Details</h3>
                                    <button class="close-leave-details">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <div class="leave-details-body">
                                    <div class="leave-status-banner approved">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Approved</span>
                                    </div>
                                    
                                    <div class="leave-details-grid">
                                        <div class="detail-item">
                                            <div class="detail-label">Leave Type</div>
                                            <div class="detail-value leave-detail-type"><i class="fas fa-user-md"></i> Medical Leave</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <div class="detail-label">From Date</div>
                                            <div class="detail-value leave-detail-from">15 Mar 2025</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <div class="detail-label">To Date</div>
                                            <div class="detail-value leave-detail-to">16 Mar 2025</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <div class="detail-label">Duration</div>
                                            <div class="detail-value leave-detail-duration">2 days</div>
                                        </div>
                                        
                                        <div class="detail-item full-width">
                                            <div class="detail-label">Reason</div>
                                            <div class="detail-value leave-detail-reason">Fever and cold</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <div class="detail-label">Applied On</div>
                                            <div class="detail-value leave-detail-applied">12 Mar 2025</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <div class="detail-label">Approved By</div>
                                            <div class="detail-value leave-detail-approver">Prof. S. M. Shinde</div>
                                        </div>
                                        
                                        <div class="detail-item">
                                            <div class="detail-label">Approved On</div>
                                            <div class="detail-value leave-detail-approval-date">13 Mar 2025</div>
                                        </div>
                                        
                                        <div class="detail-item full-width">
                                            <div class="detail-label">Comments</div>
                                            <div class="detail-value leave-detail-comments">Medical leave approved. Please submit medical certificate upon return.</div>
                                        </div>
                                    </div>
                                    
                                    <div class="leave-details-documents">
                                        <h4>Supporting Documents</h4>
                                        <div class="document-preview">
                                            <div class="document-item">
                                                <i class="fas fa-file-medical"></i>
                                                <span>Medical_Certificate.pdf</span>
                                                <a href="#" class="document-action"><i class="fas fa-download"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="juno-data-footer">
                <p>Last Updated: ${new Date().toLocaleString()}</p>
                <p>Juno College Companion v1.2</p>
            </div>
        </div>
    `;
    
    junoDataContainer.innerHTML = html;
    
    // Add event listener to close button
    const closeBtn = junoDataContainer.querySelector('.close-juno-data-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEnhancedJunoModal);
    }
    
    // Add some animation
    const dataCard = junoDataContainer.querySelector('.juno-data-card');
    if (dataCard) {
        setTimeout(() => {
            dataCard.classList.add('animate-in');
        }, 50);
    }
    
    // Add tab functionality
    const tabs = junoDataContainer.querySelectorAll('.juno-tab');
    const tabPanes = junoDataContainer.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding tab content
            const tabName = tab.getAttribute('data-tab');
            const tabContent = junoDataContainer.querySelector(`#${tabName}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
                
                // Enhance timetable if this is the timetable or syllabus tab
                if (tabName === 'timetable' || tabName === 'syllabus') {
                    setTimeout(enhanceTimetables, 100);
                }
                
                // Initialize fees section if this is the fees tab
                if (tabName === 'fees') {
                    initFeesButtons();
                }
                
                // Initialize leave application section if this is the leave tab
                if (tabName === 'leave') {
                    initLeaveApplications();
                }
            }
        });
    });
    
    // Initialize timetable enhancements for the active tab
    setTimeout(enhanceTimetables, 100);
    
    // Initialize any fees buttons if present
    initFeesButtons();
    
    // Initialize leave application functionality if on the leave tab
    const activeTab = junoDataContainer.querySelector('.juno-tab.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'leave') {
        initLeaveApplications();
    }
    
    // Add event listener to edit profile button
    const editProfileBtn = junoDataContainer.querySelector('#edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // Close the Juno data modal
            closeEnhancedJunoModal();
            
            // Open the edit profile modal if it exists
            const editProfileModal = document.getElementById('editProfileModal');
            if (editProfileModal) {
                editProfileModal.style.display = 'flex';
                setTimeout(() => {
                    editProfileModal.classList.add('show-modal');
                }, 10);
            }
        });
    }
    
    // Add event listener to download profile button
    const downloadProfileBtn = junoDataContainer.querySelector('#download-profile-btn');
    if (downloadProfileBtn) {
        downloadProfileBtn.addEventListener('click', () => {
            alert('Profile details will be downloaded as PDF.');
            // In a real implementation, this would generate and download a PDF
        });
    }
}

/**
 * Initialize fees buttons and interactions in the fees tab
 */
function initFeesButtons() {
    // Get the pay now button and add event listener
    const payNowBtn = document.querySelector('.fees-pay-now-btn');
    if (payNowBtn) {
        payNowBtn.addEventListener('click', showPaymentModal);
    }
    
    // Get the download receipt button and add event listener
    const downloadReceiptBtn = document.querySelector('.fees-download-btn');
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', downloadFeeReceipt);
    }
}

/**
 * Show payment modal when Pay Now button is clicked
 */
function showPaymentModal() {
    // Create payment modal if it doesn't exist
    let paymentModal = document.getElementById('payment-modal');
    
    if (!paymentModal) {
        paymentModal = document.createElement('div');
        paymentModal.id = 'payment-modal';
        paymentModal.className = 'payment-modal';
        
        const modalContent = `
            <div class="payment-modal-content">
                <div class="payment-modal-header">
                    <h3>Make a Payment</h3>
                    <button class="payment-modal-close">&times;</button>
                </div>
                <div class="payment-modal-body">
                    <div class="payment-amount">
                        <label for="payment-amount-input">Amount to Pay (₹)</label>
                        <input type="number" id="payment-amount-input" value="30000" min="1000" step="1000">
                    </div>
                    
                    <div class="payment-methods">
                        <h4>Select Payment Method</h4>
                        <div class="payment-method-options">
                            <div class="payment-method-option active">
                                <input type="radio" name="payment-method" id="upi" checked>
                                <label for="upi">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>UPI</span>
                                </label>
                            </div>
                            <div class="payment-method-option">
                                <input type="radio" name="payment-method" id="card">
                                <label for="card">
                                    <i class="fas fa-credit-card"></i>
                                    <span>Card</span>
                                </label>
                            </div>
                            <div class="payment-method-option">
                                <input type="radio" name="payment-method" id="netbanking">
                                <label for="netbanking">
                                    <i class="fas fa-university"></i>
                                    <span>Net Banking</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-action">
                        <button class="payment-proceed-btn">Proceed to Pay</button>
                    </div>
                </div>
            </div>
        `;
        
        paymentModal.innerHTML = modalContent;
        document.body.appendChild(paymentModal);
        
        // Add event listeners to new modal
        const closeBtn = paymentModal.querySelector('.payment-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                paymentModal.classList.remove('show-modal');
                setTimeout(() => {
                    paymentModal.style.display = 'none';
                }, 300);
            });
        }
        
        const paymentMethodOptions = paymentModal.querySelectorAll('.payment-method-option');
        paymentMethodOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                paymentMethodOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Check the radio button
                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                }
            });
        });
        
        const proceedBtn = paymentModal.querySelector('.payment-proceed-btn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                const amountInput = paymentModal.querySelector('#payment-amount-input');
                const amount = amountInput ? amountInput.value : '30000';
                const selectedMethod = paymentModal.querySelector('input[name="payment-method"]:checked');
                const method = selectedMethod ? selectedMethod.id : 'upi';
                
                // Show loading state
                proceedBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
                proceedBtn.disabled = true;
                
                // Simulate payment processing
                setTimeout(() => {
                    // Hide payment modal
                    paymentModal.classList.remove('show-modal');
                    setTimeout(() => {
                        paymentModal.style.display = 'none';
                        
                        // Reset button state
                        proceedBtn.innerHTML = 'Proceed to Pay';
                        proceedBtn.disabled = false;
                        
                        // Show success message
                        showPaymentSuccess(amount, method);
                    }, 300);
                }, 2000);
            });
        }
    }
    
    // Show the modal
    paymentModal.style.display = 'flex';
    setTimeout(() => {
        paymentModal.classList.add('show-modal');
    }, 10);
}

/**
 * Show payment success notification
 * @param {string} amount - Payment amount
 * @param {string} method - Payment method
 */
function showPaymentSuccess(amount, method) {
    // Create success notification if it doesn't exist
    let successNotification = document.getElementById('payment-success');
    
    if (!successNotification) {
        successNotification = document.createElement('div');
        successNotification.id = 'payment-success';
        successNotification.className = 'payment-success';
        
        document.body.appendChild(successNotification);
    }
    
    // Format the payment method name
    const methodNames = {
        upi: 'UPI',
        card: 'Credit/Debit Card',
        netbanking: 'Net Banking'
    };
    
    // Update notification content
    successNotification.innerHTML = `
        <div class="payment-success-content">
            <div class="payment-success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="payment-success-message">
                <h4>Payment Successful!</h4>
                <p>Your payment of ₹${amount} via ${methodNames[method] || method} has been processed successfully.</p>
                <p>Transaction ID: DYP${Date.now().toString().substring(5)}</p>
            </div>
            <button class="payment-success-close">&times;</button>
        </div>
    `;
    
    // Add close button event listener
    const closeBtn = successNotification.querySelector('.payment-success-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            successNotification.classList.remove('show');
            setTimeout(() => {
                successNotification.style.display = 'none';
            }, 300);
        });
    }
    
    // Show the notification
    successNotification.style.display = 'block';
    setTimeout(() => {
        successNotification.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            successNotification.classList.remove('show');
            setTimeout(() => {
                successNotification.style.display = 'none';
            }, 300);
        }, 5000);
    }, 10);
    
    // Update the fees details in the UI
    updateFeesDetails(amount);
}

/**
 * Update fees details in the UI after successful payment
 * @param {string} paidAmount - The amount that was paid
 */
function updateFeesDetails(paidAmount) {
    const amountNum = parseFloat(paidAmount);
    if (isNaN(amountNum)) return;
    
    // Get the fees details elements
    const totalElement = document.querySelector('.fees-total-item .fees-total-value');
    const paidElement = document.querySelector('.fees-total-item.paid .fees-total-value');
    const dueElement = document.querySelector('.fees-total-item.due .fees-total-value');
    
    if (!totalElement || !paidElement || !dueElement) return;
    
    // Get current values
    const totalStr = totalElement.textContent;
    const paidStr = paidElement.textContent;
    const dueStr = dueElement.textContent;
    
    // Extract numbers
    const totalNum = parseFloat(totalStr.replace(/[^\d]/g, ''));
    const paidNum = parseFloat(paidStr.replace(/[^\d]/g, ''));
    let dueNum = parseFloat(dueStr.replace(/[^\d]/g, ''));
    
    if (isNaN(totalNum) || isNaN(paidNum) || isNaN(dueNum)) return;
    
    // Calculate new values
    const newPaidNum = paidNum + amountNum;
    const newDueNum = Math.max(0, totalNum - newPaidNum);
    
    // Update the UI
    paidElement.textContent = `₹${newPaidNum.toLocaleString()}`;
    dueElement.textContent = `₹${newDueNum.toLocaleString()}`;
    
    // Update progress circle
    const progressCircle = document.querySelector('.fees-progress-circle');
    if (progressCircle) {
        const newProgress = Math.round((newPaidNum / totalNum) * 100);
        progressCircle.setAttribute('data-progress', newProgress);
        
        // Update SVG circle
        const progressRingCircle = document.querySelector('.fees-progress-ring-circle');
        if (progressRingCircle) {
            const radius = 50;
            const circumference = 2 * Math.PI * radius;
            progressRingCircle.style.strokeDashoffset = circumference * (1 - newProgress / 100);
        }
        
        // Update text
        const percentElement = document.querySelector('.fees-percent');
        if (percentElement) {
            percentElement.textContent = `${newProgress}%`;
        }
    }
    
    // Update payment history
    addPaymentToHistory(amountNum);
}

/**
 * Add new payment to payment history table
 * @param {number} amount - The payment amount
 */
function addPaymentToHistory(amount) {
    const historyTable = document.querySelector('.fees-history-table tbody');
    if (!historyTable) return;
    
    // Create new row
    const newRow = document.createElement('tr');
    
    // Get current date
    const today = new Date();
    const dateString = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
    
    // Generate receipt number
    const receiptNumber = `DYP/${today.getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Add new payment to top of table
    newRow.innerHTML = `
        <td>${dateString}</td>
        <td>${receiptNumber}</td>
        <td>₹${amount.toLocaleString()}</td>
        <td>Online Payment</td>
        <td><span class="status-success">Successful</span></td>
    `;
    
    // Insert at the top of the table
    historyTable.insertBefore(newRow, historyTable.firstChild);
}

/**
 * Download fee receipt as PDF
 */
function downloadFeeReceipt() {
    // In a real implementation, this would generate and download a PDF
    alert('Fee receipt will be downloaded as PDF.');
    
    // Simulate download with a success message
    setTimeout(() => {
        showNotification('Fee receipt downloaded successfully', 'success');
    }, 1000);
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-content ${type}">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Show notification
    notification.style.display = 'block';
    setTimeout(() => {
        notification.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }, 10);
}

/**
 * Close the enhanced Juno data modal
 */
function closeEnhancedJunoModal() {
    const junoDataModal = document.getElementById('juno-data-modal');
    
    if (junoDataModal) {
        junoDataModal.classList.remove('show-modal');
        setTimeout(() => {
            junoDataModal.style.display = 'none';
        }, 400); // Match transition duration
    }
}

/**
 * Show error message in the Juno data modal
 * @param {string} message - The error message to display
 */
function showEnhancedJunoDataError(message) {
    const junoDataContainer = document.getElementById('juno-data-container');
    
    if (junoDataContainer) {
        junoDataContainer.innerHTML = `
            <div class="juno-data-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="juno-button" id="close-error-btn">Close</button>
            </div>
        `;
        
        const closeErrorBtn = junoDataContainer.querySelector('#close-error-btn');
        if (closeErrorBtn) {
            closeErrorBtn.addEventListener('click', closeEnhancedJunoModal);
        }
    }
}

/**
 * Get attendance status message based on attendance percentage
 * @param {number} attendance - The attendance percentage
 * @returns {string} - The formatted status message with appropriate icon and CSS class
 */
function getAttendanceStatus(attendance) {
    if (attendance < 75) {
        return `<div class="attendance-status critical"><i class="fas fa-exclamation-circle"></i> Critical: Attendance below 75%</div>`;
    } else if (attendance < 85) {
        return `<div class="attendance-status warning"><i class="fas fa-exclamation-triangle"></i> Warning: Attendance below 85%</div>`;
    } else if (attendance < 95) {
        return `<div class="attendance-status good"><i class="fas fa-check-circle"></i> Good: Attendance above 85%</div>`;
    } else {
        return `<div class="attendance-status excellent"><i class="fas fa-award"></i> Excellent: Attendance above 95%</div>`;
    }
}

/**
 * Render timetable HTML
 * @param {Array} timetable - The timetable data
 * @returns {string} - The formatted HTML
 */
function renderTimetable(timetable) {
    if (!timetable || timetable.length === 0) {
        return '<p>No upcoming classes</p>';
    }
    
    let html = '<div class="timetable-list">';
    
    timetable.forEach(item => {
        html += `
            <div class="timetable-item">
                <div class="timetable-time">${item.time}</div>
                <div class="timetable-subject">${item.subject}</div>
                <div class="timetable-room">${item.room}</div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

/**
 * Render syllabus progress HTML
 * @param {Array} syllabusProgress - The syllabus progress data
 * @returns {string} - The formatted HTML
 */
function renderSyllabusProgress(syllabusProgress) {
    if (!syllabusProgress || syllabusProgress.length === 0) {
        return '<p>No syllabus data available</p>';
    }
    
    let html = '<div class="syllabus-progress-container">';
    
    // Calculate average progress
    const totalProgress = syllabusProgress.reduce((sum, item) => sum + item.progress, 0);
    const averageProgress = Math.round(totalProgress / syllabusProgress.length);
    
    // Add summary card
    html += `
        <div class="syllabus-summary">
            <div class="average-progress">
                <div class="progress-circle" data-progress="${averageProgress}">
                    <div class="progress-circle-mask full">
                        <div class="progress-circle-fill"></div>
                    </div>
                    <div class="progress-circle-mask">
                        <div class="progress-circle-fill"></div>
                    </div>
                    <div class="progress-circle-overlay">${averageProgress}%</div>
                </div>
                <div class="average-label">Overall Progress</div>
            </div>
            <div class="progress-stats">
                <div class="stat-item completed">
                    <div class="stat-value">${syllabusProgress.length}</div>
                    <div class="stat-label">Subjects</div>
                </div>
                <div class="stat-item in-progress">
                    <div class="stat-value">${syllabusProgress.filter(item => item.progress < 100 && item.progress >= 50).length}</div>
                    <div class="stat-label">In Progress</div>
                </div>
                <div class="stat-item attention">
                    <div class="stat-value">${syllabusProgress.filter(item => item.progress < 50).length}</div>
                    <div class="stat-label">Need Attention</div>
                </div>
            </div>
        </div>
        <div class="syllabus-progress">
    `;
    
    // Sort subjects by progress (descending)
    const sortedProgress = [...syllabusProgress].sort((a, b) => b.progress - a.progress);
    
    sortedProgress.forEach(item => {
        // Get appropriate status and color
        let statusClass, statusIcon, statusText;
        if (item.progress < 40) {
            statusClass = 'status-danger';
            statusIcon = 'exclamation-circle';
            statusText = 'Needs Attention';
        } else if (item.progress < 70) {
            statusClass = 'status-warning';
            statusIcon = 'exclamation-triangle';
            statusText = 'In Progress';
        } else if (item.progress < 100) {
            statusClass = 'status-good';
            statusIcon = 'check-circle';
            statusText = 'Good Progress';
        } else {
            statusClass = 'status-complete';
            statusIcon = 'award';
            statusText = 'Complete';
        }
        
        html += `
            <div class="syllabus-item">
                <div class="syllabus-header">
                    <div class="syllabus-subject">${item.subject}</div>
                    <div class="syllabus-percentage ${statusClass}">${item.progress}%</div>
                </div>
                <div class="syllabus-progress-outer">
                    <div class="syllabus-progress-bar">
                        <div class="syllabus-progress-fill ${statusClass}" style="width: ${item.progress}%">
                            <span class="progress-glow"></span>
                        </div>
                    </div>
                </div>
                <div class="syllabus-status ${statusClass}">
                    <i class="fas fa-${statusIcon}"></i> ${statusText}
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    // Add initialization script for circular progress
    html += `
        <script>
            // Initialize circular progress
            document.addEventListener('DOMContentLoaded', function() {
                const progressCircles = document.querySelectorAll('.progress-circle');
                progressCircles.forEach(circle => {
                    const progress = parseInt(circle.getAttribute('data-progress'));
                    if (progress > 50) {
                        circle.classList.add('over-50');
                    }
                    
                    // Set rotation for the progress circle
                    const fills = circle.querySelectorAll('.progress-circle-fill');
                    const masks = circle.querySelectorAll('.progress-circle-mask');
                    
                    const degreeProgress = 3.6 * progress; // 3.6 degrees per percentage point (360/100)
                    
                    fills.forEach(fill => {
                        fill.style.transform = \`rotate(\${degreeProgress}deg)\`;
                    });
                    
                    if (progress <= 50) {
                        if (masks[1]) masks[1].style.opacity = '0';
                    } else {
                        if (masks[0]) masks[0].style.transform = 'rotate(180deg)';
                    }
                });
            });
        </script>
    `;
    
    return html;
}

/**
 * Mask Aadhaar number for privacy
 * @param {string} aadhaar - The Aadhaar number
 * @returns {string} - The masked Aadhaar number
 */
function maskAadhaar(aadhaar) {
    if (!aadhaar) return 'XXXX-XXXX-XXXX';
    
    // Remove any non-digit characters
    const digits = aadhaar.replace(/\D/g, '');
    
    if (digits.length !== 12) return 'XXXX-XXXX-XXXX';
    
    // Mask all but the last 4 digits
    return `XXXX-XXXX-${digits.substring(8, 12)}`;
}

/**
 * Get mock enhanced Juno data for demo purposes
 * @param {string} studentId - The student ID
 * @param {Object} existingData - Any existing student data
 * @returns {Object} - The mock data
 */
function getMockEnhancedJunoData(studentId, existingData = {}) {
    // Get full name and split it properly for display
    const fullName = existingData.fullName || '';
    const nameParts = fullName.split(' ');
    let firstName = nameParts[0] || '';
    let lastName = nameParts.slice(1).join(' ').toUpperCase() || '';
    
    // If no existing data was found, use default values
    if (!fullName || fullName.trim() === '') {
        firstName = 'Demo';
        lastName = 'USER';
    }
    
    return {
        id: studentId || '12345',
        name: firstName,
        lastName: lastName,
        rollNumber: existingData.enrollmentNumber || 'N/A', // Use enrollment number from localStorage or fallback
        branch: 'Computer Science Engineering',
        semester: 'First Year Semester II',
        grade: 'A',
        cgpa: existingData.cgpa || 8.75,
        attendance: existingData.attendance || 92,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: '+91 9876543210',
        address: 'Mumbai, Maharashtra',
        bloodGroup: 'O+',
        aadhaarNo: '123456789012',
        category: 'General',
        nationality: 'Indian',
        profilePic: existingData.profilePic || null,
        coverPhoto: null,
        timetable: getDefaultTimetable(),
        syllabusProgress: getDefaultSyllabusProgress(),
        fees: {
            total: '120,000',
            paid: '90,000',
            due: '30,000',
            dueDate: '30 June 2025'
        }
    };
}

/**
 * Get default timetable data
 * @returns {Array} - The default timetable
 */
function getDefaultTimetable() {
    // Get the current day of the week (0-6, where 0 is Sunday)
    const today = new Date().getDay();
    
    // Define timetables for each weekday
    const timetables = {
        1: [ // Monday
            { time: '09:00 - 11:00', subject: 'Mathematics-II', room: 'C.R-301' },
            { time: '11:15 - 12:15', subject: 'Mathematics-II', room: 'C.R-301' },
            { time: '12:15 - 01:15', subject: 'Mentoring', room: 'C.R-301' },
            { time: '02:00 - 03:00', subject: 'GEN AI', room: 'C.R-301' },
            { time: '03:00 - 04:00', subject: 'Professional Communication', room: 'C.R-301' }
        ],
        2: [ // Tuesday
            { time: '09:00 - 11:00', subject: 'Computer Workshop', room: 'CW Lab' },
            { time: '11:15 - 12:15', subject: 'Mathematics-II', room: 'C.R-301' },
            { time: '12:15 - 01:15', subject: 'Applied Chemistry', room: 'C.R-301' },
            { time: '02:00 - 03:00', subject: 'GEN AI', room: 'C.R-301' },
            { time: '03:00 - 04:00', subject: 'Activity Hour', room: 'C.R-301' }
        ],
        3: [ // Wednesday
            { time: '09:00 - 11:00', subject: 'GEN AI', room: 'C.R-301' },
            { time: '11:15 - 12:15', subject: 'Computer Workshop', room: 'C.R-301' },
            { time: '12:15 - 01:15', subject: 'GEN AI', room: 'C.R-301' },
            { time: '02:00 - 03:00', subject: 'Mathematics-II', room: 'C.R-301' },
            { time: '03:00 - 04:00', subject: 'Training', room: 'C.R-301' }
        ],
        4: [ // Thursday
            { time: '09:00 - 11:00', subject: 'Professional Communication', room: 'PC Lab' },
            { time: '11:15 - 12:15', subject: 'Applied Chemistry', room: 'C.R-301' },
            { time: '12:15 - 01:15', subject: 'Software Engineering', room: 'C.R-301' },
            { time: '02:00 - 03:00', subject: 'Training', room: 'C.R-301' },
            { time: '03:00 - 04:00', subject: 'Activity Hour', room: 'C.R-301' }
        ],
        5: [ // Friday
            { time: '09:00 - 11:00', subject: 'Applied Chemistry', room: 'Chem. Lab' },
            { time: '11:15 - 12:15', subject: 'Applied Chemistry', room: 'C.R-301' },
            { time: '12:15 - 01:15', subject: 'Software Engineering', room: 'C.R-301' },
            { time: '02:00 - 03:00', subject: 'Training', room: 'C.R-301' },
            { time: '03:00 - 04:00', subject: 'Activity Hour', room: 'C.R-301' }
        ]
    };
    
    // Return today's timetable if it's a weekday, or Monday's timetable if it's weekend
    return timetables[today] || timetables[1];
}

/**
 * Get default syllabus progress data
 * @returns {Array} - The default syllabus progress
 */
function getDefaultSyllabusProgress() {
    return [
        { subject: 'Mathematics-II', progress: 65 },
        { subject: 'Applied Chemistry', progress: 80 },
        { subject: 'Professional Communication', progress: 75 },
        { subject: 'GEN AI', progress: 55 },
        { subject: 'Computer Workshop', progress: 70 },
        { subject: 'Software Engineering', progress: 40 },
    ];
}

/**
 * Add timetable styles to document
 */
(function addTimetableStyles() {
    document.addEventListener('DOMContentLoaded', function() {
        const style = document.createElement('style');
        style.textContent = `
            .timetable-container {
                margin-bottom: 30px;
                padding: 20px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            }
            
            .timetable-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 5px;
                background: linear-gradient(to right, #6a11cb, #2575fc);
            }
            
            .timetable-container h4 {
                text-align: center;
                margin: 5px 0 15px;
                font-size: 1.5em;
                background: linear-gradient(to right, #6a11cb, #2575fc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: bold;
            }
            
            .timetable-container h5 {
                text-align: center;
                margin: 5px 0;
                font-size: 1.1em;
                color: rgba(255, 255, 255, 0.9);
            }
            
            .timetable-info {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                margin: 15px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding: 10px 15px 20px;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 8px;
            }
            
            .timetable-info div {
                padding: 8px 15px;
                border-radius: 20px;
                background: rgba(106, 17, 203, 0.1);
                margin: 5px;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .timetable-info div:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .timetable-info strong {
                color: #6a11cb;
            }
            
            /* Print button */
            .timetable-print-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: white;
            }
            
            .timetable-print-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }
            
            /* Enhanced table */
            .syllabus-timetable {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin: 20px 0;
                font-size: 0.9em;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            
            .syllabus-timetable th, .syllabus-timetable td {
                border: none;
                padding: 12px 10px;
                text-align: center;
                position: relative;
            }
            
            .syllabus-timetable th {
                background: linear-gradient(to right, #6a11cb, #2575fc);
                color: white;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 0.8em;
                letter-spacing: 0.5px;
            }
            
            .syllabus-timetable tr:nth-child(even) {
                background-color: rgba(255, 255, 255, 0.05);
            }
            
            .syllabus-timetable tr:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            /* Day column styling */
            .syllabus-timetable td:first-child {
                font-weight: bold;
                background-color: rgba(106, 17, 203, 0.15);
                color: #fff;
                border-left: 3px solid #6a11cb;
            }
            
            /* Current day highlight */
            .syllabus-timetable tr.current-day {
                background-color: rgba(0, 184, 255, 0.08) !important;
            }
            
            .syllabus-timetable tr.current-day td:first-child {
                background-color: rgba(0, 184, 255, 0.2);
                border-left: 3px solid #00b8ff;
            }
            
            .syllabus-timetable tr.current-day td:first-child::after {
                content: "TODAY";
                position: absolute;
                top: 3px;
                right: 3px;
                font-size: 8px;
                background: #00b8ff;
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-weight: bold;
            }
            
            /* Batch divisions formatting */
            .batch-divisions {
                display: flex;
                flex-direction: column;
                font-size: 0.85em;
            }
            
            .batch-division {
                margin: 2px 0;
                padding: 3px 5px;
                border-radius: 4px;
                white-space: nowrap;
            }
            
            .batch-a1 { background-color: rgba(106, 17, 203, 0.2); }
            .batch-a2 { background-color: rgba(0, 184, 255, 0.2); }
            .batch-a3 { background-color: rgba(76, 175, 80, 0.2); }
            .batch-a4 { background-color: rgba(255, 152, 0, 0.2); }
            .batch-a5 { background-color: rgba(233, 30, 99, 0.2); }
            
            /* Active time slot based on current time */
            .current-time-slot {
                background-color: rgba(76, 175, 80, 0.1) !important;
                box-shadow: inset 0 0 0 1px rgba(76, 175, 80, 0.3);
            }
            
            .current-time-slot::after {
                content: "CURRENT";
                position: absolute;
                top: 3px;
                right: 3px;
                font-size: 8px;
                background: #4CAF50;
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-weight: bold;
            }
            
            .faculty-info {
                margin-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding-top: 10px;
            }
            
            /* Library Styles */
            .library-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-top: 20px;
            }
            
            .library-card {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 15px;
                flex: 1 1 calc(50% - 20px);
                min-width: 300px;
            }
            
            .library-card h4 {
                margin-top: 0;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                color: #6a11cb;
            }
            
            .library-note {
                font-style: italic;
                margin-top: 15px;
                padding: 10px;
                background: rgba(106, 17, 203, 0.1);
                border-left: 3px solid #6a11cb;
                border-radius: 4px;
            }
            
            .library-books-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            
            .library-books-table th, .library-books-table td {
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 8px;
                text-align: left;
            }
            
            .library-books-table th {
                background-color: rgba(106, 17, 203, 0.3);
                color: white;
            }
            
            .library-books-table tr:nth-child(even) {
                background-color: rgba(255, 255, 255, 0.05);
            }
            
            .library-rules {
                flex: 1 1 100%;
            }
            
            .library-rules ol {
                padding-left: 20px;
            }
            
            .library-rules li {
                margin-bottom: 5px;
            }
            
            .status-active {
                color: #4caf50;
                font-weight: bold;
            }
            
            .e-resources-list {
                list-style-type: none;
                padding: 0;
            }
            
            .e-resources-list li {
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .e-resources-list li:last-child {
                border-bottom: none;
            }
            
            .faculty-info ul {
                list-style-type: none;
                padding-left: 0;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 10px;
            }
            
            .faculty-info li {
                padding: 5px;
                border-left: 3px solid #6a11cb;
                padding-left: 10px;
            }
            
            @media (max-width: 768px) {
                .syllabus-timetable {
                    font-size: 0.7em;
                }
                
                .faculty-info ul {
                    grid-template-columns: 1fr;
                }
                
                .batch-divisions {
                    font-size: 0.75em;
                }
                
                .batch-division {
                    padding: 2px 3px;
                    white-space: normal;
                }
                
                .timetable-container {
                    padding: 15px 10px;
                }
                
                .timetable-info {
                    flex-direction: column;
                    padding: 10px;
                }
                
                .timetable-info div {
                    width: 100%;
                    margin: 3px 0;
                    text-align: center;
                }
                
                /* Create a mobile-friendly view for tables */
                .timetable-container.mobile-view .syllabus-timetable th:not(:first-child),
                .timetable-container.mobile-view .syllabus-timetable td:not(:first-child) {
                    display: none;
                }
                
                .timetable-container.mobile-view .syllabus-timetable td:first-child {
                    width: 100%;
                    display: block;
                    text-align: center;
                    border-bottom: none;
                }
                
                /* Mobile view toggle button */
                .timetable-mobile-toggle {
                    display: none;
                    position: absolute;
                    top: 15px;
                    right: 60px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: white;
                }
                
                .timetable-mobile-toggle:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                @media (max-width: 600px) {
                    .timetable-mobile-toggle {
                        display: flex;
                    }
                    
                    .syllabus-timetable {
                        font-size: 0.65em;
                    }
                    
                    /* Further adjustments for very small screens */
                    .timetable-container h4 {
                        font-size: 1.2em;
                    }
                    
                    .timetable-container h5 {
                        font-size: 0.9em;
                    }
                }
            }
            
            /* Syllabus Progress Enhanced Styles */
            .syllabus-progress-container {
                margin-top: 25px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
                         .syllabus-summary {
                 display: flex;
                 flex-wrap: wrap;
                 gap: 20px;
                 background: rgba(255, 255, 255, 0.8);
                 padding: 20px;
                 border-radius: 12px;
                 box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
             }
            
            .average-progress {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
            }
            
                         .average-label {
                 margin-top: 10px;
                 font-size: 1rem;
                 color: #000;
                 font-weight: 500;
             }
            
            .progress-stats {
                display: flex;
                flex: 1;
                justify-content: space-around;
                align-items: center;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .stat-item {
                text-align: center;
                padding: 10px 15px;
                border-radius: 8px;
                min-width: 80px;
                backdrop-filter: blur(5px);
                transition: all 0.3s ease;
            }
            
            .stat-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
                         .stat-value {
                 font-size: 1.8rem;
                 font-weight: bold;
                 margin-bottom: 5px;
                 color: #000;
             }
            
                         .stat-label {
                 font-size: 0.9rem;
                 color: #000;
             }
            
                         .stat-item.completed {
                 background: rgba(76, 175, 80, 0.15);
                 border-left: 3px solid #4CAF50;
                 color: #000;
             }
             
             .stat-item.in-progress {
                 background: rgba(255, 152, 0, 0.15);
                 border-left: 3px solid #FF9800;
                 color: #000;
             }
             
             .stat-item.attention {
                 background: rgba(244, 67, 54, 0.15);
                 border-left: 3px solid #F44336;
                 color: #000;
             }
            
            /* Circular Progress */
            .progress-circle {
                width: 120px;
                height: 120px;
                position: relative;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .progress-circle-mask,
            .progress-circle-fill {
                width: 120px;
                height: 120px;
                position: absolute;
                border-radius: 50%;
                transition: transform 0.5s ease-in-out;
            }
            
            .progress-circle-mask {
                clip: rect(0px, 120px, 120px, 60px);
            }
            
            .progress-circle-fill {
                clip: rect(0px, 60px, 120px, 0px);
                background-color: #6a11cb;
            }
            
            .progress-circle.over-50 .progress-circle-mask.full {
                clip: rect(0px, 120px, 120px, 0px);
            }
            
                         .progress-circle-overlay {
                 width: 100px;
                 height: 100px;
                 position: absolute;
                 top: 10px;
                 left: 10px;
                 border-radius: 50%;
                 background-color: rgba(255, 255, 255, 0.7);
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 font-size: 1.5rem;
                 font-weight: bold;
                 color: #000;
                 text-shadow: none;
             }
            
            /* Enhanced Progress Bars */
            .syllabus-progress {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 15px;
            }
            
                         .syllabus-item {
                 background: rgba(255, 255, 255, 0.8);
                 border-radius: 10px;
                 padding: 15px;
                 box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
                 transition: all 0.3s ease;
                 position: relative;
                 overflow: hidden;
             }
            
            .syllabus-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .syllabus-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            
                         .syllabus-subject {
                 font-weight: 500;
                 font-size: 1.1rem;
                 color: #000;
             }
            
            .syllabus-percentage {
                font-weight: bold;
                font-size: 1.2rem;
                padding: 3px 8px;
                border-radius: 4px;
            }
            
            .syllabus-progress-outer {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 20px;
                height: 12px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            
            .syllabus-progress-bar {
                width: 100%;
                height: 100%;
                border-radius: 20px;
                position: relative;
            }
            
            .syllabus-progress-fill {
                height: 100%;
                border-radius: 20px;
                position: relative;
                transition: width 1s ease-in-out;
            }
            
            .progress-glow {
                position: absolute;
                top: 0;
                right: 0;
                height: 100%;
                width: 15px;
                background-color: rgba(255, 255, 255, 0.6);
                filter: blur(5px);
                border-radius: 50%;
            }
            
            .syllabus-status {
                font-size: 0.85rem;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 3px 8px;
                border-radius: 4px;
                margin-top: 5px;
            }
            
                         /* Status colors */
             .status-danger {
                 background-color: rgba(244, 67, 54, 0.1);
                 color: #000;
             }
             
             .status-warning {
                 background-color: rgba(255, 152, 0, 0.1);
                 color: #000;
             }
             
             .status-good {
                 background-color: rgba(76, 175, 80, 0.1);
                 color: #000;
             }
             
             .status-complete {
                 background-color: rgba(33, 150, 243, 0.1);
                 color: #000;
             }
            
            .syllabus-progress-fill.status-danger {
                background: linear-gradient(to right, #F44336, #FF5252);
            }
            
            .syllabus-progress-fill.status-warning {
                background: linear-gradient(to right, #FF9800, #FFB74D);
            }
            
            .syllabus-progress-fill.status-good {
                background: linear-gradient(to right, #4CAF50, #81C784);
            }
            
            .syllabus-progress-fill.status-complete {
                background: linear-gradient(to right, #2196F3, #64B5F6);
            }
            
            /* Animation for progress bars */
            @keyframes progressAnimation {
                0% { width: 0; }
                100% { width: var(--progress-width); }
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .syllabus-progress {
                    grid-template-columns: 1fr;
                }
                
                .progress-circle {
                    width: 100px;
                    height: 100px;
                }
                
                .progress-circle-mask,
                .progress-circle-fill {
                    width: 100px;
                    height: 100px;
                }
                
                .progress-circle-overlay {
                    width: 80px;
                    height: 80px;
                    top: 10px;
                    left: 10px;
                    font-size: 1.2rem;
                }
                
                .stat-item {
                    min-width: 70px;
                    padding: 8px 10px;
                }
                
                .stat-value {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    });
})();

/**
 * Format student name to ensure it fits properly in the header
 * @param {string} firstName - The student's first name
 * @param {string} lastName - The student's last name
 * @returns {string} - Properly formatted student name
 */
function formatStudentName(firstName, lastName) {
    // If the combined name is too long, format it differently
    const fullName = `${firstName} ${lastName}`;
    
    if (fullName.length > 25) {
        // For very long names, break into multiple lines
        return `${firstName}<br>${lastName}`;
    }
    
    return fullName;
}

/**
 * Enhance timetables with interactive features
 * This function will be called after the timetable is displayed
 */
function enhanceTimetables() {
    // Add print buttons to all timetable containers
    const timetableContainers = document.querySelectorAll('.timetable-container');
    
    timetableContainers.forEach((container, index) => {
        // Add print button if not already present
        if (!container.querySelector('.timetable-print-btn')) {
            const printBtn = document.createElement('button');
            printBtn.className = 'timetable-print-btn';
            printBtn.title = 'Print Timetable';
            printBtn.innerHTML = '<i class="fas fa-print"></i>';
            printBtn.setAttribute('data-timetable-index', index);
            printBtn.addEventListener('click', printTimetable);
            
            // Insert at the beginning of the container
            container.insertBefore(printBtn, container.firstChild);
        }
        
        // Add mobile toggle button for small screens
        if (!container.querySelector('.timetable-mobile-toggle')) {
            const mobileToggleBtn = document.createElement('button');
            mobileToggleBtn.className = 'timetable-mobile-toggle';
            mobileToggleBtn.title = 'Toggle Mobile View';
            mobileToggleBtn.innerHTML = '<i class="fas fa-mobile-alt"></i>';
            mobileToggleBtn.addEventListener('click', () => {
                container.classList.toggle('mobile-view');
                
                // Update icon
                if (container.classList.contains('mobile-view')) {
                    mobileToggleBtn.innerHTML = '<i class="fas fa-desktop"></i>';
                    mobileToggleBtn.title = 'Switch to Desktop View';
                } else {
                    mobileToggleBtn.innerHTML = '<i class="fas fa-mobile-alt"></i>';
                    mobileToggleBtn.title = 'Switch to Mobile View';
                }
            });
            
            // Insert after print button
            container.insertBefore(mobileToggleBtn, container.firstChild.nextSibling);
        }
        
        // Enhance batch divisions in first column of each row
        const table = container.querySelector('.syllabus-timetable');
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;
            
            // Skip Saturday row which has a colspan
            if (cells[0].textContent.trim() === 'Saturday') return;
            
            // Set row ID if not set
            if (!row.id) {
                const day = cells[0].textContent.trim().toLowerCase();
                row.id = `${day}-row-${index}`;
            }
            
            // Enhance first column after day column (which contains the batch divisions)
            if (cells.length > 1) {
                const batchCell = cells[1];
                const batchText = batchCell.textContent.trim();
                
                // If cell doesn't already have batch divisions formatting
                if (!batchCell.querySelector('.batch-divisions')) {
                    // Parse the batch divisions text (format: A1-SUBJECT / A2-SUBJECT / etc.)
                    const batchParts = batchText.split('/').map(part => part.trim());
                    
                    if (batchParts.length > 1) {
                        const batchDivisions = document.createElement('div');
                        batchDivisions.className = 'batch-divisions';
                        
                        batchParts.forEach(batchPart => {
                            const batchMatch = batchPart.match(/^(A\d+)-(.+)$/);
                            if (batchMatch) {
                                const batchNum = batchMatch[1].toLowerCase(); // a1, a2, etc.
                                const subject = batchMatch[2];
                                
                                const batchDiv = document.createElement('span');
                                batchDiv.className = `batch-division batch-${batchNum}`;
                                batchDiv.textContent = `${batchMatch[1]}: ${subject}`;
                                batchDivisions.appendChild(batchDiv);
                            }
                        });
                        
                        // Replace content with the formatted divisions
                        batchCell.innerHTML = '';
                        batchCell.appendChild(batchDivisions);
                    }
                }
            }
        });
        
        // Highlight current day
        highlightCurrentDay(table);
    });
    
    // Also highlight current time slot
    highlightCurrentTimeSlot();
}

/**
 * Highlight the current day in timetable
 * @param {HTMLElement} table - The timetable element
 */
function highlightCurrentDay(table) {
    // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const today = new Date().getDay();
    
    // Skip if Sunday (day 0) or invalid day
    if (today === 0 || today > 6) return;
    
    // Map day of week to row index (1 = Monday, adjust to 0-based index)
    const rowIndex = today - 1;
    
    // Find all rows in the table body
    const rows = table.querySelectorAll('tbody tr');
    
    // If we have enough rows, highlight the current day
    if (rowIndex < rows.length) {
        rows[rowIndex].classList.add('current-day');
    }
}

/**
 * Highlight current time slot based on current time
 */
function highlightCurrentTimeSlot() {
    // Get all timetables
    const tables = document.querySelectorAll('.syllabus-timetable');
    
    // Define time slots
    const timeSlots = [
        { start: '09:00', end: '11:00', column: 1 },
        { start: '11:15', end: '12:15', column: 2 },
        { start: '12:15', end: '13:15', column: 3 },  // 1:15 PM in 24h format
        { start: '14:00', end: '15:00', column: 4 },  // 2-3 PM
        { start: '15:00', end: '16:00', column: 5 }   // 3-4 PM
    ];
    
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Find current time slot
    let currentSlotColumn = -1;
    for (const slot of timeSlots) {
        if (currentTimeStr >= slot.start && currentTimeStr <= slot.end) {
            currentSlotColumn = slot.column;
            break;
        }
    }
    
    // Exit if not in any defined time slot
    if (currentSlotColumn === -1) return;
    
    // Get current day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const today = new Date().getDay();
    
    // Skip if Sunday (day 0) or invalid day
    if (today === 0 || today > 6) return;
    
    // Map day of week to row index (1 = Monday, adjust to 0-based index)
    const rowIndex = today - 1;
    
    // Highlight the current time slot in all tables
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        if (rowIndex < rows.length) {
            const currentRow = rows[rowIndex];
            const cells = currentRow.querySelectorAll('td');
            
            if (currentSlotColumn < cells.length) {
                cells[currentSlotColumn].classList.add('current-time-slot');
            }
        }
    });
}

/**
 * Print timetable when clicking the print button
 * @param {Event} e - Click event
 */
function printTimetable(e) {
    const btn = e.currentTarget;
    const timetableIndex = btn.getAttribute('data-timetable-index');
    const container = document.querySelectorAll('.timetable-container')[timetableIndex];
    
    if (!container) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Get required elements
    const title = container.querySelector('h4')?.textContent || 'Timetable';
    const subtitle = container.querySelector('h5')?.textContent || '';
    const timetable = container.querySelector('.syllabus-timetable');
    const facultyInfo = container.querySelector('.faculty-info');
    
    if (!timetable) {
        printWindow.close();
        return;
    }
    
    // Create print document
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print ${title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 30px; }
                h1, h2 { text-align: center; margin: 5px 0; }
                h1 { font-size: 18px; }
                h2 { font-size: 14px; }
                .print-info { display: flex; justify-content: space-around; margin: 15px 0; border: 1px solid #ccc; padding: 10px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                th { background-color: #f0f0f0; }
                .faculty-info { margin-top: 20px; }
                .faculty-info h3 { font-size: 14px; margin: 5px 0; }
                .faculty-info ul { padding-left: 20px; }
                .batch-divisions span { display: block; padding: 3px 0; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                @media print {
                    .no-print { display: none; }
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <h2>${subtitle}</h2>
            
            <div class="print-info">
                ${Array.from(container.querySelectorAll('.timetable-info div'))
                    .map(div => `<div>${div.innerHTML}</div>`)
                    .join('')}
            </div>
            
            ${timetable.outerHTML}
            
            ${facultyInfo ? facultyInfo.outerHTML : ''}
            
            <div class="footer">
                <p>Printed on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()">Print</button>
                <button onclick="window.close()">Close</button>
            </div>
            
            <script>
                // Format batch divisions for printing
                document.querySelectorAll('.batch-divisions').forEach(div => {
                    const spans = Array.from(div.querySelectorAll('.batch-division'));
                    spans.forEach(span => {
                        span.className = ''; // Remove colorful classes for printing
                    });
                });
                
                // Auto-print
                setTimeout(() => window.print(), 500);
            </script>
        </body>
        </html>
    `);
    
    // Close the document
    printWindow.document.close();
}

// Initialize timetable enhancements when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Delay the enhancement to ensure all timetables are rendered
    setTimeout(enhanceTimetables, 1000);
});

// Also add enhancement to event handlers when timetable tabs are shown
function addTabChangeEnhancements() {
    const junoTabs = document.querySelectorAll('.juno-tab');
    
    junoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.getAttribute('data-tab') === 'timetable' || tab.getAttribute('data-tab') === 'syllabus') {
                // Delay enhancement to allow tab content to render
                setTimeout(enhanceTimetables, 200);
            }
        });
    });
}

// Add tab change enhancements when document is ready
document.addEventListener('DOMContentLoaded', addTabChangeEnhancements);

/**
 * Initialize leave applications functionality
 */
function initLeaveApplications() {
    // Get elements
    const applyLeaveBtn = document.querySelector('.apply-leave-btn');
    const leaveApplicationModal = document.querySelector('.leave-application-modal');
    const closeLeaveFormBtn = document.querySelector('.close-leave-form');
    const cancelFormBtn = document.querySelector('.cancel-form-btn');
    const leaveApplicationForm = document.querySelector('.leave-application-form');
    const viewLeaveButtons = document.querySelectorAll('.view-leave-btn');
    const cancelLeaveButtons = document.querySelectorAll('.cancel-leave-btn');
    const leaveDetailsModal = document.querySelector('.leave-details-modal');
    const closeLeaveDetailsBtn = document.querySelector('.close-leave-details');
    const leaveFilterSelect = document.getElementById('leave-filter-select');
    const calendarNavBtns = document.querySelectorAll('.calendar-nav-btn');
    
    // Handle apply leave button click
    if (applyLeaveBtn) {
        applyLeaveBtn.addEventListener('click', () => {
            if (leaveApplicationModal) {
                leaveApplicationModal.style.display = 'flex';
                setTimeout(() => {
                    leaveApplicationModal.classList.add('show');
                }, 10);
            }
        });
    }
    
    // Handle close leave form button
    if (closeLeaveFormBtn) {
        closeLeaveFormBtn.addEventListener('click', () => {
            if (leaveApplicationModal) {
                leaveApplicationModal.classList.remove('show');
                setTimeout(() => {
                    leaveApplicationModal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Handle cancel form button
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => {
            if (leaveApplicationModal) {
                leaveApplicationModal.classList.remove('show');
                setTimeout(() => {
                    leaveApplicationModal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Handle leave application form submission
    if (leaveApplicationForm) {
        leaveApplicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const leaveType = document.getElementById('leave-type').value;
            const leaveFrom = document.getElementById('leave-from').value;
            const leaveTo = document.getElementById('leave-to').value;
            const leaveReason = document.getElementById('leave-reason').value;
            
            // Validate form data
            if (!leaveType || !leaveFrom || !leaveTo || !leaveReason) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Close the modal
            leaveApplicationModal.classList.remove('show');
            setTimeout(() => {
                leaveApplicationModal.style.display = 'none';
                
                // Reset form
                leaveApplicationForm.reset();
                
                // Show success notification
                showNotification('Leave application submitted successfully', 'success');
                
                // In a real implementation, we would save the leave application
                // and update the leave table and calendar
                // Here we'll just simulate adding a new row to the table
                setTimeout(() => {
                    addLeaveApplicationRow(leaveType, leaveFrom, leaveTo, leaveReason);
                }, 500);
            }, 300);
        });
    }
    
    // Handle view leave details button clicks
    viewLeaveButtons.forEach(button => {
        button.addEventListener('click', () => {
            const leaveId = button.getAttribute('data-leave-id');
            showLeaveDetails(leaveId);
        });
    });
    
    // Handle cancel leave button clicks
    cancelLeaveButtons.forEach(button => {
        button.addEventListener('click', () => {
            const leaveId = button.getAttribute('data-leave-id');
            confirmCancelLeave(leaveId);
        });
    });
    
    // Handle close leave details button
    if (closeLeaveDetailsBtn) {
        closeLeaveDetailsBtn.addEventListener('click', () => {
            if (leaveDetailsModal) {
                leaveDetailsModal.classList.remove('show');
                setTimeout(() => {
                    leaveDetailsModal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Handle leave filter changes
    if (leaveFilterSelect) {
        leaveFilterSelect.addEventListener('change', filterLeaveTable);
    }
    
    // Handle calendar navigation
    if (calendarNavBtns) {
        calendarNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isNext = btn.classList.contains('next-month');
                navigateCalendar(isNext);
            });
        });
    }
    
    // Add dragover and drop event listeners to file upload area
    const fileUpload = document.querySelector('.file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });
        
        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });
        
        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            
            // Handle file drop
            if (e.dataTransfer.files.length) {
                const fileInput = fileUpload.querySelector('input[type="file"]');
                if (fileInput) {
                    fileInput.files = e.dataTransfer.files;
                    
                    // Update file name display
                    const fileNameDisplay = fileUpload.querySelector('.file-upload-label span');
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = e.dataTransfer.files[0].name;
                        fileUpload.classList.add('has-file');
                    }
                }
            }
        });
        
        // Handle file input change
        const fileInput = fileUpload.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length) {
                    const fileNameDisplay = fileUpload.querySelector('.file-upload-label span');
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = fileInput.files[0].name;
                        fileUpload.classList.add('has-file');
                    }
                } else {
                    const fileNameDisplay = fileUpload.querySelector('.file-upload-label span');
                    if (fileNameDisplay) {
                        fileNameDisplay.textContent = 'Choose file or drag & drop';
                        fileUpload.classList.remove('has-file');
                    }
                }
            });
        }
    }
    
    // Initialize date validation for leave form
    initDateValidation();
}

/**
 * Initialize date validation for leave form
 */
function initDateValidation() {
    const fromDateInput = document.getElementById('leave-from');
    const toDateInput = document.getElementById('leave-to');
    
    if (fromDateInput && toDateInput) {
        // Set minimum date as today for both inputs
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        fromDateInput.setAttribute('min', formattedToday);
        toDateInput.setAttribute('min', formattedToday);
        
        // When from date changes, update to date min attribute
        fromDateInput.addEventListener('change', () => {
            if (fromDateInput.value) {
                toDateInput.setAttribute('min', fromDateInput.value);
                
                // If to date is before from date, update it
                if (toDateInput.value && toDateInput.value < fromDateInput.value) {
                    toDateInput.value = fromDateInput.value;
                }
            }
        });
    }
}

/**
 * Show leave details in the modal
 * @param {string} leaveId - The ID of the leave to show details for
 */
function showLeaveDetails(leaveId) {
    // In a real implementation, we would fetch leave details from the server
    // For now, we'll just use the demo data
    
    const leaveDetailsModal = document.querySelector('.leave-details-modal');
    if (!leaveDetailsModal) return;
    
    // Get leave data based on ID (for demo purposes)
    let leaveData;
    switch (leaveId) {
        case '1':
            leaveData = {
                id: '1',
                type: 'medical',
                status: 'approved',
                fromDate: '15 Mar 2025',
                toDate: '16 Mar 2025',
                duration: '2 days',
                reason: 'Fever and cold',
                appliedOn: '12 Mar 2025',
                approvedBy: 'Prof. S. M. Shinde',
                approvedOn: '13 Mar 2025',
                comments: 'Medical leave approved. Please submit medical certificate upon return.',
                documents: [
                    { name: 'Medical_Certificate.pdf', type: 'medical' }
                ]
            };
            break;
        case '2':
            leaveData = {
                id: '2',
                type: 'personal',
                status: 'approved',
                fromDate: '10 Apr 2025',
                toDate: '12 Apr 2025',
                duration: '3 days',
                reason: 'Family function',
                appliedOn: '1 Apr 2025',
                approvedBy: 'Prof. V. V. Zambare',
                approvedOn: '3 Apr 2025',
                comments: 'Approved. Please complete assignments before leaving.',
                documents: []
            };
            break;
        case '3':
            leaveData = {
                id: '3',
                type: 'academic',
                status: 'pending',
                fromDate: '5 May 2025',
                toDate: '5 May 2025',
                duration: '1 day',
                reason: 'IEEE Conference',
                appliedOn: '20 Apr 2025',
                approvedBy: '',
                approvedOn: '',
                comments: 'Waiting for HOD approval',
                documents: [
                    { name: 'Conference_Invitation.pdf', type: 'document' }
                ]
            };
            break;
        default:
            // Default data
            leaveData = {
                id: leaveId,
                type: 'personal',
                status: 'pending',
                fromDate: 'N/A',
                toDate: 'N/A',
                duration: 'N/A',
                reason: 'N/A',
                appliedOn: 'N/A',
                approvedBy: '',
                approvedOn: '',
                comments: '',
                documents: []
            };
    }
    
    // Update the leave details modal with the data
    updateLeaveDetailsModal(leaveData);
    
    // Show the modal
    leaveDetailsModal.style.display = 'flex';
    setTimeout(() => {
        leaveDetailsModal.classList.add('show');
    }, 10);
}

/**
 * Update the leave details modal with the provided data
 * @param {Object} leaveData - The leave data to display
 */
function updateLeaveDetailsModal(leaveData) {
    // Get elements
    const statusBanner = document.querySelector('.leave-status-banner');
    const leaveTypeValue = document.querySelector('.leave-detail-type');
    const leaveFromValue = document.querySelector('.leave-detail-from');
    const leaveToValue = document.querySelector('.leave-detail-to');
    const leaveDurationValue = document.querySelector('.leave-detail-duration');
    const leaveReasonValue = document.querySelector('.leave-detail-reason');
    const leaveAppliedValue = document.querySelector('.leave-detail-applied');
    const leaveApproverValue = document.querySelector('.leave-detail-approver');
    const leaveApprovalDateValue = document.querySelector('.leave-detail-approval-date');
    const leaveCommentsValue = document.querySelector('.leave-detail-comments');
    const documentsPreview = document.querySelector('.document-preview');
    
    // Update status banner
    if (statusBanner) {
        statusBanner.className = 'leave-status-banner ' + leaveData.status;
        let statusIcon, statusText;
        
        switch (leaveData.status) {
            case 'approved':
                statusIcon = 'check-circle';
                statusText = 'Approved';
                break;
            case 'rejected':
                statusIcon = 'times-circle';
                statusText = 'Rejected';
                break;
            case 'pending':
            default:
                statusIcon = 'clock';
                statusText = 'Pending';
                break;
        }
        
        statusBanner.innerHTML = `<i class="fas fa-${statusIcon}"></i><span>${statusText}</span>`;
    }
    
    // Update leave type with appropriate icon
    if (leaveTypeValue) {
        let typeIcon;
        let typeName;
        
        switch (leaveData.type) {
            case 'medical':
                typeIcon = 'user-md';
                typeName = 'Medical Leave';
                break;
            case 'personal':
                typeIcon = 'home';
                typeName = 'Personal Leave';
                break;
            case 'vacation':
                typeIcon = 'plane-departure';
                typeName = 'Vacation Leave';
                break;
            case 'academic':
                typeIcon = 'project-diagram';
                typeName = 'Academic Leave';
                break;
            default:
                typeIcon = 'calendar-alt';
                typeName = 'Leave';
        }
        
        leaveTypeValue.innerHTML = `<i class="fas fa-${typeIcon}"></i> ${typeName}`;
    }
    
    // Update other values
    if (leaveFromValue) leaveFromValue.textContent = leaveData.fromDate;
    if (leaveToValue) leaveToValue.textContent = leaveData.toDate;
    if (leaveDurationValue) leaveDurationValue.textContent = leaveData.duration;
    if (leaveReasonValue) leaveReasonValue.textContent = leaveData.reason;
    if (leaveAppliedValue) leaveAppliedValue.textContent = leaveData.appliedOn;
    if (leaveApproverValue) leaveApproverValue.textContent = leaveData.approvedBy || 'Pending';
    if (leaveApprovalDateValue) leaveApprovalDateValue.textContent = leaveData.approvedOn || 'Pending';
    if (leaveCommentsValue) leaveCommentsValue.textContent = leaveData.comments || 'No comments';
    
    // Update documents
    if (documentsPreview) {
        // Clear existing documents
        documentsPreview.innerHTML = '';
        
        if (leaveData.documents && leaveData.documents.length > 0) {
            // Add each document
            leaveData.documents.forEach(doc => {
                const docIcon = doc.type === 'medical' ? 'file-medical' : 'file-pdf';
                
                const docItem = document.createElement('div');
                docItem.className = 'document-item';
                docItem.innerHTML = `
                    <i class="fas fa-${docIcon}"></i>
                    <span>${doc.name}</span>
                    <a href="#" class="document-action"><i class="fas fa-download"></i></a>
                `;
                
                documentsPreview.appendChild(docItem);
            });
        } else {
            // No documents
            documentsPreview.innerHTML = '<p class="no-documents">No documents attached</p>';
        }
    }
}

/**
 * Confirm cancellation of a leave application
 * @param {string} leaveId - The ID of the leave to cancel
 */
function confirmCancelLeave(leaveId) {
    const confirmCancel = confirm('Are you sure you want to cancel this leave application?');
    
    if (confirmCancel) {
        // In a real implementation, we would send a request to the server
        // For now, we'll just remove the row from the table
        const leaveRow = document.querySelector(`.leave-row button[data-leave-id="${leaveId}"]`).closest('tr');
        
        if (leaveRow) {
            // Fade out and remove
            leaveRow.style.opacity = '0';
            leaveRow.style.transition = 'opacity 0.5s';
            
            setTimeout(() => {
                leaveRow.remove();
                
                // Check if the table is now empty
                const tableBody = document.querySelector('.leave-table tbody');
                const emptyState = document.querySelector('.leave-table-empty');
                
                if (tableBody && tableBody.children.length === 0 && emptyState) {
                    emptyState.classList.remove('hidden');
                }
                
                // Show notification
                showNotification('Leave application cancelled successfully', 'success');
            }, 500);
        }
    }
}

/**
 * Filter the leave table based on the selected filter
 */
function filterLeaveTable() {
    const filterValue = document.getElementById('leave-filter-select').value;
    const leaveRows = document.querySelectorAll('.leave-row');
    const emptyState = document.querySelector('.leave-table-empty');
    
    let visibleCount = 0;
    
    leaveRows.forEach(row => {
        const statusCell = row.querySelector('.leave-status');
        if (!statusCell) return;
        
        const hasStatus = statusCell.classList.contains(filterValue);
        
        if (filterValue === 'all' || hasStatus) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show or hide empty state
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
}

/**
 * Navigate the leave calendar
 * @param {boolean} next - Whether to navigate to the next month
 */
function navigateCalendar(next) {
    const currentMonthElement = document.querySelector('.current-month');
    if (!currentMonthElement) return;
    
    // Parse current month text (format: "Month YYYY")
    const [month, year] = currentMonthElement.textContent.split(' ');
    
    // Get month index (0-11)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let monthIndex = months.indexOf(month);
    let yearNum = parseInt(year);
    
    if (next) {
        // Move to next month
        monthIndex++;
        if (monthIndex > 11) {
            monthIndex = 0;
            yearNum++;
        }
    } else {
        // Move to previous month
        monthIndex--;
        if (monthIndex < 0) {
            monthIndex = 11;
            yearNum--;
        }
    }
    
    // Update current month text
    currentMonthElement.textContent = `${months[monthIndex]} ${yearNum}`;
    
    // In a real implementation, we would update the calendar days
    // For now, we'll just add a simulated animation
    const calendarDays = document.querySelector('.calendar-days');
    if (calendarDays) {
        calendarDays.style.opacity = '0';
        
        setTimeout(() => {
            calendarDays.style.opacity = '1';
        }, 300);
    }
}

/**
 * Add a new leave application row to the table
 * @param {string} leaveType - The type of leave
 * @param {string} fromDate - The start date
 * @param {string} toDate - The end date
 * @param {string} reason - The reason for leave
 */
function addLeaveApplicationRow(leaveType, fromDate, toDate, reason) {
    const tableBody = document.querySelector('.leave-table tbody');
    const emptyState = document.querySelector('.leave-table-empty');
    
    if (!tableBody) return;
    
    // Format dates
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const formattedFromDate = `${fromDateObj.getDate()} ${fromDateObj.toLocaleString('default', { month: 'short' })} ${fromDateObj.getFullYear()}`;
    const formattedToDate = `${toDateObj.getDate()} ${toDateObj.toLocaleString('default', { month: 'short' })} ${toDateObj.getFullYear()}`;
    
    // Calculate duration
    const diffTime = Math.abs(toDateObj - fromDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Get type icon
    let typeIcon;
    let typeName;
    
    switch (leaveType) {
        case 'medical':
            typeIcon = 'user-md';
            typeName = 'Medical';
            break;
        case 'personal':
            typeIcon = 'home';
            typeName = 'Personal';
            break;
        case 'vacation':
            typeIcon = 'plane-departure';
            typeName = 'Vacation';
            break;
        case 'academic':
            typeIcon = 'project-diagram';
            typeName = 'Academic';
            break;
        default:
            typeIcon = 'calendar-alt';
            typeName = 'Leave';
    }
    
    // Create new row
    const newRow = document.createElement('tr');
    newRow.className = 'leave-row';
    newRow.style.opacity = '0';
    
    // Generate a new ID (in a real app, this would come from the server)
    const newId = Date.now().toString();
    
    newRow.innerHTML = `
        <td>
            <div class="leave-type-cell">
                <i class="fas fa-${typeIcon}"></i>
                <span>${typeName}</span>
            </div>
        </td>
        <td>${formattedFromDate}</td>
        <td>${formattedToDate}</td>
        <td>${diffDays}</td>
        <td class="reason-cell">${reason}</td>
        <td>
            <span class="leave-status pending">
                <i class="fas fa-clock"></i> Pending
            </span>
        </td>
        <td>
            <button class="view-leave-btn" data-leave-id="${newId}">
                <i class="fas fa-eye"></i>
            </button>
            <button class="cancel-leave-btn" data-leave-id="${newId}">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    
    // Add to table
    tableBody.prepend(newRow);
    
    // Hide empty state if needed
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    // Add event listeners to the new buttons
    const viewLeaveBtn = newRow.querySelector('.view-leave-btn');
    const cancelLeaveBtn = newRow.querySelector('.cancel-leave-btn');
    
    if (viewLeaveBtn) {
        viewLeaveBtn.addEventListener('click', () => {
            showLeaveDetails(newId);
        });
    }
    
    if (cancelLeaveBtn) {
        cancelLeaveBtn.addEventListener('click', () => {
            confirmCancelLeave(newId);
        });
    }
    
    // Fade in the new row
    setTimeout(() => {
        newRow.style.transition = 'opacity 0.5s';
        newRow.style.opacity = '1';
    }, 10);
}