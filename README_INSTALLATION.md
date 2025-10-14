# 🔥 Lighter Pooa - Installation & Quick Start Guide

## ⚡ Quick Overview

You now have a **complete full-stack e-commerce platform** with:
- ✅ User authentication (signup/login)
- ✅ Paystack payment integration
- ✅ User dashboard with order history
- ✅ Admin panel for order management
- ✅ Responsive design with smoker theme
- ✅ MongoDB database integration
- ✅ RESTful API backend

## 📋 What You Need to Install

### 1. Node.js (Required)
**Download:** https://nodejs.org/
- Download the **LTS version** (recommended)
- Run the installer
- Accept all defaults
- Restart your computer after installation

**Verify installation:**
```powershell
node --version
npm --version
```

### 2. MongoDB (Required)
**Download:** https://www.mongodb.com/try/download/community
- Download **MongoDB Community Server**
- Run the installer
- Choose "Complete" installation
- Install as a Windows Service (recommended)
- Install MongoDB Compass (optional GUI tool)

**Verify installation:**
```powershell
mongod --version
```

### 3. Paystack Account (Required for payments)
**Sign up:** https://paystack.com/
1. Create a free account
2. Verify your email
3. Go to Settings → API Keys & Webhooks
4. Copy your **Test Public Key** and **Test Secret Key**

## 🚀 Installation Steps

### Step 1: Install Node.js Dependencies

Open PowerShell in the project folder and run:

```powershell
npm install
```

This will install all required packages (may take 2-3 minutes).

### Step 2: Configure Paystack Keys

1. Open `config.js` file
2. Find this line:
   ```javascript
   const PAYSTACK_PUBLIC_KEY = 'pk_test_your_paystack_public_key_here';
   ```
3. Replace with your actual Paystack public key

4. Open `.env` file
5. Find these lines:
   ```
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
   PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
   ```
6. Replace with your actual Paystack keys

### Step 3: Start MongoDB

MongoDB should start automatically if installed as a service. If not:

```powershell
net start MongoDB
```

### Step 4: Start the Server

**Option A: Using the batch file (Easy)**
- Double-click `START_SERVER.bat`

**Option B: Using PowerShell**
```powershell
npm start
```

**Option C: Development mode (auto-restart on changes)**
```powershell
npm run dev
```

### Step 5: Open the Website

Open your browser and go to:
- **Main Site:** http://localhost:5000
- **Admin Panel:** http://localhost:5000/admin

## 🔑 Default Admin Login

```
Email: admin@lighterpooa.com
Password: admin123
```

**⚠️ IMPORTANT:** Change these credentials after first login!

## 🧪 Testing Payments

Use these Paystack test card details:

```
Card Number: 4084 0840 8408 4081
Expiry Date: Any future date (e.g., 12/25)
CVV: 408
PIN: 0000
OTP: 123456
```

## 📁 Project Files Explained

### Backend Files (Node.js/Express)
- `server.js` - Main server file
- `package.json` - Dependencies list
- `.env` - Configuration (API keys, database URL)
- `models/` - Database schemas (User, Order)
- `routes/` - API endpoints (auth, orders, payment)
- `middleware/` - Authentication middleware

### Frontend Files (HTML/CSS/JS)
- `index.html` - Main homepage
- `dashboard.html` - User dashboard
- `admin.html` - Admin panel
- `styles.css` - Main styling
- `dashboard.css` - Dashboard styling
- `script.js` - Main JavaScript
- `auth.js` - Authentication logic
- `dashboard.js` - Dashboard functionality
- `admin.js` - Admin panel functionality
- `config.js` - Frontend configuration

## 🎯 How to Use

### For Customers:
1. **Sign Up** - Click "Sign Up" button, fill form
2. **Browse Products** - Scroll to products section
3. **Add to Cart** - Click "Add to Cart" on products
4. **Checkout** - Click cart icon, then "Proceed to Checkout"
5. **Pay** - Fill shipping info, complete Paystack payment
6. **View Orders** - Click "Dashboard" to see order history

### For Admin:
1. **Login** - Use admin credentials
2. **View Dashboard** - See statistics and metrics
3. **Manage Orders** - View all orders, update status
4. **View Users** - See all registered users
5. **Update Status** - Click "Update" on any order

## 🛠️ Customization

### Change Products
Edit `script.js`, find the `products` array:
```javascript
const products = [
    {
        id: 1,
        name: "Your Product Name",
        category: "lighters", // or "accessories" or "gadgets"
        price: 29.99,
        description: "Product description",
        emoji: "🔥" // or use image URL
    },
    // Add more products...
];
```

### Change Colors
Edit `styles.css`, find the `:root` section:
```css
:root {
    --primary-color: #ff6b35;      /* Main orange */
    --secondary-color: #f7931e;    /* Gold accent */
    --dark-bg: #1a1a1a;            /* Dark background */
}
```

### Change Company Info
Edit `index.html`:
- Company name in header
- Contact information
- About section text
- Footer text

## 🐛 Troubleshooting

### "npm is not recognized"
**Problem:** Node.js not installed or not in PATH
**Solution:** 
1. Install Node.js from nodejs.org
2. Restart computer
3. Try again

### "MongoDB connection failed"
**Problem:** MongoDB not running
**Solution:**
```powershell
net start MongoDB
```

### "Port 5000 already in use"
**Problem:** Another app using port 5000
**Solution:** 
1. Open `.env` file
2. Change `PORT=5000` to `PORT=3000`
3. Restart server

### Paystack payment not working
**Problem:** Wrong API keys or not configured
**Solution:**
1. Check keys in `.env` and `config.js`
2. Make sure using TEST keys (start with `pk_test_` and `sk_test_`)
3. Check internet connection

### Can't login as admin
**Problem:** Admin user not created
**Solution:**
1. Stop the server
2. Delete database: Open MongoDB Compass, delete `lighter-pooa` database
3. Restart server (admin will be recreated)

## 📊 Database Structure

### Users Collection
- name, email, password (hashed)
- phone, address
- role (user/admin)
- createdAt

### Orders Collection
- orderNumber (auto-generated)
- userId (reference to user)
- items (array of products)
- totalAmount
- shippingInfo
- paymentInfo (Paystack reference, status)
- orderStatus (pending/processing/shipped/delivered)
- createdAt, updatedAt

## 🔒 Security Notes

### For Development:
- ✅ Using test Paystack keys
- ✅ JWT tokens for authentication
- ✅ Passwords hashed with bcrypt
- ✅ CORS enabled for local development

### For Production:
- [ ] Change admin password
- [ ] Use Paystack LIVE keys
- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong JWT secret
- [ ] Enable MongoDB authentication
- [ ] Add rate limiting
- [ ] Set secure CORS policy
- [ ] Use environment variables on server

## 🚀 Deployment (When Ready)

### Recommended Platforms:
1. **Heroku** (Easy, free tier available)
2. **DigitalOcean** (More control, $5/month)
3. **AWS** (Scalable, pay as you go)
4. **Railway** (Modern, easy deployment)

### Database Hosting:
- **MongoDB Atlas** (Free tier, 512MB)
- Recommended for production

## 📞 Support

If you encounter issues:
1. Check this README
2. Check SETUP_GUIDE.md for detailed instructions
3. Check browser console (F12) for errors
4. Check server terminal for error messages
5. Verify all environment variables are set

## ✨ Features Included

### User Features:
- ✅ User registration and login
- ✅ Profile management
- ✅ Shopping cart (persistent)
- ✅ Secure checkout with Paystack
- ✅ Order history
- ✅ Order details view
- ✅ Responsive design (mobile-friendly)

### Admin Features:
- ✅ Admin dashboard with statistics
- ✅ View all orders
- ✅ Update order status
- ✅ View all users
- ✅ Filter orders by status
- ✅ Real-time revenue tracking

### Technical Features:
- ✅ RESTful API
- ✅ JWT authentication
- ✅ MongoDB database
- ✅ Paystack payment integration
- ✅ Password hashing
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design

## 🎉 You're All Set!

Your e-commerce platform is ready to use. Start the server and begin testing!

```powershell
npm start
```

Then open: http://localhost:5000

---

**Made with 🔥 for Lighter Pooa**

Need help? Check the troubleshooting section or review the setup guide!