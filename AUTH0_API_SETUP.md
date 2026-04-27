# Auth0 Management API Setup Guide

## Problem
Adding the `audience` parameter breaks login because your application needs to be **authorized** to use the Auth0 Management API.

## Solution: Authorize Your Application

### Step 1: Go to Auth0 Dashboard
1. Navigate to https://manage.auth0.com
2. Select your tenant: `jade-swan-94501`

### Step 2: Find Auth0 Management API
1. In left sidebar, click **Applications → APIs**
2. Find **"Auth0 Management API"** (it's pre-created by Auth0)
3. Click on it

### Step 3: Authorize Your Application
1. Click the **"Machine to Machine Applications"** tab
2. Find your application in the list (should show your Client ID: `fkatvoAkZ8TkLNykQTFildt9VBk7D1cb`)
3. **Toggle the switch to AUTHORIZED** (turn it ON)
4. Click the dropdown arrow to expand permissions

### Step 4: Select Required Scopes
Check these scopes:
- ✅ `read:current_user`
- ✅ `update:current_user_metadata`
- ✅ `read:users` (optional, for admin features)
- ✅ `update:users` (optional, for admin features)

Click **"Update"** to save

### Step 5: Re-enable Audience in Code

After authorization is complete, uncomment the audience parameter in `server.js`:

```javascript
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
```

### Step 6: Test
1. Commit and push changes
2. Wait for Vercel deployment
3. Logout and login again
4. Check `/api/auth/status` - should now have `hasAccessToken: true`

## Why This Is Required

**Without Authorization:**
- Auth0 rejects the login request
- Error: "unauthorized_client" or similar
- Login fails completely

**With Authorization:**
- Auth0 issues both `id_token` and `access_token`
- Access token can be used to call Management API
- Login works normally

## Verification

After setup, you should see in `/api/auth/status`:
```json
{
  "isAuthenticated": true,
  "hasAccessToken": true,
  "accessTokenPreview": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6...",
  "debug": {
    "audience": "https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/",
    "issuer": "https://jade-swan-94501.cic-demo-platform.auth0app.com/",
    "configuredAudience": "https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/"
  }
}
```

## Alternative: Skip Access Token

If you don't need access tokens for API calls, you can simply leave the audience parameter commented out. Login will work fine without it, you just won't get an access token.

**Current setup (no audience):**
- ✅ Login works
- ✅ User authentication works
- ✅ User profile data available
- ❌ No access token for API calls

**With audience (after authorization):**
- ✅ Login works
- ✅ User authentication works
- ✅ User profile data available
- ✅ Access token for API calls

## Summary

1. Go to Auth0 Dashboard → APIs → Auth0 Management API
2. Machine to Machine Applications tab
3. Find your app and toggle to AUTHORIZED
4. Select scopes: `read:current_user`, `update:current_user_metadata`
5. Click Update
6. Uncomment audience in server.js
7. Deploy and test

**Login should work after following these steps!**
