// Data Storage (Using LocalStorage)
const storage = {
    departments: JSON.parse(localStorage.getItem('departments')) || [
        { id: '1', enName: 'Computer Science', arName: 'علوم الحاسوب', enHead: 'Dr. John Doe', arHead: 'د. جون دو', credits: 132, students: 450 },
        { id: '2', enName: 'Information Systems', arName: 'نظم المعلومات', enHead: 'Dr. Jane Smith', arHead: 'د. جين سميث', credits: 130, students: 380 }
    ],
    teachers: JSON.parse(localStorage.getItem('teachers')) || [
        { id: 'T01', enName: 'Alice Johnson', arName: 'أليس جونسون', prefix: 'Dr.', degree: 'PhD', deptId: '1' },
        { id: 'T02', enName: 'Bob Wilson', arName: 'بوب ويلسون', prefix: 'Mr.', degree: 'MSc', deptId: '2' }
    ],
    courses: JSON.parse(localStorage.getItem('courses')) || [
        { id: 'CS101', enName: 'Intro to Programming', arName: 'مقدمة في البرمجة', credits: 3, status: 'Active', isActive: true, deptId: '1' },
        { id: 'IS201', enName: 'Database Systems', arName: 'نظم قواعد البيانات', credits: 3, status: 'Active', isActive: true, deptId: '2' }
    ],
    activities: [
        { id: 1, title: 'AI Workshop', date: '2026-02-15', content: 'A workshop on the latest AI trends.', status: 'Read' },
        { id: 2, title: 'Programming Contest', date: '2026-03-10', content: 'Annual coding competition for students.', status: 'Unread' }
    ]
};

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function saveData() {
    localStorage.setItem('departments', JSON.stringify(storage.departments));
    localStorage.setItem('teachers', JSON.stringify(storage.teachers));
    localStorage.setItem('courses', JSON.stringify(storage.courses));
}

// DOM Elements
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');
const themeToggle = document.getElementById('theme-toggle');
const dynamicYear = document.getElementById('dynamic-year');
const userDisplayName = document.getElementById('user-display-name');
const modalOverlay = document.getElementById('modal-overlay');
const dynamicForm = document.getElementById('dynamic-form');
const modalTitle = document.getElementById('modal-title');
const sidebar = document.getElementById('sidebar');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const authItem = document.getElementById('menu-auth-item');
const authText = document.getElementById('auth-text');
const profileItem = document.getElementById('menu-profile-item');
const userAvatar = document.getElementById('user-avatar');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    dynamicYear.textContent = new Date().getFullYear();
    
    updateAuthUI();
    loadPage('home');

    // Sidebar Navigation
    document.querySelectorAll('.menu li').forEach(li => {
        li.addEventListener('click', (e) => {
            const page = li.dataset.page;
            if (!page) return;
            
            if (page === 'logout') {
                handleLogout();
                return;
            }

            document.querySelector('.menu li.active')?.classList.remove('active');
            li.classList.add('active');
            loadPage(page);
            
            // Close sidebar on mobile after click
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggles
    mobileMenuToggle.addEventListener('click', () => sidebar.classList.add('active'));
    closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> <span class="theme-text">Light Mode</span>' : '<i class="fas fa-moon"></i> <span class="theme-text">Dark Mode</span>';
    });

    // Modal Close
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => modalOverlay.classList.remove('show'));
    });
});

function updateAuthUI() {
    if (currentUser) {
        authText.textContent = 'Logout';
        authItem.dataset.page = 'logout';
        profileItem.style.display = 'block';
        userDisplayName.textContent = currentUser.student_En_Name;
        if (currentUser.profilePhoto) {
            userAvatar.innerHTML = `<img src="${currentUser.profilePhoto}" alt="Profile">`;
        } else {
            userAvatar.textContent = currentUser.student_En_Name.charAt(0);
        }
    } else {
        authText.textContent = 'Login';
        authItem.dataset.page = 'login';
        profileItem.style.display = 'none';
        userDisplayName.textContent = 'Guest';
        userAvatar.innerHTML = 'IT';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    alert('Logged out successfully.');
    loadPage('home');
}

// Page Router
function loadPage(page, params = {}) {
    contentArea.innerHTML = '';
    switch(page) {
        case 'home': renderHome(); break;
        case 'activities': renderActivities(); break;
        case 'departments': renderDepartments(); break;
        case 'teachers': renderTeachers(params.deptId); break;
        case 'courses': renderCourses(params.deptId); break;
        case 'about': renderAbout(); break;
        case 'contact': renderContact(); break;
        case 'register': renderRegister(); break;
        case 'login': renderLogin(); break;
        case 'profile': renderProfile(currentUser); break;
    }
}

// --- Render Functions ---

function renderHome() {
    pageTitle.textContent = 'Dashboard Home';
    contentArea.innerHTML = `
        <div class="welcome-section">
            <h2>Welcome to IT College Portal</h2>
            <p>Manage your departments, courses, and teachers efficiently.</p>
            <div class="grid-container">
                <div class="card"><h3>${storage.departments.length}</h3><p>Departments</p></div>
                <div class="card"><h3>${storage.teachers.length}</h3><p>Teachers</p></div>
                <div class="card"><h3>${storage.courses.length}</h3><p>Courses</p></div>
            </div>
        </div>
    `;
}

function renderDepartments() {
    pageTitle.textContent = 'Departments';
    let html = `
        <div class="action-bar" style="margin-bottom: 20px;">
            <button class="btn-primary" onclick="showAddModal('department')"><i class="fas fa-plus"></i> Add Department</button>
        </div>
        <div class="grid-container">`;
    
    storage.departments.forEach(dept => {
        html += `
            <div class="card" id="dept-${dept.id}">
                <div class="card-header">
                    <h3 class="card-title">${dept.enName}</h3>
                    <button class="context-menu-btn" onclick="toggleContextMenu('menu-${dept.id}')"><i class="fas fa-ellipsis-v"></i></button>
                    <div id="menu-${dept.id}" class="context-menu">
                        <button onclick="showEditModal('department', '${dept.id}')">Edit</button>
                        <button onclick="loadPage('teachers', {deptId: '${dept.id}'})">Teachers</button>
                        <button onclick="loadPage('courses', {deptId: '${dept.id}'})">Courses</button>
                        <button onclick="deleteItem('department', '${dept.id}')" style="color: var(--danger)">Delete</button>
                    </div>
                </div>
                <div class="card-content">
                    <p><strong>Head:</strong> ${dept.enHead}</p>
                    <p><strong>Credits:</strong> ${dept.credits}</p>
                </div>
                <div class="card-footer">
                    <span><i class="fas fa-users"></i> ${dept.students} Students</span>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    contentArea.innerHTML = html;
}

function renderTeachers(deptId) {
    const dept = storage.departments.find(d => d.id === deptId);
    pageTitle.textContent = dept ? `Teachers - ${dept.enName}` : 'All Teachers';
    
    let teachers = deptId ? storage.teachers.filter(t => t.deptId === deptId) : storage.teachers;
    
    let html = `
        <div class="action-bar" style="margin-bottom: 20px; display: flex; gap: 10px;">
            <button class="btn-secondary" onclick="loadPage('departments')"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="btn-primary" onclick="showAddModal('teacher', '${deptId}')"><i class="fas fa-plus"></i> Add Teacher</button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name (EN)</th>
                        <th>Name (AR)</th>
                        <th>Prefix</th>
                        <th>Degree</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;
    
    teachers.forEach(t => {
        html += `
            <tr>
                <td>${t.id}</td>
                <td>${t.enName}</td>
                <td>${t.arName}</td>
                <td>${t.prefix}</td>
                <td>${t.degree}</td>
                <td class="action-btns">
                    <button class="btn-icon btn-edit" onclick="showEditModal('teacher', '${t.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteItem('teacher', '${t.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table></div>`;
    contentArea.innerHTML = html;
}

function renderCourses(deptId) {
    const dept = storage.departments.find(d => d.id === deptId);
    pageTitle.textContent = dept ? `Courses - ${dept.enName}` : 'All Courses';
    
    let courses = deptId ? storage.courses.filter(c => c.deptId === deptId) : storage.courses;
    
    let html = `
        <div class="action-bar" style="margin-bottom: 20px; display: flex; gap: 10px;">
            <button class="btn-secondary" onclick="loadPage('departments')"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="btn-primary" onclick="showAddModal('course', '${deptId}')"><i class="fas fa-plus"></i> Add Course</button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name (EN)</th>
                        <th>Credits</th>
                        <th>Status</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;
    
    courses.forEach(c => {
        html += `
            <tr>
                <td>${c.id}</td>
                <td>${c.enName}</td>
                <td>${c.credits}</td>
                <td>${c.status}</td>
                <td>${c.isActive ? 'Yes' : 'No'}</td>
                <td class="action-btns">
                    <button class="btn-icon btn-edit" onclick="showEditModal('course', '${c.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteItem('course', '${c.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table></div>`;
    contentArea.innerHTML = html;
}

function renderActivities() {
    pageTitle.textContent = 'College Activities & News';
    let html = `<div class="grid-container">`;
    storage.activities.forEach(act => {
        html += `
            <div class="card" id="act-${act.id}">
                <div class="card-header">
                    <span class="badge">${act.status}</span>
                    <button class="context-menu-btn" onclick="toggleContextMenu('act-menu-${act.id}')"><i class="fas fa-ellipsis-v"></i></button>
                    <div id="act-menu-${act.id}" class="context-menu">
                        <button onclick="alert('Details: ${act.content}')">Detail</button>
                        <button onclick="deleteActivity(${act.id})">Delete</button>
                        <button onclick="updateActivityStatus(${act.id}, 'Read')">Read</button>
                        <button onclick="updateActivityStatus(${act.id}, 'Unread')">Unread</button>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${act.title}</h3>
                    <p>${act.content}</p>
                </div>
                <div class="card-footer">
                    <span><i class="fas fa-calendar"></i> ${act.date}</span>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    contentArea.innerHTML = html;
}

// --- CRUD Logic ---

function toggleContextMenu(id) {
    document.querySelectorAll('.context-menu').forEach(m => {
        if(m.id !== id) m.classList.remove('show');
    });
    document.getElementById(id).classList.toggle('show');
}

function showAddModal(type, parentId = null) {
    modalTitle.textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    generateFormFields(type, null, parentId);
    modalOverlay.classList.add('show');
}

function showEditModal(type, id) {
    modalTitle.textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const item = storage[type + 's'].find(i => i.id === id);
    generateFormFields(type, item);
    modalOverlay.classList.add('show');
}

function generateFormFields(type, item = null, parentId = null) {
    let fields = '';
    if (type === 'department') {
        fields = `
            <input type="hidden" name="type" value="department">
            <div class="form-group"><label>ID</label><input type="text" name="id" value="${item ? item.id : ''}" required ${item ? 'readonly' : ''}></div>
            <div class="form-group"><label>Name (EN)</label><input type="text" name="enName" value="${item ? item.enName : ''}" required></div>
            <div class="form-group"><label>Name (AR)</label><input type="text" name="arName" value="${item ? item.arName : ''}" required></div>
            <div class="form-group"><label>Head (EN)</label><input type="text" name="enHead" value="${item ? item.enHead : ''}" required></div>
            <div class="form-group"><label>Head (AR)</label><input type="text" name="arHead" value="${item ? item.arHead : ''}" required></div>
            <div class="form-group"><label>Total Credits</label><input type="number" name="credits" value="${item ? item.credits : ''}" required></div>
        `;
    } else if (type === 'teacher') {
        fields = `
            <input type="hidden" name="type" value="teacher">
            <input type="hidden" name="deptId" value="${item ? item.deptId : parentId}">
            <div class="form-group"><label>ID</label><input type="text" name="id" value="${item ? item.id : ''}" required ${item ? 'readonly' : ''}></div>
            <div class="form-group"><label>Name (EN)</label><input type="text" name="enName" value="${item ? item.enName : ''}" required></div>
            <div class="form-group"><label>Name (AR)</label><input type="text" name="arName" value="${item ? item.arName : ''}" required></div>
            <div class="form-group"><label>Prefix</label><input type="text" name="prefix" value="${item ? item.prefix : ''}" required></div>
            <div class="form-group"><label>Degree</label><input type="text" name="degree" value="${item ? item.degree : ''}" required></div>
        `;
    } else if (type === 'course') {
        fields = `
            <input type="hidden" name="type" value="course">
            <input type="hidden" name="deptId" value="${item ? item.deptId : parentId}">
            <div class="form-group"><label>ID</label><input type="text" name="id" value="${item ? item.id : ''}" required ${item ? 'readonly' : ''}></div>
            <div class="form-group"><label>Name (EN)</label><input type="text" name="enName" value="${item ? item.enName : ''}" required></div>
            <div class="form-group"><label>Name (AR)</label><input type="text" name="arName" value="${item ? item.arName : ''}" required></div>
            <div class="form-group"><label>Credits</label><input type="number" name="credits" value="${item ? item.credits : ''}" required></div>
            <div class="form-group"><label>Status</label><input type="text" name="status" value="${item ? item.status : ''}" required></div>
            <div class="form-group"><label>Is Active</label><select name="isActive"><option value="true" ${item && item.isActive ? 'selected' : ''}>Yes</option><option value="false" ${item && !item.isActive ? 'selected' : ''}>No</option></select></div>
        `;
    }
    dynamicForm.innerHTML = fields;
}

dynamicForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(dynamicForm);
    const data = Object.fromEntries(formData.entries());
    const type = data.type;
    delete data.type;
    
    if (data.isActive) data.isActive = data.isActive === 'true';
    
    const list = storage[type + 's'];
    const index = list.findIndex(i => i.id === data.id);
    
    if (index > -1) {
        list[index] = { ...list[index], ...data };
    } else {
        if (type === 'department') data.students = 0;
        list.push(data);
    }
    
    saveData();
    modalOverlay.classList.remove('show');
    
    if (type === 'department') renderDepartments();
    else if (type === 'teacher') renderTeachers(data.deptId);
    else if (type === 'course') renderCourses(data.deptId);
};

function deleteItem(type, id) {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        const listName = type + 's';
        const item = storage[listName].find(i => i.id === id);
        const deptId = item.deptId;
        
        storage[listName] = storage[listName].filter(i => i.id !== id);
        saveData();
        
        if (type === 'department') renderDepartments();
        else if (type === 'teacher') renderTeachers(deptId);
        else if (type === 'course') renderCourses(deptId);
    }
}

// Activity specific functions
function deleteActivity(id) {
    storage.activities = storage.activities.filter(a => a.id !== id);
    renderActivities();
}

function updateActivityStatus(id, status) {
    const act = storage.activities.find(a => a.id === id);
    if (act) act.status = status;
    renderActivities();
}

// --- Other Pages ---

function renderAbout() {
    pageTitle.textContent = 'About US';
    contentArea.innerHTML = `
        <article class="card">
            <h2>About IT College</h2>
            <p>The IT College is dedicated to providing world-class education in computer science and information systems.</p>
            <section>
                <h3>Our Mission</h3>
                <p>To empower students with technical skills and innovative thinking.</p>
            </section>
        </article>
    `;
}

function renderContact() {
    pageTitle.textContent = 'Contact US';
    contentArea.innerHTML = `
        <div class="contact-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
            <div class="card">
                <form id="contact-form" onsubmit="event.preventDefault(); alert('It has been sent.');">
                    <div class="form-group">
                        <label>Contact Name</label>
                        <input type="text" pattern="[A-Za-z ]+" title="Alphabetic characters and spaces only" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" required>
                    </div>
                    <div class="form-group">
                        <label>Message</label>
                        <textarea rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Send Message</button>
                </form>
            </div>
            <div class="card">
                <h3>Our Location</h3>
                <div class="map-container">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        style="border:0" 
                        src="https://maps.app.goo.gl/RGqZQrXnEp9SALG59" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>
    `;
}

function renderRegister() {
    pageTitle.textContent = 'Student Register';
    contentArea.innerHTML = `
        <div class="card" style="max-width: 800px;">
            <form id="register-form" onsubmit="handleRegister(event)">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group"><label>Student ID</label><input type="text" name="student_ID" required></div>
                    <div class="form-group"><label>Email</label><input type="email" name="student_Email" required></div>
                    <div class="form-group"><label>Name (EN)</label><input type="text" name="student_En_Name" required></div>
                    <div class="form-group"><label>Name (AR)</label><input type="text" name="student_Arb_Name" required></div>
                    <div class="form-group"><label>Password</label><input type="password" name="student_Password" required></div>
                    <div class="form-group"><label>Phone</label><input type="tel" name="student_phone" required></div>
                    <div class="form-group">
                        <label>Department</label>
                        <select name="student_department_Name">
                            ${storage.departments.map(d => `<option value="${d.enName}">${d.enName}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>Birthdate</label><input type="date" name="student_BoD" required></div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label>Profile Photo</label>
                        <input type="file" id="profile-photo-input" accept="image/*">
                    </div>
                </div>
                <button type="submit" class="btn-primary">Register Student</button>
            </form>
        </div>
    `;
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const student = Object.fromEntries(formData.entries());
    
    const photoInput = document.getElementById('profile-photo-input');
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            student.profilePhoto = event.target.result;
            localStorage.setItem(`student_${student.student_ID}`, JSON.stringify(student));
            alert('Student Registered Successfully! Redirecting to Login.');
            loadPage('login');
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        localStorage.setItem(`student_${student.student_ID}`, JSON.stringify(student));
        alert('Student Registered Successfully! Redirecting to Login.');
        loadPage('login');
    }
}

function renderLogin() {
    pageTitle.textContent = 'Login';
    contentArea.innerHTML = `
        <div class="card" style="max-width: 400px; margin: 0 auto;">
            <form onsubmit="handleLogin(event)">
                <div class="form-group"><label>Student ID</label><input type="text" id="login-id" required></div>
                <div class="form-group"><label>Password</label><input type="password" id="login-pass" required></div>
                <button type="submit" class="btn-primary" style="width: 100%;">Login</button>
            </form>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    const studentData = localStorage.getItem(`student_${id}`);
    
    if (studentData) {
        const student = JSON.parse(studentData);
        if (student.student_Password === pass) {
            currentUser = student;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            alert('Login Successful!');
            loadPage('profile');
            return;
        }
    }
    alert('Invalid Credentials. Redirecting to Home.');
    loadPage('home');
}

function renderProfile(student) {
    if (!student) {
        loadPage('login');
        return;
    }
    pageTitle.textContent = 'Student Profile';
    contentArea.innerHTML = `
        <div class="card">
            <div style="display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
                <div class="profile-circle" style="width: 120px; height: 120px; font-size: 3rem;">
                    ${student.profilePhoto ? `<img src="${student.profilePhoto}" alt="Profile">` : student.student_En_Name.charAt(0)}
                </div>
                <div style="flex: 1; min-width: 250px;">
                    <h2>${student.student_En_Name}</h2>
                    <p><strong>ID:</strong> ${student.student_ID}</p>
                    <p><strong>Department:</strong> ${student.student_department_Name}</p>
                    <p><strong>Email:</strong> ${student.student_Email}</p>
                    <p><strong>Phone:</strong> ${student.student_phone}</p>
                    <p><strong>Birthdate:</strong> ${student.student_BoD}</p>
                </div>
                <div style="width: 100%; margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 20px;">
                    <button class="btn-danger" onclick="deleteAccount('${student.student_ID}')">Delete My Account</button>
                </div>
            </div>
        </div>
    `;
}

function deleteAccount(id) {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        localStorage.removeItem(`student_${id}`);
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
        alert('Account deleted successfully.');
        loadPage('home');
    }
}
