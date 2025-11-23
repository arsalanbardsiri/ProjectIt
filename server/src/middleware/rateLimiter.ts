import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 20; // Allow 20 requests per minute per IP
const WINDOW_LOG_INTERVAL_IN_SECONDS = 1;

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const key = `rate_limit:${ip}`;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const windowStartTimestamp = currentTimestamp - WINDOW_SIZE_IN_SECONDS;

        // Remove requests older than the window
        await redis.zremrangebyscore(key, '-inf', windowStartTimestamp);

        // Get the number of requests in the current window
        const requestCount = await redis.zcard(key);

        if (requestCount >= MAX_WINDOW_REQUEST_COUNT) {
            return res.status(429).json({
                error: 'Too many requests',
                message: 'You have exceeded the 20 requests in 1 minute limit!',
            });
        }

        // Add the current request timestamp
        await redis.zadd(key, currentTimestamp, `${currentTimestamp}-${Math.random()}`);

        // Set expiry for the key to avoid memory leaks (slightly larger than window)
        await redis.expire(key, WINDOW_SIZE_IN_SECONDS + 10);

        next();
    } catch (error) {
        console.error('Rate Limiter Error:', error);
        next(); // Fail open if Redis is down
    }
};
