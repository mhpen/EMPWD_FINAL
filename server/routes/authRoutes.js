import express from 'express';
import { login, logout, checkAuth } from '../controllers/auth.js';
import { authMiddleware } from '../MiddleWare/authMiddlewareControl.js';
import { sendOTP, verifyOTP, resendOTP } from '../controllers/otpController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/check', authMiddleware, checkAuth);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

export default router;