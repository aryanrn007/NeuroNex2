// Profile and Skills Updater
// This script ensures the profile image and skills are updated based on the logged-in user's data

document.addEventListener('DOMContentLoaded', () => {
    // Update profile and skills when page loads
    updateUserProfile();
    
    // Also listen for storage events to update when user data changes
    window.addEventListener('storage', (event) => {
        if (event.key === 'loggedInStudentData') {
            updateUserProfile();
        }
    });
});

function updateUserProfile() {
    // Get logged-in student data from localStorage
    const studentDataString = localStorage.getItem('loggedInStudentData');
    if (!studentDataString) {
        console.log('No logged-in user data found');
        return;
    }
    
    try {
        const loggedInStudent = JSON.parse(studentDataString);
        if (!loggedInStudent) {
            console.log('Invalid user data format');
            return;
        }
        
        // Update profile image
        updateProfileImage(loggedInStudent);
        
        // Update profile info
        updateProfileInfo(loggedInStudent);
        
        // Update skills
        updateSkills(loggedInStudent);
        
    } catch (error) {
        console.error('Error updating user profile:', error);
    }
}

function updateProfileImage(loggedInStudent) {
    // Find the profile image element - try both by ID and by class
    const profileImage = document.getElementById('profile-pic') || document.querySelector('.profile-image');
    if (!profileImage) {
        console.log('Profile image element not found in the DOM');
        return;
    }
    
    // Update the image source if available
    if (loggedInStudent.profilePic) {
        profileImage.src = loggedInStudent.profilePic;
        profileImage.alt = loggedInStudent.fullName || 'Profile Picture';
        console.log('Profile image updated to:', loggedInStudent.profilePic);
    } else {
        console.log('No profile picture found in user data');
        // Set a default image if no profile pic is available
        profileImage.src = 'images/default-profile.jpg';
        profileImage.alt = loggedInStudent.fullName || 'Profile Picture';
    }
}

function updateProfileInfo(loggedInStudent) {
    // Update profile name
    const profileName = document.getElementById('profile-name');
    if (profileName && loggedInStudent.fullName) {
        profileName.textContent = loggedInStudent.fullName;
    }
    
    // Update profile program/branch
    const profileProgram = document.getElementById('profile-program');
    if (profileProgram && loggedInStudent.branch) {
        profileProgram.textContent = `${loggedInStudent.branch} & Engineering`;
    }
    
    // Update CGPA
    const profileCGPA = document.getElementById('profile-cgpa');
    if (profileCGPA && loggedInStudent.cgpa) {
        profileCGPA.textContent = loggedInStudent.cgpa.toFixed(2);
    }
}

function updateSkills(loggedInStudent) {
    // Update skills count
    const profileSkills = document.getElementById('profile-skills');
    if (profileSkills) {
        // Use keySkills if available, otherwise fallback
        const skills = loggedInStudent.keySkills || loggedInStudent.skills || [];
        profileSkills.textContent = skills.length;
    }
    
    // Update top skills
    const topSkillsContainer = document.getElementById('top-skills-container');
    if (topSkillsContainer) {
        // Clear existing skills
        topSkillsContainer.innerHTML = '';
        
        // Get skills from the user data (handle different property names)
        const skills = loggedInStudent.keySkills || loggedInStudent.skills || [];
        
        if (skills.length > 0) {
            // Add each skill as a tag
            skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                topSkillsContainer.appendChild(skillTag);
            });
            console.log('Skills updated:', skills);
        } else {
            console.log('No skills found for user');
            // Add a default message if no skills are found
            const noSkillsTag = document.createElement('span');
            noSkillsTag.className = 'skill-tag';
            noSkillsTag.textContent = 'No skills listed';
            topSkillsContainer.appendChild(noSkillsTag);
        }
    }
}
