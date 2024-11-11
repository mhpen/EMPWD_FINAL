import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Plus, LogOut, Settings, User, LayoutDashboard, Briefcase, FileText, ChevronUp, ChevronDown, Menu } from 'lucide-react';
import axios from "axios";

const NavEmployer = () => {
   const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for mobile sidebar
   const [isLoggingOut, setIsLoggingOut] = useState(false);
   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
   const [selectedItem, setSelectedItem] = useState('Dashboard');
   const [userInfo, setUserInfo] = useState({ email: '', accessLevel: '' });
   const [authError, setAuthError] = useState(null);
   const navigate = useNavigate();
   const location = useLocation(); // Get current location

   const menuItems = [
      { icon: <Briefcase size={20} />, label: 'Jobs', path: '/job-dashboard' },
      { icon: <Plus size={20} />, label: 'Create Job', path: '/employers/create-job' },
      { icon: <FileText size={20} />, label: 'Resources', path: '/*' }, // 404 not found muna
   ];

   const accountMenuItems = [
      { icon: <Settings size={16} />, label: 'Settings' },
      { icon: <User size={16} />, label: 'Manage Account' },
      { icon: <LogOut size={16} />, label: 'Log Out' },
   ];

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const response = await axios.get('/api/Employers/profile', {
               withCredentials: true
            });

            if (response.data && response.data.employerInfo) {
               setUserInfo({
                  email: response.data.employerInfo.email || '',
                  accessLevel: response.data.employerInfo.accessLevel || 'N/A'
               });
               setAuthError(null); 
            } else {
               console.log('Invalid response data:', response.data);
               setAuthError('Unable to load employer profile data');
            }
         } catch (error) {
            console.error("Error fetching employer data:", error.response || error);

            if (error.response?.status === 401) {
               console.log('Unauthorized');
               navigate('/login');
            } else {
               setAuthError(error.response?.data?.message || 'An error occurred while loading your profile');
            }
         }
      };

      fetchUserData();
   }, [navigate]);

   // Set selected item based on current path
   useEffect(() => {
      const currentPath = location.pathname; // Get the current path
      const foundItem = menuItems.find(item => item.path === currentPath);
      if (foundItem) {
         setSelectedItem(foundItem.label); // Set selected item based on path
      }
   }, [location.pathname, menuItems]);

   const handleLogoutClick = () => {
      setShowLogoutConfirm(true);
   };

   const confirmLogout = async () => {
      setIsLoggingOut(true);
      try {
         await axios.post('/api/auth/logout', {}, {
            withCredentials: true
         });
         navigate('/login');
      } catch (error) {
         console.error("Logout error:", error);
         navigate('/login');
      } finally {
         setIsLoggingOut(false);
         setShowLogoutConfirm(false);
      }
   };

   const cancelLogout = () => {
      setShowLogoutConfirm(false);
   };

   return (
      <div>
         {/* Toggle Button for Mobile */}
         <button
            className="p-2 bg-gray-900 text-white fixed top-4 left-4 z-50 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
         >
            <Menu size={24} />
         </button>

         {/* Sidebar */}
         <div className={`flex flex-col h-screen bg-gray-100 border-r border-gray-300 w-64 fixed transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            {/* Logo Section */}
            <div className="p-5 border-b border-gray-300">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                     <span className="text-white text-lg font-bold">E</span>
                  </div>
                  <span className="font-semibold text-gray-800">EmpowerPWD</span>
               </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-2 py-4">
               {menuItems.map((item, index) => (
                  <Link
                     key={index}
                     to={item.path}
                     onClick={() => setSelectedItem(item.label)}
                     className={`flex items-center w-full px-4 py-2 mt-1 text-gray-700 rounded-lg transition-all duration-200 relative
                     ${selectedItem === item.label 
                        ? 'bg-gray-300 text-black font-medium' 
                        : 'hover:bg-gray-50'
                     }
                     `}
                  >
                     {item.icon}
                     <span className="ml-3">{item.label}</span>
                     {selectedItem === item.label && (
                        <div className="absolute left-0 w-1 h-8 bg-black rounded-r-lg" />
                     )}
                  </Link>
               ))}
            </nav>

            {/* Account Section */}
            <div className="border-t border-gray-200">
               <div className="p-4 relative">
                  <button
                     onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                     className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                     <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                           <User size={20} />
                        </div>
                        <div className="ml-3">
                           <p className="font-medium">{userInfo.accessLevel}</p>
                           <p className="text-sm text-gray-500">{userInfo.email || 'Employer'}</p>
                        </div>
                     </div>
                     {isAccountMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {/* Account Menu Dropdown */}
                  {isAccountMenuOpen && (
                     <div className="absolute bottom-full left-0 w-full p-2 mb-2 animate-slideUp">
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                           {accountMenuItems.map((item, index) => (
                              <button
                                 key={index}
                                 onClick={item.label === 'Log Out' ? handleLogoutClick : () => {}}
                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                              >
                                 {item.icon}
                                 <span className="ml-3">{item.label}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Confirmation Dialog */}
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

         {/* Loading Spinner */}
         {isLoggingOut && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
               <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
            </div>
         )}
      </div>
   );
};

export default NavEmployer;
