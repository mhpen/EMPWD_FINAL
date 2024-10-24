import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// ----------------------------- Import routes -----------------------------
import employerRoutes from './routes/userRoutes/employerRoutes/employerRoute.js';
import jobSeekerRoutes from './routes/userRoutes/jobSeekerRoutes/jobSeekerRoutes.js';
import jobRoutes from './routes/jobRoute.js';
import loginRoutes from './routes/loginRoutes.js'; // Login route
import jobApplicationRoutes from './routes/userRoutes/jobSeekerRoutes/jobApplicationRoutes.js'
import authMiddleware from './controllers/MiddleWare/authMiddlewareControl.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI is undefined. Check your .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => {
  console.log('Connected to MongoDB');
  console.log('Database name:', mongoose.connection.name);
})
  .catch(err => {
  console.error('Could not connect to MongoDB', err);
  process.exit(1);
});

// Logging middleware for requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
 
// Route handlers
app.use('/api/employers', employerRoutes); 
app.use('/api/jobSeekers', jobSeekerRoutes);
app.use('/api/jobs', jobRoutes); // This line should be present
app.use('/api/auth', loginRoutes); // Login route
app.use('/api/jobapplications', authMiddleware, jobApplicationRoutes) // application route


// Test POST route
app.post('/test-post', (req, res) => {
  console.log('Test POST route hit');
  console.log('Request body:', req.body);
  res.json({ message: 'POST test successful', receivedData: req.body });
});

// Test GET route
app.get('/test', (req, res) => {
  res.send('Test route working');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Log environment variables for debugging
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET); 