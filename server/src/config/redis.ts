import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Required for BullMQ/queues
    tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
});

redis.on('connect', () => {
    console.log('[redis]: Connected to Redis');
});

redis.on('error', (err) => {
    // Suppress connection errors to prevent crash
    console.error('[redis]: Redis connection error', err.message);
});

export default redis;
