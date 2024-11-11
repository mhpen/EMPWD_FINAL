import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employersId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true }, // Add employerId reference
  jobTitle: { type: String, required: true },
  
  jobDescription: { type: String, required: true },
  jobLocation: { type: String, required: true },
  industry: { type: [String], required: true },
  employmentType: { type: String, required: true },
  applicationDeadline: { type: Date, required: true },
  keySkills: { type: [String], default: [] },
  otherSkills: { type: String, default: '' },
  educationLevel: { type: String, required: true },
  yearsOfExperience: { type: String, required: true },
  salaryMin: { type: Number, required: true },
  salaryMax: { type: Number, required: true },
  benefits: { type: [String], default: [] },
  additionalPerks: { type: String, default: '' },
  accessibilityFeatures: { type: [String], default: [] },
  specialAccommodations: { type: String, default: '' },
  jobStatus: { type: String, default: 'pending' },  // Default value set to "pending"
  isStarred: { type: Boolean, default: false }  // Default value set to false
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
