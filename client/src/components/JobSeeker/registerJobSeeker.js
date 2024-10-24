import React, { useState } from 'react'; 
import axios from 'axios';
import NavRegister from '../ui/navRegister';
//import { ChevronRight, ChevronLeft } from 'lucide-react';

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Location Info' },
  { id: 3, title: 'Disability Info' },
  { id: 4, title: 'Work Preferences' },
  { id: 5, title: 'Additional Info' },
  { id: 6, title: 'Confirmation' },
];

const CreateJobSeeker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      //role: 'jobseeker',
      country: '',
      city: '',
      postal: '',
      address: '',
      disability: '',
      additionalInfo: '',
      jobTitle: [],
      industry: '',
      employmentType: '',
      profilePicture: null,
      resumeUrl: null
   });

  // validation function for each step 
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (
            formData.firstName.trim() === '' ||
            formData.lastName.trim() === '' ||
            formData.email.trim() === '' ||
            formData.password.trim() === '' ||
            formData.confirmPassword.trim() === ''
         ) {
            alert('Please fill out all required fields.');
            return false;
         }
        // Check if the password match 
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return false;
         }
      return true;

      case 2:
        if (
            formData.country.trim() === '' ||
            formData.city.trim() === '' ||
            formData.postal.trim() === '' ||
            formData.address.trim() === ''
         ){
            alert('Please fill out all required fields.');
            return false;
         }
      return true; 

      case 3:
        if(
          formData.disability.trim() === ''
        ){
          alert('Please fill out all required fields.');
          return false;
        }
      return true

      case 4:
        if(
          formData.jobTitle === '' && formData.industry.trim() === '' && formData.employmentType === ''
        ){
          alert('Please fill out all required fields.');
          return false;
        }
      return true

      default:
      return true;
    }
  };

  // job title options
  const jobTitleOptions = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'Graphic Designer',
    'Marketing Specialist',
    'Customer Support',
    'Others'
  ];

  // states for custom job title
  const [isOtherJobTitle, setIsOtherJobTitle] = useState(false);
  const [otherJobTitle, setOtherJobTitle] = useState(''); // State for custom job title
  
  const [navStep, setNavStep] = useState(1); // Track current 

  // handle adding job titles
  const handleAddJobTitle = (e) => {
    const selectedTitle = e.target.value;
  
    if (selectedTitle === 'Others') {
      setIsOtherJobTitle(true); // Show input for custom job title
    } else if (selectedTitle && !formData.jobTitle.includes(selectedTitle)) {
      setFormData((prevData) => ({
        ...prevData,
        jobTitle: [...prevData.jobTitle, selectedTitle], // removw the value
    
      }));
    }
  
    // Reset the select input after adding a job title
    e.target.value = '';
  };

  // handle adding job titles
  const handleAddOtherJobTitle = () => {
    if (otherJobTitle.trim() && !formData.jobTitle.includes(otherJobTitle.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        jobTitle: [...prevData.jobTitle, otherJobTitle.trim()],
      }));
      setOtherJobTitle(''); // Clear the custom input field
      setIsOtherJobTitle(false); // Hide the custom input
    }
  };

  // Handle removing job titles
  const handleRemoveJobTitle = (titleToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      jobTitle: prevData.jobTitle.filter((title) => title !== titleToRemove),
    }));
  };

  // Handle Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Next button
  const handleNext = () => {
    if(validateCurrentStep()){
      setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length));
    }
  };

  // Handle Back Button
  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post('/api/jobSeekers',{
            basicInfo: {
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               password: formData.password,
               //role: formData.role,
            },
            locationInfo: {
               country: formData.country,
               city: formData.city,
               postal: formData.postal,
               address: formData.address,
            },
            disabilityInfo: {
               disability: formData.disability,
               additionalInfo: formData.additionalInfo,
            },
            workPreferences: {
               jobTitle: formData.jobTitle,
               industry: formData.industry,
               employmentType: formData.employmentType,
            },
            additionalInfo: {
               profilePicture: formData.profilePicture,
               resumeUrl: formData.resumeUrl
            }
         });
         console.log(formData);
         console.log(response.data);
         alert('Employer created successfully!');
      } catch (error) {
         console.error('Error creating employer', error);
         alert('Failed to create employer');
      }
  
    
   };

  const renderStep = () => {
   
    if (currentStep !== navStep) {
      setNavStep(currentStep); // Sync navStep with currentStep
    }

    switch (currentStep) {
      case 1:
        return (
            <div className="space-y-4">
              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold mb-2">Let's get started!</h2>
                <p className="text-sm text-gray-500">Please provide some basic information to create your account</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Last Name
                </label>            
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"

                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>
            </div>
        );
      case 2:
        return (
            <div className="space-y-4">

              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold mb-2">Where Are You Located?</h2>
                <p className="text-sm text-gray-500">Help us find opportunities near you by providing your location</p>
              </div>

            <div className="flex flex-row gap-12 justify-between">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                Postal
                </label>
                <input
                  type="text"
                  name="postal"
                  value={formData.postal}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>
            </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>
            </div>
        );
      case 3:
        return (
            <div className="space-y-4">
              
              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold mb-2">Tell Us About Your Disability</h2>
                <p className="text-sm text-gray-500">This information helps us match you with the right employers and opportunities. Your data is confidential</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                Type of Disability
                </label>
                <select
                  name="disability"
                  value={formData.disability}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-black rounded-xl"
                >
                  <option value="" disabled>Select disability that applies</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="mobility">Mobility Impairment</option>
                  <option value="cognitive">Cognitive Disability</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                Additional info
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Enter additional info about your disability"
                  className="w-full px-3 py-2 border border-black rounded-xl"
                />
              </div>
            </div>
        );
      case 4:
        return (
            <div className="space-y-4">

              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold mb-2">What Type of Work Are You Looking For?</h2>
                <p className="text-sm text-gray-500">Let us know your preferred job field or type of work you’re seeking</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                Preferred Job Titles
                </label>
              <select
                //value={formData.jobTitle}
                onChange={handleAddJobTitle}
                className="w-full px-3 py-2 border border-black rounded-xl"
                defaultValue=""
              >
                <option value="" disabled>Select Job Title</option>
                {jobTitleOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              {isOtherJobTitle && (
                <div className="space-y-2 mt-4">
                  <input
                    type="text"
                    value={otherJobTitle}
                    onChange={(e) => setOtherJobTitle(e.target.value)}
                    placeholder="Enter your job title"
                    className="w-full px-3 py-2 border border-black rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherJobTitle}
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    Add Job Title
                  </button>
                </div>
              )}
            <div className="space-y-2 mt-4">
              {formData.jobTitle.length > 0 && (
                <>
                  <h3 className="text-lg font-bold">Selected Job Titles:</h3>
                  <ul>
                    {formData.jobTitle.map((jobTitle, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{jobTitle}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveJobTitle(jobTitle)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                  Industry
                  </label>

                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-black rounded-xl"
                  >
                    <option value="" disabled>Select your preferred industry</option>
                    <option value="tech">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="finance">Finance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                  Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-black rounded-xl"
                  >
                    <option value="" disabled>Choose your preferred employment type</option>
                    <option value="fullTime">Full-time</option>
                    <option value="partTime">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          navStep === 5 && (
            <div className="space-y-4">
              
              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold mb-2">Set Up Your Profile (Optional)</h2>
                <p className="text-sm text-gray-500">Add these details now or skip to complete your registration</p>
              </div>
              <div className="flex flex-col justify-center items-center mb-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <button className="mt-4 mb-4 w-52 p-2 bg-black text-white rounded-full" disabled>Upload Profile Picture</button>
              </div>

              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold mb-2">Upload Your Resume (Optional)</h2>
                <p className="text-sm text-gray-500">Attach your resume to help employers find you faster. You can skip this step if you’d prefer to do it later.</p>
                <button className="mb-2 mt-8 w-52 p-2 border border-black rounded" disabled>Upload Resume</button>
                <p className="text-sm text-gray-500">Supported Formats: "Max file size 5MB, formats: PDF, DOC, DOCX"</p>
              </div>
            </div>
          )  
        );
      case 6:
        return (

          <div className="text-center p-6">
                    <div className="mb-6">
                        <i className="fas fa-check-circle text-6xl text-black"></i>
                    </div>
                    <h1 className="text-2xl font-semibold mb-4">"You're All Set!"</h1>
                    <p className="text-gray-600 mb-6">
                        Your account has been successfully created. You can now browse job opportunities or complete your profile for better matches.
                    </p>
                    <button className="bg-black text-white py-2 px-6 rounded-full">
                        Find Jobs Now
                    </button>
            </div>
            // <div className="space-y-4">
            //   <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
            //   <p>Confirm your information before submitting.</p>
            //   <ul className="space-y-2">
            //     <li>First Name: {formData.firstName}</li>
            //     <li>Last Name: {formData.lastName}</li>
            //     <li>Email: {formData.email}</li>
            //     <li>Country: {formData.country}</li>
            //     <li>City: {formData.city}</li>
            //     <li>Postal: {formData.postal}</li>
            //     <li>Address: {formData.address}</li>
            //     <li>Disability: {formData.disability}</li>
            //     <li>Job Title: {formData.jobTitle}</li>
            //     <li>Industry: {formData.industry}</li>
            //     <li>Employment Type: {formData.employmentType}</li>
            //   </ul>
            // </div>
        );
      default:
      return null;
    }
  };

  return (
    <div className="bg-white flex flex-col items-center min-h-screen">

      <NavRegister navStep = {navStep}/>

      <div className="max-w-2xl w-full mx-auto p-4">
        <form onSubmit={handleSubmit}>

          {renderStep()}

          <div className="flex justify-end gap-10 mt-6">
          {currentStep > 1 &&  currentStep < 6 &&(
              <button
                type="button"
                onClick={handleBack}
                className="px-10 py-2 bg-gray-300 rounded-full"
              >
                Back
              </button>
          )}

          {currentStep < 6 && (
            <button
              type="button"
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              className="px-10 py-2 bg-black text-white rounded-full"
            >
            {(() => {
              let buttonText;
              if (currentStep === 1) {
                buttonText = 'Submit';
              } else if (currentStep === steps.length) {
                buttonText = 'Submit';
              } else {
                buttonText = 'Next';
              }
              return buttonText;
            })()}
            </button>
          )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobSeeker;