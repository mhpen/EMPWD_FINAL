// routes/loginRoutes.js
import express from 'express';
import { login } from '../controllers/loginController.js';

const router = express.Router();

// POST request for login
router.post('/login', login);

export default router;