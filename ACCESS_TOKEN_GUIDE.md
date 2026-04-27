# Access Token Configuration Guide

## Problem
User only seeing `id_token` in console logs, missing `access_token`.

## Root Cause
You're using **express-openid-connect** (server-side auth), not a SPA. The tokens are stored in the **server session**, not exposed to the browser by default.

## Solution Applied

### 1. Server-Side Configuration
**File:** `server.js`

Added `authorizationParams` to the Auth0 config:
```javascript
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    audience: 'https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/',
    scope: 'openid profile email read:current_user update:current_user_metadata'
  }
};
```

### 2. Access Token Endpoint
**File:** `server.js`

Updated `/api/auth/status` to expose access token info:
```javascript
app.get('/api/auth/status', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.json({ isAuthenticated: false, user: null });
  }
  
  // Get access token from session
  const accessToken = await req.oidc.accessToken();
  
  res.json({
    isAuthenticated: true,
    user: req.oidc.user,
    hasAccessToken: !!accessToken,
    accessTokenPreview: accessToken ? accessToken.substring(0, 50) + '...' : null
  });
});
```

## How to Verify

### Step 1: Check Server Logs
After logging in, check your server console (terminal where `npm start` is running):
```
🔑 Access Token Retrieved: YES
📊 Token length: 1234
```

### Step 2: Check Browser Console
```javascript
// In browser console (F12)
fetch('/api/auth/status')
  .then(r => r.json())
  .then(data => console.log(data));
```

**Expected output:**
```json
{
  "isAuthenticated": true,
  "user": { ... },
  "hasAccessToken": true,
  "accessTokenPreview": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6..."
}
```

### Step 3: Use Access Token in API Calls
**Server-side (recommended):**
```javascript
// In your server routes
app.get('/api/protected', async (req, res) => {
  const accessToken = await req.oidc.accessToken();
  
  // Use token to call Auth0 Management API
  const response = await fetch('https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/users', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
});
```

**Client-side (if needed):**
```javascript
// Create an endpoint to get the token
app.get('/api/auth/token', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const accessToken = await req.oidc.accessToken();
  res.json({ accessToken });
});

// Then in frontend
const response = await fetch('/api/auth/token');
const { accessToken } = await response.json();
```

## Important Notes

### Server-Side vs Client-Side Auth

**Your Setup (Server-Side):**
- ✅ Tokens stored in encrypted session cookies
- ✅ More secure (tokens not exposed to browser)
- ✅ Better for traditional web apps
- ❌ Tokens not visible in browser console/network tab
- ❌ Need server endpoints to use tokens

**SPA Setup (Client-Side):**
- ✅ Tokens visible in browser
- ✅ Can make API calls directly from frontend
- ❌ Tokens exposed to JavaScript (XSS risk)
- ❌ Need to handle token refresh manually

### Why You Don't See Tokens in Browser

With `express-openid-connect`:
1. User logs in via `/login`
2. Auth0 redirects to `/callback` with authorization code
3. **Server** exchanges code for tokens
4. **Server** stores tokens in encrypted session
5. **Server** sends session cookie to browser
6. Browser only sees session cookie, not tokens

This is **more secure** than exposing tokens to the browser!

## Testing Steps

1. **Deploy the changes** (Vercel will auto-deploy)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Logout** if logged in
4. **Login again**
5. **Check server logs** for "Access Token Retrieved: YES"
6. **Open browser console** and run:
   ```javascript
   fetch('/api/auth/status').then(r => r.json()).then(console.log)
   ```
7. **Verify** `hasAccessToken: true` in response

## Troubleshooting

### Still no access token?

**Check Auth0 Dashboard:**
1. Go to Auth0 Dashboard → APIs
2. Verify API exists with identifier: `https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/`
3. Go to Applications → Your App → APIs tab
4. Verify the API is authorized for your application

**Check Environment Variables:**
```bash
# In Vercel dashboard, verify these are set:
AUTH0_CLIENT_ID=fkatvoAkZ8TkLNykQTFildt9VBk7D1cb
AUTH0_CLIENT_SECRET=<your-secret>
AUTH0_ISSUER_BASE_URL=https://jade-swan-94501.cic-demo-platform.auth0app.com
AUTH0_SECRET=<random-string>
BASE_URL=https://verceltestapp-five.vercel.app
```

### Error: "audience is not allowed"

**Fix:** In Auth0 Dashboard:
1. Applications → Your App → Settings
2. Scroll to "Advanced Settings" → "Grant Types"
3. Ensure "Authorization Code" is checked
4. In "Allowed Callback URLs" add your domain
5. Save changes

## Summary

- ✅ Added `audience` to server config
- ✅ Added `authorizationParams` with proper scopes
- ✅ Created endpoint to verify access token
- ✅ Added server-side logging
- ✅ Tokens are stored securely in session
- ✅ Access tokens available via `req.oidc.accessToken()`

**The access token is now being requested and stored. Check server logs and the `/api/auth/status` endpoint to verify!**
