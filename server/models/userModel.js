import mongoose from 'mongoose';

// User schema for shared fields
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['jobseeker', 'employer', 'admin'], default: 'jobseeker' }
}, { timestamps: true });

const BasicInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  profilePicture: String
}, { timestamps: true });

const LocationInfoSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  postal: { type: String, required: true },
  address: { type: String, required: true }
}, { timestamps: true });

// Job Seeker specific schemas
const DisabilityInfoSchema = new mongoose.Schema({
  disabilityType: { type: [String ], required: true},
  disabilityAdditionalInfo: String
}, { timestamps: true });

const WorkPreferencesSchema = new mongoose.Schema({
  preferredJobTitles: { type: [String], required: true },
  industry:{ type: [String], required: true} ,
  employmentType: String
}, { timestamps: true });

// Updated JobSeeker schema
const JobSeekerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  basicInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'BasicInfo', required: true },
  locationInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'LocationInfo' },
  disabilityInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'DisabilityInfo' },
  workPreferences: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkPreferences' },
  documents: [{
  }]
}, { timestamps: true });

// Company User Schema (New)
const CompanyUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true }, // Added employer reference
  role: { 
    type: String, 
    enum: ['owner', 'admin', 'moderator', 'recruiter', 'viewer'],
    required: true 
  },
  permissions: [{ 
    type: String,
    enum: [
      'manage_jobs',
      'post_jobs',
      'edit_jobs',
      'delete_jobs',
      'view_applications',
      'manage_applications',
      'manage_company_profile',
      'manage_users',
      'view_analytics',
      'manage_billing',
      'send_messages'
    ]
  }],
  department: String,
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CompanyUser'
  },
  lastLogin: Date
}, { 
  timestamps: true,
  indexes: [
    { employer: 1, user: 1 }, // Added compound index for quick lookups
  ]
});

const CompanyInfoSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: [String], required: true }, // Changed to array of strings
  companySize: { type: String, required: true },
  website: String,
  companyAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  companyDescription: { type: String, required: true },
  establishmentDate: Date,
  companyLogo: String,
  departments: [String],
  documents: [{
    // Your document schema here
  }]
}, { timestamps: true });

const ContactPersonSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  alternativePhoneNumber: String,
  email: { type: String, required: true },
  linkedIn: String,
  department: { type: [String], default: [] } // Changed to array of strings
}, { timestamps: true });

const JobPostingSchema = new mongoose.Schema({
  jobTitles: { type: [String], required: true },
  employmentType: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyUser' } // Added reference to company user
}, { timestamps: true });

const PWDSupportSchema = new mongoose.Schema({
  accessibilityFeatures: { type: [String], default: [] }, // Changed to array of strings
  remoteWorkOptions: { type: Boolean, default: false },
  supportPrograms: { type: [String], default: [] }, // Also making this an array
  additionalInfo: { type: String, default: '' }
}, { timestamps: true });
// Updated Employer schema with company users
const EmployerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyInfo', required: true },
  contactPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'ContactPerson', required: true },
  pwdSupport: { type: mongoose.Schema.Types.ObjectId, ref: 'PWDSupport' },
}, { timestamps: true });

// Activity Log Schema for tracking user actions (New)
const ActivityLogSchema = new mongoose.Schema({
  companyUser: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyUser', required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  action: { 
    type: String, 
    required: true,
  },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String
}, { 
  timestamps: true,
  index: { 
    employer: 1, 
    createdAt: -1 
  } 
});

// Create models
const User = mongoose.model('User', UserSchema);
const CompanyUser = mongoose.model('CompanyUser', CompanyUserSchema);
const CompanyInfo = mongoose.model('CompanyInfo', CompanyInfoSchema);
const ContactPerson = mongoose.model('ContactPerson', ContactPersonSchema);
const JobPosting = mongoose.model('JobPosting', JobPostingSchema);
const PWDSupport = mongoose.model('PWDSupport', PWDSupportSchema);
const Employer = mongoose.model('Employer', EmployerSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
const BasicInfo = mongoose.model('BasicInfo', BasicInfoSchema);
const LocationInfo = mongoose.model('LocationInfo', LocationInfoSchema);
const DisabilityInfo = mongoose.model('DisabilityInfo', DisabilityInfoSchema);
const WorkPreferences = mongoose.model('WorkPreferences', WorkPreferencesSchema);
const JobSeeker = mongoose.model('JobSeeker', JobSeekerSchema);

const AdminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  permissions: { type: [String], default: ['manage_users', 'manage_jobs', 'manage_employers'] }, // Define permissions relevant to admin role
  accessLevel: { type: String, enum: ['superadmin', 'moderator'], default: 'moderator' }, // Optional access level
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

// Create the Admin model
const Admin = mongoose.model('Admin', AdminSchema);

// Export models
export {
  User,
  Admin,
  CompanyUser,
  CompanyInfo,
  ContactPerson,
  JobPosting,
  PWDSupport,
  Employer,
  ActivityLog,
  BasicInfo,
  LocationInfo,
  DisabilityInfo,
  WorkPreferences,
  JobSeeker
};


export default Employer;