# Regular Web Application Setup Guide

Your application has been converted from a Single Page Application (SPA) to a Regular Web Application with Express.js backend.

## 🔧 What Changed

### Architecture
- **Before:** Static HTML/CSS/JS with client-side Auth0
- **After:** Express.js server with server-side Auth0 authentication

### File Structure
```
vercel-landing-page/
├── server.js              # Express.js server with Auth0
├── package.json           # Updated with Express dependencies
├── .env.example           # Environment variables template
├── vercel.json            # Vercel Node.js deployment config
├── public/                # Static files served by Express
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── app.js            # New: Frontend auth status checker
├── auth0-config.js        # (Old SPA config - not used)
└── auth.js                # (Old SPA auth - not used)
```

## 🚀 Setup Instructions

### Step 1: Get Client Secret from Auth0

1. Go to https://manage.auth0.com
2. Navigate to **Applications** → Your Application
3. **Copy the Client Secret** (you'll need this)

### Step 2: Change Application Type in Auth0

1. In Auth0 Dashboard, go to your application settings
2. Scroll to **Application Type**
3. Change from "Single Page Application" to **"Regular Web Application"**
4. Click **Save Changes**

### Step 3: Update Auth0 Application URIs

In Auth0 application settings, update these fields:

**Allowed Callback URLs:**
```
https://verceltestapp-five.vercel.app/callback,
http://localhost:3000/callback
```

**Allowed Logout URLs:**
```
https://verceltestapp-five.vercel.app,
http://localhost:3000
```

**Allowed Web Origins:**
```
https://verceltestapp-five.vercel.app,
http://localhost:3000
```

Click **Save Changes**

### Step 4: Create .env File Locally

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
AUTH0_ISSUER_BASE_URL=https://jade-swan-94501.cic-demo-platform.auth0app.com
AUTH0_CLIENT_ID=fkatvoAkZ8TkLNykQTFildt9VBk7D1cb
AUTH0_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
AUTH0_SECRET=GENERATE_A_LONG_RANDOM_STRING_HERE
BASE_URL=http://localhost:3000
```

**Generate AUTH0_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Test Locally

```bash
npm start
```

Visit: http://localhost:3000

Click **Login** to test authentication.

### Step 7: Configure Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value |
|------|-------|
| `AUTH0_ISSUER_BASE_URL` | `https://jade-swan-94501.cic-demo-platform.auth0app.com` |
| `AUTH0_CLIENT_ID` | `fkatvoAkZ8TkLNykQTFildt9VBk7D1cb` |
| `AUTH0_CLIENT_SECRET` | Your client secret from Auth0 |
| `AUTH0_SECRET` | A long random string (32+ characters) |
| `BASE_URL` | `https://verceltestapp-five.vercel.app` |

5. Click **Save**

### Step 8: Deploy to Vercel

```bash
git add .
git commit -m "Convert to Regular Web Application with Express.js"
git push origin main
```

Vercel will automatically deploy.

## 🔐 How Authentication Works Now

### Server-Side Flow

1. User clicks **Login** button
2. Browser redirects to `/login` (handled by Express)
3. Express redirects to Auth0 login page
4. User enters credentials
5. Auth0 redirects back to `/callback` (handled by Express)
6. Express validates the response using **client secret**
7. Express creates a secure session cookie
8. User is redirected to homepage
9. Frontend calls `/api/auth/status` to check if logged in
10. UI updates based on authentication status

### Key Differences from SPA

| Aspect | SPA (Old) | Regular Web App (New) |
|--------|-----------|----------------------|
| **Auth Location** | Browser (client-side) | Server (backend) |
| **Client Secret** | Not used | Required |
| **Session Storage** | Browser localStorage | Encrypted server cookie |
| **Security** | Good | Better (secrets on server) |
| **Token Handling** | JavaScript | Express middleware |

## 📋 Available Routes

- `/` - Home page
- `/login` - Initiates Auth0 login
- `/logout` - Logs out and redirects to Auth0
- `/callback` - Auth0 callback handler (automatic)
- `/profile` - Protected route (requires login)
- `/api/auth/status` - Returns authentication status (JSON)

## 🔍 Troubleshooting

### "Callback URL mismatch" error
- Verify callback URLs in Auth0 match exactly
- Include `/callback` path

### "Unauthorized" error
- Check client secret is correct
- Verify application type is "Regular Web Application"
- Ensure AUTH0_SECRET is set

### Session not persisting
- Check AUTH0_SECRET is at least 32 characters
- Verify cookies are enabled in browser

### Vercel deployment fails
- Check all environment variables are set in Vercel
- Verify `server.js` exists in root directory
- Check `vercel.json` configuration

## 🎯 Testing Checklist

- [ ] Change Auth0 app type to "Regular Web Application"
- [ ] Add client secret to .env
- [ ] Update callback URLs in Auth0
- [ ] Install dependencies (`npm install`)
- [ ] Test locally (`npm start`)
- [ ] Add environment variables to Vercel
- [ ] Deploy to Vercel
- [ ] Test login on production URL
- [ ] Verify logout works
- [ ] Check gated content appears when logged in

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [express-openid-connect](https://github.com/auth0/express-openid-connect)
- [Auth0 Regular Web App Quickstart](https://auth0.com/docs/quickstart/webapp/express)
- [Vercel Node.js Deployment](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)

---

**Your app is now a Regular Web Application with server-side authentication!** 🎉
