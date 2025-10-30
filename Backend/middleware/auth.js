//middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require('../models/User');

const publicRoutes = [
  "/api/escalate",
  "/simulate-rbi-alert",
  "/health",
  "/test",
  "/api/test/features",
  "/api/test/evidence",
  "/api/test/investigations",
  "/api/flag"  // Allow flag endpoint for testing
];

// Token refresh function
const refreshToken = (userId, role) => {
  const jwtSecret = process.env.JWT_SECRET;
  const payload = { userId, role };
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' };
  return jwt.sign(payload, jwtSecret, options);
};

module.exports = async (req, res, next) => {
  // Skip authentication for public routes
  if (publicRoutes.includes(req.path) || req.path.startsWith('/api/test/')) {
    console.log("🔓 Public route, skipping auth:", req.path);
    return next();
  }

  console.log("=== AUTH DEBUG ===");
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    console.log("❌ Missing Authorization header");
    return res.status(403).json({ message: "No authorization header" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    console.log("❌ Invalid Authorization format");
    return res.status(403).json({ message: "Invalid authorization format" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("❌ JWT secret not defined in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Verify JWT token (local format, not Supabase)
    const payload = jwt.verify(token, jwtSecret);

    console.log("✅ JWT verified:", {
      userId: payload.userId,
      role: payload.role
    });

    // Get full user details from database
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      console.log("❌ User not found in database:", payload.userId);
      return res.status(403).json({ message: "User not found" });
    }

    // Check if token is about to expire (within 1 hour)
    const now = Math.floor(Date.now() / 1000);
    const tokenExp = payload.exp;
    const timeUntilExp = tokenExp - now;
    
    // If token expires within 1 hour, generate a new one
    let newToken = null;
    if (timeUntilExp < 3600) { // 1 hour
      newToken = refreshToken(user._id, user.role);
      console.log("🔄 Token refreshed for user:", user.email);
    }

    // Attach user information to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.isActive !== false, // default to true if not set
      newToken // Attach new token if generated
    };

    console.log("✅ User authenticated:", {
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions.length
    });

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error("❌ JWT token expired:", err.message);
      return res.status(401).json({ 
        message: "Token expired", 
        code: "TOKEN_EXPIRED",
        refreshRequired: true 
      });
    } else {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};
