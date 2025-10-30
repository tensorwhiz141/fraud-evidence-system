const request = require('supertest');
const express = require('express');
const coreRoutes = require('../routes/coreRoutes');
const coreWebhooksRoutes = require('../routes/coreWebhooksRoutes');

// Create a test app
const app = express();
app.use(express.json());

// Mount the core routes
app.use('/api/core', coreRoutes);
app.use('/api/core-webhooks', coreWebhooksRoutes);

// Mock the core events functions
jest.mock('../core/events/core_events', () => ({
  accept_event: jest.fn(),
  get_event_status: jest.fn(),
  get_case_status: jest.fn(),
  health_check: jest.fn()
}));

// Mock the webhooks functions
jest.mock('../core/events/webhooks', () => ({
  handle_escalation_result: jest.fn(),
  handle_generic_callback: jest.fn(),
  get_monitoring_events: jest.fn(),
  log_monitoring_event: jest.fn(),
  replay_failed_event: jest.fn(),
  health_check: jest.fn()
}));

const coreEvents = require('../core/events/core_events');
const webhooks = require('../core/events/webhooks');

describe('BHIV Core API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Events API', () => {
    test('POST /api/core/events should accept events', async () => {
      const mockResponse = {
        coreEventId: 'event-123',
        status: 'accepted',
        timestamp: '2025-10-10T10:00:00Z'
      };
      
      coreEvents.accept_event.mockResolvedValue(mockResponse);
      
      const eventData = {
        caseId: 'case-123',
        evidenceId: 'evidence-456',
        riskScore: 85.5,
        actionSuggested: 'escalate',
        txHash: '0x123456789abcdef'
      };
      
      const response = await request(app)
        .post('/api/core/events')
        .send(eventData)
        .expect(202);
      
      expect(response.body).toEqual(mockResponse);
      expect(coreEvents.accept_event).toHaveBeenCalledWith(eventData);
    });

    test('GET /api/core/events/:core_event_id should return event status', async () => {
      const mockResponse = {
        coreEventId: 'event-123',
        status: 'processed',
        processedAt: '2025-10-10T10:00:00Z'
      };
      
      coreEvents.get_event_status.mockResolvedValue(mockResponse);
      
      const response = await request(app)
        .get('/api/core/events/event-123')
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(coreEvents.get_event_status).toHaveBeenCalledWith('event-123');
    });

    test('GET /api/core/case/:case_id/status should return case status', async () => {
      const mockResponse = {
        caseId: 'case-123',
        reconciliation: [
          {
            evidenceId: 'evidence-456',
            txHash: '0x123456789abcdef',
            status: 'verified',
            details: 'Evidence anchor matches blockchain transaction'
          }
        ],
        overallStatus: 'ok'
      };
      
      coreEvents.get_case_status.mockResolvedValue(mockResponse);
      
      const response = await request(app)
        .get('/api/core/case/case-123/status')
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(coreEvents.get_case_status).toHaveBeenCalledWith('case-123');
    });

    test('GET /api/core/health should return health status', async () => {
      const mockResponse = {
        status: 'healthy',
        service: 'BHIV Core Events API',
        version: '1.0.0',
        events_count: 5
      };
      
      coreEvents.health_check.mockResolvedValue(mockResponse);
      
      const response = await request(app)
        .get('/api/core/health')
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(coreEvents.health_check).toHaveBeenCalled();
    });
  });

  describe('Core Webhooks API', () => {
    test('POST /api/core-webhooks/escalation-result should handle escalation results', async () => {
      const mockResponse = {
        status: 'received',
        messageId: 'msg-123'
      };
      
      webhooks.handle_escalation_result.mockResolvedValue(mockResponse);
      
      const webhookData = {
        outcomeId: 'outcome-123',
        caseId: 'case-456',
        eventType: 'escalation_completed',
        result: {
          status: 'approved',
          decision: 'Escalation approved by risk team'
        },
        timestamp: '2025-10-10T10:00:00Z'
      };
      
      const response = await request(app)
        .post('/api/core-webhooks/escalation-result')
        .send(webhookData)
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(webhooks.handle_escalation_result).toHaveBeenCalledWith(webhookData);
    });

    test('POST /api/core-webhooks/callbacks/:callback_type should handle generic callbacks', async () => {
      const mockResponse = {
        status: 'received',
        messageId: 'msg-456'
      };
      
      webhooks.handle_generic_callback.mockResolvedValue(mockResponse);
      
      const webhookData = {
        outcomeId: 'outcome-789',
        caseId: 'case-012',
        eventType: 'review_completed',
        result: {
          status: 'completed',
          notes: 'Review completed successfully'
        },
        timestamp: '2025-10-10T11:00:00Z'
      };
      
      const response = await request(app)
        .post('/api/core-webhooks/callbacks/review-completed')
        .send(webhookData)
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(webhooks.handle_generic_callback).toHaveBeenCalledWith('review-completed', webhookData);
    });

    test('GET /api/core-webhooks/monitoring/events should return monitoring events', async () => {
      const mockResponse = [
        {
          eventId: 'event-111',
          eventType: 'event_processed',
          status: 'success',
          timestamp: '2025-10-10T10:00:00Z',
          details: 'Processed event event-123 with 2 actions triggered'
        }
      ];
      
      webhooks.get_monitoring_events.mockResolvedValue(mockResponse);
      
      const response = await request(app)
        .get('/api/core-webhooks/monitoring/events')
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(webhooks.get_monitoring_events).toHaveBeenCalledWith(undefined);
    });

    test('POST /api/core-webhooks/monitoring/events should log monitoring events', async () => {
      const mockResponse = { status: 'logged' };
      
      webhooks.log_monitoring_event.mockResolvedValue(mockResponse);
      
      const monitoringEvent = {
        eventId: 'event-222',
        eventType: 'test_event',
        status: 'success',
        timestamp: '2025-10-10T12:00:00Z',
        details: 'Test monitoring event'
      };
      
      const response = await request(app)
        .post('/api/core-webhooks/monitoring/events')
        .send(monitoringEvent)
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(webhooks.log_monitoring_event).toHaveBeenCalledWith(monitoringEvent);
    });

    test('POST /api/core-webhooks/monitoring/replay/:event_id should replay failed events', async () => {
      const mockResponse = {
        status: 'replay_initiated',
        eventId: 'event-333',
        monitoringEventId: 'monitor-444'
      };
      
      webhooks.replay_failed_event.mockResolvedValue(mockResponse);
      
      const response = await request(app)
        .post('/api/core-webhooks/monitoring/replay/event-333')
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(webhooks.replay_failed_event).toHaveBeenCalledWith('event-333');
    });

    test('GET /api/core-webhooks/health should return health status', async () => {
      const mockResponse = {
        status: 'healthy',
        service: 'BHIV Core Webhooks',
        version: '1.0.0',
        webhook_events_count: 10,
        monitoring_events_count: 5
      };
      
      webhooks.health_check.mockResolvedValue(mockResponse);
      
      const response = await request(app)
        .get('/api/core-webhooks/health')
        .expect(200);
      
      expect(response.body).toEqual(mockResponse);
      expect(webhooks.health_check).toHaveBeenCalled();
    });
  });
});