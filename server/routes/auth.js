// controllers/loginController.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { BasicInfo } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await BasicInfo.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if JWT secret is available
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret key is missing from environment variables.');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Adjusted to match the original code
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send response without sending the token in the body
    return res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    console.error('Error logging in:', error);

    // Differentiate between internal server error and missing JWT secret
    if (error.message === 'JWT secret key is missing from environment variables.') {
      return res.status(500).json({ message: 'Internal server error. Please contact support.' });
    }

    return res.status(500).json({ message: 'Error logging in. Please try again later.' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.json({ message: 'Logout successful' });
});

export default router;
