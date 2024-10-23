// routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  updateJobPosting,
  getJobs,
  getJobPostingById,
  deleteJob
} from '../controllers/jobController.js';

const router = express.Router();

// POST route to create a new job posting
router.post('/create', createJob);

// PUT route to update a job posting by ID
router.put('/update/:id', updateJobPosting);

// GET route to retrieve a job posting by ID
router.get('/:id', getJobPostingById);

// GET route for fetching all jobs
router.get('/', getJobs);  // Make sure this line exists

// DELETE route for removing jobs
router.delete('/delete-job/:id', deleteJob);

export default router;