import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "../ui/card.js";
import NavEmployer from "../ui/navEmployer.js";

const Header3 = () => {
  return (
    <div className="border-b border-gray-300 font-poppins ">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <i className="fas fa-cube text-2xl"></i>
            <span className="ml-2 text-xl font-semibold">EmpowerPWD</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <span className="text-lg hidden sm:inline">Notifications</span>
          
          <span className="text-lg hidden sm:inline">Messages</span>

          <div className="flex items-center space-x-2">
            <span className="text-lg">Roberto</span>
            <div className="w-8 h-8 bg-gray-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching job details for ID:', jobId);
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const result = await response.json();
        console.log('Fetched job data:', result);
        setJob(result.data || result);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    } else {
      console.warn('Job ID is not defined');
    }
  }, [jobId]);

  const handleEdit = () => {
    navigate(`/employers/edit-job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center p-4">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Header3/>
      <div className="max-w-7xl mx-auto p-3">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center text-gray-600 hover:text-gray-900 border border-gray-500 border-2 hover:border-gray-900 p-2 rounded-xl"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
      </div>
      <div className="max-w-7xl mx-auto p-6 flex space-x-6 font-poppins">
        <div className="flex-1">
         <div className="flex mb- w-full justify-between ">
            <div className="flex">
              <div className="w-24 h-24 bg-gray-300 flex-shrink-0 flex "></div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold ">{job.jobTitle || job.title}</h1>
                <p className="text-gray-600">{job.companyName} {job.rating} Ratings</p>
              </div>
            </div>
          
            <div className="ml-4 flex ">
              <div className="text-gray-500 mr-2">{new Date(job.datePosted || job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <hr className="my-6  border-black" />
          <div className="mb-6">
            <h2 className="text-xl font-bold">Location</h2>
            <p className="mt-2 text-gray-700">{job.jobLocation}</p>
          </div>
          <hr className="my-6  border-black" />
          <div className="text-justify">
            <h2 className="text-xl font-bold">Job Description</h2>
            <p className="mt-2 text-gray-700 ">{job.description || job.jobDescription}</p>
          </div>
          <hr className="my-6  border-black" />
          <div>
            <div className="flex items-center mb-4 mt-6">
              <h1 className="text-2xl font-bold mr-4 ">Performance</h1>
              <div className="border-l-2 border-gray-300 h-6 mx-4"></div>
              <div className="flex space-x-2">
                <button className="bg-gray-300 px-4 py-2 rounded">All Time</button>
                <button className="bg-gray-300 px-4 py-2 rounded">Today</button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-300 p-4 rounded text-center">
                <p className="text-xl font-bold">{job.impression || 0}</p>
                <p>Impression</p>
              </div>
              <div className="bg-gray-300 p-4 rounded text-center">
                <p className="text-xl font-bold">{job.clicks || 0}</p>
                <p>Clicks</p>
              </div>
              <div className="bg-gray-300 p-4 rounded text-center">
                <p className="text-xl font-bold">{job.totalApplicants || 0}</p>
                <p>Applicants</p>
              </div>
              <div className="bg-gray-300 p-4 rounded text-center">
                <p className="text-xl font-bold">{job.forInterview || 0}</p>
                <p>For Interview</p>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-4">Applicants over time</h2>
            <div className="bg-gray-300 h-64 rounded"></div>
          </div>
        </div>
        <div className=" w-80 p-2">
          <div className="flex items-center justify-between mb-4">
          <Star  className={`h-10 w-10 ${job.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-black-400'} hover:fill-yellow-500 hover:text-yellow-500 transition-colors duration-200`} />

            <button onClick={() => navigate(`/employers/edit-job/${jobId}`)} className="bg-black text-white py-2 px-6 rounded-full w-full text-lg ml-4">EDIT</button>
          </div>
          <div className="mb-4 border border-black rounded-xl p-6">
            <h2 className="font-bold mb-2">Details</h2>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Status:</span>
              <span className="border border-black rounded-full px-3 py-1">{job.jobStatus || 'Posted'}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Date Uploaded:</span>
              <span className="ml-2">{new Date(job.datePosted || job.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium">Expiration Date:</span>
              <span className="ml-2">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not specified'}</span>
            </div>
          </div>
          <div className="border border-black rounded-xl p-6">
            <h2 className="font-bold mb-2">Applicants Summary</h2>
            <div className="ml-6">
              <div className="mb-2"><span className="font-medium">Total Applicants:</span> <span className="ml-2">{job.totalApplicants || 0}</span></div>
              <div className="mb-2"><span className="font-medium">Under Review:</span> <span className="ml-2">{job.underReview || 0}</span></div>
              <div className="mb-2"><span className="font-medium">Shortlisted:</span> <span className="ml-2">{job.shortlisted || 0}</span></div>
              <div><span className="font-medium">Interviewed:</span> <span className="ml-2">{job.interviewed || 0}</span></div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJob;
