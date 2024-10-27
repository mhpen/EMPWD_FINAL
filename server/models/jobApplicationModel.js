// models/jobApplicationModel.js
import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Assuming you have a Job model
    required: true,
  },
  jobseekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker', // Correcting the reference to JobSeeker
    required: true,
  },
  basicInfo: {
    firstName: String,
    lastName: String,
    email: String,
    // Add other fields as needed
  },
  workHistory: {
    previousJobTitle: String,
    companyName: String,
    duration: String,
    keyResponsibility: String,
  },
  jobPreferences: {
    preferredLocation: String,
    employmentType: String,
  },
  documents: {
    resumeUrl: String,
    coverLetterUrl: String,
  },
}, { timestamps: true });

const Application = mongoose.model('Application', jobApplicationSchema);

export default Application; 