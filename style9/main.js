let portfolioData = {};
let currentPage = 1;
const projectsPerPage = 6;

// DOM Elements
const loadButtonContainer = document.querySelector('.load-button-wrapper');
const dataFileInput = document.getElementById('loadJsonFile');
const refreshButton = document.createElement('button');

// Core Functions
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadData(data) {
    if (!data) return;
    
    portfolioData = data;
    
    // Update site details
    document.getElementById('siteLogo').textContent = data.siteDetails?.logo || '';
    document.getElementById('heroText').textContent = data.siteDetails?.heroText || '';
    document.getElementById('footerText').textContent = data.siteDetails?.footer || '';
    
    // Update about section
    document.getElementById('aboutText').textContent = data.about?.text || '';
    document.getElementById('profileImage').src = data.about?.profileImage || 'https://via.placeholder.com/200';
    document.getElementById('skillsList').innerHTML = data.about?.skills?.map(skill => `<li>${skill}</li>`).join('') || '';
    
    // Update testimonials
    document.getElementById('testimonialList').innerHTML = data.testimonials?.map(t => `
        <div class="testimonial">
            <p>"${t.text}"</p>
            <p><strong>- ${t.author}</strong></p>
        </div>
    `).join('') || '';
    
    // Update social links
    document.getElementById('socialLinks').innerHTML = data.socialLinks ? Object.entries(data.socialLinks)
        .filter(([_, url]) => url)
        .map(([platform, url]) => `<a href="${url}" target="_blank"><i class="fab fa-${platform.toLowerCase()}"></i></a>`)
        .join('') : '';
    
    // Update background
    const homeSection = document.getElementById('home');
    if (data.siteDetails?.backgroundType === 'image') {
        homeSection.style.backgroundImage = `url(${data.siteDetails.backgroundValue || 'https://via.placeholder.com/1200x400'})`;
        homeSection.style.backgroundColor = 'transparent';
    } else {
        homeSection.style.backgroundImage = 'none';
        homeSection.style.backgroundColor = data.siteDetails?.backgroundValue || '#e6f0fa';
    }
    
    renderProjects();
}

function renderProjects() {
    if (!portfolioData.projects) return;
    
    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const projects = portfolioData.projects.slice(start, end);
    
    document.getElementById('projectGrid').innerHTML = projects.map(project => `
        <div class="project-card">
            <img src="${project.image || 'https://via.placeholder.com/300'}" 
                 alt="${project.title || 'Project'}" 
                 onerror="this.src='https://via.placeholder.com/300'">
            <h3>${project.title || 'Untitled Project'}</h3>
            <p>${project.description || ''}</p>
            ${project.linkToCopy ? `<a href="${project.linkToCopy}" target="_blank">Read Article</a>` : ''}
        </div>
    `).join('');
    
    renderPagination();
}

function renderPagination() {
    if (!portfolioData.projects) return;
    
    const totalPages = Math.ceil(portfolioData.projects.length / projectsPerPage);
    document.getElementById('pagination').innerHTML = Array.from({length: totalPages}, (_, i) => 
        `<button onclick="changePage(${i + 1})" ${i + 1 === currentPage ? 'disabled' : ''}>${i + 1}</button>`
    ).join('');
}

function changePage(page) {
    currentPage = page;
    renderProjects();
}

// Network Functions
function updateNetworkUI() {
    const isOnline = navigator.onLine;
    
    // Show/hide load button
    if (loadButtonContainer) {
        loadButtonContainer.style.display = isOnline ? 'none' : 'block';
    }
    
    // Update refresh button
    if (refreshButton) {
        refreshButton.style.display = isOnline ? 'inline-block' : 'none';
    }
}

function loadFromFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            localStorage.setItem('portfolioData', JSON.stringify(data));
            loadData(data);
        } catch (error) {
            console.error('Error loading file:', error);
            alert('Invalid JSON file. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        localStorage.setItem('portfolioData', JSON.stringify(data));
        loadData(data);
    } catch (error) {
        console.error('Fetch error:', error);
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                loadData(JSON.parse(savedData));
            } catch (parseError) {
                console.error('Error parsing saved data:', parseError);
            }
        }
    }
}

// Event Listeners
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! (This is a demo, no actual submission occurs.)');
});

dataFileInput?.addEventListener('change', (e) => {
    if (e.target.files[0]) loadFromFile(e.target.files[0]);
});

refreshButton.textContent = 'Refresh Data';
refreshButton.style.margin = '10px';
refreshButton.style.display = 'none';
refreshButton.addEventListener('click', fetchData);
document.body.appendChild(refreshButton);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Set up network listeners
    window.addEventListener('online', updateNetworkUI);
    window.addEventListener('offline', updateNetworkUI);
    updateNetworkUI();
    
    // Load data
    if (navigator.onLine) {
        fetchData();
    } else {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                loadData(JSON.parse(savedData));
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }
});