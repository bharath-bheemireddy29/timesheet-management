import rateLimit from "express-rate-limit";

/**
 * Rate limiting middleware to limit repeated requests to public APIs and/or endpoints such as password reset.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  skipSuccessfulRequests: true, // Allow to skip counting successful requests (status < 400)
});

export { authLimiter };
