# Auth0 Admin Role Setup Guide

This guide explains how to set up admin access for the Merryweather Academy admin dashboard using claim-based role authorization.

## 📋 Overview

The admin dashboard allows authorized users to:
- **Create new courses** and add them to the catalog
- **Manage course catalog** (edit/delete courses)
- **Grant course access** to students via email
- **View all courses** in the system

Access is controlled via the `roles` claim in Auth0 tokens.

## 🚀 Setup Instructions

### Step 1: Create the Admin Role Action

1. **Go to Auth0 Dashboard**
   - Visit: https://manage.auth0.com
   - Navigate to **Actions** → **Library**

2. **Create New Action**
   - Click **Build Custom**
   - **Name:** `Add Admin Role Claim`
   - **Trigger:** `Login / Post Login`
   - Click **Create**

3. **Add the Code**

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://verceltestapp-five.vercel.app';
  
  const appMetadata = event.user.app_metadata || {};
  const roles = appMetadata.roles || [];
  
  // Add roles claim to tokens
  if (roles && roles.length > 0) {
    api.idToken.setCustomClaim(`${namespace}/roles`, roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
    
    console.log(`User ${event.user.user_id} has roles:`, roles);
  }
};
```

4. **Deploy the Action**
   - Click **Deploy**

### Step 2: Add to Login Flow

1. **Navigate to Actions → Flows → Login**
2. **Drag** the "Add Admin Role Claim" action from the sidebar
3. **Drop** it between Start and Complete (can be with other custom claim actions)
4. **Click Apply**

### Step 3: Grant Admin Role to a User

1. **Go to User Management → Users**
2. **Select a user** you want to make admin
3. **Edit app_metadata**
4. **Add roles array:**

```json
{
  "dob": "1990-01-01",
  "merryweather_id": "MW123",
  "courses": ["web-development"],
  "roles": ["admin"]
}
```

5. **Click Save**
6. **User must log out and log back in** to get admin role

## 🎯 Testing Admin Access

### Test 1: Access Admin Dashboard

1. **Log in** with admin user
2. **Visit**: https://verceltestapp-five.vercel.app/admin
3. **Expected:** Admin dashboard loads with three tabs

### Test 2: Verify Role Claim

After logging in, open browser console:

```javascript
fetch('/api/auth/status')
  .then(res => res.json())
  .then(data => {
    console.log('Roles:', data.user['https://verceltestapp-five.vercel.app/roles']);
  });
```

**Expected output:**
```javascript
["admin"]
```

### Test 3: Non-Admin User

1. **Log in** with regular user (no admin role)
2. **Visit**: `/admin`
3. **Expected:** "Access Denied" message

## 📚 Admin Dashboard Features

### 1. Course Catalog Tab

**View all courses** in the system:
- Course ID, title, icon, description
- Level (Beginner/Intermediate/Advanced)
- Duration and number of lessons
- Edit and Delete actions

### 2. Create Course Tab

**Create new courses** with:
- **Course ID** (unique identifier, lowercase with hyphens)
- **Icon** (emoji)
- **Title** (display name)
- **Description** (brief overview)
- **Level** (Beginner/Intermediate/Advanced)
- **Duration** (hours)
- **Number of Lessons**

**Example:**
```
Course ID: python-basics
Icon: 🐍
Title: Python Programming Basics
Description: Learn Python from scratch with hands-on projects
Level: Beginner
Duration: 15 hours
Lessons: 30
```

### 3. Manage Enrollments Tab

**Grant course access** to students:
- Enter student email
- Select courses to grant access to
- Click "Grant Access"
- Student must log out/in to see new courses

## 🔐 How It Works

### Admin Access Check

```javascript
// Frontend checks for admin role
const namespace = 'https://verceltestapp-five.vercel.app';
const userRoles = user[`${namespace}/roles`] || [];
const isAdmin = userRoles.includes('admin');
```

### Backend API Protection

```javascript
// Server middleware checks admin role
function requireAdmin(req, res, next) {
  const namespace = 'https://verceltestapp-five.vercel.app';
  const userRoles = req.oidc.user[`${namespace}/roles`] || [];
  
  if (!userRoles.includes('admin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
}
```

## 📊 API Endpoints

### POST /api/admin/courses
Create a new course

**Request:**
```json
{
  "id": "python-basics",
  "title": "Python Programming Basics",
  "icon": "🐍",
  "description": "Learn Python from scratch",
  "level": "Beginner",
  "duration": 15,
  "lessons": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": { ... }
}
```

### POST /api/admin/enroll
Grant course access to a student

**Request:**
```json
{
  "email": "student@example.com",
  "courses": ["web-development", "react-mastery"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Access granted to 2 course(s) for student@example.com",
  "email": "student@example.com",
  "courses": ["web-development", "react-mastery"]
}
```

## 💾 Data Storage

### Current Implementation (Demo)
- Courses stored in **localStorage** (browser)
- Syncs with backend API for logging
- Persists across page refreshes

### Production Implementation
You should:
1. **Store courses in a database** (MongoDB, PostgreSQL, etc.)
2. **Use Auth0 Management API** to update user metadata
3. **Implement proper validation** and error handling

## 🔧 Granting Course Access (Production)

To implement real course enrollment, use Auth0 Management API:

```javascript
const axios = require('axios');

async function grantCourseAccess(userEmail, courseIds) {
  // 1. Get Management API token
  const tokenResponse = await axios.post(
    'https://jade-swan-94501.cic-demo-platform.auth0app.com/oauth/token',
    {
      client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: 'https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/',
      grant_type: 'client_credentials'
    }
  );
  
  const token = tokenResponse.data.access_token;
  
  // 2. Find user by email
  const usersResponse = await axios.get(
    `https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/users?q=email:"${userEmail}"`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  if (usersResponse.data.length === 0) {
    throw new Error('User not found');
  }
  
  const userId = usersResponse.data[0].user_id;
  
  // 3. Update user's app_metadata
  await axios.patch(
    `https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/users/${userId}`,
    {
      app_metadata: {
        courses: courseIds
      }
    },
    {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return { success: true, userId, courses: courseIds };
}
```

## 👥 Multiple Admin Roles

You can extend the role system:

```json
{
  "roles": ["admin", "instructor", "moderator"]
}
```

Then check for specific roles:

```javascript
// Check for instructor role
const isInstructor = userRoles.includes('instructor');

// Check for any admin-level role
const isAdminLevel = userRoles.some(role => 
  ['admin', 'instructor', 'moderator'].includes(role)
);
```

## 🛡️ Security Best Practices

1. **Use app_metadata for roles**
   - ✅ `app_metadata.roles` (admin-only, secure)
   - ❌ `user_metadata.roles` (user can modify)

2. **Always verify on backend**
   - Frontend checks are for UX only
   - Backend must verify admin role for all API calls

3. **Limit admin users**
   - Only grant admin role to trusted users
   - Regularly audit admin access

4. **Log admin actions**
   - Track course creation/deletion
   - Monitor enrollment changes

## 🐛 Troubleshooting

### Admin Dashboard Shows "Access Denied"

1. **Check user has admin role**
   - User Management → Users → Select user → Check app_metadata

2. **Check Action is deployed**
   - Actions → Library → "Add Admin Role Claim" should be deployed

3. **Check Action is in flow**
   - Actions → Flows → Login → Verify action is active

4. **User must log out/in**
   - Roles are added to token at login time

### Course Creation Not Working

1. **Check browser console** for errors
2. **Verify admin role** in token
3. **Check network tab** for API responses

### Enrollment Not Updating

1. **Current implementation is demo-only**
2. **Implement Auth0 Management API** for production
3. **User must log out/in** to get updated courses

## 📚 Resources

- [Auth0 Actions](https://auth0.com/docs/customize/actions)
- [Auth0 Management API](https://auth0.com/docs/api/management/v2)
- [Custom Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims)
- [Role-Based Access Control](https://auth0.com/docs/manage-users/access-control/rbac)

---

**Your admin dashboard is ready!** Grant admin role to users and start managing courses. 🎓
