document.addEventListener('DOMContentLoaded', function() {
    let portfolioData = {}; // Initialize with an empty object

    // Tab functionality (existing code, unchanged)
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update active content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // --- Initial Data Loading Logic (Adapted from the working template) ---
    function loadInitialData() {
        if (localStorage.getItem('portfolioData')) {
            try {
                portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
                initializeForm();
                showStatusMessage('Data loaded from local storage.', 'success');
            } catch (error) {
                console.error('Error parsing localStorage JSON:', error);
                showStatusMessage('Error parsing local storage data. Attempting to load from data.json.', 'error');
                loadJsonFromServer();
            }
        } else {
            loadJsonFromServer();
        }
    }

    function loadJsonFromServer() {
        const cacheBust = new Date().getTime(); // Prevent caching
        const dataPath = './data.json';
        fetch(`${dataPath}?_=${cacheBust}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${dataPath}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                portfolioData = data;
                localStorage.setItem('portfolioData', JSON.stringify(data)); // Save to localStorage for future use
                initializeForm();
                showStatusMessage('Data loaded from data.json successfully!', 'success');
            })
            .catch(error => {
                console.error('Error loading data.json:', error);
                showStatusMessage(`Error loading ${dataPath}. Please ensure the file exists and you are using a local server (e.g., http-server).`, 'error');
            });
    }
    // --- End Initial Data Loading Logic ---

    // Initialize form with current data
    function initializeForm() {
        // Site name
        document.getElementById('site-name').value = portfolioData.siteName || '';

        // Hero section
        document.getElementById('hero-title').value = portfolioData.hero?.title || '';
        document.getElementById('hero-subtitle').value = portfolioData.hero?.subtitle || '';
        document.getElementById('hero-background').value = portfolioData.hero?.backgroundImage || '';

        // About section
        document.getElementById('about-bio').value = portfolioData.about?.bio || '';
        document.getElementById('profile-image-url').value = portfolioData.about?.profileImage || '';
        document.getElementById('profile-image-preview').src = portfolioData.about?.profileImage || '';

        // Skills
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = '';
        if (portfolioData.about?.skills && portfolioData.about.skills.length > 0) {
            portfolioData.about.skills.forEach((skill, index) => {
                addSkillForm(skill, index);
            });
        }

        // Projects
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        if (portfolioData.projects && portfolioData.projects.length > 0) {
            portfolioData.projects.forEach((project, index) => {
                addProjectForm(project, index);
            });
        }

        // Testimonials
        const testimonialsContainer = document.getElementById('testimonials-container');
        testimonialsContainer.innerHTML = '';
        if (portfolioData.testimonials && portfolioData.testimonials.length > 0) {
            portfolioData.testimonials.forEach((testimonial, index) => {
                addTestimonialForm(testimonial, index);
            });
        }

        // Social Links
        const socialLinksContainer = document.getElementById('social-links-container');
        socialLinksContainer.innerHTML = '';
        if (portfolioData.socialLinks && portfolioData.socialLinks.length > 0) {
            portfolioData.socialLinks.forEach((link, index) => {
                addSocialLinkForm(link, index);
            });
        }

        // Footer
        document.getElementById('copyright-text').value = portfolioData.copyrightText || '';
    }

    // Helper function to add a skill input
    function addSkillForm(skill = '', index) {
        const skillsContainer = document.getElementById('skills-container');
        const skillDiv = document.createElement('div');
        skillDiv.className = 'array-item';
        skillDiv.innerHTML = `
            <input type="text" class="skill-input" value="${skill}" placeholder="Enter skill">
            <button class="remove-item" data-index="${index}">×</button>
        `;
        skillsContainer.appendChild(skillDiv);
    }

    // Add project form
    function addProjectForm(project = {}, index) {
        const projectsContainer = document.getElementById('projects-container');
        const projectDiv = document.createElement('div');
        projectDiv.className = 'array-item';

        projectDiv.innerHTML = `
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="project-title" value="${project.title || ''}" placeholder="Project title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="project-desc" placeholder="Project description">${project.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Image URL</label>
                <input type="url" class="project-image" value="${project.image || ''}" placeholder="Project image URL">
            </div>
            <div class="form-group">
                <label>High Resolution URL</label>
                <input type="url" class="project-highres" value="${project.highResUrl || ''}" placeholder="High resolution image URL">
            </div>
            <div class="form-group">
                <label>Categories</label>
                <select class="project-categories" multiple style="height: auto;">
                    <option value="portrait" ${project.categories && project.categories.includes('portrait') ? 'selected' : ''}>Portrait</option>
                    <option value="landscape" ${project.categories && project.categories.includes('landscape') ? 'selected' : ''}>Landscape</option>
                    <option value="product" ${project.categories && project.categories.includes('product') ? 'selected' : ''}>Product</option>
                    <option value="event" ${project.categories && project.categories.includes('event') ? 'selected' : ''}>Event</option>
                </select>
                <small>Hold Ctrl/Cmd to select multiple</small>
            </div>
            <button class="remove-item btn btn-danger" data-index="${index}">Remove Project</button>
        `;

        projectsContainer.appendChild(projectDiv);
    }

    // Add testimonial form
    function addTestimonialForm(testimonial = {}, index) {
        const testimonialsContainer = document.getElementById('testimonials-container');
        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'array-item';

        testimonialDiv.innerHTML = `
            <div class="form-group">
                <label>Testimonial Text</label>
                <textarea class="testimonial-text" placeholder="Testimonial text">${testimonial.text || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Author</label>
                <input type="text" class="testimonial-author" value="${testimonial.author || ''}" placeholder="Author name">
            </div>
            <button class="remove-item btn btn-danger" data-index="${index}">Remove Testimonial</button>
        `;

        testimonialsContainer.appendChild(testimonialDiv);
    }

    // Add social link form
    function addSocialLinkForm(link = {}, index) {
        const socialLinksContainer = document.getElementById('social-links-container');
        const linkDiv = document.createElement('div');
        linkDiv.className = 'array-item';

        linkDiv.innerHTML = `
            <div class="form-group">
                <label>Platform</label>
                <select class="social-platform">
                    <option value="instagram" ${link.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                    <option value="500px" ${link.platform === '500px' ? 'selected' : ''}>500px</option>
                    <option value="flickr" ${link.platform === 'flickr' ? 'selected' : ''}>Flickr</option>
                    <option value="behance" ${link.platform === 'behance' ? 'selected' : ''}>Behance</option>
                    <option value="facebook" ${link.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                    <option value="twitter" ${link.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                    <option value="pinterest" ${link.platform === 'pinterest' ? 'selected' : ''}>Pinterest</option>
                </select>
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="url" class="social-url" value="${link.url || ''}" placeholder="Profile URL">
            </div>
            <button class="remove-item btn btn-danger" data-index="${index}">Remove Link</button>
        `;

        socialLinksContainer.appendChild(linkDiv);
    }

    // Add new project
    document.getElementById('add-project').addEventListener('click', function() {
        addProjectForm({}, document.querySelectorAll('#projects-container .array-item').length);
    });

    // Add new testimonial
    document.getElementById('add-testimonial').addEventListener('click', function() {
        addTestimonialForm({}, document.querySelectorAll('#testimonials-container .array-item').length);
    });

    // Add new social link
    document.getElementById('add-social-link').addEventListener('click', function() {
        addSocialLinkForm({}, document.querySelectorAll('#social-links-container .array-item').length);
    });

    // Add new skill
    document.getElementById('add-skill').addEventListener('click', function() {
        addSkillForm('', document.querySelectorAll('#skills-container .array-item').length);
    });

    // Remove item (general handler for all 'remove-item' buttons)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            e.target.closest('.array-item').remove();
        }
    });

    // Profile image upload
    document.getElementById('profile-image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('profile-image-url').value = event.target.result;
                document.getElementById('profile-image-preview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Status Message Helper ---
    function showStatusMessage(message, type) {
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`; // 'success' or 'error'
        setTimeout(() => {
            statusMessage.className = 'status';
            statusMessage.textContent = '';
        }, 5000);
    }

    // --- Button Event Listeners ---

    // Load data.json manually (from server) - now calls the dedicated function
    document.getElementById('load-json-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to load data from data.json? This will overwrite any unsaved changes.')) {
            loadJsonFromServer();
        }
    });

    // Upload JSON from local PC (trigger hidden input)
    document.getElementById('upload-json-btn').addEventListener('click', function() {
        document.getElementById('upload-json-input').click();
    });

    // Handle uploaded JSON file
    document.getElementById('upload-json-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const uploadedData = JSON.parse(event.target.result);
                    if (confirm('Are you sure you want to load this file? This will overwrite any unsaved changes.')) {
                        portfolioData = uploadedData;
                        localStorage.setItem('portfolioData', JSON.stringify(uploadedData));
                        initializeForm();
                        showStatusMessage('Data loaded from uploaded file successfully!', 'success');
                    }
                } catch (error) {
                    console.error('Error parsing uploaded JSON:', error);
                    showStatusMessage('Error: Could not parse uploaded file. Please ensure it is a valid JSON file.', 'error');
                }
            };
            reader.readAsText(file);
        }
    });

    // Download JSON
    document.getElementById('download-btn').addEventListener('click', function() {
        // First, update portfolioData with current form values
        updatePortfolioDataFromForm();

        // Create JSON blob
        const jsonString = JSON.stringify(portfolioData, null, 2);
        const blob = new Blob([jsonString], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showStatusMessage('Portfolio data downloaded successfully!', 'success');
    });

    // Save data to localStorage
    document.getElementById('save-btn').addEventListener('click', function() {
        updatePortfolioDataFromForm(); // Update data object from form inputs
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData)); // Save to localStorage
        showStatusMessage('Changes saved successfully! They will appear when you refresh the portfolio page.', 'success');
    });

    // Helper to update the portfolioData object from the current form values
    function updatePortfolioDataFromForm() {
        portfolioData.siteName = document.getElementById('site-name').value;
        portfolioData.hero = {
            title: document.getElementById('hero-title').value,
            subtitle: document.getElementById('hero-subtitle').value,
            backgroundImage: document.getElementById('hero-background').value
        };
        portfolioData.about = {
            bio: document.getElementById('about-bio').value,
            profileImage: document.getElementById('profile-image-url').value,
            skills: Array.from(document.querySelectorAll('#skills-container .skill-input')).map(input => input.value).filter(Boolean)
        };
        portfolioData.projects = Array.from(document.querySelectorAll('#projects-container .array-item')).map(item => {
            const categoriesSelect = item.querySelector('.project-categories');
            const categories = categoriesSelect ? Array.from(categoriesSelect.selectedOptions).map(option => option.value) : [];
            return {
                title: item.querySelector('.project-title')?.value || '',
                description: item.querySelector('.project-desc')?.value || '',
                image: item.querySelector('.project-image')?.value || '',
                highResUrl: item.querySelector('.project-highres')?.value || '',
                categories: categories
            };
        }).filter(project => project.title); // Filter out empty projects

        portfolioData.testimonials = Array.from(document.querySelectorAll('#testimonials-container .array-item')).map(item => {
            return {
                text: item.querySelector('.testimonial-text')?.value || '',
                author: item.querySelector('.testimonial-author')?.value || ''
            };
        }).filter(testimonial => testimonial.text); // Filter out empty testimonials

        portfolioData.socialLinks = Array.from(document.querySelectorAll('#social-links-container .array-item')).map(item => {
            return {
                platform: item.querySelector('.social-platform')?.value || '',
                url: item.querySelector('.social-url')?.value || ''
            };
        }).filter(link => link.url); // Filter out empty links

        portfolioData.copyrightText = document.getElementById('copyright-text').value;
    }

    // Call the initial data loading function
    loadInitialData();
});