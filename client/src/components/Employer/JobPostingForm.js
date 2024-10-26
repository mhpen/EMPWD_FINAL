import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


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
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobLocation: 'Remote',
    industry: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const userId = localStorage.getItem('userId');

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
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
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
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-poppins text-[15px]">Employment Type</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
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
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
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
                <label className="block  mb-2 font-poppins text-[15px]">Key Skills or Competencies (comma-separated)</label>
                <input
                  type="text"
                  name="keySkills"
                  value={formData.keySkills.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'keySkills')}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Other Skills (Please specify)</label>
                <input
                  type="text"
                  name="otherSkills"
                  value={formData.otherSkills}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Required Education Level</label>
                <input
                  type="text"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"                  required
                />
              </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Years of Experience</label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"                  required
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
                <label className="block  mb-2 font-poppins text-[15px]">Benefits (comma-separated)</label>
                <input
                  type="text"
                  name="benefits"
                  value={formData.benefits.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'benefits')}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Additional Perks</label>
                <input
                  type="text"
                  name="additionalPerks"
                  value={formData.additionalPerks}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
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
                <label className="block  mb-2 font-poppins text-[15px]">Accessibility Features (comma-separated)</label>
                <input
                  type="text"
                  name="accessibilityFeatures"
                  value={formData.accessibilityFeatures.join(', ')}
                  onChange={(e) => handleArrayChange(e, 'accessibilityFeatures')}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block  mb-2 font-poppins text-[15px]">Any special accommodations or support (optional)</label>
                <textarea
                  name="specialAccommodations"
                  value={formData.specialAccommodations}
                  onChange={handleChange}
                  className="w-full p-3 border border-black rounded-xl focus:outline-none focus:border-black"
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

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Industry:</strong><br />{formData.industry}</p>
                <button  className="text-black hover:underline ml-2">Edit</button>
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
              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Key Skills:</strong><br />{formData.keySkills.join(', ')}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
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

              <div className="flex justify-between items-center">
                <p><strong>Benefits:</strong><br />{formData.benefits.join(', ')}</p>
                <button  className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Additional Perks:</strong><br />{formData.additionalPerks}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
              </div>
              <hr className="border-black" />

              <h3 className="text-xl font-semibold">Accessibility & PWD Support</h3>
              <div className="flex justify-between items-center text-[15px]">
                <p><strong>Accessibility Features:</strong><br />{formData.accessibilityFeatures.join(', ')}</p>
                <button className="text-black hover:underline ml-2">Edit</button>
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
    <Header />
    <div className="max-w-4xl mx-auto p-8">
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