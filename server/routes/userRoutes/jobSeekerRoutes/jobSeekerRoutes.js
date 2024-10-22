import { Router } from 'express';
import { createJobSeeker, getJobSeekerById, updateJobSeeker, deleteJobSeeker } from '../../../controllers/jobSeekerController.js';

const router = Router();

router.post('/', createJobSeeker); // Create a new job seeker

router.get('/:id', getJobSeekerById); // Get a job seeker by ID

router.put('/:id', updateJobSeeker); // Update a job seeker by ID

router.delete('/:id', deleteJobSeeker); // Delete a job seeker by ID

export default router;
