import { 
    JobSeeker, 
    BasicInfo, 
    LocationInfo, 
    DisabilityInfo, 
    WorkPreferences, 
    JobSeekerAdditionalInfo 
  } from '../models/userModel.js';
  
  class SeekerProfile {
    async getUserProfile(req, res) {
      try {
        const userId = req.headers['x-user-id'];
        console.log('Received request for user ID:', userId); // Add logging
  
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'User ID is required'
          });
        }
        // Find the basic info first to verify user exists
        const basicInfo = await BasicInfo.findById(userId);
        if (!basicInfo) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
  
        // Find the job seeker profile with all referenced documents
        const jobSeeker = await JobSeeker.findOne({ basicInfo: userId })
          .populate('basicInfo')
          .populate('locationInfo')
          .populate('disabilityInfo')
          .populate('wor  kPreferences')
          .populate('additionalInfo');
  
        if (!jobSeeker) {
          return res.status(404).json({
            success: false,
            message: 'Job seeker profile not found'
          });
        }
  
        // Structure the response to match the front-end expectations
        const response = {
          basicInfo: {
            firstName: jobSeeker.basicInfo.firstName,
            lastName: jobSeeker.basicInfo.lastName,
            email: jobSeeker.basicInfo.email,
            role: jobSeeker.basicInfo.role
          },
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
            type: jobSeeker.disabilityInfo.type,
            additionalInfo: jobSeeker.disabilityInfo.additionalInfo
          } : null,
          additionalInfo: jobSeeker.additionalInfo ? {
            profilePicture: jobSeeker.additionalInfo.profilePicture,
            resumeUrl: jobSeeker.additionalInfo.resumeUrl
          } : null
        };
  
        return res.status(200).json(response);
    } catch (error) {
        console.error('Detailed error in getUserProfile:', error); // Enhanced error logging
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  
  
    async updateUserProfile(req, res) {
      try {
        const userId = req.headers['x-user-id'];
        const updateData = req.body;
  
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'User ID is required'
          });
        }
  
        // Update each section independently
        const updates = {};
  
        if (updateData.basicInfo) {
          updates.basicInfo = await BasicInfo.findByIdAndUpdate(
            userId,
            updateData.basicInfo,
            { new: true, runValidators: true }
          );
        }
  
        // Find or create and update other sections
        if (updateData.locationInfo) {
          const jobSeeker = await JobSeeker.findOne({ basicInfo: userId });
          if (jobSeeker.locationInfo) {
            updates.locationInfo = await LocationInfo.findByIdAndUpdate(
              jobSeeker.locationInfo,
              updateData.locationInfo,
              { new: true, runValidators: true }
            );
          } else {
            const newLocationInfo = await LocationInfo.create(updateData.locationInfo);
            await JobSeeker.findOneAndUpdate(
              { basicInfo: userId },
              { locationInfo: newLocationInfo._id }
            );
            updates.locationInfo = newLocationInfo;
          }
        }
  
        // Similar pattern for other sections
        if (updateData.workPreferences) {
          const jobSeeker = await JobSeeker.findOne({ basicInfo: userId });
          if (jobSeeker.workPreferences) {
            updates.workPreferences = await WorkPreferences.findByIdAndUpdate(
              jobSeeker.workPreferences,
              updateData.workPreferences,
              { new: true, runValidators: true }
            );
          } else {
            const newWorkPreferences = await WorkPreferences.create(updateData.workPreferences);
            await JobSeeker.findOneAndUpdate(
              { basicInfo: userId },
              { workPreferences: newWorkPreferences._id }
            );
            updates.workPreferences = newWorkPreferences;
          }
        }
  
        const updatedProfile = await JobSeeker.findOne({ basicInfo: userId })
          .populate('basicInfo')
          .populate('locationInfo')
          .populate('disabilityInfo')
          .populate('workPreferences')
          .populate('additionalInfo');
  
        return res.status(200).json({
          success: true,
          data: updatedProfile
        });
      } catch (error) {
        console.error('Error in updateUserProfile:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
        });
      }
    }
  }
  
  export default new SeekerProfile();