document.addEventListener('DOMContentLoaded', function() {
    // Load portfolio data from localStorage
    let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || {};
    
    // Tab functionality
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
    
    // Initialize form with current data
    function initializeForm() {
        // Site name
        if (portfolioData.siteName) {
            document.getElementById('site-name').value = portfolioData.siteName;
        }
        
        // Hero section
        if (portfolioData.hero) {
            document.getElementById('hero-title').value = portfolioData.hero.title || '';
            document.getElementById('hero-subtitle').value = portfolioData.hero.subtitle || '';
            document.getElementById('hero-background').value = portfolioData.hero.backgroundImage || '';
        }
        
        // About section
        if (portfolioData.about) {
            document.getElementById('about-bio').value = portfolioData.about.bio || '';
            document.getElementById('profile-image-url').value = portfolioData.about.profileImage || '';
            document.getElementById('profile-image-preview').src = portfolioData.about.profileImage || '';
            
            // Skills
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.innerHTML = '';
            
            if (portfolioData.about.skills && portfolioData.about.skills.length > 0) {
                portfolioData.about.skills.forEach((skill, index) => {
                    const skillDiv = document.createElement('div');
                    skillDiv.className = 'array-item';
                    skillDiv.innerHTML = `
                        <input type="text" class="skill-input" value="${skill}" placeholder="Enter skill">
                        <button class="remove-item" data-index="${index}">×</button>
                    `;
                    skillsContainer.appendChild(skillDiv);
                });
            }
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
        if (portfolioData.copyrightText) {
            document.getElementById('copyright-text').value = portfolioData.copyrightText;
        }
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
        const skillsContainer = document.getElementById('skills-container');
        const skillDiv = document.createElement('div');
        skillDiv.className = 'array-item';
        
        skillDiv.innerHTML = `
            <input type="text" class="skill-input" value="" placeholder="Enter skill">
            <button class="remove-item" data-index="${document.querySelectorAll('.array-item').length}">×</button>
        `;
        
        skillsContainer.appendChild(skillDiv);
    });
    
    // Remove item
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
    
    // Load data.json manually
    document.getElementById('load-json-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to load data from data.json? This will overwrite any unsaved changes.')) {
            const cacheBust = new Date().getTime();
            fetch(`data.json?_=${cacheBust}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load data.json');
                    }
                    return response.json();
                })
                .then(data => {
                    portfolioData = data;
                    localStorage.setItem('portfolioData', JSON.stringify(data));
                    initializeForm();
                    
                    const statusMessage = document.getElementById('status-message');
                    statusMessage.textContent = 'Data loaded from data.json successfully!';
                    statusMessage.className = 'status success';
                    
                    setTimeout(() => {
                        statusMessage.className = 'status';
                        statusMessage.textContent = '';
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error loading data.json:', error);
                    const statusMessage = document.getElementById('status-message');
                    statusMessage.textContent = 'Error loading data.json. Please try again.';
                    statusMessage.className = 'status error';
                    
                    setTimeout(() => {
                        statusMessage.className = 'status';
                        statusMessage.textContent = '';
                    }, 5000);
                });
        }
    });
    
    // Download JSON
    document.getElementById('download-btn').addEventListener('click', function() {
        // Update portfolio data before downloading
        portfolioData.siteName = document.getElementById('site-name').value;
        portfolioData.hero = {
            title: document.getElementById('hero-title').value,
            subtitle: document.getElementById('hero-subtitle').value,
            backgroundImage: document.getElementById('hero-background').value
        };
        portfolioData.about = {
            bio: document.getElementById('about-bio').value,
            profileImage: document.getElementById('profile-image-url').value,
            skills: Array.from(document.querySelectorAll('.skill-input')).map(input => input.value).filter(Boolean)
        };
        portfolioData.projects = Array.from(document.querySelectorAll('#projects-container .array-item')).map(item => {
            const categories = Array.from(item.querySelector('.project-categories').selectedOptions)
                .map(option => option.value);
            return {
                title: item.querySelector('.project-title').value,
                description: item.querySelector('.project-desc').value,
                image: item.querySelector('.project-image').value,
                highResUrl: item.querySelector('.project-highres').value,
                categories: categories
            };
        }).filter(project => project.title);
        portfolioData.testimonials = Array.from(document.querySelectorAll('#testimonials-container .array-item')).map(item => {
            return {
                text: item.querySelector('.testimonial-text').value,
                author: item.querySelector('.testimonial-author').value
            };
        }).filter(testimonial => testimonial.text);
        portfolioData.socialLinks = Array.from(document.querySelectorAll('#social-links-container .array-item')).map(item => {
            return {
                platform: item.querySelector('.social-platform').value,
                url: item.querySelector('.social-url').value
            };
        }).filter(link => link.url);
        portfolioData.copyrightText = document.getElementById('copyright-text').value;

        // Create JSON blob
        const jsonString = JSON.stringify(portfolioData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show success message
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = 'Portfolio data downloaded successfully!';
        statusMessage.className = 'status success';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            statusMessage.className = 'status';
            statusMessage.textContent = '';
        }, 5000);
    });

    // Save data
    document.getElementById('save-btn').addEventListener('click', function() {
        // Update site name
        portfolioData.siteName = document.getElementById('site-name').value;
        
        // Update hero data
        portfolioData.hero = {
            title: document.getElementById('hero-title').value,
            subtitle: document.getElementById('hero-subtitle').value,
            backgroundImage: document.getElementById('hero-background').value
        };
        
        // Update about data
        portfolioData.about = {
            bio: document.getElementById('about-bio').value,
            profileImage: document.getElementById('profile-image-url').value,
            skills: Array.from(document.querySelectorAll('.skill-input')).map(input => input.value).filter(Boolean)
        };
        
        // Update projects
        portfolioData.projects = Array.from(document.querySelectorAll('#projects-container .array-item')).map(item => {
            const categories = Array.from(item.querySelector('.project-categories').selectedOptions)
                .map(option => option.value);
            
            return {
                title: item.querySelector('.project-title').value,
                description: item.querySelector('.project-desc').value,
                image: item.querySelector('.project-image').value,
                highResUrl: item.querySelector('.project-highres').value,
                categories: categories
            };
        }).filter(project => project.title); // Filter out empty projects
        
        // Update testimonials
        portfolioData.testimonials = Array.from(document.querySelectorAll('#testimonials-container .array-item')).map(item => {
            return {
                text: item.querySelector('.testimonial-text').value,
                author: item.querySelector('.testimonial-author').value
            };
        }).filter(testimonial => testimonial.text); // Filter out empty testimonials
        
        // Update social links
        portfolioData.socialLinks = Array.from(document.querySelectorAll('#social-links-container .array-item')).map(item => {
            return {
                platform: item.querySelector('.social-platform').value,
                url: item.querySelector('.social-url').value
            };
        }).filter(link => link.url); // Filter out empty links
        
        // Update copyright text
        portfolioData.copyrightText = document.getElementById('copyright-text').value;
        
        // Save to localStorage
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        // Show success message
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = 'Changes saved successfully! They will appear when you refresh the portfolio page.';
        statusMessage.className = 'status success';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            statusMessage.className = 'status';
            statusMessage.textContent = '';
        }, 5000);
    });
    
    // Initialize the form
    initializeForm();
});