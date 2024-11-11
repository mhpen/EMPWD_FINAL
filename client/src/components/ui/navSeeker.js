import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const NavSeeker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
  const [authError, setAuthError] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make the API request - cookies will be sent automatically
        const response = await axios.get('/api/seekers/profile', {
          withCredentials: true // This is important for sending cookies
        });

        // Check if we got valid data back
        if (response.data && response.data.basicInfo) {
          setUserInfo({
            firstName: response.data.basicInfo.firstName || 'Guest',
            lastName: response.data.basicInfo.lastName || ''
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
          navigate('/login');
        } else if (error.response?.status === 404) {
          setAuthError('Profile not found. Please complete your profile setup.');
          navigate('/profile-setup');
        } else {
          setAuthError(error.response?.data?.message || 'An error occurred while loading your profile');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout endpoint - cookie will be sent automatically
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the logout request fails, navigate to login
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleProfilePanel = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // If there's an auth error, show it
  if (authError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{authError}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="flex justify-between items-center p-6 font-poppins">
        <div className="flex items-center space-x-4">
          <span className="ml-4 text-xl font-semibold">EmpowerPWD</span>
          <div className="mx-4 border-l border-gray-700 h-6 hidden md:block"></div>
          <div className="hidden md:flex space-x-8 ml-8 font-poppins">
            <Link to="/job-list" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/job-list" className="text-gray-600 hover:text-black">Explore Jobs</Link>
            <Link to="/*" className="text-gray-600 hover:text-black">Explore Companies</Link>
            <Link to="/*" className="text-gray-600 hover:text-black">Resources</Link>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 mr-4 relative">
          <span className="text-gray-600 hover:text-black cursor-pointer" onClick={toggleProfilePanel}>
            {userInfo.firstName} {userInfo.lastName}
          </span>
          <div className="w-8 h-8 bg-black rounded-full cursor-pointer" onClick={toggleProfilePanel}></div>
          
          {isProfileOpen && (
            <div className="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
              <Link to="/seeker/profile" className="block text-gray-600 hover:text-black mb-2">View Profile</Link>
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4 font-poppins">
            <Link to="/job-list" className="text-gray-600 hover:text-black">Home</Link>
            <Link to="/job-list" className="text-gray-600 hover:text-black">Explore Jobs</Link>
            <Link to="/explore-companies" className="text-gray-600 hover:text-black">Explore Companies</Link>
            <Link to="/resources" className="text-gray-600 hover:text-black">Resources</Link>
            <Link to="/view-UserProfile" className="text-gray-600 hover:text-black">View Profile</Link>
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
              <button onClick={cancelLogout} className="bg-white px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white">Cancel</button>
              <button onClick={confirmLogout} className="bg-black  rounded-full text-white px-4 py-2 rounded hover:bg-red-600">
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