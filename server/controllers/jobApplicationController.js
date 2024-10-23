import JobApplication from '../models/jobApplicationModel.js';
import JobSeeker from '../models/userModel.js';


// Create a new job application based on JobSeeker ID
const createJobApplication = async (req, res) => {
    try {
        const { _id, phoneNumber, jobPreferences, workHistory, resume, applicationStatus } = req.body;

        //  Find the JobSeeker by ID
        //  const jobSeeker = await JobSeeker.findById(_id);
        //  if (!jobSeeker) {
        //      return res.status(404).json({ message: 'JobSeeker not found' });
            
        //  }
        const jobSeeker = '67175d4de5d5b20edc5b1622'
        console.log(jobSeeker);

        // Create a new JobApplication instance
        const newApplication = new JobApplication({
            personalInformation: {
                jobSeeker: jobSeeker._id, // Reference the JobSeeker's ObjectId
                phoneNumber: phoneNumber, // Include the phone number in personal information
            },
            jobPreferences,
            workHistory,
            resume,
            applicationStatus: applicationStatus || 'pending', // Default to 'pending' if not provided
        });

        // Save the new application
        await newApplication.save();

        // Populate the JobSeeker field after saving
        const populatedApplication = await JobApplication.findById(newApplication._id)
            .populate('personalInformation.jobSeeker');

        res.status(201).json({
            message: 'Job Application created successfully',
            data: populatedApplication, // Return the populated data with JobSeeker info
        });
    } catch (error) {
        console.error('Error creating job application:', error);
        res.status(500).json({ message: 'Error creating job application', error });
    }
};



// Fetch all job applications
const getAllJobApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find().populate('personalInformation.jobSeeker');
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({ message: 'Error fetching job applications', error });
    }
};

// Fetch a specific job application by ID
const getJobApplicationById = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await JobApplication.findById(applicationId).populate('personalInformation.jobSeeker');
        if (!application) {
            return res.status(404).json({ message: 'Job Application not found' });
        }
        res.status(200).json(application);
    } catch (error) {
        console.error('Error fetching job application by ID:', error);
        res.status(500).json({ message: 'Error fetching job application', error });
    }
};

// Update a specific job application
const updateJobApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const updatedApplication = await JobApplication.findByIdAndUpdate(applicationId, req.body, { new: true })
            .populate('personalInformation.jobSeeker');
        if (!updatedApplication) {
            return res.status(404).json({ message: 'Job Application not found' });
        }
        res.status(200).json({
            message: 'Job Application updated successfully',
            data: updatedApplication,
        });
    } catch (error) {
        console.error('Error updating job application:', error);
        res.status(500).json({ message: 'Error updating job application', error });
    }
};

// Delete a specific job application
const deleteJobApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const deletedApplication = await JobApplication.findByIdAndDelete(applicationId);
        if (!deletedApplication) {
            return res.status(404).json({ message: 'Job Application not found' });
        }
        res.status(200).json({
            message: 'Job Application deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting job application:', error);
        res.status(500).json({ message: 'Error deleting job application', error });
    }
};

export {
   createJobApplication,
   getAllJobApplications,
   getJobApplicationById,
   updateJobApplication,
   deleteJobApplication
};