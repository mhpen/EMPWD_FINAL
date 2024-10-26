import express from 'express';
import { login, logout, checkAuth } from '../controllers/auth.js';
import { authMiddleware } from '../MiddleWare/authMiddlewareControl.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/check', authMiddleware, checkAuth);

export default router;