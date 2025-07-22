let portfolioData = {};

const editForm = document.getElementById('editForm');
const projectsContainer = document.getElementById('projectsContainer');
const testimonialsContainer = document.getElementById('testimonialsContainer');
const addProjectBtn = document.getElementById('addProject');
const addTestimonialBtn = document.getElementById('addTestimonial');
const downloadJsonBtn = document.getElementById('downloadJson');
const saveStatusMessage = document.getElementById('saveStatus');

// Default data (should match the structure in main.js)
const defaultData = {
    "logo": "Video Editor Portfolio",
    "hero": {
        "title": "Crafting Stories Through Motion",
        "subtitle": "Bringing Visions to Life, Frame by Frame"
    },
    "projects": [
        {
            "title": "Dynamic Promo Video",
            "description": "Engaging promotional video for a tech startup, highlighting key features and benefits.",
            "image": "assets/sample1.jpg",
            "link": "samples/sample1.txt"
        },
        {
            "title": "Corporate Explainer",
            "description": "Animated explainer video simplifying complex corporate services for a broader audience.",
            "image": "assets/sample2.jpg",
            "link": "samples/sample2.txt"
        }
    ],
    "about": {
        "text": "Hello! I'm a passionate video editor with over 8 years of experience in crafting compelling visual narratives. From dynamic promotional content to intricate documentary edits, my goal is always to bring stories to life with precision and creativity. I specialize in post-production, color grading, sound design, and motion graphics, using industry-standard software to deliver high-quality results. I believe that every frame has a purpose, and I'm dedicated to ensuring that your vision not only looks incredible but also resonates deeply with your audience. Let's create something unforgettable together!",
        "skills": ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "Motion Graphics", "Color Grading", "Sound Design", "VFX", "Storytelling", "Video Compression"]
    },
    "testimonials": [
        {
            "text": "The video editor delivered exceptional work! They perfectly captured our brand's essence and the final video exceeded all our expectations. Highly recommended!",
            "author": "Client A"
        }
    ],
    "contact": {
        "email": "videoeditor@example.com",
        "successMessage": "Thank you for your message! I'll get back to you soon."
    },
    "footer": {
        "text": "© 2025 Video Editor Portfolio"
    },
    "social": {
        "linkedin": "https://linkedin.com/in/yourvideoeditor",
        "twitter": "https://twitter.com/yourvideoeditor",
        "github": "https://github.com/yourvideoeditor"
    }
};


/**
 * Populates the form fields with data.
 * @param {object} data - The portfolio data.
 */
function populateForm(data) {
    document.getElementById('logo').value = data.logo || '';
    document.getElementById('heroTitle').value = data.hero.title || '';
    document.getElementById('heroSubtitle').value = data.hero.subtitle || '';
    document.getElementById('aboutText').value = data.about.text || '';
    document.getElementById('aboutSkills').value = (data.about.skills || []).join(', ');
    document.getElementById('contactEmail').value = data.contact.email || '';
    document.getElementById('successMessage').value = data.contact.successMessage || '';
    document.getElementById('footerText').value = data.footer.text || '';
    document.getElementById('socialLinkedin').value = data.social.linkedin || '';
    document.getElementById('socialTwitter').value = data.social.twitter || '';
    document.getElementById('socialGithub').value = data.social.github || '';

    populateProjects(data.projects || []);
    populateTestimonials(data.testimonials || []);
}

/**
 * Populates the projects section of the form.
 * @param {Array} projects - Array of project objects.
 */
function populateProjects(projects) {
    projectsContainer.innerHTML = '';
    projects.forEach((project, index) => {
        addProjectField(project, index);
    });
}

/**
 * Adds a new project field set to the form.
 * @param {object} project - The project data (optional, for pre-filling).
 * @param {number} index - The index of the project (optional).
 */
function addProjectField(project = {}, index = null) {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.dataset.index = index !== null ? index : projectsContainer.children.length;

    projectItem.innerHTML = `
        <h3>Project ${parseInt(projectItem.dataset.index) + 1}</h3>
        <button type="button" class="remove-button" data-type="project">Remove Project</button>
        <div class="form-group">
            <label for="projectTitle-${projectItem.dataset.index}">Title:</label>
            <input type="text" id="projectTitle-${projectItem.dataset.index}" name="projectTitle" value="${project.title || ''}" required>
        </div>
        <div class="form-group">
            <label for="projectDescription-${projectItem.dataset.index}">Description:</label>
            <textarea id="projectDescription-${projectItem.dataset.index}" name="projectDescription" rows="3" required>${project.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label for="projectImage-${projectItem.dataset.index}">Image Path (e.g., assets/sample1.jpg):</label>
            <input type="text" id="projectImage-${projectItem.dataset.index}" name="projectImage" value="${project.image || ''}" required>
        </div>
        <div class="form-group">
            <label for="projectLink-${projectItem.dataset.index}">Sample Link (e.g., samples/sample1.txt):</label>
            <input type="text" id="projectLink-${projectItem.dataset.index}" name="projectLink" value="${project.link || ''}" required>
        </div>
    `;
    projectsContainer.appendChild(projectItem);

    // Add event listener for remove button
    projectItem.querySelector('.remove-button').addEventListener('click', removeField);
}

/**
 * Populates the testimonials section of the form.
 * @param {Array} testimonials - Array of testimonial objects.
 */
function populateTestimonials(testimonials) {
    testimonialsContainer.innerHTML = '';
    testimonials.forEach((testimonial, index) => {
        addTestimonialField(testimonial, index);
    });
}

/**
 * Adds a new testimonial field set to the form.
 * @param {object} testimonial - The testimonial data (optional, for pre-filling).
 * @param {number} index - The index of the testimonial (optional).
 */
function addTestimonialField(testimonial = {}, index = null) {
    const testimonialItem = document.createElement('div');
    testimonialItem.className = 'testimonial-item';
    testimonialItem.dataset.index = index !== null ? index : testimonialsContainer.children.length;

    testimonialItem.innerHTML = `
        <h3>Testimonial ${parseInt(testimonialItem.dataset.index) + 1}</h3>
        <button type="button" class="remove-button" data-type="testimonial">Remove Testimonial</button>
        <div class="form-group">
            <label for="testimonialText-${testimonialItem.dataset.index}">Text:</label>
            <textarea id="testimonialText-${testimonialItem.dataset.index}" name="testimonialText" rows="3" required>${testimonial.text || ''}</textarea>
        </div>
        <div class="form-group">
            <label for="testimonialAuthor-${testimonialItem.dataset.index}">Author:</label>
            <input type="text" id="testimonialAuthor-${testimonialItem.dataset.index}" name="testimonialAuthor" value="${testimonial.author || ''}" required>
        </div>
    `;
    testimonialsContainer.appendChild(testimonialItem);

    // Add event listener for remove button
    testimonialItem.querySelector('.remove-button').addEventListener('click', removeField);
}

/**
 * Handles the removal of a project or testimonial field.
 * @param {Event} event - The click event.
 */
function removeField(event) {
    const button = event.target;
    const parent = button.closest('.project-item') || button.closest('.testimonial-item');
    if (parent) {
        if (confirm('Are you sure you want to remove this item?')) {
            parent.remove();
            // Re-index remaining items to ensure continuity
            reIndexItems(parent.dataset.type);
        }
    }
}

/**
 * Re-indexes project or testimonial items after removal.
 * @param {string} type - 'project' or 'testimonial'.
 */
function reIndexItems(type) {
    const container = type === 'project' ? projectsContainer : testimonialsContainer;
    Array.from(container.children).forEach((item, index) => {
        item.dataset.index = index;
        const h3 = item.querySelector('h3');
        if (h3) {
            h3.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`;
        }
        // Update IDs and for attributes
        item.querySelectorAll('[id^="' + type + '"], [for^="' + type + '"]').forEach(el => {
            const oldId = el.id || el.getAttribute('for');
            if (oldId) {
                const parts = oldId.split('-');
                if (parts.length === 2) {
                    const newId = `${parts[0]}-${index}`;
                    if (el.id) el.id = newId;
                    if (el.getAttribute('for')) el.setAttribute('for', newId);
                }
            }
        });
    });
}


/**
 * Gathers data from the form and updates the portfolioData object.
 * @returns {object} The updated portfolio data.
 */
function getFormData() {
    const data = {
        logo: document.getElementById('logo').value,
        hero: {
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value
        },
        projects: [],
        about: {
            text: document.getElementById('aboutText').value,
            skills: document.getElementById('aboutSkills').value.split(',').map(s => s.trim()).filter(s => s !== '')
        },
        testimonials: [],
        contact: {
            email: document.getElementById('contactEmail').value,
            successMessage: document.getElementById('successMessage').value
        },
        footer: {
            text: document.getElementById('footerText').value
        },
        social: {
            linkedin: document.getElementById('socialLinkedin').value,
            twitter: document.getElementById('socialTwitter').value,
            github: document.getElementById('socialGithub').value
        }
    };

    // Gather project data
    Array.from(projectsContainer.children).forEach(item => {
        const title = item.querySelector('[name="projectTitle"]').value;
        const description = item.querySelector('[name="projectDescription"]').value;
        const image = item.querySelector('[name="projectImage"]').value;
        const link = item.querySelector('[name="projectLink"]').value;
        if (title && description && image && link) {
            data.projects.push({ title, description, image, link });
        }
    });

    // Gather testimonial data
    Array.from(testimonialsContainer.children).forEach(item => {
        const text = item.querySelector('[name="testimonialText"]').value;
        const author = item.querySelector('[name="testimonialAuthor"]').value;
        if (text && author) {
            data.testimonials.push({ text, author });
        }
    });

    return data;
}

/**
 * Saves the updated portfolio data to localStorage and sets a sessionStorage flag.
 */
function saveChanges() {
    portfolioData = getFormData();
    try {
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        sessionStorage.setItem('justUploaded', 'true'); // Flag for main.js to use localStorage
        saveStatusMessage.classList.remove('hidden');
        setTimeout(() => {
            saveStatusMessage.classList.add('hidden');
        }, 3000);
        console.log('Portfolio data saved to localStorage:', portfolioData);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        alert('Could not save data. Local storage might be full or corrupted.');
    }
}

/**
 * Downloads the current portfolio data as a JSON file.
 */
function downloadJson() {
    const data = getFormData(); // Get latest data from form
    const dataStr = JSON.stringify(data, null, 4); // Pretty print JSON
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event Listeners
editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveChanges();
});

addProjectBtn.addEventListener('click', () => addProjectField());
addTestimonialBtn.addEventListener('click', () => addTestimonialField());
downloadJsonBtn.addEventListener('click', downloadJson);

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('portfolioData');
    if (storedData) {
        try {
            portfolioData = JSON.parse(storedData);
            console.log('Loaded data for form from localStorage:', portfolioData);
        } catch (e) {
            console.error('Error parsing localStorage data for form:', e);
            portfolioData = defaultData; // Fallback if localStorage corrupted
        }
    } else {
        // If nothing in localStorage, try to fetch data.json
        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                portfolioData = data;
                console.log('Loaded data for form from data.json:', portfolioData);
                populateForm(portfolioData);
            })
            .catch(error => {
                console.warn('Could not fetch data.json for form:', error);
                console.log('Using default data for form.');
                portfolioData = defaultData; // Fallback if fetch fails
                populateForm(portfolioData);
            });
        return; // Exit here if fetching, populateForm will be called in .then
    }
    populateForm(portfolioData);
});