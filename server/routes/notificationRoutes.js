import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  deleteNotification 
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.patch('/:notificationId/read', markAsRead);
router.delete('/:notificationId', deleteNotification);

export default router; 