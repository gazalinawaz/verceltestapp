# Auth0 Selective MFA Setup Guide

This guide shows you how to create an Auth0 Action to selectively prompt MFA only for external users (Username-Password connection).

## 📋 What This Action Does

- **Prompts MFA** for users logging in via Username-Password connection (external users)
- **Skips MFA** for users from other connections (social logins, enterprise SSO, etc.)
- Provides granular control over who needs MFA

## 🚀 Step-by-Step Setup

### Step 1: Enable MFA in Auth0

Before creating the Action, you need to enable MFA in your Auth0 tenant.

1. **Go to Auth0 Dashboard**
   - Visit: https://manage.auth0.com
   - Navigate to **Security** → **Multi-factor Auth**

2. **Enable MFA Factors**
   - Enable at least one MFA factor:
     - ✅ **One-time Password** (recommended - uses authenticator apps)
     - ✅ **SMS** (requires Twilio configuration)
     - ✅ **Email** (sends code via email)
     - ✅ **Push Notification** (Guardian app)

3. **Configure Factor Settings**
   - For **One-time Password**:
     - Click **Edit**
     - Enable **Google Authenticator**, **Microsoft Authenticator**, etc.
     - Click **Save**

4. **Set MFA Policy to "Never"**
   - Under **Define policies**, select **Never**
   - This allows the Action to control when MFA is required
   - Click **Save**

### Step 2: Create the MFA Action

1. **Go to Actions**
   - Navigate to **Actions** → **Library**

2. **Create New Action**
   - Click **Build Custom** (or **Create Action**)
   - **Name:** `Selective MFA for External Users`
   - **Trigger:** `Login / Post Login`
   - Click **Create**

### Step 3: Add the Code

Copy the code from `auth0-action-selective-mfa.js` and paste it into the Action editor:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const connection = event.connection.name;
  const usernamePasswordConnection = 'Username-Password-Authentication';
  
  if (connection === usernamePasswordConnection) {
    // Require MFA for external users (UN/PW connection)
    api.multifactor.enable('any', { allowRememberBrowser: false });
    
    console.log(`MFA required for user ${event.user.user_id} via connection: ${connection}`);
  } else {
    // Skip MFA for other connections
    console.log(`MFA skipped for user ${event.user.user_id} via connection: ${connection}`);
  }
};
```

Click **Save Draft**

### Step 4: Deploy the Action

1. Click **Deploy** button (top right)
2. Confirm deployment

### Step 5: Add Action to Login Flow

1. Navigate to **Actions** → **Flows** → **Login**
2. Find your **Selective MFA for External Users** action in the right sidebar
3. **Drag and drop** it between **Start** and **Complete**
4. **Important:** Place it AFTER any custom claims actions
5. Click **Apply**

## 🔍 Finding Your Connection Name

If you're not sure what your Username-Password connection is called:

1. Go to **Authentication** → **Database**
2. You'll see your database connection(s)
3. Common names:
   - `Username-Password-Authentication` (default)
   - `DB-Connection`
   - Custom name you created

Update the Action code with your actual connection name:
```javascript
const usernamePasswordConnection = 'YOUR-CONNECTION-NAME';
```

## 🎯 Customization Options

### Option 1: Allow "Remember Browser"

Let users skip MFA on trusted devices for 30 days:

```javascript
if (connection === usernamePasswordConnection) {
  api.multifactor.enable('any', { allowRememberBrowser: true });
}
```

### Option 2: Require Specific MFA Factor

Force a specific MFA method:

```javascript
// Require OTP (authenticator app) only
api.multifactor.enable('otp', { allowRememberBrowser: false });

// Require SMS only
api.multifactor.enable('sms', { allowRememberBrowser: false });

// Require email only
api.multifactor.enable('email', { allowRememberBrowser: false });
```

### Option 3: Multiple Connections

Require MFA for multiple connection types:

```javascript
const mfaConnections = [
  'Username-Password-Authentication',
  'Custom-DB-Connection',
  'Legacy-Users'
];

if (mfaConnections.includes(connection)) {
  api.multifactor.enable('any', { allowRememberBrowser: false });
}
```

### Option 4: Skip MFA for Specific Users

Exempt certain users from MFA:

```javascript
const connection = event.connection.name;
const userEmail = event.user.email;

// Admin emails that skip MFA
const adminEmails = [
  'admin@merryweather.com',
  'superuser@merryweather.com'
];

if (connection === 'Username-Password-Authentication' && !adminEmails.includes(userEmail)) {
  api.multifactor.enable('any', { allowRememberBrowser: false });
}
```

### Option 5: MFA Based on User Metadata

Require MFA based on user properties:

```javascript
const connection = event.connection.name;
const userRoles = event.user.app_metadata?.roles || [];

if (connection === 'Username-Password-Authentication') {
  // Require MFA for admin and manager roles
  if (userRoles.includes('admin') || userRoles.includes('manager')) {
    api.multifactor.enable('any', { allowRememberBrowser: false });
  }
}
```

### Option 6: MFA Based on IP Address

Require MFA for users outside your corporate network:

```javascript
const connection = event.connection.name;
const userIP = event.request.ip;

// Corporate IP ranges
const corporateIPs = ['203.0.113.0/24', '198.51.100.0/24'];

function isInCorporateNetwork(ip) {
  // Simple check - use a proper IP range library in production
  return corporateIPs.some(range => ip.startsWith(range.split('/')[0].substring(0, 10)));
}

if (connection === 'Username-Password-Authentication' && !isInCorporateNetwork(userIP)) {
  api.multifactor.enable('any', { allowRememberBrowser: false });
}
```

## 🧪 Testing the Action

### Test Scenario 1: Username-Password User

1. **Create a test user** in your Username-Password database
2. **Log in** with that user
3. **Expected:** User is prompted for MFA enrollment/verification
4. **Complete MFA** setup with authenticator app or SMS

### Test Scenario 2: Social Login User

1. **Log in** with Google, GitHub, or other social provider
2. **Expected:** User logs in directly without MFA prompt

### Test Scenario 3: Check Logs

1. Go to **Monitoring** → **Logs**
2. Filter by your test user
3. Look for console.log messages:
   - `MFA required for user...` (for UN/PW users)
   - `MFA skipped for user...` (for other connections)

## 📊 Understanding Connections

| Connection Type | Example | MFA Required? |
|----------------|---------|---------------|
| **Username-Password** | Database users | ✅ Yes |
| **Social** | Google, Facebook, GitHub | ❌ No |
| **Enterprise** | SAML, OIDC, AD | ❌ No |
| **Passwordless** | Email, SMS magic links | ❌ No |

## 🔐 MFA Factor Options

| Factor | Description | Requires |
|--------|-------------|----------|
| **any** | User chooses any enabled factor | At least one factor enabled |
| **otp** | Authenticator app (TOTP) | OTP factor enabled |
| **sms** | SMS code | Twilio configuration |
| **email** | Email code | Email factor enabled |
| **push** | Guardian push notification | Guardian app |
| **duo** | Duo Security | Duo integration |

## 🛡️ Security Best Practices

1. **Enable Multiple Factors**
   - Offer OTP and SMS as backup options
   - Users can choose their preferred method

2. **Don't Allow Remember Browser for High-Security Apps**
   - Set `allowRememberBrowser: false` for sensitive applications
   - Forces MFA on every login

3. **Monitor MFA Enrollment**
   - Track which users have enrolled in MFA
   - Send reminders to users who haven't enrolled

4. **Test Thoroughly**
   - Test all connection types
   - Verify MFA is required/skipped as expected

5. **Have a Backup Plan**
   - Provide account recovery options
   - Support multiple MFA factors in case one fails

## 🐛 Troubleshooting

### MFA Not Prompting

1. **Check MFA is enabled**
   - Security → Multi-factor Auth → At least one factor enabled

2. **Check Action is deployed**
   - Actions → Library → Verify status is "Deployed"

3. **Check Action is in flow**
   - Actions → Flows → Login → Verify action is active

4. **Check connection name**
   - Verify the connection name matches exactly
   - Check Authentication → Database for actual name

### MFA Prompting for All Users

1. **Check the condition**
   - Verify the `if (connection === ...)` logic is correct
   - Check for typos in connection name

2. **Check MFA policy**
   - Security → Multi-factor Auth → Policy should be "Never"
   - Let the Action control MFA, not the global policy

### Users Can't Complete MFA

1. **Check factor is enabled**
   - Security → Multi-factor Auth → Verify factor is active

2. **For SMS: Check Twilio**
   - Verify Twilio credentials are configured
   - Check Twilio account has credits

3. **For OTP: Check time sync**
   - User's device time must be accurate
   - Authenticator apps rely on time-based codes

## 📚 Resources

- [Auth0 MFA Documentation](https://auth0.com/docs/secure/multi-factor-authentication)
- [Actions MFA API](https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object#multifactor)
- [MFA Factors](https://auth0.com/docs/secure/multi-factor-authentication/multi-factor-authentication-factors)
- [Guardian Authenticator](https://auth0.com/docs/secure/multi-factor-authentication/multi-factor-authentication-factors/configure-push-notifications-for-mfa)

## 🎯 Summary

This Action provides fine-grained control over MFA requirements:

- ✅ External users (UN/PW) → MFA required
- ✅ Social/Enterprise users → MFA skipped
- ✅ Customizable based on roles, IP, metadata
- ✅ Flexible factor selection

---

**Your selective MFA is now configured!** External users will be prompted for MFA while other users can log in directly. 🔒
