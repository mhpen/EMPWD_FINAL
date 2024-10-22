import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CreateJobPosting = () => {
  const [step, setStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobLocation: 'Remote',
    industry: '',
    employmentType: 'Full-time',
    applicationDeadline: '',
    keySkills: [],
    otherSkills: '',
    educationLevel: '',
    yearsOfExperience: '',
    salaryMin: '',
    salaryMax: '',
    benefits: [],
    additionalPerks: '',
    accessibilityFeatures: [],
    specialAccommodations: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value.split(',').map(item => item.trim()),
    }));
  };
  const handleSubmit = async () => {
    setShowConfirmDialog(false);
  
    // Prepare the data according to the schema
    const jobData = {
      jobTitle: formData.jobTitle,
      jobDescription: formData.jobDescription,
      jobLocation: formData.jobLocation,
      industry: formData.industry,
      employmentType: formData.employmentType,
      applicationDeadline: formData.applicationDeadline,
      keySkills: formData.keySkills, // Already an array, no need for .split
      otherSkills: formData.otherSkills,
      educationLevel: formData.educationLevel,
      yearsOfExperience: formData.yearsOfExperience,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
      benefits: formData.benefits, // Already an array
      additionalPerks: formData.additionalPerks,
      accessibilityFeatures: formData.accessibilityFeatures, // Already an array
      specialAccommodations: formData.specialAccommodations,
    };
  
    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Job posting created successfully!');
        console.log(result);
      } else {
        console.error('Error:', result);
        alert('Failed to create job posting: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the job posting');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Job Details</h2>
            <p className="text-gray-600">Provide the basic information about the job position you're offering.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title/Position</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Location</label>
                <select
                  name="jobLocation"
                  value={formData.jobLocation}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Job Qualifications</h2>
            <p className="text-gray-600">Specify the qualifications and skills required for this position.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Key Skills or Competencies (comma-separated)</label>
                <input
                  type="text"
                  name="keySkills"
                  value={formData.keySkills.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'keySkills')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Other Skills (Please specify)</label>
                <input
                  type="text"
                  name="otherSkills"
                  value={formData.otherSkills}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Required Education Level</label>
                <input
                  type="text"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Salary & Benefits</h2>
            <p className="text-gray-600">Share the salary range and the benefits your company offers for this role.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="Min"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    placeholder="Max"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Benefits (comma-separated)</label>
                <input
                  type="text"
                  name="benefits"
                  value={formData.benefits.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'benefits')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Perks</label>
                <input
                  type="text"
                  name="additionalPerks"
                  value={formData.additionalPerks}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Accessibility and PWD Support</h2>
            <p className="text-gray-600">Highlight the accessibility features and support available for PWD candidates.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Accessibility Features (comma-separated)</label>
                <input
                  type="text"
                  name="accessibilityFeatures"
                  value={formData.accessibilityFeatures.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'accessibilityFeatures')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Any special accommodations or support (optional)</label>
                <textarea
                  name="specialAccommodations"
                  value={formData.specialAccommodations}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="4"
                />
              </div>
            </div>
          </div>

        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Job Posting</h2>
            <p className="text-gray-600">Please review the information you've provided for your job posting.</p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Job Details</h3>
              <p><strong>Title:</strong> {formData.jobTitle}</p>
              <p><strong>Description:</strong> {formData.jobDescription}</p>
              <p><strong>Location:</strong> {formData.jobLocation}</p>
              <p><strong>Industry:</strong> {formData.industry}</p>
              <p><strong>Employment Type:</strong> {formData.employmentType}</p>
              <p><strong>Application Deadline:</strong> {formData.applicationDeadline}</p>
              
              <h3 className="text-xl font-semibold">Qualifications</h3>
              <p><strong>Key Skills:</strong> {formData.keySkills.join(', ')}</p>
              <p><strong>Other Skills:</strong> {formData.otherSkills}</p>
              <p><strong>Education Level:</strong> {formData.educationLevel}</p>
              <p><strong>Years of Experience:</strong> {formData.yearsOfExperience}</p>
              
              <h3 className="text-xl font-semibold">Salary & Benefits</h3>
              <p><strong>Salary Range:</strong> ${formData.salaryMin} - ${formData.salaryMax}</p>
              <p><strong>Benefits:</strong> {formData.benefits.join(', ')}</p>
              <p><strong>Additional Perks:</strong> {formData.additionalPerks}</p>
              
              <h3 className="text-xl font-semibold">Accessibility & PWD Support</h3>
              <p><strong>Accessibility Features:</strong> {formData.accessibilityFeatures.join(', ')}</p>
              <p><strong>Special Accommodations:</strong> {formData.specialAccommodations}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const ConfirmDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
        <p className="mb-6">Are you sure you want to submit this job posting? Please review all the information carefully before confirming.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmDialog(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-8 bg-gray-200 h-16 rounded-lg"></div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {renderStep()}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          )}
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmDialog(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              Submit Job Posting
            </button>
          )}
        </div>
      </form>
      {showConfirmDialog && <ConfirmDialog />}
    </div>
  );
};

export default CreateJobPosting;