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


  // Filter 
  // const [searchTitle, setSearchTitle] = useState("");
  // const [searchLocation, setSearchLocation] = useState("");
  // const [sortBy, setSortBy] = useState("rating");

  // // Filter jobs based on search inputs
  // const filteredJobs = jobs.filter((job) => 
  //   job.title.toLowerCase().includes(searchTitle.toLowerCase()) && 
  //   job.location.toLowerCase().includes(searchLocation.toLowerCase())
  // );


  return (
    <div className="min-h-screen bg-white">
      
      <NavSeeker />
      <div className="max-w-8xl w-full mx-auto p-8">

        {/* Header -> yung may mga search */}
        <div>
          <div className="w-full h-32 bg-[#969292] rounded-xl mb-8">
          </div>
          <div className="flex justify-center bg-[#D9D9D9] rounded-xl p-2 w-1/2 mx-auto -mt-16 text-[20px]">
            <input 
              type="text" 
              placeholder="Enter job title" 
              className="flex-grow bg-[#D9D9D9] outline-none text-black px-4"
            />
            <span className="mx-2 text-black">|</span>
            <input 
              type="text" 
              placeholder="Location" 
              className="flex-grow bg-[#D9D9D9] outline-none text-black px-4"
            />

            
          </div>
          <div className="flex justify-center mt-2 text-[17px] gap-8 mr-96">
            {/* This should be clickable and functinal */}
            <p> Industry </p>
            <p> Employment Type </p>
            <p> Status </p> 
          </div>
        </div>

        {/* Others */}
        <hr className="border-t border-gray-300 mr-0 ml-0 mt-6 mb-4" />
        <div className="">
          {/*  This should be changed to functional */}
          <h3 className="font-medium font-poppins text-[36px]">Available Jobs</h3>
          <p> 5 results </p> 
        </div>
        
        <hr className="border-t border-gray-300 mr-0 ml-0 mt-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
        </div>
        {jobs.length === 0 && (
          <p className="text-center text-gray-500">No jobs available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default JobList;