import express from 'express';
import { registerAdmin, loginAdmin, getAllJobs } from '../../../controllers/adminController.js'; // Adjust the import path as necessary
import { authMiddleware, roleMiddleware } from '../../../middleware/authMiddlewareControl.js'; // Adjust the import path as necessary


const router = express.Router();

// Public routes
router.post('/', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes that require authentication and admin role
router.get('/admin/dashboard', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.status(200).json({ message: 'Welcome to the admin dashboard!', user: req.user });
});
router.get('/jobs', authMiddleware, roleMiddleware('admin'), getAllJobs);

// You can add more protected routes here that require specific roles

export default router;