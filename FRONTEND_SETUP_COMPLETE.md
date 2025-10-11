# ✅ Frontend Setup Complete!

## 🎉 **All Dependencies Installed**

Frontend React app is now ready to run!

---

## 🚀 **How to Start**

### **Option 1: Full Stack (Backend + Frontend)**
```bash
start-fullstack.bat
```
This will open 2 windows:
- Backend on http://localhost:5050
- Frontend on http://localhost:3000

### **Option 2: Frontend Only**
```bash
start-frontend.bat
```
Or manually:
```bash
cd Frontend
npm start
```

### **Option 3: Backend Only**
```bash
start-server.bat
```
Or manually:
```bash
cd Backend
node server.js
```

---

## 📊 **Application URLs**

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React web interface |
| **Backend API** | http://localhost:5050 | REST API server |
| **API Health** | http://localhost:5050/health | Health check |
| **BHIV Core** | http://localhost:5050/api/core/health | BHIV integration |

---

## 🎯 **What You'll See**

### **Frontend (Port 3000):**
```
Compiled successfully!

You can now view wallet-auth-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### **Backend (Port 5050):**
```
========================================
🚀 Fraud Evidence Server Started
========================================
📡 Server: http://localhost:5050
📝 Health: http://localhost:5050/health
🔐 RBAC: Enabled
========================================
```

---

## ⚠️ **Common Warnings (Normal)**

### **Frontend Warnings (Can be ignored):**
- ⚠️ Deprecated package warnings - Normal, app still works
- ⚠️ 10 vulnerabilities - React Scripts dependencies, not blocking

### **Backend Warnings (Expected):**
- ⚠️ "IPFS client not available" - Using simulation mode
- ⚠️ Kafka connection errors - Using fallback queue
- ⚠️ AWS SDK maintenance mode - Still works fine

---

## 🧪 **Test the Application**

### **1. Test Backend:**
```bash
curl http://localhost:5050/health
```

### **2. Test Frontend:**
Open browser: http://localhost:3000

### **3. Test Integration:**
The frontend should automatically connect to the backend API.

---

## 🔧 **Frontend Configuration**

The frontend is pre-configured to connect to the backend.

**API Base URL:** Check `Frontend/src/` for API configuration files.

If you need to change the backend URL:
1. Look for API configuration in `Frontend/src/config/` or similar
2. Update the base URL from `http://localhost:5050` to your backend URL

---

## 📝 **Development Workflow**

### **Starting Fresh:**
1. Start backend: `start-server.bat`
2. Start frontend: `start-frontend.bat`
3. Open http://localhost:3000

### **Quick Full Stack Start:**
1. Run: `start-fullstack.bat`
2. Wait for both to start (30 seconds)
3. Open http://localhost:3000

### **Stopping Services:**
- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

---

## 🆘 **Troubleshooting**

### **"react-scripts not found" Error:**
```bash
cd Frontend
npm install
```

### **Port 3000 already in use:**
```bash
# Find process
netstat -ano | findstr ":3000"

# Kill process
taskkill /PID <PID> /F
```

### **Port 5050 already in use:**
```bash
# Find process
netstat -ano | findstr ":5050"

# Kill process
taskkill /PID <PID> /F
```

### **Frontend can't connect to backend:**
1. Make sure backend is running on port 5050
2. Check backend health: `curl http://localhost:5050/health`
3. Check browser console for errors
4. Verify API URL in frontend config

---

## ✅ **Current Status**

- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Port 5050 available (backend)
- ✅ Port 3000 available (frontend)
- ✅ Both servers ready to start

---

## 🎊 **You're All Set!**

**Start the full stack:**
```bash
start-fullstack.bat
```

Then open http://localhost:3000 in your browser!

---

**Last Updated:** October 11, 2025  
**Status:** ✅ READY TO RUN  
**Next Step:** Run `start-fullstack.bat`

