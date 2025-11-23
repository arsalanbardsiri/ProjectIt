import express, { Request, Response } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import http from 'http';
import { initializeSocket } from './socket';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4000;

import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Socket.io
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
