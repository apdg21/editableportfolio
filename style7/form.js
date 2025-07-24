document.addEventListener('DOMContentLoaded', () => {
    let data = {
        logo: '',
        hero: { title: '', subtitle: '' },
        projects: [],
        about: { text: '', skills: [] },
        testimonials: [],
        contact: { email: '', successMessage: '' },
        footer: { text: '' },
        social: { linkedin: '', twitter: '', github: '' }
    };

    // Load initial data from localStorage if available, otherwise from data.json
    if (localStorage.getItem('portfolioData')) {
        try {
            data = JSON.parse(localStorage.getItem('portfolioData'));
            populateForm();
        } catch (error) {
            console.error('Error parsing localStorage JSON:', error);
            loadFromJsonFile();
        }
    } else {
        loadFromJsonFile();
    }

    function loadFromJsonFile() {
        fetch('data.json')
            .then(response => response.json())
            .then(json => {
                data = json;
                populateForm();
            })
            .catch(error => console.error('Error loading JSON:', error));
    }

    function populateForm() {
        document.getElementById('logo-text').value = data.logo || '';
        document.getElementById('hero-title').value = data.hero.title || '';
        document.getElementById('hero-subtitle').value = data.hero.subtitle || '';
        document.getElementById('about-text').value = data.about.text || '';
        document.getElementById('skills').value = data.about.skills.join(', ') || '';
        document.getElementById('form-email').value = data.contact.email || '';
        document.getElementById('form-success').value = data.contact.successMessage || '';
        document.getElementById('footer-text').value = data.footer.text || '';
        document.getElementById('social-linkedin').value = data.social.linkedin || '';
        document.getElementById('social-twitter').value = data.social.twitter || '';
        document.getElementById('social-github').value = data.social.github || '';

        updateProjectEditor();
        updateTestimonialEditor();
    }

    function updateProjectEditor() {
        const projectEditor = document.getElementById('project-editor');
        projectEditor.innerHTML = '';
        data.projects.forEach((project, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <label>Title:</label>
                <input type="text" class="project-title" value="${project.title}">
                <label>Description:</label>
                <textarea class="project-desc">${project.description}</textarea>
                <label>Image URL:</label>
                <input type="text" class="project-image" value="${project.image}">
                <label>Sample File URL:</label>
                <input type="text" class="project-link" value="${project.link}">
                <button type="button" class="remove-project" data-index="${index}">Remove</button>
            `;
            projectEditor.appendChild(div);
        });

        document.querySelectorAll('.remove-project').forEach(btn => {
            btn.addEventListener('click', () => {
                data.projects.splice(btn.dataset.index, 1);
                updateProjectEditor();
            });
        });
    }

    function updateTestimonialEditor() {
        const testimonialEditor = document.getElementById('testimonial-editor');
        testimonialEditor.innerHTML = '';
        data.testimonials.forEach((testimonial, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <label>Text:</label>
                <textarea class="testimonial-text">${testimonial.text}</textarea>
                <label>Author:</label>
                <input type="text" class="testimonial-author" value="${testimonial.author}">
                <button type="button" class="remove-testimonial" data-index="${index}">Remove</button>
            `;
            testimonialEditor.appendChild(div);
        });

        document.querySelectorAll('.remove-testimonial').forEach(btn => {
            btn.addEventListener('click', () => {
                data.testimonials.splice(btn.dataset.index, 1);
                updateTestimonialEditor();
            });
        });
    }

    document.getElementById('add-project').addEventListener('click', () => {
        data.projects.push({ title: 'New Sample', description: 'Description', image: 'assets/sample.jpg', link: 'samples/new_sample.txt' });
        updateProjectEditor();
    });

    document.getElementById('add-testimonial').addEventListener('click', () => {
        data.testimonials.push({ text: 'New testimonial', author: 'Author' });
        updateTestimonialEditor();
    });

    document.getElementById('editor-form').addEventListener('submit', (e) => {
        e.preventDefault();
        data.logo = document.getElementById('logo-text').value;
        data.hero.title = document.getElementById('hero-title').value;
        data.hero.subtitle = document.getElementById('hero-subtitle').value;
        data.about.text = document.getElementById('about-text').value;
        data.about.skills = document.getElementById('skills').value.split(',').map(s => s.trim());
        data.contact.email = document.getElementById('form-email').value;
        data.contact.successMessage = document.getElementById('form-success').value;
        data.footer.text = document.getElementById('footer-text').value;
        data.social.linkedin = document.getElementById('social-linkedin').value;
        data.social.twitter = document.getElementById('social-twitter').value;
        data.social.github = document.getElementById('social-github').value;

        document.querySelectorAll('.project-title').forEach((input, i) => {
            data.projects[i].title = input.value;
        });
        document.querySelectorAll('.project-desc').forEach((textarea, i) => {
            data.projects[i].description = textarea.value;
        });
        document.querySelectorAll('.project-image').forEach((input, i) => {
            data.projects[i].image = input.value;
        });
        document.querySelectorAll('.project-link').forEach((input, i) => {
            data.projects[i].link = input.value;
        });

        document.querySelectorAll('.testimonial-text').forEach((textarea, i) => {
            data.testimonials[i].text = textarea.value;
        });
        document.querySelectorAll('.testimonial-author').forEach((input, i) => {
            data.testimonials[i].author = input.value;
        });

        // Save to localStorage for preview
        localStorage.setItem('portfolioData', JSON.stringify(data));
        alert('Changes saved! Download the updated JSON or preview changes.');
    });

    document.getElementById('load-json').addEventListener('click', () => {
        document.getElementById('json-file').click();
    });

    document.getElementById('json-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    data = JSON.parse(event.target.result);
                    localStorage.setItem('portfolioData', JSON.stringify(data)); // Save to localStorage
                    populateForm();
                    alert('JSON loaded successfully!');
                } catch (error) {
                    alert('Invalid JSON file.');
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('download-json').addEventListener('click', () => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Preview functionality
    document.querySelector('.preview-btn').addEventListener('click', () => {
        // Ensure latest data is saved to localStorage before preview
        localStorage.setItem('portfolioData', JSON.stringify(data));
        window.location.href = 'index.html';
    });
});