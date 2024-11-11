import { 
  JobSeeker, 
  User, 
  BasicInfo, 
  LocationInfo, 
  DisabilityInfo, 
  WorkPreferences, 
  Employer,
  CompanyInfo
} from '../models/userModel.js';
import Application from '../models/jobApplicationModel.js';
import Job from '../models/job.js';

class SeekerProfile {
  constructor() {
    this.getUserProfile = this.getUserProfile.bind(this);
    this.formatProfileResponse = this.formatProfileResponse.bind(this);
    this.getApplicationDetails = this.getApplicationDetails.bind(this);
    this.getAllApplications = this.getAllApplications.bind(this);
  }

  async getUserProfile(req, res) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - User ID not found'
        });
      }

      if (req.user.role !== 'jobseeker') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Only job seekers can access this profile'
        });
      }

      if (req.user.profile) {
        const response = this.formatProfileResponse(req.user.profile);
        return res.status(200).json(response);
      }

      const jobSeeker = await JobSeeker.findOne({ user: userId })
        .populate('user')
        .populate('basicInfo')
        .populate('locationInfo')
        .populate('disabilityInfo')
        .populate('workPreferences')
        .populate('additionalInfo');

      if (!jobSeeker) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      const response = this.formatProfileResponse(jobSeeker);
      return res.status(200).json(response);

    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getAllApplications(req, res) {
    try {
      const userId = req.user?._id;
  
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - User ID not found'
        });
      }
  
      // Fetch all applications for the job seeker
      const applications = await Application.find({ jobseeker: userId })
        .populate({
          path: 'jobId',
          select: 'jobTitle jobLocation employmentType salaryMin salaryMax jobStatus employersId',
          populate: {
            path: 'employersId',
            select: 'companyInfo',
            select: 'companyInfo.companyName companyInfo.companyLogo'
          }
        })
        .sort({ createdAt: -1 });
  
      console.log('Applications:', JSON.stringify(applications, null, 2));
  
      return res.status(200).json({
        success: true,
        applications,
      });
  
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  }
  async getApplicationDetails(req, res) {
    try {
      const { applicationId } = req.params;
      const userId = req.user?._id;

      // Fetch the specific application by ID
      const application = await Application.findOne({ _id: applicationId, jobseeker: userId })
        .populate({
          path: 'jobId',
          select: 'jobTitle jobDescription jobLocation industry employmentType applicationDeadline keySkills otherSkills educationLevel yearsOfExperience salaryMin salaryMax benefits additionalPerks accessibilityFeatures specialAccommodations jobStatus employersId',
          populate: {
            path: 'employersId',
            select: 'companyInfo contactPerson',
            populate: [
              {
                path: 'companyInfo',
                select: 'companyName industry companySize website companyAddress companyDescription establishmentDate companyLogo'
              },
              {
                path: 'contactPerson',
                select: 'fullName position phoneNumber email'
              }
            ]
          }
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found or access denied'
        });
      }

      return res.status(200).json({
        success: true,
        application,
      });

    } catch (error) {
      console.error('Error in getApplicationDetails:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  formatProfileResponse(jobSeeker) {
    return {
      success: true,
      user: jobSeeker.user ? {
        email: jobSeeker.user.email,
      } : null,
      basicInfo: jobSeeker.basicInfo ? {
        firstName: jobSeeker.basicInfo.firstName,
        lastName: jobSeeker.basicInfo.lastName,
        gender: jobSeeker.basicInfo.gender
      } : null,
      locationInfo: jobSeeker.locationInfo ? {
        country: jobSeeker.locationInfo.country,
        city: jobSeeker.locationInfo.city,
        postal: jobSeeker.locationInfo.postal,
        address: jobSeeker.locationInfo.address
      } : null,
      workPreferences: jobSeeker.workPreferences ? {
        preferredJobTitles: jobSeeker.workPreferences.preferredJobTitles,
        industry: jobSeeker.workPreferences.industry,
        employmentType: jobSeeker.workPreferences.employmentType
      } : null,
      disabilityInfo: jobSeeker.disabilityInfo ? {
        disabilityType: jobSeeker.disabilityInfo.disabilityType,
        disabilityAdditionalInfo: jobSeeker.disabilityInfo.disabilityAdditionalInfo
      } : null,
      additionalInfo: jobSeeker.additionalInfo ? {
        profilePicture: jobSeeker.additionalInfo.profilePicture,
        resumeUrl: jobSeeker.additionalInfo.resumeUrl
      } : null
    };
  }
}

// Create and export a single instance
const seekerProfile = new SeekerProfile();

export default seekerProfile;