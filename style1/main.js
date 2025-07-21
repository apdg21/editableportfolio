document.addEventListener('DOMContentLoaded', () => {
    const DATA_PATH = 'data.json'; // Path to your data.json file
    let portfolioData = {}; // Will store the loaded JSON data
    let currentPage = 1; // For pagination
    let itemsPerPage = window.innerWidth > 768 ? 8 : 4; // Responsive items per page

    // DOM Elements for Initial Load Screen
    const startPortfolioBtn = document.getElementById('start-portfolio-btn');
    const initialLoadScreen = document.getElementById('initial-load-screen');
    const portfolioContentWrapper = document.getElementById('portfolio-content-wrapper');
    const loadingMessage = document.getElementById('loading-message');

    // DOM Elements for Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // --- HAMBURGER MENU FUNCTIONALITY ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close the menu when a navigation link is clicked (useful for single-page sites)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- MAIN DATA LOADING FUNCTION ---
    // This function is triggered by clicking the "Load Portfolio" button
    async function loadDataAndDisplay() {
        // Show loading message and disable button
        loadingMessage.classList.remove('hidden');
        startPortfolioBtn.disabled = true;

        try {
            // First, try to load from localStorage (if data was saved by form.html)
            const localData = localStorage.getItem('portfolioData');
            if (localData) {
                portfolioData = JSON.parse(localData);
                console.log('Loaded data from Local Storage.');
            } else {
                // If not in localStorage, fetch from data.json
                const response = await fetch(DATA_PATH);
                if (!response.ok) {
                    // Log specific network error if fetch fails
                    console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
                    throw new Error('Failed to fetch data.json. Check file path and content.');
                }
                portfolioData = await response.json();
                console.log('Loaded data from data.json.');
            }

            // Once data is loaded, render the page
            renderPage();

            // Transition from load screen to portfolio content
            initialLoadScreen.classList.add('hidden'); // Hide the welcome screen
            portfolioContentWrapper.classList.remove('hidden'); // Show the main portfolio content
            // Ensure footer is visible if it was initially hidden by CSS
            document.querySelector('footer').classList.remove('hidden');

        } catch (error) {
            console.error('An error occurred while loading portfolio data:', error);
            // Display a user-friendly error message on the page
            document.body.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;">Error: Could not load portfolio content. Please ensure data.json is available and valid.</p>';
        } finally {
            // Always hide loading message and re-enable button (though screen hides)
            loadingMessage.classList.add('hidden');
            startPortfolioBtn.disabled = false;
        }
    }

    // --- RENDER FUNCTIONS ---
    // These functions populate the HTML elements with data from portfolioData
    function renderPage() {
        // Basic check to ensure data is available before rendering
        if (!portfolioData || Object.keys(portfolioData).length === 0) {
            console.warn("Portfolio data is empty or not loaded yet. Cannot render page.");
            return;
        }

        // General
        document.getElementById('logo').textContent = portfolioData.logo || 'Portfolio';
        document.title = `${portfolioData.logo || 'Graphic Designer'} Portfolio`;

        // Hero Section
        document.getElementById('hero-title').textContent = portfolioData.hero.title;
        document.getElementById('hero-subtitle').textContent = portfolioData.hero.subtitle;
        const heroButton = document.getElementById('hero-button');
        heroButton.textContent = portfolioData.hero.buttonText;
        heroButton.href = '#work'; // Link to the Work section

        // About Section
        document.getElementById('about-title').textContent = portfolioData.about.title;
        document.getElementById('about-description').textContent = portfolioData.about.description;
        document.getElementById('about-image').src = portfolioData.about.profileImage;

        // Work Samples Section (uses pagination)
        renderSamples(); // Call to render current page of samples
        setupPagination(); // Initialize/update pagination controls

        // Testimonials Section
        renderTestimonials();

        // Contact Section
        document.getElementById('contact-title').textContent = portfolioData.contact.title;
        document.getElementById('contact-form').action = `https://formsubmit.co/${portfolioData.contact.formEmail}`;
        // The success-message text is handled by the form submission logic, not directly from data.json

        // Footer Section
        renderFooter();

        // Setup Admin Controls (visibility depends on protocol)
        setupAdminControls();
    }

    function renderSamples() {
        const grid = document.getElementById('sample-grid');
        grid.innerHTML = ''; // Clear existing samples
        const samples = portfolioData.samples || []; // Ensure samples array exists

        // Apply pagination logic
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
            // Add click listener to open project link
            card.addEventListener('click', () => {
                if (sample.link) {
                    window.open(sample.link, '_blank'); // Open link in a new tab
                } else {
                    console.warn(`No link defined for sample: ${sample.title}`);
                }
            });
            grid.appendChild(card);
        });
    }

    function renderTestimonials() {
        const container = document.getElementById('testimonial-container');
        container.innerHTML = ''; // Clear existing testimonials
        (portfolioData.testimonials || []).forEach(testimonial => { // Ensure testimonials array exists
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
        socialContainer.innerHTML = ''; // Clear existing social links
        const social = portfolioData.social; // Get social links object

        // Add social icons if URLs are provided
        if (social && social.linkedin) {
            socialContainer.innerHTML += `<a href="${social.linkedin}" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin"></i><span class="sr-only">LinkedIn</span></a>`;
        }
        if (social && social.twitter) {
            socialContainer.innerHTML += `<a href="${social.twitter}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i><span class="sr-only">Twitter</span></a>`;
        }
        if (social && social.github) {
            socialContainer.innerHTML += `<a href="${social.github}" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i><span class="sr-only">GitHub</span></a>`;
        }
        
        document.getElementById('footer-copyright').textContent = portfolioData.footer.copyright;
    }

    // --- PAGINATION FUNCTIONALITY ---
    function setupPagination() {
        const paginationContainer = document.getElementById('pagination');
        const samples = portfolioData.samples || [];
        const totalPages = Math.ceil(samples.length / itemsPerPage);

        // Hide pagination if there's only one page or no samples
        if (totalPages <= 1 || samples.length === 0) {
            paginationContainer.classList.add('hidden');
            return;
        }
        paginationContainer.classList.remove('hidden'); // Ensure pagination is visible

        // Re-create pagination buttons and info to ensure fresh event listeners
        paginationContainer.innerHTML = `
            <button id="prev-page" class="btn">Previous</button>
            <span id="page-info">Page ${currentPage} of ${totalPages}</span>
            <button id="next-page" class="btn">Next</button>
        `;

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        // Disable/enable buttons based on current page
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Attach event listeners to the new buttons
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderSamples(); // Re-render samples for the new page
                setupPagination(); // Update pagination controls (buttons, page info)
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderSamples(); // Re-render samples for the new page
                setupPagination(); // Update pagination controls (buttons, page info)
            }
        });
    }

    // --- GLOBAL EVENT LISTENERS ---
    // Adjust items per page on window resize for responsiveness
    window.addEventListener('resize', () => {
        const newItemsPerPage = window.innerWidth > 768 ? 8 : 4;
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 1; // Reset to the first page when layout changes
            // Only re-render if data has already been loaded
            if (Object.keys(portfolioData).length > 0) {
                renderSamples();
                setupPagination();
            }
        }
    });

    // Contact form submission logic (uses FormSubmit.co)
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for FormSubmit.co to return JSON
                    }
                });

                if (response.ok) {
                    contactForm.reset(); // Clear the form
                    successMessage.classList.remove('hidden'); // Show success message
                    setTimeout(() => successMessage.classList.add('hidden'), 5000); // Hide after 5 seconds
                } else {
                    // Attempt to read error message from response if available
                    const errorData = await response.json();
                    alert(`There was an error sending your message: ${errorData.message || 'Please try again.'}`);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error sending your message. Please check your internet connection.');
            }
        });
    }


    // --- ADMIN CONTROLS FUNCTIONALITY ---
    // These controls are only visible when the page is accessed via file:// protocol
    function setupAdminControls() {
        const adminControls = document.getElementById('admin-controls');
        const loadJsonBtn = document.getElementById('load-json-btn');
        const jsonUpload = document.getElementById('json-upload');

        // Determine if running locally (file://) or deployed (http:// or https://)
        if (window.location.protocol === 'file:') {
            if (adminControls) adminControls.classList.remove('hidden'); // Show admin controls
        } else {
            if (adminControls) adminControls.classList.add('hidden'); // Hide admin controls
        }

        // Attach event listener for the "Load JSON" button (for manual file upload)
        if (loadJsonBtn && jsonUpload) {
            loadJsonBtn.addEventListener('click', () => jsonUpload.click()); // Trigger file input click

            jsonUpload.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const json = JSON.parse(e.target.result); // Parse uploaded file content
                            localStorage.setItem('portfolioData', JSON.stringify(json)); // Save to localStorage
                            alert('JSON data loaded successfully! The page will now reload to apply changes.');
                            window.location.reload(); // Reload the page to apply the new data
                        } catch (err) {
                            alert('Error parsing JSON file. Please check the file format.');
                            console.error('JSON Parse Error:', err);
                        }
                    };
                    reader.readAsText(file); // Read the file as text
                }
            });
        } else {
            console.warn('Admin control elements (load-json-btn or json-upload) not found.');
        }
    }

    // --- INITIALIZATION ON PAGE LOAD ---
    // Attach event listener to the "Load Portfolio" button on the initial screen
    if (startPortfolioBtn) {
        startPortfolioBtn.addEventListener('click', loadDataAndDisplay);
    } else {
        console.error('Start Portfolio Button not found! Make sure ID is correct in index.html.');
    }

    // Always set up admin controls at the beginning to handle their visibility
    setupAdminControls();
});