import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Star, MoreHorizontal, X, Archive, Trash2, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "../ui/alert.js";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Open');
  const [searchTerm, setSearchTerm] = useState('');
  const [starredJobs, setStarredJobs] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    candidateCount: 'all',
    location: 'all'
  });

  const jobStatuses = ['All', 'Open', 'Closed', 'Draft', 'Archived'];
  const dropdownRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token'); // Make sure you're storing the token on login
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
  
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '10',
        status: selectedStatus !== 'All' ? selectedStatus : '',
        search: searchTerm || ''
      }).toString();
  
      const response = await fetch(`/api/jobs/employer/${userId}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add token to headers
        },
        credentials: 'include'
      });
      
      if (response.status === 401) {  
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch jobs');
      }
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load jobs');
      }
  
      setJobs(data.data || []);
      
      const starredSet = new Set(
        (data.data || [])
          .filter(job => job.isStarred)
          .map(job => job._id)
      );
      setStarredJobs(starredSet);
  
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
      
      if (err.message === 'User not authenticated') {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    const savedStarredJobs = localStorage.getItem('starredJobs');
    if (savedStarredJobs) {
      setStarredJobs(new Set(JSON.parse(savedStarredJobs)));
    }

    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [selectedStatus, searchTerm]);

  useEffect(() => {
    localStorage.setItem('starredJobs', JSON.stringify([...starredJobs]));
  }, [starredJobs]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddJob = () => {
    navigate('/employers/create-job');
  };

  const toggleStar = async (jobId, currentStarStatus) => {
    try {
      const newStarStatus = !currentStarStatus;
      const userId = localStorage.getItem('userId');
  
      if (!userId) {
        throw new Error('Authentication required');
      }
  
      const response = await fetch(`/api/jobs/${jobId}/is-starred`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // This ensures cookies are sent with the request
        body: JSON.stringify({ 
          isStarred: newStarStatus
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update star status');
      }
  
      const data = await response.json();
      
      if (data.success) {
        setStarredJobs((prev) => {
          const updatedStarred = new Set(prev);
          if (newStarStatus) {
            updatedStarred.add(jobId);
          } else {
            updatedStarred.delete(jobId);
          }
          return updatedStarred;
        });
  
        showNotification('Star status updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update star status');
      }
    } catch (error) {
      console.error('Star toggle error:', error);
      showNotification(error.message, 'error');
    }
  };



  const toggleJobSelection = (jobId) => {
    setSelectedJobs((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(jobId)) {
        newSelected.delete(jobId);
      } else {
        newSelected.add(jobId);
      }
      return newSelected;
    });
  };

  const toggleAllJobs = (event) => {
    if (event.target.checked) {
      const allJobIds = filteredJobs.map((job) => job._id);
      setSelectedJobs(new Set(allJobIds));
    } else {
      setSelectedJobs(new Set());
    }
  };

  const handleBulkAction = async (action) => {
    const selectedJobIds = Array.from(selectedJobs);
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('/api/jobs/delete-multiple', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // This ensures cookies are sent with the request
        body: JSON.stringify({ 
          jobIds: selectedJobIds,
          employerId: userId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} jobs`);
      }

      setJobs((prev) => prev.filter((job) => !selectedJobs.has(job._id)));
      setSelectedJobs(new Set());
      showNotification(`Selected jobs ${action}d successfully`);
    } catch (err) {
      console.error(`Bulk ${action} error:`, err);
      showNotification(err.message || `Failed to ${action} jobs`, 'error');
    }
  };
  const handleActionClick = async (jobId, action) => {
    switch (action) {
      case 'view':
        navigate(`/employers/view-job/${jobId}`);
        break;
      case 'edit':
        const jobToEdit = jobs.find(job => job._id === jobId);
        if (jobToEdit) {
          navigate(`/employers/edit-job/${jobId}`, {
            state: { jobData: jobToEdit }
          });
        }
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this job?')) {
          try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`/api/jobs/delete-job/${jobId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'  // This ensures cookies are sent with the request
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to delete job');
            }

            setJobs((prev) => prev.filter((job) => job._id !== jobId));
            showNotification('Job deleted successfully');
          } catch (err) {
            console.error('Delete error:', err);
            showNotification(err.message || 'Failed to delete job', 'error');
          }
        }
        break;
      default:
        break;
    }
    setActiveDropdown(null);
  };

  const handleRowClick = (jobId) => {
    navigate(`/employers/view-job/${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = selectedStatus === 'All' || job.jobStatus === selectedStatus;
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStarred = !showStarredOnly || starredJobs.has(job._id);
    const matchesDateRange = filters.dateRange === 'all' || 
      (filters.dateRange === 'week' && isWithinLastWeek(job.datePosted)) ||
      (filters.dateRange === 'month' && isWithinLastMonth(job.datePosted));
    const matchesCandidateCount = filters.candidateCount === 'all' ||
      (filters.candidateCount === 'low' && job.candidatesCount < 10) ||
      (filters.candidateCount === 'medium' && job.candidatesCount >= 10 && job.candidatesCount < 50) ||
      (filters.candidateCount === 'high' && job.candidatesCount >= 50);
    const matchesLocation = filters.location === 'all' || job.location === filters.location;

    return matchesStatus && matchesSearch && matchesStarred && 
           matchesDateRange && matchesCandidateCount && matchesLocation;
  });

  const isWithinLastWeek = (date) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(date) >= weekAgo;
  };

  const isWithinLastMonth = (date) => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(date) >= monthAgo;
  };

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Filters</h3>
          <button onClick={() => setShowFilters(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Date Posted</label>
            <select 
              className="w-full border rounded p-2"
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Candidate Count</label>
            <select 
              className="w-full border rounded p-2"
              value={filters.candidateCount}
              onChange={(e) => setFilters(prev => ({...prev, candidateCount: e.target.value}))}
            >
              <option value="all">All</option>
              <option value="low">&lt; 10 candidates</option>
              <option value="medium">10-50 candidates</option>
              <option value="high">&gt; 50 candidates</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Location</label>
            <select 
              className="w-full border rounded p-2"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
            >
              <option value="all">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button 
              className="px-4 py-2 border rounded"
              onClick={() => {
                setFilters({
                  dateRange: 'all',
                  candidateCount: 'all',
                  location: 'all'
                });
              }}
            >
              Reset
            </button>
            <button 
              className="px-4 py-2 bg-black text-white rounded"
              onClick={() => setShowFilters(false)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ActionsDropdown = ({ jobId }) => (
    <div 
      ref={dropdownRef}
      className="absolute mt-12 right-0 bg-white rounded-md shadow-lg  border"
      style={{ transform: 'translateY(-50%)' }}
    >
      <div className=" z-9999">
        <button
          className="w-full text-left px-2 py-2 hover:bg-gray-100"
          onClick={() => handleActionClick(jobId, 'view')}
        >
          <i className="bi bi-eye-fill"></i> {/* View icon */}
        </button>
        <button
          className="w-full text-left px-2 py-2 hover:bg-gray-100"
          onClick={() => handleActionClick(jobId, 'edit')}
        >
          <i className="bi bi-pencil-fill"></i> {/* Edit icon */}
        </button>
        <button
          className="w-full text-left px-2 py-2 hover:bg-gray-100 text-red-600"
          onClick={() => handleActionClick(jobId, 'delete')}
        >
          <i className="bi bi-trash-fill"></i> {/* Trashcan icon */}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className={`${
            notification.type === 'error' ? 'border-red-500' : 'border-green-500'
          }`}>
            <AlertDescription>
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <div className="flex flex-col">
          <div className="mb-4 font-bold text-lg">LOGO</div>
          <button
            className="flex items-center justify-between bg-black text-white px-4 py-2 rounded mb-4"
            onClick={handleAddJob}
          >
            <span>Create Jobs</span>
            <Plus className="h-4 w-4" />
          </button>
          <nav className="space-y-4">
            <button className="w-full text-left">Jobs</button>
            <button className="w-full text-left">Interviews</button>
            <button className="w-full text-left">Candidates</button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <div className="flex space-x-6">
            <button className="text-gray-500">Notifications</button>
            <button className="text-gray-500">Messages</button>
            <div className="w-10 h-10 bg-black rounded-full"></div>
          </div>
        </header>

        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            {jobStatuses.map((status) => (
              <button
                key={status}
                className={`px-4 py-2 border rounded ${selectedStatus === status ? 'bg-gray-200' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex space-x-2 items-center">
            <button
              className={`px-4 py-2 border rounded ${showStarredOnly ? 'bg-yellow-50' : ''}`}
              onClick={() => setShowStarredOnly(!showStarredOnly)}
            >
              <Star className={`h-5 w-5 ${showStarredOnly ? 'text-yellow-400' : 'text-gray-400'}`} />
            </button>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 border rounded px-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="border rounded px-4 py-2"
              onClick={() => setShowFilters(true)}
            >
              Filters
            </button>
          </div>
        </div>

        {selectedJobs.size > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-cetner justify-between">
            <span className="text-sm text-gray-600">
              {selectedJobs.size} {selectedJobs.size === 1 ? 'job' : 'jobs'} selected
            </span>
            <div className="space-x-2">
              
              <button
                className="px-4 py-2 border rounded-md flex items-center space-x-2 text-red-600 hover:bg-red-50"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg overflow-hidden shadow">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 w-12">
                  <input 
                    type="checkbox"
                    checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                    onChange={toggleAllJobs}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4">Job Title</th>
                <th className="text-left p-4">Candidates</th>
                <th className="text-left p-4">Date Posted</th>
                <th className="text-left p-4">Job Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
           
  <tbody>
    {loading ? (
      <tr>
        <td colSpan="6" className="text-center p-4">Loading...</td>
      </tr>
    ) : error ? (
      <tr>
        <td colSpan="6" className="text-center p-4 text-red-500">{error}</td>
      </tr>
    ) : filteredJobs.length === 0 ? (
      <tr>
        <td colSpan="6" className="text-center p-4">No jobs found</td>
      </tr>
    ) : (
      filteredJobs.map((job) => (
        <tr 
          key={job._id} 
          className="bg-white hover:bg-gray-50 cursor-pointer"
          onClick={() => handleRowClick(job._id)}
        >
          <td className="p-4" onClick={(e) => e.stopPropagation()}>
            <input 
              type="checkbox"
              checked={selectedJobs.has(job._id)}
              onChange={() => toggleJobSelection(job._id)}
              className="rounded border-gray-300"
            />
          </td>
          <td className="p-4">{job.jobTitle}</td>
          <td className="p-4">{job.candidatesCount || 'N/A'}</td>
          <td className="p-4">{new Date(job.datePosted).toLocaleDateString()}</td>
          <td className="p-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              job.jobStatus === 'Open' ? 'bg-green-100 text-green-800' :
              job.jobStatus === 'Closed' ? 'bg-red-100 text-red-800' :
              job.jobStatus === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.jobStatus}
            </span>
          </td>
          <td className="p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(job._id, starredJobs.has(job._id));
                }}
                className="mr-2"
              >
                <Star 
                  className={`h-5 w-5 ${starredJobs.has(job._id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === job._id ? null : job._id);
                }}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <MoreHorizontal className="h-5 w-5 cursor-pointer" />
              </button>
              {activeDropdown === job._id && <ActionsDropdown jobId={job._id} />}
            </div>
          </td>
        </tr>
      ))
    )}
  </tbody>
          </table>
        </div>
      </div>

      {showFilters && <FilterModal />}
    </div>
  );
};

export default ManageJobs;