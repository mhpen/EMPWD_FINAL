import mongoose from 'mongoose';

// User schema for shared fields
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['jobseeker', 'employer', 'admin'], default: 'jobseeker' }
}, { timestamps: true });

// Basic Info schema with new fields
const BasicInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true }
}, { timestamps: true });

const LocationInfoSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  postal: { type: String, required: true },
  address: { type: String, required: true }
}, { timestamps: true });

// Job Seeker specific schemas
const DisabilityInfoSchema = new mongoose.Schema({
  disabilityType: { type: String },
  disabilityAdditionalInfo: String
}, { timestamps: true });

const WorkPreferencesSchema = new mongoose.Schema({
  preferredJobTitles: { type: [String], required: true },
  industry: String,
  employmentType: String
}, { timestamps: true });

const JobSeekerAdditionalInfoSchema = new mongoose.Schema({
  profilePicture: String,
  resumeUrl: String
}, { timestamps: true });

// Updated JobSeeker schema
const JobSeekerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  basicInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'BasicInfo', required: true },
  locationInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'LocationInfo' },
  disabilityInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'DisabilityInfo' },
  workPreferences: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkPreferences' },
  additionalInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSeekerAdditionalInfo' }
}, { timestamps: true });

// Employer specific schemas
const CompanyInfoSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: String,
  companySize: String,
  website: String
}, { timestamps: true });

const ContactPersonSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: String,
  jobTitle: String,
  email: String,
  linkedIn: String
}, { timestamps: true });

const JobPostingSchema = new mongoose.Schema({
  jobTitles: { type: [String], required: true },
  employmentType: String,
  locations: { type: [String], required: true }
}, { timestamps: true });

const PWDSupportSchema = new mongoose.Schema({
  accessibilityFeatures: String,
  remoteWorkOptions: Boolean,
  supportPrograms: String,
  additionalInfo: String
}, { timestamps: true });

// Updated Employer schema
const EmployerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  basicInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'BasicInfo', required: true },
  locationInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'LocationInfo' },
  companyInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyInfo' },
  contactPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'ContactPerson' },
  jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting' },
  pwdSupport: { type: mongoose.Schema.Types.ObjectId, ref: 'PWDSupport' }
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permissions: { type: [String], default: ['manage_users', 'manage_jobs', 'manage_employers'] }, // Define permissions relevant to admin role
  accessLevel: { type: String, enum: ['superadmin', 'moderator'], default: 'moderator' }, // Optional access level
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

// Create the Admin model
const Admin = mongoose.model('Admin', AdminSchema);
// Create models
const User = mongoose.model('User', UserSchema);
const BasicInfo = mongoose.model('BasicInfo', BasicInfoSchema);
const LocationInfo = mongoose.model('LocationInfo', LocationInfoSchema);
const DisabilityInfo = mongoose.model('DisabilityInfo', DisabilityInfoSchema);
const WorkPreferences = mongoose.model('WorkPreferences', WorkPreferencesSchema);
const JobSeekerAdditionalInfo = mongoose.model('JobSeekerAdditionalInfo', JobSeekerAdditionalInfoSchema);
const CompanyInfo = mongoose.model('CompanyInfo', CompanyInfoSchema);
const ContactPerson = mongoose.model('ContactPerson', ContactPersonSchema);
const JobPosting = mongoose.model('JobPosting', JobPostingSchema);
const PWDSupport = mongoose.model('PWDSupport', PWDSupportSchema);
const JobSeeker = mongoose.model('JobSeeker', JobSeekerSchema);
const Employer = mongoose.model('Employer', EmployerSchema);
export {
  User,
  BasicInfo,
  LocationInfo,
  DisabilityInfo,
  WorkPreferences,
  JobSeekerAdditionalInfo,
  CompanyInfo,
  ContactPerson,
  JobPosting,
  PWDSupport,
  JobSeeker,
  Employer,
  Admin // Add Admin model to the exports
};

export default JobSeeker;