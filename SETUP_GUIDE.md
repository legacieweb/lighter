# 🔥 Lighter Pooa - Complete Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Paystack Account** - [Sign up here](https://paystack.com/)

## Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- axios
- express-validator

## Step 2: Setup MongoDB

### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
3. MongoDB will run on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your database password

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` file with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/lighter-pooa
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lighter-pooa

# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here

# Admin Credentials
ADMIN_EMAIL=admin@lighterpooa.com
ADMIN_PASSWORD=admin123
```

## Step 4: Get Paystack API Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys & Webhooks**
4. Copy your **Test Public Key** and **Test Secret Key**
5. Paste them in your `.env` file

**Important:** Use test keys for development, live keys for production.

## Step 5: Update Frontend Configuration

Edit `config.js` and add your Paystack public key:

```javascript
const PAYSTACK_PUBLIC_KEY = 'pk_test_your_actual_public_key_here';
```

## Step 6: Start the Server

Run the development server:

```powershell
npm run dev
```

Or for production:

```powershell
npm start
```

You should see:
```
✅ Connected to MongoDB
✅ Admin user created
📧 Email: admin@lighterpooa.com
🔑 Password: admin123
🚀 Server running on http://localhost:5000
```

## Step 7: Access the Application

Open your browser and navigate to:
- **Homepage:** http://localhost:5000
- **Dashboard:** http://localhost:5000/dashboard (after login)
- **Admin Panel:** http://localhost:5000/admin (admin login)

## Default Admin Credentials

```
Email: admin@lighterpooa.com
Password: admin123
```

**⚠️ Change these credentials in production!**

## Testing the Application

### 1. Test User Registration
1. Click "Sign Up" button
2. Fill in the form
3. Submit to create account

### 2. Test User Login
1. Click "Login" button
2. Enter credentials
3. You should be logged in and see Dashboard/Logout buttons

### 3. Test Shopping
1. Browse products
2. Add items to cart
3. Click cart icon to view
4. Adjust quantities
5. Click "Proceed to Checkout"

### 4. Test Paystack Payment
1. Fill in shipping information
2. Click "Complete Purchase"
3. Paystack popup will appear
4. Use test card details:
   - **Card Number:** 4084084084084081
   - **Expiry:** Any future date
   - **CVV:** 408
   - **PIN:** 0000
   - **OTP:** 123456

### 5. Test Admin Panel
1. Login with admin credentials
2. Navigate to admin panel
3. View statistics
4. Manage orders
5. Update order status
6. View users

## Project Structure

```
lighter-pooa/
├── models/              # Database models
│   ├── User.js
│   └── Order.js
├── routes/              # API routes
│   ├── auth.js
│   ├── orders.js
│   ├── users.js
│   └── payment.js
├── middleware/          # Custom middleware
│   └── auth.js
├── public files/        # Frontend files
│   ├── index.html
│   ├── dashboard.html
│   ├── admin.html
│   ├── styles.css
│   ├── dashboard.css
│   ├── script.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── admin.js
│   └── config.js
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables
└── .env.example       # Environment template
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/payment` - Update payment status

### Admin
- `GET /api/orders/admin/all` - Get all orders
- `PUT /api/orders/admin/:id/status` - Update order status
- `GET /api/orders/admin/stats` - Get order statistics
- `GET /api/users/admin/all` - Get all users
- `GET /api/users/admin/stats` - Get user statistics

### Payment
- `POST /api/payment/initialize` - Initialize Paystack payment
- `GET /api/payment/verify/:ref` - Verify payment

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```powershell
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` file or kill the process using port 5000

### Paystack Payment Not Working
**Check:**
1. Paystack keys are correct in `.env` and `config.js`
2. Using test keys for development
3. Internet connection is active
4. Browser console for errors

### Admin User Not Created
**Solution:** Delete the database and restart server:
```powershell
# In MongoDB shell
use lighter-pooa
db.dropDatabase()
```
Then restart the server.

## Production Deployment

### 1. Update Environment Variables
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Use Paystack live keys
- Change admin password
- Generate strong JWT secret

### 2. Security Checklist
- [ ] Change default admin credentials
- [ ] Use HTTPS
- [ ] Enable CORS only for your domain
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets

### 3. Deployment Platforms
- **Heroku:** Easy deployment with MongoDB Atlas
- **DigitalOcean:** Full control with droplets
- **AWS:** Scalable with EC2 and MongoDB Atlas
- **Vercel/Netlify:** Frontend only (need separate backend)

## Support

For issues or questions:
- Check the troubleshooting section
- Review MongoDB and Node.js logs
- Check browser console for frontend errors
- Verify all environment variables are set correctly

## Next Steps

1. **Customize Products:** Edit the `products` array in `script.js`
2. **Add Product Images:** Replace emoji with actual images
3. **Email Notifications:** Integrate email service (SendGrid, Mailgun)
4. **SMS Notifications:** Add Twilio for order updates
5. **Advanced Features:** 
   - Product reviews
   - Wishlist
   - Order tracking
   - Discount codes
   - Inventory management

---

**🔥 Your Lighter Pooa e-commerce platform is ready!**

Happy selling! 🚀