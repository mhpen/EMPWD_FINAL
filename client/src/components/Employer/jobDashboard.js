// ManageJobs.jsx

import React, { useState, useEffect } from 'react';
import { Plus, Search, Star, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Open');
  const [filters, setFilters] = useState({
    jobTitle: '',
  });

  useEffect(() => {
    // Fetch jobs data from the server based on status and filters
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/jobs', {
          params: {
            status: selectedStatus,
            jobTitle: filters.jobTitle,
          },
        });
        setJobs(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [selectedStatus, filters]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleAddJob = () => {
    navigate('/employers/create-job');
  };

  return (
    <div className="flex h-screen">
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
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <div className="flex space-x-6">
            <button className="text-gray-500">Notifications</button>
            <button className="text-gray-500">Messages</button>
            <div className="w-10 h-10 bg-black rounded-full"></div>
          </div>
        </header>

        {/* Filters and Add Job Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            <button
              className={`px-4 py-2 border rounded ${selectedStatus === 'Open' ? 'bg-gray-200' : ''}`}
              onClick={() => handleStatusChange('Open')}
            >
              Open
            </button>
            <button
              className={`px-4 py-2 border rounded ${selectedStatus === 'Closed' ? 'bg-gray-200' : ''}`}
              onClick={() => handleStatusChange('Closed')}
            >
              Closed
            </button>
            <button
              className={`px-4 py-2 border rounded ${selectedStatus === 'Pending' ? 'bg-gray-200' : ''}`}
              onClick={() => handleStatusChange('Pending')}
            >
              Pending
            </button>
            <Star className="inline-block h-5 w-5" />
          </div>
          <div className="flex space-x-2 items-center">
            <input
              type="text"
              placeholder="Search"
              className="border rounded px-4 py-2"
              name="jobTitle"
              value={filters.jobTitle}
              onChange={handleFilterChange}
            />
            <button className="border rounded px-4 py-2">Filters</button>
          </div>
        </div>

        {/* Job Listing Table */}
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4">
                  <input type="checkbox" />
                </th>
                <th className="text-left p-4">Job Title</th>
                <th className="text-left p-4">Candidates</th>
                <th className="text-left p-4">Date Posted</th>
                <th className="text-left p-4">Job Status</th>
                <th className="text-left p-4"></th>
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
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">No jobs found</td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id} className="bg-white">
                    <td className="p-4">
                      <input type="checkbox" />
                    </td>
                    <td className="p-4">{job.jobTitle}</td>
                    <td className="p-4">{job.candidatesCount}</td>
                    <td className="p-4">{new Date(job.datePosted).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-4 py-2 border rounded">{job.jobStatus}</span>
                    </td>
                    <td className="p-4 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      <MoreHorizontal className="h-5 w-5 cursor-pointer" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
r