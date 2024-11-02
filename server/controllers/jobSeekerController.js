import { 
   BasicInfo, 
   LocationInfo, 
   DisabilityInfo, 
   WorkPreferences, 
   JobSeekerAdditionalInfo, 
   JobSeeker 
} from '../models/userModel.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

// Create a new job seeker
export const createJobSeeker = async (req, res) => {
   try {
     const { basicInfo, locationInfo, disabilityInfo, workPreferences, additionalInfo, role } = req.body;

      // Hash the password before saving BasicInfo
      const hashedPassword = await bcrypt.hash(basicInfo.password, 10); // 10 is the salt rounds

      // Replace the plain password with the hashed password
      const newBasicInfo = await BasicInfo.create({
         ...basicInfo,
         password: hashedPassword, // Store hashed password
         role: role || 'jobseeker'
      });
 
      //const newBasicInfo = await BasicInfo.create(basicInfo);
      const newLocationInfo = await LocationInfo.create(locationInfo);
      const newDisabilityInfo = await DisabilityInfo.create(disabilityInfo);
      const newWorkPreferences = await WorkPreferences.create(workPreferences);
      const newAdditionalInfo = await JobSeekerAdditionalInfo.create(additionalInfo);
 
      const newJobSeeker = await JobSeeker.create({
         basicInfo: newBasicInfo._id,
         locationInfo: newLocationInfo._id,
         disabilityInfo: newDisabilityInfo._id,
         workPreferences: newWorkPreferences._id,
         additionalInfo: newAdditionalInfo._id
      });
   
      res.status(201).json(newJobSeeker);
   } catch (err) {
      res.status(400).json({ error: err.message });
     
   }
};
 
// Get a job seeker by ID
export const getJobSeekerById = async (req, res) => {
   try {
      const userId = req.user._id

      const jobSeeker = await BasicInfo.findById(userId)
         .populate('BasicInfo')

         const res =  {
            firstName: jobSeeker.basicInfo.firstName,
            lastName: jobSeeker.basicInfo.lastName
         };
  
     if (!jobSeeker) {
         return res.status(404).json({ error: 'Job Seeker not found' });
      }
 
     res.status(200).json(jobSeeker);
   } catch (err) {
     res.status(400).json({ error: err.message });
   }
};
 
// Update a job seeker by ID
export const updateJobSeeker = async (req, res) => {
   try {
     const { basicInfo, locationInfo, disabilityInfo, workPreferences, additionalInfo } = req.body;
 
     const jobSeeker = await JobSeeker.findById(req.params.id);
 
     if (!jobSeeker) {
         return res.status(404).json({ error: 'Job Seeker not found' });
      }
 
     // Update nested documents
     //if (basicInfo) await BasicInfo.findByIdAndUpdate(jobSeeker.basicInfo, basicInfo, { new: true });
   if (basicInfo) {
      if (basicInfo.password) {
        basicInfo.password = await bcrypt.hash(basicInfo.password, 10); // Hash new password
      }
      await BasicInfo.findByIdAndUpdate(jobSeeker.basicInfo, basicInfo, { new: true });
   }


     if (locationInfo) await LocationInfo.findByIdAndUpdate(jobSeeker.locationInfo, locationInfo, { new: true });
     if (disabilityInfo) await DisabilityInfo.findByIdAndUpdate(jobSeeker.disabilityInfo, disabilityInfo, { new: true });
     if (workPreferences) await WorkPreferences.findByIdAndUpdate(jobSeeker.workPreferences, workPreferences, { new: true });
     if (additionalInfo) await JobSeekerAdditionalInfo.findByIdAndUpdate(jobSeeker.additionalInfo, additionalInfo, { new: true });
 
     res.status(200).json({ message: 'Job Seeker updated successfully' });
   } catch (err) {
     res.status(400).json({ error: err.message });
   }
};
 
// Delete a job seeker by ID
export const deleteJobSeeker = async (req, res) => {
   try {
     const jobSeeker = await JobSeeker.findById(req.params.id);
 
     if (!jobSeeker) {
         return res.status(404).json({ error: 'Job Seeker not found' });
      }
 
     await BasicInfo.findByIdAndDelete(jobSeeker.basicInfo);
     await LocationInfo.findByIdAndDelete(jobSeeker.locationInfo);
     await DisabilityInfo.findByIdAndDelete(jobSeeker.disabilityInfo);
     await WorkPreferences.findByIdAndDelete(jobSeeker.workPreferences);
     await JobSeekerAdditionalInfo.findByIdAndDelete(jobSeeker.additionalInfo);
     await JobSeeker.findByIdAndDelete(req.params.id);
 
     res.status(200).json({ message: 'Job Seeker deleted successfully' });
   } catch (err) {
     res.status(400).json({ error: err.message });
   }
};

// Alternatively, you could use a single export statement at the end:
/*
export {
   createJobSeeker,
   getJobSeekerById,
   updateJobSeeker,
   deleteJobSeeker
};
*/