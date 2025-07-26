let portfolioData = {};
let currentPage = 1;
const projectsPerPage = 6;

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadData(data) {
    portfolioData = data;
    document.getElementById('siteLogo').textContent = data.siteDetails.logo;
    document.getElementById('heroText').textContent = data.siteDetails.heroText;
    document.getElementById('footerText').textContent = data.siteDetails.footer;
    document.getElementById('aboutText').textContent = data.about.text;
    document.getElementById('profileImage').src = data.about.profileImage || 'https://via.placeholder.com/200';
    document.getElementById('skillsList').innerHTML = data.about.skills.map(skill => `<li>${skill}</li>`).join('');
    document.getElementById('testimonialList').innerHTML = data.testimonials.map(t => `
        <div class="testimonial">
            <p>"${t.text}"</p>
            <p><strong>- ${t.author}</strong></p>
        </div>
    `).join('');
    document.getElementById('socialLinks').innerHTML = Object.entries(data.socialLinks).map(([platform, url]) => `
        <a href="${url}" target="_blank"><i class="fab fa-${platform.toLowerCase()}"></i></a>
    `).join('');
    
    const homeSection = document.getElementById('home');
    if (data.siteDetails.backgroundType === 'color') {
        homeSection.style.backgroundImage = 'none';
        homeSection.style.backgroundColor = data.siteDetails.backgroundValue || '#e6f0fa';
    } else if (data.siteDetails.backgroundType === 'image') {
        homeSection.style.backgroundColor = 'transparent';
        homeSection.style.backgroundImage = `url(${data.siteDetails.backgroundValue || 'https://via.placeholder.com/1200x400'})`;
    }
    
    renderProjects();
}

function renderProjects() {
    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const projects = portfolioData.projects.slice(start, end);
    document.getElementById('projectGrid').innerHTML = projects.map(project => {
        const imageSrc = project.image && project.image.startsWith('assets/') 
            ? project.image 
            : 'https://via.placeholder.com/300';
        if (!project.image) {
            console.warn(`Missing or invalid image for project: ${project.title}`);
        }
        return `
            <div class="project-card">
                <img src="${imageSrc}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/300';">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.linkToCopy}" target="_blank">Read Article</a>
            </div>
        `;
    }).join('');
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(portfolioData.projects.length / projectsPerPage);
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button onclick="changePage(${i})" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
    }
    document.getElementById('pagination').innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderProjects();
}

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! (This is a demo, no actual submission occurs.)');
});

document.getElementById('dataFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem('portfolioData', JSON.stringify(data));
                loadData(data);
            } catch (error) {
                alert('Invalid JSON file');
                console.error('JSON parse error:', error);
            }
        };
        reader.readAsText(file);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
    
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        try {
            loadData(JSON.parse(savedData));
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    } else {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('portfolioData', JSON.stringify(data));
                loadData(data);
            })
            .catch(error => {
                alert('Failed to load default data.json');
                console.error('Fetch error:', error);
            });
    }
});