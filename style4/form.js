// ===== Constants =====
const form = document.getElementById('editor-form');
const sampleContainer = document.getElementById('samples-container');
const testimonialContainer = document.getElementById('testimonials-container');

let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || {
  logo: '',
  hero: '',
  about: '',
  samples: [],
  testimonials: [],
  contact: '',
  footer: '',
  social: {
    linkedin: '',
    twitter: '',
    github: ''
  }
};

// ===== Helper Functions =====
function createSampleCard(sample = {}) {
  const div = document.createElement('div');
  div.className = 'sample-edit';
  div.innerHTML = `
    <input type="text" placeholder="Title" value="${sample.title || ''}" />
    <input type="text" placeholder="Description" value="${sample.description || ''}" />
    <input type="text" placeholder="Image filename" value="${sample.image || ''}" />
    <input type="text" placeholder="Video/Text filename" value="${sample.link || ''}" />
    <button type="button" class="remove-sample">Remove</button>
  `;
  div.querySelector('.remove-sample').onclick = () => div.remove();
  sampleContainer.appendChild(div);
}

function createTestimonialCard(t = {}) {
  const div = document.createElement('div');
  div.className = 'testimonial-edit';
  div.innerHTML = `
    <textarea placeholder="Quote">${t.quote || ''}</textarea>
    <input type="text" placeholder="Author" value="${t.author || ''}" />
    <button type="button" class="remove-testimonial">Remove</button>
  `;
  div.querySelector('.remove-testimonial').onclick = () => div.remove();
  testimonialContainer.appendChild(div);
}

// ===== Populate Form Fields =====
function loadForm() {
  form.logo.value = portfolioData.logo;
  form.hero.value = portfolioData.hero;
  form.about.value = portfolioData.about;
  form.contact.value = portfolioData.contact;
  form.footer.value = portfolioData.footer;
  form.linkedin.value = portfolioData.social.linkedin;
  form.twitter.value = portfolioData.social.twitter;
  form.github.value = portfolioData.social.github;

  sampleContainer.innerHTML = '';
  portfolioData.samples.forEach(createSampleCard);

  testimonialContainer.innerHTML = '';
  portfolioData.testimonials.forEach(createTestimonialCard);
}

// ===== Collect Form Data =====
function collectFormData() {
  return {
    logo: form.logo.value,
    hero: form.hero.value,
    about: form.about.value,
    contact: form.contact.value,
    footer: form.footer.value,
    samples: [...sampleContainer.children].map(div => ({
      title: div.children[0].value,
      description: div.children[1].value,
      image: div.children[2].value,
      link: div.children[3].value
    })),
    testimonials: [...testimonialContainer.children].map(div => ({
      quote: div.children[0].value,
      author: div.children[1].value
    })),
    social: {
      linkedin: form.linkedin.value,
      twitter: form.twitter.value,
      github: form.github.value
    }
  };
}

// ===== Save to localStorage =====
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = collectFormData();
  localStorage.setItem('portfolioData', JSON.stringify(data));
  alert('Portfolio data saved to localStorage!');
});

// ===== Add Sample/Testimonial =====
document.getElementById('add-sample').addEventListener('click', () => createSampleCard());
document.getElementById('add-testimonial').addEventListener('click', () => createTestimonialCard());

// ===== Download JSON =====
document.getElementById('download-json').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(collectFormData(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
});

// ===== Upload JSON File =====
document.getElementById('upload-json').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      portfolioData = JSON.parse(evt.target.result);
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
      loadForm();
    } catch {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
});

// ===== Init =====
loadForm();
