// Auth0 Authentication Handler
let auth0Client = null;

// Initialize Auth0 client
async function initAuth0() {
    try {
        auth0Client = await auth0.createAuth0Client({
            domain: auth0Config.domain,
            clientId: auth0Config.clientId,
            authorizationParams: auth0Config.authorizationParams
        });

        // Check if user is authenticated
        const isAuthenticated = await auth0Client.isAuthenticated();
        
        if (isAuthenticated) {
            await updateUI();
        }

        // Handle redirect callback
        const query = window.location.search;
        if (query.includes('code=') && query.includes('state=')) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, '/');
            await updateUI();
        }
    } catch (error) {
        console.error('Auth0 initialization error:', error);
        showError('Failed to initialize authentication. Please check your Auth0 configuration.');
    }
}

// Login function
async function login() {
    try {
        await auth0Client.loginWithRedirect();
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed. Please try again.');
    }
}

// Logout function
async function logout() {
    try {
        await auth0Client.logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
        showError('Logout failed. Please try again.');
    }
}

// Update UI based on authentication state
async function updateUI() {
    const isAuthenticated = await auth0Client.isAuthenticated();
    
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');
    const gatedContent = document.getElementById('gatedContent');
    
    if (isAuthenticated) {
        // Get user info
        const user = await auth0Client.getUser();
        
        // Show authenticated UI
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        
        // Display user profile
        if (userProfile) {
            userProfile.style.display = 'flex';
            document.getElementById('userName').textContent = user.name || user.email;
            if (user.picture) {
                document.getElementById('userAvatar').src = user.picture;
            }
        }
        
        // Show gated content
        if (gatedContent) {
            gatedContent.style.display = 'block';
        }
        
        console.log('User authenticated:', user);
    } else {
        // Show unauthenticated UI
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'none';
        if (gatedContent) gatedContent.style.display = 'none';
    }
}

// Get access token (useful for API calls)
async function getAccessToken() {
    try {
        const token = await auth0Client.getTokenSilently();
        return token;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize Auth0 when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth0);
