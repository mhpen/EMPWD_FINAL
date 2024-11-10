import { 
  User, 
  BasicInfo, 
  LocationInfo, 
  DisabilityInfo, 
  WorkPreferences, 
  JobSeekerAdditionalInfo, 
  JobSeeker 
} from '../models/userModel.js';
import bcrypt from 'bcrypt';

// Create a new job seeker
export const createJobSeeker = async (req, res) => {
  try {
    const { basicInfo, locationInfo, disabilityInfo, workPreferences, additionalInfo, email, password, role } = req.body;

    // Validate required fields
    if (!basicInfo || !locationInfo || !email || !password) {
      return res.status(400).json({ error: 'Basic info, location info, email, and password are required' });
    }

    // Hash the password and create User document
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = await User.create({
      email,
      password: hashedPassword,
      role: role || 'jobseeker'
    });

    // Create BasicInfo document and other nested documents
    const newBasicInfo = await BasicInfo.create(basicInfo);
    const newLocationInfo = await LocationInfo.create(locationInfo);
    const newDisabilityInfo = disabilityInfo ? await DisabilityInfo.create(disabilityInfo) : null;
    const newWorkPreferences = workPreferences ? await WorkPreferences.create(workPreferences) : null;
    const newAdditionalInfo = additionalInfo ? await JobSeekerAdditionalInfo.create(additionalInfo) : null;

    // Create JobSeeker document with references to the nested documents and User
    const newJobSeeker = await JobSeeker.create({
      user: newUser ._id,
      basicInfo: newBasicInfo._id,
      locationInfo: newLocationInfo._id,
      disabilityInfo: newDisabilityInfo ? newDisabilityInfo._id : null,
      workPreferences: newWorkPreferences ? newWorkPreferences._id : null,
      additionalInfo: newAdditionalInfo ? newAdditionalInfo._id : null
    });

    res.status(201).json(newJobSeeker);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a job seeker by ID
export const getJobSeekerById = async (req, res) => {
  try {
    //const userId = req.headers['x-user-id'];
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
