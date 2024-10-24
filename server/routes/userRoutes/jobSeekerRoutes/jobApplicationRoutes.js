import express from 'express';
import { 
   createJobApplication,
   getAllJobApplications,
   getJobApplicationById,
   updateJobApplication,
   deleteJobApplication
} from '../../../controllers/jobApplicationController.js';
//import { protect } from '../middleware/authMiddleware.js'; // Assuming you have a middleware to protect routes
import authMiddleware from '../../../MiddleWare/authMiddlewareControl.js'

const router = express.Router();

// Protected routes
router.post('/create', authMiddleware, createJobApplication);
router.get('/', getAllJobApplications);
router.get('/:id', getJobApplicationById);
router.put('/:id', updateJobApplication);
router.delete('/:id', deleteJobApplication);

export default router;