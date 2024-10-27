import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Building2, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NavSeeker from '../ui/navSeeker';

const JobDetails = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) {
        setError('Job ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/jobs/${id}`);
        
        if (!response.ok) {
          const errorMessage = response.status === 404 ? 'Job not found' : 'Failed to fetch job details';
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setJob(data.data); // Adjust according to your API response structure
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = () => {
    navigate(`/jobs/${id}/apply`, { 
      state: { 
        jobId: id,
        jobTitle: job.jobTitle,
        company: job.company 
      } 
    });
  };
  const handleSaveJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      alert('Job saved successfully!');
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Jobs</span>
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-white">
      <NavSeeker />
      <div className="max-w-8xl mx-auto p-8  font-poppins ">
      <div className="w-full h-32 bg-green-200 rounded-xl mb-8">
      </div>
      <div className="relative flex justify-center  bg-gray-300 rounded-xl p-4 w-1/2 mx-auto -mt-16 text-[20px]">
          <input 
              type="text" 
              placeholder="Enter job title" 
              className="flex-grow bg-gray-300 outline-none text-black px-4"
          />
          <span className="mx-2 text-black">|</span>
          <input 
              type="text" 
              placeholder="Location" 
              className="flex-grow bg-gray-300 outline-none text-black px-4"
          />
      </div>

      <div className="max-w-8xl w-full mx-auto p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Jobs</span>
        </button>
      </div>

      <div className="bg-gray-100 rounded-lg mb-6">
        <div className=" flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{job.jobTitle}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2 className="h-4 w-4 mr-2" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleApply}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              APPLY NOW
            </button>
            <button 
              onClick={handleSaveJob}
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
            >
              SAVE JOB
            </button>
          </div>
        </div>
        
        {job.salaryMin && job.salaryMax && (
          <div className="mb-4">
            <h2 className="font-semibold mb-1">Salary Range</h2>
            <p className="text-gray-600">
              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} per year
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          {job.employmentType && (
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {job.employmentType}
            </span>
          )}
          {job.industry && (
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {job.industry}
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Job Description</h2>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{job.jobDescription}</p>
        </div>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <ul className="list-disc list-inside space-y-2">
            {job.requirements.map((requirement, index) => (
              <li key={index} className="text-gray-600">{requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {(job.companyDescription || job.companyWebsite) && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About {job.company}</h2>
          {job.companyDescription && (
            <p className="text-gray-600 mb-4">{job.companyDescription}</p>
          )}
          {job.companyWebsite && (
            <a
              href={job.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Visit Company Website
            </a>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default JobDetails;
