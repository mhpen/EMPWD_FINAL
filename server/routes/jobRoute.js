// routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  updateJobPosting,
  getAllJobPostings,
  getJobPostingById,
  deleteJobPosting
} from '../controllers/jobController.js';

const router = express.Router();

// POST route to create a new job posting
router.post('/create', createJob);

// PUT route to update a job posting by ID
router.put('/update/:id', updateJobPosting);

// GET route to retrieve all job postings with pagination
router.get('/', getAllJobPostings);

// GET route to retrieve a job posting by ID
router.get('/:id', getJobPostingById);

// DELETE route to delete a job posting by ID
router.delete('/delete/:id', deleteJobPosting);

export default router;