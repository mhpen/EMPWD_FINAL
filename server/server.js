// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

// Import routes
import employerRoutes from './routes/userRoutes/employerRoutes/employerRoute.js';
import jobSeekerRoutes from './routes/userRoutes/jobSeekerRoutes/jobSeekerRoutes.js';
import jobRoutes from './routes/jobRoute.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from  './routes/userRoutes/admin/adminRoutes.js'; // New admin routes
import jobForSeekerRoutes from './routes/jobForSeekerRoutes.js';
import seekerProfileRoutes from './routes/userRoutes/jobSeekerRoutes/seekerProfileRoutes.js';
import jobApplicationRoutes from './routes/userRoutes/jobSeekerRoutes/jobApplicationRoutes.js';
import messageRoute from './routes/messageRoute.js';
import userRoutes from './routes/userRoutes.js';
import adminStatsRoutes from  './routes/userRoutes/admin/adminStatsRoute.js'; // New admin routes
import userManagement from  './routes/userManagement.js';
import adminJobRoutes from './routes/adminJobRoutes.js';
import notification from './routes/notifications.js';
import resourcesRoutes from './routes/resources.js';
dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Set security HTTP headers
app.use(compression()); // Compress response bodies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI is undefined. Check your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });

// Logging middleware for requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

// Route handlers
app.use('/api/auth', authRoutes); // Auth routes for login/register, etc.
app.use('/api/admin', adminRoutes); // Admin-specific routes
app.use('/api/employers', employerRoutes); // Employer-specific routes
app.use('/api/jobseekers', jobSeekerRoutes); // Job seeker-specific routes
app.use('/api/jobs', jobRoutes); // Job listing and management routes
app.use('/api/applications', jobApplicationRoutes); // Job applications
app.use('/api/job', jobForSeekerRoutes); // Job seeker routes for jobs
app.use('/api/seekers', seekerProfileRoutes); // Profile management routes
app.use('/api/messages', messageRoute);
app.use('/api/users', userRoutes);
app.use('/api/admin/dashboard', adminStatsRoutes);
app.use('/api/admin/management', userManagement);
app.use('/api/admin/management', adminJobRoutes);
app.use('/api/notifications', notification);
app.use('/api/resources', resourcesRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Test routes for debugging
app.post('/test-post', (req, res) => {
  res.json({ message: 'POST test successful', receivedData: req.body });
});

app.get('/test', (req, res) => {
  res.send('Test route working');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});