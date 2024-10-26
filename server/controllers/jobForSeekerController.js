import Job from '../models/Job.js';
import JobApplication from '../models/jobApplicationModel.js';
import { JobSeeker } from '../models/userModel.js'; // Ensure this is correctly imported

// View all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};

// View a specific job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching job' });
  }
};

// Apply to a job
export const applyForJob = async (req, res) => {
  try {
    const jobSeekerId = req.user.id; // Assuming user ID is attached to req by authMiddleware
    const { jobId } = req.params;

    const application = new JobApplication({
      jobSeeker: jobSeekerId,
      job: jobId,
      ...req.body // additional application details from the request body
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting application' });
  }
};

// View all applications for the job seeker
export const getJobSeekerApplications = async (req, res) => {
  try {
    const jobSeekerId = req.user.id;
    const applications = await JobApplication.find({ jobSeeker: jobSeekerId }).populate('job');
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// Update application status (e.g., withdraw application)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // New status in the request body

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();
    res.status(200).json({ message: 'Application status updated', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating application status' });
  }
};

// Save a job
export const saveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const jobSeekerId = req.user.id;

    const jobSeeker = await JobSeeker.findById(jobSeekerId);
    if (!jobSeeker) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    if (jobSeeker.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    jobSeeker.savedJobs.push(jobId);
    await jobSeeker.save();
    res.status(200).json({ message: 'Job saved successfully', savedJobs: jobSeeker.savedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving job' });
  }
};

// Unsave a job
export const unsaveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const jobSeekerId = req.user.id;

    const jobSeeker = await JobSeeker.findById(jobSeekerId);
    if (!jobSeeker) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    const jobIndex = jobSeeker.savedJobs.indexOf(jobId);
    if (jobIndex === -1) {
      return res.status(400).json({ message: 'Job not found in saved list' });
    }

    jobSeeker.savedJobs.splice(jobIndex, 1);
    await jobSeeker.save();
    res.status(200).json({ message: 'Job unsaved successfully', savedJobs: jobSeeker.savedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error unsaving job' });
  }
};
