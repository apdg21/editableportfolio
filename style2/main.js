document.addEventListener('DOMContentLoaded', function() {
    // Safe element selector with null check
    function getElementSafe(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`Element #${id} not found`);
        return el;
    }

    const hamburger = document.querySelector('.hamburger');
    const nav = getElementSafe('main-nav');

    // Function to close the mobile menu
    function closeMobileMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (nav) nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Function to add event listeners to navigation links
    function addNavEventListeners() {
        if (nav) {
            nav.querySelectorAll('a').forEach(link => {
                link.removeEventListener('click', closeMobileMenu); // Prevent duplicate listeners
                link.addEventListener('click', closeMobileMenu);
            });
        }
    }

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll', nav.classList.contains('active'));
        });
    }

    // Function to clear all dynamic content and show a "no data" state
    function clearPortfolioDisplay() {
        // Clear main navigation
        const navElement = getElementSafe('main-nav');
        if (navElement) {
            navElement.innerHTML = '<ul><li><a href="#hero">Home</a></li></ul>'; // Minimal default nav
            addNavEventListeners(); // Re-attach listeners for default nav
        }

        // Clear hero section
        setContent('hero-title', 'Welcome!');
        setContent('hero-subtitle', 'Load your portfolio data to get started.');
        setContent('hero-button-text', 'Learn More'); // Or leave empty
        const profileImg = getElementSafe('profile-image');
        if (profileImg) {
            profileImg.src = 'assets/profile.jpg'; // Default placeholder image
            profileImg.alt = 'Placeholder Image';
        }

        // Clear work section
        setContent('work-title', 'No Projects Loaded');
        const projectsGrid = getElementSafe('projects-grid');
        if (projectsGrid) projectsGrid.innerHTML = '<p style="text-align: center; margin-top: 2rem;">Load your data.json file to see your amazing projects!</p>';
        const pagination = document.querySelector('.pagination');
        if (pagination) pagination.innerHTML = ''; // Clear pagination buttons

        // Clear about section
        setContent('about-title', 'About Me');
        setContent('about-content', 'Information about yourself will appear here once you load your portfolio data.');
        const aboutImg = getElementSafe('about-image');
        if (aboutImg) {
            aboutImg.src = 'assets/about.jpg'; // Default placeholder image
            aboutImg.alt = 'About Placeholder';
        }
        const skillsList = getElementSafe('skills-list');
        if (skillsList) skillsList.innerHTML = '<p>No skills loaded.</p>';

        // Clear testimonials
        setContent('testimonials-title', 'Testimonials');
        const testimonialsGrid = getElementSafe('testimonials-grid');
        if (testimonialsGrid) testimonialsGrid.innerHTML = '<p style="text-align: center; margin-top: 2rem;">Testimonials will be displayed here.</p>';

        // Clear footer
        const footerContent = getElementSafe('footer-content');
        if (footerContent) footerContent.innerHTML = 'Your custom footer content will appear here.';
        setContent('copyright', '© 2025 Your Portfolio. All rights reserved.');
        const socialLinks = getElementSafe('social-links');
        if (socialLinks) socialLinks.innerHTML = '<p>Social links will appear here.</p>';
        
        // Reset any other dynamic content areas that might be populated
        document.title = 'My Portfolio'; // Reset default title
    }

    // This function will now be explicitly called
    function loadAndPopulatePortfolio(data) {
        populatePortfolio(data); // Populate the display with the loaded data
        addNavEventListeners(); // Ensure nav links are clickable AFTER population
    }

    // Load JSON button functionality
    const loadJsonBtn = getElementSafe('load-json');
    // CORRECTED TYPO HERE: Was 'json-ejpload', now 'json-upload'
    const jsonUpload = getElementSafe('json-upload'); 
    
    if (loadJsonBtn && jsonUpload) {
        loadJsonBtn.addEventListener('click', function() {
            jsonUpload.click();
        });
        
        jsonUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (!data.work?.projects) throw new Error("Missing projects data");
                        loadAndPopulatePortfolio(data); // Use the new loader function
                        localStorage.setItem('portfolioData', e.target.result); // Still save it
                    } catch (error) {
                        alert(`JSON Error: ${error.message}`);
                        console.error("Parsing error:", error);
                        clearPortfolioDisplay(); // Show clear state on error
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Current page and responsive settings
    let currentPage = 1;
    let projectsPerPage = getProjectsPerPage();
    
    function getProjectsPerPage() {
        return window.innerWidth < 768 ? 4 : 6;
    }

    const resizeHandler = () => {
        const newProjectsPerPage = getProjectsPerPage();
        if (newProjectsPerPage !== projectsPerPage) {
            projectsPerPage = newProjectsPerPage;
            currentPage = 1;
            updateVisibleProjects();
        }
    };
    window.addEventListener('resize', resizeHandler);

    // Helper function to safely set content (moved up for scope)
    function setContent(id, content) {
        const el = getElementSafe(id);
        if (el) el.textContent = content || '';
    }

    // The 'populatePortfolio' function remains largely the same, but it's now called by loadAndPopulatePortfolio
    // and its handling of nav listeners is removed as it's now done in addNavEventListeners().
    function populatePortfolio(data) {
        if (!data) return;

        if (data.basicInfo) {
            document.title = data.basicInfo.title || 'Portfolio';
            setContent('logo', data.basicInfo.logo);
        }

        const navElement = getElementSafe('main-nav');
        if (navElement) {
            navElement.innerHTML = ''; // Clear existing content
            const navList = document.createElement('ul');
            data.navigation?.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.link || '#';
                a.textContent = item.text || '';
                li.appendChild(a);
                navList.appendChild(li);
            });
            navElement.appendChild(navList);
        }

        if (data.hero) {
            setContent('hero-title', data.hero.title);
            setContent('hero-subtitle', data.hero.subtitle);
            setContent('hero-button-text', data.hero.buttonText);
            const profileImg = getElementSafe('profile-image');
            if (profileImg && data.hero.image) {
                profileImg.src = `assets/${data.hero.image}`;
                profileImg.alt = data.hero.title || '';
            }
        }

        if (data.work?.projects) {
            setContent('work-title', data.work.title);
            displayProjects(data.work.projects);
        }

        if (data.about) {
            setContent('about-title', data.about.title);
            setContent('about-content', data.about.content);
            const aboutImg = getElementSafe('about-image');
            if (aboutImg && data.about.image) {
                aboutImg.src = `assets/${data.about.image}`;
                aboutImg.alt = data.about.title || '';
            }

            const skillsList = getElementSafe('skills-list');
            if (skillsList) {
                skillsList.innerHTML = '';
                data.about.skills?.forEach(skill => {
                    const skillItem = document.createElement('div');
                    skillItem.className = 'skill-item';
                    skillItem.textContent = skill;
                    skillsList.appendChild(skillItem);
                });
            }
        }

        if (data.testimonials) {
            setContent('testimonials-title', data.testimonials.title);
            const testimonialsGrid = getElementSafe('testimonials-grid');
            if (testimonialsGrid) {
                testimonialsGrid.innerHTML = '';
                data.testimonials.items?.forEach(testimonial => {
                    const card = document.createElement('div');
                    card.className = 'testimonial-card';
                    card.innerHTML = `
                        <p class="testimonial-text">"${testimonial.text || ''}"</p>
                        <div class="testimonial-author">
                            <img src="assets/${testimonial.authorImage || 'profile.jpg'}"
                                 alt="${testimonial.authorName || ''}"
                                 class="author-image">
                            <div class="author-info">
                                <h4>${testimonial.authorName || ''}</h4>
                                <p>${testimonial.authorPosition || ''}</p>
                            </div>
                        </div>
                    `;
                    testimonialsGrid.appendChild(card);
                });
            }
        }

        if (data.contact) {
            // Placeholder for contact form population if needed
        }

        if (data.footer) {
            const footerContent = getElementSafe('footer-content');
            if (footerContent) footerContent.innerHTML = data.footer.content || '';
            
            setContent('copyright', data.footer.copyright);

            const socialLinks = getElementSafe('social-links');
            if (socialLinks) {
                socialLinks.innerHTML = '';
                data.footer.socialLinks?.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.url || '#';
                    a.target = '_blank';
                    a.innerHTML = `<i class="fab fa-${link.icon || 'link'}"></i>`;
                    socialLinks.appendChild(a);
                });
            }
        }
    }

    // displayProjects, updateVisibleProjects, updatePaginationControls, createPaginationButton unchanged
    function displayProjects(projects) {
        const grid = getElementSafe('projects-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Make clickable if link/file exists
            if (project.link || project.file) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    const target = project.link || `assets/${project.file}`;
                    window.open(target, '_blank');
                });
            }
            
            card.innerHTML = `
                <img src="assets/${project.image || 'project-default.jpg'}"
                     alt="${project.title || 'Project'}"
                     class="project-image">
                <div class="project-info">
                    <h3>${project.title || 'Untitled Project'}</h3>
                    <p>${project.description || ''}</p>
                    <div class="project-tags"></div>
                </div>
            `;
            
            const tagsContainer = card.querySelector('.project-tags');
            if (tagsContainer && project.tags) {
                project.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            }
            
            grid.appendChild(card);
        });
        
        updateVisibleProjects();
    }

    function updateVisibleProjects() {
        const cards = document.querySelectorAll('.project-card');
        const startIdx = (currentPage - 1) * projectsPerPage;
        const endIdx = startIdx + projectsPerPage;
        
        cards.forEach((card, index) => {
            card.style.display = (index >= startIdx && index < endIdx) ? 'block' : 'none';
        });
        
        updatePaginationControls(cards.length);
    }

    function updatePaginationControls(totalProjects) {
        const workSection = getElementSafe('work');
        if (!workSection) return;
        
        let pagination = workSection.querySelector('.pagination');
        if (!pagination) {
            pagination = document.createElement('div');
            pagination.className = 'pagination';
            workSection.appendChild(pagination);
        }
        pagination.innerHTML = '';
        
        const totalPages = Math.ceil(totalProjects / projectsPerPage);
        
        // Previous Button
        if (currentPage > 1) {
            const prevBtn = createPaginationButton('« Previous', () => {
                currentPage--;
                updateVisibleProjects();
            });
            pagination.appendChild(prevBtn);
        }
        
        // Page Numbers
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible/2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            pagination.appendChild(createPaginationButton(1, () => {
                currentPage = 1;
                updateVisibleProjects();
            }));
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const btn = createPaginationButton(i, () => {
                currentPage = i;
                updateVisibleProjects();
            });
            if (i === currentPage) btn.classList.add('active');
            pagination.appendChild(btn);
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
            
            pagination.appendChild(createPaginationButton(totalPages, () => {
                currentPage = totalPages;
                updateVisibleProjects();
            }));
        }
        
        // Next Button
        if (currentPage < totalPages) {
            const nextBtn = createPaginationButton('Next »', () => {
                currentPage++;
                updateVisibleProjects();
            });
            pagination.appendChild(nextBtn);
        }
    }

    function createPaginationButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.textContent = text;
        btn.addEventListener('click', () => {
            onClick();
            window.scrollTo({
                top: document.getElementById('work')?.offsetTop || 0,
                behavior: 'smooth'
            });
        });
        return btn;
    }

    // Edit Portfolio Button
    const editBtn = getElementSafe('edit-portfolio');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            window.location.href = 'form.html';
        });
    }

    // Initialize: Start with a blank display
    clearPortfolioDisplay(); 
});