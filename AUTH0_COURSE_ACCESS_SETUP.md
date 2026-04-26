# Auth0 Course Access Setup Guide

This guide explains how to set up claim-based course access control for the Merryweather Academy learning platform.

## 📋 Overview

The learning platform uses Auth0 custom claims to control which courses users can access:

- **New users** automatically get access to "Web Development Fundamentals" (starter course)
- **Additional courses** can be granted by admins via app_metadata
- **Course access** is stored in the `courses` claim as an array of course IDs

## 🚀 Setup Instructions

### Step 1: Create the Course Access Action

1. **Go to Auth0 Dashboard**
   - Visit: https://manage.auth0.com
   - Navigate to **Actions** → **Library**

2. **Create New Action**
   - Click **Build Custom**
   - **Name:** `Grant Course Access`
   - **Trigger:** `Login / Post Login`
   - Click **Create**

3. **Add the Code**

Copy this code into the Action editor:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://verceltestapp-five.vercel.app';
  
  const appMetadata = event.user.app_metadata || {};
  let courses = appMetadata.courses || [];
  
  // Grant starter course to new users
  if (event.stats.logins_count === 1 && courses.length === 0) {
    courses = ['web-development'];
    api.user.setAppMetadata('courses', courses);
    console.log(`New user ${event.user.user_id} granted starter course`);
  }
  
  // Add courses claim to tokens
  if (courses && courses.length > 0) {
    api.idToken.setCustomClaim(`${namespace}/courses`, courses);
    api.accessToken.setCustomClaim(`${namespace}/courses`, courses);
  }
};
```

4. **Deploy the Action**
   - Click **Deploy**

### Step 2: Add to Login Flow

1. **Navigate to Actions → Flows → Login**
2. **Drag** the "Grant Course Access" action from the sidebar
3. **Drop** it between Start and Complete (AFTER other custom claim actions)
4. **Click Apply**

## 🎓 Available Courses

| Course ID | Course Name | Level |
|-----------|-------------|-------|
| `web-development` | Web Development Fundamentals | Beginner |
| `react-mastery` | React Mastery | Intermediate |
| `node-backend` | Node.js Backend Development | Intermediate |
| `auth0-security` | Auth0 & Application Security | Advanced |

## 👤 Granting Course Access to Users

### Method 1: Via Auth0 Dashboard

1. **Go to User Management → Users**
2. **Select a user**
3. **Scroll to Metadata section**
4. **Edit app_metadata**
5. **Add courses array:**

```json
{
  "dob": "1990-01-01",
  "merryweather_id": "MW123",
  "courses": ["web-development", "react-mastery", "node-backend"]
}
```

6. **Click Save**
7. **User must log out and log back in** to get updated claims

### Method 2: Via Management API

```javascript
const axios = require('axios');

async function grantCourseAccess(userId, courseIds) {
  const response = await axios.patch(
    `https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/users/${userId}`,
    {
      app_metadata: {
        courses: courseIds  // Array of course IDs
      }
    },
    {
      headers: {
        'Authorization': `Bearer YOUR_MANAGEMENT_API_TOKEN`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

// Example: Grant access to multiple courses
grantCourseAccess('auth0|123456', ['web-development', 'react-mastery', 'auth0-security']);
```

### Method 3: Automatic on Registration

The Action already grants `web-development` to new users automatically. To grant additional courses on registration:

```javascript
// In the Action, modify the new user section:
if (event.stats.logins_count === 1 && courses.length === 0) {
  // Grant multiple starter courses
  courses = ['web-development', 'react-mastery'];
  api.user.setAppMetadata('courses', courses);
}
```

## 🔍 Testing Course Access

### Test 1: New User Registration

1. **Sign up** a new user
2. **Log in** with the new account
3. **Go to My Courses** (`/my-courses`)
4. **Expected:** User should see "Web Development Fundamentals" course

### Test 2: Check Token Claims

After logging in, open browser console and run:

```javascript
fetch('/api/auth/status')
  .then(res => res.json())
  .then(data => {
    console.log('Courses:', data.user['https://verceltestapp-five.vercel.app/courses']);
  });
```

**Expected output:**
```javascript
["web-development"]
```

### Test 3: Grant Additional Courses

1. **Go to Auth0 Dashboard**
2. **User Management → Users → Select user**
3. **Edit app_metadata** and add more courses:
   ```json
   {
     "courses": ["web-development", "react-mastery", "node-backend"]
   }
   ```
4. **Save**
5. **User logs out and logs back in**
6. **Go to My Courses**
7. **Expected:** User should see all 3 courses

## 🎯 How It Works

### Registration Flow

```
1. User signs up
   ↓
2. First login (logins_count === 1)
   ↓
3. Action checks app_metadata.courses
   ↓
4. If empty, grants ['web-development']
   ↓
5. Updates app_metadata
   ↓
6. Adds courses claim to tokens
   ↓
7. User sees starter course in My Courses
```

### Course Access Check

```
1. User visits /my-courses
   ↓
2. Frontend calls /api/auth/status
   ↓
3. Gets user token with courses claim
   ↓
4. Displays courses from claim array
   ↓
5. User can access enrolled courses
```

## 📊 Token Structure

After the Action runs, the user's token will contain:

```json
{
  "sub": "auth0|123456",
  "email": "user@example.com",
  "name": "John Doe",
  "https://verceltestapp-five.vercel.app/date_of_birth": "1990-01-01",
  "https://verceltestapp-five.vercel.app/merryweather_id": "MW123",
  "https://verceltestapp-five.vercel.app/courses": [
    "web-development",
    "react-mastery"
  ]
}
```

## 🔐 Security Considerations

1. **app_metadata vs user_metadata**
   - ✅ Use `app_metadata` for courses (admin-only)
   - ❌ Don't use `user_metadata` (users can modify it)

2. **Claim Validation**
   - Backend should validate course IDs from claims
   - Don't trust client-side course access checks

3. **Course Updates**
   - Users must log out/in to get updated course access
   - Consider implementing a "refresh token" feature

## 🛠️ Customization

### Change Starter Course

```javascript
// Grant different starter course
if (event.stats.logins_count === 1 && courses.length === 0) {
  courses = ['react-mastery'];  // Different course
  api.user.setAppMetadata('courses', courses);
}
```

### Grant Based on Email Domain

```javascript
// Grant premium courses to company employees
if (event.user.email.endsWith('@merryweather.com')) {
  courses = ['web-development', 'react-mastery', 'node-backend', 'auth0-security'];
  api.user.setAppMetadata('courses', courses);
}
```

### Grant Based on User Role

```javascript
// Grant courses based on role
const userRoles = appMetadata.roles || [];

if (userRoles.includes('premium')) {
  courses = ['web-development', 'react-mastery', 'node-backend', 'auth0-security'];
} else {
  courses = ['web-development'];
}

api.user.setAppMetadata('courses', courses);
```

## 🐛 Troubleshooting

### Courses Not Appearing

1. **Check Action is deployed**
   - Actions → Library → Verify "Grant Course Access" is deployed

2. **Check Action is in flow**
   - Actions → Flows → Login → Verify action is active

3. **Check app_metadata**
   - User Management → Users → Select user → Check app_metadata has courses array

4. **Check token**
   - Use browser console to check if courses claim exists in token

### New Users Not Getting Starter Course

1. **Check logins_count logic**
   - Action only grants on first login (logins_count === 1)

2. **Check Action logs**
   - Monitoring → Logs → Look for "New user granted starter course" message

3. **Manually add courses**
   - Edit user's app_metadata and add courses array

## 📚 Resources

- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
- [Custom Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims)
- [App Metadata](https://auth0.com/docs/manage-users/user-accounts/metadata)

---

**Your learning platform is now ready with claim-based course access!** 🎓
