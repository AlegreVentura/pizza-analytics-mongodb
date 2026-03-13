/**
 * Simple in-memory rate limiter for Next.js API routes.
 *
 * Suitable for single-instance deployments (dev/demo). For multi-instance
 * or serverless production deployments, replace the store with a Redis-based
 * solution (e.g. @upstash/ratelimit).
 *
 * Rate limiting is automatically disabled in development (NODE_ENV=development)
 * to avoid 429 errors during local testing.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries every 5 minutes to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check whether a request from `key` (typically an IP address or endpoint
 * identifier) is within the allowed rate limit.
 */
export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  // Bypass entirely in development so local testing is never blocked
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true, remaining: options.limit, resetAt: Date.now() + options.windowMs };
  }

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + options.windowMs };
    store.set(key, newEntry);
    return { allowed: true, remaining: options.limit - 1, resetAt: newEntry.resetAt };
  }

  entry.count += 1;

  if (entry.count > options.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract the client IP from a Next.js Request object.
 * Falls back to a fixed string when headers are unavailable (e.g. local dev).
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'local'
  );
}
