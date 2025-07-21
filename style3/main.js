document.addEventListener('DOMContentLoaded', () => {
    // Hide admin controls when deployed online
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
        document.querySelector('.admin-controls').classList.add('hidden');
    }

    let currentPage = 1;
    let projectsPerPage = window.innerWidth <= 768 ? 4 : 8;

    // Update projects per page on resize
    window.addEventListener('resize', () => {
        const newProjectsPerPage = window.innerWidth <= 768 ? 4 : 8;
        if (newProjectsPerPage !== projectsPerPage) {
            projectsPerPage = newProjectsPerPage;
            currentPage = 1; // Reset to first page on resize
            renderProjects(currentData || { projects: [] });
        }
    });

    let currentData = null; // Store loaded data

    function renderProjects(data) {
        const projectGrid = document.getElementById('projects');
        projectGrid.innerHTML = ''; // Clear existing projects

        // Handle empty or invalid project data
        if (!data || !data.projects || !Array.isArray(data.projects) || data.projects.length === 0) {
            projectGrid.innerHTML = '<p>No projects available.</p>';
            document.querySelector('.pagination').style.display = 'none';
            console.warn('No valid projects to display');
            return;
        }

        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        const projectsToShow = data.projects.slice(startIndex, endIndex);

        projectsToShow.forEach(project => {
            if (!project.title || !project.description || !project.image || !project.link) {
                console.warn('Skipping project with missing fields:', project);
                return;
            }
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <a href="${project.link}" target="_blank" class="project-link">
                    <img src="${project.image}" alt="${project.title}">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </a>
            `;
            projectGrid.appendChild(projectCard);
        });

        // Update pagination controls
        const totalPages = Math.ceil(data.projects.length / projectsPerPage) || 1;
        if (currentPage > totalPages) {
            currentPage = totalPages; // Adjust page if out of bounds
            renderProjects(data); // Re-render with corrected page
            return;
        }
        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;

        // Show or hide pagination
        document.querySelector('.pagination').style.display = data.projects.length > projectsPerPage ? 'flex' : 'none';
    }

    function loadContent(data) {
        currentData = data; // Store data for resize events
        console.log('Loaded data:', data);

        // Logo
        document.getElementById('logo').textContent = data.logo || 'Default Name';

        // Hero
        document.getElementById('hero-title').textContent = data.hero?.title || 'Default Title';
        document.getElementById('hero-subtitle').textContent = data.hero?.subtitle || 'Default Subtitle';

        // Projects
        renderProjects(data);

        // About
        document.getElementById('about-text').textContent = data.about?.text || 'About section unavailable.';
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = ''; // Clear existing skills
        (data.about?.skills || []).forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            skillsList.appendChild(li);
        });

        // Testimonials
        const testimonialGrid = document.getElementById('testimonials-list');
        testimonialGrid.innerHTML = ''; // Clear existing testimonials
        (data.testimonials || []).forEach(testimonial => {
            if (!testimonial.text || !testimonial.author) return;
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            testimonialCard.innerHTML = `
                <p>"${testimonial.text}"</p>
                <h4>- ${testimonial.author}</h4>
            `;
            testimonialGrid.appendChild(testimonialCard);
        });

        // Contact
        document.getElementById('contact-form').action = `https://formsubmit.co/${data.contact?.email || 'your-email@example.com'}`;
        document.getElementById('form-success').textContent = data.contact?.successMessage || 'Thank you for your message!';

        // Footer
        document.getElementById('footer-text').textContent = data.footer?.text || '© 2025 Default Name';
        const socialLinks = document.getElementById('social-links');
        socialLinks.innerHTML = ''; // Clear existing social links
        if (data.social?.linkedin) {
            socialLinks.innerHTML += `<a href="${data.social.linkedin}" target="_blank" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin"></i><span class="fallback-text">LinkedIn</span></a>`;
        }
        if (data.social?.twitter) {
            socialLinks.innerHTML += `<a href="${data.social.twitter}" target="_blank" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter"></i><span class="fallback-text">Twitter</span></a>`;
        }
        if (data.social?.github) {
            socialLinks.innerHTML += `<a href="${data.social.github}" target="_blank" class="social-icon" aria-label="GitHub"><i class="fab fa-github"></i><span class="fallback-text">GitHub</span></a>`;
        }

        // Check if Font Awesome loaded, apply fallback if not
        if (typeof window.FontAwesome === 'undefined') {
            document.querySelectorAll('.social-icon').forEach(link => {
                link.classList.add('no-fontawesome');
            });
        }

        // Pagination controls
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProjects(currentData);
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            const totalPages = Math.ceil(currentData.projects.length / projectsPerPage) || 1;
            if (currentPage < totalPages) {
                currentPage++;
                renderProjects(currentData);
            }
        });
    }

    // Load from localStorage if available (for preview)
    if (localStorage.getItem('portfolioData')) {
        try {
            const data = JSON.parse(localStorage.getItem('portfolioData'));
            console.log('Loading from localStorage');
            loadContent(data);
        } catch (error) {
            console.error('Error parsing localStorage JSON:', error);
            document.getElementById('projects').innerHTML = '<p>Error loading projects. Please try again.</p>';
            document.querySelector('.pagination').style.display = 'none';
        }
    } else {
        // Load from data.json with cache-busting
        console.log('Fetching data.json');
        fetch('data.json?t=' + new Date().getTime())
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data.json: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Successfully fetched data.json');
                loadContent(data);
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                document.getElementById('projects').innerHTML = '<p>Error loading projects. Please check data.json.</p>';
                document.querySelector('.pagination').style.display = 'none';
            });
    }

    // Load JSON file
    document.getElementById('load-json').addEventListener('click', () => {
        document.getElementById('json-file').click();
    });

    document.getElementById('json-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    localStorage.setItem('portfolioData', JSON.stringify(data)); // Save to localStorage
                    currentPage = 1; // Reset to first page
                    loadContent(data);
                    alert('JSON loaded successfully!');
                } catch (error) {
                    alert('Invalid JSON file.');
                    console.error('Error parsing JSON:', error);
                    document.getElementById('projects').innerHTML = '<p>Error loading projects. Please upload a valid JSON file.</p>';
                    document.querySelector('.pagination').style.display = 'none';
                }
            };
            reader.readAsText(file);
        }
    });

    // Form validation and success message handling
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    form.addEventListener('submit', (e) => {
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const subject = form.querySelector('input[name="subject"]').value;
        const message = form.querySelector('textarea[name="message"]').value;

        if (!name || !email || !subject || !message) {
            e.preventDefault();
            alert('Please fill out all fields.');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.preventDefault();
            alert('Please enter a valid email address.');
        } else {
            // Show success message after submission (FormSubmit.co handles the actual submission)
            setTimeout(() => {
                successMessage.classList.remove('hidden');
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000); // Hide after 5 seconds
            }, 1000); // Delay to simulate form submission
        }
    });
});
