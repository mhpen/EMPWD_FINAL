import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertDescription } from "../ui/alert";
import { Calendar } from "lucide-react";

const EditJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();  // Change from 'id' to 'jobId'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobLocation: '',
    industry: '',
    employmentType: '',
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
    specialAccommodations: '',
    jobStatus: 'pending',
    isStarred: false
  });

  // Predefined options for select fields
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
  const educationLevels = ['High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'];
  const experienceLevels = ['Entry Level', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
  const commonBenefits = ['Health Insurance', 'Dental Insurance', 'Vision Insurance', 'Life Insurance', '401(k)', 'Paid Time Off', 'Remote Work'];
  const accessibilityOptions = ['Wheelchair Accessible', 'Flexible Hours', 'Screen Reader Support', 'Sign Language', 'Other'];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const jobData = await response.json();
        console.log('Fetched Job Data:', jobData); // Debug log
  
        // Add safe date formatting with validation
        let formattedDate = '';
        if (jobData.applicationDeadline) {
          const date = new Date(jobData.applicationDeadline);
          if (date instanceof Date && !isNaN(date)) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }
  
        setFormData({
          jobTitle: jobData.jobTitle || '',
          jobDescription: jobData.jobDescription || '',
          jobLocation: jobData.jobLocation || '',
          industry: jobData.industry || '',
          employmentType: jobData.employmentType || '',
          applicationDeadline: formattedDate, // Use the safely formatted date
          keySkills: jobData.keySkills || [],
          otherSkills: jobData.otherSkills || '',
          educationLevel: jobData.educationLevel || '',
          yearsOfExperience: jobData.yearsOfExperience || '',
          salaryMin: jobData.salaryMin || '',
          salaryMax: jobData.salaryMax || '',
          benefits: jobData.benefits || [],
          additionalPerks: jobData.additionalPerks || '',
          accessibilityFeatures: jobData.accessibilityFeatures || [],
          specialAccommodations: jobData.specialAccommodations || '',
          jobStatus: jobData.jobStatus || 'pending',
          isStarred: jobData.isStarred || false,
        });
  
        console.log('Form Data Set:', formData); // Debug log
  
      } catch (err) {
        console.error(err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchJob();
  }, [jobId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      setNotification({
        type: 'success',
        message: 'Job updated successfully'
      });

      // Navigate back after successful update
      setTimeout(() => {
        navigate('/employers/manage-jobs');
      }, 2000);

    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: 'Failed to update job'
      });
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {notification && (
        <Alert className={`mb-4 ${notification.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Job</h1>
          <p className="text-gray-600">Update the job posting details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div>
              <label className="block mb-1">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block mb-1">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Type</option>
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Application Deadline</label>
              <div className="relative">
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2 pr-10"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Skills and Requirements */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills and Requirements</h2>

            <div>
              <label className="block mb-1">Key Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.keySkills.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'keySkills')}
                className="w-full border rounded p-2"
                placeholder="e.g. JavaScript, React, Node.js"
              />
            </div>

            <div>
              <label className="block mb-1">Other Skills</label>
              <textarea
                name="otherSkills"
                value={formData.otherSkills}
                onChange={handleInputChange}
                rows={3}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Education Level</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              >
                <option value="">Select Level</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Years of Experience</label>
              <select
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                required
                className="w-full border rounded p-2"
              >
                <option value="">Select Experience Level</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compensation and Benefits */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Compensation and Benefits</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Salary (Min)</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block mb-1">Salary (Max)</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Benefits</label>
              <select
                multiple
                value={formData.benefits}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions).map(option => option.value);
                  setFormData(prev => ({ ...prev, benefits: options }));
                }}
                className="w-full border rounded p-2"
              >
                {commonBenefits.map(benefit => (
                  <option key={benefit} value={benefit}>{benefit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Additional Perks</label>
              <textarea
                name="additionalPerks"
                value={formData.additionalPerks}
                onChange={handleInputChange}
                rows={3}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* Accessibility and Accommodations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Accessibility and Accommodations</h2>

            <div>
              <label className="block mb-1">Accessibility Features</label>
              <select
                multiple
                value={formData.accessibilityFeatures}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions).map(option => option.value);
                  setFormData(prev => ({ ...prev, accessibilityFeatures: options }));
                }}
                className="w-full border rounded p-2"
              >
                {accessibilityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Special Accommodations</label>
              <textarea
                name="specialAccommodations"
                value={formData.specialAccommodations}
                onChange={handleInputChange}
                rows={3}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
