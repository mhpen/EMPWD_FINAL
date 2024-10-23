import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
   personalInformation: {
      jobSeeker: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSeeker', required: true },
      phoneNumber: { type: String, required: true },
   },
   jobPreferences: {
      desiredPosition: { type: String, required: true },
      preferredStartDate: { type: Date, required: true },
      currentLocation: { type: String, required: true },
      availability: { type: String, required: true },
   },
   workHistory: [{
      previousJobTitle: { type: String, required: true },
      companyName: { type: String, required: true },
      duration: { type: String, required: true },
      keyResponsibility: { type: String, required: true },
   }],
   resume: {
      resumeUrl: { type: String, required: true },
      coverLetterUrl: { type: String, required: false },
   },
   applicationStatus: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected', 'interviewing'],
      default: 'pending'
   },
   submittedAt: { type: Date, default: Date.now },
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication;
