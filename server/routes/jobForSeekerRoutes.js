import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddlewareControl.js';
import {
  getAllJobs,
  getJobById,
  applyForJob,
  getJobSeekerApplications,
  updateApplicationStatus,
  saveJob,
  unsaveJob,
} from '../controllers/jobForSeekerController.js';

const router = express.Router();

// Make the job listing routes public but still authenticated
router.use(authMiddleware);

// Public job routes (no role requirement)
router.get('/all', getAllJobs);
router.get('/:jobId', getJobById);

// Job seeker-specific routes
router.use('/apply', roleMiddleware(['jobseeker']));
router.use('/applications', roleMiddleware(['jobseeker']));
router.use('/jobs', roleMiddleware(['jobseeker']));

router.post('/apply/:jobId', applyForJob);
router.get('/applications', getJobSeekerApplications);
router.patch('/applications/:applicationId/status', updateApplicationStatus);
router.patch('/jobs/:jobId/save', saveJob);
router.patch('/jobs/:jobId/unsave', unsaveJob);

export default router;