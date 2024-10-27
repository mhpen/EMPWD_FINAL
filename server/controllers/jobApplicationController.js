// controllers/jobApplicationController.js
import Application from '../models/jobApplicationModel.js';
import Job from '../models/job.js';
import mongoose from 'mongoose';

// Submit new application
export const submitApplication = async (req, res) => {
  try {
    const userId = req.user._id;  // Assuming this comes from your auth middleware
    
    const newApplication = new Application({
      jobseeker: userId, // This will reference the JobSeeker document
      jobId: req.body.jobId,
      basicInfo: req.body.basicInfo,
      workHistory: req.body.workHistory,
      jobPreferences: req.body.jobPreferences,
      documents: req.body.documents
    });

    const savedApplication = await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: savedApplication
    });
  } catch (error) {
    console.error('Error in submitApplication:', error);
    
    // Handle duplicate application error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};


// Get applications for authenticated job seeker
export const getJobSeekerApplications = async (req, res) => {
    try {
        const applications = await Application.find({ 
            jobseekerId: req.jobseeker._id 
        })
        .populate('jobId', 'title company location')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });

    } catch (error) {
        console.error('Error in getJobSeekerApplications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications'
        });
    }
};

// Get applications for a specific job (for employers)
export const getJobApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const applications = await Application.find({ jobseeker: userId })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error in getApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};