# BHIV Integration Guide

## Overview

This guide explains how to set up and use the BHIV (Black Hole Intelligence Vault) system integrated with the Fraud Evidence System.

## Architecture

The BHIV system consists of two main components:

1. **BHIV Core Services** (Python FastAPI) - Located in `Backend/core/`
   - Core Events API (Port 8004)
   - Webhooks API (Port 8005)

2. **BHIV AI System** (Python) - Located in `BHIV-Fouth-Installment-main/`
   - Multi-modal AI agents
   - Reinforcement Learning engine
   - Web interface (Port 8003)
   - MCP Bridge API (Port 8002)

3. **Node.js Backend Integration** - Located in `Backend/`
   - JavaScript wrappers for Python services
   - Express.js routes: `/api/core` and `/api/core-webhooks`

## Installation

### 1. Install Node.js Dependencies

```bash
cd Backend
npm install
```

The integration automatically includes `axios` for communicating with Python services.

### 2. Install Python Dependencies

#### For Core Services (Backend/core):

```bash
cd Backend/core
pip install -r requirements.txt
```

#### For BHIV AI System:

```bash
cd BHIV-Fouth-Installment-main/BHIV-Fouth-Installment-main
pip install -r requirements.txt

# Install spaCy NLP model
python -m spacy download en_core_web_sm
```

### 3. Environment Variables

Create or update `.env` file in the Backend directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fraud_evidence

# BHIV Core Services URLs (optional, defaults shown)
CORE_EVENTS_API_URL=http://localhost:8004
WEBHOOKS_API_URL=http://localhost:8005

# Server Port
PORT=5050
```

## Running the System

### Option 1: Full Stack (Recommended)

Run all services together:

```bash
# Terminal 1: Start Node.js Backend
cd Backend
npm start

# Terminal 2: Start BHIV Core Events API
cd Backend/core
python -m uvicorn events.core_events:app --host 0.0.0.0 --port 8004

# Terminal 3: Start BHIV Webhooks API
cd Backend/core
python -m uvicorn events.webhooks:app --host 0.0.0.0 --port 8005

# Terminal 4 (Optional): Start BHIV AI System
cd BHIV-Fouth-Installment-main/BHIV-Fouth-Installment-main
python mcp_bridge.py
# And in another terminal:
python integration/web_interface.py
```

### Option 2: Node.js Backend Only (Fallback Mode)

You can run just the Node.js backend without Python services. The system will use fallback implementations:

```bash
cd Backend
npm start
```

**Note:** In fallback mode, BHIV features will use in-memory storage and won't have full AI capabilities.

### Option 3: Using Docker (Future)

Docker configuration is available in `Backend/core/Dockerfile` for containerized deployment.

## API Endpoints

### BHIV Core Events API

Base URL: `http://localhost:5050/api/core`

- **POST /events** - Accept case events for processing
  ```json
  {
    "caseId": "case-123",
    "evidenceId": "evidence-456",
    "riskScore": 75.5,
    "actionSuggested": "escalate",
    "txHash": "0x...",
    "metadata": {}
  }
  ```

- **GET /events/:core_event_id** - Get event status
- **GET /case/:case_id/status** - Get case reconciliation status
- **GET /health** - Health check

### BHIV Webhooks API

Base URL: `http://localhost:5050/api/core-webhooks`

- **POST /escalation-result** - Handle escalation results
- **POST /callbacks/:callback_type** - Handle generic callbacks
- **GET /monitoring/events** - Get monitoring events
- **POST /monitoring/events** - Log monitoring events
- **POST /monitoring/replay/:event_id** - Replay failed events
- **GET /health** - Health check

## Testing the Integration

### 1. Test Node.js Backend

```bash
curl http://localhost:5050/health
```

### 2. Test BHIV Core Integration

```bash
# Test Core Events API
curl http://localhost:5050/api/core/health

# Accept an event
curl -X POST http://localhost:5050/api/core/events \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": "test-case-001",
    "evidenceId": "test-evidence-001",
    "riskScore": 85.5,
    "actionSuggested": "escalate",
    "txHash": "0xabc123...",
    "metadata": {"source": "test"}
  }'

# Test Webhooks API
curl http://localhost:5050/api/core-webhooks/health
```

### 3. Test BHIV AI System (if running)

```bash
# Test MCP Bridge
curl http://localhost:8002/health

# Test Web Interface
curl http://localhost:8003
# Or open in browser: http://localhost:8003
```

## How It Works

### 1. Node.js to Python Communication

The Node.js backend includes JavaScript wrappers that communicate with Python services via HTTP:

```javascript
// Backend/core/events/core_events.js
// Makes HTTP requests to Python FastAPI service
const response = await axios.post(`${CORE_EVENTS_API_URL}/core/events`, payload);
```

### 2. Fallback Mode

If Python services are not running, the system automatically falls back to in-memory implementations:

```javascript
console.warn('Python Core Events API not available, using fallback');
// Uses in-memory storage instead
eventsStorage.set(coreEventId, eventData);
```

### 3. Service Discovery

The system tries to connect to Python services and gracefully degrades if they're unavailable.

## Features

### Core Services (Backend/core)

- **Event Ingestion**: Accept and process case events
- **Orchestration**: Apply business rules for escalation and routing
- **Reconciliation**: Verify blockchain anchoring of evidence
- **Monitoring**: Track system health and event processing
- **Webhooks**: Handle callbacks from external systems

### BHIV AI System (BHIV-Fouth-Installment-main)

- **Multi-Modal Processing**: Text, PDF, image, and audio inputs
- **AI Agents**: Specialized agents for different content types
- **Reinforcement Learning**: Adaptive learning and optimization
- **Named Learning Objects**: Structured educational content
- **Voice Integration**: Speech-to-text and text-to-speech
- **Vector Database**: Qdrant for semantic search
- **Web Dashboard**: Interactive UI for AI system management

## Troubleshooting

### Python Services Not Starting

1. Check Python installation: `python --version` (requires Python 3.11+)
2. Verify dependencies: `pip list`
3. Check ports are available: `netstat -an | grep 8004` or `netstat -an | grep 8005`
4. Review logs in console output

### Node.js Can't Connect to Python Services

1. Verify Python services are running on correct ports
2. Check firewall settings
3. Review environment variables in `.env`
4. Check console logs for connection errors

### Fallback Mode Messages

If you see "Python Core Events API not available, using fallback" messages:
- This is normal if Python services are not running
- The system will continue to work with limited functionality
- Start Python services to enable full features

## Production Deployment

### Recommended Setup

1. **Run Python services in separate containers/processes**
   - Use process managers like PM2 or systemd
   - Configure health checks and auto-restart

2. **Configure reverse proxy (nginx)**
   - Route `/api/core*` to Node.js backend
   - Set up SSL/TLS certificates

3. **Set up monitoring**
   - Monitor both Node.js and Python services
   - Configure alerts for service failures

4. **Database configuration**
   - Use production MongoDB instance
   - Configure Qdrant for vector storage

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-mongo:27017/fraud_evidence
CORE_EVENTS_API_URL=http://core-events-service:8004
WEBHOOKS_API_URL=http://webhooks-service:8005
```

## Additional Resources

- **Core Services Documentation**: `Backend/core/README.md`
- **BHIV AI System Documentation**: `BHIV-Fouth-Installment-main/BHIV-Fouth-Installment-main/README.md`
- **API Specifications**: `Backend/core/openapi.yaml`
- **Integration Runbook**: `Backend/core/integration-runbook.md`
- **Postman Collection**: `Backend/core/postman_collection.json`

## Support

For issues or questions:
1. Check the README files in each directory
2. Review the integration runbook
3. Check service logs for error messages
4. Verify all dependencies are installed correctly

## Summary

The BHIV integration provides:
- ✅ Seamless communication between Node.js and Python services
- ✅ Automatic fallback for graceful degradation
- ✅ RESTful API endpoints for all BHIV features
- ✅ Production-ready architecture with health monitoring
- ✅ Comprehensive AI capabilities for fraud detection

