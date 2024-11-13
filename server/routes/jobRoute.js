import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddlewareControl.js';
import {
  createJob,
  getEmployerJobs,
  getJobById,
  updateJob,
  updateJobStarStatus,
  updateJobStatus,
  deleteJob,
  deleteMultipleJobs,
  getJobApplications,
  searchJobs
} from '../controllers/jobController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Public routes (accessible to all authenticated users)
router.get('/search', searchJobs);
router.get('/:jobId', getJobById);

// Employer and Admin routes
router.use(roleMiddleware(['employer', 'admin']));
router.delete('/delete-job/:jobId', deleteJob);

// Job CRUD operations
router.post('/create', createJob);
router.get('/employer/:employerId', getEmployerJobs);
router.get('/applications/:jobId', getJobApplications);

// Edit-related routes
router.patch('/:jobId/update', updateJob);
router.patch('/:jobId/status', updateJobStatus);
router.patch('/:jobId/is-starred', updateJobStarStatus);


// Admin-only routes
router.use(roleMiddleware(['admin']));

router.delete('/delete-multiple', deleteMultipleJobs);

export default router;