interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests = 100, windowMs = 60000) {
    // 100 requests per minute
    this.maxRequests = maxRequests
    this.windowMs = windowMs

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      const resetTime = now + this.windowMs
      this.requests.set(identifier, { count: 1, resetTime })
      return { allowed: true, remaining: this.maxRequests - 1, resetTime }
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime }
    }

    // Increment counter
    entry.count++
    this.requests.set(identifier, entry)
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

export function withRateLimit(maxRequests = 100, windowMs = 60000) {
  const limiter = new RateLimiter(maxRequests, windowMs)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return (handler: Function) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (request: Request, ...args: any[]) => {
      const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

      const result = limiter.check(ip)

      if (!result.allowed) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(Math.ceil((result.resetTime - Date.now()) / 1000)),
              "X-RateLimit-Limit": String(maxRequests),
              "X-RateLimit-Remaining": String(result.remaining),
              "X-RateLimit-Reset": String(result.resetTime),
            },
          },
        )
      }

      // Add rate limit headers to successful responses
      const response = await handler(request, ...args)

      if (response instanceof Response) {
        response.headers.set("X-RateLimit-Limit", String(maxRequests))
        response.headers.set("X-RateLimit-Remaining", String(result.remaining))
        response.headers.set("X-RateLimit-Reset", String(result.resetTime))
      }

      return response
    }
  }
}
