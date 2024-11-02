import express from 'express';
import { 
    submitApplication,
    getJobApplicationsForEmployer,   // For job seekers to view their applications
    getJobApplications          // For employers to view applications for their jobs
} from '../../../controllers/jobApplicationController.js';
import { 
    authMiddleware, 
    roleMiddleware 
} from '../../../middleware/authMiddlewareControl.js';

const router = express.Router();

// Submit new application (for job seekers)
router.post(
    '/submit', 
    authMiddleware, 
    roleMiddleware(['jobseeker']), 
    submitApplication
);

// Get all applications for the authenticated job seeker
router.get(
    '/my-applications', 
    authMiddleware, 
    roleMiddleware(['jobseeker']), 
    getJobApplications
);

// Get all applications for jobs created by the authenticated employer
router.get(
    '/employer/:id/applications', 
    authMiddleware, 
    roleMiddleware(['employer']), 
    getJobApplicationsForEmployer
);

export default router;