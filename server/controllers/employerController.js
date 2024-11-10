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

/**
 * Create new employer with transaction support
 */
export const createEmployer = async (req, res, next) => {
  try {
    const { 
      email, 
      password,
      companyInfo,
      contactPerson,
      pwdSupport
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new EmployerError('Email already registered', 409);
    }

    // Create all documents without transaction
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'employer'
    });

    const newCompanyInfo = await CompanyInfo.create(companyInfo);
    const newContactPerson = await ContactPerson.create(contactPerson);
    const newPwdSupport = await PWDSupport.create(pwdSupport);

    const employer = await Employer.create({
      user: user._id,
      companyInfo: newCompanyInfo._id,
      contactPerson: newContactPerson._id,
      pwdSupport: newPwdSupport._id
    });

    // Create initial company user (owner)
    await CompanyUser.create({
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
      status: 'active'
    });

    await logActivity(user._id, employer._id, 'user_added', 'Created new employer account', req);
    
    res.status(201).json(formatResponse(employer, 'Employer created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update employer with partial updates
 */
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
