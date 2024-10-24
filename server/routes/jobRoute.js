// routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  updateJobPosting,
  getJobs,
  getJobPostingById,
  deleteJob,
  updateIsStarred,
  deleteMultipleJobs,
  getEmployerJobs
} from '../controllers/jobController.js';
import  authMiddleware from '../MiddleWare/authMiddlewareControl.js';

const router = express.Router();

router.get('/employer/:employersId',  authMiddleware, getEmployerJobs);

// POST route to create a new job posting
router.post('/create', authMiddleware,createJob);

// PUT route to update a job posting by ID
router.put('/update/:id', authMiddleware, updateJobPosting);

// GET route to retrieve a job posting by ID
router.get('/:id',  authMiddleware,getJobPostingById);

// GET route for fetching all jobs
router.get('/',  authMiddleware,getJobs);  // Make sure this line exists

// DELETE route for removing jobs
router.delete('/delete-job/:id',  authMiddleware,deleteJob);

router.patch('/:id/is-starred', authMiddleware, updateIsStarred);

router.delete('/delete-multiple', authMiddleware, deleteMultipleJobs);

export default router;