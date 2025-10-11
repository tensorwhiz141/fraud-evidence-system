# Quick Reference - Complete System

## 🚀 **START COMMANDS**

```bash
# Start everything
start-fullstack.bat

# Test blockchain
cd Backend && node scripts/test-e2e-blockchain.js

# Deploy to testnet
cd Backend && npx hardhat run scripts/deploy-all-contracts.js --network testnet
```

---

## 📡 **KEY ENDPOINTS**

**Backend:** http://localhost:5050  
**Frontend:** http://localhost:3000

### **Health Checks:**
```bash
curl http://localhost:5050/health
curl http://localhost:5050/api/blockchain/health
curl http://localhost:5050/api/core/health
```

### **Blockchain Features:**
```bash
# ML Violation Detection
POST /api/blockchain/ml/analyze {"address": "0x..."}

# Bridge Transfer
POST /api/blockchain/bridge/transfer {...}

# Cybercrime Auto-Enforce
POST /api/cybercrime/auto-enforce {"address": "0x..."}

# Transaction Data
GET /api/blockchain/transactions/:address
```

---

## 📚 **DOCUMENTATION**

**Start Here:**
- 🚀 `🚀_START_HERE_COMPLETE_SYSTEM.md`
- ✅ `✅_ALL_DONE_FINAL_SUMMARY_✅.md`

**Blockchain Sprint:**
- `SPRINT_COMPLETE_ALL_DELIVERABLES.md`
- `BLOCKCHAIN_COMPONENTS_COMPLETE.md`

**BHIV Integration:**
- `README_BHIV_INTEGRATION.md`
- `BHIV_QUICK_REFERENCE.md`

---

## ✅ **STATUS**

**All Components:** ✅ Complete  
**All Tests:** ✅ Passing  
**All Docs:** ✅ Done  
**Data Source:** ✅ API (192.168.0.68:8080)  
**Ready:** ✅ YES

---

## 🎊 **JUST RUN:**

```bash
start-fullstack.bat
```

**🎉 EVERYTHING IS READY!**

