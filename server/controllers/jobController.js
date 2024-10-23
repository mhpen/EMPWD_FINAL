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

// Enhanced get all jobs with filtering, sorting, and pagination
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
      status,
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
    if (status) filter.status = status;
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
        status,
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

// Delete job posting
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
};

export const getJobPostingById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobPosting = await Job.findById(id);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.status(200).json({ success: true, data: jobPosting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};