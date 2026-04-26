/**
 * Auth0 Action: Inject Custom Claims
 * 
 * This Action adds Date of Birth and Merryweather ID as custom claims to the ID token and Access token.
 * 
 * Custom claims must use a namespaced format to avoid conflicts with standard OIDC claims.
 * Example namespace: https://merryweather.com/
 * 
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Define custom claim namespace (must be a valid URL format)
  const namespace = 'https://verceltestapp-five.vercel.app';
  
  // Get app metadata (both fields are admin-managed)
  const appMetadata = event.user.app_metadata || {};
  
  // Extract Date of Birth from app_metadata
  const dateOfBirth = appMetadata.dob || null;
  
  // Extract Merryweather ID from app_metadata
  const merrywealtherId = appMetadata.merryweather_id || null;
  
  // Add custom claims to ID token
  if (dateOfBirth) {
    api.idToken.setCustomClaim(`${namespace}/date_of_birth`, dateOfBirth);
  }
  
  if (merrywealtherId) {
    api.idToken.setCustomClaim(`${namespace}/merryweather_id`, merrywealtherId);
  }
  
  // Add custom claims to Access token (if calling APIs)
  if (dateOfBirth) {
    api.accessToken.setCustomClaim(`${namespace}/date_of_birth`, dateOfBirth);
  }
  
  if (merrywealtherId) {
    api.accessToken.setCustomClaim(`${namespace}/merryweather_id`, merrywealtherId);
  }
  
  // Optional: Log for debugging (remove in production)
  console.log('Custom claims added:', {
    user_id: event.user.user_id,
    date_of_birth: dateOfBirth,
    merryweather_id: merrywealtherId
  });
};
