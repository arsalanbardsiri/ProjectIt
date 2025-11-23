import { Router } from 'express';
import { createRoom, getRooms, getRoom, joinRoom } from '../controllers/roomController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate); // Protect all room routes

router.post('/', createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.post('/:id/join', joinRoom);

export default router;
