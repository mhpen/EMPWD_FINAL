import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavSeeker from '../ui/navSeeker';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state || {};

  const [profileData, setProfileData] = useState({
    basicInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      location: ''
    },
    jobPreferences: {
      desiredPosition: '',
      preferredStartDate: '',
      availability: ''
    },
    workHistory: {
      previousJobTitle: '',
      companyName: '',
      duration: '',
      keyResponsibility: ''
    },
    documents: {
      resumeUrl: '',
      coverLetterUrl: ''
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) {
      setErrorMessage('Missing job ID');
    }
  }, [id]);

  const handleChange = (section, field, value) => {
    setProfileData(prevData => ({
      ...prevData,
      [section]: { ...prevData[section], [field]: value }
    }));
  };

  const validateForm = () => {
    const errors = [];
    const { basicInfo } = profileData;

    if (!basicInfo.firstName?.trim()) errors.push('First name is required');
    if (!basicInfo.lastName?.trim()) errors.push('Last name is required');
    if (!basicInfo.email?.trim()) errors.push('Email is required');
    if (!basicInfo.phoneNumber?.trim()) errors.push('Phone number is required');
    if (!basicInfo.location?.trim()) errors.push('Location is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
  
    try {
      // Retrieve job seeker ID from local storage
      const jobseekerId = localStorage.getItem('userId');
      console.log('JobSeeker ID from localStorage:', jobseekerId); // Debug log
  
      if (!jobseekerId) {
        setErrorMessage('User ID not found. Please log in again.');
        setSubmitting(false);
        return;
      }
  
      // Validate form
      const validation = validateForm();
      if (!validation.isValid) {
        setErrorMessage(validation.errors.join(', '));
        setSubmitting(false);
        return;
      }

      // Prepare application data
      const applicationData = {
        jobId: id,
        jobseekerId,
        basicInfo: {
          firstName: profileData.basicInfo.firstName.trim(),
          lastName: profileData.basicInfo.lastName.trim(),
          email: profileData.basicInfo.email.trim(),
          phoneNumber: profileData.basicInfo.phoneNumber.trim(),
          location: profileData.basicInfo.location.trim(),
        },
        workHistory: {
          previousJobTitle: profileData.workHistory.previousJobTitle?.trim() || '',
          companyName: profileData.workHistory.companyName?.trim() || '',
          duration: profileData.workHistory.duration?.trim() || '',
          keyResponsibility: profileData.workHistory.keyResponsibility?.trim() || '',
        },
        jobPreferences: {
          desiredPosition: profileData.jobPreferences.desiredPosition?.trim() || '',
          preferredStartDate: profileData.jobPreferences.preferredStartDate || null,
          availability: profileData.jobPreferences.availability?.trim() || '',
        },
        documents: {
          resumeUrl: profileData.documents.resumeUrl?.trim() || '',
          coverLetterUrl: profileData.documents.coverLetterUrl?.trim() || '',
        },
      };
  
      // Log the full application data before sending
      console.log('Application Data being sent:', applicationData);
  
      // Make the API call with explicit headers
      const response = await axios.post('/api/applications/submit', applicationData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if you're using one
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        alert('Application submitted successfully!');
        navigate('/applications');
      } else {
        setErrorMessage(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Full submission error:', error.response || error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to submit application';
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" ">
      <NavSeeker />

      <form onSubmit={handleSubmit} className="application-form p-6 max-w-lg mx-auto">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {jobData.jobTitle && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h1 className="text-xl font-semibold mb-2">Applying for: {jobData.jobTitle}</h1>
            <p className="text-gray-600">at {jobData.company}</p>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="mb-6">
          <div className="mb-4">
            <label className="block mb-1">First Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="block w-full p-2 border rounded"
              value={profileData.basicInfo.firstName || ''}
              onChange={(e) => handleChange('basicInfo', 'firstName', e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Last Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="block w-full p-2 border rounded"
              value={profileData.basicInfo.lastName || ''}
              onChange={(e) => handleChange('basicInfo', 'lastName', e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              className="block w-full p-2 border rounded"
              value={profileData.basicInfo.email || ''}
              onChange={(e) => handleChange('basicInfo', 'email', e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Phone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              className="block w-full p-2 border rounded"
              value={profileData.basicInfo.phoneNumber || ''}
              onChange={(e) => handleChange('basicInfo', 'phoneNumber', e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Current Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="block w-full p-2 border rounded"
              value={profileData.basicInfo.location || ''}
              onChange={(e) => handleChange('basicInfo', 'location', e.target.value)}
              required
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Your Job Preferences</h2>
        <div className="mb-6">
          <label>Desired Position</label>
          <input
            type="text"
            className="block w-full p-2 border"
            value={profileData.jobPreferences.desiredPosition || ''}
            onChange={(e) => handleChange('jobPreferences', 'desiredPosition', e.target.value)}
          />
          <label>Preferred Start Date</label>
          <input
            type="date"
            className="block w-full p-2 border"
            value={profileData.jobPreferences.preferredStartDate || ''}
            onChange={(e) => handleChange('jobPreferences', 'preferredStartDate', e.target.value)}
          />
          <label>Availability</label>
          <input
            type="text"
            className="block w-full p-2 border"
            value={profileData.jobPreferences.availability || ''}
            onChange={(e) => handleChange('jobPreferences', 'availability', e.target.value)}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Work History</h2>
        <div className="mb-6">
          <label>Previous Job Title</label>
          <input
            type="text"
            className="block w-full p-2 border"
            value={profileData.workHistory.previousJobTitle || ''}
            onChange={(e) => handleChange('workHistory', 'previousJobTitle', e.target.value)}
          />
          <label>Company Name</label>
          <input
            type="text"
            className="block w-full p-2 border"
            value={profileData.workHistory.companyName || ''}
            onChange={(e) => handleChange('workHistory', 'companyName', e.target.value)}
          />
          <label>Duration</label>
          <input
            type="text"
            className="block w-full p-2 border"
            value={profileData.workHistory.duration || ''}
            onChange={(e) => handleChange('workHistory', 'duration', e.target.value)}
          />
          <label>Key Responsibility</label>
          <input
            type="text"
            className="block w-full p-2 border"
            value={profileData.workHistory.keyResponsibility || ''}
            onChange={(e) => handleChange('workHistory', 'keyResponsibility', e.target.value)}
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Upload Documents</h2>
        <div className="mb-6">
          <label>Resume URL</label>
          <input
            type="url"
            className="block w-full p-2 border"
            value={profileData.documents.resumeUrl || ''}
            onChange={(e) => handleChange('documents', 'resumeUrl', e.target.value)}
          />
          <label>Cover Letter URL</label>
          <input
            type="url"
            className="block w-full p-2 border"
            value={profileData.documents.coverLetterUrl || ''}
            onChange={(e) => handleChange('documents', 'coverLetterUrl', e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded ${submitting ? 'opacity-50' : ''}`}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
