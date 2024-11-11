import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Eye, ClipboardCheck } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import SidebarAdmin from './sideNavAdmin';

const UserManagementSystem = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userType, setUserType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isVerifiedFilter, setIsVerifiedFilter] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);

  // Check authorization on component mount
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (!userRole || !userId) {
      setError('Please log in to access this page');
      setIsAuthorized(false);
      return;
    }

    if (userRole !== 'admin') {
      setError('You do not have permission to access this page');
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
    fetchUsers();
  }, []);

  // Fetch users when filters change
  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
    }
  }, [userType, currentPage, searchQuery, isVerifiedFilter, isAuthorized]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Only include defined query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', 10);
      queryParams.append('sortBy', 'createdAt');
      queryParams.append('order', 'desc');
      
      if (userType !== 'all') {
        queryParams.append('role', userType.toLowerCase());
      }
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      if (isVerifiedFilter !== null) {
        queryParams.append('verified', isVerifiedFilter);
      }

      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      const response = await fetch(`/api/admin/management/users?${queryParams}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
          'X-User-Role': userRole
        },
      });

      if (response.status === 403) {
        throw new Error('You do not have permission to access this resource');
      }

      if (response.status === 401) {
        throw new Error('Session expired. Please log in again');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      setError(error.message);
      if (error.message.includes('Session expired')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewUser = async (userId) => {
    setReviewMode(true);
    window.location.href = `/admin/users/${userId}/review`;
    setOpenDropdownId(null);
  };

  const handleStatusChange = async (userId, isVerified) => {
    setActionLoading(true);
    setActionStatus(null);
    try {
      const response = await fetch(`/api/admin/management/users/${userId}/verify`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': localStorage.getItem('userId'),
          'X-User-Role': localStorage.getItem('userRole')
        },
        body: JSON.stringify({ isVerified })
      });

      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      await fetchUsers();
      setOpenDropdownId(null);
      setActionStatus({
        type: 'success',
        message: `User successfully ${isVerified ? 'verified' : 'unverified'}`
      });
    } catch (error) {
      setActionStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('This action cannot be undone. Are you sure you want to delete this user?')) {
      return;
    }

    setActionLoading(true);
    setActionStatus(null);
    try {
      const response = await fetch(`/api/admin/management/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': localStorage.getItem('userId'),
          'X-User-Role': localStorage.getItem('userRole')
        }
      });

      if (response.status === 403) {
        throw new Error('You do not have permission to perform this action');
      }

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      await fetchUsers();
      setOpenDropdownId(null);
      setActionStatus({
        type: 'success',
        message: 'User successfully deleted'
      });
    } catch (error) {
      setActionStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  const handleViewUser = (userId) => {
    window.location.href = `/admin/users/${userId}`;
    setOpenDropdownId(null);
  };

  const toggleDropdown = (userId) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  if (!isAuthorized) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Unauthorized access'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 font-poppins">
      <SidebarAdmin />
      
      <div> 
        <div className="p-5 sm:ml-64">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management System</h1>
            {/* <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              Add user
            </button> */}
          </div>

          {/* Global Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Status Alert */}
          {actionStatus && (
            <Alert 
              variant={actionStatus.type === 'success' ? 'default' : 'destructive'} 
              className="mb-6"
            >
              <AlertDescription>
                {actionStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 rounded-lg border ${
                  userType === 'jobseeker' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
                onClick={() => setUserType('jobseeker')}
              >
                Job Seeker
              </button>
              <button 
                className={`px-4 py-2 rounded-lg border ${
                  userType === 'employer' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
                onClick={() => setUserType('employer')}
              >
                Employer
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className={`px-4 py-2 border rounded-lg flex items-center ${
                  isVerifiedFilter !== null ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
                onClick={() => setIsVerifiedFilter(isVerifiedFilter === null ? true : null)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {isVerifiedFilter === null ? 'All Users' : 'Verified Users'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Date Created</th>
                    <th className="text-left p-4">Account Status</th>
                    <th className="w-[50px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center p-4">Loading...</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-4">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="p-4">{user.profile?.basicInfo?.name || user.email}</td>
                        <td className="p-4 capitalize">{user.role}</td>
                        <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            user.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <button 
                              onClick={() => toggleDropdown(user._id)}
                              className="p-1 hover:bg-gray-100 rounded-full"
                              disabled={actionLoading}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            
                            {openDropdownId === user._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                                {/* <button
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 flex items-center"
                                  onClick={() => handleViewUser(user._id)}
                                  disabled={actionLoading}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </button> */}
                                {!user.isVerified && (
                                  <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50 flex items-center"
                                    onClick={() => handleReviewUser(user._id)}
                                    disabled={actionLoading}
                                  >
                                    <ClipboardCheck className="w-4 h-4 mr-2" />
                                    Review Account
                                  </button>
                                )}
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                                  onClick={() => handleStatusChange(user._id, !user.isVerified)}
                                  disabled={actionLoading}
                                >
                                  {user.isVerified ? 'Unverify ' : 'Verify '}User
                                </button>
                                <button 
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 disabled:opacity-50"
                                  onClick={() => handleDeleteUser(user._id)}
                                  disabled={actionLoading}
                                >
                                  Delete User
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center p-4 border-t">
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1 || actionLoading}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages || actionLoading}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSystem;  