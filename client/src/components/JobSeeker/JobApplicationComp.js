import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicationForm = () => {
  const [profileData, setProfileData] = useState({
    basicInfo: { fullName: '', email: '', phoneNumber: '', location: '' },
    jobPreferences: { desiredPosition: '', preferredStartDate: '', currentLocation: '', availability: '' },
    workHistory: { previousJobTitle: '', companyName: '', duration: '', keyResponsibility: '' },
    documents: { resumeUrl: '', coverLetterUrl: '' },
  });

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get('/api/seekers/profile', {
        headers: { 'x-user-id': userId },
        withCredentials: true,
      });
      setProfileData((prevData) => ({
        ...prevData,
        ...response.data, // Ensure response data structure matches default profileData structure
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (section, field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], [field]: value },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      await axios.put('/api/seekers/profile', profileData, {
        headers: { 'x-user-id': userId },
        withCredentials: true,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="application-form p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
      <div className="mb-6">
        <label>First Name</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.basicInfo?.firstName || ''}
          onChange={(e) => handleChange('basicInfo', 'fullName', e.target.value)}
        />
         <label>Last Name</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.basicInfo?.lastName || ''}
          onChange={(e) => handleChange('basicInfo', 'fullName', e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          className="block w-full p-2 border"
          value={profileData.basicInfo?.email || ''}
          onChange={(e) => handleChange('basicInfo', 'email', e.target.value)}
        />
        <label>Phone Number</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.basicInfo?.phoneNumber || ''}
          onChange={(e) => handleChange('basicInfo', 'phoneNumber', e.target.value)}
        />
        <label>Current Location</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.basicInfo?.location || ''}
          onChange={(e) => handleChange('basicInfo', 'location', e.target.value)}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Job Preferences</h2>
      <div className="mb-6">
        <label>Desired Position</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.jobPreferences?.desiredPosition || ''}
          onChange={(e) => handleChange('jobPreferences', 'desiredPosition', e.target.value)}
        />
        <label>Preferred Start Date</label>
        <input
          type="date"
          className="block w-full p-2 border"
          value={profileData.jobPreferences?.preferredStartDate || ''}
          onChange={(e) => handleChange('jobPreferences', 'preferredStartDate', e.target.value)}
        />
        <label>Current Location</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.jobPreferences?.currentLocation || ''}
          onChange={(e) => handleChange('jobPreferences', 'currentLocation', e.target.value)}
        />
        <label>Availability</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.jobPreferences?.availability || ''}
          onChange={(e) => handleChange('jobPreferences', 'availability', e.target.value)}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Work History</h2>
      <div className="mb-6">
        <label>Previous Job Title</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.workHistory?.previousJobTitle || ''}
          onChange={(e) => handleChange('workHistory', 'previousJobTitle', e.target.value)}
        />
        <label>Company Name</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.workHistory?.companyName || ''}
          onChange={(e) => handleChange('workHistory', 'companyName', e.target.value)}
        />
        <label>Duration</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.workHistory?.duration || ''}
          onChange={(e) => handleChange('workHistory', 'duration', e.target.value)}
        />
        <label>Key Responsibility</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.workHistory?.keyResponsibility || ''}
          onChange={(e) => handleChange('workHistory', 'keyResponsibility', e.target.value)}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Upload Your Resume & Cover Letter</h2>
      <div className="mb-6">
        <label>Upload Resume</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.documents?.resumeUrl || ''}
          onChange={(e) => handleChange('documents', 'resumeUrl', e.target.value)}
        />
        <label>Upload Cover Letter</label>
        <input
          type="text"
          className="block w-full p-2 border"
          value={profileData.documents?.coverLetterUrl || ''}
          onChange={(e) => handleChange('documents', 'coverLetterUrl', e.target.value)}
        />
      </div>

      <div className="flex justify-between">
        <button type="button" className="p-2 bg-gray-200 rounded">Back</button>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Next</button>
      </div>
    </form>
  );
};

export default ApplicationForm;
