/**
 * Auth0 Action: Grant Course Access on Registration
 * 
 * This Action automatically grants new users access to a starter course
 * when they first register. Additional courses can be granted by admins
 * via app_metadata.
 * 
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://verceltestapp-five.vercel.app';
  
  // Get user's app_metadata
  const appMetadata = event.user.app_metadata || {};
  
  // Check if user has courses assigned in app_metadata
  let courses = appMetadata.courses || [];
  
  // If this is a new user (first login) and they have no courses, grant starter course
  if (event.stats.logins_count === 1 && courses.length === 0) {
    // Grant access to the Web Development Fundamentals course for new users
    courses = ['web-development'];
    
    // Update user's app_metadata with the starter course
    api.user.setAppMetadata('courses', courses);
    
    console.log(`New user ${event.user.user_id} granted starter course: web-development`);
  }
  
  // Add courses claim to tokens
  if (courses && courses.length > 0) {
    api.idToken.setCustomClaim(`${namespace}/courses`, courses);
    api.accessToken.setCustomClaim(`${namespace}/courses`, courses);
  }
  
  // Log course access for debugging
  console.log(`User ${event.user.user_id} has access to courses:`, courses);
};
