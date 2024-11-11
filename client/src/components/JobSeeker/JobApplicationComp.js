import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import NavSeeker from '../ui/navSeeker';

const steps = [
  { id: 1, title: 'InputInfo' },
  { id: 2, title: 'ViewInfo' },
];

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state || {};
  //const [userInfo, setUserInfo] = useState({});
  const [authError, setAuthError] = useState(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [step, setStep] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  const [profileData, setProfileData] = useState({
    basicInfo: {
      email: '',
      phoneNumber: ''
    },
    jobPreferences: {
      desiredPosition: '',
      preferredStartDate: '',
      availability: '',
      accomodation: ''
    },
    workHistory: {
      previousJobTitle: '',
      companyName: '',
      duration: '',
      keyResponsibility: ''
    },
    documents: {
      resumeUrl: null,
      coverLetterUrl: null
    }
  });

  const [data, setData] = useState({

    basicInfo: {
      firstName: '',
      lastName: '',
      location: ''
    },

  });


  // <-------------------------------- Fectch data ------------------------------------->

  useEffect(() => {
    if (!id) {
      setErrorMessage('Missing job ID');
    }
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(false); // Start loading
        // Make the API request - cookies will be sent automatically
        const response = await axios.get('/api/seekers/profile', {
          withCredentials: true // This is important for sending cookies
        });

        // Check if we got valid data back
        if (response.data && response.data.basicInfo && response.data.locationInfo) {
          const basicInfo = response.data.basicInfo;
          const locationInfo = response.data.locationInfo;
          // const jobPreferences = response.data.jobPreferences || {};
          // const workHistory = response.data.workHistory || {};
          // const documents = response.data.documents || {};

          setData({
            basicInfo: {
              firstName: basicInfo.firstName || '',
              lastName: basicInfo.lastName || '',
              // email: basicInfo.email || '',
              // phoneNumber: basicInfo.phoneNumber || '',
              location: `${locationInfo.address || ''}, ${locationInfo.city || ''}, ${locationInfo.postal || ''}`
            },
            // jobPreferences: {
            //   desiredPosition: jobPreferences.desiredPosition || '',
            //   preferredStartDate: jobPreferences.preferredStartDate || '',
            //   availability: jobPreferences.availability || '',
            //   accomodation: jobPreferences.accomodation || ''
            // },
            // workHistory: {
            //   previousJobTitle: workHistory.previousJobTitle || '',
            //   companyName: workHistory.companyName || '',
            //   duration: workHistory.duration || '',
            //   keyResponsibility: workHistory.keyResponsibility || ''
            // },
            // documents: {
            //   resumeUrl: documents.resumeUrl || null,
            //   coverLetterUrl: documents.coverLetterUrl || null
            // }
          });
          setAuthError(null);
        } else {
          console.log('Invalid response data:', response.data);
          setAuthError('Unable to load profile data');
        }

      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
        
        if (error.response?.status === 401) {
          console.log('Unauthorized');
        } else if (error.response?.status === 404) {
          setAuthError('Profile not found. Please complete your profile setup.');
        } else {
          setAuthError(error.response?.data?.message || 'An error occurred while loading your profile');
        }
      }finally{
        setLoading(false); // stop loading
      }
    };

    fetchUserData();

  })

  // <-------------------------------- Handle Submit ------------------------------------->

    // Loader component
    const Loader = () => (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
        <p className="mt-2 text-gray-700">Loading...</p>
      </div>
    );


  // <-------------------------------- Handle Change ------------------------------------->


  const handleChange = (section, field, value) => {
    setProfileData(prevData => ({
      ...prevData,
      [section]: { ...prevData[section], [field]: value }
    }));
  };

  const handleChangeBasicInfo = (field, value) => {
    setData(prevData => ({
      ...prevData,
      basicInfo: { ...prevData.basicInfo, [field]: value }
    }));
  };

  const validateForm = () => {
    const errors = [];
    const { basicInfo } = profileData;

    //if (!basicInfo.firstName?.trim()) errors.push('First name is required');
    //if (!basicInfo.lastName?.trim()) errors.push('Last name is required');
    if (!basicInfo.email?.trim()) errors.push('Email is required');
    if (!basicInfo.phoneNumber?.trim()) errors.push('Phone number is required');
    //if (!basicInfo.location?.trim()) errors.push('Location is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  };


  const validateInputs = () => {

    if(step === 1){ 

      // Check the profile Data
      const { basicInfo, jobPreferences, workHistory, documents } = profileData;

      

      // Validate all fields
      if ( /*!basicInfo.firstName?.trim || !basicInfo.lastName?.trim || */ !basicInfo.email?.trim || !basicInfo.phoneNumber?.trim /*|| !basicInfo.location?.trim*/) {
        alert("Please fill in all personal information fields.");
        return false;
      }
      if(!jobPreferences.desiredPosition?.trim() || !jobPreferences.preferredStartDate?.trim() || !jobPreferences.availability?.trim() || !jobPreferences.accomodation?.trim()){
        alert("Please fill in all job preferences fields.");
        return false;
      }
      if(!workHistory.companyName?.trim() || !workHistory.previousJobTitle?.trim() || !workHistory.duration?.trim() || !workHistory.keyResponsibility?.trim()){
        alert("Please fill in all work history fields.");
        return false;
      }
      if(!documents.resumeUrl || !documents.coverLetterUrl){
        alert("Please upload documents.");
        return false;
      }
      
    }
    return true;  // All validations passed
  }

  const handleSubmit = async (event) => {
    setShowConfirmDialog(false);
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
  
    try {
      // Retrieve job seeker ID from local storage
      const jobseekerId = localStorage.getItem('userId');
      console.log('JobSeeker ID from localStorage:', jobseekerId); // Debug log
  
      if (!jobseekerId) {
        setErrorMessage('User ID not found. Please log in again.');
        setSubmitting(false);
        return;
      }
  
      // Validate form
      const validation = validateForm();
      if (!validation.isValid) {
        setErrorMessage(validation.errors.join(', '));
        setSubmitting(false);
        return;
      }

      // Prepare application data
      const applicationData = {
        jobId: id,
        basicInfo: {
          firstName: data.basicInfo.firstName.trim(),
          lastName: data.basicInfo.lastName.trim(),
          email: profileData.basicInfo.email.trim(),
          phoneNumber: profileData.basicInfo.phoneNumber.trim(),
          location: data.basicInfo.location.trim(),
        },
        workHistory: {
          previousJobTitle: profileData.workHistory.previousJobTitle?.trim() || '',
          companyName: profileData.workHistory.companyName?.trim() || '',
          duration: profileData.workHistory.duration?.trim() || '',
          keyResponsibility: profileData.workHistory.keyResponsibility?.trim() || '',
        },
        jobPreferences: {
          desiredPosition: profileData.jobPreferences.desiredPosition?.trim() || '',
          preferredStartDate: profileData.jobPreferences.preferredStartDate || null,
          availability: profileData.jobPreferences.availability?.trim() || '',
          accomodation: profileData.jobPreferences.accomodation?.trim() || ''
        },
        documents: {
          resumeUrl: profileData.documents.resumeUrl || '',
          coverLetterUrl: profileData.documents.coverLetterUrl || '',
        },
      };
  
      const response = await axios.post('/api/applications/submit', applicationData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        alert('Application submitted successfully!');
        //navigate('/applications');
        navigate('/job-list');
      } else {
        setErrorMessage(response.data.message || 'Failed to submit application');
        alert('Application Failed');
      }
    } catch (error) {
      console.error('Full submission error:', error.response || error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to submit application';
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }

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
        <div className="container font-poppins">
          <section className="mb-8">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Personal Information</h2>
            <p className="text-center text-gray-500 mb-4 text-[15px]">
            Please provide your personal details.
            </p>
            <div className="grid grid-cols-1">
       
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  First Name
                </label>            
                <input
                  type="text"
                  value={data.basicInfo.firstName || ''}
                  onChange={(e) => handleChangeBasicInfo('firstName', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="First Name"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Last Name
                </label>            
                <input
                  type="text"
                  value={data.basicInfo.lastName || ''}
                  onChange={(e) => handleChangeBasicInfo('lastName', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Last Name"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Email
                </label>            
                <input
                  type="text"
                  value={profileData.basicInfo.email || ''}
                  onChange={(e) => handleChange('basicInfo', 'email', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Email"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Phone Number
                </label>            
                <input
                  type="number"
                  value={profileData.basicInfo.phoneNumber || ''}
                  onChange={(e) => handleChange('basicInfo', 'phoneNumber', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Phone Number"
                />
              </div> 

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Current Location
                </label>            
                <input
                  type="text"
                  value={data.basicInfo.location || ''}
                  onChange={(e) => handleChangeBasicInfo('location', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Current Location"
                />
              </div> 
            </div>
          </section>


          <section className="mb-8">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Your Job Preferences</h2>
            <p className="text-center text-[15px] text-gray-500 mb-4">
            Select your preferences related to the job. Make sure to choose the options that match your experience.
            </p>
            <div className="grid grid-cols-1">
              
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Desired Positions
                </label>            
                <input
                  type="text"
                  value={profileData.jobPreferences.desiredPosition|| ''}
                  onChange={(e) => handleChange('jobPreferences', 'desiredPosition', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Desired Positions"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Preferred Start Date
                </label>            
                <input
                  type="date"
                  value={profileData.jobPreferences.preferredStartDate || ''}
                  onChange={(e) => handleChange('jobPreferences', 'preferredStartDate', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Preferred Start Date"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Availability
                </label>            
                <input
                  type="text"
                  value={profileData.jobPreferences.availability || ''}
                  onChange={(e) => handleChange('jobPreferences', 'availability', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Availability"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Accommodation Needed
                </label>            
                <textarea
                  type="text"
                  value={profileData.jobPreferences.accomodation || ''}
                  onChange={(e) => handleChange('jobPreferences', 'accomodation', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Accomodation Needed"
                />
              </div> 
            </div>
          </section>


          <section className="mb-8">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Work History</h2>
            <p className="text-center text-[15px] text-gray-500 mb-4">
            List your relevant work experiences. Focus on jobs or roles related to this position.
            </p>
            <div className="grid grid-cols-1">
              
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Previous Job Title
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.previousJobTitle || ''}
                  onChange={(e) => handleChange('workHistory', 'previousJobTitle', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Previous Job Title"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Company Name
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.companyName || ''}
                  onChange={(e) => handleChange('workHistory', 'companyName', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Company Name"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Duration
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.duration || ''}
                  onChange={(e) => handleChange('workHistory', 'duration', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Duration"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Key Responsibility
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.keyResponsibility || ''}
                  onChange={(e) => handleChange('workHistory', 'keyResponsibility', e.target.value)}
                  className="w-full bg-[#D9D9D9] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Key Responsibility"
                />
              </div> 
            </div>
          </section>


          <section className="mb-8">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Upload Your Resume & Cover Letter</h2>
            <p className="text-center text-[15px] text-gray-500 mb-4">
            Upload your latest resume and an optional cover letter explaining why you’re a great fit for this job.
            </p>
            <div className="grid grid-cols-1">
              
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Upload your Resume URL
                </label>            
                <input
                  type="url"
                  // accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                  value={profileData.documents.resumeUrl || ''}
                  onChange={(e) => handleChange('documents', 'resumeUrl', e.target.value)}
                  className="w-full bg-[#F4F4F4] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Resume URL"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Upload your Cover Letter URL
                </label>            
                <input
                  type="url"
                  // accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                  value={profileData.documents.coverLetterUrl || ''}
                  onChange={(e) => handleChange('documents', 'coverLetterUrl', e.target.value)}
                  className="w-full bg-[#F4F4F4] text-gray-700 px-4 py-2 rounded-[5px]"
                  placeholder="Cover Letter URL"
                />
              </div>
            </div>
          </section>

        </div>
      )

      case 2:
      return(
        <>
          <section className="mb-8 font-poppins">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Personal Information</h2>
            <p className="text-center text-gray-500 mb-4 text-[15px]">
            Please provide your personal details.
            </p>
            <div className="grid grid-cols-1">
       
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  First Name:
                </label>            
                <input
                  type="text"
                  value={data.basicInfo.firstName || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Last Name:
                </label>            
                <input
                  type="text"
                  value={data.basicInfo.lastName || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Email:
                </label>            
                <input
                  type="text"
                  value={profileData.basicInfo.email || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Phone Number:
                </label>            
                <input
                  type="number"
                  value={profileData.basicInfo.phoneNumber || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div> 

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Current Location:
                </label>            
                <input
                  type="text"
                  value={data.basicInfo.location || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div> 
            </div>
          </section>


          <section className="mb-8">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Your Job Preferences</h2>
            <p className="text-center text-[15px] text-gray-500 mb-4">
            Select your preferences related to the job. Make sure to choose the options that match your experience.
            </p>
            <div className="grid grid-cols-1">
              
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Desired Positions:
                </label>            
                <input
                  type="text"
                  value={profileData.jobPreferences.desiredPosition || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Preferred Start Date:
                </label>            
                <input
                  type="date"
                  value={profileData.jobPreferences.preferredStartDate || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Availability:
                </label>            
                <input
                  type="text"
                  value={profileData.jobPreferences.availability || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Accommodation Needed:
                </label>            
                <textarea
                  type="text"
                  value={profileData.jobPreferences.accomodation || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div> 
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Work History</h2>
            <p className="text-center text-[15px] text-gray-500 mb-4">
            List your relevant work experiences. Focus on jobs or roles related to this position.
            </p>
            <div className="grid grid-cols-1">
              
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Previous Job Title:
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.previousJobTitle || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Company Name: 
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.companyName || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Duration:
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.duration || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                key Responsibility:
                </label>            
                <input
                  type="text"
                  value={profileData.workHistory.keyResponsibility || ''}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 border border-black rounded-xl"
                  disabled
                />
              </div> 
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-center text-lg font-semibold mb-2 mt-8">Upload Your Resume & Cover Letter</h2>
            <p className="text-center text-[15px] text-gray-500 mb-4">
            Upload your latest resume and an optional cover letter explaining why you’re a great fit for this job.
            </p>
            <div className="grid grid-cols-1">
              
              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                Uload Resume:
                </label>            
                <input
                  type="url"
                  // accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                  value={profileData.documents.resumeUrl || ''}
                  disabled
                  className="w-full bg-[#F4F4F4] text-gray-700 px-4 py-2 rounded-mdl"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-poppins text-[15px]">
                  Upload Cover Letter: 
                </label>            
                <input
                  type="url"
                  // accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                  value={profileData.documents.coverLetterUrl || ''}
                  disabled
                  className="w-full bg-[#F4F4F4] text-gray-700 px-4 py-2 rounded-mdl"
                />
              </div>
            </div>
          </section>
        
        </>
      )

      default:
        return null;
    }
  }

  const ConfirmDialog = () => (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-poppins">
      <div className="bg-white p-6 rounded-xl max-w-xl w-full ">
        <div className="ml-4 mr-4">
          <h2 className=" text-[20px] font-bold mb-4 text-center">Confirm Application</h2>
          <p className="mb-6 text-center text-[14px]">Please review your information before submitting. Once submitted, you won’t be able to make changes to your application.</p>
          
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmDialog(false)}
            className="px-4 py-2 border border-black rounded-xl shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50"
          >
            Review Application
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Confirm Application
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="font-poppins">
      {loading ? (
        <Loader />
      ) : (
      <>
        <NavSeeker /> 
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 border border-gray-500 border-2 hover:border-gray-900 p-2 rounded-xl mb-[10px]"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Job Details</span>
          </button>
        </div>
        <hr className="border-t border-gray-300 mt-0 mr-4 ml-4" />
        <div className="grid grid-flow-col justify-normal items-center p-6 ml-16 mr-16 gap-28">

        {jobData.jobTitle && (
          
          <>
          <div className="flex font-poppins max-w-8xl ">
            <div className="  w-1/4 " > 
              <h1 className="text-[36px] semi-bold">{jobData.jobTitle}</h1>
              <p className="text-gray-600 mb-4 text-[16px] ">{jobData.companyName}Company name</p>
            </div>

            <div className="ml-4   w-full w-3/4"  >
              <p className="text-gray-600 mb-4">{jobData.jobDescription}</p>
            </div>

          </div>
          </>
        )}
        </div>

        <hr className="border-t border-gray-300 mt-0 mr-4 ml-4" />

        <form onSubmit={(e) => e.preventDefault()} className="application-form p-6 max-w-xl mx-auto">
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          {renderStep()}

          <div className="flex justify-end gap-4">
            {step > 1 && ( // Conditional rendering
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-100 text-gray-700 px-8 py-2 border border-black rounded-full"
              >
                Back
              </button>
            )}
                  
            <button
              type="button"
              onClick={step === steps.length ? () => setShowConfirmDialog(true) : nextStep}
              className="bg-black text-white px-8 py-2 rounded-full"
            >
            {step === steps.length ? 'Apply Now' : 'Next'} 
            </button>
          </div>
        </form>
        {showConfirmDialog && <ConfirmDialog />}
      </>
      )}
    </div>
    
  );
};

export default ApplicationForm;
