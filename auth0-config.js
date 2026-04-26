// Auth0 Configuration
// Replace these values with your Auth0 application credentials
const auth0Config = {
    domain: 'YOUR_AUTH0_DOMAIN.auth0.com',
    clientId: 'YOUR_AUTH0_CLIENT_ID',
    authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'YOUR_API_IDENTIFIER', // Optional: only if you're using an API
        scope: 'openid profile email'
    }
};

// Export for use in other files
window.auth0Config = auth0Config;
