// Production audit service with MongoDB and Blockchain integration
const AuditLog = require('../models/AuditLog');
const blockchainAPIContractService = require('./blockchainAPIContractService');
const { EventEmitter } = require('events');

class AuditService extends EventEmitter {
  constructor() {
    super();
    this.blockchainService = new blockchainAPIContractService();
    this.syncQueue = [];
    this.isSyncing = false;
    this.syncInterval = null;
    
    // Start blockchain sync process
    this.startBlockchainSync();
  }

  /**
   * Log an audit event
   * @param {Object} auditData - Audit event data
   * @returns {Promise<Object>} Created audit log
   */
  async logEvent(auditData) {
    try {
      const {
        userId,
        userEmail,
        userRole,
        action,
        resource,
        resourceType,
        resourceId,
        method,
        endpoint,
        ip,
        userAgent,
        success,
        statusCode,
        details = {},
        auditLevel = 'standard'
      } = auditData;

      // Create audit log
      const auditLog = new AuditLog({
        userId,
        userEmail,
        userRole,
        action,
        resource,
        resourceType,
        resourceId,
        method,
        endpoint,
        ip,
        userAgent,
        success,
        statusCode,
        details,
        auditLevel
      });

      await auditLog.save();

      // Queue for blockchain sync if high/critical level
      if (auditLevel === 'high' || auditLevel === 'critical') {
        this.queueForBlockchainSync(auditLog);
      }

      // Emit event for real-time monitoring
      this.emit('auditEvent', auditLog);

      // Check for suspicious activity
      if (!success) {
        await this.checkSuspiciousActivity(userId, userEmail, ip);
      }

      return auditLog;
    } catch (error) {
      console.error('Failed to log audit event:', error);
      throw error;
    }
  }

  /**
   * Queue audit log for blockchain synchronization
   */
  queueForBlockchainSync(auditLog) {
    this.syncQueue.push(auditLog);
    
    // Process queue if not already syncing
    if (!this.isSyncing) {
      this.processBlockchainSync();
    }
  }

  /**
   * Start blockchain synchronization process
   */
  startBlockchainSync() {
    // Process sync queue every 30 seconds
    this.syncInterval = setInterval(() => {
      if (this.syncQueue.length > 0 && !this.isSyncing) {
        this.processBlockchainSync();
      }
    }, 30000);
  }

  /**
   * Process blockchain synchronization queue
   */
  async processBlockchainSync() {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      const batchSize = 10;
      const batch = this.syncQueue.splice(0, batchSize);

      for (const auditLog of batch) {
        if (!auditLog.blockchainSynced) {
          await this.syncToBlockchain(auditLog);
        }
      }
    } catch (error) {
      console.error('Blockchain sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync audit log to blockchain
   */
  async syncToBlockchain(auditLog) {
    try {
      const payload = auditLog.toBlockchainPayload();
      
      const result = await this.blockchainService.syncAuditLog(payload);
      
      if (result.success) {
        await auditLog.markBlockchainSynced(
          result.blockchainTxHash,
          result.blockNumber
        );
        
        console.log(`✅ Audit log synced to blockchain: ${auditLog._id}`);
      } else {
        console.error(`❌ Failed to sync audit log to blockchain: ${auditLog._id}`, result.error);
      }
    } catch (error) {
      console.error(`❌ Blockchain sync error for audit log ${auditLog._id}:`, error);
    }
  }

  /**
   * Check for suspicious activity patterns
   */
  async checkSuspiciousActivity(userId, userEmail, ip) {
    try {
      const recentAttempts = await AuditLog.find({
        $or: [{ userId }, { ip }],
        timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) }, // Last 15 minutes
        success: false
      }).sort({ timestamp: -1 });

      // Alert if more than 5 failed attempts in 15 minutes
      if (recentAttempts.length >= 5) {
        const alertData = {
          type: 'suspicious_activity',
          severity: 'high',
          userEmail,
          ip,
          failedAttempts: recentAttempts.length,
          timeWindow: '15 minutes',
          recentActions: recentAttempts.map(attempt => ({
            action: attempt.action,
            resource: attempt.resource,
            timestamp: attempt.timestamp
          }))
        };

        // Emit security alert
        this.emit('securityAlert', alertData);

        // Log critical audit event
        await this.logEvent({
          userId,
          userEmail,
          userRole: 'system',
          action: 'security_alert_triggered',
          resource: '/security/alerts',
          resourceType: 'system',
          method: 'SYSTEM',
          endpoint: '/security/alerts',
          ip,
          userAgent: 'System',
          success: true,
          statusCode: 200,
          details: alertData,
          auditLevel: 'critical'
        });

        console.warn(`🚨 SECURITY ALERT: Suspicious activity detected`, alertData);
      }
    } catch (error) {
      console.error('Failed to check suspicious activity:', error);
    }
  }

  /**
   * Get audit statistics
   */
  async getAuditStats(options = {}) {
    try {
      const stats = await AuditLog.getAuditStats(options);
      return stats[0] || {
        totalActions: 0,
        successfulActions: 0,
        failedActions: 0,
        uniqueUserCount: 0,
        uniqueIPCount: 0,
        successRate: 0
      };
    } catch (error) {
      console.error('Failed to get audit stats:', error);
      throw error;
    }
  }

  /**
   * Get suspicious activity reports
   */
  async getSuspiciousActivity(options = {}) {
    try {
      return await AuditLog.findSuspiciousActivity(options);
    } catch (error) {
      console.error('Failed to get suspicious activity:', error);
      throw error;
    }
  }

  /**
   * Get audit logs by user
   */
  async getUserAuditLogs(userId, options = {}) {
    try {
      return await AuditLog.findByUser(userId, options);
    } catch (error) {
      console.error('Failed to get user audit logs:', error);
      throw error;
    }
  }

  /**
   * Clean up old audit logs based on retention policy
   */
  async cleanupOldLogs() {
    try {
      const result = await AuditLog.deleteMany({
        retentionDate: { $lt: new Date() }
      });

      console.log(`🧹 Cleaned up ${result.deletedCount} old audit logs`);
      return result.deletedCount;
    } catch (error) {
      console.error('Failed to cleanup old audit logs:', error);
      throw error;
    }
  }

  /**
   * Export audit logs for compliance
   */
  async exportAuditLogs(options = {}) {
    try {
      const {
        startDate,
        endDate,
        userRole,
        resourceType,
        auditLevel,
        format = 'json'
      } = options;

      const query = {};
      if (startDate) query.timestamp = { $gte: startDate };
      if (endDate) query.timestamp = { ...query.timestamp, $lte: endDate };
      if (userRole) query.userRole = userRole;
      if (resourceType) query.resourceType = resourceType;
      if (auditLevel) query.auditLevel = auditLevel;

      const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .limit(options.limit || 10000);

      if (format === 'csv') {
        return this.convertToCSV(logs);
      }

      return logs;
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      throw error;
    }
  }

  /**
   * Convert audit logs to CSV format
   */
  convertToCSV(logs) {
    const headers = [
      'Timestamp',
      'User Email',
      'User Role',
      'Action',
      'Resource',
      'Resource Type',
      'Method',
      'IP Address',
      'Success',
      'Status Code',
      'Audit Level',
      'Blockchain Synced'
    ];

    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userEmail,
      log.userRole,
      log.action,
      log.resource,
      log.resourceType,
      log.method,
      log.ip,
      log.success,
      log.statusCode,
      log.auditLevel,
      log.blockchainSynced
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Stop the audit service
   */
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

module.exports = AuditService;
