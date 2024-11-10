import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import NavRegister from '../ui/navRegister';

const steps = [
  { id: 1, title: 'Account Info' },
  { id: 2, title: 'Basic Info' },
  { id: 3, title: 'Location Info' },
  { id: 4, title: 'Disability Info' },
  { id: 5, title: 'Work Preferences' },
  { id: 6, title: 'Additional Info' },
  { id: 7, title: 'Confirmation' }
];

const CreateJobSeeker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    country: '',
    city: '',
    postal: '',
    address: '',
    disabilityType: [],
    disabilityAdditionalInfo: '',
    preferredJobTitles: [],
    industry: [],
    employmentType: '',
    profilePicture: null,
    resumeUrl: null
  });

  const validateCurrentStep = () => {
    const validations = {
      1: () => formData.email && formData.password && formData.password === formData.confirmPassword,
      2: () => formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender && formData.age,
      3: () => formData.country && formData.city && formData.postal && formData.address,
      4: () => formData.disabilityType && formData.disabilityAdditionalInfo,
      5: () => formData.preferredJobTitles.length > 0 && formData.industry && formData.employmentType,
      6: () => formData.profilePicture && formData.resumeUrl
    };
    return validations[currentStep]?.() ?? true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
      const fileURL = URL.createObjectURL(files[0]); // Create a temporary URL for the file
      setFormData((prev) => ({
        ...prev,
        [name]: fileURL, // Store this as a string URL temporarily
      }));
    }
  };

    // <---------------------------------- USE STATES ------------------------------------>
  
  const [isOtherJobTitle, setIsOtherJobTitle] = useState(false);
  const [isOtherDisability, setIsOtherDisability] = useState(false);

  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');

  // <---------------------------------- OPTIONS ------------------------------------>

  const disabilityOptions = [
    'Visual', 
    'Hearing', 
    'Mobility', 
    'Other']; 

    // Define your job title options
    const jobTitleOptions = [
      'Software Engineer',
      'Data Analyst',
      'Product Manager',
      'Graphic Designer',
      'Marketing Specialist',
      'Sales Representative',
      'Other'
    ];

      // Industry options
  const industryOptions = [
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'Manufacturing',
    'Retail',
    'Others'
  ];

    // <-------------------------------- HANDLE 1 FUNCTIONS --------------------------------------------->
  const handleAddDisability = (e) => {
    const selectedDisability = e.target.value;

    if (selectedDisability === 'Other') {
      setIsOtherDisability(true);
    } else if (selectedDisability && !formData.disabilityType.includes(selectedDisability)) {
      setFormData((prev) => ({
        ...prev,
        disabilityType: [...prev.disabilityType, selectedDisability],
      }));
    }
  };

  const handleAddOtherDisability = () => {
    if (formData.otherDisability.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        disabilityType: [...prev.disabilityType, formData.otherDisability],
      }));
      setFormData((prev) => ({ ...prev, otherDisability: '' }));
      setIsOtherDisability(false);
    }
  };

  const handleRemoveDisability = (disabilityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      disabilityType: prev.disabilityType.filter((disability) => disability !== disabilityToRemove),
    }));
  };

  // Function to handle adding a job title
  const handleAddJobTitle = (e) => {
    const selectedJobTitle = e.target.value;
    if (selectedJobTitle === 'Other') {
      setIsOtherJobTitle(true);
    } else if (selectedJobTitle && !formData.preferredJobTitles.includes(selectedJobTitle)) {
      setFormData((prev) => ({
        ...prev,
        preferredJobTitles: [...prev.preferredJobTitles, selectedJobTitle],
      }));
    }
  };

  // Function to handle adding a custom job title
  const handleAddOtherJobTitle = () => {
    if (formData.otherJobTitle.trim() !== '') {
      setFormData((prev) => ({
        ...prev,
        preferredJobTitles: [...prev.preferredJobTitles, formData.otherJobTitle],
        otherJobTitle: '',
      }));
      setIsOtherJobTitle(false);
    }
  };

  // Function to handle removing a job title
  const handleRemoveJobTitle = (jobTitleToRemove) => {
    setFormData((prev) => ({
      ...prev,
      preferredJobTitles: prev.preferredJobTitles.filter((jobTitle) => jobTitle !== jobTitleToRemove),
    }));
  };

  // handle adding industry
  const handleAddIndustry = (e) => {
    const selectedIndustry = e.target.value;

    if (selectedIndustry === 'Others') {
      setIsOtherIndustry(true); // Show input for custom industry
    } else if (selectedIndustry && !formData.industry.includes(selectedIndustry)) {
      setFormData((prevData) => ({
        ...prevData,
        industry: [...prevData.industry, selectedIndustry],
      }));
    }

    // Reset the select input after adding an industry
    e.target.value = '';
  };

// handle adding custom industry
  const handleAddOtherIndustry = () => {
    if (otherIndustry.trim() && !formData.industry.includes(otherIndustry.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        industry: [...prevData.industry, otherIndustry.trim()],
      }));
      setOtherIndustry(''); // Clear the custom input field
      setIsOtherIndustry(false); // Hide the custom input
    }
  };

  // handle removing industry
  const handleRemoveIndustry = (industryToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      industry: prevData.industry.filter((industry) => industry !== industryToRemove),
    }));

  const handleBack = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1)); // Go back one step, but not below 1
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      alert('Please fill all required fields');
      return;
    }
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length)); // Go to next step, but not above the last step
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      alert('Please fill all required fields');
      return;
    }
  
    try {
      const jobSeekerData = {
        basicInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          age: formData.age,
        },
        locationInfo: {
          city: formData.city,
          country: formData.country,
          postal: formData.postal,
          address: formData.address,
        },
        disabilityInfo: {
          disabilityType: formData.disabilityType,
          disabilityAdditionalInfo: formData.disabilityAdditionalInfo,
        },
        workPreferences: {
          preferredJobTitles: formData.preferredJobTitles,
          industry: formData.industry,
          employmentType: formData.employmentType,
        },
        additionalInfo: {
          profilePicture: formData.profilePicture, // Should now be a string URL
          resumeUrl: formData.resumeUrl, // Should now be a string URL
        },
        email: formData.email,
        password: formData.password,
        role: 'jobseeker',
      };
  
      const response = await fetch('http://localhost:3000/api/jobseekers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobSeekerData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Success:', data);
      setCurrentStep(steps.length); // Move to success step
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile: ' + error.message);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="mx-auto space-y-6 ">
            <div className="text-center mb-2" >
              <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Let's get started!</h2>
              <p className="text-center text-gray-600 mb-6 font-poppins text-[16px]">To get started, please provide some basic details to set up your account.</p>
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="Email" required />
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="Password" required />
            </div>
            <div>
              <label className="block mb-2 font-poppins text-[15px]">
                Confirm Password
              </label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="Confirm Password" required />
            </div>
          </div>
        );
      case 2:
        return (
          <div className=" mx-auto space-y-6 ">
            <div className="text-center mb-2">
              <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Basic Info</h2>
              <p className="text-center text-gray-600 mb-6 font-poppins text-[16px]">Please provide some basic information to create your account</p>
            </div>
            <div>
              <label className="block mb-2 font-poppins text-[15px]">
                First Name
              </label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="First Name" required />
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Last Name
              </label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="Last Name" required />
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Date of Birth
              </label>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                onChange={handleInputChange} required />
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Gender
              </label>
              <select 
                name="gender" 
                value={formData.gender} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-poppins text-[15px]">
                Age
              </label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="Age" required />
            </div>
          </div>
        );
      case 3:
        return (
          <div className=" mx-auto space-y-6">
            <div className="text-center mb-3 mt-4">
              <h2 className=" font-semibold text-center mb-2 font-poppins text-[36px]">Where Are You Located?</h2>
              <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Help us find opportunities near you by providing your location</p>
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <div>
                <label className="block mb-2 font-poppins text-[15px]">
                  Country
                </label>
                <input 
                  type="text" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  placeholder="Country" required 
                />
              </div>

              <div>
                <label className="block mb-2 font-poppins text-[15px]">
                  City
                </label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  placeholder="City" required 
                />
              </div>

              <div>
                <label className="block mb-2 font-poppins text-[15px]">
                  Postal
                </label>
                <input type="text" 
                  name="postal" 
                  value={formData.postal} 
                  onChange={handleInputChange} 
                  placeholder="Postal Code" 
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  required 
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-poppins text-[15px]">
                Address
              </label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="Address" required />
            </div>
          </div>
        );
      case 4:
        return (
          <div className=" mx-auto space-y-6">
            <div className="text-center mb-3 mt-4">
              <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Tell Us About Your Disability</h2>
              <p className="ext-center text-gray-600 mb-8 font-poppins text-[16px]">This information helps us match you with the right employers and opportunities. Your data is confidential</p>
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Type of Disability
              </label>
              <select
                name="disabilityType"
                onChange={handleAddDisability}
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                defaultValue=""
              >
                <option value="" disabled>Select disability that applies</option>
                {disabilityOptions.map((disability) => (
                  <option key={disability} value={disability}>
                    {disability}
                  </option>
                ))}
              </select>
              {isOtherDisability && (
                <div className="space-y-2 mt-4">
                  <input
                    type="text"
                    value={formData.otherDisability}
                    onChange={(e) => setFormData({ ...formData, otherDisability: e.target.value })}
                    placeholder="Enter your disability"
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherDisability}
                    className="px-4 py-2 bg-black text-white rounded font-poppins"
                  >
                    Add Disability
                  </button>
                </div>
              )}
              <div className="space-y-2 mt-4 mb-2">
                {formData.disabilityType.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold">Selected Disabilities:</h3>
                    <ul>
                      {formData.disabilityType.map((disability, index) => (
                        <li key={index} className="flex justify-between items-center pl-8 pr-2">
                          <span>{disability}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDisability(disability)}
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
            <div className="mb-2">
              <label className="block  mb-2 font-poppins text-[15px]">
                Additional info
              </label>
              <textarea 
                name="disabilityAdditionalInfo" 
                value={formData.disabilityAdditionalInfo} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                placeholder="Additional Information" required />
            </div>
          </div>
        );
      case 5:
        return (
          <div className=" mx-auto space-y-6">
            <div className="text-center mb-3 mt-4">
              <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">What Type of Work Are You Looking For?</h2>
              <p className="text-sm text-gray-500ext-center text-gray-600 mb-8 font-poppins text-[16px]">Let us know your preferred job field or type of work you’re seeking</p>
            </div>
            <label className="block mb-2 font-poppins text-[15px]">
            Preferred Job Title
          </label>
          <select
            name="preferredJobTitles"
            onChange={handleAddJobTitle}
            className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
            defaultValue=""
          >
            <option value="" disabled>Select job title that applies</option>
            {jobTitleOptions.map((jobTitle) => (
              <option key={jobTitle} value={jobTitle}>
                {jobTitle}
              </option>
            ))}
          </select>
          {isOtherJobTitle && (
            <div className="space-y-2 mt-4">
              <input
                type="text"
                value={formData.otherJobTitle}
                onChange={(e) => setFormData({ ...formData, otherJobTitle: e.target.value })}
                placeholder="Enter your job title"
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
              />
              <button
                type="button"
                onClick={handleAddOtherJobTitle}
                className="px-4 py-2 bg-black text-white rounded font-poppins"
              >
                Add Job Title
              </button>
            </div>
          )}
          <div className="space-y-2 mt-4 mb-2">
            {formData.preferredJobTitles.length > 0 && (
              <>
                <h3 className="text-lg font-bold">Selected Job Titles:</h3>
                <ul>
                  {formData.preferredJobTitles.map((jobTitle, index) => (
                    <li key={index} className="flex justify-between items-center pl-8 pr-2">
                      <span>{jobTitle}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveJobTitle(jobTitle)}
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

          <div className="mb-4">
                  <label className="block mb-2 font-poppins text-[15px]">
                    Preferred Industries
                  </label>
                  <select
                    onChange={handleAddIndustry}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black font-poppins"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Industry</option>
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
                        className="w-full px-3 py-2 border border-black rounded-xl font-poppins"
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
                    {Array.isArray(formData.industry) && formData.industry.length > 0 && (
                      <>
                        <h3 className="text-lg font-bold">Selected Industries:</h3>
                        <ul>
                          {formData.industry.map((industry, index) => (
                            <li key={index} className="flex justify-between items-center pl-8 pr-2 font-poppins">
                              <span>{industry}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveIndustry(industry)}
                                className="text-black hover:text-red-700 font-poppins"
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
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Employment Type
              </label>
              <select 
                name="employmentType" 
                value={formData.employmentType} 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black font-poppins"
                onChange={handleInputChange} required>
                  <option value="" disabled>Select your preferred employment type</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="other">Other</option>
              </select>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="mx-auto space-y-6">
            <div className="text-center mb-3 mt-4">
              <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Set Up Your Profile (Optional)</h2>
              <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Add these details now or skip to complete your registration</p>
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Upload Profile Picture
              </label>
              <input 
                type="file" 
                name="profilePicture" 
                accept="image/*" 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black font-poppins"
                onChange={handleFileChange} required />
            </div>
            <div className="mb-2">
              <label className="block mb-2 font-poppins text-[15px]">
                Upload Resume
              </label>
              <input 
                type="file" 
                name="resumeUrl" 
                accept=".pdf,.doc,.docx" 
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black font-poppins"
                onChange={handleFileChange} required />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="mx-auto space-y-6">
            <div className="text-center mb-3 mt-4">
              <h2 className="font-medium text-center mb-2 font-poppins text-[24px]">Confirmation</h2>
              <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Please review your details and submit your application.</p>
            </div>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white items-center min-h-screen"> 
      <NavRegister steps={steps} currentStep={currentStep} />
      <div className="max-w-2xl w-full mx-auto p-8">
        <form onSubmit={currentStep === steps.length ? handleSubmit : (e) => e.preventDefault()}>
          {renderStepContent()}
          
          <div className=" flex justify-end  mt-8 mx-auto max-w-2xl">
            {currentStep > 1 && 
              <button 
              type="button" 
              onClick={handleBack}
              className="w-24 px-4 py-2 text-sm font-medium text-gray-700 bg-white border  border-black rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mr-4 font-poppins"
              >
              Back</button>}
            {currentStep < steps.length ? (
              <div className="w-24 px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins text-center">
                <button 
                  type="button" 
                  onClick={handleNext}
                  >
                   Next
                </button>
              </div>
            ) : (
              <button type="submit">Submit</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobSeeker;
