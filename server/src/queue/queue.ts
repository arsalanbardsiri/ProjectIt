import redis from '../config/redis';

export const QUEUE_NAME = 'email_notifications';

export const addJob = async (data: any) => {
    try {
        await redis.lpush(QUEUE_NAME, JSON.stringify(data));
        console.log('[queue]: Job added to queue', data);
    } catch (error) {
        console.error('[queue]: Error adding job', error);
    }
};
