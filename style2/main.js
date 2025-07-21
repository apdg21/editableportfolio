document.addEventListener('DOMContentLoaded', function() {
    // 1. UTILITY FUNCTIONS
    // Safe element selector with null check
    function getElementSafe(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`Element #${id} not found`);
        return el;
    }

    // Set content safely
    function setContent(id, content) {
        const el = getElementSafe(id);
        if (el) el.textContent = content || '';
    }

    // Check online status
    function isOnline() {
        return navigator.onLine;
    }

    // 2. CONNECTIVITY HANDLING
    function updateUIForConnectivity() {
        const loadSection = getElementSafe('load-section');
        if (loadSection) {
            loadSection.style.display = isOnline() ? 'none' : 'block';
        }
    }

    // 3. MOBILE MENU
    const hamburger = document.querySelector('.hamburger');
    const nav = getElementSafe('main-nav');

    function setupMobileMenu() {
        if (!hamburger || !nav) return;

        function toggleMenu() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll', nav.classList.contains('active'));
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }

        hamburger.addEventListener('click', toggleMenu);
        
        // Close menu when clicking on links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // 4. DATA LOADING
    async function loadPortfolioData() {
        showLoadingState(true);

        try {
            // Try network first if online
            if (isOnline()) {
                try {
                    const response = await fetch('data.json');
                    if (!response.ok) throw new Error('Network response not ok');
                    const data = await response.json();
                    handleDataSuccess(data);
                    return;
                } catch (networkError) {
                    console.warn("Network load failed, trying cache...", networkError);
                }
            }

            // Fallback to localStorage
            const savedData = localStorage.getItem('portfolioData');
            if (savedData) {
                handleDataSuccess(JSON.parse(savedData));
                return;
            }

            // Final fallback to direct file load
            const fallbackResponse = await fetch('data.json');
            const fallbackData = await fallbackResponse.json();
            handleDataSuccess(fallbackData);
        } catch (error) {
            handleDataError(error);
        } finally {
            showLoadingState(false);
        }
    }

    function handleDataSuccess(data) {
        if (!data) throw new Error('No data received');
        populatePortfolio(data);
        localStorage.setItem('portfolioData', JSON.stringify(data));
    }

    function handleDataError(error) {
        console.error("Data loading failed:", error);
        clearPortfolioDisplay();
        setContent('work-title', 'Failed to load projects. ' + 
            (isOnline() ? 'Try refreshing.' : 'Connect to the internet or load a file.'));
    }

    function showLoadingState(loading) {
        const loader = getElementSafe('loader');
        if (loader) loader.style.display = loading ? 'block' : 'none';
    }

    // 5. PORTFOLIO DISPLAY
    function clearPortfolioDisplay() {
        // Set default/empty states for all sections
        setContent('hero-title', 'My Portfolio');
        setContent('hero-subtitle', 'Content will appear here once loaded');
        setContent('work-title', 'My Work');
        
        const projectsGrid = getElementSafe('projects-grid');
        if (projectsGrid) projectsGrid.innerHTML = '<p class="empty-state">No projects loaded</p>';
        
        // Clear pagination
        const pagination = document.querySelector('.pagination');
        if (pagination) pagination.innerHTML = '';
    }

    function populatePortfolio(data) {
        if (!data) return;

        // Basic Info
        document.title = data.basicInfo?.title || 'Portfolio';
        setContent('logo', data.basicInfo?.logo);

        // Navigation
        const navElement = getElementSafe('main-nav');
        if (navElement) {
            navElement.innerHTML = '';
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

        // Hero Section
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

        // Work Section
        if (data.work?.projects) {
            setContent('work-title', data.work.title);
            displayProjects(data.work.projects);
        }

        // About Section
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

        // Testimonials
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

        // Footer
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

    // 6. PROJECTS DISPLAY & PAGINATION
    let currentPage = 1;
    let projectsPerPage = getProjectsPerPage();

    function getProjectsPerPage() {
        return window.innerWidth < 768 ? 4 : 6;
    }

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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(prevBtn);
        }
        
        // Page Numbers
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible/2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (startPage > 1) {
            pagination.appendChild(createPaginationButton(1, () => {
                currentPage = 1;
                updateVisibleProjects();
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }));
        }
        
        // Next Button
        if (currentPage < totalPages) {
            const nextBtn = createPaginationButton('Next »', () => {
                currentPage++;
                updateVisibleProjects();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(nextBtn);
        }
    }

    function createPaginationButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn';
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 7. FILE LOADING (for offline use)
    function setupFileLoading() {
        const loadJsonBtn = getElementSafe('load-json');
        const jsonUpload = getElementSafe('json-upload');
        
        if (!loadJsonBtn || !jsonUpload) return;
        
        loadJsonBtn.addEventListener('click', () => jsonUpload.click());
        
        jsonUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.work?.projects) throw new Error("Invalid portfolio data");
                    populatePortfolio(data);
                    localStorage.setItem('portfolioData', e.target.result);
                } catch (error) {
                    alert(`Error loading file: ${error.message}`);
                    console.error("File parsing error:", error);
                }
            };
            reader.readAsText(file);
        });
    }

    // 8. INITIALIZATION
    function init() {
        // Setup responsive behavior
        window.addEventListener('resize', () => {
            const newProjectsPerPage = getProjectsPerPage();
            if (newProjectsPerPage !== projectsPerPage) {
                projectsPerPage = newProjectsPerPage;
                currentPage = 1;
                updateVisibleProjects();
            }
        });

        // Setup connectivity monitoring
        window.addEventListener('online', updateUIForConnectivity);
        window.addEventListener('offline', updateUIForConnectivity);
        updateUIForConnectivity();

        // Setup mobile menu
        setupMobileMenu();

        // Setup file loading for offline use
        setupFileLoading();

        // Edit Portfolio button
        const editBtn = getElementSafe('edit-portfolio');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                window.location.href = 'form.html';
            });
        }

        // Initial data load
        loadPortfolioData();
    }

    // Start everything
    init();
});