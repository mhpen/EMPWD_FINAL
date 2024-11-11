import { 
  User, 
  BasicInfo, 
  LocationInfo, 
  DisabilityInfo, 
  WorkPreferences, 
  JobSeeker 
} from '../models/userModel.js';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const createJobSeeker = async (req, res) => {
  try {
    const {
      email, password, confirmPassword, role,
      firstName, lastName, dateOfBirth, gender, age,
      country, city, postal, address,
      disabilityType, disabilityAdditionalInfo,
      preferredJobTitles, industry, employmentType,
      profilePicture
    } = req.body;  // Removed documents from destructuring

    const basicInfo = { firstName, lastName, dateOfBirth, gender, age, profilePicture };
    const locationInfo = { country, city, postal, address };
    const disabilityInfo = { disabilityType: [disabilityType], disabilityAdditionalInfo };
    const workPreferences = { preferredJobTitles: [preferredJobTitles], industry: [industry], employmentType };

    // Function to check for missing required fields
    const checkMissingFields = (obj, requiredFields) => {
      return requiredFields.filter(field => !obj || !obj[field]);
    };

    // Check for missing required fields
    const missingFields = {
      user: checkMissingFields({ email, password }, ['email', 'password']),
      basicInfo: checkMissingFields(basicInfo, ['firstName', 'lastName', 'dateOfBirth', 'gender', 'age']),
      locationInfo: checkMissingFields(locationInfo, ['country', 'city', 'postal', 'address']),
      disabilityInfo: checkMissingFields(disabilityInfo, ['disabilityType']),
      workPreferences: checkMissingFields(workPreferences, ['preferredJobTitles', 'industry'])
    };

    console.log('Missing required fields:', missingFields);

    // If there are any missing fields, return an error
    const allMissingFields = Object.values(missingFields).flat();
    if (allMissingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: allMissingFields
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Process files if they exist
    const uploadedDocuments = [];
    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        const file = files[0];
        const documentType = {
          'resume': 'Resume',
          'pwdId': 'PWD ID',
          'validId': 'Valid ID',
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


    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'jobseeker'
    });

    // Create related documents
    const newBasicInfo = await BasicInfo.create(basicInfo);
    const newLocationInfo = await LocationInfo.create(locationInfo);
    const newDisabilityInfo = await DisabilityInfo.create(disabilityInfo);
    const newWorkPreferences = await WorkPreferences.create(workPreferences);

    // Create JobSeeker document
    let newJobSeeker = await JobSeeker.create({
      user: newUser._id,
      basicInfo: newBasicInfo._id,
      locationInfo: newLocationInfo._id,
      disabilityInfo: newDisabilityInfo._id,
      workPreferences: newWorkPreferences._id,
      documents: uploadedDocuments
    });

    // Populate the response data
    newJobSeeker = await JobSeeker.findById(newJobSeeker._id)
      .populate('user', '-password')
      .populate('basicInfo')
      .populate('locationInfo')
      .populate('disabilityInfo')
      .populate('workPreferences');

    return res.status(201).json({
      message: 'Job seeker profile created successfully',
      data: newJobSeeker
    });

  } catch (err) {
    console.error('Error in createJobSeeker:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(err.errors).map(error => ({
          field: error.path,
          message: error.message,
          value: error.value
        }))
      });
    }

    return res.status(500).json({ 
      error: 'Failed to create job seeker profile',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
// Other controller methods remain the same...eeker by ID
export const getJobSeekerById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const jobSeeker = await JobSeeker.findById(userId)
      .populate('user')
      .populate('basicInfo')
      .populate('locationInfo')
      .populate('disabilityInfo')
      .populate('workPreferences')
      .populate('additionalInfo');

    if (!jobSeeker) {
      return res.status(404).json({ error: 'JobSeeker not found' });
    }

    res.status(200).json(jobSeeker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a job seeker by ID
export const updateJobSeeker = async (req, res) => {
  try {
    const { basicInfo, locationInfo, disabilityInfo, workPreferences, additionalInfo, password } = req.body;

    const jobSeeker = await JobSeeker.findById(req.params.id);

    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job Seeker not found' });
    }

    // Update User password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(jobSeeker.user, { password: hashedPassword });
    }

    // Update nested documents
    if (basicInfo) await BasicInfo.findByIdAndUpdate(jobSeeker.basicInfo, basicInfo, { new: true });
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

    // Delete User, BasicInfo, and other nested documents
    await User.findByIdAndDelete(jobSeeker.user);
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
