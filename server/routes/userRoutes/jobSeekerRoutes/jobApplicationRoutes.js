// routes/jobApplication.js
import express from 'express';
import { 
    submitApplication,
    getJobSeekerApplications,    // Added for viewing job seeker's applications
    getJobApplications          // Added for viewing applications for a job
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

// Get all applications for a specific job seeker
router.get(
    '/my-applications', 
    authMiddleware, 
    roleMiddleware(['jobseeker']), 
    getJobSeekerApplications
);

// Get all applications for a specific job (for employers)
router.get(
    '/job/:jobId', 
    authMiddleware, 
    roleMiddleware(['employer', 'admin']), 
    getJobApplications
);

export default router;