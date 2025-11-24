import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { verifyToken } from './utils/auth';
import { PrismaClient } from '@prisma/client';
import { Server as HttpServer } from 'http';
import Filter from 'bad-words';

const prisma = new PrismaClient();
const filter = new Filter();

export const initializeSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all for now, should be restricted in production
            methods: ['GET', 'POST']
        }
    });

    const pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        tls: process.env.REDIS_URL?.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
    });
    const subClient = pubClient.duplicate();

    // Add error handlers to prevent crashes
    pubClient.on('error', (err) => console.error('[socket]: Redis Pub Error', err.message));
    subClient.on('error', (err) => console.error('[socket]: Redis Sub Error', err.message));

    io.adapter(createAdapter(pubClient, subClient));

    // Auth Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = verifyToken(token);
            socket.data.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`[socket]: User connected: ${socket.data.user.userId}`);

        socket.on('join_room', (roomId: string) => {
            socket.join(roomId);
            console.log(`[socket]: User ${socket.data.user.userId} joined room ${roomId}`);
        });

        socket.on('send_message', async ({ roomId, content }: { roomId: string, content: string }) => {
            try {
                // Profanity Filter
                const cleanContent = filter.clean(content);

                const message = await prisma.message.create({
                    data: {
                        content: cleanContent,
                        roomId,
                        senderId: socket.data.user.userId,
                    },
                    include: {
                        sender: {
                            select: { id: true, username: true }
                        }
                    }
                });

                // Broadcast to the room
                io.to(roomId).emit('receive_message', message);
            } catch (error) {
                console.error('[socket]: Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('[socket]: User disconnected');
        });
    });

    return io;
};
