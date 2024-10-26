import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './jobCard';
import NavSeeker from '../ui/navSeeker';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/job/jobseeker/all');
        setJobs(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div className="text-center py-10">Loading jobs...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <NavSeeker />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
      {jobs.length === 0 && (
        <p className="text-center text-gray-500">No jobs available at the moment.</p>
      )}
    </div>
  );
};

export default JobList;