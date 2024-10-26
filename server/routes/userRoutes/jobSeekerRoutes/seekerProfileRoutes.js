import express from 'express';
import SeekerProfile from '../../../controllers/seekerProfile.js';
import authMiddleware from '../../../middleware/authMiddlewareControl.js';  // Note: Check case sensitivity

const router = express.Router();

// Ensure these routes are properly defined
router.get('/profile', authMiddleware, SeekerProfile.getUserProfile);  // Changed from /user to /profile
router.put('/profile', authMiddleware, SeekerProfile.updateUserProfile);

export default router;

