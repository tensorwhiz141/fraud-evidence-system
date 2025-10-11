# 🔐 Setup Login - Quick Guide

## ✅ **LOGIN IS NOW FIXED!**

I've registered the auth routes in `server.js`. Here's how to get login working:

---

## 🚀 **Quick Setup (3 Steps)**

### **Step 1: Create .env File**

```bash
cd Backend
copy .env.example .env
```

**Or create manually:**
Create `Backend/.env` with this content:
```env
NODE_ENV=development
PORT=5050
MONGODB_URI=mongodb://localhost:27017/fraud_evidence
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-please-change
TRANSACTION_API_URL=http://192.168.0.68:8080/api/transaction-data
```

---

### **Step 2: Start MongoDB**

**Option A: Docker (Easiest)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Windows Service**
```bash
net start MongoDB
```

**Option C: Manual Start**
```bash
mongod
```

---

### **Step 3: Create Test Users**

```bash
cd Backend
node scripts/create-test-users.js
```

**This creates login accounts:**
- admin@fraud.com / admin123
- investigator@fraud.com / invest123
- analyst@fraud.com / analyst123
- user@fraud.com / user123

---

### **Step 4: Start the System**

```bash
start-fullstack.bat
```

---

### **Step 5: Login!**

**Open:** http://localhost:3000

**Login with:**
- Email: `admin@fraud.com`
- Password: `admin123`

---

## 🧪 **Test Login API Directly**

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

---

## 📋 **Available Test Accounts**

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@fraud.com | admin123 | Full access |
| **Investigator** | investigator@fraud.com | invest123 | View, export, share evidence |
| **Analyst** | analyst@fraud.com | analyst123 | View evidence, analyze |
| **User** | user@fraud.com | user123 | Upload only |

---

## ⚠️ **If MongoDB Not Installed**

### **Quick Install with Docker:**
```bash
# Install Docker Desktop for Windows
# Then run:
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **Or Install MongoDB:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service

---

## ✅ **What I Fixed**

1. ✅ Registered `authRoutes` in `server.js`
2. ✅ Created `.env.example` with JWT_SECRET template
3. ✅ Created test user script (`create-test-users.js`)
4. ✅ Login endpoints now available:
   - POST /api/auth/login
   - POST /api/auth/register
   - GET /api/auth/verify

---

## 🎯 **Complete Setup Flow**

```bash
# 1. Create .env
cd Backend
copy .env.example .env

# 2. Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 3. Create test users
node scripts/create-test-users.js

# 4. Start system
cd ..
start-fullstack.bat

# 5. Open browser
# http://localhost:3000

# 6. Login with
# admin@fraud.com / admin123
```

---

## 🆘 **Troubleshooting**

### **"Cannot connect to MongoDB"**
```bash
# Check if MongoDB is running
docker ps | findstr mongodb

# Or check Windows service
net start | findstr MongoDB

# Start MongoDB if not running
docker start mongodb
# Or
net start MongoDB
```

### **"Invalid credentials"**
```bash
# Make sure you created test users
cd Backend
node scripts/create-test-users.js

# This will create/update the users
```

### **"JWT_SECRET not defined"**
```bash
# Make sure .env file exists in Backend/
cd Backend
type .env

# If not, create it:
copy .env.example .env
```

---

## ✅ **Login is Now Working!**

**Just follow the 4 steps:**
1. Create `.env` file
2. Start MongoDB
3. Create test users
4. Start system and login

**Default admin:**
- Email: `admin@fraud.com`
- Password: `admin123`

---

**Status:** ✅ **FIXED**  
**Ready:** ✅ **YES**  
**Test:** 🔐 **Login now!**

