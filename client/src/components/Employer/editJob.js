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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const educationLevels = ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];

  useEffect(() => {
    if (location.state?.jobData) {
      setFormData(location.state.jobData);
    } else {
      fetchJobData();
    }
  }, [jobId, location.state]);

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
        throw new Error(`Failed to fetch job details: ${response.statusText}`);
      }

      const responseData = await response.json();
      if (responseData.success) {
        setFormData(responseData.data);
      } else {
        throw new Error(responseData.error || 'Failed to fetch job details');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to fetch job details'
      });
      console.error('Error fetching job:', error);
    }
  };

  const handleEdit = (field, value) => {
    setEditingField(field);
    setTempValue(Array.isArray(value) ? value.join(', ') : value);
  };

  const handleSave = async (field) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let newValue = tempValue;

      // Handle array fields
      if (field === 'keySkills' || field === 'benefits' || field === 'accessibilityFeatures') {
        newValue = tempValue.split(',').map(item => item.trim()).filter(Boolean);
      }

      // Format date for applicationDeadline
      if (field === 'applicationDeadline') {
        newValue = new Date(tempValue).toISOString();
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobId}/update`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: newValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update job');
      }

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          [field]: newValue
        }));
        setNotification({
          type: 'success',
          message: 'Field updated successfully'
        });
      } else {
        throw new Error(data.error || 'Failed to update field');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to update field'
      });
      console.error('Error updating job:', error);
    } finally {
      setIsSubmitting(false);
      setEditingField(null);
      setTempValue('');
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Return loading state if formData is not yet fetched
  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            ) : type === 'select' ? (
              <select
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border rounded p-2"
                disabled={isSubmitting}
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
                value={tempValue.split('T')[0]}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border rounded p-2"
                disabled={isSubmitting}
              />
            ) : (
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full border rounded p-2"
                disabled={isSubmitting}
              />
            )}
            <button
              onClick={() => handleSave(field)}
              className="p-2 text-green-600 hover:text-green-800"
              disabled={isSubmitting}
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:text-red-800"
              disabled={isSubmitting}
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
        </div>wa
      </div>
    </div>
  );
};

export default EditJob;