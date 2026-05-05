// Frontend JavaScript for Regular Web Application
// This replaces the SPA auth.js file

// Check authentication status on page load
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userProfile = document.getElementById('userProfile');
        const gatedContent = document.getElementById('gatedContent');
        
        if (data.isAuthenticated && data.user) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            
            if (userProfile) {
                userProfile.style.display = 'flex';
                document.getElementById('userName').textContent = data.user.name || data.user.email;
                if (data.user.picture) {
                    document.getElementById('userAvatar').src = data.user.picture;
                }
            }
            
            if (gatedContent) {
                gatedContent.style.display = 'block';
            }
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userProfile) userProfile.style.display = 'none';
            if (gatedContent) gatedContent.style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Login function - redirects to server /login route
function login() {
    window.location.href = '/login';
}

// Signup function - redirects to Auth0 signup
function signup() {
    window.location.href = '/login?screen_hint=signup';
}

// Logout function - redirects to server /logout route
function logout() {
    window.location.href = '/logout';
}

// Enroll in course function
async function enrollCourse(courseId) {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.isAuthenticated) {
            // Not logged in - redirect to signup
            alert('Please sign up or log in to enroll in courses!');
            signup();
            return;
        }
        
        // User is logged in - check if they have access
        const namespace = 'https://verceltestapp-five.vercel.app';
        const userCourses = data.user[`${namespace}/courses`] || [];
        
        if (userCourses.includes(courseId)) {
            // Already enrolled - go to my courses
            window.location.href = '/my-courses';
        } else {
            // Need to request enrollment
            alert('Course enrollment requested! An admin will grant you access soon.\n\nFor demo purposes, you can manually add the course claim in Auth0.');
        }
    } catch (error) {
        console.error('Error enrolling in course:', error);
        alert('Error enrolling in course. Please try again.');
    }
}

// Update UI based on authentication
async function updateUIForAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const myCoursesLink = document.getElementById('myCoursesLink');
    const coursesContainer = document.getElementById('coursesContainer');
    const courses = [
        { id: 1, icon: '📚', title: 'Course 1', description: 'This is course 1', level: 'Beginner', duration: 5, lessons: 10 },
        { id: 2, icon: '📊', title: 'Course 2', description: 'This is course 2', level: 'Intermediate', duration: 10, lessons: 20 },
        { id: 3, icon: '📈', title: 'Course 3', description: 'This is course 3', level: 'Advanced', duration: 15, lessons: 30 },
    ];
    
    try {
        coursesContainer.innerHTML = courses.map(course => `
        <div class="course-card" onclick="window.location.href='/course.html?id=${course.id}'" style="cursor: pointer;">
            <div class="course-icon">${course.icon}</div>
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span>📊 ${course.level}</span>
                <span>⏱️ ${course.duration}h</span>
                <span>📖 ${course.lessons} lessons</span>
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e8e8e8;">
                <small style="color: #326891; font-family: monospace;">ID: ${course.id}</small>
            </div>
        </div>
    `).join('');
        
        if (myCoursesLink) {
            myCoursesLink.style.display = 'block';
        }
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    updateUIForAuth();
});
