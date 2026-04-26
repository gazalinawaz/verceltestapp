// Frontend JavaScript for Regular Web Application
// This replaces the SPA auth.js file

// Check authentication status on page load
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userProfile = document.getElementById('userProfile');
        const gatedContent = document.getElementById('gatedContent');
        
        if (data.isAuthenticated && data.user) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
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
    
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.isAuthenticated) {
            // Show My Courses link for authenticated users
            if (myCoursesLink) {
                myCoursesLink.style.display = 'block';
            }
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
