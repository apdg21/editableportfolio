const EDIT_PASSWORD = "fashiondesigner123";
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const urlParams = new URLSearchParams(window.location.search);
const cacheBust = Date.now();

if (!isLocal && urlParams.has('edit') && urlParams.get('edit') !== EDIT_PASSWORD) {
    window.location.href = window.location.pathname;
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const yearSpan = document.getElementById('year');
    const themeToggle = document.getElementById('theme-toggle');
    const contactForm = document.getElementById('contact-form');
    const lightbox = document.querySelector('.lightbox');
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const projectsSection = document.getElementById('collections');
    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const paginationPrev = document.querySelector('.pagination-btn.prev');
    const paginationNext = document.querySelector('.pagination-btn.next');
    const pageNumbers = document.querySelector('.page-numbers');
    const profileImg = document.getElementById('profile-img');
    const bioText = document.querySelector('.bio-text');
    const skillsList = document.querySelector('.skills-list');
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    const socialLinks = document.querySelector('.social-links');
    const heroSection = document.querySelector('.hero');

    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

    let portfolioData = {};
    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 4;

    const icons = {
        'instagram': 'fab fa-instagram',
        'pinterest': 'fab fa-pinterest-p',
        'linkedin': 'fab fa-linkedin-in',
        'facebook': 'fab fa-facebook-f',
        'twitter': 'fab fa-twitter',
        'behance': 'fab fa-behance'
    };

    function getPlatformIcon(platform) {
        return icons[platform.toLowerCase()] || 'fas fa-link';
    }

    function toggleMobileMenu() {
        if (hamburger && navList) {
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
        }
    }

    if (hamburger && navList) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function loadPortfolioData() {
        return fetch(`data.json?_=${cacheBust}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                portfolioData = data;
                renderPortfolio();
            })
            .catch(error => {
                console.error('Error loading portfolio data from data.json:', error);
                portfolioData = {
                    siteName: 'Aura Designs',
                    hero: { title: 'Welcome', subtitle: '', backgroundImage: '' },
                    projects: [],
                    about: { bio: '', skills: [], profileImage: '' },
                    testimonials: [],
                    socialLinks: [],
                    copyrightText: `© ${new Date().getFullYear()} Aura Designs.`
                };
                renderPortfolio();
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Failed to load portfolio data. Displaying default content.';
                document.body.prepend(errorMessage);
            });
    }

    function renderPortfolio() {
        if (!portfolioData || Object.keys(portfolioData).length === 0) {
            console.warn("No portfolio data to render.");
            return;
        }

        if (heroSection && portfolioData.hero) {
            if (portfolioData.hero.title) heroSection.querySelector('h1').textContent = portfolioData.hero.title;
            if (portfolioData.hero.subtitle) heroSection.querySelector('p').textContent = portfolioData.hero.subtitle;
            if (portfolioData.hero.backgroundImage) {
                heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${portfolioData.hero.backgroundImage || 'https://via.placeholder.com/1200'})`;
            }
        }

        if (profileImg && portfolioData.about && portfolioData.about.profileImage) {
            profileImg.setAttribute('src', portfolioData.about.profileImage || 'https://via.placeholder.com/300');
        }

        if (bioText && portfolioData.about && portfolioData.about.bio) {
            bioText.innerHTML = portfolioData.about.bio;
        }

        if (skillsList && portfolioData.about && portfolioData.about.skills) {
            skillsList.innerHTML = portfolioData.about.skills.map(skill => `<li>${skill}</li>`).join('');
        }

        if (socialLinks && portfolioData.socialLinks) {
            socialLinks.innerHTML = portfolioData.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" class="social-link"><i class="${getPlatformIcon(link.platform)}"></i></a>
            `).join('');
        }

        if (testimonialsGrid && portfolioData.testimonials) {
            testimonialsGrid.innerHTML = portfolioData.testimonials.map(testimonial => `
                <div class="testimonial-card">
                    <p class="testimonial-text">${testimonial.text}</p>
                    <p class="testimonial-author">${testimonial.author}</p>
                </div>
            `).join('');
        }

        if (portfolioData.projects && portfolioData.projects.length > 0) {
            renderProjects(portfolioData.projects);
            if (projectsSection) projectsSection.style.display = 'block';
        } else {
            if (projectsSection) projectsSection.style.display = 'none';
        }

        if (document.querySelector('.copyright') && portfolioData.copyrightText) {
            document.querySelector('.copyright').textContent = portfolioData.copyrightText;
        }
    }

    function renderProjects(projects) {
        const filteredProjects = projects.filter(project =>
            currentFilter === 'all' || (project.categories && project.categories.includes(currentFilter))
        );
        const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
        const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        if (projectsGrid) {
            projectsGrid.innerHTML = paginatedProjects.map(project => `
                <div class="project-card" data-categories="${project.categories ? project.categories.join(' ') : ''}">
                    <img src="${project.image || 'https://via.placeholder.com/300'}" alt="${project.title}" class="project-img" data-high-res="${project.highResUrl || ''}">
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

            projectsGrid.querySelectorAll('.project-img').forEach(img => {
                img.addEventListener('click', () => {
                    if (img.dataset.highRes) {
                        lightboxImg.setAttribute('src', img.dataset.highRes);
                        lightboxCaption.textContent = img.alt;
                        lightbox.classList.add('show');
                    }
                });
            });
        }

        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.innerHTML += `<span class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</span>`;
            }
        }

        if (paginationPrev && paginationNext) {
            paginationPrev.disabled = currentPage === 1;
            paginationNext.disabled = currentPage === totalPages;
        }
    }

    if (filterButtons && filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentFilter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentPage = 1;
                renderProjects(portfolioData.projects);
            });
        });
    }

    if (pageNumbers) {
        pageNumbers.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-number')) {
                currentPage = parseInt(e.target.getAttribute('data-page'));
                renderProjects(portfolioData.projects);
            }
        });
    }

    if (paginationPrev && paginationNext) {
        paginationPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProjects(portfolioData.projects);
            }
        });
        paginationNext.addEventListener('click', () => {
            const totalPages = Math.ceil((portfolioData.projects || []).filter(p => currentFilter === 'all' || (p.categories && p.categories.includes(currentFilter))).length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProjects(portfolioData.projects);
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            console.log('Form submitted with:', Object.fromEntries(formData));
            alert('Thank you for your message! (This is a demo, no email is sent)');
            contactForm.reset();
        });
    }

    if (closeLightbox && lightbox) {
        closeLightbox.addEventListener('click', () => lightbox.classList.remove('show'));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('show');
        });
    }

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 0);
        }
    });

    const uploadJsonBtn = document.getElementById('upload-json-btn-main');
    const uploadJsonInput = document.getElementById('upload-json-input-main');

    if (uploadJsonBtn && uploadJsonInput) {
        uploadJsonBtn.addEventListener('click', () => uploadJsonInput.click());
        uploadJsonInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        portfolioData = JSON.parse(event.target.result);
                        renderPortfolio();
                    } catch (error) {
                        console.error('Error parsing JSON file:', error);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    loadPortfolioData();
});
