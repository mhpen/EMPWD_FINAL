import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import NavRegister from '../ui/navRegister';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, title: 'Account Info' },
  { id: 2, title: 'Basic Info' },
  { id: 3, title: 'Location Info' },
  { id: 4, title: 'Disability Info' },
  { id: 5, title: 'Work Preferences' },
  { id: 6, title: 'Additional Info' },
  { id: 7, title: 'Confirmation' }
];

const disabilityOptions = [
  'Visual', 
  'Hearing', 
  'Mobility', 
  'Other'
];

const jobTitleOptions = [
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'Graphic Designer',
  'Marketing Specialist',
  'Sales Representative',
  'Other'
];

const industryOptions = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Other'
];

const idTypes = [
  'PWD ID',
  'Passport',
  'Driver License',
  'National ID',
  'Other ID'
];



const CreateJobSeeker = () => {

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
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
    documents: {
      resume: null,
      pwdId: null,
      validId: null,
      others: []
    },
    profilePicture: null
  });
  const [isOtherJobTitle, setIsOtherJobTitle] = useState(false);
  const [isOtherDisability, setIsOtherDisability] = useState(false);
  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const handleAddDisability = (e) => {
    const selectedDisability = e.target.value;
    if (selectedDisability === 'Other') {
      setIsOtherDisability(true);
    } else if (selectedDisability && !formData.disabilityType.includes(selectedDisability)) {
      setFormData(prev => ({
        ...prev,
        disabilityType: [...prev.disabilityType, selectedDisability]
      }));
    }
  };

  const handleAddOtherDisability = () => {
    if (formData.otherDisability.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        disabilityType: [...prev.disabilityType, formData.otherDisability]
      }));
      setFormData(prev => ({ ...prev, otherDisability: '' }));
      setIsOtherDisability(false);
    }
  };

  const handleRemoveDisability = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      disabilityType: prev.disabilityType.filter(item => item !== itemToRemove)
    }));
  };

  const handleAddJobTitle = (e) => {
    const selectedJobTitle = e.target.value;
    if (selectedJobTitle === 'Other') {
      setIsOtherJobTitle(true);
    } else if (selectedJobTitle && !formData.preferredJobTitles.includes(selectedJobTitle)) {
      setFormData(prev => ({
        ...prev,
        preferredJobTitles: [...prev.preferredJobTitles, selectedJobTitle]
      }));
    }
  };

  const handleAddOtherJobTitle = () => {
    if (formData.otherJobTitle.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        preferredJobTitles: [...prev.preferredJobTitles, formData.otherJobTitle],
        otherJobTitle: ''
      }));
      setIsOtherJobTitle(false);
    }
  };

  const handleRemoveJobTitle = (jobTitleToRemove) => {
    setFormData(prev => ({
      ...prev,
      preferredJobTitles: prev.preferredJobTitles.filter(jobTitle => jobTitle !== jobTitleToRemove)
    }));
  };

  const handleAddIndustry = (e) => {
    const selectedIndustry = e.target.value;
    if (selectedIndustry === 'Other') {
      setIsOtherIndustry(true);
    } else if (selectedIndustry && !formData.industry.includes(selectedIndustry)) {
      setFormData(prev => ({
        ...prev,
        industry: [...prev.industry, selectedIndustry]
      }));
    }
  };

  const handleAddOtherIndustry = () => {
    if (otherIndustry.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        industry: [...prev.industry, otherIndustry]
      }));
      setOtherIndustry('');
      setIsOtherIndustry(false);
    }
  };

  const handleRemoveIndustry = (industryToRemove) => {
    setFormData(prev => ({
      ...prev,
      industry: prev.industry.filter(industry => industry !== industryToRemove)
    }));
  };



  const handleBack = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      alert('Please fill all required fields');
      return;
    }
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the current step before proceeding
    if (!validateCurrentStep()) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append non-file fields
      Object.keys(formData).forEach(key => {
        if (!['documents'].includes(key)) {
          // Remove extra quotes from stringified values
          const value = typeof formData[key] === 'string' ? formData[key].replace(/"/g, '') : formData[key];
          formDataToSend.append(key, value);
        }
      });

      // Append file fields
      if (formData.documents.resume) formDataToSend.append('resume', formData.documents.resume);
      if (formData.documents.pwdId) formDataToSend.append('pwdId', formData.documents.pwdId);
      if (formData.documents.validId) formDataToSend.append('validId', formData.documents.validId);

      // Handle otherDocs safely
      if (Array.isArray(formData.documents.others)) {
        formData.documents.others.forEach(doc => formDataToSend.append('otherDocs', doc));
      } else if (formData.documents.others) {
        formDataToSend.append('otherDocs', formData.documents.others);
      }

      // Send the request
      const response = await fetch('http://localhost:5001/api/jobseekers/create', {
        method: 'POST',
        body: formDataToSend
      });

      // Check for a successful response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert('Job Seeker Profile created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Error creating Job Seeker Profile:', error);
      alert(`Failed to create Job Seeker Profile: ${error.message}`);
    }
  };
  const handleIdTypeChange = (e) => {
    setFormData({ ...formData, idType: e.target.value });
  };
  
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit");
        return;
      }

      // Check file type
      const acceptedTypes = {
        resume: ['.pdf', '.doc', '.docx'],
        pwdId: ['.pdf', '.jpg', '.jpeg', '.png'],
        validId: ['.pdf', '.jpg', '.jpeg', '.png'],
        otherDocs: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
      };

      // Add this check
      if (!acceptedTypes[fieldName]) {
        console.error(`Invalid field name: ${fieldName}`);
        return;
      }

      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedTypes[fieldName].includes(fileExtension)) {
        alert("Invalid file type");
        return;
      }

      // If all checks pass, update the form data
      setFormData(prevData => ({
        ...prevData,
        documents: {
          ...prevData.documents,
          [fieldName]: file
        }
      }));
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
            <div className="mb-2 relative">
        <label className="block mb-2 font-poppins text-[15px]">Password</label>
        <input 
          type={showPassword ? "text" : "password"} 
          name="password" 
          value={formData.password} 
          onChange={handleInputChange} 
          className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
          placeholder="Password" 
          required 
        />
        <div 
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
        </div>
          <div className="relative">
            <label className="block mb-2 font-poppins text-[15px]">Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
              placeholder="Confirm Password" 
              required 
            />
            <div 
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
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
              Industry
            </label>
            <select
              name="industry"
              onChange={handleAddIndustry}
              className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
              defaultValue=""
            >
              <option value="" disabled>Select an industry</option>
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
              {formData.industry.length > 0 && (
                <>
                  <h3 className="text-lg font-bold">Selected Industries:</h3>
                  <ul>
                    {formData.industry.map((industry, index) => (
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
              <div className="mx-auto space-y-6 max-w-2xl p-6">
                <div className="text-center mb-8">
                  <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">
                    Upload Required Documents
                  </h2>
                  <p className="text-center text-gray-600 font-poppins text-[16px]">
                    Please upload your resume and identification documents
                  </p>
                </div>
          
                {/* Resume Upload Section */}
                {/* <div className="mb-6">
                  <label className="block mb-2 font-poppins text-[15px] font-medium">
                    Upload Resume
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'resume')}
                      className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    />
                    {formData.resume && (
                      <p className="text-sm text-green-600">
                        ✓ {formData.resume.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Accepted formats: PDF, DOC, DOCX (max 5MB)
                    </p>
                  </div>
                </div> */}
          
                {/* PWD ID Upload Section */}
                <div className="mb-6">
                  <label className="block mb-2 font-poppins text-[15px] font-medium">
                    Upload PWD ID
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="file"
                      name="pwdId"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, 'pwdId')}
                      className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    />
                    {formData.pwdId && (
                      <p className="text-sm text-green-600">
                        ✓ {formData.pwdId.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Accepted formats: PDF, JPEG, PNG (max 5MB)
                    </p>
                  </div>
                </div>
          
                {/* Valid ID Upload Section */}
                <div className="mb-6">
                  <label className="block mb-2 font-poppins text-[15px] font-medium">
                    Upload Valid ID
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="file"
                      name="validId"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, 'validId')}
                      className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    />
                    {formData.validId && (
                      <p className="text-sm text-green-600">
                        ✓ {formData.validId.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Accepted formats: PDF, JPEG, PNG (max 5MB)
                    </p>
                  </div>
                </div>
          
                {/* Other Documents Upload Section */}
                <div className="mb-6">
                  <label className="block mb-2 font-poppins text-[15px] font-medium">
                    Upload Other Supporting Documents (Optional)
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="file"
                      name="otherDocs"
                      accept=".pdf,image/*,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'otherDocs')}
                      className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                      multiple
                    />
                    {formData.otherDocs?.length > 0 && (
                      <div className="mt-2">
                        {Array.from(formData.otherDocs).map((file, index) => (
                          <p key={index} className="text-sm text-green-600">
                            ✓ {file.name}
                          </p>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Accepted formats: PDF, JPEG, PNG, DOC, DOCX (max 5MB each)
                    </p>
                  </div>
                </div>
          
                {/* Navigation Buttons */}
                {/* <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBack}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div> */}
              </div>
            );
      case 7:
        return (
          <div className="mx-auto space-y-6">
            <div className="text-center mb-3 mt-4">
              <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Confirmation</h2>
              <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Please review your details and submit your application.</p>
            </div> 
            <div className="space-y-4 mb-10">
            <p><strong>Email:</strong><br /> {formData.email}</p>
            <hr className="border-black" />
            <p><strong>Password:</strong><br /> {formData.password}</p>
            <hr className="border-black" />
            <p><strong>Confirm Password:</strong><br /> {formData.confirmPassword}</p>
            <hr className="border-black" />
            <p><strong>First Name:</strong><br /> {formData.firstName}</p>
            <hr className="border-black" />
            <p><strong>Last Name:</strong><br /> {formData.lastName}</p>
            <hr className="border-black" />
            <p><strong>Birth Date:</strong><br /> {formData.dateOfBirth}</p>
            <hr className="border-black" />
            <p><strong>Gender:</strong><br /> {formData.gender}</p>
            <hr className="border-black" />
            <p><strong>Age:</strong><br /> {formData.age}</p>
            <hr className="border-black" />
            <p><strong>Country:</strong><br /> {formData.country}</p>
            <hr className="border-black" />
            <p><strong>Email:</strong><br /> {formData.age}</p>
            <hr className="border-black" />
            <p><strong>City:</strong><br /> {formData.city}</p>
            <hr className="border-black" />
            <p><strong>Postal:</strong><br /> {formData.postal}</p>
            <hr className="border-black" />
            <p><strong>Address:</strong><br /> {formData.address}</p>
            <hr className="border-black" />
            <div>
              <p><strong>Disability Type:</strong></p>
              <div className="flex flex-wrap">
                {formData.disabilityType.map((type, index) => (
                  <span key={index} className="border border-black text-gray-800 py-1 px-3 rounded-full text-sm flex items-center mb-2 mr-2">
                    {type}
                    <button
                      type="button"
                      onClick={() => handleRemoveDisability(type)} // Define this function to remove selected disability types
                      className="ml-2 text-black hover:text-red-700 focus:outline-none"
                      aria-label={`Remove ${type}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <hr className="border-black" />
            <p><strong>Additional Information:</strong><br /> {formData.disabilityAdditionalInfo}</p>
            <hr className="border-black" />
            <div>
              <p><strong>Preferred Job Title:</strong></p>
              <div className="flex flex-wrap">
                {formData.preferredJobTitles.map((title, index) => (
                  <span key={index} className="border border-black text-gray-800 py-1 px-3 rounded-full text-sm flex items-center mb-2 mr-2">
                    {title}
                    <button
                      type="button"
                      onClick={() => handleRemoveJobTitle(title)} // Define this function to remove selected job titles
                      className="ml-2 text-black hover:text-red-700 focus:outline-none"
                      aria-label={`Remove ${title}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <hr className="border-black" />
            <div>
                <p><strong>Industry:</strong></p>
                <div className="flex flex-wrap">
                  {formData.industry.map((industry, index) => (
                    <span key={index} className="border border-black text-gray-800 py-1 px-3 rounded-full text-sm flex items-center mb-2 mr-2">
                      {industry}
                      <button
                        type="button"
                        onClick={() => handleRemoveIndustry(industry)} // Update with the function to remove the selected industry
                        className="ml-2 text-black hover:text-red-700 focus:outline-none"
                        aria-label={`Remove ${industry}`}
                      >
                        <i className="fas fa-times"></i> {/* X icon */}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            <hr className="border-black" />
            <p><strong>Employment Type:</strong><br /> {formData.employmentType}</p>
            <hr className="border-black" />
            </div>
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
              <button type="submit"
              className="w-24 px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins text-center">
                Submit
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobSeeker;
