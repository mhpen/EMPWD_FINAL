import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

const EmployerRegistrationForm = () => {
  const [formData, setFormData] = useState({  
    email: '',
    password: '',
    confirmPassword: '',
    companyInfo: {
      companyName: '',
      industry: '',
      companySize: '',
      website: '',
      companyAddress: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      },
      companyDescription: '',
      establishmentDate: '',
      departments: [''],
    },
    contactPerson: {
      fullName: '',
      position: '',
      phoneNumber: '',
      email: '',
      alternativePhoneNumber: '',
      linkedIn: '',
      department: ''
    },
    pwdSupport: {
      accessibilityFeatures: '',
      remoteWorkOptions: false,
      supportPrograms: '',
      additionalInfo: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const handleInputChange = (e, section, subsection = null) => {
    const { name, value, type, checked } = e.target;
  
    setFormData(prev => {
      if (section) {
        if (subsection) {
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [subsection]: {
                ...prev[section][subsection],
                [name]: type === 'checkbox' ? checked : value
              }
            }
          };
        }
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: type === 'checkbox' ? checked : value
          }
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };
  const handleAddDepartment = () => {
    setFormData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        departments: [...prev.companyInfo.departments, '']
      }
    }));
  };

  const handleDepartmentChange = (index, value) => {
    setFormData(prev => {
      const newDepartments = [...prev.companyInfo.departments];
      newDepartments[index] = value;
      return {
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          departments: newDepartments
        }
      };
    });
  };
  const validateStep = (step) => {
    const newErrors = {};
  
    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.companyInfo.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.companyInfo.industry) newErrors.industry = 'Industry is required';
    } else if (step === 3) {
      if (!formData.contactPerson.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.contactPerson.email) newErrors.contactEmail = 'Contact email is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      // Handle successful registration
      // You might want to redirect or show a success message
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Employer Registration - Step {currentStep} of 4</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.confirmPassword && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.confirmPassword}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyInfo.companyName}
                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.companyInfo.industry}
                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                      <div>
            <label className="block text-sm font-medium mb-1">Company Description</label>
            <input
              type="text"
              name="companyDescription"
              value={formData.companyInfo.companyDescription}
              onChange={(e) => handleInputChange(e, 'companyInfo')} // Corrected this line
              className="w-full p-2 border rounded-md"
            />
          </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Size</label>
                  <select
                    name="companySize"
                    value={formData.companyInfo.companySize}
                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Address</label>
                  
                  <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.companyInfo.companyAddress.street}
                    onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                   <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.companyInfo.companyAddress.city}
                    onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                    <input
                      type="text"
                      name="province"
                      placeholder="Province"
                      value={formData.companyInfo.companyAddress.province}
                      onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.companyInfo.companyAddress.country}
                      onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal or Zip Code"
                      value={formData.companyInfo.companyAddress.postalCode}
                      onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                      className="p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

{currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.contactPerson.fullName}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.fullName && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.fullName}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.contactPerson.position}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.position && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.position}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.contactPerson.phoneNumber}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.phoneNumber && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.phoneNumber}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.contactPerson.email}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    linkedIn
                  </label>
                  <input
                    type="tel"
                    name="linkedIn"
                    value={formData.contactPerson.linkedIn}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.linkedIn && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.linkedIn}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.contactPerson.department}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors.department && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.department}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}

{currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Accessibility Features</label>
                  <textarea
                    name="accessibilityFeatures"
                    value={formData.pwdSupport.accessibilityFeatures}
                    onChange={(e) => handleInputChange(e, 'pwdSupport')}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="remoteWorkOptions"
                    checked={formData.pwdSupport.remoteWorkOptions}
                    onChange={(e) => handleInputChange(e, 'pwdSupport')}
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">Remote Work Options Available</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Support Programs</label>
                  <textarea
                    name="supportPrograms"
                    value={formData.pwdSupport.supportPrograms}
                    onChange={(e) => handleInputChange(e, 'pwdSupport')}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  />
                </div>
              </div>
            )}

          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Back
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {currentStep === 4 ? (isSubmitting ? 'Registering...' : 'Register') : 'Next'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployerRegistrationForm;