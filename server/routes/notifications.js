import express from 'express';
import { authMiddleware } from '../MiddleWare/authMiddlewareControl.js';
import {
    getNotifications,
    markAsRead,
    deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', getNotifications);
router.patch('/notifications/:id/read', markAsRead);
router.delete('/notifications/:id', deleteNotification);

export default router; 