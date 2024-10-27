import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from "../ui/card.js";

const Header3 = () => {
  return (
    <div className="border-b border-gray-300 font-poppins ">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <i className="fas fa-cube text-2xl"></i>
            <span className="ml-2 text-xl font-semibold ">photo</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <span className="text-lg hidden sm:inline ">Notifications</span>
          
          <span className="text-lg hidden sm:inline ">Messages</span>

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
    <div className="min-h-screen bg-gray-50 ">
      <Header3 />
      <div className="max-w-4xl mx-auto p-8">
      
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
          <div className="flex items-center space-x-4">
            <Star 
              className={`h-6 w-6 ${job.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
            <button 
              onClick={handleEdit}
              className="bg-black text-white px-6 py-2 rounded-md"
            >
              EDIT
            </button>
          </div>
        </div>

        {/* Job Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">

              <div>
              <div className="w-24 h-24 bg-gray-300 flex-shrink-0"></div>
                <h1 className="text-2xl font-bold mb-2">{job.jobTitle || job.title}</h1>
                <p className="text-gray-600 mb-4">{job.location}</p>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm inline-block ${
                  job.jobStatus === 'Posted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.jobStatus || 'Posted'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Date Posted</p>
                <p>{new Date(job.datePosted || job.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiration Date</p>
                <p>{job.expirationDate ? new Date(job.expirationDate).toLocaleDateString() : 'Not specified'}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Job Description</h2>
              <p className="whitespace-pre-wrap text-gray-700">{job.description || job.jobDescription}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Applicants Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Applicants</p>
                  <p className="text-xl font-semibold">{job.totalApplicants || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Under Review</p>
                  <p className="text-xl font-semibold">{job.underReview || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shortlisted</p>
                  <p className="text-xl font-semibold">{job.shortlisted || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interviewed</p>
                  <p className="text-xl font-semibold">{job.interviewed || 0}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Performance</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Impressions</p>
                  <p className="text-xl font-semibold">{job.impression || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Clicks</p>
                  <p className="text-xl font-semibold">{job.clicks || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Applicants</p>
                  <p className="text-xl font-semibold">{job.totalApplicants || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">For Interview</p>
                  <p className="text-xl font-semibold">{job.forInterview || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewJob;
