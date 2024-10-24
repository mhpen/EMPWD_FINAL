import React, { useState } from 'react';
import axios from 'axios';

const steps = [
  { id: 1, title: 'InputInfo' },
  { id: 2, title: 'ViewInfo' },
];

const JobApplication = () => {
   const [step, setStep] = useState(1);
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
      accommodation: '', // Fixed typo here
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

   // Validation function
   const validateInputs = () => {
      if (step === 1) {
         // Check personal info fields
         const { fullName, email, phoneNumber, currentLocation } = personalInfo;
         const { desiredPosition, preferredStartDate, availability } = jobPreferences;
         const isWorkHistoryComplete = workHistory.every(history =>
            history.previousJobTitle && history.companyName && history.duration && history.keyResponsibility
         );
         const {resumeFile, coverLetterFile } = resume;

         // Validate all fields
         if (!fullName || !email || !phoneNumber || !currentLocation) {
            alert("Please fill in all personal information fields.");
            return false;
         }
         if (!desiredPosition || !preferredStartDate || !availability) {
            alert("Please fill in all job preference fields.");
            return false;
         }
         if (!isWorkHistoryComplete) {
            alert("Please complete all fields in your work history.");
            return false;
         }
         if (!resumeFile || !coverLetterFile) {
            alert("Please upload your resume and cover letter.");
            return false;
         }

      }
      return true; // All validations passed
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      const jobApplicationData = {
         personalInformation: personalInfo,
         jobPreferences: jobPreferences,
         workHistory: workHistory,
         resume: resume,
         applicationStatus: status || 'pending',
      };

      try {
         const response = await axios.post('/api/jobapplications/create', jobApplicationData);
         console.log('Job Application Submitted:', response.data);
         alert('Job Application Submitted');
         console.log({ personalInfo, jobPreferences, workHistory, resume });
      } catch (err) {
         console.error('Error Submitting Job Application:', err);
         alert('Error Submitting Job Application');
      }
      console.log(jobApplicationData);
   };

   const nextStep = () => {
      if (validateInputs()) {
         setStep(step + 1);
      }
   };

   const prevStep = () => setStep(step - 1);

   const renderStep = () => {
      switch (step) {
         case 1:
            return (
               <div>
                  <section className="mb-8">
                     <h2 className="text-center text-lg font-semibold mb-2 mt-8">Personal Information</h2>
                     <p className="text-center text-sm text-gray-500 mb-4">
                     Please provide your personal details. Some fields may already be filled from your profile.
                     </p>
                     <div className="grid grid-cols-1 gap-4">
                        <input
                           type="text"
                           name="fullName"
                           placeholder="Full Name"
                           value={personalInfo.fullName}
                           onChange={handlePersonalInfoChange}
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="email"
                           name="email"
                           placeholder="Email"
                           value={personalInfo.email}
                           onChange={handlePersonalInfoChange}
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="text"
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
                        />
                     </div>
                  </section>
               
                  <section className="mb-8">
                     <h2 className="text-center text-lg font-semibold mb-2">Your Job Preferences</h2>
                     <p className="text-center text-sm text-gray-500 mb-4">
                     Select your preferences related to the job. Make sure to choose the options that match your experience.
                     </p>
                     <div className="grid grid-cols-1 gap-4">
                        <input
                           type="text"
                           name="desiredPosition"
                           placeholder="Desired Position"
                           value={jobPreferences.desiredPosition}
                           onChange={handleJobPreferencesChange}
                           className="border border-gray-300 p-2 rounded-md w-full"
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
                        />
                        <input
                           type="text"
                           name="availability"
                           placeholder="Availability"
                           value={jobPreferences.availability}
                           onChange={handleJobPreferencesChange}
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <textarea
                           name="accommodation"
                           placeholder="Accommodation Needed"
                           value={jobPreferences.accommodation}
                           onChange={handleJobPreferencesChange}
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                     </div>
                  </section>

                  <section className="mb-8">
                     <h2 className="text-center text-lg font-semibold mb-2">Work History</h2>
                     <p className="text-center text-sm text-gray-500 mb-4">
                     List your relevant work experiences. Focus on jobs or roles related to this position.
                     </p>
                     {workHistory.map((history, index) => (
                        <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                           <input
                              type="text"
                              name="previousJobTitle"
                              placeholder="Previous Job Title"
                              value={history.previousJobTitle}
                              onChange={(e) => handleWorkHistoryChange(index, e)}
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                           <input
                              type="text"
                              name="companyName"
                              placeholder="Company Name"
                              value={history.companyName}
                              onChange={(e) => handleWorkHistoryChange(index, e)}
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                           <input
                              type="text"
                              name="duration"
                              placeholder="Duration"
                              value={history.duration}
                              onChange={(e) => handleWorkHistoryChange(index, e)}
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                           <input
                              type="text"
                              name="keyResponsibility"
                              placeholder="Key Responsibility"
                              value={history.keyResponsibility}
                              onChange={(e) => handleWorkHistoryChange(index, e)}
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                        </div>
                     ))}
                  </section>

                  <section className="mb-8">
                     <h2 className="text-center text-lg font-semibold mb-2">
                     Upload Your Resume & Cover Letter
                     </h2>
                     <p className="text-center text-sm text-gray-500 mb-4">
                     Upload your latest resume and an cover letter explaining why you’re a great fit for this job.
                     </p>
                     <div className="grid grid-cols-1 gap-4">
                        <input
                           type="file"
                           name="resumeFile"
                           accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                           onChange={handleResumeChange}
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="file"
                           name="coverLetterFile"
                           accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                           onChange={handleResumeChange}
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                     </div>
                  </section>
               </div>
            );
         case 2:
            return (
               <div>
                  <section className="mb-8">
                     <h1 className="text-center text-lg font-semibold mb-2 mt-8">Review Your Application</h1>
                     <p className="text-center text-sm text-gray-500 mb-10">
                     Please review the information you've provided before submitting.
                     </p>

                     <h2 className="text-center text-lg font-semibold mb-2">Personal Information</h2>
                     <div className="grid grid-cols-1 gap-4">
                        <input
                           type="text"
                           value={personalInfo.fullName}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="email"
                           value={personalInfo.email}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="text"
                           value={personalInfo.phoneNumber}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="text"
                           value={personalInfo.currentLocation}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                     </div>
                  </section>
               
                  <section className="mb-8">
                     <h2 className="text-center text-lg font-semibold mb-2">Your Job Preferences</h2>
                     <div className="grid grid-cols-1 gap-4">
                        <input
                           type="text"
                           value={jobPreferences.desiredPosition}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="date"
                           value={jobPreferences.preferredStartDate}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="text"
                           value={jobPreferences.currentLocation}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="text"
                           value={jobPreferences.availability}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <textarea
                           value={jobPreferences.accommodation}
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                     </div>
                  </section>

                  <section className="mb-8">
                     <h2 className="text-center text-lg font-semibold mb-2">Work History</h2>
                     {workHistory.map((history, index) => (
                        <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                           <input
                              type="text"
                              value={history.previousJobTitle}
                              disabled
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                           <input
                              type="text"
                              value={history.companyName}
                              disabled
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                           <input
                              type="text"
                              value={history.duration}
                              disabled
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                           <input
                              type="text"
                              value={history.keyResponsibility}
                              disabled
                              className="border border-gray-300 p-2 rounded-md w-full"
                           />
                        </div>
                     ))}
                  </section>

                  <section className="mb-8">
                     <h2 className="text-center text-lg font-semibold mb-2">
                     Upload Your Resume & Cover Letter
                     </h2>
                     <div className="grid grid-cols-1 gap-4">
                        <input
                           type="file"
                           name="resumeFile"
                           accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                        <input
                           type="file"
                           name="coverLetterFile"
                           accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                           disabled
                           className="border border-gray-300 p-2 rounded-md w-full"
                        />
                     </div>
                  </section>
               </div>
            )
         default:
            return null;
      }
   };

   return (
      <form className="max-w-3xl mx-auto p-4" onSubmit={handleSubmit}>
         {renderStep()}
            <div className="flex justify-between">
            {step > 1 && ( // Conditional rendering
               <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
               >
                  Back
               </button>
            )}
               
            <button
               type="button"
               onClick={step === steps.length ? handleSubmit : nextStep}
               className="bg-black text-white px-4 py-2 rounded-md"
            >
               {step === steps.length ? 'Submit' : 'Next'} 
            </button>
         </div>
      </form>
   );
};

export default JobApplication;


/*
return (
               <section className="mb-8">
                  <h1 className="text-lg font-semibold mb-2">Review Your Application</h1>
                  <p className="text-sm text-gray-500 mb-4">
                  Please review the information you've provided before submitting.
                  </p>

                  <div className="grid grid-cols-1 gap-9">
                     <div className="grid gap-3">
                        <h2 className="text-md font-semibold">Personal Information:</h2>
                        <p>Full Name: {personalInfo.fullName}</p>
                        <p>Email: {personalInfo.email}</p>
                        <p>Phone Number: {personalInfo.phoneNumber}</p>
                        <p>Current Location: {personalInfo.currentLocation}</p>
                     </div>

                     <div className="grid gap-3">
                        <h2 className="text-md font-semibold">Job Preferences:</h2>
                        <p>Desired Position: {jobPreferences.desiredPosition}</p>
                        <p>Preferred Start Date: {jobPreferences.preferredStartDate}</p>
                        <p>Current Location: {jobPreferences.currentLocation}</p>
                        <p>Availability: {jobPreferences.availability}</p>
                        <p>Accommodation Needed: {jobPreferences.accommodation}</p>
                     </div>

                     <div className="grid gap-3">
                        <h2 className="text-md font-semibold">Work History:</h2>
                        {workHistory.map((history, index) => (
                           <div key={index}>
                              <p>Previous Job Title: {history.previousJobTitle}</p>
                              <p>Company Name: {history.companyName}</p>
                              <p>Duration: {history.duration}</p>
                              <p>Key Responsibility: {history.keyResponsibility}</p>
                           </div>
                        ))}
                     </div>
                     
                     <div className="grid gap-3">
                        <h2 className="text-md font-semibold">Resume & Cover Letter:</h2>
                        <p>Resume: {resume.resumeFile ? resume.resumeFile.name : 'No File Uploaded'}</p>
                        <p>Cover Letter: {resume.coverLetterFile ? resume.coverLetterFile.name : 'No File Uploaded'}</p>
                     </div>
                  </div>
               </section>
            );





*/



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