# 📧 Check User Accounts Guide

## 🎯 **How to Check Email Accounts**

---

## 🚀 **Quick Check (Easiest)**

### **Just run:**
```bash
check-accounts.bat
```

**This shows:**
- ✅ How many users exist
- ✅ Each user's email
- ✅ Each user's role
- ✅ Active/Inactive status
- ✅ Which test accounts are ready

---

## 📝 **OR Check Manually**

### **Method 1: Via Script**
```bash
cd Backend
node scripts/check-users.js
```

### **Method 2: Via MongoDB**
```bash
# Connect to MongoDB
mongo fraud_evidence

# Or with newer mongosh
mongosh fraud_evidence

# Count users
db.users.count()

# List all users
db.users.find({}, {email: 1, role: 1, isActive: 1})
```

### **Method 3: Via API (Backend running)**
```bash
curl http://localhost:5050/api/users \
  -H "x-user-role: admin"
```

---

## 📊 **Expected Output**

When you run `check-accounts.bat`, you'll see:

```
========================================
   USER ACCOUNTS STATUS
========================================

Total Users: 4

📋 ADMIN (1 user):

  1. Email: admin@fraud.com
     Name: Admin User
     Status: ✅ Active
     Permissions: 15
     Created: 2025-10-11

📋 INVESTIGATOR (1 user):

  1. Email: investigator@fraud.com
     Name: Investigator User
     Status: ✅ Active
     Permissions: 12
     Created: 2025-10-11

📋 ANALYST (1 user):

  1. Email: analyst@fraud.com
     Name: Analyst User
     Status: ✅ Active
     Permissions: 8
     Created: 2025-10-11

📋 USER (1 user):

  1. Email: user@fraud.com
     Name: Basic User
     Status: ✅ Active
     Permissions: 3
     Created: 2025-10-11

========================================
   SUMMARY
========================================
Total Users: 4
Active Users: 4
Inactive Users: 0

By Role:
  - admin: 1
  - investigator: 1
  - analyst: 1
  - user: 1
========================================

💡 Test Login Credentials:

✅ admin@fraud.com / admin123 (admin)
✅ investigator@fraud.com / invest123 (investigator)
✅ analyst@fraud.com / analyst123 (analyst)
✅ user@fraud.com / user123 (user)
```

---

## 🔧 **If No Users Found**

**Run this to create test users:**
```bash
cd Backend
node scripts/create-test-users.js
```

**Or use the automated setup:**
```bash
setup-login.bat
```

---

## ✅ **Available Commands**

| Command | What It Does |
|---------|-------------|
| `check-accounts.bat` | Show all user accounts |
| `setup-login.bat` | Setup login (create .env, start MongoDB, create users) |
| `create-test-users.js` | Create 4 test users |
| `test-login.js` | Test if login works |

---

## 📧 **Test Accounts Created**

After running `setup-login.bat` or `create-test-users.js`, you'll have:

1. **admin@fraud.com** → Admin account
2. **investigator@fraud.com** → Investigator account
3. **analyst@fraud.com** → Analyst account
4. **user@fraud.com** → Basic user account

**All accounts are active and ready to login!**

---

## 🧪 **Verify Accounts Work**

### **Test 1: Check accounts exist**
```bash
check-accounts.bat
```

### **Test 2: Try login**
```bash
node test-login.js
```

### **Test 3: Login via frontend**
1. Open: http://localhost:3000
2. Email: admin@fraud.com
3. Password: admin123
4. Click Login

---

## 🆘 **Troubleshooting**

### **"NO USERS FOUND"**
**Solution:**
```bash
cd Backend
node scripts/create-test-users.js
```

### **"Cannot connect to MongoDB"**
**Solution:**
```bash
# Start MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start MongoDB service
net start MongoDB
```

### **"User not found" when trying to login**
**Solution:**
```bash
# Recreate test users
cd Backend
node scripts/create-test-users.js
```

---

## 📊 **Account Status Check**

**To see account status at any time:**
```bash
check-accounts.bat
```

**This tells you:**
- How many accounts exist
- Which emails are registered
- What role each has
- If accounts are active
- Which test credentials work

---

## ✅ **Quick Setup Flow**

```bash
# 1. Setup everything
setup-login.bat

# 2. Check accounts were created
check-accounts.bat

# 3. Start system
start-fullstack.bat

# 4. Login at http://localhost:3000
# Use: admin@fraud.com / admin123
```

---

**Status:** ✅ **Scripts Ready**  
**Check Accounts:** `check-accounts.bat`  
**Create Users:** `setup-login.bat`  
**Test Login:** `test-login.js`

🎉 **YOU CAN NOW CHECK AND MANAGE ACCOUNTS!** 🎉

