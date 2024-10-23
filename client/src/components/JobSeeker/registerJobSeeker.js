import React, { useState } from 'react'; 
import axios from 'axios';
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

  const [isOtherJobTitle, setIsOtherJobTitle] = useState(false);
  const [otherJobTitle, setOtherJobTitle] = useState(''); // State for custom job title

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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Let's get started!</h2>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Where Are You Located?</h2>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="postal"
              value={formData.postal}
              onChange={handleInputChange}
              placeholder="Postal"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-2 border rounded"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Tell Us About Your Disability</h2>
            <select
              name="disability"
              value={formData.disability}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select disability</option>
              <option value="visual">Visual Impairment</option>
              <option value="hearing">Hearing Impairment</option>
              <option value="mobility">Mobility Impairment</option>
              <option value="cognitive">Cognitive Disability</option>
              <option value="other">Other</option>
            </select>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Additional info"
              className="w-full p-2 border rounded h-32"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">What Type of Work Are You Looking For?</h2>
            {/* <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Job Title"
              className="w-full p-2 border rounded"
            /> */}
            <select
              //value={formData.jobTitle}
              onChange={handleAddJobTitle}
              className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Industry</option>
                <option value="tech">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Employment Type</option>
                <option value="fullTime">Full-time</option>
                <option value="partTime">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Set Up Your Profile (Optional)</h2>
            <div className="flex justify-center items-center mb-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
            </div>
            <button className="w-full p-2 bg-black text-white rounded">Upload Profile Picture</button>
            <button className="w-full p-2 border border-black rounded">Upload Resume</button>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
            <p>Confirm your information before submitting.</p>
            <ul className="space-y-2">
              <li>First Name: {formData.firstName}</li>
              <li>Last Name: {formData.lastName}</li>
              <li>Email: {formData.email}</li>
              <li>Country: {formData.country}</li>
              <li>City: {formData.city}</li>
              <li>Postal: {formData.postal}</li>
              <li>Address: {formData.address}</li>
              <li>Disability: {formData.disability}</li>
              <li>Job Title: {formData.jobTitle}</li>
              <li>Industry: {formData.industry}</li>
              <li>Employment Type: {formData.employmentType}</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Job Seeker Registration</h1>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {/* <ChevronLeft />  */}Back
          </button>
          <button
            type="button"
            onClick={currentStep === steps.length ? handleSubmit : handleNext}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {currentStep === steps.length ? 'Submit' : 'Next'} 
            {/* <ChevronRight /> */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobSeeker;



