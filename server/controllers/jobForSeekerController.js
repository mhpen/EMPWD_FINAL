import Job from '../models/Job.js';

// Get all approved jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ jobStatus: 'pending' })
      .populate('employersId', 'companyName email')  // Only populate necessary employer fields
      .sort({ createdAt: -1 });  // Newest jobs first
    
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get single job details
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({ 
      _id: jobId,
      jobStatus: 'approved'  // Only show approved jobs
    }).populate('employersId', 'companyName email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching job details',
      error: error.message
    });
  }
};