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

// Logout function - redirects to server /logout route
function logout() {
    window.location.href = '/logout';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);
