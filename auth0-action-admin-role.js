/**
 * Auth0 Action: Add Admin Role Claim
 * 
 * This Action adds the admin role to user tokens if the user has
 * the 'admin' role in their app_metadata.
 * 
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://verceltestapp-five.vercel.app';
  
  // Get user's app_metadata
  const appMetadata = event.user.app_metadata || {};
  
  // Get user roles from app_metadata
  const roles = appMetadata.roles || [];
  
  // Add roles claim to tokens
  if (roles && roles.length > 0) {
    api.idToken.setCustomClaim(`${namespace}/roles`, roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
    
    console.log(`User ${event.user.user_id} has roles:`, roles);
  }
};
