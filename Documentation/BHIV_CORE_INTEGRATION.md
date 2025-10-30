# BHIV Core Integration Guide

## Overview
This document provides instructions for integrating the BHIV Core system with the existing fraud evidence system. The BHIV Core provides orchestration capabilities for case events, including event acceptance, rule-based processing, and webhook handling for orchestrated outcomes.

## Architecture
The BHIV Core system consists of two main services:
1. **Core Events API** (Port 8004) - Handles event ingestion and case reconciliation
2. **Core Webhooks API** (Port 8005) - Handles webhook callbacks and monitoring

## Prerequisites
- Node.js 18+
- Python 3.9+
- Docker (for containerized deployment)
- MongoDB (for storage)
- Access to blockchain network (for transaction verification)

## Core Components

### 1. Core Events API
The Core Events API is responsible for accepting case events and orchestrating higher-level flows.

#### Endpoints
- `POST /core/events` - Accept case events
- `GET /core/events/{core_event_id}` - Get event status
- `GET /core/case/{case_id}/status` - Get case reconciliation status
- `GET /health` - Health check

#### Event Schema
```json
{
  "caseId": "string",
  "evidenceId": "string",
  "riskScore": "number (0-100)",
  "actionSuggested": "string (approve|reject|escalate|review|freeze)",
  "txHash": "string (optional)",
  "source": "string (optional)",
  "metadata": "object (optional)"
}
```

### 2. Core Webhooks API
The Core Webhooks API handles orchestrated outcomes and provides monitoring capabilities.

#### Endpoints
- `POST /callbacks/escalation-result` - Handle escalation results
- `POST /callbacks/{callback_type}` - Handle generic callbacks
- `GET /monitoring/events` - Get monitoring events
- `POST /monitoring/events` - Log monitoring events
- `POST /monitoring/replay/{event_id}` - Replay failed events
- `GET /health` - Health check

## Integration with Existing System

### Event Flow
1. The existing backend sends case events to `POST /core/events`
2. The Core Events API processes events through orchestration rules
3. Orchestrated outcomes are sent via webhooks to `POST /callbacks/{callback_type}`
4. The existing backend receives webhook callbacks and processes accordingly

### Authentication
All API endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-auth-token>
```

## Docker Deployment
To deploy the full stack including the BHIV Core services, use the updated docker-compose file:

```bash
docker-compose -f docker-compose.fullstack.yml up -d
```

## Environment Variables
The following environment variables can be configured:

- `MONGO_URI` - MongoDB connection string
- `AUTH_TOKEN` - Authentication token for API access
- `LOG_LEVEL` - Logging level (DEBUG, INFO, WARNING, ERROR)

## Testing
Run the integration tests to verify the core components are working correctly:

```bash
# Run Node.js integration tests
npm test -- tests/core.integration.test.js

# Run Python API tests
python Backend/core/test_core_api.py
```

## Monitoring and Logging
- Logs are written to the console and can be captured by Docker
- Monitoring events can be viewed at `GET /monitoring/events`
- Failed event deliveries can be replayed using `POST /monitoring/replay/{event_id}`

## Troubleshooting
1. If endpoints return 401 errors, check your authentication token
2. If services fail to start, verify that MongoDB is running
3. For webhook delivery issues, check the monitoring events endpoint
4. For high-risk cases not escalating, verify the orchestration rules configuration

## Orchestration Rules
The BHIV Core implements the following orchestration rules:

1. **Auto-escalation** - Triggers for risk scores >= 80 or high-value transfers >= $10,000
2. **Multisig trigger** - Activates for freeze actions with risk scores >= 70
3. **Duplicate wallet detection** - Identifies wallets involved in multiple cases
4. **Cross-case alerts** - Generates alerts based on patterns across multiple events

## Handover Checklist
The following artifacts are provided as part of the BHIV Core integration:

1. Core Event Specification (`core/schemas/core-event-spec.json`)
2. Sample Orchestration Rules (`core/orchestration/sample_rules.json`)
3. Sample Webhook Callback (`core/events/sample_callback.json`)
4. Monitoring Configuration (`core/events/monitoring_config.json`)
5. OpenAPI Specification (`core/openapi.yaml`)
6. Postman Collection (`core/postman_collection.json`)
7. Docker Configuration (`core/Dockerfile`)
8. Full Stack Docker Compose (`docker-compose.fullstack.yml`)
9. RBAC Permissions Matrix (`core/rbac-permissions.json`)
10. Data Schemas (`core/evidence-schema.json`, `core/case-schema.json`, etc.)
11. Smart Contract Integration (`core/contract-abi.json`, `core/contract-addresses.md`)
12. Integration Runbook (`core/integration-runbook.md`)

## API Documentation
Detailed API documentation is available in the OpenAPI specification at `core/openapi.yaml` and can be viewed using tools like Swagger UI.