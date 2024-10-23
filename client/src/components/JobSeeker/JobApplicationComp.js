import React, { useState } from 'react';
import axios from 'axios';

const JobApplication = () => {
   // Define the states for different sections of the form
   const [personalInfo, setPersonalInfo] = useState({
      fullName: '',
      email: '',
      phoneNumber: '',
      currentLocation: '',
   });

   const [jobPreferences, setJobPreferences] = useState({
      desiredPosition: '',
      preferredStartDate: '',
      currentLocation: '',
      availability: '',
      accomudation: '',
   });

   const [workHistory, setWorkHistory] = useState([
      {
         previousJobTitle: '',
         companyName: '',
         duration: '',
         keyResponsibility: '',
      },
   ]);

   const [resume, setResume] = useState({
      resumeFile: null,
      coverLetterFile: null,
   });

   const [status, setStatus] = useState('');

   // Handlers to update state when inputs change
   const handlePersonalInfoChange = (e) => {
      setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
   };

   const handleJobPreferencesChange = (e) => {
      setJobPreferences({ ...jobPreferences, [e.target.name]: e.target.value });
   };

   const handleWorkHistoryChange = (index, e) => {
      const newWorkHistory = [...workHistory];
      newWorkHistory[index][e.target.name] = e.target.value;
      setWorkHistory(newWorkHistory);
   };

   const handleResumeChange = (e) => {
      const { name, files } = e.target;
      if (files.length > 0) {
         setResume({ ...resume, [name]: files[0] });
      }
   };

   const handleSubmit = async (e) => {

      e.preventDefault();
      
      const jobApplicationData = {
         personalInformation: personalInfo,
         jobPreferences: jobPreferences,
         workHistory: workHistory,
         resume: resume,
         applicationStatus: status || 'pending', // Set default status as 'pending'
         
      };

      try {
         const response = await axios.post('/api/jobapplications', jobApplicationData); // Send data to the createJobApplication controller
         console.log('Job Application Submitted:', response.data);
         console.log({ personalInfo, jobPreferences, workHistory, resume });
      } catch (err) {
         console.error('Error Submitting Job Application:', err);
         alert('Error Submitting Job Application:', err)
      }

      
   };

   return (
      <form className="max-w-3xl mx-auto p-4" onSubmit={handleSubmit}>
         
         {/* Personal Information Section */}
         <section className="mb-8">
         <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
         <p className="text-sm text-gray-500 mb-4">Please provide your personal details. Some fields may already be filled from your profile.</p>
         
         <div className="grid grid-cols-1 gap-4">
            <input
               type="text"
               name="fullName"
               placeholder="Full Name"
               value={personalInfo.fullName}
               onChange={handlePersonalInfoChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               disabled
            />
            <input
               type="email"
               name="email"
               placeholder="Email"
               value={personalInfo.email}
               onChange={handlePersonalInfoChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               disabled
            />
            <input
               type="Number"
               name="phoneNumber"
               placeholder="Phone Number"
               value={personalInfo.phoneNumber}
               onChange={handlePersonalInfoChange}
               className="border border-gray-300 p-2 rounded-md w-full"
            />
            <input
               type="text"
               name="currentLocation"
               placeholder="Current Location"
               value={personalInfo.currentLocation}
               onChange={handlePersonalInfoChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               disabled
            />
         </div>
         </section>

         {/* Job Preferences Section */}
         <section className="mb-8">
         <h2 className="text-lg font-semibold mb-2">Your Job Preferences</h2>
         <p className="text-sm text-gray-500 mb-4">Select your preferences related to the job. Make sure to choose the options that match your experience.</p>

         <div className="grid grid-cols-1 gap-4">
            <input
               type="text"
               name="desiredPosition"
               placeholder="Desired Position"
               value={jobPreferences.desiredPosition}
               onChange={handleJobPreferencesChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               required
            />
            <input
               type="date"
               name="preferredStartDate"
               value={jobPreferences.preferredStartDate}
               onChange={handleJobPreferencesChange}
               className="border border-gray-300 p-2 rounded-md w-full"
            />
            <input
               type="text"
               name="currentLocation"
               placeholder="Current Location"
               value={jobPreferences.currentLocation}
               onChange={handleJobPreferencesChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               required
            />
            <input
               type="text"
               name="availability"
               placeholder="Availability"
               value={jobPreferences.availability}
               onChange={handleJobPreferencesChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               required
            />
            <textarea 
               name="accomudation"
               placeholder="Accomudation Needed"
               value={jobPreferences.accomudation}
               onChange={handleJobPreferencesChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               required
            />
         </div>
         </section>

         {/* Work History Section */}
         <section className="mb-8">
         <h2 className="text-lg font-semibold mb-2">Work History</h2>
         <p className="text-sm text-gray-500 mb-4">List your relevant work experience. Focus on jobs or roles related to this position.</p>

         {workHistory.map((history, index) => (
            <div key={index} className="grid grid-cols-1 gap-4 mb-4">
               <input
                  type="text"
                  name="previousJobTitle"
                  placeholder="Previous Job Title"
                  value={history.previousJobTitle}
                  onChange={(e) => handleWorkHistoryChange(index, e)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
               />
               <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={history.companyName}
                  onChange={(e) => handleWorkHistoryChange(index, e)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
               />
               <input
                  type="text"
                  name="duration"
                  placeholder="Duration"
                  value={history.duration}
                  onChange={(e) => handleWorkHistoryChange(index, e)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
               />
               <input
                  type="text"
                  name="keyResponsibility"
                  placeholder="Key Responsibility"
                  value={history.keyResponsibility}
                  onChange={(e) => handleWorkHistoryChange(index, e)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  required
               />
            </div>
         ))}
         </section>

         {/* Resume and Cover Letter Section */}
         <section className="mb-8">
         <h2 className="text-lg font-semibold mb-2">Upload Your Resume & Cover Letter</h2>
         <p className="text-sm text-gray-500 mb-4">Upload your latest resume and an optional cover letter explaining why you're a great fit for this job.</p>

         <div className="grid grid-cols-1 gap-4">
            <input
               type="file"
               name="resumeFile"
               accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
               onChange={handleResumeChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               required
            />
            <input
               type="file"
               name="coverLetterFile"
               accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
               onChange={handleResumeChange}
               className="border border-gray-300 p-2 rounded-md w-full"
               required
            />
         </div>
         </section>

         {/* Buttons */}
         <div className="flex justify-between">
         <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
         >
            Back
         </button>
         <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md"
         >
            Next
         </button>
         </div>
      </form>
   );
};

export default JobApplication;





// HANDLE API

/*


  const handleSubmit = async (e) => {
      e.preventDefault();
      
      const jobApplicationData = {
         personalInformation: personalInfo,
         jobPreferences: jobPreferences,
         workHistory: workHistory,
         resume: resume,
         applicationStatus: status || 'pending', // Set default status as 'pending'
      };

      try {
         const response = await axios.post('/api/jobapplications', jobApplicationData); // Send data to the createJobApplication controller
         console.log('Job Application Submitted:', response.data);
      } catch (err) {
         console.error('Error Submitting Job Application:', err);
      }
   };


   // Handle Fecth Data
   useEffect(() => {
      const fetchApplications = async () => {
         try {
            const response = await axios.get('/api/jobapplications');
            console.log('Job Applications:', response.data);
         } catch (err) {
            console.error('Error fetching job applications:', err);
         }
      };

      fetchApplications();
   }, []);



   // Handle Updates
   const updateApplication = async (applicationId, updatedData) => {
      try {
         const response = await axios.put(`/api/jobapplications/${applicationId}`, updatedData);
         console.log('Job Application Updated:', response.data);
      } catch (err) {
         console.error('Error updating job application:', err);
      }
   };



   // Handle Delete
   const deleteApplication = async (applicationId) => {
      try {
         const response = await axios.delete(`/api/jobapplications/${applicationId}`);
         console.log('Job Application Deleted:', response.data);
      } catch (err) {
         console.error('Error deleting job application:', err);
      }
   };





*/ 