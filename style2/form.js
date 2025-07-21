document.addEventListener('DOMContentLoaded', function() {
    // Load existing JSON button
    const loadExistingBtn = document.getElementById('load-existing');
    const existingJsonInput = document.getElementById('existing-json');
    
    loadExistingBtn.addEventListener('click', function() {
        existingJsonInput.click();
    });
    
    existingJsonInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    populateForm(data);
                } catch (error) {
                    alert('Error parsing JSON file. Please check the file format.');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Navigation items
    const navItemsContainer = document.getElementById('navigation-items');
    const addNavItemBtn = document.getElementById('add-nav-item');
    
    addNavItemBtn.addEventListener('click', function() {
        addNavItem();
    });
    
    function addNavItem(item = { text: '', link: '' }) {
        const id = Date.now();
        const navItemElement = document.createElement('div');
        navItemElement.className = 'form-group nav-item';
        navItemElement.innerHTML = `
            <div class="form-row">
                <div>
                    <label>Text:</label>
                    <input type="text" class="nav-text" value="${item.text}" placeholder="About" required>
                </div>
                <div>
                    <label>Link:</label>
                    <input type="text" class="nav-link" value="${item.link}" placeholder="#about" required>
                </div>
                <button type="button" class="btn remove-btn" data-id="${id}">Remove</button>
            </div>
        `;
        navItemElement.dataset.id = id;
        navItemsContainer.appendChild(navItemElement);
        
        navItemElement.querySelector('.remove-btn').addEventListener('click', function() {
            navItemElement.remove();
        });
    }
    
    // Projects
    const projectsContainer = document.getElementById('projects');
    const addProjectBtn = document.getElementById('add-project');
    
    addProjectBtn.addEventListener('click', function() {
        addProject();
    });
    
    function addProject(project = { title: '', description: '', image: '', file: '', link: '', tags: [] }) {
        const id = Date.now();
        const projectElement = document.createElement('div');
        projectElement.className = 'form-group project-item';
        projectElement.innerHTML = `
            <div class="form-row">
                <div>
                    <label>Title:</label>
                    <input type="text" class="project-title" value="${project.title}" placeholder="Project Title" required>
                </div>
                <div>
                    <label>Image (filename in assets folder):</label>
                    <input type="text" class="project-image" value="${project.image}" placeholder="project1.jpg" required>
                </div>
                <button type="button" class="btn remove-btn" data-id="${id}">Remove</button>
            </div>
            <div class="form-group">
                <label>Description:</label>
                <textarea class="project-description" required>${project.description}</textarea>
            </div>
            <div class="form-group">
                <label>Project Link Type:</label>
                <select class="project-link-type">
                    <option value="none" ${!project.file && !project.link ? 'selected' : ''}>No Link</option>
                    <option value="file" ${project.file ? 'selected' : ''}>PDF File</option>
                    <option value="url" ${project.link ? 'selected' : ''}>Web URL</option>
                </select>
            </div>
            <div class="form-group project-file-group" style="display:${project.file ? 'block' : 'none'}">
                <label>PDF Filename (in assets folder):</label>
                <input type="text" class="project-file" value="${project.file || ''}" placeholder="project.pdf">
            </div>
            <div class="form-group project-url-group" style="display:${project.link ? 'block' : 'none'}">
                <label>Project URL:</label>
                <input type="url" class="project-url" value="${project.link || ''}" placeholder="https://example.com">
            </div>
            <div class="form-group">
                <label>Tags (comma separated):</label>
                <input type="text" class="project-tags" value="${project.tags.join(', ') || ''}" placeholder="HTML, CSS, Email Design">
            </div>
        `;
        
        // Link type toggle
        const typeSelect = projectElement.querySelector('.project-link-type');
        const fileGroup = projectElement.querySelector('.project-file-group');
        const urlGroup = projectElement.querySelector('.project-url-group');
        
        typeSelect.addEventListener('change', function() {
            fileGroup.style.display = 'none';
            urlGroup.style.display = 'none';
            
            if (this.value === 'file') {
                fileGroup.style.display = 'block';
            } else if (this.value === 'url') {
                urlGroup.style.display = 'block';
            }
        });
        
        projectElement.querySelector('.remove-btn').addEventListener('click', function() {
            projectElement.remove();
        });
        
        projectsContainer.appendChild(projectElement);
    }
    
    // Skills
    const skillsContainer = document.getElementById('skills');
    const addSkillBtn = document.getElementById('add-skill');
    
    addSkillBtn.addEventListener('click', function() {
        addSkill();
    });
    
    function addSkill(skill = '') {
        const id = Date.now();
        const skillElement = document.createElement('div');
        skillElement.className = 'form-group skill-item';
        skillElement.innerHTML = `
            <div class="form-row">
                <input type="text" class="skill-name" value="${skill}" placeholder="Email Development" required>
                <button type="button" class="btn remove-btn" data-id="${id}">Remove</button>
            </div>
        `;
        skillElement.dataset.id = id;
        skillsContainer.appendChild(skillElement);
        
        skillElement.querySelector('.remove-btn').addEventListener('click', function() {
            skillElement.remove();
        });
    }
    
    // Testimonials
    const testimonialsContainer = document.getElementById('testimonial-items');
    const addTestimonialBtn = document.getElementById('add-testimonial');
    
    addTestimonialBtn.addEventListener('click', function() {
        addTestimonial();
    });
    
    function addTestimonial(testimonial = { text: '', authorName: '', authorPosition: '', authorImage: '' }) {
        const id = Date.now();
        const testimonialElement = document.createElement('div');
        testimonialElement.className = 'form-group testimonial-item';
        testimonialElement.innerHTML = `
            <div class="form-group">
                <label>Testimonial Text:</label>
                <textarea class="testimonial-text" required>${testimonial.text}</textarea>
            </div>
            <div class="form-row">
                <div>
                    <label>Author Name:</label>
                    <input type="text" class="testimonial-author-name" value="${testimonial.authorName}" required>
                </div>
                <div>
                    <label>Author Position:</label>
                    <input type="text" class="testimonial-author-position" value="${testimonial.authorPosition}" required>
                </div>
                <div>
                    <label>Author Image (filename in assets folder):</label>
                    <input type="text" class="testimonial-author-image" value="${testimonial.authorImage}" required>
                </div>
                <button type="button" class="btn remove-btn" data-id="${id}">Remove</button>
            </div>
        `;
        testimonialElement.dataset.id = id;
        testimonialsContainer.appendChild(testimonialElement);
        
        testimonialElement.querySelector('.remove-btn').addEventListener('click', function() {
            testimonialElement.remove();
        });
    }
    
    // Social Links
    const socialLinksContainer = document.getElementById('social-links-form');
    const addSocialLinkBtn = document.getElementById('add-social-link');
    
    addSocialLinkBtn.addEventListener('click', function() {
        addSocialLink();
    });
    
    function addSocialLink(link = { icon: '', url: '' }) {
        const id = Date.now();
        const socialLinkElement = document.createElement('div');
        socialLinkElement.className = 'form-group social-link-item';
        socialLinkElement.innerHTML = `
            <div class="form-row">
                <div>
                    <label>Icon (Font Awesome name without "fa-" prefix):</label>
                    <input type="text" class="social-link-icon" value="${link.icon}" placeholder="twitter" required>
                </div>
                <div>
                    <label>URL:</label>
                    <input type="url" class="social-link-url" value="${link.url}" placeholder="https://twitter.com/username" required>
                </div>
                <button type="button" class="btn remove-btn" data-id="${id}">Remove</button>
            </div>
        `;
        socialLinkElement.dataset.id = id;
        socialLinksContainer.appendChild(socialLinkElement);
        
        socialLinkElement.querySelector('.remove-btn').addEventListener('click', function() {
            socialLinkElement.remove();
        });
    }
    
    // Form submission
    const portfolioForm = document.getElementById('portfolio-form');
    
    portfolioForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveData();
    });
    
    // Download JSON button
    const downloadJsonBtn = document.getElementById('download-json');
    
    downloadJsonBtn.addEventListener('click', function() {
        saveData(true);
    });
    
    // Preview button
    const previewBtn = document.getElementById('preview');
    
    previewBtn.addEventListener('click', function() {
        saveData(false, true);
    });
    
    function saveData(download = false, preview = false) {
        // Collect navigation items
        const navItems = Array.from(document.querySelectorAll('.nav-item')).map(item => {
            return {
                text: item.querySelector('.nav-text').value,
                link: item.querySelector('.nav-link').value
            };
        });
        
        // Collect projects
        const projects = Array.from(document.querySelectorAll('.project-item')).map(item => {
            const type = item.querySelector('.project-link-type').value;
            return {
                title: item.querySelector('.project-title').value,
                description: item.querySelector('.project-description').value,
                image: item.querySelector('.project-image').value,
                file: type === 'file' ? item.querySelector('.project-file').value : undefined,
                link: type === 'url' ? item.querySelector('.project-url').value : undefined,
                tags: item.querySelector('.project-tags').value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag)
            };
        });
        
        // Collect skills
        const skills = Array.from(document.querySelectorAll('.skill-name')).map(item => item.value);
        
        // Collect testimonials
        const testimonials = Array.from(document.querySelectorAll('.testimonial-item')).map(item => {
            return {
                text: item.querySelector('.testimonial-text').value,
                authorName: item.querySelector('.testimonial-author-name').value,
                authorPosition: item.querySelector('.testimonial-author-position').value,
                authorImage: item.querySelector('.testimonial-author-image').value
            };
        });
        
        // Collect social links
        const socialLinks = Array.from(document.querySelectorAll('.social-link-item')).map(item => {
            return {
                icon: item.querySelector('.social-link-icon').value,
                url: item.querySelector('.social-link-url').value
            };
        });
        
        // Create data object
        const data = {
            basicInfo: {
                title: document.getElementById('title').value,
                logo: document.getElementById('logo').value
            },
            navigation: navItems,
            hero: {
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle').value,
                buttonText: document.getElementById('hero-button-text').value,
                image: document.getElementById('hero-image').value
            },
            work: {
                title: document.getElementById('work-title').value,
                projects: projects
            },
            about: {
                title: document.getElementById('about-title').value,
                content: document.getElementById('about-content').value,
                image: document.getElementById('about-image').value,
                skills: skills
            },
            testimonials: {
                title: document.getElementById('testimonials-title').value,
                items: testimonials
            },
            contact: {
                title: document.getElementById('contact-title').value,
                description: document.getElementById('contact-description').value,
                recipientEmail: document.getElementById('contact-email').value,
                successMessage: document.getElementById('contact-success').value
            },
            footer: {
                content: document.getElementById('footer-content').value,
                socialLinks: socialLinks,
                copyright: document.getElementById('copyright').value
            }
        };
        
        const jsonData = JSON.stringify(data, null, 2);
        
        if (download) {
            // Download JSON file
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'portfolio-data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (preview) {
            // Save to localStorage and open preview
            localStorage.setItem('portfolioData', jsonData);
            window.open('index.html', '_blank');
        } else {
            // Just save to localStorage
            localStorage.setItem('portfolioData', jsonData);
            alert('Changes saved successfully!');
        }
    }
    
    // Populate form with existing data
    function populateForm(data) {
        // Basic Info
        document.getElementById('title').value = data.basicInfo?.title || '';
        document.getElementById('logo').value = data.basicInfo?.logo || '';
        
        // Navigation
        navItemsContainer.innerHTML = '';
        data.navigation?.forEach(item => addNavItem(item));
        
        // Hero Section
        document.getElementById('hero-title').value = data.hero?.title || '';
        document.getElementById('hero-subtitle').value = data.hero?.subtitle || '';
        document.getElementById('hero-button-text').value = data.hero?.buttonText || '';
        document.getElementById('hero-image').value = data.hero?.image || '';
        
        // Work Section
        document.getElementById('work-title').value = data.work?.title || '';
        projectsContainer.innerHTML = '';
        data.work?.projects?.forEach(project => addProject(project));
        
        // About Section
        document.getElementById('about-title').value = data.about?.title || '';
        document.getElementById('about-content').value = data.about?.content || '';
        document.getElementById('about-image').value = data.about?.image || '';
        skillsContainer.innerHTML = '';
        data.about?.skills?.forEach(skill => addSkill(skill));
        
        // Testimonials
        document.getElementById('testimonials-title').value = data.testimonials?.title || '';
        testimonialsContainer.innerHTML = '';
        data.testimonials?.items?.forEach(testimonial => addTestimonial(testimonial));
        
        // Contact Form
        document.getElementById('contact-title').value = data.contact?.title || '';
        document.getElementById('contact-description').value = data.contact?.description || '';
        document.getElementById('contact-email').value = data.contact?.recipientEmail || '';
        document.getElementById('contact-success').value = data.contact?.successMessage || '';
        
        // Footer
        document.getElementById('footer-content').value = data.footer?.content || '';
        document.getElementById('copyright').value = data.footer?.copyright || '';
        socialLinksContainer.innerHTML = '';
        data.footer?.socialLinks?.forEach(link => addSocialLink(link));
    }
    
    // Load any saved data
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        try {
            populateForm(JSON.parse(savedData));
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
});