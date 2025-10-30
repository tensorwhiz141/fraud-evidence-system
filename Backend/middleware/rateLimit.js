const RateLog = require('../models/RateLog');

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  MAX_REPORTS: parseInt(process.env.RATE_LIMIT_MAX_REPORTS) || 100,
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 24 * 60 * 60 * 1000, // 24 hours
  ENDPOINTS: {
    '/api/reports': { limit: 50, window: 60 * 60 * 1000 }, // 50 per hour
    '/api/evidence/upload': { limit: 20, window: 60 * 60 * 1000 }, // 20 per hour
    '/api/auth/login': { limit: 10, window: 15 * 60 * 1000 } // 10 per 15 minutes
  }
};

module.exports = async function rateLimiter(req, res, next) {
  let identity = null;

  if (req.user?.email) {
    identity = req.user.email;
  } else if (req.headers.authorization) {
    identity = req.headers.authorization.split(' ')[1];
  } else {
    identity = req.ip;
  }

  if (!identity) {
    return res.status(403).json({ error: 'Cannot identify requester' });
  }

  // Get endpoint-specific config or use default
  const endpointConfig = RATE_LIMIT_CONFIG.ENDPOINTS[req.path] || {
    limit: RATE_LIMIT_CONFIG.MAX_REPORTS,
    window: RATE_LIMIT_CONFIG.WINDOW_MS
  };

  const since = new Date(Date.now() - endpointConfig.window);

  try {
    const recentLogs = await RateLog.find({
      token: identity,
      endpoint: req.path,
      timestamp: { $gte: since }
    }).sort({ timestamp: 1 }); // sort oldest -> newest

    if (recentLogs.length >= endpointConfig.limit) {
      const oldest = recentLogs[0];
      const nextAvailableAt = new Date(oldest.timestamp.getTime() + endpointConfig.window);

      await RateLog.create({
        token: identity,
        endpoint: req.path,
        timestamp: new Date(),
        success: false
      });

      return res.status(429).json({
        error: `Rate limit exceeded for ${req.path}. Max ${endpointConfig.limit} requests allowed per ${endpointConfig.window / 1000 / 60} minutes.`,
        nextAvailableAt: nextAvailableAt.toISOString(),
        limit: endpointConfig.limit,
        window: endpointConfig.window,
        retryAfter: Math.ceil((nextAvailableAt.getTime() - Date.now()) / 1000)
      });
    }

    await RateLog.create({
      token: identity,
      endpoint: req.path,
      timestamp: new Date(),
      success: true
    });

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': endpointConfig.limit,
      'X-RateLimit-Remaining': endpointConfig.limit - recentLogs.length - 1,
      'X-RateLimit-Reset': new Date(Date.now() + endpointConfig.window).toISOString()
    });

    next();
  } catch (err) {
    console.error('Rate limit check failed:', err.message);
    // Don't block requests if rate limiting fails
    next();
  }
};
