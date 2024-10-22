import React, { useState } from 'react';
import axios from 'axios';

const CreateEmployer = () => {
  const [employerData, setEmployerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    city: '',
    postal: '',
    address: '',
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    fullName: '',
    phoneNumber: '',
    jobTitle: '',
    linkedIn: '',
    jobTitles: [''], // Initialize with one empty string
    employmentType: '',
    locations: [''], // Initialize with one empty string
    accessibilityFeatures: '',
    remoteWorkOptions: false,
    supportPrograms: '',
    additionalInfo: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployerData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleJobTitlesChange = (index, value) => {
    const newJobTitles = [...employerData.jobTitles];
    newJobTitles[index] = value;
    setEmployerData({ ...employerData, jobTitles: newJobTitles });
  };

  const addJobTitle = () => {
    setEmployerData((prevData) => ({
      ...prevData,
      jobTitles: [...prevData.jobTitles, '']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/employers', {
        basicInfo: {
          firstName: employerData.firstName,
          lastName: employerData.lastName,
          email: employerData.email,
          password: employerData.password
        },
        locationInfo: {
          country: employerData.country,
          city: employerData.city,
          postal: employerData.postal,
          address: employerData.address
        },
        companyInfo: {
          companyName: employerData.companyName,
          industry: employerData.industry,
          companySize: employerData.companySize,
          website: employerData.website
        },
        contactPerson: {
          fullName: employerData.fullName,
          phoneNumber: employerData.phoneNumber,
          jobTitle: employerData.jobTitle,
          linkedIn: employerData.linkedIn
        },
        jobPosting: {
          jobTitles: employerData.jobTitles,
          employmentType: employerData.employmentType,
          locations: employerData.locations
        },
        pwdSupport: {
          accessibilityFeatures: employerData.accessibilityFeatures,
          remoteWorkOptions: employerData.remoteWorkOptions,
          supportPrograms: employerData.supportPrograms,
          additionalInfo: employerData.additionalInfo
        }
      });
      console.log(response.data);
      alert('Employer created successfully!');
    } catch (error) {
      console.error('Error creating employer', error);
      alert('Failed to create employer');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Create New Employer</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={employerData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={employerData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={employerData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={employerData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Location Info */}
        <div className="mb-4">
          <label className="block text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={employerData.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={employerData.city}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Postal Code</label>
          <input
            type="text"
            name="postal"
            value={employerData.postal}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={employerData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Company Info */}
        <div className="mb-4">
          <label className="block text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={employerData.companyName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Industry</label>
          <input
            type="text"
            name="industry"
            value={employerData.industry}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Contact Person */}
        <div className="mb-4">
          <label className="block text-gray-700">Contact Full Name</label>
          <input
            type="text"
            name="fullName"
            value={employerData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Job Titles */}
        <div className="mb-4">
          <label className="block text-gray-700">Job Titles</label>
          {employerData.jobTitles.map((jobTitle, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => handleJobTitlesChange(index, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addJobTitle} className="text-blue-500 hover:underline">
            Add Another Job Title
          </button>
        </div>

        {/* PWD Support */}
        <div className="mb-4">
          <label className="block text-gray-700">Accessibility Features</label>
          <input
            type="text"
            name="accessibilityFeatures"
            value={employerData.accessibilityFeatures}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Remote Work Options</label>
          <input
            type="checkbox"
            name="remoteWorkOptions"
            checked={employerData.remoteWorkOptions}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Enable</span>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
          >
            Create Employer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployer;
