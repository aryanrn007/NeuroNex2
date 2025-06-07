document.addEventListener('DOMContentLoaded', () => {
    const categoryTabsContainer = document.getElementById('brainbox-category-tabs');
    const currentSectionTitle = document.getElementById('current-section-title');
    const fileListingArea = document.getElementById('file-listing-area');
    const searchBar = document.getElementById('search-bar');
    const uploadBtnSim = document.getElementById('upload-btn-sim');

    const uploadModal = document.getElementById('upload-modal');
    const closeUploadModalBtn = document.getElementById('close-upload-modal');
    const simUploadForm = document.getElementById('sim-upload-form');
    const simFileNameInput = document.getElementById('sim-file-name');
    const simFileTagsInput = document.getElementById('sim-file-tags');
    const simFileCategorySelect = document.getElementById('sim-file-category');

    const pdfPreviewModal = document.getElementById('pdf-preview-modal');
    const closePdfModalBtn = document.getElementById('close-pdf-modal');
    const pdfPreviewTitle = document.getElementById('pdf-preview-title');
    const pdfPreviewIframe = document.getElementById('pdf-preview-iframe');
    
    const loggedInUserNameDisplayBB = document.getElementById('loggedInUserNameBB');
    const logoutButtonBB = document.getElementById('logout-buttonBB');
    const themeToggleBtnBB = document.getElementById('theme-toggleBB');

    // Simulated Data - In a real app, this would come from a backend/database
    const brainBoxData = {
        pyqs: {
            name: "Previous Year Question Papers",
            icon: "fas fa-book-reader",
            files: [
                { id: "pyq1", name: "CSE_SEM3_DSA_2022.pdf", type: "pdf", tags: ["CSE", "Sem 3", "DSA"], path: "", description: "Data Structures Algo - 2022 Mid-Sem" },
                { id: "pyq2", name: "MECH_SEM4_Thermo_2021.pdf", type: "pdf", tags: ["MECH", "Sem 4", "Thermo"], path: "sample_materials/sample.pdf", description: "Thermodynamics - 2021 End-Sem" }
            ]
        },
        classNotes: {
            name: "Class Notes / Lecture Notes",
            icon: "fas fa-chalkboard-teacher",
            files: [
                { id: "cn1", name: "Calculus_Lecture1_ProfSharma.pdf", type: "pdf", tags: ["Sem 1", "Maths", "Calculus"], path: "sample_materials/sample.pdf", description: "Prof. Sharma's Calculus lecture notes." },
                { id: "cn2", name: "OS_Unit3_Slides.pptx", type: "pptx", tags: ["CSE", "Sem 4", "OS", "Slides"], path: "#", description: "Operating Systems Unit 3 Presentation Slides." }
            ]
        },
        handwrittenNotes: {
            name: "Handwritten Notes",
            icon: "fas fa-pencil-alt",
            files: [
                { id: "hw1", name: "Maths_Sem2_Integration_HW.pdf", type: "pdf", tags: ["Maths", "Sem 2", "Integration"], path: "sample_materials/sample.pdf", description: "Handwritten notes on Integration for Sem 2." },
                { id: "hw2", name: "Physics_Optics_HW.jpg", type: "image/jpeg", tags: ["Physics", "Optics"], path: "sample_materials/sample.jpg", description: "Optics diagrams and explanations." }
            ]
        },
        syllabus: {
            name: "Syllabus (Semester-wise)",
            icon: "fas fa-list-alt",
            files: [
                { id: "sy1", name: "CSE_Sem3_Syllabus.pdf", type: "pdf", tags: ["CSE", "Sem 3", "Syllabus"], path: "sample_materials/sample.pdf", description: "Official syllabus for CSE Semester 3." },
                { id: "sy2", name: "Mechanical_Sem5_Syllabus.pdf", type: "pdf", tags: ["Mechanical", "Sem 5", "Syllabus"], path: "sample_materials/sample.pdf", description: "Mechanical Engineering Semester 5 syllabus." }
            ]
        },
        subjectPDFs: {
            name: "Subject-wise PDFs",
            icon: "fas fa-file-pdf",
            files: [
                { id: "spdf1", name: "DBMS_Complete_Notes.pdf", type: "pdf", tags: ["DBMS", "CSE", "Notes"], path: "sample_materials/sample.pdf", description: "Comprehensive DBMS notes." },
                { id: "spdf2", name: "Thermodynamics_Reference.pdf", type: "pdf", tags: ["Thermodynamics", "Mechanical"], path: "sample_materials/sample.pdf", description: "Reference PDF for Thermodynamics." }
            ]
        },
        cheatSheets: {
            name: "Cheat Sheets / Quick Revision",
            icon: "fas fa-bolt",
            files: [
                { id: "cs1", name: "Python_Cheat_Sheet.pdf", type: "pdf", tags: ["Python", "Cheat Sheet"], path: "sample_materials/sample.pdf", description: "Quick revision for Python syntax and tips." },
                { id: "cs2", name: "Maths_Formulae_Quick_Ref.pdf", type: "pdf", tags: ["Maths", "Formulas", "Quick Revision"], path: "sample_materials/sample.pdf", description: "All important maths formulas at a glance." }
            ]
        },
        labManuals: {
            name: "Lab Manuals / Practicals",
            icon: "fas fa-flask",
            files: [
                { id: "lab1", name: "Physics_Lab_Manual_Sem2.pdf", type: "pdf", tags: ["Physics", "Lab Manual", "Sem 2"], path: "sample_materials/sample.pdf", description: "Lab manual for Physics Semester 2." },
                { id: "lab2", name: "C_Programming_Lab_Experiments.pdf", type: "pdf", tags: ["C Programming", "Lab", "Experiments"], path: "sample_materials/sample.pdf", description: "C Programming practicals and experiments." }
            ]
        },
        onlineCourses: { name: "NPTEL / Other Online Course Links", icon: "fas fa-globe", files: [
            { id: "oc1", name: "NPTEL Intro to Programming", type: "link", tags: ["NPTEL", "Programming", "Python"], path: "https://nptel.ac.in/courses/noc20_cs70/preview", description: "Great foundational course on Python programming."}
        ] },
        projectReports: {
            name: "Project Reports & Mini Projects",
            icon: "fas fa-folder-open",
            files: [
                { id: "pr1", name: "IoT_Home_Automation_Report.pdf", type: "pdf", tags: ["IoT", "Mini Project", "Report"], path: "sample_materials/sample.pdf", description: "Report for IoT-based Home Automation project." },
                { id: "pr2", name: "Ecommerce_Website_Mini_Project.zip", type: "zip", tags: ["Web Development", "Mini Project"], path: "sample_materials/sample.zip", description: "Source code and report for Ecommerce website project." }
            ]
        },
        interviewPrep: {
            name: "Interview Prep / Placement Notes",
            icon: "fas fa-bullseye",
            files: [
                { id: "ip1", name: "Top_100_Coding_Questions.pdf", type: "pdf", tags: ["Coding", "Interview Prep"], path: "sample_materials/sample.pdf", description: "Most asked coding questions for placements." },
                { id: "ip2", name: "HR_Interview_Tips.docx", type: "docx", tags: ["HR", "Interview", "Tips"], path: "#", description: "Tips and tricks for HR interviews." }
            ]
        },
        ebooks: {
            name: "Extra Reference Material / E-books",
            icon: "fas fa-book",
            files: [
                { id: "eb1", name: "Operating_Systems_Galvin.pdf", type: "pdf", tags: ["OS", "Ebook", "Reference"], path: "sample_materials/sample.pdf", description: "Galvin's Operating Systems ebook." },
                { id: "eb2", name: "Digital_Logic_Design_Morris_Mano.pdf", type: "pdf", tags: ["Digital Logic", "Ebook"], path: "sample_materials/sample.pdf", description: "Digital Logic Design by Morris Mano." }
            ]
        },
    };

    let currentActiveCategory = null;
    let currentSearchTerm = "";

    function setupPageForUser() {
        const studentDataString = localStorage.getItem('loggedInStudentData');
        if (!studentDataString) {
            window.location.href = 'login.html'; 
            return false;
        }
        const loggedInStudent = JSON.parse(studentDataString);
        if (loggedInUserNameDisplayBB) {
            loggedInUserNameDisplayBB.textContent = `Hi, ${loggedInStudent.fullName.split(' ')[0]}!`;
        }
        return true;
    }

    if (!setupPageForUser()) return;

    const currentThemeBB = localStorage.getItem('theme');
    if (currentThemeBB === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtnBB) themeToggleBtnBB.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        if (themeToggleBtnBB) themeToggleBtnBB.innerHTML = '<i class="fas fa-sun"></i>';
    }
    if (themeToggleBtnBB) {
        themeToggleBtnBB.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            themeToggleBtnBB.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', theme);
        });
    }
    if (logoutButtonBB) {
        logoutButtonBB.addEventListener('click', () => {
            localStorage.removeItem('loggedInStudentData');
            window.location.href = 'login.html';
        });
    }

    function renderCategoryTabs() {
        categoryTabsContainer.innerHTML = '';
        simFileCategorySelect.innerHTML = ''; // Clear for upload modal too
        Object.keys(brainBoxData).forEach(key => {
            const category = brainBoxData[key];
            const li = document.createElement('li');
            const button = document.createElement('button');
            
            button.innerHTML = `
                <i class="${category.icon || 'fas fa-folder'}"></i> 
                <span>${category.name}</span>
            `;
            
            button.dataset.categoryKey = key;
            if (key === currentActiveCategory) button.classList.add('active');
            button.addEventListener('click', () => selectCategory(key));
            li.appendChild(button);
            categoryTabsContainer.appendChild(li);

            const option = document.createElement('option');
            option.value = key; option.textContent = category.name;
            simFileCategorySelect.appendChild(option);
        });
    }

    function selectCategory(categoryKey) {
        currentActiveCategory = categoryKey;
        const category = brainBoxData[categoryKey];
        currentSectionTitle.textContent = category.name;
        if(simFileCategorySelect) simFileCategorySelect.value = categoryKey;
        Array.from(categoryTabsContainer.querySelectorAll('button')).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.categoryKey === categoryKey);
        });
        renderFiles(category.files);
    }

    function getFileTypeIcon(type) {
        type = type ? type.toLowerCase() : 'file';
        if (type === 'pdf') return 'fas fa-file-pdf red-icon';
        if (type === 'docx' || type === 'doc') return 'fas fa-file-word blue-icon';
        if (type === 'pptx' || type === 'ppt') return 'fas fa-file-powerpoint orange-icon';
        if (type === 'xlsx' || type === 'xls') return 'fas fa-file-excel green-icon';
        if (type === 'zip' || type === 'rar') return 'fas fa-file-archive gold-icon';
        if (type === 'txt') return 'fas fa-file-alt gray-icon';
        if (type === 'link') return 'fas fa-link purple-icon'; // Icon for links
        if (type.startsWith('image/')) return 'fas fa-file-image purple-icon';
        return 'fas fa-file gray-icon';
   }

    function renderFiles(files) {
        fileListingArea.innerHTML = '';
        
        // Add the 3D robot back when clearing content
        const splineContainer = document.createElement('div');
        splineContainer.className = 'spline-container';
        
        const splineWrapper = document.createElement('div');
        splineWrapper.className = 'spline-wrapper';
        
        const splineViewer = document.createElement('spline-viewer');
        splineViewer.setAttribute('url', 'https://prod.spline.design/3ggDBTY6SHW2T66A/scene.splinecode');
        splineViewer.className = 'fullscreen-robot';
        
        const watermarkCover = document.createElement('div');
        watermarkCover.className = 'watermark-cover';
        
        // Add hider for blue element
        const blueElementHider = document.createElement('div');
        blueElementHider.className = 'blue-element-hider';
        
        splineWrapper.appendChild(splineViewer);
        splineContainer.appendChild(splineWrapper);
        splineContainer.appendChild(watermarkCover);
        splineContainer.appendChild(blueElementHider);
        fileListingArea.appendChild(splineContainer);
        
        if (!files || files.length === 0) {
            return;
        }
        
        // If files exist, remove the 3D robot to show files instead
        fileListingArea.innerHTML = '';
        
        const filteredFiles = files.filter(file => 
            file.name.toLowerCase().includes(currentSearchTerm) ||
            (file.tags && file.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm))) ||
            (file.description && file.description.toLowerCase().includes(currentSearchTerm))
        );
        if (filteredFiles.length === 0) {
            // If no matching files, show the 3D robot again
            const splineContainer = document.createElement('div');
            splineContainer.className = 'spline-container';
            
            const splineWrapper = document.createElement('div');
            splineWrapper.className = 'spline-wrapper';
            
            const splineViewer = document.createElement('spline-viewer');
            splineViewer.setAttribute('url', 'https://prod.spline.design/3ggDBTY6SHW2T66A/scene.splinecode');
            splineViewer.className = 'fullscreen-robot';
            
            const watermarkCover = document.createElement('div');
            watermarkCover.className = 'watermark-cover';
            
            // Add hider for blue element
            const blueElementHider = document.createElement('div');
            blueElementHider.className = 'blue-element-hider';
            
            splineWrapper.appendChild(splineViewer);
            splineContainer.appendChild(splineWrapper);
            splineContainer.appendChild(watermarkCover);
            splineContainer.appendChild(blueElementHider);
            fileListingArea.appendChild(splineContainer);
            return;
        }
        filteredFiles.forEach(file => {
            const card = document.createElement('div'); card.className = 'file-card';
            const isLink = file.type === 'link';
            const downloadOrVisitText = isLink ? "Visit Link" : "Download";
            const downloadOrVisitIcon = isLink ? "fas fa-external-link-alt" : "fas fa-download";

            card.innerHTML = `
                <h3><i class="${getFileTypeIcon(file.type)}"></i> ${file.name}</h3>
                ${file.description ? `<p>${file.description}</p>` : ''}
                ${file.tags && file.tags.length > 0 ? `<div class="file-tags">${file.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                <div class="file-actions">
                    ${file.type === 'pdf' && !isLink ? `<button class="action-btn juno-button preview-btn" data-path="${file.path}" data-name="${file.name}"><i class="fas fa-eye"></i> Preview</button>` : ''}
                    <a href="${file.path || '#'}" ${isLink ? 'target="_blank" rel="noopener noreferrer"' : `download="${file.name}"`} class="action-btn juno-button">
                        <i class="${downloadOrVisitIcon}"></i> ${downloadOrVisitText}
                    </a>
                </div>`;
            fileListingArea.appendChild(card);
            const previewBtn = card.querySelector('.preview-btn');
            if (previewBtn) {
                previewBtn.addEventListener('click', (e) => {
                    const path = e.currentTarget.dataset.path;
                    const name = e.currentTarget.dataset.name;
                    showPdfPreviewModal(path, name);
                });
            }
        });
    }

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            if (currentActiveCategory) renderFiles(brainBoxData[currentActiveCategory].files);
        });
    }

    if (uploadBtnSim) {
        uploadBtnSim.addEventListener('click', () => {
            if (currentActiveCategory && simFileCategorySelect) {
                simFileCategorySelect.value = currentActiveCategory;
                simFileCategorySelect.disabled = true;
            } else if (simFileCategorySelect) {
                 simFileCategorySelect.disabled = false;
                 if(simFileCategorySelect.options.length > 0) simFileCategorySelect.value = simFileCategorySelect.options[0].value;
            }
            if(uploadModal) uploadModal.classList.add('show');
        });
    }
    if (closeUploadModalBtn) {
        closeUploadModalBtn.addEventListener('click', () => { if(uploadModal) uploadModal.classList.remove('show'); });
    }
    if (simUploadForm) {
        simUploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fileName = simFileNameInput.value;
            const tags = simFileTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const categoryKey = simFileCategorySelect.value;
            if (fileName && categoryKey && brainBoxData[categoryKey]) {
                const newFile = {
                    id: `sim_${Date.now()}`, name: fileName,
                    type: fileName.split('.').pop() || 'file',
                    tags: tags, path: "#", description: `Simulated: ${fileName}`
                };
                brainBoxData[categoryKey].files.unshift(newFile);
                if (currentActiveCategory === categoryKey) renderFiles(brainBoxData[categoryKey].files);
                alert(`${fileName} entry added to ${brainBoxData[categoryKey].name} (Simulated).`);
                simUploadForm.reset(); if(uploadModal) uploadModal.classList.remove('show');
            } else alert("File name and category required.");
        });
    }

    function showPdfPreviewModal(filePath, fileName) {
        if (!pdfPreviewModal || !pdfPreviewIframe || !pdfPreviewTitle) return;
        pdfPreviewTitle.textContent = fileName;
        if(filePath === "#" || !filePath.toLowerCase().endsWith('.pdf')){ // If placeholder or not a PDF
            pdfPreviewIframe.src = ""; // Clear previous content
            pdfPreviewIframe.setAttribute('srcdoc', `<p style="padding:20px; text-align:center;">PDF preview is not available for this file type or link.<br><a href="${filePath}" target="_blank" rel="noopener noreferrer">Try opening directly</a></p>`);
        } else {
            pdfPreviewIframe.removeAttribute('srcdoc'); // Remove srcdoc if setting src
            pdfPreviewIframe.src = filePath; 
        }
        pdfPreviewModal.classList.add('show');
    }
    if(closePdfModalBtn){
        closePdfModalBtn.addEventListener('click', () => {
            if(pdfPreviewIframe) pdfPreviewIframe.src = ""; 
            if(pdfPreviewIframe) pdfPreviewIframe.removeAttribute('srcdoc');
            if(pdfPreviewModal) pdfPreviewModal.classList.remove('show');
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === uploadModal && uploadModal) uploadModal.classList.remove('show');
        if (event.target === pdfPreviewModal && pdfPreviewModal) {
            if(pdfPreviewIframe) pdfPreviewIframe.src = ""; 
            if(pdfPreviewIframe) pdfPreviewIframe.removeAttribute('srcdoc');
            pdfPreviewModal.classList.remove('show');
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (uploadModal && uploadModal.classList.contains('show')) uploadModal.classList.remove('show');
            if (pdfPreviewModal && pdfPreviewModal.classList.contains('show')) {
                if(pdfPreviewIframe) pdfPreviewIframe.src = ""; 
                if(pdfPreviewIframe) pdfPreviewIframe.removeAttribute('srcdoc');
                pdfPreviewModal.classList.remove('show');
            }
        }
    });

    renderCategoryTabs();
    // if (Object.keys(brainBoxData).length > 0) { // Select first category by default
    //     selectCategory(Object.keys(brainBoxData)[0]);
    // }

    // Settings Panel Functionality for BrainBox
    function initializeSettingsBB() {
        const settingsButton = document.getElementById('settings-buttonBB');
        const settingsPanel = document.getElementById('settings-panelBB');
        const closeSettingsBtn = document.getElementById('close-settingsBB');
        const themeOptions = settingsPanel ? settingsPanel.querySelectorAll('.theme-option') : [];
        if (!settingsButton || !settingsPanel || !closeSettingsBtn) return;

        // Initialize theme immediately
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
        
        // Add active class to the current theme option
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === savedTheme);
        });
        
        if (savedTheme === 'system') {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                document.body.classList.toggle('dark-mode', e.matches);
            });
        }

        function openSettings(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            settingsPanel.style.display = 'block';
            settingsPanel.offsetHeight;
            settingsPanel.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        function closeSettings(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            settingsPanel.classList.remove('show');
            document.body.style.overflow = '';
        }
        function setTheme(theme) {
            if (!theme) return;
            themeOptions.forEach(option => option.classList.remove('active'));
            const selectedOption = settingsPanel.querySelector(`.theme-option[data-theme="${theme}"]`);
            if (selectedOption) selectedOption.classList.add('active');
            
            // Reset all theme classes
            document.body.classList.remove('dark-mode', 'office-mode');
            
            // Check for dark mode preference for system setting
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Apply the selected theme
            if (theme === 'system') {
                document.body.classList.toggle('dark-mode', prefersDark);
            } else if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else if (theme === 'office') {
                document.body.classList.add('office-mode');
            }
            
            // Store the theme selection
            localStorage.setItem('theme', theme);
            
            // Update any theme-dependent UI elements
            if (logoutButtonBB) {
                if (theme === 'dark' || (theme === 'system' && prefersDark)) {
                    logoutButtonBB.classList.add('dark-theme');
                } else {
                    logoutButtonBB.classList.remove('dark-theme');
                }
            }
        }
        settingsButton.addEventListener('click', openSettings, { capture: true });
        closeSettingsBtn.addEventListener('click', closeSettings, { capture: true });
        document.addEventListener('click', (e) => {
            if (settingsPanel.classList.contains('show') && !settingsPanel.contains(e.target) && e.target !== settingsButton) {
                closeSettings();
            }
        }, { capture: true });
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const theme = option.dataset.theme;
                if (theme) {
                    // Remove active class from all options
                    themeOptions.forEach(opt => opt.classList.remove('active'));
                    // Add active class to clicked option
                    option.classList.add('active');
                    // Apply the theme
                    setTheme(theme);
                }
            }, { capture: true });
        });
        if (settingsPanel.classList.contains('show')) {
            settingsPanel.style.display = 'block';
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSettingsBB);
    } else {
        initializeSettingsBB();
    }
    window.addEventListener('load', initializeSettingsBB);
});