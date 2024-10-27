import express from 'express';
import { 
  submitApplication,

} from '../../../controllers/jobApplicationController.js';
import {authMiddleware , roleMiddleware} from '../../../middleware/authMiddlewareControl.js';  // Note: Check case sensitivity


const router = express.Router();

// POST route for job application submission (accessible only to job seekers)
router.post('/submit', authMiddleware, roleMiddleware(['jobseeker']), submitApplication);

export default router;