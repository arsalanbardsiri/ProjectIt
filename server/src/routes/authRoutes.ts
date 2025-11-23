import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiter to auth routes to prevent brute force
router.post('/register', rateLimiter, register);
router.post('/login', rateLimiter, login);

export default router;
