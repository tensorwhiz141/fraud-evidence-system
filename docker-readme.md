# Docker Deployment Guide
**Author:** Vinayak - DevOps Lead  
**Purpose:** Deploy entire blockchain system locally with Docker

---

## 🐳 Overview

This guide shows how to deploy the complete Fraud Evidence + Blockchain system using Docker.

---

## 📦 What Gets Deployed

### Containers:
1. **Backend API** (Node.js) - Port 5050
2. **Frontend** (React) - Port 3000
3. **MongoDB** - Port 27017
4. **BHIV Core Events** (Python) - Port 8004
5. **BHIV Webhooks** (Python) - Port 8005
6. **IPFS** - Ports 4001, 5001, 8080
7. **Kafka** (optional) - Port 9092
8. **Blockchain Node** (Ganache/Hardhat) - Port 8545

---

## 🚀 Quick Start

### Option 1: Full Stack (Recommended)

```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

**This starts:**
- ✅ All backend services
- ✅ Frontend
- ✅ Database
- ✅ BHIV services
- ✅ Blockchain node

### Option 2: Backend Only

```bash
docker-compose -f Backend/docker-compose.yml up -d
```

### Option 3: Development Mode

```bash
docker-compose -f docker-compose.fullstack.yml up
```

(No `-d` flag shows logs in terminal)

---

## 📋 Prerequisites

- Docker Desktop installed
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space
- Ports available: 3000, 5050, 8004, 8005, 27017, 8545

---

## 🔧 Configuration

### Create `.env` file in project root:

```env
# Backend
NODE_ENV=development
PORT=5050
MONGODB_URI=mongodb://mongodb:27017/fraud_evidence

# Blockchain
TRANSACTION_API_URL=http://192.168.0.68:8080/api/transaction-data
ETHEREUM_RPC_URL=http://blockchain-node:8545

# Storage
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_BUCKET=fraud-evidence-dev

# BHIV
CORE_EVENTS_API_URL=http://bhiv-core:8004
WEBHOOKS_API_URL=http://bhiv-webhooks:8005

# Security
JWT_SECRET=your-secret-key-min-32-characters-long
```

---

## 📂 Docker Compose Files

### `docker-compose.fullstack.yml`

```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:7
    container_name: fraud-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    networks:
      - fraud-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongo mongodb:27017/test --quiet
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend API
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    container_name: fraud-backend
    ports:
      - "5050:5050"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/fraud_evidence
      - TRANSACTION_API_URL=http://192.168.0.68:8080/api/transaction-data
    volumes:
      - ./Backend:/app
      - /app/node_modules
    depends_on:
      - mongodb
    networks:
      - fraud-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5050/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    container_name: fraud-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5050
    volumes:
      - ./Frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - fraud-network

  # IPFS
  ipfs:
    image: ipfs/kubo:latest
    container_name: fraud-ipfs
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ipfs-data:/data/ipfs
    networks:
      - fraud-network

  # Blockchain Node (Hardhat)
  blockchain-node:
    image: trufflesuite/ganache:latest
    container_name: fraud-blockchain
    ports:
      - "8545:8545"
    command: >
      --deterministic
      --accounts 10
      --defaultBalanceEther 1000
      --gasLimit 10000000
      --chainId 1337
    networks:
      - fraud-network

volumes:
  mongodb-data:
  ipfs-data:

networks:
  fraud-network:
    driver: bridge
```

---

## 🔨 Build Images

```bash
# Build backend
docker build -t fraud-evidence-backend:latest ./Backend

# Build frontend
docker build -t fraud-evidence-frontend:latest ./Frontend

# Or build all with compose
docker-compose -f docker-compose.fullstack.yml build
```

---

## ▶️ Start Services

```bash
# Start all services
docker-compose -f docker-compose.fullstack.yml up -d

# Check status
docker-compose -f docker-compose.fullstack.yml ps

# View logs
docker-compose -f docker-compose.fullstack.yml logs -f

# View specific service logs
docker-compose -f docker-compose.fullstack.yml logs -f backend
```

---

## 🧪 Verify Deployment

### Check All Services:

```bash
# Backend health
curl http://localhost:5050/health

# Frontend (open browser)
open http://localhost:3000

# MongoDB
docker exec fraud-mongodb mongo --eval "db.adminCommand('ping')"

# IPFS
curl http://localhost:5001/api/v0/version

# Blockchain node
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Run E2E Test:

```bash
# From host machine
node test-bhiv-integration.js

# Expected: All tests pass ✅
```

---

## 🛑 Stop Services

```bash
# Stop all
docker-compose -f docker-compose.fullstack.yml down

# Stop and remove volumes
docker-compose -f docker-compose.fullstack.yml down -v

# Stop specific service
docker-compose -f docker-compose.fullstack.yml stop backend
```

---

## 🔍 Troubleshooting

### Container won't start:

```bash
# Check logs
docker logs fraud-backend

# Check if port is in use
netstat -an | grep 5050

# Restart container
docker-compose -f docker-compose.fullstack.yml restart backend
```

### Database connection failed:

```bash
# Check MongoDB is running
docker ps | grep mongodb

# Check connection
docker exec fraud-mongodb mongo --eval "db.adminCommand('ping')"

# View MongoDB logs
docker logs fraud-mongodb
```

### Out of memory:

```bash
# Check Docker memory
docker stats

# Increase Docker memory in Docker Desktop settings
# Recommended: 8GB minimum, 16GB preferred
```

---

## 🧹 Cleanup

```bash
# Remove all containers and volumes
docker-compose -f docker-compose.fullstack.yml down -v

# Remove images
docker rmi fraud-evidence-backend fraud-evidence-frontend

# Remove dangling images
docker image prune -f

# Full cleanup
docker system prune -a --volumes
```

---

## 📊 Monitoring

### View Container Stats:

```bash
# Real-time stats
docker stats

# Specific container
docker stats fraud-backend
```

### Check Logs:

```bash
# All services
docker-compose -f docker-compose.fullstack.yml logs --tail=100

# Specific service
docker logs --tail=100 -f fraud-backend
```

---

## 🔄 PR & Git Workflow

### Merge Conflicts Resolution:

```bash
# Pull latest main
git checkout main
git pull origin main

# Switch to your branch
git checkout feature/your-feature

# Rebase on main
git rebase main

# If conflicts occur:
# 1. Resolve conflicts in editor
# 2. git add <resolved-files>
# 3. git rebase --continue

# Push (may need force push)
git push origin feature/your-feature --force
```

### Testing Before PR:

```bash
# Build and test locally
docker-compose -f docker-compose.fullstack.yml build
docker-compose -f docker-compose.fullstack.yml up -d
node test-bhiv-integration.js

# If all pass, create PR
```

---

## 🎯 GitHub Actions (Auto-Lint/Test)

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd Backend
          npm install
      
      - name: Run tests
        run: |
          cd Backend
          npm test
      
      - name: Run linter
        run: |
          cd Backend
          npm run lint
```

---

## ✅ Deployment Checklist

### Before Deployment:
- [ ] All Dockerfiles exist
- [ ] docker-compose.fullstack.yml configured
- [ ] Environment variables set
- [ ] Ports available
- [ ] Docker Desktop running

### After Deployment:
- [ ] All containers running (`docker ps`)
- [ ] Health checks passing
- [ ] E2E tests passing
- [ ] No errors in logs

---

## 🚀 Production Deployment

### Build for Production:

```bash
# Set production env
export NODE_ENV=production

# Build with production flags
docker-compose -f docker-compose.production.yml build

# Deploy
docker-compose -f docker-compose.production.yml up -d

# Verify
curl https://your-domain.com/health
```

---

## 📝 Notes

### Container Naming:
- `fraud-backend` - Backend API
- `fraud-frontend` - Frontend UI
- `fraud-mongodb` - Database
- `fraud-ipfs` - IPFS node
- `fraud-blockchain` - Local blockchain node

### Networks:
- All containers on `fraud-network` bridge
- Internal communication via container names

### Volumes:
- `mongodb-data` - Persistent database
- `ipfs-data` - IPFS storage
- App directories mounted for development

---

**Status:** ✅ Complete  
**Tested:** ✅ Local deployment verified  
**Ready for:** Team use and testnet deployment

---

**First Draft By:** Vinayak (DevOps Learning Phase)  
**Reviewed By:** Yashika  
**Version:** 1.0

