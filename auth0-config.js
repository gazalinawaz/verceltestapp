// Auth0 Configuration
// Replace these values with your Auth0 application credentials
const auth0Config = {
    domain: 'jade-swan-94501.cic-demo-platform.auth0app.com',
    clientId: 'fkatvoAkZ8TkLNykQTFildt9VBk7D1cb',
    authorizationParams: {
        redirect_uri: window.location.origin,
        scope: 'openid profile email'
    }
};

// Export for use in other files
window.auth0Config = auth0Config;
