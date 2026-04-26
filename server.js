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
  clientSecret: process.env.AUTH0_CLIENT_SECRET
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

// Profile route (protected)
app.get('/profile', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.json(req.oidc.user);
});

// API endpoint to check auth status
app.get('/api/auth/status', (req, res) => {
  res.json({
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.isAuthenticated() ? req.oidc.user : null
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
