import express from 'express';
import { authMiddleware, roleMiddleware } from '../MiddleWare/authMiddlewareControl.js';
import {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead
} from '../controllers/messageController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Message routes
router.post('/send', sendMessage);
router.get('/conversation/:userId', getMessages);
router.get('/conversations', getConversations);
router.put('/read/:senderId', markMessagesAsRead);

export default router;
