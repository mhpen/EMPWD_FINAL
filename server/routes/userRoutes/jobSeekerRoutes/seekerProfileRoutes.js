// routes/jobSeekerProfile.js

import express from 'express';
import SeekerProfile from '../../../controllers/seekerProfile.js';
import { authMiddleware, roleMiddleware } from '../../../middleware/authMiddlewareControl.js';

const router = express.Router();

router.get(
  '/profile',
  authMiddleware,
  roleMiddleware(['jobseeker']),
  SeekerProfile.getUserProfile
);

router.get(
  '/applications',  // Route to fetch all applications
  authMiddleware,
  roleMiddleware(['jobseeker']),
  SeekerProfile.getAllApplications
);

router.get(
  '/application/:applicationId',  
  authMiddleware,
  roleMiddleware(['jobseeker']),
  SeekerProfile.getApplicationDetails
);

export default router;