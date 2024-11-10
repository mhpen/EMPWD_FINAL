import { User, Admin } from '../models/userModel.js'; // Adjust the import path as necessary
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Job from '../models/job.js';

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

        // Generate a token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expiration time
        });

        // Update last login time for admin
        await Admin.updateOne({ user: user._id }, { lastLogin: Date.now() });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllJobs = async (req, res) => {
    try {
      // Destructure query parameters with defaults
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
        jobTitle = '',
        location = '',
        industry = '',
        employmentType = '',
        jobStatus
      } = req.query;
  
      // Build filter object
      const filter = {};
  
      // Title search
      if (jobTitle) {
        filter.jobTitle = { $regex: jobTitle, $options: 'i' };
      }
  
      // Location search
      if (location) {
        filter.jobLocation = { $regex: location, $options: 'i' };
      }
  
      // Industry filter
      if (industry) {
        filter.industry = industry;
      }
  
      // Employment type filter
      if (employmentType) {
        filter.employmentType = employmentType;
      }
  
      // Job status filter
      if (jobStatus) {
        filter.jobStatus = jobStatus;
      }
  
      // Build sort object
      const sortOrder = order === 'desc' ? -1 : 1;
      const sortOptions = { [sortBy]: sortOrder };
  
      // Calculate skip value for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
  
      // Execute query with filters, sorting, and pagination
      const jobs = await Job.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
  
      // Get total count for pagination
      const total = await Job.countDocuments(filter);
  
      // Return response
      res.status(200).json({
        success: true,
        data: jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalRecords: total,
          recordsPerPage: parseInt(limit)
        },
        filters: {
          jobTitle,
          location,
          industry,
          employmentType,
          jobStatus
        }
      });
    } catch (error) {
      console.error('Get all jobs error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching jobs',
        error: error.message
      });
    }
  };