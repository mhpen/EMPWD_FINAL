import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobBoard = () => {
  
  // Get the userId in local storage or state
  const userId = localStorage.getItem('userId'); 
  //const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  console.log("User ID:", userId);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    industries: [],
    employmentTypes: [],
    salaryRange: { minSalary: 0, maxSalary: 150000 },
  });

  const [filters, setFilters] = useState({
    jobTitle: '',
    location: '',
    industry: '',
    employmentType: '',
    salaryMin: '',
    salaryMax: '',
    status: 'Open',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10,
  });

  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    order: 'desc',
  });

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Remote',
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Services',
    'Entertainment',
    'Construction',
    'Other',
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const queryObj = {
        page: pagination.currentPage,
        limit: pagination.recordsPerPage,
        sortBy: sorting.sortBy,
        order: sorting.order,
        ...filters,
      };

      Object.keys(queryObj).forEach(key => !queryObj[key] && delete queryObj[key]);

      const queryParams = new URLSearchParams(queryObj);
      const response = await fetch(`/api/jobs?${queryParams}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch jobs');

      setJobs(data.data || []);
      setFilterOptions(data.filterOptions || {});
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage, sorting]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split('-');
    setSorting({ sortBy, order });
  };

  const clearFilters = () => {
    setFilters({
      jobTitle: '',
      location: '',
      industry: '',
      employmentType: '',
      salaryMin: '',
      salaryMax: '',
      status: 'Open',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl">LOGO</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600">Explore Jobs</a>
          <a href="#" className="text-gray-600">Explore Companies</a>
          <a href="#" className="text-gray-600">Resources</a>
        </nav>
        <div className="flex items-center space-x-2">
          <span>Roberto</span>
          <div className="w-8 h-8 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-2 bg-gray-100 p-2 rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter job title"
              className="pl-10 w-full p-2 bg-white rounded-md"
              value={filters.jobTitle}
              onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              className="pl-10 w-full p-2 bg-white rounded-md"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          <select
            className="p-2 bg-white rounded-md"
            value={`${sorting.sortBy}-${sorting.order}`}
            onChange={handleSortChange}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="jobTitle-asc">Title A-Z</option>
            <option value="jobTitle-desc">Title Z-A</option>
            <option value="salaryMax-desc">Highest Salary</option>
            <option value="salaryMin-asc">Lowest Salary</option>
          </select>
        </div>

        {/* Filter Options */}
        <div className="flex space-x-4 mt-4">
          <select
            className="p-2 bg-transparent outline-none text-gray-600"
            value={filters.industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
          >
            <option value="">Industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          <select
            className="p-2 bg-transparent outline-none text-gray-600"
            value={filters.employmentType}
            onChange={(e) => handleFilterChange('employmentType', e.target.value)}
          >
            <option value="">Employment Type</option>
            {employmentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="p-2 bg-transparent outline-none text-gray-600"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden mt-4">
          <button
            className="w-full p-2 bg-gray-100 rounded-md flex items-center justify-center gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showMobileFilters && (
            <div className="mt-4 space-y-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Range</label>
                <input
                  type="number"
                  placeholder="Min Salary"
                  className="w-full p-2 border rounded-md"
                  value={filters.salaryMin}
                  onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Salary"
                  className="w-full p-2 border rounded-md"
                  value={filters.salaryMax}
                  onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-gray-600">
          <span className="font-medium">TRUCK DRIVER</span>
          <span className="ml-2">{pagination.totalRecords} results</span>
        </div>
        <button
          onClick={clearFilters}
          className="text-blue-500 hover:text-blue-600"
        >
          Clear filters
        </button>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-gray-100 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium">{job.jobTitle}</h3>
                  <div className="text-gray-600">{job.company}</div>
                  <div className="text-gray-500">{job.location}</div>
                  {job.salaryMin && <div className="text-gray-600">${job.salaryMax}</div>}
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-600">SAVE</button>
                  <button className="text-gray-600">REPORT</button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{job.jobDescription}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="bg-black text-white px-6 py-2 rounded"
                >
                  VIEW
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          className="p-2 bg-gray-100 rounded-md disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          className="p-2 bg-gray-100 rounded-md disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default JobBoard;