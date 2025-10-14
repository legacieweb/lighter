# Authentication System Test Guide

## Overview
This guide will help you test the new separate login and signup pages that work with MongoDB backend.

## What's New

### 1. **Separate HTML Pages**
- **index.html** - Main landing page (no auth modals)
- **login.html** - Dedicated login page
- **signup.html** - Dedicated signup page

### 2. **Updated Navigation**
- Login and Signup buttons now link to separate pages
- User menu shows when logged in with greeting and logout button
- Automatic redirect to dashboard after successful login/signup

### 3. **Backend Integration**
- Full MongoDB integration
- JWT token authentication
- Secure password hashing with bcrypt
- Session persistence with localStorage

## Testing Steps

### Step 1: Start the Server

```bash
node server.js
```

You should see:
```
✅ Connected to MongoDB
📊 Database: test (or your database name)
✅ Admin user created (if first time)
📧 Email: iyonicpay@gmail.com
🔑 Password: admin123
🚀 Server running on http://localhost:5000
🔥 Lighter Pooa Backend Started
```

### Step 2: Test the Landing Page

1. Open browser and go to: `http://localhost:5000`
2. You should see:
   - Header with "Login" and "Sign Up" buttons
   - Products section
   - About section
   - Contact section

### Step 3: Test Signup Flow

1. Click "Sign Up" button in header
2. You should be redirected to: `http://localhost:5000/signup.html`
3. Fill in the form:
   - **Full Name**: Test User
   - **Email**: test@example.com
   - **Password**: test123 (must be 6+ chars with a number)
   - **Confirm Password**: test123
   - Check "I agree to terms" checkbox
4. Click "Create Account"
5. You should see:
   - Success message: "Account created successfully! Redirecting..."
   - Automatic redirect to dashboard after 1.5 seconds

### Step 4: Test Login Flow

1. Go back to home page: `http://localhost:5000`
2. Click "Login" button in header
3. You should be redirected to: `http://localhost:5000/login.html`
4. Fill in the form:
   - **Email**: test@example.com
   - **Password**: test123
   - Optional: Check "Remember me"
5. Click "Login"
6. You should see:
   - Success message: "Login successful! Redirecting..."
   - Automatic redirect to dashboard

### Step 5: Test Admin Login

1. Go to: `http://localhost:5000/login.html`
2. Login with admin credentials:
   - **Email**: iyonicpay@gmail.com
   - **Password**: admin123
3. You should be redirected to: `http://localhost:5000/admin.html`

### Step 6: Test Authentication State

1. After logging in, go back to home page: `http://localhost:5000`
2. You should see:
   - "Hi, [Your Name]!" greeting in header
   - "Dashboard" button
   - "Logout" button
   - NO "Login" or "Sign Up" buttons

### Step 7: Test Logout

1. Click "Logout" button in header
2. You should see:
   - Success notification: "Logged out successfully!"
   - Page reloads
   - "Login" and "Sign Up" buttons appear again

### Step 8: Test Password Validation

1. Go to signup page
2. Try entering password: "test" (too short)
3. You should see:
   - Red indicator on "At least 6 characters" requirement
4. Try entering password: "testing" (no number)
5. You should see:
   - Red indicator on "Contains a number" requirement
6. Enter password: "test123"
7. You should see:
   - Green indicators on both requirements

### Step 9: Test Error Handling

#### Test 1: Duplicate Email
1. Try to signup with an email that already exists
2. You should see error: "Email already registered"

#### Test 2: Invalid Credentials
1. Try to login with wrong password
2. You should see error: "Invalid email or password"

#### Test 3: Password Mismatch
1. On signup page, enter different passwords
2. You should see error: "Passwords do not match"

#### Test 4: Empty Fields
1. Try to submit forms with empty fields
2. Browser validation should prevent submission

### Step 10: Test Token Persistence

1. Login to your account
2. Close the browser completely
3. Open browser again and go to: `http://localhost:5000`
4. You should still be logged in (user menu visible)

### Step 11: Test Protected Routes

1. Without logging in, try to access: `http://localhost:5000/dashboard.html`
2. Dashboard should load but may show "Please login" message
3. Login and access dashboard again
4. You should see your user data and orders

## API Endpoints Being Used

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user data

### Response Format

#### Successful Login/Signup:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

## Browser Console Checks

Open browser console (F12) and check for:

### Successful Login:
```
🌐 API Call: POST http://localhost:5000/api/auth/login
📡 Response Status: 200 OK
📦 Response Data: {success: true, token: "...", user: {...}}
```

### Successful Signup:
```
🌐 API Call: POST http://localhost:5000/api/auth/register
📡 Response Status: 201 Created
📦 Response Data: {success: true, token: "...", user: {...}}
```

## LocalStorage Data

After successful login, check localStorage (F12 > Application > Local Storage):

You should see:
- `lighterPooaToken`: JWT token string
- `lighterPooaUser`: JSON string with user data

## Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Solution**: Make sure server is running on port 5000

### Issue 2: "MongoDB connection error"
**Solution**: Check MONGODB_URI in .env file

### Issue 3: "CORS error"
**Solution**: Server already has CORS enabled, clear browser cache

### Issue 4: Login button doesn't work
**Solution**: Check browser console for JavaScript errors

### Issue 5: Not redirecting after login
**Solution**: Check if token is being saved in localStorage

### Issue 6: User menu not showing after login
**Solution**: Refresh the page or check console for errors

## Database Verification

To verify users are being created in MongoDB:

1. Go to MongoDB Atlas dashboard
2. Navigate to your cluster
3. Click "Browse Collections"
4. Select your database
5. Check "users" collection
6. You should see your registered users

## Security Features

✅ **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)
✅ **JWT Tokens**: Secure token-based authentication (7 day expiry)
✅ **Input Validation**: Email and password validation on backend
✅ **XSS Protection**: Input sanitization with express-validator
✅ **HTTPS Ready**: Works with HTTPS in production

## Next Steps

After successful testing:

1. ✅ All authentication flows work correctly
2. ✅ Users can register and login
3. ✅ Tokens are stored and validated
4. ✅ Protected routes work
5. ✅ Logout functionality works

You can now:
- Customize the design of login/signup pages
- Add password reset functionality
- Add email verification
- Add social login (Google, Facebook)
- Add two-factor authentication

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check server logs for backend errors
3. Verify MongoDB connection
4. Check .env file configuration
5. Clear browser cache and localStorage

---

**Created**: 2024
**Version**: 1.0
**Status**: ✅ Ready for Testing