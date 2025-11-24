import redis from '../config/redis';
import { QUEUE_NAME } from './queue';

const processJobs = async () => {
    console.log('[worker]: Worker started, waiting for jobs...');

    while (true) {
        try {
            // Blocking pop: waits until an item is available
            const result = await redis.brpop(QUEUE_NAME, 0);

            if (result) {
                const [queue, data] = result;
                const jobData = JSON.parse(data);

                console.log(`[worker]: Processing job from ${queue}:`, jobData);

                // Simulate processing time (e.g., sending email)
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log('[worker]: Job completed successfully');
            }
        } catch (error) {
            console.error('[worker]: Error processing job', error);
            // Wait a bit before retrying to avoid tight loop on error
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

// Start the worker if this file is run directly
if (require.main === module) {
    processJobs();
}

export default processJobs;
