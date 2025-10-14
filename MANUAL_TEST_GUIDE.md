# Manual Testing Guide - Authentication System

## 🚀 Quick Start

### Step 1: Start the Server
1. Double-click **START_SERVER.bat**
2. Wait for the message: "✅ Connected to MongoDB"
3. Server will be running on: http://localhost:5000
4. **Keep this window open!**

### Step 2: Create Test Users (Automated)
1. Open a **NEW** command prompt window
2. Double-click **TEST_AUTHENTICATION.bat**
3. This will create 3 test users automatically
4. Wait for "✨ All test users are ready to use!"

### Step 3: Test in Browser
1. Open browser: http://localhost:5000
2. Follow the test scenarios below

---

## 📋 Test Scenarios

### ✅ Test 1: User Registration (Signup)

**Steps:**
1. Click the **"Sign Up"** button in the header
2. Fill in the form:
   - **Name:** Test User
   - **Email:** testuser@example.com
   - **Password:** password123
   - **Confirm Password:** password123
3. Click **"Sign Up"** button

**Expected Results:**
- ✓ Loading spinner appears on button
- ✓ Green notification: "Registration successful!"
- ✓ Modal closes automatically
- ✓ After 1 second → Redirects to `/dashboard`
- ✓ Dashboard page loads with user info
- ✓ Header shows "Dashboard" and "Logout" buttons

**If it fails:**
- Check browser console (F12) for errors
- Check server terminal for error messages
- Verify MongoDB connection is active

---

### ✅ Test 2: User Login (Existing User)

**Steps:**
1. If logged in, click **"Logout"** first
2. Click the **"Login"** button in the header
3. Fill in the form:
   - **Email:** john@test.com
   - **Password:** password123
4. Click **"Login"** button

**Expected Results:**
- ✓ Loading spinner appears on button
- ✓ Green notification: "Login successful!"
- ✓ Modal closes automatically
- ✓ After 1 second → Redirects to `/dashboard`
- ✓ Dashboard page loads with user info
- ✓ Header shows "Dashboard" and "Logout" buttons

**Alternative Test Users:**
- jane@test.com / password123
- bob@test.com / password123

---

### ✅ Test 3: Admin Login

**Steps:**
1. If logged in, click **"Logout"** first
2. Click the **"Login"** button
3. Fill in the form:
   - **Email:** iyonicpay@gmail.com
   - **Password:** admin123
4. Click **"Login"** button

**Expected Results:**
- ✓ Loading spinner appears on button
- ✓ Green notification: "Login successful!"
- ✓ Modal closes automatically
- ✓ After 1 second → Redirects to `/admin`
- ✓ Admin panel loads
- ✓ Shows admin dashboard with statistics

---

### ✅ Test 4: Invalid Login (Wrong Password)

**Steps:**
1. Click **"Login"** button
2. Fill in the form:
   - **Email:** john@test.com
   - **Password:** wrongpassword
3. Click **"Login"** button

**Expected Results:**
- ✓ Loading spinner appears briefly
- ✓ Red notification: "Invalid email or password"
- ✓ Form shakes (animation)
- ✓ Email and password fields highlighted in red
- ✓ Modal stays open
- ✓ User can try again

---

### ✅ Test 5: Duplicate Email Registration

**Steps:**
1. Click **"Sign Up"** button
2. Fill in the form:
   - **Name:** Another User
   - **Email:** john@test.com (already exists)
   - **Password:** password123
   - **Confirm Password:** password123
3. Click **"Sign Up"** button

**Expected Results:**
- ✓ Loading spinner appears briefly
- ✓ Red notification: "Email already registered"
- ✓ Form shakes (animation)
- ✓ Modal stays open
- ✓ User can try different email

---

### ✅ Test 6: Password Mismatch (Frontend Validation)

**Steps:**
1. Click **"Sign Up"** button
2. Fill in the form:
   - **Name:** Test User
   - **Email:** newuser@test.com
   - **Password:** password123
   - **Confirm Password:** password456 (different!)
3. Click **"Sign Up"** button

**Expected Results:**
- ✓ Red notification: "Passwords do not match"
- ✓ Form shakes (animation)
- ✓ No API call made (frontend validation)
- ✓ Modal stays open

---

### ✅ Test 7: Invalid Email Format

**Steps:**
1. Click **"Sign Up"** button
2. Fill in the form:
   - **Name:** Test User
   - **Email:** notanemail (invalid format)
   - **Password:** password123
   - **Confirm Password:** password123
3. Click **"Sign Up"** button

**Expected Results:**
- ✓ Browser shows validation error
- ✓ Or red notification from backend
- ✓ Form stays open

---

### ✅ Test 8: Short Password (Backend Validation)

**Steps:**
1. Click **"Sign Up"** button
2. Fill in the form:
   - **Name:** Test User
   - **Email:** newuser@test.com
   - **Password:** 123 (too short)
   - **Confirm Password:** 123
3. Click **"Sign Up"** button

**Expected Results:**
- ✓ Red notification: "Password must be at least 6 characters"
- ✓ Form shakes (animation)
- ✓ Modal stays open

---

### ✅ Test 9: Logout Functionality

**Steps:**
1. Make sure you're logged in
2. Click the **"Logout"** button in the header

**Expected Results:**
- ✓ Green notification: "Logged out successfully"
- ✓ Header changes to show "Login" and "Sign Up" buttons
- ✓ "Dashboard" and "Logout" buttons disappear
- ✓ If on dashboard/admin page → Redirects to homepage

---

### ✅ Test 10: Dashboard Button

**Steps:**
1. Log in as a regular user
2. Click the **"Dashboard"** button in the header

**Expected Results:**
- ✓ Redirects to `/dashboard`
- ✓ Dashboard page loads
- ✓ Shows user profile information
- ✓ Shows order history (if any)

---

### ✅ Test 11: Protected Routes (Manual URL Test)

**Steps:**
1. Make sure you're logged out
2. Manually type in browser: http://localhost:5000/dashboard
3. Press Enter

**Expected Results:**
- ✓ Dashboard page loads (no backend protection yet)
- ✓ But user info won't load (no token)
- ✓ May show errors in console

**Note:** For full protection, you'd need to add route guards in the frontend or backend middleware.

---

## 🔍 Debugging Tips

### Check Browser Console (F12)
- Look for JavaScript errors
- Check Network tab for API calls
- Verify API responses (200 = success, 400/401 = error)

### Check Server Terminal
- Look for error messages
- Verify MongoDB connection
- Check for validation errors

### Common Issues

**Issue: Button just keeps loading**
- **Cause:** API endpoint not responding
- **Fix:** Check if server is running
- **Fix:** Check browser console for CORS errors
- **Fix:** Verify API_BASE_URL in config.js is correct

**Issue: "Network Error" in console**
- **Cause:** Server not running or wrong URL
- **Fix:** Make sure server is running on port 5000
- **Fix:** Check config.js has: `http://localhost:5000/api`

**Issue: "MongoDB connection error"**
- **Cause:** Database not accessible
- **Fix:** Check .env file has correct MONGODB_URI
- **Fix:** Check internet connection (if using MongoDB Atlas)

**Issue: "JWT_SECRET is not defined"**
- **Cause:** Missing environment variable
- **Fix:** Check .env file has JWT_SECRET defined
- **Fix:** Restart server after adding .env variables

---

## 📊 Test Checklist

Use this checklist to verify all functionality:

- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Admin user is created automatically
- [ ] Test users can be created via script
- [ ] New user can register via browser
- [ ] Registered user can login
- [ ] Admin can login
- [ ] Wrong password shows error
- [ ] Duplicate email shows error
- [ ] Password mismatch detected
- [ ] Invalid email format rejected
- [ ] Short password rejected
- [ ] Login redirects to dashboard
- [ ] Admin login redirects to admin panel
- [ ] Logout works correctly
- [ ] Dashboard button works
- [ ] User info displays correctly
- [ ] Token is stored in localStorage
- [ ] Notifications appear correctly
- [ ] Form animations work
- [ ] Loading states work

---

## 🎯 Success Criteria

**Authentication is working correctly if:**
1. ✅ Users can register new accounts
2. ✅ Users can login with correct credentials
3. ✅ Invalid credentials are rejected
4. ✅ Users are redirected to dashboard after login
5. ✅ Admin users are redirected to admin panel
6. ✅ Logout clears session and redirects
7. ✅ All error messages display correctly
8. ✅ All animations and loading states work
9. ✅ JWT tokens are generated and stored
10. ✅ Protected routes require authentication

---

## 📞 Need Help?

If tests are failing:
1. Check the server terminal for errors
2. Check browser console (F12) for errors
3. Verify all files are saved
4. Restart the server
5. Clear browser cache and localStorage
6. Try in incognito/private browsing mode

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** Ready for Testing