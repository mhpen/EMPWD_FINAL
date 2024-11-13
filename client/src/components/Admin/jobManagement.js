import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, MoreVertical, Eye, Trash2, ArrowUpDown, Check, X, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import SidebarAdmin from './sideNavAdmin';



const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filtering and Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, selectedIndustries, selectedTypes, statusFilter, sortField, sortDirection, currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/jobs', {
        params: {
          jobTitle: searchQuery,
          industries: selectedIndustries.join(','),
          employmentType: selectedTypes.join(','),
          jobStatus: statusFilter === 'all' ? undefined : statusFilter, 
          sortField,
          sortDirection,
          page: currentPage,
        }
      });
      setJobs(response.data.data);
      setTotalPages(Math.ceil(response.data.total / response.data.perPage));
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      setActionLoading(true);
      await axios.delete(`/api/jobs/delete-job/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      setActionStatus({ type: 'success', message: 'Job deleted successfully' });
    } catch (err) {
      setActionStatus({ type: 'error', message: err.response?.data?.message || 'Error deleting job' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      setActionLoading(true);
      const response = await axios.patch(`/api/jobs/${jobId}/status`, { status: newStatus });
      setJobs(jobs.map(job => (job._id === jobId ? { ...job, jobStatus: response.data.data.jobStatus } : job)));
      setActionStatus({ type: 'success', message: 'Job status updated successfully' });
    } catch (err) {
      setActionStatus({ type: 'error', message: err.response?.data?.message || 'Error updating job status' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleIndustryToggle = (industry) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const SortIcon = ({ field }) => (
    <ArrowUpDown className={`w-4 h-4 ${
      sortField === field ? 'text-gray-900' : 'text-gray-400'
    }`} />
  );

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
       <SidebarAdmin/>
      <div className="p-4 sm:ml-64">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
          {/*<button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center">
           <Plus className="w-5 h-5 mr-2" />
            Add Job
          </button>*/}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4 rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {actionStatus && (
          <Alert 
            variant={actionStatus.type === 'success' ? 'default' : 'destructive'}
            className="mt-4 rounded-xl"
          >
            <AlertDescription>{actionStatus.message}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <button 
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  selectedTypes.includes('Full-time') 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleTypeToggle('Full-time')}
              >
                Full Time
              </button>
              <button 
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  selectedTypes.includes('Part-time')
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleTypeToggle('Part-time')}
              >
                Part Time
              </button>
              <button 
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  selectedTypes.includes('Contract')
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleTypeToggle('Contract')}
              >
                Contract
              </button>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  
                />
              </div>
              
              <select
                className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="text-left p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('jobTitle')}
                  >
                    <div className="flex items-center gap-2">
                      Job Title
                      <SortIcon field="jobTitle" />
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('jobLocation')}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      <SortIcon field="jobLocation" />
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('industry')}
                  >
                    <div className="flex items-center gap-2">
                      Industry
                      <SortIcon field="industry" />
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('employmentType')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      <SortIcon field="employmentType" />
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('jobStatus')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon field="jobStatus" />
                    </div>
                  </th>
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">
                        {job.jobTitle}
                      </td>
                      <td className="p-4 text-gray-700">{job.jobLocation}</td>
                      <td className="p-4 text-gray-700">{job.industry}</td>
                      <td className="p-4 capitalize text-gray-700">{job.employmentType}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          job.jobStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : job.jobStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : job.jobStatus === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.jobStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <button 
                            onClick={() => setOpenDropdownId(openDropdownId === job._id ? null : job._id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={actionLoading}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {openDropdownId === job._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-10">
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-xl transition-colors flex items-center"
                                onClick={() => {
                                  window.location.href = `/admin/jobs/${job._id}/review`;
                                  setOpenDropdownId(null);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Review Job
                              </button>
                              {job.jobStatus === 'pending' && (
                                <>
                                  <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-green-600"
                                    onClick={() => {
                                      handleStatusUpdate(job._id, 'active');
                                      setOpenDropdownId(null);
                                    }}
                                    disabled={actionLoading}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                  </button>
                                  <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-red-600"
                                    onClick={() => {
                                      handleStatusUpdate(job._id, 'declined');
                                      setOpenDropdownId(null);
                                    }}
                                    disabled={actionLoading}
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Decline
                                  </button>
                                </>
                              )}
                              {job.jobStatus === 'active' && (
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center"
                                  onClick={() => {
                                    handleStatusUpdate(job._id, 'closed');
                                    setOpenDropdownId(null);
                                  }}
                                  disabled={actionLoading}
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  Close Job
                                </button>
                              )}
                              <button 
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-xl transition-colors text-red-600 flex items-center"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this job?')) {
                                    handleDelete(job._id);
                                    setOpenDropdownId(null);
                                  }
                                }}
                                disabled={actionLoading}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Job
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
            <div className="flex justify-center items-center p-6 border-t">
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagement;