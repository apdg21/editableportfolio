document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('portfolio-editor-form');
    let portfolioData = {};

    // --- LOAD DATA ---
    function loadDataForForm() {
        const localData = localStorage.getItem('portfolioData');
        if (localData) {
            portfolioData = JSON.parse(localData);
            populateForm();
        } else {
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    portfolioData = data;
                    populateForm();
                })
                .catch(err => console.error('Could not load data.json:', err));
        }
    }

    // --- POPULATE FORM ---
    function populateForm() {
        // Simple fields
        form.querySelector('[name="logo"]').value = portfolioData.logo || '';
        form.querySelector('[name="hero.title"]').value = portfolioData.hero?.title || '';
        form.querySelector('[name="hero.subtitle"]').value = portfolioData.hero?.subtitle || '';
        form.querySelector('[name="hero.buttonText"]').value = portfolioData.hero?.buttonText || '';
        form.querySelector('[name="about.title"]').value = portfolioData.about?.title || '';
        form.querySelector('[name="about.description"]').value = portfolioData.about?.description || '';
        form.querySelector('[name="about.profileImage"]').value = portfolioData.about?.profileImage || '';
        form.querySelector('[name="contact.title"]').value = portfolioData.contact?.title || '';
        form.querySelector('[name="contact.formEmail"]').value = portfolioData.contact?.formEmail || '';
        form.querySelector('[name="footer.copyright"]').value = portfolioData.footer?.copyright || '';
        form.querySelector('[name="social.linkedin"]').value = portfolioData.social?.linkedin || '';
        form.querySelector('[name="social.twitter"]').value = portfolioData.social?.twitter || '';
        form.querySelector('[name="social.github"]').value = portfolioData.social?.github || '';

        // Complex fields: Samples and Testimonials
        renderSampleEditors();
        renderTestimonialEditors();
    }

    function renderSampleEditors() {
        const container = document.getElementById('samples-editor');
        container.innerHTML = '';
        (portfolioData.samples || []).forEach((sample, index) => {
            const group = createEditorGroup('sample', index, sample);
            container.appendChild(group);
        });
    }

    function renderTestimonialEditors() {
        const container = document.getElementById('testimonials-editor');
        container.innerHTML = '';
        (portfolioData.testimonials || []).forEach((testimonial, index) => {
            const group = createEditorGroup('testimonial', index, testimonial);
            container.appendChild(group);
        });
    }

    function createEditorGroup(type, index, data) {
        const div = document.createElement('div');
        div.className = 'editor-group';
        div.dataset.index = index;
        div.dataset.type = type;

        if (type === 'sample') {
            div.innerHTML = `
                <h4>Sample ${index + 1}</h4>
                <label>Title</label><input type="text" name="samples[${index}].title" value="${data.title || ''}">
                <label>Description</label><textarea name="samples[${index}].description">${data.description || ''}</textarea>
                <label>Image Path</label><input type="text" name="samples[${index}].image" value="${data.image || ''}">
                <label>Link to .txt File</label><input type="text" name="samples[${index}].link" value="${data.link || ''}">
            `;
        } else if (type === 'testimonial') {
            div.innerHTML = `
                <h4>Testimonial ${index + 1}</h4>
                <label>Author</label><input type="text" name="testimonials[${index}].author" value="${data.author || ''}">
                <label>Text</label><textarea name="testimonials[${index}].text">${data.text || ''}</textarea>
            `;
        }

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'X';
        removeBtn.addEventListener('click', () => removeGroup(type, index));
        div.appendChild(removeBtn);

        return div;
    }

    // --- ADD/REMOVE ITEMS ---
    document.getElementById('add-sample').addEventListener('click', () => {
        if (!portfolioData.samples) portfolioData.samples = [];
        portfolioData.samples.push({ title: '', description: '', image: '', link: '' });
        renderSampleEditors();
    });

    document.getElementById('add-testimonial').addEventListener('click', () => {
        if (!portfolioData.testimonials) portfolioData.testimonials = [];
        portfolioData.testimonials.push({ author: '', text: '' });
        renderTestimonialEditors();
    });

    function removeGroup(type, index) {
        if (type === 'sample') {
            portfolioData.samples.splice(index, 1);
            renderSampleEditors();
        } else if (type === 'testimonial') {
            portfolioData.testimonials.splice(index, 1);
            renderTestimonialEditors();
        }
    }

    // --- SAVE & DOWNLOAD ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedData = {};

        for (let [key, value] of formData.entries()) {
            // Handle nested keys like "hero.title" and "samples[0].title"
            const keys = key.replace(/\[(\d+)\]/g, '.$1').split('.');
            let current = updatedData;
            keys.forEach((k, i) => {
                if (i === keys.length - 1) {
                    current[k] = value;
                } else {
                    // Check if the next key is a number (array index)
                    const isArray = /^\d+$/.test(keys[i + 1]);
                    if (!current[k]) {
                        current[k] = isArray ? [] : {};
                    }
                    current = current[k];
                }
            });
        }
        
        // Save to local storage
        localStorage.setItem('portfolioData', JSON.stringify(updatedData));
        alert('Portfolio data saved to your browser\'s local storage!');
        portfolioData = updatedData; // Update internal state
    });

    document.getElementById('download-json').addEventListener('click', () => {
        // Trigger form submit to gather latest data first
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

        const dataStr = JSON.stringify(portfolioData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'data.json');
        linkElement.click();
    });

    // --- INITIALIZE ---
    loadDataForForm();
});