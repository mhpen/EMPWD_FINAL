import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NavSeeker from '../ui/navSeeker';
import { ChevronLeft } from 'lucide-react';

const SeekerProfile = () => {
   const [profile, setProfile] = useState({});
   const [loading, setLoading] = useState(true); // Added loading state
   const [authError, setAuthError] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const response = await axios.get('/api/seekers/profile', {
               withCredentials: true // This is important for sending cookies
            });

            if (response.data && response.data.basicInfo && response.data.locationInfo) {
               setProfile({
                  firstName: response.data.basicInfo.firstName || '',
                  lastName: response.data.basicInfo.lastName || '',
                  country: response.data.locationInfo.country || '',
               });
               setAuthError(null);
            } else {
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
         } finally {
            setLoading(false); // Set loading to false after data is fetched
         }
      };

      fetchUserData();
   }, [navigate]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <div className="text-gray-500 text-xl">Loading...</div>
         </div>
      );
   }

   return (
      <>
         <NavSeeker/>
         

         <div className="max-w-6xl mx-auto text-gray-700 text-lg font-semibold font-poppins">
            <button
               onClick={() => navigate(-1)}
               className=" ml-2 flex items-center text-gray-600 text-lg hover:text-gray-900"
            >
               <ChevronLeft className="h-5 w-5" />
               <span>Back</span>
            </button>
         </div>

         <div className="max-w-6xl mx-auto p-4 font-poppins">

            {authError ? (
               <div className="text-red-500 text-center">{authError}</div>
            ) : (
               <>
                  <div className="flex items-center space-x-4">
                     <div className="w-24 h-24 bg-black rounded-full"></div>
                     <div>
                        <h1 className="text-2xl font-bold">
                           {profile.firstName} {profile.lastName}
                        </h1>
                        <p className="text-gray-500">
                           {profile.country}
                        </p>
                        <p className="text-gray-500">Add Email Address</p>
                     </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                     <Link to="/my-application" className="border border-gray-400 rounded px-4 py-2">My Applications</Link>
                     {/* <button className="border border-gray-400 rounded px-4 py-2">Save Jobs</button> */}
                  </div>
                  <hr className="my-4"/>
                  {/* <div>
                     <h2 className="text-lg font-semibold">Resume</h2>
                     <div className="mt-2 p-4 bg-gray-200 rounded flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <div className="w-12 h-12 bg-gray-400"></div>
                           <span>Attachment Name.pdf</span>
                        </div>
                        <i className="fas fa-ellipsis-h"></i>
                     </div>
                  </div>
                  <div className="mt-4">
                     <h2 className="text-lg font-semibold">Additional Information</h2>
                     <div className="mt-2 space-y-3">
                        <button className="p-4 bg-gray-200 rounded flex justify-between items-center w-full">
                           <span>Disability Information</span>
                           <i className="fas fa-chevron-right"></i>
                        </button>
                        <button className="p-4 bg-gray-200 rounded flex justify-between items-center w-full">
                           <span>Qualifications</span>
                           <i className="fas fa-chevron-right"></i>
                        </button>
                        <button className="p-4 bg-gray-200 rounded flex justify-between items-center w-full">
                           <span>Job Preferences</span>
                           <i className="fas fa-chevron-right"></i>
                        </button>
                     </div>
                  </div> */}
               </>
            )}
         </div>

      </>
   )
}

export default SeekerProfile;
