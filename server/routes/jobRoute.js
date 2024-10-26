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

// Employer-only routes
router.use(roleMiddleware(['employer']));

// Job CRUD operations
router.post('/create', createJob);
router.get('/employer/:employerId', getEmployerJobs);
router.get('/applications/:jobId', getJobApplications);

// Edit-related routes
router.patch('/:jobId/update', updateJob); // Route for updating individual fields
router.patch('/:jobId/status', updateJobStatus);
router.patch('/:jobId/is-starred', updateJobStarStatus);

// Delete routes
router.delete('/delete-job/:jobId', deleteJob);
router.delete('/delete-multiple', deleteMultipleJobs);

export default router;