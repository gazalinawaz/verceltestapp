// Admin Dashboard JavaScript

// Check admin access on page load
async function checkAdminAccess() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();

        if (!data.isAuthenticated) {
            window.location.href = '/login';
            return false;
        }

        // Check for admin role in claims
        const namespace = 'https://verceltestapp-five.vercel.app';
        const userRoles = data.user[`${namespace}/roles`] || [];
        
        const isAdmin = userRoles.includes('admin');

        if (!isAdmin) {
            document.getElementById('accessDenied').style.display = 'block';
            return false;
        }

        document.getElementById('adminContent').style.display = 'block';
        loadCourses();
        loadCourseCheckboxes();
        return true;

    } catch (error) {
        console.error('Error checking admin access:', error);
        document.getElementById('accessDenied').style.display = 'block';
        return false;
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabs = {
        'courses': 'coursesTab',
        'create': 'createTab',
        'enrollments': 'enrollmentsTab'
    };
    
    document.getElementById(tabs[tabName]).classList.add('active');
    
    // Activate button
    event.target.classList.add('active');
}

// Load courses from localStorage
function loadCourses() {
    const courses = getCoursesCatalog();
    const coursesList = document.getElementById('coursesList');
    
    if (courses.length === 0) {
        coursesList.innerHTML = `
            <div class="empty-state">
                <p>No courses in catalog yet. Create your first course!</p>
            </div>
        `;
        return;
    }
    
    coursesList.innerHTML = courses.map(course => `
        <div class="admin-course-card">
            <div class="course-icon-large">${course.icon}</div>
            <div class="course-details">
                <div class="course-header-row">
                    <h3>${course.title}</h3>
                    <span class="course-badge">${course.level}</span>
                </div>
                <p class="course-id">ID: <code>${course.id}</code></p>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span>⏱️ ${course.duration} hours</span>
                    <span>📚 ${course.lessons} lessons</span>
                </div>
            </div>
            <div class="course-actions">
                <button class="btn btn-secondary btn-sm" onclick="editCourse('${course.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Get courses catalog from localStorage
function getCoursesCatalog() {
    const stored = localStorage.getItem('coursesCatalog');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Default courses
    const defaultCourses = [
        {
            id: 'web-development',
            title: 'Web Development Fundamentals',
            icon: '💻',
            description: 'Learn HTML, CSS, and JavaScript from scratch. Build real-world projects.',
            level: 'Beginner',
            duration: 12,
            lessons: 24
        },
        {
            id: 'react-mastery',
            title: 'React Mastery',
            icon: '⚛️',
            description: 'Master React.js and build modern, scalable web applications.',
            level: 'Intermediate',
            duration: 18,
            lessons: 36
        },
        {
            id: 'node-backend',
            title: 'Node.js Backend Development',
            icon: '🚀',
            description: 'Build powerful backend APIs with Node.js, Express, and databases.',
            level: 'Intermediate',
            duration: 15,
            lessons: 30
        },
        {
            id: 'auth0-security',
            title: 'Auth0 & Application Security',
            icon: '🔐',
            description: 'Implement secure authentication and authorization in your apps.',
            level: 'Advanced',
            duration: 10,
            lessons: 20
        }
    ];
    
    localStorage.setItem('coursesCatalog', JSON.stringify(defaultCourses));
    return defaultCourses;
}

// Save courses catalog to localStorage
function saveCoursesCatalog(courses) {
    localStorage.setItem('coursesCatalog', JSON.stringify(courses));
}

// Create course form submission
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    checkAdminAccess();
    
    const form = document.getElementById('createCourseForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const courseData = {
                id: document.getElementById('courseId').value.trim(),
                title: document.getElementById('courseTitle').value.trim(),
                icon: document.getElementById('courseIcon').value.trim(),
                description: document.getElementById('courseDescription').value.trim(),
                level: document.getElementById('courseLevel').value,
                duration: parseInt(document.getElementById('courseDuration').value),
                lessons: parseInt(document.getElementById('courseLessons').value)
            };
            
            // Validate course ID doesn't exist
            const courses = getCoursesCatalog();
            if (courses.find(c => c.id === courseData.id)) {
                alert('A course with this ID already exists. Please use a different ID.');
                return;
            }
            
            // Add course to catalog
            courses.push(courseData);
            saveCoursesCatalog(courses);
            
            // Save to backend
            try {
                const response = await fetch('/api/admin/courses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courseData)
                });
                
                if (response.ok) {
                    alert('Course created successfully!');
                    form.reset();
                    loadCourses();
                    loadCourseCheckboxes();
                    switchTab('courses');
                } else {
                    alert('Course saved locally but failed to sync with server.');
                }
            } catch (error) {
                console.error('Error creating course:', error);
                alert('Course saved locally. Will sync with server when available.');
            }
        });
    }
    
    // Enrollment form
    const enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('studentEmail').value.trim();
            const selectedCourses = Array.from(document.querySelectorAll('#courseCheckboxes input:checked'))
                .map(cb => cb.value);
            
            if (selectedCourses.length === 0) {
                alert('Please select at least one course.');
                return;
            }
            
            try {
                const response = await fetch('/api/admin/enroll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        courses: selectedCourses
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(`Successfully granted access to ${selectedCourses.length} course(s) for ${email}.\n\nStudent must log out and log back in to see new courses.`);
                    enrollmentForm.reset();
                } else {
                    alert(`Error: ${result.error || 'Failed to grant access'}`);
                }
            } catch (error) {
                console.error('Error granting access:', error);
                alert('Error granting access. Please try again.');
            }
        });
    }
});

// Load course checkboxes for enrollment
function loadCourseCheckboxes() {
    const courses = getCoursesCatalog();
    const container = document.getElementById('courseCheckboxes');
    
    if (!container) return;
    
    container.innerHTML = courses.map(course => `
        <label class="checkbox-label">
            <input type="checkbox" value="${course.id}">
            <span>${course.icon} ${course.title}</span>
        </label>
    `).join('');
}

// Reset form
function resetForm() {
    document.getElementById('createCourseForm').reset();
}

// Edit course (placeholder)
function editCourse(courseId) {
    const courses = getCoursesCatalog();
    const course = courses.find(c => c.id === courseId);
    
    if (!course) return;
    
    // Populate form
    document.getElementById('courseId').value = course.id;
    document.getElementById('courseTitle').value = course.title;
    document.getElementById('courseIcon').value = course.icon;
    document.getElementById('courseDescription').value = course.description;
    document.getElementById('courseLevel').value = course.level;
    document.getElementById('courseDuration').value = course.duration;
    document.getElementById('courseLessons').value = course.lessons;
    
    // Disable ID field (can't change ID)
    document.getElementById('courseId').disabled = true;
    
    // Switch to create tab
    switchTab('create');
}

// Delete course
function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }
    
    const courses = getCoursesCatalog();
    const filtered = courses.filter(c => c.id !== courseId);
    saveCoursesCatalog(filtered);
    loadCourses();
    loadCourseCheckboxes();
    
    alert('Course deleted successfully!');
}
