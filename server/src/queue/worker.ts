import redis from '../config/redis';
import { QUEUE_NAME } from './queue';
import nodemailer from 'nodemailer';

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

                if (jobData.type === 'WELCOME_EMAIL') {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    await transporter.sendMail({
                        from: `"ProjectIt Team" <${process.env.EMAIL_USER}>`,
                        to: jobData.email,
                        subject: 'Welcome to ProjectIt! 🚀',
                        text: `Hi ${jobData.username},\n\nWelcome to ProjectIt! We're excited to have you on board.\n\nStart collaborating now: ${process.env.CLIENT_URL || 'https://projectit.vercel.app'}\n\nHappy Learning,\nThe ProjectIt Team`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                                <h1 style="color: #6366f1;">Welcome to ProjectIt! 🚀</h1>
                                <p>Hi <strong>${jobData.username}</strong>,</p>
                                <p>We're excited to have you on board. Join a study room and start collaborating today!</p>
                                <a href="${process.env.CLIENT_URL || 'https://projectit.vercel.app'}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
                                <p style="margin-top: 20px; font-size: 12px; color: #666;">Happy Learning,<br>The ProjectIt Team</p>
                            </div>
                        `
                    });
                    console.log(`[worker]: Email sent to ${jobData.email}`);
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
