import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from "../ui/alert";
import { Calendar, Pencil, Check, X } from "lucide-react";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const educationLevels = ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];

  useEffect(() => {
    // Use the job data passed through navigation state if available
    if (location.state?.jobData) {
      setFormData(location.state.jobData);
    } else {
      // Fallback to fetching data if not available in navigation state
      const fetchJobData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/jobs/${jobId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch job details');
          }

          const responseData = await response.json();
          // Set the nested job data
          setFormData(responseData.data);
        } catch (error) {
          setNotification({ type: 'error', message: 'Failed to fetch job details.' });
          console.error('Error fetching job:', error);
        }
      };

      fetchJobData();
    }
  }, [jobId, location.state]);

  // Return loading state if formData is not yet fetched
  if (!formData) {
    return <div>Loading...</div>;
  }

  const handleEdit = (field, value) => {
    setEditingField(field);
    setTempValue(Array.isArray(value) ? value.join(', ') : value);
  };

  const handleSave = async (field) => {
    try {
      let newValue = tempValue;

      // Handle array fields
      if (field === 'keySkills' || field === 'benefits' || field === 'accessibilityFeatures') {
        newValue = tempValue.split(',').map(item => item.trim());
      }

      // Format date for applicationDeadline
      if (field === 'applicationDeadline') {
        newValue = new Date(tempValue).toISOString();
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      setFormData(prev => ({
        ...prev,
        [field]: newValue
      }));

      setNotification({ type: 'success', message: 'Field updated successfully' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update field' });
      console.error('Error updating job:', error);
    }

    setEditingField(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderField = (label, field, value, type = 'text') => {
    const isEditing = editingField === field;

    return (
      <div className="mb-4 p-4 border rounded">
        <div className="flex justify-between items-start mb-2">
          <label className="font-medium text-gray-700">{label}</label>
          {!isEditing && (
            <button
              onClick={() => handleEdit(field, value)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            {type === 'textarea' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border rounded p-2"
                rows={4}
              />
            ) : type === 'select' ? (
              <select
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border rounded p-2"
              >
                {field === 'employmentType' && employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
                {field === 'educationLevel' && educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
                {field === 'yearsOfExperience' && experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            ) : type === 'date' ? (
              <input
                type="date"
                value={tempValue.split('T')[0]} // Format date for input
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border rounded p-2"
              />
            ) : (
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border rounded p-2"
              />
            )}
            <button
              onClick={() => handleSave(field)}
              className="p-2 text-green-600 hover:text-green-800"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mt-1">
            {Array.isArray(value) ? (
              <div className="flex flex-wrap gap-2">
                {value.map((item, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                    {item}
                  </span>
                ))}
              </div>
            ) : type === 'date' ? (
              <p className="text-gray-800">{formatDate(value)}</p>
            ) : (
              <p className="text-gray-800">{value}</p>
            )}
          </div>
        )}
      </div>
    );
  };

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
          <p className="text-gray-600">Click the edit icon to modify any field</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            {renderField('Job Title', 'jobTitle', formData.jobTitle)}
            {renderField('Job Description', 'jobDescription', formData.jobDescription, 'textarea')}
            {renderField('Location', 'jobLocation', formData.jobLocation)}
            {renderField('Industry', 'industry', formData.industry)}
            {renderField('Employment Type', 'employmentType', formData.employmentType, 'select')}
            {renderField('Application Deadline', 'applicationDeadline', formData.applicationDeadline, 'date')}
          </div>

          {/* Skills and Requirements */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Skills and Requirements</h2>
            {renderField('Key Skills', 'keySkills', formData.keySkills)}
            {renderField('Other Skills', 'otherSkills', formData.otherSkills, 'textarea')}
            {renderField('Education Level', 'educationLevel', formData.educationLevel, 'select')}
            {renderField('Years of Experience', 'yearsOfExperience', formData.yearsOfExperience, 'select')}
          </div>

          {/* Compensation and Benefits */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Compensation and Benefits</h2>
            {renderField('Minimum Salary', 'salaryMin', formData.salaryMin, 'number')}
            {renderField('Maximum Salary', 'salaryMax', formData.salaryMax, 'number')}
            {renderField('Benefits', 'benefits', formData.benefits)}
            {renderField('Additional Perks', 'additionalPerks', formData.additionalPerks, 'textarea')}
          </div>

          {/* Accessibility and Accommodations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Accessibility and Accommodations</h2>
            {renderField('Accessibility Features', 'accessibilityFeatures', formData.accessibilityFeatures)}
            {renderField('Special Accommodations', 'specialAccommodations', formData.specialAccommodations, 'textarea')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;