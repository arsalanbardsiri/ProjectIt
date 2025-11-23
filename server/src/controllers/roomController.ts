import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createRoomSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    topic: z.string().min(2),
});

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, description, topic } = createRoomSchema.parse(req.body);
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const room = await prisma.studyRoom.create({
            data: {
                name,
                description,
                topic,
                creatorId: userId,
                members: {
                    connect: { id: userId }, // Creator automatically joins
                },
            },
        });

        res.status(201).json(room);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.studyRoom.findMany({
            include: {
                _count: {
                    select: { members: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const room = await prisma.studyRoom.findUnique({
            where: { id },
            include: {
                members: {
                    select: { id: true, username: true },
                },
                messages: {
                    take: 50,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        sender: {
                            select: { id: true, username: true },
                        },
                    },
                },
            },
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const joinRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const room = await prisma.studyRoom.update({
            where: { id },
            data: {
                members: {
                    connect: { id: userId },
                },
            },
        });

        res.json({ message: 'Joined room successfully', room });
    } catch (error) {
        res.status(500).json({ error: 'Could not join room' });
    }
};
