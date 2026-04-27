// Admin Dashboard JavaScript

// Generate unique course ID from title
function generateCourseId(title) {
    // Convert title to lowercase, remove special chars, replace spaces with hyphens
    let baseId = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
    
    // Get existing courses to find next sequence number
    const courses = getCoursesCatalog();
    const existingIds = courses.map(c => c.id);
    
    // If base ID doesn't exist, use it
    if (!existingIds.includes(baseId)) {
        return baseId;
    }
    
    // Find next available sequence number
    let sequence = 1;
    let uniqueId = `${baseId}-${sequence}`;
    
    while (existingIds.includes(uniqueId)) {
        sequence++;
        uniqueId = `${baseId}-${sequence}`;
    }
    
    return uniqueId;
}

// Update course ID preview as user types title
function updateCourseIdPreview() {
    const titleInput = document.getElementById('courseTitle');
    const idInput = document.getElementById('courseId');
    
    if (titleInput && idInput && titleInput.value.trim()) {
        const generatedId = generateCourseId(titleInput.value.trim());
        idInput.value = generatedId;
        idInput.style.color = '#326891';
        idInput.style.fontWeight = '600';
    } else if (idInput) {
        idInput.value = '';
        idInput.placeholder = 'Will be generated automatically...';
    }
}

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
    console.log('📚 Loading courses...');
    const courses = getCoursesCatalog();
    const coursesList = document.getElementById('coursesList');
    
    console.log('📊 Found', courses.length, 'courses');
    
    if (!coursesList) {
        console.error('❌ coursesList element not found!');
        return;
    }
    
    if (courses.length === 0) {
        console.log('ℹ️ No courses to display');
        coursesList.innerHTML = `
            <div class="empty-state">
                <p>No courses in catalog yet. Create your first course!</p>
            </div>
        `;
        return;
    }
    
    console.log('✅ Rendering', courses.length, 'courses');
    coursesList.innerHTML = courses.map(course => `
        <div class="course-card">
            <div class="course-icon">${course.icon}</div>
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span>📊 ${course.level}</span>
                <span>⏱️ ${course.duration}h</span>
                <span>📖 ${course.lessons} lessons</span>
            </div>
            <div style="margin: 1rem 0; padding: 0.75rem; background: #f4f4f4; border-radius: 4px;">
                <strong>Course URL:</strong><br>
                <a href="/course.html?id=${course.id}" target="_blank" style="color: #326891; font-family: monospace; font-size: 0.9rem;">
                    /course?id=${course.id}
                </a>
            </div>
            <div class="course-actions">
                <button class="btn btn-sm btn-primary" onclick="window.open('/course.html?id=${course.id}', '_blank')">View</button>
                <button class="btn btn-sm btn-primary" onclick="editCourse('${course.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course.id}')">Delete</button>
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
    
    // Add event listener to course title for auto-generating ID
    const courseTitleInput = document.getElementById('courseTitle');
    if (courseTitleInput) {
        courseTitleInput.addEventListener('input', updateCourseIdPreview);
    }
    
    const form = document.getElementById('createCourseForm');
    if (form) {
        console.log('✅ Create course form found, adding submit listener');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📝 Form submitted');
            
            // Generate course ID if not already set
            let courseId = document.getElementById('courseId').value.trim();
            if (!courseId) {
                courseId = generateCourseId(document.getElementById('courseTitle').value.trim());
                document.getElementById('courseId').value = courseId;
                console.log('🆔 Generated course ID:', courseId);
            } else {
                console.log('🆔 Using existing course ID:', courseId);
            }
            
            const courseData = {
                id: courseId,
                title: document.getElementById('courseTitle').value.trim(),
                icon: document.getElementById('courseIcon').value.trim(),
                description: document.getElementById('courseDescription').value.trim(),
                level: document.getElementById('courseLevel').value,
                duration: parseInt(document.getElementById('courseDuration').value),
                lessons: parseInt(document.getElementById('courseLessons').value)
            };
            
            console.log('📦 Course data:', courseData);
            
            // Validate course ID doesn't exist
            const courses = getCoursesCatalog();
            console.log('📚 Existing courses:', courses.length);
            
            if (courses.find(c => c.id === courseData.id)) {
                console.error('❌ Duplicate course ID:', courseData.id);
                alert('A course with this ID already exists. Please use a different ID.');
                return;
            }
            
            // Add course to catalog
            courses.push(courseData);
            saveCoursesCatalog(courses);
            console.log('💾 Course saved to localStorage');
            console.log('📚 Total courses now:', courses.length);
            
            // Save to backend
            try {
                console.log('🌐 Attempting to save to backend...');
                const response = await fetch('/api/admin/courses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courseData)
                });
                
                if (response.ok) {
                    console.log('✅ Backend save successful');
                    alert('Course created successfully!');
                    resetForm();
                    loadCourses();
                    loadCourseCheckboxes();
                    switchTab('courses');
                } else {
                    console.warn('⚠️ Backend save failed, but localStorage save succeeded');
                    alert('Course saved locally but failed to sync with server.');
                    loadCourses();
                    loadCourseCheckboxes();
                    switchTab('courses');
                }
            } catch (error) {
                console.error('❌ Backend error:', error);
                console.log('✅ Course still saved to localStorage');
                alert('Course saved locally. Will sync with server when available.');
                loadCourses();
                loadCourseCheckboxes();
                switchTab('courses');
            }
        });
    } else {
        console.error('❌ Create course form NOT found!');
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
    // Clear auto-generated course ID
    const courseIdField = document.getElementById('courseId');
    if (courseIdField) {
        courseIdField.value = '';
        courseIdField.placeholder = 'Will be generated automatically...';
        courseIdField.style.color = '';
        courseIdField.style.fontWeight = '';
    }
    console.log('Form reset');
}

// Edit course
function editCourse(courseId) {
    console.log('📝 Editing course:', courseId);
    
    const courses = getCoursesCatalog();
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        console.error('Course not found:', courseId);
        return;
    }
    
    // Create a full course draft for the course builder
    // Check if there's already a draft with full data
    const existingDraft = localStorage.getItem('courseDraft');
    let fullCourseDraft;
    
    if (existingDraft) {
        try {
            const draft = JSON.parse(existingDraft);
            if (draft.id === courseId) {
                // Use existing draft if it's for the same course
                fullCourseDraft = draft;
                console.log('✅ Using existing draft');
            } else {
                // Create new draft from catalog data
                fullCourseDraft = createCourseDraftFromCatalog(course);
            }
        } catch (e) {
            fullCourseDraft = createCourseDraftFromCatalog(course);
        }
    } else {
        fullCourseDraft = createCourseDraftFromCatalog(course);
    }
    
    // Save draft to localStorage
    localStorage.setItem('courseDraft', JSON.stringify(fullCourseDraft));
    console.log('💾 Course draft saved for editing');
    
    // Redirect to course builder
    window.location.href = '/course-builder';
}

// Helper function to create a full course draft from catalog data
function createCourseDraftFromCatalog(catalogCourse) {
    return {
        id: catalogCourse.id,
        title: catalogCourse.title,
        subtitle: catalogCourse.description || '',
        description: catalogCourse.description || '',
        category: 'development',
        objectives: [],
        thumbnail: null,
        level: catalogCourse.level || 'Beginner',
        language: 'English',
        icon: catalogCourse.icon || '📚',
        lessons: [], // Will be populated in course builder
        pricing: { type: 'free', price: 0 },
        settings: {
            certificate: false,
            discussions: false,
            published: false
        }
    };
}

// Delete course
function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }
    
    console.log('🗑️ Deleting course:', courseId);
    
    const courses = getCoursesCatalog();
    const filtered = courses.filter(c => c.id !== courseId);
    saveCoursesCatalog(filtered);
    
    // Also clear draft if it matches deleted course
    try {
        const draft = localStorage.getItem('courseDraft');
        if (draft) {
            const draftCourse = JSON.parse(draft);
            if (draftCourse.id === courseId) {
                localStorage.removeItem('courseDraft');
                console.log('✅ Cleared draft for deleted course');
            }
        }
    } catch (e) {
        console.error('Error clearing draft:', e);
    }
    
    loadCourses();
    loadCourseCheckboxes();
    
    console.log('✅ Course deleted successfully');
    alert('Course deleted successfully!');
}
