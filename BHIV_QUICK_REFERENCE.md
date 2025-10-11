# BHIV Integration - Quick Reference Card

## 🚀 Quick Start Commands

### Start Backend Only (Recommended First)
```bash
cd Backend
npm start
```
✅ Works immediately, no Python needed
⚠️  BHIV features run in fallback mode

### Start Full Stack (All Features)
**Windows:**
```bash
start-bhiv-full.bat
```

**Linux/Mac:**
```bash
./start-bhiv-full.sh
```

### Test Integration
```bash
node test-bhiv-integration.js
```

## 📡 API Endpoints Quick Reference

### Base URLs
- Backend: `http://localhost:5050`
- Core Events API: `http://localhost:8004` (Python)
- Webhooks API: `http://localhost:8005` (Python)
- MCP Bridge: `http://localhost:8002` (Python)
- Web UI: `http://localhost:8003` (Python)

### Main Endpoints

#### Health Checks
```bash
GET /health                           # Backend health
GET /api/core/health                  # BHIV Core health
GET /api/core-webhooks/health         # BHIV Webhooks health
```

#### BHIV Core Events
```bash
POST /api/core/events                 # Accept event
GET  /api/core/events/:id             # Get event status
GET  /api/core/case/:id/status        # Get case status
```

#### BHIV Webhooks
```bash
POST /api/core-webhooks/escalation-result
POST /api/core-webhooks/callbacks/:type
GET  /api/core-webhooks/monitoring/events
POST /api/core-webhooks/monitoring/events
POST /api/core-webhooks/monitoring/replay/:id
```

## 📝 Example Requests

### Accept a BHIV Event
```bash
curl -X POST http://localhost:5050/api/core/events \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": "case-123",
    "evidenceId": "evidence-456",
    "riskScore": 85.5,
    "actionSuggested": "escalate",
    "txHash": "0xabc123..."
  }'
```

### Get Event Status
```bash
curl http://localhost:5050/api/core/events/EVENT_ID
```

### Log Monitoring Event
```bash
curl -X POST http://localhost:5050/api/core-webhooks/monitoring/events \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "info",
    "message": "System event",
    "metadata": {}
  }'
```

## 🔧 Configuration

### Environment Variables (`Backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/fraud_evidence
CORE_EVENTS_API_URL=http://localhost:8004
WEBHOOKS_API_URL=http://localhost:8005
PORT=5050
```

## 📂 File Locations

### Main Components
```
fraud-evidence-system-3/
├── Backend/
│   ├── server.js                     # Updated with BHIV routes
│   ├── package.json                  # Updated with axios
│   ├── core/                         # ✅ BHIV Core Services
│   │   ├── events/
│   │   │   ├── core_events.js       # ✅ JS wrapper
│   │   │   ├── core_events.py       # Python service
│   │   │   ├── webhooks.js          # ✅ JS wrapper
│   │   │   └── webhooks.py          # Python service
│   │   └── requirements.txt
│   └── routes/
│       ├── coreRoutes.js            # ✅ BHIV Core routes
│       └── coreWebhooksRoutes.js    # ✅ BHIV Webhooks routes
│
├── BHIV-Fouth-Installment-main/     # ✅ BHIV AI System
│   └── BHIV-Fouth-Installment-main/
│       ├── mcp_bridge.py
│       ├── integration/
│       └── requirements.txt
│
├── README_BHIV_INTEGRATION.md        # ✅ Quick start guide
├── BHIV_INTEGRATION_GUIDE.md         # ✅ Detailed guide
├── BHIV_INTEGRATION_SUMMARY.md       # ✅ Completion summary
├── BHIV_QUICK_REFERENCE.md           # ✅ This file
├── test-bhiv-integration.js          # ✅ Test script
├── start-bhiv-full.bat               # ✅ Windows startup
├── start-backend-only.bat            # ✅ Windows backend
├── start-bhiv-full.sh                # ✅ Linux startup
└── stop-bhiv.sh                      # ✅ Linux shutdown
```

## 🎯 Key Features Status

| Feature | Backend Only | Full Stack |
|---------|-------------|------------|
| BHIV Routes | ✅ | ✅ |
| Fallback Mode | ✅ | N/A |
| Event Processing | ✅ (Memory) | ✅ (Full) |
| AI Agents | ❌ | ✅ |
| Reinforcement Learning | ❌ | ✅ |
| Vector Database | ❌ | ✅ |
| Voice Processing | ❌ | ✅ |
| Web Interface | ❌ | ✅ |

## ⚠️ Troubleshooting Quick Fixes

### "Python service not available"
- **Normal:** System running in fallback mode
- **Fix:** Start Python services for full features

### Port already in use
```bash
# Check what's using ports
netstat -an | findstr "5050 8004 8005"

# Change ports in .env
```

### Module not found
```bash
# Node.js
cd Backend
npm install

# Python
cd Backend/core
pip install -r requirements.txt
```

### MongoDB connection failed
```bash
# Check MongoDB is running
mongod --version

# Update connection string in .env
MONGODB_URI=mongodb://localhost:27017/fraud_evidence
```

## 📚 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `README_BHIV_INTEGRATION.md` | Quick start | First time setup |
| `BHIV_INTEGRATION_GUIDE.md` | Comprehensive guide | Detailed setup |
| `BHIV_INTEGRATION_SUMMARY.md` | What was done | Understanding changes |
| `BHIV_QUICK_REFERENCE.md` | Quick commands | Daily usage |
| `Backend/core/README.md` | Core services | Python setup |
| `BHIV-.../README.md` | AI system | AI features |

## 🎓 Learning Path

### 1. First Time (5 minutes)
- ✅ Read `README_BHIV_INTEGRATION.md`
- ✅ Run `cd Backend && npm start`
- ✅ Test `curl http://localhost:5050/health`

### 2. Basic Testing (10 minutes)
- ✅ Run `node test-bhiv-integration.js`
- ✅ Try example API calls
- ✅ Check fallback mode messages

### 3. Full Features (30 minutes)
- ✅ Install Python dependencies
- ✅ Start all services with `start-bhiv-full.bat/.sh`
- ✅ Test full AI capabilities
- ✅ Explore web interface at `:8003`

### 4. Production Ready (1+ hour)
- ✅ Read `BHIV_INTEGRATION_GUIDE.md`
- ✅ Configure environment variables
- ✅ Set up monitoring
- ✅ Configure reverse proxy

## 💡 Tips & Best Practices

### Development
- ✅ Start with backend only (fallback mode)
- ✅ Use test script to verify integration
- ✅ Check logs for warnings/errors
- ✅ Start Python services incrementally

### Testing
- ✅ Test health endpoints first
- ✅ Try fallback mode before full stack
- ✅ Use Postman collection for API testing
- ✅ Monitor console output

### Production
- ✅ Use environment variables for configuration
- ✅ Set up health check monitoring
- ✅ Configure auto-restart for services
- ✅ Use reverse proxy (nginx)
- ✅ Enable SSL/TLS

## 🔗 External Resources

### BHIV Core Services
- **API Docs:** `Backend/core/openapi.yaml`
- **Postman:** `Backend/core/postman_collection.json`
- **Runbook:** `Backend/core/integration-runbook.md`

### BHIV AI System
- **Main README:** `BHIV-.../README.md`
- **Agent Docs:** `BHIV-.../docs/agent_registry.md`
- **API Docs:** `BHIV-.../docs/mcp_api.md`

## ✅ Quick Checklist

### Before Starting
- [ ] MongoDB is running
- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured

### Basic Operation
- [ ] Backend starts without errors
- [ ] Health endpoint responds
- [ ] BHIV routes accessible
- [ ] Test script passes

### Full Features
- [ ] Python installed (v3.11+)
- [ ] Python dependencies installed
- [ ] All services start without errors
- [ ] All health checks pass

## 🆘 Emergency Commands

### Quick Start (Any Issues)
```bash
cd Backend
npm install
npm start
```

### Reset Everything
```bash
# Stop all services
# Windows: Close all terminals
# Linux/Mac: ./stop-bhiv.sh

# Reinstall dependencies
cd Backend
rm -rf node_modules package-lock.json
npm install

# Restart
npm start
```

### Check System Status
```bash
# Backend
curl http://localhost:5050/health

# BHIV Core
curl http://localhost:5050/api/core/health

# BHIV Webhooks
curl http://localhost:5050/api/core-webhooks/health
```

---

**📋 Keep this reference handy for daily use!**

