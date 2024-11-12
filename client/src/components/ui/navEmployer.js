import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Plus, LogOut, Settings, User, LayoutDashboard, Briefcase, FileText, ChevronUp, ChevronDown, Menu, MessageCircle, Bell, Users } from 'lucide-react';
import axios from "axios";
import logo from "../../assets/img/logo.svg";

const NavEmployer = () => {
   const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const [isLoggingOut, setIsLoggingOut] = useState(false);
   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
   const [selectedItem, setSelectedItem] = useState('Dashboard');
   const [userInfo, setUserInfo] = useState({ email: '', accessLevel: '' });
   const [authError, setAuthError] = useState(null);
   const navigate = useNavigate();
   const location = useLocation();
   const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

   const addMenuItems = [
      { label: 'Add Job', path: '/employers/create-job' },
      { label: 'Add User', path: '/employers/add-user' },
      { label: 'Add Company', path: '/employers/add-company' },
   ];

   const menuItems = [
      { 
         icon: <Plus size={20} />, 
         label: 'Add New', 
         isDropdown: true,
         subItems: addMenuItems
      },
      { icon: <Briefcase size={20} />, label: 'Jobs', path: '/job-dashboard' },
      { icon: <Users size={20} />, label: 'Users', path: '/employers/users' },
      { icon: <MessageCircle size={20} />, label: 'Messages', path: '/messages', badge: 2 },
      { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications', badge: 3 },
      { icon: <FileText size={20} />, label: 'Resources', path: '/*' },
      { icon: <User size={20} />, label: 'Applicants', path: '/employer/applications' },
   ];

   const accountMenuItems = [
      { icon: <Settings size={16} />, label: 'Settings' },
      { icon: <User size={16} />, label: 'Manage Account' },
      { icon: <LogOut size={16} />, label: 'Log Out' },
   ];

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/employers/profile', {
               headers: {
                  Authorization: `Bearer ${token}`
               }
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
      const currentPath = location.pathname;
      const foundItem = menuItems.find(item => item.path === currentPath);
      if (foundItem) {
         setSelectedItem(foundItem.label);
      }
   }, [location.pathname]);

   const handleLogoutClick = () => {
      setShowLogoutConfirm(true);
   };

   const confirmLogout = async () => {
      setIsLoggingOut(true);
      try {
         localStorage.removeItem('token');
         localStorage.removeItem('userRole');
         navigate('/login');
      } catch (error) {
         console.error('Logout error:', error);
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
         {/* Mobile menu button */}
         <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden fixed top-4 left-4 z-50"
         >
            <Menu size={24} />
         </button>

         {/* Sidebar */}
         <div className={`flex flex-col h-screen bg-gray-100 border-r border-gray-300 w-64 fixed transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            {/* Logo Section */}
            <div className="p-5 border-b border-gray-300">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                     <img src={logo} alt="logo" className="w-10 h-10 mr-1 ml-2" />
                  </div>
                  <span className="font-semibold text-gray-800">EmpowerPWD</span>
               </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-2 py-4">
               {menuItems.map((item, index) => (
                  <div key={index}>
                     {item.isDropdown ? (
                        <div className="relative">
                           <button
                              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                              className={`flex items-center w-full px-4 py-2 mt-1 text-gray-700 rounded-lg transition-all duration-200
                              ${selectedItem === item.label 
                                 ? 'bg-gray-300 text-black font-medium' 
                                 : 'hover:bg-gray-50'
                              }`}
                           >
                              <div className="relative">
                                 {item.icon}
                              </div>
                              <span className="ml-3">{item.label}</span>
                              {isAddMenuOpen ? <ChevronUp className="ml-auto" size={16} /> : <ChevronDown className="ml-auto" size={16} />}
                           </button>
                           
                           {/* Dropdown Menu */}
                           {isAddMenuOpen && (
                              <div className="ml-4 mt-1">
                                 {item.subItems.map((subItem, subIndex) => (
                                    <Link
                                       key={subIndex}
                                       to={subItem.path}
                                       className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                    >
                                       <span className="ml-3">{subItem.label}</span>
                                    </Link>
                                 ))}
                              </div>
                           )}
                        </div>
                     ) : (
                        <Link
                           to={item.path}
                           onClick={() => setSelectedItem(item.label)}
                           className={`flex items-center w-full px-4 py-2 mt-1 text-gray-700 rounded-lg transition-all duration-200 relative
                           ${selectedItem === item.label 
                              ? 'bg-gray-300 text-black font-medium' 
                              : 'hover:bg-gray-50'
                           }
                           `}
                        >
                           <div className="relative">
                              {item.icon}
                              {item.badge && (
                                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {item.badge}
                                 </span>
                              )}
                           </div>
                           <span className="ml-3">{item.label}</span>
                           {selectedItem === item.label && (
                              <div className="absolute left-0 w-1 h-8 bg-black rounded-r-lg" />
                           )}
                        </Link>
                     )}
                  </div>
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
