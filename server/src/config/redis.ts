import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl);

redis.on('connect', () => {
    console.log('[redis]: Connected to Redis');
});

redis.on('error', (err) => {
    console.error('[redis]: Error connecting to Redis', err);
});

export default redis;
