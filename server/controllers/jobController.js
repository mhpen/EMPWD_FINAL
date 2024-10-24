import Job from '../models/job.js';

// Helper function to validate eployers ownership
const validateEmployerOwnership = async (jobId, employersId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error('Job not found');
  }
  // Fix: Convert both IDs to strings for comparison
  if (job.employersId.toString() !== employersId.toString()) {
    throw new Error('Unauthorized: Job does not belong to this employer');
  }
  return job;
};
export const getJobs = async (req, res) => {
  try {
    // Destructure query parameters with defaults
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      jobTitle = '',
      location = '',
      industry = '',
      employmentType = '',
      salaryMin,
      salaryMax,
      jobStatus, // Change from `status` to `jobStatus` for consistency
      category
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Title search
    if (jobTitle) {
      filter.jobTitle = { $regex: jobTitle, $options: 'i' };
    }
    
    // Location search
    if (location) {
      filter.jobLocation = { $regex: location, $options: 'i' };
    }

    // Industry filter
    if (industry) {
      filter.industry = industry;
    }

    // Employment type filter
    if (employmentType) {
      filter.employmentType = employmentType;
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      filter.salaryMax = filter.salaryMax || {};
      filter.salaryMin = filter.salaryMin || {};

      if (salaryMin) {
        filter.salaryMax.$gte = Number(salaryMin);
      }
      if (salaryMax) {
        filter.salaryMin.$lte = Number(salaryMax);
      }
    }

    // Other filters
    if (jobStatus) filter.jobStatus = jobStatus;
    if (category) filter.category = category;

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with filters, sorting, and pagination
    const jobs = await Job.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    // Get unique values for dropdowns
    const uniqueIndustries = await Job.distinct('industry');
    const uniqueEmploymentTypes = await Job.distinct('employmentType');
    const salaryStats = await Job.aggregate([
      {
        $group: {
          _id: null,
          minSalary: { $min: '$salaryMin' },
          maxSalary: { $max: '$salaryMax' }
        }
      }
    ]);

    // Return response
    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRecords: total,
        recordsPerPage: parseInt(limit)
      },
      filters: {
        jobTitle,
        location,
        industry,
        employmentType,
        salaryMin,
        salaryMax,
        jobStatus, // Changed from `status`
        category
      },
      filterOptions: {
        industries: uniqueIndustries,
        employmentTypes: uniqueEmploymentTypes,
        salaryRange: salaryStats[0] || { minSalary: 0, maxSalary: 0 }
      },
      sorting: {
        sortBy,
        order
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
// Create a new job posting
export const createJob = async (req, res) => {
  const { employersId, ...jobDetails } = req.body;

  // Ensure employerId matches authenticated user
  if (!employersId || employersId !== req.userId) {
    return res.status(403).json({ message: 'Unauthorized: Invalid employer ID' });
  }

  const jobData = {
    ...jobDetails,
    employersId,
    jobStatus: req.body.jobStatus || 'pending',
    isStarred: req.body.isStarred || false
  };

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
export const  updateJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employersId = req.user.employerId;
    const updateData = req.body;

    if (!validateObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format'
      });
    }

    // Ensure employer owns the job
    const job = await Job.findOne({ _id: jobId, employersId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or unauthorized'
      });
    }

    // Validate salary if being updated
    if (updateData.salaryMin && updateData.salaryMax) {
      if (updateData.salaryMin > updateData.salaryMax) {
        return res.status(400).json({
          success: false,
          message: 'Minimum salary cannot be greater than maximum salary'
        });
      }
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });

  } catch (error) {
    console.error('Error in updateJob:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
}


export const updateIsStarred = async (req, res) => {
  try {
    // Add logging to debug authorization issues
    console.log('User ID:', req.userId);
    console.log('Job ID:', req.params.id);

    await validateEmployerOwnership(req.params.id, req.userId);

    const { isStarred } = req.body;

    if (typeof isStarred !== 'boolean') {
      return res.status(400).json({ message: 'isStarred must be a boolean value' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { isStarred },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Job isStarred status updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error in updateIsStarred:', error); // Add detailed error logging
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error updating isStarred status', error: error.message });
    }
  }
};

// Get jobs for specific employer
export const getEmployerJobs = async (req, res) => {
  try {
    const { employersId } = req.params;

    // Ensure the requesting user is the employer
    if (employersId !== req.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Cannot access other employers\' jobs'
      });
    }

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      jobTitle = '',
      jobStatus
    } = req.query;

    // Build filter object
    const filter = { employersId: employersId };
    
    if (jobTitle) {
      filter.jobTitle = { $regex: jobTitle, $options: 'i' };
    }
    
    if (jobStatus && jobStatus !== 'All') {
      filter.jobStatus = jobStatus;
    }

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

      

    // Get total count
    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRecords: total,
        recordsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
  
};

export const deleteMultipleJobs = async (req, res) => {
  const { jobIds, employerId } = req.body;

  try {
    // Validate that all jobs belong to the employer
    if (!jobIds || jobIds.length === 0) {
      return res.status(400).json({ message: 'No job IDs provided' });
    }

    // Ensure employerId matches authenticated user
    if (employerId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized: Cannot delete other employers\' jobs' });
    }

    // Find jobs that belong to the employer
    const jobs = await Job.find({
      _id: { $in: jobIds },
      employersId: employerId
    });

    if (jobs.length !== jobIds.length) {
      return res.status(403).json({ 
        message: 'Unauthorized: Some jobs do not belong to this employer' 
      });
    }

    // Delete the jobs
    const result = await Job.deleteMany({
      _id: { $in: jobIds },
      employersId: employerId
    });

    res.status(200).json({
      message: `${result.deletedCount} job(s) deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting jobs', error });
  }
};

export const deleteJob = async (req, res) => {
  try {
    // Fix: Changed req.userid to req.userId
    await validateEmployerOwnership(req.params.id, req.userId);

    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error deleting job', error });
    }
  }
};

export const getJobPostingById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // If the job is not public, verify employer ownership
    if (job.jobStatus !== 'Open') {
      if (job.employersId.toString() !== req.userId) {
        return res.status(403).json({ 
          message: 'Unauthorized: Cannot view this job posting' 
        });
      }
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

