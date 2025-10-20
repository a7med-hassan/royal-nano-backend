// ✅ Centralized CORS Configuration for Royal Nano Backend
// Supports multiple domains: production, localhost, and testing

/**
 * Allowed domains for CORS
 */
const ALLOWED_ORIGINS = [
  // Production domains
  'https://www.royalnanoceramic.com',
  'https://royalnanoceramic.com',
  'https://royal-nano-backend.vercel.app',
  
  // Localhost development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4200',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:8080',
  
  // Testing domains
  'https://royal-nano-test.vercel.app',
  'https://royal-nano-staging.vercel.app',
  
  // Vercel preview domains (wildcard for testing)
  /^https:\/\/royal-nano-backend-.*\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.app$/,
];

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin) {
  if (!origin) return false;
  
  return ALLOWED_ORIGINS.some(allowedOrigin => {
    if (typeof allowedOrigin === 'string') {
      return allowedOrigin === origin;
    }
    if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }
    return false;
  });
}

/**
 * Get the appropriate origin for CORS header
 */
function getCorsOrigin(origin) {
  // For development/testing, allow specific origins
  if (isOriginAllowed(origin)) {
    return origin;
  }
  
  // For production, be more restrictive
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.royalnanoceramic.com';
  }
  
  // For development, allow localhost
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return origin || 'http://localhost:3000';
  }
  
  // Fallback
  return 'https://www.royalnanoceramic.com';
}

/**
 * Set CORS headers for response
 */
function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  const corsOrigin = getCorsOrigin(origin);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
}

/**
 * Handle preflight OPTIONS request
 */
function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    return res.status(200).end();
  }
  return false;
}

/**
 * CORS middleware for Vercel functions
 */
function withCors(handler) {
  return async (req, res) => {
    // Set CORS headers
    setCorsHeaders(req, res);
    
    // Handle preflight requests
    if (handlePreflight(req, res)) {
      return;
    }
    
    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Simple CORS setup for direct use in API functions
 */
function setupCors(req, res) {
  setCorsHeaders(req, res);
  return handlePreflight(req, res);
}

module.exports = {
  setCorsHeaders,
  handlePreflight,
  setupCors,
  withCors,
  isOriginAllowed,
  getCorsOrigin,
  ALLOWED_ORIGINS
};
