# Login Troubleshooting Guide

## Issue: Unable to Login

### Most Likely Causes

#### 1. Missing Environment Variables (LOCAL DEVELOPMENT)
If running locally with `npm start`, you need a `.env` file with Auth0 credentials.

**Check:** Do you have a `.env` file in the project root?

**Fix:** Create `.env` file:
```bash
AUTH0_SECRET='your-long-random-string-at-least-32-characters-long'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_CLIENT_ID='fkatvoAkZ8TkLNykQTFildt9VBk7D1cb'
AUTH0_ISSUER_BASE_URL='https://jade-swan-94501.cic-demo-platform.auth0app.com'
AUTH0_CLIENT_SECRET='your-client-secret-from-auth0-dashboard'
```

**Where to get AUTH0_CLIENT_SECRET:**
1. Go to Auth0 Dashboard
2. Applications → Your Application
3. Settings tab
4. Copy "Client Secret"

#### 2. Missing Environment Variables (VERCEL)
If deployed on Vercel, environment variables must be set in Vercel dashboard.

**Check:** Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables:**
- `AUTH0_SECRET` - Random 32+ character string
- `AUTH0_BASE_URL` - `https://verceltestapp-five.vercel.app`
- `AUTH0_CLIENT_ID` - `fkatvoAkZ8TkLNykQTFildt9VBk7D1cb`
- `AUTH0_ISSUER_BASE_URL` - `https://jade-swan-94501.cic-demo-platform.auth0app.com`
- `AUTH0_CLIENT_SECRET` - From Auth0 dashboard

#### 3. Auth0 Callback URL Not Configured
Auth0 needs to know where to redirect after login.

**Check:** Auth0 Dashboard → Applications → Your App → Settings

**Required URLs:**
- **Allowed Callback URLs:**
  - `http://localhost:3000/callback` (for local)
  - `https://verceltestapp-five.vercel.app/callback` (for production)
  
- **Allowed Logout URLs:**
  - `http://localhost:3000`
  - `https://verceltestapp-five.vercel.app`

- **Allowed Web Origins:**
  - `http://localhost:3000`
  - `https://verceltestapp-five.vercel.app`

#### 4. Recent Changes Broke Login
The `audience` parameter was just added. If it's misconfigured, login might fail.

**Temporary Fix:** Remove audience to test if that's the issue.

In `server.js`, comment out the audience:
```javascript
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a-long-random-string-you-should-change',
  baseURL: process.env.BASE_URL || `http://localhost:${port}`,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // authorizationParams: {
  //   response_type: 'code',
  //   audience: 'https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/',
  //   scope: 'openid profile email read:current_user update:current_user_metadata'
  // }
};
```

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Click "Login"
4. Look for error messages

**Common Errors:**
- `redirect_uri_mismatch` → Callback URL not configured in Auth0
- `unauthorized_client` → Client secret wrong or missing
- `access_denied` → Auth0 application disabled

### Step 2: Check Server Logs
If running locally:
1. Look at terminal where `npm start` is running
2. Click "Login"
3. Check for error messages

**Common Errors:**
- `Missing required configuration` → Environment variables not set
- `Client authentication failed` → Wrong client secret
- `Invalid issuer` → Wrong issuer base URL

### Step 3: Check Network Tab
1. Open browser (F12)
2. Go to Network tab
3. Click "Login"
4. Look for failed requests (red)

**What to check:**
- `/login` request - Should redirect to Auth0
- `/callback` request - Should redirect back after login
- Any 400/500 errors

### Step 4: Test Basic Auth0 Config
Temporarily simplify the config to test:

```javascript
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a-very-long-random-string-at-least-32-characters-long',
  baseURL: 'http://localhost:3000',
  clientID: 'fkatvoAkZ8TkLNykQTFildt9VBk7D1cb',
  issuerBaseURL: 'https://jade-swan-94501.cic-demo-platform.auth0app.com',
  clientSecret: 'YOUR_CLIENT_SECRET_HERE'
};
```

## Quick Fixes

### Fix 1: Create .env File (Local Development)
```bash
# In project root
touch .env

# Add these lines (replace CLIENT_SECRET):
echo "AUTH0_SECRET=a-very-long-random-string-at-least-32-characters-long-please-change-this" >> .env
echo "AUTH0_BASE_URL=http://localhost:3000" >> .env
echo "AUTH0_CLIENT_ID=fkatvoAkZ8TkLNykQTFildt9VBk7D1cb" >> .env
echo "AUTH0_ISSUER_BASE_URL=https://jade-swan-94501.cic-demo-platform.auth0app.com" >> .env
echo "AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET_FROM_AUTH0_DASHBOARD" >> .env
```

### Fix 2: Update Auth0 Callback URLs
1. Go to https://manage.auth0.com
2. Applications → Your Application
3. Settings tab
4. Add to "Allowed Callback URLs":
   ```
   http://localhost:3000/callback,https://verceltestapp-five.vercel.app/callback
   ```
5. Add to "Allowed Logout URLs":
   ```
   http://localhost:3000,https://verceltestapp-five.vercel.app
   ```
6. Save Changes

### Fix 3: Restart Server
If you just added environment variables:
```bash
# Stop server (Ctrl+C)
# Start again
npm start
```

## Still Not Working?

### Provide This Information:
1. **Where are you testing?**
   - Local (localhost:3000)
   - Vercel (verceltestapp-five.vercel.app)

2. **What happens when you click Login?**
   - Nothing
   - Redirects to Auth0 but then error
   - Redirects to Auth0 and back but not logged in
   - Page just refreshes

3. **Any error messages?**
   - In browser console
   - In server logs
   - On the page

4. **Environment variables set?**
   - For local: `.env` file exists?
   - For Vercel: Variables in Vercel dashboard?

5. **Auth0 callback URLs configured?**
   - Check Auth0 dashboard → Application → Settings

## Emergency Rollback

If login was working before and broke after recent changes:

```bash
# Rollback to previous commit
git log --oneline  # Find commit before changes
git checkout <commit-hash>
npm start
```

Or revert the audience changes in `server.js`.
