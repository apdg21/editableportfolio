// main.js
let portfolioData = {};
let currentPage = 1;
const projectsPerPage = 6;

// Initialize UI based on network status
function updateUIForNetworkStatus() {
    const isOnline = navigator.onLine;
    const loadButton = document.querySelector('#loadButtonContainer');
    
    if (loadButton) {
        loadButton.style.display = isOnline ? 'none' : 'block';
    }
    
    // Load data automatically if online
    if (isOnline) {
        fetchData();
    }
}

// Load data from file
function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('portfolioData', JSON.stringify(data));
            loadData(data);
            alert('Data loaded successfully!');
        } catch (error) {
            console.error('Error parsing JSON file:', error);
            alert('Invalid JSON file. Please check the format.');
        }
    };
    reader.readAsText(file);
}

// Fetch data from server
async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        localStorage.setItem('portfolioData', JSON.stringify(data));
        loadData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to cached data if available
        const cachedData = localStorage.getItem('portfolioData');
        if (cachedData) {
            try {
                loadData(JSON.parse(cachedData));
            } catch (parseError) {
                console.error('Error parsing cached data:', parseError);
            }
        }
    }
}

// Main data loading function
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

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set up network status listeners
    window.addEventListener('online', updateUIForNetworkStatus);
    window.addEventListener('offline', updateUIForNetworkStatus);
    
    // Set theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Set up file input listener
    document.getElementById('dataFileInput')?.addEventListener('change', handleFileLoad);
    
    // Initial UI setup
    updateUIForNetworkStatus();
    
    // Load initial data
    if (navigator.onLine) {
        fetchData(); // Automatic load when online
    } else {
        // Try to use cached data when offline
        const cachedData = localStorage.getItem('portfolioData');
        if (cachedData) {
            try {
                loadData(JSON.parse(cachedData));
            } catch (error) {
                console.error('Error loading cached data:', error);
            }
        }
    }
});