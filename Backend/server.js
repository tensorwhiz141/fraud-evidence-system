// Main Server File for Fraud Evidence System
// Includes Evidence Upload with local storage and MongoDB integration

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Middleware imports
const auditLogger = require('./middleware/auditLogger');
const authMiddleware = require('./middleware/auth');
const rateLimiter = require('./middleware/rateLimit');

// ✅ Route imports
const publicRoutes = require('./routes/publicRoutes');
const panicRoutes = require('./routes/panic');
const authRoutes = require('./routes/authRoutes');
const contractRoutes = require('./routes/contractRoutes');
const tokenRoutes = require('./routes/token');
const enforceRoutes = require('./routes/enforce');
const walletRoutes = require('./routes/wallet');
const statsRoutes = require('./routes/statsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const riskRoutes = require('./routes/riskRoutes');
const exportRoutes = require('./routes/exportRoutes');
const loginLogRoutes = require('./routes/loginLogRoutes');
const userRoutes = require('./routes/userRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const escalateRoutes = require('./routes/escalate');
const escalationRoutes = require('./routes/escalation');
const fakeRbiRoutes = require('./routes/fakeRBI');
const rlFeedbackRoutes = require('./routes/rlFeedbackRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const mlRoutes = require('./routes/mlRoutes');
const reportGenerationRoutes = require('./routes/reportGenerationRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const caseLinkingRoutes = require('./routes/caseLinkingRoutes');
const caseRoutes = require('./routes/caseRoutes');
const cybercrimeRoutes = require('./routes/cybercrimeRoutes');
const policeStationRoutes = require('./routes/policeStationRoutes');
const fraudDetectionRoutes = require('./routes/fraudDetectionRoutes');
const incidentReportRoutes = require('./routes/incidentReportRoutes');
const mlAnalysisRoutes = require('./routes/mlAnalysisRoutes');
const caseManagerRoutes = require('./routes/caseManagerRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const rlRoutes = require('./routes/rlRoutes');
const eventQueueRoutes = require('./routes/eventQueueRoutes');
const auditRoutes = require('./routes/auditRoutes');

// ✅ BHIV Core Routes
const coreRoutes = require('./routes/coreRoutes');
const coreWebhooksRoutes = require('./routes/coreWebhooksRoutes');

// ✅ Blockchain Routes
const blockchainRoutes = require('./routes/blockchainRoutes');

// ✅ Kafka & Event Processor
const { connectProducer } = require('./utils/kafkaClient');
const { startProcessor } = require('./services/eventProcessor');

// ✅ Smart Contract Listeners
const { registerListeners } = require('./listeners/eventListeners');
registerListeners();

// ✅ Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fraud_evidence';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Server will continue without database (some features may not work)');
  });

// ✅ Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ✅ Health check
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    service: 'Fraud Evidence System',
    version: '1.0.0',
    database: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Fraud Evidence System - API Server',
    version: '1.0.0',
    documentation: 'See README.md and RBAC_DOCUMENTATION.md'
  });
});

// ✅ Mount routes
app.use('/api', publicRoutes);
app.use('/api/panic', panicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/cybercrime', cybercrimeRoutes);
app.use('/api/police-stations', policeStationRoutes);
app.use('/api/fraud-detection', fraudDetectionRoutes);
app.use('/api/incident-reports', incidentReportRoutes);
app.use('/api/ml-analysis', mlAnalysisRoutes);
app.use('/api/case-manager', caseManagerRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/core', coreRoutes);
app.use('/api/core-webhooks', coreWebhooksRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/rl', rlRoutes);
app.use('/api/queue', eventQueueRoutes);
app.use('/api/admin/audit', auditRoutes);
app.use('/api/blockchain', blockchainRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    code: 404,
    message: `Endpoint not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: true,
    code: 500,
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Fraud Evidence Server Started');
  console.log('========================================');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📝 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 RBAC: Enabled (use x-user-role header)`);
  console.log('========================================\n');
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
