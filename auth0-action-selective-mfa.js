/**
 * Auth0 Action: Selective MFA for External Users
 * 
 * This Action prompts for Multi-Factor Authentication (MFA) only for users
 * authenticating via Username-Password connection (external users).
 * 
 * Users from other connections (e.g., social logins, enterprise SSO) will skip MFA.
 * 
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Get the connection name the user is authenticating with
  const connection = event.connection.name;
  
  // Define the Username-Password connection ID/name
  const usernamePasswordConnection = 'MerryweatherDB';
  
  // Check if user is authenticating via Username-Password connection
  if (connection === usernamePasswordConnection) {
    // Require MFA for external users (UN/PW connection)
    api.multifactor.enable('any', { allowRememberBrowser: false });
    
    // Optional: Log for debugging
    console.log(`MFA required for user ${event.user.user_id} via connection: ${connection}`);
  } else {
    // Skip MFA for other connections (social, enterprise, etc.)
    console.log(`MFA skipped for user ${event.user.user_id} via connection: ${connection}`);
  }
};
