import { User, Admin } from '../models/userModel.js'; // Adjust the import path as necessary
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Job from '../models/job.js';
import Notification from '../models/notification.js';
import mongoose from 'mongoose';

dotenv.config();

export const registerAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, dateOfBirth, gender, age } = req.body;

        // Check if the admin already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new User
        const user = await User.create({ email, password: hashedPassword, role: 'admin' });

        // Create new Admin
        const admin = await Admin.create({
            user: user._id,
            permissions: ['manage_users', 'manage_jobs', 'manage_employers'],
            accessLevel: 'moderator'
        });

        return res.status(201).json({ message: 'Admin registered successfully', adminId: admin._id });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can log in.' });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a token with userId instead of just id
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        email: user.email,
        isVerified: user.isVerified 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour in milliseconds
    });

    // Update last login time for admin
    await Admin.updateOne({ user: user._id }, { lastLogin: Date.now() });

    // Return success response with user info
    return res.status(200).json({ 
      success: true,
      message: 'Login successful',
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = 'createdAt',
      sortDirection = 'desc',
      jobTitle = '',
      status
    } = req.query;

    const query = {};
    if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: 'i' };
    if (status && status !== 'all') query.jobStatus = status;

    const jobs = await Job.find(query)
      .populate('employersId', 'companyName email')
      .sort({ [sortField]: sortDirection === 'asc' ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
      total,
      perPage: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

export const reviewJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId)
      .populate('employersId', 'companyName email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job details',
      error: error.message
    });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, message } = req.body;

    // Validate inputs
    if (!jobId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Job ID and status are required'
      });
    }

    // Validate status value
    const validStatuses = ['active', 'declined', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { 
        jobStatus: status,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('employersId', 'email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Create notification with correct fields
    await Notification.create({
      userId: job.employersId._id,
      jobId: job._id,
      title: `Job ${status === 'active' ? 'Approved' : 'Declined'}`,
      message: message || `Your job posting "${job.jobTitle}" has been ${status === 'active' ? 'approved' : 'declined'}`,
      type: status === 'active' ? 'approval' : 'rejection'
    });

    return res.status(200).json({
      success: true,
      message: `Job ${status === 'active' ? 'approved' : 'declined'} successfully`,
      data: job
    });

  } catch (error) {
    console.error('Update job status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating job status',
      error: error.message
    });
  }
};