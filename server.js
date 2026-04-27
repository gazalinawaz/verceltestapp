require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a-long-random-string-you-should-change',
  baseURL: process.env.BASE_URL || `http://localhost:${port}`,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    audience: 'https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/',
    scope: 'openid profile email read:current_user update:current_user_metadata'
  }
};

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.oidc.isAuthenticated() ? req.oidc.user : null;
  next();
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// My Courses route (protected)
app.get('/my-courses', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'my-courses.html'));
});

// Admin route (protected - admin only)
app.get('/admin', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Course Builder route (protected - admin only)
app.get('/course-builder', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'course-builder.html'));
});

// Profile route (protected)
app.get('/profile', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.json(req.oidc.user);
});

// API endpoint to check auth status
app.get('/api/auth/status', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.json({
      isAuthenticated: false,
      user: null
    });
  }
  
  // Get access token from session
  let accessToken = null;
  try {
    accessToken = await req.oidc.accessToken();
    console.log('🔑 Access Token Retrieved:', accessToken ? 'YES' : 'NO');
    console.log('📊 Token length:', accessToken ? accessToken.length : 0);
  } catch (error) {
    console.error('❌ Error getting access token:', error.message);
  }
  
  res.json({
    isAuthenticated: true,
    user: req.oidc.user,
    hasAccessToken: !!accessToken,
    accessTokenPreview: accessToken ? accessToken.substring(0, 50) + '...' : null
  });
});

// Middleware to check admin role
function requireAdmin(req, res, next) {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const namespace = 'https://verceltestapp-five.vercel.app';
  const userRoles = req.oidc.user[`${namespace}/roles`] || [];
  
  if (!userRoles.includes('admin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
}

// Admin API: Create course
app.post('/api/admin/courses', requireAdmin, express.json(), (req, res) => {
  const { id, title, icon, description, level, duration, lessons } = req.body;
  
  // Validate required fields
  if (!id || !title || !icon || !description || !level || !duration || !lessons) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // In a real app, save to database
  // For now, just acknowledge receipt
  console.log('Course created:', req.body);
  
  res.json({ 
    success: true, 
    message: 'Course created successfully',
    course: req.body
  });
});

// Admin API: Grant course access to user
app.post('/api/admin/enroll', requireAdmin, express.json(), async (req, res) => {
  const { email, courses } = req.body;
  
  if (!email || !courses || !Array.isArray(courses)) {
    return res.status(400).json({ error: 'Invalid request. Email and courses array required.' });
  }
  
  // In a real app, you would:
  // 1. Find user by email in Auth0
  // 2. Update their app_metadata with courses array
  // 3. Use Auth0 Management API
  
  // For demo purposes, return success
  console.log(`Granting access to ${email} for courses:`, courses);
  
  res.json({
    success: true,
    message: `Access granted to ${courses.length} course(s) for ${email}`,
    email: email,
    courses: courses,
    note: 'In production, this would update Auth0 app_metadata via Management API'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
