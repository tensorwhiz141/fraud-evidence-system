// RL Routes - Reinforcement Learning API endpoints
const express = require('express');
const router = express.Router();
const RLEngineService = require('../services/rlEngineService');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Initialize RL Engine
const rlEngine = new RLEngineService();

// GET /api/rl/status - Get RL model status
router.get('/status', auth, adminOnly, async (req, res) => {
  try {
    const status = rlEngine.getStatus();
    res.json({
      success: true,
      status,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('RL Status Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get RL status'
    });
  }
});

// POST /api/rl/predict - Make prediction for wallet
router.post('/predict', auth, adminOnly, async (req, res) => {
  try {
    const { walletData, geoData, escalationData } = req.body;
    
    if (!walletData) {
      return res.status(400).json({
        success: false,
        error: 'walletData is required'
      });
    }
    
    const prediction = await rlEngine.predict(walletData, geoData, escalationData);
    
    res.json(prediction);
  } catch (error) {
    console.error('RL Prediction Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to make prediction'
    });
  }
});

// POST /api/rl/train - Train the model with feedback
router.post('/train', auth, adminOnly, async (req, res) => {
  try {
    const { walletData, geoData, escalationData, action, outcome } = req.body;
    
    if (!walletData || action === undefined || !outcome) {
      return res.status(400).json({
        success: false,
        error: 'walletData, action, and outcome are required'
      });
    }
    
    const result = await rlEngine.train(walletData, geoData, escalationData, action, outcome);
    
    res.json(result);
  } catch (error) {
    console.error('RL Training Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to train model'
    });
  }
});

// POST /api/rl/simulate - Run simulation training
router.post('/simulate', auth, adminOnly, async (req, res) => {
  try {
    const { episodes = 100 } = req.body;
    
    if (episodes < 1 || episodes > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Episodes must be between 1 and 1000'
      });
    }
    
    const result = await rlEngine.runSimulation(episodes);
    
    res.json(result);
  } catch (error) {
    console.error('RL Simulation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run simulation'
    });
  }
});

// GET /api/rl/logs - Get training logs
router.get('/logs', auth, adminOnly, async (req, res) => {
  try {
    const { date, type = 'training' } = req.query;
    
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, '..', 'storage', 'rl_logs');
    
    let logFile;
    if (date) {
      logFile = path.join(logPath, `${type}_${date}.json`);
    } else {
      // Get latest log file
      const files = fs.readdirSync(logPath)
        .filter(file => file.startsWith(type) && file.endsWith('.json'))
        .sort()
        .reverse();
      
      if (files.length === 0) {
        return res.json({
          success: true,
          logs: [],
          message: 'No logs found'
        });
      }
      
      logFile = path.join(logPath, files[0]);
    }
    
    if (!fs.existsSync(logFile)) {
      return res.status(404).json({
        success: false,
        error: 'Log file not found'
      });
    }
    
    const logContent = fs.readFileSync(logFile, 'utf8');
    const logs = logContent.trim().split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(log => log !== null);
    
    res.json({
      success: true,
      logs,
      file: path.basename(logFile),
      count: logs.length
    });
  } catch (error) {
    console.error('RL Logs Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get logs'
    });
  }
});

// POST /api/rl/reset - Reset model (admin only)
router.post('/reset', auth, adminOnly, async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'RESET_MODEL') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation required. Send confirm: "RESET_MODEL"'
      });
    }
    
    // Reset the RL engine
    rlEngine.qTable.clear();
    rlEngine.agent.episodes = 0;
    rlEngine.agent.totalReward = 0;
    rlEngine.agent.epsilon = 0.3;
    rlEngine.agent.confidence = 0.5;
    
    // Save reset model
    await rlEngine.saveModel();
    
    res.json({
      success: true,
      message: 'RL model reset successfully'
    });
  } catch (error) {
    console.error('RL Reset Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset model'
    });
  }
});

// GET /api/rl/performance - Get model performance metrics
router.get('/performance', auth, adminOnly, async (req, res) => {
  try {
    const status = rlEngine.getStatus();
    
    // Calculate performance metrics
    const avgReward = status.episodes > 0 ? status.totalReward / status.episodes : 0;
    const explorationRate = status.epsilon;
    const exploitationRate = 1 - status.epsilon;
    
    // Get recent training logs for trend analysis
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, '..', 'storage', 'rl_logs');
    
    let recentRewards = [];
    try {
      const files = fs.readdirSync(logPath)
        .filter(file => file.startsWith('training') && file.endsWith('.json'))
        .sort()
        .reverse()
        .slice(0, 3); // Last 3 days
      
      for (const file of files) {
        const logFile = path.join(logPath, file);
        const logContent = fs.readFileSync(logFile, 'utf8');
        const logs = logContent.trim().split('\n')
          .filter(line => line.trim())
          .map(line => {
            try {
              return JSON.parse(line);
            } catch (e) {
              return null;
            }
          })
          .filter(log => log !== null)
          .slice(-50); // Last 50 episodes
          
        recentRewards.push(...logs.map(log => log.reward));
      }
    } catch (e) {
      console.log('Could not load recent logs for performance analysis');
    }
    
    const recentAvgReward = recentRewards.length > 0 
      ? recentRewards.reduce((sum, r) => sum + r, 0) / recentRewards.length 
      : 0;
    
    const performance = {
      totalEpisodes: status.episodes,
      totalReward: status.totalReward,
      averageReward: avgReward,
      recentAverageReward: recentAvgReward,
      explorationRate: explorationRate,
      exploitationRate: exploitationRate,
      confidence: status.confidence,
      qTableSize: status.qTableSize,
      isTraining: status.isTraining,
      modelHealth: status.episodes > 50 ? 'trained' : 'learning',
      improvement: recentAvgReward > avgReward ? 'improving' : 'stable'
    };
    
    res.json({
      success: true,
      performance,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('RL Performance Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get performance metrics'
    });
  }
});

module.exports = router;
