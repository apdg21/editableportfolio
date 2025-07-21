document.addEventListener('DOMContentLoaded', () => {
    const DATA_PATH = 'data.json';
    let portfolioData = {};
    let currentPage = 1;
    let itemsPerPage = window.innerWidth > 768 ? 8 : 4;

    // Get the new load button and content wrapper
    const startPortfolioBtn = document.getElementById('start-portfolio-btn');
    const initialLoadScreen = document.getElementById('initial-load-screen');
    const portfolioContentWrapper = document.getElementById('portfolio-content-wrapper');
    const loadingMessage = document.getElementById('loading-message');


    // --- HAMBURGER MENU FUNCTIONALITY ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- DATA LOADING ---
    async function loadDataAndDisplay() {
        // Show loading message
        loadingMessage.classList.remove('hidden');
        startPortfolioBtn.disabled = true; // Disable button during loading

        try {
            const localData = localStorage.getItem('portfolioData');
            if (localData) {
                portfolioData = JSON.parse(localData);
                console.log('Loaded data from Local Storage.');
            } else {
                const response = await fetch(DATA_PATH);
                if (!response.ok) throw new Error('Network response was not ok.');
                portfolioData = await response.json();
                console.log('Loaded data from data.json.');
            }
            renderPage(); // Render all content
            initialLoadScreen.classList.add('hidden'); // Hide the initial screen
            portfolioContentWrapper.classList.remove('hidden'); // Show the main content
            // Update header and footer visibility if they were initially hidden.
            // (Your header is already outside the wrapper, which is good)
            document.querySelector('footer').classList.remove('hidden'); // Assuming footer might be hidden too
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
            document.body.innerHTML = '<p style="text-align: center; padding: 2rem;">Error: Could not load portfolio content. Please ensure data.json is available.</p>';
        } finally {
            loadingMessage.classList.add('hidden'); // Hide loading message
            startPortfolioBtn.disabled = false; // Re-enable button (though not strictly necessary as screen hides)
        }
    }

    // --- RENDER FUNCTIONS (No changes needed here, they render based on portfolioData) ---
    function renderPage() {
        if (!portfolioData || Object.keys(portfolioData).length === 0) { // Add a check for empty data
             console.warn("Portfolio data is empty or not loaded yet.");
             return;
        }

        document.getElementById('logo').textContent = portfolioData.logo || 'Portfolio';
        document.title = `${portfolioData.logo || 'Graphic Designer'} Portfolio`;
        document.getElementById('hero-title').textContent = portfolioData.hero.title;
        document.getElementById('hero-subtitle').textContent = portfolioData.hero.subtitle;
        const heroButton = document.getElementById('hero-button');
        heroButton.textContent = portfolioData.hero.buttonText;
        heroButton.href = '#work';
        document.getElementById('about-title').textContent = portfolioData.about.title;
        document.getElementById('about-description').textContent = portfolioData.about.description;
        document.getElementById('about-image').src = portfolioData.about.profileImage;
        renderSamples();
        setupPagination();
        renderTestimonials();
        document.getElementById('contact-title').textContent = portfolioData.contact.title;
        document.getElementById('contact-form').action = `https://formsubmit.co/${portfolioData.contact.formEmail}`;
        renderFooter();
        setupAdminControls();
    }

    function renderSamples() {
        const grid = document.getElementById('sample-grid');
        grid.innerHTML = '';
        const samples = portfolioData.samples || [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageSamples = samples.slice(startIndex, endIndex);

        pageSamples.forEach(sample => {
            const card = document.createElement('div');
            card.className = 'sample-card';
            card.innerHTML = `
                <img src="${sample.image}" alt="${sample.title}">
                <div class="sample-card-content">
                    <h3>${sample.title}</h3>
                    <p>${sample.description}</p>
                </div>
            `;
            card.addEventListener('click', () => {
                if (sample.link) { // Added check for link existence
                    window.open(sample.link, '_blank');
                } else {
                    console.warn(`No link defined for sample: ${sample.title}`);
                }
            });
            grid.appendChild(card);
        });
    }

    function renderTestimonials() {
        const container = document.getElementById('testimonial-container');
        container.innerHTML = '';
        (portfolioData.testimonials || []).forEach(testimonial => {
            const div = document.createElement('div');
            div.className = 'testimonial';
            div.innerHTML = `
                <p>"${testimonial.text}"</p>
                <p class="author">- ${testimonial.author}</p>
            `;
            container.appendChild(div);
        });
    }

    function renderFooter() {
        const socialContainer = document.getElementById('social-links');
        socialContainer.innerHTML = '';
        const social = portfolioData.social;
        // Added checks for social object and individual properties
        if (social && social.linkedin) socialContainer.innerHTML += `<a href="${social.linkedin}" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin"></i><span class="sr-only">LinkedIn</span></a>`;
        if (social && social.twitter) socialContainer.innerHTML += `<a href="${social.twitter}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i><span class="sr-only">Twitter</span></a>`;
        if (social && social.github) socialContainer.innerHTML += `<a href="${social.github}" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i><span class="sr-only">GitHub</span></a>`;
        
        document.getElementById('footer-copyright').textContent = portfolioData.footer.copyright;
    }

    // --- PAGINATION ---
    function setupPagination() {
        const paginationContainer = document.getElementById('pagination');
        const samples = portfolioData.samples || [];
        const totalPages = Math.ceil(samples.length / itemsPerPage);

        if (totalPages <= 1) { // Also hide if no samples or only one page
            paginationContainer.classList.add('hidden');
            return;
        }
        paginationContainer.classList.remove('hidden');

        paginationContainer.innerHTML = `
            <button id="prev-page" class="btn">Previous</button>
            <span id="page-info">Page ${currentPage} of ${totalPages}</span>
            <button id="next-page" class="btn">Next</button>
        `;

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Re-attach listeners as buttons are re-created
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderSamples();
                setupPagination();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderSamples();
                setupPagination();
            }
        });
    }

    // --- EVENT LISTENERS ---
    window.addEventListener('resize', () => {
        const newItemsPerPage = window.innerWidth > 768 ? 8 : 4;
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 1; // Reset to first page on layout change
            // Only re-render if data is already loaded
            if (Object.keys(portfolioData).length > 0) {
                renderSamples();
                setupPagination();
            }
        }
    });

    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message'); // Your HTML uses 'success-message'

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                contactForm.reset();
                successMessage.classList.remove('hidden');
                setTimeout(() => successMessage.classList.add('hidden'), 5000);
            } else {
                alert('There was an error sending your message. Please try again.');
            }
        }).catch(error => {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        });
    });

    // --- ADMIN CONTROLS ---
    function setupAdminControls() {
        const adminControls = document.getElementById('admin-controls');
        const loadJsonBtn = document.getElementById('load-json-btn');
        const jsonUpload = document.getElementById('json-upload');

        if (window.location.protocol === 'file:') {
            // Only show admin controls if accessing via file:// protocol
            if (adminControls) adminControls.classList.remove('hidden');
        } else {
            // Hide admin controls if deployed online
            if (adminControls) adminControls.classList.add('hidden');
            if (loadJsonBtn) loadJsonBtn.classList.add('hidden'); // Also explicitly hide the button
        }

        if (loadJsonBtn) {
            loadJsonBtn.addEventListener('click', () => jsonUpload.click());
        }
        
        if (jsonUpload) {
            jsonUpload.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const json = JSON.parse(e.target.result);
                            localStorage.setItem('portfolioData', JSON.stringify(json));
                            alert('JSON data loaded successfully! The page will now reload.');
                            window.location.reload();
                        } catch (err) {
                            alert('Error parsing JSON file. Please check the file format.');
                            console.error('JSON Parse Error:', err);
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }
    }

    // --- INITIALIZE ---
    // NO LONGER call loadData() directly here on DOMContentLoaded.
    // Instead, add an event listener to the new button.
    startPortfolioBtn.addEventListener('click', loadDataAndDisplay);

    // Initial setup of admin controls (they are initially hidden by HTML, but JS will unhide if file://)
    setupAdminControls();
});