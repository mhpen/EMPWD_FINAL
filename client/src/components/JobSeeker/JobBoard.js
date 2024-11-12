import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './jobCard';
import NavSeeker from '../ui/navSeeker.js';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/job/jobseeker/all');
        setJobs(response.data.data);
        setFilteredJobs(response.data.data);
        setLoading(false);
        
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.jobTitle.toLowerCase().includes(searchTitle.toLowerCase()) &&
      job.jobLocation.toLowerCase().includes(searchLocation.toLowerCase()) &&
      (industryFilter === '' || job.industry.includes(industryFilter)) && 
      (employmentTypeFilter === '' || job.employmentType === employmentTypeFilter) &&
      (statusFilter === '' || job.jobStatus === statusFilter)
    );

    setFilteredJobs(filtered);
  }, [jobs, searchTitle, searchLocation, industryFilter, employmentTypeFilter, statusFilter]);

  if (loading) return <div className="text-center py-10">Loading jobs...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">

      <NavSeeker />

      <div className="max-w-8xl w-full mx-auto p-8 ">
        {/* Search and filters */}
        <div className="flex flex-col items-center mb-8 transition-all duration-300 ease-in-out">
          <div className="w-full h-32 bg-gray-200 rounded-xl mb-4"></div>
          <div className="flex items-center bg-gray-300 rounded-xl p-4 w-3/4 -mt-16 text-lg shadow-md transition-all duration-300 ease-in-out">
            <input
              type="text"
              placeholder="Enter job title"
              className="flex-grow bg-gray-300 outline-none text-black px-4 focus:bg-gray-200 transition-colors duration-200 ease-in-out"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <span className="mx-2 text-black">|</span>
            <input
              type="text"
              placeholder="Location"
              className="flex-grow bg-gray-300 outline-none text-black px-4 focus:bg-gray-200 transition-colors duration-200 ease-in-out"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-4 gap-4 transition-all duration-300 ease-in-out">
            <select
              className="bg-gray-300 outline-none px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 ease-in-out"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">Industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail</option>
            </select>
            <select
              className="bg-gray-300 outline-none px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 ease-in-out"
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
            >
              <option value="">Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>

            </select>
            <select
              className="bg-gray-300 outline-none px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 ease-in-out"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Job listings */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium font-poppins text-2xl">Available Jobs</h3>
          <p>{filteredJobs.length} results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <JobCard key={job._id} job={job} index={index} />
          ))}
        </div>
        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500">No jobs available that match your search.</p>
        )}
      </div>
    </div>
  );
};

export default JobList;
