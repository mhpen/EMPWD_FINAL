import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
//import logo from "../../assets/logo3.png";

const NavSeeker = () => {

  // <--------------------------------- State for profile panel --------------------------------->

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State for loading indicator
  const [userInfo, setUserInfo] = useState('');

  // <--------------------------------- Get Local Storage --------------------------------->

  const userId = localStorage.getItem("userId");
  console.log("userId", userId);

  // <--------------------------------- Fetch User Data --------------------------------->

  useEffect(() => {
    const fetchUserData = async () => {

      if (!userId) {
        console.error("User ID is not found in local storage.");
        return;
      }

      try {
        // Replace '/api/jobseeker' with your actual API base URL if needed
        const response = await axios.get(`/api/jobseekers/${userId}`);
        const basicInfo = response.data.basicInfo;

        setUserInfo({
          firstName: basicInfo.firstName,
          lastName: basicInfo.lastName
        });
        console.log("userInfo", userInfo);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  

  // <---------------------------- Functions ----------------------------->
  
  const toggleProfilePanel = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true); // Show loading indicator
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login"; // Redirect to login page
    }, 1000); // loading delay 1 sec
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // <--------------------------------- Render NAVIGATION --------------------------------->

  return (
    <div>
      <nav className="flex justify-between items-center p-6 font-poppins">
        <div className="flex items-center space-x-4">
          {/* <img src={logo} alt="logo" className="w-10 h-10 mr-1 ml-2" /> */}
          <span className="ml-4 text-xl font-semibold">EmpowerPWD</span>
          <div className="mx-4 border-l border-gray-700 h-6 hidden md:block"></div>
          <div className="hidden md:flex space-x-8 ml-8 font-poppins">
            <Link to="/job-list" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/job-list" className="text-gray-600 hover:text-black">Explore Jobs</Link>
            <Link to="/explore-companies" className="text-gray-600 hover:text-black">Explore Companies</Link>
            <Link to="/resources" className="text-gray-600 hover:text-black">Resources</Link>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 mr-4 relative">
          <span className="text-gray-600 hover:text-black cursor-pointer" onClick={toggleProfilePanel}>
            {userInfo.firstName} {userInfo.lastName || 'Guest'}
          </span>
          <div className="w-8 h-8 bg-black rounded-full cursor-pointer" onClick={toggleProfilePanel}></div>
          
          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
              <Link to="/view-UserProfile" className="block text-gray-600 hover:text-black mb-2">View Profile</Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-black"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-black focus:outline-none">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </nav>
      <hr className="border-t border-gray-300 mt-0 mr-4 ml-4" />

      {isOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4 font-poppins">
            <Link to="/job-list" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/job-list" className="text-gray-600 hover:text-black">Explore Jobs</Link>
            <Link to="/explore-companies" className="text-gray-600 hover:text-black">Explore Companies</Link>
            <Link to="/resources" className="text-gray-600 hover:text-black">Resources</Link>
            <Link to="/profile" className="text-gray-600 hover:text-black">View Profile</Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-black text-left"
            >
              Logout
            </button>
          </nav>
        </div>
      )}


      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelLogout} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={confirmLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                {isLoggingOut ? 'Logging out...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Loading Spinner */}
      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default NavSeeker;
