import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobseeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BasicInfo',  // This references your JobSeeker model
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  basicInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    location: String
  },
  workHistory: {
    previousJobTitle: String,
    companyName: String,
    duration: String,
    keyResponsibility: String
  },
  jobPreferences: {
    desiredPosition: String,
    preferredStartDate: Date,
    availability: String
  },
  documents: {
    resumeUrl: String,
    coverLetterUrl: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create a compound index on jobseeker and jobId to prevent duplicate applications
applicationSchema.index({ jobseeker: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;