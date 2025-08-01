document.addEventListener('DOMContentLoaded', function() {
    // ===== SHARED VISIBILITY CHECK ===== //
    const isLocal = 
        window.location.hostname === "localhost" || 
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:";
    
    const urlParams = new URLSearchParams(window.location.search);
    const EDIT_PASSWORD = "photography123";

    // ===== BUTTON VISIBILITY CONTROL ===== //
    function setButtonVisibility(selector, show) {
        const btn = document.querySelector(selector);
        if (btn) btn.style.display = show ? 'block' : 'none';
    }

    // ===== EDIT BUTTON ===== //
    function initEditButton() {
        const shouldShow = isLocal || urlParams.get('edit') === EDIT_PASSWORD;
        setButtonVisibility('.edit-btn', shouldShow);

        // Redirect if wrong password (online only)
        if (!isLocal && urlParams.has('edit') && urlParams.get('edit') !== EDIT_PASSWORD) {
            window.location.href = window.location.pathname;
        }
    }

    // ===== LOAD BUTTON ===== //
    function initLoadButton() {
        const shouldShow = isLocal || urlParams.get('edit') === EDIT_PASSWORD;
        
        if (shouldShow) {
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            fileInput.id = 'json-file-input';
            document.body.appendChild(fileInput);
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        portfolioData = jsonData;
                        localStorage.setItem('portfolioData', JSON.stringify(jsonData));
                        renderPortfolio();
                        showMessage('Portfolio data loaded successfully!', 'success');
                    } catch (error) {
                        showMessage('Invalid JSON file', 'error');
                        console.error('JSON parse error:', error);
                    }
                };
                reader.readAsText(file);
            });

            // Create load button
            const loadBtn = document.createElement('button');
            loadBtn.className = 'load-json-btn';
            loadBtn.innerHTML = '<i class="fas fa-upload"></i> Load Portfolio Data';
            
            // Apply styles (better to put in CSS)
            Object.assign(loadBtn.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '1000',
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
            });
            
            loadBtn.addEventListener('click', () => fileInput.click());
            document.body.appendChild(loadBtn);
        }
    }

    // ===== MESSAGE DISPLAY ===== //
    function showMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `load-message ${type}`;
        msg.textContent = text;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }

    // Initialize buttons
    initEditButton();
    initLoadButton();

    

    // Rest of your existing code remains the same...
    // Load portfolio data on page load
    loadPortfolioData();
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
    
    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('project-img')) {
            const imgSrc = e.target.getAttribute('src');
            const imgAlt = e.target.getAttribute('alt');
            
            lightboxImg.setAttribute('src', imgSrc);
            lightboxCaption.textContent = imgAlt;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
    
    closeLightbox.addEventListener('click', function() {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Theme toggle functionality
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = this.querySelector('i');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    });
    
    // Check for saved theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
    
    // Function to get platform icon
    function getPlatformIcon(platform) {
        const icons = {
            'instagram': 'fab fa-instagram',
            '500px': 'fab fa-500px',
            'flickr': 'fab fa-flickr',
            'behance': 'fab fa-behance',
            'facebook': 'fab fa-facebook-f',
            'twitter': 'fab fa-twitter',
            'pinterest': 'fab fa-pinterest-p'
        };
        return icons[platform] || 'fas fa-link';
    }
    
    // Function to render the entire portfolio
    function renderPortfolio() {
        if (!portfolioData) return;
        
        // Render site name/logo
        const logo = document.querySelector('.logo');
        if (portfolioData.siteName) {
            logo.textContent = portfolioData.siteName;
        }
        
        // Render copyright text
        const copyright = document.querySelector('.copyright');
        if (portfolioData.copyrightText) {
            copyright.textContent = portfolioData.copyrightText;
        } else {
            copyright.textContent = `© ${new Date().getFullYear()} ${portfolioData.siteName || 'Elena Ray'} Photography. All rights reserved.`;
        }
        
        // Render hero section
        if (portfolioData.hero) {
            const heroSection = document.querySelector('.hero');
            if (heroSection && portfolioData.hero.backgroundImage) {
                heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${portfolioData.hero.backgroundImage})`;
            }
            
            if (portfolioData.hero.title) {
                document.querySelector('.hero h1').textContent = portfolioData.hero.title;
            }
            
            if (portfolioData.hero.subtitle) {
                document.querySelector('.hero p').textContent = portfolioData.hero.subtitle;
            }
        }
        
        // Render projects
        if (portfolioData.projects && portfolioData.projects.length > 0) {
            renderProjects(portfolioData.projects);
        }
        
        // Render about section
        if (portfolioData.about) {
            if (portfolioData.about.bio) {
                document.querySelector('.bio-text').innerHTML = portfolioData.about.bio;
            }
            
            if (portfolioData.about.skills && portfolioData.about.skills.length > 0) {
                const skillsList = document.querySelector('.skills-list');
                skillsList.innerHTML = portfolioData.about.skills.map(skill => 
                    `<li>${skill}</li>`
                ).join('');
            }
            
            if (portfolioData.about.profileImage) {
                document.getElementById('profile-img').setAttribute('src', portfolioData.about.profileImage);
            }
        }
        
        // Render testimonials
        if (portfolioData.testimonials && portfolioData.testimonials.length > 0) {
            renderTestimonials(portfolioData.testimonials);
        }
        
        // Render social links
        if (portfolioData.socialLinks && portfolioData.socialLinks.length > 0) {
            const socialLinksContainer = document.querySelector('.social-links');
            socialLinksContainer.innerHTML = portfolioData.socialLinks.map(link => 
                `<a href="${link.url}" class="social-link" target="_blank"><i class="${getPlatformIcon(link.platform)}"></i></a>`
            ).join('');
        }
    }
    
    // Function to render projects with pagination and filtering
    function renderProjects(projects) {
        const projectsGrid = document.querySelector('.projects-grid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const paginationPrev = document.querySelector('.pagination-btn.prev');
        const paginationNext = document.querySelector('.pagination-btn.next');
        const pageNumbersContainer = document.querySelector('.page-numbers');
        
        let currentPage = 1;
        let currentFilter = 'all';
        const projectsPerPage = 6;
        
        // Filter projects
        function filterProjects(filter) {
            currentFilter = filter;
            currentPage = 1;
            renderFilteredProjects();
        }
        
        // Render filtered projects with pagination
        function renderFilteredProjects() {
            let filteredProjects = projects;
            
            if (currentFilter !== 'all') {
                filteredProjects = projects.filter(project => 
                    project.categories && project.categories.includes(currentFilter)
                );
            }
            
            const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
            const startIndex = (currentPage - 1) * projectsPerPage;
            const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);
            
            // Render projects
            projectsGrid.innerHTML = paginatedProjects.map(project => `
                <div class="project-card" data-categories="${project.categories ? project.categories.join(' ') : ''}">
                    <img src="${project.image}" alt="${project.title}" class="project-img">
                    <div class="project-info">
                        <h3 class="project-title">${project.title}</h3>
                        ${project.categories ? `<span class="project-category">${project.categories[0]}</span>` : ''}
                        <p class="project-desc">${project.description}</p>
                        <div class="project-links">
                            ${project.highResUrl ? `<a href="${project.highResUrl}" target="_blank"><i class="fas fa-expand"></i> View High Res</a>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Update pagination buttons
            paginationPrev.disabled = currentPage === 1;
            paginationNext.disabled = currentPage === totalPages || totalPages === 0;
            
            // Render page numbers
            pageNumbersContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageNumber = document.createElement('span');
                pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
                pageNumber.textContent = i;
                pageNumber.addEventListener('click', () => {
                    currentPage = i;
                    renderFilteredProjects();
                });
                pageNumbersContainer.appendChild(pageNumber);
            }
        }
        
        // Initialize filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterProjects(this.dataset.filter);
            });
        });
        
        // Pagination event listeners
        paginationPrev.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderFilteredProjects();
            }
        });
        
        paginationNext.addEventListener('click', function() {
            const filteredProjects = currentFilter === 'all' 
                ? projects 
                : projects.filter(project => 
                    project.categories && project.categories.includes(currentFilter)
                );
            
            const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
            
            if (currentPage < totalPages) {
                currentPage++;
                renderFilteredProjects();
            }
        });
        
        // Initial render
        renderFilteredProjects();
    }
    
    // Function to render testimonials
    function renderTestimonials(testimonials) {
        const testimonialsGrid = document.querySelector('.testimonials-grid');
        
        testimonialsGrid.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <p class="testimonial-author">— ${testimonial.author}</p>
            </div>
        `).join('');
    }
});