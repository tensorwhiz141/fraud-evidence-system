#!/bin/bash
# Full BHIV System Startup Script for Linux/Mac
# This script starts all BHIV services

echo "============================================"
echo "  Starting BHIV Full Stack"
echo "============================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python is not installed or not in PATH"
    echo "Please install Python 3.11 or higher"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18 or higher"
    exit 1
fi

echo "Starting services..."
echo ""

# Create a logs directory
mkdir -p logs

# Start Node.js Backend
echo "[1/4] Starting Node.js Backend..."
cd Backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 2

# Start BHIV Core Events API
echo "[2/4] Starting BHIV Core Events API..."
cd Backend/core
python3 -m uvicorn events.core_events:app --host 0.0.0.0 --port 8004 > ../../logs/core-events.log 2>&1 &
CORE_EVENTS_PID=$!
cd ../..
sleep 2

# Start BHIV Webhooks API
echo "[3/4] Starting BHIV Webhooks API..."
cd Backend/core
python3 -m uvicorn events.webhooks:app --host 0.0.0.0 --port 8005 > ../../logs/webhooks.log 2>&1 &
WEBHOOKS_PID=$!
cd ../..
sleep 2

# Start BHIV MCP Bridge
echo "[4/4] Starting BHIV MCP Bridge..."
cd BHIV-Fouth-Installment-main/BHIV-Fouth-Installment-main
python3 mcp_bridge.py > ../../logs/mcp-bridge.log 2>&1 &
MCP_BRIDGE_PID=$!
cd ../..
sleep 2

echo ""
echo "============================================"
echo "  All services started!"
echo "============================================"
echo ""
echo "Services running:"
echo "  - Node.js Backend:        http://localhost:5050 (PID: $BACKEND_PID)"
echo "  - BHIV Core Events API:   http://localhost:8004 (PID: $CORE_EVENTS_PID)"
echo "  - BHIV Webhooks API:      http://localhost:8005 (PID: $WEBHOOKS_PID)"
echo "  - BHIV MCP Bridge:        http://localhost:8002 (PID: $MCP_BRIDGE_PID)"
echo ""
echo "Logs are available in the 'logs' directory"
echo ""
echo "To stop all services, run: ./stop-bhiv.sh"
echo ""

# Save PIDs for stopping later
echo "$BACKEND_PID" > logs/backend.pid
echo "$CORE_EVENTS_PID" > logs/core-events.pid
echo "$WEBHOOKS_PID" > logs/webhooks.pid
echo "$MCP_BRIDGE_PID" > logs/mcp-bridge.pid

# Wait for user interrupt
echo "Press Ctrl+C to view logs (services will continue running in background)"
trap "echo 'Services are still running. Use ./stop-bhiv.sh to stop them.'; exit 0" INT
tail -f logs/*.log

