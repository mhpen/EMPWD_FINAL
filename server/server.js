// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import sanitize from 'sanitize-filename';
import fs from 'fs';

// Import routes
import employerRoutes from './routes/userRoutes/employerRoutes/employerRoute.js';
import jobSeekerRoutes from './routes/userRoutes/jobSeekerRoutes/jobSeekerRoutes.js';
import jobRoutes from './routes/jobRoute.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/userRoutes/admin/adminRoutes.js';
import jobForSeekerRoutes from './routes/jobForSeekerRoutes.js';
import userManagement from './routes/userManagement.js';
import seekerProfileRoutes from './routes/userRoutes/jobSeekerRoutes/seekerProfileRoutes.js';
import employerProfileRoute from './routes/userRoutes/employerRoutes/employerProfileRoute.js';
import adminProfileRoute from './routes/userRoutes/admin/adminProfileRoute.js';
import adminStatsRoute from './routes/userRoutes/admin/adminStatsRoute.js';
import jobApplicationRoutes from './routes/userRoutes/jobSeekerRoutes/jobApplicationRoutes.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "frame-ancestors": ["'self'", process.env.ALLOWED_FRAME_ANCESTOR || "http://localhost:3000"],
      },
    },
  })
);
app.use(compression()); // Compress response bodies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// File retrieval route
// File retrieval route
app.get('/uploads/:filename', (req, res) => {
  // Replace spaces in the filename with '%20' for file URL compatibility
  const filename = sanitize(req.params.filename.replace(/ /g, '%20'));
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.stat(filePath, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ message: 'File not found.' });
    }
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(err.status).end();
      }
    });
  });
});


// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI is undefined. Check your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/job', jobForSeekerRoutes);
app.use('/api/seekers', seekerProfileRoutes);
app.use('/api/employers', employerProfileRoute);
app.use('/api/admin', adminProfileRoute);
app.use('/api/admin/dashboard', adminStatsRoute);
app.use('/api/admin/management', userManagement);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
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
