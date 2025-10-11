#!/bin/bash
# Stop all BHIV services

echo "============================================"
echo "  Stopping BHIV Services"
echo "============================================"
echo ""

# Function to stop a process
stop_process() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping $service_name (PID: $pid)..."
            kill $pid
            sleep 1
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                kill -9 $pid
            fi
            rm -f "$pid_file"
        else
            echo "$service_name is not running"
            rm -f "$pid_file"
        fi
    else
        echo "No PID file found for $service_name"
    fi
}

# Stop all services
stop_process "logs/backend.pid" "Node.js Backend"
stop_process "logs/core-events.pid" "BHIV Core Events API"
stop_process "logs/webhooks.pid" "BHIV Webhooks API"
stop_process "logs/mcp-bridge.pid" "BHIV MCP Bridge"

echo ""
echo "All services stopped."

