/**
 * Technical Skills Analysis
 * Provides an interactive skill gap analysis and personalized learning path
 */

class TechSkillsAnalysis {
    constructor() {
        this.skillsData = {
            frontend: ['JavaScript', 'React', 'Angular', 'Vue', 'CSS/SASS', 'HTML5', 'TypeScript', 'Redux', 'WebPack'],
            backend: ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Spring Boot'],
            database: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra', 'DynamoDB', 'Firebase'],
            devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
            mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Android SDK', 'iOS Development'],
            ml: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision', 'Data Science', 'Statistics']
        };
        
        this.jobRoles = [
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'DevOps Engineer',
            'Data Scientist',
            'Mobile Developer',
            'UI/UX Developer',
            'Cloud Architect'
        ];
        
        this.skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        this.userSkills = {};
        this.targetRole = '';
        this.gapAnalysis = {};
        this.learningPath = [];
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Find the button and add click event listener directly
        const techAnalysisBtn = document.getElementById('tech-analysis-btn');
        if (techAnalysisBtn) {
            techAnalysisBtn.addEventListener('click', () => this.showAnalysisModal());
        } else {
            // If button not found yet, try again after a short delay
            setTimeout(() => {
                const delayedBtn = document.getElementById('tech-analysis-btn');
                if (delayedBtn) {
                    delayedBtn.addEventListener('click', () => this.showAnalysisModal());
                }
            }, 500);
        }
    }
    
    showAnalysisModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('skills-analysis-modal');
        if (!modal) {
            modal = this.createAnalysisModal();
            // Note: We're now appending the modal in createAnalysisModal
        } else {
            // Show the modal if it already exists
            modal.style.display = 'block';
        }
        
        // Add animation class
        setTimeout(() => {
            const modalContent = document.querySelector('#skills-analysis-modal .modal-content');
            if (modalContent) {
                modalContent.classList.add('animate__animated', 'animate__fadeInUp');
            }
        }, 100);
    }
    
    createAnalysisModal() {
        const modal = document.createElement('div');
        modal.id = 'skills-analysis-modal';
        modal.className = 'juno-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-chart-bar"></i> Technical Skills Analysis</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div id="analysis-steps">
                        <div class="step" id="step-1">
                            <h3>Step 1: Select Your Target Role</h3>
                            <div class="role-selection">
                                ${this.jobRoles.map(role => `
                                    <div class="role-card" data-role="${role}">
                                        <i class="fas ${this.getRoleIcon(role)}"></i>
                                        <h4>${role}</h4>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="step-navigation">
                                <button class="next-step-btn">Next <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                        
                        <div class="step" id="step-2" style="display: none;">
                            <h3>Step 2: Rate Your Current Skills</h3>
                            <div id="skills-rating-container"></div>
                            <div class="step-navigation">
                                <button class="prev-step-btn"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="next-step-btn">Next <i class="fas fa-arrow-right"></i></button>
                            </div>
                        </div>
                        
                        <div class="step" id="step-3" style="display: none;">
                            <h3>Step 3: Your Skills Gap Analysis</h3>
                            <div id="gap-analysis-container">
                                <div class="loading-spinner">
                                    <i class="fas fa-spinner fa-spin"></i> Analyzing your skills...
                                </div>
                            </div>
                            <div class="step-navigation">
                                <button class="prev-step-btn"><i class="fas fa-arrow-left"></i> Back</button>
                                <button class="view-path-btn">View Learning Path <i class="fas fa-graduation-cap"></i></button>
                            </div>
                        </div>
                        
                        <div class="step" id="step-4" style="display: none;">
                            <h3>Step 4: Your Personalized Learning Path</h3>
                            <div id="learning-path-container"></div>
                            <div class="step-navigation">
                                <button class="prev-step-btn"><i class="fas fa-arrow-left"></i> Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners after the modal is in the DOM
        this.addModalEventListeners(modal);
        
        return modal;
    }
    
    addModalEventListeners(modal) {
        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Step navigation buttons
        const nextButtons = modal.querySelectorAll('.next-step-btn');
        if (nextButtons) {
            nextButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.nextStep(e));
            });
        }
        
        const prevButtons = modal.querySelectorAll('.prev-step-btn');
        if (prevButtons) {
            prevButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.prevStep(e));
            });
        }
        
        // Role selection cards
        const roleCards = modal.querySelectorAll('.role-card');
        if (roleCards) {
            roleCards.forEach(card => {
                card.addEventListener('click', (e) => this.selectRole(e));
            });
        }
        
        // View path button
        const viewPathBtn = modal.querySelector('.view-path-btn');
        if (viewPathBtn) {
            viewPathBtn.addEventListener('click', () => this.goToStep(4));
        }
        
        // No download button anymore
    }
    
    getRoleIcon(role) {
        const icons = {
            'Frontend Developer': 'fa-laptop-code',
            'Backend Developer': 'fa-server',
            'Full Stack Developer': 'fa-layer-group',
            'DevOps Engineer': 'fa-cogs',
            'Data Scientist': 'fa-brain',
            'Mobile Developer': 'fa-mobile-alt',
            'UI/UX Developer': 'fa-palette',
            'Cloud Architect': 'fa-cloud'
        };
        
        return icons[role] || 'fa-code';
    }
    
    selectRole(e) {
        const roleCards = document.querySelectorAll('.role-card');
        roleCards.forEach(card => card.classList.remove('selected'));
        
        const selectedCard = e.currentTarget;
        selectedCard.classList.add('selected');
        
        this.targetRole = selectedCard.dataset.role;
        
        // Enable the next button
        const nextBtn = document.querySelector('#step-1 .next-step-btn');
        if (nextBtn) {
            nextBtn.classList.add('active');
        }
        
        this.prepareSkillsRating();
    }
    
    prepareSkillsRating() {
        const container = document.getElementById('skills-rating-container');
        if (!container) {
            console.error('Skills rating container not found');
            return;
        }
        
        container.innerHTML = '';
        
        // Determine which skill categories to show based on the selected role
        const relevantCategories = this.getRelevantCategories(this.targetRole);
        
        // Add a title showing the selected role
        const roleTitle = document.createElement('div');
        roleTitle.className = 'selected-role-title';
        roleTitle.innerHTML = `<h4>Skills for ${this.targetRole}</h4>`;
        container.appendChild(roleTitle);
        
        relevantCategories.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'skill-category';
            
            categorySection.innerHTML = `
                <h4>${this.formatCategoryName(category)}</h4>
                <div class="skills-list">
                    ${this.skillsData[category].map(skill => `
                        <div class="skill-item">
                            <span class="skill-name">${skill}</span>
                            <div class="skill-rating" data-skill="${skill}">
                                ${this.skillLevels.map((level, index) => `
                                    <button class="rating-btn" data-level="${index}">${level}</button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(categorySection);
        });
        
        // Add event listeners to rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.rateSkill(e));
        });
        
        // Add a progress indicator
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'rating-progress';
        progressIndicator.innerHTML = `
            <div class="progress-bar">
                <div class="progress-text">0 of ${this.getTotalSkillsCount(relevantCategories)} skills rated</div>
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        `;
        container.appendChild(progressIndicator);
    }
    
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1) + ' Skills';
    }
    
    getRelevantCategories(role) {
        const categoryMap = {
            'Frontend Developer': ['frontend'],
            'Backend Developer': ['backend', 'database'],
            'Full Stack Developer': ['frontend', 'backend', 'database'],
            'DevOps Engineer': ['devops', 'backend'],
            'Data Scientist': ['ml', 'database'],
            'Mobile Developer': ['mobile', 'frontend'],
            'UI/UX Developer': ['frontend'],
            'Cloud Architect': ['devops', 'backend']
        };
        
        return categoryMap[role] || ['frontend', 'backend'];
    }
    
    rateSkill(e) {
        const btn = e.currentTarget;
        const skillItem = btn.closest('.skill-item');
        const skillName = skillItem.querySelector('.skill-name').textContent;
        const level = parseInt(btn.dataset.level);
        
        // Remove selected class from all buttons in this skill
        skillItem.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
        
        // Add selected class to clicked button
        btn.classList.add('selected');
        
        // Add a visual feedback animation
        btn.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            btn.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
        
        // Store the user's skill level
        this.userSkills[skillName] = level;
        
        // Update the progress indicator
        this.updateRatingProgress();
        
        // Enable the next button if at least one skill is rated
        if (Object.keys(this.userSkills).length > 0) {
            const nextBtn = document.querySelector('#step-2 .next-step-btn');
            if (nextBtn) {
                nextBtn.classList.add('active');
            }
        }
    }
    
    nextStep(e) {
        const currentStep = e.target.closest('.step');
        const currentStepNum = parseInt(currentStep.id.split('-')[1]);
        
        if (currentStepNum === 1 && !this.targetRole) {
            alert('Please select a target role before proceeding.');
            return;
        }
        
        if (currentStepNum === 2 && Object.keys(this.userSkills).length === 0) {
            alert('Please rate at least one skill before proceeding.');
            return;
        }
        
        // Animate the transition
        currentStep.classList.add('animate__animated', 'animate__fadeOutLeft');
        
        setTimeout(() => {
            currentStep.classList.remove('animate__animated', 'animate__fadeOutLeft');
            this.goToStep(currentStepNum + 1);
            
            // Animate the next step
            const nextStep = document.getElementById(`step-${currentStepNum + 1}`);
            if (nextStep) {
                nextStep.classList.add('animate__animated', 'animate__fadeInRight');
                setTimeout(() => {
                    nextStep.classList.remove('animate__animated', 'animate__fadeInRight');
                }, 500);
            }
            
            if (currentStepNum === 2) {
                this.performAnalysis();
            }
        }, 300);
    }
    
    prevStep(e) {
        const currentStep = e.target.closest('.step');
        const currentStepNum = parseInt(currentStep.id.split('-')[1]);
        
        // Animate the transition
        currentStep.classList.add('animate__animated', 'animate__fadeOutRight');
        
        setTimeout(() => {
            currentStep.classList.remove('animate__animated', 'animate__fadeOutRight');
            this.goToStep(currentStepNum - 1);
            
            // Animate the previous step
            const prevStep = document.getElementById(`step-${currentStepNum - 1}`);
            if (prevStep) {
                prevStep.classList.add('animate__animated', 'animate__fadeInLeft');
                setTimeout(() => {
                    prevStep.classList.remove('animate__animated', 'animate__fadeInLeft');
                }, 500);
            }
        }, 300);
    }
    
    goToStep(stepNum) {
        document.querySelectorAll('.step').forEach(step => {
            step.style.display = 'none';
        });
        
        const targetStep = document.getElementById(`step-${stepNum}`);
        if (targetStep) {
            targetStep.style.display = 'block';
        }
    }
    
    performAnalysis() {
        // Show loading spinner
        const container = document.getElementById('gap-analysis-container');
        
        // Simulate analysis with a delay
        setTimeout(() => {
            this.analyzeSkillGaps();
            this.generateLearningPath();
            this.displayAnalysisResults();
        }, 1500);
    }
    
    analyzeSkillGaps() {
        this.gapAnalysis = {
            strengths: [],
            gaps: [],
            recommendations: []
        };
        
        // Get required skills for the selected role
        const relevantCategories = this.getRelevantCategories(this.targetRole);
        const requiredSkills = [];
        
        relevantCategories.forEach(category => {
            this.skillsData[category].forEach(skill => {
                requiredSkills.push(skill);
            });
        });
        
        // Analyze user skills compared to required skills
        requiredSkills.forEach(skill => {
            const userLevel = this.userSkills[skill] !== undefined ? this.userSkills[skill] : 0;
            
            if (userLevel >= 2) { // Advanced or Expert
                this.gapAnalysis.strengths.push({
                    skill: skill,
                    level: userLevel
                });
            } else {
                this.gapAnalysis.gaps.push({
                    skill: skill,
                    currentLevel: userLevel,
                    targetLevel: Math.min(userLevel + 2, 3) // Target 2 levels up, max at Expert
                });
            }
        });
        
        // Sort gaps by priority (lower current level = higher priority)
        this.gapAnalysis.gaps.sort((a, b) => a.currentLevel - b.currentLevel);
        
        // Generate recommendations
        this.generateRecommendations();
    }
    
    generateRecommendations() {
        // Take top 3 skill gaps
        const topGaps = this.gapAnalysis.gaps.slice(0, 3);
        
        topGaps.forEach(gap => {
            this.gapAnalysis.recommendations.push({
                skill: gap.skill,
                currentLevel: gap.currentLevel,
                targetLevel: gap.targetLevel,
                resources: this.getResourcesForSkill(gap.skill, gap.currentLevel)
            });
        });
    }
    
    getResourcesForSkill(skill, level) {
        // Mock resources based on skill and level
        const levelNames = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        const currentLevelName = levelNames[level];
        const nextLevelName = levelNames[level + 1] || 'Expert';
        
        return [
            `${skill} ${currentLevelName} to ${nextLevelName} Course`,
            `Practical ${skill} Projects for ${nextLevelName}s`,
            `${skill} Interview Questions and Answers`
        ];
    }
    
    generateLearningPath() {
        this.learningPath = [];
        
        // Create a 12-week learning path
        const topGaps = this.gapAnalysis.gaps.slice(0, 5);
        
        // Distribute weeks based on priority
        let remainingWeeks = 12;
        const weeksPerSkill = Math.floor(remainingWeeks / topGaps.length);
        
        topGaps.forEach((gap, index) => {
            const weeks = index === topGaps.length - 1 ? remainingWeeks : weeksPerSkill;
            remainingWeeks -= weeks;
            
            this.learningPath.push({
                skill: gap.skill,
                weeks: weeks,
                milestones: this.generateMilestones(gap.skill, weeks),
                resources: this.getResourcesForSkill(gap.skill, gap.currentLevel)
            });
        });
    }
    
    generateMilestones(skill, weeks) {
        const milestones = [];
        
        if (weeks >= 1) milestones.push(`Week 1: ${skill} fundamentals`);
        if (weeks >= 2) milestones.push(`Week 2: Build your first ${skill} project`);
        if (weeks >= 3) milestones.push(`Week ${Math.min(weeks, 3)}: Practice with real-world examples`);
        if (weeks >= 4) milestones.push(`Week ${Math.min(weeks, 4)}: Advanced ${skill} techniques`);
        if (weeks >= 5) milestones.push(`Week ${weeks}: Complete capstone project`);
        
        return milestones;
    }
    
    displayAnalysisResults() {
        // Get the container for the analysis results
        const container = document.getElementById('gap-analysis-container');
        if (!container) {
            console.error('Gap analysis container not found');
            return;
        }
        
        // Create the analysis display with safety checks
        let strengthsHtml = '';
        if (this.gapAnalysis.strengths && this.gapAnalysis.strengths.length > 0) {
            strengthsHtml = this.gapAnalysis.strengths.map(item => `
                <li>
                    <span class="skill-name">${item.skill}</span>
                    <span class="skill-level">${this.skillLevels[item.level]}</span>
                </li>
            `).join('');
        } else {
            strengthsHtml = '<li><span class="skill-name">No strengths identified yet</span></li>';
        }
        
        let gapsHtml = '';
        if (this.gapAnalysis.gaps && this.gapAnalysis.gaps.length > 0) {
            gapsHtml = this.gapAnalysis.gaps.slice(0, 5).map(gap => `
                <div class="skill-gap-item">
                    <div class="skill-info">
                        <span class="skill-name">${gap.skill}</span>
                        <div class="skill-progress">
                            <div class="current-level" style="width: ${(gap.currentLevel / 3) * 100}%"></div>
                            <div class="target-level" style="width: ${((gap.targetLevel - gap.currentLevel) / 3) * 100}%"></div>
                        </div>
                        <div class="level-labels">
                            <span>${this.skillLevels[gap.currentLevel]}</span>
                            <span class="target">${this.skillLevels[gap.targetLevel]}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            gapsHtml = '<div class="skill-gap-item">No skill gaps identified yet</div>';
        }
        
        let recommendationsHtml = '';
        if (this.gapAnalysis.recommendations && this.gapAnalysis.recommendations.length > 0) {
            recommendationsHtml = this.gapAnalysis.recommendations.map(rec => `
                <div class="recommendation-item">
                    <h5>${rec.skill}</h5>
                    <p>Focus on advancing from ${this.skillLevels[rec.currentLevel]} to ${this.skillLevels[rec.targetLevel]}</p>
                    <div class="resource-links">
                        ${rec.resources.map(resource => `
                            <a href="#" class="resource-link">
                                <i class="fas fa-external-link-alt"></i> ${resource}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } else {
            recommendationsHtml = '<div class="recommendation-item"><h5>No recommendations yet</h5></div>';
        }
        
        // Update the container with the analysis results
        container.innerHTML = `
            <div class="analysis-results">
                <div class="analysis-section">
                    <h4>Your Strengths</h4>
                    <ul class="strengths-list">
                        ${strengthsHtml}
                    </ul>
                </div>
                
                <div class="analysis-section">
                    <h4>Skill Gaps for ${this.targetRole}</h4>
                    <div class="skill-gaps-visualization">
                        ${gapsHtml}
                    </div>
                </div>
                
                <div class="analysis-section">
                    <h4>Top Recommendations</h4>
                    <div class="recommendations-list">
                        ${recommendationsHtml}
                    </div>
                </div>
            </div>
        `;
        
        // Create learning path display with safety checks
        const pathContainer = document.getElementById('learning-path-container');
        if (!pathContainer) {
            console.error('Learning path container not found');
            return;
        }
        
        let timelineHtml = '';
        let pathDetailsHtml = '';
        
        if (this.learningPath && this.learningPath.length > 0) {
            timelineHtml = this.learningPath.map((item, index) => `
                <div class="timeline-section" style="width: ${(item.weeks / 12) * 100}%">
                    <div class="timeline-bar">
                        <span class="skill-name">${item.skill}</span>
                        <span class="weeks">${item.weeks} week${item.weeks > 1 ? 's' : ''}</span>
                    </div>
                </div>
            `).join('');
            
            pathDetailsHtml = this.learningPath.map((item, index) => `
                <div class="path-item">
                    <div class="path-header">
                        <h5><span class="path-number">${index + 1}</span> ${item.skill}</h5>
                        <span class="duration">${item.weeks} week${item.weeks > 1 ? 's' : ''}</span>
                    </div>
                    <div class="path-milestones">
                        <ul>
                            ${item.milestones.map(milestone => `
                                <li>${milestone}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="path-resources">
                        <h6>Recommended Resources:</h6>
                        <ul>
                            ${item.resources.map(resource => `
                                <li><a href="#">${resource}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        } else {
            timelineHtml = '<div class="timeline-section" style="width: 100%"><div class="timeline-bar">No learning path generated yet</div></div>';
            pathDetailsHtml = '<div class="path-item"><div class="path-header"><h5>No learning path available</h5></div></div>';
        }
        
        // Update the path container
        pathContainer.innerHTML = `
            <div class="learning-path">
                <div class="path-overview">
                    <h4>12-Week Learning Plan for ${this.targetRole || 'Your Career'}</h4>
                    <div class="path-timeline">
                        ${timelineHtml}
                    </div>
                </div>
                
                <div class="path-details">
                    ${pathDetailsHtml}
                </div>
            </div>
        `;
        
        // Add event listeners to the resource links
        document.querySelectorAll('.resource-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert('This resource will be available in the full version!');
            });
        });
    }
    
    getTotalSkillsCount(categories) {
        let count = 0;
        categories.forEach(category => {
            count += this.skillsData[category].length;
        });
        return count;
    }
    
    updateRatingProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (!progressFill || !progressText) return;
        
        const relevantCategories = this.getRelevantCategories(this.targetRole);
        const totalSkills = this.getTotalSkillsCount(relevantCategories);
        const ratedSkills = Object.keys(this.userSkills).length;
        
        const percentage = Math.min(100, Math.round((ratedSkills / totalSkills) * 100));
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${ratedSkills} of ${totalSkills} skills rated`;
    }
}

// Initialize the Technical Skills Analysis
document.addEventListener('DOMContentLoaded', () => {
    window.techSkillsAnalysis = new TechSkillsAnalysis();
});
