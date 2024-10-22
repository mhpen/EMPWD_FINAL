import { Employer, BasicInfo, LocationInfo, CompanyInfo, ContactPerson, JobPosting, PWDSupport } from '../models/userModel.js'; 
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

// Fetch all employers with related information
export const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find()
      .populate('basicInfo')
      .populate('locationInfo')
      .populate('companyInfo')
      .populate('contactPerson')
      .populate('jobPosting')
      .populate('pwdSupport');
    
    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch a single employer by ID
export const getEmployerById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const employer = await Employer.findById(id)
      .populate('basicInfo')
      .populate('locationInfo')
      .populate('companyInfo')
      .populate('contactPerson')
      .populate('jobPosting')
      .populate('pwdSupport');
    
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new employer
export const createEmployer = async (req, res) => {
  const { basicInfo, locationInfo, companyInfo, contactPerson, jobPosting, pwdSupport } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(basicInfo.password, 10);

    // Create the BasicInfo document with hashed password
    const newBasicInfo = new BasicInfo({
      ...basicInfo,
      password: hashedPassword,
    });
    const savedBasicInfo = await newBasicInfo.save();

    // Save other related documents
    const newLocationInfo = new LocationInfo(locationInfo);
    const savedLocationInfo = await newLocationInfo.save();

    const newCompanyInfo = new CompanyInfo(companyInfo);
    const savedCompanyInfo = await newCompanyInfo.save();

    const newContactPerson = new ContactPerson(contactPerson);
    const savedContactPerson = await newContactPerson.save();

    const newJobPosting = new JobPosting(jobPosting);
    const savedJobPosting = await newJobPosting.save();

    const newPWDSupport = new PWDSupport(pwdSupport);
    const savedPWDSupport = await newPWDSupport.save();

    // Create employer document with references to saved documents
    const newEmployer = new Employer({
      basicInfo: savedBasicInfo._id,
      locationInfo: savedLocationInfo._id,
      companyInfo: savedCompanyInfo._id,
      contactPerson: savedContactPerson._id,
      jobPosting: savedJobPosting._id,
      pwdSupport: savedPWDSupport._id
    });
    
    const savedEmployer = await newEmployer.save();
    res.status(201).json(savedEmployer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employer information
export const updateEmployer = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    if (updates.basicInfo && updates.basicInfo.password) {
      // Hash the new password if provided
      updates.basicInfo.password = await bcrypt.hash(updates.basicInfo.password, 10);
    }

    const updatedEmployer = await Employer.findByIdAndUpdate(id, updates, { new: true })
      .populate('basicInfo')
      .populate('locationInfo')
      .populate('companyInfo')
      .populate('contactPerson')
      .populate('jobPosting')
      .populate('pwdSupport');
    
    if (!updatedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.status(200).json(updatedEmployer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an employer
export const deleteEmployer = async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedEmployer = await Employer.findByIdAndDelete(id);
    
    if (!deletedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.status(200).json({ message: 'Employer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};