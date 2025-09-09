const express = require('express');
const router = express.Router();
const MLDetectionService = require('../services/mlDetectionService');
const APILogger = require('../services/apiLogger');
const auth = require('../middleware/auth');

const mlService = new MLDetectionService();
const apiLogger = new APILogger();

// ML Analysis endpoint
router.post('/analyze', auth, async (req, res) => {
  try {
    const { address, reason } = req.body;
    const userEmail = req.user?.email || 'anonymous';

    // Validate input
    if (!address) {
      return res.status(400).json({ 
        error: 'Wallet address is required for ML analysis' 
      });
    }

    if (!reason) {
      return res.status(400).json({ 
        error: 'Report reason is required for ML analysis' 
      });
    }

    console.log(`🤖 ML Analysis request from ${userEmail} for wallet: ${address}`);
    console.log(`📡 Loading fresh transaction data from external API...`);

    // Ensure ML service has fresh data from external API
    await mlService.loadTransactionData();

    // Perform ML analysis
    const analysisResult = await mlService.analyzeWallet(address, reason, userEmail);

    // Log the analysis result
    console.log(`✅ ML Analysis completed: ${analysisResult.violation} (Score: ${analysisResult.score})`);

    res.json({
      success: true,
      analysis: analysisResult,
      message: 'ML analysis completed successfully'
    });

  } catch (error) {
    console.error('❌ ML Analysis error:', error);
    res.status(500).json({
      error: 'Failed to perform ML analysis',
      details: error.message
    });
  }
});

// Get ML detection configuration
router.get('/config', auth, (req, res) => {
  try {
    const config = {
      detection_patterns: {
        rapid_dumping: {
          threshold: 5,
          time_window_seconds: 300,
          description: 'Detects multiple rapid transactions within short time'
        },
        large_transfers: {
          threshold: 100,
          description: 'Identifies unusually large token transfers'
        },
        flash_loans: {
          time_window_seconds: 60,
          description: 'Detects potential flash loan exploitation patterns'
        },
        phishing_indicators: {
          address_patterns: ['0x000', '0x111', '0x999'],
          keywords: ['phish', 'scam', 'fake', 'impersonat', 'malicious', 'fraud'],
          description: 'Identifies phishing and scam indicators'
        }
      },
      risk_levels: {
        low: { range: '0.0 - 0.39', action: 'no_action', color: 'green' },
        medium: { range: '0.4 - 0.59', action: 'monitor', color: 'yellow' },
        high: { range: '0.6 - 0.79', action: 'investigate', color: 'orange' },
        critical: { range: '0.8 - 1.0', action: 'freeze', color: 'red' }
      },
      analysis_components: [
        'Rapid dumping detection',
        'Large transfer analysis',
        'Flash loan pattern recognition',
        'Phishing indicator scanning',
        'Historical report analysis'
      ]
    };

    res.json({
      success: true,
      config,
      message: 'ML detection configuration retrieved'
    });

  } catch (error) {
    console.error('Error getting ML config:', error);
    res.status(500).json({
      error: 'Failed to get ML configuration'
    });
  }
});

// Get all ML analysis results for admin dashboard
router.get('/results', auth, async (req, res) => {
  try {
    const { risk_level, violation_type, limit = 50, offset = 0 } = req.query;

    // In a real implementation, this would query a database
    // For now, we'll return mock data based on the query parameters
    const mockResults = generateMockMLResults(parseInt(limit), parseInt(offset));
    
    // Apply filters
    let filteredResults = mockResults;
    
    if (risk_level) {
      const riskRange = getRiskRange(risk_level);
      filteredResults = filteredResults.filter(result => 
        result.score >= riskRange.min && result.score <= riskRange.max
      );
    }
    
    if (violation_type && violation_type !== 'all') {
      filteredResults = filteredResults.filter(result => 
        result.violation.toLowerCase().includes(violation_type.toLowerCase())
      );
    }

    res.json({
      success: true,
      results: filteredResults,
      total: filteredResults.length,
      filters: {
        risk_level,
        violation_type,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Error fetching ML results:', error);
    res.status(500).json({
      error: 'Failed to fetch ML analysis results'
    });
  }
});

// Helper function to generate mock ML results
function generateMockMLResults(limit, offset) {
  const violations = [
    'Rapid token dump',
    'Large suspicious transfers', 
    'Flash loan manipulation',
    'Phishing activity',
    'Low risk activity',
    'Rapid token dump, Large suspicious transfers',
    'Flash loan manipulation, Phishing activity'
  ];
  
  const actions = ['freeze', 'investigate', 'monitor', 'no_action'];
  
  const results = [];
  
  for (let i = offset; i < offset + limit; i++) {
    const score = Math.random();
    const violation = violations[Math.floor(Math.random() * violations.length)];
    const action = getActionForScore(score);
    
    results.push({
      id: `ml_${i + 1}`,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      violation,
      score: Math.round(score * 100) / 100,
      recommended_action: action,
      analysis_details: {
        rapid_dumping: { detected: Math.random() > 0.7, score: Math.random() },
        large_transfers: { detected: Math.random() > 0.6, score: Math.random() },
        flash_loans: { detected: Math.random() > 0.8, score: Math.random() },
        phishing_indicators: { detected: Math.random() > 0.5, score: Math.random() }
      },
      transaction_count: Math.floor(Math.random() * 100) + 1,
      analyzed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      analyzed_by: `user${Math.floor(Math.random() * 10) + 1}@example.com`
    });
  }
  
  return results.sort((a, b) => new Date(b.analyzed_at) - new Date(a.analyzed_at));
}

// Helper function to get risk range
function getRiskRange(riskLevel) {
  switch (riskLevel) {
    case 'low': return { min: 0, max: 0.39 };
    case 'medium': return { min: 0.4, max: 0.59 };
    case 'high': return { min: 0.6, max: 0.79 };
    case 'critical': return { min: 0.8, max: 1.0 };
    default: return { min: 0, max: 1.0 };
  }
}

// Helper function to get action based on score
function getActionForScore(score) {
  if (score >= 0.8) return 'freeze';
  if (score >= 0.6) return 'investigate';
  if (score >= 0.4) return 'monitor';
  return 'no_action';
}

// Check API data source health
router.get('/data-health', auth, async (req, res) => {
  try {
    console.log('📊 Health check requested for external API');
    
    // Get comprehensive health information
    const healthInfo = {
      timestamp: new Date().toISOString(),
      api: {
        url: 'http://192.168.0.80:8080/api/transaction-data',
        status: 'checking...',
        responseTime: null,
        lastError: null
      },
      cache: {
        status: mlService.transactionData.length > 0 ? 'active' : 'empty',
        dataCount: mlService.transactionData.length,
        lastFetch: mlService.lastDataFetch ? new Date(mlService.lastDataFetch).toISOString() : 'never',
        cacheAge: mlService.lastDataFetch ? Date.now() - mlService.lastDataFetch : null
      },
      logs: {
        available: true,
        statistics: apiLogger.getLogStatistics()
      }
    };

    // Test API connectivity
    try {
      const startTime = Date.now();
      await mlService.loadTransactionData(true); // Force refresh
      const responseTime = Date.now() - startTime;
      
      healthInfo.api.status = 'healthy';
      healthInfo.api.responseTime = responseTime;
      healthInfo.cache.dataCount = mlService.transactionData.length;
      healthInfo.cache.lastFetch = new Date(mlService.lastDataFetch).toISOString();
      
      // Log successful health check
      apiLogger.logHealthCheck({
        apiStatus: 'healthy',
        cacheStatus: 'active',
        backupStatus: 'available',
        lastSuccessfulFetch: healthInfo.cache.lastFetch
      });
      
    } catch (error) {
      healthInfo.api.status = 'unhealthy';
      healthInfo.api.lastError = error.message;
      
      // Log failed health check
      apiLogger.logHealthCheck({
        apiStatus: 'unhealthy',
        cacheStatus: healthInfo.cache.status,
        backupStatus: 'unknown',
        lastSuccessfulFetch: healthInfo.cache.lastFetch
      });
    }

    res.json({
      success: true,
      health: healthInfo,
      message: 'API data source health check completed'
    });

  } catch (error) {
    console.error('Error checking data health:', error);
    res.status(500).json({
      error: 'Failed to check data health',
      details: error.message
    });
  }
});

// Get API logs endpoint
router.get('/logs', auth, async (req, res) => {
  try {
    const { lines = 100, stats = false } = req.query;
    
    if (stats === 'true') {
      // Return log statistics
      const statistics = apiLogger.getLogStatistics();
      res.json({
        success: true,
        statistics,
        message: 'Log statistics retrieved'
      });
    } else {
      // Return recent log entries
      const recentLogs = apiLogger.getRecentLogs(parseInt(lines));
      res.json({
        success: true,
        logs: recentLogs,
        lines: parseInt(lines),
        message: 'Recent logs retrieved'
      });
    }
    
  } catch (error) {
    console.error('Failed to retrieve logs:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve logs'
    });
  }
});

// Clear API logs endpoint (admin only)
router.delete('/logs', auth, async (req, res) => {
  try {
    const success = apiLogger.clearLogs();
    
    if (success) {
      res.json({
        success: true,
        message: 'API logs cleared successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to clear logs'
      });
    }
    
  } catch (error) {
    console.error('Failed to clear logs:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to clear logs'
    });
  }
});

module.exports = router;