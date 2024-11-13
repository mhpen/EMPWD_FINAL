import express from 'express';
import { getAllJobs, reviewJob, updateJobStatus } from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../MiddleWare/authMiddlewareControl.js';

const router = express.Router();
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/jobs', getAllJobs);
router.get('/jobs/:jobId', reviewJob);
router.patch('/jobs/:jobId/status', updateJobStatus);

export default router; 