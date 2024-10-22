import Job from '../models/job.js';

// Create a new job posting
export const createJob = async (req, res) => {
  const jobData = req.body;

  try {
    const newJob = new Job(jobData);
    await newJob.save();
    res.status(201).json({ message: 'Job posting created successfully!', job: newJob });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create job posting', error });
  }
};


// Update job posting
export const updateJobPosting = async (req, res) => {
  try {
    const updatedJobPosting = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        applicationDeadline: req.body.applicationDeadline ? new Date(req.body.applicationDeadline) : undefined
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedJobPosting) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedJobPosting,
      message: 'Job posting updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getAllJobPostings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobPostings = await Job.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments();

    res.status(200).json({
      success: true,
      data: jobPostings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        recordsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get job posting by ID
export const getJobPostingById = async (req, res) => {
  try {
    const jobPosting = await Job.findById(req.params.id);
    
    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: jobPosting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete job posting
export const deleteJobPosting = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        error: 'Job posting not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
