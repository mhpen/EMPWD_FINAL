import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobBoard = () => {
  // Get the userId from local storage
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

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
    setLoading(true);
    try {
      const queryObj = {
        page: pagination.currentPage,
        limit: pagination.recordsPerPage,
        sortBy: sorting.sortBy,
        order: sorting.order,
        ...filters,
      };

      Object.keys(queryObj).forEach((key) => !queryObj[key] && delete queryObj[key]);

      const queryParams = new URLSearchParams(queryObj);
      
      const response = await fetch(`/api/jobs/seeker/all?${queryParams}`, {
        method: 'GET',
        credentials: 'include', // This is crucial for sending cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        navigate('/login');
        return;
      }

      if (response.status === 403) {
        setError('You do not have permission to view jobs. Please ensure you are logged in as a job seeker.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      
      if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch jobs');
      }
      
      setJobs(data.data || []);
      setFilterOptions(data.filterOptions || {});
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Authentication')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage, sorting]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset pagination on clear
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
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
      </header>

      {/* Search Section */}
      <section className="mb-8">
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
            onClick={() => setShowMobileFilters((prev) => !prev)}
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
      </section>

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
          {jobs.map((job) => (
            <div key={job._id} className="p-4 border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
              <p className="text-gray-600">{job.location}</p>
              <p className="text-gray-600">{job.industry}</p>
              <p className="text-gray-600">{job.employmentType}</p>
              <p className="text-gray-600">Salary: ${job.salaryMin} - ${job.salaryMax}</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
          disabled={pagination.currentPage === 1}
          className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          <ChevronLeft />
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
          disabled={pagination.currentPage === pagination.totalPages}
          className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default JobBoard;
