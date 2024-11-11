import { User, JobSeeker, Employer, Admin, CompanyUser, ActivityLog } from '../models/userModel.js';

// Helper function to verify admin access
const verifyAdminAccess = async (req) => {
  // Get user ID from authenticated session
  const userId = req.user?._id; // Assuming you set req.user in your auth middleware
  if (!userId) {
    throw new Error('Unauthorized - No user ID found');
  }


  // Verify user is admin
  const admin = await User.findOne({ _id: userId, role: 'admin' });
  if (!admin) {
    throw new Error('Forbidden - Admin access required');
  }
  return true;
};

export const userController = {
  // Get all users with pagination and filtering
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;

      // Fetch user without password field
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let detailedUserData = user.toObject();

      // Populate additional details based on user role
      if (user.role === 'jobseeker') {
        const jobSeekerData = await JobSeeker.findOne({ user: userId })
          .populate('basicInfo')
          .populate('locationInfo')
          .populate('disabilityInfo')
          .populate('workPreferences')
          .select('+documents'); // Include the documents array

        if (jobSeekerData) {
          detailedUserData = {
            ...detailedUserData,
            jobSeekerData: jobSeekerData.toObject(),
          };
        }
      } else if (user.role === 'employer') {
        const employerData = await Employer.findOne({ user: userId })
          .populate('companyInfo')
          .populate('contactPerson')
          .populate('pwdSupport')
          .select('+documents'); // Include the documents array

        if (employerData) {
          detailedUserData = {
            ...detailedUserData,
            employerData: employerData.toObject(),
          };
        }
      } else if (user.role === 'admin') {
        const adminData = await Admin.findOne({ user: userId });
        if (adminData) {
          detailedUserData = {
            ...detailedUserData,
            adminData: adminData.toObject(),
          };
        }
      }

      res.status(200).json(detailedUserData);
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({
        message: 'Error retrieving user data',
        error: error.message,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Verify admin access first
      await verifyAdminAccess(req);

      const { 
        page = 1, 
        limit = 10, 
        role, 
        search, 
        verified,
        sortBy = 'createdAt',
        order = 'desc' 
      } = req.query;

      // Build filter object
      const filter = {};
      if (role && role !== 'undefined' && role !== 'all') {
        filter.role = role;
      }
      if (verified !== 'undefined' && verified !== null) {
        filter.isVerified = verified === 'true';
      }
      if (search) {
        filter.$or = [
          { email: { $regex: search, $options: 'i' } },
          { 'profile.basicInfo.name': { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build sort object
      const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

      // Fetch users with pagination
      const users = await User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password');

      const total = await User.countDocuments(filter);

      // Fetch additional profile data based on user roles
      const enhancedUsers = await Promise.all(users.map(async (user) => {
        let profile;
        if (user.role === 'jobseeker') {
          profile = await JobSeeker.findOne({ user: user._id })
            .populate('basicInfo');
        } else if (user.role === 'employer') {
          profile = await Employer.findOne({ user: user._id })
            .populate('companyInfo');
        }
        return {
          ...user.toObject(),
          profile: profile ? profile.toObject() : null
        };
      }));

      res.status(200).json({
        users: enhancedUsers,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          perPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      if (error.message.includes('Unauthorized')) {
        return res.status(401).json({ 
          message: error.message 
        });
      }
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ 
          message: error.message 
        });
      }
      res.status(500).json({ 
        message: 'Error fetching users',
        error: error.message 
      });
    }
  },

  // Get detailed user information
  getUserDetails: async (req, res) => {
    try {
      // Verify admin access first
      await verifyAdminAccess(req);

      const { userId } = req.params;

      // Fetch user without password
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Fetch role-specific profile data
      let profile = null;
      let additionalData = {};

      if (user.role === 'jobseeker') {
        profile = await JobSeeker.findOne({ user: userId })
          .populate('basicInfo')
          .populate('education')
          .populate('experience')
          .populate('skills');
          
        // Get application statistics
        const applicationStats = await ApplicationLog.aggregate([
          { $match: { userId: user._id } },
          { 
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        
        additionalData.applicationStats = applicationStats;
      } 
      else if (user.role === 'employer') {
        profile = await Employer.findOne({ user: userId })
          .populate('companyInfo')
          .populate('team');
          
        // Get job posting statistics
        const jobStats = await JobPosting.aggregate([
          { $match: { employer: user._id } },
          { 
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        
        additionalData.jobStats = jobStats;
      }

      // Get recent activity logs
      const recentActivity = await ActivityLog.find({ user: userId })
        .sort({ timestamp: -1 })
        .limit(10);

      // Get account statistics
      const accountStats = {
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        lastUpdated: user.updatedAt,
        verificationStatus: user.isVerified,
        loginCount: user.loginCount || 0
      };

      res.status(200).json({
        user: {
          ...user.toObject(),
          profile: profile ? profile.toObject() : null,
          accountStats,
          recentActivity,
          ...additionalData
        }
      });
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      if (error.message.includes('Unauthorized')) {
        return res.status(401).json({ 
          message: error.message 
        });
      }
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ 
          message: error.message 
        });
      }
      res.status(500).json({ 
        message: 'Error fetching user details',
        error: error.message 
      });
    }
  },

  // Update user verification status
  updateVerificationStatus: async (req, res) => {
    try {
      // Verify admin access first
      await verifyAdminAccess(req);
  
      const { userId } = req.params;
      const { isVerified } = req.body;
  
      console.log(`Updating user ${userId} with verification status: ${isVerified}`);
  
      const user = await User.findByIdAndUpdate(
        userId,
        { isVerified },
        { new: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Log the activity with required fields
      
  
      console.log('Updated user:', user);
  
      res.status(200).json({ 
        message: 'User verification status updated successfully',
        user 
      });
    } catch (error) {
      console.error('Error in updateVerificationStatus:', error);
      if (error.message.includes('Unauthorized')) {
        return res.status(401).json({ 
          message: error.message 
        });
      }
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ 
          message: error.message 
        });
      }
      res.status(500).json({ 
        message: 'Error updating user verification status',
        error: error.message 
      });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      // Verify admin access first
      await verifyAdminAccess(req);

      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete associated profile based on role
      if (user.role === 'jobseeker') {
        await JobSeeker.findOneAndDelete({ user: userId });
      } else if (user.role === 'employer') {
        await Employer.findOneAndDelete({ user: userId });
      }

      // Delete the user
      await User.findByIdAndDelete(userId);

      res.status(200).json({ 
        message: 'User deleted successfully' 
      });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      if (error.message.includes('Unauthorized')) {
        return res.status(401).json({ 
          message: error.message 
        });
      }
      if (error.message.includes('Forbidden')) {
        return res.status(403).json({ 
          message: error.message 
        });
      }
      res.status(500).json({ 
        message: 'Error deleting user',
        error: error.message 
      });
    }
  }
};