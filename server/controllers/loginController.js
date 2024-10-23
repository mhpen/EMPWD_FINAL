// controllers/loginController.js
import { BasicInfo } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
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
      { userId: user._id, role: user.role}, 
      process.env.JWT_SECRET, { expiresIn: '1h' }
    );

    // Send userId and token in the response
    return res.status(200).json({
      message: 'Login successful',
      token,  // The JWT token
      userId: user._id,  // User's ID
      role: user.role // Return the role as part of the response
    });
    
  } catch (error) {
    console.error('Error logging in:', error);

    // Differentiate between internal server error and bad request
    if (error.message === 'JWT secret key is missing from environment variables.') {
      return res.status(500).json({ message: 'Internal server error. Please contact support.' });
    }

    return res.status(500).json({ message: 'Error logging in. Please try again later.' });
  }
};


