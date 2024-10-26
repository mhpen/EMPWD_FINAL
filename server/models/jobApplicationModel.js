import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    basicInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      location: { type: String, required: true },
    },
    jobPreferences: {
      desiredPosition: { type: String, required: true },
      preferredStartDate: { type: Date, required: true },
      currentLocation: { type: String, required: true },
      availability: { type: String, required: true },
    },
    workHistory: {
      previousJobTitle: { type: String, required: true },
      companyName: { type: String, required: true },
      duration: { type: String, required: true },
      keyResponsibility: { type: String, required: true },
    },
    documents: {
      resumeUrl: { type: String, required: true },
      coverLetterUrl: { type: String },
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
