# BHIV Integration - Quick Start Guide

## ✅ Integration Complete!

The BHIV (Black Hole Intelligence Vault) system has been successfully integrated into your Fraud Evidence System v3.

## 📁 What Was Added

### 1. BHIV AI System
- **Location:** `BHIV-Fouth-Installment-main/`
- **Purpose:** Advanced AI processing with multi-modal agents, reinforcement learning, and vector database
- **Components:** 
  - AI Agents (text, image, audio, archive)
  - Reinforcement Learning Engine
  - Web Interface (Port 8003)
  - MCP Bridge API (Port 8002)

### 2. BHIV Core Services
- **Location:** `Backend/core/`
- **Purpose:** Event orchestration, blockchain reconciliation, and webhook handling
- **Components:**
  - Core Events API (Port 8004) - Python FastAPI
  - Webhooks API (Port 8005) - Python FastAPI
  - Orchestration Engine
  - Event monitoring system

### 3. Backend Integration
- **Location:** `Backend/routes/` and `Backend/core/events/`
- **New Routes:**
  - `/api/core/*` - Core events endpoints
  - `/api/core-webhooks/*` - Webhooks endpoints
- **JavaScript Wrappers:** Created to communicate with Python services
- **Fallback Mode:** System works even if Python services are not running

## 🚀 Quick Start

### Option 1: Backend Only (Recommended for Testing)

```bash
# Windows
cd Backend
npm start

# Or use the batch file
start-backend-only.bat
```

This runs just the Node.js backend with BHIV routes in fallback mode.

### Option 2: Full Stack (All Features)

**Windows:**
```bash
# Use the startup script
start-bhiv-full.bat

# Or manually start each service:
# Terminal 1:
cd Backend
npm start

# Terminal 2:
cd Backend\core
python -m uvicorn events.core_events:app --host 0.0.0.0 --port 8004

# Terminal 3:
cd Backend\core
python -m uvicorn events.webhooks:app --host 0.0.0.0 --port 8005

# Terminal 4 (Optional - AI System):
cd BHIV-Fouth-Installment-main\BHIV-Fouth-Installment-main
python mcp_bridge.py
```

**Linux/Mac:**
```bash
# Make scripts executable (first time only)
chmod +x start-bhiv-full.sh stop-bhiv.sh

# Start all services
./start-bhiv-full.sh

# Stop all services
./stop-bhiv.sh
```

## 📡 Available Endpoints

### Core Backend
- **Base:** `http://localhost:5050`
- **Health:** `GET /health`
- **API Docs:** `GET /`

### BHIV Core Events
- **POST** `/api/core/events` - Accept case events
- **GET** `/api/core/events/:id` - Get event status
- **GET** `/api/core/case/:id/status` - Get case status
- **GET** `/api/core/health` - Health check

### BHIV Webhooks
- **POST** `/api/core-webhooks/escalation-result` - Handle escalation
- **POST** `/api/core-webhooks/callbacks/:type` - Generic callbacks
- **GET** `/api/core-webhooks/monitoring/events` - Get monitoring events
- **POST** `/api/core-webhooks/monitoring/events` - Log events
- **GET** `/api/core-webhooks/health` - Health check

## 🧪 Testing the Integration

### Test 1: Backend Health Check
```bash
curl http://localhost:5050/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Fraud Evidence System",
  "version": "1.0.0",
  "database": "connected",
  "timestamp": "..."
}
```

### Test 2: BHIV Core Health Check
```bash
curl http://localhost:5050/api/core/health
```

Expected response (Python service running):
```json
{
  "status": "healthy",
  "service": "BHIV Core Events API",
  "version": "1.0.0",
  "events_count": 0
}
```

Expected response (Fallback mode):
```json
{
  "status": "healthy",
  "service": "BHIV Core Events API (Fallback)",
  "version": "1.0.0",
  "events_count": 0,
  "python_service": "unavailable"
}
```

### Test 3: Accept a BHIV Event
```bash
curl -X POST http://localhost:5050/api/core/events \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": "test-case-001",
    "evidenceId": "test-evidence-001",
    "riskScore": 85.5,
    "actionSuggested": "escalate",
    "txHash": "0xabc123def456",
    "metadata": {"source": "integration-test"}
  }'
```

Expected response:
```json
{
  "coreEventId": "...",
  "status": "accepted",
  "timestamp": "..."
}
```

## 📦 Dependencies

### Node.js (Already Installed)
- express
- mongoose
- cors
- multer
- dotenv
- **axios** ✅ (newly added for BHIV)

### Python (For Full BHIV Features)
Install Python dependencies:
```bash
# Core Services
cd Backend/core
pip install -r requirements.txt

# AI System (Optional)
cd BHIV-Fouth-Installment-main/BHIV-Fouth-Installment-main
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

## 🔧 Configuration

### Environment Variables

Add to `Backend/.env`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fraud_evidence

# BHIV Core Services (optional, defaults shown)
CORE_EVENTS_API_URL=http://localhost:8004
WEBHOOKS_API_URL=http://localhost:8005

# Server
PORT=5050
```

## 📖 Documentation

- **Complete Integration Guide:** `BHIV_INTEGRATION_GUIDE.md`
- **BHIV Core README:** `Backend/core/README.md`
- **BHIV AI System README:** `BHIV-Fouth-Installment-main/BHIV-Fouth-Installment-main/README.md`
- **API Specification:** `Backend/core/openapi.yaml`
- **Integration Runbook:** `Backend/core/integration-runbook.md`

## 🎯 Key Features

### Automatic Fallback ✅
- System works even if Python services are unavailable
- Graceful degradation with in-memory storage
- No errors - just warning messages in logs

### RESTful API ✅
- Standard HTTP endpoints
- JSON request/response
- Proper error handling

### Production Ready ✅
- Health checks for all services
- Monitoring and logging
- Docker support (configuration included)
- Webhook handling for external integrations

### AI Capabilities ✅
- Multi-modal processing (text, image, audio, PDF)
- Reinforcement learning
- Vector database (Qdrant)
- Named Learning Objects generation
- Voice integration

## 🔍 Troubleshooting

### "Python service not available" messages
- **Status:** Normal in fallback mode
- **Impact:** BHIV features use in-memory storage
- **Solution:** Start Python services for full features

### Port already in use
- **Check:** `netstat -an | findstr "8004 8005 5050"`
- **Solution:** Stop conflicting services or change ports in `.env`

### Module not found errors
- **Check:** Node.js: `npm install` in Backend/
- **Check:** Python: `pip install -r requirements.txt` in Backend/core/

### Can't connect to MongoDB
- **Check:** MongoDB is running: `mongod --version`
- **Solution:** Start MongoDB service or update MONGODB_URI in `.env`

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client / Frontend                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Node.js Backend (Port 5050)                   │
│  - Express.js Routes                                     │
│  - BHIV Integration Layer (JavaScript Wrappers)         │
│  - Fallback Implementations                              │
└────┬────────────────────────────────┬───────────────────┘
     │                                │
     ▼                                ▼
┌─────────────────────┐      ┌─────────────────────────┐
│  BHIV Core Events   │      │   BHIV Webhooks API     │
│  Python FastAPI     │      │   Python FastAPI        │
│  Port 8004          │      │   Port 8005             │
└─────────────────────┘      └─────────────────────────┘
     │                                │
     └────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────┐
│              BHIV AI System                              │
│  - MCP Bridge (Port 8002)                               │
│  - Web Interface (Port 8003)                            │
│  - AI Agents & Reinforcement Learning                   │
│  - Vector Database (Qdrant)                             │
└─────────────────────────────────────────────────────────┘
```

## ✨ Next Steps

1. **Test the Integration:**
   - Start the backend: `cd Backend && npm start`
   - Test health endpoints
   - Try accepting a BHIV event

2. **Install Python Dependencies** (for full features):
   - Install requirements for Core Services
   - Install requirements for AI System
   - Install spaCy NLP model

3. **Start All Services:**
   - Use `start-bhiv-full.bat` (Windows)
   - Or `./start-bhiv-full.sh` (Linux/Mac)

4. **Explore the Documentation:**
   - Read `BHIV_INTEGRATION_GUIDE.md` for detailed setup
   - Review API documentation in `Backend/core/openapi.yaml`
   - Check Postman collection: `Backend/core/postman_collection.json`

## 🎉 Success!

Your Fraud Evidence System now has:
- ✅ BHIV AI processing capabilities
- ✅ Advanced event orchestration
- ✅ Blockchain reconciliation
- ✅ Webhook handling
- ✅ Multi-modal AI agents
- ✅ Reinforcement learning
- ✅ Fallback mode for reliability

**The BHIV integration is complete and ready to use!**

---

For detailed information, see `BHIV_INTEGRATION_GUIDE.md`

