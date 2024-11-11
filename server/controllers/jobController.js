import mongoose from 'mongoose';
import Job from '../models/job.js'; // Adjust the path as needed

// Helper function to validate ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new job posting
export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      jobLocation,
      industry,
      employmentType,
      applicationDeadline,
      keySkills,
      otherSkills,
      educationLevel,
      yearsOfExperience,
      salaryMin,
      salaryMax,
      benefits,
      additionalPerks,
      accessibilityFeatures,
      specialAccommodations,
    } = req.body;

    const newJob = new Job({
      employersId: req.user._id,
      jobTitle,
      jobDescription,
      jobLocation,
      industry,
      employmentType,
      applicationDeadline,
      keySkills,
      otherSkills,
      educationLevel,
      yearsOfExperience,
      salaryMin,
      salaryMax,
      benefits,
      additionalPerks,
      accessibilityFeatures,
      specialAccommodations,
      jobStatus: 'Open',
    });

    await newJob.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob,
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!validateObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message,
    }); 
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!validateObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const updates = req.body;
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.employersId.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this job',
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message,
    });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    if (!validateObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.employersId.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this job',
      });
    }

    job.jobStatus = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job status updated successfully',
      data: job,
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job status',
      error: error.message,
    });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      industry,
      employmentType,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { jobStatus: 'Open' };

    if (keyword) {
      query.$or = [
        { jobTitle: { $regex: keyword, $options: 'i' } },
        { jobDescription: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.jobLocation = { $regex: location, $options: 'i' };
    }

    if (industry) {
      query.industry = industry;
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message,
    });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!validateObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.employersId.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view these applications',
      });
    }

    const applications = await Application.find({ jobId })
      .populate('applicantId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const employerId = req.params.employerId;

    // Verify the requesting user matches the employerId
    if (req.user._id.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to employer jobs',
      });
    }

    const query = { employersId: employerId };
    
    if (status && status !== 'All') {
      query.jobStatus = status;
    }
    
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { jobDescription: { $regex: search, $options: 'i' } },
        { jobLocation: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Job.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: jobs,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      totalCount: count,
    });
  } catch (error) {
    console.error('Get employer jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      jobTitle = '',
    } = req.query;

    const query = {
      jobStatus: 'Open',
      jobTitle: { $regex: jobTitle, $options: 'i' },
    };

    const jobs = await Job.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      totalCount: count,
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!validateObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify ownership
    if (job.employersId.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this job',
      });
    }
    
    // else if (req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
    // }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message,
    });
  }
};

export const deleteMultipleJobs = async (req, res) => {
  try {
    const { jobIds, employerId } = req.body;

    // Verify the requesting user matches the employerId
    if (req.user._id.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete these jobs'
      });
    }

    // Convert string IDs to ObjectIds
    const objectIds = jobIds.map(id => new mongoose.Types.ObjectId(id));

    // Delete jobs that belong to this employer
    const result = await Job.deleteMany({
      _id: { $in: objectIds },
      employersId: new mongoose.Types.ObjectId(employerId)
    });

    return res.status(200).json({
      success: true,
      message: 'Jobs deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete multiple jobs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting jobs',
      error: error.message
    });
  }
};
export const updateJobStarStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { isStarred } = req.body;

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Verify the requesting user owns this job
    if (job.employersId.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this job'
      });
    }

    job.isStarred = isStarred;
    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job star status updated successfully',
      data: job
    });

  } catch (error) {
    console.error('Update star status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating job star status',
      error: error.message
    });
  }
};
