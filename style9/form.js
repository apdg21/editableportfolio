document.addEventListener('DOMContentLoaded', () => {
    const portfolioForm = document.getElementById('portfolioForm');
    const projectsContainer = document.getElementById('projectsContainer');
    const addProjectButton = document.getElementById('addProject');
    const skillsContainer = document.getElementById('skillsContainer');
    const addSkillButton = document.getElementById('addSkill');
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    const addTestimonialButton = document.getElementById('addTestimonial');

    const backgroundTypeColor = document.getElementById('backgroundTypeColor');
    const backgroundTypeImage = document.getElementById('backgroundTypeImage');
    const backgroundValueColorGroup = document.getElementById('backgroundValueColorGroup');
    const backgroundValueImageGroup = document.getElementById('backgroundValueImageGroup');

    const openFilePickerButton = document.getElementById('openFilePicker'); // The visible load button
    const loadJsonFile = document.getElementById('loadJsonFile'); // The hidden file input
    const downloadDataButton = document.getElementById('downloadData');

    // --- Function to Populate the Form Fields with Data ---
    function populateForm(data) {
        // Site Details
        document.getElementById('logo').value = data.siteDetails.logo || '';
        document.getElementById('heroText').value = data.siteDetails.heroText || '';
        document.getElementById('footer').value = data.siteDetails.footer || '';

        if (data.siteDetails.backgroundType === 'image') {
            backgroundTypeImage.checked = true;
            backgroundValueColorGroup.style.display = 'none';
            backgroundValueImageGroup.style.display = 'block';
            document.getElementById('backgroundValueImage').value = data.siteDetails.backgroundValue || '';
        } else {
            backgroundTypeColor.checked = true;
            backgroundValueColorGroup.style.display = 'block';
            backgroundValueImageGroup.style.display = 'none';
            document.getElementById('backgroundValueColor').value = data.siteDetails.backgroundValue || '#e6f0fa';
        }

        // Projects
        projectsContainer.innerHTML = ''; // Clear existing projects
        data.projects.forEach(project => addProject(project));

        // About Me
        document.getElementById('aboutText').value = data.about.text || '';
        skillsContainer.innerHTML = ''; // Clear existing skills
        data.about.skills.forEach(skill => addSkill(skill));
        document.getElementById('profileImage').value = data.about.profileImage || '';

        // Testimonials
        testimonialsContainer.innerHTML = ''; // Clear existing testimonials
        data.testimonials.forEach(testimonial => addTestimonial(testimonial));

        // Social Links
        document.getElementById('twitter').value = data.socialLinks.twitter || '';
        document.getElementById('linkedin').value = data.socialLinks.linkedin || '';
        document.getElementById('medium').value = data.socialLinks.medium || '';
    }

    // --- Handle background type change ---
    function handleBackgroundTypeChange() {
        if (backgroundTypeColor.checked) {
            backgroundValueColorGroup.style.display = 'block';
            backgroundValueImageGroup.style.display = 'none';
        } else {
            backgroundValueColorGroup.style.display = 'none';
            backgroundValueImageGroup.style.display = 'block';
        }
    }
    backgroundTypeColor.addEventListener('change', handleBackgroundTypeChange);
    backgroundTypeImage.addEventListener('change', handleBackgroundTypeChange);


    // --- Functions to Add Dynamic Fields ---
    function addProject(project = {}) {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('array-item', 'project-item');
        projectDiv.innerHTML = `
            <h3>Project</h3>
            <div class="form-group">
                <label>Title:</label>
                <input type="text" class="project-title" value="${project.title || ''}" required>
            </div>
            <div class="form-group">
                <label>Description:</label>
                <textarea class="project-description" required>${project.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Image Path:</label>
                <input type="text" class="project-image" value="${project.image || ''}" placeholder="e.g., assets/project.jpg" required>
            </div>
            <div class="form-group">
                <label>Link to Copy:</label>
                <input type="url" class="project-link" value="${project.linkToCopy || ''}" required>
            </div>
            <button type="button" class="remove-button">Remove Project</button>
        `;
        projectsContainer.appendChild(projectDiv);

        projectDiv.querySelector('.remove-button').addEventListener('click', () => {
            projectDiv.remove();
        });
    }

    function addSkill(skill = '') {
        const skillDiv = document.createElement('div');
        skillDiv.classList.add('skill-item');
        skillDiv.innerHTML = `
            <input type="text" class="skill-input" value="${skill}" required>
            <button type="button" class="remove-button">Remove</button>
        `;
        skillsContainer.appendChild(skillDiv);

        skillDiv.querySelector('.remove-button').addEventListener('click', () => {
            skillDiv.remove();
        });
    }

    function addTestimonial(testimonial = {}) {
        const testimonialDiv = document.createElement('div');
        testimonialDiv.classList.add('array-item', 'testimonial-item');
        testimonialDiv.innerHTML = `
            <h3>Testimonial</h3>
            <div class="form-group">
                <label>Text:</label>
                <textarea class="testimonial-text" required>${testimonial.text || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Author:</label>
                <input type="text" class="testimonial-author" value="${testimonial.author || ''}" required>
            </div>
            <button type="button" class="remove-button">Remove Testimonial</button>
        `;
        testimonialsContainer.appendChild(testimonialDiv);

        testimonialDiv.querySelector('.remove-button').addEventListener('click', () => {
            testimonialDiv.remove();
        });
    }

    // --- Event listeners for "Add" buttons ---
    addProjectButton.addEventListener('click', () => addProject());
    addSkillButton.addEventListener('click', () => addSkill());
    addTestimonialButton.addEventListener('click', () => addTestimonial());

    // --- Load Data Button Logic ---
    // When the visible "Load Data from PC" button is clicked, trigger the hidden file input
    openFilePickerButton.addEventListener('click', () => {
        loadJsonFile.click();
    });

    loadJsonFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);
                populateForm(loadedData);
                alert('Data loaded successfully!');
            } catch (error) {
                console.error('Error parsing JSON file:', error);
                alert('Failed to load JSON file. Please ensure it is a valid JSON format.');
            }
        };
        reader.readAsText(file);
    });


    // --- Download Data Button Logic (now explicitly triggered) ---
    downloadDataButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = {
            siteDetails: {
                logo: document.getElementById('logo').value,
                heroText: document.getElementById('heroText').value,
                footer: document.getElementById('footer').value,
                backgroundType: backgroundTypeColor.checked ? 'color' : 'image',
                backgroundValue: backgroundTypeColor.checked ? document.getElementById('backgroundValueColor').value : document.getElementById('backgroundValueImage').value
            },
            projects: [],
            about: {
                text: document.getElementById('aboutText').value,
                skills: [],
                profileImage: document.getElementById('profileImage').value
            },
            testimonials: [],
            socialLinks: {
                twitter: document.getElementById('twitter').value,
                linkedin: document.getElementById('linkedin').value,
                medium: document.getElementById('medium').value
            }
        };

        // Collect project data
        document.querySelectorAll('.project-item').forEach(item => {
            formData.projects.push({
                title: item.querySelector('.project-title').value,
                description: item.querySelector('.project-description').value,
                image: item.querySelector('.project-image').value,
                linkToCopy: item.querySelector('.project-link').value
            });
        });

        // Collect skills data
        document.querySelectorAll('.skill-input').forEach(input => {
            formData.about.skills.push(input.value);
        });

        // Collect testimonial data
        document.querySelectorAll('.testimonial-item').forEach(item => {
            formData.testimonials.push({
                text: item.querySelector('.testimonial-text').value,
                author: item.querySelector('.testimonial-author').value
            });
        });

        // Create a Blob with the JSON data
        const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger a download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json'; // The name of the downloaded file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the object URL

        alert('Your updated data.json file has been downloaded.');
    });

    // Optionally load default data on initial page load if no file is explicitly chosen yet
    // This provides a starting point if the user doesn't immediately load a file.
    populateForm({
        siteDetails: {
            logo: "Jane Doe | Journalist",
            heroText: "Crafting Stories That Matter",
            footer: "© 2025 Jane Doe. All rights reserved.",
            backgroundType: "color",
            backgroundValue: "#e6f0fa"
        },
        projects: [
            {
                title: "The Rise of Urban Farming",
                description: "An in-depth look at how urban farming is transforming city landscapes.",
                image: "assets/1.jpg",
                linkToCopy: "https://example.com/urban-farming"
            },
            {
                title: "Tech's Impact on Education",
                description: "Exploring how technology is reshaping classrooms worldwide.",
                image: "assets/2.jpg",
                linkToCopy: "https://example.com/tech-education"
            }
        ],
        about: {
            text: "I'm Jane Doe, a passionate journalist with over a decade of experience covering technology, culture, and environmental issues. My work has been featured in leading publications, and I strive to tell stories that inform and inspire.",
            skills: ["Investigative Reporting", "Feature Writing", "SEO", "Editing", "Social Media Strategy"],
            profileImage: "assets/profile.jpg"
        },
        testimonials: [
            {
                text: "Jane's articles are always well-researched and engaging. A true professional!",
                author: "John Smith, Editor at News Daily"
            }
        ],
        socialLinks: {
            twitter: "https://twitter.com/janedoe",
            linkedin: "https://linkedin.com/in/janedoe",
            medium: "https://medium.com/@janedoe"
        }
    });

});
