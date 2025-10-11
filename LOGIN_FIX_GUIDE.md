# 🔐 Login Fix Guide

## ✅ **LOGIN ISSUE FIXED!**

**Problem:** Auth routes were not registered in server.js  
**Solution:** ✅ Fixed - Auth routes now registered

---

## 🚀 **How to Enable Login**

### **Step 1: Start MongoDB (Required)**

**Windows:**
```bash
# If MongoDB installed as service
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

**Mac/Linux:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or systemd
sudo systemctl start mongod
```

**Docker (Easiest):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

### **Step 2: Create Test Users**

```bash
cd Backend
node scripts/create-test-users.js
```

**This creates:**
- ✅ admin@fraud.com / admin123 (admin role)
- ✅ investigator@fraud.com / invest123 (investigator role)
- ✅ analyst@fraud.com / analyst123 (analyst role)
- ✅ user@fraud.com / user123 (basic user role)

---

### **Step 3: Start the Backend**

```bash
cd Backend
npm start
```

**Or use:**
```bash
start-fullstack.bat
```

---

### **Step 4: Test Login**

**Via API:**
```bash
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fraud.com", "password": "admin123"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Via Frontend:**
1. Open http://localhost:3000
2. Enter email: `admin@fraud.com`
3. Enter password: `admin123`
4. Click Login

---

## ✅ **What Was Fixed**

### **1. Auth Routes Registered ✅**
```javascript
// Added to server.js:
app.use('/api/auth', authRoutes);
```

### **2. .env File Created ✅**
```
Backend/.env created with JWT_SECRET
```

### **3. Test User Script Created ✅**
```
Backend/scripts/create-test-users.js
```

---

## 🔐 **Available Login Endpoints**

**POST /api/auth/login**
```json
{
  "email": "admin@fraud.com",
  "password": "admin123"
}
```

**POST /api/auth/register**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**GET /api/auth/verify**
```
Headers: Authorization: Bearer <token>
```

---

## 🧪 **Test Login Works**

### **Method 1: Quick Test**
```bash
# Make sure backend is running
cd Backend
npm start

# In another terminal
node scripts/create-test-users.js

# Test login
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fraud.com", "password": "admin123"}'
```

### **Method 2: Frontend Test**
1. Start: `start-fullstack.bat`
2. Open: http://localhost:3000
3. Login with: `admin@fraud.com` / `admin123`

---

## ⚠️ **Common Login Issues & Fixes**

### **Issue 1: "No token provided"**
**Cause:** Backend not running or auth routes not registered  
**Fix:** ✅ Already fixed - routes registered

### **Issue 2: "Invalid credentials"**
**Cause:** No users in database  
**Fix:** Run `node scripts/create-test-users.js`

### **Issue 3: "JWT_SECRET not defined"**
**Cause:** Missing environment variable  
**Fix:** ✅ Already fixed - .env file created

### **Issue 4: "Cannot connect to MongoDB"**
**Cause:** MongoDB not running  
**Fix:** Start MongoDB (see Step 1 above)

### **Issue 5: "User already exists"**
**Cause:** Trying to register with existing email  
**Fix:** Use login instead, or use different email

---

## 🎯 **Default Test Credentials**

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@fraud.com | admin123 |
| **Investigator** | investigator@fraud.com | invest123 |
| **Analyst** | analyst@fraud.com | analyst123 |
| **User** | user@fraud.com | user123 |

---

## 🚀 **Quick Setup (3 Steps)**

### **1. Start MongoDB:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **2. Create Users:**
```bash
cd Backend
node scripts/create-test-users.js
```

### **3. Start System:**
```bash
start-fullstack.bat
```

**Then login at:** http://localhost:3000  
**Credentials:** admin@fraud.com / admin123

---

## 📝 **What's Available Now**

**Auth Endpoints:**
- ✅ POST /api/auth/login - Login with email/password
- ✅ POST /api/auth/register - Register new user
- ✅ GET /api/auth/verify - Verify JWT token

**Features:**
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Login logging for audit
- ✅ 7-day token expiry

---

## 🆘 **Still Can't Login?**

### **Debug Steps:**

**1. Check Backend Logs:**
```bash
cd Backend
npm start
# Watch the console for login attempts
```

**2. Test Auth Endpoint:**
```bash
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fraud.com", "password": "admin123"}' -v
```

**3. Check MongoDB:**
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ping')"

# Or with mongosh
mongosh --eval "db.adminCommand('ping')"
```

**4. Verify User Exists:**
```bash
# In MongoDB
mongo fraud_evidence
db.users.find({email: "admin@fraud.com"})
```

---

## ✅ **Summary**

**Fixed:**
- ✅ Auth routes registered in server.js
- ✅ .env file created with JWT_SECRET
- ✅ Test user creation script provided

**To Login:**
1. Start MongoDB
2. Run `node scripts/create-test-users.js`
3. Start backend: `npm start`
4. Login at http://localhost:3000 with test credentials

---

**Status:** ✅ **LOGIN FIXED**  
**Ready:** ✅ **YES**  
**Test Credentials:** admin@fraud.com / admin123

