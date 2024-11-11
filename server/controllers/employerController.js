import { 
  User, 
  CompanyUser, 
  CompanyInfo, 
  ContactPerson, 
  JobPosting, 
  PWDSupport,   
  Employer, 
  ActivityLog 
} from '../models/userModel.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Custom error class for better error handling
class EmployerError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Helper function to log company user activity
const logActivity = async (companyUserId, employerId, action, details, req, session = null) => {
  const activityLog = new ActivityLog({
    companyUser: companyUserId,
    employer: employerId,
    action,
    details,
    ipAddress: req.ip
  });
  
  if (session) {
    await activityLog.save({ session });
  } else {
    await activityLog.save();
  }
};

// Response formatter for consistency
const formatResponse = (data, message = null) => ({
  success: true,
  message,
  data
});

/**
 * Get all employers with pagination and filtering
 */
export const getAllEmployers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const industry = req.query.industry;
    
    // Build query
    const query = {};
    if (search) {
      query['$or'] = [
        { 'companyInfo.companyName': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }
    if (industry) {
      query['companyInfo.industry'] = industry;
    }

    const [employers, total] = await Promise.all([
      Employer.find(query)
        .populate('user', '-password')
        .populate('companyInfo')
        .populate('contactPerson')
        .populate('jobPosting')
        .populate('pwdSupport')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Employer.countDocuments(query)
    ]);

    res.status(200).json(formatResponse({
      employers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }));
  } catch (error) {
    next(new EmployerError('Error fetching employers', 500));
  }
};

/**
 * Get employer by ID with full details
 */
export const getEmployerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new EmployerError('Invalid employer ID', 400);
    }

    const employer = await Employer.findById(id)
      .populate('user', '-password')
      .populate('companyInfo')
      .populate('contactPerson')
      .populate('jobPosting')
      .populate('pwdSupport')
      .lean();

    if (!employer) {
      throw new EmployerError('Employer not found', 404);
    }

    res.status(200).json(formatResponse(employer));
  } catch (error) {
    next(error);
  }
};

export const createEmployer = async (req, res, next) => {
  try {
    const { email, password, companyInfo, contactPerson, pwdSupport } = req.body;

    // Log incoming request data
    console.log("Attempting to create employer with email:", email);

    // Validate required fields
    if (!email || !password || !companyInfo || !contactPerson) {
      throw new EmployerError('Missing required fields', 400);
    }

    // Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim();

    // Debug log for email check
    console.log("Checking for existing user with email:", normalizedEmail);

    // Check if email already exists with detailed logging
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new EmployerError('Email already registered', 409);
    }

    // Validate CompanyInfo required fields
    if (!companyInfo.companyName || !companyInfo.industry || 
        !companyInfo.companySize || !companyInfo.companyDescription) {
      throw new EmployerError('Missing required company information', 400);
    }

    // Validate company address
    if (!companyInfo.companyAddress?.street || !companyInfo.companyAddress?.city ||
        !companyInfo.companyAddress?.province || !companyInfo.companyAddress?.country ||
        !companyInfo.companyAddress?.postalCode) {
      throw new EmployerError('Missing required company address information', 400);
    }

    // Validate ContactPerson required fields
    if (!contactPerson.fullName || !contactPerson.position || 
        !contactPerson.phoneNumber || !contactPerson.email) {
      throw new EmployerError('Missing required contact person information', 400);
    }

    console.log("Creating new user with email:", normalizedEmail);

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: 'employer',
      isVerified: false
    });

    console.log("Successfully created user:", user._id);

    // Handle file uploads if they exist
    const uploadedDocuments = [];
    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        const file = files[0];
        const documentType = {
          'companyLogo': 'Company Logo',
          'otherDocs': 'Other'
        }[fieldName];

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '-' + file.originalname;
        const filepath = path.join(__dirname, '../../uploads', filename);

        await fs.writeFile(filepath, file.buffer);

        uploadedDocuments.push({
          documentType,
          fileName: filename,
          filePath: filepath,
          contentType: file.mimetype
        });
      }
    }

    // Create company related documents
    const newCompanyInfo = await CompanyInfo.create({
      ...companyInfo,
      departments: companyInfo.departments || [],
      documents: uploadedDocuments
    });

    const newContactPerson = await ContactPerson.create({
      ...contactPerson,
      alternativePhoneNumber: contactPerson.alternativePhoneNumber || '',
      linkedIn: contactPerson.linkedIn || '',
      department: contactPerson.department || ''
    });

    // Create PWDSupport if provided
    let newPwdSupport;
    if (pwdSupport) {
      newPwdSupport = await PWDSupport.create({
        accessibilityFeatures: pwdSupport.accessibilityFeatures || '',
        remoteWorkOptions: pwdSupport.remoteWorkOptions || false,
        supportPrograms: pwdSupport.supportPrograms || '',
        additionalInfo: pwdSupport.additionalInfo || ''
      });
    }

    // Create employer profile
    const employer = await Employer.create({
      user: user._id,
      companyInfo: newCompanyInfo._id,
      contactPerson: newContactPerson._id,
      pwdSupport: newPwdSupport ? newPwdSupport._id : undefined
    });

    // Create initial company user (owner) with full permissions
    const companyUser = await CompanyUser.create({
      user: user._id,
      employer: employer._id,
      role: 'owner',
      permissions: [
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
      ],
      status: 'active',
      lastLogin: new Date()
    });

    // Log the activity
    await logActivity(companyUser._id, employer._id, 'user_added', {
      action: 'Created new employer account',
      companyName: companyInfo.companyName
    }, req);

    // Return response with populated employer data
    const populatedEmployer = await Employer.findById(employer._id)
      .populate('companyInfo')
      .populate('contactPerson')
      .populate('pwdSupport');

    console.log("Successfully created employer account");
    res.status(201).json(formatResponse(populatedEmployer, 'Employer created successfully'));
  } catch (error) {
    console.error("Error in createEmployer:", { message: error.message, stack: error.stack, details: error });
    next(error);
  }
};


export const updateEmployer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new EmployerError('Invalid employer ID', 400);
    }

    // Verify employer exists
    const employer = await Employer.findById(id);
    if (!employer) {
      throw new EmployerError('Employer not found', 404);
    }

    // Handle nested updates
    if (updates.companyInfo) {
      await CompanyInfo.findByIdAndUpdate(
        employer.companyInfo,
        updates.companyInfo,
        { session }
      );
    }
    if (updates.contactPerson) {
      await ContactPerson.findByIdAndUpdate(
        employer.contactPerson,
        updates.contactPerson,
        { session }
      );
    }
    if (updates.pwdSupport) {
      await PWDSupport.findByIdAndUpdate(
        employer.pwdSupport,
        updates.pwdSupport,
        { session }
      );
    }
    if (updates.jobPosting) {
      await JobPosting.findByIdAndUpdate(
        employer.jobPosting,
        updates.jobPosting,
        { session }
      );
    }

    // Update main employer document
    const updatedEmployer = await Employer.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, session }
    ).populate('user companyInfo contactPerson jobPosting pwdSupport');

    await logActivity(
      req.user?._id, 
      id, 
      'update', 
      'Updated employer information', 
      req,
      session
    );

    await session.commitTransaction();
    res.status(200).json(formatResponse(updatedEmployer, 'Employer updated successfully'));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * Delete employer with cleanup
 */
export const deleteEmployer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new EmployerError('Invalid employer ID', 400);
    }

    const employer = await Employer.findById(id);
    if (!employer) {
      throw new EmployerError('Employer not found', 404);
    }

    // Delete all related documents
    await Promise.all([
      User.deleteOne({ _id: employer.user }, { session }),
      CompanyInfo.deleteOne({ _id: employer.companyInfo }, { session }),
      ContactPerson.deleteOne({ _id: employer.contactPerson }, { session }),
      JobPosting.deleteOne({ _id: employer.jobPosting }, { session }),
      PWDSupport.deleteOne({ _id: employer.pwdSupport }, { session }),
      CompanyUser.deleteMany({ employer: id }, { session }),
      ActivityLog.deleteMany({ employer: id }, { session }),
      Employer.deleteOne({ _id: id }, { session })
    ]);

    await logActivity(
      req.user?._id,
      id,
      'delete',
      'Deleted employer account',
      req,
      session
    );

    await session.commitTransaction();
    res.status(200).json(formatResponse(null, 'Employer deleted successfully'));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Error handler middleware for consistent error responses
export const errorHandler = (err, req, res, next) => {
  const { message, statusCode, errors } = err instanceof EmployerError
    ? err 
    : new EmployerError('Internal Server Error');
  
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
