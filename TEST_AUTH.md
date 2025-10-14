# Authentication Testing Guide

## Changes Made to Fix Login/Signup

### 1. Frontend Fixes (auth.js)
- ✅ Added `setLoadingState()` function to disable form inputs during submission
- ✅ Added `highlightFormErrors()` function to highlight invalid fields
- ✅ Added `shakeForm()` function to animate form on error
- ✅ Improved error handling with proper error messages

### 2. Frontend Fixes (script.js)
- ✅ Updated `showNotification()` to accept error type parameter
- ✅ Added visual distinction between success and error notifications

### 3. CSS Fixes (styles.css)
- ✅ Added `.error` class styling for form inputs
- ✅ Added `@keyframes shake` animation
- ✅ Added `.shake` class for form animation
- ✅ Added `.spinner` and loading state styles
- ✅ Added `.is-loading` class for button states

### 4. Backend Fixes (routes/auth.js)
- ✅ Improved validation error messages
- ✅ Added duplicate email error handling (MongoDB error code 11000)
- ✅ Added validation error handling
- ✅ Return complete user data including phone, address, and createdAt
- ✅ Better error messages for all scenarios

### 5. Database Model Fixes (models/User.js)
- ✅ Added validation messages to schema fields
- ✅ Added email regex validation
- ✅ Added password minimum length validation
- ✅ Added email index for faster lookups

### 6. Server Fixes (server.js)
- ✅ Added MongoDB connection options
- ✅ Added connection event handlers
- ✅ Better error logging
- ✅ Exit process on connection failure

## How to Test

### 1. Start the Server
```bash
npm start
```

### 2. Test Registration
1. Open http://localhost:5000
2. Click "Sign Up" button
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
4. Click "Create Account"
5. Should see success notification and be logged in

### 3. Test Login
1. Click "Logout" if logged in
2. Click "Login" button
3. Fill in the form:
   - Email: test@example.com
   - Password: test123
4. Click "Login"
5. Should see success notification and be logged in

### 4. Test Error Handling

#### Invalid Email
- Try registering with invalid email (e.g., "notanemail")
- Should see error: "Valid email is required"

#### Short Password
- Try registering with password less than 6 characters
- Should see error: "Password must be at least 6 characters"

#### Password Mismatch
- Try registering with different passwords in password and confirm password fields
- Should see error: "Passwords do not match"

#### Duplicate Email
- Try registering with an email that already exists
- Should see error: "Email already registered"

#### Wrong Password
- Try logging in with wrong password
- Should see error: "Invalid email or password"

#### Non-existent User
- Try logging in with email that doesn't exist
- Should see error: "Invalid email or password"

## Admin Login
- Email: iyonicpay@gmail.com
- Password: admin123
- Should redirect to /admin after login

## Expected Behavior

### Success States
- ✅ Form inputs disabled during submission
- ✅ Loading spinner shown on submit button
- ✅ Success notification with green background
- ✅ Modal closes automatically
- ✅ User menu appears in header
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage

### Error States
- ✅ Form inputs shake on error
- ✅ Invalid fields highlighted in red
- ✅ Error notification with red background
- ✅ Form remains open for correction
- ✅ Inputs re-enabled after error
- ✅ Clear error messages displayed

## Troubleshooting

### MongoDB Connection Issues
If you see "MongoDB connection error":
1. Check .env file has correct MONGODB_URI
2. Ensure MongoDB Atlas allows your IP address
3. Verify database user has correct permissions

### CORS Issues
If you see CORS errors in browser console:
1. Server should have `cors()` middleware enabled
2. Check server is running on correct port (5000)

### Token Issues
If authentication fails after login:
1. Check JWT_SECRET is set in .env
2. Verify token is being stored in localStorage
3. Check Authorization header is being sent with requests

## API Endpoints

### POST /api/auth/register
Request:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "phone": "",
    "address": {},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/login
Request:
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "phone": "",
    "address": {},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/auth/me
Headers:
```
Authorization: Bearer jwt_token_here
```

Response (Success):
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "phone": "",
    "address": {},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Files Modified

1. `auth.js` - Added helper functions for form handling
2. `script.js` - Updated notification function
3. `styles.css` - Added error states and animations
4. `routes/auth.js` - Improved error handling
5. `models/User.js` - Added validation and indexes
6. `server.js` - Improved MongoDB connection handling

## Next Steps

After testing, you can:
1. Customize error messages
2. Add password strength requirements
3. Implement email verification
4. Add "Forgot Password" functionality
5. Add social login (Google, Apple)
6. Add rate limiting for security