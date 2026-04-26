# Auth0 Integration Setup Guide

This guide will walk you through setting up Auth0 authentication for your Vercel landing page.

## Prerequisites

- An Auth0 account (sign up at https://auth0.com)
- Your Vercel app deployed or running locally

## Step 1: Create an Auth0 Application

1. **Log in to Auth0 Dashboard**
   - Go to https://manage.auth0.com
   - Navigate to **Applications** → **Applications**

2. **Create a New Application**
   - Click **Create Application**
   - Name: `Vercel Landing Page` (or your preferred name)
   - Application Type: **Single Page Web Applications**
   - Click **Create**

## Step 2: Configure Application Settings

In your Auth0 application settings:

### Allowed Callback URLs
Add your application URLs (comma-separated):
```
http://localhost:8080,
https://your-app.vercel.app
```

### Allowed Logout URLs
Add the same URLs:
```
http://localhost:8080,
https://your-app.vercel.app
```

### Allowed Web Origins
Add the same URLs:
```
http://localhost:8080,
https://your-app.vercel.app
```

### Allowed Origins (CORS)
Add the same URLs:
```
http://localhost:8080,
https://your-app.vercel.app
```

Click **Save Changes**

## Step 3: Get Your Auth0 Credentials

From the application settings page, copy:

1. **Domain** (e.g., `dev-abc123.us.auth0.com`)
2. **Client ID** (e.g., `aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`)

## Step 4: Update Your Application

### Option A: Direct Configuration (For Testing)

Edit `auth0-config.js`:

```javascript
const auth0Config = {
    domain: 'YOUR_AUTH0_DOMAIN.auth0.com',  // Replace with your domain
    clientId: 'YOUR_AUTH0_CLIENT_ID',        // Replace with your client ID
    authorizationParams: {
        redirect_uri: window.location.origin,
        scope: 'openid profile email'
    }
};
```

### Option B: Environment Variables (For Production)

**For Vercel Deployment:**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `AUTH0_DOMAIN` = `your-domain.auth0.com`
   - `AUTH0_CLIENT_ID` = `your-client-id`
4. Redeploy your application

Then update `auth0-config.js` to use environment variables:

```javascript
const auth0Config = {
    domain: process.env.AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN.auth0.com',
    clientId: process.env.AUTH0_CLIENT_ID || 'YOUR_AUTH0_CLIENT_ID',
    authorizationParams: {
        redirect_uri: window.location.origin,
        scope: 'openid profile email'
    }
};
```

## Step 5: Test Authentication

1. **Run locally:**
   ```bash
   npx serve .
   ```

2. **Open in browser:**
   - Navigate to `http://localhost:8080`
   - Click the **Login** button in the navigation
   - You should be redirected to Auth0 login page
   - After login, you'll be redirected back with user info displayed

3. **Verify:**
   - User avatar and name appear in navigation
   - Gated content section becomes visible
   - Logout button works correctly

## Step 6: Customize User Experience

### Add Social Connections

1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Enable providers (Google, Facebook, GitHub, etc.)
3. Configure each provider with your credentials

### Customize Login Page

1. Go to **Branding** → **Universal Login**
2. Customize colors, logo, and text
3. Preview and save changes

### Add User Metadata

In `auth.js`, you can access additional user information:

```javascript
const user = await auth0Client.getUser();
console.log(user.email);
console.log(user.name);
console.log(user.picture);
console.log(user.email_verified);
```

## Step 7: Deploy to Vercel

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add Auth0 authentication"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)

3. **Update Auth0 settings** with your production URL

## Advanced Features

### Protected API Calls

Get an access token for API calls:

```javascript
const token = await getAccessToken();

fetch('https://your-api.com/protected', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

### Custom Claims

Add custom data to user tokens in Auth0 Dashboard:
- Go to **Actions** → **Flows** → **Login**
- Create a custom action to add claims

### Role-Based Access Control

1. Create roles in Auth0 Dashboard
2. Assign roles to users
3. Check roles in your application:

```javascript
const user = await auth0Client.getUser();
const roles = user['https://your-app.com/roles'];
if (roles.includes('admin')) {
    // Show admin features
}
```

## Troubleshooting

### Login Redirect Loop
- Check that callback URLs match exactly (including http/https)
- Clear browser cache and cookies

### "Invalid state" Error
- Ensure your Auth0 domain is correct
- Check that redirect_uri matches configured URLs

### CORS Errors
- Add your domain to "Allowed Web Origins" in Auth0
- Ensure CORS is enabled in Auth0 settings

### User Not Showing After Login
- Check browser console for errors
- Verify Auth0 configuration is correct
- Ensure scripts are loaded in correct order

## Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **Use HTTPS** in production
3. **Enable MFA** for sensitive applications
4. **Regularly rotate secrets**
5. **Monitor Auth0 logs** for suspicious activity
6. **Implement rate limiting**
7. **Keep Auth0 SDK updated**

## Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 SPA SDK](https://auth0.com/docs/libraries/auth0-spa-js)
- [Auth0 Community](https://community.auth0.com)
- [Vercel Documentation](https://vercel.com/docs)

## Support

If you encounter issues:
1. Check Auth0 logs in the dashboard
2. Review browser console errors
3. Consult Auth0 documentation
4. Ask in Auth0 Community forums

---

**Your application is now secured with Auth0!** 🔒
