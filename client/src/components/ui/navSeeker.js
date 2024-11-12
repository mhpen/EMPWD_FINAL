import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Bell } from 'lucide-react';
import logo from "../../assets/img/logo.svg";
import LoadingOverlay from './loadingOverlay'; // Import the LoadingOverlay component

const NavSeeker = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isVerified');
        localStorage.removeItem('userRole');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setIsLoggingOut(false);
        setShowLogoutConfirm(false);
      }
    }, 1000); // 1-second delay
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-white shadow-md z-50 sticky top-0">
        <div className="flex items-center pl-4 ">
          <img src={logo} alt="Company logo" className="w-12 h-12 mr-4" style={{ borderRadius: '2px' }}/>
          <Link to="/" className="font-bold text-lg">EmpowerPWD</Link>
          <div className="border-l-2 border-black h-6 mx-4 hidden md:block"></div>
          <div className="hidden md:flex space-x-4">
            <Link to="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Home</Link>
            <Link to="/job-list" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Explore Jobs</Link>
            <Link to="/companies" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Explore Companies</Link>
            <Link to="/companies" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Resources</Link>
          </div>
        </div>
        <div className="flex items-center space-x-4 pr-4">
          <div className="relative">
            <button onClick={() => navigate('/messages')} className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
          </div>

          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">5</span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">JD</div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Your application was viewed</p>
                        <p className="text-sm text-gray-500">Google Inc. viewed your application</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <a href="#" className="text-sm text-blue-500 hover:text-blue-600">View all notifications</a>
                </div>
              </div>
            )}
          </div>

          <div className="relative ml-3">
            <button onClick={() => setShowMessagesDropdown(!showMessagesDropdown)} className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">JS</span>
              </div>
            </button>

            {showMessagesDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <Link to="/seeker/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                <Link to="/my-application" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Applications</Link>
                <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 max-w-md mx-auto">
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelLogout} className="bg-white px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white">Cancel</button>
              <button onClick={confirmLogout} className="bg-black rounded-full text-white px-4 py-2 hover:bg-red-600">
                {isLoggingOut ? 'Logging out...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay when logging out */}
      {isLoggingOut && <LoadingOverlay />}
    </>
  );
};

export default NavSeeker;
