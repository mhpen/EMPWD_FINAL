import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import NavEmRegister from "../ui/navEmRegister";
import SuccessModal from '../ui/SuccessModal';
import TermsModal from '../ui/TermsModal'; // Import the TermsModal

const steps = [
  { id: 1, title: 'Account Info' },
  { id: 2, title: 'Company Info' },
  { id: 3, title: 'Contact Info' },
  { id: 4, title: 'Accessibility Info' },
  { id: 5, title: 'Confirmation' }
];

const EmployerRegistrationForm = () => {
  const [formData, setFormData] = useState({  
    email: '',
    password: '',
    confirmPassword: '',
    companyInfo: {
      companyName: '',
      industry: [],
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
      departments: [],
      documents:[],
    },
    contactPerson: {
      fullName: '',
      position: '',
      phoneNumber: '',
      email: '',
      alternativePhoneNumber: '',
      linkedIn: '',
      department: []
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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'Others'
  ];
  // Department options
const departmentOptions = [
  'Human Resources (HR)',
  'Recruitment or Talent Acquisition',
  'Hiring Managers',
  'Training and Development',
  'Finance',
  'Legal/Compliance',
  'IT Department',
  'Marketing',
  'Operations',
  'Diversity and Inclusion',
  'Others'
];

// Accessibility features options
const accessibilityFeaturesOptions = [
  'Wheelchair Access',
  'Sign Language Interpretation',
  'Assistive Technology',
  'Accessible Restrooms',
  'Braille Signage',
  'Others'
];

  // States for custom industry 
  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');


// States for custom department 
const [isOtherDepartment, setIsOtherDepartment] = useState(false);
const [otherDepartment, setOtherDepartment] = useState('');


// States for custom accessibility feature
const [isOtherAccessibilityFeature, setIsOtherAccessibilityFeature] = useState(false);
const [otherAccessibilityFeature, setOtherAccessibilityFeature] = useState('');
  

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
  // Handle adding industry
const handleAddIndustry = (e) => {
  const selectedIndustry = e.target.value;

  if (selectedIndustry === 'Others') {
    setIsOtherIndustry(true); // Show input for custom industry
  } else if (selectedIndustry && !formData.companyInfo.industry.includes(selectedIndustry)) {
    setFormData((prevData) => ({
      ...prevData,
      companyInfo: {
        ...prevData.companyInfo,
        industry: [...prevData.companyInfo.industry, selectedIndustry],
      },
    }));
  }

  // Reset the select input after adding an industry
  e.target.value = '';
};

// Handle adding custom industry
const handleAddOtherIndustry = () => {
  if (otherIndustry.trim() && !formData.companyInfo.industry.includes(otherIndustry.trim())) {
    setFormData((prevData) => ({
      ...prevData,
      companyInfo: {
        ...prevData.companyInfo,
        industry: [...prevData.companyInfo.industry, otherIndustry.trim()],
      },
    }));
    setOtherIndustry(''); // Clear the custom input field
    setIsOtherIndustry(false); // Hide the custom input
  }
};

// Handle removing industry
const handleRemoveIndustry = (industryToRemove) => {
  setFormData((prevData) => ({
    ...prevData,
    companyInfo: {
      ...prevData.companyInfo,
      industry: prevData.companyInfo.industry.filter((industry) => industry !== industryToRemove),
    },
  }));
};
// Handle adding department
const handleAddDepartment = (e) => {
  const selectedDepartment = e.target.value;

  if (selectedDepartment === 'Others') {
    setIsOtherDepartment(true); // Show input for custom department
  } else if (selectedDepartment && !formData.contactPerson.department.includes(selectedDepartment)) {
    setFormData((prevData) => ({
      ...prevData,
      contactPerson: {
        ...prevData.contactPerson,
        department: [...prevData.contactPerson.department, selectedDepartment],
      },
    }));
  }

  // Reset the select input after adding a department
  e.target.value = '';
};

// Handle adding custom department
const handleAddOtherDepartment = () => {
  if (otherDepartment.trim() && !formData.contactPerson.department.includes(otherDepartment.trim())) {
    setFormData((prevData) => ({
      ...prevData,
      contactPerson: {
        ...prevData.contactPerson,
        department: [...prevData.contactPerson.department, otherDepartment.trim()],
      },
    }));
    setOtherDepartment(''); // Clear the custom input field
    setIsOtherDepartment(false); // Hide the custom input
  }
};

// Handle removing department
const handleRemoveDepartment = (departmentToRemove) => {
  setFormData((prevData) => ({
    ...prevData,
    contactPerson: {
      ...prevData.contactPerson,
      department: prevData.contactPerson.department.filter((department) => department !== departmentToRemove),
    },
  }));
};
// Handle adding accessibility feature
const handleAddAccessibilityFeature = (e) => {
  const selectedFeature = e.target.value;

  if (selectedFeature === 'Others') {
    setIsOtherAccessibilityFeature(true); // Show input for custom accessibility feature
  } else if (selectedFeature && !formData.pwdSupport.accessibilityFeatures.includes(selectedFeature)) {
    setFormData((prevData) => ({
      ...prevData,
      pwdSupport: {
        ...prevData.pwdSupport,
        accessibilityFeatures: [...prevData.pwdSupport.accessibilityFeatures, selectedFeature],
      },
    }));
  }

  // Reset the select input after adding an accessibility feature
  e.target.value = '';
};

// Handle adding custom accessibility feature
const handleAddOtherAccessibilityFeature = () => {
  if (otherAccessibilityFeature.trim() && !formData.pwdSupport.accessibilityFeatures.includes(otherAccessibilityFeature.trim())) {
    setFormData((prevData) => ({
      ...prevData,
      pwdSupport: {
        ...prevData.pwdSupport,
        accessibilityFeatures: [...prevData.pwdSupport.accessibilityFeatures, otherAccessibilityFeature.trim()],
      },
    }));
    setOtherAccessibilityFeature(''); // Clear the custom input field
    setIsOtherAccessibilityFeature(false); // Hide the custom input
  }
};

// Handle removing accessibility feature
const handleRemoveAccessibilityFeature = (featureToRemove) => {
  setFormData((prevData) => ({
    ...prevData,
    pwdSupport: {
      ...prevData.pwdSupport,
      accessibilityFeatures: prevData.pwdSupport.accessibilityFeatures.filter((feature) => feature !== featureToRemove),
    },
  }));
};

const documentTypes = ['Company Permit', 'Tax ID', 'Certificate of Incorporation', 'Other'];

const handleDocumentTypeChange = (index, value) => {
  const updatedDocuments = [...formData.companyInfo.documents];
  updatedDocuments[index] = {
    ...updatedDocuments[index],
    documentType: value,
  };
  setFormData({
    ...formData,
    companyInfo: {
      ...formData.companyInfo,
      documents: updatedDocuments
    }
  });
};

const handleFileChange = (index, file) => {
  const updatedDocuments = [...formData.companyInfo.documents];
  updatedDocuments[index] = {
    ...updatedDocuments[index],
    fileName: file.name,
    data: file,  // Store the file object; backend can handle conversion to Buffer
    contentType: file.type
  };
  setFormData({
    ...formData,
    companyInfo: {
      ...formData.companyInfo,
      documents: updatedDocuments
    }
  });
};

const addDocument = () => {
  setFormData({
    ...formData,
    companyInfo: {
      ...formData.companyInfo,
      documents: [...formData.companyInfo.documents, { documentType: '', fileName: '', data: null, contentType: '' }]
    }
  });
};

const removeDocument = (index) => {
  const updatedDocuments = formData.companyInfo.documents.filter((_, i) => i !== index);
  setFormData({
    ...formData,
    companyInfo: {
      ...formData.companyInfo,
      documents: updatedDocuments
    }
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
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    if (!acceptTerms && currentStep === 4) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        terms: 'You must accept the terms and conditions',
      }));
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Registration failed');
      // Show success modal
      setIsModalOpen(true);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optionally, redirect or reset the form
  };


  return (
    <div className="mx-auto p-4">
      <NavEmRegister steps={steps} currentStep={currentStep} />
      <Card className=" max-w-2xl mx-auto border-0 bg-none">
        <CardHeader>
          <CardTitle className="font-poppins text-center">Employer Registration - Step {currentStep} of 4</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500"
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
                  <label className="block mb-2 font-poppins text-[15px]">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyInfo.companyName}
                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-2 font-poppins text-[15px]">Industry</label>
                  <select
                    name="industry"
                    onChange={handleAddIndustry}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                    defaultValue=""
                  >
                    <option value="" disabled>Select industry that applies</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {isOtherIndustry && (
                    <div className="space-y-2 mt-4">
                      <input
                        type="text"
                        value={otherIndustry}
                        onChange={(e) => setOtherIndustry(e.target.value)}
                        placeholder="Enter your industry"
                        className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                      />
                      <button
                        type="button"
                        onClick={handleAddOtherIndustry}
                        className="px-4 py-2 bg-black text-white rounded font-poppins"
                      >
                        Add Industry
                      </button>
                    </div>
                  )}
                  <div className="space-y-2 mt-4 mb-2">
                    {Array.isArray(formData.companyInfo.industry) && formData.companyInfo.industry.length > 0 && (
                      <>
                        <h3 className="text-lg font-bold">Selected Industries:</h3>
                        <ul>
                          {formData.companyInfo.industry.map((industry, index) => (
                            <li key={index} className="flex justify-between items-center pl-8 pr-2">
                              <span>{industry}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveIndustry(industry)}
                                className="text-black hover:text-red-700"
                              >
                                <i className="fas fa-trash"></i> {/* Trashcan icon */}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>     
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">Company Description</label>
                  <input
                    type="text"
                    name="companyDescription"
                    value={formData.companyInfo.companyDescription}
                    onChange={(e) => handleInputChange(e, 'companyInfo')} // Corrected this line
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">Company Size</label>
                  <select
                    name="companySize"
                    value={formData.companyInfo.companySize}
                    onChange={(e) => handleInputChange(e, 'companyInfo')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
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
                  <label className="block mb-2 font-poppins text-[15px]">Company Address</label>
                  <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.companyInfo.companyAddress.street}
                    onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                   <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.companyInfo.companyAddress.city}
                    onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                    <input
                      type="text"
                      name="province"
                      placeholder="Province"
                      value={formData.companyInfo.companyAddress.province}
                      onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                      className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.companyInfo.companyAddress.country}
                      onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                      className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal or Zip Code"
                      value={formData.companyInfo.companyAddress.postalCode}
                      onChange={(e) => handleInputChange(e, 'companyInfo', 'companyAddress')}
                      className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                    />
                  </div>
                </div>
              </div>
            )}

{currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.contactPerson.fullName}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                  {errors.fullName && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.fullName}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.contactPerson.position}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                  {errors.position && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.position}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.contactPerson.phoneNumber}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                  {errors.phoneNumber && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.phoneNumber}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.contactPerson.email}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                  {errors.email && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">
                    linkedIn
                  </label>
                  <input
                    type="tel"
                    name="linkedIn"
                    value={formData.contactPerson.linkedIn}
                    onChange={(e) => handleInputChange(e, 'contactPerson')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                  {errors.linkedIn && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.linkedIn}</AlertDescription>
                    </Alert>
                  )}
                </div>
                  <div className="mb-2">
                    <label className="block mb-2 font-poppins text-[15px]">Department</label>
                    <select
                      name="department"
                      onChange={handleAddDepartment}
                      className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                      defaultValue=""
                    >
                      <option value="" disabled>Select department that applies</option>
                      {departmentOptions.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                    {isOtherDepartment && (
                      <div className="space-y-2 mt-4">
                        <input
                          type="text"
                          value={otherDepartment}
                          onChange={(e) => setOtherDepartment(e.target.value)}
                          placeholder="Enter your department"
                          className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                        />
                        <button
                          type="button"
                          onClick={handleAddOtherDepartment}
                          className="px-4 py-2 bg-black text-white rounded font-poppins"
                        >
                          Add Department
                        </button>
                      </div>
                    )}
                    <div className="space-y-2 mt-4 mb-2">
                      {Array.isArray(formData.contactPerson.department) && formData.contactPerson.department.length > 0 && (
                        <>
                          <h3 className="text-lg font-bold">Selected Departments:</h3>
                          <ul>
                            {formData.contactPerson.department.map((department, index) => (
                              <li key={index} className="flex justify-between items-center pl-8 pr-2">
                                <span>{department}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDepartment(department)}
                                  className="text-black hover:text-red-700"
                                >
                                  <i className="fas fa-trash"></i> {/* Trashcan icon */}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
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
                <div className="mb-2">
                  <label className="block mb-2 font-poppins text-[15px]">Accessibility Features</label>
                  <select
                    name="accessibilityFeatures"
                    onChange={handleAddAccessibilityFeature}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                    defaultValue=""
                  >
                    <option value="" disabled>Select accessibility feature that applies</option>
                    {accessibilityFeaturesOptions.map((feature) => (
                      <option key={feature} value={feature}>
                        {feature}
                      </option>
                    ))}
                  </select>
                  {isOtherAccessibilityFeature && (
                    <div className="space-y-2 mt-4">
                      <input
                        type="text"
                        value={otherAccessibilityFeature}
                        onChange={(e) => setOtherAccessibilityFeature(e.target.value)}
                        placeholder="Enter your accessibility feature"
                        className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                      />
                      <button
                        type="button"
                        onClick={handleAddOtherAccessibilityFeature}
                        className="px-4 py-2 bg-black text-white rounded font-poppins"
                      >
                        Add Accessibility Feature
                      </button>
                    </div>
                  )}
                  <div className="space-y-2 mt-4 mb-2">
                    {Array.isArray(formData.pwdSupport.accessibilityFeatures) && formData.pwdSupport.accessibilityFeatures.length > 0 && (
                      <>
                        <h3 className="text-lg font-bold">Selected Accessibility Features:</h3>
                        <ul>
                          {formData.pwdSupport.accessibilityFeatures.map((feature, index) => (
                            <li key={index} className="flex justify-between items-center pl-8 pr-2">
                              <span>{feature}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAccessibilityFeature(feature)}
                                className="text-black hover:text-red-700"
                              >
                                <i className="fas fa-trash"></i> {/* Trashcan icon */}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="remoteWorkOptions"
                    checked={formData.pwdSupport.remoteWorkOptions}
                    onChange={(e) => handleInputChange(e, 'pwdSupport')}
                    className="h-4 w-4"
                  />
                  <label className="block mb-2 font-poppins text-[15px]">Remote Work Options Available</label>
                </div>
                <div>
                  <label className="block mb-2 font-poppins text-[15px]">Support Programs</label>
                  <textarea
                    name="supportPrograms"
                    value={formData.pwdSupport.supportPrograms}
                    onChange={(e) => handleInputChange(e, 'pwdSupport')}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                    rows="3"
                  />
                </div>
                <div className="form-group mt-4">
                  <label>Company Documents</label>
                  {formData.companyInfo.documents.map((document, index) => (
                    <div key={index} className="document-entry border p-4 mt-2">
                      <label htmlFor={`DocumentType-${index}`}>Select Document Type</label>
                      <select
                        id={`DocumentType-${index}`}
                        value={document.documentType}
                        onChange={(e) => handleDocumentTypeChange(index, e.target.value)}
                        className="border rounded p-2 w-full"
                      >
                        <option value="" disabled>Select a Document Type</option>
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>

                      {document.documentType && (
                        <div className="mt-2">
                          <label htmlFor={`companyDocument-${index}`}>Upload {document.documentType}</label>
                          <input
                            type="file"
                            id={`companyDocument-${index}`}
                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                            className="border p-2 w-full"
                          />
                        </div>
                      )}

                      <button 
                        type="button" 
                        onClick={() => removeDocument(index)} 
                        className="mt-2 text-red-500"
                      >
                        Remove Document
                      </button>
                    </div>
                  ))}

                  <button type="button" onClick={addDocument} className="mt-4 p-2 bg-black text-white rounded ml-2">
                    Add Another Document
                  </button>
                  
                </div>
                <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4"
                />
                <label className="block mb-2 font-poppins text-[15px]">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-blue-600 underline"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {errors.terms && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.terms}</AlertDescription>
                </Alert>
              )}

                            
              </div>
            )}

          </form>
        </CardContent>
        <CardFooter className="flex justify-end  mt-8 mx-auto max-w-2xl">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="w-24 px-4 py-2 text-sm font-medium text-gray-700 bg-white border  border-black rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mr-4 font-poppins"
            >
              Back
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-24 max-w-xs  px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins"
          >
            {currentStep === 4 ? (isSubmitting ? 'Registering...' : 'Register') : 'Next'}
          </button>
        </CardFooter>
      </Card>
      <SuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <SuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </div>
  );
};

export default EmployerRegistrationForm;