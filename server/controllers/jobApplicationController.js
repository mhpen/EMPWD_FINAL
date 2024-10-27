// controllers/applicationController.js
import Application from '../models/jobApplicationModel.js';
import JobSeeker from '../models/userModel.js';
import Job from '../models/job.js';

export const submitApplication = async (req, res) => {
  const { jobId, jobseekerId, basicInfo, workHistory, jobPreferences, documents } = req.body;

  if (!jobId || !jobseekerId || !basicInfo || !workHistory || !jobPreferences || !documents) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Create a new application
    const newApplication = new Application({
      jobId,
      jobseekerId,
      basicInfo,
      workHistory,
      jobPreferences,
      documents,
    });

    // Save the application to the database
    await newApplication.save();

    return res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while submitting the application.' });
  }
};