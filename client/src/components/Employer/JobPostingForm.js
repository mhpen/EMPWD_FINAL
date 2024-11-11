import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import NavEmployer from '../ui/navEmployer.js';

const Header = () => {
  return (
    <div className="border-b border-gray-300 font-poppins ">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <i className="fas fa-cube text-2xl"></i>
            <span className="ml-2 text-xl font-semibold ">photo</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <span className="text-lg hidden sm:inline ">Notifications</span>
          
          <span className="text-lg hidden sm:inline ">Messages</span>

          <div className="flex items-center space-x-2">
            <span className="text-lg">Roberto</span>
            <div className="w-8 h-8 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateJobPosting = () => {
  const [step, setStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobLocation: 'Remote',
    industry: [],
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

      // Predefined benefits options
const benefitOptions = [
  'Health Insurance',
  'Disability Insurance',
  'Pag-IBIG Fund Membership',
  'Free Annual Check-Ups',
  'Mental Health Support Services',,
  'Supportive Work Environment',
  'Flexible Leave Policies',
  'Transportation Assistance',
  'Performance-Based Incentives',
  'Accommodation Stipend or Benefits',
  'Emergency Medical Assistance',
  'Return-to-Work Support for Medical Leave',
  'Family Support Programs',
  'Relocation Assistance for Accessible Housing',
  'Disability Inclusion Initiatives',
  'Accommodations for Medical Needs',
  'Job Sharing Opportunities',
  '13th Month Pay',
  'Holiday Pay and Bonuses',
  'Overtime Pay',
  'Meal and Transportation Allowances',
  'Sick Leave and Vacation Leave',
  'Others'
];

  // Define available key skills options
  const keySkillsOptions = [
    'Communication', 'Teamwork', 'Problem Solving', 
    'Time Management', 'Adaptability', 'Creativity', 
    'Technical Skills', 'Leadership', 'Project Management', 
    'Attention to Detail', 'Customer Service', 'Analytical Thinking',
    'Organization', 'Decision Making', 'Interpersonal Skills'
  ];

  // Define available accessibility features options
const accessibilityFeaturesOptions = [
  'Wheelchair Accessible',
  'Vision Impaired Access',
  'Hearing Impaired Access',
  'Assistive Technology',
  'Accessible Parking',
  'Restroom Accessibility',
  'Braille Signage',
  'Audio Description',
  'Other'
];

  

  

  const [isOtherIndustry, setIsOtherIndustry] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');

  const [isOtherBenefit, setIsOtherBenefit] = useState(false);
  const [otherBenefit, setOtherBenefit] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State to manage selected accessibility features and custom input
const [selectedAccessibilityFeatures, setSelectedAccessibilityFeatures] = useState([]);
const [isOtherFeature, setIsOtherFeature] = useState(false);
const [otherFeature, setOtherFeature] = useState('');

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

  // Handle removing an industry
  const handleRemoveIndustry = (industryToRemove) => {
    // Update the formData by filtering out the industry to remove
    setFormData((prevData) => ({
      ...prevData,
      industry: prevData.industry.filter((industry) => industry !== industryToRemove),
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const userId = localStorage.getItem('userId');

    // Handle removing a skill
    const handleRemoveSkill = (skillToRemove) => {
      // Update the formData by filtering out the skill to remove
      const updatedSkills = formData.keySkills.filter((skill) => skill !== skillToRemove);
  
      // Update the state with the new array of key skills
      setFormData((prevData) => ({
        ...prevData,
        keySkills: updatedSkills,
      }));
    };

  // Handle adding selected benefit
  const handleAddBenefit = (benefit) => {
    if (benefit === 'Others') {
      setIsOtherBenefit(true);
    } else if (benefit && !formData.benefits.includes(benefit)) {
      setFormData((prevData) => ({
        ...prevData,
        benefits: [...prevData.benefits, benefit],
      }));
    }
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Handle adding custom benefit
  const handleAddOtherBenefit = () => {
    if (otherBenefit.trim() && !formData.benefits.includes(otherBenefit.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        benefits: [...prevData.benefits, otherBenefit.trim()],
      }));
      setOtherBenefit(''); // Clear input
      setIsOtherBenefit(false); // Hide input
    }
  };

  // Handle removing benefit
  const handleRemoveBenefit = (benefitToRemove) => {
    // Update the formData by filtering out the benefit to remove
    const updatedBenefits = formData.benefits.filter(
      (benefit) => benefit !== benefitToRemove
    );
  
    // Update the state with the new array of benefits
    setFormData((prevData) => ({
      ...prevData,
      benefits: updatedBenefits,
    }));
  };
// Handle adding an accessibility feature from the dropdown
const handleAddAccessibilityFeature = (e) => {
  const selectedFeature = e.target.value;

  if (selectedFeature === 'Other') {
    setIsOtherFeature(true); // Show input for custom feature
  } else if (selectedFeature && !formData.accessibilityFeatures.includes(selectedFeature)) {
    setFormData((prevData) => ({
      ...prevData,
      accessibilityFeatures: [...prevData.accessibilityFeatures, selectedFeature],
    }));
  }

  // Reset the select input after adding a feature
  e.target.value = '';
};

// Handle adding custom accessibility feature
const handleAddOtherFeature = () => {
  if (otherFeature.trim() && !formData.accessibilityFeatures.includes(otherFeature.trim())) {
    setFormData((prevData) => ({
      ...prevData,
      accessibilityFeatures: [...prevData.accessibilityFeatures, otherFeature.trim()],
    }));
    setOtherFeature(''); // Clear the custom input field
    setIsOtherFeature(false); // Hide the custom input
  }
};

// Handle removing an accessibility feature
const handleRemoveFeature = (featureToRemove) => {
  setFormData((prevData) => ({
    ...prevData,
    accessibilityFeatures: prevData.accessibilityFeatures.filter((feature) => feature !== featureToRemove),
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
      employersId: userId, // Include userId in the jobData
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
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(jobData),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Job posting created successfully!');
        console.log(result);

        navigate('/job-dashboard');
        //<Link to="/job-dashboard" />


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
          <div className="max-w-2xl mx-auto ">
            <div className="w-full h-32 bg-gray-300 rounded-lg mb-8"></div>
            <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Job Details</h2>
            <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Provide the basic information about the job position you're offering.</p>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Job Title/Position</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Job Location</label>
                <select
                  name="jobLocation"
                  value={formData.jobLocation}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-[15px]">Industry</label>
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
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="w-full h-32 bg-gray-300 rounded-lg mb-8"></div>
            <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Job Qualifications</h2>
            <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Specify the qualifications and skills required for this position.</p>
            <div className="space-y-6">
                        <div>
              <label className="block mb-2 font-poppins text-[15px]">Key Skills or Competencies</label>
              <div className="flex flex-wrap">
                {keySkillsOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      // Update the state for selected skills
                      const newSkills = formData.keySkills.includes(skill)
                        ? formData.keySkills.filter(s => s !== skill) // Remove if already selected
                        : [...formData.keySkills, skill]; // Add if not selected

                      setFormData({ ...formData, keySkills: newSkills });
                      console.log(newSkills); // Log the updated skills for debugging
                    }}
                    className={`flex items-center mr-2 justify-start px-3 py-1 border rounded-full transition-colors duration-200 mb-2 font-poppins
                      ${formData.keySkills.includes(skill) ? 'bg-gray-500 text-white' : 'bg-white text-black border-black'}`}
                  >
                    {/* Conditional rendering for icons */}
                    {!formData.keySkills.includes(skill) ? (
                      <i className="fas fa-plus mr-2"></i> // Show plus icon if not selected
                    ) : (
                      <i className="fas fa-check mr-2"></i> // Show check icon if selected
                    )}
                    {skill}
                  </button>
                ))}
              </div>
            </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Other Skills (Please specify)</label>
                <input
                  type="text"
                  name="otherSkills"
                  value={formData.otherSkills}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Required Education Level</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500"
                  required
                >
                  <option value="" disabled>Select an education level</option>
                  <option value="High School">High School</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Certification">Certification</option>
                </select>
              </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Years of Experience</label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="w-full h-32 bg-gray-300 rounded-lg mb-8"></div>
            <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Salary & Benefits</h2>
            <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Share the salary range and the benefits your company offers for this role.</p>
            <div className="space-y-6">
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Salary Range</label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="Min"
                    className="mt-1 block w-full border border-black rounded-xl shadow-sm p-2"                   
                     required
                  />
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    placeholder="Max"
                    className="mt-1 block w-full border border-black rounded-xl shadow-sm p-2"                    
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-[15px]">Benefits</label>
                <div className="relative">
                  <select
                    onChange={(e) => handleAddBenefit(e.target.value)}
                    className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins max-h-auto  overflow-y-auto"
                    value=""
                  >
                    <option value="" disabled>
                      {formData.benefits.length > 0 ? "Select Benefit" : "Select Benefits"}
                    </option>
                    {benefitOptions.map((benefit) => (
                      <option key={benefit} value={benefit}>
                        {benefit}
                      </option>
                    ))}
                  </select>

                  <div className="mt-2">
                    {isOtherBenefit && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={otherBenefit}
                          onChange={(e) => setOtherBenefit(e.target.value)}
                          placeholder="Enter your benefit"
                          className="w-full p-2 border border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-500 font-poppins"
                        />
                        <button
                          type="button"
                          onClick={handleAddOtherBenefit}
                          className="px-4 py-2 bg-black text-white rounded font-poppins"
                        >
                          Add Benefit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mt-4 mb-2">
                  {Array.isArray(formData.benefits) && formData.benefits.length > 0 && (
                    <>
                      <h3 className="text-lg font-bold">Selected Benefits:</h3>
                      <ul>
                        {formData.benefits.map((benefit, index) => (
                          <li key={index} className="flex justify-between items-center pl-8 pr-2 font-poppins">
                            <span>{benefit}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBenefit(benefit)}
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
                <div>
                <label className="block  mb-2 font-poppins text-[15px]">Additional Perks</label>
                <input
                  type="text"
                  name="additionalPerks"
                  value={formData.additionalPerks}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="w-full h-32 bg-gray-300 rounded-lg mb-8"></div>
            <h2 className="font-semibold text-center mb-2 font-poppins text-[36px]">Accessibility and PWD Support</h2>
            <p className="text-center text-gray-600 mb-8 font-poppins text-[16px]">Highlight the accessibility features and support available for PWD candidates.</p>
            <div className="space-y-6">
            <div>
              <label className="block mb-2 font-poppins text-[15px]">Accessibility Features</label>
              <select
                onChange={handleAddAccessibilityFeature}
                className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black font-poppins"
                defaultValue=""
              >
                <option value="" disabled>Select Accessibility Feature</option>
                {accessibilityFeaturesOptions.map((feature) => (
                  <option key={feature} value={feature}>
                    {feature}
                  </option>
                ))}
              </select>
              
              {isOtherFeature && (
                <div className="space-y-2 mt-4">
                  <input
                    type="text"
                    value={otherFeature}
                    onChange={(e) => setOtherFeature(e.target.value)}
                    placeholder="Enter your accessibility feature"
                    className="w-full px-3 py-2 border border-black rounded-xl font-poppins"
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherFeature}
                    className="px-4 py-2 bg-black text-white rounded font-poppins"
                  >
                    Add Feature
                  </button>
                </div>
              )}
              
              <div className="space-y-2 mt-4 mb-2">
                {Array.isArray(formData.accessibilityFeatures) && formData.accessibilityFeatures.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold">Selected Accessibility Features:</h3>
                    <ul>
                      {formData.accessibilityFeatures.map((feature, index) => (
                        <li key={index} className="flex justify-between items-center pl-8 pr-2 font-poppins">
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(feature)}
                            className="text-black hover:text-red-700 font-poppins"
                          >
                            <i className="bi bi-trash"></i> {/* Bootstrap trashcan icon */}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Any special accommodations or support (optional)</label>
                <textarea
                  name="specialAccommodations"
                  value={formData.specialAccommodations}
                  onChange={handleChange}
                  className="w-full p-2 border border-black rounded-xl focus:outline-none focus:border-black"
                  rows="4"
                  placeholder="Describe any special accommodations you can offer..."
                />
              </div>
            </div>
          </div>

        );
      case 5:
        return (
          <div className="max-w-2xl mx-auto font-poppins">
            <h2 className="font-semibold text-center mb-2 text-[36px]">Review Your Job Posting</h2>
            <p className="text-center text-gray-600 mb-8  text-[16px]">Please review the information you've provided for your job posting.</p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Job Details</h3>
              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Title:</strong><br />{formData.jobTitle}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />
              
              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Description:</strong><br />{formData.jobDescription}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              {/* Job Location: Updated to join array */}
              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Location:</strong><br />{formData.jobLocation}</p>
                <button  className="text-black hover:underline ml-2">Edit</button>
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

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Employment Type:</strong><br />{formData.employmentType}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              <div className="flex justify-between items-center text-[15px] mb-7">
                <p><strong>Application Deadline:</strong><br />{formData.applicationDeadline}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />
              
              <h3 className="text-xl font-semibold">Qualifications</h3>
              <div>
                <p><strong>Key Skills:</strong></p>
                <div className="flex flex-wrap">
                  {formData.keySkills.map((skill, index) => (
                    <span key={index} className="border border-black text-gray-800 py-1 px-3 rounded-full text-sm flex items-center mb-2 mr-2">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)} // Make sure to define this function
                        className="ml-2 text-black hover:text-red-700 focus:outline-none"
                        aria-label={`Remove ${skill}`}
                      >
                        <i className="fas fa-times"></i> {/* X icon */}
                      </button>
                    </span>
                  ))}
                </div>
                </div>
              <hr className="border-black" />

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Other Skills:</strong><br />{formData.otherSkills}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Education Level:</strong><br />{formData.educationLevel}</p>
                <button  className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Years of Experience:</strong><br />{formData.yearsOfExperience}</p>
                <button  className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black " />

              <h3 className="text-xl font-semibold">Salary & Benefits</h3>
              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Salary Range:</strong><br />${formData.salaryMin} - ${formData.salaryMax}</p>
                <button  className="text-black0 hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              <div>
                <p><strong>Benefits:</strong></p>
                <div className="flex flex-wrap mb-2">
                  {formData.benefits.map((benefit, index) => (
                    <span key={index} className="border border-black text-gray-800 py-1 px-3 rounded-full text-sm flex items-center mb-2 mr-2">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(benefit)} // Ensure this function is defined
                        className="ml-2 text-black hover:text-red-700 focus:outline-none"
                        aria-label={`Remove ${benefit}`}
                      >
                        <i className="fas fa-times"></i> {/* X icon */}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <hr className="border-black" />

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Additional Perks:</strong><br />{formData.additionalPerks}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              <h3 className="text-xl font-semibold">Accessibility & PWD Support</h3>
              <div>
                <p><strong>Accessibility Features:</strong></p>
                <div className="flex flex-wrap mb-2">
                  {formData.accessibilityFeatures.map((feature, index) => (
                    <span key={index} className="border border-black text-gray-800 py-1 px-3 rounded-full text-sm flex items-center mb-2 mr-2">
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)} // Ensure this function is defined
                        className="ml-2 text-black hover:text-red-700 focus:outline-none"
                        aria-label={`Remove ${feature}`}
                      >
                        <i className="fas fa-times"></i> {/* X icon */}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <hr className="border-black" />

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Special Accommodations:</strong><br />{formData.specialAccommodations}</p>
                <button  className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const ConfirmDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-poppins">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full ">
        <h2 className=" text-[20px] font-bold mb-4 text-center">Confirm Submission</h2>
        <p className="mb-6 text-justify text-[14px] ">Are you sure you want to submit this job posting? Please review all the information carefully before confirming.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmDialog(false)}
            className="px-4 py-2 border border-black rounded-xl shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
    <NavEmployer />
    <div className="flex-1 p-8 bg-white pt-8 p-4 sm:ml-44 "> {/* flex-1 p-8 bg-white pt-20 p-4 sm:ml-64     max-w-4xl mx-auto p-8*/}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {renderStep()}
        <div className="flex justify-end  mt-8 mx-auto max-w-2xl">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="w-24 px-4 py-2 text-sm font-medium text-gray-700 bg-white border  border-black rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mr-4"
            >
              Back
            </button>
          )}
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="w-24 px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmDialog(true)}
              className="px-8 py-2 text-sm text-white bg-black rounded-full hover:bg-gray-800 focus:outline-none"
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {showConfirmDialog && <ConfirmDialog />}
  </div>
  </div>
  );
};

export default CreateJobPosting;

