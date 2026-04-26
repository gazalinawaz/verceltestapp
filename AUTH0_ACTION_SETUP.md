# Auth0 Action Setup Guide: Custom Claims

This guide shows you how to create an Auth0 Action to inject Date of Birth and Merryweather ID as custom claims into user tokens.

## 📋 What This Action Does

The Action adds two custom claims to the ID token and Access token:
- **Date of Birth** - From user metadata
- **Merryweather ID** - From app metadata or user metadata

Custom claims use the namespace: `https://merryweather.com/`

## 🚀 Step-by-Step Setup

### Step 1: Create the Action

1. **Go to Auth0 Dashboard**
   - Visit: https://manage.auth0.com
   - Navigate to **Actions** → **Library**

2. **Create New Action**
   - Click **Build Custom** (or **Create Action**)
   - **Name:** `Inject Custom Claims`
   - **Trigger:** `Login / Post Login`
   - Click **Create**

### Step 2: Add the Code

Copy the code from `auth0-action-custom-claims.js` and paste it into the Action editor:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://merryweather.com';
  
  const userMetadata = event.user.user_metadata || {};
  const appMetadata = event.user.app_metadata || {};
  
  // Date of Birth from user_metadata (user can update)
  const dateOfBirth = userMetadata.date_of_birth || userMetadata.dob || null;
  
  // Merryweather ID from app_metadata (admin-only)
  const merrywealtherId = appMetadata.merryweather_id || null;
  
  if (dateOfBirth) {
    api.idToken.setCustomClaim(`${namespace}/date_of_birth`, dateOfBirth);
    api.accessToken.setCustomClaim(`${namespace}/date_of_birth`, dateOfBirth);
  }
  
  if (merrywealtherId) {
    api.idToken.setCustomClaim(`${namespace}/merryweather_id`, merrywealtherId);
    api.accessToken.setCustomClaim(`${namespace}/merryweather_id`, merrywealtherId);
  }
};
```

Click **Save Draft**

### Step 3: Deploy the Action

1. Click **Deploy** button (top right)
2. Confirm deployment

### Step 4: Add Action to Login Flow

1. Navigate to **Actions** → **Flows** → **Login**
2. You'll see the Login flow diagram
3. Find your **Inject Custom Claims** action in the right sidebar under "Custom"
4. **Drag and drop** it between **Start** and **Complete**
5. Click **Apply**

## 👤 Setting User Metadata

Before the Action can inject claims, you need to add metadata to users.

### Option 1: Via Auth0 Dashboard

1. Go to **User Management** → **Users**
2. Select a user
3. Scroll to **Metadata** section

**For Date of Birth (user_metadata):**
4. Click **Edit** on **user_metadata**
5. Add JSON:
   ```json
   {
     "date_of_birth": "1990-01-15"
   }
   ```
6. Click **Save**

**For Merryweather ID (app_metadata):**
7. Click **Edit** on **app_metadata**
8. Add JSON:
   ```json
   {
     "merryweather_id": "MRW-12345"
   }
   ```
9. Click **Save**

**Why separate?**
- `user_metadata` - Users can update via profile settings
- `app_metadata` - Only admins can update (secure, system-assigned IDs)

### Option 2: Via Management API

```javascript
const axios = require('axios');

const updateUserMetadata = async (userId, dateOfBirth, merrywealtherId) => {
  const response = await axios.patch(
    `https://jade-swan-94501.cic-demo-platform.auth0app.com/api/v2/users/${userId}`,
    {
      user_metadata: {
        date_of_birth: dateOfBirth  // User can update
      },
      app_metadata: {
        merryweather_id: merrywealtherId  // Admin-only
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
};

// Example usage
updateUserMetadata('auth0|123456', '1990-01-15', 'MRW-12345');
```

### Option 3: During User Registration

Update your signup flow to collect this data:

```javascript
// In your registration form handler
app.post('/api/register', async (req, res) => {
  const { email, password, dateOfBirth } = req.body;
  
  // Generate Merryweather ID (admin-assigned)
  const merrywealtherId = `MRW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create user with metadata
  const user = await auth0Management.createUser({
    email: email,
    password: password,
    connection: 'Username-Password-Authentication',
    user_metadata: {
      date_of_birth: dateOfBirth  // User-provided
    },
    app_metadata: {
      merryweather_id: merrywealtherId  // System-generated
    }
  });
  
  res.json({ success: true, user });
});
```

## 🔍 Testing the Action

### Test in Auth0 Dashboard

1. Go to **Actions** → **Library**
2. Open your **Inject Custom Claims** action
3. Click **Test** tab
4. Use the test payload:
   ```json
   {
     "user": {
       "user_id": "auth0|123456",
       "email": "test@example.com",
       "user_metadata": {
         "date_of_birth": "1990-01-15",
         "merryweather_id": "MRW-12345"
       }
     }
   }
   ```
5. Click **Run**
6. Check the output for custom claims

### Test in Your Application

After logging in, decode the ID token to see the claims:

```javascript
// In your Express.js app
app.get('/api/user/claims', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = req.oidc.user;
  
  res.json({
    email: user.email,
    name: user.name,
    dateOfBirth: user['https://merryweather.com/date_of_birth'],
    merrywealtherId: user['https://merryweather.com/merryweather_id']
  });
});
```

### Verify in Browser

1. Log in to your app
2. Open browser DevTools (F12)
3. Go to **Application** → **Cookies**
4. Find the Auth0 session cookie
5. Decode the ID token at https://jwt.io
6. Look for custom claims:
   ```json
   {
     "https://merryweather.com/date_of_birth": "1990-01-15",
     "https://merryweather.com/merryweather_id": "MRW-12345"
   }
   ```

## 📊 Accessing Claims in Your App

### Backend (Express.js)

```javascript
app.get('/api/profile', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = req.oidc.user;
  const namespace = 'https://merryweather.com';
  
  res.json({
    email: user.email,
    name: user.name,
    dateOfBirth: user[`${namespace}/date_of_birth`],
    merrywealtherId: user[`${namespace}/merryweather_id`]
  });
});
```

### Frontend (JavaScript)

```javascript
async function getUserClaims() {
  const response = await fetch('/api/profile');
  const data = await response.json();
  
  console.log('Date of Birth:', data.dateOfBirth);
  console.log('Merryweather ID:', data.merrywealtherId);
  
  return data;
}
```

## 🔧 Customization Options

### Change Namespace

Update the namespace to match your domain:
```javascript
const namespace = 'https://yourdomain.com';
```

### Add More Claims

```javascript
// Add additional custom claims
const department = userMetadata.department || null;
const employeeId = appMetadata.employee_id || null;

if (department) {
  api.idToken.setCustomClaim(`${namespace}/department`, department);
}

if (employeeId) {
  api.idToken.setCustomClaim(`${namespace}/employee_id`, employeeId);
}
```

### Conditional Claims

Only add claims for specific users:
```javascript
// Only add for users with specific email domain
if (event.user.email.endsWith('@merryweather.com')) {
  api.idToken.setCustomClaim(`${namespace}/merryweather_id`, merrywealtherId);
}
```

## 🛡️ Security Best Practices

1. **Use Namespaced Claims**
   - Always use a URL namespace (e.g., `https://merryweather.com/`)
   - Prevents conflicts with standard OIDC claims

2. **Don't Expose Sensitive Data**
   - Avoid adding SSN, credit cards, passwords to tokens
   - Tokens can be decoded by anyone

3. **Keep Tokens Small**
   - Only add necessary claims
   - Large tokens impact performance

4. **Validate Data**
   - Check if metadata exists before adding claims
   - Handle missing or null values gracefully

5. **Use app_metadata for Admin Data**
   - Use `app_metadata` for data users shouldn't modify
   - Use `user_metadata` for user-editable data

## 🐛 Troubleshooting

### Claims Not Appearing

1. **Check Action is Deployed**
   - Actions → Library → Verify status is "Deployed"

2. **Check Action is in Flow**
   - Actions → Flows → Login → Verify action is between Start and Complete

3. **Check User Has Metadata**
   - User Management → Users → Select user → Check Metadata section

4. **Check Namespace Format**
   - Must be a valid URL (e.g., `https://domain.com`)
   - Cannot use `auth0.com` or reserved namespaces

### Action Errors

1. **View Logs**
   - Monitoring → Logs → Filter by "Action"
   - Look for errors in your custom action

2. **Test Action**
   - Actions → Library → Your action → Test tab
   - Run with sample payload

3. **Check Console Logs**
   - Add `console.log()` statements in your action
   - View output in Auth0 logs

## 📚 Resources

- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
- [Custom Claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims)
- [User Metadata](https://auth0.com/docs/manage-users/user-accounts/metadata)
- [Actions API Reference](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object)

---

**Your custom claims are now ready!** Users will receive Date of Birth and Merryweather ID in their tokens after login. 🎉
