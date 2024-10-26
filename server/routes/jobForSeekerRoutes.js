import express from 'express';
import { getAllJobs, getJobById } from '../controllers/jobForSeekerController.js';

const router = express.Router();

// Public routes for jobseekers
router.get('/jobseeker/all', getAllJobs);  // Get all jobs
router.get('/jobs/:jobId', getJobById);  // Get specific job details

export default router;