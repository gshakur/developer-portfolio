document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Authentication Check ---
    const isAuth = localStorage.getItem('gs-admin-auth');
    if (isAuth !== 'true') {
        window.location.href = 'admin-login.html';
    }

    // --- 2. Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-section');

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update visible section
            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === target) {
                    s.classList.add('active');
                }
            });
        });
    });

    // --- 3. Logout ---
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('gs-admin-auth');
        window.location.href = 'admin-login.html';
    });

    // --- 4. Content Persistence (Demo) ---
    // Initialize data if not exists
    if (!localStorage.getItem('gs-projects')) {
        const initialProjects = [
            { id: 1, title: 'Web Development', desc: 'Architecting responsive, accessible, and high-performance digital experiences.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
            { id: 2, title: 'Executive Driving', desc: 'Delivering premium chauffeur services with an unyielding commitment to safety.', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80' },
            { id: 3, title: 'Clerical Operations', desc: 'Ensuring operational excellence through meticulous data management.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80' }
        ];
        localStorage.setItem('gs-projects', JSON.stringify(initialProjects));
    }

    // --- 5. Project Management ---
    const projectsList = document.getElementById('projects-list');
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    const closeModal = document.getElementById('close-modal');
    const addProjectBtn = document.getElementById('add-project-btn');

    function renderProjects() {
        const projects = JSON.parse(localStorage.getItem('gs-projects'));
        document.getElementById('stat-projects').innerText = projects.length;

        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="text-muted">No projects found. Add your first project!</p>';
            return;
        }

        projectsList.innerHTML = projects.map(p => `
            <div class="admin-project-item">
                <img src="${p.image}" alt="${p.title}" class="p-thumb">
                <div class="p-info">
                    <h4>${p.title}</h4>
                    <p class="text-muted">${p.desc.substring(0, 60)}...</p>
                </div>
                <div class="p-actions">
                    <button onclick="editProject(${p.id})"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteProject(${p.id})" class="delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    window.editProject = (id) => {
        const projects = JSON.parse(localStorage.getItem('gs-projects'));
        const project = projects.find(p => p.id === id);
        if (project) {
            document.getElementById('modal-title').innerText = 'Edit Project';
            document.getElementById('project-id').value = project.id;
            document.getElementById('p-title').value = project.title;
            document.getElementById('p-desc').value = project.desc;
            document.getElementById('p-image').value = project.image;
            projectModal.style.display = 'flex';
        }
    };

    window.deleteProject = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            let projects = JSON.parse(localStorage.getItem('gs-projects'));
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem('gs-projects', JSON.stringify(projects));
            renderProjects();
        }
    };

    addProjectBtn.addEventListener('click', () => {
        document.getElementById('modal-title').innerText = 'Add Project';
        projectForm.reset();
        document.getElementById('project-id').value = '';
        projectModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => projectModal.style.display = 'none');

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('project-id').value;
        const title = document.getElementById('p-title').value;
        const desc = document.getElementById('p-desc').value;
        const image = document.getElementById('p-image').value;

        let projects = JSON.parse(localStorage.getItem('gs-projects'));

        if (id) {
            // Update
            const index = projects.findIndex(p => p.id === parseInt(id));
            projects[index] = { id: parseInt(id), title, desc, image };
        } else {
            // Add
            const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
            projects.push({ id: newId, title, desc, image });
        }

        localStorage.setItem('gs-projects', JSON.stringify(projects));
        projectModal.style.display = 'none';
        renderProjects();
    });

    // --- 6. Content Management ---
    const editContentForm = document.getElementById('edit-content-form');
    const aboutLeadInput = document.getElementById('about-lead');
    const aboutBodyInput = document.getElementById('about-body');

    // Load current content
    const savedAbout = JSON.parse(localStorage.getItem('gs-about')) || {
        lead: "A hybrid professional obsessed with pixel-perfect design and flawless execution—whether on the screen or on the road.",
        body: "I bring a unique blend of skills to everything I do. As a web developer, I build scalable, beautiful applications. As a professional driver and clerical officer, I bring a methodical, safety-first, and highly organized approach to operations."
    };

    aboutLeadInput.value = savedAbout.lead;
    aboutBodyInput.value = savedAbout.body;

    editContentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedAbout = {
            lead: aboutLeadInput.value,
            body: aboutBodyInput.value
        };
        localStorage.setItem('gs-about', JSON.stringify(updatedAbout));
        alert('Portfolio content updated successfully!');
    });

    // Initial render
    renderProjects();
});
