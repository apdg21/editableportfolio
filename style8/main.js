document.addEventListener('DOMContentLoaded', function() {
    // ===== EDIT BUTTON VISIBILITY ===== //
    const showEditButton = () => {
        const isLocal =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.protocol === "file:";

        const urlParams = new URLSearchParams(window.location.search);
        const EDIT_PASSWORD = "fashiondesigner123"; // 🔑 Set your password here!

        if (isLocal || urlParams.get('edit') === EDIT_PASSWORD) {
            const editBtn = document.querySelector('.edit-btn');
            if (editBtn) {
                editBtn.style.display = 'block';
            }
            const uploadJsonBtn = document.getElementById('upload-json-btn-main');
            if (uploadJsonBtn) {
                uploadJsonBtn.style.display = 'inline-block';
            }
        } else {
            const editBtn = document.querySelector('.edit-btn');
            if (editBtn) {
                editBtn.style.display = 'none';
            }
            const uploadJsonBtn = document.getElementById('upload-json-btn-main');
            if (uploadJsonBtn) {
                uploadJsonBtn.style.display = 'none';
            }
        }

        if (!isLocal && urlParams.has('edit') && urlParams.get('edit') !== EDIT_PASSWORD) {
            window.location.href = window.location.pathname;
        }
    };
    showEditButton();

    // Load portfolio data
    let portfolioData = {};
    const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:";

    // Function to load and render portfolio data
    function loadPortfolioData() {
        const cacheBust = new Date().getTime();

        const savedData = JSON.parse(localStorage.getItem('portfolioData'));
        if (savedData && Object.keys(savedData).length > 0) {
            portfolioData = savedData;
            renderPortfolio();
            return;
        }

        fetch(`data.json?_=${cacheBust}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load data.json');
                }
                return response.json();
            })
            .then(data => {
                portfolioData = data;
                renderPortfolio();
            })
            .catch(error => {
                console.error('Error loading portfolio data:', error);
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Failed to load portfolio data. Please ensure data.json exists or upload a valid JSON file.';
                document.body.prepend(errorMessage);
                portfolioData = {
                    hero: { backgroundImage: 'placeholder.jpg', title: 'Fallback', subtitle: '' },
                    about: { profileImage: 'placeholder.jpg', bio: '', skills: [] },
                    projects: []
                };
                renderPortfolio();
            });
    }

    // Handle uploaded JSON file for immediate preview
    document.getElementById('upload-json-input-main')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const uploadedData = JSON.parse(event.target.result);
                    portfolioData = uploadedData;
                    localStorage.setItem('portfolioData', JSON.stringify(uploadedData));
                    renderPortfolio();
                    alert('Portfolio data loaded from local file successfully!');
                } catch (error) {
                    console.error('Error parsing uploaded JSON:', error);
                    alert('Error: Could not parse uploaded file. Please ensure it is a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('upload-json-btn-main')?.addEventListener('click', function() {
        document.getElementById('upload-json-input-main').click();
    });

    loadPortfolioData();

    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });

        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }

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
            if (header) header.classList.add('scrolled');
        } else {
            if (header) header.classList.remove('scrolled');
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            console.log('Form submitted:', data);
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
            const projectCard = e.target.closest('.project-card');
            const highResUrl = projectCard?.querySelector('.project-links a[target="_blank"]')?.getAttribute('href');
            const imgAlt = e.target.getAttribute('alt');
            if (lightboxImg) lightboxImg.setAttribute('src', highResUrl || e.target.getAttribute('src'));
            if (lightboxCaption) lightboxCaption.textContent = imgAlt;
            if (lightbox) lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });

    if (closeLightbox) {
        closeLightbox.addEventListener('click', function() {
            if (lightbox) lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Theme toggle functionality
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const icon = this.querySelector('i');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    // Function to get platform icon
    function getPlatformIcon(platform) {
        const icons = {
            'instagram': 'fab fa-instagram',
            'pinterest': 'fab fa-pinterest-p',
            'linkedin': 'fab fa-linkedin-in',
            'facebook': 'fab fa-facebook-f',
            'twitter': 'fab fa-twitter',
            'behance': 'fab fa-behance'
        };
        return icons[platform] || 'fas fa-link';
    }

    // Function to render the entire portfolio
    function renderPortfolio() {
        if (!portfolioData || Object.keys(portfolioData).length === 0) {
            return;
        }

        const logo = document.querySelector('.logo');
        if (logo) {
            logo.textContent = portfolioData.siteName || 'My Portfolio';
        }

        const copyright = document.querySelector('.copyright');
        const yearSpan = document.getElementById('year');
        if (copyright && yearSpan) {
            copyright.textContent = portfolioData.copyrightText || `© ${new Date().getFullYear()} ${portfolioData.siteName || 'Aura Designs'}. All rights reserved.`;
        }

        // Render hero section
        if (portfolioData.hero) {
            const heroSection = document.querySelector('.hero');
            if (heroSection && portfolioData.hero.backgroundImage) {
                heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${portfolioData.hero.backgroundImage})`;
            }
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle) {
                heroTitle.textContent = portfolioData.hero.title || '';
            }
            const heroSubtitle = document.querySelector('.hero p');
            if (heroSubtitle) {
                heroSubtitle.textContent = portfolioData.hero.subtitle || '';
            }
        }

        // Render projects
        const projectsSection = document.getElementById('collections');
        if (portfolioData.projects && portfolioData.projects.length > 0) {
            renderProjects(portfolioData.projects);
            if (projectsSection) projectsSection.style.display = 'block';
        } else {
            if (projectsSection) projectsSection.style.display = 'none';
        }

        // Render about section
        if (portfolioData.about) {
            const bioText = document.querySelector('.bio-text');
            if (bioText && portfolioData.about.bio) {
                bioText.innerHTML = portfolioData.about.bio;
            } else if (bioText) {
                bioText.innerHTML = '';
            }

            if (portfolioData.about.skills && portfolioData.about.skills.length > 0) {
                const skillsList = document.querySelector('.skills-list');
                if (skillsList) {
                    skillsList.innerHTML = portfolioData.about.skills.map(skill =>
                        `<li>${skill}</li>`
                    ).join('');
                }
            } else {
                const skillsList = document.querySelector('.skills-list');
                if (skillsList) skillsList.innerHTML = '';
            }

            const profileImg = document.getElementById('profile-img');
            if (profileImg) {
                if (portfolioData.about.profileImage) {
                    // Check if profileImage is a URL or local path
                    const isUrl = portfolioData.about.profileImage.startsWith('http');
                    profileImg.setAttribute('src', isUrl ? portfolioData.about.profileImage : `assets/${portfolioData.about.profileImage}`);
                } else {
                    profileImg.setAttribute('src', 'assets/placeholder.jpg');
                }
            }
        }

        // Render testimonials
        const testimonialsSection = document.getElementById('testimonials');
        if (portfolioData.testimonials && portfolioData.testimonials.length > 0) {
            renderTestimonials(portfolioData.testimonials);
            if (testimonialsSection) testimonialsSection.style.display = 'block';
        } else {
            if (testimonialsSection) testimonialsSection.style.display = 'none';
        }

        // Render social links
        const socialLinksContainer = document.querySelector('.social-links');
        if (socialLinksContainer) {
            if (portfolioData.socialLinks && portfolioData.socialLinks.length > 0) {
                socialLinksContainer.innerHTML = portfolioData.socialLinks.map(link =>
                    `<a href="${link.url}" class="social-link" target="_blank"><i class="${getPlatformIcon(link.platform)}"></i></a>`
                ).join('');
            } else {
                socialLinksContainer.innerHTML = '';
            }
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

        function filterProjects(filter) {
            currentFilter = filter;
            currentPage = 1;
            renderFilteredProjects();
        }

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

            if (projectsGrid) {
                projectsGrid.innerHTML = paginatedProjects.map(project => `
                    <div class="project-card" data-categories="${project.categories ? project.categories.join(' ') : ''}">
                        <img src="${project.image}" alt="${project.title}" class="project-img">
                        <div class="project-info">
                            <h3 class="project-title">${project.title}</h3>
                            ${project.categories && project.categories.length > 0 ? `<span class="project-category">${project.categories[0]}</span>` : ''}
                            <p class="project-desc">${project.description}</p>
                            <div class="project-links">
                                ${project.highResUrl ? `<a href="${project.highResUrl}" target="_blank"><i class="fas fa-expand"></i> View Details</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            if (paginationPrev) paginationPrev.disabled = currentPage === 1;
            if (paginationNext) paginationNext.disabled = currentPage === totalPages || totalPages === 0;

            if (pageNumbersContainer) {
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
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterProjects(this.dataset.filter);
            });
        });

        if (paginationPrev) {
            paginationPrev.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    renderFilteredProjects();
                }
            });
        }

        if (paginationNext) {
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
        }

        renderFilteredProjects();
    }

    // Function to render testimonials
    function renderTestimonials(testimonials) {
        const testimonialsGrid = document.querySelector('.testimonials-grid');
        if (!testimonialsGrid) return;
        testimonialsGrid.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <p class="testimonial-text">"${testimonial.text}"</p>
                <p class="testimonial-author">— ${testimonial.author}</p>
            </div>
        `).join('');
    }
});
